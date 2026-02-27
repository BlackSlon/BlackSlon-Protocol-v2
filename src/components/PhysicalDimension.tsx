'use client'

import { MARKET_HISTORY } from '@/lib/market_history'

interface PhysicalDimensionProps {
  marketId: string
  currentPrice: number
}

export default function PhysicalDimension({ marketId, currentPrice }: PhysicalDimensionProps) {
  const history = MARKET_HISTORY[marketId] || []
  const last7Days = history.slice(-7).reverse().map(day => {
    // Wagi: Spot 10%, FM 40%, FQ 25%, Cal 25%
    const anchor = (day.spot / 10 * 0.1) + (day.fm / 10 * 0.4) + (day.fq / 10 * 0.25) + (day.cal / 10 * 0.25)
    return { date: day.date, anchor, min: anchor * 0.9, max: anchor * 1.1 }
  })

  return (
    <div className="flex flex-col h-full p-4 select-none bg-transparent space-y-4">
      <div className="text-[10px] text-gray-500 uppercase tracking-[0.5em] font-bold text-center py-2 border-b border-gray-900 bg-black/40 mb-4">
        <span>PHYSICAL MARKET DIMENSION</span>
      </div>

      <div className="text-center mb-4">
        <div className="text-[10px] font-black tracking-widest uppercase mb-1 text-red-600">BLACKSLON TRADING ZONE (BSTZ)</div>
      </div>

      <div className="flex flex-row items-start gap-6">
        {/* LEWA STRONA: 7D CORRIDOR HISTORY */}
        <div className="flex-[1.5] bg-gray-950/40 rounded-sm border border-gray-900 overflow-hidden shrink-0">
          <div className="grid grid-cols-12 text-[8px] text-gray-600 uppercase border-b border-gray-900 py-2 px-3 font-bold bg-black/60">
            <div className="col-span-3">Date</div>
            <div className="col-span-9 text-center">Zone Range & Anchor (●) [EUR/kWh]</div>
          </div>
          <div className="divide-y divide-gray-900/50">
            {last7Days.map((day, i) => {
              const prevAnchor = i < last7Days.length - 1 ? last7Days[i + 1].anchor : null;
              const anchorChange = prevAnchor ? ((day.anchor - prevAnchor) / prevAnchor * 100) : null;
              const isPositive = anchorChange !== null && anchorChange > 0;
              
              return (
                <div key={i} className={`grid grid-cols-12 py-2.5 px-3 items-center hover:bg-gray-900/40 font-mono text-[10px] ${i === 0 ? 'bg-yellow-500/5 border-l-2 border-yellow-500' : ''}`}>
                  <div className={`col-span-3 ${i === 0 ? 'text-yellow-500 font-bold' : 'text-gray-500'}`}>{day.date}</div>
                  <div className="col-span-9 flex items-center justify-between">
                    <div className="flex items-center gap-2 w-20">
                      <div className="group relative">
                        <div className={`w-2 h-2 ${anchorChange !== null ? (isPositive ? 'bg-green-600' : 'bg-red-600') : 'bg-red-600'} rounded-full shadow-[0_0_12px_rgba(34,197,94,0.9)] cursor-pointer`} />
                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-black border border-gray-700 rounded text-[8px] text-white whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                          Anchor: {day.anchor.toFixed(2)}
                        </div>
                      </div>
                      <span className="text-[10px] font-mono font-bold text-white">{day.anchor.toFixed(2)}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-[10px] font-mono font-bold text-green-500">{day.min.toFixed(2)}</span>
                      <span className="text-[10px] font-mono font-bold text-green-500">{day.max.toFixed(2)}</span>
                    </div>
                    {anchorChange !== null && (
                      <div className={`text-[10px] font-bold ${isPositive ? 'text-green-500' : 'text-red-500'}`}>
                        {isPositive ? '↑' : '↓'}{Math.abs(anchorChange).toFixed(1)}%
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  )
}