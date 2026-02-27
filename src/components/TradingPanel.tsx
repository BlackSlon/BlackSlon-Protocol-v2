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
    <div className="flex flex-col h-full w-full p-4 select-none font-sans bg-transparent scale-[0.75] origin-top">
      
      {/* TRADING TERMINAL - 2x Większy i wyraźny */}
      <div className="text-center mb-6 border-b border-gray-900 pb-2">
        <span className="text-[18px] text-gray-400 uppercase tracking-[0.6em] font-black">
          Trading Terminal
        </span>
      </div>

      {/* INSTRUMENT - Żółty, do lewej */}
      <div className="text-left mb-6">
        <span className="text-[14px] text-yellow-500 font-bold tracking-[0.2em] uppercase">
          INSTRUMENT: {marketId}
        </span>
      </div>

      <div className="flex justify-center gap-2 mb-8">
        <button onClick={() => setSide('BUY')} className={`flex-1 py-2.5 border-2 font-bold uppercase tracking-widest text-[10px] transition-all rounded-sm ${side === 'BUY' ? 'border-green-600 bg-green-600/10 text-green-500' : 'border-gray-900 text-gray-700'}`}>BUY</button>
        <button onClick={() => setSide('SELL')} className={`flex-1 py-2.5 border-2 font-bold uppercase tracking-widest text-[10px] transition-all rounded-sm ${side === 'SELL' ? 'border-red-600 bg-red-600/10 text-red-500' : 'border-gray-900 text-gray-700'}`}>SELL</button>
      </div>

      {/* --- BLOK 1: SET ORDER PRICE --- */}
      <div className="bg-gray-900/30 p-4 rounded-sm border border-gray-900 mb-4 shadow-inner">
        <div className="text-[13px] text-white font-bold tracking-[0.2em] uppercase mb-4 border-l-2 border-yellow-600 pl-2">
          Set Order Price
        </div>
        <div className="flex items-center justify-between gap-4">
          <button onClick={() => setPrice(p => Math.max(0, parseFloat(p) - 0.01).toFixed(2))} className="text-4xl text-gray-600 hover:text-white">-</button>
          <div className="text-center flex-grow">
            <input type="text" value={price} onChange={(e) => setPrice(e.target.value.replace(',', '.'))} className="bg-transparent text-5xl font-bold font-mono w-full text-center outline-none text-white" style={monoStyle} />
            <div className="text-[10px] text-gray-400 font-bold font-mono mt-1" style={monoStyle}>
              EUR / 100kWh <span className="text-yellow-600/50 ml-1 text-[8px]">(1 TOKEN {marketId})</span>
            </div>
          </div>
          <button onClick={() => setPrice(p => (parseFloat(p) + 0.01).toFixed(2))} className="text-4xl text-gray-600 hover:text-white">+</button>
        </div>
      </div>

      {/* --- BLOK 2: SET QUANTITY --- */}
      <div className="bg-gray-900/30 p-4 rounded-sm border border-gray-900 mb-8 shadow-inner">
        <div className="text-[13px] text-white font-bold tracking-[0.2em] uppercase mb-4 border-l-2 border-blue-600 pl-2">
          Set Quantity
        </div>
        <div className="flex items-center justify-between gap-4">
          <button onClick={() => setQuantity(q => Math.max(1, q - 1))} className="text-4xl text-gray-600 hover:text-white">-</button>
          <div className="text-center flex-grow">
            <input type="number" value={quantity} onChange={(e) => setQuantity(parseInt(e.target.value) || 1)} className="bg-transparent text-5xl font-bold font-mono w-full text-center outline-none text-white [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none" style={monoStyle} />
            <div className="text-[10px] text-gray-400 font-bold font-mono mt-1" style={monoStyle}>
              1 TOKEN <span className="text-blue-600/50 ml-1 text-[8px]">(100kWh UNITS)</span>
            </div>
          </div>
          <button onClick={() => setQuantity(q => q + 1)} className="text-4xl text-gray-600 hover:text-white">+</button>
        </div>
      </div>

      {/* EXECUTE - Z poświatą energetyczną */}
      <div className="flex justify-center mb-10">
        <button className={`w-full py-5 border-2 font-black uppercase tracking-[0.5em] text-[16px] transition-all duration-500 rounded-sm
          ${side === 'BUY' 
            ? 'border-green-500 text-green-500 hover:bg-green-500 hover:text-black hover:shadow-[0_0_35px_rgba(34,197,94,0.4)]' 
            : 'border-red-600 text-red-600 hover:bg-red-600 hover:text-white hover:shadow-[0_0_35px_rgba(239,68,68,0.4)]'}`}>
          EXECUTE {side}
        </button>
      </div>

      {/* DEPOSITS SLIDERS */}
      <div className="bg-gray-900/20 border border-gray-900 p-4 rounded-sm mb-6">
        <div className="space-y-5">
          <div>
            <div className="flex justify-between text-[11px] font-mono mb-2 text-blue-400 font-bold uppercase tracking-widest" style={monoStyle}><span>€BSR Stake</span><span>{bsrStake}%</span></div>
            <input type="range" min="10" max="100" step="5" value={bsrStake} onChange={(e) => setBsrStake(parseInt(e.target.value))} className="w-full h-1.5 bg-gray-800 accent-blue-500 cursor-pointer" />
          </div>
          <div>
            <div className="flex justify-between text-[11px] font-mono mb-2 text-blue-800 font-bold uppercase tracking-widest" style={monoStyle}><span>eEURO Stake</span><span>{euroStake}%</span></div>
            <input type="range" min="0" max="90" value={euroStake} readOnly className="w-full h-1.5 bg-gray-950 accent-blue-900" />
          </div>
        </div>
      </div>

      {/* BOTTOM SECTION - WARTOŚCI DEPOZYTÓW */}
      <div className="mt-auto border-t border-gray-900 pt-6">
        <div className="text-center mb-2">
          <span className="text-[11px] text-blue-600 uppercase font-bold tracking-[0.3em]">Deposit Value / Leverage</span>
        </div>
        <div className="text-center mb-8">
          <span className="text-6xl font-bold font-mono text-blue-500 leading-none" style={monoStyle}>{marginValue}%</span>
        </div>
        
        <div className="grid grid-cols-2 gap-6 pt-4 border-t border-gray-900/50">
          <div className="flex flex-col">
            <span className="text-[10px] text-gray-500 uppercase font-bold mb-2 tracking-tight">€BSR Deposit Value:</span>
            <span className="text-[18px] font-mono text-blue-400 font-bold" style={monoStyle}>{bsrReq}</span>
          </div>
          <div className="flex flex-col text-right">
            <span className="text-[10px] text-gray-500 uppercase font-bold mb-2 tracking-tight">eEURO Deposit Value:</span>
            <span className="text-[18px] font-mono text-blue-500 font-bold" style={monoStyle}>{euroReq}</span>
          </div>
        </div>
      </div>
    </div>
  )
}