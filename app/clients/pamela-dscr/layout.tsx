// Public layout - no authentication required
// This route is NOT in the protected routes list in middleware.ts
// so it's accessible to anyone without signing in.

export const metadata = {
  title: 'DSCR Calculator – Pamela Moore',
  description: 'Investment property DSCR calculator for Pamela Moore – Brookings, OR',
}

export default function PamelaDSCRLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
