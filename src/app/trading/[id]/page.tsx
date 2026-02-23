'use client'

import { useParams } from 'next/navigation'
import Link from 'next/link'
import { BSR_MARKETS } from '../../markets_config'
import { useState, useMemo } from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceArea } from 'recharts'

const montserratStyle = {
  fontFamily: "'Montserrat', sans-serif",
}

export default function TradingPage() {
  const params = useParams()
  const marketId = params.id as string
  const market = BSR_MARKETS.find(m => m.id === marketId)

  // Standard hurtowy (MWh) [cite: 2026-02-15]
  const anchorMWh = 104.55 
  const [s, setS] = useState(0)
  const [orderAmount, setOrderAmount] = useState(1)

  // Obliczanie ceny hurtowej BSEI [cite: 2026-01-20]
  const currentPriceMWh = useMemo(() => {
    return anchorMWh * Math.exp(market ? market.b_base * s : 0)
  }, [s, market, anchorMWh])

  // Cena IPT (100 kWh) = 0.1 * MWh
  const iptPrice = currentPriceMWh / 10

  const chartData = useMemo(() => {
    const data = []
    for (let i = -10; i <= 10; i++) {
      const simS = s + i
      const simPriceMWh = anchorMWh * Math.exp(market ? market.b_base * simS : 0)
      // Na wykresie pokazujemy cenę tokena IPT
      data.push({ name: '', price: simPriceMWh / 10, anchor: anchorMWh / 10 })
    }
    return data
  }, [s, market, anchorMWh])

  if (!market) return <div className="p-10 text-white font-normal">Market data not found</div>

  return (
    <div className="min-h-screen bg-black text-white p-8 font-normal" style={montserratStyle}>
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;700&display=swap');
      `}</style>

      <nav className="max-w-7xl mx-auto mb-12 flex justify-between items-center border-b border-gray-900 pb-6">
        <Link href="/" className="text-gray-500 hover:text-white transition-all text-[10px] tracking-widest">
          ← Return to Dashboard
        </Link>
        <div className="text-[10px] text-gray-500 tracking-tighter italic">
          BlackSlon Index // {market.id}
        </div>
      </nav>

      <main className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-8">
          <div className="flex justify-between items-end">
            <div>
              <h1 className="text-4xl tracking-tighter leading-none mb-2">
                BlackSlon {market.type} Index {market.name.split(' ')[1]}
              </h1>
              <div className="text-gray-500 text-xs tracking-[0.2em]">
                {market.type} IPT Participant (100 kWh)
              </div>
            </div>
            <div className="text-right">
              <div className="text-[10px] text-gray-600 uppercase mb-2 tracking-widest">Current IPT Price (€BSR)</div>
              <div className="text-6xl font-normal leading-none tracking-tighter">
                {iptPrice.toFixed(4)}
              </div>
            </div>
          </div>

          <div className="h-[400px] bg-[#050505] border border-gray-900 p-4 relative">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid stroke="#111" vertical={false} />
                <XAxis dataKey="name" hide />
                <YAxis 
                  domain={[(anchorMWh / 10 * 0.8), (anchorMWh / 10 * 1.2)]} 
                  orientation="right" 
                  stroke="#333" 
                  fontSize={10} 
                  tickLine={false} 
                  axisLine={false} 
                />
                <Tooltip contentStyle={{ backgroundColor: '#000', border: '1px solid #333', fontSize: '10px' }} />
                <ReferenceArea y1={anchorMWh / 10 * 0.9} y2={anchorMWh / 10 * 1.1} fill="#ffffff" fillOpacity={0.03} />
                <Line type="monotone" dataKey="price" stroke="#ffffff" strokeWidth={2} dot={false} isAnimationActive={false} />
                <Line type="step" dataKey="anchor" stroke="#222" strokeDasharray="5 5" dot={false} />
              </LineChart>
            </ResponsiveContainer>
            <div className="absolute top-6 left-6 text-[8px] text-gray-600 tracking-widest">
              Standard: 1 IPT = 0.1 MWh (100 kWh)
            </div>
          </div>
        </div>

        <div className="bg-[#080808] border border-gray-900 p-8 h-fit">
          <h2 className="text-[10px] text-gray-600 uppercase mb-10 tracking-[0.4em] border-b border-gray-900 pb-4 text-center">
            Execution Panel
          </h2>
          <div className="space-y-6">
            <div>
              <label className="text-[9px] text-gray-600 uppercase mb-2 block tracking-widest text-center">Amount (IPT Tokens)</label>
              <input 
                type="number" 
                value={orderAmount}
                onChange={(e) => setOrderAmount(parseFloat(e.target.value) || 0)}
                className="w-full bg-black border border-gray-800 p-5 text-2xl outline-none focus:border-white transition-all text-white text-center font-normal"
              />
            </div>
            <button onClick={() => setS(s + orderAmount)} className="w-full py-6 bg-white text-black font-normal text-[10px] hover:bg-gray-200 transition-all tracking-[0.2em]">Buy IPT (Long)</button>
            <button onClick={() => setS(s - orderAmount)} className="w-full py-6 border border-gray-800 text-gray-400 font-normal text-[10px] hover:border-white hover:text-white transition-all tracking-[0.2em]">Sell IPT (Short)</button>
          </div>
        </div>
      </main>
    </div>
  )
}