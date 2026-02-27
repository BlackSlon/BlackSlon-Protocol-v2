'use client'


import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import MarketPanel from '@/components/MarketPanel'
import TradingPanel from '@/components/TradingPanel'
import AccountPanel from '@/components/PortfolioPanel'
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
    <div className="min-h-screen bg-[#050505] text-white p-4" style={montserratStyle}>
      <header className="max-w-[1200px] mx-auto mb-10 mt-6 px-4">
        <div className="flex flex-col">
          <h1 className="text-3xl font-light tracking-[0.15em] text-white">BlackSlon Power Index</h1>
          <h2 className="text-gray-500 text-sm tracking-widest mt-1">Poland</h2>
        </div>
      </header>


      <main className="max-w-[1200px] mx-auto pb-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch min-h-[700px]">
          <div className={`flex flex-col h-full bg-[#0a0a0a] border ${borderColor} rounded-xl shadow-2xl overflow-hidden`}>
            <MarketPanel currentPrice={currentPrice} borderColor={borderColor} montserratStyle={montserratStyle} />
          </div>
          <div className={`flex flex-col h-full bg-[#0a0a0a] border ${borderColor} rounded-xl shadow-2xl overflow-hidden`}>
            <TradingPanel currentPrice={currentPrice} borderColor={borderColor} montserratStyle={montserratStyle} />
          </div>
          <div className={`flex flex-col h-full bg-[#0a0a0a] border ${borderColor} rounded-xl shadow-2xl overflow-hidden`}>
            <AccountPanel borderColor={borderColor} montserratStyle={montserratStyle} />
          </div>
        </div>
      </main>
    </div>
  )
}

