'use client'

import Link from 'next/link'
import { BSR_MARKETS } from './markets_config'

export default function Dashboard() {
  // Rozdzielamy rynki na dwie sekcje dla przejrzystości
  const powerMarkets = BSR_MARKETS.filter(m => m.type === 'Power')
  const gasMarkets = BSR_MARKETS.filter(m => m.type === 'Gas')

  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-blue-500/30">
      
      {/* 1. HEADER PROWADZĄCY */}
      <header className="max-w-7xl mx-auto px-8 pt-16 pb-12 flex justify-between items-end border-b border-gray-900">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="h-3 w-3 bg-blue-600 rounded-full animate-pulse shadow-[0_0_10px_#2563eb]"></div>
            <span className="text-[10px] font-mono text-blue-500 tracking-[0.3em] uppercase">
              Autonomous Settlement Engine Active
            </span>
          </div>
          <h1 className="text-6xl font-black tracking-tighter italic">
            BLACK<span className="text-blue-600">SLON</span>
          </h1>
          <p className="text-gray-500 font-mono text-xs mt-3 tracking-widest uppercase">
            Trading Zone // €BSR Mainnet // Index Participation Tokens (IPT)
          </p>
        </div>
        
        <div className="hidden md:block text-right font-mono text-[10px] text-gray-600 leading-relaxed">
          NETWORK STATUS: <span className="text-green-500">OPTIMAL</span><br/>
          SETTLEMENT CURRENCY: <span className="text-white">€BSR</span><br/>
          ACTIVE NODES: 8 REGIONAL HUBS
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-8 py-16 space-y-20">
        
        {/* 2. SEKCJA ELECTRONS (POWER) */}
        <section>
          <div className="flex items-center gap-4 mb-8">
            <h2 className="text-white text-xs font-bold tracking-[0.4em] uppercase whitespace-nowrap">
              Energy Electrons // Power IPTs
            </h2>
            <div className="h-[1px] w-full bg-gradient-to-r from-gray-800 to-transparent"></div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {powerMarkets.map(m => (
              <MarketCard key={m.id} market={m} />
            ))}
          </div>
        </section>

        {/* 3. SEKCJA MOLECULES (GAS) */}
        <section>
          <div className="flex items-center gap-4 mb-8">
            <h2 className="text-white text-xs font-bold tracking-[0.4em] uppercase whitespace-nowrap">
              Energy Molecules // Gas IPTs
            </h2>
            <div className="h-[1px] w-full bg-gradient-to-r from-gray-800 to-transparent"></div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {gasMarkets.map(m => (
              <MarketCard key={m.id} market={m} />
            ))}
          </div>
        </section>

      </div>

      {/* FOOTER */}
      <footer className="max-w-7xl mx-auto px-8 py-12 border-t border-gray-900 text-center">
        <p className="text-[10px] text-gray-700 font-mono tracking-widest uppercase">
          BlackSlon Reserve (BSR) Protocol © 2026 // Zero-Spread Liquidity Architecture
        </p>
      </footer>
    </div>
  )
}

// Komponent Karty Rynku (Lokalny)
function MarketCard({ market }: { market: any }) {
  return (
    <div className="group bg-[#050505] border border-gray-900 p-6 rounded-none transition-all duration-300 hover:border-blue-600 hover:bg-[#080808]">
      <div className="flex justify-between items-start mb-10">
        <code className="text-[10px] text-gray-600 font-mono tracking-tighter group-hover:text-blue-500 transition-colors">
          {market.id}
        </code>
        <div className="flex flex-col items-end">
          <span className="text-[8px] text-gray-700 uppercase font-bold tracking-tighter mb-1">Viscosity</span>
          <span className="text-[10px] text-gray-400 font-mono">{market.b_base}</span>
        </div>
      </div>