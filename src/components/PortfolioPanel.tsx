'use client'

export default function PortfolioPanel() {
  const monoStyle = { fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace' }

  return (
    <div className="flex flex-col h-full select-none">
      <div className="text-[10px] text-gray-500 uppercase tracking-[0.5em] font-bold text-center py-2 border-b border-gray-900 bg-black/40 mb-4">
        <span>USER'S ACCOUNT</span>
      </div>

      <div className="text-center mb-4">
        <div className="text-[11px] font-black tracking-widest uppercase mb-1 text-red-600">USER INVENTORY</div>
      </div>

      <div className="space-y-4">
        {/* €BSR Balance */}
        <div className="border-b border-gray-900/50 pb-2">
          <div className="text-[8px] text-gray-600 uppercase font-bold mb-1">Balance (€BSR)</div>
          <div className="text-lg font-bold text-yellow-500 font-mono" style={monoStyle}>42,069.12</div>
        </div>

        {/* Physical Assets */}
        <div className="space-y-2">
          <div className="text-[8px] text-gray-500 uppercase font-bold tracking-tighter">Energy Portfolio</div>
          <div className="flex justify-between items-center bg-gray-900/20 p-2 rounded-sm border border-gray-900">
            <span className="text-[9px] text-gray-400 uppercase">BSTZ Physical</span>
            <span className="text-[11px] font-mono text-white" style={monoStyle}>120 MWh</span>
          </div>
          <div className="flex justify-between items-center bg-gray-900/20 p-2 rounded-sm border border-gray-900">
            <span className="text-[9px] text-gray-400 uppercase">EverMWh (V)</span>
            <span className="text-[11px] font-mono text-blue-400" style={monoStyle}>1,500 MWh</span>
          </div>
        </div>
      </div>

      <div className="flex-grow" />
      
      <div className="text-[7px] text-gray-700 uppercase text-center font-bold tracking-widest">
        Secured by BlackSlon Protocol
      </div>
    </div>
  )
}