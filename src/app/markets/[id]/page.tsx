'use client'

import MarketPanel from "@/components/MarketPanel"
import TradingPanel from "@/components/TradingPanel"
import PortfolioPanel from "@/components/PortfolioPanel"

export default function MarketPage({ params }: { params: { id: string } }) {
  return (
    <main className="min-h-screen bg-[#050505] text-white p-3 overflow-hidden">
      {/* GRID: 50% | 30% | 20% */}
      <div className="grid grid-cols-[50%_30%_20%] gap-4 h-[calc(100vh-24px)]">
        
        {/* MARKET PANEL (50%) */}
        <section className="border border-yellow-600/30 bg-black/40 rounded-lg overflow-y-auto scrollbar-hide shadow-[0_0_15px_rgba(202,138,4,0.05)]">
          <MarketPanel currentPrice={10.59} borderColor="border-transparent" montserratStyle={{}} />
        </section>

        {/* TRADING PANEL (30%) */}
        <section className="border border-yellow-600/50 bg-black/60 rounded-lg overflow-y-auto scrollbar-hide shadow-[0_0_20px_rgba(202,138,4,0.1)]">
          <TradingPanel />
        </section>

        {/* ACCOUNT PANEL (20%) */}
        <section className="border border-yellow-600/30 bg-black/40 rounded-lg overflow-y-auto scrollbar-hide shadow-[0_0_15px_rgba(202,138,4,0.05)]">
          <PortfolioPanel />
        </section>

      </div>
    </main>
  )
}