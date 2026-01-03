"use client"

import { useCallback, useEffect, useState } from "react"
import { useAuthContext } from "@/core/providers"
import { statisticsService } from "../services"
import type { MainStatistics } from "../types"

type UseMainStatisticsOptions = {
  enterpriseId?: string
  startDate?: string
  endDate?: string
  autoLoad?: boolean
}

export function useMainStatistics(options: UseMainStatisticsOptions = {}) {
  const { user } = useAuthContext()
  const enterpriseId = options.enterpriseId || user?.companyId || ""
  const autoLoad = options.autoLoad ?? true

  const [statistics, setStatistics] = useState<MainStatistics | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const loadStatistics = useCallback(async () => {
    if (!enterpriseId) return

    setIsLoading(true)
    setError(null)
    try {
      const data = await statisticsService.getMainStatistics({
        enterpriseId,
        startDate: options.startDate,
        endDate: options.endDate,
      })
      setStatistics(data)
    } catch (err) {
      console.error("Error loading statistics:", err)
      setError("Erreur lors du chargement des statistiques")
      setStatistics(null)
    } finally {
      setIsLoading(false)
    }
  }, [enterpriseId, options.startDate, options.endDate])

  useEffect(() => {
    if (autoLoad && enterpriseId) {
      loadStatistics()
    }
  }, [autoLoad, enterpriseId, loadStatistics])

  return {
    statistics,
    isLoading,
    error,
    enterpriseId,
    loadStatistics,
  }
}
