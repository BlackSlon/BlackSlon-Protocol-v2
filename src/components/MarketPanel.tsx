'use client'

import { useParams } from 'next/navigation'
import { useEffect } from 'react'
import PhysicalMarketPanel from './PhysicalMarketPanel'
import VirtualMarketPanel from './VirtualMarketPanel'
import TradingPanel from './TradingPanel'
import UserAccountPanel from './UserAccountPanel'
import { useMarketPanel } from '@/store/blackslon'
import type { MarketId } from '@/store/types'

// ─── Ecosystem Solvency Tier UI config ───────────────────────────────────────
// Source: Ecosystem-Solvency-Macro.md
// Labels match the protocol specification exactly
const TIER_CONFIG = {
  I:   { label: 'Tier I — Expansion',    color: 'text-green-700',  dot: 'bg-green-700' },
  II:  { label: 'Tier II — Equilibrium', color: 'text-yellow-500', dot: 'bg-yellow-500' },
  III: { label: 'Tier III — Mitigation', color: 'text-amber-500',  dot: 'bg-amber-500' },
  IV:  { label: 'Tier IV — Safeguard',   color: 'text-red-500',    dot: 'bg-red-500' },
}

export default function MarketPanel() {
  const params = useParams()
  const urlMarketId = (params?.id as string) || 'BS-P-PL'

  const {
    currentPrice,
    activeMarketId,
    setMarketId,
    solvency,
    bsrReserve,
  } = useMarketPanel()

  useEffect(() => {
    const normalized = urlMarketId.replace('IPT', 'BS') as MarketId
    if (normalized !== activeMarketId) {
      setMarketId(normalized)
    }
  }, [urlMarketId])

  const tier = TIER_CONFIG[solvency.tier]

  return (
    <div className="flex flex-col h-full p-6 select-none bg-black/20 sm:p-4">

      {/* ── Top bar ── */}
      <div className="flex items-center justify-between py-2 border-b border-gray-900 bg-black/40 mb-4 px-2">
        <span className="text-[10px] text-gray-500 uppercase tracking-[0.5em] font-bold">
          MARKET CONTROL PANEL
        </span>

        {/* Protocol status indicators */}
        <div className="flex items-center gap-4">

          {/* Ecosystem Solvency Tier */}
          <div className="flex items-center gap-1.5">
            <div className={`w-1.5 h-1.5 rounded-full ${tier.dot} ${solvency.tier !== 'I' ? 'animate-pulse' : ''}`} />
            <span className={`text-[8px] uppercase tracking-widest ${tier.color}`}>
              {tier.label}
            </span>
          </div>

          {/* BSR-SR Fuse */}
          {bsrReserve.fuseState !== 'INACTIVE' && (
            <div className="flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
              <span className="text-[8px] uppercase tracking-widest text-red-500">
                BSR-SR {bsrReserve.fuseState} FUSE
              </span>
            </div>
          )}

          {/* Emergency Collateral Lock */}
          {solvency.emergencyCollateralLock && (
            <div className="flex items-center gap-1.5">
              <span className="text-[8px] uppercase tracking-widest text-red-500 animate-pulse">
                🔒 COLLATERAL LOCK
              </span>
            </div>
          )}

          {/* Tier IV hard stop banner */}
          {solvency.tier === 'IV' && (
            <div className="text-[8px] uppercase tracking-widest text-red-500 border border-red-500/40 px-2 py-0.5 animate-pulse">
              REDUCE-ONLY MODE
            </div>
          )}
        </div>
      </div>

      {/* ── 4-panel grid ── */}
      <div className="flex-grow grid grid-cols-[22%_26%_20%_28%] divide-x divide-gray-900 mb-4 overflow-hidden">
        <div className="overflow-y-auto no-scrollbar">
          <PhysicalMarketPanel />
        </div>
        <div className="overflow-y-auto no-scrollbar">
          <VirtualMarketPanel />
        </div>
        <div className="overflow-y-auto no-scrollbar">
          <TradingPanel />
        </div>
        <div className="overflow-y-auto no-scrollbar">
          <UserAccountPanel />
        </div>
      </div>

      {/* ── BSEI Price Index footer ── */}
      <div className="bg-[#0d1117] border border-gray-800/50 p-4 rounded-sm mt-auto shrink-0">
        <div className="flex justify-between items-center mb-1">
          <span className="text-[11px] text-gray-400 uppercase font-bold tracking-widest italic">
            Live Synthesis Output
          </span>
          <div className="flex items-center gap-3">
            <span className="text-[8px] text-cyan-400 font-mono animate-pulse uppercase">
              ADR Protocol Active
            </span>
            {/* H_solv live value */}
            <span className="text-[8px] text-gray-600 uppercase tracking-widest">
              H<sub>solv</sub>:{' '}
              <span className={tier.color}>{solvency.hSolv.toFixed(3)}</span>
            </span>
            {/* P_BSR live */}
            <span className="text-[8px] text-gray-600 uppercase tracking-widest">
              €BSR:{' '}
              <span className="text-amber-700">{bsrReserve.pBsr.toFixed(4)}</span>
            </span>
          </div>
        </div>

        <div className="flex justify-between items-baseline">
          <div className="flex flex-col gap-0.5">
            {/* BSEI — BlackSlon Energy Index (not BSTZ) */}
            <span className="text-[11px] text-gray-500 font-bold tracking-tighter uppercase">
              BSEI PRICE INDEX · {activeMarketId}
            </span>
            <span className="text-[8px] text-gray-700 font-mono">
              BSSZ corridor displayed in Physical Panel · ω = 0.80
            </span>
          </div>

          <span className="text-3xl font-bold text-yellow-500 font-mono tracking-tighter">
            {currentPrice.toFixed(2)}{' '}
            <span className="text-[12px] text-gray-600 ml-1 font-sans">EUR/100kWh</span>
          </span>
        </div>
      </div>
    </div>
  )
}
