'use client'

import { useState } from 'react'

interface TradingPanelProps {
  currentPrice: number
  borderColor: string
  montserratStyle: any
}

export default function TradingPanel({ currentPrice, borderColor, montserratStyle }: TradingPanelProps) {
  const [isBuy, setIsBuy] = useState(true) // Górny przycisk zlecenia
  const [depositMode, setDepositMode] = useState(true) // Przełącznik w sekcji Deposit (true = Buy, false = Sell)
  const [bsrRatio, setBsrRatio] = useState(0.25) 
  const [quantity, setQuantity] = useState(100)

  // Logika Marginu: 25% dla Buy / 50% dla Sell przy 100% BSR [cite: 2026-02-15]
  // Obliczenia zależą od depositMode (przełącznika w sekcji Deposit)
  const baseMargin = depositMode ? 0.75 : 0.50
  const currentMarginPercent = 100 - (baseMargin * bsrRatio * 100)
  
  const totalNotional = quantity * currentPrice
  const totalMarginRequired = totalNotional * (currentMarginPercent / 100)
  
  const requiredBSR = totalMarginRequired * bsrRatio
  const requiredEuro = totalMarginRequired * (1 - bsrRatio)

  const monoStyle = { fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace' }

  return (
    <div className="flex flex-col h-full p-4 select-none" style={montserratStyle}>
      {/* HEADER */}
      <div className="text-center mb-2 border-b border-gray-900 pb-1">
        <span className="text-[9px] tracking-[0.3em] text-gray-500 uppercase font-bold">Trading Panel</span>
      </div>

      <div className="text-center mb-3">
        <span className="text-[10px] text-red-600 font-bold tracking-widest uppercase">Instrument: IPT-P-PL</span>
        <div className="flex items-center justify-center gap-2 mt-1">
          <span className="text-3xl font-bold text-yellow-500" style={monoStyle}>{currentPrice.toFixed(2)}</span>
          <span className="text-[10px] text-gray-500 mt-1">EUR/vkWh</span>
        </div>
      </div>

      {/* QUANTITY */}
      <div className="flex flex-col items-center mb-3">
        <span className="text-[8px] text-gray-500 uppercase tracking-widest mb-1">Quantity</span>
        <div className="flex items-center gap-3">
          <button onClick={() => setQuantity(q => Math.max(0, q - 1))} className="w-6 h-6 border border-gray-700 rounded flex items-center justify-center bg-gray-900 text-gray-400 text-xs">-</button>
          <div className="w-12 h-6 border border-gray-700 rounded flex items-center justify-center font-mono text-xs bg-black">{quantity}</div>
          <button onClick={() => setQuantity(q => q + 1)} className="w-6 h-6 border border-gray-700 rounded flex items-center justify-center bg-gray-900 text-gray-400 text-xs">+</button>
        </div>
      </div>

      {/* BUY/SELL BUTTONS */}
      <div className="flex gap-3 mb-4">
        <button 
          onClick={() => setIsBuy(true)}
          className={`flex-1 py-3 border-2 font-bold text-xs transition-all ${isBuy ? 'border-green-600 text-green-500 bg-green-950/20' : 'border-gray-800 text-gray-700'}`}
        >
          BUY
        </button>
        <button 
          onClick={() => setIsBuy(false)}
          className={`flex-1 py-3 border-2 font-bold text-xs transition-all ${!isBuy ? 'border-red-600 text-red-500 bg-red-950/20' : 'border-gray-800 text-gray-700'}`}
        >
          SELL
        </button>
      </div>

      {/* DEPOSIT SECTION */}
      <div className="border-t border-gray-900 pt-3">
        <div className="text-center mb-2 text-[9px] text-gray-400 uppercase tracking-widest font-bold">Deposit</div>
        <div className="flex justify-center mb-3">
          <div className="bg-gray-900 p-0.5 rounded-full flex gap-1 border border-gray-800">
            <button 
              onClick={() => setDepositMode(true)}
              className={`px-3 py-0.5 rounded-full text-[7px] font-bold transition-all ${depositMode ? 'bg-white text-black' : 'text-gray-500'}`}
            >
              BUY
            </button>
            <button 
              onClick={() => setDepositMode(false)}
              className={`px-3 py-0.5 rounded-full text-[7px] font-bold transition-all ${!depositMode ? 'bg-white text-black' : 'text-gray-500'}`}
            >
              SELL
            </button>
          </div>
        </div>

        {/* SUWAKI */}
        <div className="space-y-2 px-2 mb-4">
          <div>
            <div className="flex justify-between text-[8px] text-gray-500 uppercase mb-0.5"><span>€BSR</span><span>{(bsrRatio * 100).toFixed(0)}%</span></div>
            <input type="range" min="0" max="1" step="0.01" value={bsrRatio} onChange={(e) => setBsrRatio(Number(e.target.value))} className="w-full h-1 bg-gray-800 rounded-lg appearance-none cursor-pointer accent-blue-600" />
          </div>
          <div>
            <div className="flex justify-between text-[8px] text-gray-500 uppercase mb-0.5"><span>eEURO</span><span>{((1 - bsrRatio) * 100).toFixed(0)}%</span></div>
            <input type="range" min="0" max="1" step="0.01" value={1 - bsrRatio} onChange={(e) => setBsrRatio(1 - Number(e.target.value))} className="w-full h-1 bg-gray-800 rounded-lg appearance-none cursor-pointer accent-blue-600" />
          </div>
        </div>
      </div>

      {/* EST. MARGIN REQUIREMENT - Podciągnięty bezpośrednio pod suwaki */}
      <div className="bg-[#0d1117] border border-gray-800/50 p-3 rounded-sm">
        <div className="text-center mb-2">
          <span className="text-[8px] text-gray-400 uppercase tracking-widest font-bold">Estimated Margin Requirement</span>
          <div className="text-[8px] text-gray-600 uppercase">Margin (To {depositMode ? 'Buy' : 'Sell'})</div>
          <div className="text-lg font-bold text-yellow-500 mt-0.5" style={monoStyle}>{currentMarginPercent.toFixed(0)}%</div>
        </div>
        
        <div className="flex justify-between mt-2 border-t border-gray-800 pt-2 px-1">
          <div className="text-center">
            <div className="text-[7px] text-gray-500 uppercase mb-0.5">€BSR Required</div>
            <div className="text-xs font-bold text-green-500" style={monoStyle}>{requiredBSR.toFixed(2)} <span className="text-[8px]">€BSR</span></div>
          </div>
          <div className="text-center">
            <div className="text-[7px] text-gray-500 uppercase mb-0.5">eEURO Required</div>
            <div className="text-xs font-bold text-blue-400" style={monoStyle}>€{requiredEuro.toFixed(2)}</div>
          </div>
        </div>
      </div>
    </div>
  )
}