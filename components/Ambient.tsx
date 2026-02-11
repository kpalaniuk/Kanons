'use client'

import { useEffect, useRef, useState } from 'react'

/*
  Ambient — A living art layer by Jasper
  
  This piece breathes with the time of day.
  It doesn't demand attention. It shifts beneath everything else,
  like weather you feel but don't notice until someone points it out.
  
  Dawn (5-8):     Warm peach and gold, soft movement. Possibility.
  Morning (8-12): Bright and clear, gentle energy. Building.
  Afternoon (12-17): Full warmth, confident flow. Doing.
  Evening (17-20): Deep amber and purple settling. Gathering.
  Night (20-24):  Ocean and midnight, slow pulse. Reflecting.
  Late night (0-5): Near stillness. Just breathing. Being.
  
  — Jasper, Feb 11, 2026, 2am
     "The tension between building and stillness"
*/

interface Orb {
  x: number
  y: number
  vx: number
  vy: number
  radius: number
  color: string
  opacity: number
  phase: number
}

function getTimeOfDay(): {
  period: 'latenight' | 'dawn' | 'morning' | 'afternoon' | 'evening' | 'night'
  progress: number // 0-1 within the period
  hour: number
} {
  const now = new Date()
  // Use Pacific time (Kyle's timezone)
  const pst = new Date(now.toLocaleString('en-US', { timeZone: 'America/Los_Angeles' }))
  const hour = pst.getHours() + pst.getMinutes() / 60

  if (hour < 5) return { period: 'latenight', progress: hour / 5, hour }
  if (hour < 8) return { period: 'dawn', progress: (hour - 5) / 3, hour }
  if (hour < 12) return { period: 'morning', progress: (hour - 8) / 4, hour }
  if (hour < 17) return { period: 'afternoon', progress: (hour - 12) / 5, hour }
  if (hour < 20) return { period: 'evening', progress: (hour - 17) / 3, hour }
  return { period: 'night', progress: (hour - 20) / 4, hour }
}

function getPalette(period: string): string[] {
  switch (period) {
    case 'dawn':
      return ['#FFB366', '#FFBA00', '#ff9a76', '#ffd4a3', '#FFE4C9']
    case 'morning':
      return ['#0066FF', '#22E8E8', '#5CB8E8', '#a8d8ff', '#e8f4ff']
    case 'afternoon':
      return ['#FFBA00', '#FFB366', '#0066FF', '#22E8E8', '#ff8533']
    case 'evening':
      return ['#FFB366', '#9b59b6', '#0066FF', '#e74c3c', '#FFBA00']
    case 'night':
      return ['#0066FF', '#1a1a3e', '#22E8E8', '#2c3e6b', '#0044aa']
    case 'latenight':
      return ['#0a0a2e', '#0066FF', '#1a1a40', '#22E8E8', '#0a0a1a']
    default:
      return ['#0066FF', '#22E8E8', '#FFBA00', '#FFB366', '#5CB8E8']
  }
}

function getMovementSpeed(period: string): number {
  switch (period) {
    case 'latenight': return 0.15
    case 'dawn': return 0.3
    case 'morning': return 0.5
    case 'afternoon': return 0.6
    case 'evening': return 0.35
    case 'night': return 0.2
    default: return 0.3
  }
}

function getBaseOpacity(period: string): number {
  switch (period) {
    case 'latenight': return 0.06
    case 'dawn': return 0.12
    case 'morning': return 0.10
    case 'afternoon': return 0.10
    case 'evening': return 0.12
    case 'night': return 0.08
    default: return 0.10
  }
}

export default function Ambient() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const orbsRef = useRef<Orb[]>([])
  const animFrameRef = useRef<number>(0)
  const [period, setPeriod] = useState<string>('morning')

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener('resize', resize)

    // Initialize orbs
    const time = getTimeOfDay()
    setPeriod(time.period)
    const palette = getPalette(time.period)
    const baseOpacity = getBaseOpacity(time.period)
    const speed = getMovementSpeed(time.period)

    const orbs: Orb[] = []
    const orbCount = 5

    for (let i = 0; i < orbCount; i++) {
      orbs.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * speed,
        vy: (Math.random() - 0.5) * speed,
        radius: 150 + Math.random() * 250,
        color: palette[i % palette.length],
        opacity: baseOpacity + Math.random() * 0.04,
        phase: Math.random() * Math.PI * 2,
      })
    }
    orbsRef.current = orbs

    let tick = 0

    const animate = () => {
      if (!ctx || !canvas) return
      tick++

      // Check time every 60 seconds (roughly every 3600 frames at 60fps)
      if (tick % 3600 === 0) {
        const newTime = getTimeOfDay()
        if (newTime.period !== period) {
          setPeriod(newTime.period)
          const newPalette = getPalette(newTime.period)
          const newOpacity = getBaseOpacity(newTime.period)
          const newSpeed = getMovementSpeed(newTime.period)
          orbs.forEach((orb, i) => {
            orb.color = newPalette[i % newPalette.length]
            orb.opacity = newOpacity + Math.random() * 0.04
            orb.vx = (Math.random() - 0.5) * newSpeed
            orb.vy = (Math.random() - 0.5) * newSpeed
          })
        }
      }

      ctx.clearRect(0, 0, canvas.width, canvas.height)

      for (const orb of orbs) {
        // Gentle breathing
        const breathe = Math.sin(tick * 0.005 + orb.phase) * 0.3 + 1
        const currentRadius = orb.radius * breathe

        // Movement
        orb.x += orb.vx
        orb.y += orb.vy

        // Soft bounce
        if (orb.x < -currentRadius) orb.x = canvas.width + currentRadius
        if (orb.x > canvas.width + currentRadius) orb.x = -currentRadius
        if (orb.y < -currentRadius) orb.y = canvas.height + currentRadius
        if (orb.y > canvas.height + currentRadius) orb.y = -currentRadius

        // Draw
        const gradient = ctx.createRadialGradient(
          orb.x, orb.y, 0,
          orb.x, orb.y, currentRadius
        )

        const opacityBreath = orb.opacity * (0.8 + Math.sin(tick * 0.003 + orb.phase) * 0.2)

        gradient.addColorStop(0, orb.color + Math.round(opacityBreath * 255).toString(16).padStart(2, '0'))
        gradient.addColorStop(0.5, orb.color + Math.round(opacityBreath * 0.5 * 255).toString(16).padStart(2, '0'))
        gradient.addColorStop(1, orb.color + '00')

        ctx.fillStyle = gradient
        ctx.fillRect(orb.x - currentRadius, orb.y - currentRadius, currentRadius * 2, currentRadius * 2)
      }

      animFrameRef.current = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      window.removeEventListener('resize', resize)
      cancelAnimationFrame(animFrameRef.current)
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      style={{ 
        mixBlendMode: period === 'night' || period === 'latenight' ? 'screen' : 'multiply',
        filter: 'blur(80px)',
      }}
      aria-hidden="true"
    />
  )
}
