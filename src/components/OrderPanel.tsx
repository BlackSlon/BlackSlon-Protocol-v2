'use client'

import { useState } from 'react'

interface OrderPanelProps {
  currentPrice: number
  borderColor: string
  montserratStyle: React.CSSProperties
}

export default function OrderPanel({ currentPrice, borderColor, montserratStyle }: OrderPanelProps) {
  // Order Panel State
  const [quantity, setQuantity] = useState<number>(100)
  const [bsrCollateral, setBsrCollateral] = useState<number>(50)
  const [euroCollateral, setEuroCollateral] = useState<number>(50)
  const [depositDirection, setDepositDirection] = useState<'BUY' | 'SELL'>('BUY')

  // Risk Management Table
  const riskTable = {
    '0-25': { margin: 100, leverage: '1.00x' },
    '26-50': { margin: 50, leverage: '2.00x' },
    '51-75': { margin: 33, leverage: '3.00x' },
    '76-100': { margin: 25, leverage: '4.00x' }
  }

  // Portfolio State
  const [bsrPrice, setBsrPrice] = useState<number>(1.05)
  const [openPosition, setOpenPosition] = useState<number>(272836)
  const [bsrDeposit, setBsrDeposit] = useState<number>(1000)
  const [euroDeposit, setEuroDeposit] = useState<number>(500)
  const [lockedFunds, setLockedFunds] = useState<number>(200)

  // Sentiment Data
  const [longSentiment, setLongSentiment] = useState<number>(65)
  const [shortSentiment, setShortSentiment] = useState<number>(35)

  // Collateral sliders logic
  const handleBsrChange = (value: number) => {
    setBsrCollateral(value)
    setEuroCollateral(100 - value)
  }

  const handleEuroChange = (value: number) => {
    setEuroCollateral(value)
    setBsrCollateral(100 - value)
  }

  // Calculate leverage and margin requirements
  const calculateLeverage = () => {
    const totalCollateral = (bsrCollateral / 100) * bsrDeposit + (euroCollateral / 100) * euroDeposit
    const positionValue = quantity * currentPrice
    return totalCollateral > 0 ? (positionValue / totalCollateral).toFixed(2) : '1.00'
  }

  const getRiskData = () => {
    const leverage = parseFloat(calculateLeverage())
    if (leverage <= 1) return riskTable['0-25']
    if (leverage <= 2) return riskTable['26-50']
    if (leverage <= 3) return riskTable['51-75']
    return riskTable['76-100']
  }

  const calculateMarginRequired = () => {
    const riskData = getRiskData()
    const positionValue = quantity * currentPrice
    
    if (depositDirection === 'BUY') {
      const marginRate = riskData.margin / 100
      const requiredMargin = positionValue * marginRate
      const bsrRequired = (requiredMargin * bsrCollateral) / 100
      const euroRequired = (requiredMargin * euroCollateral) / 100
      return {
        bsrRequired: bsrRequired / bsrPrice,
        euroRequired: euroRequired,
        buyMargin: riskData.margin,
        sellMargin: riskData.margin
      }
    } else {
      const marginRate = riskData.margin / 100
      const requiredMargin = positionValue * marginRate
      const bsrRequired = (requiredMargin * bsrCollateral) / 100
      const euroRequired = (requiredMargin * euroCollateral) / 100
      return {
        bsrRequired: bsrRequired / bsrPrice,
        euroRequired: euroRequired,
        buyMargin: riskData.margin,
        sellMargin: riskData.margin
      }
    }
  }

  const monoStyle = {
    fontFamily: 'monospace',
    fontSize: '12px'
  }

  return (
    <div className={`bg-black border ${borderColor} p-6 flex flex-col scale-[0.6894] origin-top`}>
      {/* Header */}
      <div className="mb-6">
        <h3 className="text-[12px] text-white font-bold tracking-[0.3em] mb-2 border-b border-gray-600 pb-2 text-center">ORDER PANEL</h3>
        <div className="text-[17px] font-bold tracking-[0.3em] text-red-500 text-center">INSTRUMENT: IPT-P-PL</div>
      </div>
      
      {/* TRADING Section */}
      <div className="mb-10">
        {/* Current IPT Price */}
        <div className="mb-6">
          <div className="flex items-center justify-center">
            <span className={`text-5xl font-bold tracking-[0.15em] text-yellow-400`}>
              {currentPrice.toFixed(2)}
            </span>
            <span className="text-[14px] text-white ml-4">EUR/vkWh</span>
          </div>
        </div>
        
        {/* Quantity Stepper */}
        <div className="mb-8">
          <div className="text-[10px] text-white tracking-[0.2em] mb-3 text-center font-bold">QUANTITY</div>
          <div className="flex items-center justify-center gap-3">
            <button 
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="w-8 h-8 bg-gray-800 hover:bg-gray-700 text-white rounded flex items-center justify-center text-sm font-bold"
            >
              -
            </button>
            <input
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(Math.max(1, Math.min(1000, parseInt(e.target.value) || 1)))}
              className="w-20 text-center bg-gray-800 text-white font-mono text-xl rounded border border-gray-700 focus:outline-none focus:border-gray-600"
              style={{
                appearance: 'textfield',
                MozAppearance: 'textfield',
                WebkitAppearance: 'none'
              }}
            />
            <button 
              onClick={() => setQuantity(Math.min(1000, quantity + 1))}
              className="w-8 h-8 bg-gray-800 hover:bg-gray-700 text-white rounded flex items-center justify-center text-sm font-bold"
            >
              +
            </button>
          </div>
        </div>
        
        {/* Trade Buttons */}
        <div className="flex justify-center gap-4">
          <button className="bg-transparent border-2 border-green-500 text-green-500 py-4 px-6 rounded font-bold text-sm tracking-wider transition-all hover:bg-green-500 hover:text-black">
            BUY
          </button>
          <button className="bg-transparent border-2 border-red-500 text-red-500 py-4 px-6 rounded font-bold text-sm tracking-wider transition-all hover:bg-red-500 hover:text-black">
            SELL
          </button>
        </div>
      </div>
      
      {/* Divider */}
      <div className="border-t border-gray-700 my-6"></div>
      
      {/* DEPOSIT Section */}
      <div className="mb-6">
        {/* Light Switch Toggle */}
        <div className="mb-6">
          <div className="text-[11px] text-white tracking-[0.2em] mb-3 text-center font-bold">DEPOSIT</div>
          <div className="flex items-center justify-center">
            <div className="relative w-36 h-8 bg-gray-700 rounded-full p-1">
              <div 
                className={`absolute top-1 w-16 h-6 bg-white rounded-full transition-transform duration-200 ease-in-out ${
                  depositDirection === 'BUY' ? 'translate-x-0' : 'translate-x-16'
                }`}
              ></div>
              <button 
                onClick={() => setDepositDirection('BUY')}
                className={`absolute left-1 top-1 z-10 px-3 py-1 text-[10px] font-bold transition-colors duration-200 ${
                  depositDirection === 'BUY' ? 'text-black' : 'text-white'
                }`}
              >
                BUY
              </button>
              <button 
                onClick={() => setDepositDirection('SELL')}
                className={`absolute right-1 top-1 z-10 px-2 py-1 text-[10px] font-bold transition-colors duration-200 ${
                  depositDirection === 'SELL' ? 'text-black' : 'text-white'
                }`}
              >
                SELL
              </button>
            </div>
          </div>
        </div>
        
        {/* Collateral Sliders */}
        <div className="mb-6">
          {/* €BSR Slider */}
          <div className="mb-4">
            <div className="flex justify-between text-[11px] text-white mb-2 font-bold">
              <span>€BSR</span>
              <span>{bsrCollateral}%</span>
            </div>
            <input
              type="range"
              min="10"
              max="100"
              value={bsrCollateral}
              onChange={(e) => handleBsrChange(parseInt(e.target.value))}
              className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
            />
          </div>
          
          {/* eEURO Slider */}
          <div className="mb-4">
            <div className="flex justify-between text-[11px] text-white mb-2 font-bold">
              <span>eEURO</span>
              <span>{euroCollateral}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="90"
              value={euroCollateral}
              onChange={(e) => handleEuroChange(parseInt(e.target.value))}
              className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
            />
          </div>
        </div>
      </div>
      
      {/* ESTIMATED MARGIN REQUIREMENT */}
      <div className="flex-grow"></div>
      <div className="mt-auto">
        <div className="text-[10px] text-white tracking-[0.2em] mb-3 text-center font-bold">ESTIMATED MARGIN REQUIREMENT</div>
        <div className="bg-gray-900 p-4 rounded">
          <div className="text-center mb-3">
            <div className="text-gray-400 text-xs mb-1">MARGIN ({depositDirection === 'BUY' ? 'TO BUY' : 'TO SELL'})</div>
            <div className="text-yellow-400 text-xl font-mono font-bold">
              {depositDirection === 'BUY' ? calculateMarginRequired().buyMargin : calculateMarginRequired().sellMargin}%
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center">
              <div className="text-gray-400 text-xs mb-1">€BSR REQUIRED</div>
              <div className="text-green-400 text-lg font-mono">
                {calculateMarginRequired().bsrRequired.toFixed(2)} €BSR
              </div>
            </div>
            <div className="text-center">
              <div className="text-gray-400 text-xs mb-1">eEURO REQUIRED</div>
              <div className="text-blue-400 text-lg font-mono">
                €{calculateMarginRequired().euroRequired.toFixed(2)}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
