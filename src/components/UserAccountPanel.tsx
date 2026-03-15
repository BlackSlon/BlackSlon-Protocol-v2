'use client'

import React, { useState, useEffect } from 'react'
import { useUserAccount } from '@/store/blackslon'
import WalletConnect from '@/components/WalletConnect'

// ─── Ecosystem Solvency Tiers (H_solv) ──────────────────────────────────────
// Source: Ecosystem-Solvency-Macro.md
// Tier I:   H_solv > 1.15  → Expansion
// Tier II:  H_solv 1.05–1.15 → Equilibrium
// Tier III: H_solv 1.00–1.05 → Mitigation
// Tier IV:  H_solv < 1.00  → Safeguard
const SOLVENCY_TIERS = [
  { tier: 'I',   label: 'Expansion',   min: 1.15, color: '#22c55e', glow: 'rgba(34,197,94,0.4)',   bg: 'rgba(34,197,94,0.06)',   border: 'rgba(34,197,94,0.3)'   },
  { tier: 'II',  label: 'Equilibrium', min: 1.05, color: '#38bdf8', glow: 'rgba(56,189,248,0.4)',  bg: 'rgba(56,189,248,0.06)',  border: 'rgba(56,189,248,0.3)'  },
  { tier: 'III', label: 'Mitigation',  min: 1.00, color: '#b45309', glow: 'rgba(180,83,9,0.4)',    bg: 'rgba(180,83,9,0.06)',    border: 'rgba(180,83,9,0.3)'    },
  { tier: 'IV',  label: 'Safeguard',   min: 0,    color: '#ef4444', glow: 'rgba(239,68,68,0.4)',   bg: 'rgba(239,68,68,0.06)',   border: 'rgba(239,68,68,0.3)'   },
] as const

// H_solv is a ratio (typically 1.0–1.5+), normalize to 0–100% for progress bar
// Display range: 0.90 (critical) → 1.30 (ultra-solvent) mapped to 0–100%
const H_SOLV_MIN_DISPLAY = 0.90
const H_SOLV_MAX_DISPLAY = 1.30

function getSolvencyTier(hSolv: number) {
  return SOLVENCY_TIERS.find((t) => hSolv >= t.min) ?? SOLVENCY_TIERS[3]
}

function hSolvToPercent(hSolv: number): number {
  const pct = ((hSolv - H_SOLV_MIN_DISPLAY) / (H_SOLV_MAX_DISPLAY - H_SOLV_MIN_DISPLAY)) * 100
  return Math.min(100, Math.max(0, pct))
}

// ─── H-Factor (H_BSSZ) Health Zones ─────────────────────────────────────────
// Source: Risk-Management-Micro.md
// H > 1.10  → SAFE       (Green)  — full operational access
// 1.05–1.10 → WARNING    (Yellow) — margin call notification
// 1.00–1.05 → RESTRICTED (Orange) — reduce-only mode
// H ≤ 1.00  → INTERVENTION (Red)  — smart liquidation triggered
function getHealthZone(h: number): { label: string; color: string; description: string } {
  if (h > 1.10) return { label: 'SAFE',         color: '#22c55e', description: 'Full operational access' }
  if (h > 1.05) return { label: 'WARNING',       color: '#eab308', description: 'Add collateral — margin call' }
  if (h > 1.00) return { label: 'RESTRICTED',    color: '#f97316', description: 'Reduce-only mode active' }
  return             { label: 'INTERVENTION',    color: '#ef4444', description: 'Smart liquidation triggered' }
}

const fmt = (n: number) =>
  n.toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
    .replace(/\u202f/g, ' ')
    .replace(/,/g, '.')

