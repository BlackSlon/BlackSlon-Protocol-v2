import { create } from 'zustand'
import type { MarketPanelState, MarketId, SolvencyState, BSRReserveState, PhysicalState, VirtualState, TradingState, PendingOrder, UserAccountState, PositionTranche } from './types'
import { getMarketData } from '@/data/markets/loader'
import { generateOrderBook } from '@/data/markets/orderBookGenerator'

export interface DealConfirmation {
  side: 'BUY' | 'SELL'
  price: number
  filledQty: number
  remainingQty: number
  marketId: string
  timestamp: number
}

interface DealConfirmationState {
  deal: DealConfirmation | null
  showDeal: (deal: DealConfirmation) => void
  clearDeal: () => void
}

export const useDealConfirmation = create<DealConfirmationState>((set) => ({
  deal: null,
  showDeal: (deal) => set({ deal }),
  clearDeal: () => set({ deal: null }),
}))

export const useMarketPanel = create<MarketPanelState>((set, get) => ({
  currentPrice: 9.938, // BS-P-PL default
  activeMarketId: 'BS-P-PL',
  solvency: {
    tier: 'I',
    hSolv: 1.250,
    emergencyCollateralLock: false,
  },
  bsrReserve: {
    pBsr: 2.4500,
    fuseState: 'INACTIVE',
  },
  setMarketId: (id: MarketId) => {
    const marketPrices: Record<string, number> = {
      'BS-G-NL': 4.43,
      'BS-G-DE': 4.50,
      'BS-G-PL': 4.78,
      'BS-G-BG': 4.13,
      'BS-P-DE': 9.121,
      'BS-P-NO': 4.972,
      'BS-P-PL': 9.938,
      'BS-P-UK': 8.773,
    }
    set({ activeMarketId: id, currentPrice: marketPrices[id] || 10.59 })
  },
  setCurrentPrice: (price: number) => set({ currentPrice: price }),
  setSolvency: (solvency: Partial<SolvencyState>) =>
    set((state) => ({ solvency: { ...state.solvency, ...solvency } })),
  setBsrReserve: (reserve: Partial<BSRReserveState>) =>
    set((state) => ({ bsrReserve: { ...state.bsrReserve, ...reserve } })),
}))

export const usePhysical = create<PhysicalState>(() => {
  const marketData = getMarketData('BS-G-NL') as any
  const positions = marketData?.bsszPositions || []
  const anchor = positions[0]?.bssz?.anchor || 10.59
  return {
    bssz: { floor: anchor * 0.90, ceiling: anchor * 1.20, isLocked: false, lockReason: null },
    anchor,
    history: [
      { label: 'D-1', value: 10.55, changePct: 6.0 },
      { label: 'W-1', value: 10.42, changePct: 7.5 },
      { label: 'M-1', value: 9.80,  changePct: 16.9 },
      { label: 'Q-1', value: 9.50,  changePct: 15.0 },
      { label: 'H-1', value: 9.20,  changePct: 19.7 },
      { label: 'Y-1', value: 8.50,  changePct: 24.5 },
    ],
    bsszPositions: positions,
    marketId: 'BS-G-NL',
  }
})

