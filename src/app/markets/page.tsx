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
      {/* ── Cosmos background ── */}
      <style>{`
        .stars-sm {
          position: fixed; inset: 0; z-index: 0; pointer-events: none;
          width: 1px; height: 1px; background: transparent;
          box-shadow:
            25vw 8vh #fff, 50vw 4vh #fff, 75vw 12vh #fff, 12vw 25vh #fff, 88vw 18vh #fff,
            33vw 35vh #fff, 66vw 30vh #fff, 8vw 50vh #fff, 92vw 42vh #fff, 45vw 55vh #fff,
            18vw 65vh #fff, 72vw 60vh #fff, 55vw 72vh #fff, 30vw 80vh #fff, 85vw 75vh #fff,
            5vw 90vh #fff, 40vw 88vh #fff, 60vw 95vh #fff, 95vw 85vh #fff, 15vw 15vh #fff,
            38vw 22vh #fff, 82vw 28vh #fff, 22vw 48vh #fff, 68vw 45vh #fff, 48vw 38vh #fff,
            10vw 72vh #fff, 78vw 82vh #fff, 52vw 18vh #fff, 35vw 58vh #fff, 90vw 62vh #fff,
            3vw 35vh #fff, 97vw 55vh #fff, 42vw 72vh #fff, 58vw 8vh #fff, 28vw 92vh #fff,
            65vw 15vh #fff, 15vw 42vh #fff, 80vw 48vh #fff, 45vw 25vh #fff, 70vw 88vh #fff,
            20vw 5vh #fff, 55vw 45vh #fff, 32vw 68vh #fff, 88vw 35vh #fff, 8vw 82vh #fff,
            62vw 52vh #fff, 25vw 75vh #fff, 75vw 5vh #fff, 50vw 85vh #fff, 38vw 48vh #fff;
        }
        .stars-md {
          position: fixed; inset: 0; z-index: 0; pointer-events: none;
          width: 2px; height: 2px; border-radius: 50%; background: #fff;
          box-shadow:
            20vw 10vh #fff, 60vw 5vh #fff, 85vw 20vh #fff, 10vw 40vh #fff, 45vw 15vh #fff,
            70vw 35vh #fff, 30vw 55vh #fff, 90vw 50vh #fff, 15vw 70vh #fff, 55vw 65vh #fff,
            40vw 85vh #fff, 80vw 72vh #fff, 5vw 60vh #fff, 65vw 80vh #fff, 35vw 30vh #fff,
            95vw 15vh #fff, 22vw 85vh #fff, 50vw 42vh #fff, 75vw 55vh #fff, 12vw 22vh #fff;
          animation: twinkle1 3s ease-in-out infinite alternate;
        }
        .stars-lg {
          position: fixed; inset: 0; z-index: 0; pointer-events: none;
          width: 3px; height: 3px; border-radius: 50%; background: #fff;
          box-shadow:
            15vw 8vh 1px #fff, 42vw 20vh 1px rgba(200,220,255,0.9), 78vw 12vh 1px #fff,
            55vw 35vh 1px rgba(255,240,200,0.9), 25vw 60vh 1px #fff, 88vw 45vh 1px rgba(200,220,255,0.9),
            35vw 78vh 1px #fff, 68vw 65vh 1px rgba(255,240,200,0.9), 8vw 88vh 1px #fff,
            92vw 75vh 1px rgba(200,220,255,0.9);
          animation: twinkle2 5s ease-in-out infinite alternate;
        }
        @keyframes twinkle1 {
          0% { opacity: 0.6; } 100% { opacity: 1; }
        }
        @keyframes twinkle2 {
          0% { opacity: 0.5; } 50% { opacity: 1; } 100% { opacity: 0.7; }
        }
        .moon {
          position: fixed; z-index: 0; pointer-events: none;
          top: 8%; right: 10%;
          width: 22px; height: 22px; border-radius: 50%; opacity: 0.35;
          background: radial-gradient(circle at 35% 40%, #e8e4d4 0%, #c4bca8 50%, #908878 100%);
          box-shadow: 0 0 8px 2px rgba(220,215,200,0.1), inset -3px -2px 5px rgba(100,95,80,0.5);
        }
        .moon::after {
          content: ''; position: absolute; border-radius: 50%;
          top: 5px; left: 4px; width: 3px; height: 3px;
          background: rgba(140,130,115,0.35);
          box-shadow: 7px 3px 0 2px rgba(130,120,105,0.25), 3px 8px 0 1.5px rgba(120,112,100,0.2);
        }
        .mars {
          position: fixed; z-index: 0; pointer-events: none;
          bottom: 18%; left: 6%;
          width: 10px; height: 10px; border-radius: 50%; opacity: 0.4;
          background: radial-gradient(circle at 40% 35%, #d08858 0%, #a05830 60%, #703018 100%);
          box-shadow: 0 0 6px 1px rgba(180,80,40,0.15), inset -2px -1px 3px rgba(50,15,5,0.4);
        }
        .mars::after { display: none; }
      `}</style>
      <div className="stars-sm" />
      <div className="stars-md" />
      <div className="stars-lg" />
      <div className="moon" />
      <div className="mars" />

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
          {dormantPower.length + dormantGas.length} markets · Europe · Integration 2027–2029
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
