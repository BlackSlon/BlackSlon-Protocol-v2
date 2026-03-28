'use client'

import Link from 'next/link'
import Image from 'next/image'
import { BSR_MARKETS } from '../markets_config'
import MarketCube from '@/components/MarketCube'

export default function MarketsPage() {
  const activePower   = BSR_MARKETS.filter(m => m.status === 'active'  && m.type === 'Power')
  const activeGas     = BSR_MARKETS.filter(m => m.status === 'active'  && m.type === 'Gas')
  const dormantPower  = BSR_MARKETS.filter(m => m.status === 'dormant' && m.type === 'Power')
  const dormantGas    = BSR_MARKETS.filter(m => m.status === 'dormant' && m.type === 'Gas')

  const getCountryName = (fullName: string) => fullName.split(' ')[0]
  const getMarketType  = (fullName: string) => fullName.split(' ').slice(1).join(' ')
  const getCode        = (id: string)       => id.split('-')[2]

  return (
    <div className="min-h-screen bg-black text-white p-8 relative overflow-hidden">
      {/* ── Starfield background ── */}
      <style>{`
        .starfield {
          position: fixed; inset: 0; z-index: 0; pointer-events: none;
          background:
            radial-gradient(1px 1px at 10% 15%, #fff 50%, transparent 100%),
            radial-gradient(1px 1px at 25% 35%, rgba(255,255,255,0.8) 50%, transparent 100%),
            radial-gradient(1.5px 1.5px at 50% 10%, #fff 50%, transparent 100%),
            radial-gradient(1px 1px at 75% 25%, rgba(255,255,255,0.7) 50%, transparent 100%),
            radial-gradient(1px 1px at 90% 45%, #fff 50%, transparent 100%),
            radial-gradient(1px 1px at 5% 55%, rgba(255,255,255,0.6) 50%, transparent 100%),
            radial-gradient(1.5px 1.5px at 35% 65%, #fff 50%, transparent 100%),
            radial-gradient(1px 1px at 60% 50%, rgba(255,255,255,0.8) 50%, transparent 100%),
            radial-gradient(1px 1px at 85% 70%, rgba(255,255,255,0.7) 50%, transparent 100%),
            radial-gradient(1px 1px at 15% 80%, #fff 50%, transparent 100%),
            radial-gradient(1.5px 1.5px at 45% 85%, rgba(255,255,255,0.9) 50%, transparent 100%),
            radial-gradient(1px 1px at 70% 90%, rgba(255,255,255,0.6) 50%, transparent 100%),
            radial-gradient(1px 1px at 95% 15%, rgba(255,255,255,0.5) 50%, transparent 100%),
            radial-gradient(1px 1px at 30% 5%, #fff 50%, transparent 100%),
            radial-gradient(1px 1px at 55% 75%, rgba(255,255,255,0.7) 50%, transparent 100%),
            radial-gradient(1px 1px at 80% 55%, rgba(255,255,255,0.5) 50%, transparent 100%),
            radial-gradient(1px 1px at 20% 45%, rgba(255,255,255,0.6) 50%, transparent 100%),
            radial-gradient(1.5px 1.5px at 65% 30%, #fff 50%, transparent 100%),
            radial-gradient(1px 1px at 40% 95%, rgba(255,255,255,0.7) 50%, transparent 100%),
            radial-gradient(1px 1px at 12% 68%, rgba(255,255,255,0.5) 50%, transparent 100%);
        }
        .starfield2 {
          position: fixed; inset: 0; z-index: 0; pointer-events: none;
          background:
            radial-gradient(0.8px 0.8px at 8% 22%, rgba(255,255,255,0.4) 50%, transparent 100%),
            radial-gradient(0.8px 0.8px at 18% 58%, rgba(255,255,255,0.35) 50%, transparent 100%),
            radial-gradient(0.8px 0.8px at 33% 12%, rgba(255,255,255,0.3) 50%, transparent 100%),
            radial-gradient(0.8px 0.8px at 42% 42%, rgba(255,255,255,0.4) 50%, transparent 100%),
            radial-gradient(0.8px 0.8px at 58% 88%, rgba(255,255,255,0.35) 50%, transparent 100%),
            radial-gradient(0.8px 0.8px at 72% 18%, rgba(255,255,255,0.3) 50%, transparent 100%),
            radial-gradient(0.8px 0.8px at 82% 62%, rgba(255,255,255,0.4) 50%, transparent 100%),
            radial-gradient(0.8px 0.8px at 92% 82%, rgba(255,255,255,0.3) 50%, transparent 100%),
            radial-gradient(0.8px 0.8px at 3% 92%, rgba(255,255,255,0.35) 50%, transparent 100%),
            radial-gradient(0.8px 0.8px at 48% 28%, rgba(255,255,255,0.3) 50%, transparent 100%),
            radial-gradient(0.8px 0.8px at 68% 48%, rgba(255,255,255,0.4) 50%, transparent 100%),
            radial-gradient(0.8px 0.8px at 28% 78%, rgba(255,255,255,0.3) 50%, transparent 100%),
            radial-gradient(0.8px 0.8px at 88% 38%, rgba(255,255,255,0.35) 50%, transparent 100%),
            radial-gradient(0.8px 0.8px at 52% 58%, rgba(255,255,255,0.25) 50%, transparent 100%),
            radial-gradient(0.8px 0.8px at 78% 8%, rgba(255,255,255,0.3) 50%, transparent 100%);
          animation: twinkle 4s ease-in-out infinite alternate;
        }
        @keyframes twinkle {
          0%   { opacity: 0.4; }
          50%  { opacity: 0.7; }
          100% { opacity: 0.4; }
        }
      `}</style>
      <div className="starfield" />
      <div className="starfield2" />

      {/* ── Content above stars ── */}
      <div className="relative z-10">

      {/* ── Spacer ── */}
      <div className="h-20 md:h-36" />

      {/* ── Active Markets — Power ── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6 max-w-5xl mx-auto mb-10 md:mb-16">
        {activePower.map((market, i) => (
          <Link key={market.id} href={`/markets/${market.id}`}>
            <div className="bg-black p-2 md:p-4 text-center transition-all hover:scale-110 cursor-pointer flex flex-col items-center">
              <div className="flex items-center justify-center scale-[0.7] md:scale-100" style={{ width: 120, height: 120 }}>
                <MarketCube marketId={market.id} marketName={market.name} type="Power" size={120} direction={i % 2 === 0 ? 'left' : 'down'} duration={[20, 22, 18, 24][i]} />
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* ── Active Markets — Gas ── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6 max-w-5xl mx-auto mb-10 md:mb-16">
        {activeGas.map((market, i) => (
          <Link key={market.id} href={`/markets/${market.id}`}>
            <div className="bg-black p-2 md:p-4 text-center transition-all hover:scale-110 cursor-pointer flex flex-col items-center">
              <div className="flex items-center justify-center scale-[0.7] md:scale-100" style={{ width: 120, height: 120 }}>
                <MarketCube marketId={market.id} marketName={market.name} type="Gas" size={120} direction={i % 2 === 0 ? 'down' : 'left'} duration={[24, 20, 22, 18][i]} />
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* ── Coming Soon Divider ── */}
      <div className="max-w-5xl mx-auto mb-10">
        <div className="flex items-center gap-6">
          <div className="flex-1 border-t border-gray-800" />
          <div className="text-center shrink-0">
            <div className="text-[8px] text-gray-500 uppercase tracking-[0.5em] mb-1">European Expansion</div>
            <div className="text-[12px] text-gray-400 uppercase tracking-[0.35em] font-bold">Coming Soon</div>
          </div>
          <div className="flex-1 border-t border-gray-800" />
        </div>
        <p className="text-center text-[7px] text-gray-600 mt-3 tracking-[0.3em] uppercase">
          {dormantPower.length + dormantGas.length} markets · Europe · Integration 2026–2027
        </p>
      </div>

      {/* ── Coming Soon — Power ── */}
      <div className="max-w-5xl mx-auto mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-1.5 h-1.5 rounded-full bg-yellow-500 opacity-40 shrink-0" />
          <span className="text-[7px] text-yellow-500 uppercase tracking-[0.35em] shrink-0">Power Markets</span>
          <div className="flex-1 border-t border-gray-900" />
          <span className="text-[7px] text-gray-800 shrink-0">{dormantPower.length}</span>
        </div>
        <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-4">
          {dormantPower.map((market, i) => (
            <div
              key={market.id}
              title={market.name}
              className="flex flex-col items-center gap-1 p-2 rounded-sm border border-gray-900 opacity-35 hover:opacity-55 transition-opacity cursor-default"
            >
              <div className="flex items-center justify-center" style={{ width: 36, height: 36 }}>
                <MarketCube marketId={market.id} marketName={market.name} type="Power" size={36} direction={i % 2 === 0 ? 'left' : 'down'} duration={20} />
              </div>
              <span className="text-[8px] text-gray-500 uppercase tracking-wider font-bold leading-none mt-0.5">
                {getCode(market.id)}
              </span>
              <span className="text-[6px] text-gray-700 tracking-wide leading-none">
                {getCountryName(market.name)}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* ── Coming Soon — Gas ── */}
      <div className="max-w-5xl mx-auto mb-12">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 opacity-40 shrink-0" />
          <span className="text-[7px] text-cyan-400 uppercase tracking-[0.35em] shrink-0">Gas Markets</span>
          <div className="flex-1 border-t border-gray-900" />
          <span className="text-[7px] text-gray-800 shrink-0">{dormantGas.length}</span>
        </div>
        <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-4">
          {dormantGas.map((market, i) => (
            <div
              key={market.id}
              title={market.name}
              className="flex flex-col items-center gap-1 p-2 rounded-sm border border-gray-900 opacity-35 hover:opacity-55 transition-opacity cursor-default"
            >
              <div className="flex items-center justify-center" style={{ width: 36, height: 36 }}>
                <MarketCube marketId={market.id} marketName={market.name} type="Gas" size={36} direction={i % 2 === 0 ? 'down' : 'left'} duration={20} />
              </div>
              <span className="text-[8px] text-gray-500 uppercase tracking-wider font-bold leading-none mt-0.5">
                {getCode(market.id)}
              </span>
              <span className="text-[6px] text-gray-700 tracking-wide leading-none">
                {getCountryName(market.name)}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* ── Documentation Links ── */}
      <div className="grid grid-cols-2 md:grid-cols-2 gap-4 max-w-5xl mx-auto mb-16">
        <Link href="/whitepaper">
          <div className="bg-black p-4 text-center transition-all hover:scale-110 cursor-pointer border border-gray-800 rounded-lg h-48 w-full flex flex-col justify-center">
            <div className="w-20 h-20 mx-auto mb-3">
              <Image src="/BS_image.jpg" alt="Whitepaper" width={80} height={80} />
            </div>
            <p className="text-amber-600 text-sm font-semibold">White<br/>Paper</p>
            <p className="text-gray-400 text-[10px] opacity-80">Protocol Documentation</p>
          </div>
        </Link>
        <Link href="/executive-summary">
          <div className="bg-black p-4 text-center transition-all hover:scale-110 cursor-pointer border border-gray-800 rounded-lg h-48 w-full flex flex-col justify-center">
            <div className="w-20 h-20 mx-auto mb-3">
              <Image src="/BS_image.jpg" alt="Executive Summary" width={80} height={80} />
            </div>
            <p className="text-amber-600 text-sm font-semibold">Executive Summary</p>
            <p className="text-gray-400 text-[10px] opacity-80">Project Overview</p>
          </div>
        </Link>
      </div>

      {/* ── Footer ── */}
      <div className="max-w-5xl mx-auto pt-4 border-t border-gray-900">
        <p className="text-center text-[7px] text-gray-800 uppercase tracking-[0.3em]">
          BlackSlon Protocol · European Energy Markets · All dormant markets subject to regulatory approval
        </p>
      </div>

      </div>{/* end z-10 content wrapper */}
    </div>
  )
}