export default function UserAccountPanel() {
  const {
    user,
    inventory,
    vault,
    solvency,
    hFactor,
    bsrEuroRate,
    setWalletConnected,
    checkLiquidation,
    convertTokens,
  } = useUserAccount()

  const [convertAmount, setConvertAmount] = useState('')
  const [convertDirection, setConvertDirection] = useState<'BSR_TO_EURO' | 'EURO_TO_BSR'>('BSR_TO_EURO')
  const [convertError, setConvertError] = useState<string | null>(null)
  const [convertSuccess, setConvertSuccess] = useState(false)
  const [liquidationRisk, setLiquidationRisk] = useState<boolean | null>(null)
  const [checking, setChecking] = useState(false)

  // H_solv from store (ratio, e.g. 1.18, 1.07, 0.98)
  const hSolv: number = (solvency as any).hSolv ?? solvency
  const activeTier = getSolvencyTier(hSolv)
  const solvPct = Math.round(hSolvToPercent(hSolv))

  const healthZone = getHealthZone(hFactor)

  const totalBSRinEUR = user.bsrBalance * bsrEuroRate
  const totalBalance = user.eEuroBalance + totalBSRinEUR
  const totalLockedEUR = vault.lockedBSR * bsrEuroRate + vault.lockedEuro

  const shortAddress = user.walletAddress
    ? `${user.walletAddress.slice(0, 6)}…${user.walletAddress.slice(-4)}`
    : '─────────────'

  const handleLiquidationCheck = async () => {
    setChecking(true)
    try {
      const risk = await checkLiquidation()
      setLiquidationRisk(risk)
    } finally {
      setChecking(false)
    }
  }

  return (
    <div className="flex flex-col h-full bg-black font-mono text-white p-0 overflow-hidden">

      {/* ── Header ── */}
      <div className="w-full pt-1 pb-1 flex flex-col items-center shrink-0">
        <div className="text-[10px] text-gray-500 uppercase tracking-[0.5em] font-bold">
          User's Account Panel
        </div>
        <div className="w-[85%] border-b border-gray-800 mt-2" />
      </div>

      {/* ── Scrollable body ── */}
      <div className="flex-grow overflow-y-auto px-6 pb-4 flex flex-col space-y-3 min-h-0">

        {/* ── Section: Available Liquidity & Vault ── */}
        <div className="pt-3">
          <div className="grid grid-cols-2 gap-4 mb-2">
            <div className="text-[10px] tracking-widest text-amber-700 font-bold text-center">
              Available Liquidity
            </div>
            <div className="text-[10px] tracking-widest text-amber-700 font-bold text-center">
              BlackSlon Vault
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <div className="border border-amber-700 rounded-sm py-1 px-3 w-fit">
              <div className="text-[7px] text-amber-700 uppercase tracking-widest mb-0">€BSR Balance</div>
              <div className="text-[11px] text-amber-700 leading-tight font-normal">{fmt(user.bsrBalance)}</div>
            </div>
            <div className="border border-blue-600 rounded-sm py-1 px-3 w-fit">
              <div className="text-[7px] text-blue-600 uppercase tracking-widest mb-0"><span className="normal-case">e</span>EURO Balance</div>
              <div className="text-[11px] text-blue-600 leading-tight font-normal">{fmt(user.eEuroBalance)}</div>
            </div>
            <div className="border border-amber-700 rounded-sm py-1 px-3 w-fit">
              <div className="text-[7px] text-amber-700 uppercase tracking-widest mb-0">Locked €BSR</div>
              <div className="text-[11px] text-amber-700 tracking-tighter leading-tight">{fmt(vault.lockedBSR)}</div>
            </div>
            <div className="border border-blue-600 rounded-sm py-1 px-3 w-fit">
              <div className="text-[7px] text-blue-600 uppercase tracking-widest mb-0">Locked <span className="normal-case">e</span>EURO</div>
              <div className="text-[11px] text-blue-600 tracking-tighter leading-tight">{fmt(vault.lockedEuro)}</div>
            </div>
          </div>
        </div>

        {/* ── Section: Portfolio ── */}
        <div>
          <div className="text-[10px] tracking-widest text-amber-700 font-bold mb-1 text-center">
            BlackSlon Tokens Portfolio
          </div>
          <div className="grid grid-cols-6 text-[7px] text-gray-500 uppercase px-2 py-1 border-b border-gray-900">
            <div className="tracking-widest">Token</div>
            <div className="text-center tracking-widest">Units</div>
            <div className="text-center tracking-widest normal-case">Vol (kWh)</div>
            <div className="text-center tracking-widest">Avg P.</div>
            <div className="text-center tracking-widest">BSEI</div>
            <div className="text-right tracking-widest">PnL (EUR)</div>
          </div>
          {inventory.map((item) => (
            <div
              key={item.token}
              className="grid grid-cols-6 items-center py-1 px-2 border-b border-gray-900/50 hover:bg-gray-900/40 transition-colors"
            >
              <div className={`text-[10px] ${
                item.token.startsWith('BS-G') ? 'text-blue-500' : 'text-yellow-500'
              }`}>{item.token}</div>
              <div className="text-center text-[11px] text-gray-400">{item.units}</div>
              <div className="text-center text-[11px] text-gray-400">{item.quantity.toLocaleString('fr-FR').replace(/\u202f/g, ' ')}</div>
              <div className="text-center text-[11px] text-gray-400">{item.avgPrice.toFixed(2)}</div>
              <div className="text-center text-[11px] text-gray-400">{item.lastPrice.toFixed(2)}</div>
              <div className={`text-right text-[11px] ${item.pnl >= 0 ? 'text-green-700' : 'text-red-600'}`}>
                {item.pnl >= 0 ? '+' : ''}{item.pnl.toFixed(2)}
              </div>
            </div>
          ))}
        </div>

        {/* ── Section: User's Portfolio Risk Management ── */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <div className="text-[10px] tracking-widest text-amber-700 font-bold">
              User's Portfolio Risk Management
            </div>
            <span className="text-[7px] text-gray-500 uppercase tracking-widest">(User Level)</span>
          </div>

          {/* H_BSSZ value + zone */}
          <div className="flex justify-between items-center mb-2">
            <div>
              <div className="text-[8px] text-gray-600 uppercase tracking-widest mb-0.5">
                H-Factor (H<sub>BSSZ</sub>)
              </div>
              <div className="text-sm font-black tracking-tighter" style={{ color: healthZone.color }}>
                {hFactor.toFixed(3)}
              </div>
            </div>
            <div className="text-right">
              <div className="text-[8px] text-gray-600 uppercase tracking-widest mb-0.5">Health Zone</div>
              <div
                className={`text-[11px] font-black tracking-widest ${
                  healthZone.label === 'SAFE' ? 'animate-none' : 'animate-pulse'
                }`}
                style={{ color: healthZone.color }}
              >
                {healthZone.label}
              </div>
            </div>
          </div>

          {/* Progress bar - mapped from H_BSSZ range 0.90–1.30 */}
          <div className="flex justify-between text-[7px] text-gray-500 mb-0.5">
            <span>0.90</span>
            <span className="text-gray-800">|1.00</span>
            <span className="text-gray-800">|1.05</span>
            <span className="text-gray-800">|1.10</span>
            <span>1.30</span>
          </div>
          <div className="w-full h-1 rounded-full overflow-hidden bg-gray-900 border border-gray-800">
            <div
              className="h-full rounded-full transition-all duration-1000 ease-out"
              style={{
                width: `${Math.min(100, Math.max(0, ((hFactor - 0.90) / (1.30 - 0.90)) * 100))}%`,
                background: healthZone.color,
                boxShadow: `0 0 8px ${healthZone.color}`,
              }}
            />
          </div>

          {/* Zone labels below bar */}
          <div className="grid grid-cols-4 gap-0.5 mt-1">
            {[
              { zone: 'INTERVENTION', threshold: '≤ 1.00', color: '#ef4444' },
              { zone: 'RESTRICTED',   threshold: '> 1.00', color: '#f97316' },
              { zone: 'WARNING',      threshold: '> 1.05', color: '#eab308' },
              { zone: 'SAFE',         threshold: '> 1.10', color: '#22c55e' },
            ].map((z) => (
              <div
                key={z.zone}
                className="text-center px-1 py-0.5 rounded-sm border"
                style={{
                  borderColor: healthZone.label === z.zone ? z.color : 'rgba(55,65,81,0.4)',
                  background: healthZone.label === z.zone ? `${z.color}15` : 'transparent',
                }}
              >
                <div className="text-[6px] uppercase tracking-widest" style={{ color: z.color }}>
                  {z.zone}
                </div>
                <div className="text-[6px] text-gray-500">{z.threshold}</div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Section: Ecosystem Solvency (Protocol Level) ── */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <div className="text-[10px] tracking-widest text-amber-700 font-bold">
              Ecosystem Solvency Engine
            </div>
            <span className="text-[7px] text-gray-500 uppercase tracking-widest">(Protocol Level)</span>
          </div>

          {/* H_solv value + tier */}
          <div className="flex justify-between items-center mb-2">
            <div>
              <div className="text-[8px] text-gray-600 uppercase tracking-widest mb-0.5">
                H<sub>solv</sub> Index
              </div>
              <div className="text-sm font-black tracking-tighter" style={{ color: activeTier.color }}>
                {hSolv.toFixed(3)}
              </div>
            </div>
            <div className="text-right">
              <div className="text-[8px] text-gray-600 uppercase tracking-widest mb-0.5">Solvency Tier</div>
              <div className="text-[11px] font-black tracking-widest" style={{ color: activeTier.color }}>
                Tier {activeTier.tier} — {activeTier.label}
              </div>
            </div>
          </div>

          {/* Progress bar — mapped from H_solv range 0.90–1.30 */}
          <div className="flex justify-between text-[7px] text-gray-500 mb-0.5">
            <span>0.90</span>
            <span className="text-gray-800">|1.00</span>
            <span className="text-gray-800">|1.05</span>
            <span className="text-gray-800">|1.15</span>
            <span>1.30</span>
          </div>
          <div className="w-full h-1 rounded-full overflow-hidden bg-gray-900 border border-gray-800">
            <div
              className="h-full rounded-full transition-all duration-1000 ease-out"
              style={{
                width: `${solvPct}%`,
                background: `linear-gradient(90deg, ${activeTier.color}80, ${activeTier.color})`,
                boxShadow: `0 0 8px ${activeTier.glow}`,
              }}
            />
          </div>
          <div className="text-right text-[7px] mt-0.5" style={{ color: activeTier.color + '99' }}>
            {activeTier.tier === 'I'
              ? 'Ultra-solvent — all operations permitted'
              : 'eEURO-only collateral required'}
          </div>

        </div>

        {/* ── Section: BSR Reserve & Exchange ── */}
        <div>
          <div className="text-[10px] tracking-widest text-amber-700 font-bold mb-1 text-left">
            €BSR/eEURO Portal
          </div>
          <div className="border border-gray-900 rounded-sm px-3 py-1.5">
            {/* Live rate */}
            <div className="flex items-center gap-2 mb-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-amber-700 animate-pulse shrink-0" />
              <span className="text-[8px] text-amber-700 uppercase tracking-widest">LIVE</span>
              <span className="text-[11px] text-amber-700 tracking-tighter">1 €BSR</span>
              <span className="text-[11px] text-gray-600">=</span>
              <span className="text-[11px] text-blue-600 tracking-tighter">{bsrEuroRate.toFixed(2)} eEURO</span>
            </div>
            {/* Exchange row */}
            <div className="flex gap-1.5 items-center">
              <input
                type="number"
                placeholder="0.00"
                value={convertAmount}
                onChange={(e) => {
                  setConvertAmount(e.target.value)
                  setConvertError(null)
                  setConvertSuccess(false)
                }}
                className="bg-zinc-900 border border-gray-800 text-[10px] text-gray-300 text-center outline-none w-16 py-0.5 rounded-sm [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              />
              <button
                onClick={() => setConvertDirection(d => d === 'BSR_TO_EURO' ? 'EURO_TO_BSR' : 'BSR_TO_EURO')}
                className="text-[8px] text-gray-500 hover:text-gray-300 transition-colors px-1 py-0.5 border border-gray-800 rounded-sm"
              >
                {convertDirection === 'BSR_TO_EURO' ? '€BSR → eEURO' : 'eEURO → €BSR'}
              </button>
              <span className="text-[8px] text-gray-600">
                Receive: <span className={convertDirection === 'BSR_TO_EURO' ? 'text-blue-600' : 'text-amber-700'}>
                  {convertAmount && !isNaN(parseFloat(convertAmount))
                    ? convertDirection === 'BSR_TO_EURO'
                      ? `${(parseFloat(convertAmount) * bsrEuroRate).toFixed(2)} eEURO`
                      : `${(parseFloat(convertAmount) / bsrEuroRate).toFixed(2)} €BSR`
                    : convertDirection === 'BSR_TO_EURO' ? '0.00 eEURO' : '0.00 €BSR'}
                </span>
              </span>
              <button
                onClick={() => {
                  setConvertError(null)
                  setConvertSuccess(false)
                  const amount = parseFloat(convertAmount)
                  if (isNaN(amount) || amount <= 0) return
                  const error = convertTokens(convertDirection, amount)
                  if (!error) {
                    setConvertSuccess(true)
                    setConvertAmount('')
                    setTimeout(() => setConvertSuccess(false), 1500)
                  } else {
                    setConvertError(error)
                  }
                }}
                className={`ml-auto px-2 py-0.5 text-[7px] uppercase tracking-widest border transition-all rounded-sm ${
                  convertDirection === 'BSR_TO_EURO'
                    ? 'border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-black'
                    : 'border-amber-700 text-amber-700 hover:bg-amber-700 hover:text-black'
                }`}
              >
                CONVERT
              </button>
              {convertSuccess && <span className="text-[7px] text-green-700">✓</span>}
            </div>
            {convertError && (
              <div className="text-[7px] text-red-600 mt-1">{convertError}</div>
            )}
          </div>
        </div>

        {/* ── Section: Wallet Connection ── */}
        <div>
          <WalletConnect />
        </div>

      </div>
    </div>
  )
}
