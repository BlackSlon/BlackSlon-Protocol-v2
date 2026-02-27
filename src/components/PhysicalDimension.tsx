'use client'

import { MARKET_HISTORY } from '@/lib/market_history'

interface PhysicalDimensionProps {
  marketId: string
  currentPrice: number
}

export default function PhysicalDimension({ marketId, currentPrice }: PhysicalDimensionProps) {
  const history = [...(MARKET_HISTORY[marketId] || [])];
  
  // Helper do obliczeń BSTZ
  const calcBSTZ = (day: any) => {
    if (!day) return null;
    const anchor = (day.spot / 10 * 0.1) + (day.fm / 10 * 0.4) + (day.fq / 10 * 0.25) + (day.cal / 10 * 0.25);
    return {
      date: day.date,
      anchor,
      min: anchor * 0.9,
      max: anchor * 1.1
    };
  };

  // Dane do tabeli 7D
  const last7Days = history.slice(-7).reverse().map(day => calcBSTZ(day));
  const today = last7Days[0];

  // Dane historyczne do porównania trendu
  const getHistorical = (daysBack: number) => {
    const entry = history[history.length - 1 - daysBack] || history[0];
    return calcBSTZ(entry);
  };

  const benchmarks = [
    { label: '30D AGO', data: getHistorical(30) },
    { label: '90D AGO', data: getHistorical(90) },
    { label: '1 YEAR AGO', data: getHistorical(365) }
  ];

  return (
    <div className="flex flex-col h-full p-4 select-none bg-transparent space-y-6">
      {/* HEADER PANELU */}
      <div className="text-[10px] text-gray-500 uppercase tracking-[0.5em] font-bold text-center py-2 border-b border-gray-900 bg-black/40">
        <span>PHYSICAL MARKET DIMENSION</span>
      </div>

      {/* TYTUŁ SEKCJI */}
      <div className="text-center">
        <div className="text-[11px] font-black tracking-widest uppercase text-red-600">
          BlackSlon Trading Zone (BSTZ)
        </div>
      </div>

      {/* TABELA 7D CORRIDOR */}
      <div className="bg-gray-950/40 rounded-sm border border-gray-900 overflow-hidden">
        <div className="grid grid-cols-12 text-[8px] text-gray-600 uppercase border-b border-gray-900 py-2 px-3 font-bold bg-black/60">
          <div className="col-span-3">Date</div>
          <div className="col-span-9 text-center">
            {/* Ręczne wpisanie jednostki kWh bez uppercase */}
            Zone Range & Anchor (●) [EUR/100<span className="lowercase font-bold text-[9px]">k</span>W<span className="lowercase font-bold text-[9px]">h</span>]
          </div>
        </div>

        <div className="divide-y divide-gray-900/50">
          {last7Days.map((day: any, i) => {
            const isToday = i === 0;
            return (
              <div key={i} className={`grid grid-cols-12 py-3 px-3 items-center hover:bg-gray-900/20 font-mono text-[10px] ${isToday ? 'bg-yellow-500/10 border-l-2 border-yellow-500' : ''}`}>
                <div className={`col-span-3 ${isToday ? 'text-yellow-400 font-bold scale-105 origin-left' : 'text-gray-500'}`}>
                  {day.date} {isToday && <span className="text-[8px] ml-1 opacity-70">(NOW)</span>}
                </div>
                
                <div className="col-span-9 flex items-center gap-3">
                  <span className="text-[9px] font-bold text-green-600/70 w-8">{day.min.toFixed(2)}</span>
                  
                  {/* KORYTARZ DWUSTREFOWY */}
                  <div className="flex-grow h-1.5 bg-gray-900 relative rounded-full border border-gray-800 flex overflow-hidden">
                    {/* Strefa 1: Min do Anchor */}
                    <div className="h-full w-1/2 bg-blue-500/10 border-r border-dashed border-gray-700/50"></div>
                    {/* Strefa 2: Anchor do Max */}
                    <div className="h-full w-1/2 bg-red-500/5"></div>
                    
                    {/* PUNKT A (Anchor) */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 group">
                      <div className={`w-2 h-2 rounded-full shadow-[0_0_10px_rgba(220,38,38,0.8)] cursor-help ${isToday ? 'bg-yellow-500' : 'bg-red-600'}`} />
                      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-black border border-gray-700 rounded text-[8px] text-white opacity-0 group-hover:opacity-100 z-20">
                        A: {day.anchor.toFixed(2)}
                      </div>
                    </div>
                  </div>

                  <span className="text-[9px] font-bold text-green-500 w-8 text-right">{day.max.toFixed(2)}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* SEKCJA TRENDU HISTORYCZNEGO */}
      <div className="pt-2">
        <div className="text-[9px] text-gray-500 font-bold tracking-widest mb-3 uppercase border-b border-gray-900 pb-1">
          Historical Benchmarks & Trend
        </div>
        <div className="grid grid-cols-3 gap-3">
          {benchmarks.map((bench, idx) => {
            if (!bench.data || !today) return null;
            const diff = ((today.anchor - bench.data.anchor) / bench.data.anchor) * 100;
            const isUp = diff > 0;
            
            return (
              <div key={idx} className="bg-black/40 border border-gray-900 p-2 rounded-sm">
                <div className="text-[7px] text-gray-600 font-bold mb-1">{bench.label}</div>
                <div className="text-[10px] font-mono text-white mb-1">{bench.data.anchor.toFixed(2)}</div>
                <div className={`text-[9px] font-bold ${isUp ? 'text-red-500' : 'text-green-500'}`}>
                  {isUp ? '↑' : '↓'}{Math.abs(diff).toFixed(1)}%
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  )
}