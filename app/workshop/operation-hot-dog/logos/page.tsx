import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

const symbols = [
  { file: 'S1-forge-mark', label: 'Forge Mark', desc: 'Single diagonal slash — white-hot at the claw tip, burning down to deep lava. The core favicon. This is it.' },
  { file: 'S2-HC-forge', label: 'HC Forge', desc: 'H + C with the glowing forge slash as the H crossbar. The slash = the claw = the brand mark.' },
  { file: 'S3-three-heat', label: 'Three Heat Marks', desc: 'Three forge slashes. Center burns white-hot, the others cool off. Radiates heat and speed.' },
  { file: 'S4-app-icon', label: 'App Icon', desc: 'Forge mark inside a warm rounded container. Optimized for app icons, home screen, product icon.' },
]

const wordmarks = [
  { file: 'W1-split-heat-wordmark', label: 'HOT / CLAW Split', desc: '"HOT" in lava-orange + forge slash separator + "CLAW" in cream. The name IS the concept. Top pick.' },
  { file: 'W2-lockup-mark-word', label: 'Mark + HOTCLAW', desc: 'Forge symbol + full HOTCLAW word with split colorway. Primary horizontal lockup.' },
  { file: 'W3-with-tagline', label: 'With Tagline', desc: 'Full lockup + "AI AGENTS. BUILT HOT. SHIPPED FAST." underneath. Pitch decks, site headers.' },
  { file: 'W4-stacked-social', label: 'Stacked Social', desc: 'Symbol + HOT / CLAW stacked. Social profiles, square format, avatar use.' },
]

const favicons = [
  { file: 'F1-favicon', label: 'Favicon — Forge Slash', desc: 'Single forge slash optimized for 32px. Reads at 16px. The browser tab icon.' },
]

type LogoItem = { file: string; label: string; desc: string }

function LogoCard({ item, wide = false }: { item: LogoItem; wide?: boolean }) {
  return (
    <div className="group border border-midnight/5 rounded-2xl overflow-hidden hover:border-amber-300 hover:shadow-lg transition-all"
         style={{ background: '#0f0a06' }}>
      <div className="flex items-center justify-center p-6" style={{ minHeight: wide ? '100px' : '160px' }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={`/assets/hotclaw-logos-v3/${item.file}.svg`}
          alt={item.label}
          className={wide ? 'w-full max-w-[380px] h-auto max-h-24 object-contain' : 'max-h-28 w-auto max-w-[80%] object-contain'}
        />
      </div>
      <div className="p-4 border-t" style={{ borderColor: 'rgba(251,191,36,0.1)', background: '#0f0a06' }}>
        <h3 className="font-semibold text-sm mb-1" style={{ color: '#fef08a' }}>{item.label}</h3>
        <p className="text-xs leading-relaxed mb-3" style={{ color: 'rgba(254,249,240,0.45)' }}>{item.desc}</p>
        <a
          href={`/assets/hotclaw-logos-v3/${item.file}.svg`}
          download={`hotclaw-${item.file}.svg`}
          className="text-xs transition-colors"
          style={{ color: 'rgba(254,249,240,0.25)' }}
        >
          ↓ Download SVG
        </a>
      </div>
    </div>
  )
}

export default function LogosPage() {
  return (
    <div className="pb-20">
      {/* Header */}
      <div className="mb-10">
        <Link href="/workshop/operation-hot-dog"
              className="inline-flex items-center gap-2 text-sm text-midnight/40 hover:text-midnight transition-colors mb-5">
          <ArrowLeft className="w-3.5 h-3.5" /> Back to HQ
        </Link>
        <h1 className="font-display text-4xl text-midnight mb-2">Logo Concepts — V3</h1>
        <p className="text-midnight/50 text-sm max-w-xl leading-relaxed">
          Forge identity. HOT = lava orange bleeding to amber. CLAW = cream. The diagonal slash is the claw is the brand mark. Drawn from Claude Code energy, OpenClaw slash DNA, and the name itself.
        </p>
        <div className="mt-4 grid gap-3 md:grid-cols-3">
          <div className="p-3 bg-cream rounded-xl border border-midnight/5 text-xs text-midnight/60">
            <span className="block font-semibold text-midnight mb-1">🔥 HOT = lava orange</span>
            Fast, forge-hot, instant, transformative. The color of things being made.
          </div>
          <div className="p-3 bg-cream rounded-xl border border-midnight/5 text-xs text-midnight/60">
            <span className="block font-semibold text-midnight mb-1">⚡ The slash = the claw</span>
            One mark does both jobs. A claw mark is a slash. A slash is a claw. It also = speed.
          </div>
          <div className="p-3 bg-cream rounded-xl border border-midnight/5 text-xs text-midnight/60">
            <span className="block font-semibold text-midnight mb-1">🎯 HOT/CLAW split</span>
            The name reads as the concept. HOT in fire, CLAW in cream. No extra explanation needed.
          </div>
        </div>
      </div>

      {/* Symbols */}
      <div className="mb-12">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-1 h-6 rounded-full" style={{ background: '#fbbf24' }} />
          <h2 className="font-display text-xl text-midnight">Symbols</h2>
          <span className="text-xs text-midnight/30">standalone · favicon · app icon</span>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {symbols.map(item => <LogoCard key={item.file} item={item} />)}
        </div>
      </div>

      {/* Wordmarks */}
      <div className="mb-12">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-1 h-6 bg-ocean rounded-full" />
          <h2 className="font-display text-xl text-midnight">Wordmarks</h2>
          <span className="text-xs text-midnight/30">full logo · primary + alternate uses</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {wordmarks.map(item => <LogoCard key={item.file} item={item} wide />)}
        </div>
      </div>

      {/* Favicon */}
      <div className="mb-12">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-1 h-6 bg-green-500 rounded-full" />
          <h2 className="font-display text-xl text-midnight">Favicon</h2>
          <span className="text-xs text-midnight/30">32×32 · browser tab</span>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {favicons.map(item => <LogoCard key={item.file} item={item} />)}
        </div>
      </div>

      {/* Direction note */}
      <div className="p-5 rounded-xl text-sm leading-relaxed" style={{ background: 'rgba(234,88,12,0.08)', border: '1px solid rgba(234,88,12,0.2)', color: 'rgba(254,249,240,0.7)' }}>
        <p className="font-semibold mb-1" style={{ color: '#fef08a' }}>Pick your direction</p>
        <p>Symbol: S1 (Forge Mark) for favicon/icon. Wordmark: W1 (HOT/CLAW Split) or W2 (Mark + HOTCLAW). Tell Jasper which combo and I&apos;ll refine geometry, weight, proportions, and build the final SVG system.</p>
      </div>
    </div>
  )
}
