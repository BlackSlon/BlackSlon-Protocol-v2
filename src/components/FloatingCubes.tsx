'use client'

import React from 'react'

const CUBES = [
  { size: 64,  left: '3%',  top: '6%',  dur: 18, delay: 0,   rx: 25,  ry: 45,  rz: 10  },
  { size: 84,  left: '76%', top: '4%',  dur: 22, delay: 3,   rx: -15, ry: 20,  rz: -25 },
  { size: 48,  left: '10%', top: '52%', dur: 15, delay: 6,   rx: 40,  ry: -30, rz: 15  },
  { size: 72,  left: '87%', top: '33%', dur: 20, delay: 1,   rx: -30, ry: 60,  rz: 5   },
  { size: 52,  left: '53%', top: '10%', dur: 25, delay: 8,   rx: 60,  ry: 15,  rz: -40 },
  { size: 60,  left: '90%', top: '62%', dur: 17, delay: 4,   rx: -45, ry: 30,  rz: 20  },
  { size: 42,  left: '26%', top: '72%', dur: 23, delay: 2,   rx: 20,  ry: -45, rz: -10 },
  { size: 78,  left: '63%', top: '48%', dur: 19, delay: 7,   rx: -10, ry: 70,  rz: 30  },
  { size: 38,  left: '42%', top: '80%', dur: 21, delay: 5,   rx: 35,  ry: -60, rz: 45  },
  { size: 56,  left: '18%', top: '20%', dur: 16, delay: 9,   rx: -55, ry: 25,  rz: -15 },
]

const FACE_LABELS = ['kWh', 'MWh', '€BSR', 'BS', 'kWh', 'MWh']

function Cube({ size, left, top, dur, delay, rx, ry, rz }: typeof CUBES[0]) {
  const h = size / 2

  const faceBase: React.CSSProperties = {
    position: 'absolute',
    width: size,
    height: size,
    border: '1px solid rgba(139,92,246,0.35)',
    background: 'rgba(67,20,180,0.07)',
    backdropFilter: 'blur(4px)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'rgba(167,139,250,0.85)',
    fontSize: size * 0.18,
    fontWeight: 700,
    letterSpacing: '0.05em',
    userSelect: 'none',
  }

  const faces: [React.CSSProperties, string][] = [
    [{ ...faceBase, transform: `translateZ(${h}px)` },              FACE_LABELS[0]],
    [{ ...faceBase, transform: `rotateY(180deg) translateZ(${h}px)` }, FACE_LABELS[1]],
    [{ ...faceBase, transform: `rotateY(90deg)  translateZ(${h}px)` }, FACE_LABELS[2]],
    [{ ...faceBase, transform: `rotateY(-90deg) translateZ(${h}px)` }, FACE_LABELS[3]],
    [{ ...faceBase, transform: `rotateX(90deg)  translateZ(${h}px)` }, FACE_LABELS[4]],
    [{ ...faceBase, transform: `rotateX(-90deg) translateZ(${h}px)` }, FACE_LABELS[5]],
  ]

  return (
    <div
      style={{
        position: 'absolute',
        left,
        top,
        width: size,
        height: size,
        perspective: 800,
        zIndex: 0,
        pointerEvents: 'none',
      }}
    >
      <div
        style={{
          width: size,
          height: size,
          transformStyle: 'preserve-3d',
          animation: `bs-float ${dur}s ease-in-out ${delay}s infinite, bs-spin ${dur * 2.2}s linear ${delay}s infinite`,
          transform: `rotateX(${rx}deg) rotateY(${ry}deg) rotateZ(${rz}deg)`,
        }}
      >
        {faces.map(([style, label], i) => (
          <div key={i} style={style}>{label}</div>
        ))}
      </div>
    </div>
  )
}

export default function FloatingCubes() {
  return (
    <>
      <style>{`
        @keyframes bs-float {
          0%, 100% { transform: translateY(0px) rotateX(var(--rx,0deg)) rotateY(var(--ry,0deg)); }
          33%       { transform: translateY(-18px) rotateX(var(--rx,0deg)) rotateY(var(--ry,0deg)); }
          66%       { transform: translateY(10px) rotateX(var(--rx,0deg)) rotateY(var(--ry,0deg)); }
        }
        @keyframes bs-spin {
          from { transform: rotateX(0deg) rotateY(0deg) rotateZ(0deg); }
          to   { transform: rotateX(360deg) rotateY(360deg) rotateZ(180deg); }
        }
      `}</style>
      <div
        className="fixed inset-0 overflow-hidden pointer-events-none"
        style={{ zIndex: 0 }}
        aria-hidden="true"
      >
        {CUBES.map((c, i) => (
          <Cube key={i} {...c} />
        ))}
      </div>
    </>
  )
}
