'use client'

import React from 'react'
import { useVirtual } from '@/store/blackslon'
import { useBotOrders } from '@/store/blackslon'
import { getMarketData } from '@/data/markets'
import { generateOrderBook, generateBSEIHistory, generateLiquiditySnapshots } from '@/data/markets/orderBookGenerator'
import { getMarketColors } from '@/lib/marketColors'
import { getCurrentCycleData } from '@/lib/marketCycle'
import Tooltip from '@/components/Tooltip'
import { getMarketTooltips } from '@/lib/marketTooltips'
import type { MarketId } from '@/store/types'

const formatVolume = (vol: number) =>
  vol.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ')

// ─── BSEI Formula ─────────────────────────────────────────────────────────────
const OMEGA = 0.80
function calculateBSEI(anchor: number, pRvwap: number): number {
  return OMEGA * anchor + (1 - OMEGA) * pRvwap
}

// Static BSEI historical index values per market (D-1, D-2)
const BSEI_STATIC: Record<string, { d1: number; d2: number }> = {
  'BS-G-NL': { d1: 5.026, d2: 4.847 },
  'BS-G-DE': { d1: 5.097, d2: 4.907 },
  'BS-G-PL': { d1: 5.586, d2: 5.446 },
  'BS-G-BG': { d1: 3.718, d2: 3.558 },
  'BS-P-DE': { d1: 9.113, d2: 9.077 },
  'BS-P-NO': { d1: 6.364, d2: 6.216 },
  'BS-P-PL': { d1: 9.948, d2: 9.840 },
  'BS-P-UK': { d1: 9.047, d2: 8.673 },
}

interface Props {
  selectedMarketId?: string
}

