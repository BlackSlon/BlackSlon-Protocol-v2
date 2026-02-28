'use client'

import React, { use } from "react"
// Importujemy Twoje komponenty - upewnij się, że nazwy plików w /components są identyczne!
import PhysicalDimension from "@/components/PhysicalDimension"
import VirtualDimension from "@/components/VirtualDimension"
import TradingPanel from "@/components/TradingPanel"
import PortfolioPanel from "@/components/PortfolioPanel"

export default function MarketPage({ params }: { params: Promise<{ id: string }> }) {
  // To jest "magiczna" linia, która odblokowuje nawigację w Next.js 15
  const { id } = use(params);

  return (
    <main className="min-h-screen bg-black text-white flex flex-col items-center font-mono overflow-hidden">
      {/* NAGŁÓWEK */}
      <header className="w-full py-4 flex justify-center border-b border-gray-900 shrink-0">
        <img src="/BS_image.jpg" alt="BlackSlon" className="h-10 w-auto" />
      </header>

      {/* TWOJA STRONA RYNKU - 4 PANELE */}
      <div className="w-full max-w-[1600px] mx-auto px-6 grid grid-cols-[22%_34%_20%_20%] gap-4 h-[calc(100vh-100px)] py-4">
        
        {/* PANEL 1: BSTZ (Physical) */}
        <section className="border border-yellow-600/50 bg-black/40 rounded-sm overflow-hidden">
          <PhysicalDimension marketId={id} currentPrice={14.46} />
        </section>

        {/* PANEL 2: TWÓJ ORDER BOOK (Virtual) */}
        <section className="border border-yellow-600/50 bg-black/40 rounded-sm overflow-hidden">
          <VirtualDimension marketId={id} />
        </section>

        {/* PANEL 3: TRADING */}
        <section className="border border-yellow-600/50 bg-black/80 rounded-sm overflow-hidden">
          <TradingPanel />
        </section>

        {/* PANEL 4: PORTFOLIO */}
        <section className="border border-yellow-600/30 bg-black/40 rounded-sm overflow-hidden">
          <PortfolioPanel />
        </section>

      </div>
    </main>
  )
}