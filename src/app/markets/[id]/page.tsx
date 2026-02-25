'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import OrderPanel from '@/components/OrderPanel'
import MarketPanel from '@/components/MarketPanel'
import PortfolioPanel from '@/components/PortfolioPanel'
import { BSR_MARKETS } from '@/app/markets_config'
import { MARKET_HISTORY } from '@/lib/market_history'

export default function MarketPage() {
  const params = useParams()
  const marketId = params.id as string
  const [marketData, setMarketData] = useState<any>(null)
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
          const newPrice = parseFloat(marketInfo.currentBSEI)
          setCurrentPrice(newPrice)
        }
      } catch (error) {
        console.error('Failed to fetch market data:', error)
      }
    }

    fetchMarketData()
    const interval = setInterval(fetchMarketData, 5000)

    return () => clearInterval(interval)
  }, [marketId])

  if (!market) {
    return (
      <div className="min-h-screen bg-black text-white p-10">
        <div className="text-center">
          <h1 className="text-2xl mb-4">Market not found</h1>
          <p className="text-gray-400">The market {marketId} does not exist.</p>
        </div>
      </div>
    )
  }

  const borderColor = market.type === 'Power' ? 'border-yellow-500' : 'border-blue-400'
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

      {/* TRADING TERMINAL GRID - TRZY FILARY */}
      <main>
        <div className="flex flex-row gap-6 p-6 min-h-[800px] w-full bg-black">
          
          {/* BOX 1: ORDER PANEL - Instrument, cena, panel transakcyjny */}
          <div className="flex-1 min-w-[350px] flex flex-col">
            <OrderPanel 
              currentPrice={currentPrice}
              borderColor={borderColor}
              montserratStyle={montserratStyle}
            />
          </div>

          {/* BOX 2: MARKET PANEL / SYNTHESIS - Oddzielny komponent */}
          <div className="flex-1 min-w-[350px] flex flex-col">
            <MarketPanel 
              currentPrice={currentPrice}
              borderColor={borderColor}
              montserratStyle={montserratStyle}
            />
          </div>

          {/* BOX 3: PORTFOLIO - Prawa kolumna z danymi o środkach */}
          <div className="flex-1 min-w-[350px] flex flex-col">
            <PortfolioPanel 
              borderColor={borderColor}
              montserratStyle={montserratStyle}
            />
          </div>

        </div>
      </main>
    </div>
  )
}