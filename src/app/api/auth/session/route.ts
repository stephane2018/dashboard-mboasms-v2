import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

const TOKEN_COOKIE = 'mboasms-access-token';
const REFRESH_COOKIE = 'mboasms-refresh-token';

const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax' as const,
  path: '/',
};

function isAllowedOrigin(request: NextRequest): boolean {
  const origin = request.headers.get('origin');
  // Same-origin fetch may not send Origin header — allow it
  if (!origin) return true;
  try {
    const requestOrigin = new URL(origin).origin;
    // Allow if origin matches the server's own host (works in dev + prod)
    const host = request.headers.get('host');
    if (host) {
      const forwardedProto = request.headers.get('x-forwarded-proto');
      const protocol = forwardedProto || (request.url.startsWith('https') ? 'https' : 'http');
      if (requestOrigin === `${protocol}://${host}`) return true;
    }
    // Fallback: explicit allow list from env
    const appUrl = process.env.NEXT_PUBLIC_APP_URL;
    if (appUrl && new URL(appUrl).origin === requestOrigin) return true;
    return false;
  } catch {
    return false;
  }
}

// POST: Store tokens in httpOnly cookies
export async function POST(request: NextRequest) {
  if (!isAllowedOrigin(request)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  try {
    const body = await request.json();
    const { token, refreshToken } = body;

    if (!token || !refreshToken || typeof token !== 'string' || typeof refreshToken !== 'string') {
      return NextResponse.json({ error: 'Missing or invalid tokens' }, { status: 400 });
    }

    // Validate JWT format (3 base64url segments separated by dots)
    const jwtRegex = /^[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+$/;
    if (!jwtRegex.test(token) || !jwtRegex.test(refreshToken)) {
      return NextResponse.json({ error: 'Invalid token format' }, { status: 400 });
    }

    const cookieStore = await cookies();

    cookieStore.set(TOKEN_COOKIE, token, {
      ...COOKIE_OPTIONS,
      maxAge: 24 * 60 * 60, // 24 hours for access token
    });

    cookieStore.set(REFRESH_COOKIE, refreshToken, {
      ...COOKIE_OPTIONS,
      maxAge: 7 * 24 * 60 * 60, // 7 days for refresh token
    });

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
}

// DELETE: Clear token cookies
export async function DELETE(request: NextRequest) {
  if (!isAllowedOrigin(request)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const cookieStore = await cookies();
  cookieStore.set(TOKEN_COOKIE, '', { ...COOKIE_OPTIONS, maxAge: 0 });
  cookieStore.set(REFRESH_COOKIE, '', { ...COOKIE_OPTIONS, maxAge: 0 });

  return NextResponse.json({ success: true });
}
