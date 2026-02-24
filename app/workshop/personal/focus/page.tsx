'use client'

import { useState, useRef, useEffect } from 'react'
import { Send, Sparkles, FileText, RotateCcw, Copy, Check, ChevronDown } from 'lucide-react'

// ── Built-in topics with scoped system prompts ──────────────────────────────

const TOPICS = [
  {
    id: 'planning',
    label: 'Project Planning',
    emoji: '🗂️',
    placeholder: 'What are you trying to plan or figure out?',
    systemPrompt: `You are Kyle's focused planning assistant. Help him think through a project, task, or decision clearly and systematically. Ask questions to understand scope, constraints, and goals. When he's ready, generate a clean action plan or project brief as the artifact.`,
  },
  {
    id: 'brainstorm',
    label: 'Brainstorm',
    emoji: '💡',
    placeholder: 'What\'s on your mind?',
    systemPrompt: `You are Kyle's brainstorming partner. Help him explore an idea from multiple angles, surface possibilities he hasn't thought of, and organize the best ones. Be creative but grounded. When he's ready, synthesize everything into a structured idea brief or decision summary as the artifact.`,
  },
  {
    id: 'writeup',
    label: 'Write Something',
    emoji: '✍️',
    placeholder: 'What do you need to write? Give me the context...',
    systemPrompt: `You are Kyle's writing partner. Help him draft emails, messages, announcements, or any written piece through conversation. Ask about tone, audience, and key points before drafting. Refine through back-and-forth. When he's ready, generate the final polished piece as the artifact.`,
  },
  {
    id: 'custom',
    label: 'Custom Topic',
    emoji: '⚙️',
    placeholder: 'Describe what you\'re working on...',
    systemPrompt: `You are Kyle's focused assistant for a specific task. Help him think through whatever he's working on and produce a clean, useful artifact when he's ready. Ask clarifying questions. Be direct and practical.`,
  },
]

// ── Types ─────────────────────────────────────────────────────────────────────

interface Message {
  role: 'user' | 'assistant'
  content: string
}

// ── Markdown renderer (lightweight) ──────────────────────────────────────────

