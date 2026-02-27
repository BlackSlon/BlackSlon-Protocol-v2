'use client'

interface VirtualDimensionProps {
  marketId: string
}

export default function VirtualDimension({ marketId }: VirtualDimensionProps) {
  return (
    <div className="flex flex-col h-full p-4 select-none bg-transparent space-y-6">
      <div className="text-[10px] text-gray-500 uppercase tracking-[0.5em] font-bold text-center py-2 border-b border-gray-900 bg-black/40 mb-4">
        <span>VIRTUAL MARKET DIMENSION</span>
      </div>

      <div className="text-center mb-4">
        <div className="text-[10px] font-black tracking-widest uppercase mb-1 text-red-600">BLACKSLON POWER INDEX (BSPI)</div>
      </div>

      <div className="bg-black border border-gray-900 p-4 rounded-sm relative overflow-hidden shrink-0">
        <div className="text-center mb-4 text-[8px] text-gray-600 uppercase tracking-[0.3em]">System Power Pressure</div>
        <div className="flex items-center justify-center gap-4 py-4">
           <div className="w-8 h-40 bg-gray-900 rounded-full relative border border-gray-800 p-1">
              <div className="absolute bottom-0 left-1 right-1 bg-gradient-to-t from-blue-600 to-yellow-400 rounded-full transition-all duration-1000" style={{ height: '65%' }}>
                 <div className="absolute top-0 left-0 right-0 h-1 bg-white shadow-[0_0_10px_white]" />
              </div>
           </div>
           <div className="flex flex-col items-start">
              <span className="text-[10px] text-gray-500 font-bold uppercase tracking-tighter">Current BSPI</span>
              <span className="text-3xl font-bold text-white font-mono">+4.12</span>
              <span className="text-[8px] text-green-500 font-bold italic">BULLISH BIAS</span>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <div className="bg-gray-950/40 p-2 border border-gray-900 rounded-sm">
           <span className="text-[8px] text-gray-600 uppercase block mb-1 tracking-widest leading-none">LVOP Delta (Longs)</span>
           <span className="text-lg font-bold text-green-500 font-mono">+2.34</span>
        </div>
        <div className="bg-gray-950/40 p-2 border border-gray-900 rounded-sm">
           <span className="text-[8px] text-gray-600 uppercase block mb-1 tracking-widest leading-none">SVOP Delta (Shorts)</span>
           <span className="text-lg font-bold text-red-500 font-mono">-1.87</span>
        </div>
      </div>
    </div>
  )
}