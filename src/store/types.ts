export type MarketId = 
  | 'BS-P-PL' | 'BS-P-DE' | 'BS-P-N' | 'BS-P-UK'
  | 'BS-P-IT' | 'BS-P-FR'
  | 'BS-G-NL' | 'BS-G-DE' | 'BS-G-PL' | 'BS-G-BG'
  | 'BS-G-IT' | 'BS-G-AT'

export type SolvencyTier = 'I' | 'II' | 'III' | 'IV'

export type FuseState = 'INACTIVE' | 'ACTIVE' | 'TRIGGERED'

export type LockReason = 'FLOOR_BREACH' | 'CEILING_BREACH' | null

export interface SolvencyState {
  tier: SolvencyTier
  hSolv: number
  emergencyCollateralLock: boolean
}

export interface BSRReserveState {
  pBsr: number
  fuseState: FuseState
}

export interface BSSZState {
  floor: number
  ceiling: number
  isLocked: boolean
  lockReason: LockReason
}

export interface HistoryRow {
  label: string
  value: number
  changePct: number
}

export interface ADRDataPoint {
  date: string
  dayAhead: number | null
  frontMonth: number | null
  month2: number | null
  frontQuarter: number | null
  quarter2: number | null
  cal: number | null
  cal2: number | null
}

export interface BSSZPosition {
  label: string
  refDate: string
  adrData: ADRDataPoint[]
  bssz: {
    anchor: number
    floor: number
    ceiling: number
    trendPct: number | null
  }
}

export interface PhysicalState {
  bssz: BSSZState
  anchor: number
  history: HistoryRow[]
  bsszPositions: BSSZPosition[]
  marketId: MarketId
}

export interface Order {
  id: string
  price: number
  units: number
  volume: number
  ownedByUser: boolean
}

export interface LastTrade {
  price: number
  units: number
  volume: number
  timestamp: number
}

export interface OrderBook {
  bids: Order[]
  asks: Order[]
  lastTrade: LastTrade | null
  lastTradeByMarket: Record<MarketId, LastTrade>
}

export interface BSEISnapshot {
  label: string
  value: number
  changePct: number
}

export interface BSEIState {
  It: number
  omega: number
  pRvwap: number
  anchor: number
  history: BSEISnapshot[]
}

export interface LiquiditySnapshot {
  label: string
  value: number
}

export interface VirtualState {
  orderBook: OrderBook
  bsei: BSEIState
  liquidity: LiquiditySnapshot[]
  marketId: MarketId
}

export interface PendingOrder {
  side: 'BUY' | 'SELL'
  price: number
  quantity: number
  bsrStake: number
  marginPct: number
  totalNotional: number
  tradingFee: number
  bsrDeposit: number
  eEuroDeposit: number
}

export interface ActiveOrder {
  id: string
  side: 'BUY' | 'SELL'
  price: number
  quantity: number
  bsrStake: number
  marginPct: number
  bsrLocked: number
  eEuroLocked: number
  timestamp: number
  marketId: MarketId
}

export interface TradingState {
  pendingOrder: PendingOrder | null
  activeOrders: ActiveOrder[]
  bssz: BSSZState
  solvencyTier: SolvencyTier
  emergencyLock: boolean
  marketId: MarketId
  placeOrder: (side: 'BUY' | 'SELL', price: number, quantity: number, bsrStake: number, marketId: string) => string | null
  setPendingOrder: (side: 'BUY' | 'SELL', price: number, quantity: number, bsrStake: number) => void
  cancelOrder: (orderId: string) => void
}

export interface InventoryItem {
  token: string
  units: number
  quantity: number
  avgPrice: number
  lastPrice: number
  pnl: number
}

export interface VaultState {
  lockedBSR: number
  lockedEuro: number
}

export interface UserData {
  name: string
  id: string
  bsrBalance: number
  eEuroBalance: number
  walletConnected: boolean
  walletAddress?: string
}

export interface UserAccountState {
  user: UserData
  inventory: InventoryItem[]
  vault: VaultState
  solvency: number
  hFactor: number
  bsrEuroRate: number
  setWalletConnected: (connected: boolean) => void
  checkLiquidation: () => Promise<boolean>
  convertTokens: (direction: 'BSR_TO_EURO' | 'EURO_TO_BSR', amount: number) => string | null
}

export interface MarketPanelState {
  currentPrice: number
  activeMarketId: MarketId
  solvency: SolvencyState
  bsrReserve: BSRReserveState
  setMarketId: (id: MarketId) => void
  setCurrentPrice: (price: number) => void
  setSolvency: (solvency: Partial<SolvencyState>) => void
  setBsrReserve: (reserve: Partial<BSRReserveState>) => void
}