export const useVirtual = create<VirtualState>(() => ({
  orderBook: {
    bids: [
      { id: '1', price: 10.55, units: 150, volume: 15000, ownedByUser: false, timestamp: Date.now() - 8000 },
      { id: '2', price: 10.54, units: 120, volume: 12000, ownedByUser: false, timestamp: Date.now() - 7000 },
      { id: '3', price: 10.53, units: 180, volume: 18000, ownedByUser: false, timestamp: Date.now() - 6000 },
      { id: '4', price: 10.52, units: 95,  volume: 9500,  ownedByUser: false, timestamp: Date.now() - 5000 },
      { id: '5', price: 10.51, units: 200, volume: 20000, ownedByUser: false, timestamp: Date.now() - 4000 },
      { id: '6', price: 10.50, units: 135, volume: 13500, ownedByUser: false, timestamp: Date.now() - 3000 },
      { id: '7', price: 10.49, units: 165, volume: 16500, ownedByUser: false, timestamp: Date.now() - 2000 },
      { id: '8', price: 10.48, units: 110, volume: 11000, ownedByUser: false, timestamp: Date.now() - 1000 },
    ],
    asks: [
      { id: '9',  price: 10.60, units: 110, volume: 11000, ownedByUser: false, timestamp: Date.now() - 8000 },
      { id: '10', price: 10.61, units: 85,  volume: 8500,  ownedByUser: false, timestamp: Date.now() - 7000 },
      { id: '11', price: 10.62, units: 140, volume: 14000, ownedByUser: false, timestamp: Date.now() - 6000 },
      { id: '12', price: 10.63, units: 75,  volume: 7500,  ownedByUser: false, timestamp: Date.now() - 5000 },
      { id: '13', price: 10.64, units: 160, volume: 16000, ownedByUser: false, timestamp: Date.now() - 4000 },
      { id: '14', price: 10.65, units: 125, volume: 12500, ownedByUser: false, timestamp: Date.now() - 3000 },
      { id: '15', price: 10.66, units: 190, volume: 19000, ownedByUser: false, timestamp: Date.now() - 2000 },
      { id: '16', price: 10.67, units: 105, volume: 10500, ownedByUser: false, timestamp: Date.now() - 1000 },
    ],
    lastTrade: { price: 10.59, units: 10, volume: 1000, timestamp: Date.now() },
    lastTradeByMarket: {} as Record<string, any>,
  },
  bsei: {
    It: 10.59, omega: 0.80, pRvwap: 10.58, anchor: 10.59,
    history: [
      { label: 'D-1', value: 10.59, changePct: 4.2 },
      { label: 'W-1', value: 10.72, changePct: 3.1 },
      { label: 'M-1', value: 10.85, changePct: 2.4 },
      { label: 'Q-1', value: 10.95, changePct: 1.8 },
      { label: 'H-1', value: 11.02, changePct: 1.2 },
      { label: 'Y-1', value: 9.87,  changePct: 5.8 },
    ],
  },
  liquidity: [
    { label: 'D-1', value: 1245 },
    { label: 'W-1', value: 8715 },
    { label: 'M-1', value: 37440 },
    { label: 'Q-1', value: 112320 },
    { label: 'H-1', value: 224640 },
    { label: 'Y-1', value: 449280 },
  ],
  marketId: 'BS-P-PL',
}))

// ─── Market-aware order book builder ─────────────────────────────────────────
// Returns the FULL visible order book for a given market — generated (market-maker)
// orders + any user-placed resting orders. This is exactly what VirtualDimension
// renders, so the matching engine sees the same book as the user.
function getFullOrderBook(marketId: string) {
  const md = getMarketData(marketId as MarketId) as any
  const marketPrices: Record<string, number> = {
    'BS-G-NL': 4.43,
    'BS-G-DE': 4.50,
    'BS-G-PL': 4.78,
    'BS-G-BG': 4.13,
    'BS-P-DE': 9.121,
    'BS-P-NO': 4.972,
    'BS-P-PL': 9.938,
    'BS-P-UK': 8.773,
  }
  const anchor: number =
    md?.bsszPositions?.[0]?.bssz?.anchor ??
    md?.bsszCalculation?.anchor ??
    marketPrices[marketId] ??
    10.59

  // Generated market-maker orders (recreated on every call, not persisted)
  const generated = generateOrderBook(anchor, marketId)
  const genBids = generated.bids.map(o => ({ ...o, marketId }))
  const genAsks = generated.asks.map(o => ({ ...o, marketId }))

  // User resting orders from the virtual store (tagged with marketId when placed)
  const vs = useVirtual.getState()
  const userBids = vs.orderBook.bids.filter(o => (o as any).marketId === marketId)
  const userAsks = vs.orderBook.asks.filter(o => (o as any).marketId === marketId)

  return {
    bids: [...genBids, ...userBids].sort((a, b) => {
      if (b.price !== a.price) return b.price - a.price
      return a.timestamp - b.timestamp // FIFO - earlier orders first
    }),
    asks: [...genAsks, ...userAsks].sort((a, b) => {
      if (a.price !== b.price) return a.price - b.price
      return a.timestamp - b.timestamp // FIFO - earlier orders first
    }),
    anchor,
  }
}

