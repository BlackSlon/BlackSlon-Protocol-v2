'use client'

import { MARKET_HISTORY } from '@/lib/market_history'

interface PhysicalDimensionProps {
  marketId: string
  currentPrice: number
}

export default function PhysicalDimension({ marketId, currentPrice }: PhysicalDimensionProps) {
  const history = MARKET_HISTORY[marketId] || []
  const last7Days = history.slice(-7).reverse().map(day => {
    const anchor = (day.spot / 10 * 0.1) + (day.fm / 10 * 0.4) + (day.fq / 10 * 0.25) + (day.cal / 10 * 0.25)
    return { date: day.date, anchor, min: anchor * 0.9, max: anchor * 1.1 }
  })

  return (
    <div className="space-y-4">
      <div className="flex flex-col mb-4">
        <span className="text-[11px] text-red-600 font-black tracking-widest uppercase mb-1">PHYSICAL DIMENSION</span>
        <span className="text-[13px] text-yellow-500 font-bold uppercase tracking-[0.2em]">BlackSlon Trading Zone (BSTZ)</span>
      </div>
      {/* Tutaj reszta kodu korytarza poziomego... */}
    </div>
  )
}