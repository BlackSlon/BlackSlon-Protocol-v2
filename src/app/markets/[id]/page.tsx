'use client'

import MarketPanel from "@/components/MarketPanel"
import TradingPanel from "@/components/TradingPanel"
import PortfolioPanel from "@/components/PortfolioPanel"

export default function MarketPage({ params }: { params: { id: string } }) {
  return (
    <main className="min-h-screen bg-[#050505] text-white overflow-hidden flex flex-col items-center py-6 px-12">
      {/* KONTENER Z MARGINESAMI BOCZNYMI - NIE NA 100% SZEROKOŚCI */}
      <div className="w-full max-w-[1600px] grid grid-cols-[50%_30%_20%] gap-6 h-[calc(100vh-60px)]">
        
        {/* PANEL LEWY (50%): MARKET */}
        <section className="border border-yellow-600/40 bg-black/60 rounded-lg overflow-y-auto scrollbar-hide shadow-[0_0_20px_rgba(202,138,4,0.05)]">
          <MarketPanel currentPrice={10.59} borderColor="border-transparent" montserratStyle={{}} />
        </section>

        {/* PANEL ŚRODKOWY (30%): TRADING (ŻÓŁTA RAMKA) */}
        <section className="border border-yellow-600/60 bg-black/80 rounded-lg overflow-y-auto scrollbar-hide shadow-[0_0_30px_rgba(202,138,4,0.15)]">
          <TradingPanel />
        </section>

        {/* PANEL PRAWY (20%): ACCOUNT */}
        <section className="border border-yellow-600/40 bg-black/60 rounded-lg overflow-y-auto scrollbar-hide">
          <PortfolioPanel />
        </section>

      </div>
    </main>
  )
}