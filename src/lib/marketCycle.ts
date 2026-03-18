import cycleData from '@/data/markets/cycle-data.json'

// Cycle day 1 starts on 2026-03-18 00:00:00 UTC
const CYCLE_BASE_MS = Date.UTC(2026, 2, 18, 0, 0, 0)
const CYCLE_LENGTH = 7

export interface CycleDayData {
  day: number
  date_ref: string
  label: string
  DA: number
  FM: number
  FQ: number
  Cal: number | null
  anchor: number
  floor: number
  ceiling: number
}

export interface CycleBsszPosition {
  label: string
  refDate: string
  adrData: never[]
  bssz: {
    anchor: number
    floor: number
    ceiling: number
    trendPct: number | null
  }
}

export interface HistoricalData {
  DA: number
  FM: number
  FQ: number
  Cal: number | null
}

/**
 * Returns the current cycle day number (1–7).
 * Advances every 24 hours from CYCLE_BASE_MS, wrapping at CYCLE_LENGTH.
 */
export function getCycleDay(): number {
  const daysSinceBase = Math.floor((Date.now() - CYCLE_BASE_MS) / 86400000)
  return (((daysSinceBase % CYCLE_LENGTH) + CYCLE_LENGTH) % CYCLE_LENGTH) + 1
}

/**
 * Returns the raw cycle-day data for the current day for a given market.
 */
export function getCurrentCycleData(marketId: string): CycleDayData | null {
  const markets = (cycleData as any).markets
  const market = markets[marketId]
  if (!market) return null
  const cycle = market.cycle as CycleDayData[]
  return cycle.find(d => d.day === 0) ?? cycle[0]
}

/**
 * Returns 7 BSSZPosition-compatible objects for the Physical Market Panel table.
 * Index 0 = current cycle day (labeled D-1), index 1 = previous day (D-2), etc.
 * trendPct shows anchor change relative to the following (older) entry.
 */
export function getCycleBsszPositions(marketId: string): CycleBsszPosition[] | null {
  const markets = (cycleData as any).markets
  const market = markets[marketId]
  if (!market) return null

  const cycle: CycleDayData[] = market.cycle
  const historical: { M1: HistoricalData; H1: HistoricalData; Y1: HistoricalData } = market.historical

  // Order from D-1 (day 1) to W-1 (day 7)
  const ordered: CycleDayData[] = []
  for (let i = 1; i <= CYCLE_LENGTH; i++) {
    ordered.push(cycle[i])
  }

  // Use day 0 (ACTIVE) anchor for trend calculations
  const currentAnchor = cycle[0].anchor

  // Map cycle days: D-1 (day 7), D-2 (day 6), ..., D-6 (day 2), W-1 (day 1)
  const cycleRows = ordered.map((d, i) => {
    let trendPct: number | null = null
    
    // D-1 (index 0) has no reference, so trendPct = null
    if (i === 0) {
      trendPct = null
    } else {
      // All other rows compare to ACTIVE (currentAnchor)
      trendPct = parseFloat(((currentAnchor - d.anchor) / d.anchor * 100).toFixed(2))
    }
    
    return {
      label: d.label,
      refDate: d.date_ref,
      adrData: [],
      bssz: {
        anchor: d.anchor / 10,
        floor: d.floor / 10,
        ceiling: d.ceiling / 10,
        trendPct,
      },
    }
  })

  // Add historical rows (M-1, Q-1, Y-1)
  const historicalRows: CycleBsszPosition[] = [
    {
      label: 'M-1',
      refDate: 'H1 2026',
      adrData: [],
      bssz: {
        anchor: historical.H1.DA / 10,
        floor: (historical.H1.DA * 0.9) / 10,
        ceiling: (historical.H1.DA * 1.2) / 10,
        trendPct: parseFloat(((currentAnchor - historical.H1.DA) / historical.H1.DA * 100).toFixed(2)),
      },
    },
    {
      label: 'Q-1',
      refDate: 'M1 2026',
      adrData: [],
      bssz: {
        anchor: historical.M1.DA / 10,
        floor: (historical.M1.DA * 0.9) / 10,
        ceiling: (historical.M1.DA * 1.2) / 10,
        trendPct: parseFloat(((currentAnchor - historical.M1.DA) / historical.M1.DA * 100).toFixed(2)),
      },
    },
    {
      label: 'Y-1',
      refDate: 'Y1 2025',
      adrData: [],
      bssz: {
        anchor: historical.Y1.DA / 10,
        floor: (historical.Y1.DA * 0.9) / 10,
        ceiling: (historical.Y1.DA * 1.2) / 10,
        trendPct: parseFloat(((currentAnchor - historical.Y1.DA) / historical.Y1.DA * 100).toFixed(2)),
      },
    },
  ]

  return [...cycleRows, ...historicalRows]
}
