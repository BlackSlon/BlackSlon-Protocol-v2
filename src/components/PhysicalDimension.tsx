'use client'

import { MARKET_HISTORY } from '@/lib/market_history'

interface PhysicalDimensionProps {
  marketId: string
  currentPrice: number
}

export default function PhysicalDimension({ marketId, currentPrice }: PhysicalDimensionProps) {
  const history = [...(MARKET_HISTORY[marketId] || [])];

  const calcBSTZ = (index: number) => {
    const day = history[index];
    if (!day) return null;
    
    // Podstawowy Anchor (niezmienny)
    const anchor = (day.spot / 10 * 0.1) + (day.fm / 10 * 0.4) + (day.fq / 10 * 0.25) + (day.cal / 10 * 0.25);
    
    // NOWA ASYMETRYCZNA FORMUŁA: -10% / +20%
    const min = anchor * 0.90; // Spadek max 10%
    const max = anchor * 1.20; // Wzrost max 20%
    
    const prevDay = history[index - 1];
    let change = 0;
    if (prevDay) {
      const prevAnchor = (prevDay.spot / 10 * 0.1) + (prevDay.fm / 10 * 0.4) + (prevDay.fq / 10 * 0.25) + (prevDay.cal / 10 * 0.25);
      change = ((anchor - prevAnchor) / prevAnchor) * 100;
    }

    return { date: day.date, anchor, min, max, change };
  };

  const displayDays = [
    ...Array.from({ length: 7 }, (_, i) => history.length - 1 - i),
    history.length - 1 - 30,
    history.length - 1 - 90,
    history.length - 1 - 365
  ].map(idx => calcBSTZ(idx)).filter(Boolean);

  return (
    <div className="flex flex-col h-full select-none bg-transparent">
      <div className="text-[10px] text-gray-500 uppercase tracking-[0.5em] font-bold text-center py-2 border-b border-gray-900 bg-black/40 mb-4">
        <span>PHYSICAL MARKET DIMENSION</span>
      </div>

      <div className="text-center mb-4">
        <div className="text-[11px] font-black tracking-widest uppercase text-red-600">
          BlackSlon Trading Zone (BSTZ)
        </div>
        <div className="text-[8px] text-gray-500 mt-1 uppercase tracking-tighter">
          Asymmetric Corridor Configuration: -10% / +20%
        </div>
      </div>

      <div className="bg-gray-950/40 rounded-sm border border-gray-900 overflow-hidden flex-grow">
        <div className="grid grid-cols-12 text-[8px] text-gray-600 uppercase border-b border-gray-900 py-2 px-3 font-bold bg-black/60">
          <div className="col-span-3">Date</div>
          <div className="col-span-9 text-center">
            Zone Range & Anchor (●) [EUR / 100<span className="lowercase">k</span>W<span className="lowercase">h</span>]
          </div>
        </div>

        <div className="divide-y divide-gray-900/50">
          {displayDays.map((day: any, i) => {
            const isToday = i === 0;
            const isPositive = day.change >= 1.0;
            const isNegative = day.change < 0;
            const statusColor = isPositive ? 'text-green-500' : (isNegative ? 'text-red-500' : 'text-gray-400');
            const dotColor = isPositive ? 'bg-green-500 shadow-[0_0_10px_#22c55e]' : (isNegative ? 'bg-red-600 shadow-[0_0_10px_#dc2626]' : 'bg-yellow-500');

            return (
              <div key={i} className={`grid grid-cols-12 py-3 px-3 items-center hover:bg-white/5 font-mono text-[10px] ${isToday ? 'bg-yellow-500/5' : ''}`}>
                <div className={`col-span-3 ${isToday ? 'text-yellow-400 font-bold' : 'text-gray-500'}`}>
                  {day.date}
                </div>
                
                <div className="col-span-9 flex flex-col items-center">
                  <div className="w-full flex items-center gap-2">
                    <span className="text-[9px] font-bold text-gray-600 w-8">{day.min.toFixed(2)}</span>
                    
                    {/* KORYTARZ ASYMETRYCZNY */}
                    <div className="flex-grow h-1.5 bg-gray-900 relative rounded-full border border-gray-800 flex overflow-hidden">
                      {/* Strefa 1 (Downside 10%): Zajmuje 33% szerokości (10 z 30) */}
                      <div className="h-full w-[33.3%] bg-blue-500/10 border-r border-gray-800/50"></div>
                      {/* Strefa 2 (Upside 20%): Zajmuje 66.6% szerokości (20 z 30) */}
                      <div className="h-full w-[66.7%] bg-green-500/5"></div>
                      
                      {/* KROPKA ANCHOR (A) - Ustawiona na 33.3% od lewej */}
                      <div 
                        className={`absolute top-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 rounded-full z-10 ${dotColor}`} 
                        style={{ left: '33.3%' }}
                      />
                    </div>

                    <span className="text-[9px] font-bold text-green-500 w-8 text-right">{day.max.toFixed(2)}</span>
                  </div>

                  <div className={`flex items-center gap-1 text-[9px] font-bold mt-1 ${statusColor}`}>
                    <span>{isPositive ? '↑' : (isNegative ? '↓' : '→')}</span>
                    <span>{Math.abs(day.change).toFixed(1)}%</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  )
}