'use client'

import { useState } from 'react'
import { Download, ExternalLink, ChevronLeft, ChevronRight, X } from 'lucide-react'
import Link from 'next/link'

const BASE = '/assets/lo-buddy-character'
const BASE3D = `${BASE}/3d`

const CURRENT_3D = {
  preview: `${BASE3D}/v9-preview.png`,
  glb: `${BASE3D}/v9-final.glb`,
  label: 'v9-final.glb — skin corrected, matte, Blender cleaned',
  meshy_task: '019ca22e-e997-7f9d-b1da-3d20c36317af',
}

const CONCEPTS = [
  // v9 — current round (new face: round head, big eyes, calm smile)
  { id: 'v9-white-003', label: 'v9 · Meshy pick ⭐⭐ — calm smile, white bg', round: 'v9' },
  { id: 'v9-white-001', label: 'v9 · White bg · frontal direct', round: 'v9' },
  { id: 'v9-004', label: 'v9 · Most sophisticated ⭐', round: 'v9' },
  { id: 'v9-003', label: 'v9 · Roundest head · big eyes', round: 'v9' },
  { id: 'v9-008', label: 'v9 · Listening face · calm', round: 'v9' },
  { id: 'v9-001', label: 'v9 · Round head · gentle smile', round: 'v9' },
  { id: 'v9-006', label: 'v9 · Max chibi · round', round: 'v9' },
  { id: 'v9-007', label: 'v9 · Deeper skin tone', round: 'v9' },
  { id: 'v9-002', label: 'v9 · 3/4 · one brow raised', round: 'v9' },
  { id: 'v9-005', label: 'v9 · Problem solved smirk', round: 'v9' },
  { id: 'v9-white-002', label: 'v9 · White bg · slight angle', round: 'v9' },
  // v8 — previous round
  { id: 'v8-005', label: 'v8 · Meshy pick ⭐', round: 'v8' },
  { id: 'v8-004', label: 'v8 · Calm pro', round: 'v8' },
  { id: 'v8-007', label: 'v8 · Dark bg · trustworthy', round: 'v8' },
  { id: 'v8-001', label: 'v8 · Straight on', round: 'v8' },
  { id: 'v8-006', label: 'v8 · Warmer skin', round: 'v8' },
  { id: 'v8-008', label: 'v8 · Cinematic', round: 'v8' },
  { id: 'v8-002', label: 'v8 · 3/4 smirk', round: 'v8' },
  { id: 'v8-003', label: 'v8 · Enthusiastic grin', round: 'v8' },
  { id: 'v8-009', label: 'v8 · Celebrating', round: 'v8' },
  { id: 'v8-010', label: 'v8 · Icon style', round: 'v8' },
]

