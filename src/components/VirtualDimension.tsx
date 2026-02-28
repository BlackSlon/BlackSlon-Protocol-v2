'use client'
import React from 'react'

export default function VirtualDimension({ marketId }: { marketId: string }) {
  // Mock data for order book
  const buyOrders = [
    { price: 10.55, volume: 150 },
    { price: 10.54, volume: 120 },
    { price: 10.53, volume: 180 },
    { price: 10.52, volume: 95 },
    { price: 10.51, volume: 200 }
  ]

  const sellOrders = [
    { price: 10.60, volume: 110 },
    { price: 10.61, volume: 85 },
    { price: 10.62, volume: 140 },
    { price: 10.63, volume: 75 },
    { price: 10.64, volume: 160 }
  ]

  // Mock data for turnover
  const turnoverData = [
    { period: 'DAILY (24H)', tokens: 124500.00, volume: 1245000 },
    { period: 'LAST MONTH (30D)', tokens: 3875000.00, volume: 38750000 },
    { period: 'TOTAL', tokens: 15234567.89, volume: 152345678 }
  ]

  const currentPrice = 10.59
  const spreadLow = 10.59
  const spreadHigh = 10.60
  const spreadValue = 0.01
  const spreadPercent = 0.09

  return (
    <div className="flex flex-col h-full p-4 select-none bg-transparent font-mono">
      
      {/* SEKCJA GÓRNA: Order Book - 75% wysokości */}
      <div className="flex-[4] flex flex-col bg-gray-950/40 rounded-sm border border-gray-900 overflow-hidden mb-4">
        <div className="text-center py-2 text-[8px] text-gray-600 uppercase tracking-[0.3em] border-b border-gray-900">
          ORDER BOOK
        </div>
        
        {/* BUY ORDERS */}
        <div className="px-3 py-3">
          <div className="text-[8px] text-green-500 font-bold mb-2 uppercase tracking-tighter">BUY ORDERS</div>
          <div className="space-y-1">
            <div className="grid grid-cols-3 text-[9px] text-gray-600 mb-1">
              <div>Price</div>
              <div className="text-center">Vol</div>
              <div className="text-right">Total</div>
            </div>
            {buyOrders.map((order, i) => (
              <div key={i} className="grid grid-cols-3 text-[10px] text-green-500 py-1 hover:bg-green-500/10 transition-colors">
                <div className="font-bold">{order.price.toFixed(2)}</div>
                <div className="text-center text-green-300">{order.volume.toFixed(0)}</div>
                <div className="text-right text-green-400 font-black">{(order.price * order.volume).toFixed(2)}</div>
              </div>
            ))}
          </div>
        </div>

        {/* SPREAD (ŚRODEK) */}
        <div className="mx-3 py-3 border-t border-b border-gray-800 bg-black/20 text-center">
          <div className="text-[12px] font-bold text-yellow-500 italic">{spreadLow.toFixed(2)} - {spreadHigh.toFixed(2)}</div>
          <div className="text-[8px] text-gray-500 uppercase tracking-widest">Spread: {spreadValue.toFixed(2)} ({spreadPercent.toFixed(2)}%)</div>
        </div>

        {/* SELL ORDERS */}
        <div className="px-3 py-3 flex-grow">
          <div className="text-[8px] text-red-500 font-bold mb-2 uppercase tracking-tighter">SELL ORDERS</div>
          <div className="space-y-1">
            {sellOrders.map((order, i) => (
              <div key={i} className="grid grid-cols-3 text-[10px] text-red-500 py-1 hover:bg-red-500/10 transition-colors">
                <div className="font-bold">{order.price.toFixed(2)}</div>
                <div className="text-center text-red-300">{order.volume.toFixed(0)}</div>
                <div className="text-right text-red-400 font-black">{(order.price * order.volume).toFixed(2)}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* SEKCJA ŚRODKOWA: BSEI-PL Index - 10-15% wysokości */}
      <div className="flex-[1] border-t border-gray-900 pt-4 pb-2">
        <div className="text-center">
          <div className="text-[10px] font-bold text-white uppercase tracking-widest mb-1">
            BSEI-PL INDEX
          </div>
          <div className="text-[8px] text-gray-600 mb-2">
            Daily Weighted Average
          </div>
          <div className="text-2xl font-black text-white">
            {currentPrice.toFixed(2)} <span className="text-[10px] text-gray-500 ml-1">EUR/100vkWh</span>
          </div>
        </div>
      </div>

      {/* SEKCJA DOLNA: Market Turnover - kompaktowa */}
      <div className="border-t border-gray-900 pt-3 pb-2">
        <div className="text-[8px] text-gray-600 uppercase tracking-widest mb-2 text-center">
          MARKET TURNOVER
        </div>
        <div className="space-y-1">
          {turnoverData.map((data, i) => (
            <div key={i} className="flex justify-between items-center text-[9px]">
              <span className="text-gray-400 font-bold">{data.period}</span>
              <div className="flex gap-4">
                <span className="text-yellow-500 font-mono">{(data.tokens || 0).toLocaleString('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} €BSR</span>
                <span className="text-blue-400 font-mono">{(data.volume || 0).toLocaleString('de-DE')} vkWh</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
