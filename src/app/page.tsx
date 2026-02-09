'use client'

import { useState, useEffect } from 'react'
import FormulaDisplay from '@/components/FormulaDisplay'

// Type definitions
interface MarketData {
  FW: number
  FM: number
  FQ: number
  FY: number
  isGBP?: boolean
}

interface Market {
  country: string
  index: string
  price: number
  role: string
  oi?: number
  status?: string
}

interface Prices {
  power: Market[]
  gas: Market[]
  future: Market[]
}

// Math Engine: Create a constant MARKETS_DATA with raw values for all 17 markets
const MARKETS_DATA = {
  POWER: {
    DE: { FW: 107.45, FM: 94.56, FQ: 74.50, FY: 83.24, isGBP: false },
    PL: { FW: 110.53, FM: 101.24, FQ: 96.12, FY: 102.50, isGBP: false },
    FR: { FW: 82.37, FM: 65.99, FQ: 28.11, FY: 97.73, isGBP: false },
    RO: { FW: 131.52, FM: 105.92, FQ: 83.61, FY: 42.20, isGBP: false },
    NO: { FW: 107.77, FM: 79.24, FQ: 50.81, FY: 96.18, isGBP: false },
    BG: { FW: 128.22, FM: 125.47, FQ: 1.00, FY: 80.46, isGBP: false },
    GB: { FW: 81.30, FM: 78.50, FQ: 82.10, FY: 85.00, isGBP: true }, // GB Power in GBP/MWh
    HU: { FW: 131.98, FM: 108.42, FQ: 82.61, FY: 98.68, isGBP: false },
    IT: { FW: 127.76, FM: 115.05, FQ: 98.66, FY: 98.73, isGBP: false }
  },
  GAS: {
    NL: { FW: 36.51, FM: 35.68, FQ: 31.65, FY: 27.04, isGBP: false }, // TTF Hub - FIRST GAS MARKET
    DE: { FW: 43.20, FM: 37.10, FQ: 35.50, FY: 38.20, isGBP: false },
    PL: { FW: 45.53, FM: 39.81, FQ: 38.64, FY: 40.75, isGBP: false },
    FR: { FW: 42.10, FM: 36.50, FQ: 34.80, FY: 37.50, isGBP: false },
    BG: { FW: 34.71, FM: 32.29, FQ: 32.29, FY: 32.29, isGBP: false },
    AT: { FW: 43.90, FM: 37.80, FQ: 36.20, FY: 38.90, isGBP: false },
    IT: { FW: 36.3, FM: 36.3, FQ: 34.48, FY: 29.03, isGBP: false },
    GB: { FW: 71.34, FM: 29.89, FQ: 29.78, FY: 32.29, isGBP: true } // GB Gas in Pence/therm
  }
}

// Fixed GB Math: Use these formulas for weighted prices
const calculateFinalPrice = (data: MarketData, country: string, marketType: string) => {
  // Calculate weighted raw price
  const weighted_raw = (data.FW * 0.1) + (data.FM * 0.4) + (data.FQ * 0.25) + (data.FY * 0.25)
  
  // Apply conversions based on market type and country
  if (marketType === 'gas' && country === 'GB') {
    // GB GAS (THE ONLY EXCEPTION): This is in GBP/therm. Use exactly: (81.7675 * 1.15 * 34.12) / 100 / 10
    return (81.7675 * 1.15 * 34.12) / 100 / 10
  } else if (marketType === 'gas') {
    // EU GAS MARKETS (IT, BG, DE, PL, NL, AT, FR): These are already in EUR/MWh in sheet. ONLY divide by 10
    return weighted_raw / 10
  } else if (marketType === 'power') {
    // POWER MARKETS: All are already in EUR/MWh equivalent. Just divide by 10
    return weighted_raw / 10
  } else {
    // Default: weighted_raw / 10
    return weighted_raw / 10
  }
}

const getMarketRole = (country: string, marketType: string) => {
  if (marketType === 'power') {
    switch (country) {
      case 'DE': return 'Anchor'
      case 'PL': return 'Coal Base'
      case 'FR': return 'Nuclear Base'
      case 'RO': return 'Strong Flow'
      case 'NO': return 'Hydro'
      case 'BG': return 'Balkan Entry'
      case 'GB': return 'Island Market'
      case 'HU': return 'CEE Hub'
      case 'IT': return 'South Demand'
      default: return 'Market'
    }
  } else if (marketType === 'gas') {
    switch (country) {
      case 'NL': return 'Liquidity'
      case 'DE': return 'Physical Flow'
      case 'PL': return 'Dynamic Growth'
      case 'FR': return 'LNG'
      case 'BG': return 'Balkan Hub'
      case 'AT': return 'Baumgarten'
      case 'IT': return 'Southern Flow'
      case 'GB': return 'Island'
      default: return 'Market'
    }
  }
  return 'Market'
}

