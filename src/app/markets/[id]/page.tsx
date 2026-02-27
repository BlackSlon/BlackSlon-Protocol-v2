'use client'

import MarketPanel from "@/components/MarketPanel"
import TradingPanel from "@/components/TradingPanel"
import PortfolioPanel from "@/components/PortfolioPanel"

export default function MarketPage({ params }: { params: { id: string } }) {
  return (
    <main className="min-h-screen bg-[#050505] text-white p-2 overflow-hidden">
      {/* UKŁAD 3 PANELI: 35% | 50% | 15% */}
      <div className="grid grid-cols-[35%_50%_15%] gap-2 h-[calc(100vh-16px)]">
        
        {/* LEWO: MARKET PANEL */}
        <section className="border border-gray-900 bg-black/40 rounded-sm overflow-y-auto scrollbar-hide">
          <MarketPanel currentPrice={10.59} borderColor="border-gray-900" montserratStyle={{}} />
        </section>

        {/* ŚRODEK: TRADING & ORDER BOOK (Serce operacji) */}
        <section className="border border-yellow-600/10 bg-black/40 rounded-sm overflow-y-auto scrollbar-hide">
          <TradingPanel />
        </section>

        {/* PRAWO: USER ACCOUNTS */}
        <section className="border border-gray-900 bg-black/40 rounded-sm overflow-y-auto scrollbar-hide">
          <PortfolioPanel />
        </section>

      </div>
    </main>
  )
}