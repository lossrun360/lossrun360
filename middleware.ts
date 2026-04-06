import { getToken } from 'next-auth/jwt'
import { NextRequest, NextResponse } from 'next/server'

export async function middleware(req: NextRequest) {
    const { pathname } = req.nextUrl

  // Public routes — always allow
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

  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET })

  // Not logged in — redirect to login
  if (!token) {
        return NextResponse.redirect(new URL('/login', req.url))
  }

  // Admin routes — require SUPER_ADMIN
  if (pathname.startsWith('/admin') && token.role !== 'SUPER_ADMIN') {
        return NextResponse.redirect(new URL('/dashboard', req.url))
  }

  return NextResponse.next()
}

export const config = {
    matcher: ['/((?!_next/static|_next/image|favicon.ico|logo.png).*)'],
}
