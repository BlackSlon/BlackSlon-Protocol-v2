'use client'

interface VirtualDimensionProps {
  marketId: string
}

export default function VirtualDimension({ marketId }: VirtualDimensionProps) {
  return (
    <div className="flex flex-col h-full p-4 select-none bg-transparent">
      <div className="text-[10px] text-gray-500 uppercase tracking-[0.5em] font-bold text-center py-2 border-b border-gray-900 bg-black/40 mb-4">
        <span>VIRTUAL MARKET DIMENSION</span>
      </div>

      <div className="text-center mb-4">
        <div className="text-[10px] font-black tracking-widest uppercase mb-1 text-red-600">BLACKSLON POWER INDEX (BSPI)</div>
      </div>

      {/* ORDER BOOK */}
      <div className="bg-gray-950/40 rounded-sm border border-gray-900 overflow-hidden flex-grow">
        <div className="text-center mb-3 text-[8px] text-gray-600 uppercase tracking-[0.3em] border-b border-gray-900 pb-2">ORDER BOOK</div>
        
        {/* BUY ORDERS */}
        <div className="px-3 pb-2">
          <div className="text-[8px] text-green-500 font-bold mb-2 uppercase">BUY ORDERS</div>
          <div className="space-y-1">
            <div className="grid grid-cols-3 text-[9px] font-mono">
              <div className="text-gray-500">Price</div>
              <div className="text-gray-500 text-center">Volume</div>
              <div className="text-gray-500 text-right">Total</div>
            </div>
            <div className="grid grid-cols-3 text-[10px] text-green-500 hover:bg-green-500/10 py-1">
              <div>10.45</div>
              <div className="text-center">125.3</div>
              <div className="text-right font-bold">1,310.4</div>
            </div>
            <div className="grid grid-cols-3 text-[10px] text-green-500 hover:bg-green-500/10 py-1">
              <div>10.44</div>
              <div className="text-center">89.7</div>
              <div className="text-right font-bold">936.8</div>
            </div>
            <div className="grid grid-cols-3 text-[10px] text-green-500 hover:bg-green-500/10 py-1">
              <div>10.43</div>
              <div className="text-center">234.1</div>
              <div className="text-right font-bold">2,441.6</div>
            </div>
            <div className="grid grid-cols-3 text-[10px] text-green-500 hover:bg-green-500/10 py-1">
              <div>10.42</div>
              <div className="text-center">156.8</div>
              <div className="text-right font-bold">1,634.3</div>
            </div>
          </div>
        </div>

        {/* SPREAD */}
        <div className="mx-3 py-2 border-t border-b border-gray-800">
          <div className="text-center">
            <div className="text-[8px] text-gray-600 uppercase mb-1">Spread</div>
            <div className="text-[12px] font-bold text-yellow-400">10.42 - 10.45</div>
            <div className="text-[8px] text-gray-500">0.03 (0.29%)</div>
          </div>
        </div>

        {/* SELL ORDERS */}
        <div className="px-3 pt-2">
          <div className="text-[8px] text-red-500 font-bold mb-2 uppercase">SELL ORDERS</div>
          <div className="space-y-1">
            <div className="grid grid-cols-3 text-[9px] font-mono">
              <div className="text-gray-500">Price</div>
              <div className="text-gray-500 text-center">Volume</div>
              <div className="text-gray-500 text-right">Total</div>
            </div>
            <div className="grid grid-cols-3 text-[10px] text-red-500 hover:bg-red-500/10 py-1">
              <div>10.46</div>
              <div className="text-center">98.5</div>
              <div className="text-right font-bold">1,030.1</div>
            </div>
            <div className="grid grid-cols-3 text-[10px] text-red-500 hover:bg-red-500/10 py-1">
              <div>10.47</div>
              <div className="text-center">167.2</div>
              <div className="text-right font-bold">1,751.6</div>
            </div>
            <div className="grid grid-cols-3 text-[10px] text-red-500 hover:bg-red-500/10 py-1">
              <div>10.48</div>
              <div className="text-center">203.8</div>
              <div className="text-right font-bold">2,135.5</div>
            </div>
            <div className="grid grid-cols-3 text-[10px] text-red-500 hover:bg-red-500/10 py-1">
              <div>10.49</div>
              <div className="text-center">145.6</div>
              <div className="text-right font-bold">1,527.4</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}