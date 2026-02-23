'use client'

import Link from 'next/link'
import { BSR_MARKETS } from './markets_config'
import { useState } from 'react'

const montserratStyle = {
  fontFamily: "'Montserrat', sans-serif",
}

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState<'Power' | 'Gas'>('Power')
  const filteredMarkets = BSR_MARKETS.filter(m => m.type === activeTab)

  return (
    <div className="min-h-screen bg-black text-white p-10 font-normal" style={montserratStyle}>
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400&display=swap');
      `}</style>

      {/* NAGŁÓWEK Z LOGO */}
      <header className="max-w-7xl mx-auto mb-16 flex flex-col items-center">
        <div className="mb-12">
          <img src="/BS_image.jpg" alt="BlackSlon Logo" className="w-32 h-32" />
        </div>

        <h1 className="text-3xl tracking-tighter mb-12 font-normal text-white" style={montserratStyle}>
          BlackSlon
        </h1>
        
        {/* PRZEŁĄCZNIK */}
        <div className="flex bg-[#0a0a0a] border border-gray-800 p-1 w-full max-w-2xl">
          <button 
            onClick={() => setActiveTab('Power')}
            className={`flex-1 py-3 text-[10px] tracking-[0.2em] transition-all font-normal ${activeTab === 'Power' ? 'bg-white text-black' : 'text-gray-500 hover:text-white'}`}
          >
            BlackSlon Power Indexes
          </button>
          <button 
            onClick={() => setActiveTab('Gas')}
            className={`flex-1 py-3 text-[10px] tracking-[0.2em] transition-all font-normal ${activeTab === 'Gas' ? 'bg-white text-black' : 'text-gray-500 hover:text-white'}`}
          >
            BlackSlon Gas Indexes
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredMarkets.map(m => (
            <MarketTile key={m.id} market={m} />
          ))}
        </div>
      </main>

      <footer className="max-w-7xl mx-auto py-12 border-t border-gray-900 text-center mt-20 opacity-20">
        <p className="text-[9px] uppercase tracking-[0.4em]">BlackSlon Reserve Protocol // 2026</p>
      </footer>
    </div>
  )
}

function MarketTile({ market }: { market: any }) {
  // Cena hurtowa MWh to 104.55. Dla 100kWh (IPT) dzielimy przez 10.
  const wholesalePrice = 104.55 
  const iptPrice = wholesalePrice / 10
  const mockChange = "+1.24%"

  return (
    <div className="bg-[#050505] border border-gray-900 p-8 hover:border-white/40 transition-all group relative">
      <div className="flex justify-between items-start mb-6">
        <code className="text-[9px] text-gray-600 font-mono tracking-tighter">{market.id}</code>
        <span className="text-green-500 text-[10px]">{mockChange}</span>
      </div>
      
      <div className="mb-10">
        <h3 className="text-[10px] font-normal text-gray-500 group-hover:text-white transition-colors uppercase tracking-widest mb-1">
          BlackSlon {market.type} Index
        </h3>
        <h4 className="text-white text-xl tracking-tighter font-normal">
          {market.name.split(' ')[1]}
        </h4>
      </div>

      {/* CENA W EUR/100kWh */}
      <div className="mb-8 p-6 bg-black border border-gray-900 text-center">
        <div className="text-[8px] text-gray-600 tracking-[0.3em] mb-2">Current Index Price</div>
        <div className="text-2xl font-normal text-white font-mono tracking-tighter">
          {iptPrice.toFixed(2)} <span className="text-[10px] text-gray-500 ml-1">EUR/100kWh</span>
        </div>
      </div>

      {/* POZYCJE */}
      <div className="grid grid-cols-2 gap-2 mb-10 text-center">
        <div className="border border-gray-900 py-4">
            <div className="text-[7px] text-gray-600 mb-1 tracking-widest font-normal">Open Long</div>
            <div className="text-[10px] text-green-500 font-normal">1.2M</div>
        </div>
        <div className="border border-gray-900 py-4">
            <div className="text-[7px] text-gray-600 mb-1 tracking-widest font-normal">Open Short</div>
            <div className="text-[10px] text-red-500 font-normal">0.8M</div>
        </div>
      </div>

      <Link href={`/trading/${market.id}`}>
        <button className="w-full py-4 bg-white text-black text-[10px] hover:bg-gray-200 transition-all uppercase tracking-[0.3em] font-normal">
          Open Index
        </button>
      </Link>
    </div>
  )
}