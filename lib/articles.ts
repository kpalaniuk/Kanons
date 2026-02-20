export interface Article {
  title: string
  description: string
  href: string
  category: string
  date: string
  published: boolean
}

export const articles: Article[] = [
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
  {
    title: 'LO Buddy Testing Guide',
    description: 'Step-by-step QA scenarios for each module — Capture, Follow-Up Coach, Qualify, Validator, Realtor',
    category: 'LO Buddy',
    date: 'Feb 20, 2026',
    href: '/artifacts/lo-buddy-testing-guide.html',
    published: false,
  },
  {
    title: 'LO Buddy Git & Release Guide',
    description: 'Branch strategy, versioning, deployment workflow, and rollback procedures for the team',
    category: 'LO Buddy',
    date: 'Feb 20, 2026',
    href: '/artifacts/lo-buddy-git-release-guide.html',
    published: false,
  },
  {
    title: 'LO Buddy Phase 2: Architecture Build Report',
    description: '11 commits, 6,643 lines added. Full progress report on modular architecture, 5 specialized agent modules, model router, soul security cage, and orchestration layer.',
    category: 'project',
    date: 'Feb 20, 2026',
    href: '/artifacts/lo-buddy-phase2-report.html',
    published: false,
  },
]
