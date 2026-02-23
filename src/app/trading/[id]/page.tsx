'use client'

import { useParams } from 'next/navigation'
import Link from 'next/link'
import { BSR_MARKETS } from '../../markets_config'
import { useState, useMemo } from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceArea } from 'recharts'

export default function TradingPage() {
  const params = useParams()
  const marketId = params.id as string
  const market = BSR_MARKETS.find(m => m.id === marketId)

  // Parametry rynkowe
  const anchor = 104.55 
  const [s, setS] = useState(0)
  const [orderAmount, setOrderAmount] = useState(1)

  // Formuła BlackSlon [cite: 2026-01-20]
  const currentPrice = useMemo(() => {
    return anchor * Math.exp(market ? market.b_base * s : 0)
  }, [s, market, anchor])

  const chartData = useMemo(() => {
    const data = []
    for (let i = -10; i <= 10; i++) {
      const simS = s + i
      const simPrice = anchor * Math.exp(market ? market.b_base * simS : 0)
      data.push({ name: '', price: simPrice, anchor: anchor })
    }
    return data
  }, [s, market, anchor])

  if (!market) return <div className="p-10 text-white font-mono uppercase text-xs">Market data not found</div>

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <nav className="max-w-7xl mx-auto mb-12 flex justify-between items-center border-b border-gray-900 pb-6">
        <Link href="/" className="text-gray-600 hover:text-white transition-all text-[10px] font-bold uppercase tracking-widest">← Return to Dashboard</Link>
        <div className="text-[10px] font-mono text-yellow-500 tracking-tighter italic uppercase">BlackSlon Index // {market.id}</div>
      </nav>

      <main className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-8">
          <div className="flex justify-between items-end">
            <div>
              <h1 className="text-5xl font-black italic tracking-tighter leading-none uppercase">{market.name}</h1>
              <div className="text-yellow-500 font-mono text-xs mt-4 uppercase tracking-[0.3em]">{market.type} IPT Participant</div>
            </div>
            <div className="text-right">
              <div className="text-[10px] text-gray-600 uppercase mb-1 font-bold tracking-widest text-blue-400">Current BSEI Value</div>
              <div className="text-6xl font-mono font-bold leading-none">{currentPrice.toFixed(4)}</div>
            </div>
          </div>

          <div className="h-[400px] bg-[#050505] border border-gray-900 p-4 shadow-inner">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid stroke="#111" vertical={false} />
                <XAxis dataKey="name" hide />
                <YAxis domain={[(anchor * 0.8), (anchor * 1.2)]} orientation="right" stroke="#333" fontSize={10} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ backgroundColor: '#000', border: '1px solid #333', fontSize: '10px' }} />
                <ReferenceArea y1={anchor * 0.9} y2={anchor * 1.1} fill="#eab308" fillOpacity={0.05} />
                <Line type="monotone" dataKey="price" stroke="#eab308" strokeWidth={3} dot={false} isAnimationActive={false} />
                <Line type="step" dataKey="anchor" stroke="#222" strokeDasharray="5 5" dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-[#080808] border border-gray-900 p-8 h-fit shadow-xl">
          <h2 className="text-[10px] font-bold text-gray-600 uppercase mb-10 tracking-[0.4em] border-b border-gray-900 pb-4 text-center">Execution Panel</h2>
          <div className="space-y-6">
            <input 
              type="number" 
              value={orderAmount}
              onChange={(e) => setOrderAmount(parseFloat(e.target.value) || 0)}
              className="w-full bg-black border border-gray-800 p-5 font-mono text-2xl outline-none focus:border-yellow-500 text-white text-center"
            />
            <button onClick={() => setS(s + orderAmount)} className="w-full py-6 bg-yellow-500 text-black font-black uppercase text-xs hover:bg-yellow-400 transition-all tracking-widest">Buy IPT (Long)</button>
            <button onClick={() => setS(s - orderAmount)} className="w-full py-6 border border-gray-800 text-gray-600 font-black uppercase text-xs hover:border-red-600 hover:text-red-600 transition-all tracking-widest">Sell IPT (Short)</button>
          </div>
        </div>
      </main>
    </div>
  )
}