'use client'

import { BSR_MARKETS } from '@/app/markets_config' // Zakładam, że tam masz dostęp do historii lub configu

interface MarketPanelProps {
  currentPrice: number
  borderColor: string
  montserratStyle: any
}

export default function MarketPanel({ currentPrice, borderColor, montserratStyle }: MarketPanelProps) {
  const monoStyle = { fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace' }

  // Przykładowe dane z Twojej historii (ostatnie 7 dni)
  // W realnym kodzie zmapuj tutaj dane z market_history.ts
  const history = [
    { date: '24.02', min: 9.85, max: 10.95 },
    { date: '23.02', min: 9.90, max: 11.05 },
    { date: '22.02', min: 9.75, max: 10.80 },
    { date: '21.02', min: 9.80, max: 10.85 },
    { date: '20.02', min: 10.05, max: 11.20 },
    { date: '19.02', min: 9.95, max: 11.10 },
    { date: '18.02', min: 9.88, max: 11.02 },
  ]

  return (
    <div className="flex flex-col h-full p-4 select-none" style={montserratStyle}>
      {/* NAGŁÓWEK */}
      <div className="text-center mb-2 border-b border-gray-900 pb-1">
        <span className="text-[9px] tracking-[0.3em] text-gray-400 uppercase font-bold">Market Panel</span>
      </div>

      {/* PODTYTUŁ */}
      <div className="text-center mb-1">
        <span className="text-[10px] text-red-600 font-bold tracking-widest uppercase">PHYSICAL DIMENSION</span>
      </div>

      {/* BLACKSLON TRADING ZONE - OSTATNIE 7 DNI */}
      <div className="mb-4">
        <div className="flex justify-between items-center px-1 mb-1">
          <span className="text-[8px] text-gray-500 uppercase font-bold tracking-tighter">BSTZ (7D Corridor)</span>
          <span className="text-[7px] text-gray-600 font-mono">EUR/vkWh</span>
        </div>
        
        <div className="bg-gray-950/30 rounded-sm border border-gray-900/50 overflow-hidden">
          <div className="grid grid-cols-7 text-[7px] text-gray-600 uppercase border-b border-gray-900 py-1 px-2 font-bold bg-black">
            <div className="col-span-2">Date</div>
            <div className="col-span-5 text-right uppercase tracking-tighter">Zone Range (Min — Max)</div>
          </div>
          
          <div className="divide-y divide-gray-900/50">
            {history.map((day, i) => (
              <div key={i} className="grid grid-cols-7 py-1 px-2 items-center hover:bg-gray-900/40 transition-colors">
                <div className="col-span-2 text-[9px] text-gray-400 font-mono" style={monoStyle}>{day.date}</div>
                <div className="col-span-5 flex justify-end gap-2 items-baseline">
                  <span className="text-[10px] text-green-500/60 font-mono" style={monoStyle}>{day.min.toFixed(2)}</span>
                  <div className="w-12 h-[2px] bg-gray-800 relative rounded-full overflow-hidden">
                     <div className="absolute inset-y-0 left-1/4 right-1/4 bg-yellow-500/30"></div>
                  </div>
                  <span className="text-[10px] text-green-500 font-mono" style={monoStyle}>{day.max.toFixed(2)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* BSTZ FORMULA SYNTHESIS - Teraz pod korytarzem */}
      <div className="mb-4 px-1">
        <div className="text-[8px] text-blue-500 font-bold tracking-[0.2em] uppercase text-center mb-2">
          Formula: 10/40/25/25
        </div>
        <div className="space-y-1.5">
          {[
            { label: 'SPOT', w: 10, v: currentPrice, c: 'text-yellow-500' },
            { label: 'FM', w: 40, v: currentPrice + 0.36, c: 'text-white' },
            { label: 'FQ', w: 25, v: currentPrice + 0.73, c: 'text-gray-400' },
            { label: 'CAL', w: 25, v: currentPrice + 1.06, c: 'text-gray-400' }
          ].map((comp, i) => (
            <div key={i} className="flex justify-between items-center border-b border-gray-900/30 pb-0.5">
              <span className="text-[7px] text-gray-600 uppercase font-bold">{comp.label} <span className="text-[6px] ml-1 opacity-50">({comp.w}%)</span></span>
              <span className={`text-[10px] font-mono font-bold ${comp.c}`} style={monoStyle}>{comp.v.toFixed(2)}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="flex-grow" />

      {/* SYNTHESIS OUTPUT */}
      <div className="bg-[#0d1117] border border-gray-800/50 p-3 rounded-sm">
        <div className="flex justify-between items-center mb-1">
          <span className="text-[8px] text-gray-400 uppercase font-bold tracking-widest">Synthesis Output</span>
          <span className="text-[7px] text-blue-500 font-mono animate-pulse uppercase tracking-tighter">ADR Active</span>
        </div>
        <div className="flex justify-between items-baseline">
          <span className="text-[9px] text-gray-500 uppercase">BSTZ Index</span>
          <span className="text-xl font-bold text-yellow-500 font-mono" style={monoStyle}>10.59</span>
        </div>
      </div>
    </div>
  )
}