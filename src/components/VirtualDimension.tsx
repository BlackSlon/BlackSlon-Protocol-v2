'use client'

export default function VirtualDimension() {
  const monoStyle = { fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace' }

  return (
    <div className="flex flex-col h-full bg-blue-900/5">
      {/* PODTYTUŁ - Styl jak PHYSICAL DIMENSION */}
      <div className="text-center mb-1">
        <div className="text-[10px] font-black tracking-widest uppercase mb-1 text-red-600">VIRTUAL DIMENSION</div>
      </div>
      
      {/* TYTUŁ - BlackSlon Power Index PL */}
      <div className="text-center mb-3">
        <span className="text-[18px] text-white font-bold tracking-tight">BlackSlon Power Index PL</span>
      </div>

      {/* VERTICAL POWER METER */}
      <div className="bg-gray-950/40 rounded-sm border border-gray-900 p-3">
        <div className="text-center mb-2">
          <span className="text-[8px] text-gray-600 uppercase tracking-tighter">Power Meter</span>
        </div>
        
        {/* Obudowa miernika */}
        <div className="relative h-32 bg-black rounded border border-gray-800 mx-4">
          {/* Skala miernika */}
          <div className="absolute inset-x-0 top-0 bottom-0 flex flex-col justify-between py-2">
            <div className="text-[7px] text-gray-600 font-mono text-center">BSTZ Max</div>
            <div className="text-[7px] text-gray-600 font-mono text-center">BSTZ Min</div>
          </div>
          
          {/* Wskaźnik BSPI */}
          <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 flex items-center">
            <div className="relative">
              {/* Świecący wskaźnik BSPI */}
              <div className="w-16 h-1 bg-yellow-500 rounded-full shadow-[0_0_10px_rgba(250,204,21,0.8)] animate-pulse"></div>
              <div className="absolute -top-1 -left-2 text-[9px] text-yellow-500 font-mono font-bold">BSPI</div>
            </div>
          </div>
        </div>

        {/* Wskaźniki Supply/Demand */}
        <div className="flex justify-between mt-3 px-2">
          {/* Lewy - LVOP Delta (Longs) */}
          <div className="text-center">
            <div className="text-[8px] text-gray-600 uppercase tracking-tighter mb-1">LVOP Delta</div>
            <div className="w-12 h-1 bg-gray-800 relative rounded-full overflow-hidden">
              <div className="absolute inset-y-0 left-1/2 w-0.5 bg-green-500/60"></div>
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-green-500 rounded-full border border-black shadow-[0_0_4px_rgba(34,197,94,0.8)]"></div>
            </div>
            <div className="text-[12px] text-green-500 font-mono mt-1" style={monoStyle}>+2.34</div>
          </div>
          
          {/* Prawy - SVOP Delta (Shorts) */}
          <div className="text-center">
            <div className="text-[8px] text-gray-600 uppercase tracking-tighter mb-1">SVOP Delta</div>
            <div className="w-12 h-1 bg-gray-800 relative rounded-full overflow-hidden">
              <div className="absolute inset-y-0 right-1/2 w-0.5 bg-red-500/60"></div>
              <div className="absolute top-1/2 right-1/2 translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-red-500 rounded-full border border-black shadow-[0_0_4px_rgba(239,68,68,0.8)]"></div>
            </div>
            <div className="text-[12px] text-red-500 font-mono mt-1" style={monoStyle}>-1.87</div>
          </div>
        </div>
        
        {/* Data timestamp */}
        <div className="text-center mt-2 text-[7px] text-gray-600 font-mono">
          {new Date().toLocaleDateString('pl-PL', { day: '2-digit', month: '2-digit', year: 'numeric' }).replace(/\./g, '.')}
        </div>
      </div>
    </div>
  )
}
