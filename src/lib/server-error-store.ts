/**
 * In-memory server-side error store.
 * Captures errors from instrumentation.ts onRequestError hook.
 * Only runs in the Node.js server process — never in the browser.
 */

export interface CapturedError {
  digest: string
  message: string
  stack?: string
  path: string
  method: string
  routePath: string
  routeType: string
  timestamp: string
}

const MAX_ERRORS = 20
const errors: CapturedError[] = []

export function pushError(err: CapturedError) {
  errors.unshift(err) // most recent first
  if (errors.length > MAX_ERRORS) errors.pop()
}

export function getErrors(): CapturedError[] {
  return errors
}

export function getErrorByDigest(digest: string): CapturedError | undefined {
  return errors.find((e) => e.digest === digest)
}
