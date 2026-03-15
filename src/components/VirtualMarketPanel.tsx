'use client'

import React from 'react'
import { useVirtual } from '@/store/blackslon'
import { getMarketData } from '@/data/markets'
import { generateOrderBook, generateBSEIHistory, generateLiquiditySnapshots } from '@/data/markets/orderBookGenerator'
import { getMarketColors } from '@/lib/marketColors'

const formatVolume = (vol: number) =>
  vol.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ')

// ─── BSEI Formula ─────────────────────────────────────────────────────────────
// Source: BSEI-Framework.md
// I_t = ω * a + (1 - ω) * P_RVWAP
// ω = 0.80 (default Inertia Factor — 80% Physical Meridian, 20% internal VWAP)
const OMEGA = 0.80

function calculateBSEI(anchor: number, pRvwap: number): number {
  return OMEGA * anchor + (1 - OMEGA) * pRvwap
}

interface Props {
  selectedMarketId?: string
}

export default function VirtualDimension({ selectedMarketId = 'BS-P-PL' }: Props) {
  const storeData = useVirtual()
  const colors = getMarketColors(selectedMarketId)

  const mData = getMarketData(selectedMarketId as any) as any
  const anchor = mData?.bsszPositions?.[0]?.bssz?.anchor
    ?? mData?.bsszCalculation?.anchor
    ?? 10.59

  const generated = generateOrderBook(anchor, selectedMarketId)

  // Merge generated orders with user orders from store
  const userBids = storeData.orderBook.bids.filter(o => o.ownedByUser && (o as any).marketId === selectedMarketId)
  const userAsks = storeData.orderBook.asks.filter(o => o.ownedByUser && (o as any).marketId === selectedMarketId)

  const displayBids = [...generated.bids, ...userBids].sort((a, b) => b.price - a.price)
  const displayAsks = [...generated.asks, ...userAsks].sort((a, b) => a.price - b.price)

  const storeLastTrade = storeData.orderBook.lastTrade
  const displayLastTrade = storeLastTrade && (Date.now() - storeLastTrade.timestamp < 86400000)
    ? storeLastTrade
    : { price: anchor, units: 10, volume: 1000, timestamp: Date.now() }

  // ── BSEI: I_t = ω * anchor + (1 - ω) * P_RVWAP ──
  // P_RVWAP derived from internal 24h rolling VWAP of executed transactions.
  // In demo: approximate as slight discount to anchor (reflects thin internal market).
  const pRvwap = anchor * 0.999
  const It = calculateBSEI(anchor, pRvwap)

  const displayBsei = {
    It,
    omega: OMEGA,
    pRvwap,
    anchor,
    history: generateBSEIHistory(It), // history based on computed It, not raw anchor
  }

  const displayLiquidity = generateLiquiditySnapshots()
  const displayMarketId = selectedMarketId

  const { bids, asks, lastTrade } = { bids: displayBids, asks: displayAsks, lastTrade: displayLastTrade }

  return (
    <div className="flex flex-col h-full bg-black font-mono text-white p-0">

      {/* ── Header ── */}
      <div className="w-full pt-1 pb-1 flex items-center justify-center shrink-0">
        <div className="text-[10px] text-gray-500 uppercase tracking-[0.5em] font-bold">
          Virtual Market Panel
        </div>
      </div>

      {/* ── Order Book title ── */}
      <div className="px-6 pt-2 pb-1 bg-gradient-to-b from-black to-gray-950 w-full">
        <div className="flex items-center justify-center">
          <div className={`text-[10px] tracking-widest font-bold ${colors.title}`}>
            BlackSlon Order Book
          </div>
        </div>
      </div>

      <div className="flex-grow px-6 pb-6 flex flex-col min-h-0 sm:px-2">

        {/* ── Last Trade ── */}
        <div className={`mb-3 mx-3 px-2 py-2 border rounded-sm ${colors.border}`}>
          <div className="flex justify-between items-center mb-1">
            <div className={`text-[6px] uppercase tracking-widest ${colors.label}`}>
              Last Trade · {displayMarketId}
            </div>
            {lastTrade && (
              <div className="text-[6px] text-gray-700 uppercase tracking-widest">
                {new Date(lastTrade.timestamp).toLocaleTimeString('pl-PL')}
              </div>
            )}
          </div>

          {lastTrade ? (
            <div className="flex items-center justify-between">
              <div className="flex flex-col items-center">
                <span className="text-[7px] text-gray-500 uppercase mb-0">
                  Price <span className="normal-case text-gray-600">(EUR/100kWh)</span>
                </span>
                <span className={`text-sm tracking-tighter leading-tight ${colors.value}`}>
                  {lastTrade.price.toFixed(2)}
                </span>
              </div>
              <div className="text-gray-800 text-[10px]">——</div>
              <div className="flex flex-col items-center">
                <span className="text-[7px] text-gray-500 uppercase mb-0">Unit</span>
                <span className="text-sm text-gray-600 tracking-tighter leading-tight">
                  {lastTrade.units}
                </span>
              </div>
              <div className="text-gray-800 text-[10px]">——</div>
              <div className="flex flex-col items-center">
                <span className="text-[7px] text-gray-500 uppercase mb-0 normal-case">
                  Volume (kWh)
                </span>
                <span className="text-sm text-gray-600 tracking-tighter leading-tight">
                  {formatVolume(lastTrade.volume)}
                </span>
              </div>
            </div>
          ) : (
            <div className="text-[10px] text-gray-700 text-center py-1">No trades yet</div>
          )}
        </div>

        {/* ── Order Book Grid ── */}
        <div className="flex-grow flex min-h-0 overflow-hidden">

          {/* BUY SIDE */}
          <div className="flex-1 flex flex-col overflow-hidden">
            <div className="grid grid-cols-3 text-[7px] text-gray-500 uppercase font-normal px-4 py-2 border-b border-gray-800 bg-black">
              <div className="text-center">
                <div>VOLUME</div>
                <div className="text-gray-600 normal-case">(kWh)</div>
              </div>
              <div className="text-center">
                <div>UNIT</div>
                <div className="text-gray-600">({displayMarketId})</div>
              </div>
              <div className="text-right">
                <div className="text-[11px] text-green-700 tracking-widest font-bold">BUY ORDERS</div>
                <div className="text-gray-600 normal-case">(EUR/100kWh)</div>
              </div>
            </div>
            <div className="flex-grow overflow-hidden">
              {bids.map((o, i) => (
                <div
                  key={o.id}
                  className={
                    i === 0
                      ? 'grid grid-cols-3 py-0.5 px-4 border-b border-green-700/30 bg-green-700/10'
                      : `grid grid-cols-3 py-0.5 px-4 border-b border-gray-900/50 hover:bg-green-700/10 transition-all ${o.ownedByUser ? 'bg-green-900/20' : ''}`
                  }
                >
                  <div className="text-[11px] text-gray-400 self-center">
                    {formatVolume(o.volume)}
                  </div>
                  <div className="text-center text-[11px] self-center text-gray-400">
                    {o.units}
                  </div>
                  <div className="text-right text-[11px] self-center text-green-700">
                    {o.price.toFixed(2)}
                    {o.ownedByUser && <span className="ml-1 text-[7px] text-green-900">●</span>}
                  </div>
                </div>
              ))}
              {bids.length === 0 && (
                <div className="text-[9px] text-gray-800 text-center py-4">No buy orders</div>
              )}
            </div>
          </div>

          {/* SELL SIDE */}
          <div className="flex-1 flex flex-col overflow-hidden">
            <div className="grid grid-cols-3 text-[7px] text-gray-500 uppercase font-normal px-4 py-2 border-b border-gray-800 bg-black">
              <div className="text-left">
                <div className="text-[11px] text-red-500 tracking-widest font-bold">SELL ORDERS</div>
                <div className="text-gray-600 normal-case">(EUR/100kWh)</div>
              </div>
              <div className="text-center">
                <div>UNIT</div>
                <div className="text-gray-600">({displayMarketId})</div>
              </div>
              <div className="text-right">
                <div>VOLUME</div>
                <div className="text-gray-600 normal-case">(kWh)</div>
              </div>
            </div>
            <div className="flex-grow overflow-hidden">
              {asks.map((o, i) => (
                <div
                  key={o.id}
                  className={
                    i === 0
                      ? 'grid grid-cols-3 py-0.5 px-4 border-b border-red-500/30 bg-red-500/10'
                      : `grid grid-cols-3 py-0.5 px-4 border-b border-gray-900/50 hover:bg-red-500/10 transition-all ${o.ownedByUser ? 'bg-red-900/20' : ''}`
                  }
                >
                  <div className="text-left text-[11px] self-center text-red-600">
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
              ))}
              {asks.length === 0 && (
                <div className="text-[9px] text-gray-800 text-center py-4">No sell orders</div>
              )}
            </div>
          </div>
        </div>

        {/* ── BSEI Energy Index ── */}
        <div className="px-6 py-4 border-t border-gray-800 bg-black sm:px-2">
          <div className="flex items-center gap-3 mb-3">
            <div className={`text-[10px] tracking-widest font-bold ${colors.title}`}>
              BlackSlon Energy Index (BSEI)
            </div>
            <span className={`text-[10px] uppercase tracking-widest ${colors.label}`}>
              {displayMarketId}
            </span>
            <span className="text-[8px] text-gray-700 ml-auto">
              ω = {displayBsei.omega.toFixed(2)}
            </span>
          </div>
          <div className="flex justify-between items-center font-mono overflow-hidden">
            {displayBsei.history.map((snap, i) => (
              <div
                key={snap.label}
                className={`flex flex-col items-center text-center flex-shrink-0 ${
                  i > 0 && i < displayBsei.history.length
                    ? 'border-r border-gray-900 px-4 sm:px-2'
                    : ''
                }`}
              >
                <span className="text-[9px] text-gray-500">{snap.label}</span>
                <span className="text-[11px] text-gray-400 sm:text-[10px]">
                  {snap.value.toFixed(2)}
                </span>
                <span className={`text-[9px] ${snap.changePct >= 0 ? 'text-green-700' : 'text-red-600'}`}>
                  {snap.changePct >= 0 ? '+' : ''}{snap.changePct.toFixed(1)}%
                </span>
              </div>
            ))}
          </div>

          {/* I_t breakdown: physical meridian vs R-VWAP */}
          <div className="mt-2 flex items-center gap-3 text-[8px] text-gray-700">
            <span>
              I<sub>t</sub>: <span className="text-gray-400">{displayBsei.It.toFixed(4)}</span>
            </span>
            <span className="text-gray-800">·</span>
            <span>P<sub>RVWAP</sub>: <span className="text-gray-500">{displayBsei.pRvwap.toFixed(4)}</span></span>
            <span className="text-gray-800">·</span>
            <span>Anchor (a): <span className="text-gray-500">{displayBsei.anchor.toFixed(4)}</span></span>
            <span className="text-gray-800">·</span>
            <span>
              Spread:{' '}
              <span className={
                Math.abs(displayBsei.It - displayBsei.anchor) / displayBsei.anchor > 0.02
                  ? 'text-amber-700'
                  : 'text-gray-500'
              }>
                {((displayBsei.It - displayBsei.anchor) / displayBsei.anchor * 100).toFixed(3)}%
              </span>
            </span>
          </div>
        </div>

        {/* ── Liquidity ── */}
        <div className="px-6 py-4 border-t border-gray-800 bg-black sm:px-2">
          <div className="flex items-center gap-3 mb-3">
            <div className={`text-[10px] tracking-widest font-bold ${colors.title}`}>
              BlackSlon Liquidity
            </div>
            <span className={`text-[10px] uppercase tracking-widest ${colors.label}`}>
              {displayMarketId}
            </span>
          </div>
          <div className="flex justify-between items-center font-mono overflow-hidden">
            {displayLiquidity.map((snap, i) => (
              <div
                key={snap.label}
                className={`flex flex-col items-center text-center flex-shrink-0 ${
                  i > 0 && i < displayLiquidity.length
                    ? 'border-r border-gray-900 px-4 sm:px-2'
                    : ''
                }`}
              >
                <span className="text-[9px] text-gray-500">{snap.label}</span>
                <span className="text-[11px] text-gray-400 sm:text-[10px]">
                  {snap.value.toLocaleString('de-DE')}
                </span>
                <span className="text-[7px] text-gray-600">MWh</span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  )
}
