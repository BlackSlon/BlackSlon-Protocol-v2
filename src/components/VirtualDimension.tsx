'use client'
import React from 'react'

export default function VirtualDimension({ marketId }: { marketId: string }) {
  // Dane rynkowe oscylujące wokół Anchora 10.59
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

  return (
    <div className="flex flex-col h-full p-5 select-none bg-gradient-to-b from-gray-900 via-black to-black font-mono text-white overflow-hidden border border-gray-800 shadow-2xl">
      
      {/* NAGŁÓWEK GŁÓWNY: VIRTUAL MARKET DIMENSION */}
      <div className="text-[10px] text-gray-500 uppercase tracking-[0.5em] font-bold text-center py-2 border-b border-gray-900 bg-black/40 mb-2">
        VIRTUAL MARKET DIMENSION
      </div>

      {/* TYTUŁ RYNKU: BlackSlon Perpetual Energy Market [Czerwony] */}
      <div className="text-center py-2">
        <div className="text-[13px] font-black tracking-widest text-red-600 uppercase italic">
          BlackSlon Perpetual Energy Market
        </div>
      </div>

      {/* LAST TICKER: Cena i Wolumen [Żółty] */}
      <div className="flex justify-center items-center gap-6 py-3 border-y border-gray-900 bg-yellow-500/5 mb-4">
        <span className="text-[10px] font-bold text-gray-500 uppercase tracking-tighter">LAST:</span>
        <span className="text-2xl font-black text-yellow-500 drop-shadow-glow">10.59 <span className="text-[10px] font-normal">EUR</span></span>
        <span className="text-2xl font-black text-yellow-500 drop-shadow-glow">1,250 <span className="text-[10px] font-normal">kWh</span></span>
      </div>

      {/* SEKCJA GÓRNA: Order Book z 2x większą czcionką */}
      <div className="flex-[8] flex flex-col min-h-0">
        <div className="flex flex-1 min-h-0 gap-2">
          
          {/* BUY SIDE */}
          <div className="flex-1 flex flex-col">
            <div className="grid grid-cols-3 text-[8px] text-gray-600 uppercase font-bold px-2 mb-3 border-b border-gray-800 pb-1">
              <div>Price</div>
              <div className="text-center">Qty</div>
              <div className="text-right">Vol</div>
            </div>
            <div className="space-y-2">
              {buyOrders.map((o, i) => (
                <div key={i} className="group relative grid grid-cols-3 text-[22px] py-2 px-2 hover:bg-green-500/10 transition-all">
                  <div className="absolute right-0 top-0 bottom-0 bg-green-500/10 transition-all duration-700" style={{ width: `${(o.volume / maxVol) * 100}%` }} />
                  <div className="text-green-500 font-black z-10 tracking-tighter">{o.price.toFixed(2)}</div>
                  <div className="text-center text-green-200/40 z-10 text-[14px] self-center">{o.qty}</div>
                  <div className="text-right text-green-400 font-bold z-10 text-[14px] self-center">{o.volume.toLocaleString()}</div>
                </div>
              ))}
            </div>
          </div>

          {/* SPREAD INDICATOR */}
          <div className="w-1 bg-gray-800/50 self-stretch my-10 rounded-full" />

          {/* SELL SIDE */}
          <div className="flex-1 flex flex-col">
            <div className="grid grid-cols-3 text-[8px] text-gray-600 uppercase font-bold px-2 mb-3 border-b border-gray-800 pb-1">
              <div>Price</div>
              <div className="text-center">Qty</div>
              <div className="text-right">Vol</div>
            </div>
            <div className="space-y-2">
              {sellOrders.map((o, i) => (
                <div key={i} className="group relative grid grid-cols-3 text-[22px] py-2 px-2 hover:bg-red-500/10 transition-all">
                  <div className="absolute left-0 top-0 bottom-0 bg-red-500/10 transition-all duration-700" style={{ width: `${(o.volume / maxVol) * 100}%` }} />
                  <div className="text-red-500 font-black z-10 tracking-tighter">{o.price.toFixed(2)}</div>
                  <div className="text-center text-red-200/40 z-10 text-[14px] self-center">{o.qty}</div>
                  <div className="text-right text-red-400 font-bold z-10 text-[14px] self-center">{o.volume.toLocaleString()}</div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>

      {/* SEKCJA ŚRODKOWA: BSEI-PL INDEX [cite: 2026-02-15] */}
      <div className="flex-[2] flex flex-col items-center justify-center border-t border-gray-900 bg-gray-950/40 py-4 shadow-2xl">
        <div className="text-[10px] text-gray-500 uppercase tracking-[0.4em] font-bold mb-2">BSEI-PL INDEX</div>
        <div className="text-5xl font-black tracking-tighter text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.2)]">
          10.59 <span className="text-[12px] text-gray-600 font-normal">EUR/100vkWh</span>
        </div>
      </div>

      {/* SEKCJA DOLNA: MARKET TURNOVER */}
      <div className="flex-[2] border-t border-gray-900 pt-4 bg-black/60">
        <div className="text-[9px] text-gray-600 uppercase tracking-widest mb-3 px-3">MARKET TURNOVER</div>
        <div className="space-y-2 px-3">
          {turnoverData.map((d, i) => (
            <div key={i} className="flex justify-between text-[11px] font-bold border-b border-gray-900/50 pb-1">
              <span className="text-gray-500">{d.period}</span>
              <div className="flex gap-6">
                <span className="text-yellow-600">{d.tokens.toLocaleString()} €BSR</span>
                <span className="text-blue-500">{d.volume.toLocaleString()} kWh</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}