'use client'
import React from 'react'

export default function VirtualDimension({ marketId }: { marketId: string }) {
  // Mock data for order book
  const buyOrders = [
    { price: 10.55, quantity: 150, volume: 15000 },
    { price: 10.54, quantity: 120, volume: 12000 },
    { price: 10.53, quantity: 180, volume: 18000 },
    { price: 10.52, quantity: 95, volume: 9500 },
    { price: 10.51, quantity: 200, volume: 20000 }
  ]

  const sellOrders = [
    { price: 10.60, quantity: 110, volume: 11000 },
    { price: 10.61, quantity: 85, volume: 8500 },
    { price: 10.62, quantity: 140, volume: 14000 },
    { price: 10.63, quantity: 75, volume: 7500 },
    { price: 10.64, quantity: 160, volume: 16000 }
  ]

  // Mock data for turnover
  const turnoverData = [
    { period: 'DAILY', tokens: 124500.00, volume: 1245000 },
    { period: 'MONTHLY', tokens: 3875000.00, volume: 38750000 },
    { period: 'TOTAL', tokens: 15234567.89, volume: 152345678 }
  ]

  const currentPrice = 10.59
  const spreadLow = 10.59
  const spreadHigh = 10.60
  const spreadValue = 0.01
  const spreadPercent = 0.09

  // Calculate max volume for progress bars
  const maxVolume = Math.max(...buyOrders.map(o => o.volume), ...sellOrders.map(o => o.volume))

  // Sparkline data for 24h trend
  const sparklineData = [10.45, 10.48, 10.52, 10.49, 10.55, 10.58, 10.59, 10.57, 10.59]
  const sparklinePoints = sparklineData.map((price, i) => {
    const x = (i / (sparklineData.length - 1)) * 100
    const y = 100 - ((price - Math.min(...sparklineData)) / (Math.max(...sparklineData) - Math.min(...sparklineData))) * 100
    return `${x},${y}`
  }).join(' ')

  return (
    <div className="flex flex-col h-full p-4 select-none bg-gradient-to-b from-gray-900 via-black to-black font-mono backdrop-blur-sm">
      
      {/* SEKCJA GÓRNA: Advanced Order Book - 70% wysokości */}
      <div className="flex-[7] flex flex-col rounded-sm border border-gray-800 overflow-hidden mb-4 shadow-inner shadow-black/50">
        <div className="text-center py-2 text-[8px] text-gray-500 uppercase tracking-[0.3em] border-b border-gray-800 bg-black/30 backdrop-blur-sm">
          ADVANCED ORDER BOOK
        </div>
        
        <div className="flex flex-1">
          {/* BUY ORDERS - Lewa kolumna */}
          <div className="flex-1 border-r border-gray-800">
            <div className="px-3 py-2 bg-black/20 backdrop-blur-sm">
              <div className="text-[8px] text-green-400 font-bold mb-2 uppercase tracking-tighter">BUY ORDERS</div>
              <div className="grid grid-cols-3 text-[7px] text-gray-600 mb-1">
                <div>Price (EUR)</div>
                <div className="text-center">Qty (BSR)</div>
                <div className="text-right">Volume (kWh)</div>
              </div>
            </div>
            <div className="px-3 py-1 space-y-0">
              {buyOrders.map((order, i) => (
                <div key={i} className="grid grid-cols-3 text-[27px] text-green-300 py-1 hover:bg-green-500/10 transition-colors relative">
                  {/* Progress bar background */}
                  <div className="absolute inset-0 bg-green-500/5" style={{ width: `${(order.volume / maxVolume) * 100}%` }} />
                  <div className="font-bold text-green-400 relative">{order.price.toFixed(2)}</div>
                  <div className="text-center text-green-200 relative">{order.quantity}</div>
                  <div className="text-right text-green-300 font-black relative">{order.volume.toLocaleString()}</div>
                </div>
              ))}
            </div>
          </div>

          {/* SPREAD - Środek */}
          <div className="w-20 flex flex-col justify-center items-center bg-black/40 backdrop-blur-sm border-l border-r border-gray-700">
            <div className="text-[10px] font-bold text-yellow-400 italic text-center px-1 drop-shadow-glow">
              {spreadLow.toFixed(2)} - {spreadHigh.toFixed(2)}
            </div>
            <div className="text-[6px] text-gray-500 uppercase tracking-widest text-center mt-1">
              {spreadValue.toFixed(2)} ({spreadPercent.toFixed(2)}%)
            </div>
          </div>

          {/* SELL ORDERS - Prawa kolumna */}
          <div className="flex-1">
            <div className="px-3 py-2 bg-black/20 backdrop-blur-sm">
              <div className="text-[8px] text-red-400 font-bold mb-2 uppercase tracking-tighter">SELL ORDERS</div>
              <div className="grid grid-cols-3 text-[7px] text-gray-600 mb-1">
                <div>Price (EUR)</div>
                <div className="text-center">Qty (BSR)</div>
                <div className="text-right">Volume (kWh)</div>
              </div>
            </div>
            <div className="px-3 py-1 space-y-0">
              {sellOrders.map((order, i) => (
                <div key={i} className="grid grid-cols-3 text-[27px] text-red-300 py-1 hover:bg-red-500/10 transition-colors relative">
                  {/* Progress bar background */}
                  <div className="absolute inset-0 bg-red-500/5" style={{ width: `${(order.volume / maxVolume) * 100}%` }} />
                  <div className="font-bold text-red-400 relative">{order.price.toFixed(2)}</div>
                  <div className="text-center text-red-200 relative">{order.quantity}</div>
                  <div className="text-right text-red-300 font-black relative">{order.volume.toLocaleString()}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* SEKCJA ŚRODKOWA: BSEI-PL Index - Premium ticket look */}
      <div className="flex-[2] border-t border-gray-800 pt-3 pb-2 bg-gradient-to-r from-gray-800/20 to-gray-900/20 backdrop-blur-sm rounded-sm">
        <div className="text-center">
          <div className="text-[10px] font-bold text-gray-300 uppercase tracking-widest mb-1">
            BSEI-PL INDEX <span className="text-gray-600 font-mono text-[8px]">[cite: 2026-02-15]</span>
          </div>
          
          {/* Sparkline SVG */}
          <div className="w-24 h-8 mx-auto mb-2">
            <svg viewBox="0 0 100 100" className="w-full h-full">
              <polyline
                points={sparklinePoints}
                fill="none"
                stroke="rgba(34, 197, 94, 0.3)"
                strokeWidth="1"
              />
              <polyline
                points={sparklinePoints}
                fill="none"
                stroke="rgba(34, 197, 94, 0.8)"
                strokeWidth="1"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          
          <div className="text-3xl font-black text-white drop-shadow-lg">
            {currentPrice.toFixed(2)} <span className="text-[10px] text-gray-400 ml-1 font-normal">EUR/100vkWh</span>
          </div>
        </div>
      </div>

      {/* SEKCJA DOLNA: Market Turnover */}
      <div className="border-t border-gray-800 pt-3 pb-2 bg-black/30 backdrop-blur-sm">
        <div className="text-[8px] text-gray-600 uppercase tracking-widest mb-2 text-center">
          MARKET TURNOVER
        </div>
        <div className="space-y-1">
          {turnoverData.map((data, i) => (
            <div key={i} className="flex justify-between items-center text-[9px] px-2">
              <span className="text-gray-400 font-bold">{data.period}</span>
              <div className="flex gap-3">
                <span className="text-yellow-400 font-mono">{(data.tokens || 0).toLocaleString('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} €BSR</span>
                <span className="text-blue-400 font-mono">{(data.volume || 0).toLocaleString('de-DE')} kWh</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
