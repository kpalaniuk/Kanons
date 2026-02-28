'use client'

import { useState } from 'react'
import { Palette, X, ChevronLeft, ChevronRight, Download } from 'lucide-react'
import Link from 'next/link'

// v9 — New face: round head, big eyes, calm smile (current round)
const V9 = [
  { id: 'v9-001', label: 'v9.1 — Round head · calm smile', model: 'Imagen 4' },
  { id: 'v9-002', label: 'v9.2 — 3/4 · one brow raised', model: 'Imagen 4' },
  { id: 'v9-003', label: 'v9.3 — Round + big eyes · gentle', model: 'Imagen 4' },
  { id: 'v9-004', label: 'v9.4 — Most sophisticated ⭐', model: 'Imagen 4' },
  { id: 'v9-005', label: 'v9.5 — 3/4 · problem solved', model: 'Imagen 4' },
  { id: 'v9-006', label: 'v9.6 — Max chibi + round', model: 'Imagen 4' },
  { id: 'v9-007', label: 'v9.7 — Deeper skin tone', model: 'Imagen 4' },
  { id: 'v9-008', label: 'v9.8 — Listening face · calm', model: 'Imagen 4' },
  { id: 'v9-white-001', label: 'v9.w1 — White bg · frontal', model: 'Imagen 4' },
  { id: 'v9-white-002', label: 'v9.w2 — White bg · slight angle', model: 'Imagen 4' },
  { id: 'v9-white-003', label: 'v9.w3 — White bg · Meshy pick ⭐⭐', model: 'Imagen 4' },
]

// v8 — Pixar caricature head (previous round)
const V8 = [
  { id: 'v8-001', label: 'v8.1 — Straight on · big smile', model: 'Imagen 4' },
  { id: 'v8-002', label: 'v8.2 — 3/4 angle · knowing smirk', model: 'Imagen 4' },
  { id: 'v8-003', label: 'v8.3 — Enthusiastic grin · chin up', model: 'Imagen 4' },
  { id: 'v8-004', label: 'v8.4 — Calm pro · just solved it ⭐', model: 'Imagen 4' },
  { id: 'v8-005', label: 'v8.5 — White bg · Meshy pick ⭐⭐', model: 'Imagen 4' },
  { id: 'v8-006', label: 'v8.6 — Warmer skin · confident', model: 'Imagen 4' },
  { id: 'v8-007', label: 'v8.7 — Calm trustworthy · dark bg', model: 'Imagen 4' },
  { id: 'v8-008', label: 'v8.8 — Tortoiseshell detail · cinematic', model: 'Imagen 4' },
  { id: 'v8-009', label: 'v8.9 — Mid-laugh · celebrate with client', model: 'Imagen 4' },
  { id: 'v8-010', label: 'v8.10 — Icon style · white bg', model: 'Imagen 4' },
]

// v7 — No-armor casual round
const V7 = [
  { id: 'v7-001', label: 'v7.1 — Navy crewneck · wireframe', model: 'Imagen 4' },
  { id: 'v7-002', label: 'v7.2 — Button-down · tortoiseshell', model: 'Imagen 4' },
  { id: 'v7-003', label: 'v7.3 — White tee · gold wireframe', model: 'Imagen 4' },
  { id: 'v7-004', label: 'v7.4 — Charcoal hoodie · round wire', model: 'Imagen 4' },
  { id: 'v7-005', label: 'v7.5 — Casual blazer · tortoiseshell', model: 'Imagen 4' },
  { id: 'v7-006', label: 'v7.6 — Cinematic · silver wire', model: 'Imagen 4' },
  { id: 'v7-007', label: 'v7.7 — Tight portrait · Spider-Verse', model: 'Imagen 4' },
  { id: 'v7-008', label: 'v7.8 — Navy crew · chromatic', model: 'Gemini Flash' },
  { id: 'v7-009', label: 'v7.9 — 3/4 body · blazer', model: 'Gemini Flash' },
  { id: 'v7-010', label: 'v7.10 — Model sheet · icon', model: 'Gemini Flash' },
]

// v6 — Armor round (archived)
const ARCHIVED = [
  { id: 'flash-full-body-confident', label: 'v6 Flash — Full body (armor)', model: 'Gemini Flash', folder: 'lo-buddy-concepts' },
  { id: 'flash-face-closeup', label: 'v6 Flash — Face closeup', model: 'Gemini Flash', folder: 'lo-buddy-concepts' },
  { id: 'flash-scroll-action', label: 'v6 Flash — Scroll action', model: 'Gemini Flash', folder: 'lo-buddy-concepts' },
  { id: 'flash-spider-verse-flat', label: 'v6 Flash — Spider-Verse flat', model: 'Gemini Flash', folder: 'lo-buddy-concepts' },
  { id: 'imagen4-full-body-confident', label: 'v6 Imagen4 — Full body', model: 'Imagen 4', folder: 'lo-buddy-concepts' },
  { id: 'imagen4-face-closeup', label: 'v6 Imagen4 — Face (best)', model: 'Imagen 4', folder: 'lo-buddy-concepts' },
  { id: 'pro-full-body-confident', label: 'v6 Pro — Full body', model: 'Gemini 3 Pro', folder: 'lo-buddy-concepts' },
  { id: 'pro-face-closeup', label: 'v6 Pro — Face closeup', model: 'Gemini 3 Pro', folder: 'lo-buddy-concepts' },
]

