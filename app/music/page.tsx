'use client'

import { motion } from 'framer-motion'
import AnimatedSection from '@/components/AnimatedSection'

// Placeholder for upcoming shows - you'll update this
const upcomingShows = [
  {
    date: 'Jan 15, 2025',
    venue: "Humphrey's Backstage",
    location: 'San Diego, CA',
    time: '8:00 PM',
  },
  {
    date: 'Feb 8, 2025',
    venue: 'Granada House',
    location: 'San Diego, CA',
    time: '7:30 PM',
  },
  // Add more shows as needed
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
            StronGnome
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-xl text-cream/60 max-w-xl"
          >
            Trumpet, vocals, and original compositions blending jazz, funk, and soul.
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
                  StronGnome brings together jazz improvisation with funk grooves 
                  and soulful melodies. The project started as a collaboration 
                  between friends who wanted to make music that moves people — 
                  both physically and emotionally.
                </p>
                <p>
                  Working with Seth and Jaime, we've been crafting an album that 
                  captures the energy of our live shows while exploring new sonic 
                  territory in the studio.
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

      {/* Listen Section */}
      <AnimatedSection className="py-20 bg-sand">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="font-display text-3xl md:text-4xl text-midnight mb-8">
            Listen
          </h2>
          <p className="text-midnight/60 mb-12">
            Find StronGnome on your favorite platform
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
      <AnimatedSection className="py-20 md:py-32">
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
                  className="flex flex-col md:flex-row md:items-center justify-between p-6 bg-sand rounded-xl hover:bg-terracotta/10 transition-colors"
                >
                  <div className="mb-4 md:mb-0">
                    <p className="text-terracotta font-semibold">{show.date}</p>
                    <h3 className="font-display text-xl text-midnight">{show.venue}</h3>
                    <p className="text-midnight/60 text-sm">{show.location}</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-midnight/60">{show.time}</span>
                    <button className="px-4 py-2 border border-midnight text-midnight rounded-full text-sm hover:bg-midnight hover:text-cream transition-colors">
                      Details
                    </button>
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

      {/* Band Members */}
      <AnimatedSection className="py-20 bg-midnight text-cream">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="font-display text-3xl md:text-4xl mb-12 text-center">
            The Band
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-32 h-32 bg-cream/10 rounded-full mx-auto mb-4" />
              <h3 className="font-semibold text-lg">Kyle Palaniuk</h3>
              <p className="text-cream/60">Trumpet & Vocals</p>
            </div>
            <div className="text-center">
              <div className="w-32 h-32 bg-cream/10 rounded-full mx-auto mb-4" />
              <h3 className="font-semibold text-lg">Seth</h3>
              <p className="text-cream/60">Instrument</p>
            </div>
            <div className="text-center">
              <div className="w-32 h-32 bg-cream/10 rounded-full mx-auto mb-4" />
              <h3 className="font-semibold text-lg">Jaime</h3>
              <p className="text-cream/60">Instrument</p>
            </div>
          </div>
        </div>
      </AnimatedSection>
    </div>
  )
}
