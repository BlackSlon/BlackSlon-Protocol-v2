'use client'
import React from 'react'

export default function PhysicalDimension({ marketId, currentPrice }: { marketId: string, currentPrice: number }) {
  const history = [
    { label: 'D-1', date: '27.02.2026', min: 9.05, max: 11.05, anchor: 9.95, change: 1.50 },
    { label: 'W-1', date: '21.02.2026', min: 8.80, max: 10.80, anchor: 9.80, change: 3.10 },
    { label: 'M-1', date: '28.01.2026', min: 8.50, max: 10.50, anchor: 9.50, change: 6.30 },
    { label: 'Q-1', date: '28.11.2025', min: 8.00, max: 10.00, anchor: 9.00, change: 12.20 },
  ]

  return (
    <div className="flex flex-col h-full p-4 select-none bg-transparent font-mono">
      <div className="text-[10px] text-gray-500 uppercase tracking-[0.5em] font-bold text-center py-2 border-b border-gray-900 bg-black/40 mb-4">
        <span>PHYSICAL MARKET DIMENSION</span>
      </div>

      <div className="mb-6 p-4 border border-yellow-500/40 bg-yellow-500/5 rounded-sm">
        <div className="text-[10px] text-yellow-500 font-bold tracking-widest uppercase italic mb-3">ACTIVE BSTZ</div>
        <div className="flex items-baseline justify-between">
          <span className="text-2xl font-black text-yellow-500">9.09</span>
          <span className="text-lg font-bold text-green-500">{currentPrice.toFixed(2)}</span>
          <span className="text-2xl font-black text-yellow-500">11.11</span>
        </div>
      </div>

      <div className="flex-grow overflow-hidden">
        <div className="grid grid-cols-12 text-[9px] text-gray-600 font-bold uppercase pb-1 border-b border-gray-900 mb-2">
          <div className="col-span-3">Ref</div>
          <div className="col-span-3 text-center">Min</div>
          <div className="col-span-3 text-center">Anchor</div>
          <div className="col-span-3 text-center">Max</div>
        </div>
        {history.map((row) => (
          <div key={row.label} className="grid grid-cols-12 items-center py-2 border-b border-gray-900/30 text-[11px]">
            <div className="col-span-3 font-bold text-gray-400">{row.label}</div>
            <div className="col-span-3 text-center text-gray-500">{row.min.toFixed(2)}</div>
            <div className="col-span-3 text-center text-gray-300 font-bold">{row.anchor.toFixed(2)}</div>
            <div className="col-span-3 text-center text-gray-500">{row.max.toFixed(2)}</div>
          </div>
        ))}
      </div>
    </div>
  )
}