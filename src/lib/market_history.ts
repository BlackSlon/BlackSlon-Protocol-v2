// src/lib/market_history.ts

export interface BSTZHistoryEntry {
  date: string;
  cal: number; // Kolumna 2
  fq: number;  // Kolumna 3
  fm: number;  // Kolumna 4
  spot: number; // Kolumna 5 (najdroższa)
}

export const MARKET_HISTORY: Record<string, BSTZHistoryEntry[]> = {
  'IPT-E-PL': [
    { date: "2026-01-26", cal: 105.98, fq: 101.61, fm: 109.48, spot: 189.81 },
    { date: "2026-01-27", cal: 105.73, fq: 102.06, fm: 110.59, spot: 242.18 },
    { date: "2026-01-28", cal: 104.98, fq: 101.10, fm: 108.77, spot: 186.21 },
    { date: "2026-01-29", cal: 103.68, fq: 100.00, fm: 107.35, spot: 154.57 },
    { date: "2026-01-30", cal: 103.22, fq: 100.24, fm: 106.25, spot: 136.86 },
    { date: "2026-02-02", cal: 103.44, fq: 99.45, fm: 103.92, spot: 142.12 },
    { date: "2026-02-03", cal: 104.03, fq: 98.83, fm: 103.55, spot: 132.31 },
    { date: "2026-02-04", cal: 104.27, fq: 98.63, fm: 103.08, spot: 138.84 },
    { date: "2026-02-05", cal: 104.62, fq: 99.08, fm: 104.06, spot: 129.57 },
    { date: "2026-02-06", cal: 102.35, fq: 96.71, fm: 101.61, spot: 145.44 },
    { date: "2026-02-09", cal: 102.62, fq: 97.39, fq: 100.95, fm: 140.59 }, // Poprawione mapowanie TGE
    { date: "2026-02-10", cal: 103.32, fq: 97.27, fm: 100.14, spot: 143.36 },
    { date: "2026-02-11", cal: 101.79, fq: 95.62, fm: 98.70, spot: 125.13 },
    { date: "2026-02-12", cal: 98.74, fq: 93.70, fm: 96.99, spot: 121.46 },
    { date: "2026-02-13", cal: 99.08, fq: 94.69, fm: 97.87, spot: 113.75 },
    { date: "2026-02-16", cal: 98.16, fq: 93.48, fm: 96.92, spot: 116.67 },
    { date: "2026-02-17", cal: 96.92, fq: 92.68, fm: 96.80, spot: 136.43 },
    { date: "2026-02-18", cal: 97.42, fq: 93.38, fm: 97.87, spot: 133.37 },
    { date: "2026-02-19", cal: 99.76, fq: 95.76, fm: 99.03, spot: 129.46 },
    { date: "2026-02-20", cal: 100.90, fq: 96.45, fm: 99.24, spot: 119.62 }
  ]
};