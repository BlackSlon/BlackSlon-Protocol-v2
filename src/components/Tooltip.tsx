'use client'

import React, { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'

interface TooltipProps {
  children: React.ReactNode
  content: React.ReactNode
  title?: React.ReactNode
}

export default function Tooltip({ children, content, title }: TooltipProps) {
  const triggerRef = useRef<HTMLDivElement | null>(null)
  const bubbleRef = useRef<HTMLDivElement | null>(null)
  const [mounted, setMounted] = useState(false)
  const [open, setOpen] = useState(false)
  const [position, setPosition] = useState({ top: 0, left: 0 })

  const updatePosition = () => {
    const trigger = triggerRef.current
    const bubble = bubbleRef.current
    if (!trigger || !bubble) return

    const triggerRect = trigger.getBoundingClientRect()
    const bubbleRect = bubble.getBoundingClientRect()
    const gap = 10
    const viewportWidth = window.innerWidth
    const viewportHeight = window.innerHeight

    let top = triggerRect.bottom + gap
    if (top + bubbleRect.height > viewportHeight - 8) {
      top = triggerRect.top - bubbleRect.height - gap
    }
    top = Math.max(8, top)

    let left = triggerRect.left + triggerRect.width / 2 - bubbleRect.width / 2
    if (left + bubbleRect.width > viewportWidth - 8) {
      left = viewportWidth - bubbleRect.width - 8
    }
    left = Math.max(8, left)

    setPosition({ top, left })
  }

  useEffect(() => {
    setMounted(true)
  }, [])

  useLayoutEffect(() => {
    if (!open) return
    updatePosition()
    const onResize = () => updatePosition()
    window.addEventListener('resize', onResize)
    window.addEventListener('scroll', onResize, true)
    return () => {
      window.removeEventListener('resize', onResize)
      window.removeEventListener('scroll', onResize, true)
    }
  }, [open, content, title])

  return (
    <>
      <div
        ref={triggerRef}
        className="inline-flex items-center gap-1 cursor-pointer"
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
      >
        {children}
        <span className="text-[9px] text-gray-600">?</span>
      </div>

      {mounted && createPortal(
        <div
          ref={bubbleRef}
          className={`pointer-events-none fixed z-[9999] max-w-xs rounded-lg border border-gray-800 bg-gray-950 px-3 py-2 shadow-2xl transition-all duration-150 ${open ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-1'}`}
          style={{
            top: position.top,
            left: position.left,
            visibility: open ? 'visible' : 'hidden',
          }}
        >
          {title ? <div className="mb-1 text-[10px] font-semibold uppercase tracking-widest text-gray-400">{title}</div> : null}
          <div className="text-[11px] leading-loose text-gray-300">{content}</div>
        </div>,
        document.body,
      )}
    </>
  )
}
