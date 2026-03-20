import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'

const isProtectedRoute = createRouteMatcher(['/workshop(.*)', '/family(.*)'])
const isPPHRoute = createRouteMatcher(['/workshop/pph(.*)'])
const isHotDogRoute = createRouteMatcher(['/workshop/operation-hot-dog(.*)'])
const isPersonalRoute = createRouteMatcher(['/workshop/personal(.*)'])
const isFCBaloaRoute = createRouteMatcher(['/workshop/personal/fc-balboa(.*)'])
const isLOBuddyRoute = createRouteMatcher(['/workshop/lo-buddy(.*)'])

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

    // Hotclaw section: admin or hotclaw role required
    if (isHotDogRoute(req) && !isAdmin && !roles.includes('hotclaw')) {
      return NextResponse.redirect(new URL('/workshop', req.url))
    }

    // Personal section: admin only, EXCEPT fc-balboa users can access fc-balboa routes
    if (isPersonalRoute(req) && !isAdmin) {
      if (isFCBaloaRoute(req) && roles.includes('fc-balboa')) {
        return // allow fc-balboa users through to fc-balboa routes
      }
      return NextResponse.redirect(new URL('/workshop', req.url))
    }

    // LO Buddy section: admin, hotclaw, pph, or lobuddy role required
    if (isLOBuddyRoute(req) && !isAdmin && !roles.includes('hotclaw') && !roles.includes('pph') && !roles.includes('lobuddy')) {
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
