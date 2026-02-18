'use client'

import { motion } from 'framer-motion'
import AnimatedSection from '@/components/AnimatedSection'
import { Music as MusicIcon, Mic, Guitar, Users, ExternalLink, Instagram, Youtube, Globe, Disc3, Radio } from 'lucide-react'

type BandLink = {
  type: 'instagram' | 'youtube' | 'spotify' | 'soundcloud' | 'bandcamp' | 'website'
  url: string
  label?: string
}

type Band = {
  name: string
  subtitle?: string
  description: string
  members: string[]
  status: string
  icon: React.ReactNode
  gradient: string
  links: BandLink[]
  setList?: string[]
}

const linkIcons: Record<string, React.ReactNode> = {
  instagram: <Instagram className="w-5 h-5" />,
  youtube: <Youtube className="w-5 h-5" />,
  spotify: <Disc3 className="w-5 h-5" />,
  soundcloud: <Radio className="w-5 h-5" />,
  bandcamp: <Globe className="w-5 h-5" />,
  website: <Globe className="w-5 h-5" />,
}

const linkColors: Record<string, string> = {
  instagram: 'hover:text-pink-500',
  youtube: 'hover:text-red-500',
  spotify: 'hover:text-green-500',
  soundcloud: 'hover:text-orange-500',
  bandcamp: 'hover:text-teal-500',
  website: 'hover:text-ocean',
}

const bands: Band[] = [
  {
    name: 'Well Well Well',
    description: 'Active band playing shows at Granada House and venues across San Diego. High-energy live performances blending funk, soul, and jazz.',
    members: [],
    status: 'Active — Performing',
    icon: <Mic className="w-6 h-6" />,
    gradient: 'from-ocean/20 to-ocean/5',
    links: [
      { type: 'instagram', url: 'https://www.instagram.com/wellwellwellmusic/' },
      { type: 'youtube', url: 'https://www.youtube.com/channel/UChwUvoz4Sif6heKvq3T-mbg' },
    ],
  },
  {
    name: 'Granada House Sessions',
    subtitle: '(Neo Somatic)',
    description: 'Jazz-funk-prose direction. Writing a whole new set — evolving the sound with spoken word and improvisation.',
    members: ['Kyle', 'Seth', 'Anthony'],
    status: 'In Development',
    icon: <Radio className="w-6 h-6" />,
    gradient: 'from-terracotta/20 to-terracotta/5',
    links: [
      { type: 'instagram', url: 'https://www.instagram.com/granadahousesessions/' },
    ],
  },
  {
    name: 'StronGnome',
    description: 'Collaboration with Seth Eming. Jazz-funk originals. First release "Vast" is in progress.',
    members: ['Kyle Palaniuk (trumpet, vocals)', 'Seth Eming'],
    status: 'Active — Recording',
    icon: <Guitar className="w-6 h-6" />,
    gradient: 'from-terracotta/20 to-amber-500/5',
    links: [],
  },
  {
    name: 'Tu Lengua',
    description: 'Bilingual hip-hop supergroup from both sides of the border. Kyle plays trumpet/horn sections + solos.',
    members: [],
    setList: ['Hello', 'Feeling Fine', 'Vibe', 'Morocco', 'Rolling High', 'Alchemie', 'Julio 22', 'Almarea', 'Soft Plans', 'Rebel Rebel Cumbia', 'Saturday', 'Real', 'Survive'],
    status: 'Active',
    icon: <Globe className="w-6 h-6" />,
    gradient: 'from-ocean/20 to-purple-500/5',
    links: [
      { type: 'instagram', url: 'https://www.instagram.com/tulengua_esta_nice/' },
      { type: 'youtube', url: 'https://www.youtube.com/channel/UChwUvoz4Sif6heKvq3T-mbg' },
      { type: 'spotify', url: 'https://open.spotify.com/artist/2rXUN5oxetpexWoqyMYUhu' },
      { type: 'soundcloud', url: 'https://soundcloud.com/tulengua' },
      { type: 'bandcamp', url: 'https://tulengua.bandcamp.com/' },
    ],
  },
  {
    name: 'Swinging Gypsies',
    description: 'New Orleans jazz band Kyle played with.',
    members: [],
    status: 'Past Project',
    icon: <MusicIcon className="w-6 h-6" />,
    gradient: 'from-midnight/10 to-midnight/5',
    links: [],
  },
]

const statusColors: Record<string, string> = {
  'Active — Performing': 'bg-ocean/10 text-ocean',
  'Active — Recording': 'bg-terracotta/10 text-terracotta',
  'Active': 'bg-green-500/10 text-green-600',
  'In Development': 'bg-amber-500/10 text-amber-600',
  'Past Project': 'bg-midnight/10 text-midnight/50',
}

