'use client'

import React, { useMemo } from 'react'

export default function UserAccountPanel() {
  // Przykładowe dane portfela
  const inventory = [
    { token: 'BS-P-PL', quantity: '150,000', avgPrice: 10.45, lastPrice: 10.89, pnl: '+630.00', color: 'yellow' },
    { token: 'BS-G-DE', quantity: '80,000', avgPrice: 12.10, lastPrice: 11.96, pnl: '-112.00', color: 'blue' },
    { token: 'BS-W-FR', quantity: '200,000', avgPrice: 9.80, lastPrice: 11.02, pnl: '+244.00', color: 'yellow' },
  ]

  const vaultLiquidity = {
    lockedBSR: '1,250.40',
    lockedEUR: '450.00'
  }

  const bsrPriceHistory = [10.2, 10.5, 10.3, 10.8, 10.6, 10.9, 11.1, 10.7, 11.2, 10.8]
  const hFactor = '2.48'

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
      <div className="flex-grow px-6 pb-6 flex flex-col min-h-0">
        <div className="p-4 bg-gradient-to-b from-black to-gray-950">
          <div className="text-[10px] tracking-widest text-amber-700 font-bold mb-1">BlackSlon User's Data</div>
          <div className="flex justify-between items-center">
            <div className="flex gap-4">
              <span className="text-[10px] text-gray-500 uppercase font-normal">UID: <span className="text-yellow-500">BS-PRO-001</span></span>
              <span className="text-[10px] text-gray-500 uppercase font-normal">Mode: <span className="text-green-500 animate-pulse font-black">CONNECTED</span></span>
            </div>
          </div>
          <div className="text-[10px] tracking-widest text-amber-700 font-bold mb-2 mt-3">Available Liquidity</div>
          <div className="space-y-2">
            <div className="border border-yellow-500/30 rounded-sm p-3">
              <div className="text-[8px] text-yellow-800 uppercase tracking-widest mb-1">eEURO BALANCE: <span className="text-lg text-yellow-500 tracking-tighter">12 450.00</span></div>
            </div>
            <div className="border border-yellow-500/30 rounded-sm p-3">
              <div className="text-[8px] text-yellow-800 uppercase tracking-widest mb-1">€BSR BALANCE: <span className="text-lg text-yellow-500 tracking-tighter">3 200.00</span></div>
            </div>
          </div>
          <div className="text-[10px] tracking-widest text-amber-700 font-bold mb-2 mt-4">BlackSlon Tokens Portfolio</div>
        </div>
        
        {/* TABLE INVENTORY */}
        <div className="mb-4">
          {/* Table Header */}
          <div className="grid grid-cols-5 text-[7px] text-white uppercase px-2 py-1 border-b border-gray-900">
            <div className="tracking-widest">Token</div>
            <div className="text-center tracking-widest">Qty (kWh)</div>
            <div className="text-center tracking-widest">Avg</div>
            <div className="text-center tracking-widest">Last</div>
            <div className="text-right tracking-widest">PnL (EUR)</div>
          </div>

          {/* Table Rows */}
          {inventory.map((item, index) => (
            <div key={index} className="grid grid-cols-5 items-center py-1 px-2 border-b border-gray-900/50 hover:bg-gray-900/40 transition-colors">
              <div className={`text-[10px] ${item.color === 'yellow' ? 'text-yellow-500' : 'text-blue-500'}`}>{item.token}</div>
              <div className="text-center text-[9px] text-gray-400">{item.quantity}</div>
              <div className="text-center text-[9px] text-gray-400">{item.avgPrice}</div>
              <div className="text-center text-[9px] text-gray-400">{item.lastPrice}</div>
              <div className={`text-right text-[9px] ${item.pnl.startsWith('+') ? 'text-green-500' : 'text-red-600'}`}>
                {item.pnl}
              </div>
            </div>
          ))}
        </div>

        {/* VAULT LIQUIDITY */}
        <div className="mb-4">
          <div className="text-[8px] text-gray-600 uppercase tracking-widest mb-2">Vault Liquidity</div>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-sm p-3">
              <div className="text-[8px] text-yellow-800 uppercase tracking-widest mb-1">Locked €BSR</div>
              <div className="text-lg text-yellow-500 tracking-tighter">{vaultLiquidity.lockedBSR}</div>
            </div>
            <div className="bg-blue-500/10 border border-blue-500/30 rounded-sm p-3">
              <div className="text-[8px] text-blue-800 uppercase tracking-widest mb-1">Locked eEURO</div>
              <div className="text-lg text-blue-500 tracking-tighter">{vaultLiquidity.lockedEUR}</div>
            </div>
          </div>
        </div>

        {/* €BSR PRICE CHART */}
        <div className="mb-4">
          <div className="text-[8px] text-gray-600 uppercase tracking-widest mb-2">€BSR/eEURO Rate</div>
          <div className="bg-gray-900/30 border border-gray-800 rounded-sm p-3">
            <div className="flex items-end justify-between h-12">
              {bsrPriceHistory.map((price, index) => (
                <div
                  key={index}
                  className="flex-1 bg-yellow-500/60 mx-0.5 rounded-t-sm"
                  style={{ height: `${(price / Math.max(...bsrPriceHistory)) * 100}%` }}
                />
              ))}
            </div>
            <div className="flex justify-between mt-2">
              <span className="text-[7px] text-gray-600">10.2</span>
              <span className="text-[9px] text-yellow-500 text-center">{bsrPriceHistory[bsrPriceHistory.length - 1]}</span>
              <span className="text-[7px] text-gray-600">11.2</span>
            </div>
          </div>
        </div>
      </div>

      {/* RISK MANAGEMENT SECTION */}
      <div className="px-6 py-4 border-t border-gray-900 bg-black">
        <div className="text-[8px] text-red-600 uppercase tracking-widest mb-3">
          BLACKSLON RISK MANAGEMENT
        </div>
        
        <div className="flex justify-between items-center mb-4">
          <div className="flex flex-col">
            <span className="text-[8px] text-gray-600 uppercase tracking-widest mb-1">H-Factor (BlackSlon Settlement Zone)</span>
            <span className="italic font-black text-4xl text-green-500 leading-none">
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
      </div>

      {/* CONNECT WALLET BUTTON */}
      <div className="px-6 py-4">
        <button className="w-full py-3 bg-gray-800 text-gray-400 uppercase tracking-[0.3em] text-[10px] border border-gray-700 hover:bg-gray-700 hover:text-gray-300 transition-all">
          CONNECT WALLET
        </button>
      </div>
    </div>
  )
}