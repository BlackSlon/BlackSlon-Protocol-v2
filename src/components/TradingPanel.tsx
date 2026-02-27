'use client'

import { useState } from 'react'
import { useParams } from 'next/navigation'

export default function TradingPanel() {
  const params = useParams()
  const marketId = (params.id as string) || 'IPT-P-PL'
  const monoStyle = { fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace' }

  const [price, setPrice] = useState('10.59')
  const [side, setSide] = useState<'BUY' | 'SELL'>('BUY')

  return (
    <div className="flex flex-col h-full p-8 select-none font-sans border border-yellow-600/40">
      {/* HEADER */}
      <div className="text-center mb-6 border-b border-gray-900 pb-3">
        <span className="text-[10px] text-gray-500 uppercase tracking-[0.5em] font-bold">Trading Panel</span>
      </div>

      <div className="text-center mb-6">
        <span className="text-[13px] text-red-600 font-bold tracking-[0.2em] uppercase">
          INSTRUMENT: {marketId}
        </span>
      </div>

      {/* SIDE SELECTION */}
      <div className="grid grid-cols-2 gap-4 mb-8">
        <button 
          onClick={() => setSide('BUY')}
          className={`py-4 border-2 font-bold uppercase tracking-widest text-[10px] transition-all ${
            side === 'BUY' ? 'border-green-600 bg-green-600/5 text-green-500' : 'border-gray-900 text-gray-700'
          }`}
        >
          BUY
        </button>
        <button 
          onClick={() => setSide('SELL')}
          className={`py-4 border-2 font-bold uppercase tracking-widest text-[10px] transition-all ${
            side === 'SELL' ? 'border-red-600 bg-red-600/5 text-red-500' : 'border-gray-900 text-gray-700'
          }`}
        >
          SELL
        </button>
      </div>

      {/* PRICE INPUT WITH +/- BUTTONS */}
      <div className="flex flex-col items-center mb-8">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setPrice((parseFloat(price) - 0.01).toFixed(2))}
            className="w-12 h-12 border border-yellow-600/40 rounded text-yellow-500 hover:bg-yellow-600/10 transition-all text-xl font-bold"
          >
            -
          </button>
          <div className="text-center">
            <input 
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="bg-transparent text-5xl font-bold text-yellow-500 font-mono w-48 text-center outline-none border-b-2 border-transparent focus:border-yellow-500/20 transition-all"
              style={monoStyle}
            />
            <div className="text-[10px] text-yellow-600/60 font-mono mt-1" style={monoStyle}>EUR/100kWh</div>
          </div>
          <button 
            onClick={() => setPrice((parseFloat(price) + 0.01).toFixed(2))}
            className="w-12 h-12 border border-yellow-600/40 rounded text-yellow-500 hover:bg-yellow-600/10 transition-all text-xl font-bold"
          >
            +
          </button>
        </div>
        <span className="text-[8px] text-gray-700 uppercase font-bold mt-4 tracking-widest">SET ORDER PRICE</span>
      </div>

      {/* EXECUTE BUTTON */}
      <div className="mb-8">
        <button className={`w-full py-6 font-bold uppercase tracking-widest text-lg transition-all border-2 ${
          side === 'BUY' 
            ? 'border-green-600 bg-green-600/10 text-green-500 hover:bg-green-600/20' 
            : 'border-red-600 bg-red-600/10 text-red-500 hover:bg-red-600/20'
        }`}>
          EXECUTE
        </button>
      </div>

      {/* DEPOSITS AREA */}
      <div className="mb-6">
        <div className="text-center mb-3">
          <span className="text-[9px] text-gray-600 uppercase font-bold tracking-widest">DEPOSITS</span>
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[8px] text-gray-500 font-mono" style={monoStyle}>€BSR</span>
            <div className="flex items-center gap-2">
              <div className="text-[8px] text-gray-600 font-mono" style={monoStyle}>----</div>
              <div className="w-20 h-2 bg-gray-900 rounded-full overflow-hidden">
                <div className="h-full w-2/5 bg-green-600/60"></div>
              </div>
              <div className="text-[8px] text-gray-600 font-mono" style={monoStyle}>----------</div>
              <span className="text-[8px] text-green-500 font-mono" style={monoStyle}>40%</span>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-[8px] text-gray-500 font-mono" style={monoStyle}>eEURO</span>
            <div className="flex items-center gap-2">
              <div className="text-[8px] text-gray-600 font-mono" style={monoStyle}>----</div>
              <div className="w-20 h-2 bg-gray-900 rounded-full overflow-hidden">
                <div className="h-full w-3/5 bg-blue-600/60"></div>
              </div>
              <div className="text-[8px] text-gray-600 font-mono" style={monoStyle}>----------</div>
              <span className="text-[8px] text-blue-500 font-mono" style={monoStyle}>60%</span>
            </div>
          </div>
        </div>
      </div>

      {/* MARGIN REQUIREMENTS */}
      <div className="mt-auto">
        <div className="text-center mb-4">
          <span className="text-[9px] text-gray-600 uppercase font-bold tracking-widest">MARGIN REQUIREMENTS</span>
        </div>
        <div className="text-center mb-6">
          <span className="text-4xl font-bold text-yellow-500 font-mono" style={monoStyle}>45%</span>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center">
            <span className="text-[7px] text-gray-600 uppercase font-bold block mb-1">€BSR REQUIRED</span>
            <span className="text-lg font-mono text-green-500 font-bold" style={monoStyle}>113.51</span>
          </div>
          <div className="text-center">
            <span className="text-[7px] text-gray-600 uppercase font-bold block mb-1">eEURO REQUIRED</span>
            <span className="text-lg font-mono text-blue-500 font-bold" style={monoStyle}>340.54</span>
          </div>
        </div>
      </div>
    </div>
  )
}
