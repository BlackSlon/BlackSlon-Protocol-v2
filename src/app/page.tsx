'use client'

import Link from 'next/link'
import { BSR_MARKETS } from './markets_config'

export default function Dashboard() {
  const powerMarkets = BSR_MARKETS.filter(m => m.type === 'Power')
  const gasMarkets = BSR_MARKETS.filter(m => m.type === 'Gas')

  return (
    <div className="min-h-screen bg-black text-white p-8 font-sans">
      <header className="max-w-7xl mx-auto mb-16 flex justify-between items-end border-b border-gray-800 pb-8">
        <div>
          <h1 className="text-6xl font-black tracking-tighter italic">
            BLACK<span className="text-yellow-500">SLON</span>
          </h1>
          <p className="text-gray-500 font-mono text-sm mt-2 uppercase tracking-widest">
            Autonomous Settlement Zone // €BSR Mainnet
          </p>
        </div>
        <div className="text-right font-mono text-[10px] text-gray-600 uppercase">
          Status: <span className="text-green-500">Optimal</span><br/>
          Protocol: active
        </div>
      </header>

      <div className="max-w-7xl mx-auto space-y-16">
        <section>
          <h2 className="text-yellow-500/50 text-xs font-bold mb-6 tracking-[0.3em] uppercase">Energy Electrons // Power</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {powerMarkets.map(m => <MarketCard key={m.id} market={m} />)}
          </div>
        </section>

        <section>
          <h2 className="text-yellow-500/50 text-xs font-bold mb-6 tracking-[0.3em] uppercase">Energy Molecules // Gas</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {gasMarkets.map(m => <MarketCard key={m.id} market={m} />)}
          </div>
        </section>
      </div>
    </div>
  )
}

function MarketCard({ market }: { market: any }) {
  return (
    <div className="bg-[#0a0a0a] border border-gray-900 p-6 hover:border-yellow-500 transition-all group">
      <div className="flex justify-between items-start mb-8">
        <code className="text-[10px] text-gray-600 font-mono tracking-tighter">{market.id}</code>
        <div className="h-2 w-2 rounded-full bg-green-500 shadow-[0_0_8px_#22c55e]"></div>
      </div>
      <h3 className="text-xl font-bold mb-1 text-gray-200 group-hover:text-white transition-colors">
        {market.name}
      </h3>
      <p className="text-gray-600 text-[10px] mb-8 uppercase tracking-widest">Inertia: {market.b_base}</p>
      
      {/* ŻÓŁTY PRZYCISK PRZEKIEROWUJĄCY */}
      <Link href={`/trading/${market.id}`}>
        <button className="w-full py-3 bg-yellow-500 text-black font-black text-[10px] hover:bg-yellow-400 transition-all uppercase tracking-[0.2em]">
          Open the Index
        </button>
      </Link>
    </div>
  )
}