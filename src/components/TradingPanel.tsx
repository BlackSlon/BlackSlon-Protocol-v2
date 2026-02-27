'use client'

import { useState } from 'react'
import { useParams } from 'next/navigation'

export default function TradingPanel() {
  const params = useParams()
  const marketId = (params.id as string) || 'BS-P-PL'
  const monoStyle = { fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace' }

  const [price, setPrice] = useState('10.59')
  const [side, setSide] = useState<'BUY' | 'SELL'>('BUY')
  const [bsrStake, setBsrStake] = useState(50)
  const [euroStake, setEuroStake] = useState(50)

  // Risk management table
  const riskTable = {
    10: { marginLong: 50, marginShort: 100, leverageLong: '1:2.0', leverageShort: '1:1.0', fee: 1.00 },
    25: { marginLong: 45, marginShort: 90, leverageLong: '1:2.2', leverageShort: '1:1.1', fee: 0.85 },
    50: { marginLong: 40, marginShort: 80, leverageLong: '1:2.5', leverageShort: '1:1.2', fee: 0.60 },
    75: { marginLong: 30, marginShort: 60, leverageLong: '1:3.3', leverageShort: '1:1.6', fee: 0.35 },
    100: { marginLong: 25, marginShort: 50, leverageLong: '1:4.0', leverageShort: '1:2.0', fee: 0.20 }
  }

  const currentRisk = riskTable[bsrStake as keyof typeof riskTable]
  const marginRequired = side === 'BUY' ? currentRisk.marginLong : currentRisk.marginShort
  const leverage = side === 'BUY' ? currentRisk.leverageLong : currentRisk.leverageShort

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

      {/* SIDE SELECTION - 50% smaller width */}
      <div className="grid grid-cols-2 gap-2 mb-8">
        <button 
          onClick={() => setSide('BUY')}
          className={`py-2 border-2 font-bold uppercase tracking-widest text-[8px] transition-all ${
            side === 'BUY' 
              ? 'border-green-600 bg-green-600/5 text-green-500 hover:bg-green-600/10' 
              : 'border-gray-900 text-gray-700 hover:border-green-600/40 hover:text-green-400'
          }`}
        >
          BUY
        </button>
        <button 
          onClick={() => setSide('SELL')}
          className={`py-2 border-2 font-bold uppercase tracking-widest text-[8px] transition-all ${
            side === 'SELL' 
              ? 'border-red-600 bg-red-600/5 text-red-500 hover:bg-red-600/10' 
              : 'border-gray-900 text-gray-700 hover:border-red-600/40 hover:text-red-400'
          }`}
        >
          SELL
        </button>
      </div>

      {/* PRICE INPUT WITH +/- BUTTONS - Dynamic color, no white artifacts */}
      <div className="flex flex-col items-center mb-8">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setPrice((parseFloat(price) - 0.01).toFixed(2))}
            className={`w-12 h-12 border rounded hover:bg-opacity-10 transition-all text-xl font-bold ${
              side === 'BUY' 
                ? 'border-green-600/40 text-green-500 hover:bg-green-600' 
                : 'border-red-600/40 text-red-500 hover:bg-red-600'
            }`}
          >
            -
          </button>
          <div className="text-center">
            <input 
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className={`bg-transparent text-5xl font-bold font-mono w-48 text-center outline-none transition-all ${
                side === 'BUY' ? 'text-green-500' : 'text-red-500'
              }`}
              style={monoStyle}
            />
            <div className="text-[10px] text-gray-500 font-mono mt-1" style={monoStyle}>EUR/100kWh</div>
          </div>
          <button 
            onClick={() => setPrice((parseFloat(price) + 0.01).toFixed(2))}
            className={`w-12 h-12 border rounded hover:bg-opacity-10 transition-all text-xl font-bold ${
              side === 'BUY' 
                ? 'border-green-600/40 text-green-500 hover:bg-green-600' 
                : 'border-red-600/40 text-red-500 hover:bg-red-600'
            }`}
          >
            +
          </button>
        </div>
        <span className="text-[8px] text-gray-700 uppercase font-bold mt-4 tracking-widest">SET ORDER PRICE</span>
      </div>

      {/* EXECUTE BUTTON - Smaller, yellow */}
      <div className="mb-8">
        <button className="w-full py-2 bg-yellow-600 text-black font-bold uppercase tracking-widest text-sm transition-all hover:bg-yellow-500">
          EXECUTE
        </button>
      </div>

      {/* DEPOSITS SECTION */}
      <div className="mb-6">
        <div className="text-center mb-4">
          <span className="text-[9px] text-gray-600 uppercase font-bold tracking-widest">DEPOSITS</span>
        </div>
        
        {/* €BSR % Stake Slider */}
        <div className="mb-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-[8px] text-gray-500 font-mono" style={monoStyle}>€BSR % Stake</span>
            <span className="text-[8px] text-green-500 font-mono" style={monoStyle}>{bsrStake}%</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-[7px] text-gray-600 font-mono" style={monoStyle}>10%</span>
            <input 
              type="range"
              min="10"
              max="100"
              step="15"
              value={bsrStake}
              onChange={(e) => setBsrStake(parseInt(e.target.value))}
              className="flex-1 h-2 bg-gray-900 rounded-lg appearance-none cursor-pointer"
            />
            <span className="text-[7px] text-gray-600 font-mono" style={monoStyle}>100%</span>
          </div>
        </div>

        {/* eEURO % Stake Slider */}
        <div className="mb-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-[8px] text-gray-500 font-mono" style={monoStyle}>eEURO % Stake</span>
            <span className="text-[8px] text-blue-500 font-mono" style={monoStyle}>{euroStake}%</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-[7px] text-gray-600 font-mono" style={monoStyle}>0%</span>
            <input 
              type="range"
              min="0"
              max="100"
              step="5"
              value={euroStake}
              onChange={(e) => setEuroStake(parseInt(e.target.value))}
              className="flex-1 h-2 bg-gray-900 rounded-lg appearance-none cursor-pointer"
            />
            <span className="text-[7px] text-gray-600 font-mono" style={monoStyle}>100%</span>
          </div>
        </div>
      </div>

      {/* MARGIN REQUIREMENTS - Dynamic based on BSR stake and side */}
      <div className="mt-auto">
        <div className="text-center mb-4">
          <span className="text-[9px] text-gray-600 uppercase font-bold tracking-widest">MARGIN REQUIREMENTS</span>
        </div>
        <div className="text-center mb-6">
          <span className={`text-4xl font-bold font-mono ${side === 'BUY' ? 'text-green-500' : 'text-red-500'}`} style={monoStyle}>
            {marginRequired}%
          </span>
        </div>
        <div className="grid grid-cols-3 gap-2 text-center">
          <div>
            <span className="text-[7px] text-gray-600 uppercase font-bold block mb-1">LEVERAGE</span>
            <span className="text-sm font-mono text-white font-bold" style={monoStyle}>{leverage}</span>
          </div>
          <div>
            <span className="text-[7px] text-gray-600 uppercase font-bold block mb-1">TRADING FEE</span>
            <span className="text-sm font-mono text-yellow-500 font-bold" style={monoStyle}>{currentRisk.fee}%</span>
          </div>
          <div>
            <span className="text-[7px] text-gray-600 uppercase font-bold block mb-1">€BSR REQ</span>
            <span className="text-sm font-mono text-green-500 font-bold" style={monoStyle}>
              {(parseFloat(price) * marginRequired / 100).toFixed(2)}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
