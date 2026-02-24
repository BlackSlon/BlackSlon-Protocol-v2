import { NextResponse } from 'next/server';

// Wymuszenie dynamicznego API - wyłącza cache Vercela
export const dynamic = 'force-dynamic';

export async function GET() {
  // Konfiguracja 8 rynków z kalibracją b_base (Systemic Inertia)
  const MARKETS = {
    "IPT-E-DE": { name: "Power DE", b_base: 0.005 },
    "IPT-E-NO": { name: "Power Nordic", b_base: 0.008 },
    "IPT-E-PL": { name: "Power PL", b_base: 0.015 },
    "IPT-E-FR": { name: "Power FR", b_base: 0.012 },
    "IPT-G-NL": { name: "Gas NL", b_base: 0.010 },
    "IPT-G-DE": { name: "Gas DE", b_base: 0.012 },
    "IPT-G-PL": { name: "Gas PL", b_base: 0.030 },
    "IPT-G-BG": { name: "Gas BG", b_base: 0.045 },
  };

  // Symulowane dane z Wyroczni (Oracles) - do późniejszego podpięcia pod realne API giełd
  const mock_raw = { spot: 500, fm: 102, fq: 105, cal: 110 };
  
  const results: Record<string, any> = {};

  for (const [mid, cfg] of Object.entries(MARKETS)) {
    // 1. Raw Anchor (Wagi: Spot 10%, FM 40%, FQ 25%, Cal 25%)
    const raw_a = (mock_raw.spot * 0.10) + (mock_raw.fm * 0.40) + (mock_raw.fq * 0.25) + (mock_raw.cal * 0.25);
    
    // 2. Weighted Anchor (zaokrąglenie do 2 miejsc po przecinku)
    const weighted_a = Math.round(raw_a * 100) / 100;
    
    // 3. Korytarz BSTZ (+/- 10% od kotwicy)
    const low = Math.round(weighted_a * 0.9 * 100) / 100;
    const high = Math.round(weighted_a * 1.1 * 100) / 100;

    // 4. Skalowanie do standardu 100kWh dla BSEI
    const currentBSEI = weighted_a / 10;

    results[mid] = {
      wholesalePrice: weighted_a,
      currentBSEI: currentBSEI,
      b_base: cfg.b_base,
      corridor: { low, high }
    };
  }

  // Zwracamy czysty format JSON, z którym Dashboard poradzi sobie bez problemu
  return NextResponse.json(results);
}