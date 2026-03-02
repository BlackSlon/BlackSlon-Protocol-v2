'use client'

import React, { useMemo } from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

export default function UserAccountPanel() {
  // Przykładowe dane portfela
  const inventory = [
    { token: 'BS-P-PL', unit: '30', quantity: '3000', avgPrice: 10.45, lastPrice: 10.89, pnl: '+630.00', color: 'yellow' },
    { token: 'BS-G-DE', unit: '45', quantity: '4500', avgPrice: 12.10, lastPrice: 11.96, pnl: '-112.00', color: 'blue' },
    { token: 'BS-W-FR', unit: '22', quantity: '2200', avgPrice: 9.80, lastPrice: 11.02, pnl: '+244.00', color: 'yellow' },
  ]

  const vaultLiquidity = {
    lockedBSR: '1 250.40',
    lockedEUR: '450.00'
  }

  const bsrPriceHistory = [10.2, 10.5, 10.3, 10.8, 10.6, 10.9, 11.1, 10.7, 11.2, 10.8]
  const hFactor = '2.48'

  const bsrEurRate = '1 €BSR = 2.45 eEURO'

  return (
    <div className="flex flex-col h-full bg-black font-mono text-white p-0">
      
      {/* HEADER */}
      <div className="w-full pt-3 pb-2 flex flex-col items-center shrink-0">
        <div className="text-[10px] text-gray-500 uppercase tracking-[0.5em] font-bold">
          USER'S ACCOUNT PANEL
        </div>
        <div className="w-[85%] border-b border-gray-900 mt-2" />
      </div>

      {/* BLACKSLON PORTFOLIO SECTION */}
      <div className="flex-grow px-6 pb-6 flex flex-col min-h-0 space-y-6">
        <div className="pl-0 pr-0 pt-4 pb-2 bg-gradient-to-b from-black to-gray-950 w-full">
          <div className="text-[10px] tracking-widest text-amber-700 font-bold mb-0.5">BlackSlon User's Data</div>
          <div className="flex justify-between items-center">
            <div className="flex gap-4">
              <span className="text-[10px] text-gray-500 uppercase font-normal">UID: <span className="text-yellow-500">BS-PRO-001</span></span>
              <span className="text-[10px] text-gray-500 uppercase font-normal">Mode: <span className="text-green-500 animate-pulse font-black">CONNECTED</span></span>
            </div>
          </div>
          <div className="text-[10px] tracking-widest text-amber-700 font-bold mb-1 mt-3">Available Liquidity</div>
          <div className="flex flex-wrap gap-2 sm:flex-nowrap sm:grid-cols-2 xs:grid-cols-1">
            <div className="border border-amber-500/30 rounded-sm py-1 px-3 overflow-hidden w-fit">
              <div className="text-[8px] text-amber-800 uppercase tracking-widest mb-0">€BSR BALANCE</div>
              <div className="text-lg text-amber-500 tracking-tighter leading-tight">3 200.00</div>
            </div>
            <div className="border border-blue-500/30 rounded-sm py-1 px-3 overflow-hidden w-fit">
              <div className="text-[8px] text-blue-800 uppercase tracking-widest mb-0">eEURO BALANCE</div>
              <div className="text-lg text-blue-500 tracking-tighter leading-tight">12 450.00</div>
            </div>
          </div>
          <div className="text-[10px] tracking-widest text-amber-700 font-bold mb-0 mt-4">BlackSlon Tokens Portfolio</div>
          
          {/* TABLE INVENTORY */}
          <div className="mb-0">
            {/* Table Header */}
            <div className="table-fixed w-full">
              <div className="grid grid-cols-6 text-[7px] text-white uppercase px-2 py-1 border-b border-gray-900 w-full">
                <div className="w-[20%] tracking-widest">Token</div>
                <div className="w-[15%] text-center tracking-widest">Unit</div>
                <div className="w-[20%] text-center tracking-widest">Volume (kWh)</div>
                <div className="w-[15%] text-center tracking-widest">Avg<br/>Price</div>
                <div className="w-[15%] text-center tracking-widest">Last<br/>Price</div>
                <div className="w-[15%] text-right tracking-widest">PnL (EUR)</div>
              </div>

              {/* Table Rows */}
              {inventory.map((item, index) => (
                <div key={index} className="grid grid-cols-6 items-center py-1 px-2 border-b border-gray-900 w-full hover:bg-gray-900/40 transition-colors">
                  <div className={`w-[20%] text-[11px] ${item.color === 'yellow' ? 'text-yellow-500' : 'text-blue-500'} whitespace-nowrap`}>{item.token}</div>
                  <div className="w-[15%] text-center text-[11px] text-gray-400">{item.unit}</div>
                  <div className="w-[20%] text-center text-[11px] text-gray-400">{item.quantity}</div>
                  <div className="w-[15%] text-center text-[11px] text-gray-400">{item.avgPrice}</div>
                  <div className="w-[15%] text-center text-[11px] text-gray-400">{item.lastPrice}</div>
                  <div className={`w-[15%] text-right text-[11px] ${item.pnl.startsWith('+') ? 'text-green-500' : 'text-red-600'}`}>
                    {item.pnl}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* BLACKSLON VAULT */}
        <div className="mb-6 px-0">
          <div className="text-[10px] tracking-widest text-amber-700 font-bold mb-1 mt-2">BlackSlon Vault</div>
          <div className="flex flex-wrap gap-2 sm:flex-nowrap sm:grid-cols-2 xs:grid-cols-1">
            <div className="bg-amber-500/10 border border-amber-500/30 rounded-sm py-1 px-3 overflow-hidden w-fit">
              <div className="text-[8px] text-amber-800 uppercase tracking-widest mb-0">Locked €BSR</div>
              <div className="text-lg text-amber-500 tracking-tighter leading-tight">{vaultLiquidity.lockedBSR}</div>
            </div>
            <div className="bg-blue-500/10 border border-blue-500/30 rounded-sm py-1 px-3 overflow-hidden w-fit">
              <div className="text-[8px] text-blue-800 uppercase tracking-widest mb-0">Locked eEURO</div>
              <div className="text-lg text-blue-500 tracking-tighter leading-tight">{vaultLiquidity.lockedEUR}</div>
            </div>
          </div>
        </div>

        {/* BLACKSLON RISK MANAGEMENT */}
        <div className="mb-6 px-0">
          <div className="text-[10px] tracking-widest text-amber-700 font-bold mb-1 mt-2">BlackSlon Risk Management</div>
          
          <div className="flex justify-between items-center mb-4">
            <div className="flex flex-col">
              <span className="text-[8px] text-gray-600 uppercase tracking-widest mb-1">H-Factor (H-BSTZ)</span>
              <span className="text-lg text-green-500 tracking-tighter leading-tight">
                {hFactor}
              </span>
            </div>
            <div className="text-right">
              <div className="text-[8px] text-gray-600 uppercase tracking-widest mb-1">Status</div>
              <div className="text-[10px] text-green-500 tracking-[0.2em] uppercase animate-pulse">
                SAFE ZONE
              </div>
            </div>
          </div>

          {/* BLACKSLON RESERVE €BSR/EUR */}
          <div className="mt-4">
            <div className="text-[10px] tracking-widest text-amber-700 font-bold mb-2">BlackSlon Reserve (€BSR/EUR)</div>
            <div className="bg-gray-900/50 border border-gray-800 rounded-sm py-2.5 px-3 overflow-hidden w-fit">
              <div className="text-lg text-amber-500 tracking-tighter leading-tight">{bsrEurRate}</div>
            </div>
          </div>
        </div>
        </div>

      {/* CONNECT WALLET BUTTON */}
      <div className="px-6 py-2 w-full">
        <button className="w-full py-3 bg-gray-800 text-gray-400 uppercase tracking-[0.3em] text-[10px] border border-gray-700 hover:bg-gray-700 hover:text-gray-300 transition-all">
          CONNECT WALLET
        </button>
      </div>
    </div>
  )
}