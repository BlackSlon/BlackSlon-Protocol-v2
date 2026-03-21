'use client'

import { useState, useEffect } from 'react'
import { useTrading, useVirtual, useUserAccount } from '@/store/blackslon'
import { getMarketData } from '@/data/markets'
import { getMarketColors } from '@/lib/marketColors'
import { getCurrentCycleData } from '@/lib/marketCycle'
import Tooltip from '@/components/Tooltip'
import { getMarketTooltips } from '@/lib/marketTooltips'
import type { BSSZState, MarketId } from '@/store/types'

// ─── Tiering Matrix ───────────────────────────────────────────────────────────
// Source: Risk-Management-Micro.md + Economic-Equilibrium-Treasury-Governance.md
// Only 5 discrete tiers are defined in the protocol spec.
// Slider snaps to the nearest defined tier.
const TIER_MATRIX: Record<number, { marginLong: number; marginShort: number; fee: number }> = {
  10:  { marginLong: 0.50, marginShort: 1.00, fee: 0.0100 },
  25:  { marginLong: 0.45, marginShort: 0.90, fee: 0.0085 },
  50:  { marginLong: 0.40, marginShort: 0.80, fee: 0.0060 },
  75:  { marginLong: 0.30, marginShort: 0.60, fee: 0.0035 },
  100: { marginLong: 0.25, marginShort: 0.50, fee: 0.0020 },
}

const BSR_TIERS = [10, 25, 50, 75, 100] as const
type BsrTier = typeof BSR_TIERS[number]

/** Snap continuous slider value to nearest defined protocol tier */
function snapToTier(value: number): BsrTier {
  return BSR_TIERS.reduce((prev, curr) =>
    Math.abs(curr - value) < Math.abs(prev - value) ? curr : prev
  ) as BsrTier
}

interface Props {
  selectedMarketId?: string
}

