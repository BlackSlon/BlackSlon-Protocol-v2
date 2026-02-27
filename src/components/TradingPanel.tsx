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
    <div className="flex flex-col h-full p-2 select-none font-sans bg-transparent scale-[0.85] origin-top">
      
      <div className="text-center mb-2 border-b border-gray-900 pb-1 shrink-0">
        <span className="text-[10px] text-gray-500 uppercase tracking-[0.5em] font-bold whitespace-nowrap">Trading Terminal</span>
      </div>

      <div className="text-left mb-3 shrink-0">
        <div className="text-[8px] text-gray-600 uppercase font-bold mb-1">Active Instrument</div>
        <span className="text-[13px] text-yellow-500 font-bold uppercase tracking-[0.2em]">{marketId}</span>
      </div>

      <div className="flex justify-center gap-2 mb-3 shrink-0">
        <button onClick={() => setSide('BUY')} className={`flex-1 py-1.5 border font-bold uppercase tracking-widest text-[9px] transition-all rounded-sm ${side === 'BUY' ? 'border-green-600 bg-green-600/10 text-green-500' : 'border-gray-900 text-gray-700'}`}>BUY</button>
        <button onClick={() => setSide('SELL')} className={`flex-1 py-1.5 border font-bold uppercase tracking-widest text-[9px] transition-all rounded-sm ${side === 'SELL' ? 'border-red-600 bg-red-600/10 text-red-500' : 'border-gray-900 text-gray-700'}`}>SELL</button>
      </div>

      <div className="border-b border-gray-900/50 pb-2 mb-2 shrink-0">
        <div className="text-[11px] text-gray-600 uppercase font-bold mb-1">Set Order Price (EUR/100kWh)</div>
        <div className="flex items-center justify-between">
          <div className="bg-zinc-800/70 border border-gray-700 rounded-sm flex items-center p-1">
            <button onClick={() => setPrice(p => (parseFloat(p) - 0.01).toFixed(2))} className="text-2xl text-gray-600 hover:text-white px-2">-</button>
            <input type="text" value={price} onChange={(e) => setPrice(e.target.value)} className="bg-transparent text-[27px] font-bold text-center outline-none text-white px-2 w-full" />
            <button onClick={() => setPrice(p => (parseFloat(p) + 0.01).toFixed(2))} className="text-2xl text-gray-600 hover:text-white px-2">+</button>
          </div>
        </div>
      </div>

      <div className="border-b border-gray-900/50 pb-2 mb-3 shrink-0">
        <div className="text-[11px] text-gray-600 uppercase font-bold mb-1">Set Quantity (1 {marketId} TOKEN = 100kWh)</div>
        <div className="flex items-center justify-between">
          <div className="bg-zinc-800/70 border border-gray-700 rounded-sm flex items-center p-1">
            <button onClick={() => setQuantity(q => Math.max(1, q - 1))} className="text-2xl text-gray-600 hover:text-white px-2">-</button>
            <input type="number" value={quantity} onChange={(e) => setQuantity(parseInt(e.target.value) || 1)} className="bg-transparent text-[27px] font-bold text-center outline-none text-white px-2 w-full [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none" />
            <button onClick={() => setQuantity(q => q + 1)} className="text-2xl text-gray-600 hover:text-white px-2">+</button>
          </div>
        </div>
      </div>

      <button className={`w-full py-2 mb-4 border font-black uppercase tracking-[0.3em] text-[10px] transition-all duration-300 rounded-sm shrink-0
        ${side === 'BUY' 
          ? 'border-green-500 text-green-500 hover:bg-green-500 hover:text-black' 
          : 'border-red-600 text-red-600 hover:bg-red-600 hover:text-white'}`}>
        EXECUTE {side}
      </button>

      <div className="space-y-3 mb-4 shrink-0 px-1">
        <div className="text-[11px] text-gray-500 uppercase font-bold tracking-tighter">Deposit Configuration</div>
        <div className="bg-gray-900/20 p-2 rounded-sm border border-gray-900">
          <div className="flex justify-between text-[9px] mb-2 text-green-400 uppercase"><span>€BSR Stake</span><span>{bsrStake}%</span></div>
          <input type="range" min="10" max="100" step="1" value={bsrStake} onChange={(e) => setBsrStake(parseInt(e.target.value))} className="w-full h-1 bg-gray-800 accent-green-500 cursor-pointer" />
        </div>
        <div className="bg-gray-900/20 p-2 rounded-sm border border-gray-900">
          <div className="flex justify-between text-[9px] mb-2 text-green-800 uppercase"><span>eEURO Stake</span><span>{euroStake}%</span></div>
          <input type="range" min="0" max="90" value={euroStake} readOnly className="w-full h-1 bg-gray-950 accent-green-900" />
        </div>
      </div>

      <div className="mt-auto border-t border-gray-900 pt-2 shrink-0">
        <div className="text-center mb-1">
          <span className="text-[11px] text-gray-500 uppercase font-bold tracking-tighter">DEPOSIT VALUE / LEVERAGE</span>
        </div>
        <div className="text-center mb-2">
          <span className="text-lg font-bold text-white leading-none">
            {marginValue}%
          </span>
        </div>
        
        <div className="grid grid-cols-2 gap-4 border-t border-gray-900/50 pt-2 pb-2">
          <div className="flex flex-col border-r border-gray-900/50 pr-2">
            <span className="text-[11px] text-gray-600 uppercase font-bold mb-1">€BSR Deposit Value:</span>
            <span className="text-[22px] text-green-400">{bsrReq} BSR</span>
          </div>
          <div className="flex flex-col pl-2 text-right">
            <span className="text-[11px] text-gray-600 uppercase font-bold mb-1">eEURO Deposit Value:</span>
            <span className="text-[22px] text-green-400">{euroReq} EUR</span>
          </div>
        </div>
      </div>
    </div>
  )
}