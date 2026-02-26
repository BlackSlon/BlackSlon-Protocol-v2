'use client'

import { useState } from 'react'

export default function TradingPanel() {
  const [side, setSide] = useState<'BUY' | 'SELL'>('BUY')
  const [price, setPrice] = useState<string>('10.59') // Tu wpisujesz cenę zamiast żółtego BSEI
  const [amount, setAmount] = useState<string>('100')

  const monoStyle = { fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace' }

  // Mock data for the Order Book part inside this panel
  const orderBook = {
    asks: [ { p: 10.75, v: 250 }, { p: 10.68, v: 180 }, { p: 10.62, v: 90 } ],
    bids: [ { p: 10.55, v: 120 }, { p: 10.48, v: 310 }, { p: 10.40, v: 450 } ]
  }

  return (
    <div className="flex flex-col h-full select-none text-white font-sans">
      {/* HEADER */}
      <div className="text-center mb-2 border-b border-gray-900 pb-1">
        <span className="text-[9px] tracking-[0.3em] text-gray-400 uppercase font-bold">Trading & Order Book</span>
      </div>

      <div className="text-center mb-4">
        <span className="text-[10px] text-red-600 font-bold tracking-widest uppercase">Execution Zone</span>
      </div>

      {/* ORDER BOOK VISUALIZER (The 35% depth part) */}
      <div className="flex-grow flex flex-col mb-6 bg-black/20 rounded-sm border border-gray-900 overflow-hidden">
        <div className="grid grid-cols-2 text-[8px] text-gray-600 uppercase font-bold p-2 border-b border-gray-900">
          <span>Price (EUR)</span>
          <span className="text-right">Volume (MW)</span>
        </div>
        
        {/* ASKS */}
        <div className="flex flex-col-reverse">
          {orderBook.asks.map((ask, i) => (
            <div key={i} className="grid grid-cols-2 px-3 py-1 text-[11px] font-mono hover:bg-red-500/5 transition-colors" style={monoStyle}>
              <span className="text-red-500">{ask.p.toFixed(2)}</span>
              <span className="text-right text-gray-400">{ask.v}</span>
            </div>
          ))}
        </div>

        {/* INPUT PRICE ZONE (Replacing the old yellow BSEI) */}
        <div className="bg-gray-950 border-y border-gray-800 p-4 my-1">
          <div className="flex flex-col gap-2">
            <label className="text-[9px] text-gray-500 uppercase font-bold tracking-wider">Set Your Limit Price</label>
            <div className="flex items-center gap-4">
               <input 
                type="number" 
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="bg-black border border-red-900/50 text-2xl font-bold text-white font-mono w-full p-2 outline-none focus:border-red-600 transition-all"
                style={monoStyle}
              />
              <div className="flex flex-col">
                <span className="text-[10px] text-yellow-500 font-bold">EUR</span>
                <span className="text-[7px] text-gray-600 uppercase">Limit</span>
              </div>
            </div>
          </div>
        </div>

        {/* BIDS */}
        <div className="flex flex-col">
          {orderBook.bids.map((bid, i) => (
            <div key={i} className="grid grid-cols-2 px-3 py-1 text-[11px] font-mono hover:bg-green-500/5 transition-colors" style={monoStyle}>
              <span className="text-green-500">{bid.p.toFixed(2)}</span>
              <span className="text-right text-gray-400">{bid.v}</span>
            </div>
          ))}
        </div>
      </div>

      {/* EXECUTION CONTROLS */}
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-1 bg-black p-1 border border-gray-900">
          <button onClick={() => setSide('BUY')} className={`py-2 text-[10px] font-bold uppercase transition-all ${side === 'BUY' ? 'bg-green-600/20 text-green-500 border border-green-600/50' : 'text-gray-600'}`}>Buy</button>
          <button onClick={() => setSide('SELL')} className={`py-2 text-[10px] font-bold uppercase transition-all ${side === 'SELL' ? 'bg-red-600/20 text-red-500 border border-red-600/50' : 'text-gray-600'}`}>Sell</button>
        </div>

        <div>
          <label className="text-[8px] text-gray-500 uppercase font-bold mb-1 block">Volume (MWh)</label>
          <input 
            type="number" 
            value={amount} 
            onChange={(e) => setAmount(e.target.value)}
            className="w-full bg-black border border-gray-900 p-3 text-sm font-mono text-white outline-none focus:border-red-600"
            style={monoStyle}
          />
        </div>

        <button className={`w-full py-4 text-[11px] font-bold uppercase tracking-[0.2em] transition-all border ${side === 'BUY' ? 'bg-green-600 hover:bg-green-500 border-green-400 text-white' : 'bg-red-700 hover:bg-red-600 border-red-500 text-white'}`}>
          Confirm {side} Order
        </button>
      </div>
    </div>
  )
}