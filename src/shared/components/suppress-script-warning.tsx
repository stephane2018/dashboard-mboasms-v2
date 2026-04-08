'use client'

// Suppresses the React 19 false-positive warning triggered by next-themes
// injecting an inline <script> for theme initialization. The script correctly
// runs from the SSR HTML before React hydrates — it does not need to run
// again during client renders. React 19 warns about all inline scripts in
// component trees regardless, making this a known false positive.
if (
  typeof console !== 'undefined' &&
  process.env.NODE_ENV === 'development'
) {
  const _orig = console.error.bind(console)
  console.error = (...args: unknown[]) => {
    if (
      typeof args[0] === 'string' &&
      args[0].includes('script tag while rendering React component')
    ) return
    _orig(...args)
  }
}

export function SuppressScriptWarning() {
  return null
}
