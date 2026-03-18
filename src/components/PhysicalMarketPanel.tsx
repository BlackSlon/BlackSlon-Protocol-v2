'use client'

import React, { useState, useEffect } from 'react'
import { getMarketData } from '@/data/markets'
import { getMarketColors } from '@/lib/marketColors'
import { getCycleBsszPositions } from '@/lib/marketCycle'

interface Props {
  selectedMarketId?: string
}

export default function PhysicalDimension({ selectedMarketId = 'BS-P-PL' }: Props) {
  const colors = getMarketColors(selectedMarketId)
  const marketData = getMarketData(selectedMarketId as any) as any
  
  const [timeRemaining, setTimeRemaining] = useState('')

  useEffect(() => {
    const updateTimer = () => {
      const now = new Date()
      const utc = new Date(now.getTime() + now.getTimezoneOffset() * 60000)
      const midnight = new Date(utc)
      midnight.setUTCHours(24, 0, 0, 0)
      
      const diff = midnight.getTime() - utc.getTime()
      const hours = Math.floor(diff / (1000 * 60 * 60))
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
      const seconds = Math.floor((diff % (1000 * 60)) / 1000)
      
      setTimeRemaining(`${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`)
    }
    
    updateTimer()
    const interval = setInterval(updateTimer, 1000)
    return () => clearInterval(interval)
  }, [])

  // Resolve BSSZ data
  let bsszPositions: any[] = []
  let currentAnchor = 0
  let currentFloor = 0
  let currentCeiling = 0
  let isLocked = false

  if (selectedMarketId === 'BS-G-NL') {
    currentAnchor = 4.43
    currentFloor = 3.99
    currentCeiling = 5.32
    bsszPositions = [
      { label: 'D-1', refDate: '2026-03-09', bssz: { anchor: 5.03, floor: 4.53, ceiling: 6.04, trendPct: 3.7 } },
      { label: 'D-2', refDate: '2026-03-06', bssz: { anchor: 4.85, floor: 4.37, ceiling: 5.82, trendPct: 7.1 } },
      { label: 'D-3', refDate: '2026-03-05', bssz: { anchor: 4.53, floor: 4.08, ceiling: 5.44, trendPct: 0.9 } },
      { label: 'D-4', refDate: '2026-03-04', bssz: { anchor: 4.49, floor: 4.04, ceiling: 5.39, trendPct: -7.0 } },
      { label: 'D-5', refDate: '2026-03-03', bssz: { anchor: 4.83, floor: 4.35, ceiling: 5.80, trendPct: 19.9 } },
      { label: 'D-6', refDate: '2026-03-02', bssz: { anchor: 4.03, floor: 3.63, ceiling: 4.84, trendPct: 31.3 } },
      { label: 'W-1', refDate: '2026-02-27', bssz: { anchor: 3.07, floor: 2.76, ceiling: 3.68, trendPct: 11.6 } },
    ]
  }
  else if (selectedMarketId === 'BS-G-DE') {
    currentAnchor = 4.50; currentFloor = 4.05; currentCeiling = 5.40
    bsszPositions = [
      { label:'D-1', refDate:'2026-03-09', bssz:{anchor:5.10, floor:4.59, ceiling:6.12, trendPct:4.0} },
      { label:'D-2', refDate:'2026-03-06', bssz:{anchor:4.91, floor:4.42, ceiling:5.89, trendPct:7.1} },
      { label:'D-3', refDate:'2026-03-05', bssz:{anchor:4.58, floor:4.12, ceiling:5.50, trendPct:0.9} },
      { label:'D-4', refDate:'2026-03-04', bssz:{anchor:4.54, floor:4.09, ceiling:5.45, trendPct:-6.9} },
      { label:'D-5', refDate:'2026-03-03', bssz:{anchor:4.88, floor:4.39, ceiling:5.86, trendPct:19.5} },
      { label:'D-6', refDate:'2026-03-02', bssz:{anchor:4.08, floor:3.67, ceiling:4.90, trendPct:31.0} },
      { label:'W-1', refDate:'2026-02-27', bssz:{anchor:3.12, floor:2.80, ceiling:3.74, trendPct:11.4} },
    ]
  }
  else if (selectedMarketId === 'BS-G-PL') {
    currentAnchor = 4.78; currentFloor = 4.30; currentCeiling = 5.74
    bsszPositions = [
      { label:'D-1', refDate:'2026-03-09', bssz:{anchor:5.59, floor:5.03, ceiling:6.70, trendPct:2.5} },
      { label:'D-2', refDate:'2026-03-06', bssz:{anchor:5.45, floor:4.91, ceiling:6.54, trendPct:8.7} },
      { label:'D-3', refDate:'2026-03-05', bssz:{anchor:5.02, floor:4.51, ceiling:6.02, trendPct:2.7} },
      { label:'D-4', refDate:'2026-03-04', bssz:{anchor:4.88, floor:4.39, ceiling:5.86, trendPct:-8.5} },
      { label:'D-5', refDate:'2026-03-03', bssz:{anchor:5.33, floor:4.80, ceiling:6.40, trendPct:18.0} },
      { label:'D-6', refDate:'2026-03-02', bssz:{anchor:4.52, floor:4.07, ceiling:5.43, trendPct:32.0} },
      { label:'W-1', refDate:'2026-02-27', bssz:{anchor:3.43, floor:3.08, ceiling:4.11, trendPct:4.2} },
    ]
  }
  else if (selectedMarketId === 'BS-G-BG') {
    currentAnchor = 4.13; currentFloor = 3.72; currentCeiling = 4.95
    bsszPositions = [
      { label:'D-1', refDate:'2026-03-09', bssz:{anchor:3.72, floor:3.35, ceiling:4.47, trendPct:4.6} },
      { label:'D-2', refDate:'2026-03-06', bssz:{anchor:3.56, floor:3.20, ceiling:4.27, trendPct:-3.9} },
      { label:'D-3', refDate:'2026-03-05', bssz:{anchor:3.70, floor:3.33, ceiling:4.44, trendPct:-8.5} },
      { label:'D-4', refDate:'2026-03-04', bssz:{anchor:4.05, floor:3.64, ceiling:4.86, trendPct:2.3} },
      { label:'D-5', refDate:'2026-03-03', bssz:{anchor:3.96, floor:3.56, ceiling:4.75, trendPct:25.4} },
      { label:'D-6', refDate:'2026-03-02', bssz:{anchor:3.16, floor:2.84, ceiling:3.79, trendPct:12.9} },
      { label:'W-1', refDate:'2026-02-27', bssz:{anchor:2.80, floor:2.52, ceiling:3.36, trendPct:1.4} },
    ]
  }
  else if (selectedMarketId === 'BS-P-DE') {
    currentAnchor=9.121; currentFloor=8.209; currentCeiling=10.945
    bsszPositions = [
      {label:'D-1', refDate:'2026-03-09', bssz:{anchor:9.117, floor:8.205, ceiling:10.940, trendPct:0.4}},
      {label:'D-2', refDate:'2026-03-06', bssz:{anchor:9.081, floor:8.173, ceiling:10.897, trendPct:1.2}},
      {label:'D-3', refDate:'2026-03-05', bssz:{anchor:8.971, floor:8.074, ceiling:10.765, trendPct:2.4}},
      {label:'D-4', refDate:'2026-03-04', bssz:{anchor:8.762, floor:7.886, ceiling:10.514, trendPct:2.3}},
      {label:'D-5', refDate:'2026-03-03', bssz:{anchor:8.568, floor:7.711, ceiling:10.281, trendPct:8.1}},
      {label:'D-6', refDate:'2026-03-02', bssz:{anchor:7.925, floor:7.132, ceiling:9.510, trendPct:4.8}},
      {label:'W-1', refDate:'2026-02-27', bssz:{anchor:7.563, floor:6.806, ceiling:9.075, trendPct:0.0}},
    ]
  }
  else if (selectedMarketId === 'BS-P-NO') {
    currentAnchor=4.972; currentFloor=4.475; currentCeiling=5.966
    bsszPositions = [
      {label:'D-1', refDate:'2026-03-09', bssz:{anchor:4.995, floor:4.496, ceiling:5.994, trendPct:0.7}},
      {label:'D-2', refDate:'2026-03-06', bssz:{anchor:4.962, floor:4.466, ceiling:5.955, trendPct:-1.5}},
      {label:'D-3', refDate:'2026-03-05', bssz:{anchor:5.037, floor:4.533, ceiling:6.044, trendPct:-0.9}},
      {label:'D-4', refDate:'2026-03-04', bssz:{anchor:5.081, floor:4.573, ceiling:6.097, trendPct:0.1}},
      {label:'D-5', refDate:'2026-03-03', bssz:{anchor:5.077, floor:4.569, ceiling:6.092, trendPct:4.9}},
      {label:'D-6', refDate:'2026-03-02', bssz:{anchor:4.840, floor:4.356, ceiling:5.808, trendPct:2.4}},
      {label:'W-1', refDate:'2026-02-27', bssz:{anchor:4.727, floor:4.254, ceiling:5.672, trendPct:0.0}},
    ]
  }
  else if (selectedMarketId === 'BS-P-PL') {
    currentAnchor=9.938; currentFloor=8.944; currentCeiling=11.926
    bsszPositions = [
      {label:'D-1', refDate:'2026-03-09', bssz:{anchor:9.952, floor:8.957, ceiling:11.943, trendPct:1.1}},
      {label:'D-2', refDate:'2026-03-06', bssz:{anchor:9.844, floor:8.860, ceiling:11.813, trendPct:-1.1}},
      {label:'D-3', refDate:'2026-03-05', bssz:{anchor:9.955, floor:8.960, ceiling:11.946, trendPct:-0.2}},
      {label:'D-4', refDate:'2026-03-04', bssz:{anchor:9.979, floor:8.981, ceiling:11.975, trendPct:-0.7}},
      {label:'D-5', refDate:'2026-03-03', bssz:{anchor:10.050, floor:9.045, ceiling:12.060, trendPct:3.7}},
      {label:'D-6', refDate:'2026-03-02', bssz:{anchor:9.692, floor:8.723, ceiling:11.631, trendPct:1.5}},
      {label:'W-1', refDate:'2026-02-27', bssz:{anchor:9.554, floor:8.598, ceiling:11.464, trendPct:0.0}},
    ]
  }
  else if (selectedMarketId === 'BS-P-UK') {
    currentAnchor=8.773; currentFloor=7.896; currentCeiling=10.527
    bsszPositions = [
      {label:'D-1', refDate:'2026-03-09', bssz:{anchor:9.051, floor:8.145, ceiling:10.861, trendPct:4.3}},
      {label:'D-2', refDate:'2026-03-06', bssz:{anchor:8.677, floor:7.809, ceiling:10.412, trendPct:4.3}},
      {label:'D-3', refDate:'2026-03-05', bssz:{anchor:8.321, floor:7.489, ceiling:9.985, trendPct:0.6}},
      {label:'D-4', refDate:'2026-03-04', bssz:{anchor:8.271, floor:7.444, ceiling:9.925, trendPct:7.0}},
      {label:'D-5', refDate:'2026-03-03', bssz:{anchor:7.731, floor:6.958, ceiling:9.277, trendPct:0.2}},
      {label:'D-6', refDate:'2026-03-02', bssz:{anchor:7.719, floor:6.947, ceiling:9.262, trendPct:13.8}},
      {label:'W-1', refDate:'2026-02-27', bssz:{anchor:6.784, floor:6.105, ceiling:8.140, trendPct:0.0}},
    ]
  } else if (marketData?.bsszPositions?.length > 0) {
    // New format: BS-G-NL etc.
    bsszPositions = marketData.bsszPositions
    currentAnchor = marketData.bsszPositions[0].bssz.anchor
    currentFloor = marketData.bsszPositions[0].bssz.floor
    currentCeiling = marketData.bsszPositions[0].bssz.ceiling
  } else if (marketData?.bsszCalculation) {
    // Old format: BS-P-PL
    currentAnchor = marketData.bsszCalculation.anchor
    currentFloor = marketData.bsszCalculation.floor
    currentCeiling = marketData.bsszCalculation.ceiling
    if (marketData.historicalData?.length > 0) {
      const labels = ['D-1','D-2','D-3','D-4','D-5','D-6','D-7','W-1','M-1','Q-1','H-1','Y-1']
      bsszPositions = marketData.historicalData.slice(0, labels.length).map((d: any, i: number, arr: any[]) => ({
        label: labels[i],
        refDate: d.date,
        bssz: {
          anchor: d.price,
          floor: parseFloat((d.price * 0.90).toFixed(2)),
          ceiling: parseFloat((d.price * 1.20).toFixed(2)),
          trendPct: i < arr.length - 1
            ? parseFloat(((d.price - arr[i + 1].price) / arr[i + 1].price * 100).toFixed(2))
            : null,
        },
      }))
    }
  }

  const today = new Date().toLocaleDateString('pl-PL', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  })

  return (
    <div className="flex flex-col h-full bg-black font-mono text-white p-0">

      {/* ── Header ── */}
      <div className="w-full pt-1 pb-1 flex flex-col items-center shrink-0">
        <div className="text-[10px] text-gray-500 uppercase tracking-[0.5em] font-bold">
          Physical Market Panel
        </div>
        <div className="w-[80%] border-b border-gray-800 mt-2" />
      </div>

      <div className="flex-grow px-6 pb-6 flex flex-col min-h-0">

        {/* ── Section title ── */}
        <div className="pt-2 pb-1 bg-gradient-to-b from-black to-gray-950 w-full">
          <div className={`text-[10px] tracking-widest font-bold mb-1 text-center ${colors.title}`}>
            BlackSlon Settlement Zone (BSSZ)
          </div>
        </div>

        {/* ── BSSZ Corridor — today's values ── */}
        <div className={`mb-3 px-2 py-2 border rounded-sm ${isLocked ? 'border-red-500/60 bg-red-900/10' : colors.border}`}>
          <div className="flex justify-between items-center mb-1">
            <div className={`text-[6px] uppercase tracking-widest ${colors.title}`}>
              Active until: {timeRemaining}
            </div>
            <div className="text-[6px] text-gray-400 tracking-widest">EUR / 100kWh</div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex flex-col items-center">
              <span className="text-[7px] text-gray-500 uppercase mb-0">Floor (−10%)</span>
              <span className={`text-sm leading-tight font-normal ${colors.value}`}>
                {currentFloor.toFixed(2)}
              </span>
            </div>

            <div className="text-gray-800 text-[10px]">——</div>

            <div className="flex flex-col items-center">
              <span className="text-[7px] text-gray-500 uppercase mb-0">Anchor (a)</span>
              <span className="text-sm text-gray-300 leading-tight font-normal">
                {currentAnchor.toFixed(2)}
              </span>
            </div>

            <div className="text-gray-800 text-[10px]">——</div>

            <div className="flex flex-col items-center">
              <span className="text-[7px] text-gray-500 uppercase mb-0">Ceiling (+20%)</span>
              <span className={`text-sm leading-tight font-normal ${colors.value}`}>
                {currentCeiling.toFixed(2)}
              </span>
            </div>
          </div>
        </div>

        {/* ── Historical anchor table ── */}
        <div className="flex-grow overflow-hidden">
          <div className="grid grid-cols-12 text-[9px] uppercase pb-1 border-b border-gray-900 mb-2">
            <div className="col-span-2 text-gray-400 font-bold">Ref</div>
            <div className="col-span-2 text-gray-400 font-bold">Date</div>
            <div className="col-span-2 text-center text-gray-500 font-bold">Floor</div>
            <div className="col-span-2 text-center text-gray-400 font-normal">Anchor</div>
            <div className="col-span-2 text-center text-gray-500 font-bold">Ceiling</div>
            <div className="col-span-2 text-right text-gray-500 font-bold">Trend</div>
          </div>

          <div className="space-y-1">
            {bsszPositions.map((position) => {
              const trendPct = position.bssz.trendPct
              return (
                <div key={position.label} className="grid grid-cols-12 items-center py-0.5 border-b border-gray-900/30">
                  <div className="col-span-2 text-[11px] text-gray-300">
                    {position.label}
                  </div>
                  <div className="col-span-2 text-[7px] text-gray-500">
                    {position.refDate}
                  </div>
                  <div className="col-span-2 text-[11px] text-gray-500 text-center">
                    {position.bssz.floor.toFixed(2)}
                  </div>
                  <div className="col-span-2 text-[11px] text-gray-400 text-center">
                    {position.bssz.anchor.toFixed(2)}
                  </div>
                  <div className="col-span-2 text-[11px] text-gray-500 text-center">
                    {position.bssz.ceiling.toFixed(2)}
                  </div>
                  <div className={`col-span-2 text-[11px] text-right ${
                    trendPct === null ? 'text-gray-700' : trendPct >= 0 ? 'text-green-700' : 'text-red-600'
                  }`}>
                    {trendPct === null ? '—' : `${trendPct >= 0 ? '▲' : '▼'} ${Math.abs(trendPct).toFixed(1)}%`}
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        
      </div>
    </div>
  )
}
