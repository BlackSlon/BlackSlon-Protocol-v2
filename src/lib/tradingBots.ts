// src/lib/tradingBots.ts
// BlackSlon Demo — Bot trading system
// Market makers + momentum traders + arbitrage bots

import { v4 as uuidv4 } from 'uuid'

// ─── Types ───────────────────────────────────────────────────────────────────

export interface BotOrder {
  id: string
  botId: string
  marketId: string
  side: 'BUY' | 'SELL'
  price: number
  volume: number
  timestamp: number
  strategy: 'market-maker' | 'momentum' | 'arbitrage'
}

export interface TradeEvent {
  id: string
  timestamp: number
  marketId: string
  side: 'BUY' | 'SELL'
  price: number
  volume: number
  isUserTrade?: boolean
}

export interface BotStrategy {
  id: string
  name: string
  type: 'market-maker' | 'momentum' | 'arbitrage'
  markets: string[]
  config: {
    minSpread: number      // % from anchor
    maxSpread: number      // % from anchor
    minVolume: number     // kWh
    maxVolume: number     // kWh
    updateInterval: number // ms
    aggressiveness: number // 0-1
  }
}

export interface BotManagerCallbacks {
  onOrdersUpdate: (marketId: string, orders: BotOrder[]) => void
  onTrade: (event: TradeEvent) => void
  onPriceUpdate: (marketId: string, price: number) => void
}

// ─── Market Data (mock) ───────────────────────────────────────────────────────

const ANCHOR_PRICES: Record<string, number> = {
  'BS-P-DE': 9.50,
  'BS-P-NO': 9.20,
  'BS-P-PL': 9.80,
  'BS-P-UK': 9.40,
  'BS-G-NL': 3.50,
  'BS-G-DE': 3.60,
  'BS-G-PL': 3.45,
  'BS-G-BG': 3.30,
}

const MARKET_PAIRS: Record<string, string[]> = {
  'BS-P-DE': ['BS-P-PL', 'BS-P-UK'],
  'BS-P-PL': ['BS-P-DE', 'BS-P-NO'],
  'BS-G-NL': ['BS-G-DE', 'BS-G-PL'],
  'BS-G-DE': ['BS-G-NL', 'BS-G-PL'],
}

// ─── Bot Strategies ─────────────────────────────────────────────────────────

const BOT_STRATEGIES: BotStrategy[] = [
  // Market makers - tight spreads around anchor
  {
    id: 'mm-1',
    name: 'Market Maker Alpha',
    type: 'market-maker',
    markets: ['BS-P-DE', 'BS-P-PL', 'BS-G-NL', 'BS-G-DE'],
    config: {
      minSpread: 0.5,    // 0.5% from anchor
      maxSpread: 2.0,    // 2% from anchor
      minVolume: 100,    // 100 kWh
      maxVolume: 500,    // 500 kWh
      updateInterval: 8000 + Math.random() * 7000,  // 8-15 seconds
      aggressiveness: 0.3,
    },
  },
  {
    id: 'mm-2',
    name: 'Market Maker Beta',
    type: 'market-maker',
    markets: ['BS-P-NO', 'BS-P-UK', 'BS-G-PL', 'BS-G-BG'],
    config: {
      minSpread: 0.8,
      maxSpread: 2.5,
      minVolume: 150,
      maxVolume: 600,
      updateInterval: 8000 + Math.random() * 7000,  // 8-15 seconds
      aggressiveness: 0.4,
    },
  },
  // Momentum traders - directional bias
  {
    id: 'mom-1',
    name: 'Momentum Bull',
    type: 'momentum',
    markets: ['BS-P-DE', 'BS-G-NL'],
    config: {
      minSpread: 1.0,
      maxSpread: 4.0,
      minVolume: 200,
      maxVolume: 800,
      updateInterval: 15000 + Math.random() * 10000,  // 15-25 seconds
      aggressiveness: 0.7,
    },
  },
  {
    id: 'mom-2',
    name: 'Momentum Bear',
    type: 'momentum',
    markets: ['BS-P-PL', 'BS-G-DE'],
    config: {
      minSpread: 1.2,
      maxSpread: 3.5,
      minVolume: 180,
      maxVolume: 700,
      updateInterval: 15000 + Math.random() * 10000,  // 15-25 seconds
      aggressiveness: 0.6,
    },
  },
  // Arbitrage bots - cross-market
  {
    id: 'arb-1',
    name: 'Arbitrage Hunter',
    type: 'arbitrage',
    markets: ['BS-P-DE', 'BS-P-PL', 'BS-G-NL', 'BS-G-DE'],
    config: {
      minSpread: 0.3,
      maxSpread: 1.5,
      minVolume: 300,
      maxVolume: 1000,
      updateInterval: 20000 + Math.random() * 15000,  // 20-35 seconds
      aggressiveness: 0.8,
    },
  },
]

