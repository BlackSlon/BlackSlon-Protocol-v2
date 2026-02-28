'use client'

interface PhysicalDimensionProps {
  marketId: string
  currentPrice: number
}

export default function PhysicalDimension({ marketId, currentPrice }: PhysicalDimensionProps) {
  // Dane historyczne - pełne daty, większa czcionka
  const history = [
    { label: 'D-1', date: '27.02.2026', min: 9.05, max: 11.05, anchor: 9.95, change: 1.5 },
    { label: 'W-1', date: '21.02.2026', min: 8.80, max: 10.80, anchor: 9.80, change: 3.1 },
    { label: 'M-1', date: '28.01.2026', min: 8.50, max: 10.50, anchor: 9.50, change: 6.3 },
    { label: 'Q-1', date: '28.11.2025', min: 8.00, max: 10.00, anchor: 9.00, change: 12.2 },
    { label: 'H-1', date: '28.08.2025', min: 7.50, max: 9.50, anchor: 8.50, change: 18.8 },
    { label: 'Y-1', date: '28.02.2025', min: 7.00, max: 9.00, anchor: 8.00, change: 26.3 },
  ]

  return (
    <div className="flex flex-col h-full p-4 select-none bg-transparent font-mono">
      {/* NAGŁÓWEK SEKCI */}
      <div className="text-[10px] text-gray-500 uppercase tracking-[0.5em] font-bold text-center py-2 border-b border-gray-900 bg-black/40 mb-4">
        <span>PHYSICAL MARKET DIMENSION</span>
      </div>

      {/* TYTUŁ STREFY NA CZERWONO */}
      <div className="text-center mb-4">
        <div className="text-[11px] font-black tracking-[0.2em] uppercase text-red-600">
          BlackSlon Trading Zone (BSTZ)
        </div>
        <div className="text-[8px] text-gray-600 mt-1 italic">Values in EUR / 100kWh</div>
      </div>

      {/* ACTIVE ZONE (ŻÓŁTE WARTOŚCI) */}
      <div className="mb-6 p-4 border border-yellow-500/40 bg-yellow-500/5 rounded-sm">
        <div className="flex justify-between items-center mb-3">
          <span className="text-[10px] text-yellow-500 font-bold tracking-widest uppercase italic">28.02.2026 ACTIVE ZONE</span>
        </div>
        <div className="flex justify-between items-end">
          <div>
            <span className="text-[9px] text-gray-500 uppercase block mb-1">Price Range</span>
            <div className="text-xl font-bold text-yellow-500 tracking-tight">
              9.09 <span className="text-gray-700 mx-1">—</span> 11.11
            </div>
          </div>
          <div className="text-right">
            <span className="text-[9px] text-gray-500 uppercase block mb-1 font-bold">Anchor</span>
            <div className="text-3xl font-black text-green-500 leading-none">
              {currentPrice.toFixed(2)}
            </div>
          </div>
        </div>
      </div>

      {/* TABELA HISTORYCZNA (WIĘKSZE CZCIONKI DLA DANYCH) */}
      <div className="flex-grow">
        <div className="grid grid-cols-6 text-[9px] text-gray-600 font-bold uppercase pb-1 border-b border-gray-900 mb-2">
          <div>Ref</div>
          <div className="col-span-2">Date</div>
          <div className="text-center">Min/Max</div>
          <div className="text-center">Anchor</div>
          <div className="text-right">Trend</div>
        </div>

        <div className="space-y-2">
          {history.map((row) => (
            <div key={row.label} className="grid grid-cols-6 items-center py-1.5 border-b border-gray-900/30">
              <div className="text-[11px] font-bold text-gray-400">{row.label}</div>
              <div className="col-span-2 text-[10px] text-gray-500">{row.date}</div>
              <div className="text-[11px] text-gray-400 text-center">
                {row.min}-{row.max}
              </div>
              <div className="text-[11px] text-gray-300 text-center font-bold">
                {row.anchor.toFixed(2)}
              </div>
              <div className={`text-[11px] text-right font-black ${row.change >= 0 ? 'text-green-700' : 'text-red-700'}`}>
                {row.change >= 0 ? '▲' : '▼'} {Math.abs(row.change).toFixed(1)}%
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* STOPKA SYSTEMOWA */}
      <div className="mt-6 pt-2 border-t border-gray-900 text-[8px] text-gray-700 text-center tracking-widest">
        BSTZ PROTOCOL · ADR STABILIZATION ACTIVE
      </div>
    </div>
  )
}