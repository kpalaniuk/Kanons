'use client'

import { motion } from 'framer-motion'
import AnimatedSection from '@/components/AnimatedSection'

export default function About() {
  return (
    <div className="page-transition pt-24">
      {/* Hero */}
      <section className="py-20 md:py-32">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <p className="text-terracotta font-medium mb-4 tracking-wider uppercase text-sm">
                About
              </p>
              <h1 className="font-display text-5xl md:text-6xl text-midnight mb-6">
                The Full Picture
              </h1>
              <p className="text-lg text-midnight/70 leading-relaxed">
                I've never been someone who fits neatly into one box. My days move between 
                spreadsheets and sound checks, strategy sessions and soccer practices. 
                I've found that the skills that make you great at one thing — listening, 
                building trust, seeing the bigger picture — translate everywhere.
              </p>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="aspect-square bg-sand rounded-2xl overflow-hidden"
            >
              {/* Placeholder for headshot */}
              <div className="w-full h-full bg-gradient-to-br from-terracotta/20 to-ocean/20 flex items-center justify-center">
                <span className="text-midnight/30 text-sm">Your photo here</span>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Story Section */}
      <AnimatedSection className="py-20 bg-sand">
        <div className="max-w-3xl mx-auto px-6">
          <h2 className="font-display text-3xl md:text-4xl text-midnight mb-8">
            My Story
          </h2>
          <div className="prose prose-lg text-midnight/70">
            <p className="mb-6">
              Based in San Diego, I've spent my career at the intersection of business 
              operations and creative pursuits. As COO at SDMC (San Diego Mortgage Couple), 
              I oversee the day-to-day operations that keep our team running smoothly and 
              our clients happy.
            </p>
            <p className="mb-6">
              But that's only part of the story. Music has been a constant thread through 
              my life — from picking up the trumpet as a kid to performing with StronGnome 
              today. There's something about the discipline of practice, the vulnerability 
              of performance, and the magic of improvisation that shapes how I approach 
              everything else.
            </p>
            <p>
              When I'm not in the office or on stage, you might find me coaching my son's 
              soccer team at FC Balboa, hosting a jazz night at Granada House, or plotting 
              the next adventure in our '91 Westfalia.
            </p>
          </div>
        </div>
      </AnimatedSection>

      {/* Community Section */}
      <AnimatedSection className="py-20 md:py-32">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <p className="text-terracotta font-medium mb-4 tracking-wider uppercase text-sm">
              Community
            </p>
            <h2 className="font-display text-4xl md:text-5xl text-midnight">
              Building Together
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* GH Sessions */}
            <div className="bg-sand rounded-2xl p-8">
              <div className="w-12 h-12 bg-terracotta/10 rounded-full flex items-center justify-center mb-6">
                <span className="text-2xl">🎵</span>
              </div>
              <h3 className="font-display text-2xl text-midnight mb-4">GH Sessions</h3>
              <p className="text-midnight/60">
                Intimate jazz nights bringing together musicians and music lovers 
                in San Diego. Good music, good company, good vibes.
              </p>
            </div>

            {/* Granada House */}
            <div className="bg-sand rounded-2xl p-8">
              <div className="w-12 h-12 bg-ocean/10 rounded-full flex items-center justify-center mb-6">
                <span className="text-2xl">🏠</span>
              </div>
              <h3 className="font-display text-2xl text-midnight mb-4">Granada House</h3>
              <p className="text-midnight/60">
                A gathering space for creativity, conversation, and connection. 
                Home to our podcast and community events.
              </p>
            </div>

            {/* FC Balboa Coaching */}
            <div className="bg-sand rounded-2xl p-8">
              <div className="w-12 h-12 bg-sunset/20 rounded-full flex items-center justify-center mb-6">
                <span className="text-2xl">⚽</span>
              </div>
              <h3 className="font-display text-2xl text-midnight mb-4">FC Balboa</h3>
              <p className="text-midnight/60">
                Coaching youth soccer — teaching teamwork, resilience, and the joy 
                of the beautiful game to the next generation.
              </p>
            </div>
          </div>
        </div>
      </AnimatedSection>

      {/* Values Section */}
      <AnimatedSection className="py-20 bg-midnight text-cream">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="font-display text-3xl md:text-4xl mb-12">
            What I Believe
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <h3 className="font-semibold text-terracotta mb-3">Connection First</h3>
              <p className="text-cream/60 text-sm">
                The best work — and life — happens when we genuinely invest in relationships.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-terracotta mb-3">Show Up Fully</h3>
              <p className="text-cream/60 text-sm">
                Whether it's a board meeting or a band rehearsal, bring your whole self.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-terracotta mb-3">Keep Growing</h3>
              <p className="text-cream/60 text-sm">
                There's always another skill to learn, another perspective to consider.
              </p>
            </div>
          </div>
        </div>
      </AnimatedSection>
    </div>
  )
}
