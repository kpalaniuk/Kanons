'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import KeepyUppy from '@/components/KeepyUppy'

export default function Home() {
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    setIsLoaded(true)
  }, [])

  return (
    <div className="page-transition">
      {/* Hero Section with Keepy Uppy */}
      <section className="min-h-screen flex items-center relative overflow-hidden bg-paper">
        
        {/* Keepy Uppy Interactive Background */}
        <KeepyUppy />

        {/* Main content */}
        <div className="relative z-10 w-full max-w-[1400px] mx-auto px-8 md:px-16 lg:px-24 py-32">
          {/* Location tag */}
          <div
            className={`flex items-center gap-3 mb-8 transition-all duration-700 ${
              isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
            }`}
            style={{ transitionDelay: '0ms' }}
          >
            <span className="w-3 h-3 bg-amber rounded-full"></span>
            <p className="text-steel font-medium tracking-wide text-sm">
              San Diego, California
            </p>
          </div>
          
          {/* Name */}
          <div className="mb-10">
            <h1
              className={`font-display text-[13vw] md:text-[10vw] lg:text-[8vw] leading-[0.9] font-bold text-ink tracking-[-0.02em] transition-all duration-700 ${
                isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
              }`}
              style={{ transitionDelay: '100ms' }}
            >
              Kyle
            </h1>
            <h1
              className={`font-display text-[13vw] md:text-[10vw] lg:text-[8vw] leading-[0.9] font-bold text-ink tracking-[-0.02em] md:ml-[15%] transition-all duration-700 ${
                isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
              }`}
              style={{ transitionDelay: '200ms' }}
            >
              Palaniuk<span className="text-royal">.</span>
            </h1>
          </div>

          {/* Tagline */}
          <p
            className={`text-xl md:text-2xl text-steel max-w-xl mb-12 leading-relaxed transition-all duration-700 ${
              isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
            }`}
            style={{ transitionDelay: '300ms' }}
          >
            Helping people find home. Building community. Making music.
          </p>

          {/* CTAs */}
          <div
            className={`flex flex-wrap items-center gap-4 md:gap-6 transition-all duration-700 ${
              isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
            }`}
            style={{ transitionDelay: '400ms' }}
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
          </div>

          {/* Role badges */}
          <div
            className={`mt-16 flex flex-wrap gap-3 transition-all duration-700 ${
              isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
            }`}
            style={{ transitionDelay: '600ms' }}
          >
            {[
              { label: 'Home Buying Guide', color: 'bg-royal' },
              { label: 'Musician', color: 'bg-amber' },
              { label: 'Community Builder', color: 'bg-cyan' }
            ].map((role, i) => (
              <div
                key={role.label}
                className="flex items-center gap-2 px-4 py-2 bg-paper border border-ink/10 rounded-full"
                style={{
                  opacity: isLoaded ? 1 : 0,
                  transform: isLoaded ? 'scale(1)' : 'scale(0.8)',
                  transition: `all 0.4s ease-out ${700 + i * 100}ms`,
                }}
              >
                <span className={`w-2 h-2 ${role.color} rounded-full`}></span>
                <span className="text-sm text-ink/70">{role.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Scroll indicator */}
        <div
          className={`absolute bottom-8 left-1/2 -translate-x-1/2 transition-opacity duration-700 ${
            isLoaded ? 'opacity-100' : 'opacity-0'
          }`}
          style={{ transitionDelay: '1000ms' }}
        >
          <div className="flex flex-col items-center gap-2 scroll-bounce">
            <span className="text-xs text-steel tracking-widest uppercase">Scroll</span>
            <div className="w-px h-8 bg-gradient-to-b from-ink/40 to-transparent" />
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-32 md:py-40 bg-ink text-paper relative overflow-hidden">
        <div className="absolute top-20 right-20 w-32 h-32 bg-royal/20 rounded-full blur-2xl" />
        <div className="absolute bottom-20 left-20 w-48 h-48 bg-amber/10 rounded-full blur-3xl" />
        
        <div className="max-w-[1400px] mx-auto px-8 md:px-16 lg:px-24">
          <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-start">
            <div>
              <div className="flex items-center gap-3 mb-6 fade-in-up">
                <span className="w-3 h-3 bg-amber rounded-full"></span>
                <span className="text-amber text-sm tracking-widest uppercase">Philosophy</span>
              </div>
              <h2 className="font-display text-5xl md:text-6xl lg:text-7xl font-bold leading-[0.95] mb-8 fade-in-up" style={{ animationDelay: '100ms' }}>
                There's a House
                <br />
                <span className="text-cyan">Then There's</span> Home
              </h2>
            </div>

            <div className="lg:pt-20">
              <p className="text-lg md:text-xl text-paper/70 leading-relaxed mb-6 fade-in-up" style={{ animationDelay: '200ms' }}>
                By day, I help people navigate the path to homeownership — mortgages, real estate, 
                the whole journey. By night, you'll find me on stage with my trumpet, coaching my 
                kids' soccer team, or riding my skateboard around the neighborhood.
              </p>
              <p className="text-lg md:text-xl text-paper/70 leading-relaxed mb-10 fade-in-up" style={{ animationDelay: '300ms' }}>
                I believe we work too much and play too little. That arts and music are therapy. 
                That the best work happens in uncomfortable spaces — if you're afraid of awkward 
                moments, lean into them.
              </p>
              
              <div className="flex flex-wrap gap-3 fade-in-up" style={{ animationDelay: '400ms' }}>
                {['Home Buying', 'Trumpet & Vocals', 'Soccer Coach', 'Volunteer', 'Dad'].map((tag) => (
                  <span
                    key={tag}
                    className="px-4 py-2 bg-paper/5 border border-paper/10 rounded-full text-sm text-paper/60 hover:bg-paper/10 hover:text-paper transition-colors duration-300"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* What I Do Section */}
      <section className="py-32 md:py-40 bg-paper relative overflow-hidden">
        <div className="absolute top-40 right-0 w-64 h-2 bg-peach fade-in" />
        <div className="absolute bottom-40 left-0 w-32 h-32 bg-sky/20 rounded-full blur-2xl fade-in" />

        <div className="max-w-[1400px] mx-auto px-8 md:px-16 lg:px-24">
          <div className="flex items-end justify-between mb-16 md:mb-20 fade-in-up">
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
          </div>

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
              <div
                key={card.href}
                className="fade-in-up"
                style={{ animationDelay: `${i * 150}ms` }}
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
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 md:py-40 bg-ink text-paper relative overflow-hidden">
        <div className="absolute top-20 right-20 w-24 h-24 bg-peach rounded-2xl fade-in-scale" />
        <div className="absolute bottom-32 left-32 w-16 h-16 bg-cyan rounded-full fade-in-scale" style={{ animationDelay: '200ms' }} />
        <div className="absolute left-1/4 top-0 w-1 h-32 bg-amber fade-in-down" style={{ animationDelay: '300ms' }} />

        <div className="max-w-[1400px] mx-auto px-8 md:px-16 lg:px-24 relative z-10">
          <div className="max-w-4xl">
            <div className="flex items-center gap-3 mb-8 fade-in-up">
              <span className="w-3 h-3 bg-cyan rounded-full"></span>
              <span className="text-cyan text-sm tracking-widest uppercase">Connect</span>
            </div>
            
            <h2 className="font-display text-5xl md:text-7xl lg:text-8xl font-bold leading-[0.95] mb-8 fade-in-up" style={{ animationDelay: '100ms' }}>
              Let's Find
              <br />
              <span className="text-amber">Your Home.</span>
            </h2>
            
            <p className="text-paper/60 text-lg md:text-xl max-w-xl mb-12 leading-relaxed fade-in-up" style={{ animationDelay: '200ms' }}>
              Whether you're ready to buy a home, want to transform your space, 
              or just want to grab coffee and talk — I'd love to hear from you.
            </p>

            <div className="fade-in-up" style={{ animationDelay: '300ms' }}>
              <Link
                href="/contact"
                className="group inline-flex items-center gap-4 px-8 py-4 bg-amber text-ink font-medium rounded-full hover:bg-peach transition-colors duration-300"
              >
                <span className="text-lg tracking-wide">Get in Touch</span>
                <span className="group-hover:translate-x-1 transition-transform">→</span>
              </Link>
            </div>

            <div className="mt-16 flex flex-wrap items-center gap-6 text-paper/40 text-sm fade-in-up" style={{ animationDelay: '500ms' }}>
              <span>Email</span>
              <span className="w-1 h-1 bg-paper/20 rounded-full" />
              <span>LinkedIn</span>
              <span className="w-1 h-1 bg-paper/20 rounded-full" />
              <span>Instagram</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