// ─── Single Bot Implementation ─────────────────────────────────────────────────

class TradingBot {
  private strategy: BotStrategy
  private callbacks: BotManagerCallbacks
  private orders: Map<string, BotOrder> = new Map()
  private intervalId: NodeJS.Timeout | null = null
  private currentPrice: number = 0
  private priceTrend: 'up' | 'down' | 'neutral' = 'neutral'

  constructor(strategy: BotStrategy, callbacks: BotManagerCallbacks) {
    this.strategy = strategy
    this.callbacks = callbacks
    this.currentPrice = ANCHOR_PRICES[strategy.markets[0]] || 10
  }

  start() {
    this.intervalId = setInterval(() => {
      this.updateOrders()
    }, this.strategy.config.updateInterval)
  }

  stop() {
    if (this.intervalId) {
      clearInterval(this.intervalId)
      this.intervalId = null
    }
  }

  private updateOrders() {
    // Cancel old orders
    this.orders.clear()

    // Update price with some randomness
    this.updatePrice()

    // Generate new orders for each market
    for (const marketId of this.strategy.markets) {
      const anchor = ANCHOR_PRICES[marketId]
      const orders = this.generateOrdersForMarket(marketId, anchor)
      
      for (const order of orders) {
        this.orders.set(order.id, order)
      }
    }

    // Notify callbacks
    this.notifyOrdersUpdate()
  }

  private updatePrice() {
    const volatility = 0.002 // 0.2% per update
    const change = (Math.random() - 0.5) * 2 * volatility
    const newPrice = this.currentPrice * (1 + change)
    
    // Update trend
    if (newPrice > this.currentPrice * 1.001) {
      this.priceTrend = 'up'
    } else if (newPrice < this.currentPrice * 0.999) {
      this.priceTrend = 'down'
    } else {
      this.priceTrend = 'neutral'
    }

    this.currentPrice = newPrice

    // Notify price update for first market
    this.callbacks.onPriceUpdate(this.strategy.markets[0], this.currentPrice)
  }

  private generateOrdersForMarket(marketId: string, anchor: number): BotOrder[] {
    const orders: BotOrder[] = []
    const { config } = this.strategy

    // Market maker: both sides
    if (this.strategy.type === 'market-maker') {
      console.log(`[BOT MANAGER] marketId=${this.strategy.markets[0]}, anchor=${anchor}, minSpread=${config.minSpread}`)
      const buyPrice = anchor * (1 - config.minSpread / 100)
      const sellPrice = anchor * (1 + config.minSpread / 100)
      console.log(`[BOT MANAGER] buyPrice=${buyPrice}, sellPrice=${sellPrice}`)
      const volume = this.randomBetween(config.minVolume, config.maxVolume)

      orders.push(
        {
          id: uuidv4(),
          botId: this.strategy.id,
          marketId,
          side: 'BUY',
          price: buyPrice,
          volume,
          timestamp: Date.now(),
          strategy: this.strategy.type,
        },
        {
          id: uuidv4(),
          botId: this.strategy.id,
          marketId,
          side: 'SELL',
          price: sellPrice,
          volume,
          timestamp: Date.now(),
          strategy: this.strategy.type,
        }
      )
    }

    // Momentum: directional bias
    if (this.strategy.type === 'momentum') {
      const isBull = this.strategy.id.includes('Bull')
      const side = isBull ? 'BUY' : 'SELL'
      const spread = this.randomBetween(config.minSpread, config.maxSpread)
      const price = anchor * (1 + (side === 'BUY' ? -spread : spread) / 100)
      const volume = this.randomBetween(config.minVolume, config.maxVolume)

      orders.push({
        id: uuidv4(),
        botId: this.strategy.id,
        marketId,
        side,
        price,
        volume,
        timestamp: Date.now(),
        strategy: this.strategy.type,
      })
    }

    // Arbitrage: cross-market opportunities
    if (this.strategy.type === 'arbitrage') {
      // Simple arbitrage: place orders at slightly better prices
      const buyPrice = anchor * (1 - config.minSpread / 100)
      const sellPrice = anchor * (1 + config.minSpread / 100)
      const volume = this.randomBetween(config.minVolume, config.maxVolume)

      orders.push(
        {
          id: uuidv4(),
          botId: this.strategy.id,
          marketId,
          side: 'BUY',
          price: buyPrice,
          volume,
          timestamp: Date.now(),
          strategy: this.strategy.type,
        },
        {
          id: uuidv4(),
          botId: this.strategy.id,
          marketId,
          side: 'SELL',
          price: sellPrice,
          volume,
          timestamp: Date.now(),
          strategy: this.strategy.type,
        }
      )
    }

    return orders
  }

