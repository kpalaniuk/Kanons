'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import AnimatedSection from '@/components/AnimatedSection'

// Animation variants for orchestrated entrance
const lineVariants = {
  hidden: { scaleX: 0 },
  visible: (i: number) => ({
    scaleX: 1,
    transition: {
      duration: 1.2,
      delay: 0.3 + i * 0.1,
      ease: [0.22, 1, 0.36, 1]
    }
  })
}

const fadeUpVariants = {
  hidden: { opacity: 0, y: 60 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 1,
      delay: 0.1 + i * 0.15,
      ease: [0.22, 1, 0.36, 1]
    }
  })
}

const letterVariants = {
  hidden: { opacity: 0, y: 100 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      delay: 0.4 + i * 0.05,
      ease: [0.22, 1, 0.36, 1]
    }
  })
}

export default function Home() {
  const firstName = "Kyle"
  const lastName = "Palaniuk"

  return (
    <div className="page-transition grain-overlay">
      {/* Hero Section */}
      <section className="min-h-screen flex items-center relative overflow-hidden">
        {/* Layered background */}
        <div className="absolute inset-0 hero-gradient" />
        
        {/* Animated gradient orbs */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 2, delay: 0.5, ease: "easeOut" }}
          className="absolute -top-40 -right-40 w-[700px] h-[700px] rounded-full bg-gradient-to-br from-terracotta/20 via-sunset/10 to-transparent blur-3xl"
        />
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 2, delay: 0.8, ease: "easeOut" }}
          className="absolute -bottom-60 -left-40 w-[600px] h-[600px] rounded-full bg-gradient-to-tr from-ocean/15 via-midnight/5 to-transparent blur-3xl"
        />
        
        {/* Floating geometric accents */}
        <motion.div
          initial={{ opacity: 0, rotate: -10 }}
          animate={{ opacity: 0.4, rotate: 0 }}
          transition={{ duration: 1.5, delay: 1 }}
          className="absolute top-[20%] right-[10%] w-32 h-32 border border-terracotta/30 rounded-full"
        />
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 0.3, scale: 1 }}
          transition={{ duration: 1, delay: 1.2 }}
          className="absolute top-[25%] right-[8%] w-4 h-4 bg-terracotta rounded-full"
        />
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.2 }}
          transition={{ duration: 1.5, delay: 1.4 }}
          className="absolute bottom-[30%] left-[8%] w-48 h-48 border border-ocean/20 rotate-45"
        />

        {/* Main content */}
        <div className="relative z-10 w-full max-w-[1400px] mx-auto px-8 md:px-16 lg:px-24">
          {/* Top line decoration */}
          <motion.div
            custom={0}
            variants={lineVariants}
            initial="hidden"
            animate="visible"
            className="h-px bg-gradient-to-r from-terracotta via-midnight/20 to-transparent mb-8 md:mb-12 origin-left max-w-md"
          />
          
          {/* Location tag */}
          <motion.div
            custom={0}
            variants={fadeUpVariants}
            initial="hidden"
            animate="visible"
            className="flex items-center gap-3 mb-6 md:mb-8"
          >
            <span className="w-8 h-px bg-terracotta"></span>
            <p className="text-terracotta font-medium tracking-[0.25em] uppercase text-xs">
              San Diego, California
            </p>
          </motion.div>
          
          {/* Name - Split into dramatic lines */}
          <div className="mb-8 md:mb-12 overflow-hidden">
            {/* First name - lighter weight */}
            <div className="overflow-hidden">
              <motion.h1
                custom={1}
                variants={fadeUpVariants}
                initial="hidden"
                animate="visible"
                className="font-display text-[15vw] md:text-[12vw] lg:text-[10vw] leading-[0.85] font-normal text-midnight/80 tracking-[-0.03em]"
              >
                {firstName}
              </motion.h1>
            </div>
            
            {/* Last name - heavier, indented */}
            <div className="overflow-hidden md:ml-[10%]">
              <motion.h1
                custom={2}
                variants={fadeUpVariants}
                initial="hidden"
                animate="visible"
                className="font-display text-[15vw] md:text-[12vw] lg:text-[10vw] leading-[0.85] font-semibold text-midnight tracking-[-0.03em]"
              >
                {lastName}
              </motion.h1>
            </div>
          </div>

          {/* Tagline with animated line */}
          <div className="flex flex-col md:flex-row md:items-center gap-6 md:gap-12 mb-12 md:mb-16">
            <motion.div
              custom={1}
              variants={lineVariants}
              initial="hidden"
              animate="visible"
              className="hidden md:block h-px w-24 bg-midnight/30 origin-left"
            />
            <motion.p
              custom={3}
              variants={fadeUpVariants}
              initial="hidden"
              animate="visible"
              className="text-lg md:text-xl lg:text-2xl text-midnight/60 max-w-lg font-light leading-relaxed"
            >
              Building businesses, bands, and community
            </motion.p>
          </div>

          {/* CTAs with hover states */}
          <motion.div
            custom={4}
            variants={fadeUpVariants}
            initial="hidden"
            animate="visible"
            className="flex flex-wrap items-center gap-6 md:gap-8"
          >
            <Link
              href="/about"
              className="group relative px-8 py-4 bg-midnight text-cream font-medium overflow-hidden transition-all duration-500 hover:shadow-2xl hover:shadow-midnight/20"
            >
              <span className="relative z-10 tracking-wide">Explore</span>
              <span className="absolute inset-0 bg-terracotta transform translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out"></span>
            </Link>
            <Link
              href="/music"
              className="group flex items-center gap-3 text-midnight font-medium hover:text-terracotta transition-colors duration-300"
            >
              <span className="tracking-wide">Hear the Music</span>
              <span className="w-8 h-px bg-current transform origin-left group-hover:scale-x-150 transition-transform duration-300"></span>
            </Link>
          </motion.div>

          {/* Role badges - positioned absolutely on larger screens */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, delay: 1.2, ease: [0.22, 1, 0.36, 1] }}
            className="hidden lg:flex flex-col gap-3 absolute right-24 top-1/2 -translate-y-1/2"
          >
            {['Operations', 'Music', 'Community'].map((role, i) => (
              <motion.div
                key={role}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 1.4 + i * 0.1 }}
                className="px-4 py-2 border border-midnight/10 text-midnight/50 text-xs tracking-[0.2em] uppercase backdrop-blur-sm"
              >
                {role}
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Scroll indicator - repositioned */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2, duration: 0.8 }}
          className="absolute bottom-12 left-8 md:left-16 lg:left-24 flex items-center gap-4"
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
            className="w-px h-16 bg-gradient-to-b from-transparent via-midnight/40 to-midnight/40"
          />
          <span className="text-xs tracking-[0.2em] uppercase text-midnight/40 rotate-90 origin-left translate-x-4">
            Scroll
          </span>
        </motion.div>

        {/* Bottom decorative line */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 1.5, delay: 1, ease: [0.22, 1, 0.36, 1] }}
          className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-midnight/10 to-transparent origin-center"
        />
      </section>

      {/* Quick Intro Section */}
      <AnimatedSection className="py-32 md:py-48 bg-sand relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-midnight/5 to-transparent" />
        <div className="absolute right-16 top-32 w-64 h-64 border border-terracotta/10 rounded-full opacity-50" />
        
        <div className="max-w-[1400px] mx-auto px-8 md:px-16 lg:px-24">
          <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">
            {/* Left column - heading */}
            <div>
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                className="flex items-center gap-4 mb-6"
              >
                <span className="w-12 h-px bg-terracotta"></span>
                <span className="text-terracotta text-xs tracking-[0.3em] uppercase">Philosophy</span>
              </motion.div>
              <motion.h2
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
                className="font-display text-4xl md:text-5xl lg:text-6xl text-midnight leading-[1.1] mb-8"
              >
                Where Business
                <br />
                <span className="text-midnight/40">Meets</span> Creativity
              </motion.h2>
            </div>

            {/* Right column - content */}
            <div>
              <motion.p
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
                className="text-lg md:text-xl text-midnight/60 leading-relaxed mb-10"
              >
                By day, I lead operations in the mortgage and real estate industry. By night, 
                you'll find me on stage with my trumpet or bringing people together through 
                curated events. I believe the best work happens when we build genuine 
                connections — whether that's in the boardroom or on the bandstand.
              </motion.p>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="flex flex-wrap gap-3"
              >
                {['Operations Leadership', 'Trumpet & Vocals', 'Event Curation', 'Community Building'].map((tag, i) => (
                  <motion.span
                    key={tag}
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: 0.4 + i * 0.05 }}
                    className="px-4 py-2 border border-midnight/10 text-midnight/60 text-sm tracking-wide hover:border-terracotta/30 hover:text-terracotta transition-colors duration-300"
                  >
                    {tag}
                  </motion.span>
                ))}
              </motion.div>
            </div>
          </div>
        </div>
      </AnimatedSection>

      {/* Featured Sections Preview */}
      <section className="py-32 md:py-48 relative overflow-hidden">
        <div className="max-w-[1400px] mx-auto px-8 md:px-16 lg:px-24">
          {/* Section header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="flex items-end justify-between mb-16 md:mb-24"
          >
            <div>
              <div className="flex items-center gap-4 mb-4">
                <span className="w-12 h-px bg-ocean"></span>
                <span className="text-ocean text-xs tracking-[0.3em] uppercase">Explore</span>
              </div>
              <h2 className="font-display text-4xl md:text-5xl lg:text-6xl text-midnight">
                What I Do
              </h2>
            </div>
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="hidden md:block text-midnight/40 text-sm"
            >
              03 Pillars
            </motion.div>
          </motion.div>

          {/* Cards grid with staggered reveal */}
          <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
            {[
              {
                href: '/music',
                label: '01',
                category: 'Music',
                title: 'StronGnome',
                subtitle: 'Trumpet, vocals, and original compositions',
                gradient: 'from-midnight via-ocean to-midnight',
                accentColor: 'terracotta'
              },
              {
                href: '/professional',
                label: '02',
                category: 'Professional',
                title: 'Business',
                subtitle: 'Operations, strategy, and leadership',
                gradient: 'from-ocean via-midnight to-ocean',
                accentColor: 'sunset'
              },
              {
                href: '/about',
                label: '03',
                category: 'Community',
                title: 'Gathering',
                subtitle: 'Events, coaching, and connection',
                gradient: 'from-terracotta via-sunset to-terracotta',
                accentColor: 'cream'
              }
            ].map((card, i) => (
              <motion.div
                key={card.href}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: i * 0.15, ease: [0.22, 1, 0.36, 1] }}
              >
                <Link href={card.href} className="group block">
                  <div className={`aspect-[4/5] bg-gradient-to-br ${card.gradient} overflow-hidden relative`}>
                    {/* Overlay gradient */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent z-10" />
                    
                    {/* Animated corner accent */}
                    <div className="absolute top-0 right-0 w-20 h-20 z-20">
                      <motion.div
                        className={`absolute top-4 right-4 w-full h-px bg-${card.accentColor} origin-right`}
                        initial={{ scaleX: 0 }}
                        whileInView={{ scaleX: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.3 + i * 0.1 }}
                      />
                      <motion.div
                        className={`absolute top-4 right-4 h-full w-px bg-${card.accentColor} origin-top`}
                        initial={{ scaleY: 0 }}
                        whileInView={{ scaleY: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.4 + i * 0.1 }}
                      />
                    </div>
                    
                    {/* Number label */}
                    <div className="absolute top-6 left-6 z-20">
                      <span className="text-white/30 text-xs tracking-widest font-light">{card.label}</span>
                    </div>
                    
                    {/* Content */}
                    <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8 z-20">
                      <p className={`text-${card.accentColor} text-xs tracking-[0.2em] uppercase mb-3 opacity-80`}>
                        {card.category}
                      </p>
                      <h3 className="font-display text-3xl md:text-4xl text-cream mb-0 group-hover:translate-x-2 transition-transform duration-500">
                        {card.title}
                      </h3>
                    </div>
                    
                    {/* Hover overlay */}
                    <div className="absolute inset-0 bg-midnight/0 group-hover:bg-midnight/20 transition-colors duration-500 z-[5]" />
                  </div>
                  
                  {/* Below card text */}
                  <div className="mt-4 flex items-center justify-between">
                    <p className="text-midnight/50 text-sm group-hover:text-midnight transition-colors duration-300">
                      {card.subtitle}
                    </p>
                    <span className="w-6 h-px bg-midnight/20 group-hover:w-10 group-hover:bg-terracotta transition-all duration-300" />
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 md:py-48 bg-midnight text-cream relative overflow-hidden">
        {/* Background texture */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-0 left-1/4 w-px h-full bg-gradient-to-b from-transparent via-cream/10 to-transparent" />
          <div className="absolute top-0 right-1/3 w-px h-full bg-gradient-to-b from-transparent via-cream/5 to-transparent" />
        </div>
        
        {/* Gradient orbs */}
        <div className="absolute -top-40 -left-40 w-[400px] h-[400px] rounded-full bg-terracotta/10 blur-3xl" />
        <div className="absolute -bottom-40 -right-40 w-[500px] h-[500px] rounded-full bg-ocean/10 blur-3xl" />

        <div className="max-w-[1400px] mx-auto px-8 md:px-16 lg:px-24 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-24 items-center">
            <div>
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="flex items-center gap-4 mb-6"
              >
                <span className="w-12 h-px bg-terracotta"></span>
                <span className="text-terracotta text-xs tracking-[0.3em] uppercase">Connect</span>
              </motion.div>
              
              <motion.h2
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.1 }}
                className="font-display text-5xl md:text-6xl lg:text-7xl leading-[1] mb-8"
              >
                Let's Build
                <br />
                <span className="text-cream/40">Something</span>
              </motion.h2>
              
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="text-cream/50 text-lg max-w-md leading-relaxed"
              >
                Whether you're looking for a collaborator, need operational expertise, 
                or just want to talk music — I'd love to hear from you.
              </motion.p>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="lg:text-right"
            >
              <Link
                href="/contact"
                className="group inline-flex items-center gap-6"
              >
                <span className="text-4xl md:text-5xl lg:text-6xl font-display text-cream group-hover:text-terracotta transition-colors duration-500">
                  Get in Touch
                </span>
                <span className="w-12 h-12 md:w-16 md:h-16 border border-cream/30 flex items-center justify-center group-hover:border-terracotta group-hover:bg-terracotta transition-all duration-500">
                  <svg className="w-5 h-5 md:w-6 md:h-6 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 17L17 7M17 7H7M17 7v10" />
                  </svg>
                </span>
              </Link>
              
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.5 }}
                className="mt-12 flex items-center gap-8 lg:justify-end text-cream/30 text-sm"
              >
                <span>Email</span>
                <span className="w-8 h-px bg-cream/20" />
                <span>LinkedIn</span>
                <span className="w-8 h-px bg-cream/20" />
                <span>Instagram</span>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  )
}
