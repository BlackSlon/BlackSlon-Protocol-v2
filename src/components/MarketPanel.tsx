'use client'

import { useParams } from 'next/navigation'
import PhysicalDimension from './PhysicalDimension'
import VirtualDimension from './VirtualDimension'

interface MarketPanelProps {
  currentPrice: number
  borderColor: string
  montserratStyle: any
}

export default function MarketPanel({ currentPrice, montserratStyle }: MarketPanelProps) {
  const params = useParams()
  const marketId = (params.id as string) || 'BS-P-PL'
  const monoStyle = { fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace' }

  return (
    <div className="flex flex-col h-full p-4 select-none bg-black/20" style={montserratStyle}>
      
      {/* POZIOM 1: Nagłówek ujednolicony (Szary) */}
      <div className="text-[10px] text-gray-500 uppercase tracking-[0.5em] font-bold text-center py-2 border-b border-gray-900 bg-black/40 mb-4">
        <span>MARKET CONTROL PANEL</span>
      </div>

      {/* GRID LAYOUT - 60/40 split */}
      <div className="flex-grow grid grid-cols-[60%_40%] divide-x divide-gray-900 gap-4 mb-4 overflow-hidden">
        
        {/* LEWA STRONA - Physical Dimension (60%) */}
        <div className="pr-2 overflow-y-auto no-scrollbar">
          {/* Przekazujemy marketId i currentPrice, aby Vercel nie sypał błędami */}
          <PhysicalDimension marketId={marketId} currentPrice={currentPrice} />
        </div>
        
        {/* PRAWA STRONA - Virtual Dimension (40%) */}
        <div className="pl-4 overflow-y-auto no-scrollbar bg-blue-900/5">
          <VirtualDimension marketId={marketId} />
        </div>
      </div>

      {/* FOOTER: SYNTHESIS OUTPUT */}
      <div className="bg-[#0d1117] border border-gray-800/50 p-4 rounded-sm mt-auto shrink-0">
        <div className="flex justify-between items-center mb-1">
          <span className="text-[11px] text-gray-400 uppercase font-bold tracking-widest italic">Live Synthesis Output</span>
          <span className="text-[8px] text-blue-500 font-mono animate-pulse uppercase">ADR Protocol Active</span>
        </div>
        <div className="flex justify-between items-baseline">
          <span className="text-[11px] text-gray-500 font-bold tracking-tighter uppercase">BSTZ PRICE INDEX</span>
          <span className="text-3xl font-bold text-yellow-500 font-mono" style={monoStyle}>
            {currentPrice.toFixed(2)} <span className="text-[12px] text-gray-600 ml-1 font-sans">EUR / 100kWh</span>
          </span>
        </div>
      </div>
    </div>
  )
}