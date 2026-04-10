export function register() {
  // Nothing to register on startup
}

export async function onRequestError(
  err: unknown,
  request: { path: string; method: string },
  context: { routePath: string; routeType: string }
) {
  try {
    const { pushError } = await import('@/lib/server-error-store')

    const error = err as Error & { digest?: string }
    const digest = error?.digest || `no-digest-${Date.now()}`

    pushError({
      digest,
      message: error?.message || String(err),
      stack: error?.stack,
      path: request.path,
      method: request.method,
      routePath: context.routePath,
      routeType: context.routeType,
      timestamp: new Date().toISOString(),
    })
  } catch {
    // Never let error tracking crash the server
  }
}
