import { NextResponse } from 'next/server';
import { MARKET_HISTORY } from '@/lib/market_history';

export async function GET() {
  const history = MARKET_HISTORY['IPT-E-PL'];
  
  if (!history || history.length < 20) {
    return NextResponse.json({ error: 'Dane historyczne niedostępne' }, { status: 500 });
  }

  // Funkcja obliczająca Raw Anchor (â) dla jednej sesji
  // Wagi: Spot 10%, FM 40%, FQ 25%, Cal 25%
  const calculateRaw = (entry: any) => {
    return (entry.spot * 0.10) + (entry.fm * 0.40) + (entry.fq * 0.25) + (entry.cal * 0.25);
  };

  // Pobieramy 3 ostatnie sesje z Twoich danych (20.02, 19.02, 18.02)
  const aT = calculateRaw(history[19]);   // Sesja T
  const aT1 = calculateRaw(history[18]);  // Sesja T-1
  const aT2 = calculateRaw(history[17]);  // Sesja T-2

  // Formuła Rekurencyjna 50/25/25 (Inercja systemu)
  const finalAnchor = (0.50 * aT) + (0.25 * aT1) + (0.25 * aT2);

  // Zwracamy dane w formacie, który rozumie Twój Dashboard
  return NextResponse.json([{
    id: 'IPT-E-PL',
    name: 'Power Poland',
    wholesalePrice: finalAnchor.toFixed(2),
    currentBSEI: (finalAnchor / 10).toFixed(2), // Przeliczenie na EUR / vkWh
    unit: 'EUR / vkWh',
    change: "+1.24%", // Tutaj możesz później dodać realną zmianę %
    corridor: {
      low: (finalAnchor * 0.9).toFixed(2),
      high: (finalAnchor * 1.1).toFixed(2)
    },
    status: 'Active',
    lastUpdate: history[19].date
  }]);
}