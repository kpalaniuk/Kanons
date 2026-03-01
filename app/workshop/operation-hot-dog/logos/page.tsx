import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

const symbols = [
  { file: 'S1-three-slash', label: 'Three Slash', tag: 'SYMBOL', desc: 'Three clean parallel claw marks. OpenClaw energy, geometric precision. Works at any size.' },
  { file: 'S2-HC-clean', label: 'HC Clean Slash', tag: 'SYMBOL', desc: 'H and C letterforms with a bold amber diagonal slicing through both. The slash IS the brand.' },
  { file: 'S3-blade', label: 'Blade', tag: 'SYMBOL', desc: 'Single claw mark as a refined wedge — sharp amber tip, gradient body. Pure and minimal.' },
  { file: 'S4-app-icon', label: 'App Icon', tag: 'SYMBOL', desc: 'H with integrated claw slash, Claude Code-style rounded container. Best for app icons.' },
]

const wordmarks = [
  { file: 'W1-lockup-horizontal', label: 'Horizontal Lockup', tag: 'WORDMARK', desc: 'Three-slash mark + HOTCLAW. The primary logo. Standard horizontal usage.' },
  { file: 'W2-wordmark-slash', label: 'Slash Integrated', tag: 'WORDMARK', desc: 'HOTCLAW bold with amber diagonal cutting through the letterforms. No separate mark needed.' },
  { file: 'W3-lockup-light', label: 'Light Background', tag: 'WORDMARK', desc: 'Symbol + HOTCLAW SOLUTIONS on light background. Business cards, documents.' },
  { file: 'W4-stacked', label: 'Stacked', tag: 'WORDMARK', desc: 'Symbol on top, HOTCLAW + SOLUTIONS below. Social profiles, square format.' },
]

const favicons = [
  { file: 'F1-favicon-slashes', label: 'Three Slashes', tag: 'FAVICON', desc: 'Simplified three-slash at any small size. Reads immediately at 16px.' },
  { file: 'F2-favicon-blade', label: 'Blade', tag: 'FAVICON', desc: 'Single wedge/blade. Maximum clarity at small size. Clean tab icon.' },
]

const tagColors: Record<string, string> = {
  SYMBOL: 'bg-amber-100 text-amber-700',
  WORDMARK: 'bg-ocean/10 text-ocean',
  FAVICON: 'bg-green-100 text-green-700',
}

function LogoCard({ item, wide = false, bg = 'dark' }: { item: typeof symbols[0], wide?: boolean, bg?: 'dark' | 'light' }) {
  return (
    <div className="group bg-cream rounded-2xl border border-midnight/5 overflow-hidden hover:border-amber-300 transition-all hover:shadow-md">
      <div className={`flex items-center justify-center p-6 ${bg === 'light' ? 'bg-[#f8f7f4] border-b border-midnight/5' : 'bg-[#0a0a0a]'}`}
           style={{ minHeight: wide ? '100px' : '160px' }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={`/assets/hotclaw-logos-v2/${item.file}.svg`}
          alt={item.label}
          className={wide ? 'w-full max-w-[340px] h-auto' : 'w-full max-w-[120px] h-auto'}
        />
      </div>
      <div className="p-4">
        <div className="flex items-center gap-2 mb-1">
          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${tagColors[item.tag]}`}>{item.tag}</span>
          <h3 className="font-medium text-midnight text-sm">{item.label}</h3>
        </div>
        <p className="text-xs text-midnight/50 leading-relaxed mb-3">{item.desc}</p>
        <a
          href={`/assets/hotclaw-logos-v2/${item.file}.svg`}
          download={`hotclaw-${item.file}.svg`}
          className="text-xs text-midnight/30 hover:text-ocean transition-colors"
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
        <Link href="/workshop/operation-hot-dog" className="inline-flex items-center gap-2 text-sm text-midnight/40 hover:text-midnight transition-colors mb-5">
          <ArrowLeft className="w-3.5 h-3.5" /> Back to HQ
        </Link>
        <h1 className="font-display text-4xl text-midnight mb-2">Logo Concepts — V2</h1>
        <p className="text-midnight/50 text-sm max-w-xl leading-relaxed">
          Drawing from OpenClaw&apos;s claw-mark energy and Claude Code&apos;s geometric confidence. Each concept includes both a standalone symbol (favicon) and a full wordmark lockup. All SVG — vector, scalable, downloadable.
        </p>
        <div className="mt-4 p-4 bg-amber-50 border border-amber-200 rounded-xl text-sm text-amber-800">
          <strong>Direction:</strong> Three Slash (S1) for the symbol, Horizontal Lockup (W1) or Slash Integrated (W2) for the wordmark. React on what resonates — Jasper iterates from here.
        </div>
      </div>

      {/* Symbols */}
      <div className="mb-12">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-1 h-6 bg-amber-400 rounded-full" />
          <h2 className="font-display text-xl text-midnight">Symbols</h2>
          <span className="text-xs text-midnight/30">standalone mark · favicon · app icon</span>
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
          <span className="text-xs text-midnight/30">full logo lockup · primary + alternate uses</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {wordmarks.map(item => (
            <LogoCard
              key={item.file}
              item={item}
              wide={item.file !== 'W4-stacked'}
              bg={item.file === 'W3-lockup-light' ? 'light' : 'dark'}
            />
          ))}
        </div>
      </div>

      {/* Favicons */}
      <div className="mb-12">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-1 h-6 bg-green-500 rounded-full" />
          <h2 className="font-display text-xl text-midnight">Favicons</h2>
          <span className="text-xs text-midnight/30">32×32 optimized · browser tab · bookmark</span>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {favicons.map(item => <LogoCard key={item.file} item={item} />)}
        </div>
      </div>

      {/* Next steps */}
      <div className="p-5 bg-midnight rounded-xl text-sm text-cream/60 leading-relaxed">
        <p className="text-cream font-medium mb-2">Next steps</p>
        <p>Pick your direction — tell Jasper which symbol and which wordmark. From here: (1) iterate the SVG further, (2) take it to a designer for refinement, or (3) feed these as reference into an AI image generator for photorealistic/3D versions when OpenAI billing is restored.</p>
      </div>
    </div>
  )
}
