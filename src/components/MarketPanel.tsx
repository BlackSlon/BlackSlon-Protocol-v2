'use client'

interface MarketPanelProps {
  currentPrice: number
  borderColor: string
  montserratStyle: any
}

export default function MarketPanel({ currentPrice, borderColor, montserratStyle }: MarketPanelProps) {
  const monoStyle = { fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace' }

  const history = [
    { date: '25.02.2026', min: 9.85, max: 10.95, anchor: 10.40 },
    { date: '24.02.2026', min: 9.90, max: 11.05, anchor: 10.47 },
    { date: '23.02.2026', min: 9.75, max: 10.80, anchor: 10.27 },
    { date: '22.02.2026', min: 9.80, max: 10.85, anchor: 10.32 },
    { date: '21.02.2026', min: 10.05, max: 11.20, anchor: 10.62 },
    { date: '20.02.2026', min: 9.95, max: 11.10, anchor: 10.52 },
    { date: '19.02.2026', min: 9.88, max: 11.02, anchor: 10.45 }
  ]

  return (
    <div className="flex flex-col h-full p-4 select-none" style={montserratStyle}>
      {/* HEADER */}
      <div className="text-center mb-2 border-b border-gray-900 pb-1">
        <span className="text-[9px] tracking-[0.3em] text-gray-400 uppercase font-bold">Market Panel</span>
      </div>

      {/* PODTYTUŁ */}
      <div className="text-center mb-1">
        <span className="text-[10px] text-red-600 font-bold tracking-widest uppercase">PHYSICAL DIMENSION</span>
      </div>

      {/* TYTUŁ KORYTARZA */}
      <div className="text-center mb-3">
        <span className="text-[14px] text-white font-bold tracking-[0.1em] uppercase">BlackSlon Trading Zone</span>
      </div>

      {/* BSTZ CORRIDOR TABLE */}
      <div className="mb-6">
        <div className="flex justify-between items-center px-1 mb-1">
          <span className="text-[9px] text-gray-500 uppercase font-bold">7D Corridor History</span>
          <span className="text-[8px] text-gray-600 font-mono">EUR/vkWh</span>
        </div>
        
        <div className="bg-gray-950/40 rounded-sm border border-gray-900 overflow-hidden">
          <div className="grid grid-cols-12 text-[8px] text-gray-600 uppercase border-b border-gray-900 py-1.5 px-3 font-bold bg-black">
            <div className="col-span-3">Date</div>
            <div className="col-span-9 text-center uppercase tracking-tighter">Zone Range & Anchor (●)</div>
          </div>
          
          <div className="divide-y divide-gray-900/50">
            {history.map((day, i) => (
              <div key={i} className="grid grid-cols-12 py-2 px-3 items-center hover:bg-gray-900/40 transition-colors">
                <div className="col-span-3 text-[10px] text-gray-400 font-mono" style={monoStyle}>{day.date}</div>
                
                <div className="col-span-9 flex justify-between items-center gap-3">
                  <span className="text-[11px] text-green-500/60 font-mono w-10 text-right" style={monoStyle}>{day.min.toFixed(2)}</span>
                  
                  <div className="flex-grow h-[3px] bg-gray-800 relative rounded-full mx-2">
                     <div className="absolute inset-y-0 left-1/4 right-1/4 bg-yellow-500/20"></div>
                     
                     {/* INTERAKTYWNA KROPA */}
                     <div className="group absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 cursor-pointer">
                        <div className="w-2.5 h-2.5 bg-red-600 rounded-full border border-black shadow-[0_0_8px_rgba(220,38,38,0.9)] transition-transform group-hover:scale-125"></div>
                        
                        {/* TOOLTIP */}
                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block z-50">
                          <div className="bg-black border border-gray-700 text-[9px] text-white px-2 py-1 rounded whitespace-nowrap shadow-xl">
                            Anchor: <span className="text-red-500 font-bold">{day.anchor.toFixed(2)}</span> EUR/vkWh
                          </div>
                          <div className="w-2 h-2 bg-black border-r border-b border-gray-700 rotate-45 absolute -bottom-1 left-1/2 -translate-x-1/2"></div>
                        </div>
                     </div>
                  </div>

                  <span className="text-[11px] text-green-500 font-mono w-10 text-left" style={monoStyle}>{day.max.toFixed(2)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* SYNTHESIS FORMULA */}
      <div className="mb-4 px-1">
        <div className="text-[9px] text-blue-500 font-bold tracking-[0.2em] uppercase text-center mb-2">
          Synthesis Formula: 10/40/25/25
        </div>
        <div className="space-y-2">
          {[
            { label: 'SPOT (BSEI)', w: 10, v: currentPrice, c: 'text-yellow-500' },
            { label: 'FRONT MONTH (FM)', w: 40, v: currentPrice + 0.36, c: 'text-white' },
            { label: 'FRONT QUARTER (FQ)', w: 25, v: currentPrice + 0.73, c: 'text-gray-400' },
            { label: 'CALENDAR (CAL)', w: 25, v: currentPrice + 1.06, c: 'text-gray-400' }
          ].map((comp, i) => (
            <div key={i} className="flex justify-between items-center border-b border-gray-900/40 pb-1">
              <span className="text-[8px] text-gray-500 uppercase font-bold">{comp.label} <span className="text-[7px] ml-1 opacity-40">({comp.w}%)</span></span>
              <span className={`text-[11px] font-mono font-bold ${comp.c}`} style={monoStyle}>{comp.v.toFixed(2)}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="flex-grow" />

      {/* SYNTHESIS OUTPUT */}
      <div className="bg-[#0d1117] border border-gray-800/50 p-4 rounded-sm">
        <div className="flex justify-between items-center mb-1">
          <span className="text-[9px] text-gray-400 uppercase font-bold tracking-widest">Synthesis Output</span>
          <span className="text-[8px] text-blue-500 font-mono animate-pulse uppercase">ADR Active</span>
        </div>
        <div className="flex justify-between items-baseline">
          <span className="text-[10px] text-gray-500 uppercase">BSTZ Index</span>
          <span className="text-2xl font-bold text-yellow-500 font-mono" style={monoStyle}>10.59</span>
        </div>
      </div>
    </div>
  )
}