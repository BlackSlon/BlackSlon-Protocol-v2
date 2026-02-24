'use client'

import { useState, useEffect } from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart, ComposedChart } from 'recharts'
import { MARKET_HISTORY } from '@/lib/market_history'
import { BSR_MARKETS } from '@/app/markets_config'
import { useParams } from 'next/navigation'

const montserratStyle = {
  fontFamily: "'Montserrat', sans-serif",
}

interface ChartDataPoint {
  date: string
  rawSpot: number
  anchor: number
  corridorLow: number
  corridorHigh: number
  isLive?: boolean
}

export default function MarketPage() {
  const params = useParams()
  const marketId = params.id as string
  const [marketData, setMarketData] = useState<any>(null)
  const [chartData, setChartData] = useState<ChartDataPoint[]>([])
  const [currentPrice, setCurrentPrice] = useState<number>(10.09)

  const market = BSR_MARKETS.find(m => m.id === marketId)

  useEffect(() => {
    const fetchMarketData = async () => {
      try {
        const response = await fetch('/api/market-data?t=' + new Date().getTime())
        const data = await response.json()
        const marketInfo = data.find((item: any) => item.id === marketId)
        if (marketInfo) {
          setMarketData(marketInfo)
          setCurrentPrice(parseFloat(marketInfo.currentBSEI))
        }
      } catch (error) {
        console.error('Failed to fetch market data:', error)
      }
    }

    fetchMarketData()
    const interval = setInterval(fetchMarketData, 5000)

    return () => clearInterval(interval)
  }, [marketId])

  useEffect(() => {
    if (!MARKET_HISTORY[marketId]) return

    const history = MARKET_HISTORY[marketId]
    const calculateRaw = (e: any) => 
      (e.spot * 0.10) + (e.fm * 0.40) + (e.fq * 0.25) + (e.cal * 0.25)

    // Process historical data (first 20 days)
    const historicalData: ChartDataPoint[] = history.slice(0, 20).map((entry, index) => {
      const rawSpot = calculateRaw(entry) / 10 // Convert to EUR/vkWh
      let anchor = rawSpot

      // Apply BSTZ 50/25/25 Historical Recursive Filter for anchor values
      if (index >= 2) {
        const aT = calculateRaw(history[index]) / 10
        const aT1 = calculateRaw(history[index - 1]) / 10
        const aT2 = calculateRaw(history[index - 2]) / 10
        anchor = (0.50 * aT) + (0.25 * aT1) + (0.25 * aT2)
      }

      return {
        date: new Date(entry.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }),
        rawSpot: parseFloat(rawSpot.toFixed(2)),
        anchor: parseFloat(anchor.toFixed(2)),
        corridorLow: parseFloat((anchor * 0.9).toFixed(2)),
        corridorHigh: parseFloat((anchor * 1.1).toFixed(2)),
      }
    })

    // Generate live data (last 24 hours)
    const liveData: ChartDataPoint[] = []
    const now = new Date()
    for (let i = 23; i >= 0; i--) {
      const hour = new Date(now.getTime() - i * 60 * 60 * 1000)
      const hourString = hour.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })
      
      // Oscillate around current price (10.09)
      const oscillation = (Math.sin(i * 0.5) * 0.3) + (Math.random() * 0.2 - 0.1)
      const livePrice = currentPrice + oscillation
      
      liveData.push({
        date: hourString,
        rawSpot: parseFloat(livePrice.toFixed(2)),
        anchor: parseFloat(currentPrice.toFixed(2)),
        corridorLow: parseFloat((currentPrice * 0.9).toFixed(2)),
        corridorHigh: parseFloat((currentPrice * 1.1).toFixed(2)),
        isLive: true
      })
    }

    setChartData([...historicalData, ...liveData])
  }, [marketId, currentPrice])

  if (!market) {
    return (
      <div className="min-h-screen bg-black text-white p-10" style={montserratStyle}>
        <div className="text-center">
          <h1 className="text-2xl mb-4">Market not found</h1>
          <p className="text-gray-400">The market {marketId} does not exist.</p>
        </div>
      </div>
    )
  }

  const borderColor = market.type === 'Power' ? 'border-yellow-500' : 'border-blue-400'
  const priceColor = market.type === 'Power' ? 'text-yellow-500' : 'text-blue-400'

  return (
    <div className="min-h-screen bg-black text-white p-10 font-normal" style={montserratStyle}>
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400&display=swap');
      `}</style>

      {/* HEADER */}
      <header className="max-w-7xl mx-auto mb-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-4xl font-normal tracking-wider mb-2">
              BlackSlon {market.type} Index
            </h1>
            <h2 className="text-2xl text-gray-400 tracking-tighter font-normal">
              {market.name.split(' ')[1]}
            </h2>
            <code className="text-[10px] text-gray-600 font-mono tracking-tighter">{market.id}</code>
          </div>
          
          {/* CURRENT PRICE DISPLAY */}
          <div className={`text-right p-6 bg-[#050505] border ${borderColor}`}>
            <div className="text-[10px] text-gray-600 tracking-[0.3em] mb-2">Current Index Price</div>
            <div className={`text-4xl font-normal font-mono tracking-tighter ${priceColor}`}>
              {currentPrice.toFixed(2)} <span className="text-[12px] text-gray-500 ml-2">EUR/100vkWh</span>
            </div>
            <div className="text-[10px] text-green-500 mt-2">+1.24%</div>
          </div>
        </div>
      </header>

      {/* CHART */}
      <main className="max-w-7xl mx-auto">
        <div className="bg-[#050505] border border-gray-900 p-6">
          <h3 className="text-lg font-normal text-gray-400 mb-6 tracking-wider">Price History & Live Data</h3>
          
          <ResponsiveContainer width="100%" height={400}>
            <ComposedChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#333" />
              <XAxis 
                dataKey="date" 
                stroke="#666"
                tick={{ fill: '#666', fontSize: 10 }}
                angle={-45}
                textAnchor="end"
                height={60}
              />
              <YAxis 
                stroke="#666"
                tick={{ fill: '#666', fontSize: 10 }}
                domain={['dataMin - 2', 'dataMax + 2']}
              />
              <Tooltip 
                contentStyle={{ backgroundColor: '#000', border: '1px solid #333', borderRadius: '4px' }}
                labelStyle={{ color: '#fff' }}
                itemStyle={{ color: '#fff' }}
              />
              
              {/* Corridor Area */}
              <Area
                type="monotone"
                dataKey="corridorHigh"
                stroke="none"
                fill="#10b981"
                fillOpacity={0.1}
              />
              <Area
                type="monotone"
                dataKey="corridorLow"
                stroke="none"
                fill="#000"
                fillOpacity={1}
              />
              
              {/* Anchor Line (Green) */}
              <Line
                type="monotone"
                dataKey="anchor"
                stroke="#10b981"
                strokeWidth={2}
                dot={false}
                name="Anchor"
              />
              
              {/* Raw Spot Line (Red) */}
              <Line
                type="monotone"
                dataKey="rawSpot"
                stroke="#ef4444"
                strokeWidth={2}
                dot={false}
                name="Raw Spot"
              />
            </ComposedChart>
          </ResponsiveContainer>

          {/* Legend */}
          <div className="flex justify-center gap-8 mt-6">
            <div className="flex items-center gap-2">
              <div className="w-4 h-1 bg-red-500"></div>
              <span className="text-[10px] text-gray-400">Raw Spot</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-1 bg-green-500"></div>
              <span className="text-[10px] text-gray-400">Anchor (Smoothed)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-2 bg-green-500 opacity-20"></div>
              <span className="text-[10px] text-gray-400">±10% Corridor</span>
            </div>
          </div>
        </div>

        {/* MARKET INFO */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          <div className="bg-[#050505] border border-gray-900 p-6">
            <h4 className="text-[10px] text-gray-600 tracking-[0.3em] mb-4">MARKET STATUS</h4>
            <div className="text-2xl font-normal text-green-500">Active</div>
            <div className="text-[10px] text-gray-500 mt-2">Last Update: {new Date().toLocaleTimeString()}</div>
          </div>
          
          <div className="bg-[#050505] border border-gray-900 p-6">
            <h4 className="text-[10px] text-gray-600 tracking-[0.3em] mb-4">PRICE CORRIDOR</h4>
            <div className="text-lg font-normal">
              <div className="text-red-400">{(currentPrice * 0.9).toFixed(2)} - {(currentPrice * 1.1).toFixed(2)}</div>
              <div className="text-[10px] text-gray-500 mt-1">EUR/100vkWh</div>
            </div>
          </div>
          
          <div className="bg-[#050505] border border-gray-900 p-6">
            <h4 className="text-[10px] text-gray-600 tracking-[0.3em] mb-4">24H VOLUME</h4>
            <div className="text-2xl font-normal">2.4M</div>
            <div className="text-[10px] text-gray-500 mt-1">vkWh Traded</div>
          </div>
        </div>
      </main>
    </div>
  )
}
