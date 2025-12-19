'use client'

import Link from 'next/link'
import { motion, useMotionValue, useSpring } from 'framer-motion'
import { useEffect, useState, useRef } from 'react'
import Image from 'next/image'

// Animation variants
const fadeUpVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      delay: 0.1 + i * 0.12,
      ease: [0.22, 1, 0.36, 1]
    }
  })
}

// Hobo symbols as SVG components - BOLD lines
const HoboSymbols = {
  // "You can sleep in the loft" - house with peaked roof
  sleepInLoft: ({ color = "currentColor", size = 60 }: { color?: string, size?: number }) => (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none" stroke={color} strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M8 25 L20 10 L32 25" />
      <path d="M12 25 L12 35 L28 35 L28 25" />
      <path d="M20 10 L20 5" />
    </svg>
  ),
  
  // "Kind gentleman lives here" - cat/house face shape  
  kindGentleman: ({ color = "currentColor", size = 60 }: { color?: string, size?: number }) => (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none" stroke={color} strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10 35 L10 15 L20 8 L30 15 L30 35" />
      <path d="M10 15 L5 15" />
      <path d="M30 15 L35 15" />
    </svg>
  ),
  
  // "Allright/Okay" - X shape
  okay: ({ color = "currentColor", size = 60 }: { color?: string, size?: number }) => (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none" stroke={color} strokeWidth="4" strokeLinecap="round">
      <path d="M10 10 L30 30" />
      <path d="M30 10 L10 30" />
    </svg>
  ),
  
  // "Work available" - two diagonal lines (shovel/pick)
  workAvailable: ({ color = "currentColor", size = 60 }: { color?: string, size?: number }) => (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none" stroke={color} strokeWidth="3.5" strokeLinecap="round">
      <path d="M10 35 L20 15" />
      <path d="M18 35 L28 15" />
    </svg>
  ),
  
  // "Here is the place" - table shape
  hereIsThePlace: ({ color = "currentColor", size = 60 }: { color?: string, size?: number }) => (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none" stroke={color} strokeWidth="3.5" strokeLinecap="round">
      <path d="M5 18 L35 18" />
      <path d="M10 18 L10 35" />
      <path d="M30 18 L30 35" />
    </svg>
  ),
  
  // "Help if you are sick" - hook/backwards C
  helpIfSick: ({ color = "currentColor", size = 60 }: { color?: string, size?: number }) => (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none" stroke={color} strokeWidth="3.5" strokeLinecap="round">
      <path d="M25 8 C10 8 10 20 10 25 C10 32 15 35 25 35" />
    </svg>
  ),
  
  // "Poor people live here" - wavy lines
  poorPeople: ({ color = "currentColor", size = 60 }: { color?: string, size?: number }) => (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none" stroke={color} strokeWidth="3.5" strokeLinecap="round">
      <path d="M5 15 Q10 10 15 15 Q20 20 25 15 Q30 10 35 15" />
      <path d="M5 25 Q10 20 15 25 Q20 30 25 25 Q30 20 35 25" />
    </svg>
  ),
  
  // "Owner home" - curved bracket
  ownerHome: ({ color = "currentColor", size = 60 }: { color?: string, size?: number }) => (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none" stroke={color} strokeWidth="4" strokeLinecap="round">
      <path d="M30 8 C15 8 15 20 15 20 C15 20 15 32 30 32" />
    </svg>
  ),
  
  // "Stop" - house outline with cross
  stop: ({ color = "currentColor", size = 60 }: { color?: string, size?: number }) => (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none" stroke={color} strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10 35 L10 18 L20 8 L30 18 L30 35" />
      <path d="M20 18 L20 28" />
      <path d="M15 23 L25 23" />
    </svg>
  ),
  
  // "Hobos arrested on sight" - two circles/eyes
  hobosArrested: ({ color = "currentColor", size = 60 }: { color?: string, size?: number }) => (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none" stroke={color} strokeWidth="3.5">
      <circle cx="13" cy="20" r="7" />
      <circle cx="27" cy="20" r="7" />
    </svg>
  ),
  
  // "No alcohol town" - nested squares
  noAlcohol: ({ color = "currentColor", size = 60 }: { color?: string, size?: number }) => (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none" stroke={color} strokeWidth="3.5">
      <rect x="5" y="5" width="30" height="30" />
      <rect x="13" y="13" width="14" height="14" />
    </svg>
  ),
}

