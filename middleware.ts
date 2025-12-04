import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Public routes that don't require authentication
  const publicRoutes = ['/auth/login', '/auth/register', '/auth/forgot-password', '/']
  const isPublicRoute = publicRoutes.some(route => pathname === route || pathname.startsWith(route))

  // Check if user has token in localStorage (this will be done client-side)
  // For now, we'll use a simple check based on the request headers or cookies
  const token = request.cookies.get('mboasms-access-token')?.value

  // If trying to access dashboard routes without token
  if (pathname.startsWith('/dashboard') || pathname.startsWith('/contacts') ||
      pathname.startsWith('/groupes') || pathname.startsWith('/historique') ||
      pathname.startsWith('/recharges') || pathname.startsWith('/profile') ||
      pathname.startsWith('/users-list') || pathname.startsWith('/compagnie') ||
      pathname.startsWith('/demande-sender-id') || pathname.startsWith('/pricing') ||
      pathname.startsWith('/termes-and-condition')) {

    if (!token) {
      const loginUrl = new URL('/auth/login', request.url)
      loginUrl.searchParams.set('redirect', pathname)
      return NextResponse.redirect(loginUrl)
    }
  }

  // If authenticated user tries to access auth pages, redirect to dashboard
  if (token && (pathname.startsWith('/auth/login') || pathname.startsWith('/auth/register'))) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.png$|.*\\.jpg$|.*\\.jpeg$|.*\\.svg$).*)',
  ],
}
