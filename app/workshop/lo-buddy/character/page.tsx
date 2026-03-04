'use client'

import { useState, useEffect } from 'react'
import { Download, ChevronLeft, ChevronRight, X, RotateCcw } from 'lucide-react'
import Link from 'next/link'

const BASE = '/assets/lo-buddy-character'
const BASE3D = `${BASE}/3d`

const MODELS_3D = [
  {
    id: 'v10-hands-free',
    label: 'v10 — Hands Free',
    desc: 'Text-to-3D · arms at sides · mid-30s · more mature face',
    file: 'v10-hands-free.glb',
    current: true,
  },
  {
    id: 'v9-txt2-3d',
    label: 'v9 — Text-to-3D (hands in pockets)',
    desc: 'Text-to-3D · chibi with hands · younger face',
    file: 'v9-txt2-3d.glb',
  },
  {
    id: 'v9-final',
    label: 'v9 — Image-to-3D (no hands)',
    desc: 'From v9-white-003 · Blender skin corrected · matte',
    file: 'v9-final.glb',
  },
  {
    id: 'v8-refined',
    label: 'v8 — Refined',
    desc: 'v8 face · Blender geometry edit',
    file: 'v8-refined.glb',
  },
]

const CONCEPTS = [
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

function ModelViewer({ src, style }: { src: string; style?: React.CSSProperties }) {
  useEffect(() => {
    import('@google/model-viewer')
  }, [])

  return (
    // @ts-expect-error model-viewer is a web component
    <model-viewer
      src={src}
      auto-rotate
      camera-controls
      shadow-intensity="0.5"
      environment-image="neutral"
      style={{ width: '100%', height: '100%', ...style }}
    />
  )
}

export default function LOBuddyCharacter() {
  const [lightbox, setLightbox] = useState<number | null>(null)
  const [round, setRound] = useState<'v9' | 'v8' | 'all'>('v9')
  const [activeModel, setActiveModel] = useState(0)

  const visible = CONCEPTS.filter(c => round === 'all' || c.round === round)
  const currentModel = MODELS_3D[activeModel]

  function prev() { if (lightbox !== null) setLightbox(Math.max(0, lightbox - 1)) }
  function next() { if (lightbox !== null) setLightbox(Math.min(visible.length - 1, lightbox + 1)) }

  return (
    <div style={{ minHeight: '100vh', background: '#f8f7f4', padding: '32px 20px', fontFamily: 'Inter, sans-serif' }}>
      <div style={{ marginBottom: 24 }}>
        <Link href="/workshop/lo-buddy" style={{ color: '#7A8F9E', fontSize: 14, textDecoration: 'none' }}>
          ← LO Buddy
        </Link>
      </div>

      <div style={{ marginBottom: 40 }}>
        <h1 style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 32, fontWeight: 700, color: '#0a0a0a', margin: 0 }}>
          LO Buddy Character
        </h1>
        <p style={{ color: '#7A8F9E', marginTop: 8 }}>Pixar-style 3D chibi · navy suit · dark glasses · trustworthy smile</p>
      </div>

      {/* 3D Model Viewer */}
      <div style={{ background: '#0a0a0a', borderRadius: 16, overflow: 'hidden', marginBottom: 40 }}>
        {/* Model selector tabs */}
        <div style={{ display: 'flex', gap: 0, borderBottom: '1px solid rgba(255,255,255,0.1)', overflowX: 'auto' }}>
          {MODELS_3D.map((m, i) => (
            <button
              key={m.id}
              onClick={() => setActiveModel(i)}
              style={{
                padding: '12px 20px',
                border: 'none',
                cursor: 'pointer',
                fontSize: 13,
                fontWeight: 600,
                whiteSpace: 'nowrap',
                background: activeModel === i ? 'rgba(255,179,102,0.15)' : 'transparent',
                color: activeModel === i ? '#FFB366' : '#7A8F9E',
                borderBottom: activeModel === i ? '2px solid #FFB366' : '2px solid transparent',
                transition: 'all 0.15s',
              }}
            >
              {m.current && '✦ '}{m.label}
            </button>
          ))}
        </div>

        {/* Viewer */}
        <div style={{ height: 500, position: 'relative' }}>
          <ModelViewer src={`${BASE3D}/${currentModel.file}`} />
          <div style={{ position: 'absolute', bottom: 16, left: 16, right: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
            <div>
              <div style={{ color: '#f8f7f4', fontWeight: 600, fontSize: 16 }}>{currentModel.label}</div>
              <div style={{ color: '#7A8F9E', fontSize: 13, marginTop: 4 }}>{currentModel.desc}</div>
            </div>
            <a
              href={`${BASE3D}/${currentModel.file}`}
              download={currentModel.file}
              style={{ display: 'flex', alignItems: 'center', gap: 8, background: '#FFB366', color: '#0a0a0a', padding: '10px 18px', borderRadius: 8, textDecoration: 'none', fontWeight: 600, fontSize: 14, flexShrink: 0 }}
            >
              <Download size={16} /> Download GLB
            </a>
          </div>
        </div>

        <div style={{ padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 8, color: '#7A8F9E', fontSize: 12 }}>
          <RotateCcw size={14} /> Drag to rotate · Scroll to zoom · Right-click to pan
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
