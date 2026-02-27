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
            <div className="col-span-9 text-center">Zone Range & Anchor (●)</div>
          </div>
          <div className="divide-y divide-gray-900/50">
            {last7Days.map((day, i) => (
              <div key={i} className="grid grid-cols-12 py-2.5 px-3 items-center hover:bg-gray-900/40 font-mono text-[10px]">
                <div className="col-span-3 text-gray-500">{day.date}</div>
                <div className="col-span-9 flex items-center justify-between">
                  <span className="text-green-500/60 w-8">{day.min.toFixed(2)}</span>
                  <div className="flex-grow h-[4px] bg-gray-900 relative mx-3 rounded-full border border-gray-800">
                     <div className="absolute inset-y-0 left-1/4 right-1/4 bg-yellow-500/10 border-x border-yellow-500/30"></div>
                     <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-red-600 rounded-full shadow-[0_0_12px_rgba(220,38,38,0.9)]" />
                  </div>
                  <span className="text-green-500 w-8 text-right">{day.max.toFixed(2)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* PRAWA STRONA: SYNTHESIS FORMULA */}
        <div className="flex-1 space-y-3 pt-1">
          <span className="text-[9px] text-blue-500 font-bold uppercase tracking-widest block border-b border-gray-900 pb-2">Synthesis Formula: 10/40/25/25</span>
          <div className="space-y-2">
            {[
              { label: 'SPOT (BSEI)', w: 10, v: currentPrice },
              { label: 'FRONT MONTH', w: 40, v: currentPrice + 0.36 },
              { label: 'QUARTER (FQ)', w: 25, v: currentPrice + 0.73 },
              { label: 'CALENDAR (CAL)', w: 25, v: currentPrice + 1.06 }
            ].map((item, i) => (
              <div key={i} className="flex justify-between items-center text-[10px] border-b border-gray-900/30 pb-1.5 text-white">
                <span className="text-gray-500 font-bold uppercase">{item.label} <span className="text-[8px] font-normal">({item.w}%)</span></span>
                <span className="font-mono">{item.v.toFixed(2)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}