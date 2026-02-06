import { NextResponse, type NextRequest } from 'next/server'

export default function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  // Client portal routes: no auth middleware needed
  // (these use their own password-based auth via /api/auth)
  if (
    path.startsWith('/clients') ||
    path.startsWith('/api/auth') ||
    path.startsWith('/api/scenarios') ||
    path.startsWith('/api/debug')
  ) {
    return NextResponse.next();
  }

  // All other routes: let them through for now
  // (Clerk can be re-enabled when keys are configured)
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
}
