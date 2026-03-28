'use client'

import React, { useState, useCallback } from 'react'

interface MarketCubeProps {
  marketId: string
  marketName: string
  type: 'Power' | 'Gas'
  size?: number
  direction?: 'left' | 'down'
  duration?: number
}

// Single-axis rotation keyframes
const SPIN_LEFT = (n: string) => `@keyframes ${n} {
  0%   { transform: rotateY(0deg); }
  100% { transform: rotateY(-360deg); }
}`
const SPIN_DOWN = (n: string) => `@keyframes ${n} {
  0%   { transform: rotateX(0deg); }
  100% { transform: rotateX(-360deg); }
}`

export default function MarketCube({ marketId, marketName, type, size = 120, direction = 'left', duration = 20 }: MarketCubeProps) {
  const [phase, setPhase] = useState(0)
  const handleAnimEnd = useCallback(() => setPhase(p => p + 1), [])

  // Alternate direction each phase
  const isLeftPhase = direction === 'left' ? phase % 2 === 0 : phase % 2 !== 0
  const phaseDuration = duration / 2

  const h = size / 2
  const country = marketName.split(' ')[0]
  const isPower = type === 'Power'
  const logoSrc = isPower ? '/BSyellow_image.png' : '/BSblue_image.png'

  const symbol = marketId.toUpperCase()

  const faces = [
    'LOGO',
    type,
    country,
    'BlackSlon',
    symbol,
    'Token',
  ]
  const borderColor   = isPower ? 'rgba(251,191,36,0.55)'  : 'rgba(34,211,238,0.55)'
  const bgColor       = isPower ? 'rgba(180,120,0,0.08)'    : 'rgba(6,120,180,0.08)'
  const textColor     = isPower ? 'rgba(253,224,71,0.95)'   : 'rgba(103,232,249,0.95)'
  const glowColor     = isPower ? 'rgba(251,191,36,0.12)'   : 'rgba(34,211,238,0.12)'

  const leftAnimName = `mc-left-${marketId.replace(/-/g, '')}`
  const downAnimName = `mc-down-${marketId.replace(/-/g, '')}`
  const currentAnimName = isLeftPhase ? leftAnimName : downAnimName

  const faceSize = size + 2
  const faceOffset = -1

  const faceBase: React.CSSProperties = {
    position: 'absolute',
    width: faceSize,
    height: faceSize,
    top: faceOffset,
    left: faceOffset,
    border: `1px solid ${borderColor}`,
    background: isPower ? 'rgba(180,120,0,0.04)' : 'rgba(6,120,180,0.04)',
    boxShadow: `inset 0 0 8px ${glowColor}`,
    backdropFilter: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: textColor,
    fontSize: size * 0.145,
    fontWeight: 100,
    fontFamily: 'var(--font-raleway), sans-serif',
    letterSpacing: '0.04em',
    textAlign: 'center',
    padding: 4,
    userSelect: 'none',
    lineHeight: 1.2,
    overflow: 'hidden',
    willChange: 'transform',
    backfaceVisibility: 'hidden',
    WebkitBackfaceVisibility: 'hidden',
  } as React.CSSProperties

  const logoFaceStyle: React.CSSProperties = {
    position: 'absolute',
    width: faceSize,
    height: faceSize,
    top: faceOffset,
    left: faceOffset,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 0,
    overflow: 'hidden',
    border: `1px solid ${borderColor}`,
    background: 'transparent',
    willChange: 'transform',
    backfaceVisibility: 'hidden',
    WebkitBackfaceVisibility: 'hidden',
  }

  const faceTransforms = [
    `translateZ(${h}px)`,
    isLeftPhase ? `rotateY(180deg) translateZ(${h}px)` : `rotateX(180deg) translateZ(${h}px)`,
    `rotateY(90deg) translateZ(${h}px)`,
    `rotateY(-90deg) translateZ(${h}px)`,
    `rotateX(90deg) translateZ(${h}px)`,
    `rotateX(-90deg) translateZ(${h}px)`,
  ]

  const labelOrientations = isLeftPhase ? ['', 'rotateY(180deg)'] : ['', 'rotateX(180deg)']

  const electricAnim = `mc-zap-${marketId.replace(/-/g, '')}`
  const gasAnim = `mc-vapor-${marketId.replace(/-/g, '')}`

  return (
    <>
      <style>{`
        ${SPIN_LEFT(leftAnimName)}
        ${SPIN_DOWN(downAnimName)}
        @keyframes ${electricAnim} {
          0%   { opacity: 0;   text-shadow: 0 0 0px rgba(253,224,71,0); }
          7%   { opacity: 0;   text-shadow: 0 0 0px rgba(253,224,71,0); }
          9%   { opacity: 1;   text-shadow: 0 0 20px #fff, 0 0 40px rgba(253,224,71,1), 0 0 80px rgba(251,191,36,0.7), 0 0 120px rgba(251,191,36,0.3); }
          12%  { opacity: 0.85; text-shadow: 0 0 3px rgba(253,224,71,0.6), 5px -3px 3px rgba(253,224,71,0.8), -4px 2px 2px rgba(251,191,36,0.5); }
          18%  { opacity: 1;   text-shadow: 0 0 4px #fff, 8px -4px 4px rgba(253,224,71,1), -3px 5px 3px rgba(253,224,71,0.7), 0 0 12px rgba(251,191,36,0.4); }
          20%  { opacity: 0.6; text-shadow: 0 0 1px rgba(253,224,71,0.2); }
          28%  { opacity: 0.8; text-shadow: 0 0 2px rgba(253,224,71,0.4), -3px 2px 2px rgba(253,224,71,0.5); }
          30%  { opacity: 1;   text-shadow: 0 0 30px #fff, 0 0 60px rgba(253,224,71,1), -10px 5px 8px rgba(253,224,71,0.9), 12px -6px 10px rgba(251,191,36,0.8), 0 0 100px rgba(251,191,36,0.4); }
          32%  { opacity: 0.5; text-shadow: 0 0 1px rgba(253,224,71,0.1); }
          45%  { opacity: 0.85; text-shadow: 0 0 2px rgba(253,224,71,0.5), 4px 3px 2px rgba(253,224,71,0.6); }
          47%  { opacity: 1;   text-shadow: 0 0 5px #fff, -6px -4px 4px rgba(253,224,71,0.9), 7px 2px 3px rgba(253,224,71,0.7), 0 0 15px rgba(251,191,36,0.5); }
          49%  { opacity: 0.65; text-shadow: 0 0 1px rgba(253,224,71,0.2); }
          62%  { opacity: 0.8; text-shadow: 0 0 2px rgba(253,224,71,0.4), 3px -2px 2px rgba(253,224,71,0.5); }
          64%  { opacity: 1;   text-shadow: 0 0 25px #fff, 0 0 50px rgba(253,224,71,1), 8px -8px 6px rgba(253,224,71,0.9), -10px 4px 8px rgba(251,191,36,0.7), 0 0 90px rgba(251,191,36,0.3); }
          66%  { opacity: 0.55; text-shadow: 0 0 1px rgba(253,224,71,0.15); }
          74%  { opacity: 1;   text-shadow: 0 0 20px #fff, 0 0 40px rgba(253,224,71,1), 0 0 80px rgba(251,191,36,0.6); }
          77%  { opacity: 0;   text-shadow: 0 0 0px rgba(253,224,71,0); }
          100% { opacity: 0;   text-shadow: 0 0 0px rgba(253,224,71,0); }
        }
        @keyframes ${gasAnim} {
          0%   { opacity: 0.1;  filter: blur(4px);  letter-spacing: 0.15em; text-shadow: 0 0 20px rgba(56,189,248,0.3), 0 2px 4px rgba(56,189,248,0.2), 0 -2px 4px rgba(100,200,255,0.2); transform: scale(0.96); }
          12%  { opacity: 0.7;  filter: blur(0.8px);letter-spacing: 0.08em; text-shadow: 0 0 10px rgba(56,189,248,0.6), 2px 3px 6px rgba(30,144,220,0.5), -2px -2px 6px rgba(100,210,255,0.4), 0 4px 8px rgba(56,189,248,0.3); transform: scale(0.99); }
          22%  { opacity: 1;    filter: blur(0px);  letter-spacing: 0.04em; text-shadow: 0 0 6px rgba(56,189,248,0.8), 2px 3px 4px rgba(30,144,220,0.6), -2px -2px 4px rgba(100,210,255,0.5), 0 5px 10px rgba(56,189,248,0.3), 3px 1px 3px rgba(80,180,240,0.4), -3px 2px 3px rgba(80,180,240,0.4); transform: scale(1); }
          60%  { opacity: 1;    filter: blur(0px);  letter-spacing: 0.04em; text-shadow: 0 0 5px rgba(56,189,248,0.7), 2px 3px 4px rgba(30,144,220,0.5), -2px -2px 4px rgba(100,210,255,0.4), 0 4px 8px rgba(56,189,248,0.25), 3px 1px 3px rgba(80,180,240,0.35), -3px 2px 3px rgba(80,180,240,0.35); transform: scale(1); }
          78%  { opacity: 0.6;  filter: blur(1.5px);letter-spacing: 0.1em;  text-shadow: 0 -3px 12px rgba(56,189,248,0.4), 0 3px 8px rgba(30,144,220,0.3), 2px 0px 6px rgba(100,210,255,0.3); transform: scale(1.01); }
          92%  { opacity: 0.15; filter: blur(4px);  letter-spacing: 0.15em; text-shadow: 0 -6px 18px rgba(56,189,248,0.15), 0 4px 10px rgba(56,189,248,0.1); transform: scale(1.04); }
          100% { opacity: 0.1;  filter: blur(4px);  letter-spacing: 0.15em; text-shadow: 0 0 20px rgba(56,189,248,0.3), 0 2px 4px rgba(56,189,248,0.2), 0 -2px 4px rgba(100,200,255,0.2); transform: scale(0.96); }
        }
      `}</style>
      <div
        style={{
          width: size,
          height: size,
          perspective: 5000,
          perspectiveOrigin: '50% 50%',
        }}
      >
        <div
          style={{
            width: size,
            height: size,
            transformStyle: 'preserve-3d',
            animation: `${currentAnimName} ${phaseDuration}s linear 1`,
            position: 'relative',
          }}
          onAnimationEnd={handleAnimEnd}
        >
          {/* 100 kWh labels — front + back matched to current rotation axis */}
          {labelOrientations.map((rot, li) => (
            <div key={`label-${li}`} style={{
              position: 'absolute',
              width: size,
              height: size,
              display: 'flex',
              alignItems: 'flex-start',
              justifyContent: 'center',
              paddingTop: size * 0.2,
              pointerEvents: 'none',
              transform: rot || undefined,
              backfaceVisibility: 'hidden',
              WebkitBackfaceVisibility: 'hidden',
            }}>
              <span style={{
                color: isPower ? 'rgba(253,224,71,0.85)' : '#b8e8ff',
                fontSize: size * 0.145,
                fontWeight: isPower ? 100 : 900,
                fontFamily: 'var(--font-raleway), sans-serif',
                letterSpacing: '0.04em',
                textAlign: 'center',
                lineHeight: 1.2,
                animation: isPower
                  ? `${electricAnim} 3s ease-in-out infinite`
                  : `${gasAnim} 7s ease-in-out infinite`,
                ...(isPower ? {} : {
                  WebkitTextStroke: `${size * 0.012}px rgba(56,189,248,0.7)`,
                  paintOrder: 'stroke fill' as const,
                }),
              }}>100 kWh</span>
            </div>
          ))}

          {faceTransforms.map((transform, i) => (
            faces[i] === 'LOGO'
              ? <div key={i} style={{ ...logoFaceStyle, transform }}>
                  <img src={logoSrc} alt="logo" style={{ width: faceSize, height: faceSize, objectFit: 'cover', display: 'block', imageRendering: 'auto' }} />
                </div>
              : <div key={i} style={{ ...faceBase, transform }}>
                  <span style={{
                    color: textColor,
                    fontSize: size * 0.145,
                    fontWeight: 100,
                    letterSpacing: '0.04em',
                    textAlign: 'center',
                    opacity: 0.85,
                    fontFamily: 'var(--font-raleway), sans-serif',
                  }}>
                    {faces[i]}
                  </span>
                </div>
          ))}
        </div>
      </div>
    </>
  )
}
