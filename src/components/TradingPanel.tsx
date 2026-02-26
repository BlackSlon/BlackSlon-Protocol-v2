'use client'

import { useState } from 'react'

export default function TradingPanel() {
  const [side, setSide] = useState<'BUY' | 'SELL'>('BUY')
  const [price, setPrice] = useState<string>('10.59')
  const [amount, setAmount] = useState<string>('1')

  const monoStyle = { fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace' }
  
  // Logika korytarza BSTZ
  const bstzAnchor = 10.59
  const isInvalid = parseFloat(price) < bstzAnchor * 0.9 || parseFloat(price) > bstzAnchor * 1.1

  return (
    <div className="flex flex-col h-full select-none">
      <div className="text-center mb-2 border-b border-gray-900 pb-1">
        <span className="text-[9px] tracking-[0.3em] text-gray-400 uppercase font-bold">Execution</span>
      </div>
      
      <div className="text-center mb-4">
        <span className="text-[10px] text-red-600 font-bold tracking-widest uppercase">Trading Zone</span>
      </div>

      {/* TABS */}
      <div className="grid grid-cols-2 gap-1 mb-6 bg-black p-1 border border-gray-900">
        <button onClick={() => setSide('BUY')} className={`py-2 text-[9px] font-bold uppercase transition-all ${side === 'BUY' ? 'bg-green-600/20 text-green-500 border border-green-600/50' : 'text-gray-600'}`}>Buy</button>
        <button onClick={() => setSide('SELL')} className={`py-2 text-[9px] font-bold uppercase transition-all ${side === 'SELL' ? 'bg-red-600/20 text-red-500 border border-red-600/50' : 'text-gray-600'}`}>Sell</button>
      </div>

      {/* INPUTS */}
      <div className="space-y-4">
        <div>
          <label className="text-[8px] text-gray-600 uppercase font-bold mb-1 block">Limit Price (EUR)</label>
          <input 
            type="number" 
            value={price} 
            onChange={(e) => setPrice(e.target.value)}
            className={`w-full bg-gray-950 border ${isInvalid ? 'border-red-900' : 'border-gray-900'} p-2 text-xs font-mono outline-none focus:border-red-600 transition-colors`}
            style={monoStyle}
          />
          {isInvalid && <p className="text-[7px] text-red-500 mt-1 uppercase font-bold">Outside BSTZ Corridor</p>}
        </div>

        <div>
          <label className="text-[8px] text-gray-600 uppercase font-bold mb-1 block">Amount (MWh)</label>
          <input 
            type="number" 
            value={amount} 
            onChange={(e) => setAmount(e.target.value)}
            className="w-full bg-gray-950 border border-gray-900 p-2 text-xs font-mono outline-none focus:border-red-600"
            style={monoStyle}
          />
        </div>
      </div>

      <div className="mt-6 p-2 bg-gray-900/20 border border-gray-900 rounded-sm">
        <div className="flex justify-between text-[8px] text-gray-500 font-bold uppercase">
          <span>Total:</span>
          <span className="text-white" style={monoStyle}>{(parseFloat(price) * parseFloat(amount)).toFixed(2)} €BSR</span>
        </div>
      </div>

      <div className="flex-grow" />

      <button 
        disabled={isInvalid}
        className={`w-full py-4 text-[10px] font-bold uppercase tracking-widest transition-all border ${isInvalid ? 'bg-gray-900 text-gray-700 border-gray-800' : side === 'BUY' ? 'bg-green-600 hover:bg-green-500 border-green-400 text-white' : 'bg-red-700 hover:bg-red-600 border-red-500 text-white'}`}
      >
        {isInvalid ? 'Invalid Price' : `Place ${side} Order`}
      </button>
    </div>
  )
}