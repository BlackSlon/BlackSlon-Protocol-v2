import { Order } from '@/store/types'

// Liquidity depth: how many static resting orders per side
function getStaticDepth(marketId: string): number {
  if (['BS-G-NL', 'BS-P-DE'].includes(marketId))            return 16 // high liquidity
  if (['BS-G-DE', 'BS-P-UK', 'BS-P-NO'].includes(marketId)) return 10 // medium liquidity
  return 6 // low liquidity: BS-P-PL, BS-G-PL, BS-G-BG
}

// Minimum visible levels always maintained in the UI (market maker always refills)
export function getMinVisibleDepth(marketId: string): number {
  if (['BS-G-NL', 'BS-P-DE'].includes(marketId))            return 8
  if (['BS-G-DE', 'BS-P-UK', 'BS-P-NO'].includes(marketId)) return 5
  return 3
}

/**
 * Generates mock order book data for a market based on anchor price.
 * Depth varies by market liquidity tier.
 */
export function generateOrderBook(anchor: number, marketId: string): { bids: Order[], asks: Order[] } {
  const r2 = (v: number) => Math.round(v * 100) / 100
  const a = r2(anchor)
  const baseTime = Date.now()
  const depth = getStaticDepth(marketId)

  const allBids: Order[] = [
    { id: `${marketId}-bid-1`,  price: r2(a - 0.04), units: 150, volume: 15000, ownedByUser: false, timestamp: baseTime - 16000 },
    { id: `${marketId}-bid-2`,  price: r2(a - 0.05), units: 120, volume: 12000, ownedByUser: false, timestamp: baseTime - 15000 },
    { id: `${marketId}-bid-3`,  price: r2(a - 0.06), units: 180, volume: 18000, ownedByUser: false, timestamp: baseTime - 14000 },
    { id: `${marketId}-bid-4`,  price: r2(a - 0.07), units: 95,  volume: 9500,  ownedByUser: false, timestamp: baseTime - 13000 },
    { id: `${marketId}-bid-5`,  price: r2(a - 0.08), units: 200, volume: 20000, ownedByUser: false, timestamp: baseTime - 12000 },
    { id: `${marketId}-bid-6`,  price: r2(a - 0.09), units: 135, volume: 13500, ownedByUser: false, timestamp: baseTime - 11000 },
    { id: `${marketId}-bid-7`,  price: r2(a - 0.10), units: 165, volume: 16500, ownedByUser: false, timestamp: baseTime - 10000 },
    { id: `${marketId}-bid-8`,  price: r2(a - 0.11), units: 110, volume: 11000, ownedByUser: false, timestamp: baseTime - 9000  },
    { id: `${marketId}-bid-9`,  price: r2(a - 0.12), units: 145, volume: 14500, ownedByUser: false, timestamp: baseTime - 8000  },
    { id: `${marketId}-bid-10`, price: r2(a - 0.13), units: 175, volume: 17500, ownedByUser: false, timestamp: baseTime - 7000  },
    { id: `${marketId}-bid-11`, price: r2(a - 0.14), units: 130, volume: 13000, ownedByUser: false, timestamp: baseTime - 6000  },
    { id: `${marketId}-bid-12`, price: r2(a - 0.15), units: 190, volume: 19000, ownedByUser: false, timestamp: baseTime - 5000  },
    { id: `${marketId}-bid-13`, price: r2(a - 0.16), units: 100, volume: 10000, ownedByUser: false, timestamp: baseTime - 4000  },
    { id: `${marketId}-bid-14`, price: r2(a - 0.17), units: 155, volume: 15500, ownedByUser: false, timestamp: baseTime - 3000  },
    { id: `${marketId}-bid-15`, price: r2(a - 0.18), units: 125, volume: 12500, ownedByUser: false, timestamp: baseTime - 2000  },
    { id: `${marketId}-bid-16`, price: r2(a - 0.19), units: 140, volume: 14000, ownedByUser: false, timestamp: baseTime - 1000  },
  ]

  const allAsks: Order[] = [
    { id: `${marketId}-ask-1`,  price: r2(a + 0.01), units: 110, volume: 11000, ownedByUser: false, timestamp: baseTime - 16000 },
    { id: `${marketId}-ask-2`,  price: r2(a + 0.02), units: 85,  volume: 8500,  ownedByUser: false, timestamp: baseTime - 15000 },
    { id: `${marketId}-ask-3`,  price: r2(a + 0.03), units: 140, volume: 14000, ownedByUser: false, timestamp: baseTime - 14000 },
    { id: `${marketId}-ask-4`,  price: r2(a + 0.04), units: 75,  volume: 7500,  ownedByUser: false, timestamp: baseTime - 13000 },
    { id: `${marketId}-ask-5`,  price: r2(a + 0.05), units: 160, volume: 16000, ownedByUser: false, timestamp: baseTime - 12000 },
    { id: `${marketId}-ask-6`,  price: r2(a + 0.06), units: 125, volume: 12500, ownedByUser: false, timestamp: baseTime - 11000 },
    { id: `${marketId}-ask-7`,  price: r2(a + 0.07), units: 190, volume: 19000, ownedByUser: false, timestamp: baseTime - 10000 },
    { id: `${marketId}-ask-8`,  price: r2(a + 0.08), units: 105, volume: 10500, ownedByUser: false, timestamp: baseTime - 9000  },
    { id: `${marketId}-ask-9`,  price: r2(a + 0.09), units: 145, volume: 14500, ownedByUser: false, timestamp: baseTime - 8000  },
    { id: `${marketId}-ask-10`, price: r2(a + 0.10), units: 170, volume: 17000, ownedByUser: false, timestamp: baseTime - 7000  },
    { id: `${marketId}-ask-11`, price: r2(a + 0.11), units: 130, volume: 13000, ownedByUser: false, timestamp: baseTime - 6000  },
    { id: `${marketId}-ask-12`, price: r2(a + 0.12), units: 185, volume: 18500, ownedByUser: false, timestamp: baseTime - 5000  },
    { id: `${marketId}-ask-13`, price: r2(a + 0.13), units: 100, volume: 10000, ownedByUser: false, timestamp: baseTime - 4000  },
    { id: `${marketId}-ask-14`, price: r2(a + 0.14), units: 155, volume: 15500, ownedByUser: false, timestamp: baseTime - 3000  },
    { id: `${marketId}-ask-15`, price: r2(a + 0.15), units: 120, volume: 12000, ownedByUser: false, timestamp: baseTime - 2000  },
    { id: `${marketId}-ask-16`, price: r2(a + 0.16), units: 140, volume: 14000, ownedByUser: false, timestamp: baseTime - 1000  },
  ]

  return { bids: allBids.slice(0, depth), asks: allAsks.slice(0, depth) }
}

