import { BookOpen } from 'lucide-react'
import Link from 'next/link'

interface Article {
  title: string
  description: string
  href: string
  category: string
  date: string
  published: boolean
}

const articles: Article[] = [
  {
    title: 'Trumpet Mic Comparison',
    description: 'Bell clip vs off-bell vs dual mount — side by side comparison for live gigging. DPA 4099, AMT P800, EVNO TPX2, and more.',
    href: '/artifacts/trumpet-mic-comparison.html',
    category: 'Music & Gear',
    date: 'Feb 19, 2026',
    published: false,
  },
  {
    title: 'LO Buddy × OpenClaw Architecture',
    description: 'How OpenClaw patterns can power LO Buddy at scale. Full strategy doc with implementation phases.',
    href: '/artifacts/lo-buddy-openclaw-architecture.html',
    category: 'Technology',
    date: 'Feb 19, 2026',
    published: false,
  },
  {
    title: 'Paige + Daniel Partnership Roadmap',
    description: 'Strategic roadmap for the designer-contractor partnership — roles, revenue, and growth phases.',
    href: '/artifacts/paige-daniel-summary',
    category: 'Business',
    date: 'Feb 19, 2026',
    published: false,
  },
  {
    title: 'Multi-Agent Research',
    description: 'Deep dive into multi-agent AI architectures — patterns, frameworks, and practical applications.',
    href: '/artifacts/multi-agent-research',
    category: 'Technology',
    date: 'Feb 19, 2026',
    published: false,
  },
  {
    title: 'LO Buddy + Chad Meeting',
    description: 'Meeting notes and action items from the LO Buddy + Chad strategy session.',
    href: '/artifacts/lo-buddy-chad-meeting',
    category: 'LO Buddy',
    date: 'Feb 19, 2026',
    published: false,
  },
  {
    title: 'Designer-Contractor Partnership Guide',
    description: 'Framework for structuring a designer-contractor partnership — from pricing to project flow.',
    href: '/artifacts/Designer-Contractor_Partnership_Guide.md',
    category: 'Business',
    date: 'Feb 19, 2026',
    published: false,
  },
]

const categoryColors: Record<string, string> = {
  'Music & Gear': 'bg-terracotta/10 text-terracotta',
  'Technology': 'bg-ocean/10 text-ocean',
  'Business': 'bg-sunset/10 text-amber-600',
  'LO Buddy': 'bg-ocean/10 text-ocean',
}

export default function BlogPage() {
  const publishedArticles = articles.filter((a) => a.published)

  return (
    <div className="min-h-screen bg-cream">
      <div className="max-w-4xl mx-auto px-6 py-24">
        {/* Header */}
        <div className="mb-16">
          <h1 className="font-display text-5xl md:text-6xl text-midnight mb-4">Articles</h1>
          <p className="text-lg text-midnight/50 max-w-xl">
            Research, strategy, and insight — published from the workshop.
          </p>
        </div>

        {/* Articles */}
        {publishedArticles.length === 0 ? (
          <div className="text-center py-24">
            <BookOpen className="w-12 h-12 text-midnight/20 mx-auto mb-4" />
            <p className="text-midnight/40 text-lg">No articles published yet.</p>
            <p className="text-midnight/30 text-sm mt-2">Check back soon.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {publishedArticles.map((article) => (
              <Link
                key={article.href}
                href={article.href}
                className="group block bg-white/60 rounded-2xl p-8 border border-midnight/5 hover:border-cyan-500/30 transition-all hover:shadow-lg"
              >
                <div className="flex items-center gap-3 mb-4">
                  <span className={`text-xs font-semibold px-3 py-1 rounded-full ${categoryColors[article.category] || 'bg-midnight/5 text-midnight/60'}`}>
                    {article.category}
                  </span>
                  <span className="text-xs text-midnight/30">{article.date}</span>
                </div>
                <h2 className="font-display text-2xl text-midnight mb-2 group-hover:text-cyan-500 transition-colors">
                  {article.title}
                </h2>
                <p className="text-midnight/60 leading-relaxed">{article.description}</p>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
