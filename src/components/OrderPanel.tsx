'use client'

import { useState } from 'react'

interface OrderPanelProps {
  currentPrice: number
  borderColor: string
  montserratStyle: any
}

export default function OrderPanel({ currentPrice, borderColor, montserratStyle }: OrderPanelProps) {
  const [isBuy, setIsBuy] = useState(true)
  const [bsrRatio, setBsrRatio] = useState(1) 
  const [quantity, setQuantity] = useState(100)

  // Twoja logika Marginu (25%/50% przy 100% BSR)
  const baseMargin = isBuy ? 0.75 : 0.50
  const currentMarginPercent = 100 - (baseMargin * bsrRatio * 100)
  
  const totalNotional = quantity * currentPrice
  const totalMarginRequired = totalNotional * (currentMarginPercent / 100)
  
  const requiredBSR = totalMarginRequired * bsrRatio
  const requiredEuro = totalMarginRequired * (1 - bsrRatio)

  const monoStyle = { fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace' }

  return (
    <div className="flex flex-col h-full p-4 select-none" style={montserratStyle}>
      {/* HEADER PANELU - Ciasno jak w Market Panelu */}
      <div className="flex justify-between items-center mb-4">
        <span className="text-[10px] tracking-[0.3em] text-gray-500 uppercase">Trading Panel</span>
        <span className="text-[9px] text-red-500 font-bold tracking-tighter uppercase">INSTRUMENT: IPT-P-PL</span>
      </div>

      {/* PRICE SECTION - Mniejsza, techniczna */}
      <div className="text-center mb-6">
        <div className="text-2xl font-bold text-yellow-500 tracking-tight" style={monoStyle}>
          {currentPrice.toFixed(2)}
        </div>
        <div className="text-[9px] text-gray-600 tracking-widest uppercase">Live BSEI Quote</div>
      </div>

      {/* BUY/SELL TOGGLE */}
      <div className="flex gap-2 mb-6">
        <button 
          onClick={() => setIsBuy(true)}
          className={`flex-1 py-2 text-[10px] font-bold transition-all border ${isBuy ? 'bg-green-500/10 border-green-500 text-green-500' : 'border-gray-800 text-gray-600'}`}
        >
          BUY
        </button>
        <button 
          onClick={() => setIsBuy(false)}
          className={`flex-1 py-2 text-[10px] font-bold transition-all border ${!isBuy ? 'bg-red-500/10 border-red-500 text-red-500' : 'border-gray-800 text-gray-600'}`}
        >
          SELL
        </button>
      </div>

      {/* QUANTITY */}
      <div className="mb-6">
        <div className="flex justify-between text-[9px] text-gray-500 mb-2 tracking-widest uppercase">
          <span>Quantity</span>
          <span className="text-gray-400">{quantity} vkWh</span>
        </div>
        <input 
          type="range" min="10" max="1000" step="10"
          value={quantity}
          onChange={(e) => setQuantity(Number(e.target.value))}
          className="w-full h-1 bg-gray-800 rounded-lg appearance-none cursor-pointer accent-yellow-500"
        />
      </div>

      {/* BSR RATIO */}
      <div className="mb-6">
        <div className="flex justify-between text-[9px] text-gray-500 mb-2 tracking-widest uppercase">
          <span>€BSR Ratio</span>
          <span className="text-yellow-500">{(bsrRatio * 100).toFixed(0)}%</span>
        </div>
        <input 
          type="range" min="0" max="1" step="0.01"
          value={bsrRatio}
          onChange={(e) => setBsrRatio(Number(e.target.value))}
          className="w-full h-1 bg-gray-800 rounded-lg appearance-none cursor-pointer accent-yellow-500"
        />
      </div>

      <div className="flex-grow" />

      {/* CALCULATION DRAWER - To co było w starej wersji */}
      <div className="border-t border-gray-900 pt-4 space-y-3">
        <div className="flex justify-between items-center">
          <span className="text-[9px] text-gray-500 uppercase tracking-widest">Estimated Margin Requirement</span>
          <span className="text-[11px] font-bold text-white" style={monoStyle}>{currentMarginPercent.toFixed(1)}%</span>
        </div>

        <div className="space-y-1">
          <div className="flex justify-between text-[10px]">
            <span className="text-gray-500">Required €BSR:</span>
            <span className="text-yellow-500 font-mono">{requiredBSR.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-[10px]">
            <span className="text-gray-500">Required eEURO:</span>
            <span className="text-blue-400 font-mono">{requiredEuro.toFixed(2)}</span>
          </div>
        </div>

        <button className="w-full py-3 bg-yellow-500 text-black font-bold text-[10px] tracking-[0.2em] hover:bg-yellow-400 transition-colors uppercase">
          Place Order
        </button>
      </div>
    </div>
  )
}