const getMarketOI = (country: string, marketType: string) => {
  if (marketType === 'power') {
    switch (country) {
      case 'DE': return 1245000
      case 'PL': return 890000
      case 'FR': return 2100000
      case 'RO': return 180000
      case 'NO': return 1100000
      case 'BG': return 220000
      case 'GB': return 95000
      case 'HU': return 450000
      case 'IT': return 750000
      default: return 100000
    }
  } else if (marketType === 'gas') {
    switch (country) {
      case 'NL': return 1800000
      case 'DE': return 5600000
      case 'PL': return 1200000
      case 'FR': return 750000
      case 'BG': return 420000
      case 'AT': return 310000
      case 'IT': return 640000
      case 'GB': return 220000
      default: return 100000
    }
  }
  return 100000
}

// REBUILD FILE: ONE clean export default function Home() component
export default function Home() {
  const [activeTab, setActiveTab] = useState<'power' | 'gas'>('power')

  const prices: Prices = {
    power: Object.entries(MARKETS_DATA.POWER).map(([country, data]) => ({
      country,
      index: `BS-E-${country}`,
      price: calculateFinalPrice(data, country, 'power'),
      role: getMarketRole(country, 'power'),
      oi: getMarketOI(country, 'power')
    })),
    gas: Object.entries(MARKETS_DATA.GAS).map(([country, data]) => ({
      country,
      index: `BS-G-${country}`,
      price: calculateFinalPrice(data, country, 'gas'),
      role: getMarketRole(country, 'gas'),
      oi: getMarketOI(country, 'gas')
    })),
    future: [
      { country: 'LPG', index: 'BS-LPG-EU', price: 0.62, role: 'Regional Hub', status: 'development' },
      { country: 'Diesel', index: 'BS-D-EU', price: 7.58, role: 'Transport Fuel', status: 'development' },
      { country: 'Gasoline', index: 'BS-GSN-EU', price: 7.35, role: 'Motor Fuel', status: 'development' }
    ]
  }

  // Find DE Power market from the actual calculated prices array
  const dePowerMarket = prices.power.find(m => m.country === 'DE')
  
  const [selectedMarket, setSelectedMarket] = useState<Market>(dePowerMarket || prices.power[0])
  const [basePrice, setBasePrice] = useState<number>(dePowerMarket?.price || prices.power[0].price)

  const [pricesState, setPricesState] = useState<Prices>(prices)

  // Sync Engine: Update onClick for every tile to update global selectedMarket state
  const handleMarketClick = (market: Market) => {
    setSelectedMarket(market)
    setBasePrice(market.price)
  }

  // Handle tab switching to set appropriate default market
  const handleTabSwitch = (tab: 'power' | 'gas') => {
    setActiveTab(tab)
    if (tab === 'power') {
      // Set DE Power as default for power tab
      const dePowerMarket = pricesState.power.find(m => m.country === 'DE')
      if (dePowerMarket) {
        setSelectedMarket(dePowerMarket)
        setBasePrice(dePowerMarket.price)
      }
    } else if (tab === 'gas') {
      // Set NL Gas as default for gas tab
      const nlGasMarket = pricesState.gas.find(m => m.country === 'NL')
      if (nlGasMarket) {
        setSelectedMarket(nlGasMarket)
        setBasePrice(nlGasMarket.price)
      }
    }
  }

  useEffect(() => {
    const interval = setInterval(() => {
      setPricesState(prev => {
        const next = { ...prev }
        const vol = (activeTab === 'power' || activeTab === 'gas') ? 0.05 : 1.5
        next[activeTab] = next[activeTab].map((m: Market) => {
          const rawNewPrice = m.price + (Math.random() - 0.5) * vol
          return {
            ...m, 
            price: +(Math.max(0.01, rawNewPrice)).toFixed(2),
            oi: Math.max(0, (m.oi || 0) + Math.floor((Math.random() - 0.4) * 100))
          }
        })
        return next
      })
    }, 3000)
    return () => clearInterval(interval)
  }, [activeTab])

  const getAccent = () => {
    if(activeTab === 'power') return '#FFD700'
    if(activeTab === 'gas') return '#00CED1'
    return '#fff'
  }

  // Safety: Use (price ?? 0).toFixed(2) everywhere to prevent crashes
  const displayPrice = (p: number | undefined) => {
    return (p ?? 0).toFixed(2)
  }

  const getLabelQuantity = () => {
    return '100'
  }

  const getUnit = () => {
    return 'kWh'
  }

  const getMarketLabel = (country: string, role: string) => {
    return `${country} // ${role}`
  }

  // Return: ONE clean export default function with exactly ONE return block
  return (
    <div style={{ minHeight: '100vh', background: '#000', color: '#fff', fontFamily: 'monospace' }}>
      {/* Splash Screen Section */}
      <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center' }}>
        <div style={{ maxWidth: '800px', padding: '40px' }}>
          <h1 style={{ fontSize: '48px', fontWeight: 'bold', margin: '0 0 20px 0', color: '#fff' }}>BlackSlon</h1>
          <h2 style={{ fontSize: '24px', fontWeight: 'normal', margin: '0 0 40px 0', color: '#ccc' }}>Energy Indexes</h2>
          <p style={{ fontSize: '16px', margin: '0 0 60px 0', color: '#888', lineHeight: '1.6' }}>
            ZERO SPREAD | ZERO EXPIRY | LIQUIDTY 24/7
          </p>
          <button 
            onClick={() => {
              const dashboardSection = document.getElementById('dashboard-section');
              if (dashboardSection) {
                dashboardSection.scrollIntoView({ behavior: 'smooth' });
              }
            }}
            style={{ 
              background: '#FFD700', 
              color: '#000', 
              padding: '16px 32px', 
              border: 'none', 
              cursor: 'pointer', 
              fontWeight: 'bold', 
              borderRadius: '8px',
              fontSize: '16px',
              textTransform: 'uppercase',
              letterSpacing: '2px',
              transition: 'all 0.3s ease'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.transform = 'scale(1.05)';
              e.currentTarget.style.boxShadow = '0 8px 25px rgba(255, 215, 0, 0.3)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = 'scale(1)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            VIEW INDEXES
          </button>
        </div>
      </div>

      {/* Dashboard Section */}
      <div id="dashboard-section" style={{ minHeight: '100vh', padding: '40px 20px' }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
          {/* Header & Branding */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
            <div>
              <h1 style={{ fontSize: '24px', fontWeight: 'bold', margin: 0, color: '#fff' }}>BlackSlon Energy Indexes</h1>
              <p style={{ margin: '5px 0', color: '#888', fontSize: '12px' }}>ZERO SPREAD | ZERO EXPIRY | LIQUIDTY 24/7</p>
            </div>
            <button style={{ background: '#fff', color: '#000', padding: '12px 24px', border: 'none', cursor: 'pointer', fontWeight: 'bold', borderRadius: '4px' }}>
              CONNECT WALLET
            </button>
          </div>

        {/* Tab Navigation */}
        <div className="flex flex-wrap gap-1 mb-8">
          <button 
            onClick={() => handleTabSwitch('power')} 
            style={{ 
              background: activeTab === 'power' ? getAccent() : 'transparent', 
              color: activeTab === 'power' ? '#000' : '#fff', 
              border: `1px solid ${getAccent()}`, 
              padding: '8px 10px', 
              cursor: 'pointer', 
              fontSize: '9px', 
              fontWeight: 'bold', 
              textTransform: 'uppercase' 
            }}
          >
            BlackSlon Power Indexes
          </button>
          <button 
            onClick={() => handleTabSwitch('gas')} 
            style={{ 
              background: activeTab === 'gas' ? getAccent() : 'transparent', 
              color: activeTab === 'gas' ? '#000' : '#fff', 
              border: `1px solid ${getAccent()}`, 
              padding: '8px 10px', 
              cursor: 'pointer', 
              fontSize: '9px', 
              fontWeight: 'bold', 
              textTransform: 'uppercase' 
            }}
          >
            BlackSlon Gas Indexes
          </button>
        </div>

        {/* Price Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 mb-8">
          {pricesState[activeTab].map((m: Market) => (
            <div key={m.index} style={{ background: '#050505', padding: '12px', border: '1px solid #1a1a1a', cursor: 'pointer', opacity: m.status === 'development' ? 0.6 : 1 }} onClick={() => m.status !== 'development' && handleMarketClick(m)}>
              <div className="text-xs text-gray-600">{getMarketLabel(m.country, m.role)}</div>
              <div className="text-xs font-bold">{m.index}</div>
              <div className="my-2">
                <span className="text-xl font-bold" style={{ color: getAccent() }}>
                  {displayPrice(m.price)}
                </span>
                <span className="text-xs text-gray-600 ml-1">€/{getLabelQuantity()} {getUnit()}</span>
              </div>
              <div className="flex gap-1 mb-3">
                <button className="flex-1 bg-transparent text-green-400 border border-green-400 py-1 text-xs font-bold hover:bg-green-400 hover:text-black transition-colors" disabled={m.status === 'development'}>
                  BUY
                </button>
                <button className="flex-1 bg-transparent text-red-400 border border-red-400 py-1 text-xs font-bold hover:bg-red-400 hover:text-black transition-colors" disabled={m.status === 'development'}>
                  SELL
                </button>
              </div>
              <div className="text-xs text-gray-500">
                OI: {(m.oi || 0).toLocaleString()}
              </div>
              {m.status === 'development' && (
                <div className="text-xs text-gray-500 mt-1">
                  <span className="bg-gray-700 px-2 py-1 rounded">In Development</span>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Formula Display Section */}
        <div className="max-w-6xl mx-auto mt-8">
          <FormulaDisplay 
            activeMarket={selectedMarket}
          />
        </div>
        </div>
      </div>
    </div>
  )
}
