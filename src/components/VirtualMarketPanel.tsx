'use client'
import React from 'react'

export default function VirtualDimension({ marketId }: { marketId: string }) {
  const buyOrders = [
    { price: 10.55, unit: 150, volume: 15000 },
    { price: 10.54, unit: 120, volume: 12000 },
    { price: 10.53, unit: 180, volume: 18000 },
    { price: 10.52, unit: 95, volume: 9500 },
    { price: 10.51, unit: 200, volume: 20000 },
    { price: 10.50, unit: 135, volume: 13500 },
    { price: 10.49, unit: 165, volume: 16500 },
    { price: 10.48, unit: 110, volume: 11000 }
  ]

  const sellOrders = [
    { price: 10.60, unit: 110, volume: 11000 },
    { price: 10.61, unit: 85, volume: 8500 },
    { price: 10.62, unit: 140, volume: 14000 },
    { price: 10.63, unit: 75, volume: 7500 },
    { price: 10.64, unit: 160, volume: 16000 },
    { price: 10.65, unit: 125, volume: 12500 },
    { price: 10.66, unit: 190, volume: 19000 },
    { price: 10.67, unit: 105, volume: 10500 }
  ]

  const maxVol = Math.max(...buyOrders.map(o => o.volume), ...sellOrders.map(o => o.volume))

  // Function to format volume with spaces
  const formatVolume = (vol: number) => {
    return vol.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ')
  }

  return (
    <div className="flex flex-col h-full bg-black font-mono text-white p-0">
      
      <div className="w-full pt-3 pb-2 flex flex-col items-center shrink-0">
        <div className="text-[10px] text-gray-500 uppercase tracking-[0.5em] font-bold">
          Virtual Market Panel
        </div>
        <div className="w-[80%] border-b border-gray-800 mt-2" />
      </div>

      <div className="flex-grow px-6 pb-6 flex flex-col min-h-0 sm:px-2">
        {/* 2. TYTUŁ ORDER BOOK (Brązowy) */}
        <div className="p-4 bg-gradient-to-b from-black to-gray-950 w-full sm:p-4">
          <div className="text-[10px] tracking-widest text-amber-700 font-bold mb-1">
            BlackSlon Order Book
          </div>
          <div className="flex justify-between items-center">
            <div className="flex gap-4">
              <span className="text-[10px] text-gray-500 uppercase font-normal">Instrument: <span className="text-yellow-500">BS-P-PL</span></span>
              <span className="text-[10px] text-gray-500 uppercase font-normal">Status: <span className="text-green-500 animate-pulse font-black">LIVE</span></span>
            </div>
          </div>
        </div>

      
      {/* 3. LAST DEAL FRAME */}
      <div className="mb-3 mx-3 p-3 border border-yellow-500/40 bg-yellow-500/5 rounded-sm">
        <div className="flex items-center justify-between px-2">
          <div className="flex items-center">
            <span className="text-[7px] text-gray-500 uppercase mr-2">LAST PRICE:</span>
            <span className="text-xl text-yellow-500 tracking-tighter leading-none">10.59</span>
            <span className="text-[8px] text-gray-500 ml-1">EUR/100kWh</span>
          </div>
          <div className="flex items-center">
            <span className="text-[7px] text-gray-500 uppercase mr-2">UNIT:</span>
            <span className="text-sm text-gray-400">10</span>
            <span className="text-[8px] text-gray-500 ml-1">BS-P-PL</span>
          </div>
          <div className="flex items-center">
            <span className="text-[7px] text-gray-500 uppercase mr-2">VOLUME:</span>
            <span className="text-sm text-gray-400">1</span>
            <span className="text-[8px] text-gray-500 ml-1">MWh</span>
          </div>
        </div>
      </div>
      
      {/* 4. MAIN ORDER BOOK GRID (Thin Lines) */}
      <div className="flex-grow flex min-h-0 overflow-hidden">
        
        {/* BUY SIDE */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="py-2 px-4 border-b border-gray-800 bg-green-950/20">
            <span className="text-[11px] text-green-500 tracking-widest">BUY ORDERS</span>
          </div>
          <div className="grid grid-cols-3 text-[7px] text-gray-500 uppercase font-normal px-4 py-2 border-b border-gray-800 bg-black">
            <div className="text-center">
              <div>VOLUME</div>
              <div className="text-gray-600">(kWh)</div>
            </div>
            <div className="text-center">
              <div>UNIT</div>
              <div className="text-gray-600">(BS-P-PL)</div>
            </div>
            <div className="text-right">
              <div>PRICE</div>
              <div className="text-gray-600">(EUR/100kWh)</div>
            </div>
          </div>
          <div className="flex-grow overflow-hidden">
            {buyOrders.map((o, i) => (
              <div key={i} className={i === 0 ? "grid grid-cols-3 py-2 px-4 border-b border-gray-900/50 hover:bg-green-500/10 transition-all group" : "grid grid-cols-3 py-0.5 px-4 border-b border-gray-900/50 hover:bg-green-500/10 transition-all group"}>
                <div className={i === 0 ? "text-[11px] text-gray-400 self-center" : "text-[11px] text-gray-400 self-center"}>{formatVolume(o.volume)}</div>
                <div className={i === 0 ? "text-center text-green-500 text-[11px] self-center" : "text-center text-green-500 text-[11px] self-center"}>{o.unit}</div>
                <div className={i === 0 ? "text-2xl text-green-500 tracking-tighter leading-none text-right self-center lg:text-xl md:text-lg sm:text-sm" : "text-right text-[11px] text-green-500 self-center"}>{o.price.toFixed(2)}</div>
              </div>
            ))}
          </div>
        </div>

        {/* SELL SIDE */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="py-2 px-4 border-b border-gray-800 bg-red-950/20 text-right">
            <span className="text-[11px] text-red-500 tracking-widest">SELL ORDERS</span>
          </div>
          <div className="grid grid-cols-3 text-[7px] text-gray-500 uppercase font-normal px-4 py-2 border-b border-gray-800 bg-black">
            <div className="text-left">
              <div>PRICE</div>
              <div className="text-gray-600">(EUR/100kWh)</div>
            </div>
            <div className="text-center">
              <div>UNIT</div>
              <div className="text-gray-600">(BS-P-PL)</div>
            </div>
            <div className="text-right">
              <div>VOLUME</div>
              <div className="text-gray-600">(kWh)</div>
            </div>
          </div>
          <div className="flex-grow overflow-hidden">
            {sellOrders.map((o, i) => (
              <div key={i} className={i === 0 ? "grid grid-cols-3 py-2 px-4 border-b border-gray-900/50 hover:bg-red-500/10 transition-all group" : "grid grid-cols-3 py-0.5 px-4 border-b border-gray-900/50 hover:bg-red-500/10 transition-all group"}>
                <div className={i === 0 ? "text-2xl text-red-500 tracking-tighter leading-none self-center lg:text-xl md:text-lg sm:text-sm" : "text-left text-[11px] text-red-500 self-center"}>{o.price.toFixed(2)}</div>
                <div className={i === 0 ? "text-center text-red-500 text-[11px] self-center" : "text-center text-red-500 text-[11px] self-center"}>{o.unit}</div>
                <div className={i === 0 ? "text-right text-[11px] text-gray-400 self-center" : "text-right text-[11px] text-gray-400 self-center"}>{formatVolume(o.volume)}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 5. BLACKSLON ENERGY INDEX BS-P-PL */}
      <div className="px-6 py-4 border-t border-gray-800 bg-black sm:px-2">
        <div className="text-[10px] tracking-widest text-amber-700 font-bold mb-3">
          BlackSlon Energy Index BS-P-PL
        </div>
        <div className="flex justify-between items-center font-mono overflow-hidden">
          {/* D-1 */}
          <div className="flex flex-col items-center text-center flex-shrink-0">
            <span className="text-[9px] text-gray-500">D-1</span>
            <span className="text-[11px] text-gray-400 sm:text-[10px]">10.59</span>
            <span className="text-[9px] text-green-500">+4.2%</span>
          </div>
          
          {/* W-1 */}
          <div className="flex flex-col items-center text-center border-r border-gray-900 px-4 flex-shrink-0 sm:px-2">
            <span className="text-[9px] text-gray-500">W-1</span>
            <span className="text-[11px] text-gray-400 sm:text-[10px]">10.72</span>
            <span className="text-[9px] text-green-500">+3.1%</span>
          </div>
          
          {/* M-1 */}
          <div className="flex flex-col items-center text-center border-r border-gray-900 px-4 flex-shrink-0 sm:px-2">
            <span className="text-[9px] text-gray-500">M-1</span>
            <span className="text-[11px] text-gray-400 sm:text-[10px]">10.85</span>
            <span className="text-[9px] text-green-500">+2.4%</span>
          </div>
          
          {/* Q-1 */}
          <div className="flex flex-col items-center text-center border-r border-gray-900 px-4 flex-shrink-0 sm:px-2">
            <span className="text-[9px] text-gray-500">Q-1</span>
            <span className="text-[11px] text-gray-400 sm:text-[10px]">10.95</span>
            <span className="text-[9px] text-green-500">+1.8%</span>
          </div>
          
          {/* H-1 */}
          <div className="flex flex-col items-center text-center border-r border-gray-900 px-4 flex-shrink-0 sm:px-2">
            <span className="text-[9px] text-gray-500">H-1</span>
            <span className="text-[11px] text-gray-400 sm:text-[10px]">11.02</span>
            <span className="text-[9px] text-green-500">+1.2%</span>
          </div>
          
          {/* Y-1 */}
          <div className="flex flex-col items-center text-center flex-shrink-0">
            <span className="text-[9px] text-gray-500">Y-1</span>
            <span className="text-[11px] text-gray-400 sm:text-[10px]">9.87</span>
            <span className="text-[9px] text-green-500">+5.8%</span>
          </div>
        </div>
      </div>

      {/* 6. BLACKSLON LIQUIDITY */}
      <div className="px-6 py-4 border-t border-gray-800 bg-black sm:px-2">
        <div className="text-[10px] tracking-widest text-amber-700 font-bold mb-3">
          BlackSlon Liquidity
        </div>
        <div className="flex justify-between items-center font-mono overflow-hidden">
          {/* D-1 */}
          <div className="flex flex-col items-center text-center flex-shrink-0">
            <span className="text-[9px] text-gray-500">D-1</span>
            <span className="text-[11px] text-gray-400 sm:text-[10px]">1,245</span>
            <span className="text-[7px] text-gray-600">MWh</span>
          </div>
          
          {/* W-1 */}
          <div className="flex flex-col items-center text-center border-r border-gray-900 px-4 flex-shrink-0 sm:px-2">
            <span className="text-[9px] text-gray-500">W-1</span>
            <span className="text-[11px] text-gray-400 sm:text-[10px]">8,715</span>
            <span className="text-[7px] text-gray-600">MWh</span>
          </div>
          
          {/* M-1 */}
          <div className="flex flex-col items-center text-center border-r border-gray-900 px-4 flex-shrink-0 sm:px-2">
            <span className="text-[9px] text-gray-500">M-1</span>
            <span className="text-[11px] text-gray-400 sm:text-[10px]">37,440</span>
            <span className="text-[7px] text-gray-600">MWh</span>
          </div>
          
          {/* Q-1 */}
          <div className="flex flex-col items-center text-center border-r border-gray-900 px-4 flex-shrink-0 sm:px-2">
            <span className="text-[9px] text-gray-500">Q-1</span>
            <span className="text-[11px] text-gray-400 sm:text-[10px]">112,320</span>
            <span className="text-[7px] text-gray-600">MWh</span>
          </div>
          
          {/* H-1 */}
          <div className="flex flex-col items-center text-center border-r border-gray-900 px-4 flex-shrink-0 sm:px-2">
            <span className="text-[9px] text-gray-500">H-1</span>
            <span className="text-[11px] text-gray-400 sm:text-[10px]">224,640</span>
            <span className="text-[7px] text-gray-600">MWh</span>
          </div>
          
          {/* Y-1 */}
          <div className="flex flex-col items-center text-center flex-shrink-0">
            <span className="text-[9px] text-gray-500">Y-1</span>
            <span className="text-[11px] text-gray-400 sm:text-[10px]">449,280</span>
            <span className="text-[7px] text-gray-600">MWh</span>
          </div>
        </div>
      </div>
      </div>
    </div>
  )
}