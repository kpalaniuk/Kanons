'use client'

import { useState, useEffect } from 'react'
import { CheckCircle, XCircle, Clock, Trash2, RefreshCw, MessageSquare, ChevronDown, ChevronUp } from 'lucide-react'

interface HopperQuestion {
  id: string
  question: string
  hint?: string
  type: 'yesno' | 'text' | 'choice'
  choices?: string[]
  status: 'pending' | 'answered' | 'skipped'
  answer: string
  timestamp: number | null
}

const SEED_QUESTIONS: Omit<HopperQuestion, 'status' | 'answer' | 'timestamp'>[] = [
  {
    id: 'q1',
    question: 'Is the LO Ninja (GHL) webhook integration the current top priority for the next sprint?',
    hint: 'This determines whether we focus on data ingestion or UI features first.',
    type: 'yesno',
  },
  {
    id: 'q2',
    question: 'Should the LO Buddy voice interface support inbound calls (client → LO) in this sprint, or outbound only?',
    hint: 'Inbound requires Twilio webhook setup; outbound is simpler.',
    type: 'choice',
    choices: ['Inbound + Outbound', 'Outbound only', 'Skip voice this sprint'],
  },
  {
    id: 'q3',
    question: 'For the approval gate — should it block ALL outbound comms, or only AI-drafted messages (not scheduled reminders)?',
    type: 'choice',
    choices: ['Block ALL outbound', 'AI-drafted messages only', 'Configurable per team'],
  },
  {
    id: 'q4',
    question: 'Is Brad Behlow\'s SDMC team the pilot we\'re building toward, or is GH Group the first live test?',
    hint: 'Affects which team config we harden first.',
    type: 'choice',
    choices: ['SDMC (Brad)', 'GH Group (Kyle/Jim/Anthony)', 'Both simultaneously'],
  },
  {
    id: 'q5',
    question: 'Should the pipeline view in LO Buddy mirror GHL stages exactly, or should we have a simplified LO Buddy-native stage mapping?',
    type: 'choice',
    choices: ['Mirror GHL exactly', 'Simplified LO Buddy stages', 'Configurable per team'],
  },
  {
    id: 'q6',
    question: 'Is three-tier Pinecone memory currently working in production, or is it still feature/jasper branch only?',
    type: 'yesno',
  },
  {
    id: 'q7',
    question: 'What\'s the single most painful thing about the current LO Buddy build that needs fixing before we add new features?',
    type: 'text',
  },
  {
    id: 'q8',
    question: 'Should the scenario builder (DSCR, Purchase, Refi) from Kanons be merged into LO Buddy this sprint?',
    hint: 'The Refi Machine merge was flagged as upcoming.',
    type: 'yesno',
  },
  {
    id: 'q9',
    question: 'For the Rate Stack Parser (screenshot → AI vision → rate selector) — is that MVP scope or post-MVP?',
    type: 'choice',
    choices: ['MVP — build now', 'Post-MVP — backlog it', 'Unsure'],
  },
  {
    id: 'q10',
    question: 'Any new features, flows, or screens you\'ve been thinking about that aren\'t in the current plan yet?',
    type: 'text',
  },
]

const STORAGE_KEY = 'lo-buddy-hopper-v1'

function loadQuestions(): HopperQuestion[] {
  if (typeof window === 'undefined') return []
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) return JSON.parse(stored)
  } catch {}
  return SEED_QUESTIONS.map(q => ({ ...q, status: 'pending', answer: '', timestamp: null }))
}

function saveQuestions(questions: HopperQuestion[]) {
  if (typeof window === 'undefined') return
  localStorage.setItem(STORAGE_KEY, JSON.stringify(questions))
}

