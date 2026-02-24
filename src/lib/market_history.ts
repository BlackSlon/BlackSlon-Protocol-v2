// src/lib/market_history.ts

export interface BSTZHistoryEntry {
  date: string;
  spot: number;
  fm: number;
  fq: number;
  cal: number;
}

export const MARKET_HISTORY: Record<string, BSTZHistoryEntry[]> = {
  'IPT-E-PL': [
    { date: "2026-01-26", spot: 189.81, fm: 109.48, fq: 101.61, cal: 105.98 },
    { date: "2026-01-27", spot: 242.18, fm: 110.59, fq: 102.06, cal: 105.73 },
    { date: "2026-01-28", spot: 186.21, fm: 108.77, fq: 101.10, cal: 104.98 },
    { date: "2026-01-29", spot: 154.57, fm: 107.35, fq: 100.00, cal: 103.68 },
    { date: "2026-01-30", spot: 136.86, fm: 106.25, fq: 100.24, cal: 103.22 },
    { date: "2026-02-02", spot: 142.12, fm: 103.92, fq: 99.45, cal: 103.44 },
    { date: "2026-02-03", spot: 132.31, fm: 103.55, fq: 98.83, cal: 104.03 },
    { date: "2026-02-04", spot: 138.84, fm: 103.08, fq: 98.63, cal: 104.27 },
    { date: "2026-02-05", spot: 129.57, fm: 104.06, fq: 99.08, cal: 104.62 },
    { date: "2026-02-06", spot: 145.44, fm: 101.61, fq: 96.71, cal: 102.35 },
    { date: "2026-02-09", spot: 140.59, fm: 100.95, fq: 97.39, cal: 102.62 },
    { date: "2026-02-10", spot: 143.36, fm: 100.14, fq: 97.27, cal: 103.32 },
    { date: "2026-02-11", spot: 125.13, fm: 98.70, fq: 95.62, cal: 101.79 },
    { date: "2026-02-12", spot: 121.46, fm: 96.99, fq: 93.70, cal: 98.74 },
    { date: "2026-02-13", spot: 113.75, fm: 97.87, fq: 94.69, cal: 99.08 },
    { date: "2026-02-16", spot: 116.67, fm: 96.92, fq: 93.48, cal: 98.16 },
    { date: "2026-02-17", spot: 136.43, fm: 96.80, fq: 92.68, cal: 96.92 },
    { date: "2026-02-18", spot: 133.37, fm: 97.87, fq: 93.38, cal: 97.42 },
    { date: "2026-02-19", spot: 129.46, fm: 99.03, fq: 95.76, cal: 99.76 },
    { date: "2026-02-20", spot: 119.62, fm: 99.24, fq: 96.45, cal: 100.90 }
  ]
};