'use client'

import { MARKET_HISTORY, BSTZHistoryEntry } from '@/lib/market_history'
import { useParams } from 'next/navigation'
import PhysicalDimension from './PhysicalDimension'
import VirtualDimension from './VirtualDimension'

interface MarketPanelProps {
  currentPrice: number
  borderColor: string
  montserratStyle: any
}

export default function MarketPanel({ currentPrice, borderColor, montserratStyle }: MarketPanelProps) {
  const monoStyle = { fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace' }
  
  const params = useParams()
  const marketId = params.id as string
  
  // Get last 7 days from market history
  const marketHistory = MARKET_HISTORY[marketId] || []
  const last7Days = marketHistory.slice(-7).reverse()
  
  // Calculate dual-stage anchors for each day
  const processedHistory = last7Days.map((day: BSTZHistoryEntry) => {
    // Unit Conversion: MWh to kWh (divide by 10)
    const spotKwh = day.spot / 10
    const fmKwh = day.fm / 10
    const fqKwh = day.fq / 10
    const calKwh = day.cal / 10
    
    // Step 1: Raw Anchor calculation using weights 10/40/25/25
    const rawAnchor = (spotKwh * 0.10) + (fmKwh * 0.40) + (fqKwh * 0.25) + (calKwh * 0.25)
    
    // Step 2: BSTZ Corridor (Anchor +/- 10%)
    const corridorMin = rawAnchor * 0.90
    const corridorMax = rawAnchor * 1.10
    
    return {
      date: new Date(day.date).toLocaleDateString('pl-PL', { day: '2-digit', month: '2-digit', year: 'numeric' }).replace(/\./g, '.'),
      min: corridorMin,
      max: corridorMax,
      anchor: rawAnchor
    }
  })

  return (
    <div className="flex flex-col h-full p-4 select-none" style={montserratStyle}>
      {/* HEADER */}
      <div className="text-center mb-2 border-b border-gray-900 pb-1">
        <span className="text-[10px] text-gray-500 uppercase tracking-[0.5em] font-bold">Market Panel</span>
      </div>

      {/* GRID LAYOUT - 60/40 split */}
      <div className="grid grid-cols-[60%_40%] divide-x divide-gray-900 gap-4 mb-4">
        {/* LEFT COLUMN - Physical Dimension (60%) */}
        <div>
          <PhysicalDimension currentPrice={currentPrice} />
        </div>
        
        {/* RIGHT COLUMN - Virtual Dimension (40%) */}
        <div>
          <VirtualDimension />
        </div>
      </div>

      {/* SYNTHESIS OUTPUT */}
      <div className="bg-[#0d1117] border border-gray-800/50 p-4 rounded-sm">
        <div className="flex justify-between items-center mb-1">
          <span className="text-[9px] text-gray-400 uppercase font-bold tracking-widest">Synthesis Output</span>
          <span className="text-[8px] text-blue-500 font-mono animate-pulse uppercase">ADR Active</span>
        </div>
        <div className="flex justify-between items-baseline">
          <span className="text-[10px] text-gray-500 uppercase">BSTZ Index</span>
          <span className="text-2xl font-bold text-yellow-500 font-mono" style={monoStyle}>{currentPrice.toFixed(2)}</span>
        </div>
      </div>
    </div>
  )
}