// Interactive floating symbol that reacts to cursor
function InteractiveSymbol({ 
  symbol,
  color,
  size,
  baseX, 
  baseY,
  mouseX,
  mouseY,
  floatRange = 50,
  duration = 6,
  delay = 0,
  pushStrength = 80,
}: { 
  symbol: keyof typeof HoboSymbols
  color: string
  size: number
  baseX: number
  baseY: number
  mouseX: any
  mouseY: any
  floatRange?: number
  duration?: number
  delay?: number
  pushStrength?: number
}) {
  const [randomOffsets] = useState(() => ({
    x1: Math.random() * floatRange * 2 - floatRange,
    y1: Math.random() * floatRange * 2 - floatRange,
    x2: Math.random() * floatRange * 2 - floatRange,
    y2: Math.random() * floatRange * 2 - floatRange,
    x3: Math.random() * floatRange * 2 - floatRange,
    y3: Math.random() * floatRange * 2 - floatRange,
    x4: Math.random() * floatRange * 2 - floatRange,
    y4: Math.random() * floatRange * 2 - floatRange,
  }))

  const shapeRef = useRef<HTMLDivElement>(null)
  const [pushOffset, setPushOffset] = useState({ x: 0, y: 0, scale: 1 })

  useEffect(() => {
    const unsubX = mouseX.on("change", () => updatePush())
    const unsubY = mouseY.on("change", () => updatePush())

    function updatePush() {
      if (!shapeRef.current) return
      
      const rect = shapeRef.current.getBoundingClientRect()
      const shapeCenterX = rect.left + rect.width / 2
      const shapeCenterY = rect.top + rect.height / 2
      
      const mx = mouseX.get()
      const my = mouseY.get()
      
      const dx = shapeCenterX - mx
      const dy = shapeCenterY - my
      const distance = Math.sqrt(dx * dx + dy * dy)
      
      const threshold = 280
      
      if (distance < threshold && distance > 0) {
        const force = (1 - distance / threshold) * pushStrength
        const angle = Math.atan2(dy, dx)
        const pushX = Math.cos(angle) * force
        const pushY = Math.sin(angle) * force
        const squish = 1 - (1 - distance / threshold) * 0.2
        
        setPushOffset({ x: pushX, y: pushY, scale: squish })
      } else {
        setPushOffset({ x: 0, y: 0, scale: 1 })
      }
    }

    return () => {
      unsubX()
      unsubY()
    }
  }, [mouseX, mouseY, pushStrength])

  const springConfig = { damping: 20, stiffness: 150 }
  const springX = useSpring(pushOffset.x, springConfig)
  const springY = useSpring(pushOffset.y, springConfig)
  const springScale = useSpring(pushOffset.scale, { damping: 15, stiffness: 200 })

  useEffect(() => {
    springX.set(pushOffset.x)
    springY.set(pushOffset.y)
    springScale.set(pushOffset.scale)
  }, [pushOffset, springX, springY, springScale])

  const SymbolComponent = HoboSymbols[symbol]

  return (
    <motion.div
      ref={shapeRef}
      className="absolute"
      style={{ 
        left: `${baseX}%`, 
        top: `${baseY}%`,
        x: springX,
        y: springY,
        scale: springScale,
      }}
      initial={{ scale: 0, opacity: 0 }}
      animate={{ opacity: 0.7 }}
      transition={{
        opacity: { duration: 0.8, delay },
        scale: { duration: 0.8, delay, ease: [0.22, 1, 0.36, 1] },
      }}
    >
      <motion.div
        animate={{
          x: [0, randomOffsets.x1, randomOffsets.x2, randomOffsets.x3, randomOffsets.x4, 0],
          y: [0, randomOffsets.y1, randomOffsets.y2, randomOffsets.y3, randomOffsets.y4, 0],
          rotate: [0, 5, -3, 4, -2, 0],
        }}
        transition={{
          x: { duration, repeat: Infinity, ease: "easeInOut" },
          y: { duration: duration * 1.2, repeat: Infinity, ease: "easeInOut" },
          rotate: { duration: duration * 1.5, repeat: Infinity, ease: "easeInOut" },
        }}
      >
        <SymbolComponent color={color} size={size} />
      </motion.div>
    </motion.div>
  )
}

