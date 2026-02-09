'use client'

interface FormulaDisplayProps {
  a?: number
  b?: number
  s?: number
  activeMarket?: {
    country: string
    index: string
    price: number
    role: string
  }
}

export default function FormulaDisplay({ a = 0, b = 0, s = 0, activeMarket }: FormulaDisplayProps) {
  // Use activeMarket.price directly as 'a' parameter - no manual overrides
  const basePrice = activeMarket ? activeMarket.price : a
  
  // Hardcoded calibration values for BlackSlon
  const e = 2.718 // Euler's number
  const volatility = 0.05 // Calibrated volatility for BlackSlon start
  const stressFactor = 1.0 // Stress factor
  
  const calculateP = () => {
    // If basePrice is 0, return 0 to prevent NaN
    if (basePrice === 0) return 0
    return basePrice * Math.exp(volatility * stressFactor)
  }

  const checkPriceDeviation = (currentPrice: number, basePrice: number) => {
    const deviation = Math.abs((currentPrice - basePrice) / basePrice) * 100
    return {
      deviation: deviation.toFixed(2),
      isWithinThreshold: deviation <= 10,
      needsIntervention: deviation > 10
    }
  }

  const p = calculateP()
  const priceCheck = checkPriceDeviation(p, basePrice)
  
  // Calculate arbitrage gap
  const arbitrageGap = activeMarket ? (activeMarket.price - p).toFixed(2) : '0.00'
  const arbitragePercentage = activeMarket ? ((Math.abs(activeMarket.price - p) / p) * 100).toFixed(2) : '0.00'

  return (
    <div className="bg-gray-950 border border-gray-800 p-6 rounded-lg">
      {/* Active Market Header */}
      <div className="mb-4 pb-4 border-b border-gray-800">
        <div className="text-center">
          <div className="text-xs text-gray-500 mb-1">ACTIVE MARKET</div>
          <div className="text-lg font-bold text-blue-400">
            {activeMarket ? `${activeMarket.country} // ${activeMarket.role}` : 'No Market Selected'}
          </div>
        </div>
      </div>
      
      <h3 className="text-lg font-bold mb-4 text-blue-400">BlackSlon Pricing Formula</h3>
      
      <div className="mb-6">
        <div className="text-2xl font-mono text-center mb-4">
          P = a × e<sup>(b × S)</sup>
        </div>
      </div>

      {/* Formula Values */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        {/* Base Price */}
        <div className="text-center">
          <div className="text-gray-500 mb-2">Base Price (a)</div>
          <div className="text-2xl font-mono font-bold text-white">
            {activeMarket ? activeMarket.price.toFixed(2) : '0.00'}
          </div>
        </div>
        
        {/* Euler's Number */}
        <div className="text-center">
          <div className="text-gray-500 mb-2">Euler's Number (e)</div>
          <div className="text-2xl font-mono font-bold text-white">
            2.718
          </div>
        </div>
        
        {/* Volatility */}
        <div className="text-center">
          <div className="text-gray-500 mb-2">Volatility (b)</div>
          <div className="text-2xl font-mono font-bold text-white">
            0.05
          </div>
        </div>
        
        {/* Stress Factor */}
        <div className="text-center">
          <div className="text-gray-500 mb-2">Stress Factor (S)</div>
          <div className="text-2xl font-mono font-bold text-white">
            1.0
          </div>
        </div>
      </div>

      {/* BlackSlon Index */}
      <div className="mt-4 pt-4 border-t border-gray-800">
        <div className="text-center">
          <div className="text-gray-500 mb-2">BlackSlon Energy Index {activeMarket ? activeMarket.country : 'DE'}</div>
          <div className="text-2xl font-mono font-bold text-white">
            {p.toFixed(2)}
          </div>
        </div>
      </div>

      {/* Safety Corridor */}
      <div className="mt-4 pt-4 border-t border-gray-800">
        <div className="text-center">
          <div className="text-gray-500 mb-2">Safety Corridor (+/- 10%)</div>
          <div className="grid grid-cols-3 gap-2 mb-2">
            <div className="bg-gray-900 border border-gray-700 rounded p-2 text-center">
              <div className="text-xs text-gray-400">Min</div>
              <div className="text-sm font-mono text-gray-300">
                {(basePrice * 0.90).toFixed(2)}
              </div>
            </div>
            <div className="bg-gray-900 border border-gray-700 rounded p-2 text-center">
              <div className="text-xs text-gray-400">Market</div>
              <div className="text-sm font-mono font-bold text-white">
                {basePrice.toFixed(2)}
              </div>
            </div>
            <div className="bg-gray-900 border border-gray-700 rounded p-2 text-center">
              <div className="text-xs text-gray-400">Max</div>
              <div className="text-sm font-mono text-gray-300">
                {(basePrice * 1.10).toFixed(2)}
              </div>
            </div>
          </div>
          <div className="text-xs text-gray-500">
            ±10% Liquidity Safety Buffer
          </div>
        </div>
      </div>

      {/* Arbitrage Gap */}
      <div className="mt-4 pt-4 border-t border-gray-800">
        <div className="text-center">
          <div className="text-gray-500 mb-2">Arbitrage Gap</div>
          <div className={`text-lg font-mono font-bold ${
            parseFloat(arbitrageGap) > 0 ? 'text-green-400' : 
            parseFloat(arbitrageGap) < 0 ? 'text-red-400' : 'text-gray-400'
          }`}>
            {parseFloat(arbitrageGap) > 0 ? '+' : ''}{arbitrageGap} ({arbitragePercentage}%)
          </div>
        </div>
      </div>

      {/* Price Deviation Monitor */}
      <div className={`border-t pt-4 mt-4 ${priceCheck.needsIntervention ? 'border-red-500' : 'border-gray-800'}`}>
        <div className="text-center">
          <div className="text-gray-500 mb-2">Price Deviation Monitor</div>
          <div className={`text-lg font-mono font-bold ${
            priceCheck.needsIntervention ? 'text-red-400' : 'text-green-400'
          }`}>
            {priceCheck.deviation}% from base
          </div>
          {priceCheck.needsIntervention && (
            <div className="mt-3 p-3 bg-red-900/30 border border-red-500 rounded">
              <div className="text-red-400 font-bold text-sm mb-1">⚠️ PROTOCOL INTERVENTION</div>
              <div className="text-red-300 text-xs">
                Price deviation exceeds 10% threshold
              </div>
            </div>
          )}
          {priceCheck.isWithinThreshold && (
            <div className="mt-2 text-xs text-green-400">
              ✓ Price within acceptable range
            </div>
          )}
        </div>
      </div>

      {/* Liquidty Status */}
      <div className="mt-4 pt-4 border-t border-gray-800">
        <div className="text-center">
          <div className="text-gray-500 mb-2">Index Status</div>
          <div className={`text-sm font-bold ${
            p < basePrice * 0.90 || p > basePrice * 1.10 ? 'text-orange-400' : 'text-green-400'
          }`}>
            {p < basePrice * 0.90 || p > basePrice * 1.10 ? '⚠ STATUS: DEVIATING' : '✓ STATUS: STABLE'}
          </div>
        </div>
      </div>

      {/* Formula Components */}
      <div className="mt-4 text-xs text-gray-600">
        <div className="mb-2">Formula Components:</div>
        <ul className="space-y-1">
          <li>• <strong>a:</strong> Base market price coefficient</li>
          <li>• <strong>e:</strong> Euler's number (2.718)</li>
          <li>• <strong>b:</strong> Volatility sensitivity parameter</li>
          <li>• <strong>S:</strong> Settlement time factor</li>
        </ul>
      </div>
    </div>
  )
}
