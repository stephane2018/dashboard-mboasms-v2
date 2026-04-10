import { NextRequest, NextResponse } from 'next/server'
import { getErrors, getErrorByDigest } from '@/lib/server-error-store'

// Simple token protection — set DEBUG_SECRET in .env to restrict access
const DEBUG_SECRET = process.env.DEBUG_SECRET

function isAllowed(request: NextRequest): boolean {
  if (!DEBUG_SECRET) return true // no secret set → open (dev mode)
  const token = request.nextUrl.searchParams.get('secret')
    || request.headers.get('x-debug-secret')
  return token === DEBUG_SECRET
}

// GET /api/debug/errors             → last 20 errors
// GET /api/debug/errors?digest=xxx  → error matching digest
export async function GET(request: NextRequest) {
  if (!isAllowed(request)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const digest = request.nextUrl.searchParams.get('digest')

  if (digest) {
    const error = getErrorByDigest(digest)
    if (!error) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 })
    }
    return NextResponse.json(error)
  }

  return NextResponse.json(getErrors())
}
