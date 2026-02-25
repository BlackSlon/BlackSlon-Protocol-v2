'use client'

import { useState } from 'react'
import { ScatterChart, Scatter, XAxis, YAxis, ZAxis, ResponsiveContainer, Tooltip, Cell } from 'recharts'

interface OrderData {
  price: number
  volume: number
  side: 'bid' | 'ask' | 'user'
  id?: string
}

export default function BlackSlonMatrix() {
  const [price, setPrice] = useState('')
  const [volume, setVolume] = useState('')
  const [orders, setOrders] = useState<OrderData[]>([
    // Mock aggregated data
    { id: '1', price: 9.85, volume: 500, side: 'bid' },
    { id: '2', price: 9.90, volume: 750, side: 'bid' },
    { id: '3', price: 10.05, volume: 300, side: 'ask' },
    { id: '4', price: 10.15, volume: 450, side: 'ask' },
    { id: '5', price: 9.75, volume: 200, side: 'bid' },
    { id: '6', price: 10.25, volume: 600, side: 'ask' },
    { id: '7', price: 10.40, volume: 150, side: 'bid' },
    { id: '8', price: 10.55, volume: 800, side: 'ask' },
    { id: '9', price: 9.95, volume: 400, side: 'ask' },
    { id: '10', price: 10.20, volume: 250, side: 'bid' },
    { id: 'user', price: 10.09, volume: 350, side: 'user' }
  ])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!price || !volume) return
    
    const newOrder: OrderData = {
      id: Date.now().toString(),
      price: parseFloat(price),
      volume: parseInt(volume),
      side: 'user'
    }
    
    setOrders([...orders, newOrder])
    setPrice('')
    setVolume('')
  }

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0]
      return (
        <div className="bg-black border border-gray-600 p-2 rounded shadow-lg">
          <p className="text-yellow-400 font-mono text-xs">
            {data.price.toFixed(2)} EUR
          </p>
          <p className="text-gray-400 font-mono text-xs">
            {data.volume} BLSN-E-PL
          </p>
          <p className={`text-xs font-bold ${
            data.side === 'bid' ? 'text-green-400' : 
            data.side === 'ask' ? 'text-red-400' : 'text-yellow-400'
          }`}>
            {data.side === 'bid' ? 'KUPNO' : 
             data.side === 'ask' ? 'SPRZEDAŻ' : 'USER'}
          </p>
        </div>
      )
    }
    return null
  }

  return (
    <div className="min-h-screen bg-black text-white p-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-yellow-400 tracking-wider mb-2">
            BlackSlon Matrix
          </h1>
          <p className="text-gray-500 text-sm">
            BLSN-E-PL Order Book • Live Market
          </p>
        </div>

        <div className="flex gap-6">
          {/* Chart Section - 75% */}
          <div className="flex-1">
            <div className="bg-gray-900 rounded-lg p-4 border border-gray-800">
              <h2 className="text-lg font-bold text-gray-300 mb-4">Market Depth</h2>
              
              <ResponsiveContainer width="100%" height={500}>
                <ScatterChart
                  data={orders}
                  margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
                >
                  <XAxis 
                    type="number"
                    dataKey="price"
                    domain={[9.00, 11.00]}
                    range={[9.00, 11.00]}
                    tick={{ fill: '#4B5563', fontSize: 10 }}
                    axisLine={{ stroke: '#374151', strokeWidth: 1 }}
                    hide
                  />
                  <YAxis 
                    type="number"
                    dataKey="volume"
                    tick={{ fill: '#4B5563', fontSize: 10 }}
                    axisLine={{ stroke: '#374151', strokeWidth: 1 }}
                    hide
                  />
                  <ZAxis 
                    type="number"
                    dataKey="volume"
                    range={[0, 1000]}
                  />
                  <Scatter
                    dataKey="volume"
                    fill={(data: OrderData) => {
                      if (data.side === 'bid') return '#10B981'
                      if (data.side === 'ask') return '#EF4444'
                      return '#F59E0B'
                    }}
                  />
                  <Tooltip content={<CustomTooltip />} />
                </ScatterChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Order Form - 25% */}
          <div className="w-80">
            <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
              <h2 className="text-lg font-bold text-gray-300 mb-6">Złóż Ofertę</h2>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Cena (EUR)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    className="w-full px-3 py-2 bg-black border border-gray-700 rounded text-white focus:outline-none focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500/20"
                    placeholder="10.09"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Wolumen (BLSN-E-PL)
                  </label>
                  <input
                    type="number"
                    value={volume}
                    onChange={(e) => setVolume(e.target.value)}
                    className="w-full px-3 py-2 bg-black border border-gray-700 rounded text-white focus:outline-none focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500/20"
                    placeholder="100"
                  />
                </div>
                
                <div className="flex gap-3">
                  <button
                    type="submit"
                    className="flex-1 bg-green-600 hover:bg-green-500 text-white font-bold py-3 px-4 rounded transition-colors"
                  >
                    KUP
                  </button>
                  <button
                    type="button"
                    className="flex-1 bg-red-600 hover:bg-red-500 text-white font-bold py-3 px-4 rounded transition-colors"
                  >
                    SPRZEDAJ
                  </button>
                </div>
              </form>
              
              {/* Market Summary */}
              <div className="mt-6 pt-6 border-t border-gray-800">
                <h3 className="text-sm font-bold text-gray-400 mb-3">Statystyki Rynku</h3>
                <div className="grid grid-cols-2 gap-4 text-xs">
                  <div>
                    <p className="text-gray-500">Najwyższa Kupno</p>
                    <p className="text-green-400 font-mono">10.15 EUR</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Najniższa Sprzedaż</p>
                    <p className="text-red-400 font-mono">9.75 EUR</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Wolumen</p>
                    <p className="text-gray-400 font-mono">4,550 BLSN-E-PL</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Rozpiętość</p>
                    <p className="text-yellow-400 font-mono">0.40 EUR</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
