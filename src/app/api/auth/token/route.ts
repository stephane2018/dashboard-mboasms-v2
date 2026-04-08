import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

const TOKEN_COOKIE = 'mboasms-access-token';
const REFRESH_COOKIE = 'mboasms-refresh-token';

const ALLOWED_ORIGINS = [
  process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
];

function isAllowedOrigin(request: NextRequest): boolean {
  const origin = request.headers.get('origin');
  const referer = request.headers.get('referer');
  // Allow same-origin requests (no origin header = same-origin fetch)
  if (!origin && !referer) return true;
  try {
    if (origin) {
      const requestOrigin = new URL(origin).origin;
      if (ALLOWED_ORIGINS.some(allowed => new URL(allowed).origin === requestOrigin)) return true;
    }
    if (referer) {
      const refererOrigin = new URL(referer).origin;
      if (ALLOWED_ORIGINS.some(allowed => new URL(allowed).origin === refererOrigin)) return true;
    }
  } catch {
    return false;
  }
  return false;
}

// GET: Return tokens from httpOnly cookies (for client-side Bearer usage)
// Protected by origin check to prevent cross-origin token theft
export async function GET(request: NextRequest) {
  if (!isAllowedOrigin(request)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const cookieStore = await cookies();
  const token = cookieStore.get(TOKEN_COOKIE)?.value || null;
  const refreshToken = cookieStore.get(REFRESH_COOKIE)?.value || null;

  return NextResponse.json({ token, refreshToken });
}
