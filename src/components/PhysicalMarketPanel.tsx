'use client'

import React, { useState, useEffect } from 'react'
import { getMarketData } from '@/data/markets'
import { getMarketColors } from '@/lib/marketColors'
import { getCycleBsszPositions } from '@/lib/marketCycle'
import Tooltip from '@/components/Tooltip'
import { getMarketTooltips } from '@/lib/marketTooltips'

interface Props {
  selectedMarketId?: string
}

export default function PhysicalDimension({ selectedMarketId = 'BS-P-PL' }: Props) {
  const colors = getMarketColors(selectedMarketId)
  const marketData = getMarketData(selectedMarketId as any) as any
  const tt = getMarketTooltips(selectedMarketId)
  
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
  let currentCap = 0
  let isLocked = false

  if (selectedMarketId === 'BS-G-NL') {
    currentAnchor = 4.43
    currentFloor = 3.99
    currentCap = 5.32
    bsszPositions = [
      { label: 'D-1', refDate: '2026-03-09', bssz: { anchor: 5.03, floor: 4.53, cap: 6.04, trendPct: 3.7 } },
      { label: 'D-2', refDate: '2026-03-06', bssz: { anchor: 4.85, floor: 4.37, cap: 5.82, trendPct: 7.1 } },
      { label: 'D-3', refDate: '2026-03-05', bssz: { anchor: 4.53, floor: 4.08, cap: 5.44, trendPct: 0.9 } },
      { label: 'D-4', refDate: '2026-03-04', bssz: { anchor: 4.49, floor: 4.04, cap: 5.39, trendPct: -7.0 } },
      { label: 'D-5', refDate: '2026-03-03', bssz: { anchor: 4.83, floor: 4.35, cap: 5.80, trendPct: 19.9 } },
      { label: 'D-6', refDate: '2026-03-02', bssz: { anchor: 4.03, floor: 3.63, cap: 4.84, trendPct: 31.3 } },
      { label: 'W-1', refDate: '2026-02-27', bssz: { anchor: 3.07, floor: 2.76, cap: 3.68, trendPct: 11.6 } },
    ]
  }
  else if (selectedMarketId === 'BS-G-DE') {
    currentAnchor = 4.50; currentFloor = 4.05; currentCap = 5.40
    bsszPositions = [
      { label:'D-1', refDate:'2026-03-09', bssz:{anchor:5.10, floor:4.59, cap:6.12, trendPct:4.0} },
      { label:'D-2', refDate:'2026-03-06', bssz:{anchor:4.91, floor:4.42, cap:5.89, trendPct:7.1} },
      { label:'D-3', refDate:'2026-03-05', bssz:{anchor:4.58, floor:4.12, cap:5.50, trendPct:0.9} },
      { label:'D-4', refDate:'2026-03-04', bssz:{anchor:4.54, floor:4.09, cap:5.45, trendPct:-6.9} },
      { label:'D-5', refDate:'2026-03-03', bssz:{anchor:4.88, floor:4.39, cap:5.86, trendPct:19.5} },
      { label:'D-6', refDate:'2026-03-02', bssz:{anchor:4.08, floor:3.67, cap:4.90, trendPct:31.0} },
      { label:'W-1', refDate:'2026-02-27', bssz:{anchor:3.12, floor:2.80, cap:3.74, trendPct:11.4} },
    ]
  }
  else if (selectedMarketId === 'BS-G-PL') {
    currentAnchor = 4.78; currentFloor = 4.30; currentCap = 5.74
    bsszPositions = [
      { label:'D-1', refDate:'2026-03-09', bssz:{anchor:5.59, floor:5.03, cap:6.70, trendPct:2.5} },
      { label:'D-2', refDate:'2026-03-06', bssz:{anchor:5.45, floor:4.91, cap:6.54, trendPct:8.7} },
      { label:'D-3', refDate:'2026-03-05', bssz:{anchor:5.02, floor:4.51, cap:6.02, trendPct:2.7} },
      { label:'D-4', refDate:'2026-03-04', bssz:{anchor:4.88, floor:4.39, cap:5.86, trendPct:-8.5} },
      { label:'D-5', refDate:'2026-03-03', bssz:{anchor:5.33, floor:4.80, cap:6.40, trendPct:18.0} },
      { label:'D-6', refDate:'2026-03-02', bssz:{anchor:4.52, floor:4.07, cap:5.43, trendPct:32.0} },
      { label:'W-1', refDate:'2026-02-27', bssz:{anchor:3.43, floor:3.08, cap:4.11, trendPct:4.2} },
    ]
  }
  else if (selectedMarketId === 'BS-G-BG') {
    currentAnchor = 4.13; currentFloor = 3.72; currentCap = 4.95
    bsszPositions = [
      { label:'D-1', refDate:'2026-03-09', bssz:{anchor:3.72, floor:3.35, cap:4.47, trendPct:4.6} },
      { label:'D-2', refDate:'2026-03-06', bssz:{anchor:3.56, floor:3.20, cap:4.27, trendPct:-3.9} },
      { label:'D-3', refDate:'2026-03-05', bssz:{anchor:3.70, floor:3.33, cap:4.44, trendPct:-8.5} },
      { label:'D-4', refDate:'2026-03-04', bssz:{anchor:4.05, floor:3.64, cap:4.86, trendPct:2.3} },
      { label:'D-5', refDate:'2026-03-03', bssz:{anchor:3.96, floor:3.56, cap:4.75, trendPct:25.4} },
      { label:'D-6', refDate:'2026-03-02', bssz:{anchor:3.16, floor:2.84, cap:3.79, trendPct:12.9} },
      { label:'W-1', refDate:'2026-02-27', bssz:{anchor:2.80, floor:2.52, cap:3.36, trendPct:1.4} },
    ]
  }
  else if (selectedMarketId === 'BS-P-DE') {
    currentAnchor=9.121; currentFloor=8.209; currentCap=10.945
    bsszPositions = [
      {label:'D-1', refDate:'2026-03-09', bssz:{anchor:9.117, floor:8.205, cap:10.940, trendPct:0.4}},
      {label:'D-2', refDate:'2026-03-06', bssz:{anchor:9.081, floor:8.173, cap:10.897, trendPct:1.2}},
      {label:'D-3', refDate:'2026-03-05', bssz:{anchor:8.971, floor:8.074, cap:10.765, trendPct:2.4}},
      {label:'D-4', refDate:'2026-03-04', bssz:{anchor:8.762, floor:7.886, cap:10.514, trendPct:2.3}},
      {label:'D-5', refDate:'2026-03-03', bssz:{anchor:8.568, floor:7.711, cap:10.281, trendPct:8.1}},
      {label:'D-6', refDate:'2026-03-02', bssz:{anchor:7.925, floor:7.132, cap:9.510, trendPct:4.8}},
      {label:'W-1', refDate:'2026-02-27', bssz:{anchor:7.563, floor:6.806, cap:9.075, trendPct:0.0}},
    ]
  }
  else if (selectedMarketId === 'BS-P-NO') {
    currentAnchor=6.213; currentFloor=5.592; currentCap=7.456
    bsszPositions = [
      {label:'D-1', refDate:'2026-03-09', bssz:{anchor:6.368, floor:5.731, cap:7.642, trendPct:-2.43}},
      {label:'D-2', refDate:'2026-03-06', bssz:{anchor:6.220, floor:5.598, cap:7.464, trendPct:2.38}},
      {label:'D-3', refDate:'2026-03-05', bssz:{anchor:6.217, floor:5.595, cap:7.460, trendPct:0.05}},
      {label:'D-4', refDate:'2026-03-04', bssz:{anchor:6.356, floor:5.720, cap:7.627, trendPct:-2.19}},
      {label:'D-5', refDate:'2026-03-03', bssz:{anchor:6.472, floor:5.825, cap:7.766, trendPct:-1.79}},
      {label:'D-6', refDate:'2026-03-02', bssz:{anchor:6.360, floor:5.724, cap:7.632, trendPct:1.76}},
      {label:'W-1', refDate:'2026-02-27', bssz:{anchor:6.203, floor:5.583, cap:7.444, trendPct:2.53}},
    ]
  }
  else if (selectedMarketId === 'BS-P-PL') {
    currentAnchor=9.938; currentFloor=8.944; currentCap=11.926
    bsszPositions = [
      {label:'D-1', refDate:'2026-03-09', bssz:{anchor:9.952, floor:8.957, cap:11.943, trendPct:1.1}},
      {label:'D-2', refDate:'2026-03-06', bssz:{anchor:9.844, floor:8.860, cap:11.813, trendPct:-1.1}},
      {label:'D-3', refDate:'2026-03-05', bssz:{anchor:9.955, floor:8.960, cap:11.946, trendPct:-0.2}},
      {label:'D-4', refDate:'2026-03-04', bssz:{anchor:9.979, floor:8.981, cap:11.975, trendPct:-0.7}},
      {label:'D-5', refDate:'2026-03-03', bssz:{anchor:10.050, floor:9.045, cap:12.060, trendPct:3.7}},
      {label:'D-6', refDate:'2026-03-02', bssz:{anchor:9.692, floor:8.723, cap:11.631, trendPct:1.5}},
      {label:'W-1', refDate:'2026-02-27', bssz:{anchor:9.554, floor:8.598, cap:11.464, trendPct:0.0}},
    ]
  }
  else if (selectedMarketId === 'BS-P-UK') {
    currentAnchor=8.773; currentFloor=7.896; currentCap=10.527
    bsszPositions = [
      {label:'D-1', refDate:'2026-03-09', bssz:{anchor:9.051, floor:8.145, cap:10.861, trendPct:4.3}},
      {label:'D-2', refDate:'2026-03-06', bssz:{anchor:8.677, floor:7.809, cap:10.412, trendPct:4.3}},
      {label:'D-3', refDate:'2026-03-05', bssz:{anchor:8.321, floor:7.489, cap:9.985, trendPct:0.6}},
      {label:'D-4', refDate:'2026-03-04', bssz:{anchor:8.271, floor:7.444, cap:9.925, trendPct:7.0}},
      {label:'D-5', refDate:'2026-03-03', bssz:{anchor:7.731, floor:6.958, cap:9.277, trendPct:0.2}},
      {label:'D-6', refDate:'2026-03-02', bssz:{anchor:7.719, floor:6.947, cap:9.262, trendPct:13.8}},
      {label:'W-1', refDate:'2026-02-27', bssz:{anchor:6.784, floor:6.105, cap:8.140, trendPct:0.0}},
    ]
  } else if (marketData?.bsszPositions?.length > 0) {
    // New format: BS-G-NL etc.
    bsszPositions = marketData.bsszPositions
    currentAnchor = marketData.bsszPositions[0].bssz.anchor
    currentFloor = marketData.bsszPositions[0].bssz.floor
    currentCap = marketData.bsszPositions[0].bssz.cap || marketData.bsszPositions[0].bssz.ceiling
  } else if (marketData?.bsszCalculation) {
    // Old format: BS-P-PL
    currentAnchor = marketData.bsszCalculation.anchor
    currentFloor = marketData.bsszCalculation.floor
    currentCap = marketData.bsszCalculation.ceiling
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
          <div className="flex items-center justify-center gap-2">
            <Tooltip content={tt.bssz}>
              <div className={`text-[10px] tracking-widest font-bold mb-1 text-center ${colors.title}`}>
                BlackSlon Settlement Zone (BSSZ)
              </div>
            </Tooltip>
            <div className={`px-2 py-0.5 rounded text-[7px] uppercase tracking-widest font-bold border ${colors.badgeBorder} ${colors.badgeText}`}>
              {selectedMarketId}
            </div>
          </div>
        </div>

        {/* ── BSSZ Corridor — today's values ── */}
        <div className={`mb-2 px-2 py-2 border rounded-sm ${isLocked ? 'border-red-500/60 bg-red-900/10' : colors.border}`}>
          <div className="flex justify-between items-center mb-1">
            <div className={`text-[6px] uppercase tracking-widest ${colors.title}`}>
              Active until: {timeRemaining}
            </div>
            <div className="text-[6px] text-gray-400 tracking-widest">EUR / 100kWh</div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex flex-col items-center">
              <Tooltip content={tt.floor}>
                <span className="text-[7px] text-gray-500 uppercase mb-0">Floor (−10%)</span>
              </Tooltip>
              <span className={`text-sm leading-tight font-normal ${colors.value}`}>
                {currentFloor.toFixed(2)}
              </span>
            </div>

            <div className="text-gray-800 text-[10px]">——</div>

            <div className="flex flex-col items-center">
              <Tooltip content={tt.anchor}>
                <span className="text-[7px] text-gray-500 uppercase mb-0">Anchor (a)</span>
              </Tooltip>
              <span className="text-sm text-gray-300 leading-tight font-normal">
                {currentAnchor.toFixed(2)}
              </span>
            </div>

            <div className="text-gray-800 text-[10px]">——</div>

            <div className="flex flex-col items-center">
              <Tooltip content={tt.cap}>
                <span className="text-[7px] text-gray-500 uppercase mb-0">Cap (+20%)</span>
              </Tooltip>
              <span className={`text-sm leading-tight font-normal ${colors.value}`}>
                {currentCap.toFixed(2)}
              </span>
            </div>
          </div>
        </div>

        {/* ── Historical anchor table ── */}
        <div className="flex-grow overflow-hidden">
          <div className="grid grid-cols-12 text-[9px] uppercase pb-1 border-b border-gray-900 mb-1">
            <div className="col-span-2 text-gray-400 font-bold">Ref</div>
            <div className="col-span-2 text-gray-400 font-bold">Date</div>
            <div className="col-span-2 text-center text-gray-500 font-bold">Floor</div>
            <div className="col-span-2 text-center text-gray-400 font-normal">Anchor</div>
            <div className="col-span-2 text-center text-gray-500 font-bold">Cap</div>
            <div className="col-span-2 text-right text-gray-500 font-bold">Trend</div>
          </div>

          <div className="space-y-0.5">
            {bsszPositions.map((position) => {
              const trendPct = position.bssz.trendPct
              return (
                <div key={position.label} className="grid grid-cols-12 items-center py-0.25 border-b border-gray-900/30">
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
                    {position.bssz.cap ? position.bssz.cap.toFixed(2) : position.bssz.ceiling.toFixed(2)}
                  </div>
                  <div className={`col-span-2 text-[11px] text-right ${
                    trendPct === null ? 'text-gray-500' : trendPct >= 0 ? 'text-green-700' : 'text-red-600'
                  }`}>
                    {trendPct === null ? '—' : `${trendPct >= 0 ? '▲' : '▼'} ${Math.abs(trendPct).toFixed(1)}%`}
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* ── FM Comparison Table ── */}
        <div className="mt-3 border-t border-gray-800 pt-3">
          <div className="flex items-center justify-center gap-2">
            <Tooltip content={tt.bsszVsFwd}>
              <div className={`text-[9px] tracking-wider font-bold mb-1 text-center ${colors.title}`}>
                Anchor (BSSZ) vs Physical Market (FM)
              </div>
            </Tooltip>
            <div className={`px-2 py-0.5 rounded text-[7px] uppercase tracking-widest font-bold border ${colors.badgeBorder} ${colors.badgeText}`}>
              {selectedMarketId}
            </div>
          </div>
          <div className="grid grid-cols-12 text-[9px] uppercase pb-1 border-b border-gray-800 mb-1">
            <div className="col-span-2 text-gray-400">Ref</div>
            <div className="col-span-2 text-gray-400">Date</div>
            <div className="col-span-2 text-center text-gray-400">
              <Tooltip content={tt.fm}><span className="cursor-help">FM</span></Tooltip>
            </div>
            <div className="col-span-2 text-center text-gray-400">Anchor</div>
            <div className="col-span-4 flex flex-col items-center">
              <Tooltip content={tt.spread}>
                <span className="text-gray-400 cursor-help">SPREAD</span>
              </Tooltip>
              <div className="w-full grid grid-cols-2 text-[7px] normal-case mt-0.5 text-gray-500">
                <div className="text-center">(%)</div>
                <div className="text-right">(EUR/100kWh)</div>
              </div>
            </div>
          </div>
          <div className="space-y-0.5">
            {(() => {
              // FM data for each market
              const fmData: Record<string, Array<{label: string; date: string; anchor: number; fm?: number}>> = {
                'BS-G-NL': [
                  {label: 'D-1', date: '09.03.26', anchor: 5.03, fm: 5.677},
                  {label: 'D-2', date: '06.03.26', anchor: 4.85, fm: 5.257},
                  {label: 'D-3', date: '05.03.26', anchor: 4.53, fm: 4.920},
                  {label: 'D-4', date: '04.03.26', anchor: 4.49, fm: 4.672},
                  {label: 'D-5', date: '03.03.26', anchor: 4.83, fm: 5.246},
                  {label: 'D-6', date: '02.03.26', anchor: 4.03, fm: 4.244},
                  {label: 'W-1', date: '27.02.26', anchor: 3.07, fm: 2.655},
                ],
                'BS-G-DE': [
                  {label: 'D-1', date: '09.03.26', anchor: 5.10, fm: 5.223},
                  {label: 'D-2', date: '06.03.26', anchor: 4.91, fm: 5.062},
                  {label: 'D-3', date: '05.03.26', anchor: 4.58, fm: 4.922},
                  {label: 'D-4', date: '04.03.26', anchor: 4.54, fm: 4.673},
                  {label: 'D-5', date: '03.03.26', anchor: 4.88, fm: 5.246},
                  {label: 'D-6', date: '02.03.26', anchor: 4.08, fm: 4.273},
                  {label: 'W-1', date: '27.02.26', anchor: 3.12, fm: 2.671},
                ],
                'BS-G-PL': [
                  {label: 'D-1', date: '09.03.26', anchor: 5.59, fm: 6.174},
                  {label: 'D-2', date: '06.03.26', anchor: 5.45, fm: 5.989},
                  {label: 'D-3', date: '05.03.26', anchor: 5.02, fm: 5.246},
                  {label: 'D-4', date: '04.03.26', anchor: 4.88, fm: 5.400},
                  {label: 'D-5', date: '03.03.26', anchor: 5.33, fm: 5.791},
                  {label: 'D-6', date: '02.03.26', anchor: 4.52, fm: 5.345},
                  {label: 'W-1', date: '27.02.26', anchor: 3.43, fm: 3.486},
                ],
                'BS-G-BG': [
                  {label: 'D-1', date: '09.03.26', anchor: 3.72, fm: 4.120},
                  {label: 'D-2', date: '06.03.26', anchor: 3.56, fm: 3.743},
                  {label: 'D-3', date: '05.03.26', anchor: 3.70, fm: 4.047},
                  {label: 'D-4', date: '04.03.26', anchor: 4.05, fm: 4.294},
                  {label: 'D-5', date: '03.03.26', anchor: 3.96, fm: 4.405},
                  {label: 'D-6', date: '02.03.26', anchor: 3.16, fm: 4.275},
                  {label: 'W-1', date: '27.02.26', anchor: 2.80, fm: 4.188},
                ],
                'BS-P-DE': [
                  {label: 'D-1', date: '09.03.26', anchor: 9.117, fm: 9.941},
                  {label: 'D-2', date: '06.03.26', anchor: 9.081, fm: 9.777},
                  {label: 'D-3', date: '05.03.26', anchor: 8.971, fm: 9.746},
                  {label: 'D-4', date: '04.03.26', anchor: 8.762, fm: 9.811},
                  {label: 'D-5', date: '03.03.26', anchor: 8.568, fm: 9.714},
                  {label: 'D-6', date: '02.03.26', anchor: 7.925, fm: 9.454},
                  {label: 'W-1', date: '27.02.26', anchor: 7.563, fm: 9.211},
                ],
                'BS-P-NO': [
                  {label: 'D-1', date: '09.03.26', anchor: 6.368, fm: 6.674},
                  {label: 'D-2', date: '06.03.26', anchor: 6.220, fm: 6.674},
                  {label: 'D-3', date: '05.03.26', anchor: 6.217, fm: 6.674},
                  {label: 'D-4', date: '04.03.26', anchor: 6.356, fm: 6.674},
                  {label: 'D-5', date: '03.03.26', anchor: 6.472, fm: 6.674},
                  {label: 'D-6', date: '02.03.26', anchor: 6.360, fm: 6.674},
                  {label: 'W-1', date: '27.02.26', anchor: 6.203, fm: 6.674},
                ],
                'BS-P-PL': [
                  {label: 'D-1', date: '09.03.26', anchor: 9.952, fm: 10.012},
                  {label: 'D-2', date: '06.03.26', anchor: 9.844, fm: 9.534},
                  {label: 'D-3', date: '05.03.26', anchor: 9.955, fm: 9.387},
                  {label: 'D-4', date: '04.03.26', anchor: 9.979, fm: 9.537},
                  {label: 'D-5', date: '03.03.26', anchor: 10.050, fm: 9.293},
                  {label: 'D-6', date: '02.03.26', anchor: 9.692, fm: 9.293},
                  {label: 'W-1', date: '27.02.26', anchor: 9.554, fm: 9.596},
                ],
                'BS-P-UK': [
                  {label: 'D-1', date: '09.03.26', anchor: 9.051, fm: 9.157},
                  {label: 'D-2', date: '06.03.26', anchor: 8.677, fm: 8.674},
                  {label: 'D-3', date: '05.03.26', anchor: 8.321, fm: 8.257},
                  {label: 'D-4', date: '04.03.26', anchor: 8.271, fm: 8.211},
                  {label: 'D-5', date: '03.03.26', anchor: 7.731, fm: 7.731},
                  {label: 'D-6', date: '02.03.26', anchor: 7.719, fm: 7.719},
                  {label: 'W-1', date: '27.02.26', anchor: 6.784, fm: 6.674},
                ],
              }
              
              const marketFmData = fmData[selectedMarketId] || []
              
              return marketFmData.map((row) => {
                const spreadPct = ((row.fm! - row.anchor) / row.anchor * 100)
                const spreadNominal = row.fm! - row.anchor

                return (
                  <div key={row.label} className="grid grid-cols-12 items-center py-0.25 border-b border-gray-900/30">
                    <div className="col-span-2 text-[11px] text-gray-300">{row.label}</div>
                    <div className="col-span-2 text-[7px] text-gray-500">{row.date}</div>
                    <div className="col-span-2 text-[11px] text-gray-400 text-center">{row.fm!.toFixed(2)}</div>
                    <div className="col-span-2 text-[11px] text-gray-400 text-center">{row.anchor.toFixed(2)}</div>
                    <div className={`col-span-2 text-[11px] text-center ${
                      spreadPct >= 0 ? 'text-green-600' : 'text-red-500'
                    }`}>
                      {spreadPct >= 0 ? '+' : ''}{spreadPct.toFixed(2)}%
                    </div>
                    <div className={`col-span-2 text-[11px] text-right ${
                      spreadNominal >= 0 ? 'text-green-600' : 'text-red-500'
                    }`}>
                      {spreadNominal >= 0 ? '+' : ''}{spreadNominal.toFixed(3)}
                    </div>
                  </div>
                )
              })
            })()}
          </div>
        </div>

        
      </div>
    </div>
  )
}