  private notifyOrdersUpdate() {
    // Group orders by market from this bot's orders
    const ordersByMarket = new Map<string, BotOrder[]>()
    
    for (const order of Array.from(this.orders.values())) {
      if (!ordersByMarket.has(order.marketId)) {
        ordersByMarket.set(order.marketId, [])
      }
      ordersByMarket.get(order.marketId)!.push(order)
    }

    // Notify for each market
    for (const [marketId, orders] of Array.from(ordersByMarket)) {
      this.callbacks.onOrdersUpdate(marketId, orders)
    }
  }

  private randomBetween(min: number, max: number): number {
    const value = Math.floor(Math.random() * (max - min + 1)) + min
    // Round to nearest 100 to ensure volumes are multiples of 100 kWh
    return Math.round(value / 100) * 100
  }

  // Public getters
  getActiveOrdersForMarket(marketId: string): BotOrder[] {
    return Array.from(this.orders.values()).filter(o => o.marketId === marketId)
  }

  getCurrentPrice(): number {
    return this.currentPrice
  }

  getStrategy(): BotStrategy {
    return this.strategy
  }
}

// ─── Bot Manager ─────────────────────────────────────────────────────────────

export class BotManager {
  private bots: Map<string, TradingBot> = new Map()
  private callbacks: BotManagerCallbacks
  private allOrders: Map<string, BotOrder[]> = new Map()
  private tradeHistory: TradeEvent[] = []
  private stopped: boolean = false
  private tradeTimeoutId: ReturnType<typeof setTimeout> | null = null

  constructor(callbacks: BotManagerCallbacks) {
    this.callbacks = callbacks
  }

  start() {
    this.stopped = false

    // Initialize all bots with order collection callback
    for (const strategy of BOT_STRATEGIES) {
      const bot = new TradingBot(strategy, {
        onOrdersUpdate: (marketId, orders) => this.collectAndNotifyOrders(marketId, orders),
        onTrade: this.callbacks.onTrade,
        onPriceUpdate: this.callbacks.onPriceUpdate,
      })
      this.bots.set(strategy.id, bot)
      bot.start()
    }

    // Single global trade simulation — exactly 1 trade per 5-10 seconds
    const scheduleNextTrade = () => {
      if (this.stopped) return
      const delay = 5000 + Math.random() * 5000 // 5-10 seconds
      this.tradeTimeoutId = setTimeout(() => {
        if (this.stopped) return
        this.simulateTrades()
        scheduleNextTrade()
      }, delay)
    }
    scheduleNextTrade()
  }

  private collectAndNotifyOrders(marketId: string, newOrders: BotOrder[]) {
    // Store orders for this market
    this.allOrders.set(marketId, newOrders)
    
    // Forward to store callback
    this.callbacks.onOrdersUpdate(marketId, newOrders)
  }

