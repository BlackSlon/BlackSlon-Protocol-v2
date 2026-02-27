'use client'

import MarketPanel from "@/components/MarketPanel"
import TradingPanel from "@/components/TradingPanel"
import PortfolioPanel from "@/components/PortfolioPanel"

export default function MarketPage({ params }: { params: { id: string } }) {
  return (
    <main className="min-h-screen bg-[#050505] text-white overflow-hidden flex flex-col items-center py-8">
      {/* KONTENER Z DUŻYM ODSTEPEM OD KRAWĘDZI EKRANU */}
      <div className="w-full max-w-[1550px] px-10 grid grid-cols-[50%_30%_20%] gap-6 h-[calc(100vh-80px)]">
        
        {/* KOLUMNA 1: MARKET (50%) */}
        <section className="border border-yellow-600/30 bg-black/40 rounded-sm overflow-y-auto scrollbar-hide shadow-[0_0_20px_rgba(0,0,0,0.5)]">
          <MarketPanel currentPrice={10.59} borderColor="border-transparent" montserratStyle={{}} />
        </section>

        {/* KOLUMNA 2: TRADING (30%) - MOCNIEJSZA RAMKA */}
        <section className="border border-yellow-600/60 bg-black/80 rounded-sm overflow-y-auto scrollbar-hide shadow-[0_0_30px_rgba(202,138,4,0.1)]">
          <TradingPanel />
        </section>

        {/* KOLUMNA 3: ACCOUNT (20%) */}
        <section className="border border-yellow-600/30 bg-black/40 rounded-sm overflow-y-auto scrollbar-hide">
          <PortfolioPanel />
        </section>

      </div>
    </main>
  )
}