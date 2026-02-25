'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import MarketPanel from '@/components/MarketPanel' 
import TradingPanel from '@/components/TradingPanel' 
import AccountPanel from '@/components/PortfolioPanel' 
import BlackSlonMatrix from '@/components/BlackSlonMatrix'
import { BSR_MARKETS } from '@/app/markets_config'

export default function MarketPage() {
  const params = useParams()
  const marketId = params.id as string
  const [currentPrice, setCurrentPrice] = useState<number>(10.09)

  const market = BSR_MARKETS.find(m => m.id === marketId)

  useEffect(() => {
    const fetchMarketData = async () => {
      try {
        const response = await fetch('/api/market-data?t=' + new Date().getTime())
        const data = await response.json()
        const marketInfo = data.find((item: any) => item.id === marketId)
        if (marketInfo) {
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

  if (!market) return <div className="text-white p-10 text-center uppercase tracking-widest">Market not found</div>

  const borderColor = "border-yellow-500/50" 
  const montserratStyle = { fontFamily: 'Montserrat, sans-serif' }

  return (
    <div className="min-h-screen bg-[#050505] text-white" style={montserratStyle}>
      {/* TOP SECTION - LIQUIDITY MATRIX */}
      <div className="w-full">
        <div className="text-center mb-4">
          <h1 className="text-[10px] tracking-[0.3em] text-red-600 uppercase font-bold">VIRTUAL DIMENSION: LIQUIDITY MATRIX</h1>
        </div>
        <BlackSlonMatrix />
      </div>

      {/* BOTTOM SECTION - OPERATIONAL PANELS */}
      <div className="max-w-[1200px] mx-auto pb-10 mt-8 px-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch min-h-[700px]">
          {/* COLUMN 1 - MARKET PANEL */}
          <div className={`flex flex-col h-full bg-[#0a0a0a] border ${borderColor} rounded-xl shadow-2xl overflow-hidden`}>
            <MarketPanel currentPrice={currentPrice} borderColor={borderColor} montserratStyle={montserratStyle} />
          </div>
          
          {/* COLUMN 2 - TRADING PANEL */}
          <div className={`flex flex-col h-full bg-[#0a0a0a] border ${borderColor} rounded-xl shadow-2xl overflow-hidden`}>
            <TradingPanel currentPrice={currentPrice} borderColor={borderColor} montserratStyle={montserratStyle} />
          </div>
          
          {/* COLUMN 3 - ACCOUNT PANEL */}
          <div className={`flex flex-col h-full bg-[#0a0a0a] border ${borderColor} rounded-xl shadow-2xl overflow-hidden`}>
            <AccountPanel borderColor={borderColor} montserratStyle={montserratStyle} />
          </div>
        </div>
      </div>
    </div>
  )
}