// Hand cursor using HAND.png
function HandCursor({ containerRef }: { containerRef: React.RefObject<HTMLElement | null> }) {
  const cursorX = useMotionValue(-100)
  const cursorY = useMotionValue(-100)
  const [isInHero, setIsInHero] = useState(false)
  const [isVisible, setIsVisible] = useState(false)
  
  const springConfig = { damping: 30, stiffness: 400 }
  const x = useSpring(cursorX, springConfig)
  const y = useSpring(cursorY, springConfig)

  useEffect(() => {
    if (typeof window !== 'undefined' && window.matchMedia('(max-width: 768px)').matches) {
      return
    }
    
    setIsVisible(true)

    const handleMouseMove = (e: MouseEvent) => {
      cursorX.set(e.clientX)
      cursorY.set(e.clientY)
      
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect()
        const inHero = e.clientY >= rect.top && e.clientY <= rect.bottom
        setIsInHero(inHero)
      }
    }

    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [cursorX, cursorY, containerRef])

  if (!isVisible) return null

  return (
    <motion.div
      className="fixed pointer-events-none z-[9999]"
      style={{ x, y, translateX: '-50%', translateY: '-50%' }}
      animate={{ 
        opacity: isInHero ? 1 : 0,
        scale: isInHero ? 1 : 0.5,
        rotate: isInHero ? -15 : 0,
      }}
      transition={{ duration: 0.2 }}
    >
      <Image
        src="/hand-cursor.png"
        alt=""
        width={60}
        height={60}
        className="w-12 h-12 md:w-16 md:h-16"
        priority
      />
    </motion.div>
  )
}

