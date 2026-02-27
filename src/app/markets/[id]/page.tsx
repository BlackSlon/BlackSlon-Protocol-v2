'use client'

import MarketPanel from "@/components/MarketPanel"
import TradingPanel from "@/components/TradingPanel"
import PortfolioPanel from "@/components/PortfolioPanel"

export default function MarketPage({ params }: { params: { id: string } }) {
  return (
    <main className="min-h-screen bg-[#050505] text-white overflow-hidden flex flex-col items-center">
      {/* LOGO HEADER */}
      <header className="w-full py-8 flex justify-center">
        <img src="/BS_image.jpg" alt="BlackSlon Logo" className="h-16 w-auto" />
      </header>

      {/* KONTENER Z WIĘKSZYM ODSTEPEM I MARGINESAMI */}
      <div className="w-full max-w-[1400px] px-20 grid grid-cols-[50%_30%_20%] gap-8 h-[calc(100vh-120px)]">
        
        {/* KOLUMNA 1: MARKET (50%) */}
        <section className="border border-yellow-600/40 bg-black/40 rounded-sm overflow-hidden">
          <MarketPanel currentPrice={10.59} borderColor="border-transparent" montserratStyle={{}} />
        </section>

        {/* KOLUMNA 2: TRADING (30%) - MOCNIEJSZA RAMKA */}
        <section className="border border-yellow-600/60 bg-black/80 rounded-sm overflow-hidden">
          <TradingPanel />
        </section>

        {/* KOLUMNA 3: ACCOUNT (20%) */}
        <section className="border border-yellow-600/40 bg-black/40 rounded-sm overflow-hidden">
          <PortfolioPanel />
        </section>

      </div>
    </main>
  )
}