export default function TradingPanel({ selectedMarketId = 'BS-P-PL' }: Props) {
  const marketColors = getMarketColors(selectedMarketId)
  const virtualStore = useVirtual()
  
  const colors = marketColors.isGas
    ? {
        title: 'text-cyan-400',
        value: 'text-cyan-400',
        label: 'text-cyan-700',
        border: 'border-cyan-800/30',
        pulse: 'bg-cyan-700',
        isGas: true,
        badgeText: 'text-cyan-400',
        badgeBorder: 'border-cyan-500/40',
      }
    : {
        title: 'text-yellow-600',
        value: 'text-yellow-500',
        label: 'text-yellow-700',
        border: 'border-yellow-800/30',
        pulse: 'bg-yellow-700',
        isGas: false,
        badgeText: 'text-yellow-500',
        badgeBorder: 'border-yellow-500/40',
      }

  const {
    pendingOrder,
    activeOrders,
    bssz: storeBssz,
    solvencyTier,
    emergencyLock,
    placeOrder,
    setPendingOrder,
    cancelOrder,
    marketId,
  } = useTrading()

  const [bssz, setBssz] = useState<BSSZState>(storeBssz)

  const fallbackBssz: Record<string, { floor: number; ceiling: number }> = {
    'BS-P-DE': { floor: 8.21, ceiling: 10.94 },
    'BS-P-NO': { floor: 5.59, ceiling: 7.46 },
    'BS-P-UK': { floor: 8.14, ceiling: 10.86 },
    'BS-P-PL': { floor: 9.53, ceiling: 12.71 },
    'BS-G-NL': { floor: 3.50, ceiling: 6.00 },
    'BS-G-DE': { floor: 3.50, ceiling: 6.00 },
    'BS-G-PL': { floor: 3.50, ceiling: 6.00 },
    'BS-G-BG': { floor: 3.50, ceiling: 6.00 },
  }

  const fallbackLastTrade: Record<string, number> = {
    'BS-G-NL': 4.43,
    'BS-G-DE': 4.50,
    'BS-G-PL': 4.78,
    'BS-G-BG': 4.13,
    'BS-P-DE': 9.12,
    'BS-P-NO': 6.21,
    'BS-P-PL': 9.94,
    'BS-P-UK': 8.77,
  }

  const getDisplayLastTradePrice = () => {
    const marketLastTrade = virtualStore.orderBook.lastTradeByMarket?.[selectedMarketId as MarketId]
    if (marketLastTrade && Number.isFinite(marketLastTrade.price) && (Date.now() - marketLastTrade.timestamp < 86400000)) {
      return marketLastTrade.price
    }

    const explicitLastTrade = fallbackLastTrade[selectedMarketId]
    if (typeof explicitLastTrade === 'number') {
      return explicitLastTrade
    }

    try {
      const cycleData = getCurrentCycleData(selectedMarketId)
      if (cycleData?.anchor) {
        return cycleData.anchor / 10
      }
    } catch {}

    return selectedMarketId.startsWith('BS-P') ? 9.50 : 3.50
  }

  useEffect(() => {
    // Always prefer fallbackBssz hardcoded values — cycle data raw values are
    // stored ×10 and day-0 ceiling is sometimes incorrect in cycle-data.json
    const hardcoded = fallbackBssz[selectedMarketId]
    if (hardcoded) {
      setBssz({ floor: hardcoded.floor, ceiling: hardcoded.ceiling, isLocked: false, lockReason: null })
      return
    }
    // For unknown markets, compute from anchor price directly (same as matching engine)
    try {
      const cycleData = getCurrentCycleData(selectedMarketId)
      if (cycleData) {
        const f = cycleData.floor / 10
        const c = cycleData.ceiling / 10
        // Sanity check: ceiling must be 1.05–1.50× floor
        if (c > f * 1.05 && c < f * 1.50) {
          setBssz({ floor: f, ceiling: c, isLocked: false, lockReason: null })
          return
        }
      }
    } catch {}
    setBssz({ floor: 1.0, ceiling: 20.0, isLocked: false, lockReason: null })
  }, [selectedMarketId])

  const getLastTradePrice = () => {
    return getDisplayLastTradePrice().toFixed(2)
  }

  const [price, setPrice] = useState(getLastTradePrice())
  const [quantity, setQuantity] = useState(5)
  const [side, setSide] = useState<'BUY' | 'SELL'>('BUY')

  // BSR stake — always snapped to a defined protocol tier (10/25/50/75/100)
  // Exception: Tier III/IV override to 0 (eEURO-only mandate)
  const [bsrTier, setBsrTier] = useState<BsrTier>(50)
  const [orderError, setOrderError] = useState<string | null>(null)
  const [orderSuccess, setOrderSuccess] = useState(false)
  const [walletWarning, setWalletWarning] = useState(false)
  const normalizedFloor = Number.isFinite(bssz.floor) ? bssz.floor : 0
  const normalizedCeiling = Number.isFinite(bssz.ceiling) ? bssz.ceiling : 0
  const hasValidBssz = normalizedFloor > 0 && normalizedCeiling > normalizedFloor
  const corridorEpsilon = 0.0001

  useEffect(() => {
    const nextPrice = parseFloat(getLastTradePrice().replace(',', '.'))
    if (Number.isFinite(nextPrice) && hasValidBssz) {
      const clampedPrice = Math.min(Math.max(nextPrice, normalizedFloor), normalizedCeiling)
      setPrice(clampedPrice.toFixed(2))
    } else {
      setPrice(getLastTradePrice())
    }
    setOrderError(null)
    setOrderSuccess(false)
  }, [selectedMarketId, hasValidBssz, normalizedFloor, normalizedCeiling])

  // Effective BSR stake: 0 when eEURO-only mandate is active, otherwise the chosen tier
  const isForcedEuroOnly = solvencyTier === 'III' || solvencyTier === 'IV'
  const effectiveBsrStake = isForcedEuroOnly ? 0 : bsrTier
  const euroStake = 100 - effectiveBsrStake

  // Detect closing position: SELL when long, BUY when short
  const { inventory, user } = useUserAccount()
  const currentPosition = inventory.find(p => p.token === selectedMarketId)
  const currentUnits = currentPosition?.units || 0
  const isClosingPosition =
    (side === 'SELL' && currentUnits > 0) ||
    (side === 'BUY' && currentUnits < 0)

  // Tier III/IV resets chosen tier to minimum (will snap back when mandate lifts)
  useEffect(() => {
    if (isForcedEuroOnly) {
      setBsrTier(10) // reset to minimum so it snaps correctly when mandate lifts
    }
  }, [isForcedEuroOnly])

  // Keep pending order preview in sync with inputs
  useEffect(() => {
    const p = parseFloat(price.replace(',', '.'))
    if (!isNaN(p) && quantity > 0) {
      setPendingOrder(side, p, quantity, effectiveBsrStake, selectedMarketId)
    }
  }, [side, price, quantity, effectiveBsrStake, selectedMarketId])

  useEffect(() => {
    const p = parseFloat(price.replace(',', '.'))
    if (!isNaN(p) && quantity > 0) {
      setPendingOrder(side, p, quantity, effectiveBsrStake, selectedMarketId)
    }
  }, [])

  const handlePriceStep = (delta: number) => {
    setPrice((p: string) => (parseFloat(p) + delta).toFixed(2))
  }

  const handleBsrSliderChange = (raw: number) => {
    const snapped = snapToTier(raw)
    setBsrTier(snapped)
    const p = parseFloat(price.replace(',', '.'))
    if (!isNaN(p) && quantity > 0) {
      setPendingOrder(side, p, quantity, snapped, selectedMarketId)
    }
  }

  const handleSubmit = (side: 'BUY' | 'SELL') => {
    setOrderError(null)
    setOrderSuccess(false)
    if (!user.walletConnected) {
      setWalletWarning(true)
      setTimeout(() => setWalletWarning(false), 10000)
      return
    }
    const p = parseFloat(price.replace(',', '.'))
    if (isNaN(p) || quantity <= 0) {
      setOrderError('Invalid price or quantity')
      return
    }
    if (hasValidBssz && (p < normalizedFloor - corridorEpsilon || p > normalizedCeiling + corridorEpsilon)) {
      setOrderError(`Price ${p.toFixed(2)} outside BSSZ corridor [${normalizedFloor.toFixed(2)} – ${normalizedCeiling.toFixed(2)}]`)
      return
    }
    const error = placeOrder(side, p, quantity, effectiveBsrStake, selectedMarketId || 'BS-P-PL')
    if (error) {
      setOrderError(error)
    } else {
      setOrderSuccess(true)
      setTimeout(() => setOrderSuccess(false), 2500)
    }
  }

  const priceNum = parseFloat(price.replace(',', '.'))
  const priceOutOfBSSZ = hasValidBssz && !isNaN(priceNum) && (priceNum < normalizedFloor - corridorEpsilon || priceNum > normalizedCeiling + corridorEpsilon)
  const isBlocked = solvencyTier === 'IV'

  // Get margin info for current effective tier
  const CLOSING_FEE = 0.002 // 0.20% fixed for closing positions
  const currentTierData = isClosingPosition
    ? { marginLong: 0, marginShort: 0, fee: CLOSING_FEE }
    : isForcedEuroOnly
    ? { marginLong: 0.50, marginShort: 1.00, fee: 0.0100 }
    : TIER_MATRIX[bsrTier]

  return (
    <div className="flex flex-col h-full bg-black font-mono text-white p-0">

      {/* ── Wallet Required Overlay ── */}
      {walletWarning && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center pointer-events-none">
          <div
            className="pointer-events-auto bg-black/95 border-2 border-amber-700 rounded-sm px-10 py-8 text-center font-mono animate-pulse shadow-2xl"
            style={{ boxShadow: '0 0 60px rgba(180,83,9,0.4)' }}
          >
            <div className="text-4xl mb-3">🔒</div>
            <div className="text-xl font-black tracking-[0.3em] uppercase mb-3 text-amber-600">
              CONNECT WALLET FIRST
            </div>
            <div className="text-[11px] text-gray-400 uppercase tracking-widest mb-1">
              Open the User Account panel and click Connect Wallet
            </div>
            <div className="text-[9px] text-gray-400 uppercase tracking-widest mt-3">
              Email verification required to trade
            </div>
            <button
              onClick={() => setWalletWarning(false)}
              className="mt-4 px-6 py-1.5 border border-gray-700 text-[8px] text-gray-500 uppercase tracking-widest rounded-sm hover:border-amber-700 hover:text-amber-600 transition-all"
            >
              Dismiss
            </button>
          </div>
        </div>
      )}

      <div className="w-full pt-1 pb-1 flex flex-col items-center shrink-0">
        <div className="text-[10px] text-gray-500 uppercase tracking-[0.5em] font-bold">
          Trading Panel
        </div>
        <div className="w-[80%] border-b border-gray-800 mt-2" />
      </div>

      <div className="flex-grow px-6 pb-6 flex flex-col min-h-0 sm:px-2">

        <div className="pt-2 pb-1 bg-gradient-to-b from-black to-gray-950 w-full">
          <div className="flex items-center justify-center gap-2">
            <Tooltip content={getMarketTooltips(selectedMarketId).tradingTerminal}>
              <div className="text-[10px] tracking-widest font-bold text-amber-700">
                BlackSlon Trading Terminal
              </div>
            </Tooltip>
            <div className={`px-2 py-0.5 rounded text-[7px] uppercase tracking-widest font-bold border ${colors.badgeBorder} ${colors.badgeText}`}>
              {selectedMarketId}
            </div>
          </div>
        </div>

        {/* Protocol alerts */}
        {isBlocked && (
          <div className="mb-2 px-2 py-1.5 border border-red-500/40 bg-red-900/10 rounded-sm">
            <div className="text-[8px] text-red-500 uppercase tracking-widest animate-pulse">
              ⛔ Tier IV Safeguard — Reduce-Only Mode Active
            </div>
            <div className="text-[7px] text-red-700 mt-0.5">
              New positions are blocked. You may only reduce existing positions.
            </div>
          </div>
        )}
        {solvencyTier === 'III' && (
          <div className="mb-2 px-2 py-1.5 border border-amber-500/40 bg-amber-900/10 rounded-sm">
            <div className="text-[8px] text-amber-500 uppercase tracking-widest">
              ⚠ Tier III — eEURO-Only Collateral Required
            </div>
            <div className="text-[7px] text-amber-700 mt-0.5">
              BSR stake disabled. New positions require 100% eEURO collateral.
            </div>
          </div>
        )}
        {emergencyLock && (
          <div className="mb-2 px-2 py-1.5 border border-red-500/40 bg-red-900/10 rounded-sm">
            <div className="text-[8px] text-red-500 uppercase tracking-widest animate-pulse">
              🔒 Emergency Collateral Lock Active
            </div>
            <div className="text-[7px] text-red-700 mt-0.5">
              €BSR collateral frozen at T-24h price. Anti-Death-Spiral rule engaged.
            </div>
          </div>
        )}

        {/* BUY / SELL */}
        <div className="flex justify-center gap-2 mb-3 shrink-0">
          <button
            onClick={() => setSide('BUY')}
            disabled={isBlocked}
            className={`flex-1 py-1.5 border font-normal uppercase tracking-widest text-[9px] transition-all duration-200 rounded-sm disabled:opacity-30 disabled:cursor-not-allowed ${
              side === 'BUY' 
                ? 'border-green-700 bg-green-700/10 text-green-700' 
                : 'border-gray-900 text-gray-500 hover:border-green-500 hover:bg-green-500/20 hover:text-green-400 hover:shadow-green-500/20'
            }`}
          >BUY</button>
          <button
            onClick={() => setSide('SELL')}
            disabled={isBlocked}
            className={`flex-1 py-1.5 border font-normal uppercase tracking-widest text-[9px] transition-all duration-200 rounded-sm disabled:opacity-30 disabled:cursor-not-allowed ${
              side === 'SELL' 
                ? 'border-red-600 bg-red-600/10 text-red-500' 
                : 'border-gray-900 text-gray-500 hover:border-red-500 hover:bg-red-500/20 hover:text-red-400 hover:shadow-red-500/20'
            }`}
          >SELL</button>
        </div>

        {/* Price */}
        <div className="border-b border-gray-900/50 pb-2 mb-2 shrink-0">
          <div className="flex items-center justify-between mb-1">
            <div className="text-[9px] text-gray-500">SET ORDER PRICE (EUR/100kWh)</div>
            <div className={`text-[7px] ${colors.title}`}>[{normalizedFloor.toFixed(2)} – {normalizedCeiling.toFixed(2)}]</div>
          </div>
          <div className="flex items-center justify-center">
            <div className={`bg-zinc-800/70 border rounded-sm flex items-center w-fit mx-auto transition-colors ${priceOutOfBSSZ ? 'border-red-600' : 'border-gray-700'}`}>
              <button onClick={() => handlePriceStep(-0.01)} className="text-sm text-gray-600 hover:text-white px-2 py-1">−</button>
              <input
                type="text"
                value={price}
                onChange={(e) => { setPrice(e.target.value); setOrderError(null) }}
                className="bg-transparent text-sm text-white tracking-tighter leading-none text-center outline-none w-16 py-1"
              />
              <button onClick={() => handlePriceStep(+0.01)} className="text-sm text-gray-600 hover:text-white px-2 py-1">+</button>
            </div>
          </div>
          {priceOutOfBSSZ && (
            <div className="text-[7px] text-red-600 text-center mt-1">
              Price outside BSSZ corridor — order will be rejected
            </div>
          )}
        </div>

        {/* Quantity */}
        <div className="border-b border-gray-900/50 pb-2 mb-3 shrink-0">
          <div className="text-[9px] text-gray-500 mb-1">
            SET QUANTITY (1 {selectedMarketId || marketId} TOKEN = 100kWh)
          </div>
          <div className="flex items-center justify-center">
            <div className="bg-zinc-800/70 border border-gray-700 rounded-sm flex items-center w-fit mx-auto">
              <button onClick={() => setQuantity(q => Math.max(1, q - 1))} className="text-sm text-gray-600 hover:text-white px-2 py-1">−</button>
              <input
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                className="bg-transparent text-sm text-white tracking-tighter leading-none text-center outline-none w-16 py-1 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              />
              <button onClick={() => setQuantity(q => q + 1)} className="text-sm text-gray-600 hover:text-white px-2 py-1">+</button>
            </div>
          </div>
                  </div>

        {/* Confirm */}
        {orderSuccess ? (
          <div className="w-full py-2 mb-4 border border-green-700 text-green-700 text-center uppercase tracking-[0.3em] text-[10px] rounded-sm animate-pulse">
            ✓ ORDER PLACED
          </div>
        ) : (
          <button
            onClick={() => handleSubmit(side)}
            disabled={isBlocked || priceOutOfBSSZ}
            className={`w-full py-2 mb-4 border uppercase tracking-[0.3em] text-[10px] transition-all duration-300 rounded-sm shrink-0 disabled:opacity-30 disabled:cursor-not-allowed ${
              side === 'BUY'
                ? 'border-green-700 text-green-700 hover:bg-green-700 hover:text-black'
                : 'border-red-600 text-red-600 hover:bg-red-600 hover:text-white'
            }`}
          >
            CONFIRM {side} ORDER
          </button>
        )}

        {orderError && (
          <div className="mb-3 px-2 py-1.5 border border-red-500/30 bg-red-900/10 rounded-sm">
            <div className="text-[7px] text-red-500 leading-relaxed">{orderError}</div>
          </div>
        )}

        {/* ── BSR/eEURO Collateral Configuration ── */}
        <div className="space-y-1 mb-2 shrink-0 px-1">
          <div className="mb-1 flex justify-start">
            <Tooltip content={getMarketTooltips(selectedMarketId).collateral}>
              <div className="text-[9px] text-gray-500 uppercase tracking-tighter">
                Collateral Configuration
              </div>
            </Tooltip>
          </div>

          {isClosingPosition ? (
            /* Closing position — fixed 0.20% fee, no ratio selector */
            <div className="px-2 py-1.5 rounded-sm border border-gray-900 text-center">
              <div className="text-[8px] text-gray-500 mb-0.5">Closing position — no deposit required</div>
              <div className="text-[9px] text-amber-700 font-bold">Fee: 0.20% (fixed)</div>
              {pendingOrder && (
                <div className="text-[7px] text-gray-500 mt-0.5">
                  {(parseFloat(price.replace(',', '.')) * quantity * CLOSING_FEE).toFixed(2)} eEURO
                </div>
              )}
            </div>
          ) : (
            <>
              {/* Tier selector — 5 discrete protocol tiers */}
              <div className="px-2 py-1.5 rounded-sm border border-gray-900">
                <div className="flex justify-between text-[9px] tracking-[0.2em] mb-2">
                  <span className="text-amber-700">€BSR RATIO</span>
                  <span className="text-amber-700">
                    {isForcedEuroOnly ? '0% (Tier III/IV override)' : `${bsrTier}%`}
                  </span>
                </div>

                {/* Discrete tier buttons */}
                <div className="flex gap-1">
                  {BSR_TIERS.map((tier) => (
                    <button
                      key={tier}
                      onClick={() => !isForcedEuroOnly && handleBsrSliderChange(tier)}
                      disabled={isForcedEuroOnly}
                      className={`flex-1 py-1 text-[7px] rounded-sm border transition-all disabled:opacity-30 disabled:cursor-not-allowed ${
                        bsrTier === tier && !isForcedEuroOnly
                          ? 'border-amber-700 bg-amber-700/20 text-amber-700'
                          : 'border-gray-800 text-gray-600 hover:border-amber-700/50 hover:text-amber-800'
                      }`}
                    >
                      {tier}%
                    </button>
                  ))}
                </div>

                {/* Fee info for selected tier */}
                <div className="mt-1.5 text-[7px] text-gray-400 text-center">
                  <span>
                    Fee: <span className="text-gray-400">{(currentTierData.fee * 100).toFixed(2)}%</span>
                    {pendingOrder && (
                      <span className="text-gray-400"> ({(parseFloat(price.replace(',', '.')) * quantity * currentTierData.fee).toFixed(2)} eEURO)</span>
                    )}
                  </span>
                </div>
              </div>

              {/* eEURO display (read-only) */}
              <div className="px-2 py-1 rounded-sm border border-gray-900">
                <div className="flex justify-between text-[9px] tracking-[0.2em]">
                  <span className="text-[#003399]">eEURO RATIO</span>
                  <span className="text-[#003399]">{euroStake}%</span>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Margin summary */}
        <div className="mt-auto border-t border-gray-900 pt-2 shrink-0">
          <div className="flex items-center justify-between gap-2">
            <div className="border border-amber-700 rounded-sm py-1 px-3 w-fit">
              <div className="text-[8px] text-amber-700 uppercase tracking-widest mb-0">€BSR Deposit</div>
              <div className="text-[11px] text-amber-700 tracking-tighter leading-tight">
                {pendingOrder ? `${pendingOrder.bsrDeposit.toFixed(2)} BSR` : '—'}
              </div>
            </div>
            <div className="text-center flex-1">
              <div className="flex justify-center">
                <Tooltip content={getMarketTooltips(selectedMarketId).requiredMargin}>
                  <div className="text-[9px] text-gray-400 uppercase tracking-tighter">REQUIRED MARGIN</div>
                </Tooltip>
              </div>
              <div className="text-sm text-gray-400 leading-none">
                {pendingOrder ? `${pendingOrder.marginPct}%` : '—'}
              </div>
            </div>
            <div className="border border-[#003399]/50 rounded-sm py-1 px-3 w-fit">
              <div className="text-[8px] text-[#003399] uppercase tracking-widest mb-0"><span className="normal-case">e</span>EURO Deposit</div>
              <div className="text-[11px] text-[#003399] tracking-tighter leading-tight">
                {pendingOrder ? `${pendingOrder.eEuroDeposit.toFixed(2)} EUR` : '—'}
              </div>
            </div>
          </div>
        </div>

        {/* Active Orders */}
        {activeOrders.length > 0 && (
          <div className="shrink-0 px-1">
            <div className="text-[9px] text-gray-500 uppercase tracking-tighter mb-1">Active Orders</div>
            <div className="space-y-1">
              {activeOrders.map((order) => (
                <div
                  key={order.id}
                  className={`px-2 py-1.5 rounded-sm border ${
                    order.side === 'BUY'
                      ? 'border-green-700/30 bg-green-900/10'
                      : 'border-red-600/30 bg-red-900/10'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <span className={`text-[8px] font-bold tracking-widest ${
                        order.side === 'BUY' ? 'text-green-700' : 'text-red-600'
                      }`}>
                        {order.side}
                      </span>
                      <span className={`text-[7px] uppercase ${
                        order.marketId.startsWith('BS-G') ? 'text-cyan-400' : 'text-yellow-600'
                      }`}>
                        {order.marketId}
                      </span>
                      <span className="text-[9px] text-gray-300">
                        {order.quantity} @ {order.price.toFixed(2)}
                      </span>
                    </div>
                    <button
                      onClick={() => cancelOrder(order.id)}
                      className="text-[7px] text-gray-400 hover:text-red-500 uppercase tracking-widest transition-colors px-1"
                    >
                      ✕ Cancel
                    </button>
                  </div>
                  <div className="flex justify-between text-[7px] text-gray-400">
                    <span>Margin: {order.marginPct}%</span>
                    <span>Locked: {order.bsrLocked.toFixed(2)} BSR + {order.eEuroLocked.toFixed(2)} EUR</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  )
}
