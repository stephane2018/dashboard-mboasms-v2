const VERSION_KEY = 'mboasms-app-version'

/**
 * Vérifie si l'app a été mise à jour après un déploiement.
 * Compare le BUILD_ID Next.js avec la version stockée en localStorage.
 * Si mismatch → clear storage + hard reload.
 */
export function checkAppVersion() {
  if (typeof window === 'undefined') return

  const currentVersion = process.env.NEXT_PUBLIC_BUILD_ID
    || document.querySelector('meta[name="build-id"]')?.getAttribute('content')
    || '__dev__'

  const storedVersion = localStorage.getItem(VERSION_KEY)

  if (storedVersion && storedVersion !== currentVersion) {
    // Nouvelle version détectée → clear + reload
    localStorage.removeItem('mboasms-auth')
    localStorage.removeItem(VERSION_KEY)
    document.cookie = 'mboasms-access-token=; path=/; max-age=0; SameSite=Lax'
    localStorage.setItem(VERSION_KEY, currentVersion)
    window.location.reload()
    return
  }

  if (!storedVersion) {
    localStorage.setItem(VERSION_KEY, currentVersion)
  }
}

/**
 * Decode le payload JWT et vérifie si le token est expiré.
 */
export function isTokenExpired(token: string | null): boolean {
  if (!token) return true
  try {
    const payload = token.split('.')[1]
    if (!payload) return true
    const decoded = JSON.parse(atob(payload.replace(/-/g, '+').replace(/_/g, '/')))
    const exp = decoded?.exp
    if (typeof exp !== 'number') return false // pas de claim exp → considéré valide
    return Date.now() > exp * 1000
  } catch {
    return true
  }
}
