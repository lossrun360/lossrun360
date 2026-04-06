import { NextRequest, NextResponse } from 'next/server'

export function middleware(req: NextRequest) {
      const { pathname } = req.nextUrl

  // Public routes - always allow
  if (
          pathname === '/' ||
          pathname.startsWith('/api/auth') ||
          pathname.startsWith('/api/webhooks') ||
          pathname === '/login' ||
          pathname === '/register' ||
          pathname.startsWith('/_next') ||
          pathname.startsWith('/favicon') ||
          pathname.startsWith('/logo')
        ) {
          return NextResponse.next()
  }

  // Check for session cookie (next-auth sets this)
  const sessionToken =
          req.cookies.get('next-auth.session-token')?.value ||
          req.cookies.get('__Secure-next-auth.session-token')?.value

  if (!sessionToken) {
          return NextResponse.redirect(new URL('/login', req.url))
  }

  return NextResponse.next()
}

export const config = {
      matcher: ['/((?!_next/static|_next/image|favicon.ico|logo.png).*)'],
}
