'use client'

import { MARKET_HISTORY } from '@/lib/market_history'

export default function PhysicalDimension({ marketId, currentPrice }: { marketId: string, currentPrice: number }) {
  // Używamy 'IPT-P-PL' jeśli marketId nie zostanie znalezione
  const history = MARKET_HISTORY[marketId] || MARKET_HISTORY['IPT-P-PL'] || [];

  const calcBSTZ = (entry: any) => {
    if (!entry) return null;
    const anchor = (entry.spot / 10 * 0.1) + (entry.fm / 10 * 0.4) + (entry.fq / 10 * 0.25) + (entry.cal / 10 * 0.25);
    return {
      date: entry.date,
      anchor,
      min: anchor * 0.90, // -10%
      max: anchor * 1.10  // +10%
    };
  };

  // 1. Ostatnie 7 dni (od najnowszego)
  const last7Days = history.slice(-7).reverse().map(e => {
    const data = calcBSTZ(e);
    // Przykładowa zmiana 24h dla wizualizacji strzałek
    return { ...data, change: (Math.random() * 4 - 2) }; 
  });

  // 2. Punkty historyczne (szukamy po konkretnych datach dodanych powyżej)
  const historical = [
    { label: '30 Days Ago', data: calcBSTZ(history.find(e => e.date === "2026-01-21")) },
    { label: '90 Days Ago', data: calcBSTZ(history.find(e => e.date === "2025-11-22")) },
    { label: '365 Days Ago', data: calcBSTZ(history.find(e => e.date === "2025-02-20")) }
  ];

  const renderSuwak = (day: any, isMainTable: boolean, isLatest: boolean = false) => {
    if (!day) return null;
    const isPos = day.change > 0 || isMainTable === false; // Dla historycznych zakładamy wzrost do dziś
    const color = isPos ? 'text-green-500' : 'text-red-500';
    const dotColor = isPos ? 'bg-green-500 shadow-[0_0_8px_#22c55e]' : 'bg-red-600 shadow-[0_0_8px_#dc2626]';

    return (
      <div className="flex items-center gap-2 relative h-12 w-full">
        {/* MIN - niebieski */}
        <span className="text-[13px] text-blue-500 font-bold w-12 font-mono">{day.min.toFixed(2)}</span>
        
        <div className="flex-grow flex flex-col items-center">
          {/* WARTOŚĆ ANCHOR NAD KROPKĄ */}
          <span className={`text-[13px] font-bold mb-0.5 ${color}`}>{day.anchor.toFixed(2)}</span>
          
          <div className="w-full h-1 bg-gray-900 relative rounded-full border border-gray-800">
            <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 rounded-full z-10 ${dotColor}`} />
          </div>

          {/* STRZAŁKA I % POD SUWAKIEM */}
          <div className={`flex flex-col items-center gap-1 text-[7px] font-bold mt-0.5 ${color}`}>
            <div className="flex items-center gap-1">
              <span>{isPos ? '↑' : '↓'}</span>
              <span>{isMainTable ? Math.abs(day.change).toFixed(1) : ((currentPrice - day.anchor)/day.anchor * 100).toFixed(1)}%</span>
            </div>
            {isMainTable && isLatest && <span className="text-yellow-400 font-bold">ACTIVE NOW</span>}
          </div>
        </div>

        {/* MAX - niebieski */}
        <span className="text-[13px] text-blue-500 font-bold w-12 text-right font-mono">{day.max.toFixed(2)}</span>
      </div>
    );
  };

  return (
    <div className="flex flex-col h-full select-none bg-transparent pt-[9px]">
      <div className="text-[10px] text-gray-500 uppercase tracking-[0.5em] font-bold text-center py-2 border-b border-gray-900 bg-black/40 mb-4">
        <span>PHYSICAL MARKET DIMENSION</span>
      </div>

      <div className="text-center mb-4">
        <div className="text-[11px] font-black tracking-widest text-red-600">
          BlackSlon Trading Zone (BSTZ)
        </div>
      </div>

      {/* GŁÓWNA TABELA 7D */}
      <div className="bg-gray-950/40 rounded-sm border border-gray-900 overflow-hidden mb-6">
        <div className="grid grid-cols-12 text-[8px] text-gray-600 uppercase border-b border-gray-900 py-2 px-3 font-bold bg-black/60">
          <div className="col-span-3">Date</div>
          <div className="col-span-9 text-center">
            Zone Range & Anchor (●) [EUR / 100<span className="lowercase font-bold">k</span>W<span className="lowercase font-bold">h</span>]
          </div>
        </div>
        <div className="divide-y divide-gray-900/50">
          {last7Days.map((day, i) => {
            const isLatest = i === 0;
            return (
              <div key={i} className={`grid grid-cols-12 py-3 px-3 items-center hover:bg-white/5 ${isLatest ? 'bg-blue-500/5' : ''}`}>
                <div className={`col-span-3 text-[12px] font-mono ${isLatest ? 'text-blue-400 font-bold' : 'text-gray-500'}`}>
                  {day.date}
                </div>
                <div className="col-span-9">
                  {renderSuwak(day, true, isLatest)}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      </div>
  )
}