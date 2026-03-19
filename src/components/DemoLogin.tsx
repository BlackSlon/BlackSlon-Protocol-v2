'use client'
// src/components/DemoLogin.tsx
// BlackSlon Demo — Modal logowania + inicjalizacja 1000 €BSR

import { useState, useEffect } from 'react'

// ─── Types ───────────────────────────────────────────────────────────────────

interface DemoUser {
  walletAddress: string
  bsrBalance: number
  eEuroBalance: number
  loginTime: number
}

interface DemoLoginProps {
  onLogin: (user: DemoUser) => void
  onReset: () => void
  isLoggedIn: boolean
  currentUser?: DemoUser
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function generateWalletAddress(): string {
  const chars = '0123456789abcdef'
  let addr = '0x'
  for (let i = 0; i < 40; i++) {
    addr += chars[Math.floor(Math.random() * chars.length)]
  }
  return addr
}

function shortenAddress(addr: string): string {
  return `${addr.slice(0, 6)}...${addr.slice(-4)}`
}

const STORAGE_KEY = 'blackslon_demo_user'

function saveToStorage(user: DemoUser) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(user))
  } catch {}
}

function loadFromStorage(): DemoUser | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

function clearStorage() {
  try {
    localStorage.removeItem(STORAGE_KEY)
  } catch {}
}

// ─── Component ───────────────────────────────────────────────────────────────