/**
 * Generates BSEI history snapshots based on anchor price and market-specific BSSZ
 */
export function generateBSEIHistory(anchor: number, marketId: string) {
  // Market-specific BSSZ data - using day-specific ranges from hardcoded data
  const bsszData: Record<string, Array<{ floor: number; cap: number }>> = {
    'BS-G-NL': [
      { floor: 4.53, cap: 6.04 }, // D-1
      { floor: 4.37, cap: 5.82 }, // D-2
      { floor: 4.08, cap: 5.44 }, // D-3
      { floor: 4.04, cap: 5.39 }, // D-4
      { floor: 4.35, cap: 5.80 }, // D-5
      { floor: 3.63, cap: 4.84 }, // D-6
      { floor: 2.76, cap: 3.68 }, // W-1
    ],
    'BS-G-DE': [
      { floor: 4.59, cap: 6.12 }, // D-1
      { floor: 4.42, cap: 5.89 }, // D-2
      { floor: 4.12, cap: 5.49 }, // D-3
      { floor: 4.09, cap: 5.45 }, // D-4
      { floor: 4.39, cap: 5.86 }, // D-5
      { floor: 3.67, cap: 4.90 }, // D-6
      { floor: 2.81, cap: 3.74 }, // W-1
    ],
    'BS-G-PL': [
      { floor: 5.03, cap: 6.70 }, // D-1
      { floor: 4.91, cap: 6.54 }, // D-2
      { floor: 4.52, cap: 6.02 }, // D-3
      { floor: 4.39, cap: 5.86 }, // D-4
      { floor: 4.80, cap: 6.40 }, // D-5
      { floor: 4.07, cap: 5.42 }, // D-6
      { floor: 3.09, cap: 4.12 }, // W-1
    ],
    'BS-G-BG': [
      { floor: 3.35, cap: 4.46 }, // D-1
      { floor: 3.20, cap: 4.27 }, // D-2
      { floor: 3.33, cap: 4.44 }, // D-3
      { floor: 3.64, cap: 4.86 }, // D-4
      { floor: 3.56, cap: 4.75 }, // D-5
      { floor: 2.84, cap: 3.79 }, // D-6
      { floor: 2.52, cap: 3.36 }, // W-1
    ],
    'BS-P-DE': [
      { floor: 8.205, cap: 10.940 }, // D-1
      { floor: 8.173, cap: 10.897 }, // D-2
      { floor: 8.074, cap: 10.765 }, // D-3
      { floor: 7.886, cap: 10.514 }, // D-4
      { floor: 7.711, cap: 10.281 }, // D-5
      { floor: 7.132, cap: 9.510 }, // D-6
      { floor: 6.806, cap: 9.075 }, // W-1
    ],
    'BS-P-NO': [
      { floor: 5.731, cap: 7.642 }, // D-1
      { floor: 5.598, cap: 7.464 }, // D-2
      { floor: 5.595, cap: 7.460 }, // D-3
      { floor: 5.720, cap: 7.627 }, // D-4
      { floor: 5.825, cap: 7.766 }, // D-5
      { floor: 5.724, cap: 7.632 }, // D-6
      { floor: 5.583, cap: 7.444 }, // W-1
    ],
    'BS-P-PL': [
      { floor: 8.957, cap: 11.943 }, // D-1
      { floor: 8.860, cap: 11.813 }, // D-2
      { floor: 8.960, cap: 11.946 }, // D-3
      { floor: 8.981, cap: 11.975 }, // D-4
      { floor: 9.045, cap: 12.060 }, // D-5
      { floor: 8.723, cap: 11.630 }, // D-6
      { floor: 8.599, cap: 11.465 }, // W-1
    ],
    'BS-P-UK': [
      { floor: 8.146, cap: 10.861 }, // D-1
      { floor: 7.809, cap: 10.412 }, // D-2
      { floor: 7.489, cap: 9.985 }, // D-3
      { floor: 7.444, cap: 9.925 }, // D-4
      { floor: 6.958, cap: 9.277 }, // D-5
      { floor: 6.947, cap: 9.263 }, // D-6
      { floor: 6.106, cap: 8.141 }, // W-1
    ],
  }
  
  const dayRanges = bsszData[marketId] || Array(7).fill({ floor: anchor * 0.9, cap: anchor * 1.2 })
  
  // Generate values within each day's BSSZ range with smaller, realistic changes
  // V-RWAP concept: values roll with 50/25/25 weighting, so changes are gradual
  const generateValue = (dayIndex: number) => {
    const range = dayRanges[dayIndex]
    const mid = (range.floor + range.cap) / 2
    const variance = (range.cap - range.floor) * 0.15 // 15% variance from midpoint
    return mid + (Math.random() - 0.5) * variance
  }
  
  const smallTrend = () => {
    const trends = [0.8, 1.2, -0.5, -1.1, 1.5, -0.9, 0.3]
    return trends[Math.floor(Math.random() * trends.length)]
  }
  
  return [
    { label: 'D-1', value: generateValue(0), changePct: smallTrend() },
    { label: 'D-2', value: generateValue(1), changePct: smallTrend() },
    { label: 'D-3', value: generateValue(2), changePct: smallTrend() },
    { label: 'D-4', value: generateValue(3), changePct: smallTrend() },
    { label: 'D-5', value: generateValue(4), changePct: smallTrend() },
    { label: 'D-6', value: generateValue(5), changePct: smallTrend() },
    { label: 'W-1', value: generateValue(6), changePct: smallTrend() },
  ]
}

/**
 * Generates liquidity snapshots scaled by market liquidity tier
 */
export function generateLiquiditySnapshots(marketId?: string) {
  // Base volumes for high-liquidity markets (BS-G-NL, BS-P-DE)
  const base = [127400, 189600, 214300, 245800, 268100, 285400, 302700]
  const labels = ['D-1', 'D-2', 'D-3', 'D-4', 'D-5', 'D-6', 'W-1']

  let scale = 1.0
  if (marketId) {
    if (['BS-G-NL', 'BS-P-DE'].includes(marketId))            scale = 1.0   // high
    else if (['BS-G-DE', 'BS-P-UK', 'BS-P-NO'].includes(marketId)) scale = 0.45  // medium
    else scale = 0.15  // low: BS-P-PL, BS-G-PL, BS-G-BG
  }

  return labels.map((label, i) => ({
    label,
    value: Math.round(base[i] * scale * (0.9 + Math.random() * 0.2)),
  }))
}
