'use client'

import React, { useMemo } from 'react'

export default function UserAccountPanel() {
  // Przykładowe dane portfela zgodne z Twoją prośbą
  const inventory = [
    { id: 'BS-P-PL', name: 'Power Poland', side: 'LONG', units: 15, avgPrice: 10.45, pnl: '+4.20' },
    { id: 'BS-G-DE', name: 'German Gas', side: 'SHORT', units: 8, avgPrice: 12.10, pnl: '-1.15' },
    { id: 'BS-E-PL', name: 'Energy Poland', side: 'LONG', units: 25, avgPrice: 9.80, pnl: '+12.40' },
  ]

  // Finanse
  const balances = {
    freeBSR: '42,069.12',
    freeEUR: '12,450.00',
    lockedBSR: '1,250.40',
    lockedEUR: '450.00',
    hFactor: '2.48' // Współczynnik wypłacalności
  }

  return (
    <div className="flex flex-col h-full bg-black font-mono text-white p-0">
      
      <div className="w-full pt-8 pb-2 flex flex-col items-center shrink-0">
        <div className="text-[10px] text-gray-500 uppercase tracking-[0.5em] font-bold">
          USER'S ACCOUNT PANEL
        </div>
        <div className="w-[80%] border-b border-gray-800 mt-4" />
      </div>

      {/* 2. LIQUIDITY SECTION - Wolne środki */}
      <div className="p-4 border-b border-gray-900 bg-gradient-to-b from-black to-gray-950">
        <div className="text-[8px] text-gray-600 uppercase font-black tracking-widest mb-2 italic">Available Liquidity</div>
        <div className="flex justify-between items-baseline">
          <div className="flex flex-col">
            <span className="text-2xl font-black text-yellow-500 tracking-tighter">{balances.freeBSR}</span>
            <span className="text-[9px] text-yellow-800 font-bold uppercase tracking-widest">€BSR Balance</span>
          </div>
          <div className="flex flex-col text-right">
            <span className="text-xl font-black text-blue-500 tracking-tighter">{balances.freeEUR}</span>
            <span className="text-[9px] text-blue-800 font-bold uppercase tracking-widest">eEURO Balance</span>
          </div>
        </div>
      </div>

      {/* 3. ENERGY INVENTORY - Twoje pozycje rynkowe */}
      <div className="flex-grow flex flex-col min-h-0">
        <div className="text-[9px] text-gray-500 uppercase font-bold tracking-[0.3em] p-3 border-b border-gray-900 bg-black/40">
          Energy Inventory
        </div>
        
        {/* Table Header */}
        <div className="grid grid-cols-12 text-[7px] text-gray-700 uppercase font-black px-4 py-2 border-b border-gray-900">
          <div className="col-span-5 tracking-widest">Instrument</div>
          <div className="col-span-2 text-center tracking-widest">Side</div>
          <div className="col-span-2 text-right tracking-widest">Qty</div>
          <div className="col-span-3 text-right tracking-widest">PnL %</div>
        </div>

        {/* Scrollable List */}
        <div className="flex-grow overflow-y-auto custom-scrollbar">
          {inventory.map((pos) => (
            <div key={pos.id} className="grid grid-cols-12 items-center py-3 px-4 border-b border-gray-900/50 hover:bg-gray-900/40 transition-colors">
              <div className="col-span-5">
                <div className="text-[11px] font-black text-white leading-none mb-1">{pos.id}</div>
                <div className="text-[8px] text-gray-600 uppercase tracking-tighter">{pos.name}</div>
              </div>
              <div className="col-span-2 text-center">
                <span className={`text-[9px] font-black px-1.5 py-0.5 rounded-[1px] ${pos.side === 'LONG' ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>
                  {pos.side}
                </span>
              </div>
              <div className="col-span-2 text-right">
                <span className="text-[11px] font-bold text-gray-400">{pos.units}</span>
              </div>
              <div className={`col-span-3 text-right text-[11px] font-black ${pos.pnl.startsWith('+') ? 'text-green-500' : 'text-red-600'}`}>
                {pos.pnl}%
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 4. LOCKED DEPOSITS - Zablokowane pod marżę */}
      <div className="bg-gray-950/80 border-t border-gray-900 p-4">
        <div className="text-[8px] text-gray-600 uppercase font-black tracking-widest mb-3">Locked Margin Deposits</div>
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-[10px] text-gray-500 uppercase tracking-tighter">Margin €BSR</span>
            <span className="text-[12px] font-bold text-yellow-600/80 tracking-tight">{balances.lockedBSR} €BSR</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-[10px] text-gray-500 uppercase tracking-tighter">Margin eEURO</span>
            <span className="text-[12px] font-bold text-blue-500/80 tracking-tight">{balances.lockedEUR} EUR</span>
          </div>
        </div>
      </div>

      {/* 5. RISK METRICS - H-Factor (Współczynnik wypłacalności) */}
      <div className="p-4 bg-black border-t border-gray-800">
        <div className="flex justify-between items-end">
          <div className="flex flex-col">
            <span className="text-[8px] text-gray-600 uppercase font-black tracking-widest mb-1">H-Factor (Solvency)</span>
            <span className={`text-3xl font-black italic tracking-tighter leading-none ${parseFloat(balances.hFactor) > 2 ? 'text-green-500' : 'text-yellow-500'}`}>
              {balances.hFactor}
            </span>
          </div>
          <div className="text-right">
            <div className="text-[8px] text-gray-600 uppercase font-black tracking-widest mb-1">Status</div>
            <div className="text-[10px] font-black text-green-500 tracking-[0.2em] uppercase animate-pulse">
              Excellent
            </div>
          </div>
        </div>
      </div>

    </div>
  )
}