export default function Music() {
  return (
    <div className="page-transition pt-24">
      {/* Hero */}
      <section className="py-20 md:py-32 bg-midnight text-cream relative overflow-hidden">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 0.08 }}
          transition={{ duration: 1.5 }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full bg-terracotta blur-3xl"
        />
        <motion.div
          initial={{ scale: 0.6, opacity: 0 }}
          animate={{ scale: 1, opacity: 0.05 }}
          transition={{ duration: 2, delay: 0.3 }}
          className="absolute top-1/4 right-1/4 w-[400px] h-[400px] rounded-full bg-ocean blur-3xl"
        />

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex items-center gap-3 mb-4"
          >
            <MusicIcon className="w-5 h-5 text-terracotta" />
            <p className="text-terracotta font-medium tracking-wider uppercase text-sm">
              Music
            </p>
          </motion.div>
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
              <div className="flex items-center gap-3 mb-6">
                <Mic className="w-6 h-6 text-terracotta" />
                <h2 className="font-display text-3xl md:text-4xl text-midnight">
                  The Sound
                </h2>
              </div>
              <div className="text-midnight/70 space-y-4">
                <p>
                  From jazz improvisation to funk grooves, Latin rhythms to soulful melodies,
                  Kyle&apos;s trumpet work spans multiple genres and contexts.
                </p>
                <p>
                  Whether performing original compositions, collaborating with international
                  ensembles, or exploring the intersection of music and spoken word, the focus
                  is always on creating music that moves people — both physically and emotionally.
                </p>
              </div>
            </div>

            <div className="aspect-video bg-gradient-to-br from-ocean/10 via-terracotta/10 to-sand rounded-2xl overflow-hidden flex items-center justify-center relative">
              <div className="absolute inset-0 flex items-center justify-center">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                  className="w-32 h-32 rounded-full border-2 border-dashed border-terracotta/20 flex items-center justify-center"
                >
                  <Disc3 className="w-12 h-12 text-terracotta/30" />
                </motion.div>
              </div>
              <div className="text-center p-8 relative z-10">
                <MusicIcon className="w-8 h-8 text-ocean/40 mx-auto mb-3" />
                <p className="text-midnight/40 text-sm font-medium">Music player coming soon</p>
              </div>
            </div>
          </div>
        </div>
      </AnimatedSection>

      {/* Bands & Projects */}
      <AnimatedSection className="py-20 bg-sand">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-center gap-3 mb-12">
            <Users className="w-6 h-6 text-terracotta" />
            <h2 className="font-display text-3xl md:text-4xl text-midnight text-center">
              Bands & Projects
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {bands.map((band, index) => (
              <motion.div
                key={band.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                className={`bg-gradient-to-br ${band.gradient} backdrop-blur-sm rounded-xl p-6 border border-midnight/5 hover:border-terracotta/30 hover:shadow-lg transition-all group`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <span className="text-midnight/40 group-hover:text-terracotta transition-colors">
                      {band.icon}
                    </span>
                    <div>
                      <h3 className="font-display text-2xl text-midnight">{band.name}</h3>
                      {band.subtitle && (
                        <p className="text-sm text-midnight/40">{band.subtitle}</p>
                      )}
                    </div>
                  </div>
                  <span className={`text-xs px-3 py-1 rounded-full font-medium whitespace-nowrap ${statusColors[band.status] || 'bg-midnight/10 text-midnight/50'}`}>
                    {band.status}
                  </span>
                </div>

                <p className="text-midnight/70 mb-4">{band.description}</p>

                {band.members && band.members.length > 0 && (
                  <div className="mb-4">
                    <div className="flex items-center gap-2 mb-1">
                      <Users className="w-3.5 h-3.5 text-midnight/40" />
                      <p className="text-sm font-semibold text-midnight/60">Members</p>
                    </div>
                    <ul className="text-sm text-midnight/70 space-y-1 ml-5">
                      {band.members.map((member, i) => (
                        <li key={i}>• {member}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {band.setList && (
                  <div className="mb-4">
                    <div className="flex items-center gap-2 mb-2">
                      <MusicIcon className="w-3.5 h-3.5 text-midnight/40" />
                      <p className="text-sm font-semibold text-midnight/60">Set List</p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {band.setList.map((song, i) => (
                        <span key={i} className="text-xs px-2 py-1 bg-cream/80 rounded-full text-midnight/70">
                          {song}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <div className="pt-4 border-t border-midnight/10">
                  {band.links.length > 0 ? (
                    <div className="flex items-center gap-3">
                      {band.links.map((link, i) => (
                        <a
                          key={i}
                          href={link.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`text-midnight/40 ${linkColors[link.type]} transition-colors p-1.5 rounded-lg hover:bg-midnight/5`}
                          title={link.type.charAt(0).toUpperCase() + link.type.slice(1)}
                        >
                          {linkIcons[link.type]}
                          <span className="sr-only">{link.type}</span>
                        </a>
                      ))}
                      <ExternalLink className="w-3.5 h-3.5 text-midnight/20 ml-auto" />
                    </div>
                  ) : (
                    <p className="text-sm text-midnight/30 italic">Links coming soon</p>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </AnimatedSection>

      {/* Music Coming Soon */}
      <AnimatedSection className="py-20">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="bg-gradient-to-br from-ocean/5 to-terracotta/5 rounded-2xl p-12 border border-midnight/5"
          >
            <Disc3 className="w-10 h-10 text-terracotta/50 mx-auto mb-4" />
            <h2 className="font-display text-2xl md:text-3xl text-midnight mb-3">
              Music Coming Soon
            </h2>
            <p className="text-midnight/50 max-w-md mx-auto">
              Recordings are in progress. Follow the bands above to be the first to hear new releases.
            </p>
          </motion.div>
        </div>
      </AnimatedSection>

      {/* Upcoming Shows */}
      <AnimatedSection className="py-20 md:py-32 bg-sand">
        <div className="max-w-4xl mx-auto px-6">
          <div className="flex items-center justify-center gap-3 mb-12">
            <Mic className="w-6 h-6 text-terracotta" />
            <h2 className="font-display text-3xl md:text-4xl text-midnight text-center">
              Upcoming Shows
            </h2>
          </div>

          <div className="text-center py-12 bg-cream/50 rounded-2xl border border-midnight/5">
            <MusicIcon className="w-8 h-8 text-midnight/20 mx-auto mb-4" />
            <p className="text-midnight/50 font-medium">No upcoming shows — check back soon!</p>
            <p className="text-midnight/30 text-sm mt-2">Follow on Instagram for announcements</p>
          </div>
        </div>
      </AnimatedSection>
    </div>
  )
}
