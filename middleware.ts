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

/** Decode JWT payload without verifying signature, returns null on any error */
function decodeJwtPayload(token: string): Record<string, unknown> | null {
  try {
    const parts = token.split('.')
    if (parts.length !== 3) return null
    const payload = parts[1].replace(/-/g, '+').replace(/_/g, '/')
    const json = atob(payload)
    return JSON.parse(json)
  } catch {
    return null
  }
}

/** Returns true if the token exists AND is not yet expired */
function isTokenValid(token: string | undefined): boolean {
  if (!token) return false
  const payload = decodeJwtPayload(token)
  if (!payload) return false
  const exp = payload.exp
  if (typeof exp !== 'number') return true // no expiry claim → treat as valid
  const CLOCK_SKEW_MS = 30_000
  return Date.now() < (exp * 1000) + CLOCK_SKEW_MS
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  const token = request.cookies.get('mboasms-access-token')?.value
    || request.headers.get('authorization')?.replace('Bearer ', '')

  const validToken = isTokenValid(token)

  // All non-public routes require a valid token
  if (!isPublicPath(pathname) && !validToken) {
    const loginUrl = new URL('/auth/login', request.url)
    // Prevent open redirect: only allow relative paths that don't start with //
    const safePath = pathname.startsWith('/') && !pathname.startsWith('//') ? pathname : '/dashboard'
    loginUrl.searchParams.set('redirect', safePath)
    return NextResponse.redirect(loginUrl)
  }

  // Redirect authenticated users away from auth pages (only if token is truly valid)
  const isAuthRoute = AUTH_PATHS.some(path => pathname.startsWith(path))
  if (validToken && isAuthRoute) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.png$|.*\\.jpg$|.*\\.jpeg$|.*\\.svg$).*)',
  ],
}
