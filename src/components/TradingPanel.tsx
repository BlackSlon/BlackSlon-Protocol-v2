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
    /* Skala 0.8 dla pewności, że wszystko wejdzie przy mniejszych ekranach */
    <div className="flex flex-col h-full p-3 select-none font-sans bg-transparent scale-[0.85] origin-top overflow-hidden">
      
      {/* 1) TRADING TERMINAL - mniejszy, w jednej linii */}
      <div className="text-center mb-1 border-b border-gray-900 pb-1 shrink-0">
        <span className="text-[9px] text-gray-500 uppercase tracking-[0.3em] font-bold whitespace-nowrap">Trading Terminal</span>
      </div>

      <div className="text-center mb-3 shrink-0">
        <span className="text-[12px] text-red-600 font-bold tracking-[0.1em] uppercase">Trading Order</span>
      </div>

      {/* INSTRUMENT */}
      <div className="text-left mb-3 shrink-0">
        <div className="text-[7px] text-gray-600 uppercase font-bold mb-0.5">Active Instrument</div>
        <span className="text-[12px] text-yellow-500 font-bold uppercase">{marketId}</span>
      </div>

      {/* BUY/SELL BUTTONS */}
      <div className="flex justify-center gap-1.5 mb-3 shrink-0">
        <button onClick={() => setSide('BUY')} className={`flex-1 py-1 border font-bold uppercase tracking-widest text-[8px] transition-all rounded-sm ${side === 'BUY' ? 'border-green-600 bg-green-600/10 text-green-500' : 'border-gray-900 text-gray-700'}`}>BUY</button>
        <button onClick={() => setSide('SELL')} className={`flex-1 py-1 border font-bold uppercase tracking-widest text-[8px] transition-all rounded-sm ${side === 'SELL' ? 'border-red-600 bg-red-600/10 text-red-500' : 'border-gray-900 text-gray-700'}`}>SELL</button>
      </div>

      {/* 2) SEKCJA CENY - BEZ KRESEK, 3) TOKEN NA BIAŁO */}
      <div className="border-b border-gray-900/50 pb-2 mb-3 shrink-0">
        <div className="text-[8px] text-gray-400 uppercase font-bold mb-1">Set Order Price</div>
        <div className="flex items-center justify-between">
          <button onClick={() => setPrice(p => Math.max(0, parseFloat(p) - 0.01).toFixed(2))} className="text-xl text-gray-600 hover:text-white">-</button>
          <div className="text-center flex-grow">
            <input type="text" value={price} onChange={(e) => setPrice(e.target.value.replace(',', '.'))} className="bg-transparent text-2xl font-bold font-mono w-full text-center outline-none text-white" style={monoStyle} />
            <div className="text-[8px] text-white font-mono mt-0.5 opacity-80" style={monoStyle}>
              EUR / 100kWh <span className="opacity-40 text-[7px] ml-1">(1 TOKEN {marketId})</span>
            </div>
          </div>
          <button onClick={() => setPrice(p => (parseFloat(p) + 0.01).toFixed(2))} className="text-2xl text-gray-600 hover:text-white">+</button>
        </div>
      </div>

      {/* 2) SEKCJA ILOŚCI - BEZ KRESEK, 3) TOKEN NA BIAŁO */}
      <div className="border-b border-gray-900/50 pb-2 mb-3 shrink-0">
        <div className="text-[8px] text-gray-400 uppercase font-bold mb-1">Set Quantity</div>
        <div className="flex items-center justify-between">
          <button onClick={() => setQuantity(q => Math.max(1, q - 1))} className="text-xl text-gray-600 hover:text-white">-</button>
          <div className="text-center flex-grow">
            <input type="number" value={quantity} onChange={(e) => setQuantity(parseInt(e.target.value) || 1)} className="bg-transparent text-2xl font-bold font-mono w-full text-center outline-none text-white [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none" style={monoStyle} />
            <div className="text-[8px] text-white font-mono mt-0.5 opacity-80" style={monoStyle}>
              1 TOKEN <span className="opacity-40 text-[7px] ml-1">(100kWh UNITS)</span>
            </div>
          </div>
          <button onClick={() => setQuantity(q => q + 1)} className="text-2xl text-gray-600 hover:text-white">+</button>
        </div>
      </div>

      {/* 4) EXECUTE - mniejszy button */}
      <button className={`w-full py-1.5 mb-4 border font-black uppercase tracking-[0.2em] text-[10px] transition-all duration-300 rounded-sm shrink-0
        ${side === 'BUY' 
          ? 'border-green-500 text-green-500 hover:bg-green-500 hover:text-black shadow-[0_0_10px_rgba(34,197,94,0.1)]' 
          : 'border-red-600 text-red-600 hover:bg-red-600 hover:text-white shadow-[0_0_10px_rgba(239,68,68,0.1)]'}`}>
        EXECUTE {side}
      </button>

      {/* DEPOSITS - skondensowane */}
      <div className="space-y-3 mb-4 shrink-0">
        <div className="text-[7px] text-gray-500 uppercase font-bold tracking-tighter">Deposit Distribution</div>
        <div className="bg-gray-900/10 p-1.5 rounded-sm border border-gray-900">
          <div className="flex justify-between text-[8px] font-mono mb-1 text-blue-400 font-bold uppercase" style={monoStyle}><span>€BSR Stake</span><span>{bsrStake}%</span></div>
          <input type="range" min="10" max="100" step="5" value={bsrStake} onChange={(e) => setBsrStake(parseInt(e.target.value))} className="w-full h-1 bg-gray-800 accent-blue-500 cursor-pointer" />
        </div>
        <div className="bg-gray-900/10 p-1.5 rounded-sm border border-gray-900">
          <div className="flex justify-between text-[8px] font-mono mb-1 text-blue-800 font-bold uppercase" style={monoStyle}><span>eEURO Stake</span><span>{euroStake}%</span></div>
          <input type="range" min="0" max="90" value={euroStake} readOnly className="w-full h-1 bg-gray-950 accent-blue-900" />
        </div>
      </div>

      {/* WARTOŚCI DEPOZYTÓW - na samym dole */}
      <div className="mt-auto border-t border-gray-900 pt-2 shrink-0">
        <div className="text-center mb-0.5">
          <span className="text-[7px] text-gray-600 uppercase font-bold tracking-widest">Deposit Value / Leverage</span>
        </div>
        <div className="text-center mb-2">
          <span className="text-xl font-bold font-mono text-blue-500 leading-none" style={monoStyle}>{marginValue}%</span>
        </div>
        
        <div className="grid grid-cols-2 gap-2">
          <div className="flex flex-col">
            <span className="text-[7px] text-gray-600 uppercase font-bold mb-0.5 tracking-tighter">€BSR Value</span>
            <span className="text-[11px] font-mono text-blue-400 font-bold" style={monoStyle}>{bsrReq}</span>
          </div>
          <div className="flex flex-col text-right">
            <span className="text-[7px] text-gray-600 uppercase font-bold mb-0.5 tracking-tighter">eEURO Value</span>
            <span className="text-[11px] font-mono text-blue-500 font-bold" style={monoStyle}>{euroReq}</span>
          </div>
        </div>
      </div>
    </div>
  )
}