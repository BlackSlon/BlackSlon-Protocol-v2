'use client'

import PhysicalDimension from "@/components/PhysicalDimension"
import VirtualDimension from "@/components/VirtualDimension"
import TradingPanel from "@/components/TradingPanel"
import PortfolioPanel from "@/components/PortfolioPanel"

export default function MarketPage({ params }: { params: { id: string } }) {
  return (
    <main className="min-h-screen bg-[#050505] text-white overflow-hidden flex flex-col items-center">
      <header className="w-full py-6 flex justify-center shrink-0">
        <img src="/BS_image.jpg" alt="BlackSlon Logo" className="h-12 w-auto" />
      </header>

      {/* Grid: 22% / 34% / 20% / 20% - 4 separate panels */}
      <div className="w-full max-w-[1600px] mx-auto px-10 grid grid-cols-[22%_34%_20%_20%] gap-6 h-[calc(100vh-100px)] mb-4">
        
        {/* PANEL 1: PHYSICAL MARKET DIMENSION (22%) */}
        <section className="border border-yellow-600/50 bg-black/40 rounded-sm overflow-hidden flex flex-col min-h-0">
          <PhysicalDimension marketId={params.id} currentPrice={10.59} />
        </section>

        {/* PANEL 2: VIRTUAL MARKET DIMENSION (34%) */}
        <section className="border border-yellow-600/50 bg-black/40 rounded-sm overflow-hidden flex flex-col min-h-0">
          <VirtualDimension marketId={params.id} />
        </section>

        {/* PANEL 3: TRADING TERMINAL (20%) */}
        <section className="border border-yellow-600/50 bg-black/80 rounded-sm overflow-hidden flex flex-col min-h-0">
          <TradingPanel />
        </section>

        {/* PANEL 4: USER'S ACCOUNT (20%) */}
        <section className="border border-yellow-600/30 bg-black/40 rounded-sm overflow-hidden flex flex-col min-h-0">
          <PortfolioPanel />
        </section>

      </div>
    </main>
  )
}