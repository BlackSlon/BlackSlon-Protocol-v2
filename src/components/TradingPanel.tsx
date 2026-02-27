'use client'

import { useState } from 'react'
import { useParams } from 'next/navigation'

export default function TradingPanel() {
  const params = useParams()
  const marketId = (params.id as string) || 'BSTZ-P-PL'
  const monoStyle = { fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace' }

  const [price, setPrice] = useState('10.59')
  const [quantity, setQuantity] = useState(100)
  const [side, setSide] = useState<'BUY' | 'SELL'>('BUY')

  return (
    <div className="flex flex-col h-full p-6 select-none">
      {/* TYTUŁ SEKCJII */}
      <div className="text-center mb-6 border-b border-gray-900 pb-2">
        <span className="text-[10px] text-gray-500 uppercase tracking-[0.4em] font-bold">Trading Terminal</span>
      </div>

      {/* CZERWONY INSTRUMENT */}
      <div className="text-center mb-4">
        <span className="text-[12px] text-red-600 font-bold tracking-widest uppercase">
          INSTRUMENT: {marketId}
        </span>
      </div>

      {/* WIELKA ŻÓŁTA CENA (INPUT) */}
      <div className="flex flex-col items-center mb-10">
        <div className="flex items-baseline gap-2 group">
          <input 
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="bg-transparent text-6xl font-bold text-yellow-500 font-mono w-64 text-center outline-none border-b-2 border-transparent focus:border-yellow-500/20 transition-all"
            style={monoStyle}
          />
          <span className="text-xs text-gray-500 font-bold uppercase">EUR</span>
        </div>
        <span className="text-[9px] text-gray-700 uppercase font-bold mt-2">Set Limit Price</span>
      </div>

      {/* ILOŚĆ / QUANTITY */}
      <div className="mb-8 px-10">
        <div className="text-center mb-3">
          <span className="text-[10px] text-gray-500 uppercase font-bold tracking-widest">Quantity (MWh)</span>
        </div>
        <div className="flex justify-center items-center gap-6">
          <button onClick={() => setQuantity(q => Math.max(0, q - 10))} className="w-12 h-12 border border-gray-800 rounded text-gray-400 hover:text-white hover:border-gray-600 transition-all text-2xl">-</button>
          <input 
            type="number" 
            value={quantity} 
            onChange={(e) => setQuantity(parseInt(e.target.value) || 0)}
            className="bg-black border border-gray-800 text-center w-28 py-3 font-mono text-xl text-white rounded outline-none focus:border-yellow-600/50" 
            style={monoStyle}
          />
          <button onClick={() => setQuantity(q => q + 10)} className="w-12 h-12 border border-gray-800 rounded text-gray-400 hover:text-white hover:border-gray-600 transition-all text-2xl">+</button>
        </div>
      </div>

      {/* PRZYCISKI BUY/SELL */}
      <div className="grid grid-cols-2 gap-4 mb-10">
        <button 
          onClick={() => setSide('BUY')}
          className={`py-5 border-2 font-bold uppercase tracking-[0.2em] text-sm transition-all ${
            side === 'BUY' ? 'border-green-600 bg-green-600/10 text-green-500 shadow-[0_0_15px_rgba(22,163,74,0.1)]' : 'border-gray-900 text-gray-700'
          }`}
        >
          Buy
        </button>
        <button 
          onClick={() => setSide('SELL')}
          className={`py-5 border-2 font-bold uppercase tracking-[0.2em] text-sm transition-all ${
            side === 'SELL' ? 'border-red-600 bg-red-600/10 text-red-500 shadow-[0_0_15px_rgba(220,38,38,0.1)]' : 'border-gray-900 text-gray-700'
          }`}
        >
          Sell
        </button>
      </div>

      {/* DEPOZYTY / MARGIN (KOSTKA Z DOŁU) */}
      <div className="mt-auto bg-[#0a0a0a] border border-gray-900 p-6 rounded-sm">
        <div className="space-y-6">
          <div>
            <div className="flex justify-between text-[9px] text-gray-600 uppercase font-bold mb-2">
              <span>€BSR Stake</span>
              <span className="text-blue-500">25%</span>
            </div>
            <input type="range" className="w-full h-1 bg-gray-800 accent-blue-600 appearance-none cursor-pointer" />
          </div>
          <div>
            <div className="flex justify-between text-[9px] text-gray-600 uppercase font-bold mb-2">
              <span>eEURO Stake</span>
              <span className="text-blue-500">75%</span>
            </div>
            <input type="range" className="w-full h-1 bg-gray-800 accent-blue-600 appearance-none cursor-pointer" />
          </div>
          
          <div className="pt-4 border-t border-gray-800 flex justify-between items-center">
            <div className="flex flex-col">
              <span className="text-[8px] text-gray-600 uppercase font-bold">Margin Required</span>
              <span className="text-xl font-bold text-yellow-600">45%</span>
            </div>
            <div className="text-right">
              <span className="text-[10px] text-green-500 font-mono block" style={monoStyle}>113.51 €BSR</span>
              <span className="text-[10px] text-blue-500 font-mono block" style={monoStyle}>340.54 eEUR</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}