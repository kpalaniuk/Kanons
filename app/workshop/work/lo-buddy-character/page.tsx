'use client'

import { useState } from 'react'
import { Palette, X, ChevronLeft, ChevronRight, Download } from 'lucide-react'
import Link from 'next/link'

// All generated concept images — stored in /public/workshop/lo-buddy-character/
const CONCEPTS = [
  { id: 'v7-001', label: 'v7.1 — Navy crewneck · wireframe', model: 'Imagen 4' },
  { id: 'v7-002', label: 'v7.2 — Button-down · tortoiseshell', model: 'Imagen 4' },
  { id: 'v7-003', label: 'v7.3 — White tee · gold wireframe', model: 'Imagen 4' },
  { id: 'v7-004', label: 'v7.4 — Charcoal hoodie · round wire', model: 'Imagen 4' },
  { id: 'v7-005', label: 'v7.5 — Casual blazer · tortoiseshell rect', model: 'Imagen 4' },
  { id: 'v7-006', label: 'v7.6 — Cinematic · silver wire · pink rim', model: 'Imagen 4' },
  { id: 'v7-007', label: 'v7.7 — Tight portrait · half-rim · Spider-Verse', model: 'Imagen 4' },
  { id: 'v7-008', label: 'v7.8 — Navy crew · chromatic aberration', model: 'Gemini Flash' },
  { id: 'v7-009', label: 'v7.9 — 3/4 body · blazer · cool advisor', model: 'Gemini Flash' },
  { id: 'v7-010', label: 'v7.10 — Symmetric · model sheet · brand icon', model: 'Gemini Flash' },
]

// Older rounds (archived reference)
const ARCHIVED = [
  { id: 'flash-full-body-confident', label: 'v6 Flash — Full body (armor)', model: 'Gemini Flash', folder: 'lo-buddy-concepts' },
  { id: 'flash-face-closeup', label: 'v6 Flash — Face closeup (armor)', model: 'Gemini Flash', folder: 'lo-buddy-concepts' },
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

type Concept = typeof CONCEPTS[number] & { folder?: string }

export default function LOBuddyCharacterPage() {
  const [lightbox, setLightbox] = useState<number | null>(null)
  const [tab, setTab] = useState<'v7' | 'archived'>('v7')

  const active = tab === 'v7' ? CONCEPTS : ARCHIVED
  const all = [...CONCEPTS, ...ARCHIVED] as Concept[]

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
        <p className="text-midnight/50 text-sm">AI-generated concept art · Spider-Verse 2D style · Select your direction for Grease Pencil build</p>
      </div>

      {/* Brief card */}
      <div className="bg-midnight rounded-2xl p-5 text-cream/80 text-sm space-y-2">
        <p className="text-cream font-semibold text-base">v7 Brief</p>
        <p>No armor. Casual professional. Warm medium-dark brown skin, mixed-race. Nerdier glasses — wireframe or tortoiseshell, not flashy. Same character energy: smart, approachable, slightly nerdy but cool.</p>
        <div className="flex flex-wrap gap-3 pt-1 text-xs text-cream/50">
          <span>Models: Imagen 4 · Gemini 3.1 Flash</span>
          <span>·</span>
          <span>10 variations</span>
          <span>·</span>
          <Link href="/workshop/work/lo-buddy-landing" className="text-ocean hover:text-cyan transition-colors">↗ Landing page</Link>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2">
        {(['v7', 'archived'] as const).map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${tab === t ? 'bg-midnight text-cream' : 'bg-sand text-midnight/50 hover:bg-midnight/10'}`}
          >
            {t === 'v7' ? '✦ v7 — No Armor' : 'Archive — v6 (Armor)'}
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
