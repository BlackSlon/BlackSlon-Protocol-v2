'use client'

import { useState } from 'react'

interface PortfolioPanelProps {
  borderColor: string
  montserratStyle: React.CSSProperties
}

export default function PortfolioPanel({ borderColor, montserratStyle }: PortfolioPanelProps) {
  // Portfolio State
  const [bsrPrice, setBsrPrice] = useState<number>(1.05)
  const [openPosition, setOpenPosition] = useState<number>(272836)
  const [bsrDeposit, setBsrDeposit] = useState<number>(1000)
  const [euroDeposit, setEuroDeposit] = useState<number>(500)
  const [lockedFunds, setLockedFunds] = useState<number>(200)

  // Sentiment Data
  const [longSentiment, setLongSentiment] = useState<number>(65)
  const [shortSentiment, setShortSentiment] = useState<number>(35)

  const monoStyle = {
    fontFamily: 'monospace',
    fontSize: '12px'
  }

  return (
    <div className={`bg-black border ${borderColor} p-4 flex flex-col`} style={montserratStyle}>
      <h3 className="text-[10px] text-gray-600 tracking-[0.3em] mb-4">PORTFOLIO</h3>
      
      {/* €BSR Price Ticker */}
      <div className="mb-6">
        <div className="text-[9px] text-gray-500 tracking-[0.2em] mb-2">€BSR PRICE</div>
        <div className="text-2xl font-mono text-green-400" style={monoStyle}>
          {bsrPrice.toFixed(3)} €BSR
        </div>
      </div>
      
      {/* User Stats */}
      <div className="mb-6">
        <div className="text-[9px] text-gray-600 tracking-[0.2em] mb-3">USER STATS</div>
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-[8px] text-gray-500">OPEN POSITION</span>
            <span className="text-sm font-mono text-white" style={monoStyle}>
              {openPosition.toLocaleString()}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-[8px] text-gray-500">€BSR DEPOSIT</span>
            <span className="text-sm font-mono text-green-400" style={monoStyle}>
              {bsrDeposit.toLocaleString()} €BSR
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-[8px] text-gray-500">eEURO DEPOSIT</span>
            <span className="text-sm font-mono text-blue-400" style={monoStyle}>
              {euroDeposit.toLocaleString()}
            </span>
          </div>
        </div>
      </div>
      
      {/* Market Sentiment */}
      <div className="mb-6">
        <div className="text-[9px] text-gray-600 tracking-[0.2em] mb-3">MARKET SENTIMENT</div>
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-[8px] text-gray-500">LONG</span>
            <div className="flex items-center gap-2">
              <div className="w-16 bg-gray-700 rounded-full h-2">
                <div 
                  className="bg-green-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${longSentiment}%` }}
                ></div>
              </div>
              <span className="text-xs text-green-400">{longSentiment}%</span>
            </div>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-[8px] text-gray-500">SHORT</span>
            <div className="flex items-center gap-2">
              <div className="w-16 bg-gray-700 rounded-full h-2">
                <div 
                  className="bg-red-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${shortSentiment}%` }}
                ></div>
              </div>
              <span className="text-xs text-red-400">{shortSentiment}%</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Funds */}
      <div className="mt-6">
        <div className="text-[9px] text-gray-600 tracking-[0.2em] mb-3">FUNDS</div>
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-[8px] text-gray-500">AVAILABLE</span>
            <span className="text-sm font-mono text-green-400" style={monoStyle}>
              {(bsrDeposit + euroDeposit - lockedFunds).toLocaleString()} €BSR
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-[8px] text-gray-500">LOCKED</span>
            <span className="text-sm font-mono text-red-400" style={monoStyle}>
              €{lockedFunds.toLocaleString()}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
