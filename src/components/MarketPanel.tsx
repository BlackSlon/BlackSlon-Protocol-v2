'use client'

interface MarketPanelProps {
  currentPrice: number
  borderColor: string
  montserratStyle: any
}

export default function MarketPanel({ currentPrice, borderColor, montserratStyle }: MarketPanelProps) {
  const monoStyle = { fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace' }

  // Twoje komponenty BSTZ
  const bstzComponents = [
    { label: 'SPOT PRICE (BSEI)', weight: 10, value: currentPrice, color: 'text-yellow-500' },
    { label: 'FRONT MONTH (FM)', weight: 40, value: currentPrice + 0.36, color: 'text-white' },
    { label: 'FRONT QUARTER (FQ)', weight: 25, value: currentPrice + 0.73, color: 'text-gray-400' },
    { label: 'CALENDAR (CAL)', weight: 25, value: currentPrice + 1.06, color: 'text-gray-400' }
  ]

  return (
    <div className="flex flex-col h-full p-4 select-none" style={montserratStyle}>
      {/* NAGŁÓWEK - Identyczny styl jak w Trading Panel */}
      <div className="text-center mb-2 border-b border-gray-900 pb-1">
        <span className="text-[9px] tracking-[0.3em] text-gray-400 uppercase font-bold">Market Panel</span>
      </div>

      {/* PODTYTUŁ - Czerwony, jak Instrument w Trading Panel */}
      <div className="text-center mb-4">
        <span className="text-[10px] text-red-600 font-bold tracking-widest uppercase">PHYSICAL DIMENSION</span>
      </div>

      {/* BSTZ FORMULA SYNTHESIS */}
      <div className="mb-4 px-1">
        <div className="text-[8px] text-blue-500 font-bold tracking-[0.2em] uppercase text-center mb-3">
          BSTZ Formula: 10/40/25/25
        </div>
        <div className="space-y-2">
          {bstzComponents.map((comp, i) => (
            <div key={i} className="flex justify-between items-end border-b border-gray-900/50 pb-1">
              <div className="flex flex-col">
                <span className="text-[7px] text-gray-600 uppercase tracking-tighter">{comp.label}</span>
                <span className="text-[10px] font-bold text-gray-400">{comp.weight}% Weight</span>
              </div>
              <span className={`text-[11px] font-mono font-bold ${comp.color}`} style={monoStyle}>
                {comp.value.toFixed(2)}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* STATYSTYKI ANCHOR */}
      <div className="mb-4">
        <div className="text-[8px] text-gray-500 tracking-widest uppercase mb-2 border-b border-gray-900 pb-1">Market Statistics</div>
        <div className="grid grid-cols-3 gap-1 text-center bg-gray-950/50 py-2 rounded-sm">
          <div>
            <div className="text-[7px] text-gray-600 uppercase mb-0.5 tracking-tighter">Daily Anchor</div>
            <div className="text-[10px] font-bold text-green-500 font-mono">10.09</div>
          </div>
          <div>
            <div className="text-[7px] text-gray-600 uppercase mb-0.5 tracking-tighter">BSTZ Max</div>
            <div className="text-[10px] font-bold text-green-500/70 font-mono">11.10</div>
          </div>
          <div>
            <div className="text-[7px] text-gray-600 uppercase mb-0.5 tracking-tighter">BSTZ Min</div>
            <div className="text-[10px] font-bold text-green-500/70 font-mono">9.08</div>
          </div>
        </div>
      </div>

      <div className="flex-grow" />

      {/* SYNTHESIS OUTPUT - Ciemny boks jak Margin Requirement */}
      <div className="bg-[#0d1117] border border-gray-800/50 p-3 rounded-sm">
        <div className="flex justify-between items-center mb-1">
          <span className="text-[8px] text-gray-500 uppercase font-bold tracking-widest">Synthesis Output</span>
          <span className="text-[7px] text-blue-500 font-mono animate-pulse uppercase tracking-tighter">ADR Active</span>
        </div>
        <div className="flex justify-between items-baseline">
          <span className="text-[9px] text-gray-400 uppercase">BSTZ Index</span>
          <span className="text-xl font-bold text-yellow-500 font-mono" style={monoStyle}>10.59</span>
        </div>
        <div className="text-[6px] text-gray-700 text-center mt-2 uppercase tracking-tighter">
          Asymptotic Daily Rebalancing: T-12
        </div>
      </div>
    </div>
  )
}