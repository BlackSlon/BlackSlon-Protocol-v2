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
    <div className="flex flex-col h-full bg-black font-mono text-white overflow-hidden border border-gray-800">
      
      {/* 1. KATEGORIA RYNKU */}
      <div className="text-[10px] text-gray-600 uppercase tracking-[0.6em] font-bold text-center py-2 border-b border-gray-800 bg-black">
        VIRTUAL MARKET DIMENSION
      </div>

      {/* 2. TYTUŁ INSTRUMENTU (Czerwony) */}
      <div className="p-4 border-b border-gray-800 bg-gradient-to-b from-black to-gray-950">
        <div className="text-[12px] tracking-widest text-red-600 italic mb-1">
          BlackSlon Power Poland
        </div>
        <div className="flex justify-between items-center mt-2">
          <div className="flex gap-4">
            <span className="text-[10px] text-gray-500 uppercase font-bold tracking-tighter">Instrument: <span className="text-gray-300">BS-P-PL</span></span>
            <span className="text-[10px] text-gray-500 uppercase font-bold tracking-tighter">Status: <span className="text-green-500 animate-pulse font-black">LIVE</span></span>
          </div>
        </div>
      </div>

      {/* 3. LAST TICKER (Żółty) */}
      <div className="mb-3 p-3 border border-yellow-500/40 bg-yellow-500/5 rounded-sm">
        <div className="text-[10px] text-yellow-500 tracking-widest uppercase mb-2 text-center">
          LAST DEAL
        </div>
        <div className="flex flex-col items-center">
          <div className="flex items-center mb-2">
            <span className="text-[7px] text-gray-500 uppercase mr-2">LAST PRICE:</span>
            <span className="text-xl text-yellow-500">10.59</span>
            <span className="text-[8px] text-gray-500 ml-1">Eur/100kWh</span>
          </div>
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center">
              <span className="text-[7px] text-gray-500 uppercase mr-2">VOLUME:</span>
              <span className="text-sm text-gray-400">1500</span>
              <span className="text-[8px] text-gray-500 ml-1">kWh</span>
            </div>
            <div className="flex items-center">
              <span className="text-[7px] text-gray-500 uppercase mr-2">UNIT:</span>
              <span className="text-sm text-gray-400">15</span>
              <span className="text-[8px] text-gray-500 ml-1">BS-P-PL</span>
            </div>
          </div>
        </div>
      </div>

      {/* 4. MAIN ORDER BOOK GRID (Thin Lines) */}
      <div className="flex-grow flex min-h-0">
        
        {/* BUY SIDE */}
        <div className="flex-1 flex flex-col border-r border-gray-800">
          <div className="py-2 px-4 border-b border-gray-800 bg-green-950/20">
            <span className="text-[11px] text-green-500 tracking-widest">BUY ORDERS</span>
          </div>
          <div className="grid grid-cols-3 text-[7px] text-gray-500 uppercase font-bold px-4 py-2 border-b border-gray-800 bg-black">
            <div>VOLUME (kWh)</div>
            <div className="text-center">UNIT (BS-P-PL)</div>
            <div className="text-right">PRICE (Eur/100kWh)</div>
          </div>
          <div className="flex-grow overflow-hidden">
            {buyOrders.map((o, i) => (
              <div key={i} className="grid grid-cols-3 py-3 px-4 border-b border-gray-900/50 hover:bg-green-500/10 transition-all group">
                <div className="text-sm text-gray-400 self-center">{o.volume.toLocaleString()}</div>
                <div className="text-center text-green-500 text-sm self-center">{o.unit}</div>
                <div className="text-right text-xl text-green-500 tracking-tighter leading-none self-center">{o.price.toFixed(2)}</div>
              </div>
            ))}
          </div>
        </div>

        {/* SELL SIDE */}
        <div className="flex-1 flex flex-col">
          <div className="py-2 px-4 border-b border-gray-800 bg-red-950/20 text-right">
            <span className="text-[11px] text-red-500 tracking-widest">SELL ORDERS</span>
          </div>
          <div className="grid grid-cols-3 text-[7px] text-gray-500 uppercase font-bold px-4 py-2 border-b border-gray-800 bg-black">
            <div>PRICE (Eur/100kWh)</div>
            <div className="text-center">UNIT (BS-P-PL)</div>
            <div className="text-right">VOLUME (kWh)</div>
          </div>
          <div className="flex-grow overflow-hidden">
            {sellOrders.map((o, i) => (
              <div key={i} className="grid grid-cols-3 py-3 px-4 border-b border-gray-900/50 hover:bg-red-500/10 transition-all group">
                <div className="text-xl text-red-500 tracking-tighter leading-none self-center">{o.price.toFixed(2)}</div>
                <div className="text-center text-red-500 text-sm self-center">{o.unit}</div>
                <div className="text-right text-gray-400 text-sm self-center">{o.volume.toLocaleString()}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 5. FOOTER: BSEI & TURNOVER */}
      <div className="grid grid-cols-2 border-t border-gray-800 bg-black py-4 px-6">
        <div className="flex flex-col border-r border-gray-800 pr-6">
          <div className="text-[9px] text-gray-600 uppercase font-bold mb-1 tracking-widest">BSEI-PL Index</div>
          <div className="text-4xl font-black text-white italic tracking-tighter flex items-baseline gap-2">
            10.59 <span className="text-[10px] text-gray-600 not-italic font-normal">EUR/100vkWh</span>
          </div>
        </div>
        <div className="pl-6 flex flex-col justify-center">
          <div className="text-[9px] text-gray-600 uppercase font-bold mb-1 tracking-widest">Daily Turnover</div>
          <div className="flex justify-between items-baseline">
            <span className="text-yellow-600 font-black text-lg">124,500.00 €BSR</span>
            <span className="text-blue-500/60 text-[11px] font-bold">1,245,000 kWh</span>
          </div>
        </div>
      </div>
    </div>
  )
}