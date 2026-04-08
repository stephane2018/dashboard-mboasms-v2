import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Allowlist: only these paths are accessible without authentication
const PUBLIC_PATHS = [
  '/',
  '/auth/login',
  '/auth/register',
  '/auth/forgot-password',
  '/auth/reset-password',
  '/unauthorized',
  '/sms-pricing',
  '/api-docs',
  '/conditions',
]

const AUTH_PATHS = ['/auth/login', '/auth/register']

function isPublicPath(pathname: string): boolean {
  // Exact match for root
  if (pathname === '/') return true
  // Prefix match for other public paths
  return PUBLIC_PATHS.some(path => path !== '/' && (pathname === path || pathname.startsWith(path + '/')))
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  const token = request.cookies.get('mboasms-access-token')?.value
    || request.headers.get('authorization')?.replace('Bearer ', '')

  // All non-public routes require authentication
  if (!isPublicPath(pathname) && !token) {
    const loginUrl = new URL('/auth/login', request.url)
    // Prevent open redirect: only allow relative paths that don't start with //
    const safePath = pathname.startsWith('/') && !pathname.startsWith('//') ? pathname : '/dashboard'
    loginUrl.searchParams.set('redirect', safePath)
    return NextResponse.redirect(loginUrl)
  }

  // Authenticated users should not access auth pages
  const isAuthRoute = AUTH_PATHS.some(path => pathname.startsWith(path))
  if (token && isAuthRoute) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.png$|.*\\.jpg$|.*\\.jpeg$|.*\\.svg$).*)',
  ],
}
