'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'

export default function About() {
  return (
    <div className="page-transition pt-24">
      {/* Hero */}
      <section className="py-20 md:py-32 bg-paper">
        <div className="max-w-[1400px] mx-auto px-8 md:px-16 lg:px-24">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-24 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="flex items-center gap-3 mb-6">
                <span className="w-3 h-3 bg-amber rounded-full"></span>
                <span className="text-amber text-sm tracking-widest uppercase">About</span>
              </div>
              <h1 className="font-display text-5xl md:text-6xl lg:text-7xl font-bold text-ink leading-[0.95] mb-8">
                The Full
                <br />
                <span className="text-royal">Picture.</span>
              </h1>
              <p className="text-lg md:text-xl text-steel leading-relaxed">
                I've never been someone who fits neatly into one box. My days move between 
                helping families find their dream home, coaching soccer, playing trumpet, 
                and chasing my kids around on a skateboard. The skills that make you great 
                at one thing — listening, building trust, seeing the bigger picture — they 
                translate everywhere.
              </p>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="aspect-square bg-ink rounded-3xl overflow-hidden relative"
            >
              {/* Placeholder for headshot */}
              <div className="w-full h-full bg-gradient-to-br from-royal/30 to-amber/20 flex items-center justify-center">
                <span className="text-paper/40 text-sm">Your photo here</span>
              </div>
              {/* Decorative accent */}
              <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-cyan rounded-2xl -z-10" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Granada House Origin Story */}
      <section className="py-20 md:py-32 bg-ink text-paper">
        <div className="max-w-[1400px] mx-auto px-8 md:px-16 lg:px-24">
          <div className="max-w-3xl">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="flex items-center gap-3 mb-6"
            >
              <span className="w-3 h-3 bg-cyan rounded-full"></span>
              <span className="text-cyan text-sm tracking-widest uppercase">Origin Story</span>
            </motion.div>
            
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="font-display text-4xl md:text-5xl lg:text-6xl font-bold mb-10"
            >
              From Granada <span className="text-amber">Avenue</span> to Granada House
            </motion.h2>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="space-y-6 text-lg text-paper/70 leading-relaxed"
            >
              <p>
                It started with an actual house on Granada Avenue in San Diego — a place that 
                became synonymous with gathering, good conversation, and what we call "the good good": 
                good food, good drink, good people, everyone leaving with a good feeling.
              </p>
              <p>
                That spirit grew into something bigger. Granada House became a space for community 
                events, intimate jazz nights, and meaningful connections. And somewhere along the way, 
                I realized that my day job helping people buy homes and my passion for bringing 
                people together weren't separate things at all.
              </p>
              <p className="text-paper text-xl font-medium">
                There's a house, and then there's a home. The difference is how you get there.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Philosophy Section */}
      <section className="py-20 md:py-32 bg-paper">
        <div className="max-w-[1400px] mx-auto px-8 md:px-16 lg:px-24">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex items-center gap-3 mb-12"
          >
            <span className="w-3 h-3 bg-royal rounded-full"></span>
            <span className="text-royal text-sm tracking-widest uppercase">What I Believe</span>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: "We Work Too Much",
                description: "As Americans, we've lost our balance. Arts, music, play — these aren't luxuries, they're therapy. We need more of it.",
                color: "bg-amber"
              },
              {
                title: "Lean Into Awkward",
                description: "The best work happens in uncomfortable spaces. If you're afraid of awkward moments, that's exactly where you need to go.",
                color: "bg-cyan"
              },
              {
                title: "Find the Third Door",
                description: "The 'right' path isn't always the one in front of you. Sometimes you have to find another way — the door nobody else sees.",
                color: "bg-royal"
              },
              {
                title: "Connection Over Transaction",
                description: "Whether I'm helping you buy a home or hosting a jazz night, it's about genuine relationships, not just getting things done.",
                color: "bg-sky"
              },
              {
                title: "Keep the Playfulness",
                description: "We're losing our childlike creativity. It's being sucked out of us. I refuse to let that happen.",
                color: "bg-peach"
              },
              {
                title: "Leave Good Fruit",
                description: "Your fruit is what makes you YOU — what you create, share, and leave behind for others. That's what matters.",
                color: "bg-royal"
              }
            ].map((belief, i) => (
              <motion.div
                key={belief.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="p-8 bg-ink rounded-3xl text-paper group hover:scale-[1.02] transition-transform duration-300"
              >
                <div className={`w-3 h-3 ${belief.color} rounded-full mb-6`} />
                <h3 className="font-display text-2xl font-bold mb-4">{belief.title}</h3>
                <p className="text-paper/60 leading-relaxed">{belief.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Life Outside Work */}
      <section className="py-20 md:py-32 bg-ink text-paper">
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
                <span className="text-amber text-sm tracking-widest uppercase">When I'm Not Working</span>
              </motion.div>
              <motion.h2
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="font-display text-4xl md:text-5xl lg:text-6xl font-bold leading-[0.95]"
              >
                The <span className="text-cyan">Rest</span> of the Story
              </motion.h2>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="space-y-8"
            >
              <div className="flex gap-6 items-start">
                <span className="text-3xl">⚽</span>
                <div>
                  <h3 className="font-display text-xl font-bold mb-2">FC Balboa Coach</h3>
                  <p className="text-paper/60">Coaching youth soccer — teaching teamwork, resilience, and the joy of the beautiful game. Being on the field with my kids is the best part.</p>
                </div>
              </div>
              
              <div className="flex gap-6 items-start">
                <span className="text-3xl">🛹</span>
                <div>
                  <h3 className="font-display text-xl font-bold mb-2">Skating Around</h3>
                  <p className="text-paper/60">Still riding my skateboard around the neighborhood. Never too old to feel that freedom.</p>
                </div>
              </div>
              
              <div className="flex gap-6 items-start">
                <span className="text-3xl">🎺</span>
                <div>
                  <h3 className="font-display text-xl font-bold mb-2">Making Music</h3>
                  <p className="text-paper/60">Trumpet and vocals with various projects. Music has been a constant thread through my whole life.</p>
                </div>
              </div>
              
              <div className="flex gap-6 items-start">
                <span className="text-3xl">🚐</span>
                <div>
                  <h3 className="font-display text-xl font-bold mb-2">Adventure Planning</h3>
                  <p className="text-paper/60">Plotting the next adventure in our '91 Westfalia. There's always somewhere new to explore with the family.</p>
                </div>
              </div>
              
              <div className="flex gap-6 items-start">
                <span className="text-3xl">🤝</span>
                <div>
                  <h3 className="font-display text-xl font-bold mb-2">Volunteering</h3>
                  <p className="text-paper/60">Giving back to the community that's given so much to us. It all comes back around.</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 md:py-32 bg-paper">
        <div className="max-w-[1400px] mx-auto px-8 md:px-16 lg:px-24 text-center">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-ink mb-8"
          >
            Ready to <span className="text-royal">Connect?</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-steel text-lg md:text-xl max-w-2xl mx-auto mb-10"
          >
            Whether you're looking to buy a home, want to collaborate on music, 
            or just want to grab coffee and talk — I'm always up for a good conversation.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="flex flex-wrap justify-center gap-4"
          >
            <Link
              href="/professional"
              className="px-8 py-4 bg-ink text-paper font-medium rounded-full hover:bg-royal transition-colors duration-300"
            >
              Work With Me →
            </Link>
            <Link
              href="/contact"
              className="px-8 py-4 border-2 border-ink text-ink font-medium rounded-full hover:bg-ink hover:text-paper transition-all duration-300"
            >
              Get in Touch
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
