'use client'

import React, { useState, useEffect } from "react"
import PhysicalMarketPanel from "@/components/PhysicalMarketPanel"
import VirtualMarketPanel from "@/components/VirtualMarketPanel"
import TradingPanel from "@/components/TradingPanel"
import UserAccountPanel from "@/components/UserAccountPanel"
import DealConfirmationOverlay from "@/components/DealConfirmationOverlay"
import AIAdvisor from "@/components/AIAdvisor"
import type { ProfileId } from "@/components/AIAdvisor"
import { useParams, useRouter, useSearchParams } from 'next/navigation'
import Image from 'next/image'
import { getMarketColors } from '@/lib/marketColors'
import { useDemoMode } from '@/hooks/useDemoMode'
import { useBotTrading } from '@/hooks/useBotTrading'

const activeMarkets = [
  { id: 'BS-P-DE', name: 'BlackSlon Power — Germany' },
  { id: 'BS-P-NO', name: 'BlackSlon Power — Nordic' },
  { id: 'BS-P-PL', name: 'BlackSlon Power — Poland' },
  { id: 'BS-P-UK', name: 'BlackSlon Power — United Kingdom' },
  { id: 'BS-G-NL', name: 'BlackSlon Gas — Netherlands' },
  { id: 'BS-G-DE', name: 'BlackSlon Gas — Germany' },
  { id: 'BS-G-PL', name: 'BlackSlon Gas — Poland' },
  { id: 'BS-G-BG', name: 'BlackSlon Gas — Bulgaria' },
]
const dormantMarkets = [
  { id: 'BS-P-FR', name: 'BlackSlon Power — France' },
  { id: 'BS-P-IT', name: 'BlackSlon Power — Italy' },
  { id: 'BS-P-ES', name: 'BlackSlon Power — Spain' },
  { id: 'BS-P-TR', name: 'BlackSlon Power — Turkey' },
  { id: 'BS-G-UK', name: 'BlackSlon Gas — United Kingdom' },
  { id: 'BS-G-IT', name: 'BlackSlon Gas — Italy' },
  { id: 'BS-G-NO', name: 'BlackSlon Gas — Norway' },
  { id: 'BS-G-AT', name: 'BlackSlon Gas — Austria' },
  { id: 'BS-G-BL', name: 'BlackSlon Gas — Baltic' },
]

