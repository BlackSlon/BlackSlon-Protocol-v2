'use client'

import { useState } from 'react'

interface OrderPanelProps {
  currentPrice: number
  borderColor: string
  montserratStyle: any
}

export default function OrderPanel({ currentPrice, borderColor, montserratStyle }: OrderPanelProps) {
  const [isBuy, setIsBuy] = useState(true)
  const [bsrRatio, setBsrRatio] = useState(0.25) 
  const [quantity, setQuantity] = useState(100)

  // Twoja logika Marginu (25% przy 100% BSR dla BUY) [cite: 2026-02-15]
  const baseMargin = isBuy ? 0.75 : 0.50
  const currentMarginPercent = 100 - (baseMargin * bsrRatio * 100)
  
  const totalNotional = quantity * currentPrice
  const totalMarginRequired = totalNotional * (currentMarginPercent / 100)
  
  const requiredBSR = totalMarginRequired * bsrRatio
  const requiredEuro = totalMarginRequired * (1 - bsrRatio)

  const monoStyle = { fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace' }

  return (
    <div className="flex flex-col h-full p-6 select-none" style={montserratStyle}>
      {/* HEADER PANELU */}
      <div className="text-center mb-4 border-b border-gray-900 pb-2">
        <span className="text-[10px] tracking-[0.4em] text-gray-400 uppercase font-bold">Order Panel</span>
      </div>

      <div className="text-center mb-6">
        <span className="text-[11px] text-red-600 font-bold tracking-widest uppercase">Instrument: IPT-P-PL</span>
        <div className="flex items-center justify-center gap-2 mt-2">
          <span className="text-4xl font-bold text-yellow-500" style={monoStyle}>{currentPrice.toFixed(2)}</span>
          <span className="text-xs text-gray-500 mt-2">EUR/vkWh</span>
        </div>
      </div>

      {/* QUANTITY SELECTOR */}
      <div className="flex flex-col items-center mb-8">
        <span className="text-[9px] text-gray-500 uppercase tracking-widest mb-2">Quantity</span>
        <div className="flex items-center gap-4">
          <button onClick={() => setQuantity(q => Math.max(0, q - 1))} className="w-8 h-8 border border-gray-700 rounded flex items-center justify-center bg-gray-900 text-gray-400">-</button>
          <div className="w-16 h-8 border border-gray-700 rounded flex items-center justify-center font-mono text-sm bg-black">{quantity}</div>
          <button onClick={() => setQuantity(q => q + 1)} className="w-8 h-8 border border-gray-700 rounded flex items-center justify-center bg-gray-900 text-gray-400">+</button>
        </div>
      </div>

      {/* BUY/SELL BUTTONS */}
      <div className="flex gap-4 mb-10">
        <button 
          onClick={() => setIsBuy(true)}
          className={`flex-1 py-4 border-2 font-bold text-sm transition-all ${isBuy ? 'border-green-600 text-green-500 bg-green-950/20' : 'border-gray-800 text-gray-700'}`}
        >
          BUY
        </button>
        <button 
          onClick={() => setIsBuy(false)}
          className={`flex-1 py-4 border-2 font-bold text-sm transition-all ${!isBuy ? 'border-red-600 text-red-500 bg-red-950/20' : 'border-gray-800 text-gray-700'}`}
        >
          SELL
        </button>
      </div>

      <div className="border-t border-gray-900 pt-6 mb-4">
        <div className="text-center mb-4">
          <span className="text-[10px] text-gray-400 uppercase tracking-widest font-bold">Deposit</span>
        </div>
        
        {/* Przełącznik Buy/Sell wewnątrz Deposit */}
        <div className="flex justify-center mb-6">
          <div className="bg-gray-900 p-1 rounded-full flex gap-1 border border-gray-800">
            <button className={`px-4 py-1 rounded-full text-[8px] font-bold ${isBuy ? 'bg-white text-black' : 'text-gray-500'}`}>BUY</button>
            <button className={`px-4 py-1 rounded-full text-[8px] font-bold ${!isBuy ? 'bg-white text-black' : 'text-gray-500'}`}>SELL</button>
          </div>
        </div>

        {/* SUWAKI */}
        <div className="space-y-6 px-4">
          <div className="relative">
            <div className="flex justify-between text-[9px] text-gray-500 uppercase mb-2">
              <span>€BSR</span>
              <span>{(bsrRatio * 100).toFixed(0)}%</span>
            </div>
            <input type="range" min="0" max="1" step="0.01" value={bsrRatio} onChange={(e) => setBsrRatio(Number(e.target.value))} className="w-full accent-blue-600 h-1 bg-gray-800 rounded-lg appearance-none cursor-pointer" />
          </div>
          <div className="relative">
            <div className="flex justify-between text-[9px] text-gray-500 uppercase mb-2">
              <span>eEURO</span>
              <span>{((1 - bsrRatio) * 100).toFixed(0)}%</span>
            </div>
            <input type="range" min="0" max="1" step="0.01" value={1 - bsrRatio} onChange={(e) => setBsrRatio(1 - Number(e.target.value))} className="w-full accent-blue-600 h-1 bg-gray-800 rounded-lg appearance-none cursor-pointer" />
          </div>
        </div>
      </div>

      <div className="flex-grow" />

      {/* EST. MARGIN REQUIREMENT - CIEMNY BOKS */}
      <div className="bg-[#0d1117] border border-gray-800/50 p-6 rounded-sm mt-4">
        <div className="text-center mb-4">
          <span className="text-[9px] text-gray-400 uppercase tracking-widest font-bold">Estimated Margin Requirement</span>
          <div className="text-[9px] text-gray-600 mt-1">MARGIN (TO {isBuy ? 'BUY' : 'SELL'})</div>
          <div className="text-xl font-bold text-yellow-500 mt-1" style={monoStyle}>{currentMarginPercent.toFixed(0)}%</div>
        </div>
        
        <div className="flex justify-between mt-4 border-t border-gray-800 pt-4 px-2">
          <div className="text-center">
            <div className="text-[8px] text-gray-500 uppercase mb-1">€BSR Required</div>
            <div className="text-sm font-bold text-green-500" style={monoStyle}>{requiredBSR.toFixed(2)} <span className="text-[10px]">€BSR</span></div>
          </div>
          <div className="text-center">
            <div className="text-[8px] text-gray-500 uppercase mb-1">eEURO Required</div>
            <div className="text-sm font-bold text-blue-400" style={monoStyle}>€{requiredEuro.toFixed(2)}</div>
          </div>
        </div>
      </div>
    </div>
  )
}