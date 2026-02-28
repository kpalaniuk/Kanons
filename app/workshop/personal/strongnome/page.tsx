'use client'

import { useState } from 'react'
import { ExternalLink, Music, Play } from 'lucide-react'

// ─── Placeholder links — update when ready ────────────────────────────────────
const LINKS = {
  spotify:     '#',  // https://open.spotify.com/artist/...
  bandcamp:    '#',  // https://strongnome.bandcamp.com
  soundcloud:  '#',  // https://soundcloud.com/strongnome
  instagram:   '#',  // https://instagram.com/strongnome
  presave:     '#',  // smartlink / pre-save URL
}

const TRACKS = [
  { title: 'Vast',       duration: '—',    note: 'Title track' },
  { title: '[Track 2]',  duration: '—',    note: 'Placeholder' },
  { title: '[Track 3]',  duration: '—',    note: 'Placeholder' },
]

// ─── Component ────────────────────────────────────────────────────────────────

export default function StronGnomePage() {
  const [hoveredTrack, setHoveredTrack] = useState<number | null>(null)

  return (
    <div className="min-h-screen bg-[#050507] text-white relative overflow-hidden">

      {/* ── Atmospheric background ──────────────────────────────────────────── */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {/* Primary orb — deep teal/blue */}
        <div
          className="absolute rounded-full blur-[120px] opacity-20"
          style={{
            width: '60vw', height: '60vw',
            top: '-10%', left: '-10%',
            background: 'radial-gradient(circle, #0d6e6e 0%, #032d2d 60%, transparent 100%)',
            animation: 'drift1 18s ease-in-out infinite alternate',
          }}
        />
        {/* Secondary orb — deep violet */}
        <div
          className="absolute rounded-full blur-[160px] opacity-15"
          style={{
            width: '50vw', height: '50vw',
            bottom: '-5%', right: '-5%',
            background: 'radial-gradient(circle, #4a1c6b 0%, #1a0828 60%, transparent 100%)',
            animation: 'drift2 22s ease-in-out infinite alternate',
          }}
        />
        {/* Accent — amber glow, faint */}
        <div
          className="absolute rounded-full blur-[200px] opacity-10"
          style={{
            width: '40vw', height: '40vw',
            top: '40%', left: '30%',
            background: 'radial-gradient(circle, #c46a00 0%, transparent 70%)',
            animation: 'drift3 28s ease-in-out infinite alternate',
          }}
        />
        {/* Noise grain overlay */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E")`,
            backgroundSize: '256px 256px',
          }}
        />
      </div>

      {/* ── CSS keyframes ───────────────────────────────────────────────────── */}
      <style jsx>{`
        @keyframes drift1 {
          from { transform: translate(0, 0) scale(1); }
          to   { transform: translate(6%, 4%) scale(1.08); }
        }
        @keyframes drift2 {
          from { transform: translate(0, 0) scale(1); }
          to   { transform: translate(-5%, -3%) scale(1.05); }
        }
        @keyframes drift3 {
          from { transform: translate(0, 0) scale(1); }
          to   { transform: translate(3%, 5%) scale(0.95); }
        }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(24px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes pulse-ring {
          0%, 100% { box-shadow: 0 0 0 0 rgba(13,110,110,0.3); }
          50%       { box-shadow: 0 0 0 12px rgba(13,110,110,0); }
        }
        .fade-up-1 { animation: fadeUp 0.8s ease both 0.1s; }
        .fade-up-2 { animation: fadeUp 0.8s ease both 0.25s; }
        .fade-up-3 { animation: fadeUp 0.8s ease both 0.4s; }
        .fade-up-4 { animation: fadeUp 0.8s ease both 0.55s; }
        .fade-up-5 { animation: fadeUp 0.8s ease both 0.7s; }
        .pulse-play { animation: pulse-ring 2.5s ease-in-out infinite; }
      `}</style>

      {/* ── Main content ────────────────────────────────────────────────────── */}
      <div className="relative z-10 max-w-2xl mx-auto px-6 pt-20 pb-24">

        {/* Draft notice */}
        <div className="fade-up-1 mb-10 inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/10 text-white/30 text-xs font-mono tracking-widest uppercase">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
          Draft — for Kyle + Seth review
        </div>

        {/* Artwork placeholder */}
        <div className="fade-up-2 relative mb-10">
          <div
            className="w-full max-w-sm mx-auto aspect-square rounded-2xl overflow-hidden"
            style={{
              background: 'linear-gradient(135deg, #0d2e2e 0%, #0a0a14 40%, #1a0828 70%, #050507 100%)',
              boxShadow: '0 0 60px rgba(13,110,110,0.15), 0 0 120px rgba(74,28,107,0.1)',
              border: '1px solid rgba(255,255,255,0.06)',
            }}
          >
            {/* Inner art placeholder */}
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
              <div
                className="w-24 h-24 rounded-full opacity-60"
                style={{
                  background: 'radial-gradient(circle at 40% 40%, #0d6e6e, #1a0828)',
                  boxShadow: '0 0 40px rgba(13,110,110,0.4)',
                }}
              />
              <p className="text-white/20 text-xs font-mono tracking-widest uppercase mt-4">Artwork TBD</p>
              <p className="text-white/10 text-xs">— Barbara Smith</p>
            </div>
          </div>
        </div>

        {/* Artist + release */}
        <div className="fade-up-3 text-center mb-8">
          <p className="text-white/40 text-sm font-mono tracking-[0.3em] uppercase mb-2">StronGnome</p>
          <h1
            className="font-display text-7xl sm:text-8xl text-white tracking-tight mb-3"
            style={{ textShadow: '0 0 60px rgba(255,255,255,0.08)' }}
          >
            Vast
          </h1>
          <p className="text-white/30 text-sm tracking-widest uppercase font-mono">2026</p>
        </div>

        {/* Description */}
        <div className="fade-up-3 text-center mb-10 max-w-md mx-auto">
          <p className="text-white/50 text-base leading-relaxed">
            Kyle Palaniuk + Seth Eming. Trumpet and electronics stretching into open space.
            <span className="text-white/25"> — update with real description before launch</span>
          </p>
        </div>

        {/* Primary CTA */}
        <div className="fade-up-4 flex justify-center mb-12">
          <a
            href={LINKS.presave}
            className="pulse-play group relative flex items-center gap-3 px-8 py-4 rounded-full text-sm font-semibold tracking-wider uppercase transition-all duration-300"
            style={{
              background: 'linear-gradient(135deg, rgba(13,110,110,0.8), rgba(74,28,107,0.6))',
              border: '1px solid rgba(13,110,110,0.4)',
              color: 'rgba(255,255,255,0.9)',
            }}
          >
            <Play size={16} className="group-hover:scale-110 transition-transform" />
            Pre-save / Listen
          </a>
        </div>

        {/* Track listing */}
        <div className="fade-up-4 mb-12">
          <p className="text-white/20 text-xs font-mono tracking-[0.25em] uppercase mb-4">Tracklist</p>
          <div className="space-y-1">
            {TRACKS.map((track, i) => (
              <div
                key={i}
                onMouseEnter={() => setHoveredTrack(i)}
                onMouseLeave={() => setHoveredTrack(null)}
                className="group flex items-center gap-4 px-4 py-3 rounded-lg transition-all duration-200 cursor-default"
                style={{
                  background: hoveredTrack === i ? 'rgba(255,255,255,0.05)' : 'transparent',
                }}
              >
                <span className="text-white/20 text-sm font-mono w-5 text-right flex-shrink-0">
                  {hoveredTrack === i
                    ? <Play size={13} className="text-white/50 ml-auto" />
                    : String(i + 1).padStart(2, '0')
                  }
                </span>
                <span className="flex-1 text-white/70 text-sm group-hover:text-white transition-colors">
                  {track.title}
                </span>
                <span className="text-white/20 text-xs font-mono">{track.duration}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Divider */}
        <div className="fade-up-5 w-full h-px mb-10" style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.08), transparent)' }} />

        {/* Links */}
        <div className="fade-up-5 flex flex-wrap justify-center gap-4 mb-10">
          {[
            { label: 'Spotify', href: LINKS.spotify },
            { label: 'Bandcamp', href: LINKS.bandcamp },
            { label: 'SoundCloud', href: LINKS.soundcloud },
            { label: 'Instagram', href: LINKS.instagram },
          ].map(({ label, href }) => (
            <a
              key={label}
              href={href}
              className="flex items-center gap-1.5 text-white/30 hover:text-white/70 text-sm transition-colors duration-200"
            >
              {label}
              <ExternalLink size={11} className="opacity-50" />
            </a>
          ))}
        </div>

        {/* Credits */}
        <div className="fade-up-5 text-center">
          <p className="text-white/15 text-xs font-mono tracking-wider">
            Kyle Palaniuk · Seth Eming · Visual art: Barbara Smith
          </p>
          <p className="text-white/10 text-xs font-mono mt-1">North Park, San Diego</p>
        </div>
      </div>

      {/* ── Admin bar (Kanons-only) ─────────────────────────────────────────── */}
      <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-20">
        <div
          className="flex items-center gap-3 px-4 py-2 rounded-full text-xs text-white/40 font-mono"
          style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}
        >
          <Music size={11} />
          StronGnome — Vast · Draft · Update LINKS and TRACKS before publishing
        </div>
      </div>
    </div>
  )
}
