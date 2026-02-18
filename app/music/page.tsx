'use client'

import { motion } from 'framer-motion'
import AnimatedSection from '@/components/AnimatedSection'

const bands = [
  {
    name: 'StronGnome',
    description: 'Collaboration with Seth Eming. Jazz-funk originals. First release "Vast" in progress.',
    members: ['Kyle Palaniuk (trumpet, vocals)', 'Seth Eming'],
    status: 'Active - Recording',
    color: 'terracotta'
  },
  {
    name: 'Well Well Well',
    description: 'Active band. Plays shows at Granada House and around San Diego.',
    members: [],
    status: 'Active - Performing',
    color: 'ocean'
  },
  {
    name: 'Tu Lengua',
    description: 'Cross-border international band. Kyle plays trumpet/horn sections + solos.',
    members: [],
    setList: ['Hello', 'Feeling Fine', 'Vibe', 'Morocco', 'Rolling High', 'Alchemie', 'Julio 22', 'Almarea', 'Soft Plans', 'Rebel Rebel Cumbia', 'Saturday', 'Real', 'Survive'],
    status: 'Active',
    color: 'terracotta'
  },
  {
    name: 'Neo Somatic',
    description: 'Jazz-funk-prose direction. Working name, evolving from "Granada House Sessions." Writing a whole new set.',
    members: ['Kyle', 'Seth', 'Anthony'],
    status: 'In Development',
    color: 'ocean'
  },
  {
    name: 'Swinging Gypsies',
    description: 'New Orleans jazz band Kyle played with.',
    members: [],
    status: 'Past Project',
    color: 'sand'
  },
]

// Placeholder for upcoming shows
const upcomingShows = [
  {
    date: 'TBA',
    venue: 'Granada House',
    location: 'San Diego, CA',
    time: 'TBA',
  },
]

export default function Music() {
  return (
    <div className="page-transition pt-24">
      {/* Hero */}
      <section className="py-20 md:py-32 bg-midnight text-cream relative overflow-hidden">
        {/* Background decoration */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 0.1 }}
          transition={{ duration: 1.5 }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full bg-terracotta blur-3xl"
        />
        
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-terracotta font-medium mb-4 tracking-wider uppercase text-sm"
          >
            Music
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="font-display text-6xl md:text-8xl mb-6"
          >
            Kyle Palaniuk
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-xl text-cream/60 max-w-xl"
          >
            Trumpet, composition, and performance across jazz, funk, Latin, and soul.
          </motion.p>
        </div>
      </section>

      {/* About the Music */}
      <AnimatedSection className="py-20 md:py-32">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="font-display text-3xl md:text-4xl text-midnight mb-6">
                The Sound
              </h2>
              <div className="text-midnight/70 space-y-4">
                <p>
                  From jazz improvisation to funk grooves, Latin rhythms to soulful melodies,
                  Kyle's trumpet work spans multiple genres and contexts.
                </p>
                <p>
                  Whether performing original compositions, collaborating with international
                  ensembles, or exploring the intersection of music and spoken word, the focus
                  is always on creating music that moves people — both physically and emotionally.
                </p>
              </div>
            </div>
            
            {/* Placeholder for band photo or embedded player */}
            <div className="aspect-video bg-sand rounded-2xl overflow-hidden flex items-center justify-center">
              <div className="text-center p-8">
                <p className="text-midnight/40 mb-4">Spotify/YouTube Embed</p>
                <p className="text-midnight/30 text-sm">Add your music player here</p>
              </div>
            </div>
          </div>
        </div>
      </AnimatedSection>

      {/* Bands & Projects */}
      <AnimatedSection className="py-20 bg-sand">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="font-display text-3xl md:text-4xl text-midnight mb-12 text-center">
            Bands & Projects
          </h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            {bands.map((band, index) => (
              <motion.div
                key={band.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-cream rounded-xl p-6 border border-midnight/5 hover:border-terracotta/30 transition-all"
              >
                <div className="flex items-start justify-between mb-3">
                  <h3 className="font-display text-2xl text-midnight">{band.name}</h3>
                  <span className={`text-xs px-3 py-1 rounded-full bg-${band.color}/10 text-${band.color} font-medium`}>
                    {band.status}
                  </span>
                </div>
                
                <p className="text-midnight/70 mb-4">{band.description}</p>
                
                {band.members && band.members.length > 0 && (
                  <div className="mb-4">
                    <p className="text-sm font-semibold text-midnight/60 mb-1">Members:</p>
                    <ul className="text-sm text-midnight/70 space-y-1">
                      {band.members.map((member, i) => (
                        <li key={i}>• {member}</li>
                      ))}
                    </ul>
                  </div>
                )}
                
                {band.setList && (
                  <div className="mb-4">
                    <p className="text-sm font-semibold text-midnight/60 mb-2">Set List:</p>
                    <div className="flex flex-wrap gap-2">
                      {band.setList.map((song, i) => (
                        <span key={i} className="text-xs px-2 py-1 bg-sand rounded text-midnight/70">
                          {song}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                
                <div className="pt-4 border-t border-midnight/5">
                  <p className="text-sm text-midnight/40">Music links coming soon</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </AnimatedSection>

      {/* Listen Section */}
      <AnimatedSection className="py-20">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="font-display text-3xl md:text-4xl text-midnight mb-8">
            Listen
          </h2>
          <p className="text-midnight/60 mb-12">
            Find Kyle's music on your favorite platform
          </p>
          
          <div className="flex flex-wrap justify-center gap-4">
            <a
              href="#" // Add your Spotify link
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 bg-[#1DB954] text-white rounded-full font-medium hover:opacity-90 transition-opacity"
            >
              Spotify
            </a>
            <a
              href="#" // Add your Apple Music link
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 bg-[#FA243C] text-white rounded-full font-medium hover:opacity-90 transition-opacity"
            >
              Apple Music
            </a>
            <a
              href="#" // Add your YouTube link
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 bg-[#FF0000] text-white rounded-full font-medium hover:opacity-90 transition-opacity"
            >
              YouTube
            </a>
            <a
              href="#" // Add your SoundCloud link
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 bg-[#FF5500] text-white rounded-full font-medium hover:opacity-90 transition-opacity"
            >
              SoundCloud
            </a>
          </div>
        </div>
      </AnimatedSection>

      {/* Upcoming Shows */}
      <AnimatedSection className="py-20 md:py-32 bg-sand">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="font-display text-3xl md:text-4xl text-midnight mb-12 text-center">
            Upcoming Shows
          </h2>
          
          {upcomingShows.length > 0 ? (
            <div className="space-y-4">
              {upcomingShows.map((show, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex flex-col md:flex-row md:items-center justify-between p-6 bg-cream rounded-xl hover:bg-terracotta/10 transition-colors"
                >
                  <div className="mb-4 md:mb-0">
                    <p className="text-terracotta font-semibold">{show.date}</p>
                    <h3 className="font-display text-xl text-midnight">{show.venue}</h3>
                    <p className="text-midnight/60 text-sm">{show.location}</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-midnight/60">{show.time}</span>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <p className="text-center text-midnight/60">
              No upcoming shows scheduled. Check back soon!
            </p>
          )}
        </div>
      </AnimatedSection>
    </div>
  )
}
