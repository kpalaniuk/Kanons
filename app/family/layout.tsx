import { auth, currentUser } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import FamilyNav from './FamilyNav'

// Allowed email addresses (comma-separated env var, fallback to Kyle's email)
const ALLOWED_EMAILS = (process.env.FAMILY_ALLOWED_EMAILS || 'kpalaniuk@gmail.com')
  .split(',')
  .map((e) => e.trim().toLowerCase())

export default async function FamilyLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { userId } = await auth()

  if (!userId) {
    redirect('/sign-in')
  }

  // Verify the logged-in user is on the allowlist
  const user = await currentUser()
  const userEmail = user?.emailAddresses?.[0]?.emailAddress?.toLowerCase()

  if (!userEmail || !ALLOWED_EMAILS.includes(userEmail)) {
    return (
      <div className="pt-24 min-h-screen bg-sand flex items-center justify-center">
        <div className="bg-cream rounded-2xl p-8 max-w-md text-center">
          <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl">🔒</span>
          </div>
          <h2 className="font-display text-xl text-midnight mb-2">Access Restricted</h2>
          <p className="text-midnight/60 text-sm">
            This area is private. If you think you should have access, contact Kyle.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="pt-24 min-h-screen bg-sand">
      <FamilyNav />
      <div className="max-w-6xl mx-auto px-6 py-8">
        {children}
      </div>
    </div>
  )
}
