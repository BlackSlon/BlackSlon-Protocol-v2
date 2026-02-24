'use client'

import { useParams } from 'next/navigation'
import Link from 'next/link'
import { BSR_MARKETS } from '../../markets_config'
import { MARKET_HISTORY } from '../../../lib/market_history'
import { useState, useEffect, useMemo } from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceArea } from 'recharts'

const montserratStyle = {
  fontFamily: "'Montserrat', sans-serif",
}

export default function TradingPage() {
  const params = useParams()
  const marketId = params.id as string
  const market = BSR_MARKETS.find(m => m.id === marketId)
  const [marketData, setMarketData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [s, setS] = useState(0)
  const [orderAmount, setOrderAmount] = useState(1)

  // Pobieranie danych z API
  useEffect(() => {
    const fetchMarketData = async () => {
      try {
        const response = await fetch('/api/market-data?t=' + new Date().getTime())
        const data = await response.json()
        const dataObject = data?.reduce((acc: any, item: any) => ({ ...acc, [item.id]: item }), {})
        setMarketData(dataObject)
        setLoading(false)
      } catch (error) {
        console.error('Failed to fetch market data:', error)
        setLoading(false)
      }
    }

    fetchMarketData()
    const interval = setInterval(fetchMarketData, 5000)

    return () => clearInterval(interval)
  }, [])

  // Pobranie aktualnej ceny z API lub domyślnej wartości
  const anchorMWh = useMemo(() => {
    if (marketData && marketData[marketId]) {
      console.log('API price:', marketData[marketId].wholesalePrice)
      return parseFloat(marketData[marketId].wholesalePrice)
    }
    console.log('Using fallback price: 104.55')
    return 104.55 // fallback
  }, [marketData, marketId])

  // Cena jednostkowa - używaj ceny z API, gdy dostępna, inaczej oblicz
  const displayPrice = useMemo(() => {
    if (marketData && marketData[marketId]) {
      const apiPrice = parseFloat(marketData[marketId].currentBSEI)
      console.log('Using API currentBSEI:', apiPrice)
      return apiPrice
    }
    
    const calculatedPrice = anchorMWh * Math.exp(market ? market.b_base * s : 0) / 10
    console.log('Using calculated price:', calculatedPrice)
    return calculatedPrice
  }, [marketData, marketId, anchorMWh, s])

  // Dane historyczne z MARKET_HISTORY
  const historyData = useMemo(() => {
    const history = MARKET_HISTORY[marketId] || []
    return history.map((entry, index) => {
      const calculateRaw = (e: any) => 
        (e.spot * 0.10) + (e.fm * 0.40) + (e.fq * 0.25) + (e.cal * 0.25)
      
      // Dla ostatnich 3 dni używamy filtru BSTZ
      let price
      if (index >= history.length - 3) {
        const currentIndex = index
        const aT = calculateRaw(history[history.length - 1])   // ostatni dzień
        const aT1 = calculateRaw(history[history.length - 2])  // przedostatni dzień
        const aT2 = calculateRaw(history[history.length - 3])  // 3. dzień od końca
        
        if (currentIndex === history.length - 1) {
          price = (0.50 * aT) + (0.25 * aT1) + (0.25 * aT2)
        } else if (currentIndex === history.length - 2) {
          price = (0.50 * aT1) + (0.25 * aT2) + (0.25 * calculateRaw(history[history.length - 4] || aT2))
        } else {
          price = calculateRaw(entry)
        }
      } else {
        price = calculateRaw(entry)
      }
      
      return {
        date: entry.date,
        price: price / 10, // konwersja na EUR/100kWh
        anchor: anchorMWh / 10
      }
    })
  }, [marketId, anchorMWh])

  const chartData = useMemo(() => {
    const data = []
    for (let i = -10; i <= 10; i++) {
      const simS = s + i
      const simPriceMWh = anchorMWh * Math.exp(market ? market.b_base * simS : 0)
      data.push({ name: '', price: simPriceMWh / 10, anchor: anchorMWh / 10 })
    }
    return data
  }, [s, market, anchorMWh])

  if (!market) return <div className="p-10 text-white font-normal">Market data not found</div>

  return (
    <div className="min-h-screen bg-black text-white p-8 font-normal" style={montserratStyle}>
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400&display=swap');
      `}</style>

      <nav className="max-w-7xl mx-auto mb-12 flex justify-between items-center border-b border-gray-900 pb-6">
        <Link href="/" className="text-gray-500 hover:text-white transition-all text-[10px] tracking-widest">
          ← Return to Dashboard
        </Link>
        <div className="text-[10px] text-gray-500 italic">
          BlackSlon Index // {market.id}
        </div>
      </nav>

      <main className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-8">
          <div className="flex justify-between items-end">
            <div>
              <h1 className="text-4xl tracking-tighter leading-none mb-2 font-normal">
                BlackSlon {market.type} Index {market.name.split(' ')[1]}
              </h1>
              <div className="text-gray-500 text-xs tracking-[0.2em]">
                Index Participant Token // 100kWh Standard
              </div>
            </div>
            <div className="text-right">
              <div className="text-[10px] text-gray-600 mb-2 tracking-widest">Current Price</div>
              <div className="text-6xl font-normal leading-none tracking-tighter">
                {displayPrice.toFixed(4)} <span className="text-xl text-gray-500 ml-2">EUR/100kWh</span>
              </div>
            </div>
          </div>

          <div className="h-[400px] bg-[#050505] border border-gray-900 p-4 relative">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={historyData}>
                <CartesianGrid stroke="#111" vertical={false} />
                <XAxis dataKey="date" stroke="#333" fontSize={9} tickLine={false} axisLine={false} />
                <YAxis 
                  domain={[(anchorMWh / 10 * 0.8), (anchorMWh / 10 * 1.2)]} 
                  orientation="right" 
                  stroke="#333" 
                  fontSize={10} 
                  tickLine={false} 
                  axisLine={false} 
                  tickFormatter={(val: any) => val.toFixed(2)}
                />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#000', border: '1px solid #333', fontSize: '10px' }}
                  formatter={(value: number) => [`${value.toFixed(4)} EUR/100kWh`, 'Price']}
                />
                <ReferenceArea y1={anchorMWh / 10 * 0.9} y2={anchorMWh / 10 * 1.1} fill="#ffffff" fillOpacity={0.03} />
                <Line type="monotone" dataKey="price" stroke="#ffffff" strokeWidth={2} dot={false} isAnimationActive={false} />
                <Line type="step" dataKey="anchor" stroke="#222" strokeDasharray="5 5" dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-[#080808] border border-gray-900 p-8 h-fit">
          <h2 className="text-[10px] text-gray-600 mb-10 tracking-[0.4em] border-b border-gray-900 pb-4 text-center">
            Execution Panel
          </h2>
          <div className="space-y-6">
            <div>
              <label className="text-[9px] text-gray-600 mb-2 block tracking-widest text-center">Order Amount (IPT)</label>
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
          <div className="mt-8 text-[8px] text-gray-700 text-center tracking-widest">
            Unit Settlement: EUR per 100 kWh
          </div>
        </div>
      </main>
    </div>
  )
}