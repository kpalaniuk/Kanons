import { auth, currentUser } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'

const ALLOWED_EMAILS = (process.env.FAMILY_ALLOWED_EMAILS || 'kpalaniuk@gmail.com')
  .split(',')
  .map((e) => e.trim().toLowerCase())

export default async function UnderwritingLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { userId } = await auth()

  if (!userId) {
    redirect('/sign-in')
  }

  const user = await currentUser()
  const userEmail = user?.emailAddresses?.[0]?.emailAddress?.toLowerCase()

  if (!userEmail || !ALLOWED_EMAILS.includes(userEmail)) {
    redirect('/')
  }

  // Minimal full-screen layout - no nav, no padding
  return <>{children}</>
}
