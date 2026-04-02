"use client"

const PRINCIPLES = [
  {
    name: 'Mentalism',
    number: 1,
    tagline: 'The All is Mind; the Universe is Mental.',
    reflection: 'Everything you experience begins as a thought. What mental states are you feeding today?',
    color: 'from-indigo-50 to-violet-50',
    border: 'border-indigo-200',
    badge: 'bg-indigo-100 text-indigo-700 border-indigo-200',
    dot: 'bg-indigo-500',
  },
  {
    name: 'Correspondence',
    number: 2,
    tagline: 'As above, so below; as below, so above.',
    reflection: 'The patterns in your inner world mirror your outer reality. What pattern keeps repeating?',
    color: 'from-teal-50 to-emerald-50',
    border: 'border-teal-200',
    badge: 'bg-teal-100 text-teal-700 border-teal-200',
    dot: 'bg-teal-500',
  },
  {
    name: 'Vibration',
    number: 3,
    tagline: 'Nothing rests; everything moves; everything vibrates.',
    reflection: 'What is the quality of your energy right now? You can always raise the frequency.',
    color: 'from-amber-50 to-yellow-50',
    border: 'border-amber-200',
    badge: 'bg-amber-100 text-amber-700 border-amber-200',
    dot: 'bg-amber-500',
  },
  {
    name: 'Polarity',
    number: 4,
    tagline: 'Everything is dual; opposites are identical in nature, differing only in degree.',
    reflection: 'Where do you see an extreme today? The opposite pole contains the path through.',
    color: 'from-rose-50 to-pink-50',
    border: 'border-rose-200',
    badge: 'bg-rose-100 text-rose-700 border-rose-200',
    dot: 'bg-rose-500',
  },
  {
    name: 'Rhythm',
    number: 5,
    tagline: 'Everything flows, out and in; everything has its tides.',
    reflection: 'Are you in a swing or a tide right now? Mastery is neutralizing the rhythm — not fighting it.',
    color: 'from-sky-50 to-blue-50',
    border: 'border-sky-200',
    badge: 'bg-sky-100 text-sky-700 border-sky-200',
    dot: 'bg-sky-500',
  },
  {
    name: 'Cause and Effect',
    number: 6,
    tagline: 'Every cause has its effect; every effect has its cause.',
    reflection: 'Nothing happens by chance. What causes are you setting in motion today?',
    color: 'from-orange-50 to-amber-50',
    border: 'border-orange-200',
    badge: 'bg-orange-100 text-orange-700 border-orange-200',
    dot: 'bg-orange-500',
  },
  {
    name: 'Gender',
    number: 7,
    tagline: 'Gender is in everything; everything has its masculine and feminine principles.',
    reflection: 'Are you generating or receptive today? Both are needed — which does the moment call for?',
    color: 'from-purple-50 to-fuchsia-50',
    border: 'border-purple-200',
    badge: 'bg-purple-100 text-purple-700 border-purple-200',
    dot: 'bg-purple-500',
  },
]

function getTodaysPrinciple() {
  const now = new Date()
  const start = new Date(now.getFullYear(), 0, 0)
  const diff = now.getTime() - start.getTime()
  const dayOfYear = Math.floor(diff / (1000 * 60 * 60 * 24))
  return PRINCIPLES[dayOfYear % 7]
}

export default function DailyPrincipleCard() {
  const p = getTodaysPrinciple()

  return (
    <div className={`rounded-2xl p-5 border bg-gradient-to-br ${p.color} ${p.border}`}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${p.dot}`} />
          <span className="text-xs font-semibold text-midnight/50 uppercase tracking-widest">
            Hermetic Principle {p.number} of 7
          </span>
        </div>
        <span className={`text-xs font-bold px-2 py-0.5 rounded-full border ${p.badge}`}>
          {p.name}
        </span>
      </div>

      <p className="text-sm font-semibold text-midnight leading-snug mb-2 italic">
        &ldquo;{p.tagline}&rdquo;
      </p>

      <p className="text-xs text-midnight/60 leading-relaxed mb-3">
        {p.reflection}
      </p>

      <a
        href="https://t.me/kybalion_bot"
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-1.5 text-xs font-medium text-midnight/50 hover:text-midnight transition-colors"
      >
        Ask the oracle →
      </a>
    </div>
  )
}
