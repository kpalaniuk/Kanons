import { notFound } from 'next/navigation'
import Link from 'next/link'
import { Lock, ExternalLink } from 'lucide-react'
import { isPagePublic } from '@/lib/public-pages'

// Registry of workshop page components that can be made public
// Add new entries here as you build more shareable pages
import LOBuddyBriefPage from '@/app/workshop/personal/lo-buddy-brief/page'
import FCBalboapage from '@/app/workshop/personal/fc-balboa/page'
import AirstepSetupPage from '@/app/workshop/personal/airstep-setup/page'

const registry: Record<string, React.ComponentType> = {
  'lo-buddy-brief': LOBuddyBriefPage,
  'fc-balboa': FCBalboapage,
  'airstep-setup': AirstepSetupPage,
}

export default async function PublicViewPage({ params }: { params: { slug: string } }) {
  const { slug } = params

  // Check if this slug is in the registry at all
  const PageComponent = registry[slug]
  if (!PageComponent) return notFound()

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

  return (
    <div className="min-h-screen bg-sand">
      {/* Shared-by banner */}
      <div className="bg-midnight text-cream text-xs px-6 py-2.5 flex items-center justify-between">
        <span className="text-cream/60">Shared by <span className="text-cream font-medium">Kyle Palaniuk</span></span>
        <a
          href="https://kyle.palaniuk.net"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 text-cream/40 hover:text-cream transition-colors"
        >
          kyle.palaniuk.net <ExternalLink className="w-3 h-3" />
        </a>
      </div>

      {/* Page content — same component as the workshop page */}
      <div className="max-w-7xl mx-auto px-6 py-10">
        <PageComponent />
      </div>
    </div>
  )
}
