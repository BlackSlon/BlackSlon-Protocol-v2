'use client'
// src/components/TradeActivityFeed.tsx
// BlackSlon Demo — Live feed ostatnich transakcji (bot + user)

import { useEffect, useRef, useState } from 'react'
import type { TradeEvent } from '@/lib/tradingBots'

// ─── Types ───────────────────────────────────────────────────────────────────

interface TradeActivityFeedProps {
  trades: TradeEvent[]
  maxVisible?: number
  compact?: boolean   // kompaktowy tryb dla sidebar
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

const MARKET_COLORS: Record<string, string> = {
  'BS-P-DE': '#60a5fa',   // blue
  'BS-P-FR': '#a78bfa',   // purple
  'BS-P-PL': '#f59e0b',   // amber
  'BS-P-NO': '#34d399',   // emerald
  'BS-G-NL': '#f87171',   // red
  'BS-G-DE': '#fb923c',   // orange
  'BS-G-PL': '#e879f9',   // pink
  'BS-G-BG': '#94a3b8',   // slate
}

function formatTime(ts: number): string {
  const d = new Date(ts)
  return d.toLocaleTimeString('en', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false })
}

function formatPrice(p: number): string {
  return p.toFixed(3)
}

function formatVolume(v: number): string {
  if (v >= 1000) return `${(v / 1000).toFixed(1)}k`
  return `${v}`
}

// ─── Single Row ───────────────────────────────────────────────────────────────

function TradeRow({ trade, compact }: { trade: TradeEvent; compact: boolean }) {
  const color = MARKET_COLORS[trade.marketId] ?? '#94a3b8'
  const isUser = trade.isUserTrade

  return (
    <div
      className={`
        flex items-center gap-2 px-3 py-1.5 rounded-lg transition-all duration-300
        ${isUser ? 'bg-yellow-500/8 border border-yellow-500/20' : 'hover:bg-white/3'}
        ${compact ? 'text-xs' : 'text-sm'}
      `}
    >
      {/* Market badge */}
      <span
        className="font-mono font-medium flex-shrink-0"
        style={{ color, minWidth: compact ? 70 : 80 }}
      >
        {trade.marketId}
      </span>

      {/* Side */}
      <span
        className={`font-semibold flex-shrink-0 ${compact ? 'w-7' : 'w-8'} ${
          trade.side === 'BUY' ? 'text-green-400' : 'text-red-400'
        }`}
      >
        {trade.side === 'BUY' ? '▲' : '▼'}
      </span>

      {/* Price */}
      <span className="text-white/80 font-mono flex-shrink-0">
        {formatPrice(trade.price)}
      </span>

      {/* Volume */}
      {!compact && (
        <span className="text-white/40 font-mono flex-shrink-0">
          {formatVolume(trade.volume)} kWh
        </span>
      )}

      {/* User indicator */}
      {isUser && (
        <span className="ml-auto text-yellow-400/80 text-xs font-medium flex-shrink-0">
          YOU
        </span>
      )}

      {/* Time */}
      <span className={`text-white/25 font-mono text-xs flex-shrink-0 ${isUser ? '' : 'ml-auto'}`}>
        {formatTime(trade.timestamp)}
      </span>
    </div>
  )
}

// ─── Component ───────────────────────────────────────────────────────────────

export default function TradeActivityFeed({
  trades,
  maxVisible = 40,
  compact = false,
}: TradeActivityFeedProps) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const [autoScroll, setAutoScroll] = useState(true)

  // Auto-scroll gdy przychodzą nowe transakcje
  useEffect(() => {
    if (autoScroll && scrollRef.current) {
      scrollRef.current.scrollTop = 0
    }
  }, [trades.length, autoScroll])

  const visible = trades.slice(0, maxVisible)

  return (
    <div className="flex flex-col h-full">

      {/* Header */}
      <div className="flex items-center justify-between px-3 py-2 border-b border-white/5 flex-shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
          <span className="text-white/70 text-xs font-medium uppercase tracking-wide">
            Live Trades
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-white/30 text-xs">{trades.length} total</span>
          <button
            onClick={() => setAutoScroll(p => !p)}
            className={`text-xs px-2 py-0.5 rounded transition-colors ${
              autoScroll
                ? 'text-green-400 bg-green-400/10'
                : 'text-white/30 hover:text-white/60'
            }`}
          >
            {autoScroll ? '▼ live' : '⏸ paused'}
          </button>
        </div>
      </div>

      {/* Column headers */}
      {!compact && (
        <div className="flex items-center gap-2 px-3 py-1 border-b border-white/5 flex-shrink-0">
          <span className="text-white/25 text-xs" style={{ minWidth: 80 }}>Market</span>
          <span className="text-white/25 text-xs w-8">Side</span>
          <span className="text-white/25 text-xs">Price</span>
          <span className="text-white/25 text-xs">Volume</span>
          <span className="text-white/25 text-xs ml-auto">Time</span>
        </div>
      )}

      {/* Trade list */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto space-y-0.5 py-1 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-white/10"
        onMouseEnter={() => setAutoScroll(false)}
        onMouseLeave={() => setAutoScroll(true)}
      >
        {visible.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-white/20 text-xs">Waiting for trades...</p>
          </div>
        ) : (
          visible.map(trade => (
            <TradeRow key={trade.id} trade={trade} compact={compact} />
          ))
        )}
      </div>
    </div>
  )
}

// ─── Hook: useTradeHistory ────────────────────────────────────────────────────

export function useTradeHistory(maxHistory = 200) {
  const [trades, setTrades] = useState<TradeEvent[]>([])

  function addTrade(trade: TradeEvent) {
    setTrades(prev => [trade, ...prev].slice(0, maxHistory))
  }

  function addTrades(newTrades: TradeEvent[]) {
    setTrades(prev => [...newTrades, ...prev].slice(0, maxHistory))
  }

  function clearTrades() {
    setTrades([])
  }

  return { trades, addTrade, addTrades, clearTrades }
}
