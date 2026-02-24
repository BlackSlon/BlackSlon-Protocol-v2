// src/app/api/market-data/route.ts
import { NextResponse } from 'next/server';
import { MARKET_HISTORY } from '@/lib/market_history';

export async function GET() {
  const history = MARKET_HISTORY['IPT-E-PL'];
  
  if (!history || history.length < 20) {
    return NextResponse.json({ error: 'Dane niedostępne' }, { status: 500 });
  }

  const calculateRaw = (e: any) => 
    (e.spot * 0.10) + (e.fm * 0.40) + (e.fq * 0.25) + (e.cal * 0.25);

  const aT = calculateRaw(history[19]);   // 20.02
  const aT1 = calculateRaw(history[18]);  // 19.02
  const aT2 = calculateRaw(history[17]);  // 18.02

  // BSTZ 50/25/25 Historical Recursive Filter
  const finalAnchor = (0.50 * aT) + (0.25 * aT1) + (0.25 * aT2);

  return NextResponse.json([{
    id: 'IPT-E-PL',
    name: 'Power Poland',
    wholesalePrice: finalAnchor.toFixed(2),
    currentBSEI: (finalAnchor / 10).toFixed(2), // Cena w EUR / vkWh
    unit: 'EUR / vkWh',
    change: "+1.24%",
    corridor: {
      low: (finalAnchor * 0.9).toFixed(2),
      high: (finalAnchor * 1.1).toFixed(2)
    },
    status: 'Active',
    lastUpdate: history[19].date
  }]);
}