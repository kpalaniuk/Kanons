'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import dynamic from 'next/dynamic'
import {
  Send,
  Loader2,
  Camera,
  SkipForward,
  CheckCircle,
  ChevronRight,
  MessageCircle,
  Box,
  Sparkles,
  Download,
  Share2,
  Copy,
  Edit3,
  ArrowLeft,
  X,
} from 'lucide-react'
import type { RoomSpec, Cabinet } from '@/components/roomforge/RoomCanvas'

const RoomCanvas = dynamic(() => import('@/components/roomforge/RoomCanvas'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center bg-[#1a1a1a]">
      <div className="text-white/50 text-sm">Loading 3D viewport...</div>
    </div>
  ),
})

// ─── Types ───────────────────────────────────────────────────────────────────

type Phase = 1 | 2 | 3 | 4 | 5 | 6
type Phase4Mode = 'chat' | '3d'

interface Message {
  role: 'user' | 'assistant'
  content: string
  viewUpdate?: boolean
}

interface PhotoSlot {
  slot: string
  label: string
  optional?: boolean
  url: string
  dataUrl: string
  aiCaption: string
  analyzing: boolean
  feedback?: string  // conversational feedback shown below the grid
}

interface ConceptState {
  style: string
  finish: string
  hardware: string
  colors: string[]
  notes: string
}

interface ProjectState {
  id: string
  name: string
  phase: Phase
  phase4Mode: Phase4Mode
  photos: PhotoSlot[]
  dimensions: Record<string, number>
  concept: ConceptState
  roomSpec: RoomSpec
  cabinets: Cabinet[]
  renders: string[]
  chatHistory: { phase: Phase; messages: Message[] }[]
  savedAt?: string
}

// ─── Constants ────────────────────────────────────────────────────────────────

const PHOTO_SLOTS: Omit<PhotoSlot, 'url' | 'dataUrl' | 'aiCaption' | 'analyzing'>[] = [
  { slot: 'entry', label: 'Wall facing you (entry)' },
  { slot: 'left', label: 'Left wall' },
  { slot: 'back', label: 'Back wall' },
  { slot: 'right', label: 'Right wall' },
  { slot: 'front', label: 'Wall behind you (front)' },
  { slot: 'ceiling', label: 'Ceiling', optional: true },
  { slot: 'floor', label: 'Floor', optional: true },
]

const PHASE_NAMES: Record<Phase, string> = {
  1: 'Photograph',
  2: 'Measure',
  3: 'Concept',
  4: 'Model',
  5: 'Render',
  6: 'Finalize',
}

const DEFAULT_ROOM_SPEC: RoomSpec = {
  walls: { left: { length: 120 }, back: { length: 120 }, right: { length: 120 }, front: { length: 120 } },
  ceiling: { type: 'flat', height: 108 },
  openings: [],
}

const FUN_FACTS = [
  'Custom cabinetry can increase home value by up to 10%.',
  'Natural birch is one of the most workable woods for cabinetry.',
  'Soft-close hinges last an average of 100,000 cycles.',
  'The average kitchen remodel has a 60-80% ROI.',
  'Shaker-style cabinets originated with the Shaker religious community in the 1700s.',
  'Pull-out shelves can increase usable cabinet storage by 30%.',
]

