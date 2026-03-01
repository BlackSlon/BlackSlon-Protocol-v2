'use client'
import React from 'react'

export default function PhysicalDimension({ marketId, currentPrice }: { marketId: string, currentPrice: number }) {
  const history = [
    { label: 'D-1', date: '27.02.2026', min: 9.05, max: 11.05, anchor: 9.95, trend: '+6.0%', change: 6.0 },
    { label: 'W-1', date: '21.02.2026', min: 8.80, max: 10.80, anchor: 9.80, trend: '+7.5%', change: 7.5 },
    { label: 'M-1', date: '28.01.2026', min: 7.92, max: 9.68, anchor: 8.80, trend: '+16.9%', change: 16.9 },
    { label: 'Q-1', date: '28.11.2025', min: 8.00, max: 10.00, anchor: 9.00, trend: '+15.0%', change: 15.0 },
    { label: 'H-1', date: '28.08.2025', min: 7.50, max: 9.50, anchor: 8.50, trend: '+19.7%', change: 19.7 },
    { label: 'Y-1', date: '28.02.2025', min: 7.00, max: 9.00, anchor: 8.00, trend: '+24.5%', change: 24.5 },
  ]

  return (
    <div className="flex flex-col h-full p-4 select-none bg-transparent font-mono text-white">
      {/* NAGŁÓWEK SEKCI */}
      <div className="text-[10px] text-gray-500 uppercase tracking-[0.5em] font-bold text-center py-2 border-b border-gray-900 bg-black/40 mb-4">
        <span>PHYSICAL MARKET DIMENSION</span>
      </div>

      {/* TYTUŁ: BlackSlon Power Poland (BS-P-PL) */}
      <div className="text-center mb-4">
        <div className="text-[11px] tracking-[0.1em] text-red-600">
          BlackSlon Power Poland <span className="uppercase">(BS-P-PL)</span>
        </div>
      </div>

      {/* ACTIVE BSTZ SEKCYJA */}
      <div className="mb-3 p-3 border border-yellow-500/40 bg-yellow-500/5 rounded-sm">
        <div className="text-[10px] text-yellow-500 tracking-widest uppercase italic mb-2 text-center">
          ACTIVE BSTZ
        </div>
        <div className="flex flex-col">
          <span className="text-[8px] text-gray-600 mb-2 uppercase italic text-center">
            RANGE in EUR/100kWh
          </span>
          <div className="flex items-center justify-between px-2">
            {/* Żółte wartości są teraz wyraźnie większe i ważniejsze (text-xl) */}
            <div className="flex flex-col items-center">
              <span className="text-[7px] text-gray-500 uppercase mb-0">Min</span>
              <span className="text-xl text-yellow-500">9.09</span>
            </div>
            
            {/* Zielony Anchor znacznie zmniejszony (text-sm) i schowany niżej */}
            <div className="flex flex-col items-center opacity-80">
              <span className="text-[7px] text-gray-500 uppercase mb-0">Anchor</span>
              <span className="text-sm text-green-500">{currentPrice.toFixed(2)}</span>
            </div>

            <div className="flex flex-col items-center">
              <span className="text-[7px] text-gray-500 uppercase mb-0">Max</span>
              <span className="text-xl text-yellow-500">11.11</span>
            </div>
          </div>
        </div>
      </div>

      {/* TABELA HISTORYCZNA */}
      <div className="flex-grow overflow-hidden">
        <div className="grid grid-cols-12 text-[9px] text-gray-600 font-bold uppercase pb-1 border-b border-gray-900 mb-2">
          <div className="col-span-3">Ref / Date</div>
          <div className="col-span-2 text-center">Min</div>
          <div className="col-span-2 text-center font-bold text-gray-400">Anchor</div>
          <div className="col-span-2 text-center">Max</div>
          <div className="col-span-3 text-right">Trend</div>
        </div>

        <div className="space-y-3">
          {history.map((row) => (
            <div key={row.label} className="grid grid-cols-12 items-center py-1 border-b border-gray-900/30">
              <div className="col-span-3 flex flex-col">
                <span className="text-[11px] font-bold text-gray-400">{row.label}</span>
                <span className="text-[8px] text-gray-200 leading-tight">{row.date}</span>
              </div>
              <div className="col-span-2 text-[11px] text-gray-500 text-center">{row.min.toFixed(2)}</div>
              <div className="col-span-2 text-[11px] text-gray-300 text-center font-bold">{row.anchor.toFixed(2)}</div>
              <div className="col-span-2 text-[11px] text-gray-500 text-center">{row.max.toFixed(2)}</div>
              <div className={`col-span-3 text-[11px] text-right font-black ${row.change >= 0 ? 'text-green-700' : 'text-red-700'}`}>
                {row.change >= 0 ? '▲' : '▼'} {row.trend}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-6 pt-2 border-t border-gray-900 text-[8px] text-gray-700 text-center tracking-widest uppercase">
        BSTZ Protocol · ADR Stabilization Active
      </div>
    </div>
  )
}