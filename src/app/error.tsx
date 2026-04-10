"use client"

import { useEffect } from "react"

interface ErrorProps {
  error: Error & { digest?: string }
  reset: () => void
}

export default function Error({ error, reset }: ErrorProps) {
  useEffect(() => {
    console.error('[ERROR_BOUNDARY]', error)
  }, [error])

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '2rem', gap: '1.5rem', background: '#0a0a0a', color: '#e5e5e5', fontFamily: 'monospace' }}>
      <div style={{ width: '100%', maxWidth: '860px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
          <span style={{ fontSize: '1.5rem' }}>⚠</span>
          <h1 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 600, color: '#f87171' }}>
            Erreur de page
          </h1>
        </div>

        <div style={{ background: '#1a1a1a', border: '1px solid #333', borderRadius: '8px', padding: '1.25rem', marginBottom: '1rem' }}>
          <div style={{ fontSize: '0.7rem', color: '#888', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Message</div>
          <div style={{ color: '#fbbf24', fontSize: '0.95rem', wordBreak: 'break-all' }}>
            {error?.message || 'Erreur inconnue'}
          </div>
        </div>

        {error?.digest && (
          <div style={{ background: '#1a1a1a', border: '1px solid #333', borderRadius: '8px', padding: '1.25rem', marginBottom: '1rem' }}>
            <div style={{ fontSize: '0.7rem', color: '#888', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Digest (ID serveur — cherche dans les logs Next.js)</div>
            <div style={{ color: '#60a5fa', fontSize: '0.85rem' }}>{error.digest}</div>
          </div>
        )}

        {error?.stack && (
          <div style={{ background: '#1a1a1a', border: '1px solid #333', borderRadius: '8px', padding: '1.25rem', marginBottom: '1rem' }}>
            <div style={{ fontSize: '0.7rem', color: '#888', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Stack trace</div>
            <pre style={{ margin: 0, fontSize: '0.75rem', color: '#d1d5db', overflowX: 'auto', whiteSpace: 'pre-wrap', wordBreak: 'break-all', lineHeight: 1.6 }}>
              {error.stack}
            </pre>
          </div>
        )}

        <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.5rem' }}>
          <button
            onClick={reset}
            style={{ padding: '0.6rem 1.25rem', background: '#2563eb', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '0.875rem', fontFamily: 'monospace' }}
          >
            Recharger
          </button>
          <button
            onClick={() => window.history.back()}
            style={{ padding: '0.6rem 1.25rem', background: '#262626', color: '#d1d5db', border: '1px solid #404040', borderRadius: '6px', cursor: 'pointer', fontSize: '0.875rem', fontFamily: 'monospace' }}
          >
            Retour
          </button>
        </div>
      </div>
    </div>
  )
}
