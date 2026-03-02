'use client'
import React from 'react'

export default function PhysicalDimension({ marketId, currentPrice }: { marketId: string, currentPrice: number }) {
  const history = [
    { label: 'D-1', date: '27.02.2026', min: 9.05, max: 11.05, anchor: 9.95, trend: '+6.0%', change: 6.0 },
    { label: 'W-1', date: '21.02.2026', min: 8.80, max: 10.80, anchor: 9.80, trend: '+7.5%', change: 7.5 },
    { label: 'M-1', date: '28.01.2026', min: 7.92, max: 9.68, anchor: 8.80, trend: '+16.9%', change: 16.9 },
    { label: 'Q-1', date: '28.11.2025', min: 8.00, max: 10.00, anchor: 9.00, trend: '+15.0%', change: 15.0 },
    { label: 'H-1', date: '28.08.2025', min: 7.50, max: 9.50, anchor: 8.50, trend: '+19.7%', change: 19.7 },
    { label: 'Y-1', date: '28.02.2025', min: 7.00, max: 9.00, anchor: 8.00, trend: '+24.5%', change: 24.5 },
  ]

  return (
    <div className="flex flex-col h-full bg-black font-mono text-white p-0">
      
      <div className="w-full pt-3 pb-2 flex flex-col items-center shrink-0">
        <div className="text-[10px] text-gray-500 uppercase tracking-[0.5em] font-bold">
          Physical Market Panel
        </div>
        <div className="w-[80%] border-b border-gray-800 mt-2" />
      </div>

      <div className="flex-grow px-6 pb-6 flex flex-col min-h-0">
        {/* TYTUŁ: BlackSlon Settlement Zone */}
        <div className="p-4 bg-gradient-to-b from-black to-gray-950 w-full">
          <div className="text-[10px] tracking-widest text-amber-700 font-bold mb-1">
            BlackSlon Settlement Zone
          </div>
          <div className="flex justify-between items-center">
            <div className="flex gap-4">
              <span className="text-[10px] text-gray-500 uppercase font-normal">Instrument: <span className="text-yellow-500">BS-P-PL</span></span>
              <span className="text-[10px] text-gray-500 uppercase font-normal">Status: <span className="text-green-500 animate-pulse font-black">LIVE</span></span>
            </div>
          </div>
        </div>

        {/* RANGES */}
        <div className="mb-3 px-2 py-2 border border-yellow-500/40 rounded-sm">
          <div className="flex justify-between items-center mb-1">
            <div className="text-[6px] text-amber-700 uppercase tracking-widest">Valid today · 02.03.2026</div>
            <div className="text-[6px] text-gray-600 tracking-widest">EUR / 100kWh</div>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex flex-col items-center">
              <span className="text-[7px] text-gray-500 uppercase mb-0">Min</span>
              <span className="text-lg text-yellow-500 leading-tight">9.09</span>
            </div>
            <div className="text-gray-800 text-[10px]">——</div>
            <div className="flex flex-col items-center">
              <span className="text-[7px] text-gray-500 uppercase mb-0">Anchor</span>
              <span className="text-lg text-gray-600 leading-tight">{currentPrice.toFixed(2)}</span>
            </div>
            <div className="text-gray-800 text-[10px]">——</div>
            <div className="flex flex-col items-center">
              <span className="text-[7px] text-gray-500 uppercase mb-0">Max</span>
              <span className="text-lg text-yellow-500 leading-tight">11.11</span>
            </div>
          </div>
        </div>

        
        {/* HISTORICAL TABLE */}
        <div className="flex-grow overflow-hidden">
          <div className="grid grid-cols-12 text-[9px] uppercase pb-1 border-b border-gray-900 mb-2">
            <div className="col-span-3 text-gray-400 font-bold">Ref / Date</div>
            <div className="col-span-2 text-center text-gray-500 font-bold">Min</div>
            <div className="col-span-2 text-center text-gray-600 font-normal">Anchor</div>
            <div className="col-span-2 text-center text-gray-500 font-bold">Max</div>
            <div className="col-span-3 text-right text-gray-500 font-bold">Trend</div>
          </div>

          <div className="space-y-1">
            {history.map((row) => (
              <div key={row.label} className="grid grid-cols-12 items-center py-0.5 border-b border-gray-900/30">
                <div className="col-span-3 flex flex-col">
                  <span className="text-[11px] text-gray-400">{row.label}</span>
                  <span className="text-[8px] text-gray-500 leading-tight">{row.date}</span>
                </div>
                <div className="col-span-2 text-[11px] text-gray-500 text-center">{row.min.toFixed(2)}</div>
                <div className="col-span-2 text-[11px] text-gray-600 text-center">{row.anchor.toFixed(2)}</div>
                <div className="col-span-2 text-[11px] text-gray-500 text-center">{row.max.toFixed(2)}</div>
                <div className={`col-span-3 text-[11px] text-right ${row.change >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                  {row.change >= 0 ? '▲' : '▼'} {row.trend}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* FUNDAMENTALS OF PHYSICAL MARKET */}
        <div className="px-6 py-4 border-t border-gray-900 pt-5 mt-auto">
          <div className="text-[10px] tracking-widest text-amber-700 font-bold mb-3">
            Fundamentals of Physical Market
          </div>
          <div className="grid grid-cols-2 gap-4 font-mono">
            {/* ANNUAL CONSUMPTION */}
            <div className="flex flex-col">
              <span className="text-[8px] text-gray-600 uppercase tracking-widest mb-1">ANNUAL CONSUMPTION</span>
              <span className="text-[11px] font-black text-gray-400">174.2 TWh</span>
            </div>
            
            {/* NET IMPORT/EXPORT */}
            <div className="flex flex-col">
              <span className="text-[8px] text-gray-600 uppercase tracking-widest mb-1">NET IMPORT/EXPORT</span>
              <span className="text-[11px] font-black text-gray-400">IMPORT <span className="text-gray-400">3.2%</span></span>
            </div>
            
            {/* FOSSIL GEN (AVG) */}
            <div className="flex flex-col">
              <span className="text-[8px] text-gray-600 uppercase tracking-widest mb-1">FOSSIL GEN (AVG)</span>
              <span className="text-[11px] font-black text-gray-400">COAL 62% | GAS 7%</span>
            </div>
            
            {/* RENEWABLES (AVG) */}
            <div className="flex flex-col">
              <span className="text-[8px] text-gray-600 uppercase tracking-widest mb-1">RENEWABLES (AVG)</span>
              <span className="text-[11px] font-black text-gray-400"><span className="text-gray-400">RES 31%</span> (Wind/PV/Hydro)</span>
            </div>
          </div>
        </div>

        {/* FOOTER */}
        <div className="mt-6 pt-2 border-t border-gray-900 text-[8px] text-gray-700 text-center tracking-widest uppercase">
          BSTZ Protocol · ADR Stabilization Active
        </div>
      </div>
    </div>
  )
}