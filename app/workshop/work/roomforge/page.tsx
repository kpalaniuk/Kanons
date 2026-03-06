'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import dynamic from 'next/dynamic'
import { Plus, FolderOpen, Trash2, MessageSquare, Code2, Send, Loader2 } from 'lucide-react'
import type { RoomSpec, Cabinet } from '@/components/roomforge/RoomCanvas'

// Dynamic import to avoid SSR issues with Three.js
const RoomCanvas = dynamic(() => import('@/components/roomforge/RoomCanvas'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center bg-[#1a1a2e]">
      <div className="text-white/50 text-sm">Loading 3D viewport...</div>
    </div>
  ),
})

// ─── Types ───────────────────────────────────────────────────────────────────

interface Message {
  role: 'user' | 'assistant'
  content: string
}

interface Project {
  id: string
  name: string
  roomSpec: RoomSpec
  cabinets: Cabinet[]
  updatedAt: number
}

// ─── Default room (Kyle's example) ───────────────────────────────────────────

const DEFAULT_ROOM_SPEC: RoomSpec = {
  walls: {
    left: { length: 204 },
    back: { length: 160 },
    right: { length: 204 },
    front: { length: 160 },
  },
  ceiling: {
    type: 'shed-vault',
    height: 108,
    peakHeight: 180,
  },
  openings: [
    {
      wall: 'front',
      type: 'trifold',
      offsetFromLeft: 8,
      width: 108,
      height: 96,
    },
    {
      wall: 'right',
      type: 'opening',
      offsetFromLeft: 0,
      width: 120,
      height: 204,
    },
  ],
}

const DEFAULT_CABINETS: Cabinet[] = [
  {
    id: 'desk-left-end',
    wall: 'left',
    offsetFromLeft: 42,
    offsetFromFloor: 30,
    width: 22,
    depth: 24,
    height: 6,
    type: 'desk',
    label: 'Desk surface L-end',
  },
]

const LS_KEY = 'roomforge-projects'

// ─── Component ───────────────────────────────────────────────────────────────

