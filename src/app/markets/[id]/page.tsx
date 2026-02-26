'use client'

import MarketPanel from "@/components/MarketPanel"
import BlackSlonMatrix from "@/components/BlackSlonMatrix"
import TradingPanel from "@/components/TradingPanel"
import PortfolioPanel from "@/components/PortfolioPanel"

export default function MarketPage({ params }: { params: { id: string } }) {
  const montserratStyle = { fontFamily: 'var(--font-montserrat), sans-serif' }
  const currentPrice = 10.59 // To docelowo będzie szło z Twojego API/Store'a

  return (
    <main className="min-h-screen bg-[#050505] text-white overflow-hidden p-2">
      {/* 4-Column Grid Terminal */}
      <div className="grid grid-cols-[35%_35%_15%_15%] gap-2 h-[calc(100vh-16px)]">
        
        {/* COL 1: MARKET DATA (35%) */}
        <section className="bg-black/40 border border-gray-900 rounded-sm overflow-y-auto scrollbar-hide">
          <MarketPanel 
            currentPrice={currentPrice} 
            borderColor="border-gray-900" 
            montserratStyle={montserratStyle} 
          />
        </section>

        {/* COL 2: ORDERBOOK / MATRIX (35%) */}
        <section className="bg-black/40 border border-gray-900 rounded-sm overflow-y-auto scrollbar-hide p-4">
          <div className="text-center mb-2 border-b border-gray-900 pb-1">
            <span className="text-[9px] tracking-[0.3em] text-gray-400 uppercase font-bold">Orderbook & Liquidity</span>
          </div>
          <BlackSlonMatrix />
        </section>

        {/* COL 3: TRADING ZONE (15%) */}
        <section className="bg-black/40 border border-gray-900 rounded-sm p-4">
          <TradingPanel />
        </section>

        {/* COL 4: USER ACCOUNTS (15%) */}
        <section className="bg-black/40 border border-gray-900 rounded-sm p-4">
          <PortfolioPanel />
        </section>

      </div>
    </main>
  )
}