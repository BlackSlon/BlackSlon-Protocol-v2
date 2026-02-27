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
    const anchor = (day.spot / 10 * 0.1) + (day.fm / 10 * 0.4) + (day.fq / 10 * 0.25) + (day.cal / 10 * 0.25);
    
    // POWRÓT DO SYMETRII +/- 10%
    const min = anchor * 0.90;
    const max = anchor * 1.10;
    
    const prevDay = history[index - 1];
    let change = 0;
    if (prevDay) {
      const prevAnchor = (prevDay.spot / 10 * 0.1) + (prevDay.fm / 10 * 0.4) + (prevDay.fq / 10 * 0.25) + (prevDay.cal / 10 * 0.25);
      change = ((anchor - prevAnchor) / prevAnchor) * 100;
    }

    return { date: day.date, anchor, min, max, change };
  };

  const last7Days = Array.from({ length: 7 }, (_, i) => history.length - 1 - i)
    .map(idx => calcBSTZ(idx)).filter(Boolean);

  const historicalPoints = [
    { label: '30 DAYS AGO', data: calcBSTZ(history.length - 1 - 30) },
    { label: '90 DAYS AGO', data: calcBSTZ(history.length - 1 - 90) },
    { label: '1 YEAR AGO', data: calcBSTZ(history.length - 1 - 365) }
  ];

  return (
    <div className="flex flex-col h-full select-none bg-transparent pt-[9px]"> {/* Precyzyjne wyrównanie do Virtual */}
      
      {/* NAGŁÓWEK PANELU */}
      <div className="text-[10px] text-gray-500 uppercase tracking-[0.5em] font-bold text-center py-2 border-b border-gray-900 bg-black/40 mb-4">
        <span>PHYSICAL MARKET DIMENSION</span>
      </div>

      {/* CZERWONY TYTUŁ (Mixed Case) */}
      <div className="text-center mb-4">
        <div className="text-[11px] font-black tracking-widest text-red-600">
          BlackSlon Trading Zone (BSTZ)
        </div>
      </div>

      {/* TABELA 7D */}
      <div className="bg-gray-950/40 rounded-sm border border-gray-900 overflow-hidden mb-6">
        <div className="grid grid-cols-12 text-[8px] text-gray-600 uppercase border-b border-gray-900 py-2 px-3 font-bold bg-black/60">
          <div className="col-span-3">Date</div>
          <div className="col-span-9 text-center">
            Zone Range & Anchor (●) [EUR / 100<span className="lowercase">k</span>W<span className="lowercase">h</span>]
          </div>
        </div>

        <div className="divide-y divide-gray-900/50">
          {last7Days.map((day: any, i) => (
            <div key={i} className={`grid grid-cols-12 py-2 px-3 items-center hover:bg-white/5 font-mono text-[10px] ${i === 0 ? 'bg-yellow-500/5' : ''}`}>
              <div className="col-span-3 text-gray-500">{day.date}</div>
              <div className="col-span-9">
                <div className="flex items-center gap-2">
                  <span className="text-[9px] text-gray-600 w-8">{day.min.toFixed(2)}</span>
                  <div className="flex-grow h-1 bg-gray-900 relative rounded-full border border-gray-800">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-red-600 shadow-[0_0_8px_red] z-10" />
                  </div>
                  <span className="text-[9px] text-green-500 w-8 text-right">{day.max.toFixed(2)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* DODATKOWE SUWAKI HISTORYCZNE POD SPODEM */}
      <div className="space-y-4 px-1">
        <div className="text-[9px] text-gray-500 font-bold tracking-[0.2em] border-b border-gray-900 pb-1 mb-2">HISTORICAL CONTEXT</div>
        {historicalPoints.map((point, idx) => (
          point.data && (
            <div key={idx} className="space-y-1">
              <div className="flex justify-between text-[8px] text-gray-500 font-bold uppercase">
                <span>{point.label} ({point.data.date})</span>
                <span className={point.data.change >= 1 ? 'text-green-500' : point.data.change < 0 ? 'text-red-500' : 'text-gray-600'}>
                  {point.data.change >= 1 ? '↑' : point.data.change < 0 ? '↓' : '→'} {Math.abs(point.data.change).toFixed(1)}%
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[8px] text-gray-700 w-8 font-mono">{point.data.min.toFixed(2)}</span>
                <div className="flex-grow h-1 bg-gray-950 relative rounded-full border border-gray-900">
                  <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full z-10 
                    ${point.data.change >= 1 ? 'bg-green-500 shadow-[0_0_5px_green]' : point.data.change < 0 ? 'bg-red-600 shadow-[0_0_5px_red]' : 'bg-gray-600'}`} 
                  />
                </div>
                <span className="text-[8px] text-gray-700 w-8 text-right font-mono">{point.data.max.toFixed(2)}</span>
              </div>
            </div>
          )
        ))}
      </div>
    </div>
  )
}