export const useTrading = create<TradingState>((set, get) => {
  const marketPanel = useMarketPanel.getState()
  const activeMarketId = marketPanel.activeMarketId || 'BS-P-PL'
  const marketPrices: Record<string, number> = {
    'BS-G-NL': 4.43,
    'BS-G-DE': 4.50,
    'BS-G-PL': 4.78,
    'BS-G-BG': 4.13,
    'BS-P-DE': 9.121,
    'BS-P-NO': 4.972,
    'BS-P-PL': 9.938,
    'BS-P-UK': 8.773,
  }
  const anchor = marketPrices[activeMarketId] || 10.59
  return {
    pendingOrder: null,
    activeOrders: [],
    bssz: { floor: anchor * 0.90, ceiling: anchor * 1.20, isLocked: false, lockReason: null },
    solvencyTier: 'I',
    emergencyLock: false,
    marketId: 'BS-P-PL',

    setPendingOrder: (side, price, quantity, bsrStake) => {
      const state = get()
      const us = useUserAccount.getState()
      
      // Check current position in this market
      const currentPosition = us.inventory.find(p => p.token === state.marketId)
      const currentUnits = currentPosition?.units || 0
      
      // Calculate net position change
      let netPositionChange = 0
      if (side === 'BUY') {
        if (currentUnits < 0) {
          // Closing short - no deposit up to short amount
          netPositionChange = Math.max(0, quantity + currentUnits)
        } else {
          // Opening/adding to long
          netPositionChange = quantity
        }
      } else {
        if (currentUnits > 0) {
          // Selling owned - no deposit up to owned amount
          netPositionChange = Math.max(0, quantity - currentUnits)
        } else {
          // Opening/adding to short
          netPositionChange = quantity
        }
      }

      const totalNotional = price * quantity
      const { bsrEuroRate } = useUserAccount.getState()

      let marginPct: number
      if (side === 'BUY') {
        if (bsrStake >= 100) marginPct = 25
        else if (bsrStake >= 75) marginPct = 30
        else if (bsrStake >= 50) marginPct = 40
        else if (bsrStake >= 25) marginPct = 45
        else marginPct = 50
      } else {
        if (bsrStake >= 100) marginPct = 50
        else if (bsrStake >= 75) marginPct = 60
        else if (bsrStake >= 50) marginPct = 80
        else if (bsrStake >= 25) marginPct = 90
        else marginPct = 100
      }

      const feePct =
        bsrStake >= 100 ? 0.0020 :
        bsrStake >= 75  ? 0.0035 :
        bsrStake >= 50  ? 0.0060 :
        bsrStake >= 25  ? 0.0085 : 0.0100

      const tradingFee = totalNotional * feePct
      
      // Only calculate deposits for net new position
      const netNotional = price * netPositionChange
      const marginRequired = netPositionChange > 0 ? (netNotional * marginPct) / 100 : 0
      const bsrDepositEUR  = (marginRequired * bsrStake) / 100
      const eEuroDeposit   = (marginRequired * (100 - bsrStake)) / 100
      const bsrDeposit     = bsrDepositEUR / bsrEuroRate

      set({ pendingOrder: { side, price, quantity, bsrStake, marginPct, totalNotional, tradingFee, bsrDeposit, eEuroDeposit } })
    },

    placeOrder: (side, price, quantity, bsrStake, marketId) => {
      const state = get()
      const us = useUserAccount.getState()

      // ── Protocol guards ───────────────────────────────────────────────────
      if (state.solvencyTier === 'IV')
        return 'Tier IV Safeguard: New positions blocked'
      if (state.solvencyTier === 'III' && bsrStake > 0)
        return 'Tier III: Only eEURO collateral allowed'

      // ── Check inventory for this market ──────────────────────────────────
      const currentPosition = us.inventory.find(p => p.token === marketId)
      const currentUnits = currentPosition?.units || 0
      
      // Calculate net position change
      let netPositionChange = 0
      if (side === 'BUY') {
        // BUY increases position (or reduces short)
        if (currentUnits < 0) {
          // Closing short position - no deposit needed up to the short amount
          netPositionChange = Math.max(0, quantity + currentUnits)
        } else {
          // Opening new long or adding to long
          netPositionChange = quantity
        }
      } else {
        // SELL decreases position (or opens short)
        if (currentUnits > 0) {
          // Selling owned tokens - no deposit needed up to owned amount
          netPositionChange = Math.max(0, quantity - currentUnits)
        } else {
          // Opening new short or adding to short
          netPositionChange = quantity
        }
      }

      // ── Margin calc (only for net new position) ──────────────────────────
      const totalNotional = price * netPositionChange
      let marginPct: number
      if (side === 'BUY') {
        if (bsrStake >= 100) marginPct = 25
        else if (bsrStake >= 75) marginPct = 30
        else if (bsrStake >= 50) marginPct = 40
        else if (bsrStake >= 25) marginPct = 45
        else marginPct = 50
      } else {
        if (bsrStake >= 100) marginPct = 50
        else if (bsrStake >= 75) marginPct = 60
        else if (bsrStake >= 50) marginPct = 80
        else if (bsrStake >= 25) marginPct = 90
        else marginPct = 100
      }

      // Only calculate deposits for net new position
      const marginRequired = netPositionChange > 0 ? (totalNotional * marginPct) / 100 : 0
      const bsrDepositEUR  = (marginRequired * bsrStake) / 100
      const eEuroDeposit   = (marginRequired * (100 - bsrStake)) / 100
      const bsrNeeded      = bsrDepositEUR / us.bsrEuroRate

      // ── Balance checks (only if deposit needed) ───────────────────────────
      if (netPositionChange > 0) {
        if (bsrNeeded > us.user.bsrBalance)
          return `Insufficient €BSR. Required: ${bsrNeeded.toFixed(2)}, Available: ${us.user.bsrBalance.toFixed(2)}`
        if (eEuroDeposit > us.user.eEuroBalance)
          return `Insufficient eEURO. Required: ${eEuroDeposit.toFixed(2)}, Available: ${us.user.eEuroBalance.toFixed(2)}`
      }

      // ── H_user pre-check ─────────────────────────────────────────────────
      const newLockedBSR  = us.vault.lockedBSR + bsrNeeded
      const newLockedEuro = us.vault.lockedEuro + eEuroDeposit
      const equity =
        (us.user.bsrBalance - bsrNeeded) * us.bsrEuroRate +
        (us.user.eEuroBalance - eEuroDeposit) +
        us.inventory.reduce((s, p) => s + p.pnl, 0)
      const newHFactor = equity / ((newLockedBSR * us.bsrEuroRate + newLockedEuro) * 0.5)
      if (newHFactor < 1.0)
        return `Trade rejected: would push H_user to ${newHFactor.toFixed(2)} (min 1.00)`

      // ── MATCHING ENGINE ───────────────────────────────────────────────────
      // getFullOrderBook returns the same book VirtualDimension renders:
      // generated market-maker orders (anchored to this market's BSSZ) +
      // any user-placed resting orders.
      const { bids: bookBids, asks: bookAsks } = getFullOrderBook(marketId)

      let remainingQty = quantity
      let filledQty    = 0
      let fillPrice    = price

      if (side === 'BUY') {
        // Walk asks cheapest-first; match while ask.price <= buy.price
        const sortedAsks = [...bookAsks].sort((a, b) => {
          if (a.price !== b.price) return a.price - b.price
          return a.timestamp - b.timestamp // FIFO - earlier orders first
        })
        const survivingUserAsks: typeof sortedAsks = []

        for (const ask of sortedAsks) {
          if (remainingQty <= 0 || ask.price > price) {
            if ((ask as any).ownedByUser) survivingUserAsks.push(ask)
            continue
          }
          // ✓ Match
          fillPrice = ask.price
          const fill = Math.min(remainingQty, ask.units)
          filledQty    += fill
          remainingQty -= fill

          if (ask.units > fill && (ask as any).ownedByUser) {
            // Partially consumed user ask — keep remainder
            survivingUserAsks.push({ ...ask, units: ask.units - fill, volume: (ask.units - fill) * 100 })
          }
          // Generated asks are not persisted — they simply won't appear next render
        }

        if (filledQty > 0) {
          const tradeData = { price: fillPrice, units: filledQty, volume: filledQty * 100, timestamp: Date.now() }
          useVirtual.setState(vs => ({
            orderBook: {
              ...vs.orderBook,
              asks: survivingUserAsks,   // only user resting asks persist
              lastTrade: tradeData,
              lastTradeByMarket: { ...vs.orderBook.lastTradeByMarket, [marketId]: tradeData },
            },
          }))
          useDealConfirmation.getState().showDeal({ side: 'BUY', price: fillPrice, filledQty, remainingQty, marketId, timestamp: Date.now() })
        }

        if (remainingQty > 0) {
          const resting = { id: `user-${Date.now()}`, price, units: remainingQty, volume: remainingQty * 100, ownedByUser: true, marketId, timestamp: Date.now() }
          useVirtual.setState(vs => ({ orderBook: { ...vs.orderBook, bids: [...vs.orderBook.bids, resting].sort((a, b) => {
            if (b.price !== a.price) return b.price - a.price
            return a.timestamp - b.timestamp // FIFO - earlier orders first
          }) } }))
          set(s => ({ activeOrders: [...s.activeOrders, { id: resting.id, side, price, quantity: remainingQty, bsrStake, marginPct, bsrLocked: bsrNeeded * (remainingQty / quantity), eEuroLocked: eEuroDeposit * (remainingQty / quantity), timestamp: Date.now(), marketId: marketId as MarketId }] }))
        }

      } else {
        // SELL — walk bids highest-first; match while bid.price >= sell.price
        const sortedBids = [...bookBids].sort((a, b) => {
          if (b.price !== a.price) return b.price - a.price
          return a.timestamp - b.timestamp // FIFO - earlier orders first
        })
        const survivingUserBids: typeof sortedBids = []

        for (const bid of sortedBids) {
          if (remainingQty <= 0 || bid.price < price) {
            if ((bid as any).ownedByUser) survivingUserBids.push(bid)
            continue
          }
          fillPrice = bid.price
          const fill = Math.min(remainingQty, bid.units)
          filledQty    += fill
          remainingQty -= fill
          if (bid.units > fill && (bid as any).ownedByUser) {
            survivingUserBids.push({ ...bid, units: bid.units - fill, volume: (bid.units - fill) * 100 })
          }
        }

        if (filledQty > 0) {
          const tradeData = { price: fillPrice, units: filledQty, volume: filledQty * 100, timestamp: Date.now() }
          useVirtual.setState(vs => ({
            orderBook: {
              ...vs.orderBook,
              bids: survivingUserBids,
              lastTrade: tradeData,
              lastTradeByMarket: { ...vs.orderBook.lastTradeByMarket, [marketId]: tradeData },
            },
          }))
          useDealConfirmation.getState().showDeal({ side: 'SELL', price: fillPrice, filledQty, remainingQty, marketId, timestamp: Date.now() })
        }

        if (remainingQty > 0) {
          const resting = { id: `user-${Date.now()}`, price, units: remainingQty, volume: remainingQty * 100, ownedByUser: true, marketId, timestamp: Date.now() }
          useVirtual.setState(vs => ({ orderBook: { ...vs.orderBook, asks: [...vs.orderBook.asks, resting].sort((a, b) => {
            if (a.price !== b.price) return a.price - b.price
            return a.timestamp - b.timestamp // FIFO - earlier orders first
          }) } }))
          set(s => ({ activeOrders: [...s.activeOrders, { id: resting.id, side, price, quantity: remainingQty, bsrStake, marginPct, bsrLocked: bsrNeeded * (remainingQty / quantity), eEuroLocked: eEuroDeposit * (remainingQty / quantity), timestamp: Date.now(), marketId: marketId as MarketId }] }))
        }
      }

      // ── Update user account ───────────────────────────────────────────────
      useUserAccount.setState(u => {
        let inv = [...u.inventory]
        const pos = inv.find(p => p.token === marketId)
        
        if (filledQty > 0) {
          if (pos) {
            const newUnits = side === 'BUY' ? pos.units + filledQty : pos.units - filledQty
            const newAvg   = side === 'BUY' ? (pos.avgPrice * pos.units + fillPrice * filledQty) / (newUnits || 1) : pos.avgPrice
            
            // Add new tranche for BUY orders
            let newTranches = [...pos.tranches]
            if (side === 'BUY') {
              newTranches.push({ units: filledQty, bsrStake, avgPrice: fillPrice, timestamp: Date.now() })
            }
            
            inv = inv.map(p => p.token === marketId
              ? { ...p, units: newUnits, quantity: Math.abs(newUnits) * 100, avgPrice: Math.abs(newAvg), lastPrice: fillPrice, pnl: (fillPrice - Math.abs(newAvg)) * newUnits, tranches: newTranches }
              : p)
          } else {
            inv.push({ 
              token: marketId, 
              units: side === 'BUY' ? filledQty : -filledQty, 
              quantity: filledQty * 100, 
              avgPrice: fillPrice, 
              lastPrice: fillPrice, 
              pnl: 0,
              tranches: side === 'BUY' ? [{ units: filledQty, bsrStake, avgPrice: fillPrice, timestamp: Date.now() }] : []
            })
          }
        }
        // Remove positions with zero units
        inv = inv.filter(p => p.units !== 0)
        
        // Calculate weighted average BSR ratio for fee calculation
        const getWeightedBsrStake = (tranches: PositionTranche[], closingUnits: number) => {
          if (tranches.length === 0) return bsrStake
          
          let totalWeightedStake = 0
          let totalUnits = 0
          let remainingToClose = Math.abs(closingUnits)
          
          // For closing positions, calculate weighted average of all open tranches
          for (const tranche of tranches) {
            if (remainingToClose <= 0) break
            const trancheUnits = Math.min(tranche.units, remainingToClose)
            totalWeightedStake += tranche.bsrStake * trancheUnits
            totalUnits += trancheUnits
            remainingToClose -= trancheUnits
          }
          
          return totalUnits > 0 ? totalWeightedStake / totalUnits : bsrStake
        }
        
        const weightedBsrStake = getWeightedBsrStake(pos?.tranches || [], side === 'SELL' ? filledQty : 0)
        
        // Calculate and deduct trading fee from eEURO balance
        const feePct =
          weightedBsrStake >= 100 ? 0.0020 :
          weightedBsrStake >= 75  ? 0.0035 :
          weightedBsrStake >= 50  ? 0.0060 :
          weightedBsrStake >= 25  ? 0.0085 : 0.0100
        const feeInEUR = (fillPrice * filledQty) * feePct
        const newEuroBalance = u.user.eEuroBalance - eEuroDeposit - feeInEUR
        
        return {
          user: { ...u.user, bsrBalance: u.user.bsrBalance - bsrNeeded, eEuroBalance: newEuroBalance },
          inventory: inv,
          vault: { lockedBSR: newLockedBSR, lockedEuro: newLockedEuro },
          hFactor: newHFactor,
          solvency: newHFactor > 1.15 ? 1.25 : newHFactor > 1.05 ? 1.10 : newHFactor > 1.00 ? 1.02 : 0.95,
        }
      })

      return null
    },

    cancelOrder: (orderId) => {
      const order = get().activeOrders.find(o => o.id === orderId)
      if (!order) return
      set(s => ({ activeOrders: s.activeOrders.filter(o => o.id !== orderId) }))
      useUserAccount.setState(u => ({
        user: { ...u.user, bsrBalance: u.user.bsrBalance + order.bsrLocked, eEuroBalance: u.user.eEuroBalance + order.eEuroLocked },
        vault: { lockedBSR: u.vault.lockedBSR - order.bsrLocked, lockedEuro: u.vault.lockedEuro - order.eEuroLocked },
      }))
      useVirtual.setState(vs => ({
        orderBook: {
          ...vs.orderBook,
          bids: vs.orderBook.bids.filter(o => o.id !== orderId),
          asks: vs.orderBook.asks.filter(o => o.id !== orderId),
        },
      }))
    },
  }
})

