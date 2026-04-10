"use client"

// global-error renders OUTSIDE the root layout — no providers, no Tailwind, no context.
// Must include its own <html>, <head>, and <body> tags with inline styles only.

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <html lang="fr">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>Erreur - MboaSMS</title>
      </head>
      <body style={{ margin: 0 }}>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            minHeight: "100vh",
            fontFamily: "system-ui, -apple-system, sans-serif",
            backgroundColor: "#f9fafb",
            padding: "1rem",
          }}
        >
          <div style={{ textAlign: "center", maxWidth: "28rem" }}>
            <div
              style={{
                display: "inline-flex",
                padding: "1rem",
                backgroundColor: "rgba(124, 58, 237, 0.1)",
                borderRadius: "9999px",
                marginBottom: "1.5rem",
              }}
            >
              <svg
                width="64"
                height="64"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#7c3aed"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" />
              </svg>
            </div>

            <h1
              style={{
                fontSize: "3.5rem",
                fontWeight: 700,
                color: "#7c3aed",
                margin: "0 0 1rem",
              }}
            >
              500
            </h1>

            <h2
              style={{
                fontSize: "1.5rem",
                fontWeight: 700,
                color: "#111827",
                margin: "0 0 1rem",
              }}
            >
              Erreur inattendue
            </h2>

            <p
              style={{
                color: "#6b7280",
                marginBottom: "1rem",
                lineHeight: 1.6,
              }}
            >
              {"Une erreur inattendue s'est produite. Veuillez r\u00e9essayer ou retourner \u00e0 l'accueil."}
            </p>

            {/* DEBUG — retirer avant la mise en prod finale */}
            <details
              style={{
                marginBottom: "1.5rem",
                textAlign: "left",
                background: "#1f2937",
                borderRadius: "0.5rem",
                padding: "0.75rem 1rem",
                cursor: "pointer",
              }}
            >
              <summary style={{ color: "#f87171", fontWeight: 600, fontSize: "0.875rem" }}>
                Détails de l&apos;erreur (debug)
              </summary>
              <pre
                style={{
                  marginTop: "0.5rem",
                  color: "#fca5a5",
                  fontSize: "0.75rem",
                  whiteSpace: "pre-wrap",
                  wordBreak: "break-all",
                  overflowY: "auto",
                  maxHeight: "200px",
                }}
              >
                {error?.message}
                {"\n\n"}
                {error?.stack}
                {error?.digest ? `\n\nDigest: ${error.digest}` : ""}
              </pre>
            </details>

            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
              <button
                onClick={() => reset()}
                style={{
                  width: "100%",
                  padding: "0.75rem 1.5rem",
                  fontSize: "1rem",
                  fontWeight: 500,
                  cursor: "pointer",
                  borderRadius: "0.5rem",
                  border: "none",
                  backgroundColor: "#7c3aed",
                  color: "#fff",
                }}
              >
                {"R\u00e9essayer"}
              </button>

              <a
                href="/"
                style={{
                  display: "block",
                  width: "100%",
                  padding: "0.75rem 1.5rem",
                  fontSize: "1rem",
                  fontWeight: 500,
                  cursor: "pointer",
                  borderRadius: "0.5rem",
                  border: "none",
                  backgroundColor: "#e5e7eb",
                  color: "#111827",
                  textDecoration: "none",
                  textAlign: "center",
                  boxSizing: "border-box",
                }}
              >
                {"Retour \u00e0 l'accueil"}
              </a>
            </div>
          </div>
        </div>
      </body>
    </html>
  )
}
