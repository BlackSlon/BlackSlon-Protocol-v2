'use client'

import { useState, useMemo } from 'react'
import { useParams } from 'next/navigation'

export default function TradingPanel() {
  const params = useParams()
  const rawId = (params.id as string) || 'BS-P-PL'
  const marketId = rawId.replace('IPT', 'BS') 

  const [price, setPrice] = useState('10.59')
  const [quantity, setQuantity] = useState(5)
  const [side, setSide] = useState<'BUY' | 'SELL'>('BUY')
  const [bsrStake, setBsrStake] = useState(50)
  
  const euroStake = 100 - bsrStake

  const riskTable = [
    { threshold: 10, marginL: 50, marginS: 100, fee: 1.00 },
    { threshold: 25, marginL: 45, marginS: 90, fee: 0.85 },
    { threshold: 50, marginL: 40, marginS: 80, fee: 0.60 },
    { threshold: 75, marginL: 30, marginS: 60, fee: 0.35 },
    { threshold: 100, marginL: 25, marginS: 50, fee: 0.20 }
  ]

  const currentRisk = useMemo(() => {
    return [...riskTable].reverse().find(r => bsrStake >= r.threshold) || riskTable[0]
  }, [bsrStake])

  const marginValue = side === 'BUY' ? currentRisk.marginL : currentRisk.marginS
  
  const { bsrReq, euroReq } = useMemo(() => {
    const p = parseFloat(price.replace(',', '.')) || 0
    const q = quantity || 0
    const totalNotional = p * q
    const totalMarginNeeded = totalNotional * (marginValue / 100)
    
    return {
      bsrReq: (totalMarginNeeded * (bsrStake / 100)).toFixed(2),
      euroReq: (totalMarginNeeded * (euroStake / 100)).toFixed(2)
    }
  }, [price, quantity, marginValue, bsrStake, euroStake])

  return (
    /* USUNIĘTO scale-[0.85] - to on psuł kliknięcia. Zamiast tego używamy mniejszych paddingów i tekstu */
    <div className="flex flex-col h-full p-3 bg-black/80 font-mono text-white relative z-20">
      
      <div className="text-[9px] text-gray-600 uppercase tracking-[0.4em] font-bold text-center py-2 border-b border-gray-900 mb-4">
        TRADING PANEL
      </div>

      <div className="text-center mb-3">
        <div className="text-[9px] font-black tracking-widest uppercase mb-1 text-red-600">ACTIVE INSTRUMENT</div>
        <span className="text-[12px] text-yellow-500 font-bold uppercase tracking-[0.2em]">{marketId}</span>
      </div>

      {/* Przełącznik BUY/SELL */}
      <div className="flex justify-center gap-1 mb-4">
        <button 
          type="button"
          onClick={() => setSide('BUY')} 
          className={`flex-1 py-2 border font-bold text-[10px] transition-all rounded-sm ${side === 'BUY' ? 'border-green-600 bg-green-600/20 text-green-500 shadow-[0_0_10px_rgba(22,163,74,0.2)]' : 'border-gray-800 text-gray-700'}`}
        >BUY</button>
        <button 
          type="button"
          onClick={() => setSide('SELL')} 
          className={`flex-1 py-2 border font-bold text-[10px] transition-all rounded-sm ${side === 'SELL' ? 'border-red-600 bg-red-600/20 text-red-500 shadow-[0_0_10px_rgba(220,38,38,0.2)]' : 'border-gray-800 text-gray-700'}`}
        >SELL</button>
      </div>

      {/* PRICE INPUT */}
      <div className="border-b border-gray-900/50 pb-3 mb-3">
        <div className="text-[10px] text-gray-600 font-bold mb-1 uppercase">Price (EUR/100kWh)</div> 
        <div className="bg-zinc-900 border border-gray-800 rounded-sm flex items-center p-1">
          <button onClick={() => setPrice(p => (parseFloat(p) - 0.01).toFixed(2))} className="w-10 text-xl text-gray-600 hover:text-white">-</button>
          <input 
            type="text" 
            value={price} 
            onChange={(e) => setPrice(e.target.value)} 
            className="bg-transparent text-xl text-center outline-none text-white w-full font-black" 
          />
          <button onClick={() => setPrice(p => (parseFloat(p) + 0.01).toFixed(2))} className="w-10 text-xl text-gray-600 hover:text-white">+</button>
        </div>
      </div>

      {/* QUANTITY INPUT */}
      <div className="border-b border-gray-900/50 pb-3 mb-4">
        <div className="text-[10px] text-gray-600 font-bold mb-1 uppercase">Quantity (Unit)</div> 
        <div className="bg-zinc-900 border border-gray-800 rounded-sm flex items-center p-1">
          <button onClick={() => setQuantity(q => Math.max(1, q - 1))} className="w-10 text-xl text-gray-600 hover:text-white">-</button>
          <input 
            type="number" 
            value={quantity} 
            onChange={(e) => setQuantity(parseInt(e.target.value) || 1)} 
            className="bg-transparent text-xl text-center outline-none text-white w-full font-black [appearance:textfield]" 
          />
          <button onClick={() => setQuantity(q => q + 1)} className="w-10 text-xl text-gray-600 hover:text-white">+</button>
        </div>
      </div>

      {/* CONFIGURATION - SLIDER */}
      <div className="space-y-4 mb-6">
        <div className="text-[10px] text-gray-500 uppercase font-bold tracking-widest border-l-2 border-blue-500 pl-2">Deposit Configuration</div>
        <div className="bg-gray-900/40 p-3 rounded-sm border border-gray-800">
          <div className="flex justify-between text-[10px] font-bold mb-2">
            <span className="text-gray-400 italic">€BSR STAKE</span>
            <span className="text-blue-400">{bsrStake}%</span>
          </div>
          <input 
            type="range" min="10" max="100" step="1" 
            value={bsrStake} 
            onChange={(e) => setBsrStake(parseInt(e.target.value))} 
            className="w-full h-1.5 bg-gray-800 rounded-lg appearance-none cursor-pointer accent-blue-500" 
          />
        </div>
      </div>

      {/* EXECUTE BUTTON */}
      <button className={`w-full py-3 mb-6 border-2 font-black uppercase tracking-[0.3em] text-[11px] transition-all duration-300 rounded-sm
        ${side === 'BUY' 
          ? 'border-green-600 text-green-500 hover:bg-green-600 hover:text-black' 
          : 'border-red-700 text-red-600 hover:bg-red-700 hover:text-white'}`}>
        EXECUTE {side}
      </button>

      {/* SUMMARY */}
      <div className="mt-auto border-t border-gray-900 pt-4 bg-black/40 p-2">
        <div className="flex justify-between items-center mb-3">
          <span className="text-[10px] text-gray-600 font-bold uppercase">Required Margin:</span>
          <span className="text-xl font-black text-white">{marginValue}%</span>
        </div>
        
        <div className="grid grid-cols-2 gap-2">
          <div className="bg-gray-950 p-2 border border-gray-900">
            <div className="text-[8px] text-gray-600 uppercase mb-1">€BSR Deposit</div>
            <div className="text-sm font-bold text-yellow-600">{bsrReq} BSR</div>
          </div>
          <div className="bg-gray-950 p-2 border border-gray-900 text-right">
            <div className="text-[8px] text-gray-600 uppercase mb-1">eEURO Deposit</div>
            <div className="text-sm font-bold text-blue-500">{euroReq} EUR</div>
          </div>
        </div>
      </div>
    </div>
  )
}