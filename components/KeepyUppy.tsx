'use client'

import { useEffect, useRef, useState } from 'react'

interface Icon {
  id: number
  emoji: string
  x: number
  y: number
  vx: number
  vy: number
  rotation: number
  rotationSpeed: number
}

const LIFE_ICONS = [
  '🎺', // Music (trumpet)
  '🏠', // Real Estate / Mortgage
  '⚽', // Soccer (coaching)
  '👨‍👩‍👧‍👦', // Family
  '🎵', // Band / Production
  '💻', // Tech / Building
  '🎪', // Events / Granada House
  '🌎', // Travel
  '🧠', // Philosophy
  '🎨', // Creative
]

const GRAVITY = 0.15
const BOUNCE_STRENGTH = 12
const PUSH_RADIUS = 120
const ICON_SIZE = 48
const DAMPING = 0.98

export default function KeepyUppy() {
  const containerRef = useRef<HTMLDivElement>(null)
  const iconsRef = useRef<Icon[]>([])
  const mousePos = useRef({ x: -1000, y: -1000 })
  const animationFrameRef = useRef<number>()
  const [, forceUpdate] = useState({})

  useEffect(() => {
    if (!containerRef.current) return

    const container = containerRef.current
    const rect = container.getBoundingClientRect()
    const containerWidth = rect.width
    const containerHeight = rect.height

    // Initialize icons
    iconsRef.current = LIFE_ICONS.map((emoji, i) => ({
      id: i,
      emoji,
      x: Math.random() * (containerWidth - ICON_SIZE * 2) + ICON_SIZE,
      y: Math.random() * (containerHeight * 0.6) + ICON_SIZE,
      vx: (Math.random() - 0.5) * 2,
      vy: (Math.random() - 0.5) * 2,
      rotation: Math.random() * 360,
      rotationSpeed: (Math.random() - 0.5) * 2,
    }))

    forceUpdate({})

    // Mouse/touch tracking
    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect()
      mousePos.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      }
    }

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        const rect = container.getBoundingClientRect()
        mousePos.current = {
          x: e.touches[0].clientX - rect.left,
          y: e.touches[0].clientY - rect.top,
        }
      }
    }

    const handleMouseLeave = () => {
      mousePos.current = { x: -1000, y: -1000 }
    }

    // Listen on window so mouse events aren't blocked by z-10 content overlay
    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('touchmove', handleTouchMove, { passive: true })
    container.addEventListener('mouseleave', handleMouseLeave)

    // Physics loop
    const animate = () => {
      const rect = container.getBoundingClientRect()
      const bounds = {
        width: rect.width,
        height: rect.height,
      }

      iconsRef.current.forEach((icon) => {
        // Apply gravity
        icon.vy += GRAVITY

        // Check distance to mouse/touch
        const dx = icon.x - mousePos.current.x
        const dy = icon.y - mousePos.current.y
        const distance = Math.sqrt(dx * dx + dy * dy)

        // Push away from cursor
        if (distance < PUSH_RADIUS && distance > 0) {
          const force = (1 - distance / PUSH_RADIUS) * BOUNCE_STRENGTH
          const angle = Math.atan2(dy, dx)
          icon.vx += Math.cos(angle) * force * 0.3
          icon.vy += Math.sin(angle) * force
        }

        // Apply velocity
        icon.x += icon.vx
        icon.y += icon.vy

        // Apply damping
        icon.vx *= DAMPING
        icon.vy *= DAMPING

        // Rotation
        icon.rotation += icon.rotationSpeed

        // Bounce off walls
        if (icon.x < ICON_SIZE) {
          icon.x = ICON_SIZE
          icon.vx = Math.abs(icon.vx) * 0.7
        }
        if (icon.x > bounds.width - ICON_SIZE) {
          icon.x = bounds.width - ICON_SIZE
          icon.vx = -Math.abs(icon.vx) * 0.7
        }

        // Bounce off floor (bottom)
        if (icon.y > bounds.height - ICON_SIZE) {
          icon.y = bounds.height - ICON_SIZE
          icon.vy = -Math.abs(icon.vy) * 0.5
        }

        // Soft ceiling
        if (icon.y < ICON_SIZE) {
          icon.y = ICON_SIZE
          icon.vy = Math.abs(icon.vy) * 0.3
        }
      })

      forceUpdate({})
      animationFrameRef.current = requestAnimationFrame(animate)
    }

    animationFrameRef.current = requestAnimationFrame(animate)

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('touchmove', handleTouchMove)
      container.removeEventListener('mouseleave', handleMouseLeave)
    }
  }, [])

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 overflow-hidden z-20 pointer-events-none"
    >
      {iconsRef.current.map((icon) => (
        <div
          key={icon.id}
          className="absolute pointer-events-none select-none"
          style={{
            left: `${icon.x}px`,
            top: `${icon.y}px`,
            transform: `translate(-50%, -50%) rotate(${icon.rotation}deg)`,
            fontSize: `${ICON_SIZE}px`,
            textShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
            filter: 'drop-shadow(0 2px 8px rgba(0, 0, 0, 0.15))',
            willChange: 'transform',
          }}
        >
          {icon.emoji}
        </div>
      ))}
    </div>
  )
}
