'use client'

import Link from 'next/link'
import LogoCube from '@/components/LogoCube'

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <Link href="/markets">
        <div className="cursor-pointer transition-transform hover:scale-105">
          <LogoCube size={300} duration={24} />
        </div>
      </Link>
    </div>
  )
}