export default function VirtualDimension({ selectedMarketId = 'BS-P-PL' }: Props) {
  const storeData = useVirtual()
  const { botOrders } = useBotOrders()
  const colors = getMarketColors(selectedMarketId)

  // Get current cycle data for this specific market
  const cycleData = getCurrentCycleData(selectedMarketId)
  const marketPrices: Record<string, number> = {
    'BS-G-NL': 4.43,
    'BS-G-DE': 4.50,
    'BS-G-PL': 4.78,
    'BS-G-BG': 4.13,
    'BS-P-DE': 9.121,
    'BS-P-NO': 6.213,
    'BS-P-PL': 9.938,
    'BS-P-UK': 8.773,
  }
  // FORCE USE OF MARKET PRICES - cycleData causing issues
  const anchor = marketPrices[selectedMarketId] || 10.59
  
  const generated = generateOrderBook(anchor, selectedMarketId)

  // Merge generated orders with user orders from store
  const userBids = storeData.orderBook.bids.filter(o => o.ownedByUser && (o as any).marketId === selectedMarketId)
  const userAsks = storeData.orderBook.asks.filter(o => o.ownedByUser && (o as any).marketId === selectedMarketId)

  // Apply consumed volume to generated orders (subtract filled units from top)
  const consumedBidUnits = storeData.orderBook.consumedBidVolumeByMarket?.[selectedMarketId] || 0
  const consumedAskUnits = storeData.orderBook.consumedAskVolumeByMarket?.[selectedMarketId] || 0

  const adjustedGenBids = (() => {
    let remaining = consumedBidUnits
    return generated.bids.map(o => {
      if (remaining <= 0) return o
      const consumed = Math.min(remaining, o.units)
      remaining -= consumed
      const newUnits = o.units - consumed
      return newUnits > 0 ? { ...o, units: newUnits, volume: newUnits * 100 } : null
    }).filter(Boolean) as typeof generated.bids
  })()

  const adjustedGenAsks = (() => {
    let remaining = consumedAskUnits
    return generated.asks.map(o => {
      if (remaining <= 0) return o
      const consumed = Math.min(remaining, o.units)
      remaining -= consumed
      const newUnits = o.units - consumed
      return newUnits > 0 ? { ...o, units: newUnits, volume: newUnits * 100 } : null
    }).filter(Boolean) as typeof generated.asks
  })()

  // Split bot orders by side and merge into order book
  const marketBotOrders: any[] = botOrders[selectedMarketId] || []
  const botBids = marketBotOrders.filter(o => o.side === 'BUY')
  const botAsks = marketBotOrders.filter(o => o.side === 'SELL')

  // Merge all orders and sort
  const finalBids = [...adjustedGenBids, ...userBids, ...botBids].sort((a,b) => b.price - a.price).slice(0,10)
  const finalAsks = [...adjustedGenAsks, ...userAsks, ...botAsks].sort((a,b) => a.price - b.price).slice(0,10)

  // Get market-specific last trade and trade history from store
  const marketLastTrade = storeData.orderBook.lastTradeByMarket?.[selectedMarketId as MarketId]
  const storeHistory = storeData.orderBook.tradeHistoryByMarket?.[selectedMarketId] || []
  const displayLastTrade = marketLastTrade && (Date.now() - marketLastTrade.timestamp < 86400000)
    ? marketLastTrade
    : { price: anchor, units: 10, volume: 1000, timestamp: Date.now() }

  // Default historical trades (shown when no real trades yet)
  const now = Date.now()
  const defaultTrades = [
    { price: anchor,                    units: 10, volume: 1000,  timestamp: now,                  side: 'BUY' as const },
    { price: anchor * (1 - 0.003),      units: 5,  volume: 500,   timestamp: now - 1 * 3600000,    side: 'SELL' as const },
    { price: anchor * (1 + 0.005),      units: 8,  volume: 800,   timestamp: now - 3 * 3600000,    side: 'BUY' as const },
    { price: anchor * (1 - 0.007),      units: 15, volume: 1500,  timestamp: now - 6 * 3600000,    side: 'SELL' as const },
    { price: anchor * (1 + 0.002),      units: 3,  volume: 300,   timestamp: now - 12 * 3600000,   side: 'BUY' as const },
    { price: anchor * (1 + 0.008),      units: 7,  volume: 700,   timestamp: now - 18 * 3600000,   side: 'BUY' as const },
    { price: anchor * (1 - 0.005),      units: 12, volume: 1200,  timestamp: now - 22 * 3600000,   side: 'SELL' as const },
    { price: anchor * (1 + 0.001),      units: 4,  volume: 400,   timestamp: now - 26 * 3600000,   side: 'BUY' as const },
  ]

  // Build recent trades: real history first, fill remaining slots with defaults
  const recentTrades = storeHistory.length > 0
    ? [...storeHistory.slice(0, 8), ...defaultTrades.slice(storeHistory.length)].slice(0, 8)
    : defaultTrades

  // ── BSEI: I_t = ω * anchor + (1 - ω) * P_RVWAP ──
  // P_RVWAP derived from internal 24h rolling VWAP of executed transactions.
  // In demo: approximate as slight discount to anchor (reflects thin internal market).
  const pRvwap = anchor * 0.999
  const It = calculateBSEI(anchor, pRvwap)

  const bseiStatic = BSEI_STATIC[selectedMarketId] ?? { d1: anchor * 0.998, d2: anchor * 0.995 }
  const displayBsei = {
    It,
    d1: bseiStatic.d1,
    d2: bseiStatic.d2,
  }

  const displayLiquidity = generateLiquiditySnapshots(selectedMarketId)
  const displayMarketId = selectedMarketId
  const bseiVol24hTokens = Math.round(displayLastTrade.volume / 100)

  const tt = getMarketTooltips(selectedMarketId)
  const { bids, asks, lastTrade } = { bids: finalBids, asks: finalAsks, lastTrade: displayLastTrade }

  return (
    <div className="flex flex-col h-full bg-black font-mono text-white p-0">

      {/* ── Header ── */}
      <div className="w-full pt-1 pb-1 flex flex-col items-center shrink-0">
        <div className="text-[10px] text-gray-500 uppercase tracking-[0.5em] font-bold">
          Virtual Market Panel
        </div>
        <div className="w-[80%] border-b border-gray-800 mt-1" />
      </div>

      {/* ── Order Book title ── */}
      <div className="px-6 pt-2 pb-1 w-full">
        <div className="flex items-center justify-start">
          <Tooltip content={tt.orderBook}>
            <div className={`text-[10px] tracking-widest font-bold ${colors.title}`}>
              BlackSlon Order Book
            </div>
          </Tooltip>
          <div className={`ml-2 px-2 py-0.5 rounded text-[7px] uppercase tracking-widest font-bold border ${colors.badgeBorder} ${colors.badgeText}`}>
            {displayMarketId}
          </div>
        </div>
      </div>

      <div className="flex-grow px-6 pb-4 flex flex-col min-h-0 sm:px-2">

        {/* ── Order Book Grid — fixed height, no layout shift ── */}
        <div className="flex shrink-0 overflow-hidden" style={{ height: '255px' }}>

          {/* BUY SIDE */}
          <div className="flex-1 flex flex-col overflow-hidden">
            <div className="grid grid-cols-3 text-[7px] text-gray-500 uppercase font-normal px-4 py-1 border-b border-gray-800 bg-black">
              <div className="text-center">
                <div>VOLUME</div>
                <div className="text-gray-400 normal-case">(kWh)</div>
              </div>
              <div className="text-center">
                <div>UNIT</div>
                <div className="text-gray-400">({displayMarketId})</div>
              </div>
              <div className="text-right">
                <div className="text-[11px] text-green-600 tracking-widest font-bold">BUY ORDERS</div>
                <div className="text-gray-400 normal-case">(EUR/100kWh)</div>
              </div>
            </div>
            <div className="overflow-hidden">
              {Array.from({ length: 9 }, (_, i) => {
                const o = bids[i]
                if (!o) return (
                  <div key={`eb-${i}`} className="grid grid-cols-3 px-4 border-b border-gray-900/10" style={{ height: '22px' }} />
                )
                return (
                  <div
                    key={o.id}
                    style={{ height: '22px' }}
                    className={
                      i === 0
                        ? 'grid grid-cols-3 px-4 border-b border-green-700/30 bg-green-700/10'
                        : `grid grid-cols-3 px-4 border-b border-gray-900/50 hover:bg-green-700/10 transition-all ${o.ownedByUser ? 'bg-green-900/20' : ''}`
                    }
                  >
                    <div className="text-[11px] text-gray-400 self-center">
                      {formatVolume(o.volume)}
                    </div>
                    <div className="text-center text-[11px] self-center text-gray-400">
                      {o.units}
                    </div>
                    <div className={`text-right self-center text-green-600 ${i === 0 ? 'text-sm font-normal' : 'text-[11px]'}`}>
                      {o.price.toFixed(2)}
                      {o.ownedByUser && <span className="ml-1 text-[7px] text-green-900">●</span>}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* SELL SIDE */}
          <div className="flex-1 flex flex-col overflow-hidden">
            <div className="grid grid-cols-3 text-[7px] text-gray-500 uppercase font-normal px-4 py-1 border-b border-gray-800 bg-black">
              <div className="text-left">
                <div className="text-[11px] text-red-500 tracking-widest font-bold">SELL ORDERS</div>
                <div className="text-gray-400 normal-case">(EUR/100kWh)</div>
              </div>
              <div className="text-center">
                <div>UNIT</div>
                <div className="text-gray-400">({displayMarketId})</div>
              </div>
              <div className="text-right">
                <div>VOLUME</div>
                <div className="text-gray-400 normal-case">(kWh)</div>
              </div>
            </div>
            <div className="overflow-hidden">
              {Array.from({ length: 9 }, (_, i) => {
                const o = asks[i]
                if (!o) return (
                  <div key={`ea-${i}`} className="grid grid-cols-3 px-4 border-b border-gray-900/10" style={{ height: '22px' }} />
                )
                return (
                  <div
                    key={o.id}
                    style={{ height: '22px' }}
                    className={
                      i === 0
                        ? 'grid grid-cols-3 px-4 border-b border-red-500/30 bg-red-500/10'
                        : `grid grid-cols-3 px-4 border-b border-gray-900/50 hover:bg-red-500/10 transition-all ${o.ownedByUser ? 'bg-red-900/20' : ''}`
                    }
                  >
                    <div className={`text-left self-center text-red-500 ${i === 0 ? 'text-sm font-normal' : 'text-[11px]'}`}>
                      {o.price.toFixed(2)}
                      {o.ownedByUser && <span className="ml-1 text-[7px] text-red-900">●</span>}
                    </div>
                    <div className="text-center text-[11px] self-center text-gray-400">
                      {o.units}
                    </div>
                    <div className="text-right text-[11px] text-gray-400 self-center">
                      {formatVolume(o.volume)}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* ── Last Trades (left) + BSEI & Liquidity (right) ── */}
        <div className="mt-2 border-t border-gray-800 pt-2">
          <div className="flex gap-3">

            {/* Last Trades — left */}
            <div className="flex-[1.3]">
              <div className="flex items-center justify-start gap-2 mb-1">
                <span className={`text-[9px] tracking-wider font-bold ${colors.title}`}>Last Trades</span>
                <div className={`px-2 py-0.5 rounded text-[7px] uppercase tracking-widest font-bold border ${colors.badgeBorder} ${colors.badgeText}`}>
                  {displayMarketId}
                </div>
              </div>

              {/* Latest trade — highlighted frame */}
              {recentTrades[0] && (() => {
                const t = recentTrades[0]
                const isBuy = (t as any).side === 'BUY'
                return (
                  <div className={`grid grid-cols-12 px-2 py-1 mb-1 border rounded-sm ${
                    isBuy ? 'border-green-700/50 bg-green-900/15' : 'border-red-600/50 bg-red-900/15'
                  }`}>
                    <div className={`col-span-1 text-[9px] font-black self-center ${isBuy ? 'text-green-600' : 'text-red-500'}`}>{isBuy ? 'B' : 'S'}</div>
                    <div className={`col-span-3 text-[9px] self-center ${isBuy ? 'text-green-600' : 'text-red-500'}`}>{new Date(t.timestamp).toLocaleTimeString('pl-PL')}</div>
                    <div className={`col-span-3 text-center text-sm font-normal self-center ${isBuy ? 'text-green-600' : 'text-red-500'}`}>{t.price.toFixed(2)}</div>
                    <div className="col-span-2 text-center text-sm font-normal self-center text-gray-300">{t.units}</div>
                    <div className="col-span-3 text-right text-[9px] self-center text-gray-300">{formatVolume(t.volume)}</div>
                  </div>
                )
              })()}

              {/* Remaining 7 trades */}
              <div className="grid grid-cols-12 text-[7px] uppercase pb-0.5 border-b border-gray-900 mb-0.5">
                <div className="col-span-1 text-gray-500">S</div>
                <div className="col-span-3 text-gray-500">Time</div>
                <div className="col-span-3 text-center text-gray-500">Price</div>
                <div className="col-span-2 text-center text-gray-500">Qty</div>
                <div className="col-span-3 text-right text-gray-500 normal-case">kWh</div>
              </div>
              {recentTrades.slice(1, 8).map((t, i) => (
                <div key={i} className="grid grid-cols-12 text-[9px] py-0.5 border-b border-gray-900/30">
                  <div className={`col-span-1 text-[7px] font-bold ${(t as any).side === 'BUY' ? 'text-green-600' : 'text-red-500'}`}>{(t as any).side === 'BUY' ? 'B' : 'S'}</div>
                  <div className="col-span-3 text-gray-400">{new Date(t.timestamp).toLocaleTimeString('pl-PL')}</div>
                  <div className="col-span-3 text-center text-gray-400">{t.price.toFixed(2)}</div>
                  <div className="col-span-2 text-center text-gray-400">{t.units}</div>
                  <div className="col-span-3 text-right text-gray-400">{formatVolume(t.volume)}</div>
                </div>
              ))}
            </div>

            {/* BSEI + Liquidity — right column */}
            <div className="flex-1 flex flex-col gap-2">

              {/* BSEI box — right side */}
                <div
                  className={`border rounded-sm px-2.5 py-2 ${
                    colors.isGas ? 'border-cyan-700/60 bg-cyan-900/10' : 'border-yellow-700/60 bg-yellow-900/10'
                  }`}
                  style={{ boxShadow: colors.isGas ? '0 0 14px rgba(34,211,238,0.07)' : '0 0 14px rgba(202,138,4,0.09)' }}
                >
                  <div className="flex items-center gap-1 mb-1.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse shrink-0" />
                    <Tooltip content={tt.bsei}>
                      <span className={`text-[8px] uppercase tracking-[0.2em] font-black ${colors.title}`}>BSEI</span>
                    </Tooltip>
                    <span className="text-[7px] text-gray-400 normal-case">BlackSlon Energy Index</span>
                  </div>
                  <div className="mt-1 grid grid-cols-3 gap-x-1 text-center">
                    <div>
                      <div className="text-[7px] text-gray-500 uppercase mb-0.5">NOW</div>
                      <div className={`text-sm font-normal leading-none ${colors.value}`}>{displayBsei.It.toFixed(2)}</div>
                    </div>
                    <div>
                      <div className="text-[7px] text-gray-500 uppercase mb-0.5">D-1</div>
                      <div className="text-sm font-normal text-gray-400 leading-none">{displayBsei.d1.toFixed(2)}</div>
                    </div>
                    <div>
                      <div className="text-[7px] text-gray-500 uppercase mb-0.5">D-2</div>
                      <div className="text-sm font-normal text-gray-400 leading-none">{displayBsei.d2.toFixed(2)}</div>
                    </div>
                  </div>
                </div>

              {/* Liquidity */}
              <div>
                <div className="flex items-center gap-1 mb-1">
                  <Tooltip content={tt.liquidity}>
                    <div className={`text-[9px] tracking-wider font-bold ${colors.title}`}>Liquidity</div>
                  </Tooltip>
                  <div className={`px-1.5 py-0.5 rounded text-[6px] uppercase tracking-widest font-bold border ${colors.badgeBorder} ${colors.badgeText}`}>
                    {displayMarketId}
                  </div>
                </div>
                <div className="grid grid-cols-3 text-[7px] uppercase pb-0.5 border-b border-gray-900">
                  <div className="text-gray-500">Ref</div>
                  <div className="text-center text-gray-500 normal-case">kWh</div>
                  <div className="text-right text-gray-500">Tokens</div>
                </div>
                {displayLiquidity.slice(0, 5).map((snap) => (
                  <div key={snap.label} className="grid grid-cols-3 text-[9px] py-0.5 border-b border-gray-900/40">
                    <div className="text-gray-500">{snap.label}</div>
                    <div className="text-center text-gray-400">{snap.value.toLocaleString('de-DE')}</div>
                    <div className="text-right text-gray-400">{Math.round(snap.value / 100).toLocaleString('de-DE')}</div>
                  </div>
                ))}
              </div>

            </div>

          </div>
        </div>

      </div>
    </div>
  )
}