export default function DemoLogin({
  onLogin,
  onReset,
  isLoggedIn,
  currentUser,
}: DemoLoginProps) {
  const [showModal, setShowModal] = useState(false)
  const [showWelcome, setShowWelcome] = useState(false)
  const [step, setStep] = useState<'choose' | 'connecting' | 'done'>('choose')

  // Przy montowaniu sprawdź czy user już zalogowany w storage
  useEffect(() => {
    const stored = loadFromStorage()
    if (stored && !isLoggedIn) {
      onLogin(stored)
    }
  }, [])

  // ── Handlers ──────────────────────────────────────────────────────────────

  function handleDemoLogin() {
    setStep('connecting')

    // Symuluj "łączenie z portfelem" — 1.5s delay
    setTimeout(() => {
      const user: DemoUser = {
        walletAddress: generateWalletAddress(),
        bsrBalance: 1000,
        eEuroBalance: 0,
        loginTime: Date.now(),
      }
      saveToStorage(user)
      onLogin(user)
      setStep('done')
      setShowModal(false)
      setShowWelcome(true)

      // Ukryj welcome po 4s
      setTimeout(() => setShowWelcome(false), 4000)
    }, 1500)
  }

  function handleReset() {
    clearStorage()
    onReset()
    setStep('choose')
    setShowWelcome(false)
  }

  // ── Render: Not logged in ─────────────────────────────────────────────────

  if (!isLoggedIn) {
    return (
      <>
        {/* Connect button */}
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-yellow-500 hover:bg-yellow-400 text-black font-semibold text-sm rounded-lg transition-all duration-200 shadow-lg shadow-yellow-500/20"
        >
          <span className="text-base">⚡</span>
          Connect Demo Wallet
        </button>

        {/* Modal */}
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
            <div className="relative w-full max-w-md mx-4 bg-[#0f1117] border border-white/10 rounded-2xl shadow-2xl overflow-hidden">

              {/* Header */}
              <div className="px-6 pt-6 pb-4 border-b border-white/5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-yellow-500/10 rounded-lg flex items-center justify-center">
                      <span className="text-yellow-400 text-lg">◆</span>
                    </div>
                    <span className="text-white font-semibold text-lg">BlackSlon Protocol</span>
                  </div>
                  <button
                    onClick={() => setShowModal(false)}
                    className="text-white/40 hover:text-white/80 text-xl transition-colors"
                  >
                    ×
                  </button>
                </div>
                <p className="text-white/50 text-sm mt-3">
                  Connect a wallet to start trading on the demo network
                </p>
              </div>

              {/* Body */}
              <div className="px-6 py-5 space-y-3">

                {step === 'connecting' ? (
                  <div className="flex flex-col items-center py-8 gap-4">
                    <div className="w-10 h-10 border-2 border-yellow-400 border-t-transparent rounded-full animate-spin" />
                    <p className="text-white/60 text-sm">Initializing demo wallet...</p>
                  </div>
                ) : (
                  <>
                    {/* Demo mode option */}
                    <button
                      onClick={handleDemoLogin}
                      className="w-full flex items-center gap-4 px-4 py-4 bg-yellow-500/10 hover:bg-yellow-500/20 border border-yellow-500/30 hover:border-yellow-500/60 rounded-xl transition-all duration-200 group"
                    >
                      <div className="w-10 h-10 bg-yellow-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                        <span className="text-yellow-400 text-xl">⚡</span>
                      </div>
                      <div className="text-left flex-1">
                        <div className="text-white font-medium text-sm group-hover:text-yellow-300 transition-colors">
                          Demo Mode
                        </div>
                        <div className="text-white/40 text-xs mt-0.5">
                          Instant access · 1,000 €BSR funded · No real assets
                        </div>
                      </div>
                      <span className="text-yellow-500/60 group-hover:text-yellow-400 transition-colors">→</span>
                    </button>

                    {/* MetaMask placeholder */}
                    <button
                      disabled
                      className="w-full flex items-center gap-4 px-4 py-4 bg-white/3 border border-white/8 rounded-xl opacity-40 cursor-not-allowed"
                    >
                      <div className="w-10 h-10 bg-orange-500/10 rounded-lg flex items-center justify-center flex-shrink-0">
                        <span className="text-xl">🦊</span>
                      </div>
                      <div className="text-left flex-1">
                        <div className="text-white font-medium text-sm">MetaMask</div>
                        <div className="text-white/40 text-xs mt-0.5">Mainnet launch — coming soon</div>
                      </div>
                    </button>

                    {/* WalletConnect placeholder */}
                    <button
                      disabled
                      className="w-full flex items-center gap-4 px-4 py-4 bg-white/3 border border-white/8 rounded-xl opacity-40 cursor-not-allowed"
                    >
                      <div className="w-10 h-10 bg-blue-500/10 rounded-lg flex items-center justify-center flex-shrink-0">
                        <span className="text-xl">🔗</span>
                      </div>
                      <div className="text-left flex-1">
                        <div className="text-white font-medium text-sm">WalletConnect</div>
                        <div className="text-white/40 text-xs mt-0.5">Mainnet launch — coming soon</div>
                      </div>
                    </button>
                  </>
                )}
              </div>

              {/* Footer */}
              <div className="px-6 pb-5">
                <p className="text-white/25 text-xs text-center">
                  Demo trades use simulated €BSR. No real funds at risk.
                </p>
              </div>
            </div>
          </div>
        )}
      </>
    )
  }

  // ── Render: Logged in ─────────────────────────────────────────────────────

  return (
    <>
      {/* Welcome banner */}
      {showWelcome && (
        <div className="fixed top-4 right-4 z-50 flex items-center gap-3 px-5 py-3 bg-green-500/10 border border-green-500/30 rounded-xl backdrop-blur-sm shadow-xl animate-fade-in">
          <span className="text-green-400 text-lg">✓</span>
          <div>
            <div className="text-green-300 font-medium text-sm">Demo wallet connected</div>
            <div className="text-white/50 text-xs">1,000 €BSR funded — start trading</div>
          </div>
        </div>
      )}

      {/* User pill in header */}
      <div className="flex items-center gap-2">
        {/* Balance badge */}
        <div className="flex items-center gap-1.5 px-3 py-1.5 bg-yellow-500/8 border border-yellow-500/20 rounded-lg">
          <span className="text-yellow-400 text-xs font-mono">€BSR</span>
          <span className="text-yellow-300 text-xs font-semibold">
            {currentUser?.bsrBalance.toLocaleString('en', { maximumFractionDigits: 2 })}
          </span>
        </div>

        {/* Wallet address */}
        <div className="flex items-center gap-2 px-3 py-1.5 bg-white/4 border border-white/8 rounded-lg">
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
          <span className="text-white/60 text-xs font-mono">
            {currentUser ? shortenAddress(currentUser.walletAddress) : '—'}
          </span>
        </div>

        {/* Reset button */}
        <button
          onClick={handleReset}
          title="Reset demo — restore 1,000 €BSR"
          className="px-3 py-1.5 bg-white/4 hover:bg-red-500/10 border border-white/8 hover:border-red-500/30 rounded-lg text-white/40 hover:text-red-400 text-xs transition-all duration-200"
        >
          Reset
        </button>
      </div>
    </>
  )
}

// ─── Hook: useDemoUser ────────────────────────────────────────────────────────
// Wygodny hook do użycia w page.tsx

export function useDemoUser() {
  const [user, setUser] = useState<DemoUser | null>(null)

  function login(u: DemoUser) {
    setUser(u)
  }

  function reset() {
    setUser(null)
  }

  function updateBalance(bsrDelta: number, eEuroDelta: number) {
    setUser(prev => {
      if (!prev) return prev
      const updated = {
        ...prev,
        bsrBalance: Math.max(0, prev.bsrBalance + bsrDelta),
        eEuroBalance: Math.max(0, prev.eEuroBalance + eEuroDelta),
      }
      saveToStorage(updated)
      return updated
    })
  }

  return { user, isLoggedIn: !!user, login, reset, updateBalance }
}
