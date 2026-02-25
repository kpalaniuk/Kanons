import { notFound, redirect } from 'next/navigation'
import Link from 'next/link'
import { Lock, ExternalLink } from 'lucide-react'
import { isPagePublic } from '@/lib/public-pages'
import { articles } from '@/lib/articles'

// Component registry for workshop pages that need server-side rendering
// For all other article types (artifacts, external URLs), we redirect to the href
import LOBuddyBriefPage from '@/app/workshop/personal/lo-buddy-brief/page'
import FCBalboapage from '@/app/workshop/personal/fc-balboa/page'
import AirstepSetupPage from '@/app/workshop/personal/airstep-setup/page'
import FCBalbaoTeamSelectionInternalPage from '@/app/workshop/personal/fc-balboa/team-selection-internal/page'
import FCBalbaoTeamSelectionClubPage from '@/app/workshop/personal/fc-balboa/team-selection-club/page'

const componentRegistry: Record<string, React.ComponentType> = {
  'lo-buddy-brief': LOBuddyBriefPage,
  'fc-balboa': FCBalboapage,
  'airstep-setup': AirstepSetupPage,
  'team-selection-internal': FCBalbaoTeamSelectionInternalPage,
  'team-selection-club': FCBalbaoTeamSelectionClubPage,
}

// Derive slug from href (must match the logic in kb/page.tsx)
function deriveSlug(href: string): string {
  const last = href.split('/').pop() || ''
  return last.replace(/\.(html?|md)$/i, '').replace(/_/g, '-').toLowerCase()
}

export default async function PublicViewPage({ params }: { params: { slug: string } }) {
  const { slug } = params

  // Find the matching article
  const article = articles.find(a => deriveSlug(a.href) === slug)
  if (!article) return notFound()

  // Check if it's been enabled in the database
  const isPublic = await isPagePublic(slug)

  if (!isPublic) {
    return (
      <div className="min-h-screen bg-sand flex items-center justify-center p-6">
        <div className="bg-cream rounded-2xl p-10 max-w-md text-center shadow-sm">
          <div className="w-14 h-14 bg-midnight/5 rounded-full flex items-center justify-center mx-auto mb-5">
            <Lock className="w-6 h-6 text-midnight/40" />
          </div>
          <h1 className="font-display text-2xl text-midnight mb-2">This page is private</h1>
          <p className="text-midnight/50 text-sm">
            The owner hasn't shared this page publicly yet.
          </p>
        </div>
      </div>
    )
  }

  // If this article has a registered React component, render it
  const PageComponent = componentRegistry[slug]
  if (PageComponent) {
    return (
      <div className="min-h-screen bg-sand">

        {/* Public header — professional branded bar */}
        <header className="bg-midnight border-b border-cream/10">
          <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between gap-4">
            {/* Left: branding */}
            <div className="flex items-center gap-3">
              <a
                href="https://kyle.palaniuk.net"
                target="_blank"
                rel="noopener noreferrer"
                className="font-display text-lg text-cream hover:text-terracotta transition-colors"
              >
                Kyle Palaniuk
              </a>
              <span className="text-cream/20 text-sm">·</span>
              <span className="text-cream/50 text-sm">Document & Knowledge Base</span>
            </div>

            {/* Right: visit site link */}
            <a
              href="https://kyle.palaniuk.net"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-xs text-cream/40 hover:text-cream transition-colors border border-cream/10 hover:border-cream/30 px-3 py-1.5 rounded-lg"
            >
              Visit website <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </header>

        {/* Document content */}
        <div className="max-w-5xl mx-auto px-6 py-10">
          <PageComponent />
        </div>

        {/* Footer */}
        <footer className="border-t border-midnight/10 mt-16 py-8 text-center text-xs text-midnight/30">
          Shared by Kyle Palaniuk via{' '}
          <a href="https://kyle.palaniuk.net" className="hover:text-midnight transition-colors">kyle.palaniuk.net</a>
        </footer>

      </div>
    )
  }

  // For artifacts and external links — redirect directly to the href
  // Artifacts in /public/ are already publicly accessible
  const href = article.href
  if (href.startsWith('http')) {
    redirect(href)
  }
  // Internal non-workshop pages (artifacts, underwriting, etc.) — redirect
  redirect(href)
}
