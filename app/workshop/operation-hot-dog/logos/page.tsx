import Image from 'next/image'
import Link from 'next/link'
import { ArrowLeft, Download } from 'lucide-react'

const concepts = [
  { file: '01-claw-H', label: 'Claw H', desc: 'The H crossbar is a diagonal claw slash. Clean, geometric, typographic.' },
  { file: '02-triple-slash', label: 'Triple Slash', desc: 'Three parallel claw marks in staggered amber intensity. Energetic, dynamic.' },
  { file: '03-robot-claw', label: 'Robot Claw', desc: 'Mechanical hand with three sharp claw tips + circuit traces below.' },
  { file: '04-HC-slash', label: 'HC Slash', desc: 'HC monogram with a diagonal amber claw slash cutting across both letters.' },
  { file: '05-flame-claw', label: 'Flame Claw', desc: 'Fire that peaks into sharp claw points. Hot, aggressive, memorable.' },
  { file: '06-circuit-slash', label: 'Circuit Slash', desc: 'Single claw slash with circuit board traces branching off. Amber glow.' },
  { file: '07-starburst', label: 'Starburst', desc: '8-point star with alternating claw and blunt tips. Bold, symmetric.' },
  { file: '08-paw-circuit', label: 'Circuit Paw', desc: 'Paw print evolved — hexagonal circuit nodes + amber trace connections.' },
  { file: '09-spark', label: 'Spark', desc: 'Pure lightning bolt / claw as a spark. Minimal, electric, timeless.' },
  { file: '10-wordmark', label: 'Wordmark', desc: 'HOTCLAW all caps with amber diagonal slash accent on the T-L junction.' },
]

export default function LogosPage() {
  return (
    <div className="pb-20">
      <div className="mb-8">
        <Link href="/workshop/operation-hot-dog" className="inline-flex items-center gap-2 text-sm text-midnight/50 hover:text-midnight transition-colors mb-4">
          <ArrowLeft className="w-3.5 h-3.5" /> Back to HQ
        </Link>
        <h1 className="font-display text-4xl text-midnight mb-2">Logo Concepts</h1>
        <p className="text-midnight/50 text-sm max-w-xl">
          10 SVG concepts for Hotclaw Solutions. All vector — scalable to any size. React / vote on what works, then refine with a designer or iterate from here.
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {concepts.map((c) => (
          <div key={c.file} className="group bg-cream rounded-2xl border border-midnight/5 overflow-hidden hover:border-amber-300 transition-all">
            {/* Preview on dark bg */}
            <div className="bg-[#0a0a0a] p-6 flex items-center justify-center" style={{ minHeight: '160px' }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={`/assets/hotclaw-logos/${c.file}.svg`}
                alt={c.label}
                className="w-full max-w-[120px] h-auto"
              />
            </div>
            {/* Info + download */}
            <div className="p-4">
              <div className="flex items-start justify-between gap-2 mb-1">
                <h3 className="font-medium text-midnight text-sm">{c.label}</h3>
                <a
                  href={`/assets/hotclaw-logos/${c.file}.svg`}
                  download={`hotclaw-${c.file}.svg`}
                  className="text-midnight/30 hover:text-ocean transition-colors flex-shrink-0"
                  title="Download SVG"
                >
                  <Download className="w-3.5 h-3.5" />
                </a>
              </div>
              <p className="text-xs text-midnight/50 leading-relaxed">{c.desc}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-10 p-5 bg-amber-50 border border-amber-200 rounded-xl text-sm text-amber-900">
        <strong>Next steps:</strong> Pick 2-3 directions, then either (a) refine in Figma/Illustrator with a designer, (b) prompt an AI image model with these as reference, or (c) tell Jasper which direction to evolve and I&apos;ll iterate the SVGs. These are starting points, not finals.
      </div>
    </div>
  )
}