function imgUrl(concept: { id: string; folder?: string }) {
  const folder = concept.folder || 'lo-buddy-character'
  return `/assets/${folder}/${concept.id}.png`
}

type Concept = { id: string; label: string; model: string; folder?: string }

export default function LOBuddyCharacterPage() {
  const [lightbox, setLightbox] = useState<number | null>(null)
  const [tab, setTab] = useState<'v9' | 'v8' | 'v7' | 'archived'>('v9')

  const active: Concept[] = tab === 'v9' ? V9 : tab === 'v8' ? V8 : tab === 'v7' ? V7 : ARCHIVED

  const openIdx = lightbox !== null ? lightbox : -1

  const prev = () => setLightbox(i => (i !== null && i > 0 ? i - 1 : i))
  const next = () => setLightbox(i => (i !== null && i < active.length - 1 ? i + 1 : i))

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Header */}
      <div>
        <div className="flex items-center gap-3 mb-1">
          <Palette className="w-7 h-7 text-terracotta" />
          <h1 className="font-display text-3xl text-midnight">LO Buddy — Character Concepts</h1>
        </div>
        <p className="text-midnight/50 text-sm">AI-generated concept art · Pixar caricature style · v9-white-003 selected for Meshy 3D generation</p>
      </div>

      {/* Brief card */}
      <div className="bg-midnight rounded-2xl p-5 text-cream/80 text-sm space-y-2">
        <p className="text-cream font-semibold text-base">v8 Brief — Pixar Caricature Head</p>
        <p>Pixar/Disney 3D render style. Caricature proportions — big head, large expressive eyes, warm brown mixed-race skin. Thick dark glasses. Trustworthy warm smile. Navy blazer. Just the head — body/animations come later. v8-005 → Meshy AI → Blender rig → GLB.</p>
        <div className="flex flex-wrap gap-3 pt-1 text-xs text-cream/50">
          <span>Models: Imagen 4 · Gemini 3.1 Flash</span>
          <span>·</span>
          <span>10 variations</span>
          <span>·</span>
          <Link href="/workshop/work/lo-buddy-landing" className="text-ocean hover:text-cyan transition-colors">↗ Landing page</Link>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 flex-wrap">
        {([['v9', '✦ v9 — New Face'], ['v8', 'v8 — First Pixar'], ['v7', 'v7 — No Armor'], ['archived', 'v6 — Armor']] as const).map(([t, label]) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${tab === t ? 'bg-midnight text-cream' : 'bg-sand text-midnight/50 hover:bg-midnight/10'}`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {active.map((concept, i) => (
          <button
            key={concept.id}
            onClick={() => setLightbox(i)}
            className="group relative aspect-[3/4] bg-midnight/5 rounded-2xl overflow-hidden border border-midnight/8 hover:border-ocean/40 hover:shadow-lg transition-all"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={imgUrl(concept as Concept)}
              alt={concept.label}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              loading="lazy"
              onError={(e) => {
                const t = e.currentTarget
                t.style.display = 'none'
                const parent = t.parentElement
                if (parent) {
                  const ph = document.createElement('div')
                  ph.className = 'w-full h-full flex items-center justify-center text-midnight/20 text-xs p-4 text-center'
                  ph.textContent = 'Generating…'
                  parent.appendChild(ph)
                }
              }}
            />
            {/* Overlay on hover */}
            <div className="absolute inset-0 bg-midnight/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-end p-3">
              <span className="text-cream text-xs text-center font-medium leading-tight">{concept.label}</span>
              <span className="text-cream/50 text-xs mt-1">{concept.model}</span>
            </div>
            {/* Index badge */}
            <div className="absolute top-2 left-2 bg-midnight/70 text-cream text-xs font-bold px-2 py-0.5 rounded-full">
              {i + 1}
            </div>
          </button>
        ))}
      </div>

      {/* Lightbox */}
      {lightbox !== null && (
        <div
          className="fixed inset-0 z-50 bg-midnight/95 flex items-center justify-center"
          onClick={() => setLightbox(null)}
        >
          <div
            className="relative max-w-2xl w-full mx-4"
            onClick={e => e.stopPropagation()}
          >
            {/* Close */}
            <button
              onClick={() => setLightbox(null)}
              className="absolute -top-12 right-0 text-cream/60 hover:text-cream transition-colors"
            >
              <X className="w-6 h-6" />
            </button>

            {/* Image */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={imgUrl(active[openIdx] as Concept)}
              alt={active[openIdx]?.label}
              className="w-full rounded-2xl shadow-2xl"
            />

            {/* Label */}
            <div className="mt-4 text-center">
              <p className="text-cream font-semibold">{active[openIdx]?.label}</p>
              <p className="text-cream/40 text-sm">{active[openIdx]?.model}</p>
            </div>

            {/* Nav */}
            <div className="flex items-center justify-between mt-4">
              <button
                onClick={prev}
                disabled={openIdx === 0}
                className="flex items-center gap-2 px-4 py-2 bg-cream/10 text-cream rounded-lg text-sm disabled:opacity-30 hover:bg-cream/20 transition-colors"
              >
                <ChevronLeft className="w-4 h-4" /> Prev
              </button>
              <span className="text-cream/40 text-sm">{openIdx + 1} / {active.length}</span>
              <button
                onClick={next}
                disabled={openIdx === active.length - 1}
                className="flex items-center gap-2 px-4 py-2 bg-cream/10 text-cream rounded-lg text-sm disabled:opacity-30 hover:bg-cream/20 transition-colors"
              >
                Next <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
