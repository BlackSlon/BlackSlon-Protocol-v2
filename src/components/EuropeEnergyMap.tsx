'use client'

import { useState } from 'react'
import { ComposableMap, Geographies, Geography } from 'react-simple-maps'

interface CountryData {
  name: string
  symbol: string
}

const countryData: Record<string, CountryData> = {
  PL: { name: 'Poland', symbol: 'BLSN-E-PL' },
  DE: { name: 'Germany', symbol: 'BLSN-E-DE' },
  FR: { name: 'France', symbol: 'BLSN-E-FR' },
  IT: { name: 'Italy', symbol: 'BLSN-E-IT' },
  ES: { name: 'Spain', symbol: 'BLSN-E-ES' },
  GB: { name: 'United Kingdom', symbol: 'BLSN-E-GB' },
  NL: { name: 'Netherlands', symbol: 'BLSN-E-NL' },
  BE: { name: 'Belgium', symbol: 'BLSN-E-BE' },
  AT: { name: 'Austria', symbol: 'BLSN-E-AT' },
  CH: { name: 'Switzerland', symbol: 'BLSN-E-CH' },
  CZ: { name: 'Czech Republic', symbol: 'BLSN-E-CZ' },
  SK: { name: 'Slovakia', symbol: 'BLSN-E-SK' },
  HU: { name: 'Hungary', symbol: 'BLSN-E-HU' },
  RO: { name: 'Romania', symbol: 'BLSN-E-RO' },
  BG: { name: 'Bulgaria', symbol: 'BLSN-E-BG' },
  GR: { name: 'Greece', symbol: 'BLSN-E-GR' },
  PT: { name: 'Portugal', symbol: 'BLSN-E-PT' },
  SE: { name: 'Sweden', symbol: 'BLSN-E-SE' },
  NO: { name: 'Norway', symbol: 'BLSN-E-NO' },
  DK: { name: 'Denmark', symbol: 'BLSN-E-DK' },
  FI: { name: 'Finland', symbol: 'BLSN-E-FI' },
  IE: { name: 'Ireland', symbol: 'BLSN-E-IE' },
  HR: { name: 'Croatia', symbol: 'BLSN-E-HR' },
  SI: { name: 'Slovenia', symbol: 'BLSN-E-SI' },
  EE: { name: 'Estonia', symbol: 'BLSN-E-EE' },
  LV: { name: 'Latvia', symbol: 'BLSN-E-LV' },
  LT: { name: 'Lithuania', symbol: 'BLSN-E-LT' },
  LU: { name: 'Luxembourg', symbol: 'BLSN-E-LU' },
  MT: { name: 'Malta', symbol: 'BLSN-E-MT' },
  CY: { name: 'Cyprus', symbol: 'BLSN-E-CY' }
}

export default function EuropeEnergyMap() {
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null)
  const [hoveredCountry, setHoveredCountry] = useState<string | null>(null)

  const handleCountryClick = (countryCode: string) => {
    if (countryData[countryCode]) {
      setSelectedCountry(selectedCountry === countryCode ? null : countryCode)
    }
  }

  const selectedCountryData = selectedCountry ? countryData[selectedCountry] : null

  return (
    <div className="min-h-screen bg-[#050505] text-white p-8">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-[10px] tracking-[0.3em] text-red-600 uppercase font-bold">
          EUROPEAN ENERGY MARKETS
        </h1>
        
        {/* Legend */}
        <div className="flex justify-center items-center gap-8 mt-6">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-red-600 rounded"></div>
            <span className="text-sm text-gray-300">SELL (West)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-green-600 rounded"></div>
            <span className="text-sm text-gray-300">BUY (East)</span>
          </div>
        </div>
      </div>

      {/* Map Container */}
      <div className="relative max-w-6xl mx-auto">
        <ComposableMap
          projection="geoAzimuthalEqualArea"
          projectionConfig={{
            rotate: [-10, -52, 0],
            scale: 800,
            center: [0, 0]
          }}
        >
          <Geographies geography="https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json">
            {({ geographies }) =>
              geographies.map((geo) => {
                const countryCode = geo.properties.ISO_A2
                const isSelected = selectedCountry === countryCode
                const isHovered = hoveredCountry === countryCode
                const hasMarket = countryData[countryCode]
                
                // Determine if country is on the "SELL" side (left/west) or "BUY" side (right/east)
                // Using longitude approximation - countries west of 15°E are SELL (red), east are BUY (green)
                const centroid = geo.properties?.centroid || [0, 0]
                const isSellSide = centroid[0] < 15

                return (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    onClick={() => handleCountryClick(countryCode)}
                    onMouseEnter={() => setHoveredCountry(countryCode)}
                    onMouseLeave={() => setHoveredCountry(null)}
                    style={{
                      default: {
                        fill: hasMarket ? (isSellSide ? '#dc2626' : '#16a34a') : '#0f172a',
                        stroke: '#334155',
                        strokeWidth: 0.5,
                        outline: 'none',
                        cursor: hasMarket ? 'pointer' : 'default'
                      },
                      hover: {
                        fill: hasMarket ? (isSellSide ? '#ef4444' : '#22c55e') : '#1e293b',
                        stroke: '#475569',
                        strokeWidth: 1,
                        outline: 'none',
                        cursor: hasMarket ? 'pointer' : 'default'
                      },
                      pressed: {
                        fill: hasMarket ? (isSellSide ? '#b91c1c' : '#15803d') : '#475569',
                        stroke: '#64748b',
                        strokeWidth: 1,
                        outline: 'none'
                      }
                    }}
                  />
                )
              })
            }
          </Geographies>
        </ComposableMap>

        {/* Trade Box */}
        {selectedCountryData && (
          <div className="absolute top-4 right-4 bg-[#0a0a0a] border border-yellow-500/50 rounded-lg shadow-2xl p-6 min-w-[280px]">
            {/* Close Button */}
            <button
              onClick={() => setSelectedCountry(null)}
              className="absolute top-2 right-2 text-gray-400 hover:text-white transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Country Info */}
            <div className="mb-6">
              <h2 className="text-xl font-bold text-white mb-2">
                {selectedCountryData.name}
              </h2>
              <p className="text-sm text-gray-400 font-mono">
                {selectedCountryData.symbol}
              </p>
            </div>

            {/* Trade Buttons */}
            <div className="space-y-3">
              <button className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-4 rounded-lg transition-colors">
                KUP (Buy)
              </button>
              <button className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-4 rounded-lg transition-colors">
                SPRZEDAJ (Sell)
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
