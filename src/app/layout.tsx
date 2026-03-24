import type { Metadata } from 'next'
import { Montserrat } from 'next/font/google'
import './globals.css'
import { Providers } from './providers'

const montserrat = Montserrat({ 
  subsets: ['latin'],
  weight: ['200', '400', '700']
})

export const metadata: Metadata = {
  title: 'BlackSlon Protocol',
  description: 'Energy Trading Terminal & Protocol Access',
  robots: 'noindex, nofollow',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={montserrat.className}>
        <Providers>
          {children}
          <footer className="w-full border-t border-gray-800 py-3 mt-8">
            <div className="flex flex-col items-center gap-1">
              <p className="text-[8px] text-gray-500 uppercase tracking-[0.25em]">
                © {new Date().getFullYear()} BlackSlon Protocol · All Rights Reserved
              </p>
              <p className="text-[8px] text-gray-500 tracking-wide">
                Contact: <a href="mailto:trading@blackslon.org" className="text-gray-400 hover:text-amber-600 transition-colors">trading@blackslon.org</a>
              </p>
            </div>
          </footer>
        </Providers>
      </body>
    </html>
  )
}
