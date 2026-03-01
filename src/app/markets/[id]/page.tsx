'use client'

import React from "react"
import PhysicalDimension from "@/components/PhysicalDimension"
import VirtualDimension from "@/components/VirtualDimension"
import TradingPanel from "@/components/TradingPanel"
import PortfolioPanel from "@/components/PortfolioPanel"
import { useParams } from 'next/navigation'
import Image from 'next/image'

export default function MarketPage() {
  const params = useParams()
  const id = params.id as string

  // Ujednolicamy cenę dla całego widoku rynku
  const globalAnchorPrice = 10.59;

  return (
    <main className="min-h-screen bg-black text-white flex flex-col items-center font-mono">
      <header className="w-full py-4 flex justify-center border-b border-gray-900 shrink-0">
        <Image src="/BS_image.jpg" alt="BlackSlon" width={40} height={40} className="h-10 w-auto" />
      </header>

      <div className="w-full max-w-[1600px] mx-auto px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-[22%_34%_20%_20%] gap-4 min-h-[calc(100vh-100px)] py-4 pointer-events-auto">
        
        {/* PANEL 1: PHYSICAL (BSTZ) - Teraz z poprawną ceną 10.59 */}
        <section className="border border-yellow-600/50 bg-black/40 rounded-sm overflow-hidden">
          <PhysicalDimension marketId={id} currentPrice={globalAnchorPrice} />
        </section>

        {/* PANEL 2: VIRTUAL (Order Book) */}
        <section className="border border-yellow-600/50 bg-black/40 rounded-sm overflow-hidden">
          <VirtualDimension marketId={id} />
        </section>

        {/* PANEL 3: TRADING */}
        <section className="border border-yellow-600/50 bg-black/80 rounded-sm text-xs pointer-events-auto relative z-20">
          <TradingPanel />
        </section>

        {/* PANEL 4: PORTFOLIO */}
        <section className="border border-yellow-600/30 bg-black/40 rounded-sm overflow-hidden text-xs">
          <PortfolioPanel />
        </section>

      </div>
    </main>
  )
}