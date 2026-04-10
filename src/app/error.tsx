"use client"

import { useEffect, useState } from "react"

interface ServerError {
  digest: string
  message: string
  stack?: string
  path: string
  method: string
  routePath: string
  routeType: string
  timestamp: string
}

interface ErrorProps {
  error: Error & { digest?: string }
  reset: () => void
}

export default function Error({ error, reset }: ErrorProps) {
  const [serverError, setServerError] = useState<ServerError | null>(null)

  useEffect(() => {
    console.error('[ERROR_BOUNDARY]', error)

    if (error?.digest) {
      fetch(`/api/debug/errors?digest=${encodeURIComponent(error.digest)}`)
        .then((r) => r.ok ? r.json() : null)
        .then((data) => { if (data && !data.error) setServerError(data) })
        .catch(() => {})
    }
  }, [error])

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <div style={styles.header}>
          <span>⚠</span>
          <h1 style={styles.title}>Erreur de page</h1>
        </div>

        <Block label="Message client" color="#fbbf24">
          {error?.message || 'Erreur inconnue'}
        </Block>

        {error?.digest && (
          <Block label="Digest (ID erreur serveur)" color="#60a5fa">
            {error.digest}
          </Block>
        )}

        {serverError ? (
          <>
            <Block label="Message serveur" color="#f87171">
              {serverError.message}
            </Block>
            <Block label={`Route · ${serverError.method} ${serverError.path}`} color="#a78bfa">
              {`routePath: ${serverError.routePath}\nrouteType: ${serverError.routeType}\ntimestamp: ${serverError.timestamp}`}
            </Block>
            {serverError.stack && (
              <Block label="Stack trace serveur" color="#6b7280" pre>
                {serverError.stack}
              </Block>
            )}
          </>
        ) : error?.digest ? (
          <Block label="Détails serveur" color="#6b7280">
            Chargement…
          </Block>
        ) : null}

        {!serverError && error?.stack && (
          <Block label="Stack trace client" color="#6b7280" pre>
            {error.stack}
          </Block>
        )}

        <div style={styles.actions}>
          <button onClick={reset} style={styles.btnPrimary}>Recharger</button>
          <button onClick={() => window.history.back()} style={styles.btnSecondary}>Retour</button>
        </div>
      </div>
    </div>
  )
}

function Block({ label, color, pre, children }: { label: string; color: string; pre?: boolean; children: string }) {
  return (
    <div style={styles.block}>
      <div style={{ ...styles.blockLabel, color }}>{label}</div>
      {pre
        ? <pre style={styles.pre}>{children}</pre>
        : <div style={styles.blockValue}>{children}</div>
      }
    </div>
  )
}

const styles: Record<string, React.CSSProperties> = {
  page: { minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem', background: '#0a0a0a', color: '#e5e5e5', fontFamily: 'monospace' },
  container: { width: '100%', maxWidth: '900px' },
  header: { display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' },
  title: { margin: 0, fontSize: '1.25rem', fontWeight: 600, color: '#f87171' },
  block: { background: '#1a1a1a', border: '1px solid #333', borderRadius: '8px', padding: '1.25rem', marginBottom: '1rem' },
  blockLabel: { fontSize: '0.7rem', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.05em' },
  blockValue: { fontSize: '0.9rem', color: '#e5e5e5', wordBreak: 'break-all' },
  pre: { margin: 0, fontSize: '0.75rem', color: '#d1d5db', overflowX: 'auto', whiteSpace: 'pre-wrap', wordBreak: 'break-all', lineHeight: 1.6 },
  actions: { display: 'flex', gap: '0.75rem', marginTop: '1.5rem' },
  btnPrimary: { padding: '0.6rem 1.25rem', background: '#2563eb', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '0.875rem', fontFamily: 'monospace' },
  btnSecondary: { padding: '0.6rem 1.25rem', background: '#262626', color: '#d1d5db', border: '1px solid #404040', borderRadius: '6px', cursor: 'pointer', fontSize: '0.875rem', fontFamily: 'monospace' },
}
