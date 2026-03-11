'use client'

import { useState, useEffect } from 'react'
import { useTrading } from '@/store/blackslon'
import { getMarketData } from '@/data/markets'
import { getMarketColors } from '@/lib/marketColors'
import type { BSSZState } from '@/store/types'

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
  const colors = marketColors.isGas
    ? {
        title: 'text-blue-400',
        value: 'text-blue-500',
        label: 'text-blue-700',
        border: 'border-blue-800/30',
        pulse: 'bg-blue-700',
        isGas: true,
      }
    : {
        title: 'text-yellow-600',
        value: 'text-yellow-500',
        label: 'text-yellow-700',
        border: 'border-yellow-800/30',
        pulse: 'bg-yellow-700',
        isGas: false,
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

  useEffect(() => {
    if (selectedMarketId) {
      try {
        const marketData = getMarketData(selectedMarketId as any) as any
        if (marketData?.bsszPositions?.[0]?.bssz) {
          setBssz({
            floor: marketData.bsszPositions[0].bssz.floor,
            ceiling: marketData.bsszPositions[0].bssz.ceiling,
            isLocked: false,
            lockReason: null,
          })
        } else {
          setBssz(storeBssz)
        }
      } catch {
        setBssz(storeBssz)
      }
    } else {
      setBssz(storeBssz)
    }
  }, [selectedMarketId, storeBssz])

  const getAnchorPrice = () => {
    try {
      const md = getMarketData(selectedMarketId as any) as any
      if (md?.bsszPositions?.[0]?.bssz?.anchor) return md.bsszPositions[0].bssz.anchor.toFixed(2)
      if (md?.bsszCalculation?.anchor) return md.bsszCalculation.anchor.toFixed(2)
    } catch {}
    return '10.59'
  }

  const [price, setPrice] = useState(getAnchorPrice())
  const [quantity, setQuantity] = useState(5)
  const [side, setSide] = useState<'BUY' | 'SELL'>('BUY')

  // BSR stake — always snapped to a defined protocol tier (10/25/50/75/100)
  // Exception: Tier III/IV override to 0 (eEURO-only mandate)
  const [bsrTier, setBsrTier] = useState<BsrTier>(50)
  const [orderError, setOrderError] = useState<string | null>(null)
  const [orderSuccess, setOrderSuccess] = useState(false)

  useEffect(() => {
    setPrice(getAnchorPrice())
    setOrderError(null)
    setOrderSuccess(false)
  }, [selectedMarketId])

  // Effective BSR stake: 0 when eEURO-only mandate is active, otherwise the chosen tier
  const isForcedEuroOnly = solvencyTier === 'III' || solvencyTier === 'IV'
  const effectiveBsrStake = isForcedEuroOnly ? 0 : bsrTier
  const euroStake = 100 - effectiveBsrStake

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
      setPendingOrder(side, p, quantity, effectiveBsrStake)
    }
  }, [side, price, quantity, effectiveBsrStake])

  useEffect(() => {
    const p = parseFloat(price.replace(',', '.'))
    if (!isNaN(p) && quantity > 0) {
      setPendingOrder(side, p, quantity, effectiveBsrStake)
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
      setPendingOrder(side, p, quantity, snapped)
    }
  }

  const handleConfirm = () => {
    setOrderError(null)
    setOrderSuccess(false)
    const p = parseFloat(price.replace(',', '.'))
    if (isNaN(p) || quantity <= 0) {
      setOrderError('Invalid price or quantity')
      return
    }
    if (p < bssz.floor || p > bssz.ceiling) {
      setOrderError(`Price ${p.toFixed(2)} outside BSSZ corridor [${bssz.floor.toFixed(2)} – ${bssz.ceiling.toFixed(2)}]`)
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
  const priceOutOfBSSZ = !isNaN(priceNum) && (priceNum < bssz.floor || priceNum > bssz.ceiling)
  const isBlocked = solvencyTier === 'IV'

  // Get margin info for current effective tier
  const currentTierData = isForcedEuroOnly
    ? { marginLong: 0.50, marginShort: 1.00, fee: 0.0100 } // eEURO-only = 10% BSR tier rates
    : TIER_MATRIX[bsrTier]

  return (
    <div className="flex flex-col h-full bg-black font-mono text-white p-0">

      <div className="w-full pt-1 pb-1 flex flex-col items-center shrink-0">
        <div className="text-[10px] text-gray-500 uppercase tracking-[0.5em] font-bold">
          Order Panel
        </div>
        <div className="w-[80%] border-b border-gray-800 mt-2" />
      </div>

      <div className="flex-grow px-6 pb-6 flex flex-col min-h-0 sm:px-2">

        <div className="pt-2 pb-1 bg-gradient-to-b from-black to-gray-950 w-full">
          <div className="flex items-center justify-center gap-2">
            <div className="text-[10px] tracking-widest font-bold text-amber-700">
              BlackSlon Trading Terminal
            </div>
            <div className={`px-2 py-0.5 rounded text-[7px] uppercase tracking-widest font-bold border ${colors.border} ${colors.title}`}>
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
            className={`flex-1 py-1.5 border font-normal uppercase tracking-widest text-[9px] transition-all rounded-sm disabled:opacity-30 disabled:cursor-not-allowed ${
              side === 'BUY' ? 'border-green-700 bg-green-700/10 text-green-700' : 'border-gray-900 text-gray-700'
            }`}
          >BUY</button>
          <button
            onClick={() => setSide('SELL')}
            disabled={isBlocked}
            className={`flex-1 py-1.5 border font-normal uppercase tracking-widest text-[9px] transition-all rounded-sm disabled:opacity-30 disabled:cursor-not-allowed ${
              side === 'SELL' ? 'border-red-600 bg-red-600/10 text-red-500' : 'border-gray-900 text-gray-700'
            }`}
          >SELL</button>
        </div>

        {/* Price */}
        <div className="border-b border-gray-900/50 pb-2 mb-2 shrink-0">
          <div className="flex items-center justify-between mb-1">
            <div className="text-[9px] text-gray-500">SET ORDER PRICE (EUR/100kWh)</div>
            <div className={`text-[7px] ${colors.title}`}>[{bssz.floor.toFixed(2)} – {bssz.ceiling.toFixed(2)}]</div>
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
          {pendingOrder && (
            <div className="text-[7px] text-gray-700 text-center mt-1">
              Notional: {pendingOrder.totalNotional.toFixed(2)} EUR · Fee: {pendingOrder.tradingFee.toFixed(2)} EUR
            </div>
          )}
        </div>

        {/* Confirm */}
        {orderSuccess ? (
          <div className="w-full py-2 mb-4 border border-green-700 text-green-700 text-center uppercase tracking-[0.3em] text-[10px] rounded-sm animate-pulse">
            ✓ ORDER PLACED
          </div>
        ) : (
          <button
            onClick={handleConfirm}
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
          <div className="text-[9px] text-gray-500 uppercase tracking-tighter mb-1">
            Collateral Configuration
          </div>

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

            {/* Margin info for selected tier */}
            <div className="mt-1.5 flex justify-between text-[7px] text-gray-700">
              <span>
                Margin: <span className="text-gray-500">
                  {side === 'BUY'
                    ? `${(currentTierData.marginLong * 100).toFixed(0)}% long`
                    : `${(currentTierData.marginShort * 100).toFixed(0)}% short`}
                </span>
              </span>
              <span>
                Fee: <span className="text-gray-500">{(currentTierData.fee * 100).toFixed(2)}%</span>
              </span>
            </div>
          </div>

          {/* eEURO display (read-only) */}
          <div className="px-2 py-1 rounded-sm border border-gray-900">
            <div className="flex justify-between text-[9px] tracking-[0.2em]">
              <span className="text-sky-400">eEURO RATIO</span>
              <span className="text-sky-400">{euroStake}%</span>
            </div>
          </div>
        </div>

        {/* Margin summary */}
        <div className="mt-auto border-t border-gray-900 pt-2 shrink-0">
          <div className="text-center mb-1">
            <span className="text-[9px] text-gray-400 uppercase tracking-tighter">REQUIRED MARGIN</span>
          </div>
          <div className="text-center mb-2">
            <span className="text-sm text-gray-400 leading-none">
              {pendingOrder ? `${pendingOrder.marginPct}%` : '—'}
            </span>
          </div>
          <div className="flex flex-wrap gap-2 border-t border-gray-900/50 pt-2 pb-2">
            <div className="border border-amber-700 rounded-sm py-1 px-3 w-fit">
              <div className="text-[8px] text-amber-700 uppercase tracking-widest mb-0">€BSR Deposit</div>
              <div className="text-[11px] text-amber-700 tracking-tighter leading-tight">
                {pendingOrder ? `${pendingOrder.bsrDeposit.toFixed(2)} BSR` : '—'}
              </div>
            </div>
            <div className="border border-sky-400 rounded-sm py-1 px-3 w-fit ml-auto">
              <div className="text-[8px] text-sky-400 uppercase tracking-widest mb-0"><span className="normal-case">e</span>EURO Deposit</div>
              <div className="text-[11px] text-sky-400 tracking-tighter leading-tight">
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
                        order.marketId.startsWith('BS-G') ? 'text-blue-500' : 'text-yellow-600'
                      }`}>
                        {order.marketId}
                      </span>
                      <span className="text-[9px] text-gray-400">
                        {order.quantity} @ {order.price.toFixed(2)}
                      </span>
                    </div>
                    <button
                      onClick={() => cancelOrder(order.id)}
                      className="text-[7px] text-gray-600 hover:text-red-500 uppercase tracking-widest transition-colors px-1"
                    >
                      ✕ Cancel
                    </button>
                  </div>
                  <div className="flex justify-between text-[7px] text-gray-600">
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
