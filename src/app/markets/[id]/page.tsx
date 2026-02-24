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
  const [previousPrice, setPreviousPrice] = useState<number>(9.95)
  const [longPosition, setLongPosition] = useState<number>(272836)
  const [shortPosition, setShortPosition] = useState<number>(86300)

  const market = BSR_MARKETS.find(m => m.id === marketId)

  useEffect(() => {
    const fetchMarketData = async () => {
      try {
        const response = await fetch('/api/market-data?t=' + new Date().getTime())
        const data = await response.json()
        const marketInfo = data.find((item: any) => item.id === marketId)
        if (marketInfo) {
          setMarketData(marketInfo)
          const newPrice = parseFloat(marketInfo.currentBSEI)
          setCurrentPrice(newPrice)
          // Calculate 24h change based on historical data
          const history = MARKET_HISTORY[marketId]
          if (history && history.length > 0) {
            const yesterdayPrice = (history[0].spot * 0.10 + history[0].fm * 0.40 + history[0].fq * 0.25 + history[0].cal * 0.25) / 10
            setPreviousPrice(yesterdayPrice)
          }
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

    // Generate live data based on last historical price (no fake oscillation)
    const liveData: ChartDataPoint[] = []
    const now = new Date()
    const lastHistoricalPrice = historicalData[historicalData.length - 1]?.anchor || currentPrice
    
    for (let i = 23; i >= 0; i--) {
      const hour = new Date(now.getTime() - i * 60 * 60 * 1000)
      const hourString = hour.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })
      
      // Use current price from API for live data
      liveData.push({
        date: hourString,
        rawSpot: parseFloat(currentPrice.toFixed(2)),
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

      {/* MAIN DATA BOXES */}
      <main className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Box 1: Trading Stats */}
          <div className={`bg-[#050505] border ${borderColor} p-8`}>
            <h3 className="text-[12px] text-gray-600 tracking-[0.3em] mb-6">TRADING STATS</h3>
            
            {/* IPT Current Price */}
            <div className="mb-8">
              <div className="text-[10px] text-gray-500 tracking-[0.2em] mb-2">IPT Current Price</div>
              <div className={`text-5xl font-normal font-mono tracking-tighter ${priceColor}`}>
                {currentPrice.toFixed(2)} <span className="text-[14px] text-gray-500 ml-2">EUR / vkWh</span>
              </div>
            </div>
            
            {/* Price Change % */}
            <div className="mb-8">
              <div className="text-[10px] text-gray-500 tracking-[0.2em] mb-2">Price Change 24h</div>
              <div className={`text-2xl font-normal font-mono ${
                currentPrice > previousPrice ? 'text-green-500' : 'text-red-500'
              }`}>
                {currentPrice > previousPrice ? '+' : ''}{((currentPrice - previousPrice) / previousPrice * 100).toFixed(2)}%
              </div>
            </div>
            
            {/* Open Virtual Position */}
            <div>
              <div className="text-[10px] text-gray-500 tracking-[0.2em] mb-4">Open Virtual Position</div>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 bg-black border border-gray-900">
                  <div className="text-[8px] text-gray-600 mb-1 tracking-widest">LONG</div>
                  <div className="text-xl font-normal text-green-500 font-mono">
                    {longPosition.toLocaleString('pl-PL')}
                  </div>
                  <div className="text-[8px] text-gray-500 mt-1">vkWh</div>
                </div>
                <div className="text-center p-4 bg-black border border-gray-900">
                  <div className="text-[8px] text-gray-600 mb-1 tracking-widest">SHORT</div>
                  <div className="text-xl font-normal text-red-500 font-mono">
                    {shortPosition.toLocaleString('pl-PL')}
                  </div>
                  <div className="text-[8px] text-gray-500 mt-1">vkWh</div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Box 2: Market Intel */}
          <div className={`bg-[#050505] border ${borderColor} p-8`}>
            <h3 className="text-[12px] text-gray-600 tracking-[0.3em] mb-6">MARKET INTEL</h3>
            
            <div className="mb-6">
              <div className="text-[10px] text-gray-500 tracking-[0.2em] mb-3">Market Characteristics</div>
              <div className="text-2xl font-normal text-white mb-4">
                {market.name.split(' ')[1]}
              </div>
              <div className="text-gray-300 leading-relaxed">
                Coal Base market, high EUA exposure. Premium market
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4 mt-8">
              <div className="border border-gray-900 p-4">
                <div className="text-[8px] text-gray-600 mb-1 tracking-widest">MARKET TYPE</div>
                <div className="text-sm text-white">{market.type}</div>
              </div>
              <div className="border border-gray-900 p-4">
                <div className="text-[8px] text-gray-600 mb-1 tracking-widest">BASE RATE</div>
                <div className="text-sm text-white">{(market.b_base * 100).toFixed(1)}%</div>
              </div>
            </div>
          </div>
        </div>
        {/* CHART - Visual Addition */}
        <div className="bg-[#050505] border border-gray-900 p-6">
          <h3 className="text-[12px] text-gray-600 tracking-[0.3em] mb-4">PRICE VISUALIZATION</h3>
          
          <ResponsiveContainer width="100%" height={280}>
            <ComposedChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#333" />
              <XAxis 
                dataKey="date" 
                stroke="#666"
                tick={{ fill: '#666', fontSize: 9 }}
                angle={-45}
                textAnchor="end"
                height={50}
              />
              <YAxis 
                stroke="#666"
                tick={{ fill: '#666', fontSize: 9 }}
                domain={['dataMin - 2', 'dataMax + 2']}
              />
              <Tooltip 
                contentStyle={{ backgroundColor: '#000', border: '1px solid #333', borderRadius: '4px' }}
                labelStyle={{ color: '#fff' }}
                itemStyle={{ color: '#fff' }}
              />
              
              {/* BSTZ Corridor */}
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
              
              {/* IPT_P_PL Price (Green) */}
              <Line
                type="monotone"
                dataKey="anchor"
                stroke="#10b981"
                strokeWidth={3}
                dot={false}
                name="IPT_P_PL Price"
              />
              
              {/* Raw Spot (Thin Red Background) */}
              <Line
                type="monotone"
                dataKey="rawSpot"
                stroke="#ef4444"
                strokeWidth={1}
                dot={false}
                strokeOpacity={0.6}
                name="Raw Spot"
              />
            </ComposedChart>
          </ResponsiveContainer>

          {/* Updated Legend */}
          <div className="flex justify-center gap-8 mt-4">
            <div className="flex items-center gap-2">
              <div className="w-4 h-1 bg-green-500"></div>
              <span className="text-[9px] text-gray-400">IPT_P_PL Price</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-0.5 bg-red-500 opacity-60"></div>
              <span className="text-[9px] text-gray-400">Raw Spot</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-2 bg-green-500 opacity-20"></div>
              <span className="text-[9px] text-gray-400">BSTZ max/min</span>
            </div>
          </div>
        </div>

      </main>
    </div>
  )
}
