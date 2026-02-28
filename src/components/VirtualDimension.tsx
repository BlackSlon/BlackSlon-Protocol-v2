'use client'
import React from 'react'

export default function VirtualDimension({ marketId }: { marketId: string }) {
  return (
    <div className="flex flex-col h-full p-4 select-none bg-transparent font-mono">
      <div className="text-[10px] text-gray-500 uppercase tracking-[0.5em] font-bold text-center py-2 border-b border-gray-900 bg-black/40 mb-4">
        <span>VIRTUAL MARKET DIMENSION</span>
      </div>

      <div className="text-center mb-4">
        <div className="text-[10px] font-black tracking-widest uppercase mb-1 text-red-600">
          BLACKSLON POWER INDEX (BSPI)
        </div>
      </div>

      <div className="bg-gray-950/40 rounded-sm border border-gray-900 overflow-hidden flex-grow flex flex-col">
        <div className="text-center py-2 text-[8px] text-gray-600 uppercase tracking-[0.3em] border-b border-gray-900">
          ORDER BOOK
        </div>
        
        {/* BUY ORDERS */}
        <div className="px-3 py-3">
          <div className="text-[8px] text-green-500 font-bold mb-2 uppercase">BUY ORDERS</div>
          <div className="space-y-1">
            <div className="grid grid-cols-3 text-[9px] text-gray-600 mb-1 font-bold">
              <div>Price</div>
              <div className="text-center">Vol</div>
              <div className="text-right">Total</div>
            </div>
            {[10.45, 10.44, 10.43, 10.42, 10.41].map((p, i) => (
              <div key={i} className="grid grid-cols-3 text-[10px] text-green-500 py-1 hover:bg-green-500/10">
                <div className="font-bold">{p.toFixed(2)}</div>
                <div className="text-center">{(100 + i * 12).toFixed(1)}</div>
                <div className="text-right font-black">{(p * (100 + i * 12)).toFixed(1)}</div>
              </div>
            ))}
          </div>
        </div>

        {/* SPREAD */}
        <div className="mx-3 py-3 border-t border-b border-gray-800 bg-black/20 text-center">
          <div className="text-[12px] font-bold text-yellow-500 italic">10.45 - 10.46</div>
          <div className="text-[8px] text-gray-500 uppercase tracking-widest">Spread: 0.01 (0.10%)</div>
        </div>

        {/* SELL ORDERS */}
        <div className="px-3 py-3">
          <div className="text-[8px] text-red-500 font-bold mb-2 uppercase">SELL ORDERS</div>
          <div className="space-y-1">
            {[10.46, 10.47, 10.48, 10.49, 10.50].map((p, i) => (
              <div key={i} className="grid grid-cols-3 text-[10px] text-red-500 py-1 hover:bg-red-500/10">
                <div className="font-bold">{p.toFixed(2)}</div>
                <div className="text-center">{(95 + i * 18).toFixed(1)}</div>
                <div className="text-right font-black">{(p * (95 + i * 18)).toFixed(1)}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}