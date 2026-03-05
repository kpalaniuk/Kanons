'use client'

import { useState } from 'react'
import {
  Sparkles, Mic, Zap, GitBranch, CheckSquare, Lightbulb,
  Clock, AlertCircle, ArrowRight, ExternalLink
} from 'lucide-react'

const sprint = {
  name: 'Sprint 2 — Voice Overhaul',
  goal: 'Rebuild voice input using OpenClaw-style architecture. Mobile-first, interrupt-capable, persistent context.',
  status: 'In Progress',
}

const inProgress = [
  { id: 'V-01', title: 'Voice input architecture review', owner: 'Ceda + LOB-Jasper', priority: 'high' },
  { id: 'V-02', title: 'OpenClaw voice pattern research', owner: 'LOB-Jasper', priority: 'high' },
]

const backlog = [
  { id: 'V-03', title: 'Replace current mic button with streaming input', owner: '', priority: 'high' },
  { id: 'V-04', title: 'Interrupt handling (stop mid-sentence)', owner: '', priority: 'high' },
  { id: 'V-05', title: 'Persistent context across voice turns', owner: '', priority: 'medium' },
  { id: 'V-06', title: 'Mobile-first voice UX pass', owner: '', priority: 'medium' },
  { id: 'V-07', title: 'Wake word / push-to-talk toggle', owner: '', priority: 'low' },
]

const done = [
  { id: 'S1-01', title: 'Sprint 1 audit completed', owner: 'Jasper' },
  { id: 'S1-02', title: 'Inbox threading API', owner: 'Jasper' },
  { id: 'S1-03', title: 'Unknown contact classification UI', owner: 'Jasper' },
]

const ideas = [
  { text: 'Voice input that feels like leaving a voicemail — natural, async', tag: 'UX' },
  { text: 'LOB character reacts to voice with subtle animation while listening', tag: 'Character' },
  { text: 'Auto-detect command vs. note vs. follow-up intent from voice', tag: 'AI' },
  { text: 'WhatsApp-style voice note playback in the inbox', tag: 'Inbox' },
]

const links = [
  { label: 'GitHub — LO Buddy', href: 'https://github.com/kpalaniuk/lo-buddy', icon: GitBranch },
  { label: 'Vercel Deployments', href: 'https://vercel.com/hotclaw', icon: ExternalLink },
  { label: 'Character Page', href: '/workshop/lo-buddy/character', icon: Sparkles },
]

const priorityColor = (p: string) =>
  p === 'high' ? 'bg-red-100 text-red-700' :
  p === 'medium' ? 'bg-amber-100 text-amber-700' :
  'bg-slate-100 text-slate-500'

