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
      <div className="text-center mb-8 border-b border-gray-900 pb-3">
        <span className="text-[10px] text-gray-500 uppercase tracking-[0.6em] font-bold">Trading Terminal</span>
      </div>

      {/* INSTRUMENT */}
      <div className="text-center mb-6">
        <span className="text-[12px] text-red-600 font-bold tracking-widest uppercase">
          INSTRUMENT: {marketId}
        </span>
      </div>

      {/* WIELKA ŻÓŁTA CENA (INPUT) */}
      <div className="flex flex-col items-center mb-12">
        <div className="flex items-baseline gap-3">
          <input 
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="bg-transparent text-7xl font-bold text-yellow-500 font-mono w-72 text-center outline-none border-b-2 border-transparent focus:border-yellow-500/20 transition-all"
            style={monoStyle}
          />
          <span className="text-sm text-yellow-600/40 font-bold uppercase tracking-tighter font-mono" style={monoStyle}>EUR</span>
        </div>
        <span className="text-[9px] text-gray-700 uppercase font-bold mt-4 tracking-widest">Set Limit Price</span>
      </div>

      {/* QUANTITY CONTROLS */}
      <div className="mb-10 px-4">
        <div className="text-center mb-4">
          <span className="text-[10px] text-gray-600 uppercase font-bold tracking-[0.3em]">Quantity (MWh)</span>
        </div>
        <div className="flex justify-center items-center gap-10">
          <button onClick={() => setQuantity(q => Math.max(0, q - 10))} className="w-14 h-14 border border-gray-800 rounded text-gray-500 hover:text-white hover:border-yellow-600/50 transition-all text-3xl font-light">-</button>
          <input 
            type="number" 
            value={quantity} 
            onChange={(e) => setQuantity(parseInt(e.target.value) || 0)}
            className="bg-black border border-gray-800 text-center w-36 py-4 font-mono text-3xl text-white rounded outline-none" 
            style={monoStyle}
          />
          <button onClick={() => setQuantity(q => q + 10)} className="w-14 h-14 border border-gray-800 rounded text-gray-500 hover:text-white hover:border-yellow-600/50 transition-all text-3xl font-light">+</button>
        </div>
      </div>

      {/* BUY/SELL BUTTONS */}
      <div className="grid grid-cols-2 gap-6 mb-12">
        <button 
          onClick={() => setSide('BUY')}
          className={`py-6 border-2 font-bold uppercase tracking-[0.3em] text-[12px] transition-all ${
            side === 'BUY' ? 'border-green-600 bg-green-600/5 text-green-500 shadow-[0_0_20px_rgba(22,163,74,0.1)]' : 'border-gray-900 text-gray-700'
          }`}
        >
          Buy
        </button>
        <button 
          onClick={() => setSide('SELL')}
          className={`py-6 border-2 font-bold uppercase tracking-[0.3em] text-[12px] transition-all ${
            side === 'SELL' ? 'border-red-600 bg-red-600/5 text-red-500 shadow-[0_0_20px_rgba(220,38,38,0.1)]' : 'border-gray-900 text-gray-700'
          }`}
        >
          Sell
        </button>
      </div>

      {/* MARGIN AREA (NO SLIDERS) */}
      <div className="mt-auto bg-[#0a0a0a] border border-yellow-600/20 p-8 rounded shadow-inner">
        <div className="flex justify-between items-center mb-6">
          <div className="flex flex-col">
            <span className="text-[9px] text-gray-600 uppercase font-bold tracking-widest mb-1">Margin Required</span>
            <span className="text-4xl font-bold text-yellow-600 font-mono" style={monoStyle}>45%</span>
          </div>
          <div className="text-right">
             <span className="text-[11px] text-gray-500 uppercase font-bold block mb-1">Status</span>
             <span className="text-[10px] text-blue-500 font-bold uppercase tracking-widest animate-pulse">Ready to Execute</span>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-8 pt-6 border-t border-gray-900/50">
          <div className="flex flex-col">
            <span className="text-[8px] text-gray-600 uppercase font-bold mb-1 tracking-tighter text-left">€BSR REQUIRED</span>
            <span className="text-lg font-mono text-green-500 font-bold" style={monoStyle}>113.51</span>
          </div>
          <div className="flex flex-col text-right">
            <span className="text-[8px] text-gray-600 uppercase font-bold mb-1 tracking-tighter">EEURO REQUIRED</span>
            <span className="text-lg font-mono text-blue-500 font-bold" style={monoStyle}>340.54</span>
          </div>
        </div>
      </div>
    </div>
  )
}