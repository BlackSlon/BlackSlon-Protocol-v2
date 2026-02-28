'use client'
import React from 'react'

export default function VirtualDimension({ marketId }: { marketId: string }) {
  // Mock data - ceny wokół Anchora 10.59
  const buyOrders = [
    { price: 10.55, qty: 150, volume: 15000 },
    { price: 10.54, qty: 120, volume: 12000 },
    { price: 10.53, qty: 180, volume: 18000 },
    { price: 10.52, qty: 95, volume: 9500 },
    { price: 10.51, qty: 200, volume: 20000 }
  ]

  const sellOrders = [
    { price: 10.60, qty: 110, volume: 11000 },
    { price: 10.61, qty: 85, volume: 8500 },
    { price: 10.62, qty: 140, volume: 14000 },
    { price: 10.63, qty: 75, volume: 7500 },
    { price: 10.64, qty: 160, volume: 16000 }
  ]

  const turnoverData = [
    { period: 'DAILY', tokens: 124500.00, volume: 1245000 },
    { period: 'MONTHLY', tokens: 3875000.00, volume: 38750000 },
    { period: 'TOTAL', tokens: 15234567.89, volume: 152345678 }
  ]

  const maxVol = Math.max(...buyOrders.map(o => o.volume), ...sellOrders.map(o => o.volume))
  const sparklinePoints = "0,80 20,60 40,70 60,30 80,40 100,20"; // Uproszczony trend

  return (
    <div className="flex flex-col h-full p-4 select-none bg-gradient-to-b from-gray-900 via-black to-black font-mono text-white overflow-hidden border border-gray-800 shadow-2xl">
      
      {/* SEKCJA GÓRNA: ADVANCED ORDER BOOK */}
      <div className="flex-[7] flex flex-col min-h-0">
        <div className="text-center py-1 text-[9px] text-gray-500 uppercase tracking-[0.4em] border-b border-gray-800/50 mb-3">
          ADVANCED ORDER BOOK
        </div>

        <div className="flex flex-1 min-h-0 gap-1">
          {/* BUY SIDE - Lewa strona */}
          <div className="flex-1 flex flex-col">
            <div className="grid grid-cols-3 text-[7px] text-gray-600 uppercase font-bold px-2 mb-2 border-b border-gray-900 pb-1">
              <div>Price (EUR)</div>
              <div className="text-center">Qty (Szt)</div>
              <div className="text-right">Volume (kWh)</div>
            </div>
            <div className="space-y-1">
              {buyOrders.map((o, i) => (
                <div key={i} className="group relative grid grid-cols-3 text-[11px] py-1.5 px-2 hover:bg-green-500/5 transition-all">
                  <div className="absolute right-0 top-0 bottom-0 bg-green-500/10 transition-all duration-500" style={{ width: `${(o.volume / maxVol) * 100}%` }} />
                  <div className="text-green-500 font-bold z-10">{o.price.toFixed(2)}</div>
                  <div className="text-center text-green-200/60 z-10">{o.qty}</div>
                  <div className="text-right text-green-400 font-black z-10">{o.volume.toLocaleString()}</div>
                </div>
              ))}
            </div>
          </div>

          {/* SPREAD INDICATOR */}
          <div className="w-16 flex flex-col justify-center items-center bg-gray-900/30 border-x border-gray-800">
            <div className="text-[10px] font-black text-yellow-500 italic drop-shadow-[0_0_8px_rgba(234,179,8,0.4)]">
              10.59
            </div>
            <div className="text-[10px] font-black text-yellow-500 italic drop-shadow-[0_0_8px_rgba(234,179,8,0.4)] border-t border-gray-800 mt-1 pt-1">
              10.60
            </div>
            <div className="text-[6px] text-gray-600 uppercase mt-2 font-bold tracking-tighter">Spread 0.09%</div>
          </div>

          {/* SELL SIDE - Prawa strona */}
          <div className="flex-1 flex flex-col">
            <div className="grid grid-cols-3 text-[7px] text-gray-600 uppercase font-bold px-2 mb-2 border-b border-gray-900 pb-1">
              <div>Price (EUR)</div>
              <div className="text-center">Qty (Szt)</div>
              <div className="text-right">Volume (kWh)</div>
            </div>
            <div className="space-y-1">
              {sellOrders.map((o, i) => (
                <div key={i} className="group relative grid grid-cols-3 text-[11px] py-1.5 px-2 hover:bg-red-500/5 transition-all">
                  <div className="absolute left-0 top-0 bottom-0 bg-red-500/10 transition-all duration-500" style={{ width: `${(o.volume / maxVol) * 100}%` }} />
                  <div className="text-red-500 font-bold z-10">{o.price.toFixed(2)}</div>
                  <div className="text-center text-red-200/60 z-10">{o.qty}</div>
                  <div className="text-right text-red-400 font-black z-10">{o.volume.toLocaleString()}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* SEKCJA ŚRODKOWA: BSEI-PL INDEX [cite: 2026-02-15] */}
      <div className="flex-[2] flex flex-col items-center justify-center border-t border-gray-800 bg-gray-950/20 py-4 shadow-inner">
        <div className="text-[9px] text-gray-500 uppercase tracking-[0.3em] font-bold mb-2">
          BSEI-PL INDEX <span className="text-[7px] opacity-40">[DAILY WEIGHTED]</span>
        </div>
        <div className="flex items-center gap-6">
          <svg viewBox="0 0 100 100" className="w-12 h-6 overflow-visible opacity-50">
            <polyline points={sparklinePoints} fill="none" stroke="#22c55e" strokeWidth="2" strokeLinecap="round" />
          </svg>
          <div className="text-4xl font-black tracking-tighter text-gray-100 drop-shadow-glow">
            10.59 <span className="text-[10px] text-gray-600 font-normal">EUR/100vkWh</span>
          </div>
        </div>
      </div>

      {/* SEKCJA DOLNA: MARKET TURNOVER */}
      <div className="flex-[1.5] border-t border-gray-800 pt-3 bg-black/40">
        <div className="text-[8px] text-gray-600 uppercase tracking-widest mb-2 px-2">MARKET TURNOVER</div>
        <div className="space-y-1 px-2">
          {turnoverData.map((d, i) => (
            <div key={i} className="flex justify-between text-[10px] font-bold">
              <span className="text-gray-500">{d.period}</span>
              <div className="flex gap-4">
                <span className="text-yellow-600/80">{d.tokens.toLocaleString()} €BSR</span>
                <span className="text-blue-500/80">{d.volume.toLocaleString()} kWh</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}