  stop() {
    this.stopped = true
    if (this.tradeTimeoutId) {
      clearTimeout(this.tradeTimeoutId)
      this.tradeTimeoutId = null
    }
    for (const bot of Array.from(this.bots.values())) {
      bot.stop()
    }
    this.bots.clear()
  }

  private simulateTrades() {
    // Simulate random trades between bots
    const markets = Object.keys(ANCHOR_PRICES)
    const market = markets[Math.floor(Math.random() * markets.length)]
    const anchor = ANCHOR_PRICES[market]
    
    // Generate trade around current price
    const price = anchor * (1 + (Math.random() - 0.5) * 0.04) // ±2%
    const rawVolume = Math.floor(Math.random() * 400) + 100
    const volume = Math.round(rawVolume / 100) * 100 // Round to nearest 100
    const side = Math.random() > 0.5 ? 'BUY' : 'SELL'

    const trade: TradeEvent = {
      id: uuidv4(),
      timestamp: Date.now(),
      marketId: market,
      side,
      price,
      volume,
      isUserTrade: false,
    }

    this.tradeHistory.push(trade)
    this.callbacks.onTrade(trade)
  }

  // User order matching
  matchUserOrder(userOrder: {
    side: 'BUY' | 'SELL'
    price: number
    quantity: number
    marketId: string
  }) {
    const marketOrders = this.getAllOrdersForMarket(userOrder.marketId)
    const oppositeSide = userOrder.side === 'BUY' ? 'SELL' : 'BUY'
    
    // Find matching orders (price-time priority)
    const matchingOrders = marketOrders
      .filter(o => o.side === oppositeSide)
      .filter(o => {
        if (userOrder.side === 'BUY') {
          return o.price <= userOrder.price
        } else {
          return o.price >= userOrder.price
        }
      })
      .sort((a, b) => {
        if (userOrder.side === 'BUY') {
          return a.price - b.price // Best price first
        } else {
          return b.price - a.price
        }
      })

    if (matchingOrders.length === 0) {
      return { matched: false, reason: 'No matching orders' }
    }

    // Simple fill: take first matching order
    const match = matchingOrders[0]
    const filledQuantity = Math.min(userOrder.quantity, match.volume)
    const avgPrice = match.price

    // Remove matched volume from bot order
    match.volume -= filledQuantity
    if (match.volume <= 0) {
      // Remove order entirely
      const marketOrders = this.allOrders.get(userOrder.marketId) || []
      this.allOrders.set(
        userOrder.marketId,
        marketOrders.filter(o => o.id !== match.id)
      )
    }

    return {
      matched: true,
      filledQuantity,
      avgPrice,
      matchedOrderId: match.id,
    }
  }

  // Getters
  getAllOrdersForMarket(marketId: string): BotOrder[] {
    const orders: BotOrder[] = []
    for (const bot of Array.from(this.bots.values())) {
      orders.push(...bot.getActiveOrdersForMarket(marketId))
    }
    return orders.sort((a, b) => {
      if (a.side === 'BUY' && b.side === 'SELL') return -1
      if (a.side === 'SELL' && b.side === 'BUY') return 1
      return a.price - b.price
    })
  }

  getActiveOrdersForMarket(marketId: string): BotOrder[] {
    return this.getAllOrdersForMarket(marketId)
  }

  getCurrentPrice(marketId: string): number {
    const bot = this.bots.values().next().value
    return bot ? bot.getCurrentPrice() : ANCHOR_PRICES[marketId] || 10
  }

  getAnchorPrice(marketId: string): number {
    return ANCHOR_PRICES[marketId] || 10
  }

  // Bot control
  getBotInfo() {
    return Array.from(this.bots.values()).map(bot => ({
      strategy: bot.getStrategy(),
      currentPrice: bot.getCurrentPrice(),
      activeOrders: Array.from(this.bots.keys()).reduce((sum, botId) => {
        return sum + bot.getActiveOrdersForMarket('BS-P-DE').length
      }, 0),
    }))
  }
}

// ─── Exports ─────────────────────────────────────────────────────────────────

export { BOT_STRATEGIES, ANCHOR_PRICES }
