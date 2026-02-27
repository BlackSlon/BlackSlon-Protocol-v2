'use client'

import { useState } from 'react'
import { useParams } from 'next/navigation'

export default function TradingPanel() {
  const params = useParams()
  const rawId = (params.id as string) || 'BS-P-PL'
  const marketId = rawId.replace('IPT', 'BS') 
  
  const monoStyle = { fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace' }

  const [price, setPrice] = useState('10.59')
  const [quantity, setQuantity] = useState(5)
  const [side, setSide] = useState<'BUY' | 'SELL'>('BUY')
  const [bsrStake, setBsrStake] = useState(50)
  
  const euroStake = 100 - bsrStake

  const riskTable = {
    10: { margin: 50, fee: 1.00 },
    25: { margin: 45, fee: 0.85 },
    50: { margin: 40, fee: 0.60 },
    75: { margin: 30, fee: 0.35 },
    100: { margin: 25, fee: 0.20 }
  }

  const currentRisk = riskTable[bsrStake as keyof typeof riskTable] || riskTable[50]
  const marginValue = currentRisk.margin
  
  const totalValue = parseFloat(price) * quantity
  const bsrReq = (totalValue * (marginValue / 100) * (bsrStake / 100)).toFixed(2)
  const euroReq = (totalValue * (marginValue / 100) * (euroStake / 100)).toFixed(2)

  return (
    <div className="flex flex-col h-full w-full p-3 select-none font-sans bg-transparent scale-[0.75] origin-top">
      
      <div className="text-center mb-4 border-b border-gray-900 pb-1">
        <span className="text-[8px] text-gray-500 uppercase tracking-[0.4em] font-bold">Trading Terminal</span>
      </div>

      <div className="text-left mb-4">
        <span className="text-[11px] text-yellow-500 font-bold tracking-[0.2em] uppercase">
          INSTRUMENT: {marketId}
        </span>
      </div>

      <div className="flex justify-center gap-1.5 mb-5">
        <button onClick={() => setSide('BUY')} className={`flex-1 py-1.5 border-2 font-bold uppercase tracking-widest text-[8px] transition-all rounded-sm ${side === 'BUY' ? 'border-green-600 bg-green-600/10 text-green-500' : 'border-gray-900 text-gray-700'}`}>BUY</button>
        <button onClick={() => setSide('SELL')} className={`flex-1 py-1.5 border-2 font-bold uppercase tracking-widest text-[8px] transition-all rounded-sm ${side === 'SELL' ? 'border-red-600 bg-red-600/10 text-red-500' : 'border-gray-900 text-gray-700'}`}>SELL</button>
      </div>

      {/* PRICE */}
      <div className="flex flex-col items-center mb-4">
        <div className="flex items-center gap-2">
          <button onClick={() => setPrice(p => Math.max(0, parseFloat(p) - 0.01).toFixed(2))} className="text-2xl text-gray-600 hover:text-white">-</button>
          <div className="text-center">
            <input type="text" value={price} onChange={(e) => setPrice(e.target.value.replace(',', '.'))} className="bg-transparent text-4xl font-bold font-mono w-32 text-center outline-none text-white" style={monoStyle} />
            <div className="text-[9px] text-white font-bold font-mono mt-0.5" style={monoStyle}>
              EUR / 100kWh <span className="opacity-60 text-[7px] ml-1">(1 TOKEN {marketId})</span>
            </div>
          </div>
          <button onClick={() => setPrice(p => (parseFloat(p) + 0.01).toFixed(2))} className="text-2xl text-gray-600 hover:text-white">+</button>
        </div>
        <span className="text-[10px] text-white uppercase font-black mt-1 tracking-widest">SET ORDER PRICE</span>
      </div>

      {/* QUANTITY */}
      <div className="flex flex-col items-center mb-6">
        <div className="flex items-center gap-2">
          <button onClick={() => setQuantity(q => Math.max(1, q - 1))} className="text-2xl text-gray-600 hover:text-white">-</button>
          <div className="text-center">
            <input type="number" value={quantity} onChange={(e) => setQuantity(parseInt(e.target.value) || 1)} className="bg-transparent text-4xl font-bold font-mono w-32 text-center outline-none text-white [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none" style={monoStyle} />
            <div className="text-[9px] text-white font-bold font-mono mt-0.5" style={monoStyle}>
              1 TOKEN <span className="opacity-60 text-[7px] ml-1">(100kWh)</span>
            </div>
          </div>
          <button onClick={() => setQuantity(q => q + 1)} className="text-2xl text-gray-600 hover:text-white">+</button>
        </div>
        <span className="text-[10px] text-white uppercase font-black mt-1 tracking-widest">SET QUANTITY</span>
      </div>

      <div className="flex justify-center mb-6">
        <button className={`w-full py-3 border-2 font-black uppercase tracking-[0.3em] text-[11px] transition-all duration-300 rounded-sm
          ${side === 'BUY' 
            ? 'border-green-500 text-green-500 hover:bg-green-500 hover:text-black hover:shadow-[0_0_20px_rgba(34,197,94,0.5)]' 
            : 'border-red-600 text-red-600 hover:bg-red-600 hover:text-white hover:shadow-[0_0_20px_rgba(239,68,68,0.5)]'}`}>
          EXECUTE
        </button>
      </div>

      {/* DEPOSITS SLIDERS */}
      <div className="bg-black/60 border border-gray-900 p-3 rounded-sm mb-5">
        <div className="space-y-3">
          <div>
            <div className="flex justify-between text-[9px] font-mono mb-1 text-blue-400 font-bold" style={monoStyle}><span>€BSR STAKE</span><span>{bsrStake}%</span></div>
            <input type="range" min="10" max="100" step="5" value={bsrStake} onChange={(e) => setBsrStake(parseInt(e.target.value))} className="w-full h-1 bg-gray-800 accent-blue-500 cursor-pointer" />
          </div>
          <div>
            <div className="flex justify-between text-[9px] font-mono mb-1 text-blue-600 font-bold" style={monoStyle}><span>eEURO STAKE</span><span>{euroStake}%</span></div>
            <input type="range" min="0" max="90" value={euroStake} readOnly className="w-full h-1 bg-gray-900 accent-blue-900" />
          </div>
        </div>
      </div>

      {/* BOTTOM SECTION */}
      <div className="mt-auto border-t border-gray-900 pt-4">
        <div className="text-center mb-1">
          <span className="text-[9px] text-blue-700 uppercase font-bold tracking-[0.1em]">DEPOSIT VALUE / LEVERAGE</span>
        </div>
        <div className="text-center mb-4">
          <span className="text-3xl font-bold font-mono text-blue-500 leading-none" style={monoStyle}>{marginValue}%</span>
        </div>
        
        <div className="grid grid-cols-2 gap-2 border-t border-gray-800/50 pt-3">
          <div className="flex flex-col">
            <span className="text-[8px] text-white uppercase font-bold mb-1 tracking-tighter">€BSR Deposit Value:</span>
            <span className="text-[13px] font-mono text-blue-400 font-bold" style={monoStyle}>{bsrReq} BSR</span>
          </div>
          <div className="flex flex-col text-right">
            <span className="text-[8px] text-white uppercase font-bold mb-1 tracking-tighter">eEURO Deposit Value:</span>
            <span className="text-[13px] font-mono text-blue-500 font-bold" style={monoStyle}>{euroReq} EUR</span>
          </div>
        </div>

        <div className="text-center mt-3 opacity-60">
           <span className="text-[8px] text-gray-500 uppercase font-bold">FEE: {currentRisk.fee.toFixed(2)}%</span>
        </div>
      </div>
    </div>
  )
}