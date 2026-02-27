export interface BSTZHistoryEntry {
  date: string;
  spot: number;
  fm: number;
  fq: number;
  cal: number;
}

export const MARKET_HISTORY: Record<string, BSTZHistoryEntry[]> = {
  'IPT-P-PL': [
    // 365 dni temu: Anchor ~7.94 (-25% od 10.59) -> dzisiejszy trend +33.3%
    { date: "2025-02-20", spot: 95.00, fm: 78.00, fq: 76.00, cal: 78.00 },
    // 90 dni temu: Anchor ~9.00 (-15% od 10.59) -> dzisiejszy trend +17.6%
    { date: "2025-11-22", spot: 105.00, fm: 88.00, fq: 88.00, cal: 90.00 },
    // 30 dni temu: Anchor ~9.53 (-10% od 10.59) -> dzisiejszy trend +11.1%
    { date: "2026-01-21", spot: 110.00, fm: 94.00, fq: 92.00, cal: 94.00 },
    
    // Dane bieżące
    { date: "2026-02-18", spot: 133.37, fm: 97.87, fq: 93.38, cal: 97.42 },
    { date: "2026-02-19", spot: 129.46, fm: 99.03, fq: 95.76, cal: 99.76 },
    { date: "2026-02-20", spot: 119.62, fm: 99.24, fq: 96.45, cal: 100.90 }
  ]
};