export default function HopperPage() {
  const [questions, setQuestions] = useState<HopperQuestion[]>([])
  const [expanded, setExpanded] = useState<Record<string, boolean>>({})
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setQuestions(loadQuestions())
    setMounted(true)
  }, [])

  useEffect(() => {
    if (mounted) saveQuestions(questions)
  }, [questions, mounted])

  const answered = questions.filter(q => q.status === 'answered').length
  const total = questions.length
  const pending = questions.filter(q => q.status === 'pending').length
  const readyToGenerate = answered >= 5

  function submitAnswer(id: string, answer: string) {
    setQuestions(prev => prev.map(q =>
      q.id === id ? { ...q, status: 'answered', answer, timestamp: Date.now() } : q
    ))
    setExpanded(prev => ({ ...prev, [id]: false }))
  }

  function skipQuestion(id: string) {
    setQuestions(prev => prev.map(q =>
      q.id === id ? { ...q, status: 'skipped', answer: '', timestamp: Date.now() } : q
    ))
    setExpanded(prev => ({ ...prev, [id]: false }))
  }

  function resetQuestion(id: string) {
    setQuestions(prev => prev.map(q =>
      q.id === id ? { ...q, status: 'pending', answer: '', timestamp: null } : q
    ))
    setExpanded(prev => ({ ...prev, [id]: true }))
  }

  function clearAnswered() {
    setQuestions(prev => prev.filter(q => q.status !== 'answered'))
  }

  function toggleExpand(id: string) {
    setExpanded(prev => ({ ...prev, [id]: !prev[id] }))
  }

  const pendingQ = questions.filter(q => q.status === 'pending')
  const answeredQ = questions.filter(q => q.status === 'answered')
  const skippedQ = questions.filter(q => q.status === 'skipped')

  if (!mounted) return null

  return (
    <div className="min-h-screen bg-paper py-8">
      <div className="max-w-2xl mx-auto px-4 space-y-6">

        {/* Header */}
        <div>
          <div className="flex items-center gap-2 mb-1">
            <MessageSquare size={20} className="text-ocean" />
            <h1 className="font-display text-2xl text-midnight">LO Buddy Hopper</h1>
          </div>
          <p className="text-midnight/50 text-sm">Answer Jasper's questions to fuel the next build sprint. Your answers shape the MD files that go to Chad.</p>
        </div>

        {/* Progress Bar */}
        <div className="bg-cream rounded-2xl p-4 border border-midnight/8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-midnight">{answered} of {total} answered</span>
            {readyToGenerate && (
              <span className="text-xs font-bold text-ocean bg-ocean/10 px-2 py-0.5 rounded-full">
                Ready to generate MD
              </span>
            )}
          </div>
          <div className="h-2 bg-midnight/8 rounded-full overflow-hidden">
            <div
              className="h-full bg-ocean rounded-full transition-all duration-500"
              style={{ width: total > 0 ? `${(answered / total) * 100}%` : '0%' }}
            />
          </div>
          <div className="flex gap-4 mt-2 text-xs text-midnight/40">
            <span>{pending} pending</span>
            <span>{answered} answered</span>
            <span>{skippedQ.length} skipped</span>
          </div>
        </div>

        {/* Empty state */}
        {questions.length === 0 && (
          <div className="text-center py-16 text-midnight/30">
            <MessageSquare size={32} className="mx-auto mb-3 opacity-30" />
            <p className="font-medium">No questions queued.</p>
            <p className="text-sm">Jasper will post here soon.</p>
          </div>
        )}

        {/* Pending Questions */}
        {pendingQ.length > 0 && (
          <div className="space-y-3">
            <h2 className="text-xs font-bold uppercase tracking-wider text-midnight/40 flex items-center gap-1.5">
              <Clock size={12} />
              Pending ({pendingQ.length})
            </h2>
            {pendingQ.map((q, idx) => (
              <QuestionCard
                key={q.id}
                q={q}
                index={questions.indexOf(q) + 1}
                isExpanded={!!expanded[q.id]}
                onToggle={() => toggleExpand(q.id)}
                onSubmit={(ans) => submitAnswer(q.id, ans)}
                onSkip={() => skipQuestion(q.id)}
                onReset={() => resetQuestion(q.id)}
              />
            ))}
          </div>
        )}

        {/* Answered Questions */}
        {answeredQ.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-xs font-bold uppercase tracking-wider text-midnight/40 flex items-center gap-1.5">
                <CheckCircle size={12} />
                Answered ({answeredQ.length})
              </h2>
              <button
                onClick={clearAnswered}
                className="text-xs text-midnight/40 hover:text-midnight flex items-center gap-1 transition-colors"
              >
                <Trash2 size={11} />
                Clear answered
              </button>
            </div>
            {answeredQ.map(q => (
              <QuestionCard
                key={q.id}
                q={q}
                index={questions.indexOf(q) + 1}
                isExpanded={!!expanded[q.id]}
                onToggle={() => toggleExpand(q.id)}
                onSubmit={(ans) => submitAnswer(q.id, ans)}
                onSkip={() => skipQuestion(q.id)}
                onReset={() => resetQuestion(q.id)}
              />
            ))}
          </div>
        )}

        {/* Skipped Questions */}
        {skippedQ.length > 0 && (
          <div className="space-y-3">
            <h2 className="text-xs font-bold uppercase tracking-wider text-midnight/40 flex items-center gap-1.5">
              <XCircle size={12} />
              Skipped ({skippedQ.length})
            </h2>
            {skippedQ.map(q => (
              <QuestionCard
                key={q.id}
                q={q}
                index={questions.indexOf(q) + 1}
                isExpanded={!!expanded[q.id]}
                onToggle={() => toggleExpand(q.id)}
                onSubmit={(ans) => submitAnswer(q.id, ans)}
                onSkip={() => skipQuestion(q.id)}
                onReset={() => resetQuestion(q.id)}
              />
            ))}
          </div>
        )}

      </div>
    </div>
  )
}