function makeProject(): ProjectState {
  return {
    id: crypto.randomUUID(),
    name: 'New Room',
    phase: 1,
    phase4Mode: 'chat',
    photos: PHOTO_SLOTS.map((s) => ({ ...s, url: '', dataUrl: '', aiCaption: '', analyzing: false })),
    dimensions: {},
    concept: { style: '', finish: '', hardware: '', colors: [], notes: '' },
    roomSpec: DEFAULT_ROOM_SPEC,
    cabinets: [],
    renders: [],
    chatHistory: [],
  }
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function RoomForgePage() {
  const [project, setProject] = useState<ProjectState>(makeProject)
  const [chatMessages, setChatMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [streaming, setStreaming] = useState(false)
  const [renderLoading, setRenderLoading] = useState(false)
  const [renderFact, setRenderFact] = useState(0)
  const [renderProgress, setRenderProgress] = useState(0)
  const [conceptLocked, setConceptLocked] = useState(false)
  const [dimensionsComplete, setDimensionsComplete] = useState(false)
  const [editingName, setEditingName] = useState(false)
  const [saveKey, setSaveKey] = useState('')

  const chatBottomRef = useRef<HTMLDivElement>(null)
  const saveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const fileInputRefs = useRef<Record<string, HTMLInputElement | null>>({})
  const renderIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  // ── Init ─────────────────────────────────────────────────────────────────

  useEffect(() => {
    // Try to load last project
    try {
      const list = JSON.parse(localStorage.getItem('roomforge-projects') || '[]') as { id: string; name: string; savedAt: string; phase: Phase }[]
      if (list.length > 0) {
        const last = list[0]
        const raw = localStorage.getItem(`roomforge-project-${last.id}`)
        if (raw) {
          const loaded = JSON.parse(raw) as ProjectState
          setProject(loaded)
          // Restore chat history for current phase
          const phaseHistory = loaded.chatHistory.find((h) => h.phase === loaded.phase)
          if (phaseHistory) setChatMessages(phaseHistory.messages)
        }
      }
    } catch { /* ignore */ }
  }, [])

  // ── Auto-save ─────────────────────────────────────────────────────────────

  const saveProject = useCallback((p: ProjectState) => {
    if (saveTimerRef.current) clearTimeout(saveTimerRef.current)
    saveTimerRef.current = setTimeout(() => {
      try {
        const key = `roomforge-project-${p.id}`
        localStorage.setItem(key, JSON.stringify(p))
        const list = JSON.parse(localStorage.getItem('roomforge-projects') || '[]') as { id: string; name: string; savedAt: string; phase: Phase }[]
        const existing = list.findIndex((x) => x.id === p.id)
        const entry = { id: p.id, name: p.name, savedAt: new Date().toISOString(), phase: p.phase }
        if (existing >= 0) list[existing] = entry
        else list.unshift(entry)
        localStorage.setItem('roomforge-projects', JSON.stringify(list.slice(0, 20)))
        setSaveKey(key)
      } catch { /* ignore */ }
    }, 1000)
  }, [])

  function updateProject(updates: Partial<ProjectState>) {
    setProject((prev) => {
      const next = { ...prev, ...updates }
      saveProject(next)
      return next
    })
  }

  // ── Phase navigation ──────────────────────────────────────────────────────

  function goToPhase(phase: Phase) {
    // Save current chat to history
    setProject((prev) => {
      const history = prev.chatHistory.filter((h) => h.phase !== prev.phase)
      history.push({ phase: prev.phase, messages: chatMessages })
      const next = { ...prev, phase, chatHistory: history }
      saveProject(next)
      return next
    })
    // Load chat for new phase
    const phaseHistory = project.chatHistory.find((h) => h.phase === phase)
    setChatMessages(phaseHistory?.messages || [])
    setInput('')
    // Trigger opening message for new phases
    if (phase === 2 || phase === 3 || phase === 4) {
      triggerPhaseOpen(phase)
    }
  }

  function triggerPhaseOpen(phase: Phase) {
    // Kick off an AI opening message
    setTimeout(() => {
      sendPhaseOpenMessage(phase)
    }, 400)
  }

  // ── Chat ──────────────────────────────────────────────────────────────────

  const sendPhaseOpenMessage = useCallback(async (phase: Phase) => {
    const openingMessages: Record<number, string> = {
      2: `Let's get your room dimensions. Starting with the wall you face when you walk in — how wide is it? (Tip: measure in feet and inches, like 13'4")`,
      3: `Now the fun part. Tell me what you're imagining — or I can suggest something based on the style I see in your photos. What direction are you leaning?`,
      4: `I'll start placing cabinets based on your concept. Give me a moment to set things up — then tell me anything you want to adjust.`,
    }
    const msg = openingMessages[phase]
    if (!msg) return

    setChatMessages((prev) => {
      if (prev.length > 0) return prev
      return [{ role: 'assistant', content: msg }]
    })
  }, [])

  const sendMessage = useCallback(async (overrideText?: string) => {
    const text = (overrideText ?? input).trim()
    if (!text || streaming) return

    const userMsg: Message = { role: 'user', content: text }
    const nextMsgs = [...chatMessages, userMsg]
    setChatMessages(nextMsgs)
    setInput('')
    setStreaming(true)

    const placeholder: Message = { role: 'assistant', content: '' }
    setChatMessages([...nextMsgs, placeholder])

    try {
      // Only send photo data in Phase 1 to avoid FUNCTION_PAYLOAD_TOO_LARGE
      // In other phases, send captions only (already in chat history)
      const photosForApi = project.phase === 1
        ? project.photos.filter((p) => p.dataUrl).map((p) => ({ slot: p.slot, dataUrl: p.dataUrl }))
        : project.photos.filter((p) => p.aiCaption).map((p) => ({ slot: p.slot, aiCaption: p.aiCaption }))

      const res = await fetch('/api/roomforge/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: nextMsgs,
          roomSpec: project.roomSpec,
          cabinets: project.cabinets,
          phase: project.phase,
          photos: photosForApi,
        }),
      })

      if (!res.body) throw new Error('No response body')

      const reader = res.body.getReader()
      const decoder = new TextDecoder()
      let fullText = ''
      let hasViewUpdate = false

      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        fullText += decoder.decode(value, { stream: true })

        setChatMessages((prev) => {
          const copy = [...prev]
          copy[copy.length - 1] = { role: 'assistant', content: fullText, viewUpdate: hasViewUpdate }
          return copy
        })

        hasViewUpdate = parseAndApplyJSON(fullText)

        // Check for phase signals
        if (fullText.includes('DIMENSIONS_COMPLETE')) {
          setDimensionsComplete(true)
        }
      }

      // Final parse
      const finalHasUpdate = parseAndApplyJSON(fullText)
      setChatMessages((prev) => {
        const copy = [...prev]
        copy[copy.length - 1] = { role: 'assistant', content: fullText, viewUpdate: finalHasUpdate }
        return copy
      })

      if (fullText.includes('DIMENSIONS_COMPLETE')) setDimensionsComplete(true)
      if (fullText.includes('"style"') && fullText.includes('"finish"')) {
        setConceptLocked(true)
        extractConcept(fullText)
      }
    } catch (err) {
      setChatMessages((prev) => {
        const copy = [...prev]
        copy[copy.length - 1] = {
          role: 'assistant',
          content: `Error: ${err instanceof Error ? err.message : 'Unknown error'}`,
        }
        return copy
      })
    } finally {
      setStreaming(false)
    }
  }, [input, chatMessages, streaming, project])

  function parseAndApplyJSON(text: string): boolean {
    const regex = /```json\s*([\s\S]*?)```/g
    const matches: string[] = []
    let match
    while ((match = regex.exec(text)) !== null) {
      matches.push(match[1].trim())
    }
    let updated = false

    if (matches.length >= 1) {
      try {
        const spec = JSON.parse(matches[0])
        if (spec.walls && spec.ceiling) {
          updateProject({ roomSpec: spec })
          updated = true
        }
      } catch { /* partial */ }
    }
    if (matches.length >= 2) {
      try {
        const cabs = JSON.parse(matches[1])
        if (Array.isArray(cabs)) {
          updateProject({ cabinets: cabs })
          updated = true
        }
      } catch { /* partial */ }
    }
    return updated
  }

  function extractConcept(text: string) {
    try {
      const regex = /```json\s*([\s\S]*?)```/g
      let match
      while ((match = regex.exec(text)) !== null) {
        const parsed = JSON.parse(match[1].trim())
        if (parsed.style || parsed.finish) {
          updateProject({ concept: { ...project.concept, ...parsed } })
          break
        }
      }
    } catch { /* ignore */ }
  }

  // ── Photo handling ────────────────────────────────────────────────────────

  async function handlePhotoUpload(slotId: string, file: File) {
    const dataUrl = await fileToDataUrl(file)
    setProject((prev) => {
      const photos = prev.photos.map((p) =>
        p.slot === slotId ? { ...p, url: URL.createObjectURL(file), dataUrl, analyzing: true, aiCaption: '' } : p
      )
      return { ...prev, photos }
    })

    // Analyze with Claude vision
    try {
      const res = await fetch('/api/roomforge/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [{ role: 'user', content: `Analyze this photo of the ${slotId} of the room.` }],
          roomSpec: project.roomSpec,
          cabinets: project.cabinets,
          phase: 1,
          photos: [{ slot: slotId, dataUrl }],
        }),
      })

      if (res.body) {
        const reader = res.body.getReader()
        const decoder = new TextDecoder()
        let caption = ''
        while (true) {
          const { done, value } = await reader.read()
          if (done) break
          caption += decoder.decode(value, { stream: true })
        }
        setProject((prev) => {
          const photos = prev.photos.map((p) =>
            p.slot === slotId ? { ...p, aiCaption: caption.trim(), analyzing: false } : p
          )
          const next = { ...prev, photos }
          saveProject(next)
          return next
        })
      }
    } catch {
      setProject((prev) => {
        const photos = prev.photos.map((p) =>
          p.slot === slotId ? { ...p, aiCaption: 'Photo saved.', analyzing: false } : p
        )
        return { ...prev, photos }
      })
    }
  }

  function fileToDataUrl(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = () => resolve(reader.result as string)
      reader.onerror = reject
      reader.readAsDataURL(file)
    })
  }

  // ── Render ────────────────────────────────────────────────────────────────

  async function startRender() {
    setRenderLoading(true)
    setRenderProgress(0)
    setRenderFact(Math.floor(Math.random() * FUN_FACTS.length))

    renderIntervalRef.current = setInterval(() => {
      setRenderProgress((p) => Math.min(p + Math.random() * 8, 90))
      setRenderFact((f) => (Math.random() > 0.7 ? (f + 1) % FUN_FACTS.length : f))
    }, 1500)

    try {
      const res = await fetch('/api/roomforge/render', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          concept: project.concept,
          roomSpec: project.roomSpec,
          canvasImageBase64: '',
        }),
      })
      const data = await res.json()
      if (data.imageUrl) {
        clearInterval(renderIntervalRef.current!)
        setRenderProgress(100)
        updateProject({ renders: [data.imageUrl, ...project.renders] })
      }
    } catch (err) {
      console.error('Render failed', err)
    } finally {
      if (renderIntervalRef.current) clearInterval(renderIntervalRef.current)
      setRenderLoading(false)
    }
  }

  function exportCutList() {
    const cutList = project.cabinets.map((c) => ({
      label: c.label || c.type,
      width: c.width,
      height: c.height,
      depth: c.depth,
      wall: c.wall,
    }))
    const blob = new Blob([JSON.stringify(cutList, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${project.name.replace(/\s+/g, '-')}-cutlist.json`
    a.click()
  }

  function shareProject() {
    const key = `roomforge-share-${project.id}`
    localStorage.setItem(key, JSON.stringify(project))
    navigator.clipboard.writeText(`${window.location.origin}/workshop/work/roomforge?share=${project.id}`)
    alert('Share link copied to clipboard!')
  }

  // ── Scroll chat ───────────────────────────────────────────────────────────

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [chatMessages])

  // ─── Phase rendering ──────────────────────────────────────────────────────

  const phase = project.phase
  const progress = ((phase - 1) / 5) * 100

  // ── Progress bar ──────────────────────────────────────────────────────────

  const progressBar = (
    <div className="flex-shrink-0 bg-[#1a1a1a] border-b border-white/10 px-4 py-2.5 flex items-center gap-3">
      {/* Dots */}
      <div className="flex items-center gap-1.5">
        {([1, 2, 3, 4, 5, 6] as Phase[]).map((p) => (
          <button
            key={p}
            onClick={() => p < phase && goToPhase(p)}
            className={`w-2.5 h-2.5 rounded-full transition-all ${
              p === phase
                ? 'bg-amber-400 scale-125'
                : p < phase
                ? 'bg-amber-500/60 hover:bg-amber-400 cursor-pointer'
                : 'bg-white/20 cursor-default'
            }`}
            title={PHASE_NAMES[p]}
          />
        ))}
      </div>

      {/* Phase name */}
      <span className="text-sm font-medium text-white/80 flex-1">
        Phase {phase}: {PHASE_NAMES[phase]}
      </span>

      {/* Progress */}
      <div className="flex items-center gap-2">
        <div className="w-20 h-1 bg-white/10 rounded-full overflow-hidden">
          <div
            className="h-full bg-amber-400 rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
        <span className="text-xs text-white/40">{Math.round(progress)}%</span>
      </div>
    </div>
  )

  // ── Chat UI (shared) ──────────────────────────────────────────────────────

  const chatUI = (footer?: React.ReactNode) => (
    <div className="flex-1 flex flex-col min-h-0">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {chatMessages.length === 0 && (
          <div className="text-center text-white/30 text-sm py-12">
            <div className="text-3xl mb-3">💬</div>
            <p>Starting conversation...</p>
          </div>
        )}
        {chatMessages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div
              className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                msg.role === 'user'
                  ? 'bg-amber-500/25 text-white/90 rounded-br-sm'
                  : 'bg-white/8 text-white/85 rounded-bl-sm'
              }`}
            >
              {msg.content || (
                <span className="flex items-center gap-2 text-white/40">
                  <Loader2 size={12} className="animate-spin" /> Thinking...
                </span>
              )}
              {msg.viewUpdate && msg.role === 'assistant' && (
                <button
                  onClick={() => updateProject({ phase4Mode: '3d' })}
                  className="mt-2 flex items-center gap-1 text-xs text-amber-400 hover:text-amber-300"
                >
                  View update <ChevronRight size={12} />
                </button>
              )}
            </div>
          </div>
        ))}
        <div ref={chatBottomRef} />
      </div>

      {footer}

      <div className="flex-shrink-0 p-3 border-t border-white/10">
        <div className="flex gap-2">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage() }
            }}
            placeholder="Type a message..."
            rows={2}
            className="flex-1 bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm text-white/90 placeholder:text-white/30 focus:outline-none focus:border-amber-500/50 resize-none"
            disabled={streaming}
          />
          <button
            onClick={() => sendMessage()}
            disabled={streaming || !input.trim()}
            className="self-end w-10 h-10 flex items-center justify-center rounded-xl bg-amber-500 hover:bg-amber-400 disabled:opacity-40 transition-colors"
          >
            {streaming ? <Loader2 size={14} className="animate-spin text-white" /> : <Send size={14} className="text-white" />}
          </button>
        </div>
      </div>
    </div>
  )

  // ─────────────────────────────────────────────────────────────────────────
  // PHASE 1: PHOTOGRAPH
  // ─────────────────────────────────────────────────────────────────────────

  const phase1 = (
    <div className="flex-1 overflow-y-auto">
      {/* Instruction card */}
      <div className="mx-4 mt-4 p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20">
        <div className="flex items-start gap-3">
          <Camera size={20} className="text-amber-400 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-white/90">Take photos of each wall</p>
            <p className="text-xs text-white/50 mt-1">
              Start with the main wall facing you when you enter. Good photos help me understand your space better.
            </p>
          </div>
        </div>
      </div>

      {/* Orientation hint */}
      <div className="px-4 pb-2">
        <p className="text-xs text-white/30 text-center">Stand in the doorway. The wall facing you = entry view. Turn left, right, back, then spin to capture the wall behind you.</p>
      </div>

      {/* Photo grid */}
      <div className="grid grid-cols-2 gap-3 px-4 pb-2">
        {project.photos.map((photo) => (
          <div key={photo.slot} className="flex flex-col gap-1">
            <input
              ref={(el) => { fileInputRefs.current[photo.slot] = el }}
              type="file"
              accept="image/*"
              capture="environment"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0]
                if (file) handlePhotoUpload(photo.slot, file)
              }}
            />
            {/* Photo thumbnail */}
            <button
              onClick={() => fileInputRefs.current[photo.slot]?.click()}
              className={`w-full aspect-video rounded-xl border-2 border-dashed flex flex-col items-center justify-center overflow-hidden transition-all ${
                photo.url
                  ? 'border-amber-500/40 bg-black'
                  : 'border-white/20 bg-white/5 hover:border-amber-500/40'
              }`}
            >
              {photo.url ? (
                <img src={photo.url} alt={photo.label} className="w-full h-full object-cover" />
              ) : (
                <>
                  <Camera size={20} className="text-white/30 mb-1.5" />
                  <span className="text-xs text-white/50 text-center px-1 leading-tight">{photo.label}</span>
                  {photo.optional && <span className="text-[10px] text-white/25 mt-0.5">optional</span>}
                </>
              )}
            </button>

            {/* Below thumbnail: label + status + retake */}
            <div className="flex items-center justify-between px-0.5">
              <span className="text-[10px] text-white/40 truncate flex-1">{photo.label}</span>
              {photo.analyzing && (
                <span className="flex items-center gap-1 text-[10px] text-amber-400">
                  <Loader2 size={8} className="animate-spin" /> analyzing
                </span>
              )}
              {photo.url && !photo.analyzing && (
                <button
                  onClick={() => {
                    // Clear this photo slot
                    setProject(prev => ({
                      ...prev,
                      photos: prev.photos.map(p => p.slot === photo.slot
                        ? { ...p, url: '', dataUrl: '', aiCaption: '', feedback: '' }
                        : p
                      )
                    }))
                    // Reset file input
                    if (fileInputRefs.current[photo.slot]) {
                      fileInputRefs.current[photo.slot]!.value = ''
                    }
                  }}
                  className="text-[10px] text-white/30 hover:text-amber-400 transition-colors ml-2"
                >
                  Retake
                </button>
              )}
            </div>

            {/* AI caption below thumbnail */}
            {photo.aiCaption && !photo.analyzing && (
              <p className="text-[10px] text-white/50 leading-relaxed px-0.5">{photo.aiCaption}</p>
            )}
          </div>
        ))}
      </div>

      {/* AI feedback dialogue after photos analyzed */}
      {project.photos.some(p => p.aiCaption && !p.analyzing) && (
        <div className="mx-4 mb-2 bg-white/5 rounded-xl p-3 border border-white/10">
          <div className="flex items-start gap-2">
            <div className="w-6 h-6 rounded-full bg-amber-500 flex items-center justify-center flex-shrink-0 text-xs">⚡</div>
            <div className="text-xs text-white/70 leading-relaxed">
              {(() => {
                const done = project.photos.filter(p => p.url && !p.optional)
                const missing = project.photos.filter(p => !p.url && !p.optional)
                if (missing.length > 0) {
                  return `Good start — I can see ${done.length} wall${done.length !== 1 ? 's' : ''}. Still need: ${missing.map(p => p.label).join(', ')}. Tap each slot to add them.`
                }
                return `I have all the walls. Looking good — tap "Continue" when you're happy with the photos, or retake any that are blurry.`
              })()}
            </div>
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="px-4 pb-6 flex flex-col gap-2">
        <button
          onClick={() => goToPhase(2)}
          className="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-white font-medium text-sm flex items-center justify-center gap-2 transition-colors"
        >
          <CheckCircle size={16} /> All photos look good
        </button>
        <button
          onClick={() => goToPhase(2)}
          className="w-full py-3 rounded-xl bg-white/5 hover:bg-white/10 text-white/60 text-sm flex items-center justify-center gap-2 transition-colors"
        >
          <SkipForward size={16} /> Skip photos — I&apos;ll describe instead
        </button>
      </div>
    </div>
  )

  // ─────────────────────────────────────────────────────────────────────────
  // PHASE 2: MEASURE
  // ─────────────────────────────────────────────────────────────────────────

  const dimCount = Object.keys(project.dimensions).length

  // Simple SVG room diagram
  const roomDiagram = (
    <div className="mx-4 mt-3 p-3 bg-white/5 rounded-xl border border-white/10">
      <p className="text-[10px] text-white/40 mb-2 uppercase tracking-wider">Room Diagram</p>
      <svg viewBox="0 0 200 160" className="w-full h-24">
        <rect x="20" y="10" width="160" height="140" fill="none" stroke="#f59e0b" strokeWidth="2" opacity="0.5" />
        {/* Labels */}
        {project.dimensions['frontWidth'] && (
          <text x="100" y="165" textAnchor="middle" fill="#f59e0b" fontSize="9">
            {Math.round(project.dimensions['frontWidth'] / 12)}′
          </text>
        )}
        {project.dimensions['leftDepth'] && (
          <text x="8" y="80" textAnchor="middle" fill="#f59e0b" fontSize="9" transform="rotate(-90,8,80)">
            {Math.round(project.dimensions['leftDepth'] / 12)}′
          </text>
        )}
        <text x="100" y="88" textAnchor="middle" fill="rgba(255,255,255,0.3)" fontSize="8">
          {dimCount}/6 dims
        </text>
      </svg>
      <p className="text-xs text-white/50 mt-1">Got {dimCount} of 6 key dimensions</p>
    </div>
  )

  const phase2 = chatUI(
    <>
      {roomDiagram}
      {dimensionsComplete && (
        <div className="mx-4 mb-3">
          <button
            onClick={() => goToPhase(3)}
            className="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-white font-medium text-sm flex items-center justify-center gap-2"
          >
            <CheckCircle size={16} /> Looks complete — let&apos;s talk design
          </button>
        </div>
      )}
    </>
  )

  // ─────────────────────────────────────────────────────────────────────────
  // PHASE 3: CONCEPT
  // ─────────────────────────────────────────────────────────────────────────

  const conceptSummary = conceptLocked && project.concept.style ? (
    <div className="mx-4 mb-3 p-4 bg-amber-500/10 border border-amber-500/30 rounded-xl">
      <p className="text-xs text-amber-400 font-medium mb-2">Here&apos;s what we&apos;re building:</p>
      <div className="text-sm text-white/80 space-y-1">
        {project.concept.style && <p>Style: <span className="text-white">{project.concept.style}</span></p>}
        {project.concept.finish && <p>Finish: <span className="text-white">{project.concept.finish}</span></p>}
        {project.concept.hardware && <p>Hardware: <span className="text-white">{project.concept.hardware}</span></p>}
        {project.concept.colors.length > 0 && (
          <div className="flex items-center gap-2 mt-2">
            {project.concept.colors.map((c) => (
              <div key={c} className="w-5 h-5 rounded-full border border-white/20" style={{ backgroundColor: c }} />
            ))}
          </div>
        )}
      </div>
      <div className="flex gap-2 mt-3">
        <button
          onClick={() => goToPhase(4)}
          className="flex-1 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-white text-sm font-medium"
        >
          Looks good
        </button>
        <button
          onClick={() => setConceptLocked(false)}
          className="px-3 py-2 rounded-lg bg-white/10 hover:bg-white/15 text-white/70 text-sm"
        >
          Edit
        </button>
      </div>
    </div>
  ) : null

  const phase3 = chatUI(conceptSummary)

  // ─────────────────────────────────────────────────────────────────────────
  // PHASE 4: MODEL
  // ─────────────────────────────────────────────────────────────────────────

  const phase4 = project.phase4Mode === '3d' ? (
    <div className="flex-1 relative">
      <RoomCanvas roomSpec={project.roomSpec} cabinets={project.cabinets} />

      {/* Cabinet count badge */}
      <div className="absolute top-3 right-3 bg-black/70 border border-white/20 rounded-lg px-2 py-1 text-xs text-white/70">
        {project.cabinets.length} cabinets
      </div>

      {/* Chat toggle */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2">
        <button
          onClick={() => updateProject({ phase4Mode: 'chat' })}
          className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#1a1a1a]/90 border border-white/20 text-white text-sm font-medium shadow-xl backdrop-blur-sm"
        >
          <MessageCircle size={16} className="text-amber-400" />
          Chat
        </button>
      </div>
    </div>
  ) : (
    <div className="flex-1 flex flex-col min-h-0">
      {chatUI(
        <div className="mx-4 mb-2">
          <button
            onClick={() => updateProject({ phase4Mode: '3d' })}
            className="w-full py-2 rounded-xl bg-white/8 hover:bg-white/12 text-white/70 text-sm flex items-center justify-center gap-2 transition-colors"
          >
            <Box size={14} className="text-amber-400" />
            Switch to 3D view
          </button>
        </div>
      )}

      {/* Floating 3D toggle */}
      <div className="absolute bottom-20 right-4 z-10">
        <button
          onClick={() => goToPhase(5)}
          className="flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500 hover:bg-amber-400 text-white text-xs font-medium shadow-lg"
        >
          <Sparkles size={14} />
          Ready to render
        </button>
      </div>
    </div>
  )

  // ─────────────────────────────────────────────────────────────────────────
  // PHASE 5: RENDER
  // ─────────────────────────────────────────────────────────────────────────

  const latestRender = project.renders[0]

  const phase5 = (
    <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
      {!latestRender && !renderLoading && (
        <>
          <div className="text-5xl mb-4">🎨</div>
          <h2 className="text-xl font-semibold text-white mb-2">Ready for your photorealistic preview?</h2>
          <p className="text-sm text-white/50 mb-8 max-w-xs">
            I&apos;ll generate a photorealistic rendering of your design. Takes about 20–30 seconds.
          </p>
          <button
            onClick={startRender}
            className="px-8 py-4 rounded-2xl bg-amber-500 hover:bg-amber-400 text-white font-semibold text-lg flex items-center gap-3 shadow-xl transition-colors"
          >
            <Sparkles size={22} />
            ✨ Render Now
          </button>
        </>
      )}

      {renderLoading && (
        <div className="w-full max-w-sm">
          <div className="text-3xl mb-4">⚙️</div>
          <p className="text-sm font-medium text-white mb-4">Generating your render...</p>

          {/* Progress bar */}
          <div className="w-full h-2 bg-white/10 rounded-full mb-4 overflow-hidden">
            <div
              className="h-full bg-amber-400 rounded-full transition-all duration-700"
              style={{ width: `${renderProgress}%` }}
            />
          </div>

          <p className="text-xs text-white/40 italic">{FUN_FACTS[renderFact]}</p>
        </div>
      )}

      {latestRender && !renderLoading && (
        <div className="w-full flex flex-col gap-3">
          <div className="rounded-2xl overflow-hidden border border-white/10">
            <img src={latestRender} alt="Render" className="w-full object-cover" />
          </div>

          <div className="flex gap-2">
            <a
              href={latestRender}
              download="roomforge-render.jpg"
              className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-white/80 text-sm"
            >
              <Download size={14} /> Download
            </a>
            <button
              onClick={shareProject}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-white/80 text-sm"
            >
              <Share2 size={14} /> Share
            </button>
          </div>

          <div className="flex gap-2 mt-1">
            <button
              onClick={() => goToPhase(4)}
              className="flex-1 py-2.5 rounded-xl bg-white/8 hover:bg-white/12 text-white/60 text-sm"
            >
              <ArrowLeft size={14} className="inline mr-1" /> Adjust design
            </button>
            <button
              onClick={() => goToPhase(6)}
              className="flex-1 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-white text-sm font-medium"
            >
              This is it — finalize
            </button>
          </div>
        </div>
      )}
    </div>
  )

  // ─────────────────────────────────────────────────────────────────────────
  // PHASE 6: FINALIZE
  // ─────────────────────────────────────────────────────────────────────────

  const phase6 = (
    <div className="flex-1 overflow-y-auto p-4">
      {/* Project name */}
      <div className="mb-6 flex items-center gap-3">
        {editingName ? (
          <input
            autoFocus
            value={project.name}
            onChange={(e) => updateProject({ name: e.target.value })}
            onBlur={() => setEditingName(false)}
            onKeyDown={(e) => e.key === 'Enter' && setEditingName(false)}
            className="flex-1 bg-white/10 border border-amber-500/50 rounded-xl px-4 py-2 text-white text-lg font-semibold focus:outline-none"
          />
        ) : (
          <button
            onClick={() => setEditingName(true)}
            className="flex items-center gap-2 group"
          >
            <h2 className="text-xl font-semibold text-white">{project.name}</h2>
            <Edit3 size={14} className="text-white/30 group-hover:text-white/60" />
          </button>
        )}
      </div>

      {/* Saved card */}
      <div className="p-4 bg-amber-500/10 border border-amber-500/30 rounded-2xl mb-6 text-center">
        <div className="text-3xl mb-2">🎉</div>
        <p className="text-sm font-medium text-white">Design complete!</p>
        <p className="text-xs text-white/50 mt-1">
          {project.cabinets.length} cabinets · {project.renders.length} renders
        </p>
      </div>

      {/* Options */}
      <div className="space-y-2">
        <button
          onClick={() => {
            saveProject(project)
            window.location.reload()
          }}
          className="w-full flex items-center gap-3 px-4 py-3.5 rounded-xl bg-white/8 hover:bg-white/12 text-white/80 text-sm font-medium"
        >
          💾 Save &amp; Close
        </button>

        <button
          onClick={() => {
            const newProj = { ...makeProject(), name: `${project.name} (copy)` }
            setProject(newProj)
            setChatMessages([])
            saveProject(newProj)
          }}
          className="w-full flex items-center gap-3 px-4 py-3.5 rounded-xl bg-white/8 hover:bg-white/12 text-white/80 text-sm font-medium"
        >
          📋 Duplicate — try a new design
        </button>

        <button
          onClick={exportCutList}
          className="w-full flex items-center gap-3 px-4 py-3.5 rounded-xl bg-white/8 hover:bg-white/12 text-white/80 text-sm font-medium"
        >
          📐 Export cut list
        </button>

        <button
          onClick={shareProject}
          className="w-full flex items-center gap-3 px-4 py-3.5 rounded-xl bg-white/8 hover:bg-white/12 text-white/80 text-sm font-medium"
        >
          📤 Share with client
        </button>
      </div>
    </div>
  )

  // ─────────────────────────────────────────────────────────────────────────
  // MAIN RENDER
  // ─────────────────────────────────────────────────────────────────────────

  const phaseContent: Record<Phase, React.ReactNode> = {
    1: phase1,
    2: phase2,
    3: phase3,
    4: phase4,
    5: phase5,
    6: phase6,
  }

  return (
    <div className="h-screen overflow-hidden bg-[#0f0f0f] text-white flex flex-col relative">
      {progressBar}
      <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
        {phaseContent[phase]}
      </div>
    </div>
  )
}
