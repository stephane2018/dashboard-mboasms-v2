export type ConnectionQuality = "good" | "slow" | "offline"

interface ConnectionStatus {
  quality: ConnectionQuality
  rtt: number | null
}

type ConnectionListener = (status: ConnectionStatus) => void

const PING_TIMEOUT = 8000
const SLOW_PING_THRESHOLD = 3000
const SLOW_RTT_THRESHOLD = 1500

class ConnectionChecker {
  private static instance: ConnectionChecker
  private listeners: Set<ConnectionListener> = new Set()
  private lastStatus: ConnectionStatus = { quality: "good", rtt: null }

  private constructor() {}

  static getInstance(): ConnectionChecker {
    if (!ConnectionChecker.instance) {
      ConnectionChecker.instance = new ConnectionChecker()
    }
    return ConnectionChecker.instance
  }

  subscribe(listener: ConnectionListener): () => void {
    this.listeners.add(listener)
    listener(this.lastStatus)
    return () => this.listeners.delete(listener)
  }

  private notify(status: ConnectionStatus) {
    this.lastStatus = status
    this.listeners.forEach(listener => listener(status))
  }

  /**
   * Synchronous check — used by the request interceptor.
   * Only uses navigator.onLine + Network Information API (no fetch, no delay).
   */
  checkSync(): ConnectionStatus {
    if (typeof navigator !== "undefined" && !navigator.onLine) {
      const status: ConnectionStatus = { quality: "offline", rtt: null }
      this.notify(status)
      return status
    }

    const connection = this.getNetworkInfo()
    if (connection) {
      const type = connection.effectiveType
      if (type === "slow-2g" || type === "2g") {
        const status: ConnectionStatus = { quality: "slow", rtt: connection.rtt }
        this.notify(status)
        return status
      }
      if (connection.rtt > SLOW_RTT_THRESHOLD) {
        const status: ConnectionStatus = { quality: "slow", rtt: connection.rtt }
        this.notify(status)
        return status
      }
    }

    return this.lastStatus
  }

  /**
   * Async ping check — fire-and-forget, used after network errors to confirm status.
   * Never blocks a request.
   */
  pingCheck() {
    if (typeof navigator !== "undefined" && !navigator.onLine) {
      this.notify({ quality: "offline", rtt: null })
      return
    }

    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), PING_TIMEOUT)
    const start = performance.now()

    fetch("/api/health", {
      method: "HEAD",
      cache: "no-store",
      signal: controller.signal,
    })
      .then(() => {
        clearTimeout(timeoutId)
        const latency = Math.round(performance.now() - start)
        this.notify({
          quality: latency > SLOW_PING_THRESHOLD ? "slow" : "good",
          rtt: latency,
        })
      })
      .catch(() => {
        clearTimeout(timeoutId)
        const isOnline = typeof navigator !== "undefined" && navigator.onLine
        this.notify({ quality: isOnline ? "slow" : "offline", rtt: null })
      })
  }

  /**
   * Notify that the connection is back (e.g. after a successful API response).
   */
  notifyGood() {
    if (this.lastStatus.quality !== "good") {
      this.notify({ quality: "good", rtt: null })
    }
  }

  private getNetworkInfo() {
    if (typeof navigator === "undefined") return undefined
    return (navigator as { connection?: { effectiveType: string; rtt: number; downlink: number } }).connection
  }
}

export const connectionChecker = ConnectionChecker.getInstance()
