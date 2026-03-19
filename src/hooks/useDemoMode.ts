'use client'
// src/hooks/useDemoMode.ts
// BlackSlon Demo — Master hook łączący boty + login + activity feed
// Użyj tego w src/app/markets/page.tsx

import { useEffect, useRef } from 'react'
import { BotManager, type TradeEvent, type BotOrder } from '@/lib/tradingBots'
import { useTradeHistory } from '@/components/TradeActivityFeed'
import { useDemoUser } from '@/components/DemoLogin'

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useDemoMode() {
  const { user, isLoggedIn, login, reset, updateBalance } = useDemoUser()
  const { trades, addTrade, clearTrades } = useTradeHistory(300)

  // Zustand store actions - disabled
  const setBotOrders = (marketId: string, orders: any[]) => {}
  const setMarketPrice = (marketId: string, price: number) => {}

  const botManagerRef = useRef<BotManager | null>(null)

  // ── Stable callback refs (prevent BotManager re-creation) ─────────────────

  const callbacksRef = useRef({
    onOrdersUpdate: (marketId: string, orders: BotOrder[]) => {},
    onTrade: (event: TradeEvent) => {},
    onPriceUpdate: (marketId: string, price: number) => {},
  })

  // Keep refs up to date without triggering effect
  callbacksRef.current.onOrdersUpdate = (marketId, orders) => setBotOrders?.(marketId, orders)
  callbacksRef.current.onTrade = (event) => addTrade(event)
  callbacksRef.current.onPriceUpdate = (marketId, price) => setMarketPrice?.(marketId, price)

  // ── BotManager lifecycle — runs ONCE ──────────────────────────────────────

  useEffect(() => {
    const manager = new BotManager({
      onOrdersUpdate: (marketId, orders) => callbacksRef.current.onOrdersUpdate(marketId, orders),
      onTrade: (event) => callbacksRef.current.onTrade(event),
      onPriceUpdate: (marketId, price) => callbacksRef.current.onPriceUpdate(marketId, price),
    })

    manager.start()
    botManagerRef.current = manager

    return () => {
      manager.stop()
      botManagerRef.current = null
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // ── User order matching ─────────────────────────────────────────────────────

  function placeUserOrder(order: {
    side: 'BUY' | 'SELL'
    price: number
    quantity: number
    marketId: string
    bsrRatio: number   // 0-100 → tier
  }) {
    if (!isLoggedIn || !botManagerRef.current) return null

    const manager = botManagerRef.current

    // Sprawdź BSSZ
    const anchor = manager.getAnchorPrice(order.marketId)
    const floor  = anchor * 0.90
    const ceil   = anchor * 1.20
    if (order.price < floor || order.price > ceil) {
      return { error: 'Price outside BSSZ corridor' }
    }

    // Oblicz margin
    const marginPct = getMarginPct(order.bsrRatio, order.side)
    const margin    = order.price * order.quantity * marginPct / 100
    const fee       = order.price * order.quantity * getFeePct(order.bsrRatio) / 100
    const totalCost = margin + fee

    // Sprawdź balans
    const bsrCost   = totalCost * (order.bsrRatio / 100)
    const euroCost  = totalCost * (1 - order.bsrRatio / 100)

    if (!user) return { error: 'Not logged in' }
    if (user.bsrBalance < bsrCost) return { error: 'Insufficient €BSR balance' }
    if (user.eEuroBalance < euroCost) return { error: 'Insufficient eEURO balance' }

    // Próba matchowania z botami
    const result = manager.matchUserOrder(order)

    // Emituj user trade event
    if (result.matched) {
      addTrade({
        id: crypto.randomUUID(),
        timestamp: Date.now(),
        marketId: order.marketId,
        side: order.side,
        price: result.avgPrice || order.price,
        volume: result.filledQuantity || 0,
        isUserTrade: true,
      })

      // Zaktualizuj balans (uproszczony — bez pełnego settlement)
      updateBalance(-bsrCost, -euroCost)
    }

    return { result, margin, fee, totalCost }
  }

  // ── Reset ───────────────────────────────────────────────────────────────────

  function handleReset() {
    clearTrades()
    reset()
  }

  // ── Getters ─────────────────────────────────────────────────────────────────

  function getCurrentPrice(marketId: string): number {
    return botManagerRef.current?.getCurrentPrice(marketId) ?? 0
  }

  function getBotOrdersForMarket(marketId: string): BotOrder[] {
    return botManagerRef.current?.getActiveOrdersForMarket(marketId) ?? []
  }

  return {
    // User
    user,
    isLoggedIn,
    login,
    reset: handleReset,
    updateBalance,

    // Trades
    trades,

    // Orders
    placeUserOrder,
    getBotOrdersForMarket,
    getCurrentPrice,
  }
}

// ─── Tier Matrix helpers ──────────────────────────────────────────────────────

function getMarginPct(bsrRatio: number, side: 'BUY' | 'SELL'): number {
  // bsrRatio: 0–100
  const tier = Math.floor(bsrRatio / 25)  // 0,1,2,3,4
  const longMargins  = [50, 45, 40, 30, 25]
  const shortMargins = [100, 90, 80, 60, 50]
  const idx = Math.min(tier, 4)
  return side === 'BUY' ? longMargins[idx] : shortMargins[idx]
}

function getFeePct(bsrRatio: number): number {
  const fees = [1.00, 0.85, 0.60, 0.35, 0.20]
  const idx = Math.min(Math.floor(bsrRatio / 25), 4)
  return fees[idx]
}
