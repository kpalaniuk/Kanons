'use client'

import { useState } from 'react'
import { journalEntries } from '@/lib/journal'
import { ChevronLeft, ChevronRight, MapPin, Clock, BookOpen } from 'lucide-react'

// ─── Render body text ─────────────────────────────────────────────────────────
// Preserve Kyle's line breaks, em dashes, and paragraph spacing

function renderBody(body: string) {
  const paragraphs = body.split('\n\n')

  return (
    <div className="space-y-5">
      {paragraphs.map((para, i) => {
        const lines = para.split('\n')

        // Standalone em dash separator
        if (para.trim() === '—') {
          return (
            <div key={i} className="flex items-center justify-center py-1">
              <span className="text-midnight/20 text-xl select-none">—</span>
            </div>
          )
        }

        // Italic lines (wrapped in * *)
        if (para.startsWith('*(') && para.endsWith(')*')) {
          return (
            <p key={i} className="text-midnight/40 text-base italic leading-relaxed">
              {para.slice(2, -2)}
            </p>
          )
        }

        // Block quote / prayer style (starts with "Dear")
        if (para.startsWith('Dear ')) {
          return (
            <p key={i} className="text-midnight/80 text-lg leading-relaxed font-medium">
              {para}
            </p>
          )
        }

        return (
          <div key={i} className="space-y-1">
            {lines.map((line, j) => {
              if (!line.trim()) return null

              // Italic line
              if (line.startsWith('*') && line.endsWith('*')) {
                return (
                  <p key={j} className="text-midnight/40 text-base italic leading-relaxed">
                    {line.slice(1, -1)}
                  </p>
                )
              }

              return (
                <p key={j} className="text-midnight/80 text-lg leading-relaxed">
                  {line}
                </p>
              )
            })}
          </div>
        )
      })}
    </div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function JournalPage() {
  const [idx, setIdx] = useState(0)
  const entry = journalEntries[idx]
  const total = journalEntries.length

  return (
    <div className="max-w-2xl mx-auto pb-24">

      {/* Header */}
      <div className="mb-10">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-9 h-9 rounded-xl bg-midnight flex items-center justify-center flex-shrink-0">
            <BookOpen size={17} className="text-cream" />
          </div>
          <div>
            <h1 className="font-display text-3xl text-midnight">Journal</h1>
            <p className="text-sm text-midnight/40">Kyle's brain dumps — voice preserved</p>
          </div>
        </div>
      </div>

      {/* Entry navigation */}
      <div className="flex items-center justify-between mb-8">
        <button
          onClick={() => setIdx(i => Math.min(i + 1, total - 1))}
          disabled={idx >= total - 1}
          className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm text-midnight/50 hover:text-midnight hover:bg-sand transition-colors disabled:opacity-20 disabled:cursor-not-allowed"
        >
          <ChevronLeft size={16} />
          Older
        </button>

        {/* Entry dots */}
        <div className="flex items-center gap-1.5">
          {journalEntries.map((_, i) => (
            <button
              key={i}
              onClick={() => setIdx(i)}
              className={`w-2 h-2 rounded-full transition-all ${
                i === idx ? 'bg-midnight scale-125' : 'bg-midnight/20 hover:bg-midnight/40'
              }`}
            />
          ))}
        </div>

        <button
          onClick={() => setIdx(i => Math.max(i - 1, 0))}
          disabled={idx <= 0}
          className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm text-midnight/50 hover:text-midnight hover:bg-sand transition-colors disabled:opacity-20 disabled:cursor-not-allowed"
        >
          Newer
          <ChevronRight size={16} />
        </button>
      </div>

      {/* Entry card */}
      <div className="bg-cream rounded-2xl border border-midnight/8 overflow-hidden">

        {/* Entry header */}
        <div className="px-8 pt-8 pb-6 border-b border-midnight/6">
          <p className="font-display text-2xl text-midnight mb-3">{entry.date}</p>
          <div className="flex flex-wrap items-center gap-4 text-sm text-midnight/40">
            {entry.time && (
              <span className="flex items-center gap-1.5">
                <Clock size={13} />
                {entry.time}
              </span>
            )}
            {entry.location && (
              <span className="flex items-center gap-1.5">
                <MapPin size={13} />
                {entry.location}
              </span>
            )}
          </div>
        </div>

        {/* Entry body */}
        <div className="px-8 py-8">
          {renderBody(entry.body)}
        </div>

        {/* Footer */}
        <div className="px-8 pb-6">
          <p className="text-xs text-midnight/20 font-mono">
            Entry {total - idx} of {total}
          </p>
        </div>
      </div>

      {/* Entry list — small index below */}
      <div className="mt-8 space-y-1">
        <p className="text-xs text-midnight/30 uppercase tracking-widest font-mono mb-3">All entries</p>
        {journalEntries.map((e, i) => (
          <button
            key={i}
            onClick={() => setIdx(i)}
            className={`w-full text-left px-4 py-3 rounded-xl text-sm transition-colors flex items-center justify-between group ${
              i === idx
                ? 'bg-midnight text-cream'
                : 'hover:bg-sand text-midnight/60 hover:text-midnight'
            }`}
          >
            <span className="font-medium">{e.date}</span>
            {e.location && (
              <span className={`text-xs ${i === idx ? 'text-cream/50' : 'text-midnight/30'}`}>
                {e.location}
              </span>
            )}
          </button>
        ))}
      </div>

    </div>
  )
}
