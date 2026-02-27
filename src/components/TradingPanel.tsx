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

  // Tabela ryzyka dla BlackSlon Settlement Zone (BSZ)
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
    <div className="flex flex-col h-full w-full p-4 select-none font-sans bg-transparent">
      
      <div className="text-center mb-6 border-b border-gray-900 pb-2">
        <span className="text-[10px] text-gray-500 uppercase tracking-[0.4em] font-bold">Trading Terminal</span>
      </div>

      {/* INSTRUMENT: Żółty i do lewej */}
      <div className="text-left mb-6">
        <span className="text-[14px] text-yellow-500 font-bold tracking-[0.2em] uppercase">
          INSTRUMENT: {marketId}
        </span>
      </div>

      <div className="flex justify-center gap-2 mb-8">
        <button onClick={() => setSide('BUY')} className={`flex-1 py-2 border-2 font-bold uppercase tracking-widest text-[10px] transition-all rounded-sm ${side === 'BUY' ? 'border-green-600 bg-green-600/10 text-green-500' : 'border-gray-900 text-gray-700'}`}>BUY</button>
        <button onClick={() => setSide('SELL')} className={`flex-1 py-2 border-2 font-bold uppercase tracking-widest text-[10px] transition-all rounded-sm ${side === 'SELL' ? 'border-red-600 bg-red-600/10 text-red-500' : 'border-gray-900 text-gray-700'}`}>SELL</button>
      </div>

      {/* PRICE - Kolor wartości na biało */}
      <div className="flex flex-col items-center mb-6">
        <div className="flex items-center gap-2">
          <button onClick={() => setPrice(p => Math.max(0, parseFloat(p) - 0.01).toFixed(2))} className="text-3xl text-gray-600 hover:text-white">-</button>
          <div className="text-center">
            <input 
              type="text" 
              value={price} 
              onChange={(e) => setPrice(e.target.value.replace(',', '.'))} 
              className="bg-transparent text-5xl font-bold font-mono w-full text-center outline-none text-white" 
              style={monoStyle} 
            />
            {/* Napis EUR biały i większy z (1 TOKEN...) */}
            <div className="text-[11px] text-white font-bold font-mono mt-1" style={monoStyle}>
              EUR / 100kWh <span className="opacity-70 text-[9px] ml-1">(1 TOKEN {marketId})</span>
            </div>
          </div>
          <button onClick={() => setPrice(p => (parseFloat(p) + 0.01).toFixed(2))} className="text-3xl text-gray-600 hover:text-white">+</button>
        </div>
        <span className="text-[12px] text-white uppercase font-black mt-2 tracking-widest">SET ORDER PRICE</span>
      </div>

      {/* QUANTITY - Napisy na biało, UNIT -> 1 TOKEN */}
      <div className="flex flex-col items-center mb-8">
        <div className="flex items-center gap-2">
          <button onClick={() => setQuantity(q => Math.max(1, q - 1))} className="text-3xl text-gray-600 hover:text-white">-</button>
          <div className="text-center">
            <input 
              type="number" 
              value={quantity} 
              onChange={(e) => setQuantity(parseInt(e.target.value) || 1)} 
              className="bg-transparent text-5xl font-bold font-mono w-full text-center outline-none text-white [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none" 
              style={monoStyle} 
            />
            <div className="text-[11px] text-white font-bold font-mono mt-1" style={monoStyle}>
              1 TOKEN <span className="opacity-70 text-[9px] ml-1">(100kWh)</span>
            </div>
          </div>
          <button onClick={() => setQuantity(q => q + 1)} className="text-3xl text-gray-600 hover:text-white">+</button>
        </div>
        <span className="text-[12px] text-white uppercase font-black mt-2 tracking-widest">SET QUANTITY</span>
      </div>

      {/* EXECUTE - Kolor zależny od strony + efekt poświaty/energii */}
      <div className="flex justify-center mb-8">
        <button className={`
          w-full py-4 border-2 font-black uppercase tracking-[0.4em] text-[14px] transition-all duration-300 rounded-sm
          ${side === 'BUY' 
            ? 'border-green-500 text-green-500 hover:bg-green-500 hover:text-black hover:shadow-[0_0_25px_rgba(34,197,94,0.6)]' 
            : 'border-red-600 text-red-600 hover:bg-red-600 hover:text-white hover:shadow-[0_0_25px_rgba(239,68,68,0.6)]'
          }
        `}>
          EXECUTE
        </button>
      </div>

      {/* DEPOSITS SLIDERS */}
      <div className="bg-black/60 border border-gray-900 p-4 rounded-sm mb-6">
        <div className="space-y-4">
          <div>
            <div className="flex justify-between text-[11px] font-mono mb-2 text-blue-400 font-bold" style={monoStyle}><span>€BSR STAKE</span><span>{bsrStake}%</span></div>
            <input type="range" min="10" max="100" step="5" value={bsrStake} onChange={(e) => setBsrStake(parseInt(e.target.value))} className="w-full h-1.5 bg-gray-800 accent-blue-500 appearance-none cursor-pointer rounded-lg" />
          </div>
          <div>
            <div className="flex justify-between text-[11px] font-mono mb-2 text-blue-600 font-bold" style={monoStyle}><span>eEURO STAKE</span><span>{euroStake}%</span></div>
            <input type="range" min="0" max="90" value={euroStake} readOnly className="w-full h-1.5 bg-gray-900 accent-blue-900 appearance-none rounded-lg" />
          </div>
        </div>
      </div>

      {/* MARGIN / DEPOSIT VALUES - Większe napisy */}
      <div className="mt-auto border-t border-gray-900 pt-6">
        <div className="text-center mb-2">
          <span className="text-[11px] text-blue-700 uppercase font-bold tracking-[0.2em]">DEPOSIT VALUE / LEVERAGE</span>
        </div>
        <div className="text-center mb-6">
          <span className="text-5xl font-bold font-mono text-blue-500 leading-none" style={monoStyle}>{marginValue}%</span>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col border-r border-gray-800 pr-3">
            <span className="text-[10px] text-white uppercase font-bold mb-2 tracking-tight">€BSR Deposit Value:</span>
            <span className="text-[16px] font-mono text-blue-400 font-bold" style={monoStyle}>{bsrReq} BSR</span>
          </div>
          <div className="flex flex-col pl-3">
            <span className="text-[10px] text-white uppercase font-bold mb-2 tracking-tight">eEURO Deposit Value:</span>
            <span className="text-[16px] font-mono text-blue-500 font-bold" style={monoStyle}>{euroReq} EUR</span>
          </div>
        </div>

        <div className="text-center mt-4 opacity-70">
           <span className="text-[9px] text-gray-500 uppercase font-bold tracking-widest">FEE: {currentRisk.fee.toFixed(2)}%</span>
        </div>
      </div>
    </div>
  )
}