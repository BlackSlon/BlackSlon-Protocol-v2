import { MarketId, BSSZPosition } from '@/store/types'
import bsPPL from './BS-P-PL.json'
import bsGNL from './BS-G-NL.json'

export interface MarketHistoricalData {
  date: string
  price: number
  volume: number
}

export interface MarketData {
  marketId: string
  marketName: string
  commodity: string
  country: string
  currency: string
  unit: string
  lastUpdate: string
  lastTrade?: {
    price: number
    units: number
    volume: number
    timestamp: number
  }
  bsszPositions?: BSSZPosition[]
  historicalData?: MarketHistoricalData[]
  bsszCalculation?: {
    anchor: number
    floor: number
    ceiling: number
    method: string
    floorFormula: string
    ceilingFormula: string
  }
}

const markets: Record<string, MarketData> = {
  'BS-P-PL': bsPPL as MarketData,
  'BS-P-DE': bsPPL as MarketData,
  'BS-P-NO': bsPPL as MarketData,
  'BS-P-UK': bsPPL as MarketData,
  'BS-G-NL': bsGNL as MarketData,
  'BS-G-DE': bsGNL as MarketData,
  'BS-G-PL': bsGNL as MarketData,
  'BS-G-BG': bsGNL as MarketData,
  'BS-P-IT': bsPPL as MarketData,
  'BS-P-FR': bsPPL as MarketData,
  'BS-G-IT': bsGNL as MarketData,
  'BS-G-AT': bsGNL as MarketData,
}

export function getMarketData(marketId: MarketId): MarketData | null {
  return markets[marketId] || null
}

export function getAllMarkets(): MarketData[] {
  return Object.values(markets)
}

export { bsPPL, bsGNL }
