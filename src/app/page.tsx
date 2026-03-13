'use client'

import Link from 'next/link'
import Image from 'next/image'

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <Link href="/markets">
        <div className="cursor-pointer transition-transform hover:scale-105">
          <Image
            src="/BS_image.jpg"
            alt="BlackSlon"
            width={400}
            height={400}
            className="object-contain"
          />
        </div>
      </Link>
    </div>
  )
}