'use client'

import { useEffect, useRef } from 'react'
import { useVirtual, useBotOrders, useTrading, useUserAccount, useDealConfirmation } from '@/store/blackslon'

// ── Liquidity tiers ────────────────────────────────────────────────────────
const LIQUIDITY_TIERS = {
  high:   { maxConcurrent: 9,  cycleMin: 1500,  cycleMax: 3500,  matchMin: 800,  matchMax: 2000,  firstMin: 400,  firstMax: 900  },
  medium: { maxConcurrent: 5,  cycleMin: 4000,  cycleMax: 8000,  matchMin: 2000, matchMax: 4500,  firstMin: 1000, firstMax: 2500 },
  low:    { maxConcurrent: 2,  cycleMin: 8000,  cycleMax: 16000, matchMin: 3500, matchMax: 7000,  firstMin: 2000, firstMax: 5000 },
}

function getLiquidityTier(marketId: string) {
  if (['BS-G-NL', 'BS-P-DE'].includes(marketId))            return LIQUIDITY_TIERS.high
  if (['BS-G-DE', 'BS-P-UK', 'BS-P-NO'].includes(marketId)) return LIQUIDITY_TIERS.medium
  return LIQUIDITY_TIERS.low // BS-P-PL, BS-G-PL, BS-G-BG
}

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

function randomBetween(min: number, max: number) {
  return min + Math.random() * (max - min)
}

let _counter = 0

/**
 * Try to match a bot trade against a user resting order.
 * Returns true if a user order was matched (fully or partially).
 */
