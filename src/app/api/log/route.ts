import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { level = 'error', message, data } = body

    const timestamp = new Date().toISOString()
    const prefix = `[CLIENT:${level.toUpperCase()}] ${timestamp}`

    if (data) {
      console.log(prefix, message, JSON.stringify(data, null, 2))
    } else {
      console.log(prefix, message)
    }

    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 })
  }
}
