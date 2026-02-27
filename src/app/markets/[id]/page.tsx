'use client'

import MarketPanel from "@/components/MarketPanel"
import TradingPanel from "@/components/TradingPanel"
import PortfolioPanel from "@/components/PortfolioPanel"

export default function MarketPage({ params }: { params: { id: string } }) {
  return (
    <main className="min-h-screen bg-[#050505] text-white overflow-x-hidden flex flex-col items-center">
      {/* LOGO HEADER */}
      <header className="w-full py-6 flex justify-center">
        <img src="/BS_image.jpg" alt="BlackSlon Logo" className="h-12 w-auto" />
      </header>

      {/* KONTENER GŁÓWNY - Skorygowany grid i odstępy */}
      <div className="w-full max-w-[1600px] mx-auto px-8 grid grid-cols-[60%_20%_20%] gap-4 h-[calc(100vh-100px)] mb-4">
        
        {/* KOLUMNA 1: MARKET */}
        <section className="border border-yellow-600/30 bg-black/40 rounded-sm overflow-hidden flex flex-col min-h-0">
          <MarketPanel currentPrice={10.59} borderColor="border-transparent" montserratStyle={{}} />
        </section>

        {/* KOLUMNA 2: TRADING - Twoje serce operacyjne */}
        <section className="border border-yellow-600/50 bg-black/60 rounded-sm overflow-hidden flex flex-col min-h-0">
          <TradingPanel />
        </section>

        {/* KOLUMNA 3: ACCOUNT */}
        <section className="border border-yellow-600/30 bg-black/40 rounded-sm overflow-hidden flex flex-col min-h-0">
          <PortfolioPanel />
        </section>

      </div>
    </main>
  )
}