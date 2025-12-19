'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import AnimatedSection from '@/components/AnimatedSection'

export default function Professional() {
  return (
    <div className="page-transition pt-24">
      {/* Hero */}
      <section className="py-20 md:py-32">
        <div className="max-w-7xl mx-auto px-6">
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
            Operations Leadership & Strategic Growth
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-xl text-midnight/60 max-w-2xl"
          >
            Building efficient systems and leading teams in the mortgage and real estate industry.
          </motion.p>
        </div>
      </section>

      {/* Current Role */}
      <AnimatedSection className="py-20 bg-sand">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <p className="text-ocean font-medium mb-2 text-sm uppercase tracking-wider">Current Role</p>
              <h2 className="font-display text-3xl md:text-4xl text-midnight mb-2">
                Chief Operating Officer
              </h2>
              <p className="text-terracotta font-medium mb-6">SDMC (San Diego Mortgage Couple)</p>
              <div className="text-midnight/70 space-y-4">
                <p>
                  As COO, I oversee the operational backbone that keeps our team 
                  running smoothly. From systems optimization to team coordination, 
                  my focus is on creating the infrastructure that lets our people 
                  do their best work.
                </p>
                <p>
                  We've built SDMC on the principle that the mortgage process doesn't 
                  have to be stressful. By investing in operations, we ensure our 
                  clients get a seamless experience from first call to closing.
                </p>
              </div>
            </div>
            
            <div className="bg-cream rounded-2xl p-8">
              <h3 className="font-semibold text-midnight mb-6">Key Focus Areas</h3>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <span className="w-2 h-2 bg-terracotta rounded-full mt-2" />
                  <div>
                    <p className="font-medium text-midnight">Systems & Process Design</p>
                    <p className="text-midnight/60 text-sm">Building workflows that scale</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-2 h-2 bg-terracotta rounded-full mt-2" />
                  <div>
                    <p className="font-medium text-midnight">Team Leadership</p>
                    <p className="text-midnight/60 text-sm">Developing people and culture</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-2 h-2 bg-terracotta rounded-full mt-2" />
                  <div>
                    <p className="font-medium text-midnight">Strategic Planning</p>
                    <p className="text-midnight/60 text-sm">Long-term vision and execution</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-2 h-2 bg-terracotta rounded-full mt-2" />
                  <div>
                    <p className="font-medium text-midnight">Client Experience</p>
                    <p className="text-midnight/60 text-sm">Ensuring seamless service delivery</p>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </AnimatedSection>

      {/* Granada House Ecosystem */}
      <AnimatedSection className="py-20 md:py-32">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <p className="text-terracotta font-medium mb-4 tracking-wider uppercase text-sm">
              Ventures
            </p>
            <h2 className="font-display text-4xl md:text-5xl text-midnight">
              The Granada House Ecosystem
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="border border-midnight/10 rounded-2xl p-8 hover:border-terracotta/30 transition-colors">
              <h3 className="font-display text-2xl text-midnight mb-4">GH Group</h3>
              <p className="text-midnight/60 mb-4">
                Mortgage and real estate services built on trust, transparency, 
                and genuine care for our clients' financial futures.
              </p>
              <span className="text-terracotta text-sm font-medium">Mortgage & Real Estate</span>
            </div>

            <div className="border border-midnight/10 rounded-2xl p-8 hover:border-terracotta/30 transition-colors">
              <h3 className="font-display text-2xl text-midnight mb-4">GH Sessions</h3>
              <p className="text-midnight/60 mb-4">
                Curated jazz events bringing together musicians and music lovers 
                for intimate performances and genuine connection.
              </p>
              <span className="text-terracotta text-sm font-medium">Events & Entertainment</span>
            </div>

            <div className="border border-midnight/10 rounded-2xl p-8 hover:border-terracotta/30 transition-colors">
              <h3 className="font-display text-2xl text-midnight mb-4">Granada House Podcast</h3>
              <p className="text-midnight/60 mb-4">
                Conversations that matter — exploring business, creativity, and 
                what it means to build a meaningful life.
              </p>
              <span className="text-terracotta text-sm font-medium">Media & Content</span>
            </div>

            <div className="border border-midnight/10 rounded-2xl p-8 hover:border-terracotta/30 transition-colors">
              <h3 className="font-display text-2xl text-midnight mb-4">GH Design</h3>
              <p className="text-midnight/60 mb-4">
                Interior design services led by Paige, transforming spaces into 
                places that feel like home.
              </p>
              <span className="text-terracotta text-sm font-medium">Design Services</span>
            </div>
          </div>
        </div>
      </AnimatedSection>

      {/* Skills & Expertise */}
      <AnimatedSection className="py-20 bg-midnight text-cream">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="font-display text-3xl md:text-4xl mb-12 text-center">
            Expertise
          </h2>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              'Operations Management',
              'Process Optimization',
              'Team Building',
              'Strategic Planning',
              'Financial Analysis',
              'Client Relations',
              'Systems Design',
              'Project Management',
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
            Let's Work Together
          </h2>
          <p className="text-midnight/60 text-lg mb-8 max-w-xl mx-auto">
            Whether you're looking for operational expertise, strategic consulting, 
            or want to explore collaboration opportunities.
          </p>
          <Link
            href="/contact"
            className="inline-block px-8 py-3 bg-terracotta text-cream rounded-full font-medium hover:bg-ocean transition-colors"
          >
            Get in Touch
          </Link>
        </div>
      </AnimatedSection>
    </div>
  )
}
