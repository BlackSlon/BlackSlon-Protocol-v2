'use client'

import React from 'react'
import { getMarketData } from '@/data/markets'
import { getMarketColors } from '@/lib/marketColors'

interface Props {
  selectedMarketId?: string
}

export default function PhysicalDimension({ selectedMarketId = 'BS-P-PL' }: Props) {
  const colors = getMarketColors(selectedMarketId)
  const marketData = getMarketData(selectedMarketId as any) as any

  // Resolve BSSZ data — handle both old format (BS-P-PL) and new format (BS-G-NL)
  let bsszPositions: any[] = []
  let currentAnchor = 0
  let currentFloor = 0
  let currentCeiling = 0
  let isLocked = false

  if (marketData?.bsszPositions?.length > 0) {
    // New format: BS-G-NL etc.
    bsszPositions = marketData.bsszPositions
    currentAnchor = marketData.bsszPositions[0].bssz.anchor
    currentFloor = marketData.bsszPositions[0].bssz.floor
    currentCeiling = marketData.bsszPositions[0].bssz.ceiling
  } else if (marketData?.bsszCalculation) {
    // Old format: BS-P-PL
    currentAnchor = marketData.bsszCalculation.anchor
    currentFloor = marketData.bsszCalculation.floor
    currentCeiling = marketData.bsszCalculation.ceiling
    // Create synthetic BSSZ positions from historicalData
    if (marketData.historicalData?.length > 0) {
      const labels = ['D-1','D-2','D-3','D-4','D-5','D-6','D-7','W-1','M-1','Q-1','H-1','Y-1']
      bsszPositions = marketData.historicalData.slice(0, labels.length).map((d: any, i: number, arr: any[]) => ({
        label: labels[i],
        refDate: d.date,
        bssz: {
          anchor: d.price,
          floor: parseFloat((d.price * 0.90).toFixed(2)),
          ceiling: parseFloat((d.price * 1.20).toFixed(2)),
          trendPct: i < arr.length - 1
            ? parseFloat(((d.price - arr[i + 1].price) / arr[i + 1].price * 100).toFixed(2))
            : null,
        },
      }))
    }
  }

  const today = new Date().toLocaleDateString('pl-PL', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  })

  return (
    <div className="flex flex-col h-full bg-black font-mono text-white p-0">

      {/* ── Header ── */}
      <div className="w-full pt-1 pb-1 flex flex-col items-center shrink-0">
        <div className="text-[10px] text-gray-500 uppercase tracking-[0.5em] font-bold">
          Physical Market Panel
        </div>
        <div className="w-[80%] border-b border-gray-800 mt-2" />
      </div>

      <div className="flex-grow px-6 pb-6 flex flex-col min-h-0">

        {/* ── Section title ── */}
        <div className="pt-2 pb-1 bg-gradient-to-b from-black to-gray-950 w-full">
          <div className={`text-[10px] tracking-widest font-bold mb-1 text-center ${colors.title}`}>
            BlackSlon Settlement Zone (BSSZ)
          </div>
        </div>

        {/* ── BSSZ Corridor — today's values ── */}
        <div className={`mb-3 px-2 py-2 border rounded-sm ${isLocked ? 'border-red-500/60 bg-red-900/10' : colors.border}`}>
          <div className="flex justify-between items-center mb-1">
            <div className={`text-[6px] uppercase tracking-widest ${colors.title}`}>
              Valid today · {today}
            </div>
            <div className="text-[6px] text-gray-600 tracking-widest">EUR / 100kWh</div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex flex-col items-center">
              <span className="text-[7px] text-gray-500 uppercase mb-0">Floor (−10%)</span>
              <span className={`text-sm leading-tight font-normal ${colors.value}`}>
                {currentFloor.toFixed(2)}
              </span>
            </div>

            <div className="text-gray-800 text-[10px]">——</div>

            <div className="flex flex-col items-center">
              <span className="text-[7px] text-gray-500 uppercase mb-0">Anchor (a)</span>
              <span className="text-sm text-gray-300 leading-tight font-normal">
                {currentAnchor.toFixed(2)}
              </span>
              <span className="text-[6px] text-gray-700 uppercase tracking-widest mt-0.5">
                Physical Meridian
              </span>
            </div>

            <div className="text-gray-800 text-[10px]">——</div>

            <div className="flex flex-col items-center">
              <span className="text-[7px] text-gray-500 uppercase mb-0">Ceiling (+20%)</span>
              <span className={`text-sm leading-tight font-normal ${colors.value}`}>
                {currentCeiling.toFixed(2)}
              </span>
            </div>
          </div>
        </div>

        {/* ── Historical anchor table ── */}
        <div className="flex-grow overflow-hidden">
          <div className="grid grid-cols-12 text-[9px] uppercase pb-1 border-b border-gray-900 mb-2">
            <div className="col-span-2 text-gray-400 font-bold">Ref</div>
            <div className="col-span-2 text-gray-400 font-bold">Date</div>
            <div className="col-span-2 text-center text-gray-500 font-bold">Floor</div>
            <div className="col-span-2 text-center text-gray-600 font-normal">Anchor</div>
            <div className="col-span-2 text-center text-gray-500 font-bold">Ceiling</div>
            <div className="col-span-2 text-right text-gray-500 font-bold">Trend</div>
          </div>

          <div className="space-y-1">
            {bsszPositions.map((position) => {
              const trendPct = position.bssz.trendPct
              return (
                <div key={position.label} className="grid grid-cols-12 items-center py-0.5 border-b border-gray-900/30">
                  <div className="col-span-2 text-[11px] text-gray-400">
                    {position.label}
                  </div>
                  <div className="col-span-2 text-[7px] text-gray-600">
                    {position.refDate}
                  </div>
                  <div className="col-span-2 text-[11px] text-gray-500 text-center">
                    {position.bssz.floor.toFixed(2)}
                  </div>
                  <div className="col-span-2 text-[11px] text-gray-600 text-center">
                    {position.bssz.anchor.toFixed(2)}
                  </div>
                  <div className="col-span-2 text-[11px] text-gray-500 text-center">
                    {position.bssz.ceiling.toFixed(2)}
                  </div>
                  <div className={`col-span-2 text-[11px] text-right ${
                    trendPct === null ? 'text-gray-700' : trendPct >= 0 ? 'text-green-700' : 'text-red-600'
                  }`}>
                    {trendPct === null ? '—' : `${trendPct >= 0 ? '▲' : '▼'} ${Math.abs(trendPct).toFixed(1)}%`}
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* ── Anchor Drivers ── */}
        <div className="px-6 py-4 border-t border-gray-800 bg-black">
          <div className="flex items-center gap-3 mb-3">
            <div className={`text-[10px] tracking-widest font-bold ${colors.title}`}>
              Anchor Drivers
            </div>
            <span className={`text-[10px] uppercase tracking-widest ${colors.label}`}>
              {selectedMarketId}
            </span>
            <span className="text-[8px] text-gray-700 ml-auto">
              Active
            </span>
          </div>
          <div className="text-[8px] text-gray-600 mb-2 text-center">
            VALID TODAY
          </div>
          <div className="flex justify-between items-center font-mono overflow-hidden">
            {[
              { label: 'D-1', value: currentAnchor, changePct: 4.2 },
              { label: 'W-1', value: currentAnchor * 1.012, changePct: 3.1 },
              { label: 'M-1', value: currentAnchor * 1.024, changePct: 2.4 },
              { label: 'Q-1', value: currentAnchor * 1.034, changePct: 1.8 },
              { label: 'H-1', value: currentAnchor * 1.041, changePct: 1.2 },
              { label: 'Y-1', value: currentAnchor * 0.933, changePct: -6.7 },
            ].map((driver, i) => (
              <div
                key={driver.label}
                className={`flex flex-col items-center text-center flex-shrink-0 ${
                  i > 0 && i < 6
                    ? 'border-r border-gray-900 px-4'
                    : ''
                }`}
              >
                <span className="text-[8px] text-gray-500">{driver.label}</span>
                <span className="text-[9px] text-gray-400">
                  {driver.value.toFixed(2)}
                </span>
                <span className={`text-[8px] ${driver.changePct >= 0 ? 'text-green-700' : 'text-red-600'}`}>
                  {driver.changePct >= 0 ? '+' : ''}{driver.changePct.toFixed(1)}%
                </span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  )
}