function tryMatchUserOrder(
  botSide: 'BUY' | 'SELL',
  botPrice: number,
  botUnits: number,
  marketId: string,
): boolean {
  const vs = useVirtual.getState()
  const ts = useTrading.getState()

  if (botSide === 'SELL') {
    // Bot selling → can match user BUY orders where bid.price >= botPrice
    const userBids = vs.orderBook.bids.filter(
      (o: any) => o.ownedByUser && o.marketId === marketId && o.price >= botPrice,
    )
    if (userBids.length === 0) return false

    const bestBid = [...userBids].sort((a, b) => b.price - a.price)[0]
    const activeOrder = ts.activeOrders.find((ao) => ao.id === bestBid.id)
    if (!activeOrder) return false

    const matchPrice = bestBid.price
    const matchUnits = Math.min(botUnits, bestBid.units)
    const remainingUserUnits = bestBid.units - matchUnits

    // Trade record (user is the buyer)
    const tradeData = { price: matchPrice, units: matchUnits, volume: matchUnits * 100, timestamp: Date.now(), side: 'BUY' as const }

    // ── Update virtual store: remove/reduce user bid, add to trade history ──
    useVirtual.setState((state) => {
      const prevHistory = state.orderBook.tradeHistoryByMarket?.[marketId] || []
      let newBids = state.orderBook.bids
      if (remainingUserUnits <= 0) {
        newBids = newBids.filter((o) => o.id !== bestBid.id)
      } else {
        newBids = newBids.map((o) =>
          o.id === bestBid.id ? { ...o, units: remainingUserUnits, volume: remainingUserUnits * 100 } : o,
        )
      }
      return {
        orderBook: {
          ...state.orderBook,
          bids: newBids,
          lastTrade: tradeData,
          lastTradeByMarket: { ...state.orderBook.lastTradeByMarket, [marketId]: tradeData },
          tradeHistoryByMarket: { ...state.orderBook.tradeHistoryByMarket, [marketId]: [tradeData, ...prevHistory].slice(0, 20) },
        },
      }
    })

    // ── Update active orders ──
    if (remainingUserUnits <= 0) {
      useTrading.setState((s) => ({ activeOrders: s.activeOrders.filter((o) => o.id !== bestBid.id) }))
    } else {
      useTrading.setState((s) => ({
        activeOrders: s.activeOrders.map((o) =>
          o.id === bestBid.id ? { ...o, quantity: remainingUserUnits } : o,
        ),
      }))
    }

    // ── Update user account: inventory + vault ──
    const fillFraction = matchUnits / activeOrder.quantity
    const releaseBSR = activeOrder.bsrLocked * fillFraction
    const releaseEuro = activeOrder.eEuroLocked * fillFraction
    const feePct =
      activeOrder.bsrStake >= 100 ? 0.0020 :
      activeOrder.bsrStake >= 75  ? 0.0035 :
      activeOrder.bsrStake >= 50  ? 0.0060 :
      activeOrder.bsrStake >= 25  ? 0.0085 : 0.0100
    const feeInEUR = matchPrice * matchUnits * feePct

    useUserAccount.setState((u) => {
      let inv = [...u.inventory]
      const pos = inv.find((p) => p.token === marketId)

      if (pos) {
        const newUnits = pos.units + matchUnits
        const newAvg = newUnits !== 0
          ? (pos.avgPrice * pos.units + matchPrice * matchUnits) / newUnits
          : pos.avgPrice
        const newTranches = [...pos.tranches, { units: matchUnits, bsrStake: activeOrder.bsrStake, avgPrice: matchPrice, timestamp: Date.now() }]
        inv = inv.map((p) =>
          p.token === marketId
            ? { ...p, units: newUnits, quantity: Math.abs(newUnits) * 100, avgPrice: Math.abs(newAvg), lastPrice: matchPrice, pnl: (matchPrice - Math.abs(newAvg)) * newUnits, tranches: newTranches }
            : p,
        )
      } else {
        inv.push({
          token: marketId,
          units: matchUnits,
          quantity: matchUnits * 100,
          avgPrice: matchPrice,
          lastPrice: matchPrice,
          pnl: 0,
          tranches: [{ units: matchUnits, bsrStake: activeOrder.bsrStake, avgPrice: matchPrice, timestamp: Date.now() }],
        })
      }
      inv = inv.filter((p) => p.units !== 0)

      return {
        user: { ...u.user, eEuroBalance: u.user.eEuroBalance - feeInEUR },
        inventory: inv,
        vault: { lockedBSR: Math.max(0, u.vault.lockedBSR - releaseBSR), lockedEuro: Math.max(0, u.vault.lockedEuro - releaseEuro) },
      }
    })

    useDealConfirmation.getState().showDeal({
      side: 'BUY', price: matchPrice, filledQty: matchUnits,
      remainingQty: Math.max(0, remainingUserUnits), marketId, timestamp: Date.now(),
    })
    return true

  } else {
    // Bot buying → can match user SELL orders where ask.price <= botPrice
    const userAsks = vs.orderBook.asks.filter(
      (o: any) => o.ownedByUser && o.marketId === marketId && o.price <= botPrice,
    )
    if (userAsks.length === 0) return false

    const bestAsk = [...userAsks].sort((a, b) => a.price - b.price)[0]
    const activeOrder = ts.activeOrders.find((ao) => ao.id === bestAsk.id)
    if (!activeOrder) return false

    const matchPrice = bestAsk.price
    const matchUnits = Math.min(botUnits, bestAsk.units)
    const remainingUserUnits = bestAsk.units - matchUnits

    const tradeData = { price: matchPrice, units: matchUnits, volume: matchUnits * 100, timestamp: Date.now(), side: 'SELL' as const }

    useVirtual.setState((state) => {
      const prevHistory = state.orderBook.tradeHistoryByMarket?.[marketId] || []
      let newAsks = state.orderBook.asks
      if (remainingUserUnits <= 0) {
        newAsks = newAsks.filter((o) => o.id !== bestAsk.id)
      } else {
        newAsks = newAsks.map((o) =>
          o.id === bestAsk.id ? { ...o, units: remainingUserUnits, volume: remainingUserUnits * 100 } : o,
        )
      }
      return {
        orderBook: {
          ...state.orderBook,
          asks: newAsks,
          lastTrade: tradeData,
          lastTradeByMarket: { ...state.orderBook.lastTradeByMarket, [marketId]: tradeData },
          tradeHistoryByMarket: { ...state.orderBook.tradeHistoryByMarket, [marketId]: [tradeData, ...prevHistory].slice(0, 20) },
        },
      }
    })

    if (remainingUserUnits <= 0) {
      useTrading.setState((s) => ({ activeOrders: s.activeOrders.filter((o) => o.id !== bestAsk.id) }))
    } else {
      useTrading.setState((s) => ({
        activeOrders: s.activeOrders.map((o) =>
          o.id === bestAsk.id ? { ...o, quantity: remainingUserUnits } : o,
        ),
      }))
    }

    const fillFraction = matchUnits / activeOrder.quantity
    const releaseBSR = activeOrder.bsrLocked * fillFraction
    const releaseEuro = activeOrder.eEuroLocked * fillFraction
    const feePct =
      activeOrder.bsrStake >= 100 ? 0.0020 :
      activeOrder.bsrStake >= 75  ? 0.0035 :
      activeOrder.bsrStake >= 50  ? 0.0060 :
      activeOrder.bsrStake >= 25  ? 0.0085 : 0.0100
    const feeInEUR = matchPrice * matchUnits * feePct

    useUserAccount.setState((u) => {
      let inv = [...u.inventory]
      const pos = inv.find((p) => p.token === marketId)

      if (pos) {
        const newUnits = pos.units - matchUnits
        inv = inv.map((p) =>
          p.token === marketId
            ? { ...p, units: newUnits, quantity: Math.abs(newUnits) * 100, lastPrice: matchPrice, pnl: (matchPrice - pos.avgPrice) * newUnits }
            : p,
        )
      } else {
        inv.push({
          token: marketId,
          units: -matchUnits,
          quantity: matchUnits * 100,
          avgPrice: matchPrice,
          lastPrice: matchPrice,
          pnl: 0,
          tranches: [],
        })
      }
      inv = inv.filter((p) => p.units !== 0)

      return {
        user: { ...u.user, eEuroBalance: u.user.eEuroBalance - feeInEUR },
        inventory: inv,
        vault: { lockedBSR: Math.max(0, u.vault.lockedBSR - releaseBSR), lockedEuro: Math.max(0, u.vault.lockedEuro - releaseEuro) },
      }
    })

    useDealConfirmation.getState().showDeal({
      side: 'SELL', price: matchPrice, filledQty: matchUnits,
      remainingQty: Math.max(0, remainingUserUnits), marketId, timestamp: Date.now(),
    })
    return true
  }
}

