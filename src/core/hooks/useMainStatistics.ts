"use client"

import { useQuery } from "@tanstack/react-query"
import { useAuthContext } from "@/core/providers"
import { statisticsService } from "@/core/services/statistics.service"
import type { MainStatistics } from "@/modules/statistics/types"

type UseMainStatisticsOptions = {
  enterpriseId?: string
  startDate?: string
  endDate?: string
  enabled?: boolean
}

// Helper to get current month date range
function getCurrentMonthRange() {
  const now = new Date()
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
  const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999)

  return {
    startDate: startOfMonth.toISOString(),
    endDate: endOfMonth.toISOString(),
  }
}

export function useMainStatistics(options: UseMainStatisticsOptions = {}) {
  const { user } = useAuthContext()
  const enterpriseId = options.enterpriseId || user?.companyId || ""
  const enabled = options.enabled ?? true

  // Default to current month if no dates provided
  const defaultRange = getCurrentMonthRange()
  const startDate = options.startDate || defaultRange.startDate
  const endDate = options.endDate || defaultRange.endDate

  const query = useQuery<MainStatistics>({
    queryKey: ['mainStatistics', enterpriseId, startDate, endDate],
    queryFn: async () => {
      return await statisticsService.getMainStatistics({
        enterpriseId,
        startDate,
        endDate,
      })
    },
    enabled: enabled && !!enterpriseId,
    staleTime: 1000 * 60 * 5, // 5 minutes
    refetchOnWindowFocus: false,
  })

  return {
    statistics: query.data || null,
    isLoading: query.isLoading,
    isFetching: query.isFetching,
    error: query.error ? "Erreur lors du chargement des statistiques" : null,
    enterpriseId,
    refetch: query.refetch,
  }
}
