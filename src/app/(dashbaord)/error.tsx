'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/shared/ui/button'

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  const [showDetails, setShowDetails] = useState(false)

  useEffect(() => {
    console.error('[DASHBOARD ERROR]', {
      message: error.message,
      digest: error.digest,
      stack: error.stack,
    })
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
      <div className="flex items-center gap-2">
        <Button onClick={reset} variant="outline" size="sm">
          Réessayer
        </Button>
        <Button onClick={() => setShowDetails(v => !v)} variant="ghost" size="sm" className="text-xs text-muted-foreground">
          {showDetails ? 'Masquer détails' : 'Voir détails'}
        </Button>
      </div>
      {showDetails && (
        <pre className="max-w-2xl w-full overflow-auto rounded-lg border bg-muted/50 p-4 text-xs text-left text-muted-foreground whitespace-pre-wrap break-all">
          {error.stack || error.message}
        </pre>
      )}
    </div>
  )
}
