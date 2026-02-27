'use client'

import MarketPanel from "@/components/MarketPanel"
import TradingPanel from "@/components/TradingPanel"
import PortfolioPanel from "@/components/PortfolioPanel"

export default function MarketPage({ params }: { params: { id: string } }) {
  return (
    <main className="min-h-screen bg-[#050505] text-white overflow-hidden flex flex-col items-center">
      <header className="w-full py-8 flex justify-center">
        <img src="/BS_image.jpg" alt="BlackSlon Logo" className="h-16 w-auto" />
      </header>

      {/* ZMIANA: grid-cols-[60%_20%_20%] zamiast 50/30/20 */}
      <div className="w-full max-w-[1600px] mx-auto px-12 grid grid-cols-[60%_20%_20%] gap-6 h-[calc(100vh-120px)]">
        
        {/* KOLUMNA 1: MARKET - powiększona do 60% */}
        <section className="border border-yellow-600/40 bg-black/40 rounded-sm overflow-hidden">
          <MarketPanel currentPrice={10.59} borderColor="border-transparent" montserratStyle={{}} />
        </section>

        {/* KOLUMNA 2: TRADING - zwężona do 20% */}
        <section className="border border-yellow-600/60 bg-black/80 rounded-sm overflow-hidden h-full">
          <TradingPanel />
        </section>

        {/* KOLUMNA 3: ACCOUNT - 20% */}
        <section className="border border-yellow-600/40 bg-black/40 rounded-sm overflow-hidden">
          <PortfolioPanel />
        </section>

      </div>
    </main>
  )
}