'use client'

import { useState } from 'react'
import { useUserAccount } from '@/store/blackslon'

type WalletStep = 'idle' | 'email' | 'otp' | 'activating' | 'connected'

export default function WalletConnect() {
  const { user, activateWallet, disconnectWallet } = useUserAccount()
  const [step, setStep] = useState<WalletStep>(user.walletConnected ? 'connected' : 'idle')
  const [email, setEmail] = useState('')
  const [otp, setOtp] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const handleSendOtp = async () => {
    if (!email || !email.includes('@') || !email.includes('.')) {
      setError('Enter a valid email address')
      return
    }
    setError(null)
    setLoading(true)
    try {
      const res = await fetch('/api/wallet', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })
      const data = await res.json()
      if (!res.ok) { setError(data.error || 'Error sending code'); setLoading(false); return }
      setStep('otp')
    } catch {
      setError('Network error — try again')
    }
    setLoading(false)
  }

  const handleVerifyOtp = async () => {
    if (otp.length !== 6) { setError('Enter the 6-digit code'); return }
    setError(null)
    setLoading(true)
    try {
      const res = await fetch('/api/wallet', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'verify', email, code: otp }),
      })
      const data = await res.json()
      if (!res.ok) { setError(data.error || 'Invalid code'); setLoading(false); return }
      setStep('activating')
      setTimeout(() => {
        activateWallet(email)
        setStep('connected')
      }, 1500)
    } catch {
      setError('Network error — try again')
    }
    setLoading(false)
  }

  const handleDisconnect = () => {
    disconnectWallet()
    setStep('idle')
    setEmail('')
    setOtp('')
    setError(null)
  }

  const closeModal = () => { setStep('idle'); setError(null) }

  // Connected state
  if (user.walletConnected || step === 'connected') {
    return (
      <div className="border border-gray-800 rounded-sm p-2">
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-[9px] text-green-500 font-bold tracking-wider">BLACKSLON WALLET</span>
          </div>
          <button onClick={handleDisconnect} className="text-[7px] text-gray-400 hover:text-red-500 uppercase tracking-widest transition-colors">
            Disconnect
          </button>
        </div>
        <div className="text-[8px] text-gray-500">
          {user.walletAddress?.slice(0, 6)}...{user.walletAddress?.slice(-4)}
        </div>
        {user.walletEmail && (
          <div className="text-[7px] text-gray-400 mt-0.5">{user.walletEmail}</div>
        )}
      </div>
    )
  }

  return (
    <div className="space-y-2">
      {step === 'idle' && (
        <button
          onClick={() => setStep('email')}
          className="w-full text-[9px] py-2 border border-gray-700 bg-gray-900 text-gray-400 hover:border-amber-700 hover:text-amber-600 transition-all rounded-sm uppercase tracking-widest"
        >
          Connect Wallet
        </button>
      )}

      {/* ── Email input modal ── */}
      {step === 'email' && (
        <div className="fixed inset-0 bg-black/85 flex items-center justify-center z-50">
          <div className="bg-black border border-gray-800 rounded-sm p-5 w-80">
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-amber-700 flex items-center justify-center">
                  <span className="text-black text-[8px] font-black">BS</span>
                </div>
                <h3 className="text-[11px] text-gray-300 font-bold tracking-wider">BlackSlon Wallet</h3>
              </div>
              <button onClick={closeModal} className="text-gray-500 hover:text-gray-300 text-[16px]">×</button>
            </div>
            <div className="text-[8px] text-gray-500 mb-3">
              Enter your email. A 6-digit verification code will be sent to confirm your identity.
            </div>
            <input
              type="email"
              value={email}
              onChange={e => { setEmail(e.target.value); setError(null) }}
              placeholder="your@email.com"
              autoFocus
              className="w-full bg-gray-900 border border-gray-700 rounded-sm px-3 py-2 text-[10px] text-white placeholder-gray-600 outline-none focus:border-amber-700 transition-colors mb-2"
              onKeyDown={e => e.key === 'Enter' && handleSendOtp()}
            />
            {error && <div className="text-[8px] text-red-500 mb-2">{error}</div>}
            <button
              onClick={handleSendOtp}
              disabled={loading}
              className="w-full py-2 border border-amber-700 text-amber-600 text-[9px] uppercase tracking-widest rounded-sm hover:bg-amber-700 hover:text-black transition-all disabled:opacity-50"
            >
              {loading ? 'Sending...' : 'Send Verification Code'}
            </button>
          </div>
        </div>
      )}

      {/* ── OTP verification modal ── */}
      {step === 'otp' && (
        <div className="fixed inset-0 bg-black/85 flex items-center justify-center z-50">
          <div className="bg-black border border-gray-800 rounded-sm p-5 w-80">
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-amber-700 flex items-center justify-center">
                  <span className="text-black text-[8px] font-black">BS</span>
                </div>
                <h3 className="text-[11px] text-gray-300 font-bold tracking-wider">BlackSlon Wallet</h3>
              </div>
              <button onClick={closeModal} className="text-gray-500 hover:text-gray-300 text-[16px]">×</button>
            </div>
            <div className="text-center mb-4">
              <div className="text-[10px] text-green-500 mb-1">✓ Code sent</div>
              <div className="text-[9px] text-amber-600 font-bold">{email}</div>
            </div>
            <div className="text-[8px] text-gray-500 mb-3 text-center">
              Check your inbox and enter the 6-digit code below.
            </div>
            <input
              type="text"
              value={otp}
              onChange={e => { setOtp(e.target.value.replace(/\D/g, '').slice(0, 6)); setError(null) }}
              placeholder="_ _ _ _ _ _"
              maxLength={6}
              autoFocus
              className="w-full bg-gray-900 border border-gray-700 rounded-sm px-3 py-2 text-[16px] text-white text-center tracking-[0.5em] placeholder-gray-700 outline-none focus:border-amber-700 transition-colors mb-2"
              onKeyDown={e => e.key === 'Enter' && handleVerifyOtp()}
            />
            {error && <div className="text-[8px] text-red-500 mb-2 text-center">{error}</div>}
            <button
              onClick={handleVerifyOtp}
              disabled={loading || otp.length !== 6}
              className="w-full py-2 border border-green-700 text-green-600 text-[9px] uppercase tracking-widest rounded-sm hover:bg-green-700 hover:text-black transition-all disabled:opacity-30 font-bold"
            >
              {loading ? 'Verifying...' : 'Verify & Activate Wallet'}
            </button>
            <button
              onClick={() => { setStep('email'); setOtp(''); setError(null) }}
              className="w-full mt-2 py-1.5 text-[8px] text-gray-400 hover:text-gray-200 uppercase tracking-widest transition-colors"
            >
              ← Back
            </button>
          </div>
        </div>
      )}

      {/* ── Activating animation ── */}
      {step === 'activating' && (
        <div className="fixed inset-0 bg-black/85 flex items-center justify-center z-50">
          <div className="bg-black border border-gray-800 rounded-sm p-5 w-80 text-center">
            <div className="text-[10px] text-amber-600 animate-pulse tracking-widest mb-2">ACTIVATING WALLET...</div>
            <div className="text-[8px] text-gray-500">Verifying your identity</div>
            <div className="text-[8px] text-gray-500 mt-1">Crediting 1,000 €BSR to your balance</div>
          </div>
        </div>
      )}
    </div>
  )
}
