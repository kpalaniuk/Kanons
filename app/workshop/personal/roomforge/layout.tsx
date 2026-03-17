import { auth, currentUser } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'

const ALLOWED_EMAILS = (process.env.FAMILY_ALLOWED_EMAILS || 'kpalaniuk@gmail.com')
  .split(',')
  .map((e) => e.trim().toLowerCase())

export default async function RoomForgeLayout({ children }: { children: React.ReactNode }) {
  const { userId } = await auth()
  if (!userId) redirect('/sign-in')

  const user = await currentUser()
  const userEmail = user?.emailAddresses?.[0]?.emailAddress?.toLowerCase()

  if (!userEmail || !ALLOWED_EMAILS.includes(userEmail)) {
    redirect('/sign-in')
  }

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-[#0f0f0f]">
      {/* Minimal back link — top left, unobtrusive */}
      <div className="absolute top-3 left-3 z-50">
        <Link
          href="/workshop"
          className="flex items-center gap-1.5 text-white/30 hover:text-white/70 text-xs transition-colors"
        >
          ← Workshop
        </Link>
      </div>
      {/* Full screen content */}
      {children}
    </div>
  )
}