export default function RoomForgePage() {
  const [projects, setProjects] = useState<Project[]>([])
  const [activeProjectId, setActiveProjectId] = useState<string | null>(null)
  const [roomSpec, setRoomSpec] = useState<RoomSpec>(DEFAULT_ROOM_SPEC)
  const [cabinets, setCabinets] = useState<Cabinet[]>(DEFAULT_CABINETS)
  const [activeProjectName, setActiveProjectName] = useState('New Room')

  const [rightTab, setRightTab] = useState<'chat' | 'json'>('chat')
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [streaming, setStreaming] = useState(false)

  const [jsonText, setJsonText] = useState('')
  const [jsonError, setJsonError] = useState<string | null>(null)

  const chatBottomRef = useRef<HTMLDivElement>(null)

  // Load projects from localStorage
  useEffect(() => {
    try {
      const raw = localStorage.getItem(LS_KEY)
      if (raw) {
        const loaded: Project[] = JSON.parse(raw)
        setProjects(loaded)
        if (loaded.length > 0) {
          const first = loaded[0]
          setActiveProjectId(first.id)
          setRoomSpec(first.roomSpec)
          setCabinets(first.cabinets)
          setActiveProjectName(first.name)
        }
      }
    } catch {
      // ignore
    }
  }, [])

  // Sync JSON tab when roomSpec/cabinets change
  useEffect(() => {
    setJsonText(
      JSON.stringify({ roomSpec, cabinets }, null, 2)
    )
  }, [roomSpec, cabinets])

  // Auto-scroll chat
  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // ── Project ops ──────────────────────────────────────────────────────────

  function saveCurrentProject() {
    const id = activeProjectId || crypto.randomUUID()
    const updated: Project = {
      id,
      name: activeProjectName,
      roomSpec,
      cabinets,
      updatedAt: Date.now(),
    }
    const next = activeProjectId
      ? projects.map((p) => (p.id === id ? updated : p))
      : [updated, ...projects]
    setProjects(next)
    setActiveProjectId(id)
    localStorage.setItem(LS_KEY, JSON.stringify(next))
  }

  function newProject() {
    setActiveProjectId(null)
    setActiveProjectName('New Room')
    setRoomSpec(DEFAULT_ROOM_SPEC)
    setCabinets(DEFAULT_CABINETS)
    setMessages([])
  }

  function loadProject(p: Project) {
    setActiveProjectId(p.id)
    setActiveProjectName(p.name)
    setRoomSpec(p.roomSpec)
    setCabinets(p.cabinets)
    setMessages([])
  }

  function deleteProject(id: string) {
    const next = projects.filter((p) => p.id !== id)
    setProjects(next)
    localStorage.setItem(LS_KEY, JSON.stringify(next))
    if (activeProjectId === id) newProject()
  }

  // ── Chat send ─────────────────────────────────────────────────────────────

  const sendMessage = useCallback(async () => {
    const text = input.trim()
    if (!text || streaming) return

    const userMsg: Message = { role: 'user', content: text }
    const nextMsgs = [...messages, userMsg]
    setMessages(nextMsgs)
    setInput('')
    setStreaming(true)

    // Placeholder assistant message
    setMessages([...nextMsgs, { role: 'assistant', content: '' }])

    try {
      const res = await fetch('/api/roomforge/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: nextMsgs,
          roomSpec,
          cabinets,
        }),
      })

      if (!res.body) throw new Error('No response body')

      const reader = res.body.getReader()
      const decoder = new TextDecoder()
      let fullText = ''

      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        fullText += decoder.decode(value, { stream: true })

        // Update last message
        setMessages((prev) => {
          const copy = [...prev]
          copy[copy.length - 1] = { role: 'assistant', content: fullText }
          return copy
        })

        // Parse JSON blocks in real time
        parseAndApplyJSON(fullText)
      }

      // Final parse
      parseAndApplyJSON(fullText)
    } catch (err) {
      setMessages((prev) => {
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
  }, [input, messages, roomSpec, cabinets, streaming])

  function parseAndApplyJSON(text: string) {
    // Find all ```json ... ``` blocks
    const regex = /```json\s*([\s\S]*?)```/g
    const matches: string[] = []
    let match
    while ((match = regex.exec(text)) !== null) {
      matches.push(match[1].trim())
    }

    if (matches.length >= 1) {
      try {
        const spec = JSON.parse(matches[0])
        if (spec.walls && spec.ceiling) {
          setRoomSpec(spec)
        }
      } catch {
        // partial JSON during streaming — ignore
      }
    }

    if (matches.length >= 2) {
      try {
        const cabs = JSON.parse(matches[1])
        if (Array.isArray(cabs)) {
          setCabinets(cabs)
        }
      } catch {
        // partial JSON during streaming — ignore
      }
    }
  }

  // ── JSON tab edit ─────────────────────────────────────────────────────────

  function handleJsonChange(val: string) {
    setJsonText(val)
    try {
      const parsed = JSON.parse(val)
      if (parsed.roomSpec && parsed.cabinets) {
        setRoomSpec(parsed.roomSpec)
        setCabinets(parsed.cabinets)
        setJsonError(null)
      } else {
        setJsonError('Expected { roomSpec, cabinets }')
      }
    } catch (e) {
      setJsonError(e instanceof Error ? e.message : 'Invalid JSON')
    }
  }

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <div className="flex h-[calc(100vh-8rem)] bg-[#0f0f1a] text-white overflow-hidden">

      {/* ── LEFT PANEL ── */}
      <div className="w-[280px] flex-shrink-0 flex flex-col border-r border-white/10 bg-[#13132a]">
        <div className="p-4 border-b border-white/10">
          <h2 className="text-sm font-semibold text-white/80 uppercase tracking-wider mb-3">
            Projects
          </h2>
          <button
            onClick={newProject}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 text-sm font-medium transition-colors"
          >
            <Plus size={14} />
            New Room
          </button>
        </div>

        {/* Active project name */}
        <div className="p-4 border-b border-white/10">
          <label className="text-xs text-white/40 uppercase tracking-wider block mb-1">
            Active Project
          </label>
          <input
            value={activeProjectName}
            onChange={(e) => setActiveProjectName(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-sm text-white/90 focus:outline-none focus:border-amber-500/50"
            placeholder="Project name..."
          />
          <button
            onClick={saveCurrentProject}
            className="mt-2 w-full px-3 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-500 text-white text-xs font-medium transition-colors"
          >
            Save Project
          </button>
        </div>

        {/* Projects list */}
        <div className="flex-1 overflow-y-auto p-3 space-y-1">
          {projects.length === 0 && (
            <p className="text-white/30 text-xs text-center py-4">No saved projects yet</p>
          )}
          {projects.map((p) => (
            <div
              key={p.id}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg cursor-pointer group transition-colors ${
                activeProjectId === p.id
                  ? 'bg-amber-500/20 border border-amber-500/30'
                  : 'hover:bg-white/5'
              }`}
              onClick={() => loadProject(p)}
            >
              <FolderOpen size={13} className="text-amber-400/70 flex-shrink-0" />
              <span className="flex-1 text-sm text-white/80 truncate">{p.name}</span>
              <button
                onClick={(e) => { e.stopPropagation(); deleteProject(p.id) }}
                className="opacity-0 group-hover:opacity-100 transition-opacity text-white/30 hover:text-red-400"
              >
                <Trash2 size={12} />
              </button>
            </div>
          ))}
        </div>

        {/* Quick stats */}
        <div className="p-4 border-t border-white/10 text-xs text-white/30 space-y-1">
          <div className="flex justify-between">
            <span>Walls</span>
            <span className="text-white/50">
              {roomSpec.walls.back.length}"×{roomSpec.walls.left.length}"
            </span>
          </div>
          <div className="flex justify-between">
            <span>Ceiling</span>
            <span className="text-white/50 capitalize">{roomSpec.ceiling.type}</span>
          </div>
          <div className="flex justify-between">
            <span>Openings</span>
            <span className="text-white/50">{roomSpec.openings.length}</span>
          </div>
          <div className="flex justify-between">
            <span>Cabinets</span>
            <span className="text-white/50">{cabinets.length}</span>
          </div>
        </div>
      </div>

      {/* ── CENTER PANEL (3D Viewport) ── */}
      <div className="flex-1 min-w-0 flex flex-col">
        <div className="flex items-center justify-between px-4 py-2 border-b border-white/10 bg-[#13132a]">
          <span className="text-sm font-medium text-white/70">
            3D Viewport — {activeProjectName}
          </span>
          <span className="text-xs text-white/30">
            Drag to orbit · Scroll to zoom · Right-drag to pan
          </span>
        </div>
        <div className="flex-1 min-h-0">
          <RoomCanvas roomSpec={roomSpec} cabinets={cabinets} />
        </div>
      </div>

      {/* ── RIGHT PANEL ── */}
      <div className="w-[360px] flex-shrink-0 flex flex-col border-l border-white/10 bg-[#13132a]">
        {/* Tab bar */}
        <div className="flex border-b border-white/10">
          <button
            onClick={() => setRightTab('chat')}
            className={`flex-1 flex items-center justify-center gap-2 py-3 text-sm font-medium transition-colors ${
              rightTab === 'chat'
                ? 'text-amber-400 border-b-2 border-amber-400'
                : 'text-white/40 hover:text-white/70'
            }`}
          >
            <MessageSquare size={14} />
            Chat
          </button>
          <button
            onClick={() => setRightTab('json')}
            className={`flex-1 flex items-center justify-center gap-2 py-3 text-sm font-medium transition-colors ${
              rightTab === 'json'
                ? 'text-amber-400 border-b-2 border-amber-400'
                : 'text-white/40 hover:text-white/70'
            }`}
          >
            <Code2 size={14} />
            JSON
          </button>
        </div>

        {/* Chat tab */}
        {rightTab === 'chat' && (
          <>
            <div className="flex-1 overflow-y-auto p-4 space-y-4 min-h-0">
              {messages.length === 0 && (
                <div className="text-center text-white/30 text-sm py-8">
                  <div className="text-2xl mb-2">🏠</div>
                  <p>Describe your room or cabinets</p>
                  <p className="text-xs mt-1 text-white/20">
                    Try: "Add base cabinets along the back wall"
                  </p>
                </div>
              )}
              {messages.map((msg, i) => (
                <div
                  key={i}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[90%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                      msg.role === 'user'
                        ? 'bg-amber-500/30 text-white/90 rounded-br-md'
                        : 'bg-white/8 text-white/80 rounded-bl-md'
                    }`}
                  >
                    {msg.content || (
                      <span className="flex items-center gap-2 text-white/40">
                        <Loader2 size={12} className="animate-spin" />
                        Thinking...
                      </span>
                    )}
                  </div>
                </div>
              ))}
              <div ref={chatBottomRef} />
            </div>

            <div className="p-3 border-t border-white/10">
              <div className="flex gap-2">
                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault()
                      sendMessage()
                    }
                  }}
                  placeholder="Describe your room or cabinets..."
                  rows={2}
                  className="flex-1 bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm text-white/90 placeholder:text-white/30 focus:outline-none focus:border-amber-500/50 resize-none"
                  disabled={streaming}
                />
                <button
                  onClick={sendMessage}
                  disabled={streaming || !input.trim()}
                  className="self-end w-9 h-9 flex items-center justify-center rounded-xl bg-amber-500 hover:bg-amber-400 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  {streaming ? (
                    <Loader2 size={14} className="animate-spin text-white" />
                  ) : (
                    <Send size={14} className="text-white" />
                  )}
                </button>
              </div>
              <p className="text-[10px] text-white/20 mt-1.5 text-center">
                Enter to send · Shift+Enter for new line
              </p>
            </div>
          </>
        )}

        {/* JSON tab */}
        {rightTab === 'json' && (
          <div className="flex-1 flex flex-col min-h-0 p-3 gap-2">
            {jsonError && (
              <div className="text-xs text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">
                {jsonError}
              </div>
            )}
            <textarea
              value={jsonText}
              onChange={(e) => handleJsonChange(e.target.value)}
              className="flex-1 bg-[#0f0f1a] border border-white/10 rounded-xl p-3 text-xs text-green-300/80 font-mono focus:outline-none focus:border-amber-500/30 resize-none leading-relaxed"
              spellCheck={false}
            />
            <p className="text-[10px] text-white/20 text-center">
              Edit JSON to update the 3D view instantly
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
