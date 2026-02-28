'use client'

export default function PhysicalDimension() {
  const activeZone = {
    date: '28.02.2026',
    min: 9.09,
    max: 11.11,
    anchor: 10.10,
    prevAnchor: 9.95
  }

  const history = [
    { label: 'D-1', date: '27.02', min: 9.05, max: 11.05, anchor: 9.95, change: 1.5 },
    { label: 'W-1', date: '21.02', min: 8.80, max: 10.80, anchor: 9.80, change: 3.1 },
    { label: 'M-1', date: '28.01', min: 8.50, max: 10.50, anchor: 9.50, change: 6.3 },
    { label: 'Q-1', date: '28.11', min: 8.00, max: 10.00, anchor: 9.00, change: 12.2 },
    { label: 'H-1', date: '28.08', min: 7.50, max: 9.50, anchor: 8.50, change: 18.8 },
    { label: 'Y-1', date: '28.02.25', min: 7.00, max: 9.00, anchor: 8.00, change: 26.3 },
  ]

  const isAnchorUp = activeZone.anchor >= activeZone.prevAnchor

  return (
    <div className="flex flex-col h-full p-4 bg-transparent select-none font-mono">
      {/* 1. ACTIVE ZONE - MAIN DISPLAY */}
      <div className="border-2 border-yellow-500/50 bg-yellow-500/5 rounded-lg p-4 mb-6 shadow-[0_0_15px_rgba(234,179,8,0.1)]">
        <div className="flex justify-between items-center mb-2">
          <span className="text-[10px] text-gray-500 tracking-[0.3em] font-bold">BSTZ PHYSICAL MARKET</span>
          <span className="text-[10px] text-yellow-500 font-bold uppercase">{activeZone.date} ACTIVE ZONE</span>
        </div>
        
        <div className="flex justify-between items-end">
          <div className="flex flex-col">
            <span className="text-[10px] text-gray-400 uppercase">Min / Max</span>
            <div className="text-xl font-black text-yellow-500">
              {activeZone.min} <span className="text-gray-700 mx-1">—</span> {activeZone.max}
            </div>
          </div>
          
          <div className="text-right">
            <span className="text-[10px] text-gray-400 uppercase italic">Anchor Point</span>
            <div className={`text-3xl font-black ${isAnchorUp ? 'text-green-500' : 'text-red-500'}`}>
              {activeZone.anchor}
            </div>
          </div>
        </div>
      </div>

      {/* HISTORY TABLE */}
      <div className="space-y-1">
        <div className="grid grid-cols-6 text-[8px] text-gray-600 font-bold uppercase tracking-wider pb-1 border-b border-gray-900">
          <div>Period</div>
          <div>Date</div>
          <div className="col-span-2 text-center">Min / Max Range</div>
          <div className="text-center">Anchor</div>
          <div className="text-right">Trend</div>
        </div>

        {history.map((row) => (
          <div key={row.label} className="grid grid-cols-6 items-center py-1.5 border-b border-gray-900/50 hover:bg-white/5 transition-colors">
            <div className="text-[10px] font-bold text-gray-400">{row.label}</div>
            <div className="text-[9px] text-gray-600">{row.date}</div>
            <div className="col-span-2 text-[10px] text-gray-500 text-center">
              {row.min} <span className="text-gray-800">-</span> {row.max}
            </div>
            <div className="text-[10px] text-gray-500 text-center font-bold">
              {row.anchor}
            </div>
            <div className={`text-[10px] flex items-center justify-end font-bold ${row.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              <span className="mr-1">{row.change >= 0 ? '▲' : '▼'}</span>
              {Math.abs(row.change).toFixed(1)}%
            </div>
          </div>
        ))}
      </div>

      {/* FOOTER NOTE */}
      <div className="mt-auto pt-4 text-[8px] text-gray-700 text-center italic tracking-widest uppercase">
        * DATA CALCULATED BASED ON ASYMPTOTIC DAILY REBALANCING (ADR)
      </div>
    </div>
  )
}