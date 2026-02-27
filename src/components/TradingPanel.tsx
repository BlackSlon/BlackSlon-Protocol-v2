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
    <div className="flex flex-col h-full p-8 select-none">
      {/* HEADER */}
      <div className="text-center mb-8">
        <span className="text-[10px] text-gray-500 uppercase tracking-[0.5em] font-bold">Trading Terminal</span>
      </div>

      {/* INSTRUMENT */}
      <div className="text-center mb-6">
        <span className="text-[12px] text-red-600 font-bold tracking-widest uppercase">
          INSTRUMENT: {marketId}
        </span>
      </div>

      {/* WIELKA ŻÓŁTA CENA */}
      <div className="flex flex-col items-center mb-12">
        <div className="flex items-baseline gap-3 group">
          <input 
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="bg-transparent text-7xl font-bold text-yellow-500 font-mono w-72 text-center outline-none border-b-2 border-transparent focus:border-yellow-500/20 transition-all"
            style={monoStyle}
          />
          <span className="text-sm text-yellow-600/50 font-bold uppercase tracking-tighter">EUR</span>
        </div>
        <span className="text-[9px] text-gray-700 uppercase font-bold mt-4 tracking-widest">Set Limit Price</span>
      </div>

      {/* QUANTITY */}
      <div className="mb-10">
        <div className="text-center mb-4">
          <span className="text-[10px] text-gray-500 uppercase font-bold tracking-[0.3em]">Quantity (MWh)</span>
        </div>
        <div className="flex justify-center items-center gap-8">
          <button onClick={() => setQuantity(q => Math.max(0, q - 10))} className="w-14 h-14 border border-gray-800 rounded-md text-gray-400 hover:text-white hover:border-yellow-600/50 transition-all text-3xl">-</button>
          <input 
            type="number" 
            value={quantity} 
            onChange={(e) => setQuantity(parseInt(e.target.value) || 0)}
            className="bg-black border border-gray-800 text-center w-36 py-4 font-mono text-2xl text-white rounded-md outline-none focus:border-yellow-600/50" 
            style={monoStyle}
          />
          <button onClick={() => setQuantity(q => q + 10)} className="w-14 h-14 border border-gray-800 rounded-md text-gray-400 hover:text-white hover:border-yellow-600/50 transition-all text-3xl">+</button>
        </div>
      </div>

      {/* BUY/SELL BUTTONS */}
      <div className="grid grid-cols-2 gap-6 mb-12">
        <button 
          onClick={() => setSide('BUY')}
          className={`py-6 border-2 font-bold uppercase tracking-[0.3em] text-sm transition-all rounded-sm ${
            side === 'BUY' ? 'border-green-600 bg-green-600/10 text-green-500 shadow-[0_0_20px_rgba(22,163,74,0.15)]' : 'border-gray-900 text-gray-700'
          }`}
        >
          Buy
        </button>
        <button 
          onClick={() => setSide('SELL')}
          className={`py-6 border-2 font-bold uppercase tracking-[0.3em] text-sm transition-all rounded-sm ${
            side === 'SELL' ? 'border-red-600 bg-red-600/10 text-red-500 shadow-[0_0_20px_rgba(220,38,38,0.15)]' : 'border-gray-900 text-gray-700'
          }`}
        >
          Sell
        </button>
      </div>

      {/* MARGIN INFO (Bez suwaków) */}
      <div className="mt-auto bg-black/80 border border-yellow-600/20 p-8 rounded-md">
        <div className="flex justify-between items-center mb-6">
          <div className="flex flex-col">
            <span className="text-[9px] text-gray-500 uppercase font-bold tracking-widest mb-1">Margin Required</span>
            <span className="text-3xl font-bold text-yellow-600">45%</span>
          </div>
          <div className="text-right">
             <span className="text-[11px] text-gray-400 uppercase font-bold block mb-1">Status</span>
             <span className="text-[10px] text-blue-500 font-bold uppercase animate-pulse">Ready to Execute</span>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4 pt-6 border-t border-gray-900">
          <div className="flex flex-col">
            <span className="text-[8px] text-gray-600 uppercase font-bold mb-1">€BSR REQUIRED</span>
            <span className="text-sm font-mono text-green-500" style={monoStyle}>113.51</span>
          </div>
          <div className="flex flex-col text-right">
            <span className="text-[8px] text-gray-600 uppercase font-bold mb-1">EEURO REQUIRED</span>
            <span className="text-sm font-mono text-blue-500" style={monoStyle}>340.54</span>
          </div>
        </div>
      </div>
    </div>
  )
}