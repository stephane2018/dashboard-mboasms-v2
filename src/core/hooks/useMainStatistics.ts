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

export function useMainStatistics(options: UseMainStatisticsOptions = {}) {
  const { user } = useAuthContext()
  const enterpriseId = options.enterpriseId || user?.companyId || ""
  const enabled = options.enabled ?? true

  const query = useQuery<MainStatistics>({
    queryKey: ['mainStatistics', enterpriseId, options.startDate, options.endDate],
    queryFn: async () => {
      return await statisticsService.getMainStatistics({
        enterpriseId,
        startDate: options.startDate,
        endDate: options.endDate,
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
