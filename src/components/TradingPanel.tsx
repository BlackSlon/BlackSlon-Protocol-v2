'use client'

import { useState, useMemo, useEffect } from 'react'
import { useParams } from 'next/navigation'

export default function TradingPanel() {
  const params = useParams()
  const rawId = (params.id as string) || 'BS-P-PL'
  const marketId = rawId.replace('IPT', 'BS') 

  const [price, setPrice] = useState('10.59')
  const [quantity, setQuantity] = useState(5)
  const [side, setSide] = useState<'BUY' | 'SELL'>('BUY')
  const [bsrStake, setBsrStake] = useState(50)
  const [isMounted, setIsMounted] = useState(false)
  
  useEffect(() => {
    setIsMounted(true)
    console.log('TradingPanel mounted!')
  }, [])
  
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
    <div className="flex flex-col h-full bg-black font-mono text-white p-0">
      
      <div className="w-full pt-1 pb-1 flex flex-col items-center shrink-0">
        <div className="text-[10px] text-gray-500 uppercase tracking-[0.5em] font-bold">
          Order Panel
        </div>
        <div className="w-[80%] border-b border-gray-800 mt-2" />
      </div>

      <div className="flex-grow px-6 pb-6 flex flex-col min-h-0 sm:px-2">
        <div className="pt-2 pb-1 bg-gradient-to-b from-black to-gray-950 w-full">
          <div className="text-[10px] tracking-widest text-amber-700 font-bold mb-1">BlackSlon Trading Terminal</div>
        </div>

        <div className="flex justify-center gap-2 mb-3 shrink-0 pointer-events-auto relative z-10">
          <button onClick={() => { console.log('BUY button clicked!'); setSide('BUY'); }} className={`flex-1 py-1.5 border font-normal uppercase tracking-widest text-[9px] transition-all rounded-sm pointer-events-auto relative z-10 ${side === 'BUY' ? 'border-green-700 bg-green-700/10 text-green-700' : 'border-gray-900 text-gray-700'}`}>BUY</button>
          <button onClick={() => setSide('SELL')} className={`flex-1 py-1.5 border font-normal uppercase tracking-widest text-[9px] transition-all rounded-sm pointer-events-auto relative z-10 ${side === 'SELL' ? 'border-red-600 bg-red-600/10 text-red-500' : 'border-gray-900 text-gray-700'}`}>SELL</button>
        </div>

        <div className="border-b border-gray-900/50 pb-2 mb-2 shrink-0">
          <div className="text-[9px] text-gray-500 font-normal mb-1">SET ORDER PRICE (EUR/100kWh)</div> 
          <div className="flex items-center justify-center">
            <div className="bg-zinc-800/70 border border-gray-700 rounded-sm flex items-center w-fit mx-auto">
              <button onClick={() => setPrice(p => (parseFloat(p) - 0.01).toFixed(2))} className="text-sm text-gray-600 hover:text-white px-2 py-1">-</button>
              <input type="text" value={price} onChange={(e) => setPrice(e.target.value)} className="bg-transparent text-sm text-white tracking-tighter leading-none text-center outline-none w-16 py-1" />
              <button onClick={() => setPrice(p => (parseFloat(p) + 0.01).toFixed(2))} className="text-sm text-gray-600 hover:text-white px-2 py-1">+</button>
            </div>
          </div>
        </div>

        <div className="border-b border-gray-900/50 pb-2 mb-3 shrink-0">
          <div className="text-[9px] text-gray-500 mb-1">SET QUANTITY (1 {marketId} TOKEN = 100kWh)</div> 
          <div className="flex items-center justify-center">
            <div className="bg-zinc-800/70 border border-gray-700 rounded-sm flex items-center w-fit mx-auto">
              <button onClick={() => setQuantity(q => Math.max(1, q - 1))} className="text-sm text-gray-600 hover:text-white px-2 py-1">-</button>
              <input type="number" value={quantity} onChange={(e) => setQuantity(parseInt(e.target.value) || 1)} className="bg-transparent text-sm text-white tracking-tighter leading-none text-center outline-none w-16 py-1 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none" />
              <button onClick={() => setQuantity(q => q + 1)} className="text-sm text-gray-600 hover:text-white px-2 py-1">+</button>
            </div>
          </div>
        </div>

        <button className={`w-full py-2 mb-4 border uppercase tracking-[0.3em] text-[10px] transition-all duration-300 rounded-sm shrink-0
          ${side === 'BUY' 
            ? 'border-green-700 text-green-700 hover:bg-green-700 hover:text-black' 
            : 'border-red-600 text-red-600 hover:bg-red-600 hover:text-white'}`}>
          CONFIRM {side} ORDER
        </button>

        <div className="space-y-1 mb-2 shrink-0 px-1 pointer-events-auto">
          <div className="text-[9px] text-gray-500 uppercase tracking-tighter mb-1">Deposit Configuration</div>
          <div className="px-2 py-1 rounded-sm border border-gray-900">
            <div className="flex justify-between text-[9px] tracking-[0.2em] mb-1"><span className="text-amber-700">€BSR RATIO</span><span className="text-amber-700">{bsrStake}%</span></div>
            <input type="range" min="10" max="100" step="1" value={bsrStake} onChange={(e) => setBsrStake(parseInt(e.target.value))} className="w-full h-px bg-gray-800 cursor-pointer pointer-events-auto" style={{ accentColor: '#b45309' }} />
          </div>
          <div className="px-2 py-1 rounded-sm border border-gray-900">
            <div className="flex justify-between text-[9px] tracking-[0.2em] mb-1"><span className="text-sky-400">eEURO RATIO</span><span className="text-sky-400">{euroStake}%</span></div>
            <input type="range" min="10" max="100" value={euroStake} readOnly className="w-full h-px bg-gray-950" style={{ accentColor: '#38bdf8' }} />
          </div>
        </div>

        <div className="mt-auto border-t border-gray-900 pt-2 shrink-0">
          <div className="text-center mb-1">
            <span className="text-[9px] text-gray-400 uppercase tracking-tighter">REQUIRED MARGIN</span>
          </div>
          <div className="text-center mb-2">
            <span className="text-sm text-gray-400 leading-none">
              {marginValue}%
            </span>
          </div>
          
          <div className="flex flex-wrap gap-2 border-t border-gray-900/50 pt-2 pb-2">
            <div className="border border-amber-700 rounded-sm py-1 px-3 w-fit">
              <div className="text-[8px] text-amber-700 uppercase tracking-widest mb-0">€BSR Deposit Value</div>
              <div className="text-sm text-amber-700 tracking-tighter leading-tight">{bsrReq} BSR</div>
            </div>
            <div className="border border-sky-400 rounded-sm py-1 px-3 w-fit ml-auto">
              <div className="text-[8px] text-sky-400 uppercase tracking-widest mb-0"><span className="normal-case">e</span>EURO Deposit Value</div>
              <div className="text-sm text-sky-400 tracking-tighter leading-tight">{euroReq} EUR</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}