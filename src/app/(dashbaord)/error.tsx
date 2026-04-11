'use client'

import { useEffect } from 'react'
import { Button } from '@/shared/ui/button'

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log full error details in dev to help identify the crashing component
    if (process.env.NODE_ENV === 'development') {
      console.error('[DASHBOARD ERROR]', {
        message: error.message,
        digest: error.digest,
        stack: error.stack,
      })
    }
  }, [error])

  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4 p-8">
      <div className="text-center space-y-2">
        <h2 className="text-lg font-semibold">Une erreur est survenue</h2>
        <p className="text-sm text-muted-foreground font-mono">{error.message}</p>
        {error.digest && (
          <p className="text-xs text-muted-foreground">Digest: {error.digest}</p>
        )}
      </div>
      <Button onClick={reset} variant="outline" size="sm">
        Réessayer
      </Button>
    </div>
  )
}
