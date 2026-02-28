'use client'

interface PhysicalDimensionProps {
  marketId: string
  currentPrice: number
}

export default function PhysicalDimension({ marketId, currentPrice }: PhysicalDimensionProps) {
  // Dane historyczne - szare, trend kolorowy
  const history = [
    { label: 'D-1', date: '27.02', min: 9.05, max: 11.05, anchor: 9.95, change: 1.5 },
    { label: 'W-1', date: '21.02', min: 8.80, max: 10.80, anchor: 9.80, change: 3.1 },
    { label: 'M-1', date: '28.01', min: 8.50, max: 10.50, anchor: 9.50, change: 6.3 },
    { label: 'Q-1', date: '28.11', min: 8.00, max: 10.00, anchor: 9.00, change: 12.2 },
    { label: 'H-1', date: '28.08', min: 7.50, max: 9.50, anchor: 8.50, change: 18.8 },
    { label: 'Y-1', date: '28.02.25', min: 7.00, max: 9.00, anchor: 8.00, change: 26.3 },
  ]

  return (
    <div className="flex flex-col h-full p-4 select-none bg-transparent font-mono">
      {/* NAGŁÓWEK - IDENTYCZNY JAK W INNYCH SEKCJACH */}
      <div className="text-[10px] text-gray-500 uppercase tracking-[0.5em] font-bold text-center py-2 border-b border-gray-900 bg-black/40 mb-4">
        <span>PHYSICAL MARKET DIMENSION</span>
      </div>

      {/* ACTIVE ZONE - NAJWAŻNIEJSZA INFORMACJA (ŻÓŁTE WARTOŚCI) */}
      <div className="mb-6 p-3 border border-yellow-500/30 bg-yellow-500/5 rounded-sm">
        <div className="flex justify-between items-center mb-2">
          <span className="text-[10px] text-yellow-500 font-bold tracking-widest">28.02.2026 ACTIVE ZONE</span>
        </div>
        <div className="flex justify-between items-end">
          <div>
            <span className="text-[8px] text-gray-500 uppercase block mb-1">Current Range</span>
            <div className="text-lg font-bold text-yellow-500">
              {/* Tutaj Twoje wartości min/max na żółto */}
              9.09 <span className="text-gray-700 mx-1">—</span> 11.11
            </div>
          </div>
          <div className="text-right">
            <span className="text-[8px] text-gray-500 uppercase block mb-1 font-bold">Anchor</span>
            {/* Anchor większy, zielony/czerwony zależnie od trendu */}
            <div className="text-2xl font-black text-green-500">
              {currentPrice.toFixed(2)}
            </div>
          </div>
        </div>
      </div>

      {/* TABELA HISTORYCZNA (DANE NA SZARO, TREND W KOLORZE) */}
      <div className="flex-grow">
        <div className="grid grid-cols-6 text-[8px] text-gray-600 font-bold uppercase pb-1 border-b border-gray-900 mb-2">
          <div>Ref</div>
          <div>Date</div>
          <div className="col-span-2 text-center">Min/Max</div>
          <div className="text-center">Anchor</div>
          <div className="text-right">Trend</div>
        </div>

        <div className="space-y-1.5">
          {history.map((row) => (
            <div key={row.label} className="grid grid-cols-6 items-center py-1 border-b border-gray-900/30">
              <div className="text-[9px] font-bold text-gray-500">{row.label}</div>
              <div className="text-[8px] text-gray-600 italic">{row.date}</div>
              <div className="col-span-2 text-[9px] text-gray-500 text-center">
                {row.min} - {row.max}
              </div>
              <div className="text-[9px] text-gray-500 text-center font-bold">
                {row.anchor}
              </div>
              <div className={`text-[9px] text-right font-black ${row.change >= 0 ? 'text-green-700' : 'text-red-700'}`}>
                {row.change >= 0 ? '▲' : '▼'} {Math.abs(row.change)}%
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* STOPKA ADR */}
      <div className="mt-4 pt-2 border-t border-gray-900 text-[8px] text-gray-700 text-center tracking-widest">
        BSTZ SYSTEM · ASYMPTOTIC DAILY REBALANCING
      </div>
    </div>
  )
}