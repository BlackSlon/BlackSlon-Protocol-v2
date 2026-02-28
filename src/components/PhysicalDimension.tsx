'use client'

interface PhysicalDimensionProps {
  marketId: string
  currentPrice: number
}

export default function PhysicalDimension({ marketId, currentPrice }: PhysicalDimensionProps) {
  // Dane do tabeli historycznej
  const history = [
    { label: 'D-1', date: '27.02', min: 9.05, max: 11.05, anchor: 9.95, change: 1.5 },
    { label: 'W-1', date: '21.02', min: 8.80, max: 10.80, anchor: 9.80, change: 3.1 },
    { label: 'M-1', date: '28.01', min: 8.50, max: 10.50, anchor: 9.50, change: 6.3 },
    { label: 'Q-1', date: '28.11', min: 8.00, max: 10.00, anchor: 9.00, change: 12.2 },
    { label: 'H-1', date: '28.08', min: 7.50, max: 9.50, anchor: 8.50, change: 18.8 },
    { label: 'Y-1', date: '28.02.25', min: 7.00, max: 9.00, anchor: 8.00, change: 26.3 },
  ]

  return (
    <div className="flex flex-col h-full p-4 select-none bg-transparent">
      {/* NAGŁÓWEK - ZOSTAWIAMY JAK BYŁO */}
      <div className="text-[10px] text-gray-500 uppercase tracking-[0.5em] font-bold text-center py-2 border-b border-gray-900 bg-black/40 mb-4">
        <span>PHYSICAL MARKET DIMENSION</span>
      </div>

      {/* TWOJA SEKCJA ACTIVE ZONE (Z żółtymi wartościami) */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-1">
          <span className="text-[10px] text-yellow-500 font-bold uppercase">28.02.2026 ACTIVE ZONE</span>
        </div>
        <div className="flex justify-between items-baseline">
          <div className="text-sm font-bold text-yellow-500">
            Min: 9.09 <span className="text-gray-600 mx-2">|</span> Max: 11.11
          </div>
          <div className="text-right">
            <span className="text-[8px] text-gray-500 uppercase block">Anchor</span>
            <span className="text-xl font-black text-green-500">{currentPrice.toFixed(2)}</span>
          </div>
        </div>
      </div>

      {/* TWOJA STRUKTURA SUWAKÓW ITP. POWINNA BYĆ TUTAJ - JEŚLI JĄ USUNĄŁEM, WRZUĆ JĄ Z POWROTEM */}

      {/* NOWA TABELA TRENDÓW (DODATEK NA DOLE) */}
      <div className="mt-4 border-t border-gray-900 pt-4">
        <div className="space-y-1">
          {history.map((row) => (
            <div key={row.label} className="grid grid-cols-6 items-center py-1 border-b border-gray-900/30">
              <div className="text-[9px] font-bold text-gray-500">{row.label}</div>
              <div className="text-[8px] text-gray-600">{row.date}</div>
              <div className="col-span-2 text-[9px] text-gray-500 text-center">
                {row.min} - {row.max}
              </div>
              <div className="text-[9px] text-gray-400 text-center">{row.anchor}</div>
              <div className={`text-[9px] text-right font-bold ${row.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {row.change >= 0 ? '▲' : '▼'} {Math.abs(row.change)}%
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}