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
        <h1 className="text-4xl font-bold mb-4">BlackSlon Markets</h1>
        <p className="text-gray-400 text-lg">Select a market to start trading</p>
      </div>

      {/* Power Markets */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-yellow-500 mb-6 text-center">Power Markets</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
          {powerMarkets.map(market => (
            <Link key={market.id} href={`/markets/${market.id}`}>
              <div className="bg-gray-900 rounded-lg p-6 text-center transition-all hover:bg-gray-800 hover:scale-105 cursor-pointer border border-yellow-500/30">
                <div className="w-16 h-16 mx-auto mb-4 bg-yellow-500 rounded-full flex items-center justify-center">
                  <span className="text-black font-bold text-lg">P</span>
                </div>
                <h3 className="font-semibold text-yellow-500 mb-2">{market.id}</h3>
                <p className="text-gray-400 text-sm">{market.name}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Gas Markets */}
      <div>
        <h2 className="text-2xl font-bold text-blue-500 mb-6 text-center">Gas Markets</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
          {gasMarkets.map(market => (
            <Link key={market.id} href={`/markets/${market.id}`}>
              <div className="bg-gray-900 rounded-lg p-6 text-center transition-all hover:bg-gray-800 hover:scale-105 cursor-pointer border border-blue-500/30">
                <div className="w-16 h-16 mx-auto mb-4 bg-blue-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-lg">G</span>
                </div>
                <h3 className="font-semibold text-blue-500 mb-2">{market.id}</h3>
                <p className="text-gray-400 text-sm">{market.name}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