export default function MarketPage() {
  const params = useParams()
  const router = useRouter()
  const searchParams = useSearchParams()
  const id = params?.id as string
  const [selectedInstrument, setSelectedInstrument] = useState(id || 'BS-P-PL')
  const mColors = getMarketColors(selectedInstrument)
  const [aiOpen, setAiOpen] = useState(false)

  // Resolve profile from URL ?profile= or localStorage
  const profileParam = searchParams.get('profile')
  const [profileId, setProfileId] = useState<ProfileId | null>(null)
  useEffect(() => {
    if (profileParam) {
      setProfileId(profileParam as ProfileId)
    } else if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('bs_profile')
      if (stored) setProfileId(stored as ProfileId)
    }
  }, [profileParam])

  // Bot trading — simulates market activity
  useBotTrading(selectedInstrument)

  // Synchronizuj wybrany instrument z URL przy każdej zmianie trasy
  useEffect(() => {
    if (id && selectedInstrument !== id) {
      setSelectedInstrument(id)
    }
  }, [id, selectedInstrument])

  const PanelLogo = () => {
    let logoSrc = "/BS_image.jpg"
    if (mColors.isGas) {
      logoSrc = "/BSblue_image.png"
    } else {
      logoSrc = "/BSyellow_image.png"
    }
    
    return (
      <Image src={logoSrc} alt="BlackSlon" width={50} height={50} className="h-10 w-auto opacity-80" />
    )
  }

  const AmberLogo = () => (
    <Image src="/BSamber_image.png" alt="BlackSlon" width={50} height={50} className="h-10 w-auto opacity-80" />
  )

  const MainLogo = () => (
    <Image src="/BS_image.jpg" alt="BlackSlon" width={50} height={50} className="h-10 w-auto opacity-80" />
  )

  const GrayLogo = () => (
    <Image src="/BSgray_image.png" alt="BlackSlon" width={50} height={50} className="h-10 w-auto opacity-80" />
  )

  return (
    <main className="min-h-screen bg-black text-white flex flex-col items-center font-mono pointer-events-auto">

      {/* INSTRUMENT SELECTOR BAR */}
      <div className="w-full max-w-[1600px] mx-auto px-4 py-1.5 flex items-center gap-4 border-b border-gray-900">
        <span className="text-[9px] text-gray-600 uppercase tracking-widest shrink-0">Market:</span>
        <div className="flex gap-1.5 flex-wrap">
          {activeMarkets.map(inst => {
            const ic = getMarketColors(inst.id)
            const isActive = selectedInstrument === inst.id
            return (
              <button
                key={inst.id}
                onClick={() => {
                  setSelectedInstrument(inst.id)
                  router.push(`/markets/${inst.id}`)
                }}
                className={`text-[9px] uppercase tracking-widest px-2 py-0.5 rounded-sm border transition-all ${
                  ic.isGas
                    ? isActive
                      ? 'border-cyan-300 bg-cyan-400 text-black shadow-[0_0_12px_rgba(34,211,238,0.38)]'
                      : 'border-cyan-400/50 bg-cyan-400/5 text-cyan-400 hover:border-cyan-300 hover:bg-cyan-400/10 hover:text-cyan-300'
                    : isActive
                      ? 'border-yellow-300 bg-yellow-500 text-black shadow-[0_0_12px_rgba(234,179,8,0.34)]'
                      : 'border-yellow-500/50 bg-yellow-500/5 text-yellow-400 hover:border-yellow-400 hover:bg-yellow-500/10 hover:text-yellow-300'
                }`}
                title={inst.name}
              >
                {inst.id}
              </button>
            )
          })}
        </div>
        <div className="flex items-center gap-3 ml-auto shrink-0">
          {profileId && (
            <button
              onClick={() => setAiOpen(prev => !prev)}
              className={`text-[9px] uppercase tracking-widest px-2.5 py-0.5 border transition-all ${
                aiOpen
                  ? 'border-yellow-400 bg-yellow-500 text-black'
                  : 'border-yellow-500/40 text-yellow-500 hover:border-yellow-400 hover:bg-yellow-500/10'
              }`}
            >
              {aiOpen ? '✕ AI' : '⚡ AI Advisor'}
            </button>
          )}
          <div className="w-1.5 h-1.5 rounded-full bg-green-700 animate-pulse"></div>
          <span className="text-[10px] text-green-700 uppercase tracking-widest font-black">LIVE</span>
        </div>
      </div>

      <div className="w-full max-w-[1600px] mx-auto px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-[22%_26%_20%_28%] gap-4 items-start py-2 pointer-events-auto">
        
        {/* PANEL 1: PHYSICAL (BSTZ) — mobile: order-4 (last), desktop: order-1 */}
        <section className={`border ${mColors.isGas ? 'border-blue-500/30' : 'border-yellow-600/30'} bg-black/40 rounded-sm overflow-hidden flex flex-col order-4 lg:order-1`}>
          <div className="flex items-center justify-center px-3 py-3 border-b border-gray-900/60">
            <PanelLogo />
          </div>
          <PhysicalMarketPanel selectedMarketId={selectedInstrument} />
        </section>

        {/* PANEL 2: VIRTUAL (Order Book) — mobile: order-1 (first), desktop: order-2 */}
        <section className={`border ${mColors.isGas ? 'border-blue-500/30' : 'border-yellow-600/30'} bg-black/40 rounded-sm flex flex-col order-1 lg:order-2`}>
          <div className="flex items-center justify-center px-3 py-3 border-b border-gray-900/60">
            <PanelLogo />
          </div>
          <VirtualMarketPanel selectedMarketId={selectedInstrument} />
        </section>

        {/* PANEL 3: TRADING — mobile: order-2, desktop: order-3 */}
        <section className={`border ${mColors.isGas ? 'border-blue-500/30' : 'border-yellow-600/30'} bg-black/80 rounded-sm text-xs relative z-50 flex flex-col order-2 lg:order-3`}>
          <div className="flex items-center justify-center px-3 py-3 border-b border-gray-900/60">
            <PanelLogo />
          </div>
          <TradingPanel selectedMarketId={selectedInstrument} />
        </section>

        {/* PANEL 4: PORTFOLIO — mobile: order-3, desktop: order-4 */}
        <section className="border border-amber-700/30 bg-black/40 rounded-sm text-xs flex flex-col order-3 lg:order-4">
          <div className="flex items-center justify-center px-3 py-3 border-b border-gray-900/60">
            <MainLogo />
          </div>
          <UserAccountPanel />
        </section>

      </div>

      {/* AI Advisor floating panel */}
      {aiOpen && profileId && (
        <div className="fixed top-0 right-0 w-[420px] h-full z-[100] border-l border-gray-900 shadow-2xl shadow-black/80">
          <AIAdvisor profileId={profileId} onClose={() => setAiOpen(false)} mode="panel" />
        </div>
      )}

      {/* Deal Confirmation Overlay */}
      <DealConfirmationOverlay />
    </main>
  )
}