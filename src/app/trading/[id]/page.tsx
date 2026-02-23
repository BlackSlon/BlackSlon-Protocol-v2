'use client'

import { useParams } from 'next/navigation'
import Link from 'next/link'
import { BSR_MARKETS } from '../../markets_config'
import { useState, useMemo } from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceArea } from 'recharts'

export default function TradingPage() {
  const params = useParams()
  const marketId = params.id as string
  
  // Pobieramy dane konkretnego rynku IPT z konfiguracji
  const market = BSR_MARKETS.find(m => m.id === marketId)

  // Parametry z Twojego API
  const anchor = 104.55 
  const [s, setS] = useState(0) // Stress Factor (S)
  const [orderAmount, setOrderAmount] = useState(1)

  // Formuła BlackSlon: P = a * e^(b * S) [cite: 2026-01-20]
  const currentPrice = useMemo(() => {
    return anchor * Math.exp(market ? market.b_base * s : 0)
  }, [s, market, anchor])

  // Generowanie danych do wykresu krzywej [cite: 2026-01-20]
  const chartData = useMemo(() => {
    const data = []
    for (let i = -10; i <= 10; i++) {
      const simS = s + i
      const simPrice = anchor * Math.exp(market ? market.b_base * simS : 0)
      data.push({ name: '', price: simPrice, anchor: anchor })
    }
    return data
  }, [s, market, anchor])

  if (!market) return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center font-mono">
      ERROR: MARKET_ID_NOT_FOUND [{marketId}]
    </div>
  )

  return (
    <div className="min-h-screen bg-black text-white p-8 selection:bg-blue-500/30">
      {/* NAWIGACJA */}
      <nav className="max-w-7xl mx-auto mb-12 flex justify-between items-center border-b border-gray-900 pb-6">
        <Link href="/" className="text-gray-600 hover:text-white transition-all text-[10px] font-black uppercase tracking-[0.3em]">
          ← Back to Hub
        </Link>
        <div className="text-[10px] font-mono text-blue-500 tracking-tighter italic">
          €BSR SETTLEMENT SYSTEM // {market.id}
        </div>
      </nav>

      <main className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-12">
        
        {/* LEWA KOLUMNA: WYKRES I STATYSTYKI */}
        <div className="lg:col-span-2 space-y-8">
          <div className="flex justify-between items-end">
            <div>
              <h1 className="text-6xl font-black italic tracking-tighter leading-none uppercase">{market.name}</h1>
              <div className="text-blue-500 font-mono text-xs mt-4 uppercase tracking-[0.4em]">
                {market.type} IPT Participant // Viscosity: {market.b_base}
              </div>
            </div>
            <div className="text-right">
              <div className="text-[10px] text-gray-600 uppercase mb-2 font-bold tracking-widest text-blue-400">Current BSEI Value</div>
              <div className="text-7xl font-mono font-bold leading-none tracking-tighter">
                {currentPrice.toFixed(4)}
              </div>
            </div>
          </div>

          {/* WYKRES RECHARTS Z KORYTARZEM BSTZ */}
          <div className="h-[450px] bg-[#050505] border border-gray-900 p-6 shadow-2xl relative">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid stroke="#111" vertical={false} />
                <XAxis dataKey="name" hide />
                <YAxis 
                  domain={[(anchor * 0.8), (anchor * 1.2)]} 
                  orientation="right" 
                  stroke="#333" 
                  fontSize={10} 
                  tickLine={false} 
                  axisLine={false} 
                  tickFormatter={(v) => v.toFixed(2)}
                />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#000', border: '1px solid #333', fontSize: '10px', fontFamily: 'monospace' }}
                  itemStyle={{ color: '#2563eb' }}
                  cursor={{ stroke: '#222' }}
                />
                
                {/* KORYTARZ BSTZ +/- 10% [cite: 2026-02-10] */}
                <ReferenceArea 
                  y1={anchor * 0.9} 
                  y2={anchor * 1.1} 
                  fill="#2563eb" 
                  fillOpacity={0.07} 
                />
                
                {/* Cena BSEI */}
                <Line 
                  type="monotone" 
                  dataKey="price" 
                  stroke="#2563eb" 
                  strokeWidth={4} 
                  dot={false} 
                  isAnimationActive={false} 
                />
                
                {/* Linia Kotwicy (Anchor) */}
                <Line 
                  type="step" 
                  dataKey="anchor" 
                  stroke="#222" 
                  strokeDasharray="5 5" 
                  dot={false} 
                />
              </LineChart>
            </ResponsiveContainer>
            <div className="absolute top-10 left-10 text-[9px] text-blue-500/50 uppercase font-bold tracking-widest">
              BSTZ Active Corridor (±10%)
            </div>
          </div>
        </div>

        {/* PRAWA KOLUMNA: PANEL HANDLOWY */}
        <div className="bg-[#080808] border border-gray-900 p-10 h-fit shadow-xl">
          <h2 className="text-[11px] font-black text-gray-500 uppercase mb-12 tracking-[0.5em] border-b border-gray-900 pb-6 text-center">
            Order Execution
          </h2>
          
          <div className="space-y-8">
            <div>
              <label className="text-[10px] text-gray-600 uppercase font-black mb-3 block tracking-widest">Amount (ΔS)</label>
              <input 
                type="number" 
                value={orderAmount}
                onChange={(e) => setOrderAmount(parseFloat(e.target.value) || 0)}
                className="w-full bg-black border border-gray-800 p-6 font-mono text-3xl outline-none focus:border-blue-600 transition-all text-white text-center"
              />
            </div>

            <div className="grid grid-cols-1 gap-4">
              <button 
                onClick={() => setS(s + orderAmount)} 
                className="group relative w-full py-8 bg-white text-black font-black uppercase text-xs transition-all hover:bg-blue-600 hover:text-white overflow-hidden"
              >
                <span className="relative z-10 tracking-[0.3em]">Buy IPT (Long)</span>
                <div className="absolute inset-0 bg-blue-600 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
              </button>
              
              <button 
                onClick={() => setS(s - orderAmount)} 
                className="w-full py-8 border border-gray-800 text-gray-600 font-black uppercase text-xs hover:border-red-600 hover:text-red-600 transition-all tracking-[0.3em]"
              >
                Sell IPT (Short)
              </button>
            </div>

            <div className="pt-10 border-t border-gray-900 space-y-4">
              <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest">
                <span className="text-gray-600">Spread</span>
                <span className="text-green-500 font-mono">0.00% (ZERO)</span>
              </div>
              <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest">
                <span className="text-gray-600">Protocol</span>
                <span className="text-white font-mono">€BSR Mainnet</span>
              </div>
            </div>
          </div>
        </div>

      </main>
    </div>
  )
}