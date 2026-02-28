'use client'

interface VirtualDimensionProps {
  marketId: string
  currentPrice?: number // Znak zapytania sprawia, że cena jest opcjonalna (unika błędów TS)
}

export default function VirtualDimension({ marketId, currentPrice }: VirtualDimensionProps) {
  // Zabezpieczenie: jeśli currentPrice jest undefined, użyj 10.59 jako fallback
  const safePrice = currentPrice ?? 10.59;

  const history = [
    { label: 'Y-1', date: '28.02.2025', min: 7.00, max: 9.00, anchor: 8.00, change: 26.30 },
    { label: 'H-1', date: '28.08.2025', min: 7.50, max: 9.50, anchor: 8.50, change: 18.80 },
    { label: 'Q-1', date: '28.11.2025', min: 8.00, max: 10.00, anchor: 9.00, change: 12.20 },
    { label: 'M-1', date: '28.01.2026', min: 8.50, max: 10.50, anchor: 9.50, change: 6.30 },
    { label: 'W-1', date: '21.02.2026', min: 8.80, max: 10.80, anchor: 9.80, change: 3.10 },
    { label: 'D-1', date: '27.02.2026', min: 9.05, max: 11.05, anchor: 9.95, change: 1.50 },
  ]

  const chartData = [...history, { label: 'NOW', anchor: safePrice, min: 9.09, max: 11.11 }]

  const chartWidth = 300
  const chartHeight = 60
  const pointsCount = chartData.length - 1
  
  const getX = (index: number) => (index * (chartWidth / pointsCount))
  const getY = (val: number) => chartHeight - ((val - 6) * (chartHeight / (12 - 6)))

  const topPoints = chartData.map((d, i) => `${getX(i)},${getY(d.max)}`).join(' ')
  const bottomPoints = [...chartData].reverse().map((d, i) => `${getX(pointsCount - i)},${getY(d.min)}`).join(' ')
  const areaPoints = `${topPoints} ${bottomPoints}`

  const anchorPath = chartData.map((d, i) => `${i === 0 ? 'M' : 'L'} ${getX(i)} ${getY(d.anchor)}`).join(' ')

  return (
    <div className="flex flex-col h-full p-4 select-none bg-transparent font-mono">
      <div className="text-[10px] text-gray-500 uppercase tracking-[0.5em] font-bold text-center py-2 border-b border-gray-900 bg-black/40 mb-4">
        <span>PHYSICAL MARKET DIMENSION</span>
      </div>

      <div className="text-center mb-4">
        <div className="text-[11px] font-black tracking-[0.1em] text-red-600">
          BlackSlon Trading Zone (BSTZ)
        </div>
      </div>

      <div className="mb-6 p-4 border border-yellow-500/40 bg-yellow-500/5 rounded-sm">
        <div className="text-[10px] text-yellow-500 font-bold tracking-widest uppercase italic mb-3">
          28.02.2026 ACTIVE BSTZ
        </div>
        <div className="flex flex-col">
          <span className="text-[9px] text-gray-500 mb-1 font-bold italic uppercase">Price Range (Min / Anchor / Max) in EUR/100kWh</span>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-black text-yellow-500">9.09</span>
            <span className="text-lg font-bold text-green-500 mx-2">{safePrice.toFixed(2)}</span>
            <span className="text-2xl font-black text-yellow-500">11.11</span>
          </div>
        </div>
      </div>

      <div className="flex-grow overflow-hidden">
        <div className="grid grid-cols-12 text-[9px] text-gray-600 font-bold uppercase pb-1 border-b border-gray-900 mb-2">
          <div className="col-span-3">Ref / Date</div>
          <div className="col-span-2 text-center">Min</div>
          <div className="col-span-2 text-center font-bold text-gray-400">Anchor</div>
          <div className="col-span-2 text-center">Max</div>
          <div className="col-span-3 text-right">Trend</div>
        </div>

        <div className="space-y-3">
          {[...history].reverse().map((row) => (
            <div key={row.label} className="grid grid-cols-12 items-center py-1 border-b border-gray-900/30">
              <div className="col-span-3 flex flex-col">
                <span className="text-[11px] font-bold text-gray-400">{row.label}</span>
                <span className="text-[8px] text-gray-600 leading-tight">{row.date}</span>
              </div>
              <div className="col-span-2 text-[11px] text-gray-500 text-center">{row.min.toFixed(2)}</div>
              <div className="col-span-2 text-[11px] text-gray-300 text-center font-bold">{row.anchor.toFixed(2)}</div>
              <div className="col-span-2 text-[11px] text-gray-500 text-center">{row.max.toFixed(2)}</div>
              <div className={`col-span-3 text-[11px] text-right font-black ${row.change >= 0 ? 'text-green-700' : 'text-red-700'}`}>
                {row.change >= 0 ? '▲' : '▼'} {Math.abs(row.change).toFixed(2)}%
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-4 p-2 border border-gray-900 bg-black/20 rounded-sm">
        <div className="flex justify-between text-[7px] text-gray-600 uppercase mb-2 tracking-widest">
          <span>1Y Corridor Trend</span>
          <span>Range: 7.00 — 12.00</span>
        </div>
        
        <svg viewBox={`0 0 ${chartWidth} ${chartHeight + 10}`} className="w-full h-16 overflow-visible">
          <line x1="0" y1="0" x2={chartWidth} y2="0" stroke="#1a1a1a" strokeWidth="0.5" />
          <line x1="0" y1={chartHeight} x2={chartWidth} y2={chartHeight} stroke="#1a1a1a" strokeWidth="0.5" />
          
          <polygon points={areaPoints} fill="rgba(234, 179, 8, 0.15)" />
          <polyline points={topPoints} fill="none" stroke="rgba(234, 179, 8, 0.4)" strokeWidth="0.5" />
          <polyline points={bottomPoints} fill="none" stroke="rgba(234, 179, 8, 0.4)" strokeWidth="0.5" />
          
          <path d={anchorPath} fill="none" stroke="#22c55e" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
          
          <text x="0" y={chartHeight + 8} fontSize="7" fill="#444" textAnchor="start">Y-1</text>
          <text x={chartWidth / 2} y={chartHeight + 8} fontSize="7" fill="#444" textAnchor="middle">H-1</text>
          <text x={chartWidth} y={chartHeight + 8} fontSize="7" fill="#444" textAnchor="end">NOW</text>
        </svg>
      </div>

      <div className="mt-6 pt-2 border-t border-gray-900 text-[8px] text-gray-700 text-center tracking-widest uppercase">
        BSTZ Protocol · ADR Stabilization Active
      </div>
    </div>
  )
}