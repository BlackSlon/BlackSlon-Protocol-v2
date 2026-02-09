'use client'

import { useState, useEffect } from 'react'
import FormulaDisplay from '@/components/FormulaDisplay'

// ... (Interface definitions i MARKETS_DATA zostają te same co wcześniej)

const calculateFinalPrice = (data: any) => ((data.FW * 0.1) + (data.FM * 0.4) + (data.FQ * 0.25) + (data.FY * 0.25)) / 10

export default function Home() {
  const [showDashboard, setShowDashboard] = useState(false)
  const [activeTab, setActiveTab] = useState<'power' | 'gas'>('power')
  const [pricesState, setPricesState] = useState<any>({
    power: Object.entries(MARKETS_DATA.POWER).map(([c, d]) => ({ country: c, index: `BS-E-${c}`, price: calculateFinalPrice(d), role: 'Market' })),
    gas: Object.entries(MARKETS_DATA.GAS).map(([c, d]) => ({ country: c, index: `BS-G-${c}`, price: calculateFinalPrice(d), role: 'Market' }))
  })
  const [selectedMarket, setSelectedMarket] = useState<any>(pricesState.power[0])

  // DASHBOARD RENDER (Zmniejszony do ok. 67%)
  if (!showDashboard) {
    return (
      <div style={{ height: '100vh', background: '#000', color: '#fff', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', fontFamily: 'monospace' }}>
        <h1 style={{ fontSize: '42px', margin: 0 }}>BlackSlon</h1>
        <p style={{ color: '#666', letterSpacing: '3px', marginBottom: '30px', fontSize: '14px' }}>ZERO SPREAD | ZERO EXPIRY | LIQUIDTY 24/7</p>
        <button onClick={() => setShowDashboard(true)} style={{ background: '#FFD700', color: '#000', padding: '12px 28px', border: 'none', fontWeight: 'bold', cursor: 'pointer', borderRadius: '4px' }}>VIEW INDEXES</button>
      </div>
    )
  }

  return (
    <div style={{ minHeight: '100vh', background: '#000', color: '#fff', fontFamily: 'monospace', padding: '25px' }}>
      <div style={{ maxWidth: '1100px', margin: '0 auto' }}> {/* Zmniejszona szerokość max */}
        
        {/* Header - Kompaktowy */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px', borderBottom: '1px solid #1a1a1a', paddingBottom: '15px' }}>
          <h1 style={{ fontSize: '18px', fontWeight: 'bold', margin: 0 }}>BlackSlon Energy Indexes</h1>
          <button style={{ background: '#fff', color: '#000', padding: '6px 14px', border: 'none', fontWeight: 'bold', cursor: 'pointer', fontSize: '11px' }}>CONNECT WALLET</button>
        </div>

        {/* Tabs - Mniejsze */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '20px' }}>
          {['power', 'gas'].map((tab) => (
            <button 
              key={tab}
              onClick={() => setActiveTab(tab as 'power' | 'gas')}
              style={{ 
                background: activeTab === tab ? (tab === 'power' ? '#FFD700' : '#00CED1') : 'transparent',
                color: activeTab === tab ? '#000' : '#888',
                border: `1px solid ${tab === 'power' ? '#FFD700' : '#00CED1'}`,
                padding: '6px 12px', cursor: 'pointer', fontWeight: 'bold', textTransform: 'uppercase', fontSize: '10px',
                transition: '0.2s'
              }}
            >BlackSlon {tab} Indexes</button>
          ))}
        </div>

        {/* Grid - Gęstszy i mniejszy */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', // Mniejsze kafelki
          gap: '12px', 
          marginBottom: '40px' 
        }}>
          {pricesState[activeTab].map((m: any) => (
            <div 
              key={m.index} 
              onClick={() => setSelectedMarket(m)}
              style={{ 
                background: '#0a0a0a', padding: '15px', border: `1px solid ${selectedMarket.index === m.index ? '#FFD700' : '#1a1a1a'}`, cursor: 'pointer',
                transform: selectedMarket.index === m.index ? 'scale(0.98)' : 'scale(1)', // Reakcja na zaznaczenie
                transition: '0.1s'
              }}
            >
              <div style={{ fontSize: '10px', color: '#555' }}>{m.country} // INDEX</div>
              <div style={{ fontWeight: 'bold', fontSize: '14px', color: activeTab === 'power' ? '#FFD700' : '#00CED1' }}>{m.index}</div>
              <div style={{ margin: '10px 0', fontSize: '20px', fontWeight: 'bold' }}>{m.price.toFixed(2)} <span style={{ fontSize: '10px', color: '#444' }}>€/100 kWh</span></div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button 
                  style={{ flex: 1, background: 'transparent', border: '1px solid #22c55e', color: '#22c55e', padding: '5px', cursor: 'pointer', fontWeight: 'bold', fontSize: '10px' }}
                  onMouseDown={(e) => e.currentTarget.style.background = '#22c55e22'}
                  onMouseUp={(e) => e.currentTarget.style.background = 'transparent'}
                >BUY</button>
                <button 
                  style={{ flex: 1, background: 'transparent', border: '1px solid #ef4444', color: '#ef4444', padding: '5px', cursor: 'pointer', fontWeight: 'bold', fontSize: '10px' }}
                  onMouseDown={(e) => e.currentTarget.style.background = '#ef444422'}
                  onMouseUp={(e) => e.currentTarget.style.background = 'transparent'}
                >SELL</button>
              </div>
            </div>
          ))}
        </div>

        {/* Formula Display - Uporządkowany kontener */}
        <div style={{ 
          background: '#050505', 
          padding: '20px', 
          border: '1px solid #1a1a1a', 
          borderRadius: '4px',
          fontSize: '13px' // Mniejsza czcionka dla formuły
        }}>
          <h3 style={{ fontSize: '14px', marginTop: 0, color: '#FFD700' }}>Protocol Analysis: {selectedMarket.index}</h3>
          <FormulaDisplay activeMarket={selectedMarket} />
        </div>
      </div>
    </div>
  )
}