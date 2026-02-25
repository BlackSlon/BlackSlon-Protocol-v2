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

  // Logika Marginu: 25%/50% przy 100% BSR, 100% przy 0% BSR [cite: 2026-02-15]
  const baseMargin = isBuy ? 0.75 : 0.50
  const currentMarginPercent = 100 - (baseMargin * bsrRatio * 100)
  
  const totalNotional = quantity * currentPrice
  const totalMarginRequired = totalNotional * (currentMarginPercent / 100)
  
  const requiredBSR = totalMarginRequired * bsrRatio
  const requiredEuro = totalMarginRequired * (1 - bsrRatio)

  const monoStyle = { fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace' }

  return (
    <div className="flex flex-col h-full p-3 select-none" style={montserratStyle}>
      {/* HEADER - Zredukowany do skali Market Panelu */}
      <div className="flex justify-between items-center mb-3">
        <span className="text-[9px] tracking-[0.2em] text-gray-500 uppercase">Trading Panel</span>
        <span className="text-[8px] text-red-500/60 font-bold tracking-tighter uppercase">Inst: IPT-P-PL</span>
      </div>

      {/* PRICE SECTION - Zmniejszona, by pasowała do skali cyfr w Box 1 */}
      <div className="text-center mb-4">
        <div className="text-xl font-bold text-yellow-500 tracking-tight" style={monoStyle}>
          {currentPrice.toFixed(2)}
        </div>
        <div className="text-[8px] text-gray-600 tracking-[0.1em] uppercase">BSEI Real-Time Quote</div>
      </div>

      {/* BUY/SELL TOGGLE - Bardziej kompaktowy */}
      <div className="flex gap-1.5 mb-4">
        <button 
          onClick={() => setIsBuy(true)}
          className={`flex-1 py-1.5 text-[9px] font-bold transition-all border ${isBuy ? 'bg-green-500/10 border-green-500/50 text-green-500' : 'border-gray-900 text-gray-700'}`}
        >
          BUY
        </button>
        <button 
          onClick={() => setIsBuy(false)}
          className={`flex-1 py-1.5 text-[9px] font-bold transition-all border ${!isBuy ? 'bg-red-500/10 border-red-500/50 text-red-500' : 'border-gray-900 text-gray-700'}`}
        >
          SELL
        </button>
      </div>

      {/* QUANTITY SECTION */}
      <div className="mb-4">
        <div className="flex justify-between text-[8px] text-gray-600 mb-1.5 tracking-widest uppercase">
          <span>Order Size</span>
          <span className="text-gray-400 font-mono">{quantity} vkWh</span>
        </div>
        <input 
          type="range" min="10" max="1000" step="10"
          value={quantity}
          onChange={(e) => setQuantity(Number(e.target.value))}
          className="w-full h-1 bg-gray-900 rounded-lg appearance-none cursor-pointer accent-yellow-600"
        />
      </div>

      {/* BSR RATIO SLIDER */}
      <div className="mb-4">
        <div className="flex justify-between text-[8px] text-gray-600 mb-1.5 tracking-widest uppercase">
          <span>€BSR / eEURO Allocation</span>
          <span className="text-yellow-500 font-mono">{(bsrRatio * 100).toFixed(0)}% BSR</span>
        </div>
        <input 
          type="range" min="0" max="1" step="0.01"
          value={bsrRatio}
          onChange={(e) => setBsrRatio(Number(e.target.value))}
          className="w-full h-1 bg-gray-900 rounded-lg appearance-none cursor-pointer accent-yellow-600"
        />
      </div>

      <div className="flex-grow" />

      {/* FOOTER - Wyliczenia w skali mikroskopijnej */}
      <div className="border-t border-gray-900/50 pt-3 space-y-2">
        <div className="flex justify-between items-center px-1">
          <span className="text-[8px] text-gray-600 uppercase tracking-widest">Est. Margin</span>
          <span className="text-[10px] font-bold text-white font-mono">{currentMarginPercent.toFixed(1)}%</span>
        </div>

        <div className="bg-gray-900/10 p-2 rounded space-y-1">
          <div className="flex justify-between text-[9px]">
            <span className="text-gray-600 uppercase tracking-tighter">Req. €BSR</span>
            <span className="text-yellow-500/80 font-mono">{requiredBSR.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-[9px]">
            <span className="text-gray-600 uppercase tracking-tighter">Req. eEURO</span>
            <span className="text-blue-500/80 font-mono">{requiredEuro.toFixed(2)}</span>
          </div>
        </div>

        <button className="w-full py-2 bg-yellow-600 text-black font-bold text-[9px] tracking-[0.2em] hover:bg-yellow-500 transition-colors uppercase">
          Execute {isBuy ? 'Buy' : 'Sell'}
        </button>
      </div>
    </div>
  )
}