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
  
  // Obliczenia z wymuszonym formatowaniem liczb
  const parsedPrice = parseFloat(price.replace(',', '.')) || 0
  const totalValue = parsedPrice * quantity
  const bsrReq = (totalValue * (marginValue / 100) * (bsrStake / 100)).toFixed(2)
  const euroReq = (totalValue * (marginValue / 100) * (euroStake / 100)).toFixed(2)

  return (
    <div className="flex flex-col h-full p-3 select-none font-sans bg-transparent scale-[0.82] origin-top overflow-hidden">
      
      {/* HEADER - Czysty, w jednej linii */}
      <div className="text-center mb-4 border-b border-gray-900 pb-1 shrink-0">
        <span className="text-[10px] text-gray-500 uppercase tracking-[0.5em] font-bold whitespace-nowrap">Trading Terminal</span>
      </div>

      {/* INSTRUMENT - Żółty, do lewej */}
      <div className="text-left mb-4 shrink-0">
        <div className="text-[8px] text-gray-600 uppercase font-bold mb-1">Active Instrument</div>
        <span className="text-[13px] text-yellow-500 font-bold uppercase tracking-widest">{marketId}</span>
      </div>

      {/* BUY/SELL TOGGLE */}
      <div className="flex justify-center gap-2 mb-4 shrink-0">
        <button onClick={() => setSide('BUY')} className={`flex-1 py-1.5 border font-bold uppercase tracking-widest text-[9px] transition-all rounded-sm ${side === 'BUY' ? 'border-green-600 bg-green-600/10 text-green-500' : 'border-gray-900 text-gray-700'}`}>BUY</button>
        <button onClick={() => setSide('SELL')} className={`flex-1 py-1.5 border font-bold uppercase tracking-widest text-[9px] transition-all rounded-sm ${side === 'SELL' ? 'border-red-600 bg-red-600/10 text-red-500' : 'border-gray-900 text-gray-700'}`}>SELL</button>
      </div>

      {/* PRICE SECTION - Białe napisy, brak pogrubienia jednostek */}
      <div className="border-b border-gray-900/50 pb-3 mb-4 shrink-0">
        <div className="text-[9px] text-white uppercase font-bold mb-2 tracking-wide">Set Order Price</div>
        <div className="flex items-center justify-between">
          <button onClick={() => setPrice(p => (parseFloat(p) - 0.01).toFixed(2))} className="text-2xl text-gray-600 hover:text-white">-</button>
          <div className="text-center flex-grow">
            <input type="text" value={price} onChange={(e) => setPrice(e.target.value)} className="bg-transparent text-3xl font-bold font-mono w-full text-center outline-none text-white" style={monoStyle} />
            <div className="text-[10px] text-white font-mono mt-1 font-normal" style={monoStyle}>
              EUR / 100kWh <span className="ml-1 text-white">1 TOKEN {marketId}</span>
            </div>
          </div>
          <button onClick={() => setPrice(p => (parseFloat(p) + 0.01).toFixed(2))} className="text-2xl text-gray-600 hover:text-white">+</button>
        </div>
      </div>

      {/* QUANTITY SECTION - Białe napisy, brak pogrubienia jednostek */}
      <div className="border-b border-gray-900/50 pb-3 mb-4 shrink-0">
        <div className="text-[9px] text-white uppercase font-bold mb-2 tracking-wide">Set Quantity</div>
        <div className="flex items-center justify-between">
          <button onClick={() => setQuantity(q => Math.max(1, q - 1))} className="text-2xl text-gray-600 hover:text-white">-</button>
          <div className="text-center flex-grow">
            <input type="number" value={quantity} onChange={(e) => setQuantity(parseInt(e.target.value) || 1)} className="bg-transparent text-3xl font-bold font-mono w-full text-center outline-none text-white [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none" style={monoStyle} />
            <div className="text-[10px] text-white font-mono mt-1 font-normal" style={monoStyle}>
              1 TOKEN <span className="ml-1 text-white">100kWh</span>
            </div>
          </div>
          <button onClick={() => setQuantity(q => q + 1)} className="text-2xl text-gray-600 hover:text-white">+</button>
        </div>
      </div>

      {/* EXECUTE BUTTON - Odchudzony */}
      <button className={`w-full py-2 mb-5 border font-black uppercase tracking-[0.3em] text-[10px] transition-all duration-300 rounded-sm shrink-0
        ${side === 'BUY' 
          ? 'border-green-500 text-green-500 hover:bg-green-500 hover:text-black' 
          : 'border-red-600 text-red-600 hover:bg-red-600 hover:text-white'}`}>
        EXECUTE {side}
      </button>

      {/* DEPOSIT CONFIGURATION */}
      <div className="space-y-4 mb-4 shrink-0">
        <div className="text-[8px] text-gray-500 uppercase font-bold tracking-tighter">Deposit Configuration</div>
        <div className="bg-gray-900/10 p-2 rounded-sm border border-gray-900">
          <div className="flex justify-between text-[9px] font-mono mb-2 text-blue-400 font-bold uppercase tracking-widest" style={monoStyle}><span>€BSR Stake</span><span>{bsrStake}%</span></div>
          <input type="range" min="10" max="100" step="5" value={bsrStake} onChange={(e) => setBsrStake(parseInt(e.target.value))} className="w-full h-1 bg-gray-800 accent-blue-500 cursor-pointer" />
        </div>
        <div className="bg-gray-900/10 p-2 rounded-sm border border-gray-900">
          <div className="flex justify-between text-[9px] font-mono mb-2 text-blue-800 font-bold uppercase tracking-widest" style={monoStyle}><span>eEURO Stake</span><span>{euroStake}%</span></div>
          <input type="range" min="0" max="90" value={euroStake} readOnly className="w-full h-1 bg-gray-950 accent-blue-900" />
        </div>
      </div>

      {/* SEKCJA WARTOŚCI - Przywrócona i widoczna */}
      <div className="mt-auto border-t border-gray-900 pt-3 shrink-0">
        <div className="text-center mb-1">
          <span className="text-[8px] text-gray-600 uppercase font-bold tracking-widest">% DEPOSIT VALUE / LEVERAGE</span>
        </div>
        <div className="text-center mb-4">
          <span className="text-3xl font-bold font-mono text-blue-500 leading-none" style={monoStyle}>{marginValue}%</span>
        </div>
        
        <div className="grid grid-cols-2 gap-4 border-t border-gray-900/50 pt-3">
          <div className="flex flex-col border-r border-gray-900/50 pr-2">
            <span className="text-[8px] text-white uppercase font-bold mb-1 tracking-tight whitespace-nowrap">€BSR Deposit Value:</span>
            <span className="text-[14px] font-mono text-blue-400 font-bold" style={monoStyle}>{bsrReq}</span>
          </div>
          <div className="flex flex-col pl-2 text-right">
            <span className="text-[8px] text-white uppercase font-bold mb-1 tracking-tight whitespace-nowrap">eEURO Deposit Value:</span>
            <span className="text-[14px] font-mono text-blue-500 font-bold" style={monoStyle}>{euroReq}</span>
          </div>
        </div>
      </div>
    </div>
  )
}