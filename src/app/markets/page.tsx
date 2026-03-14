'use client'

import Link from 'next/link'
import Image from 'next/image'
import { BSR_MARKETS } from '../markets_config'

export default function MarketsPage() {
  const powerMarkets = BSR_MARKETS.filter(m => m.type === 'Power')
  const gasMarkets = BSR_MARKETS.filter(m => m.type === 'Gas')

  return (
    <div className="min-h-screen bg-black text-white p-8">
      {/* Header */}
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

      {/* All Markets - Single Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-5xl mx-auto">
        {powerMarkets.map(market => (
          <Link key={market.id} href={`/markets/${market.id}`}>
            <div className="bg-black p-4 text-center transition-all hover:scale-110 cursor-pointer">
              <div className="w-20 h-20 mx-auto mb-3 relative">
                <Image
                  src="/BSyellow_image.png"
                  alt="Power Market"
                  width={80}
                  height={80}
                />
              </div>
              <h3 className="font-semibold text-yellow-500 text-sm mb-1">{market.id}</h3>
              <p className="text-gray-400 text-xs">{market.name}</p>
            </div>
          </Link>
        ))}
        {gasMarkets.map(market => (
          <Link key={market.id} href={`/markets/${market.id}`}>
            <div className="bg-black p-4 text-center transition-all hover:scale-110 cursor-pointer">
              <div className="w-20 h-20 mx-auto mb-3 relative">
                <Image
                  src="/BSblue_image.png"
                  alt="Gas Market"
                  width={80}
                  height={80}
                />
              </div>
              <h3 className="font-semibold text-blue-500 text-sm mb-1">{market.id}</h3>
              <p className="text-gray-400 text-xs">{market.name}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
