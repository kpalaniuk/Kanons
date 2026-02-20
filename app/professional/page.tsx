'use client'

import Link from 'next/link'
import { motion, useScroll, useTransform } from 'framer-motion'
import { useRef } from 'react'
import AnimatedSection from '@/components/AnimatedSection'
import { Briefcase, GraduationCap, Globe, Building2, Music, Palette, Mic, Mail } from 'lucide-react'

function ConnectorLine() {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  })

  const pathLength = useTransform(scrollYProgress, [0, 0.8], [0, 1])
  const dotScale1 = useTransform(scrollYProgress, [0.1, 0.2], [0, 1])
  const dotScale2 = useTransform(scrollYProgress, [0.25, 0.35], [0, 1])
  const dotScale3 = useTransform(scrollYProgress, [0.4, 0.5], [0, 1])
  const dotScale4 = useTransform(scrollYProgress, [0.55, 0.65], [0, 1])
  const dotScale5 = useTransform(scrollYProgress, [0.7, 0.8], [0, 1])

  const nodeOpacity1 = useTransform(scrollYProgress, [0.15, 0.25], [0, 1])
  const nodeOpacity2 = useTransform(scrollYProgress, [0.35, 0.45], [0, 1])
  const nodeOpacity3 = useTransform(scrollYProgress, [0.55, 0.65], [0, 1])

  const branchLength1 = useTransform(scrollYProgress, [0.2, 0.35], [0, 1])
  const branchLength2 = useTransform(scrollYProgress, [0.4, 0.55], [0, 1])
  const branchLength3 = useTransform(scrollYProgress, [0.6, 0.75], [0, 1])

  return (
    <div ref={ref} className="absolute left-6 md:left-12 top-0 bottom-0 hidden md:block" style={{ width: '200px' }}>
      {/* Main vertical line */}
      <svg className="absolute top-0 left-0 h-full" width="200" height="100%" preserveAspectRatio="none">
        <motion.line
          x1="20" y1="0" x2="20" y2="100%"
          stroke="#0066FF"
          strokeWidth="2"
          style={{ pathLength }}
        />
        {/* Branch lines going right */}
        <motion.line
          x1="20" y1="20%" x2="120" y2="18%"
          stroke="#FFBA00"
          strokeWidth="1.5"
          style={{ pathLength: branchLength1 }}
        />
        <motion.line
          x1="20" y1="45%" x2="140" y2="42%"
          stroke="#FFB366"
          strokeWidth="1.5"
          style={{ pathLength: branchLength2 }}
        />
        <motion.line
          x1="20" y1="70%" x2="100" y2="72%"
          stroke="#0066FF"
          strokeWidth="1.5"
          style={{ pathLength: branchLength3 }}
        />
      </svg>

      {/* Dots along the main line */}
      <motion.div
        className="absolute left-[14px] bg-ocean rounded-full"
        style={{ top: '8%', width: 12, height: 12, scale: dotScale1 }}
      />
      <motion.div
        className="absolute left-[14px] bg-midnight rounded-full"
        style={{ top: '25%', width: 12, height: 12, scale: dotScale2 }}
      />
      <motion.div
        className="absolute left-[14px] bg-sunset rounded-full"
        style={{ top: '45%', width: 12, height: 12, scale: dotScale3 }}
      />
      <motion.div
        className="absolute left-[14px] bg-terracotta rounded-full"
        style={{ top: '65%', width: 12, height: 12, scale: dotScale4 }}
      />
      <motion.div
        className="absolute left-[14px] bg-ocean rounded-full"
        style={{ top: '85%', width: 12, height: 12, scale: dotScale5 }}
      />

      {/* Branch endpoint nodes */}
      <motion.div
        className="absolute bg-sunset/20 border-2 border-sunset rounded-full"
        style={{ left: '112px', top: '19%', width: 16, height: 16, opacity: nodeOpacity1, translateY: '-50%' }}
      />
      <motion.div
        className="absolute bg-terracotta/20 border-2 border-terracotta rounded-full"
        style={{ left: '132px', top: '43.5%', width: 16, height: 16, opacity: nodeOpacity2, translateY: '-50%' }}
      />
      <motion.div
        className="absolute bg-ocean/20 border-2 border-ocean rounded-full"
        style={{ left: '92px', top: '71%', width: 16, height: 16, opacity: nodeOpacity3, translateY: '-50%' }}
      />

      {/* Small scattered accent dots */}
      <motion.div
        className="absolute bg-ocean/40 rounded-full"
        style={{ left: '60px', top: '15%', width: 4, height: 4, opacity: nodeOpacity1 }}
      />
      <motion.div
        className="absolute bg-midnight/30 rounded-full"
        style={{ left: '80px', top: '35%', width: 3, height: 3, opacity: nodeOpacity2 }}
      />
      <motion.div
        className="absolute bg-sunset/40 rounded-full"
        style={{ left: '50px', top: '55%', width: 5, height: 5, opacity: nodeOpacity2 }}
      />
      <motion.div
        className="absolute bg-terracotta/30 rounded-full"
        style={{ left: '70px', top: '78%', width: 4, height: 4, opacity: nodeOpacity3 }}
      />
    </div>
  )
}

