'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { ComposedChart, Line, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import OrderPanel from '@/components/OrderPanel'
import MarketPanel from '@/components/MarketPanel'
import PortfolioPanel from '@/components/PortfolioPanel'
import { BSR_MARKETS } from '@/app/markets_config'
import { MARKET_HISTORY } from '@/lib/market_history'

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

  const montserratStyle = {
    fontFamily: 'Montserrat, sans-serif'
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white p-4 font-normal" style={montserratStyle}>
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400&display=swap');
      `}</style>

      {/* HEADER */}
      <header className="max-w-full mx-auto mb-6">
        <div className="flex items-center justify-between px-4">
          <div>
            <h1 className="text-2xl font-normal tracking-wider mb-1">
              BlackSlon {market.type} Index
            </h1>
            <h2 className="text-lg text-gray-400 tracking-tighter font-normal">
              {market.name.split(' ')[1]}
            </h2>
            <code className="text-[9px] text-gray-600 font-mono tracking-tighter">{market.id}</code>
          </div>
        </div>
      </header>

      {/* TRADING TERMINAL GRID */}
      <main className="max-w-full mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 p-6 h-[calc(100vh-120px)]">
          
          {/* BOX 1: ORDER PANEL */}
          <OrderPanel 
            currentPrice={currentPrice}
            borderColor={borderColor}
            montserratStyle={montserratStyle}
          />

          {/* BOX 2: MARKET PANEL (BSTZ Synthesis) */}
          <MarketPanel 
            currentPrice={currentPrice}
            borderColor={borderColor}
            montserratStyle={montserratStyle}
          />

          {/* BOX 3: PORTFOLIO */}
          <PortfolioPanel 
            borderColor={borderColor}
            montserratStyle={montserratStyle}
          />

        </div>
      </main>
    </div>
  )
}
import { BSR_MARKETS } from '@/app/markets_config'
import { useParams } from 'next/navigation'

const montserratStyle = {
  fontFamily: "'Montserrat', sans-serif",
}

const monoStyle = {
  fontFamily: "'Courier New', monospace",
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
  // Order Panel State
  const [quantity, setQuantity] = useState<number>(100)
  const [bsrCollateral, setBsrCollateral] = useState<number>(50)
  const [euroCollateral, setEuroCollateral] = useState<number>(50)
  const [depositDirection, setDepositDirection] = useState<'BUY' | 'SELL'>('BUY')

  // Risk Management Table
  const riskTable = {
    10: { buyMargin: 50, sellMargin: 100, fee: 1.00 },
    25: { buyMargin: 45, sellMargin: 90, fee: 0.85 },
    50: { buyMargin: 40, sellMargin: 80, fee: 0.60 },
    75: { buyMargin: 30, sellMargin: 60, fee: 0.35 },
    100: { buyMargin: 25, sellMargin: 50, fee: 0.20 }
  }

  // Portfolio State
  const [bsrPrice, setBsrPrice] = useState<number>(1.05)
  const [openPosition, setOpenPosition] = useState<number>(272836)
  const [bsrDeposit, setBsrDeposit] = useState<number>(1000)
  const [euroDeposit, setEuroDeposit] = useState<number>(500)
  const [lockedFunds, setLockedFunds] = useState<number>(200)

  // Sentiment Data
  const [longPercentage, setLongPercentage] = useState<number>(76)
  const [shortPercentage, setShortPercentage] = useState<number>(24)

  const [currentPrice, setCurrentPrice] = useState<number>(10.09)
  const [previousPrice, setPreviousPrice] = useState<number>(9.95)

  const market = BSR_MARKETS.find(m => m.id === marketId)

  // Collateral sliders logic
  const handleBsrChange = (value: number) => {
    setBsrCollateral(value)
    setEuroCollateral(100 - value)
  }

  const handleEuroChange = (value: number) => {
    setEuroCollateral(value)
    setBsrCollateral(100 - value)
  }

  // Calculate leverage and margin requirements
  const calculateLeverage = () => {
    const totalCollateral = (bsrCollateral / 100) * bsrDeposit + (euroCollateral / 100) * euroDeposit
    const positionValue = quantity * currentPrice
    return totalCollateral > 0 ? (positionValue / totalCollateral).toFixed(2) : '1.00'
  }

  const getRiskData = () => {
    const bsrKey = Math.floor(bsrCollateral / 10) * 10 as keyof typeof riskTable
    const closestKey = Object.keys(riskTable).map(Number).find(key => key >= bsrCollateral) || 100
    return riskTable[closestKey as keyof typeof riskTable]
  }

  const calculateMarginRequired = () => {
    const riskData = getRiskData()
    const positionValue = quantity * currentPrice
    
    if (depositDirection === 'BUY') {
      const marginRate = riskData.buyMargin / 100
      const requiredMargin = positionValue * marginRate
      const bsrRequired = (requiredMargin * bsrCollateral) / 100
      const euroRequired = (requiredMargin * euroCollateral) / 100
      return { buyMargin: riskData.buyMargin, sellMargin: riskData.sellMargin, bsrRequired, euroRequired, fee: riskData.fee }
    } else {
      const marginRate = riskData.sellMargin / 100
      const requiredMargin = positionValue * marginRate
      const bsrRequired = (requiredMargin * bsrCollateral) / 100
      const euroRequired = (requiredMargin * euroCollateral) / 100
      return { buyMargin: riskData.buyMargin, sellMargin: riskData.sellMargin, bsrRequired, euroRequired, fee: riskData.fee }
    }
  }

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
    <div className="min-h-screen bg-[#0a0a0a] text-white p-4 font-normal" style={montserratStyle}>
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400&display=swap');
      `}</style>

      {/* HEADER */}
      <header className="max-w-full mx-auto mb-6">
        <div className="flex items-center justify-between px-4">
          <div>
            <h1 className="text-2xl font-normal tracking-wider mb-1">
              BlackSlon {market.type} Index
            </h1>
            <h2 className="text-lg text-gray-400 tracking-tighter font-normal">
              {market.name.split(' ')[1]}
            </h2>
            <code className="text-[9px] text-gray-600 font-mono tracking-tighter">{market.id}</code>
          </div>
        </div>
      </header>

      {/* TRADING TERMINAL GRID */}
      <main className="max-w-full mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 h-[calc(100vh-120px)]">
          
          {/* BOX 1: ORDER PANEL */}
          <div className={`bg-black border ${borderColor} p-4 flex flex-col scale-[0.6894] origin-top`}>
            {/* Header */}
            <div className="mb-6">
              <h3 className="text-[12px] text-white font-bold tracking-[0.3em] mb-2 border-b border-gray-600 pb-2 text-center">ORDER PANEL</h3>
              <div className="text-[17px] font-bold tracking-[0.3em] text-red-500 text-center">INSTRUMENT: IPT-P-PL</div>
            </div>
            
            {/* TRADING Section */}
            <div className="mb-10">
              {/* Current IPT Price */}
              <div className="mb-6">
                <div className="flex items-center justify-center">
                  <span className={`text-5xl font-bold tracking-[0.15em] text-yellow-400`}>
                    {currentPrice.toFixed(2)}
                  </span>
                  <span className="text-[14px] text-white ml-4">EUR/vkWh</span>
                </div>
              </div>
              
              {/* Quantity Stepper */}
              <div className="mb-8">
                <div className="text-[10px] text-white tracking-[0.2em] mb-3 text-center font-bold">QUANTITY</div>
                <div className="flex items-center justify-center gap-3">
                  <button 
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-8 h-8 bg-gray-800 hover:bg-gray-700 text-white rounded flex items-center justify-center text-sm font-bold"
                  >
                    -
                  </button>
                  <input
                    type="number"
                    value={quantity}
                    onChange={(e) => setQuantity(Math.max(1, Math.min(1000, parseInt(e.target.value) || 1)))}
                    className="w-20 text-center bg-gray-800 text-white font-mono text-xl rounded border border-gray-700 focus:outline-none focus:border-gray-600"
                    style={{
                      appearance: 'textfield',
                      MozAppearance: 'textfield',
                      WebkitAppearance: 'none'
                    }}
                  />
                  <button 
                    onClick={() => setQuantity(Math.min(1000, quantity + 1))}
                    className="w-8 h-8 bg-gray-800 hover:bg-gray-700 text-white rounded flex items-center justify-center text-sm font-bold"
                  >
                    +
                  </button>
                </div>
              </div>
              
              {/* Trade Buttons */}
              <div className="flex justify-center gap-4">
                <button className="bg-transparent border-2 border-green-500 text-green-500 py-4 px-6 rounded font-bold text-sm tracking-wider transition-all hover:bg-green-500 hover:text-black">
                  BUY
                </button>
                <button className="bg-transparent border-2 border-red-500 text-red-500 py-4 px-6 rounded font-bold text-sm tracking-wider transition-all hover:bg-red-500 hover:text-black">
                  SELL
                </button>
              </div>
            </div>
            
            {/* Divider */}
            <div className="border-t border-gray-700 my-6"></div>
            
            {/* DEPOSIT Section */}
            <div className="mb-6">
              {/* Light Switch Toggle */}
              <div className="mb-6">
                <div className="text-[11px] text-white tracking-[0.2em] mb-3 text-center font-bold">DEPOSIT</div>
                <div className="flex items-center justify-center">
                  <div className="relative w-36 h-8 bg-gray-700 rounded-full p-1">
                    <div 
                      className={`absolute top-1 w-16 h-6 bg-white rounded-full transition-transform duration-200 ease-in-out ${
                        depositDirection === 'BUY' ? 'translate-x-0' : 'translate-x-16'
                      }`}
                    ></div>
                    <button 
                      onClick={() => setDepositDirection('BUY')}
                      className={`absolute left-1 top-1 z-10 px-3 py-1 text-[10px] font-bold transition-colors duration-200 ${
                        depositDirection === 'BUY' ? 'text-black' : 'text-white'
                      }`}
                    >
                      BUY
                    </button>
                    <button 
                      onClick={() => setDepositDirection('SELL')}
                      className={`absolute right-1 top-1 z-10 px-2 py-1 text-[10px] font-bold transition-colors duration-200 ${
                        depositDirection === 'SELL' ? 'text-black' : 'text-white'
                      }`}
                    >
                      SELL
                    </button>
                  </div>
                </div>
              </div>
              
              {/* Collateral Sliders */}
              <div className="mb-6">
                {/* €BSR Slider */}
                <div className="mb-4">
                  <div className="flex justify-between text-[11px] text-white mb-2 font-bold">
                    <span>€BSR</span>
                    <span>{bsrCollateral}%</span>
                  </div>
                  <input
                    type="range"
                    min="10"
                    max="100"
                    value={bsrCollateral}
                    onChange={(e) => handleBsrChange(parseInt(e.target.value))}
                    className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                  />
                </div>
                
                {/* eEURO Slider */}
                <div className="mb-4">
                  <div className="flex justify-between text-[11px] text-white mb-2 font-bold">
                    <span>eEURO</span>
                    <span>{euroCollateral}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="90"
                    value={euroCollateral}
                    onChange={(e) => handleEuroChange(parseInt(e.target.value))}
                    className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                  />
                </div>
              </div>
            </div>
            
            {/* ESTIMATED MARGIN REQUIREMENT */}
            <div className="mt-auto">
              <div className="text-[10px] text-white tracking-[0.2em] mb-3 text-center font-bold">ESTIMATED MARGIN REQUIREMENT</div>
              <div className="bg-gray-900 p-4 rounded">
                <div className="text-center mb-3">
                  <div className="text-gray-400 text-xs mb-1">MARGIN ({depositDirection === 'BUY' ? 'TO BUY' : 'TO SELL'})</div>
                  <div className="text-yellow-400 text-xl font-mono font-bold">
                    {depositDirection === 'BUY' ? calculateMarginRequired().buyMargin : calculateMarginRequired().sellMargin}%
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <div className="text-gray-400 text-xs mb-1">€BSR REQUIRED</div>
                    <div className="text-green-400 text-lg font-mono">
                      {calculateMarginRequired().bsrRequired.toFixed(2)} €BSR
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-gray-400 text-xs mb-1">eEURO REQUIRED</div>
                    <div className="text-blue-400 text-lg font-mono">
                      €{calculateMarginRequired().euroRequired.toFixed(2)}
                    </div>
              </div>
            </div>
          </div>
          
          {/* BOX 2: MARKET PANEL */}
          <div className={`bg-black border ${borderColor} p-4 flex flex-col lg:col-span-2`} style={montserratStyle}>
            <h3 className="text-[12px] text-white font-bold tracking-[0.3em] mb-4">MARKET PANEL</h3>
            
            {/* PHYSICAL DIMENSION */}
            <div className="mb-6">
              <div className="text-[10px] text-white font-bold tracking-[0.2em] mb-3 border-b border-gray-700 pb-2">PHYSICAL DIMENSION</div>
              
              {/* Daily Anchor & BSTZ Corridor */}
              <div className="grid grid-cols-3 gap-4 mb-4">
                <div className="text-center">
                  <div className="text-[8px] text-gray-400 mb-1">DAILY ANCHOR</div>
                  <div className="text-green-400 text-lg font-mono">
                    {currentPrice.toFixed(2)}
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-[8px] text-gray-400 mb-1">BSTZ MAX</div>
                  <div className="text-green-400 text-lg font-mono">
                    {(currentPrice * 1.1).toFixed(2)}
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-[8px] text-gray-400 mb-1">BSTZ MIN</div>
                  <div className="text-green-400 text-lg font-mono">
                    {(currentPrice * 0.9).toFixed(2)}
                  </div>
                </div>
              </div>
              
              {/* System Stability */}
              <div className="text-center">
                <div className="text-[8px] text-gray-400 mb-1">SYSTEM STABILITY</div>
                <div className="text-blue-400 text-sm font-mono">
                  Smoothing Factor Active
                </div>
              </div>
            </div>
            
            {/* VIRTUAL DIMENSION */}
            <div className="mb-6">
              <div className="text-[10px] text-white font-bold tracking-[0.2em] mb-3 border-b border-gray-700 pb-2">VIRTUAL DIMENSION</div>
              
              {/* OVP DELTA Table */}
              <div className="mb-4">
                <div className="text-[8px] text-gray-400 mb-2 text-center">OVP DELTA</div>
                <div className="grid grid-cols-3 gap-2 text-[8px]">
                  <div className="text-gray-500 text-center">TIMEFRAME</div>
                  <div className="text-gray-500 text-center">LONG INCREASE</div>
                  <div className="text-gray-500 text-center">SHORT INCREASE</div>
                  
                  <div className="text-center">1h</div>
                  <div className="text-center text-green-400">+2.4%</div>
                  <div className="text-center text-gray-400">+1.2%</div>
                  
                  <div className="text-center">4h</div>
                  <div className="text-center text-green-400">+3.8%</div>
                  <div className="text-center text-gray-400">+2.1%</div>
                  
                  <div className="text-center">24h</div>
                  <div className="text-center text-gray-400">+5.2%</div>
                  <div className="text-center text-red-400">+6.8%</div>
                  
                  <div className="text-center">7d</div>
                  <div className="text-center text-green-400">+12.4%</div>
                  <div className="text-center text-gray-400">+8.7%</div>
                </div>
              </div>
              
              {/* BlackSlon Power Index */}
              <div className="text-center">
                <div className="text-[8px] text-gray-400 mb-1">BLACKSLON POWER INDEX</div>
                <div className="text-yellow-400 text-xl font-mono">
                  {(currentPrice * 1.05).toFixed(2)}
                </div>
                <div className="text-[7px] text-gray-500">BSTZ Range Active</div>
              </div>
            </div>
            
            {/* TradeChart Background */}
            <div className="relative h-32">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                  <XAxis 
                    dataKey="date" 
                    stroke="#666"
                    tick={{ fill: '#666', fontSize: 6 }}
                    angle={-45}
                    textAnchor="end"
                    height={30}
                  />
                  <YAxis 
                    stroke="#666"
                    tick={{ fill: '#666', fontSize: 6 }}
                    domain={['dataMin - 2', 'dataMax + 2']}
                  />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#000', border: '1px solid #333', borderRadius: '4px' }}
                    labelStyle={{ color: '#fff' }}
                    itemStyle={{ color: '#fff' }}
                  />
                  
                  {/* IPT_P_PL Price */}
                  <Line
                    type="monotone"
                    dataKey="anchor"
                    stroke="#10b981"
                    strokeWidth={1}
                    dot={false}
                    name="IPT_P_PL Price"
                  />
                  
                  {/* Raw Spot */}
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
                  <div className="w-3 h-0.5 bg-red-500 opacity-60"></div>
                  <span className="text-[8px] text-gray-400">Raw Spot</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-3 h-1 bg-green-500 opacity-20"></div>
                  <span className="text-[8px] text-gray-400">BSTZ max/min</span>
                </div>
              </div>
            </div>
            
            {/* Sentiment Widget */}
            <div className="mb-4">
              <div className="text-[9px] text-gray-600 tracking-[0.2em] mb-3">OPEN VIRTUAL POSITIONS</div>
              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="bg-gray-900 p-2">
                  <div className="text-[7px] text-gray-600 mb-1">1H</div>
                  <div className={`text-sm font-mono ${longPercentage > 50 ? 'text-green-400' : 'text-red-400'}`} style={monoStyle}>
                    {longPercentage}% / {shortPercentage}%
                  </div>
                </div>
                <div className="bg-gray-900 p-2">
                  <div className="text-[7px] text-gray-600 mb-1">4H</div>
                  <div className={`text-sm font-mono ${longPercentage > 50 ? 'text-green-400' : 'text-red-400'}`} style={monoStyle}>
                    {longPercentage}% / {shortPercentage}%
                  </div>
                </div>
                <div className="bg-gray-900 p-2">
                  <div className="text-[7px] text-gray-600 mb-1">24H</div>
                  <div className={`text-sm font-mono ${longPercentage > 50 ? 'text-green-400' : 'text-red-400'}`} style={monoStyle}>
                    {longPercentage}% / {shortPercentage}%
                  </div>
                </div>
              </div>
            </div>
            
            {/* Market Intel */}
            <div className="mt-auto">
              <div className="text-[9px] text-gray-600 tracking-[0.2em] mb-2">MARKET INTEL</div>
              <div className="text-xs text-gray-300 leading-relaxed">
                Coal Base market, high EUA exposure. Premium market
              </div>
            </div>
          </div>

          {/* BOX 3: PORTFOLIO */}
          <div className={`bg-black border ${borderColor} p-4 flex flex-col`}>
            <h3 className="text-[10px] text-gray-600 tracking-[0.3em] mb-4">PORTFOLIO</h3>
            
            {/* €BSR Price Ticker */}
            <div className="mb-6">
              <div className="text-[9px] text-gray-500 tracking-[0.2em] mb-2">€BSR PRICE</div>
              <div className="text-2xl font-mono text-green-400" style={monoStyle}>
                {bsrPrice.toFixed(3)} €BSR
              </div>
            </div>
            
            {/* User Stats */}
            <div className="mb-6">
              <div className="text-[9px] text-gray-600 tracking-[0.2em] mb-3">USER STATS</div>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-[8px] text-gray-500">OPEN POSITION</span>
                  <span className="text-sm font-mono text-white" style={monoStyle}>
                    {openPosition.toLocaleString()} vkWh
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[8px] text-gray-500">€BSR DEPOSIT</span>
                  <span className="text-sm font-mono text-green-400" style={monoStyle}>
                    {bsrDeposit.toLocaleString()} €BSR
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[8px] text-gray-500">eEURO DEPOSIT</span>
                  <span className="text-sm font-mono text-blue-400" style={monoStyle}>
                    {euroDeposit.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
            
            {/* Funds */}
            <div className="mt-auto">
              <div className="text-[9px] text-gray-600 tracking-[0.2em] mb-3">FUNDS</div>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-[8px] text-gray-500">AVAILABLE</span>
                  <span className="text-sm font-mono text-green-400" style={monoStyle}>
                    {(bsrDeposit + euroDeposit - lockedFunds).toLocaleString()} €BSR
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[8px] text-gray-500">LOCKED</span>
                  <span className="text-sm font-mono text-red-400" style={monoStyle}>
                    €{lockedFunds.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
