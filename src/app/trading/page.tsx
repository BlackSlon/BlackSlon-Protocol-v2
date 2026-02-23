'use client'

import { useParams } from 'next/navigation'
import Link from 'next/link'
import { BSR_MARKETS } from '../../markets_config'
import { useState, useMemo } from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceArea, YAxisProps } from 'recharts'

export default function TradingPage() {
  const params = useParams()
  const marketId = params.id as string
  const market = BSR_MARKETS.find(m => m.id === marketId)

  // --- MATEMATYKA BLACKSLON ---
  const anchor = 100.00 // Weighted Anchor (a)
  const [s, setS] = useState(0) // Skumulowany Stress Factor (S)
  const [orderAmount, setOrderAmount] = useState(1)

  // Obliczanie ceny BSEI: P = a * e^(b * S)
  const currentPrice = useMemo(() => {
    return anchor * Math.exp(market ? market.b_base * s : 0)
  }, [s, market, anchor])

  // Generowanie danych do wykresu (symulacja krzywej)
  const chartData = useMemo(() => {
    const data = []
    for (let i = -20; i <= 20; i++) {
      const simS = s + i
      const simPrice = anchor * Math.exp(market ? market.b_base * simS : 0)
      data.push({
        name: i === 0 ? 'NOW' : '',
        price: parseFloat(simPrice.toFixed(4)),
        anchor: anchor
      })
    }
    return data
  }, [s, market, anchor])

  if (!market) return <div className="p-10 text-white">Market not found.</div>

  const handleTrade = (type: 'BUY' | 'SELL') => {
    const deltaS = type === 'BUY' ? orderAmount : -orderAmount
    setS(prev => prev + deltaS)
  }

  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-blue-500/30">
      {/* NAWIGACJA */}
      <nav className="border-b border-gray-900 p-6 flex justify-between items-center bg-[#050505]">
        <Link href="/" className="text-gray-500 hover:text-white transition-colors flex items-center gap-2 text-xs uppercase tracking-widest font-bold">
          ← Back to Dashboard
        </Link>
        <div className="text-sm font-bold text-blue-500 tracking-tighter">€BSR PROTOCOL // {market.id}</div>
      </nav>

      <main className="max-w-7xl mx-auto p-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* KOLUMNA WYKRESU */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-[#080808] border border-gray-900 p-8">
            <div className="flex justify-between items-end mb-12">
              <div>
                <h1 className="text-5xl font-black italic tracking-tighter mb-2">{market.name}</h1>
                <div className="flex gap-4">
                    <span className="text-[10px] bg-blue-900/20 text-blue-400 px-2 py-1 rounded uppercase font-bold border border-blue-900/30">
                        {market.type} IPT
                    </span>
                    <span className="text-[10px] text-gray-600 font-mono mt-1">S-FACTOR: {s.toFixed(2)}</span>
                </div>
              </div>
              <div className="text-right">
                <div className="text-[10px] text-gray-600 uppercase mb-1 tracking-widest font-bold">BSEI Price (€BSR)</div>
                <div className="text-6xl font-mono font-bold text-white tracking-tighter">
                    {currentPrice.toFixed(4)}
                </div>
              </div>
            </div>

            {/* INTERAKTYWNY WYKRES RECHARTS */}
            <div className="h-[400px] w-full bg-[#050505] border border-gray-900 p-4">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#111" vertical={false} />
                  <XAxis dataKey="name" hide />
                  <YAxis 
                    domain={[(anchor * 0.85), (anchor * 1.15)]} 
                    orientation="right" 
                    stroke="#333" 
                    fontSize={10} 
                    tickFormatter={(val) => val.toFixed(2)}
                  />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#000', border: '1px solid #333', fontSize: '10px' }}
                    itemStyle={{ color: '#2563eb' }}
                  />
                  
                  {/* KORYTARZ BSTZ +/- 10% */}
                  <ReferenceArea 
                    y1={anchor * 0.9} 
                    y2={anchor * 1.1} 
                    fill="#2563eb" 
                    fillOpacity={0.05} 
                  />
                  
                  <Line 
                    type="monotone" 
                    dataKey="price" 
                    stroke="#2563eb" 
                    strokeWidth={3} 
                    dot={false} 
                    animationDuration={300}
                  />
                  <Line 
                    type="step" 
                    dataKey="anchor" 
                    stroke="#333" 
                    strokeDasharray="5 5" 
                    dot={false} 
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* METRYKI POD WYKRESEM */}
            <div className="mt-8 grid grid-cols-4 gap-4">
              <div className="p-4 border border-gray-900 bg-black">
                <div className="text-[9px] text-gray-600 uppercase mb-1 font-bold">Anchor (a)</div>
                <div className="font-mono text-sm">{anchor.toFixed(2)}</div>
              </div>
              <div className="p-4 border border-gray-900 bg-black">
                <div className="text-[9px] text-gray-600 uppercase mb-1 font-bold">Viscosity (b)</div>
                <div className="font-mono text-sm text-blue-500">{market.b_base}</div>
              </div>
              <div className="p-4 border border-gray-900 bg-black">
                <div className="text-[9px] text-gray-600 uppercase mb-1 font-bold">BSTZ Floor</div>
                <div className="font-mono text-sm text-red-900">{(anchor * 0.9).toFixed(2)}</div>
              </div>
              <div className="p-4 border border-gray-900 bg-black">
                <div className="text-[9px] text-gray-600 uppercase mb-1 font-bold">BSTZ Ceiling</div>
                <div className="font-mono text-sm text-green-900">{(anchor * 1.1).toFixed(2)}</div>
              </div>
            </div>
          </div>
        </div>

        {/* PANEL HANDLOWY */}
        <div className="space-y-6">
          <div className="bg-[#080808] border border-gray-900 p-8">
            <h2 className="text-[10px] font-black tracking-[0.4em] uppercase mb-10 text-gray-500 border-b border-gray-900 pb-4">
              Order Execution
            </h2>
            
            <div className="space-y-8">
              <div>
                <div className="flex justify-between mb-3">
                    <label className="text-[10px] text-gray-600 uppercase font-bold">Amount (ΔS)</label>
                    <span className="text-[10px] text-blue-500 font-mono">Available: ∞</span>
                </div>
                <input 
                  type="number" 
                  value={orderAmount}
                  onChange={(e) => setOrderAmount(parseFloat(e.target.value) || 0)}
                  className="w-full bg-black border border-gray-800 p-5 font-mono text-2xl focus:border-blue-600 outline-none transition-all text-white"
                />
              </div>

              <div className="grid grid-cols-1 gap-3">
                <button 
                  onClick={() => handleTrade('BUY')}
                  className="group relative py-6 bg-white text-black font-black uppercase tracking-widest text-xs hover:bg-blue-600 hover:text-white transition-all overflow-hidden"
                >
                  <span className="relative z-10">Buy IPT (Long)</span>
                  <div className="absolute inset-0 bg-blue-600 translate-y-full group-hover:translate-y-0 transition-transform"></div>
                </button>
                
                <button 
                  onClick={() => handleTrade('SELL')}
                  className="py-6 border border-gray-800 text-gray-500 font-black uppercase tracking-widest text-xs hover:border-red-600 hover:text-red-600 transition-all"
                >
                  Sell IPT (Short)
                </button>
              </div>

              <div className="pt-8 border-t border-gray-900 space-y-3">
                <div className="flex justify-between text-[9px] text-gray-600 uppercase font-bold">
                  <span>Protocol Fee</span>
                  <span className="text-white font-mono">0.00%</span>
                </div>
                <div className="flex justify-between text-[9px] text-gray-600 uppercase font-bold">
                  <span>Settlement</span>
                  <span className="text-green-500 font-mono">INSTANT</span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-[#050505] border-l-2 border-blue-600 p-6">
            <h4 className="text-[10px] font-black text-blue-500 uppercase mb-3 tracking-widest">Autonomous Stability</h4>
            <p className="text-[10px] text-gray-500 leading-relaxed uppercase font-medium">
              Every trade shifts the price along the Bonding Curve. When BSEI price hits the ±10% BSTZ corridor, 
              arbitrage incentives are automatically triggered to restore the Weighted Anchor.
            </p>
          </div>
        </div>

      </main>
    </div>
  )
}