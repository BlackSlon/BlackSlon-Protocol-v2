'use client'

import Link from 'next/link'
import Image from 'next/image'
import { BSR_MARKETS } from '../markets_config'

export default function MarketsPage() {
  const activePower   = BSR_MARKETS.filter(m => m.status === 'active'  && m.type === 'Power')
  const activeGas     = BSR_MARKETS.filter(m => m.status === 'active'  && m.type === 'Gas')
  const dormantPower  = BSR_MARKETS.filter(m => m.status === 'dormant' && m.type === 'Power')
  const dormantGas    = BSR_MARKETS.filter(m => m.status === 'dormant' && m.type === 'Gas')

  const getCountryName = (fullName: string) => fullName.split(' ')[0]
  const getMarketType  = (fullName: string) => fullName.split(' ').slice(1).join(' ')
  const getCode        = (id: string)       => id.split('-')[2]

  return (
    <div className="min-h-screen bg-black text-white p-8">

      {/* ── Header ── */}
      <div className="text-center mb-12">
        <Link href="/">
          <Image
            src="/BS_image.jpg"
            alt="BlackSlon"
            width={120}
            height={120}
            className="mx-auto mb-6 cursor-pointer transition-transform hover:scale-105"
          />
        </Link>
      </div>

      {/* ── Active Markets ── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-5xl mx-auto mb-16">
        {activePower.map(market => (
          <Link key={market.id} href={`/markets/${market.id}`}>
            <div className="bg-black p-4 text-center transition-all hover:scale-110 cursor-pointer">
              <div className="w-20 h-20 mx-auto mb-3">
                <Image src="/BSyellow_image.png" alt="Power Market" width={80} height={80} />
              </div>
              <p className="text-yellow-500 text-sm">{getCountryName(market.name)}</p>
              <p className="text-yellow-400 text-[10px] opacity-80">{getMarketType(market.name)}</p>
            </div>
          </Link>
        ))}
        {activeGas.map(market => (
          <Link key={market.id} href={`/markets/${market.id}`}>
            <div className="bg-black p-4 text-center transition-all hover:scale-110 cursor-pointer">
              <div className="w-20 h-20 mx-auto mb-3">
                <Image src="/BSblue_image.png" alt="Gas Market" width={80} height={80} />
              </div>
              <p className="text-blue-400 text-sm">{getCountryName(market.name)}</p>
              <p className="text-blue-400 text-[10px] opacity-80">{getMarketType(market.name)}</p>
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
        <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-2">
          {dormantPower.map(market => (
            <div
              key={market.id}
              title={market.name}
              className="flex flex-col items-center gap-0.5 p-2 rounded-sm border border-gray-900 opacity-35 hover:opacity-55 transition-opacity cursor-default"
            >
              <div className="w-8 h-8">
                <Image src="/BSyellow_image.png" alt="" width={32} height={32} />
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
          <div className="w-1.5 h-1.5 rounded-full bg-blue-500 opacity-40 shrink-0" />
          <span className="text-[7px] text-blue-500 uppercase tracking-[0.35em] shrink-0">Gas Markets</span>
          <div className="flex-1 border-t border-gray-900" />
          <span className="text-[7px] text-gray-800 shrink-0">{dormantGas.length}</span>
        </div>
        <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-2">
          {dormantGas.map(market => (
            <div
              key={market.id}
              title={market.name}
              className="flex flex-col items-center gap-0.5 p-2 rounded-sm border border-gray-900 opacity-35 hover:opacity-55 transition-opacity cursor-default"
            >
              <div className="w-8 h-8">
                <Image src="/BSblue_image.png" alt="" width={32} height={32} />
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
          <div className="bg-black p-4 text-center transition-all hover:scale-110 cursor-pointer border border-gray-800 rounded-lg">
            <div className="w-20 h-20 mx-auto mb-3">
              <Image src="/BS_image.jpg" alt="Whitepaper" width={80} height={80} />
            </div>
            <p className="text-amber-600 text-sm font-semibold">White Paper</p>
            <p className="text-gray-400 text-[10px] opacity-80">Protocol Documentation</p>
          </div>
        </Link>
        <Link href="/executive-summary">
          <div className="bg-black p-4 text-center transition-all hover:scale-110 cursor-pointer border border-gray-800 rounded-lg">
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

    </div>
  )
}