/**
 * Two-phase bot trading:
 *  Phase 1: Bot places a resting order — visible in the order book.
 *  Phase 2 (1-3s later): Order executes — disappears from book, appears in Last Trades.
 *    → Before phantom execution, checks for matchable user resting orders.
 */
export function useBotTrading(marketId: string) {
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    const anchor = marketPrices[marketId] || 10.00

    const liq = getLiquidityTier(marketId)

    function runBotCycle() {
      // Respect max concurrent orders for this liquidity tier
      const currentBotOrders = useBotOrders.getState().botOrders[marketId] || []
      if (currentBotOrders.length >= liq.maxConcurrent) {
        timerRef.current = setTimeout(runBotCycle, randomBetween(liq.cycleMin, liq.cycleMax))
        return
      }

      const side: 'BUY' | 'SELL' = Math.random() > 0.5 ? 'BUY' : 'SELL'
      const deviation = randomBetween(-0.015, 0.015)
      const price = Math.round((anchor * (1 + deviation)) * 100) / 100
      const units = Math.floor(randomBetween(3, 18))
      const volume = units * 100
      const orderId = `bot-${++_counter}-${Date.now()}`

      // ── Phase 1: add resting order to order book ──────────────────────────
      useBotOrders.setState(s => ({
        botOrders: {
          ...s.botOrders,
          [marketId]: [
            ...(s.botOrders[marketId] || []),
            { id: orderId, price, units, volume, ownedByUser: false, timestamp: Date.now(), side, isBot: true },
          ],
        },
      }))

      // ── Phase 2: execute after tier-appropriate delay ─────────────────────
      const matchDelay = randomBetween(liq.matchMin, liq.matchMax)
      setTimeout(() => {
        // Remove bot order from order book
        useBotOrders.setState(s => ({
          botOrders: {
            ...s.botOrders,
            [marketId]: (s.botOrders[marketId] || []).filter((o: any) => o.id !== orderId),
          },
        }))

        // ── Try to match against user resting orders first ──
        const matched = tryMatchUserOrder(side, price, units, marketId)

        if (!matched) {
          // No user order to match — create phantom trade as before
          const tradeData = { price, units, volume, timestamp: Date.now(), side }
          useVirtual.setState(vs => {
            const prevHistory = vs.orderBook.tradeHistoryByMarket?.[marketId] || []
            const prevConsumedBid = vs.orderBook.consumedBidVolumeByMarket?.[marketId] || 0
            const prevConsumedAsk = vs.orderBook.consumedAskVolumeByMarket?.[marketId] || 0
            return {
              orderBook: {
                ...vs.orderBook,
                lastTrade: tradeData,
                lastTradeByMarket: { ...vs.orderBook.lastTradeByMarket, [marketId]: tradeData },
                tradeHistoryByMarket: {
                  ...vs.orderBook.tradeHistoryByMarket,
                  [marketId]: [tradeData, ...prevHistory].slice(0, 20),
                },
                consumedBidVolumeByMarket: {
                  ...vs.orderBook.consumedBidVolumeByMarket,
                  [marketId]: side === 'SELL' ? prevConsumedBid + units : prevConsumedBid,
                },
                consumedAskVolumeByMarket: {
                  ...vs.orderBook.consumedAskVolumeByMarket,
                  [marketId]: side === 'BUY' ? prevConsumedAsk + units : prevConsumedAsk,
                },
              },
            }
          })
        }
      }, matchDelay)

      // ── Schedule next bot order per tier ─────────────────────────────────
      timerRef.current = setTimeout(runBotCycle, randomBetween(liq.cycleMin, liq.cycleMax))
    }

    // First order after tier-appropriate delay
    timerRef.current = setTimeout(runBotCycle, randomBetween(liq.firstMin, liq.firstMax))

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
      // Clear bot orders for this market on unmount/market change
      useBotOrders.setState(s => ({
        botOrders: { ...s.botOrders, [marketId]: [] },
      }))
    }
  }, [marketId])
}
