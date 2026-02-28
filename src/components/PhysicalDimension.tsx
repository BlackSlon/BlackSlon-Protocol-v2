'use client'


interface PhysicalDimensionProps {
  marketId: string
  currentPrice: number
}


export default function PhysicalDimension({ marketId, currentPrice }: PhysicalDimensionProps) {
  const history = [
    { label: 'D-1', date: '27.02.2026', min: 9.05, max: 11.05, anchor: 9.95, change: 1.50 },
    { label: 'W-1', date: '21.02.2026', min: 8.80, max: 10.80, anchor: 9.80, change: 3.10 },
    { label: 'M-1', date: '28.01.2026', min: 8.50, max: 10.50, anchor: 9.50, change: 6.30 },
    { label: 'Q-1', date: '28.11.2025', min: 8.00, max: 10.00, anchor: 9.00, change: 12.20 },
    { label: 'H-1', date: '28.08.2025', min: 7.50, max: 9.50, anchor: 8.50, change: 18.80 },
    { label: 'Y-1', date: '28.02.2025', min: 7.00, max: 9.00, anchor: 8.00, change: 26.30 },
  ]


  return (
    <div className="flex flex-col h-full p-4 select-none bg-transparent font-mono">
      {/* NAGŁÓWEK SEKCI */}
      <div className="text-[10px] text-gray-500 uppercase tracking-[0.5em] font-bold text-center py-2 border-b border-gray-900 bg-black/40 mb-4">
        <span>PHYSICAL MARKET DIMENSION</span>
      </div>


      {/* TYTUŁ STREFY */}
      <div className="text-center mb-4">
        <div className="text-[11px] font-black tracking-[0.1em] text-red-600">
          BlackSlon Trading Zone (BSTZ)
        </div>
      </div>


      {/* ACTIVE BSTZ */}
      <div className="mb-6 p-4 border border-yellow-500/40 bg-yellow-500/5 rounded-sm">
        <div className="text-[10px] text-yellow-500 font-bold tracking-widest uppercase italic mb-3">
          28.02.2026 ACTIVE BSTZ
        </div>
       
        <div className="flex flex-col">
          {/* ZAPIS EUR/100kWh NA SZTYWNO BEZ UPPERCASE */}
          <span className="text-[9px] text-gray-500 mb-1 font-bold">PRICE RANGE (MIN / ANCHOR / MAX) in EUR/100kWh</span>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-black text-yellow-500">9.09</span>
            <span className="text-lg font-bold text-green-500 mx-2">{currentPrice.toFixed(2)}</span>
            <span className="text-2xl font-black text-yellow-500">11.11</span>
          </div>
        </div>
      </div>


      {/* TABELA HISTORYCZNA */}
      <div className="flex-grow">
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
                <span className="text-[8px] text-gray-600 leading-tight">{row.date}</span>
              </div>


              <div className="col-span-2 text-[11px] text-gray-500 text-center">
                {row.min.toFixed(2)}
              </div>
              <div className="col-span-2 text-[11px] text-gray-300 text-center font-bold">
                {row.anchor.toFixed(2)}
              </div>
              <div className="col-span-2 text-[11px] text-gray-500 text-center">
                {row.max.toFixed(2)}
              </div>


              <div className={`col-span-3 text-[11px] text-right font-black ${row.change >= 0 ? 'text-green-700' : 'text-red-700'}`}>
                {row.change >= 0 ? '▲' : '▼'} {Math.abs(row.change).toFixed(2)}%
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