function HeroWithConnector() {
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  })

  // Line grows from left — starts immediately, completes at 70%
  const lineWidth = useTransform(scrollYProgress, [0, 0.7], ['0%', '100%'])
  
  // Shapes move left and down to meet the line (they start top-right, end center-right where line reaches)
  const shapeX = useTransform(scrollYProgress, [0, 0.6], [0, -350])
  const shapeY = useTransform(scrollYProgress, [0, 0.6], [0, 200])
  const shapeScale = useTransform(scrollYProgress, [0.5, 0.7], [1, 0.6])
  const shapeOpacity = useTransform(scrollYProgress, [0, 0.05, 0.65, 0.8], [0, 1, 1, 0])
  
  // Ring that appears around shapes when line reaches them
  const ringScale = useTransform(scrollYProgress, [0.6, 0.75], [0, 1])
  const ringOpacity = useTransform(scrollYProgress, [0.6, 0.7, 0.85, 0.95], [0, 1, 1, 0])

  // Dots along the line
  const dotScale1 = useTransform(scrollYProgress, [0.15, 0.25], [0, 1])
  const dotScale2 = useTransform(scrollYProgress, [0.35, 0.45], [0, 1])
  const dotScale3 = useTransform(scrollYProgress, [0.55, 0.65], [0, 1])
  const labelOpacity1 = useTransform(scrollYProgress, [0.2, 0.3], [0, 1])
  const labelOpacity2 = useTransform(scrollYProgress, [0.4, 0.5], [0, 1])
  const labelOpacity3 = useTransform(scrollYProgress, [0.6, 0.7], [0, 1])

  return (
    <div ref={containerRef} style={{ height: '200vh' }}>
      <div className="sticky top-0 h-screen overflow-hidden">
        <div className="pt-28 md:pt-36 relative h-full">
          {/* Decorative shapes — drift toward the line */}
          <motion.div
            className="absolute top-16 right-16 md:right-28 hidden md:block z-20"
            style={{ x: shapeX, y: shapeY, scale: shapeScale, opacity: shapeOpacity }}
          >
            <div className="relative w-48 h-48">
              <div className="absolute top-0 right-0 w-32 h-32 border-2 border-ocean/30 rounded-full" />
              <div className="absolute top-6 right-6 w-20 h-20 bg-terracotta/15 rounded-full" />
              <div className="absolute bottom-2 right-12 w-14 h-14 border-2 border-sunset/40 rounded-lg rotate-12" />
              <div className="absolute top-16 right-0 w-3 h-3 bg-ocean rounded-full" />
              <div className="absolute top-2 right-20 w-2 h-2 bg-terracotta rounded-full" />
            </div>
          </motion.div>

          {/* Merge ring — appears where shapes meet the line */}
          <motion.div
            className="absolute hidden md:block z-10"
            style={{
              right: '15%',
              top: '65%',
              width: 80,
              height: 80,
              borderRadius: '50%',
              border: '2px solid #0066FF',
              scale: ringScale,
              opacity: ringOpacity,
              translateX: '50%',
              translateY: '-50%',
            }}
          />

          <div className="max-w-7xl mx-auto px-6 relative z-10">
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-terracotta font-medium mb-4 tracking-wider uppercase text-sm"
            >
              Professional
            </motion.p>
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="font-display text-5xl md:text-7xl text-midnight mb-6 max-w-4xl"
            >
              Consultant, Builder, Connector
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-xl text-midnight/60 max-w-2xl mb-16"
            >
              Mortgage planning, systems design, and strategic operations — through Granada House Design LLC.
            </motion.p>
          </div>

          {/* The connector line */}
          <div className="absolute bottom-[30%] left-0 right-0 px-6 z-10">
            <div className="max-w-7xl mx-auto relative h-12 flex items-center">
              <motion.div
                className="absolute top-1/2 left-0 h-[3px] bg-ocean rounded-full origin-left -translate-y-1/2"
                style={{ width: lineWidth }}
              />
              <motion.div
                className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-4 h-4 bg-midnight rounded-full"
                style={{ left: '25%', scale: dotScale1 }}
              />
              <motion.div
                className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-4 h-4 bg-sunset rounded-full"
                style={{ left: '50%', scale: dotScale2 }}
              />
              <motion.div
                className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-4 h-4 bg-terracotta rounded-full"
                style={{ left: '75%', scale: dotScale3 }}
              />
              <motion.p
                className="absolute top-full mt-1 text-sm font-display font-medium text-midnight/50 -translate-x-1/2"
                style={{ left: '25%', opacity: labelOpacity1 }}
              >
                connect
              </motion.p>
              <motion.p
                className="absolute top-full mt-1 text-sm font-display font-medium text-midnight/50 -translate-x-1/2"
                style={{ left: '50%', opacity: labelOpacity2 }}
              >
                build
              </motion.p>
              <motion.p
                className="absolute top-full mt-1 text-sm font-display font-medium text-midnight/50 -translate-x-1/2"
                style={{ left: '75%', opacity: labelOpacity3 }}
              >
                grow
              </motion.p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function Professional() {
  return (
    <div className="page-transition pt-24">
      {/* Hero + Connector Line (unified scroll animation) */}
      <HeroWithConnector />

      {/* Connector Visual Section — wraps everything below */}
      <div className="relative">
        <ConnectorLine />

        {/* Current Role — Granada House Design LLC */}
        <AnimatedSection className="py-20 bg-sand relative overflow-hidden">
          <div className="max-w-7xl mx-auto px-6 md:pl-56 relative z-10">
            <div className="grid md:grid-cols-2 gap-16 items-start">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <Building2 className="w-5 h-5 text-ocean" />
                  <p className="text-ocean font-medium text-sm uppercase tracking-wider">Current Role</p>
                </div>
                <h2 className="font-display text-3xl md:text-4xl text-midnight mb-2">
                  Granada House Design LLC
                </h2>
                <p className="text-terracotta font-medium mb-6">Founder & Principal Consultant</p>
                <div className="text-midnight/70 space-y-4">
                  <p>
                    Granada House Design is a multi-disciplinary consulting practice 
                    spanning mortgage planning, business operations, interior design, 
                    and creative ventures — all rooted in San Diego&apos;s North Park neighborhood.
                  </p>
                  <p>
                    Through GH Design, I serve as a strategic consultant across several 
                    organizations, bringing systems thinking and operational expertise 
                    to every engagement.
                  </p>
                </div>
              </div>
              
              <div className="bg-cream rounded-2xl p-8">
                <h3 className="font-semibold text-midnight mb-6">Consulting Engagements</h3>
                <ul className="space-y-5">
                  <li className="flex items-start gap-3">
                    <span className="w-2 h-2 bg-ocean rounded-full mt-2 flex-shrink-0" />
                    <div>
                      <p className="font-medium text-midnight">Plan Prepare Home</p>
                      <p className="text-midnight/60 text-sm">Mortgage brokerage — education-driven lending, automation-forward operations</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="w-2 h-2 bg-ocean rounded-full mt-2 flex-shrink-0" />
                    <div>
                      <p className="font-medium text-midnight">SDMC (San Diego Mortgage Couple)</p>
                      <p className="text-midnight/60 text-sm">Operations leadership, systems design, team coordination</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="w-2 h-2 bg-ocean rounded-full mt-2 flex-shrink-0" />
                    <div>
                      <p className="font-medium text-midnight">C2 Financial Corporation</p>
                      <p className="text-midnight/60 text-sm">Licensed mortgage broker — DRE #02200765</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="w-2 h-2 bg-terracotta rounded-full mt-2 flex-shrink-0" />
                    <div>
                      <p className="font-medium text-midnight">GH Design Studio</p>
                      <p className="text-midnight/60 text-sm">Interior design and renovation — led by Paige Palaniuk</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="w-2 h-2 bg-terracotta rounded-full mt-2 flex-shrink-0" />
                    <div>
                      <p className="font-medium text-midnight">Granada House Events & Sessions</p>
                      <p className="text-midnight/60 text-sm">Curated music events, community programming, creative space</p>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </AnimatedSection>

        {/* Quote */}
        <AnimatedSection className="py-16 md:py-24 relative">
          <div className="max-w-7xl mx-auto px-6 md:pl-56">
            <div className="max-w-2xl">
              <div className="flex gap-4">
                <div className="w-1 bg-ocean rounded-full flex-shrink-0" />
                <div>
                  <p className="font-display text-2xl md:text-3xl text-midnight leading-snug mb-4">
                    &ldquo;Art isn&apos;t just about what you make — it&apos;s about the space you create for others to step into and express themselves.&rdquo;
                  </p>
                  <p className="text-midnight/50 text-sm font-medium">
                    — Granada House Podcast, Episode 1
                  </p>
                </div>
              </div>
            </div>
          </div>
        </AnimatedSection>

        {/* Background */}
        <AnimatedSection className="py-20 md:py-32 bg-sand">
          <div className="max-w-7xl mx-auto px-6 md:pl-56">
            <div className="mb-16">
              <p className="text-terracotta font-medium mb-4 tracking-wider uppercase text-sm">
                Background
              </p>
              <h2 className="font-display text-4xl md:text-5xl text-midnight">
                Education & Experience
              </h2>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <div className="border border-midnight/10 rounded-2xl p-8 hover:border-ocean/30 transition-colors bg-cream">
                <GraduationCap className="w-8 h-8 text-ocean mb-4" />
                <h3 className="font-display text-xl text-midnight mb-2">Education</h3>
                <p className="font-medium text-midnight mb-1">B.A. International Economic Analysis</p>
                <p className="text-midnight/60 text-sm mb-4">Pacific Lutheran University</p>
                <p className="text-midnight/60 text-sm">
                  Cross-disciplinary study of global markets, trade policy, and economic systems — 
                  a foundation for understanding how money moves and how to help people navigate it.
                </p>
              </div>

              <div className="border border-midnight/10 rounded-2xl p-8 hover:border-ocean/30 transition-colors bg-cream">
                <Briefcase className="w-8 h-8 text-ocean mb-4" />
                <h3 className="font-display text-xl text-midnight mb-2">Mortgage Planning</h3>
                <p className="font-medium text-midnight mb-1">NMLS #984138</p>
                <p className="text-midnight/60 text-sm mb-4">Licensed Mortgage Broker</p>
                <p className="text-midnight/60 text-sm">
                  Deep expertise in purchase lending, refinance strategy, DSCR investment analysis, 
                  and creative financing solutions. Education-first approach — clients understand 
                  every number before they sign.
                </p>
              </div>

              <div className="border border-midnight/10 rounded-2xl p-8 hover:border-ocean/30 transition-colors bg-cream">
                <Music className="w-8 h-8 text-ocean mb-4" />
                <h3 className="font-display text-xl text-midnight mb-2">Music</h3>
                <p className="font-medium text-midnight mb-1">Trumpet · Keyboards · Vocals</p>
                <p className="text-midnight/60 text-sm mb-4">Jazz, Funk & Live Performance</p>
                <p className="text-midnight/60 text-sm">
                  Lifelong musician and band leader. Trumpet is the primary voice — jazz roots 
                  with funk, soul, and experimental edges. Performs with multiple San Diego bands 
                  and produces through Granada House Sessions.
                </p>
              </div>

              <div className="border border-midnight/10 rounded-2xl p-8 hover:border-ocean/30 transition-colors bg-cream">
                <Globe className="w-8 h-8 text-ocean mb-4" />
                <h3 className="font-display text-xl text-midnight mb-2">Global Perspective</h3>
                <p className="font-medium text-midnight mb-1">Extensive Travel & Volunteering</p>
                <p className="text-midnight/60 text-sm mb-4">30+ countries across 5 continents</p>
                <p className="text-midnight/60 text-sm">
                  Years of international travel and community volunteering shaped a worldview 
                  grounded in adaptability, cultural fluency, and genuine human connection.
                </p>
              </div>
            </div>
          </div>
        </AnimatedSection>

        {/* Second Quote */}
        <AnimatedSection className="py-16 md:py-24 relative">
          <div className="max-w-7xl mx-auto px-6 md:pl-56">
            <div className="max-w-2xl ml-auto">
              <div className="flex gap-4">
                <div className="w-1 bg-sunset rounded-full flex-shrink-0" />
                <div>
                  <p className="font-display text-2xl md:text-3xl text-midnight leading-snug mb-4">
                    &ldquo;We don&apos;t just help people buy homes — we help them build a life.&rdquo;
                  </p>
                  <p className="text-midnight/50 text-sm font-medium">
                    — Granada House Podcast, Episode 5
                  </p>
                </div>
              </div>
            </div>
          </div>
        </AnimatedSection>

        {/* Granada House Ecosystem */}
        <AnimatedSection className="py-20 bg-sand">
          <div className="max-w-7xl mx-auto px-6 md:pl-56">
            <div className="mb-16">
              <p className="text-terracotta font-medium mb-4 tracking-wider uppercase text-sm">
                Ventures
              </p>
              <h2 className="font-display text-4xl md:text-5xl text-midnight">
                The Granada House Ecosystem
              </h2>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <div className="border border-midnight/10 rounded-2xl p-8 hover:border-terracotta/30 transition-colors bg-cream">
                <Building2 className="w-6 h-6 text-terracotta mb-3" />
                <h3 className="font-display text-2xl text-midnight mb-4">Plan Prepare Home</h3>
                <p className="text-midnight/60 mb-4">
                  Education-driven mortgage brokerage. Automation-forward operations, 
                  transparent lending, and a genuine focus on client financial health.
                </p>
                <span className="text-terracotta text-sm font-medium">Mortgage & Real Estate</span>
              </div>

              <div className="border border-midnight/10 rounded-2xl p-8 hover:border-terracotta/30 transition-colors bg-cream">
                <Palette className="w-6 h-6 text-terracotta mb-3" />
                <h3 className="font-display text-2xl text-midnight mb-4">GH Design</h3>
                <p className="text-midnight/60 mb-4">
                  Interior design and renovation, led by Paige. Transforming spaces 
                  with warm, intentional aesthetic — mid-century meets modern.
                </p>
                <span className="text-terracotta text-sm font-medium">Design Services</span>
              </div>

              <div className="border border-midnight/10 rounded-2xl p-8 hover:border-terracotta/30 transition-colors bg-cream">
                <Music className="w-6 h-6 text-terracotta mb-3" />
                <h3 className="font-display text-2xl text-midnight mb-4">GH Sessions</h3>
                <p className="text-midnight/60 mb-4">
                  Curated jazz and live music events bringing together musicians and 
                  community for intimate performances and genuine connection.
                </p>
                <span className="text-terracotta text-sm font-medium">Events & Music</span>
              </div>

              <div className="border border-midnight/10 rounded-2xl p-8 hover:border-terracotta/30 transition-colors bg-cream">
                <Mic className="w-6 h-6 text-terracotta mb-3" />
                <h3 className="font-display text-2xl text-midnight mb-4">Granada House Podcast</h3>
                <p className="text-midnight/60 mb-4">
                  Conversations about business, creativity, and what it means to 
                  build a meaningful life in community.
                </p>
                <span className="text-terracotta text-sm font-medium">Media & Content</span>
              </div>
            </div>
          </div>
        </AnimatedSection>
      </div>
      {/* End Connector Visual Section */}

      {/* Skills & Expertise */}
      <AnimatedSection className="py-20 bg-midnight text-cream">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="font-display text-3xl md:text-4xl mb-12 text-center">
            Expertise
          </h2>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              'Mortgage Planning',
              'Operations Design',
              'Team Leadership',
              'Financial Analysis',
              'Systems Architecture',
              'Process Automation',
              'Client Strategy',
              'Community Building',
            ].map((skill, index) => (
              <motion.div
                key={skill}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="bg-cream/5 rounded-lg p-4 text-center"
              >
                <span className="text-sm">{skill}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </AnimatedSection>

      {/* CTA */}
      <AnimatedSection className="py-20 md:py-32">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="font-display text-3xl md:text-4xl text-midnight mb-6">
            Let&apos;s Connect
          </h2>
          <p className="text-midnight/60 text-lg mb-8 max-w-xl mx-auto">
            Whether you&apos;re exploring mortgage options, looking for operational consulting, 
            or want to collaborate on something creative.
          </p>
          <div className="flex items-center justify-center gap-4 flex-wrap">
            <a
              href="mailto:kyle@palaniuk.net"
              className="inline-flex items-center gap-2 px-8 py-3 bg-midnight text-cream rounded-full font-medium hover:bg-ocean transition-colors"
            >
              <Mail className="w-4 h-4" />
              kyle@palaniuk.net
            </a>
            <Link
              href="/contact"
              className="inline-block px-8 py-3 border border-midnight/20 text-midnight rounded-full font-medium hover:border-ocean hover:text-ocean transition-colors"
            >
              Contact Page
            </Link>
          </div>
        </div>
      </AnimatedSection>
    </div>
  )
}
