'use client'

import { useState } from 'react'
import { useParams } from 'next/navigation'

export default function TradingPanel() {
  const params = useParams()
  const rawId = (params.id as string) || 'BS-P-PL'
  const marketId = rawId.replace('IPT', 'BS') 
  
  const monoStyle = { fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace' }

  const [price, setPrice] = useState('10.59')
  const [quantity, setQuantity] = useState(1)
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
  const marginValue = side === 'BUY' ? currentRisk.margin : currentRisk.margin * 2 // Przykład wyższego marginu dla SELL
  
  const totalValue = parseFloat(price) * quantity
  const bsrReq = (totalValue * (marginValue / 100) * (bsrStake / 100)).toFixed(2)
  const euroReq = (totalValue * (marginValue / 100) * (euroStake / 100)).toFixed(2)

  return (
    /* Węższy kontener (w-[260px]) i lekki scale */
    <div className="flex flex-col h-full w-[260px] p-2 select-none font-sans bg-black/40 border border-gray-900 scale-[0.9] origin-top mx-auto">
      
      <div className="text-center mb-4 border-b border-gray-900 pb-2">
        <span className="text-[9px] text-gray-500 uppercase tracking-[0.4em] font-bold">Trading Terminal</span>
      </div>

      <div className="text-center mb-3">
        <span className="text-[12px] text-red-600 font-bold tracking-[0.2em] uppercase">
          INSTRUMENT: {marketId}
        </span>
      </div>

      {/* BUY/SELL */}
      <div className="flex justify-center gap-2 mb-4">
        <button onClick={() => setSide('BUY')} className={`flex-1 py-1.5 border font-bold uppercase tracking-widest text-[9px] transition-all rounded-sm ${side === 'BUY' ? 'border-green-600 bg-green-600/10 text-green-500' : 'border-gray-900 text-gray-700'}`}>BUY</button>
        <button onClick={() => setSide('SELL')} className={`flex-1 py-1.5 border font-bold uppercase tracking-widest text-[9px] transition-all rounded-sm ${side === 'SELL' ? 'border-red-600 bg-red-600/10 text-red-500' : 'border-gray-900 text-gray-700'}`}>SELL</button>
      </div>

      {/* SET PRICE */}
      <div className="flex flex-col items-center mb-3">
        <div className="flex items-center gap-2">
          <button onClick={() => setPrice(p => Math.max(0, parseFloat(p) - 0.01).toFixed(2))} className="text-xl text-gray-600 hover:text-white">-</button>
          <div className="text-center">
            <input type="text" value={price} onChange={(e) => setPrice(e.target.value.replace(',', '.'))} className={`bg-transparent text-4xl font-bold font-mono w-32 text-center outline-none ${side === 'BUY' ? 'text-green-500' : 'text-red-500'}`} style={monoStyle} />
            <div className="text-[7px] text-gray-600 font-mono" style={monoStyle}>EUR / 100kWh</div>
          </div>
          <button onClick={() => setPrice(p => (parseFloat(p) + 0.01).toFixed(2))} className="text-xl text-gray-600 hover:text-white">+</button>
        </div>
        <span className="text-[9px] text-white uppercase font-black mt-1 tracking-widest">SET ORDER PRICE</span>
      </div>

      {/* SET QUANTITY / VOLUME */}
      <div className="flex flex-col items-center mb-4">
        <div className="flex items-center gap-2">
          <button onClick={() => setQuantity(q => Math.max(1, q - 1))} className="text-xl text-gray-600 hover:text-white">-</button>
          <div className="text-center">
            <input type="number" value={quantity} onChange={(e) => setQuantity(parseInt(e.target.value) || 1)} className="bg-transparent text-4xl font-bold font-mono w-32 text-center outline-none text-white [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none" style={monoStyle} />
            <div className="text-[7px] text-gray-600 font-mono" style={monoStyle}>UNITS (100kWh)</div>
          </div>
          <button onClick={() => setQuantity(q => q + 1)} className="text-xl text-gray-600 hover:text-white">+</button>
        </div>
        <span className="text-[9px] text-white uppercase font-black mt-1 tracking-widest">SET QUANTITY</span>
      </div>

      <div className="flex justify-center mb-4">
        <button className="w-full py-2 border border-yellow-600 text-yellow-600 font-black uppercase tracking-[0.3em] text-[10px] transition-all hover:bg-yellow-600 hover:text-black rounded-sm">EXECUTE</button>
      </div>

      {/* DEPOSITS SLIDERS */}
      <div className="bg-black/40 border border-gray-900 p-2 rounded-sm mb-3">
        <div className="space-y-3">
          <div>
            <div className="flex justify-between text-[7px] font-mono mb-1 text-blue-400 font-bold" style={monoStyle}><span>€BSR STAKE</span><span>{bsrStake}%</span></div>
            <input type="range" min="10" max="100" step="5" value={bsrStake} onChange={(e) => setBsrStake(parseInt(e.target.value))} className="w-full h-1 bg-gray-800 accent-blue-500 appearance-none cursor-pointer rounded-lg" />
          </div>
          <div>
            <div className="flex justify-between text-[7px] font-mono mb-1 text-blue-600 font-bold" style={monoStyle}><span>eEURO STAKE</span><span>{euroStake}%</span></div>
            <input type="range" min="0" max="90" value={euroStake} readOnly className="w-full h-1 bg-gray-900 accent-blue-900 appearance-none rounded-lg" />
          </div>
        </div>
      </div>

      {/* BOTTOM SECTION - MARGIN / LEVERAGE & VALUES */}
      <div className="mt-auto pt-2 border-t border-gray-900">
        <div className="text-center mb-1">
          <span className="text-[7px] text-blue-700 uppercase font-bold tracking-widest">% DEPOSIT VALUE / LEVERAGE</span>
        </div>
        <div className="text-center mb-2">
          <span className="text-3xl font-bold font-mono text-blue-500 leading-none" style={monoStyle}>{marginValue}%</span>
        </div>
        
        <div className="grid grid-cols-2 gap-2 text-[7px] border-t border-gray-900/50 pt-2">
          <div className="flex flex-col">
            <span className="text-gray-600 uppercase font-bold mb-1">€BSR Deposit Value:</span>
            <span className="text-[10px] font-mono text-blue-400 font-bold" style={monoStyle}>{bsrReq} BSR</span>
          </div>
          <div className="flex flex-col text-right">
            <span className="text-gray-600 uppercase font-bold mb-1">eEURO Deposit Value:</span>
            <span className="text-[10px] font-mono text-blue-500 font-bold" style={monoStyle}>{euroReq} EUR</span>
          </div>
        </div>

        <div className="text-center mt-2 opacity-50">
           <span className="text-[7px] text-gray-600 uppercase font-bold">FEE: {currentRisk.fee.toFixed(2)}%</span>
        </div>
      </div>
    </div>
  )
}