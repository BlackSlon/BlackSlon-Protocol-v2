'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'

export default function TradingPanel() {
  const params = useParams()
  const marketId = (params.id as string) || 'BS-P-PL'
  const monoStyle = { fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace' }

  // States
  const [price, setPrice] = useState('10.59')
  const [side, setSide] = useState<'BUY' | 'SELL'>('BUY')
  const [bsrStake, setBsrStake] = useState(50)
  
  // Logic to sync sliders (Total must be 100%)
  const euroStake = 100 - bsrStake

  // Stable risk management lookup table
  const riskTable = {
    10: { marginLong: 50, marginShort: 100, leverageLong: '1:2.0', leverageShort: '1:1.0', fee: 1.00 },
    25: { marginLong: 45, marginShort: 90, leverageLong: '1:2.2', leverageShort: '1:1.1', fee: 0.85 },
    50: { marginLong: 40, marginShort: 80, leverageLong: '1:2.5', leverageShort: '1:1.2', fee: 0.60 },
    75: { marginLong: 30, marginShort: 60, leverageLong: '1:3.3', leverageShort: '1:1.6', fee: 0.35 },
    100: { marginLong: 25, marginShort: 50, leverageLong: '1:4.0', leverageShort: '1:2.0', fee: 0.20 }
  }

  // Safe lookup based on specific BSR levels
  const currentRisk = riskTable[bsrStake as keyof typeof riskTable] || riskTable[50]
  const marginRequired = side === 'BUY' ? currentRisk.marginLong : currentRisk.marginShort
  const leverage = side === 'BUY' ? currentRisk.leverageLong : currentRisk.leverageShort
  
  const bsrRequiredValue = price && marginRequired ? (parseFloat(price) * marginRequired / 100).toFixed(2) : '0.00'

  return (
    <div className="flex flex-col h-full p-3 select-none font-sans bg-black/20">
      {/* HEADER - Tightened spacing */}
      <div className="text-center mb-2 border-b border-gray-900 pb-1">
        <span className="text-[9px] text-gray-500 uppercase tracking-[0.4em] font-bold">Trading Terminal</span>
      </div>

      <div className="text-center mb-3">
        <span className="text-[12px] text-red-600 font-bold tracking-[0.1em] uppercase">
          INSTRUMENT: {marketId}
        </span>
      </div>

      {/* SIDE SELECTION - 140px width per button, hover effects */}
      <div className="flex justify-center gap-3 mb-4">
        <button 
          onClick={() => setSide('BUY')}
          className={`w-[140px] py-2 border-2 font-bold uppercase tracking-widest text-[10px] transition-all rounded-sm ${
            side === 'BUY' 
              ? 'border-green-600 bg-green-600/10 text-green-500 shadow-[0_0_10px_rgba(22,163,74,0.2)]' 
              : 'border-gray-900 text-gray-700 hover:border-green-600/40 hover:text-green-500/50'
          }`}
        >
          BUY
        </button>
        <button 
          onClick={() => setSide('SELL')}
          className={`w-[140px] py-2 border-2 font-bold uppercase tracking-widest text-[10px] transition-all rounded-sm ${
            side === 'SELL' 
              ? 'border-red-600 bg-red-600/10 text-red-500 shadow-[0_0_10px_rgba(220,38,38,0.2)]' 
              : 'border-gray-900 text-gray-700 hover:border-red-600/40 hover:text-red-500/50'
          }`}
        >
          SELL
        </button>
      </div>

      {/* PRICE AREA - Dynamic Color & No Browser Artifacts */}
      <div className="flex flex-col items-center mb-4">
        <div className="flex items-center gap-6">
          <button 
            onClick={() => setPrice((prev) => (parseFloat(prev) - 0.01).toFixed(2))}
            className="text-2xl text-gray-600 hover:text-white transition-colors p-2"
          >
            -
          </button>
          <div className="text-center">
            {/* CSS to hide arrows/spinners included in the input class */}
            <input 
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className={`bg-transparent text-6xl font-bold font-mono w-56 text-center outline-none transition-all [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none ${
                side === 'BUY' ? 'text-green-500' : 'text-red-500'
              }`}
              style={monoStyle}
            />
            <div className="text-[9px] text-gray-600 font-mono mt-0.5" style={monoStyle}>EUR / 100kWh</div>
          </div>
          <button 
            onClick={() => setPrice((prev) => (parseFloat(prev) + 0.01).toFixed(2))}
            className="text-2xl text-gray-600 hover:text-white transition-colors p-2"
          >
            +
          </button>
        </div>
        <span className="text-[7px] text-gray-700 uppercase font-bold mt-2 tracking-[0.2em]">SET ORDER PRICE</span>
      </div>

      {/* EXECUTE BUTTON - Smaller, Solid Yellow */}
      <div className="flex justify-center mb-4">
        <button className="w-2/3 py-2 bg-yellow-600 hover:bg-yellow-500 text-black font-black uppercase tracking-[0.3em] text-[11px] transition-all rounded-sm shadow-lg active:scale-95">
          EXECUTE
        </button>
      </div>

      {/* DEPOSITS SECTION - Double Sliders with logic */}
      <div className="bg-black/40 border border-gray-900 p-3 rounded-sm mb-4">
        <div className="text-center mb-3">
          <span className="text-[8px] text-gray-500 uppercase font-bold tracking-widest">DEPOSITS RATIO</span>
        </div>
        
        {/* €BSR Stake Slider */}
        <div className="mb-3">
          <div className="flex justify-between items-center mb-1">
            <span className="text-[8px] text-gray-400 font-mono" style={monoStyle}>€BSR STAKE</span>
            <span className="text-[10px] text-green-500 font-bold font-mono" style={monoStyle}>{bsrStake}%</span>
          </div>
          <input 
            type="range"
            min="10"
            max="100"
            step="1" 
            value={bsrStake}
            onChange={(e) => {
              const val = parseInt(e.target.value);
              // Snap to risk table values for logic, but allow smooth sliding
              setBsrStake(val);
            }}
            className="w-full h-1 bg-gray-800 accent-green-600 appearance-none cursor-pointer rounded-lg"
          />
        </div>

        {/* eEURO Stake Slider - Follows BSR */}
        <div>
          <div className="flex justify-between items-center mb-1">
            <span className="text-[8px] text-gray-400 font-mono" style={monoStyle}>eEURO STAKE</span>
            <span className="text-[10px] text-blue-500 font-bold font-mono" style={monoStyle}>{euroStake}%</span>
          </div>
          <input 
            type="range"
            min="0"
            max="90"
            value={euroStake}
            disabled
            className="w-full h-1 bg-gray-900 accent-blue-600 appearance-none opacity-40 rounded-lg"
          />
        </div>
      </div>

      {/* MARGIN REQUIREMENTS - Pulled up to be visible */}
      <div className="mt-auto pt-2 border-t border-gray-900">
        <div className="text-center mb-1">
          <span className="text-[8px] text-gray-600 uppercase font-bold tracking-widest">MARGIN REQUIREMENTS</span>
        </div>
        <div className="text-center mb-3">
          <span className={`text-5xl font-bold font-mono leading-none ${side === 'BUY' ? 'text-green-500' : 'text-red-500'}`} style={monoStyle}>
            {marginRequired}%
          </span>
        </div>
        
        <div className="grid grid-cols-3 gap-1 text-center border-t border-gray-900/50 pt-2">
          <div>
            <span className="text-[7px] text-gray-600 uppercase font-bold block mb-1">LEVERAGE</span>
            <span className="text-[12px] font-mono text-white font-bold" style={monoStyle}>{leverage}</span>
          </div>
          <div>
            <span className="text-[7px] text-gray-600 uppercase font-bold block mb-1">FEE</span>
            <span className="text-[12px] font-mono text-yellow-500 font-bold" style={monoStyle}>{currentRisk.fee.toFixed(2)}%</span>
          </div>
          <div>
            <span className="text-[7px] text-gray-600 uppercase font-bold block mb-1">€BSR REQ</span>
            <span className="text-[12px] font-mono text-green-500 font-bold" style={monoStyle}>{bsrRequiredValue}</span>
          </div>
        </div>
      </div>
    </div>
  )
}