"use client"

import { createContext, useContext, useState, useEffect, type FC, type ReactNode } from "react"
import { useNetworkStatus, type ConnectionQuality } from "../hooks/useNetworkStatus"
import { WifiOff, AlertTriangle, Wifi, X } from "lucide-react"

interface NetworkStatusContextType {
  isOnline: boolean
  connectionQuality: ConnectionQuality
  rtt: number | null
}

const NetworkStatusContext = createContext<NetworkStatusContextType>({
  isOnline: true,
  connectionQuality: "good",
  rtt: null,
})

export const useNetworkStatusContext = () => useContext(NetworkStatusContext)

interface NetworkStatusProviderProps {
  children: ReactNode
}

export const NetworkStatusProvider: FC<NetworkStatusProviderProps> = ({ children }) => {
  const networkStatus = useNetworkStatus()

  return (
    <NetworkStatusContext.Provider value={networkStatus}>
      {children}
      <NetworkStatusPopup
        isOnline={networkStatus.isOnline}
        connectionQuality={networkStatus.connectionQuality}
      />
    </NetworkStatusContext.Provider>
  )
}

function NetworkStatusPopup({
  isOnline,
  connectionQuality,
}: {
  isOnline: boolean
  connectionQuality: ConnectionQuality
}) {
  const [dismissed, setDismissed] = useState(false)
  const [showReconnected, setShowReconnected] = useState(false)
  const [prevOnline, setPrevOnline] = useState(isOnline)

  const isOffline = !isOnline || connectionQuality === "offline"
  const isSlow = connectionQuality === "slow" && !isOffline

  // Detect reconnection
  useEffect(() => {
    if (!prevOnline && isOnline && connectionQuality === "good") {
      setShowReconnected(true)
      const timer = setTimeout(() => setShowReconnected(false), 3000)
      return () => clearTimeout(timer)
    }
    setPrevOnline(isOnline)
  }, [isOnline, connectionQuality, prevOnline])

  // Reset dismissed state when status changes
  useEffect(() => {
    setDismissed(false)
  }, [isOffline, isSlow])

  // Reconnected popup
  if (showReconnected) {
    return (
      <div
        role="status"
        className="fixed bottom-4 right-4 z-[9999] flex items-center gap-3 rounded-lg bg-green-600 px-4 py-3 text-sm font-medium text-white shadow-lg animate-in slide-in-from-bottom-4 fade-in duration-300"
      >
        <Wifi className="h-4 w-4 shrink-0" />
        <span>Connexion rétablie</span>
      </div>
    )
  }

  if (dismissed || (isOnline && connectionQuality === "good")) return null

  return (
    <div
      role="alert"
      className={`fixed bottom-4 right-4 z-[9999] flex items-start gap-3 rounded-lg px-4 py-3 text-sm font-medium text-white shadow-lg animate-in slide-in-from-bottom-4 fade-in duration-300 max-w-sm ${
        isOffline ? "bg-red-600" : "bg-amber-600"
      }`}
    >
      {isOffline ? (
        <WifiOff className="mt-0.5 h-4 w-4 shrink-0" />
      ) : (
        <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
      )}
      <span className="flex-1">
        {isOffline
          ? "Vous êtes hors ligne. Vérifiez votre connexion internet."
          : "Connexion lente détectée. Certaines fonctionnalités peuvent être ralenties."}
      </span>
      {isSlow && (
        <button
          onClick={() => setDismissed(true)}
          className="shrink-0 rounded p-0.5 hover:bg-white/20 transition-colors"
          aria-label="Fermer"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      )}
    </div>
  )
}
