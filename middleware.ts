import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'

const isProtectedRoute = createRouteMatcher(['/workshop(.*)', '/family(.*)'])
const isPPHRoute = createRouteMatcher(['/workshop/pph(.*)'])
const isHotDogRoute = createRouteMatcher(['/workshop/operation-hot-dog(.*)'])
const isPersonalRoute = createRouteMatcher(['/workshop/personal(.*)'])

export default clerkMiddleware((auth, req) => {
  if (isProtectedRoute(req)) {
    auth().protect()

    const { sessionClaims } = auth()
    const meta = sessionClaims?.publicMetadata as Record<string, unknown> | undefined
    const roles = (meta?.roles as string[]) ?? []

    // Fail-open: if no roles set (legacy/uninitialized user), allow all access.
    // Once roles are assigned in Clerk, RBAC becomes active for that user.
    if (roles.length === 0) return

    const isAdmin = roles.includes('admin')

    // PPH section: admin or pph role required
    if (isPPHRoute(req) && !isAdmin && !roles.includes('pph')) {
      return NextResponse.redirect(new URL('/workshop', req.url))
    }

    // Hot Dog section: admin or hot-dog role required
    if (isHotDogRoute(req) && !isAdmin && !roles.includes('hot-dog')) {
      return NextResponse.redirect(new URL('/workshop', req.url))
    }

    // Personal section: admin only (Kyle)
    if (isPersonalRoute(req) && !isAdmin) {
      return NextResponse.redirect(new URL('/workshop', req.url))
    }
  }
})

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest|glb|gltf|fbx|usdz|obj|mtl|bin)).*)',
    '/(api|trpc)(.*)',
  ],
}
