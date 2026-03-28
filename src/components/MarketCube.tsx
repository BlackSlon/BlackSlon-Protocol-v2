'use client'

import React from 'react'

interface MarketCubeProps {
  marketId: string
  marketName: string
  type: 'Power' | 'Gas'
  size?: number
  direction?: 'left' | 'down'
  duration?: number
}

// Alternating rotations: one full spin LEFT then one full spin DOWN (and vice versa)
const SPIN_LEFT_FIRST = (n: string) => `@keyframes ${n} {
  0%      { transform: rotateY(0deg); }
  49.99%  { transform: rotateY(-360deg); }
  50%     { transform: rotateX(0deg); }
  100%    { transform: rotateX(-360deg); }
}`
const SPIN_DOWN_FIRST = (n: string) => `@keyframes ${n} {
  0%      { transform: rotateX(0deg); }
  49.99%  { transform: rotateX(-360deg); }
  50%     { transform: rotateY(0deg); }
  100%    { transform: rotateY(-360deg); }
}`

export default function MarketCube({ marketId, marketName, type, size = 120, direction = 'left', duration = 20 }: MarketCubeProps) {
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

  const animName = `mc-spin-${marketId.replace(/-/g, '')}`

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
    `rotateY(180deg) translateZ(${h}px)`,
    `rotateY(90deg) translateZ(${h}px)`,
    `rotateY(-90deg) translateZ(${h}px)`,
    `rotateX(90deg) translateZ(${h}px)`,
    `rotateX(-90deg) translateZ(${h}px)`,
  ]

  const spinFn = direction === 'left' ? SPIN_LEFT_FIRST : SPIN_DOWN_FIRST

  const electricAnim = `mc-zap-${marketId.replace(/-/g, '')}`
  const gasAnim = `mc-vapor-${marketId.replace(/-/g, '')}`

  return (
    <>
      <style>{`
        ${spinFn(animName)}
        @keyframes ${electricAnim} {
          0%   { opacity: 0;   text-shadow: 0 0 0px rgba(253,224,71,0); }
          7%   { opacity: 0;   text-shadow: 0 0 0px rgba(253,224,71,0); }
          9%   { opacity: 1;   text-shadow: 0 0 14px #fff, 0 0 28px rgba(253,224,71,0.9), 0 0 45px rgba(251,191,36,0.5); }
          12%  { opacity: 0.85; text-shadow: 0 0 2px rgba(253,224,71,0.5), 4px -2px 2px rgba(253,224,71,0.7), -3px 1px 1px rgba(251,191,36,0.4); }
          18%  { opacity: 1;   text-shadow: 0 0 3px #fff, 6px -3px 3px rgba(253,224,71,0.9), -2px 4px 2px rgba(253,224,71,0.6), 0 0 8px rgba(251,191,36,0.3); }
          20%  { opacity: 0.7; text-shadow: 0 0 1px rgba(253,224,71,0.3), -4px -1px 0 rgba(255,255,255,0); }
          35%  { opacity: 0.85; text-shadow: 0 0 1px rgba(253,224,71,0.4), -2px 3px 2px rgba(253,224,71,0.6), 3px -2px 1px rgba(251,191,36,0.3); }
          37%  { opacity: 1;   text-shadow: 0 0 4px #fff, -5px 2px 3px rgba(253,224,71,0.8), 4px -3px 2px rgba(253,224,71,0.7), 0 0 10px rgba(251,191,36,0.4); }
          39%  { opacity: 0.75; text-shadow: 0 0 1px rgba(253,224,71,0.2); }
          55%  { opacity: 0.8; text-shadow: 0 0 1px rgba(253,224,71,0.3), 3px 2px 1px rgba(253,224,71,0.5); }
          57%  { opacity: 1;   text-shadow: 0 0 3px #fff, -3px -3px 3px rgba(253,224,71,0.8), 5px 1px 2px rgba(253,224,71,0.6), 0 0 12px rgba(251,191,36,0.3); }
          59%  { opacity: 0.7; text-shadow: 0 0 1px rgba(253,224,71,0.2); }
          72%  { opacity: 0.85; text-shadow: 0 0 2px rgba(253,224,71,0.4), 2px -1px 1px rgba(253,224,71,0.5); }
          74%  { opacity: 1;   text-shadow: 0 0 14px #fff, 0 0 28px rgba(253,224,71,0.9), 0 0 45px rgba(251,191,36,0.5); }
          77%  { opacity: 0;   text-shadow: 0 0 0px rgba(253,224,71,0); }
          100% { opacity: 0;   text-shadow: 0 0 0px rgba(253,224,71,0); }
        }
        @keyframes ${gasAnim} {
          0%   { opacity: 0.1;  filter: blur(5px);  letter-spacing: 0.2em;  text-shadow: 0 0 20px rgba(56,189,248,0.2); transform: scale(0.95); }
          10%  { opacity: 0.6;  filter: blur(1.5px);letter-spacing: 0.1em;  text-shadow: 0 0 12px rgba(56,189,248,0.5); transform: scale(0.98); }
          20%  { opacity: 0.9;  filter: blur(0.3px);letter-spacing: 0.05em; text-shadow: 0 0 6px rgba(56,189,248,0.7), 0 0 14px rgba(56,189,248,0.3); transform: scale(1); }
          65%  { opacity: 0.9;  filter: blur(0px);  letter-spacing: 0.04em; text-shadow: 0 0 4px rgba(56,189,248,0.6), 0 0 10px rgba(56,189,248,0.2); transform: scale(1); }
          80%  { opacity: 0.5;  filter: blur(2px);  letter-spacing: 0.12em; text-shadow: 0 -4px 15px rgba(56,189,248,0.3); transform: scale(1.02); }
          92%  { opacity: 0.15; filter: blur(5px);  letter-spacing: 0.2em;  text-shadow: 0 -8px 20px rgba(56,189,248,0.1); transform: scale(1.05); }
          100% { opacity: 0.1;  filter: blur(5px);  letter-spacing: 0.2em;  text-shadow: 0 0 20px rgba(56,189,248,0.2); transform: scale(0.95); }
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
            animation: `${animName} ${duration}s linear infinite`,
            position: 'relative',
          }}
        >
          {/* 100 kWh labels — 4 copies facing front/back/top/bottom so always visible */}
          {['', 'rotateY(180deg)', 'rotateX(90deg)', 'rotateX(-90deg)'].map((rot, li) => (
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
                color: isPower ? 'rgba(253,224,71,0.85)' : '#38bdf8',
                fontSize: size * 0.145,
                fontWeight: isPower ? 100 : 700,
                fontFamily: 'var(--font-raleway), sans-serif',
                letterSpacing: '0.04em',
                textAlign: 'center',
                lineHeight: 1.2,
                animation: isPower
                  ? `${electricAnim} 3s ease-in-out infinite`
                  : `${gasAnim} 7s ease-in-out infinite`,
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