export default function Home() {
  const heroRef = useRef<HTMLElement>(null)
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX)
      mouseY.set(e.clientY)
    }
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [mouseX, mouseY])

  return (
    <div className="page-transition">
      <HandCursor containerRef={heroRef} />

      {/* Hero Section */}
      <section ref={heroRef} className="min-h-screen flex items-center relative overflow-hidden bg-paper hero-cursor">
        
        {/* Hobo symbols scattered across the hero - BIGGER & BOLDER */}
        <InteractiveSymbol 
          symbol="sleepInLoft"
          color="#FFBA00"
          size={110}
          baseX={75} baseY={6} 
          mouseX={mouseX} mouseY={mouseY}
          floatRange={70}
          duration={6}
          delay={0.2}
          pushStrength={140}
        />
        
        <InteractiveSymbol 
          symbol="okay"
          color="#0066FF"
          size={75}
          baseX={88} baseY={22} 
          mouseX={mouseX} mouseY={mouseY}
          floatRange={80}
          duration={5}
          delay={0.3}
          pushStrength={160}
        />
        
        <InteractiveSymbol 
          symbol="workAvailable"
          color="#22E8E8"
          size={100}
          baseX={3} baseY={50} 
          mouseX={mouseX} mouseY={mouseY}
          floatRange={65}
          duration={7}
          delay={0.4}
          pushStrength={130}
        />
        
        <InteractiveSymbol 
          symbol="hereIsThePlace"
          color="#5CB8E8"
          size={90}
          baseX={10} baseY={20} 
          mouseX={mouseX} mouseY={mouseY}
          floatRange={75}
          duration={5.5}
          delay={0.5}
          pushStrength={150}
        />
        
        <InteractiveSymbol 
          symbol="ownerHome"
          color="#FFB366"
          size={85}
          baseX={80} baseY={55} 
          mouseX={mouseX} mouseY={mouseY}
          floatRange={70}
          duration={6.5}
          delay={0.6}
          pushStrength={145}
        />

        <InteractiveSymbol 
          symbol="poorPeople"
          color="#7A8F9E"
          size={100}
          baseX={50} baseY={78} 
          mouseX={mouseX} mouseY={mouseY}
          floatRange={60}
          duration={8}
          delay={0.7}
          pushStrength={120}
        />

        <InteractiveSymbol 
          symbol="hobosArrested"
          color="#0066FF"
          size={80}
          baseX={22} baseY={72} 
          mouseX={mouseX} mouseY={mouseY}
          floatRange={85}
          duration={5}
          delay={0.8}
          pushStrength={170}
        />

        <InteractiveSymbol 
          symbol="noAlcohol"
          color="#FFBA00"
          size={70}
          baseX={68} baseY={75} 
          mouseX={mouseX} mouseY={mouseY}
          floatRange={75}
          duration={6}
          delay={0.9}
          pushStrength={150}
        />

        <InteractiveSymbol 
          symbol="kindGentleman"
          color="#22E8E8"
          size={85}
          baseX={38} baseY={8} 
          mouseX={mouseX} mouseY={mouseY}
          floatRange={70}
          duration={7}
          delay={1}
          pushStrength={140}
        />

        <InteractiveSymbol 
          symbol="stop"
          color="#5CB8E8"
          size={80}
          baseX={88} baseY={42} 
          mouseX={mouseX} mouseY={mouseY}
          floatRange={65}
          duration={5.5}
          delay={1.1}
          pushStrength={155}
        />

        <InteractiveSymbol 
          symbol="helpIfSick"
          color="#FFB366"
          size={90}
          baseX={2} baseY={32} 
          mouseX={mouseX} mouseY={mouseY}
          floatRange={70}
          duration={6}
          delay={1.2}
          pushStrength={145}
        />

        {/* Main content */}
        <div className="relative z-10 w-full max-w-[1400px] mx-auto px-8 md:px-16 lg:px-24 py-32">
          {/* Location tag */}
          <motion.div
            custom={0}
            variants={fadeUpVariants}
            initial="hidden"
            animate="visible"
            className="flex items-center gap-3 mb-8"
          >
            <span className="w-3 h-3 bg-amber rounded-full"></span>
            <p className="text-steel font-medium tracking-wide text-sm">
              San Diego, California
            </p>
          </motion.div>
          
          {/* Name */}
          <div className="mb-10">
            <motion.h1
              custom={1}
              variants={fadeUpVariants}
              initial="hidden"
              animate="visible"
              className="font-display text-[13vw] md:text-[10vw] lg:text-[8vw] leading-[0.9] font-bold text-ink tracking-[-0.02em]"
            >
              Kyle
            </motion.h1>
            <motion.h1
              custom={2}
              variants={fadeUpVariants}
              initial="hidden"
              animate="visible"
              className="font-display text-[13vw] md:text-[10vw] lg:text-[8vw] leading-[0.9] font-bold text-ink tracking-[-0.02em] md:ml-[15%]"
            >
              Palaniuk<span className="text-royal">.</span>
            </motion.h1>
          </div>

          {/* Tagline */}
          <motion.p
            custom={3}
            variants={fadeUpVariants}
            initial="hidden"
            animate="visible"
            className="text-xl md:text-2xl text-steel max-w-xl mb-12 leading-relaxed"
          >
            Helping people find home. Building community. Making music.
          </motion.p>

          {/* CTAs */}
          <motion.div
            custom={4}
            variants={fadeUpVariants}
            initial="hidden"
            animate="visible"
            className="flex flex-wrap items-center gap-4 md:gap-6"
          >
            <Link
              href="/professional"
              className="group px-8 py-4 bg-ink text-paper font-medium rounded-full hover:bg-royal transition-colors duration-300"
            >
              <span className="tracking-wide">Work With Me →</span>
            </Link>
            <Link
              href="/about"
              className="group px-8 py-4 border-2 border-ink text-ink font-medium rounded-full hover:bg-ink hover:text-paper transition-all duration-300"
            >
              <span className="tracking-wide">Learn More</span>
            </Link>
          </motion.div>

          {/* Role badges */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1 }}
            className="mt-16 flex flex-wrap gap-3"
          >
            {[
              { label: 'Home Buying Guide', color: 'bg-royal' },
              { label: 'Musician', color: 'bg-amber' },
              { label: 'Community Builder', color: 'bg-cyan' }
            ].map((role, i) => (
              <motion.div
                key={role.label}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: 1.1 + i * 0.1 }}
                className="flex items-center gap-2 px-4 py-2 bg-paper border border-ink/10 rounded-full"
              >
                <span className={`w-2 h-2 ${role.color} rounded-full`}></span>
                <span className="text-sm text-ink/70">{role.label}</span>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
            className="flex flex-col items-center gap-2"
          >
            <span className="text-xs text-steel tracking-widest uppercase">Scroll</span>
            <div className="w-px h-8 bg-gradient-to-b from-ink/40 to-transparent" />
          </motion.div>
        </motion.div>
      </section>

      {/* About Section */}
      <section className="py-32 md:py-40 bg-ink text-paper relative overflow-hidden">
        <div className="absolute top-20 right-20 w-32 h-32 bg-royal/20 rounded-full blur-2xl" />
        <div className="absolute bottom-20 left-20 w-48 h-48 bg-amber/10 rounded-full blur-3xl" />
        
        <div className="max-w-[1400px] mx-auto px-8 md:px-16 lg:px-24">
          <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-start">
            <div>
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="flex items-center gap-3 mb-6"
              >
                <span className="w-3 h-3 bg-amber rounded-full"></span>
                <span className="text-amber text-sm tracking-widest uppercase">Philosophy</span>
              </motion.div>
              <motion.h2
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.1 }}
                className="font-display text-5xl md:text-6xl lg:text-7xl font-bold leading-[0.95] mb-8"
              >
                There's a House
                <br />
                <span className="text-cyan">Then There's</span> Home
              </motion.h2>
            </div>

            <div className="lg:pt-20">
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="text-lg md:text-xl text-paper/70 leading-relaxed mb-6"
              >
                By day, I help people navigate the path to homeownership — mortgages, real estate, 
                the whole journey. By night, you'll find me on stage with my trumpet, coaching my 
                kids' soccer team, or riding my skateboard around the neighborhood.
              </motion.p>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="text-lg md:text-xl text-paper/70 leading-relaxed mb-10"
              >
                I believe we work too much and play too little. That arts and music are therapy. 
                That the best work happens in uncomfortable spaces — if you're afraid of awkward 
                moments, lean into them.
              </motion.p>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="flex flex-wrap gap-3"
              >
                {['Home Buying', 'Trumpet & Vocals', 'Soccer Coach', 'Volunteer', 'Dad'].map((tag) => (
                  <span
                    key={tag}
                    className="px-4 py-2 bg-paper/5 border border-paper/10 rounded-full text-sm text-paper/60 hover:bg-paper/10 hover:text-paper transition-colors duration-300"
                  >
                    {tag}
                  </span>
                ))}
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* What I Do Section */}
      <section className="py-32 md:py-40 bg-paper relative overflow-hidden">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="absolute top-40 right-0 w-64 h-2 bg-peach"
        />
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="absolute bottom-40 left-0 w-32 h-32 bg-sky/20 rounded-full blur-2xl"
        />

        <div className="max-w-[1400px] mx-auto px-8 md:px-16 lg:px-24">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex items-end justify-between mb-16 md:mb-20"
          >
            <div>
              <div className="flex items-center gap-3 mb-4">
                <span className="w-3 h-3 bg-royal rounded-full"></span>
                <span className="text-royal text-sm tracking-widest uppercase">Explore</span>
              </div>
              <h2 className="font-display text-5xl md:text-6xl lg:text-7xl font-bold text-ink">
                What I Do
              </h2>
            </div>
            <span className="hidden md:block text-steel text-sm">03 Pillars</span>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
            {[
              {
                href: '/professional',
                label: '01',
                category: 'Work With Me',
                title: 'Home Buying',
                subtitle: 'Mortgages, real estate, and design',
                bgColor: 'bg-royal',
                accentColor: 'bg-cyan'
              },
              {
                href: '/music',
                label: '02',
                category: 'Listen',
                title: 'Music',
                subtitle: 'Trumpet, vocals, and live sessions',
                bgColor: 'bg-sky',
                accentColor: 'bg-amber'
              },
              {
                href: '/about',
                label: '03',
                category: 'Learn More',
                title: 'Community',
                subtitle: 'Granada House and beyond',
                bgColor: 'bg-amber',
                accentColor: 'bg-royal'
              }
            ].map((card, i) => (
              <motion.div
                key={card.href}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.15 }}
              >
                <Link href={card.href} className="group block">
                  <div className={`aspect-[4/5] ${card.bgColor} rounded-3xl overflow-hidden relative p-8 flex flex-col justify-between`}>
                    <div className={`absolute top-6 right-6 w-16 h-16 ${card.accentColor} rounded-full opacity-60 group-hover:scale-125 transition-transform duration-500`} />
                    <span className="text-white/30 text-sm tracking-widest">{card.label}</span>
                    <div className="relative z-10">
                      <p className="text-white/70 text-xs tracking-[0.2em] uppercase mb-2">
                        {card.category}
                      </p>
                      <h3 className="font-display text-4xl md:text-5xl font-bold text-white group-hover:translate-x-2 transition-transform duration-300">
                        {card.title}
                      </h3>
                    </div>
                  </div>
                  <div className="mt-4 flex items-center justify-between">
                    <p className="text-steel text-sm group-hover:text-ink transition-colors">
                      {card.subtitle}
                    </p>
                    <span className="text-ink group-hover:translate-x-1 transition-transform">→</span>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 md:py-40 bg-ink text-paper relative overflow-hidden">
        <motion.div
          initial={{ scale: 0, rotate: -10 }}
          whileInView={{ scale: 1, rotate: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
          className="absolute top-20 right-20 w-24 h-24 bg-peach rounded-2xl"
        />
        <motion.div
          initial={{ scale: 0 }}
          whileInView={{ scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="absolute bottom-32 left-32 w-16 h-16 bg-cyan rounded-full"
        />
        <motion.div
          initial={{ scaleY: 0 }}
          whileInView={{ scaleY: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.3 }}
          className="absolute left-1/4 top-0 w-1 h-32 bg-amber origin-top"
        />

        <div className="max-w-[1400px] mx-auto px-8 md:px-16 lg:px-24 relative z-10">
          <div className="max-w-4xl">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="flex items-center gap-3 mb-8"
            >
              <span className="w-3 h-3 bg-cyan rounded-full"></span>
              <span className="text-cyan text-sm tracking-widest uppercase">Connect</span>
            </motion.div>
            
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="font-display text-5xl md:text-7xl lg:text-8xl font-bold leading-[0.95] mb-8"
            >
              Let's Find
              <br />
              <span className="text-amber">Your Home.</span>
            </motion.h2>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-paper/60 text-lg md:text-xl max-w-xl mb-12 leading-relaxed"
            >
              Whether you're ready to buy a home, want to transform your space, 
              or just want to grab coffee and talk — I'd love to hear from you.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <Link
                href="/contact"
                className="group inline-flex items-center gap-4 px-8 py-4 bg-amber text-ink font-medium rounded-full hover:bg-peach transition-colors duration-300"
              >
                <span className="text-lg tracking-wide">Get in Touch</span>
                <span className="group-hover:translate-x-1 transition-transform">→</span>
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="mt-16 flex flex-wrap items-center gap-6 text-paper/40 text-sm"
            >
              <span>Email</span>
              <span className="w-1 h-1 bg-paper/20 rounded-full" />
              <span>LinkedIn</span>
              <span className="w-1 h-1 bg-paper/20 rounded-full" />
              <span>Instagram</span>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  )
}
