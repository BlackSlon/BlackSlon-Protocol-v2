'use client'

interface Order {
  price: number;
  amount: number;
  total: number;
}

export default function BlackSlonMatrix() {
  const monoStyle = { fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace' };

  // Symulacja danych Orderbook (Bids & Asks)
  const asks: Order[] = [
    { price: 10.95, amount: 150, total: 1642.50 },
    { price: 10.82, amount: 200, total: 2164.00 },
    { price: 10.70, amount: 80, total: 856.00 },
  ];

  const bids: Order[] = [
    { price: 10.45, amount: 120, total: 1254.00 },
    { price: 10.30, amount: 300, total: 3090.00 },
    { price: 10.15, amount: 450, total: 4567.50 },
  ];

  return (
    <div className="flex flex-col h-full select-none text-white">
      {/* SUBTITLE */}
      <div className="text-center mb-4">
        <span className="text-[10px] text-red-600 font-bold tracking-widest uppercase">Order Book & Liquidity</span>
      </div>

      {/* SPREAD INDICATOR */}
      <div className="bg-gray-900/40 border-y border-gray-900 py-1 mb-4 flex justify-between px-4">
        <span className="text-[8px] text-gray-500 uppercase font-bold">Market Spread</span>
        <span className="text-[10px] text-yellow-500 font-mono" style={monoStyle}>0.14 EUR</span>
      </div>

      {/* ORDERBOOK TABLE */}
      <div className="flex-grow overflow-hidden flex flex-col">
        {/* TABLE HEADER */}
        <div className="grid grid-cols-3 px-2 mb-2 text-[8px] text-gray-600 uppercase font-bold">
          <span>Price (EUR)</span>
          <span className="text-right">Amount (MW)</span>
          <span className="text-right">Total (€BSR)</span>
        </div>

        {/* ASKS (SELL ORDERS) */}
        <div className="space-y-[1px] mb-4">
          {asks.map((order, i) => (
            <div key={i} className="grid grid-cols-3 px-2 py-1.5 hover:bg-red-500/5 transition-colors group relative">
              <div className="absolute inset-y-0 right-0 bg-red-600/10" style={{ width: `${(order.amount / 500) * 100}%` }} />
              <span className="text-[11px] text-red-500 font-mono z-10" style={monoStyle}>{order.price.toFixed(2)}</span>
              <span className="text-[11px] text-gray-300 text-right font-mono z-10" style={monoStyle}>{order.amount}</span>
              <span className="text-[11px] text-gray-500 text-right font-mono z-10" style={monoStyle}>{order.total.toFixed(0)}</span>
            </div>
          ))}
        </div>

        {/* CURRENT PRICE DIVIDER */}
        <div className="border-y border-gray-800 py-2 my-2 bg-black flex justify-center items-center gap-4">
          <span className="text-xl font-bold text-white font-mono" style={monoStyle}>10.59</span>
          <span className="text-[9px] text-green-500 font-bold uppercase tracking-tighter">▲ 0.4%</span>
        </div>

        {/* BIDS (BUY ORDERS) */}
        <div className="space-y-[1px]">
          {bids.map((order, i) => (
            <div key={i} className="grid grid-cols-3 px-2 py-1.5 hover:bg-green-500/5 transition-colors group relative">
              <div className="absolute inset-y-0 right-0 bg-green-600/10" style={{ width: `${(order.amount / 500) * 100}%` }} />
              <span className="text-[11px] text-green-500 font-mono z-10" style={monoStyle}>{order.price.toFixed(2)}</span>
              <span className="text-[11px] text-gray-300 text-right font-mono z-10" style={monoStyle}>{order.amount}</span>
              <span className="text-[11px] text-gray-500 text-right font-mono z-10" style={monoStyle}>{order.total.toFixed(0)}</span>
            </div>
          ))}
        </div>
      </div>

      {/* DEPTH VISUALIZATION AREA */}
      <div className="mt-6 pt-4 border-t border-gray-900">
        <div className="text-[8px] text-gray-600 uppercase font-bold mb-2 px-1 text-center">Market Depth (MWh)</div>
        <div className="flex h-1 bg-gray-900 rounded-full overflow-hidden mx-2">
          <div className="bg-green-600 h-full shadow-[0_0_8px_rgba(22,163,74,0.5)]" style={{ width: '55%' }} />
          <div className="bg-red-600 h-full shadow-[0_0_8px_rgba(220,38,38,0.5)]" style={{ width: '45%' }} />
        </div>
        <div className="flex justify-between px-2 mt-1 text-[7px] font-mono text-gray-700">
          <span>870 MW</span>
          <span>430 MW</span>
        </div>
      </div>
    </div>
  )
}