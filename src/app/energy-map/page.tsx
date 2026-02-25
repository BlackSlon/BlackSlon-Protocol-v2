'use client'

import EuropeEnergyMap from '@/components/EuropeEnergyMap'

export default function EnergyMapPage() {
  return (
    <div className="bg-slate-950 min-h-screen flex flex-col items-center">
      <header className="text-center mt-10 mb-8">
        <h1 className="text-3xl font-bold tracking-widest text-slate-200 uppercase">
          ENERGY MAP OF EUROPE
        </h1>
      </header>
      
      <main className="w-full max-w-6xl flex-1">
        <EuropeEnergyMap />
      </main>
    </div>
  )
}
