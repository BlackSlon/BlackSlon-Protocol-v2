import { NextRequest, NextResponse } from 'next/server'

interface WalletEntry {
  email: string
  timestamp: string
  verified: boolean
  ip?: string
  userAgent?: string
}

interface OtpEntry {
  email: string
  code: string
  expires: number
}

// ── Storage layer: in-memory (works everywhere incl. serverless) ──────────────
// On Vercel / serverless the filesystem is read-only, so fs.writeFileSync
// would throw → "Server error".  In-memory maps are sufficient because
// OTPs are short-lived (15 min) and the email list is only for demo/prototype.
// For persistence across cold starts, swap this with a real DB (e.g. Neon).
const memDb: WalletEntry[] = []
const memOtps: OtpEntry[] = []

// Try to seed from disk on first load (works in dev, no-op in serverless)
let seeded = false
function seedFromDisk() {
  if (seeded) return
  seeded = true
  try {
    const fs = require('fs')
    const path = require('path')
    const DB_PATH = path.join(process.cwd(), 'data', 'wallet_emails.json')
    const OTP_PATH = path.join(process.cwd(), 'data', 'wallet_otps.json')
    if (fs.existsSync(DB_PATH)) {
      const data = JSON.parse(fs.readFileSync(DB_PATH, 'utf-8'))
      if (Array.isArray(data)) memDb.push(...data)
    }
    if (fs.existsSync(OTP_PATH)) {
      const data = JSON.parse(fs.readFileSync(OTP_PATH, 'utf-8'))
      if (Array.isArray(data)) memOtps.push(...data)
    }
  } catch { /* serverless — ignore */ }
}

function persistToDisk() {
  try {
    const fs = require('fs')
    const path = require('path')
    const dir = path.join(process.cwd(), 'data')
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true })
    fs.writeFileSync(path.join(dir, 'wallet_emails.json'), JSON.stringify(memDb, null, 2), 'utf-8')
    fs.writeFileSync(path.join(dir, 'wallet_otps.json'), JSON.stringify(memOtps, null, 2), 'utf-8')
  } catch { /* serverless — ignore */ }
}

function readDb(): WalletEntry[] {
  seedFromDisk()
  return memDb
}

function readOtps(): OtpEntry[] {
  seedFromDisk()
  // Purge expired
  for (let i = memOtps.length - 1; i >= 0; i--) {
    if (memOtps[i].expires <= Date.now()) memOtps.splice(i, 1)
  }
  return memOtps
}

function generateOtp(): string {
  return Math.floor(100000 + Math.random() * 900000).toString()
}

// POST — register email, send OTP
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()

    // ── Verify OTP ──────────────────────────────────────────────────────────
    if (body.action === 'verify') {
      const { email, code } = body
      if (!email || !code) return NextResponse.json({ error: 'Missing fields' }, { status: 400 })
      const normalizedEmail = email.toLowerCase().trim()

      // Strategy 1: check in-memory (works when same lambda handles both requests)
      let matched = false
      const otps = readOtps().filter(o => o.expires > Date.now())
      const memMatch = otps.find(o => o.email === normalizedEmail && o.code === code)
      if (memMatch) matched = true

      // Strategy 2: cookie-based fallback (works across different lambdas on Vercel)
      if (!matched) {
        const cookieVal = req.cookies.get('bs_otp')?.value
        if (cookieVal) {
          const [cEmail, cCode] = cookieVal.split(':')
          if (cEmail === normalizedEmail && cCode === code) matched = true
        }
      }

      if (!matched) return NextResponse.json({ error: 'Invalid or expired code' }, { status: 400 })

      // Mark email as verified in DB
      const entries = readDb()
      const idx = entries.findIndex(e => e.email === normalizedEmail)
      if (idx >= 0) entries[idx].verified = true
      // Remove used OTP from memory
      for (let i = memOtps.length - 1; i >= 0; i--) {
        if (memOtps[i].email === normalizedEmail) memOtps.splice(i, 1)
      }
      persistToDisk()
      const resp = NextResponse.json({ ok: true })
      resp.cookies.delete('bs_otp')
      return resp
    }

    // ── Register & send OTP ─────────────────────────────────────────────────
    const { email } = body
    if (!email || typeof email !== 'string' || !email.includes('@') || !email.includes('.')) {
      return NextResponse.json({ error: 'Invalid email' }, { status: 400 })
    }
    const normalEmail = email.toLowerCase().trim()

    // Upsert into DB (in-memory)
    const entries = readDb()
    if (!entries.find(e => e.email === normalEmail)) {
      memDb.push({
        email: normalEmail,
        timestamp: new Date().toISOString(),
        verified: false,
        ip: req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || undefined,
        userAgent: req.headers.get('user-agent') || undefined,
      })
    }

    const code = generateOtp()
    const expires = Date.now() + 15 * 60 * 1000 // 15 minutes
    // Remove old OTPs for this email
    for (let i = memOtps.length - 1; i >= 0; i--) {
      if (memOtps[i].email === normalEmail) memOtps.splice(i, 1)
    }
    memOtps.push({ email: normalEmail, code, expires })
    persistToDisk()

    // Send email via Resend
    const resendKey = process.env.RESEND_API_KEY
    const fromEmail = process.env.RESEND_FROM_EMAIL || 'noreply@blackslon.org'
    
    if (!resendKey) {
      console.error('[BlackSlon Wallet] RESEND_API_KEY not configured')
      return NextResponse.json({ error: 'Email service not configured' }, { status: 500 })
    }

    const { Resend } = await import('resend')
    const resend = new Resend(resendKey)

    console.log(`[BlackSlon Wallet] Sending OTP to ${normalEmail} from ${fromEmail}`)

    const { data, error: resendError } = await resend.emails.send({
      from: `BlackSlon <${fromEmail}>`,
      to: normalEmail,
      subject: 'Your BlackSlon Wallet verification code',
      html: `
        <div style="background:#000;color:#fff;font-family:monospace;padding:40px;max-width:480px;">
          <div style="color:#b45309;font-size:18px;font-weight:bold;letter-spacing:4px;margin-bottom:24px;">BlackSlon</div>
          <div style="color:#9ca3af;font-size:12px;margin-bottom:16px;">Your wallet verification code:</div>
          <div style="color:#fff;font-size:36px;font-weight:bold;letter-spacing:12px;padding:16px;border:1px solid #374151;text-align:center;margin-bottom:24px;">${code}</div>
          <div style="color:#6b7280;font-size:11px;">This code expires in 15 minutes. Do not share it with anyone.</div>
        </div>
      `,
    })

    if (resendError) {
      console.error('[BlackSlon Wallet] Resend error:', JSON.stringify(resendError))
      return NextResponse.json({ error: 'Failed to send verification email' }, { status: 500 })
    }

    console.log('[BlackSlon Wallet] Email sent successfully, id:', data?.id)

    // Set HttpOnly cookie for cross-lambda verification on Vercel
    const resp = NextResponse.json({ ok: true })
    resp.cookies.set('bs_otp', `${normalEmail}:${code}`, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 900, // 15 min
      path: '/api/wallet',
      sameSite: 'strict',
    })
    return resp
  } catch (err) {
    console.error('[BlackSlon Wallet] Error:', err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}

// GET — list all registered emails (admin)
export async function GET() {
  const entries = readDb()
  return NextResponse.json({ count: entries.length, entries })
}