export default function LOBuddyControlCenter() {
  const [newIdea, setNewIdea] = useState('')
  const [localIdeas, setLocalIdeas] = useState(ideas)

  function addIdea() {
    if (!newIdea.trim()) return
    setLocalIdeas(prev => [{ text: newIdea.trim(), tag: 'Idea' }, ...prev])
    setNewIdea('')
  }

  return (
    <div className="max-w-6xl mx-auto px-6 py-10 space-y-10">

      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-cyan-600 rounded-xl flex items-center justify-center">
              <Mic className="text-white" size={20} />
            </div>
            <h1 className="font-display text-3xl text-midnight">LO Buddy Control Center</h1>
          </div>
          <p className="text-midnight/50 text-sm">Kyle · Ceda · LOB-Jasper — shared workspace</p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 bg-cyan-50 border border-cyan-200 rounded-full">
          <div className="w-2 h-2 bg-cyan-500 rounded-full animate-pulse" />
          <span className="text-sm font-medium text-cyan-700">Active Development</span>
        </div>
      </div>

      {/* Sprint Banner */}
      <div className="bg-midnight text-cream rounded-2xl p-6">
        <div className="flex items-center gap-2 mb-1">
          <Zap size={16} className="text-amber-400" />
          <span className="text-sm font-medium text-amber-400 uppercase tracking-wide">Current Sprint</span>
        </div>
        <h2 className="font-display text-2xl mb-2">{sprint.name}</h2>
        <p className="text-cream/70 text-sm max-w-2xl">{sprint.goal}</p>
      </div>

      {/* Sprint Board */}
      <div>
        <h2 className="font-display text-xl text-midnight mb-4 flex items-center gap-2">
          <CheckSquare size={18} /> Sprint Board
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

          {/* In Progress */}
          <div className="bg-cream rounded-2xl p-4 border border-midnight/10">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-2 h-2 bg-amber-400 rounded-full" />
              <span className="text-xs font-semibold text-midnight/50 uppercase tracking-wide">In Progress</span>
            </div>
            <div className="space-y-2">
              {inProgress.map(t => (
                <div key={t.id} className="bg-white rounded-xl p-3 border border-midnight/5">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <span className="text-xs text-midnight/30 font-mono">{t.id}</span>
                    <span className={`text-xs px-1.5 py-0.5 rounded-full font-medium ${priorityColor(t.priority)}`}>{t.priority}</span>
                  </div>
                  <p className="text-sm text-midnight font-medium">{t.title}</p>
                  {t.owner && <p className="text-xs text-midnight/40 mt-1">{t.owner}</p>}
                </div>
              ))}
            </div>
          </div>

          {/* Backlog */}
          <div className="bg-cream rounded-2xl p-4 border border-midnight/10">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-2 h-2 bg-ocean rounded-full" />
              <span className="text-xs font-semibold text-midnight/50 uppercase tracking-wide">Backlog</span>
            </div>
            <div className="space-y-2">
              {backlog.map(t => (
                <div key={t.id} className="bg-white rounded-xl p-3 border border-midnight/5">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <span className="text-xs text-midnight/30 font-mono">{t.id}</span>
                    <span className={`text-xs px-1.5 py-0.5 rounded-full font-medium ${priorityColor(t.priority)}`}>{t.priority}</span>
                  </div>
                  <p className="text-sm text-midnight font-medium">{t.title}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Done */}
          <div className="bg-cream rounded-2xl p-4 border border-midnight/10">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-2 h-2 bg-green-500 rounded-full" />
              <span className="text-xs font-semibold text-midnight/50 uppercase tracking-wide">Done</span>
            </div>
            <div className="space-y-2">
              {done.map(t => (
                <div key={t.id} className="bg-white rounded-xl p-3 border border-midnight/5 opacity-60">
                  <span className="text-xs text-midnight/30 font-mono">{t.id}</span>
                  <p className="text-sm text-midnight line-through">{t.title}</p>
                  {t.owner && <p className="text-xs text-midnight/40 mt-1">{t.owner}</p>}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Ideas Parking Lot */}
      <div>
        <h2 className="font-display text-xl text-midnight mb-4 flex items-center gap-2">
          <Lightbulb size={18} /> Ideas &amp; Notes
        </h2>
        <div className="bg-cream rounded-2xl p-5 border border-midnight/10">
          <div className="flex gap-2 mb-4">
            <input
              type="text"
              value={newIdea}
              onChange={e => setNewIdea(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && addIdea()}
              placeholder="Drop an idea or note..."
              className="flex-1 bg-white border border-midnight/10 rounded-xl px-4 py-2 text-sm text-midnight placeholder:text-midnight/30 focus:outline-none focus:border-cyan-400"
            />
            <button
              onClick={addIdea}
              className="px-4 py-2 bg-midnight text-cream rounded-xl text-sm font-medium hover:bg-ocean transition-colors"
            >
              Add
            </button>
          </div>
          <div className="space-y-2">
            {localIdeas.map((idea, i) => (
              <div key={i} className="flex items-start gap-3 bg-white rounded-xl p-3 border border-midnight/5">
                <span className="mt-0.5 px-2 py-0.5 bg-cyan-50 text-cyan-700 text-xs rounded-full font-medium flex-shrink-0">{idea.tag}</span>
                <p className="text-sm text-midnight">{idea.text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Links */}
      <div>
        <h2 className="font-display text-xl text-midnight mb-4 flex items-center gap-2">
          <ArrowRight size={18} /> Quick Links
        </h2>
        <div className="flex flex-wrap gap-3">
          {links.map(({ label, href, icon: Icon }) => (
            <a
              key={href}
              href={href}
              target={href.startsWith('http') ? '_blank' : undefined}
              rel={href.startsWith('http') ? 'noopener noreferrer' : undefined}
              className="flex items-center gap-2 px-4 py-2 bg-cream border border-midnight/10 rounded-xl text-sm font-medium text-midnight hover:border-cyan-400 hover:text-cyan-700 transition-colors"
            >
              <Icon size={14} />
              {label}
            </a>
          ))}
        </div>
      </div>

      {/* LOB-Jasper context note */}
      <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5">
        <div className="flex items-center gap-2 mb-2">
          <AlertCircle size={16} className="text-amber-600" />
          <span className="text-sm font-semibold text-amber-700">For LOB-Jasper</span>
        </div>
        <p className="text-sm text-amber-700">
          You have deploy access to Kanons via the deploy key at <code className="bg-amber-100 px-1 rounded">/root/.ssh/dashboard-deploy</code>.
          Repo at <code className="bg-amber-100 px-1 rounded">/data/projects/kanons/</code>.
          Always <code className="bg-amber-100 px-1 rounded">git pull</code> before editing. Run{' '}
          <code className="bg-amber-100 px-1 rounded">npx tsc --noEmit</code> before pushing.
          Add new sprint items by editing <code className="bg-amber-100 px-1 rounded">app/workshop/lo-buddy/page.tsx</code>.
          Full deployment guide: <code className="bg-amber-100 px-1 rounded">/data/super/workspace/KANONS-DEPLOY.md</code>
        </p>
      </div>

    </div>
  )
}
