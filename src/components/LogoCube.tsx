'use client'

import React, { useState, useCallback } from 'react'

interface LogoCubeProps {
  size?: number
  duration?: number
}

const SPIN_LEFT = (n: string) => `@keyframes ${n} {
  0%   { transform: rotateY(0deg); }
  100% { transform: rotateY(-360deg); }
}`
const SPIN_DOWN = (n: string) => `@keyframes ${n} {
  0%   { transform: rotateX(0deg); }
  100% { transform: rotateX(-360deg); }
}`

export default function LogoCube({ size = 300, duration = 24 }: LogoCubeProps) {
  const [phase, setPhase] = useState(0)
  const handleAnimEnd = useCallback(() => setPhase(p => p + 1), [])

  const isLeftPhase = phase % 2 === 0
  const phaseDuration = duration / 2

  const h = size / 2
  const faceSize = size + 2
  const faceOffset = -1

  const leftAnim = 'logo-spin-left'
  const downAnim = 'logo-spin-down'
  const currentAnim = isLeftPhase ? leftAnim : downAnim

  const borderColor = 'rgba(200,180,120,0.3)'
  const glowColor = 'rgba(200,180,120,0.08)'

  const faceBase: React.CSSProperties = {
    position: 'absolute',
    width: faceSize,
    height: faceSize,
    top: faceOffset,
    left: faceOffset,
    border: `1px solid ${borderColor}`,
    background: 'rgba(10,8,5,0.6)',
    boxShadow: `inset 0 0 12px ${glowColor}`,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    willChange: 'transform',
    backfaceVisibility: 'hidden',
    WebkitBackfaceVisibility: 'hidden',
  }

  const logoFace: React.CSSProperties = {
    ...faceBase,
    background: 'rgba(0,0,0,0.9)',
    border: `1px solid ${borderColor}`,
  }

  const faceTransforms = [
    `translateZ(${h}px)`,
    isLeftPhase ? `rotateY(180deg) translateZ(${h}px)` : `rotateX(180deg) translateZ(${h}px)`,
    `rotateY(90deg) translateZ(${h}px)`,
    `rotateY(-90deg) translateZ(${h}px)`,
    `rotateX(90deg) translateZ(${h}px)`,
    `rotateX(-90deg) translateZ(${h}px)`,
  ]

  // Faces: front=logo, back=logo, sides=text
  const faces = ['LOGO', 'LOGO', 'BlackSlon', 'Protocol', 'Energy', 'Markets']

  const floatAnim = 'logo-float'

  return (
    <>
      <style>{`
        ${SPIN_LEFT(leftAnim)}
        ${SPIN_DOWN(downAnim)}
        @keyframes ${floatAnim} {
          0%   { transform: translate(0, 0); }
          25%  { transform: translate(3px, -5px); }
          50%  { transform: translate(-2px, -8px); }
          75%  { transform: translate(4px, -3px); }
          100% { transform: translate(0, 0); }
        }
      `}</style>
      <div style={{
        width: size,
        height: size,
        perspective: 5000,
        perspectiveOrigin: '50% 50%',
        animation: `${floatAnim} 8s ease-in-out infinite`,
      }}>
        <div
          style={{
            width: size,
            height: size,
            transformStyle: 'preserve-3d',
            animation: `${currentAnim} ${phaseDuration}s linear 1`,
            position: 'relative',
          }}
          onAnimationEnd={handleAnimEnd}
        >
          {faceTransforms.map((transform, i) => (
            faces[i] === 'LOGO'
              ? <div key={i} style={{ ...logoFace, transform }}>
                  <img
                    src="/BS_image.jpg"
                    alt="BlackSlon"
                    style={{ width: faceSize, height: faceSize, objectFit: 'cover', display: 'block' }}
                  />
                </div>
              : <div key={i} style={{ ...faceBase, transform }}>
                  <span style={{
                    color: 'rgba(200,180,120,0.7)',
                    fontSize: size * 0.1,
                    fontWeight: 100,
                    fontFamily: 'var(--font-raleway), sans-serif',
                    letterSpacing: '0.08em',
                    textTransform: 'none',
                    textAlign: 'center',
                    userSelect: 'none',
                  }}>{faces[i]}</span>
                </div>
          ))}
        </div>
      </div>
    </>
  )
}
