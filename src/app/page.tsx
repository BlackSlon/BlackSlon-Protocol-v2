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
    <div className="min-h-screen bg-black text-white p-10" style={montserratStyle}>
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;700&display=swap');
      `}</style>

      {/* NAGŁÓWEK */}
      <header className="max-w-7xl mx-auto mb-16 border-b border-gray-900 pb-10 flex justify-between items-center">
        <div className="flex items-center justify-center w-full">
          <img src="/BS_image.jpg" alt="BlackSlon Logo" className="w-20 h-20" />
        </div>
        
        {/* PRZEŁĄCZNIK */}
        <div className="flex bg-[#0a0a0a] border border-gray-800 p-1">
          <button 
            onClick={() => setActiveTab('Power')}
            className={`px-8 py-2 text-[10px] uppercase tracking-[0.2em] transition-all ${activeTab === 'Power' ? 'bg-white text-black font-bold' : 'text-gray-500 hover:text-white'}`}
          >
            BlackSlon Power indexes
          </button>
          <button 
            onClick={() => setActiveTab('Gas')}
            className={`px-8 py-2 text-[10px] uppercase tracking-[0.2em] transition-all ${activeTab === 'Gas' ? 'bg-white text-black font-bold' : 'text-gray-500 hover:text-white'}`}
          >
            BlackSlon Gas indexes
          </button>
        </div>
      </header>

      {/* GŁÓWNA TREŚĆ */}
      <main className="max-w-7xl mx-auto">
        <div className="flex items-center gap-4 mb-12">
           <h2 className="text-white/40 text-[10px] font-bold tracking-[0.5em] uppercase">
             {activeTab === 'Power' ? 'BlackSlon Power indexes' : 'BlackSlon Gas indexes'}
           </h2>
           <div className="h-[1px] flex-1 bg-gradient-to-r from-white/10 to-transparent"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredMarkets.map(m => (
            <MarketTile key={m.id} market={m} />
          ))}
        </div>
      </main>

      <footer className="max-w-7xl mx-auto py-12 border-t border-gray-900 text-center mt-20 opacity-20">
        <p className="text-[9px] uppercase tracking-[0.4em] text-white">BlackSlon Reserve (BSR) Protocol // 2026</p>
      </footer>
    </div>
  )
}

function MarketTile({ market }: { market: any }) {
  const mockPrice = 104.55 
  const mockChange = "+1.24%"
  const mockLong = "1.2M"
  const mockShort = "0.8M"

  const borderColor = market.type === 'Power' ? 'border-yellow-500' : 'border-blue-500'

  return (
    <div className={`bg-[#050505] border ${borderColor} p-8 hover:bg-[#0a0a0a] transition-all group relative`}>
      <div className="flex justify-between items-start mb-6">
        <code className="text-[9px] text-gray-600 font-mono tracking-tighter">{market.id}</code>
        <span className="text-green-500 text-[9px] font-bold uppercase">{mockChange}</span>
      </div>
      
      <div className="mb-8">
        <h3 className="text-sm font-normal text-gray-400 group-hover:text-white transition-colors uppercase leading-tight">
          BlackSlon {market.type} Index <br/>
          <span className="text-white font-bold text-base tracking-tighter">{market.name.split(' ')[1]}</span>
        </h3>
      </div>

      <div className="mb-8 p-4 bg-black border border-gray-900 text-center">
        <div className="text-[8px] text-gray-600 uppercase tracking-widest mb-1">Current Index Price</div>
        <div className="text-2xl font-bold text-white font-mono">{mockPrice.toFixed(2)} <span className="text-[10px] text-gray-500">€BSR</span></div>
      </div>

      <div className="grid grid-cols-2 gap-2 mb-10 text-center">
        <div className="border border-gray-900 py-3">
            <div className="text-[7px] text-gray-600 uppercase mb-1">Open Long</div>
            <div className="text-[10px] text-green-500 font-bold">{mockLong}</div>
        </div>
        <div className="border border-gray-900 py-3">
            <div className="text-[7px] text-gray-600 uppercase mb-1">Open Short</div>
            <div className="text-[10px] text-red-500 font-bold">{mockShort}</div>
        </div>
      </div>

      <Link href={`/trading/${market.id}`}>
        <button className="w-full py-4 bg-red-600 text-white font-bold text-[10px] hover:bg-red-700 transition-all uppercase tracking-[0.2em]">
          Open Index
        </button>
      </Link>
    </div>
  )
}