'use client'

import { useState } from 'react'
import { useParams } from 'next/navigation'

export default function TradingPanel() {
  const params = useParams()
  const rawId = (params.id as string) || 'BS-P-PL'
  const marketId = rawId.replace('IPT', 'BS') 
  
  const monoStyle = { fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace' }

  const [price, setPrice] = useState('10.59')
  const [side, setSide] = useState<'BUY' | 'SELL'>('BUY')
  const [bsrStake, setBsrStake] = useState(50)
  
  const euroStake = 100 - bsrStake

  const riskTable = {
    10: { marginLong: 50, marginShort: 100, leverageLong: '1:2.0', leverageShort: '1:1.0', fee: 1.00 },
    25: { marginLong: 45, marginShort: 90, leverageLong: '1:2.2', leverageShort: '1:1.1', fee: 0.85 },
    50: { marginLong: 40, marginShort: 80, leverageLong: '1:2.5', leverageShort: '1:1.2', fee: 0.60 },
    75: { marginLong: 30, marginShort: 60, leverageLong: '1:3.3', leverageShort: '1:1.6', fee: 0.35 },
    100: { marginLong: 25, marginShort: 50, leverageLong: '1:4.0', leverageShort: '1:2.0', fee: 0.20 }
  }

  const currentRisk = riskTable[bsrStake as keyof typeof riskTable] || riskTable[50]
  const marginValue = side === 'BUY' ? currentRisk.marginLong : currentRisk.marginShort
  
  const bsrReq = (parseFloat(price) * (marginValue / 100) * (bsrStake / 100)).toFixed(2)
  const euroReq = (parseFloat(price) * (marginValue / 100) * (euroStake / 100)).toFixed(2)

  // Funkcja kontrolująca zmianę ceny - blokada ujemnych wartości pod BSTZ
  const handlePriceChange = (val: string) => {
    const formatted = val.replace(',', '.')
    if (parseFloat(formatted) < 0) return // Tymczasowa blokada przed minusami
    setPrice(formatted)
  }

  const adjustPrice = (delta: number) => {
    const newPrice = Math.max(0, parseFloat(price) + delta).toFixed(2)
    setPrice(newPrice)
  }

  return (
    <div className="flex flex-col h-full p-2 select-none font-sans bg-black/20 scale-[0.9] origin-top">
      {/* 1) Redukcja marginesów górnych */}
      <div className="text-center mb-6 border-b border-gray-900 pb-2">
        <span className="text-[9px] text-gray-500 uppercase tracking-[0.4em] font-bold">Trading Terminal</span>
      </div>

      <div className="text-center mb-4">
        <span className="text-[12px] text-red-600 font-bold tracking-[0.2em] uppercase">
          INSTRUMENT: {marketId}
        </span>
      </div>

      {/* BUY/SELL BUTTONS - Jeszcze bardziej kompaktowe */}
      <div className="flex justify-center gap-2 mb-4">
        <button 
          onClick={() => setSide('BUY')}
          className={`w-[120px] py-1.5 border-2 font-bold uppercase tracking-widest text-[9px] transition-all rounded-sm ${
            side === 'BUY' ? 'border-green-600 bg-green-600/10 text-green-500' : 'border-gray-900 text-gray-700'
          }`}
        >
          BUY
        </button>
        <button 
          onClick={() => setSide('SELL')}
          className={`w-[120px] py-1.5 border-2 font-bold uppercase tracking-widest text-[9px] transition-all rounded-sm ${
            side === 'SELL' ? 'border-red-600 bg-red-600/10 text-red-500' : 'border-gray-900 text-gray-700'
          }`}
        >
          SELL
        </button>
      </div>

      {/* PRICE AREA - Zmniejszony font i wymuszona kropka */}
      <div className="flex flex-col items-center mb-4">
        <div className="flex items-center gap-4">
          <button onClick={() => adjustPrice(-0.01)} className="text-xl text-gray-600 hover:text-white">-</button>
          <div className="text-center">
            <input 
              type="text" 
              value={price}
              onChange={(e) => handlePriceChange(e.target.value)}
              className={`bg-transparent text-5xl font-bold font-mono w-48 text-center outline-none ${
                side === 'BUY' ? 'text-green-500' : 'text-red-500'
              }`}
              style={monoStyle}
            />
            <div className="text-[8px] text-gray-600 font-mono" style={monoStyle}>EUR / 100kWh</div>
          </div>
          <button onClick={() => adjustPrice(0.01)} className="text-xl text-gray-600 hover:text-white">+</button>
        </div>
        <span className="text-[6px] text-gray-700 uppercase font-bold mt-1 tracking-widest">SET ORDER PRICE</span>
      </div>

      <div className="flex justify-center mb-4">
        <button className="w-[160px] py-1.5 border border-yellow-600 text-yellow-600 font-black uppercase tracking-[0.2em] text-[10px] transition-all hover:bg-yellow-600 hover:text-black rounded-sm">
          EXECUTE
        </button>
      </div>

      {/* DEPOSITS - Bardziej zbite */}
      <div className="bg-black/40 border border-gray-900 p-2 rounded-sm mb-3">
        <div className="text-center mb-2">
          <span className="text-[7px] text-blue-500 uppercase font-bold tracking-widest">DEPOSITS</span>
        </div>
        
        <div className="space-y-3">
          <div>
            <div className="flex justify-between text-[7px] font-mono mb-1" style={monoStyle}>
              <span className="text-gray-400">€BSR STAKE</span>
              <span className="text-blue-400 font-bold">{bsrStake}%</span>
            </div>
            <input 
              type="range" min="10" max="100" step="5" value={bsrStake}
              onChange={(e) => setBsrStake(parseInt(e.target.value))}
              className="w-full h-1 bg-gray-800 accent-blue-500 appearance-none cursor-pointer rounded-lg"
            />
          </div>

          <div>
            <div className="flex justify-between text-[7px] font-mono mb-1" style={monoStyle}>
              <span className="text-gray-400">eEURO STAKE</span>
              <span className="text-blue-400 font-bold">{euroStake}%</span>
            </div>
            <input 
              type="range" min="0" max="90" value={euroStake} readOnly
              className="w-full h-1 bg-gray-900 accent-blue-600/40 appearance-none rounded-lg"
            />
          </div>
        </div>
      </div>

      {/* MARGIN REQUIREMENTS - Zmniejszone marginesy i teksty */}
      <div className="mt-auto pt-2 border-t border-gray-900">
        <div className="text-center mb-0.5">
          <span className="text-[7px] text-blue-700 uppercase font-bold tracking-widest">MARGIN REQUIREMENTS</span>
        </div>
        <div className="text-center mb-2">
          <span className="text-2xl font-bold font-mono text-blue-500 leading-none" style={monoStyle}>
            {marginValue}%
          </span>
        </div>
        
        <div className="grid grid-cols-3 gap-1 text-center border-t border-gray-900/50 pt-2">
          <div>
            <span className="text-[6px] text-gray-600 uppercase font-bold block mb-0.5">LEVERAGE</span>
            <span className="text-[10px] font-mono text-blue-300 font-bold" style={monoStyle}>{side === 'BUY' ? currentRisk.leverageLong : currentRisk.leverageShort}</span>
          </div>
          <div>
            <span className="text-[6px] text-gray-600 uppercase font-bold block mb-0.5">FEE</span>
            <span className="text-[10px] font-mono text-blue-300 font-bold" style={monoStyle}>{currentRisk.fee.toFixed(2)}%</span>
          </div>
          <div>
            <span className="text-[6px] text-gray-600 uppercase font-bold block mb-0.5">REQ (BSR/EUR)</span>
            <div className="flex flex-col leading-tight">
              <span className="text-[8px] font-mono text-blue-400 font-bold" style={monoStyle}>{bsrReq} BSR</span>
              <span className="text-[8px] font-mono text-blue-500 font-bold" style={monoStyle}>{euroReq} EUR</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}