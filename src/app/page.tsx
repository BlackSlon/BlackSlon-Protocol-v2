'use client'

import Link from 'next/link'
import LogoCube from '@/components/LogoCube'

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-black flex items-center justify-center relative overflow-hidden">
      {/* ── Cosmos background ── */}
      <style>{`
        .hp-stars-sm {
          position: fixed; inset: 0; z-index: 0; pointer-events: none;
          width: 1px; height: 1px; background: transparent;
          box-shadow:
            25vw 8vh #fff, 50vw 4vh #fff, 75vw 12vh #fff, 12vw 25vh #fff, 88vw 18vh #fff,
            33vw 35vh #fff, 66vw 30vh #fff, 8vw 50vh #fff, 92vw 42vh #fff, 45vw 55vh #fff,
            18vw 65vh #fff, 72vw 60vh #fff, 55vw 72vh #fff, 30vw 80vh #fff, 85vw 75vh #fff,
            5vw 90vh #fff, 40vw 88vh #fff, 60vw 95vh #fff, 95vw 85vh #fff, 15vw 15vh #fff,
            38vw 22vh #fff, 82vw 28vh #fff, 22vw 48vh #fff, 68vw 45vh #fff, 48vw 38vh #fff,
            10vw 72vh #fff, 78vw 82vh #fff, 52vw 18vh #fff, 35vw 58vh #fff, 90vw 62vh #fff,
            3vw 35vh #fff, 97vw 55vh #fff, 42vw 72vh #fff, 58vw 8vh #fff, 28vw 92vh #fff,
            65vw 15vh #fff, 15vw 42vh #fff, 80vw 48vh #fff, 45vw 25vh #fff, 70vw 88vh #fff,
            20vw 5vh #fff, 55vw 45vh #fff, 32vw 68vh #fff, 88vw 35vh #fff, 8vw 82vh #fff,
            62vw 52vh #fff, 25vw 75vh #fff, 75vw 5vh #fff, 50vw 85vh #fff, 38vw 48vh #fff;
        }
        .hp-stars-md {
          position: fixed; inset: 0; z-index: 0; pointer-events: none;
          width: 2px; height: 2px; border-radius: 50%; background: #fff;
          box-shadow:
            20vw 10vh #fff, 60vw 5vh #fff, 85vw 20vh #fff, 10vw 40vh #fff, 45vw 15vh #fff,
            70vw 35vh #fff, 30vw 55vh #fff, 90vw 50vh #fff, 15vw 70vh #fff, 55vw 65vh #fff,
            40vw 85vh #fff, 80vw 72vh #fff, 5vw 60vh #fff, 65vw 80vh #fff, 35vw 30vh #fff,
            95vw 15vh #fff, 22vw 85vh #fff, 50vw 42vh #fff, 75vw 55vh #fff, 12vw 22vh #fff;
          animation: hp-twinkle1 3s ease-in-out infinite alternate;
        }
        .hp-stars-lg {
          position: fixed; inset: 0; z-index: 0; pointer-events: none;
          width: 3px; height: 3px; border-radius: 50%; background: #fff;
          box-shadow:
            15vw 8vh 1px #fff, 42vw 20vh 1px rgba(200,220,255,0.9), 78vw 12vh 1px #fff,
            55vw 35vh 1px rgba(255,240,200,0.9), 25vw 60vh 1px #fff, 88vw 45vh 1px rgba(200,220,255,0.9),
            35vw 78vh 1px #fff, 68vw 65vh 1px rgba(255,240,200,0.9), 8vw 88vh 1px #fff,
            92vw 75vh 1px rgba(200,220,255,0.9);
          animation: hp-twinkle2 5s ease-in-out infinite alternate;
        }
        @keyframes hp-twinkle1 {
          0% { opacity: 0.6; } 100% { opacity: 1; }
        }
        @keyframes hp-twinkle2 {
          0% { opacity: 0.5; } 50% { opacity: 1; } 100% { opacity: 0.7; }
        }
        .hp-moon {
          position: fixed; z-index: 0; pointer-events: none;
          top: 8%; right: 10%;
          width: 22px; height: 22px; border-radius: 50%; opacity: 0.35;
          background: radial-gradient(circle at 35% 40%, #e8e4d4 0%, #c4bca8 50%, #908878 100%);
          box-shadow: 0 0 8px 2px rgba(220,215,200,0.1), inset -3px -2px 5px rgba(100,95,80,0.5);
        }
        .hp-moon::after {
          content: ''; position: absolute; border-radius: 50%;
          top: 5px; left: 4px; width: 3px; height: 3px;
          background: rgba(140,130,115,0.35);
          box-shadow: 7px 3px 0 2px rgba(130,120,105,0.25), 3px 8px 0 1.5px rgba(120,112,100,0.2);
        }
        .hp-mars {
          position: fixed; z-index: 0; pointer-events: none;
          bottom: 18%; left: 6%;
          width: 10px; height: 10px; border-radius: 50%; opacity: 0.4;
          background: radial-gradient(circle at 40% 35%, #d08858 0%, #a05830 60%, #703018 100%);
          box-shadow: 0 0 6px 1px rgba(180,80,40,0.15), inset -2px -1px 3px rgba(50,15,5,0.4);
        }
        .hp-saturn {
          position: fixed; z-index: 0; pointer-events: none;
          top: 25%; left: 4%;
          width: 14px; height: 14px; border-radius: 50%; opacity: 0.3;
          background: radial-gradient(circle at 38% 38%, #e8d8a8 0%, #c4a860 50%, #886830 100%);
          box-shadow: 0 0 5px 1px rgba(200,170,100,0.1), inset -2px -1px 3px rgba(80,50,20,0.4);
        }
        .hp-saturn::after {
          content: ''; position: absolute;
          top: 5px; left: -5px; width: 24px; height: 6px;
          border: 1px solid rgba(200,180,120,0.25);
          border-radius: 50%;
          transform: rotate(-15deg);
        }
      `}</style>
      <div className="hp-stars-sm" />
      <div className="hp-stars-md" />
      <div className="hp-stars-lg" />
      <div className="hp-moon" />
      <div className="hp-mars" />
      <div className="hp-saturn" />

      <div className="relative z-10">
        <Link href="/profile">
          <div className="cursor-pointer transition-transform hover:scale-105">
            <LogoCube size={300} duration={24} />
          </div>
        </Link>
      </div>
    </div>
  )
}