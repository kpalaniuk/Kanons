export interface Article {
  title: string
  description: string
  href: string
  category: string
  tags?: string[]
  date: string
  published: boolean
  type?: 'report' | 'article' | 'guide'
}

export const articles: Article[] = [
  // === NEWEST FIRST ===
  {
    title: 'FC Balboa — Coaching Hub',
    description: 'U10 coaching reference: season overview, roster, practice plans, and game log. Born Aug 2016–Jul 2017.',
    href: '/workshop/personal/fc-balboa',
    category: 'Personal',
    tags: ['FC Balboa'],
    date: 'Feb 24, 2026',
    published: true,
    type: 'guide',
  },
  {
    title: 'LO Buddy — Full Product Brief (Feb 24)',
    description: 'GHL bidirectional sync shipped, approval queue live, AI drafts in production. Covers what shipped, what to fix before going live, full feature roadmap, GH Group go-live plan, and new team onboarding wizard spec.',
    href: '/workshop/personal/lo-buddy-brief',
    category: 'Personal',
    tags: ['LO Buddy'],
    date: 'Feb 24, 2026',
    published: true,
    type: 'report',
  },
  {
    title: 'AIRSTEP + AUM Trumpet Rig Setup',
    description: 'Step-by-step setup for XSONIC AIRSTEP Bluetooth MIDI, M-Audio expression pedal, Scarlett interface, and AUM on iPad. Includes delay toggle, volume pedal, signal chain, and reverb plugin recommendations.',
    href: '/workshop/personal/airstep-setup',
    category: 'Music & Gear',
    tags: ['Personal'],
    date: 'Feb 23, 2026',
    published: true,
    type: 'guide',
  },
  {
    title: 'LO Buddy Phase 3: Portals, Scenarios & Communication',
    description: 'Realtor purchasing kits, client portals, scenario engine merger, team communication, and mobile app roadmap.',
    category: 'LO Buddy',
    date: 'Feb 20, 2026',
    href: '/artifacts/lo-buddy-phase3-vision.html',
    published: false,
    type: 'report',
  },
  {
    title: 'LO Buddy Phase 2: Architecture Build Report',
    description: '11 commits, 6,643 lines added. Full progress report on modular architecture — 5 agent modules, model router, soul security cage, orchestrator, and org hierarchy.',
    category: 'LO Buddy',
    date: 'Feb 20, 2026',
    href: '/artifacts/lo-buddy-phase2-report.html',
    published: false,
    type: 'report',
  },
  {
    title: 'LO Buddy Testing Guide',
    description: 'Step-by-step QA scenarios for each module — Capture, Follow-Up Coach, Qualify, Validator, Realtor.',
    category: 'LO Buddy',
    date: 'Feb 20, 2026',
    href: '/artifacts/lo-buddy-testing-guide.html',
    published: false,
    type: 'guide',
  },
  {
    title: 'LO Buddy Git & Release Guide',
    description: 'Branch strategy, versioning, deployment workflow, and rollback procedures for the team.',
    category: 'LO Buddy',
    date: 'Feb 20, 2026',
    href: '/artifacts/lo-buddy-git-release-guide.html',
    published: false,
    type: 'guide',
  },
  {
    title: 'LO Buddy × OpenClaw Architecture',
    description: 'How OpenClaw patterns can power LO Buddy at scale. Full strategy doc with implementation phases.',
    href: '/artifacts/lo-buddy-openclaw-architecture.html',
    category: 'Technology',
    date: 'Feb 19, 2026',
    published: false,
    type: 'article',
  },
  {
    title: 'Trumpet Mic Comparison',
    description: 'Bell clip vs off-bell vs dual mount — side by side comparison for live gigging. DPA 4099, AMT P800, EVNO TPX2, and more.',
    href: '/artifacts/trumpet-mic-comparison.html',
    category: 'Music & Gear',
    date: 'Feb 19, 2026',
    published: false,
    type: 'article',
  },
  {
    title: 'Paige + Daniel Partnership Roadmap',
    description: 'Strategic roadmap for the designer-contractor partnership — roles, revenue, and growth phases.',
    href: '/artifacts/paige-daniel-summary',
    category: 'Business',
    date: 'Feb 19, 2026',
    published: false,
    type: 'article',
  },
  {
    title: 'Multi-Agent Research',
    description: 'Deep dive into multi-agent AI architectures — patterns, frameworks, and practical applications.',
    href: '/artifacts/multi-agent-research',
    category: 'Technology',
    date: 'Feb 19, 2026',
    published: false,
    type: 'article',
  },
  {
    title: 'LO Buddy + Chad Meeting',
    description: 'Meeting notes and action items from the LO Buddy + Chad strategy session.',
    href: '/artifacts/lo-buddy-chad-meeting',
    category: 'LO Buddy',
    date: 'Feb 19, 2026',
    published: false,
    type: 'article',
  },
  {
    title: 'LO Buddy Meeting Prep',
    description: 'Pre-meeting context and talking points for LO Buddy stakeholder discussions.',
    href: '/artifacts/lo-buddy-meeting-prep.md',
    category: 'LO Buddy',
    tags: ['LO Buddy'],
    date: 'Feb 2026',
    published: true,
    type: 'article',
  },
  {
    title: 'Underwriting Chat',
    description: 'Live AI underwriting assistant. Ask questions about guidelines, overlays, and loan scenarios. Powered by OpenRouter + PPH knowledge base.',
    href: '/underwriting',
    category: 'Work',
    tags: ['LO Buddy'],
    date: 'Feb 2026',
    published: true,
    type: 'guide',
  },
  {
    title: 'Designer-Contractor Partnership Guide',
    description: 'Framework for structuring a designer-contractor partnership — from pricing to project flow.',
    href: '/artifacts/Designer-Contractor_Partnership_Guide.md',
    category: 'Business',
    date: 'Feb 19, 2026',
    published: false,
    type: 'guide',
  },
]

// Helpers
export const reports = articles.filter(a => a.type === 'report')
export const guides = articles.filter(a => a.type === 'guide')
export const allArticles = articles  // alias for backward compat
