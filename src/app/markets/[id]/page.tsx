'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
// Zmieniamy nazwy importów, żeby pasowały do nowej logiki
import MarketPanel from '@/components/MarketPanel' 
import TradingPanel from '@/components/OrderPanel' // wcześniej OrderPanel
import AccountPanel from '@/components/PortfolioPanel' // wcześniej PortfolioPanel
import { BSR_MARKETS } from '@/app/markets_config'

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

  if (!market) return <div className="text-white p-10">Market not found</div>

  // Wymuszamy żółty kolor dla energii, niebieski dla innych, ale Ty chciałeś żółte ramki dla wszystkich
  const borderColor = "border-yellow-500/50" 
  const montserratStyle = { fontFamily: 'Montserrat, sans-serif' }

  return (
    <div className="min-h-screen bg-[#050505] text-white p-4" style={montserratStyle}>
      {/* HEADER - Czysty i profesjonalny */}
      <header className="max-w-[1600px] mx-auto mb-8 px-6">
        <div className="flex flex-col">
          <h1 className="text-3xl font-light tracking-[0.2em] uppercase">
            BlackSlon <span className="text-yellow-500 font-bold">{market.type}</span> Index
          </h1>
          <div className="flex items-center gap-4 mt-2">
            <span className="text-red-500 font-bold tracking-widest text-sm">INSTRUMENT: {market.id}</span>
            <span className="text-gray-600">|</span>
            <span className="text-gray-400 text-sm uppercase">{market.name}</span>
          </div>
        </div>
      </header>

      {/* TERMINAL GRID - TRZY RÓWNE FILARY */}
      <main className="max-w-[1600px] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch min-h-[750px]">
          
          {/* BOX 1: MARKET PANEL (Analiza BSTZ) */}
          <div className={`flex flex-col h-full bg-[#0a0a0a] border ${borderColor} rounded-xl overflow-hidden shadow-2xl`}>
            <MarketPanel 
              currentPrice={currentPrice}
              borderColor={borderColor}
              montserratStyle={montserratStyle}
            />
          </div>

          {/* BOX 2: TRADING PANEL (Serce operacyjne) */}
          <div className={`flex flex-col h-full bg-[#0a0a0a] border ${borderColor} rounded-xl overflow-hidden shadow-2xl scale-[1.02] z-10`}>
            <TradingPanel 
              currentPrice={currentPrice}
              borderColor={borderColor}
              montserratStyle={montserratStyle}
            />
          </div>

          {/* BOX 3: ACCOUNT PANEL (Kapitał i Ryzyko) */}
          <div className={`flex flex-col h-full bg-[#0a0a0a] border ${borderColor} rounded-xl overflow-hidden shadow-2xl`}>
            <AccountPanel 
              borderColor={borderColor}
              montserratStyle={montserratStyle}
            />
          </div>

        </div>
      </main>
    </div>
  )
}