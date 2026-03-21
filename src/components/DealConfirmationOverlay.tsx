'use client'

import { useEffect } from 'react'
import { useDealConfirmation } from '@/store/blackslon'

export default function DealConfirmationOverlay() {
  const { deal, clearDeal } = useDealConfirmation()

  useEffect(() => {
    if (deal) {
      const timer = setTimeout(() => clearDeal(), 3500)
      return () => clearTimeout(timer)
    }
  }, [deal, clearDeal])

  if (!deal) return null

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center pointer-events-none">
      <div className="pointer-events-auto bg-black/95 border-2 rounded-sm px-8 py-6 text-center font-mono animate-pulse shadow-2xl"
        style={{
          borderColor: deal.side === 'BUY' ? '#15803d' : '#dc2626',
          boxShadow: `0 0 40px ${deal.side === 'BUY' ? 'rgba(21,128,61,0.3)' : 'rgba(220,38,38,0.3)'}`,
        }}
      >
        <div className="text-4xl mb-3">🤝</div>
        <div className={`text-xl font-black tracking-[0.3em] uppercase mb-2 ${
          deal.side === 'BUY' ? 'text-green-600' : 'text-red-500'
        }`}>
          DEAL DONE!
        </div>
        <div className="text-[11px] text-gray-400 uppercase tracking-widest mb-1">
          {deal.side} {deal.filledQty} units @ {deal.price.toFixed(2)} EUR
        </div>
        <div className="text-[10px] text-gray-400 uppercase tracking-widest">
          {deal.marketId} · {deal.filledQty * 100} kWh
        </div>
        {deal.remainingQty > 0 && (
          <div className="text-[9px] text-gray-500 mt-2 uppercase tracking-widest">
            + {deal.remainingQty} units resting in order book
          </div>
        )}
      </div>
    </div>
  )
}