function renderMarkdown(text: string): string {
  return text
    .replace(/^### (.+)$/gm, '<h3 class="text-base font-semibold text-[#0a0a0a] mt-5 mb-2">$1</h3>')
    .replace(/^## (.+)$/gm, '<h2 class="text-lg font-display text-[#0a0a0a] mt-6 mb-2 pb-1 border-b border-[#e8e6e1]">$1</h2>')
    .replace(/^# (.+)$/gm, '<h1 class="text-xl font-display text-[#0a0a0a] mt-4 mb-3">$1</h1>')
    .replace(/\*\*(.+?)\*\*/g, '<strong class="font-semibold text-[#0a0a0a]">$1</strong>')
    .replace(/\*(.+?)\*/g, '<em class="italic">$1</em>')
    .replace(/`(.+?)`/g, '<code class="bg-[#e8e6e1] px-1 py-0.5 rounded text-xs font-mono">$1</code>')
    .replace(/^- (.+)$/gm, '<li class="ml-4 text-[#0a0a0a]/80 leading-relaxed">• $1</li>')
    .replace(/^\d+\. (.+)$/gm, '<li class="ml-4 text-[#0a0a0a]/80 leading-relaxed list-decimal">$1</li>')
    .replace(/^---$/gm, '<hr class="border-[#e8e6e1] my-4">')
    .replace(/\n\n/g, '</p><p class="text-[#0a0a0a]/80 leading-relaxed mb-3">')
    .replace(/^(?!<[hlipchor])(.+)$/gm, '<p class="text-[#0a0a0a]/80 leading-relaxed mb-3">$1</p>')
}

// ── Main Component ────────────────────────────────────────────────────────────

export default function FocusChatPage() {
  const [selectedTopic, setSelectedTopic] = useState(TOPICS[0])
  const [topicOpen, setTopicOpen] = useState(false)
  const [customPrompt, setCustomPrompt] = useState('')
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isStreaming, setIsStreaming] = useState(false)
  const [artifact, setArtifact] = useState<string | null>(null)
  const [view, setView] = useState<'chat' | 'artifact'>('chat')
  const [copied, setCopied] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isStreaming])

  const systemPrompt =
    selectedTopic.id === 'custom' && customPrompt.trim()
      ? customPrompt
      : selectedTopic.systemPrompt

  async function streamResponse(msgs: Message[], generateArtifact = false) {
    setIsStreaming(true)
    const placeholder: Message = { role: 'assistant', content: '' }
    setMessages(prev => [...prev, placeholder])

    try {
      const res = await fetch('/api/chat/focus', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: msgs, systemPrompt, generateArtifact }),
      })

      if (!res.ok || !res.body) throw new Error('Request failed')

      const reader = res.body.getReader()
      const decoder = new TextDecoder()
      let fullText = ''

      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        const chunk = decoder.decode(value, { stream: true })
        const lines = chunk.split('\n').filter(l => l.startsWith('data: '))

        for (const line of lines) {
          const data = line.slice(6)
          if (data === '[DONE]') break
          try {
            const json = JSON.parse(data)
            const delta = json.choices?.[0]?.delta?.content || ''
            fullText += delta
            setMessages(prev => {
              const updated = [...prev]
              updated[updated.length - 1] = { role: 'assistant', content: fullText }
              return updated
            })
          } catch {}
        }
      }

      if (generateArtifact) {
        setArtifact(fullText)
        setView('artifact')
      }
    } catch (err) {
      console.error(err)
      setMessages(prev => {
        const updated = [...prev]
        updated[updated.length - 1] = { role: 'assistant', content: '⚠️ Something went wrong. Try again.' }
        return updated
      })
    } finally {
      setIsStreaming(false)
    }
  }

  function handleSend() {
    const text = input.trim()
    if (!text || isStreaming) return
    const newMsg: Message = { role: 'user', content: text }
    const updated = [...messages, newMsg]
    setMessages(updated)
    setInput('')
    streamResponse(updated)
  }

  function handleGenerateArtifact() {
    if (isStreaming || messages.length === 0) return
    const trigger: Message = { role: 'user', content: 'Generate the artifact now based on everything we\'ve discussed.' }
    const updated = [...messages, trigger]
    setMessages(updated)
    streamResponse(updated, true)
  }

  function handleReset() {
    setMessages([])
    setArtifact(null)
    setView('chat')
    setInput('')
  }

  function handleCopy() {
    if (!artifact) return
    navigator.clipboard.writeText(artifact)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 160)}px`
    }
  }, [input])

  return (
    <div className="h-screen flex flex-col bg-[#f8f7f4] overflow-hidden">

      {/* Header */}
      <div className="flex-shrink-0 border-b border-[#e8e6e1] bg-white px-4 py-3">
        <div className="max-w-3xl mx-auto flex items-center justify-between gap-3">

          {/* Topic selector */}
          <div className="relative flex-1 max-w-xs">
            <button
              onClick={() => setTopicOpen(!topicOpen)}
              className="w-full flex items-center gap-2 px-3 py-2 bg-[#f8f7f4] border border-[#e8e6e1] rounded-lg text-sm text-[#0a0a0a] hover:border-[#0a0a0a]/30 transition-colors"
            >
              <span>{selectedTopic.emoji}</span>
              <span className="flex-1 text-left truncate">{selectedTopic.label}</span>
              <ChevronDown size={14} className={`text-[#7A8F9E] transition-transform ${topicOpen ? 'rotate-180' : ''}`} />
            </button>
            {topicOpen && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-[#e8e6e1] rounded-xl shadow-lg z-50 overflow-hidden">
                {TOPICS.map(topic => (
                  <button
                    key={topic.id}
                    onClick={() => { setSelectedTopic(topic); setTopicOpen(false); handleReset() }}
                    className={`w-full flex items-center gap-2 px-3 py-2.5 text-sm hover:bg-[#f8f7f4] transition-colors text-left ${
                      selectedTopic.id === topic.id ? 'bg-[#f8f7f4] font-medium' : ''
                    }`}
                  >
                    <span>{topic.emoji}</span>
                    <span>{topic.label}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Model badge */}
          <span className="text-xs font-mono text-[#7A8F9E] bg-[#f8f7f4] border border-[#e8e6e1] px-2 py-1 rounded-full hidden sm:block">
            Claude Sonnet
          </span>

          {/* View toggle + reset */}
          <div className="flex items-center gap-2">
            {artifact && (
              <div className="flex bg-[#f8f7f4] border border-[#e8e6e1] rounded-lg p-0.5">
                <button
                  onClick={() => setView('chat')}
                  className={`px-3 py-1 rounded text-xs transition-colors ${view === 'chat' ? 'bg-white shadow-sm text-[#0a0a0a]' : 'text-[#7A8F9E]'}`}
                >
                  Chat
                </button>
                <button
                  onClick={() => setView('artifact')}
                  className={`px-3 py-1 rounded text-xs transition-colors ${view === 'artifact' ? 'bg-white shadow-sm text-[#0a0a0a]' : 'text-[#7A8F9E]'}`}
                >
                  Artifact
                </button>
              </div>
            )}
            {messages.length > 0 && (
              <button
                onClick={handleReset}
                className="p-2 text-[#7A8F9E] hover:text-[#0a0a0a] hover:bg-[#f8f7f4] rounded-lg transition-colors"
                title="Start over"
              >
                <RotateCcw size={14} />
              </button>
            )}
          </div>
        </div>

        {/* Custom prompt input */}
        {selectedTopic.id === 'custom' && (
          <div className="max-w-3xl mx-auto mt-2">
            <input
              value={customPrompt}
              onChange={e => setCustomPrompt(e.target.value)}
              placeholder="Describe the task or topic for this session..."
              className="w-full px-3 py-2 text-sm bg-[#f8f7f4] border border-[#e8e6e1] rounded-lg placeholder:text-[#7A8F9E] text-[#0a0a0a] focus:outline-none focus:border-[#0a0a0a]/30"
            />
          </div>
        )}
      </div>

      {/* Main content area */}
      <div className="flex-1 overflow-hidden">
        <div className="h-full max-w-3xl mx-auto flex flex-col">

          {/* Chat view */}
          {view === 'chat' && (
            <div className="flex-1 overflow-y-auto px-4 py-6 space-y-4">
              {messages.length === 0 && (
                <div className="text-center py-16">
                  <div className="text-4xl mb-4">{selectedTopic.emoji}</div>
                  <p className="font-display text-xl text-[#0a0a0a] mb-2">{selectedTopic.label}</p>
                  <p className="text-[#7A8F9E] text-sm max-w-xs mx-auto">{selectedTopic.placeholder}</p>
                </div>
              )}

              {messages.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] px-4 py-3 rounded-2xl text-sm leading-relaxed ${
                    msg.role === 'user'
                      ? 'bg-[#0a0a0a] text-[#f8f7f4] rounded-br-sm'
                      : 'bg-white border border-[#e8e6e1] text-[#0a0a0a] rounded-bl-sm'
                  }`}>
                    {msg.content || <span className="text-[#7A8F9E] animate-pulse">▌</span>}
                  </div>
                </div>
              ))}
              <div ref={bottomRef} />
            </div>
          )}

          {/* Artifact view */}
          {view === 'artifact' && artifact && (
            <div className="flex-1 overflow-y-auto px-4 py-6">
              <div className="bg-white border border-[#e8e6e1] rounded-2xl overflow-hidden">
                <div className="flex items-center justify-between px-5 py-3 border-b border-[#e8e6e1] bg-[#f8f7f4]">
                  <div className="flex items-center gap-2">
                    <FileText size={14} className="text-[#7A8F9E]" />
                    <span className="text-xs font-mono text-[#7A8F9E] uppercase tracking-wider">Artifact</span>
                  </div>
                  <button
                    onClick={handleCopy}
                    className="flex items-center gap-1.5 text-xs text-[#7A8F9E] hover:text-[#0a0a0a] transition-colors"
                  >
                    {copied ? <Check size={12} className="text-green-500" /> : <Copy size={12} />}
                    {copied ? 'Copied!' : 'Copy'}
                  </button>
                </div>
                <div
                  className="px-6 py-5 prose-sm"
                  dangerouslySetInnerHTML={{ __html: renderMarkdown(artifact) }}
                />
              </div>
            </div>
          )}

        </div>
      </div>

      {/* Input bar */}
      <div className="flex-shrink-0 border-t border-[#e8e6e1] bg-white px-4 py-3">
        <div className="max-w-3xl mx-auto flex flex-col gap-2">

          {/* Generate artifact button — shows after first exchange */}
          {messages.length >= 2 && view === 'chat' && (
            <button
              onClick={handleGenerateArtifact}
              disabled={isStreaming}
              className="flex items-center justify-center gap-2 w-full py-2 rounded-lg border border-dashed border-[#0a0a0a]/20 text-sm text-[#0a0a0a]/50 hover:border-[#0a0a0a]/50 hover:text-[#0a0a0a] hover:bg-[#f8f7f4] transition-all disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <Sparkles size={14} />
              Generate Artifact
            </button>
          )}

          {/* Text input */}
          <div className="flex items-end gap-2">
            <textarea
              ref={textareaRef}
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={messages.length === 0 ? selectedTopic.placeholder : 'Continue the conversation...'}
              rows={1}
              className="flex-1 px-4 py-3 bg-[#f8f7f4] border border-[#e8e6e1] rounded-xl text-sm text-[#0a0a0a] placeholder:text-[#7A8F9E] focus:outline-none focus:border-[#0a0a0a]/30 resize-none"
            />
            <button
              onClick={handleSend}
              disabled={!input.trim() || isStreaming}
              className="p-3 bg-[#0a0a0a] text-[#f8f7f4] rounded-xl hover:bg-[#0066FF] transition-colors disabled:opacity-30 disabled:cursor-not-allowed flex-shrink-0"
            >
              <Send size={16} />
            </button>
          </div>

          <p className="text-center text-xs text-[#7A8F9E]">
            Enter to send · Shift+Enter for new line · Claude Sonnet
          </p>
        </div>
      </div>

    </div>
  )
}
