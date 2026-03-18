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
  const currentDay = getCycleDay()
  return (market.cycle as CycleDayData[]).find(d => d.day === currentDay) ?? null
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

  const currentDay = getCycleDay()
  const cycle: CycleDayData[] = market.cycle

  const ordered: CycleDayData[] = []
  for (let i = 0; i < CYCLE_LENGTH; i++) {
    const idx = ((currentDay - 1 - i) + CYCLE_LENGTH) % CYCLE_LENGTH
    ordered.push(cycle[idx])
  }

  return ordered.map((d, i) => {
    const older = ordered[i + 1]
    const trendPct = older
      ? parseFloat(((d.anchor - older.anchor) / older.anchor * 100).toFixed(2))
      : null
    return {
      label: `D-${i + 1}`,
      refDate: d.date_ref,
      adrData: [],
      bssz: {
        anchor: d.anchor,
        floor: d.floor,
        ceiling: d.ceiling,
        trendPct,
      },
    }
  })
}