function QuestionCard({
  q,
  index,
  isExpanded,
  onToggle,
  onSubmit,
  onSkip,
  onReset,
}: {
  q: HopperQuestion
  index: number
  isExpanded: boolean
  onToggle: () => void
  onSubmit: (ans: string) => void
  onSkip: () => void
  onReset: () => void
}) {
  const [localAnswer, setLocalAnswer] = useState(q.answer)

  const statusColor = {
    pending: 'border-midnight/10 bg-cream',
    answered: 'border-ocean/20 bg-ocean/5',
    skipped: 'border-midnight/8 bg-midnight/3',
  }[q.status]

  const statusBadge = {
    pending: <span className="text-xs text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full font-medium">Pending</span>,
    answered: <span className="text-xs text-ocean bg-ocean/10 px-2 py-0.5 rounded-full font-medium">Answered</span>,
    skipped: <span className="text-xs text-midnight/30 bg-midnight/5 px-2 py-0.5 rounded-full font-medium">Skipped</span>,
  }[q.status]

  return (
    <div className={`rounded-2xl border p-4 transition-all ${statusColor}`}>
      {/* Card Header */}
      <button onClick={onToggle} className="w-full text-left">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-2 flex-1">
            <span className="text-xs font-bold text-midnight/30 mt-0.5 flex-shrink-0">Q{index}</span>
            <p className={`text-sm font-medium leading-snug ${q.status === 'skipped' ? 'text-midnight/40' : 'text-midnight'}`}>
              {q.question}
            </p>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            {statusBadge}
            {isExpanded ? <ChevronUp size={14} className="text-midnight/30" /> : <ChevronDown size={14} className="text-midnight/30" />}
          </div>
        </div>
        {q.status === 'answered' && !isExpanded && (
          <p className="text-xs text-midnight/50 mt-1.5 ml-5 italic truncate">"{q.answer}"</p>
        )}
      </button>

      {/* Expanded Body */}
      {isExpanded && (
        <div className="mt-3 ml-5 space-y-3">
          {q.hint && (
            <p className="text-xs text-midnight/40 italic">{q.hint}</p>
          )}

          {q.type === 'yesno' && (
            <div className="flex gap-2">
              <button
                onClick={() => onSubmit('Yes')}
                className="flex-1 py-2 rounded-xl bg-ocean text-cream text-sm font-medium hover:bg-ocean/90 transition-colors"
              >
                Yes
              </button>
              <button
                onClick={() => onSubmit('No')}
                className="flex-1 py-2 rounded-xl bg-midnight/8 text-midnight text-sm font-medium hover:bg-midnight/15 transition-colors"
              >
                No
              </button>
            </div>
          )}

          {q.type === 'choice' && q.choices && (
            <div className="flex flex-col gap-1.5">
              {q.choices.map(choice => (
                <button
                  key={choice}
                  onClick={() => onSubmit(choice)}
                  className={`w-full text-left px-3 py-2 rounded-xl text-sm transition-colors ${
                    q.answer === choice
                      ? 'bg-ocean text-cream font-medium'
                      : 'bg-midnight/5 text-midnight hover:bg-midnight/10'
                  }`}
                >
                  {choice}
                </button>
              ))}
            </div>
          )}

          {q.type === 'text' && (
            <div className="space-y-2">
              <textarea
                value={localAnswer}
                onChange={e => setLocalAnswer(e.target.value)}
                placeholder="Type your answer (or dictate)..."
                rows={3}
                className="w-full px-3 py-2 rounded-xl bg-white border border-midnight/10 text-sm text-midnight placeholder-midnight/30 focus:outline-none focus:border-ocean resize-none"
              />
              <button
                onClick={() => localAnswer.trim() && onSubmit(localAnswer.trim())}
                disabled={!localAnswer.trim()}
                className="w-full py-2 rounded-xl bg-ocean text-cream text-sm font-medium hover:bg-ocean/90 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Submit
              </button>
            </div>
          )}

          <div className="flex gap-2 pt-1">
            {q.status !== 'skipped' && (
              <button onClick={onSkip} className="text-xs text-midnight/30 hover:text-midnight/60 transition-colors">
                Skip for now
              </button>
            )}
            {q.status !== 'pending' && (
              <button onClick={onReset} className="text-xs text-midnight/30 hover:text-midnight/60 flex items-center gap-1 transition-colors">
                <RefreshCw size={10} />
                Reset
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
