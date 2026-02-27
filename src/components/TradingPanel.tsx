'use client'

import { useState } from 'react'
import { useParams } from 'next/navigation'

export default function TradingPanel() {
  const params = useParams()
  const marketId = (params.id as string) || 'IPT-P-PL'
  const monoStyle = { fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace' }

  const [price, setPrice] = useState('10.59')
  const [quantity, setQuantity] = useState(100)
  const [side, setSide] = useState<'BUY' | 'SELL'>('BUY')

  return (
    <div className="flex flex-col h-full p-8 select-none font-sans">
      <div className="text-center mb-6 border-b border-gray-900 pb-3">
        <span className="text-[10px] text-gray-500 uppercase tracking-[0.5em] font-bold">Trading Panel</span>
      </div>

      <div className="text-center mb-6">
        <span className="text-[13px] text-red-600 font-bold tracking-[0.2em] uppercase">
          INSTRUMENT: {marketId}
        </span>
      </div>

      {/* YELLOW LIMIT PRICE INPUT */}
      <div className="flex flex-col items-center mb-8">
        <div className="flex items-baseline gap-2">
          <input 
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="bg-transparent text-6xl font-bold text-yellow-500 font-mono w-64 text-center outline-none border-b-2 border-transparent focus:border-yellow-500/10 transition-all"
            style={monoStyle}
          />
          <span className="text-xs text-yellow-600/40 font-bold font-mono" style={monoStyle}>EUR</span>
        </div>
        <span className="text-[8px] text-gray-700 uppercase font-bold mt-3 tracking-widest">Set Limit Price</span>
      </div>

      {/* TWO-COLUMN LAYOUT */}
      <div className="grid grid-cols-2 gap-4 mb-8">
        {/* LEFT COLUMN - Quantity & Side */}
        <div className="flex flex-col">
          {/* Quantity */}
          <div className="mb-6">
            <div className="text-center mb-3">
              <span className="text-[8px] text-gray-600 uppercase font-bold tracking-widest opacity-60">Quantity (MWh)</span>
            </div>
            <div className="flex justify-center items-center gap-3">
              <button onClick={() => setQuantity(q => Math.max(0, q - 10))} className="w-10 h-10 border border-gray-800 rounded text-gray-500 hover:text-white transition-all text-lg">-</button>
              <input 
                type="number" 
                value={quantity} 
                onChange={(e) => setQuantity(parseInt(e.target.value) || 0)}
                className="bg-black border border-gray-800 text-center w-24 py-2 font-mono text-xl text-white outline-none focus:border-yellow-600/30" 
                style={monoStyle}
              />
              <button onClick={() => setQuantity(q => q + 10)} className="w-10 h-10 border border-gray-800 rounded text-gray-500 hover:text-white transition-all text-lg">+</button>
            </div>
          </div>

          {/* Buy/Sell Buttons */}
          <div className="grid grid-cols-2 gap-2">
            <button 
              onClick={() => setSide('BUY')}
              className={`py-3 border-2 font-bold uppercase tracking-widest text-[8px] transition-all ${
                side === 'BUY' ? 'border-green-600 bg-green-600/5 text-green-500' : 'border-gray-900 text-gray-700'
              }`}
            >
              Buy
            </button>
            <button 
              onClick={() => setSide('SELL')}
              className={`py-3 border-2 font-bold uppercase tracking-widest text-[8px] transition-all ${
                side === 'SELL' ? 'border-red-600 bg-red-600/5 text-red-500' : 'border-gray-900 text-gray-700'
              }`}
            >
              Sell
            </button>
          </div>
        </div>

        {/* RIGHT COLUMN - Order Summary */}
        <div className="flex flex-col bg-[#0a0a0a] border border-gray-900/50 p-4 rounded-sm">
          <div className="text-center mb-3">
            <span className="text-[8px] text-gray-600 uppercase font-bold tracking-widest">Order Summary</span>
          </div>
          
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-[7px] text-gray-600 uppercase font-bold">Type</span>
              <span className={`text-[8px] font-bold uppercase ${side === 'BUY' ? 'text-green-500' : 'text-red-500'}`}>
                {side}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-[7px] text-gray-600 uppercase font-bold">Price</span>
              <span className="text-[8px] font-mono text-yellow-500 font-bold" style={monoStyle}>
                {price} EUR
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-[7px] text-gray-600 uppercase font-bold">Quantity</span>
              <span className="text-[8px] font-mono text-white font-bold" style={monoStyle}>
                {quantity} MWh
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-[7px] text-gray-600 uppercase font-bold">Total</span>
              <span className="text-[8px] font-mono text-white font-bold" style={monoStyle}>
                {(parseFloat(price) * quantity).toFixed(2)} EUR
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* MARGIN BLOCK - COMPACT */}
      <div className="mt-auto bg-[#0a0a0a] border border-yellow-600/10 p-4 rounded-sm">
        <div className="flex justify-between items-center mb-4">
          <div className="flex flex-col">
            <span className="text-[8px] text-gray-600 uppercase font-bold tracking-widest mb-1">Margin Required</span>
            <span className="text-2xl font-bold text-yellow-600 font-mono" style={monoStyle}>45%</span>
          </div>
          <div className="text-right">
             <span className="text-[8px] text-gray-500 uppercase font-bold block mb-1">Status</span>
             <span className="text-[7px] text-blue-500 font-bold uppercase tracking-[0.2em] animate-pulse">Ready to Execute</span>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4 pt-3 border-t border-gray-900">
          <div className="flex flex-col">
            <span className="text-[7px] text-gray-600 uppercase font-bold mb-1 tracking-tighter">€BSR REQUIRED</span>
            <span className="text-sm font-mono text-green-500 font-bold" style={monoStyle}>113.51</span>
          </div>
          <div className="flex flex-col text-right">
            <span className="text-[7px] text-gray-600 uppercase font-bold mb-1 tracking-tighter">EEURO REQUIRED</span>
            <span className="text-sm font-mono text-blue-500 font-bold" style={monoStyle}>340.54</span>
          </div>
        </div>
      </div>
    </div>
  )
}