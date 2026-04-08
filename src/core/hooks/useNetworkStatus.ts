"use client"

import { useState, useEffect } from "react"
import { connectionChecker, type ConnectionQuality } from "../lib/connection-checker"

export type { ConnectionQuality } from "../lib/connection-checker"

interface NetworkStatus {
  isOnline: boolean
  connectionQuality: ConnectionQuality
  rtt: number | null
}

export function useNetworkStatus(): NetworkStatus {
  const [status, setStatus] = useState<NetworkStatus>({
    isOnline: typeof navigator !== "undefined" ? navigator.onLine : true,
    connectionQuality: "good",
    rtt: null,
  })

  useEffect(() => {
    // Subscribe to connection checker events (triggered before each API request)
    const unsubscribe = connectionChecker.subscribe((connectionStatus) => {
      setStatus({
        isOnline: connectionStatus.quality !== "offline",
        connectionQuality: connectionStatus.quality,
        rtt: connectionStatus.rtt,
      })
    })

    // Also listen to browser online/offline events for instant detection
    const handleOffline = () => {
      setStatus({ isOnline: false, connectionQuality: "offline", rtt: null })
    }
    const handleOnline = () => {
      // Will be confirmed by the next API request via connectionChecker
      setStatus(prev => ({ ...prev, isOnline: true }))
    }

    window.addEventListener("offline", handleOffline)
    window.addEventListener("online", handleOnline)

    return () => {
      unsubscribe()
      window.removeEventListener("offline", handleOffline)
      window.removeEventListener("online", handleOnline)
    }
  }, [])

  return status
}
