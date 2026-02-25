'use client'

interface MarketPanelProps {
  currentPrice: number
  borderColor: string
  montserratStyle: React.CSSProperties
}

export default function MarketPanel({ currentPrice, borderColor, montserratStyle }: MarketPanelProps) {
  return (
    <div className={`flex flex-col flex-1 bg-[#0a0a0a] border border-yellow-500/50 rounded-xl p-6`} style={montserratStyle}>
      <h3 className="text-[12px] text-white font-bold tracking-[0.3em] mb-4">MARKET PANEL</h3>
      
      {/* PHYSICAL DIMENSION */}
      <div className="mb-6">
        <div className="text-[10px] text-white font-bold tracking-[0.2em] mb-3 border-b border-gray-700 pb-2">PHYSICAL DIMENSION</div>
        
        {/* Daily Anchor & BSTZ Corridor */}
        <div className="grid grid-cols-3 gap-4 mb-4">
          <div className="text-center">
            <div className="text-[8px] text-gray-400 mb-1">DAILY ANCHOR</div>
            <div className="text-green-400 text-lg font-mono">
              10.09
            </div>
          </div>
          <div className="text-center">
            <div className="text-[8px] text-gray-400 mb-1">BSTZ MAX</div>
            <div className="text-green-400 text-lg font-mono">
              11.10
            </div>
          </div>
          <div className="text-center">
            <div className="text-[8px] text-gray-400 mb-1">BSTZ MIN</div>
            <div className="text-green-400 text-lg font-mono">
              9.08
            </div>
          </div>
        </div>
        
        {/* System Stability */}
        <div className="text-center">
          <div className="text-[8px] text-gray-400 mb-1">SYSTEM STABILITY</div>
          <div className="text-blue-400 text-sm font-mono">
            Smoothing Factor Active
          </div>
        </div>
      </div>
      
      {/* Subtle line */}
      <hr className="border-gray-800 my-8" />
      
      {/* VIRTUAL DIMENSION */}
      <div className="mb-6">
        <div className="text-[10px] text-white font-bold tracking-[0.2em] mb-3 border-b border-gray-700 pb-2">VIRTUAL DIMENSION</div>
        
        {/* OVP DELTA Table */}
        <div className="mb-4">
          <div className="text-[8px] text-gray-400 mb-2 text-center">OVP DELTA</div>
          <div className="grid grid-cols-5 gap-1 text-[7px]">
            <div className="text-gray-500 text-center">TIMEFRAME</div>
            <div className="text-gray-500 text-center">1h</div>
            <div className="text-gray-500 text-center">4h</div>
            <div className="text-gray-500 text-center">24h</div>
            <div className="text-gray-500 text-center">7d</div>
            
            <div className="text-center">DELTA</div>
            <div className="text-center text-green-400">+2.4%</div>
            <div className="text-center text-green-400">+3.8%</div>
            <div className="text-center text-gray-400">+5.2%</div>
            <div className="text-center text-green-400">+12.4%</div>
          </div>
        </div>
        
        {/* BlackSlon Power Index */}
        <div className="text-center">
          <div className="text-[8px] text-gray-400 mb-1">BLACKSLON POWER INDEX</div>
          <div className="text-yellow-400 text-xl font-mono">
            {(currentPrice * 1.05).toFixed(2)}
          </div>
          <div className="text-[7px] text-gray-500">BSTZ Range Active</div>
        </div>
      </div>
      
      {/* Flex grow to make box full but not artificially stretched */}
      <div className="flex-grow"></div>
    </div>
  )
}