export const useUserAccount = create<UserAccountState>((set, get) => ({
  user: {
    name: 'BS-PRO-001', id: 'BS-PRO-001',
    bsrBalance: 3200.00, eEuroBalance: 12450.00,
    walletConnected: false, walletAddress: undefined,
  },
  inventory: [
    { token: 'BS-P-PL', units: 30, quantity: 3000, avgPrice: 10.45, lastPrice: 10.59, pnl: 420.00, 
      tranches: [{ units: 30, bsrStake: 50, avgPrice: 10.45, timestamp: Date.now() - 86400000 }] },
    { token: 'BS-G-NL', units: 45, quantity: 4500, avgPrice: 4.80,  lastPrice: 4.85,  pnl: 225.00,
      tranches: [{ units: 45, bsrStake: 75, avgPrice: 4.80, timestamp: Date.now() - 172800000 }] },
    { token: 'BS-G-DE', units: 22, quantity: 2200, avgPrice: 4.90,  lastPrice: 4.85,  pnl: -110.00,
      tranches: [{ units: 22, bsrStake: 25, avgPrice: 4.90, timestamp: Date.now() - 259200000 }] },
  ],
  vault: { lockedBSR: 1250.40, lockedEuro: 450.00 },
  solvency: 1.25,   // H_solv ratio (Tier I > 1.15)
  hFactor: 2.48,
  bsrEuroRate: 2.45,
  setWalletConnected: (connected) =>
    set(s => ({
      user: { ...s.user, walletConnected: connected, walletAddress: connected ? '0x4aB3c1D2e5F6a7B8c9D0e1F2a3B4c5D6e7F8a9B0' : undefined },
    })),
  checkLiquidation: async () => {
    await new Promise(r => setTimeout(r, 1200))
    return get().hFactor < 1.0
  },
  convertTokens: (direction, amount) => {
    const s = get()
    if (amount <= 0) return 'Invalid amount'
    if (direction === 'BSR_TO_EURO') {
      if (amount > s.user.bsrBalance) return `Insufficient €BSR. Available: ${s.user.bsrBalance.toFixed(2)}`
      set(u => ({ user: { ...u.user, bsrBalance: u.user.bsrBalance - amount, eEuroBalance: u.user.eEuroBalance + amount * u.bsrEuroRate } }))
      return null
    } else {
      if (amount > s.user.eEuroBalance) return `Insufficient eEURO. Available: ${s.user.eEuroBalance.toFixed(2)}`
      set(u => ({ user: { ...u.user, eEuroBalance: u.user.eEuroBalance - amount, bsrBalance: u.user.bsrBalance + amount / u.bsrEuroRate } }))
      return null
    }
  },
}))
