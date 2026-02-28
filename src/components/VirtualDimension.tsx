'use client'
import React from 'react'

export default function VirtualDimension({ marketId }: { marketId: string }) {
  const buyOrders = [
    { price: 10.55, unit: 150, volume: 15000 },
    { price: 10.54, unit: 120, volume: 12000 },
    { price: 10.53, unit: 180, volume: 18000 },
    { price: 10.52, unit: 95, volume: 9500 },
    { price: 10.51, unit: 200, volume: 20000 }
  ]

  const sellOrders = [
    { price: 10.60, unit: 110, volume: 11000 },
    { price: 10.61, unit: 85, volume: 8500 },
    { price: 10.62, unit: 140, volume: 14000 },
    { price: 10.63, unit: 75, volume: 7500 },
    { price: 10.64, unit: 160, volume: 16000 }
  ]

  const maxVol = Math.max(...buyOrders.map(o => o.volume), ...sellOrders.map(o => o.volume))

  return (
    <div className="flex flex-col h-full bg-black font-mono text-white overflow-hidden border border-gray-800 shadow-2xl">
      
      {/* 1. HEADER SEPARATOR */}
      <div className="text-[10px] text-gray-600 uppercase tracking-[0.6em] font-bold text-center py-2 border-b border-gray-800 bg-black">
        VIRTUAL MARKET DIMENSION
      </div>

      {/* 2. INSTRUMENT & STATUS (Thin Grid) */}
      <div className="grid grid-cols-2 border-b border-gray-800">
        <div className="p-4 border-r border-gray-800">
          <div className="text-[9px] text-gray-500 uppercase mb-1">Instrument</div>
          <div className="text-2xl font-black text-red-600 tracking-tighter italic">
            BS-P-PL <span className="text-[10px] text-gray-400 not-italic ml-2 font-normal">PERPETUAL</span>
          </div>
        </div>
        <div className="p-4 flex flex-col justify-center items-end">
          <div className="text-[9px] text-gray-500 uppercase mb-1">Market Status</div>
          <div className="text-[11px] text-green-500 font-bold tracking-widest flex items-center gap-2">
            <span className="animate-pulse opacity-75">●</span> LIVE_FEED
          </div>
        </div>
      </div>

      {/* 3. TICKER BAR (Yellow Highlights) */}
      <div className="grid grid-cols-3 border-b border-gray-800 bg-gray-900/10">
        <div className="p-3 border-r border-gray-800 text-center">
          <div className="text-[8px] text-gray-600 uppercase mb-1">Last Price</div>
          <div className="text-2xl font-black text-yellow-500">10.59</div>
        </div>
        <div className="p-3 border-r border-gray-800 text-center">
          <div className="text-[8px] text-gray-600 uppercase mb-1">24h Vol (kWh)</div>
          <div className="text-2xl font-black text-yellow-500">1.25M</div>
        </div>
        <div className="p-3 text-center">
          <div className="text-[8px] text-gray-600 uppercase mb-1">Change</div>
          <div className="text-2xl font-black text-green-500">+4.2%</div>
        </div>
      </div>

      {/* 4. MAIN ORDER BOOK (Split with Thin Center Line) */}
      <div className="flex-grow flex min-h-0">
        
        {/* BUY SIDE */}
        <div className="flex-1 flex flex-col border-r border-gray-800">
          <div className="py-2 px-4 border-b border-gray-800 bg-green-950/10">
            <span className="text-[11px] text-green-500 font-black tracking-widest">BUY ORDERS</span>
          </div>
          <div className="grid grid-cols-3 text-[7px] text-gray-500 uppercase font-bold px-4 py-2 border-b border-gray-800">
            <div>Price <span className="text-gray-700 font-normal">/100kWh</span></div>
            <div className="text-center">Unit <span className="text-gray-700 font-normal">/BS-P-PL</span></div>
            <div className="text-right">Volume <span className="text-gray-700 font-normal">/kWh</span></div>
          </div>
          <div className="flex-grow overflow-hidden">
            {buyOrders.map((o, i) => (
              <div key={i} className="grid grid-cols-3 text-[22px] py-2 px-4 border-b border-gray-900/50 hover:bg-green-500/5 transition-all group">
                <div className="text-green-500 font-black tracking-tighter leading-none">{o.price.toFixed(2)}</div>
                <div className="text-center text-gray-400 text-xs self-center">{o.unit}</div>
                <div className="text-right text-green-400/60 font-bold text-xs self-center">{o.volume.toLocaleString()}</div>
              </div>
            ))}
          </div>
        </div>

        {/* SELL SIDE */}
        <div className="flex-1 flex flex-col">
          <div className="py-2 px-4 border-b border-gray-800 bg-red-950/10 text-right">
            <span className="text-[11px] text-red-500 font-black tracking-widest">SELL ORDERS</span>
          </div>
          <div className="grid grid-cols-3 text-[7px] text-gray-500 uppercase font-bold px-4 py-2 border-b border-gray-800">
            <div>Price <span className="text-gray-700 font-normal">/100kWh</span></div>
            <div className="text-center">Unit <span className="text-gray-700 font-normal">/BS-P-PL</span></div>
            <div className="text-right">Volume <span className="text-gray-700 font-normal">/kWh</span></div>
          </div>
          <div className="flex-grow overflow-hidden">
            {sellOrders.map((o, i) => (
              <div key={i} className="grid grid-cols-3 text-[22px] py-2 px-4 border-b border-gray-900/50 hover:bg-red-500/5 transition-all group">
                <div className="text-red-500 font-black tracking-tighter leading-none">{o.price.toFixed(2)}</div>
                <div className="text-center text-gray-400 text-xs self-center">{o.unit}</div>
                <div className="text-right text-red-400/60 font-bold text-xs self-center">{o.volume.toLocaleString()}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 5. FOOTER GRID (BSEI & TURNOVER) */}
      <div className="grid grid-cols-2 border-t border-gray-800 bg-gray-950/50">
        <div className="p-4 border-r border-gray-800">
          <div className="text-[9px] text-gray-600 uppercase font-bold mb-1">BSEI-PL Index</div>
          <div className="text-3xl font-black text-white italic tracking-tighter">10.59 <span className="text-[10px] text-gray-600 not-italic">EUR</span></div>
        </div>
        <div className="p-4 flex flex-col justify-center">
          <div className="text-[9px] text-gray-600 uppercase font-bold mb-1">Daily Turnover</div>
          <div className="flex justify-between items-baseline">
            <span className="text-yellow-600 font-bold text-sm">124,500.00 €BSR</span>
            <span className="text-blue-500/60 text-[10px]">1,245,000 kWh</span>
          </div>
        </div>
      </div>
    </div>
  )
}