export default function LOBuddyCharacter() {
  const [lightbox, setLightbox] = useState<number | null>(null)
  const [round, setRound] = useState<'v9' | 'v8' | 'all'>('v9')

  const visible = CONCEPTS.filter(c => round === 'all' || c.round === round)

  function prev() { if (lightbox !== null) setLightbox(Math.max(0, lightbox - 1)) }
  function next() { if (lightbox !== null) setLightbox(Math.min(visible.length - 1, lightbox + 1)) }

  return (
    <div style={{ minHeight: '100vh', background: '#f8f7f4', padding: '32px 20px', fontFamily: 'Inter, sans-serif' }}>
      {/* Back */}
      <div style={{ marginBottom: 24 }}>
        <Link href="/workshop/work" style={{ color: '#7A8F9E', fontSize: 14, textDecoration: 'none' }}>
          ← Workshop
        </Link>
      </div>

      {/* Header */}
      <div style={{ marginBottom: 40 }}>
        <h1 style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 32, fontWeight: 700, color: '#0a0a0a', margin: 0 }}>
          LO Buddy Character
        </h1>
        <p style={{ color: '#7A8F9E', marginTop: 8 }}>Pixar-style 3D caricature head · warm brown skin · thick dark glasses · trustworthy smile</p>
      </div>

      {/* 3D Model — Current */}
      <div style={{ background: '#0a0a0a', borderRadius: 16, padding: 24, marginBottom: 40, display: 'flex', gap: 24, alignItems: 'center', flexWrap: 'wrap' }}>
        <img
          src={CURRENT_3D.preview}
          alt="Current 3D model"
          style={{ width: 180, height: 180, objectFit: 'cover', borderRadius: 12, flexShrink: 0 }}
        />
        <div style={{ flex: 1, minWidth: 200 }}>
          <div style={{ color: '#FFB366', fontSize: 12, fontWeight: 600, marginBottom: 6, textTransform: 'uppercase', letterSpacing: 1 }}>
            Current 3D Model
          </div>
          <div style={{ color: '#f8f7f4', fontWeight: 600, fontSize: 18, marginBottom: 6 }}>
            v9 — New Face
          </div>
          <div style={{ color: '#7A8F9E', fontSize: 13, marginBottom: 16, lineHeight: 1.5 }}>
            Round head · big eyes · calm smile · matte skin (Blender corrected)<br />
            Meshy Image-to-3D · PBR off · skin desaturated · roughness 0.88
          </div>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            <a
              href={CURRENT_3D.glb}
              download="lo-buddy-v9-final.glb"
              style={{ display: 'flex', alignItems: 'center', gap: 8, background: '#FFB366', color: '#0a0a0a', padding: '10px 18px', borderRadius: 8, textDecoration: 'none', fontWeight: 600, fontSize: 14 }}
            >
              <Download size={16} /> Download GLB
            </a>
            <a
              href={`https://sandbox.babylonjs.com/`}
              target="_blank"
              rel="noopener noreferrer"
              style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'rgba(255,255,255,0.1)', color: '#f8f7f4', padding: '10px 18px', borderRadius: 8, textDecoration: 'none', fontWeight: 500, fontSize: 14 }}
            >
              <ExternalLink size={16} /> Preview in Babylon
            </a>
          </div>
        </div>
      </div>

      {/* Previous 3D models */}
      <div style={{ marginBottom: 40 }}>
        <h2 style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 18, fontWeight: 600, color: '#0a0a0a', marginBottom: 16 }}>
          Previous 3D Exports
        </h2>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          {[
            { label: 'v8-refined.glb', sub: 'v8 face, Blender geometry edit', file: 'v8-refined.glb' },
            { label: 'v8-007-matte.glb', sub: 'v8 Meshy round 2 winner (clown skin)', file: 'v8-007-matte.glb' },
            { label: 'v8-004-matte.glb', sub: 'v8 Meshy round 2 backup', file: 'v8-004-matte.glb' },
          ].map(m => (
            <a
              key={m.file}
              href={`${BASE3D}/${m.file}`}
              download={m.file}
              style={{ background: '#fff', border: '1px solid #e5e5e5', borderRadius: 10, padding: '12px 16px', textDecoration: 'none', minWidth: 180 }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#0a0a0a', fontWeight: 600, fontSize: 13, marginBottom: 4 }}>
                <Download size={14} /> {m.label}
              </div>
              <div style={{ color: '#7A8F9E', fontSize: 12 }}>{m.sub}</div>
            </a>
          ))}
        </div>
      </div>

      {/* Concept Art */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20, flexWrap: 'wrap', gap: 12 }}>
          <h2 style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 18, fontWeight: 600, color: '#0a0a0a', margin: 0 }}>
            Concept Art
          </h2>
          <div style={{ display: 'flex', gap: 8 }}>
            {(['v9', 'v8', 'all'] as const).map(r => (
              <button
                key={r}
                onClick={() => setRound(r)}
                style={{ padding: '6px 16px', borderRadius: 20, border: '1.5px solid', cursor: 'pointer', fontSize: 13, fontWeight: 600, transition: 'all 0.15s',
                  background: round === r ? '#0a0a0a' : 'transparent',
                  color: round === r ? '#f8f7f4' : '#7A8F9E',
                  borderColor: round === r ? '#0a0a0a' : '#ddd' }}
              >
                {r === 'all' ? 'All' : r === 'v9' ? '✦ v9 Current' : 'v8 Previous'}
              </button>
            ))}
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 12 }}>
          {visible.map((c, i) => (
            <div
              key={c.id}
              onClick={() => setLightbox(i)}
              style={{ cursor: 'pointer', borderRadius: 12, overflow: 'hidden', background: '#fff', border: '1.5px solid #e5e5e5', transition: 'box-shadow 0.15s' }}
              onMouseEnter={e => (e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.12)')}
              onMouseLeave={e => (e.currentTarget.style.boxShadow = 'none')}
            >
              <img src={`${BASE}/${c.id}.png`} alt={c.label} style={{ width: '100%', aspectRatio: '1', objectFit: 'cover', display: 'block' }} />
              <div style={{ padding: '8px 10px' }}>
                <div style={{ fontSize: 11, color: '#7A8F9E', lineHeight: 1.4 }}>{c.label.replace(/^v[89][\s·]+/, '')}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Lightbox */}
      {lightbox !== null && (
        <div
          onClick={() => setLightbox(null)}
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.92)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: 20 }}
        >
          <button onClick={e => { e.stopPropagation(); prev() }} style={{ position: 'fixed', left: 16, top: '50%', transform: 'translateY(-50%)', background: 'rgba(255,255,255,0.1)', border: 'none', color: '#fff', borderRadius: '50%', width: 44, height: 44, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <ChevronLeft size={22} />
          </button>
          <div onClick={e => e.stopPropagation()} style={{ maxWidth: 520, width: '100%', textAlign: 'center' }}>
            <img src={`${BASE}/${visible[lightbox].id}.png`} alt="" style={{ width: '100%', borderRadius: 16 }} />
            <div style={{ color: 'rgba(255,255,255,0.6)', marginTop: 12, fontSize: 13 }}>
              {visible[lightbox].label} · {lightbox + 1}/{visible.length}
            </div>
          </div>
          <button onClick={e => { e.stopPropagation(); next() }} style={{ position: 'fixed', right: 16, top: '50%', transform: 'translateY(-50%)', background: 'rgba(255,255,255,0.1)', border: 'none', color: '#fff', borderRadius: '50%', width: 44, height: 44, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <ChevronRight size={22} />
          </button>
          <button onClick={() => setLightbox(null)} style={{ position: 'fixed', top: 16, right: 16, background: 'rgba(255,255,255,0.1)', border: 'none', color: '#fff', borderRadius: '50%', width: 44, height: 44, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <X size={20} />
          </button>
        </div>
      )}
    </div>
  )
}
