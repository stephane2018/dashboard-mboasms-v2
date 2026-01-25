"use client"

import { useQuery } from "@tanstack/react-query"
import { useAuthContext } from "@/core/providers"
import { statisticsService } from "@/core/services/statistics.service"
import type { MessageTimelineData, Period } from "@/modules/statistics/types"

type UseMessageTimelineOptions = {
  enterpriseId?: string
  period?: Period
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

// Format label based on period type
export function formatPeriodLabel(label: string, period: Period): string {
  // Label format from API: "2026-01" for MONTH, "2026" for YEAR, "2026-01-25" for DAY, "2026-W04" for WEEK

  const monthNames = [
    'Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin',
    'Juil', 'Août', 'Sep', 'Oct', 'Nov', 'Déc'
  ]

  const fullMonthNames = [
    'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
    'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
  ]

  try {
    switch (period) {
      case 'DAY': {
        // Format: "2026-01-25" -> "25 Jan"
        const date = new Date(label)
        if (isNaN(date.getTime())) return label
        const day = date.getDate()
        const month = monthNames[date.getMonth()]
        return `${day} ${month}`
      }

      case 'WEEK': {
        // Format: "2026-W04" -> "Sem 4"
        const weekMatch = label.match(/W(\d+)/)
        if (weekMatch) {
          return `Sem ${parseInt(weekMatch[1], 10)}`
        }
        return label
      }

      case 'MONTH': {
        // Format: "2026-01" -> "Janvier" or "Jan 2026"
        const parts = label.split('-')
        if (parts.length >= 2) {
          const monthIndex = parseInt(parts[1], 10) - 1
          if (monthIndex >= 0 && monthIndex < 12) {
            return fullMonthNames[monthIndex]
          }
        }
        return label
      }

      case 'YEAR': {
        // Format: "2026" -> "2026"
        return label
      }

      default:
        return label
    }
  } catch {
    return label
  }
}

// Transform data with formatted labels
function transformData(data: MessageTimelineData[], period: Period): MessageTimelineData[] {
  return data.map(item => ({
    ...item,
    label: formatPeriodLabel(item.label, period),
    originalLabel: item.label, // Keep original for tooltip
  }))
}

export function useMessageTimeline(options: UseMessageTimelineOptions = {}) {
  const { user } = useAuthContext()
  const enterpriseId = options.enterpriseId || user?.companyId || ""
  const enabled = options.enabled ?? true

  // Default to current month if no dates provided
  const defaultRange = getCurrentMonthRange()

  const period = options.period || 'MONTH'
  const startDate = options.startDate || defaultRange.startDate
  const endDate = options.endDate || defaultRange.endDate

  const query = useQuery({
    queryKey: ['messageTimeline', enterpriseId, period, startDate, endDate],
    queryFn: async () => {
      const result = await statisticsService.getMessageTimeline({
        enterpriseId,
        period,
        startDate,
        endDate,
      })
      return transformData(result, period)
    },
    enabled: enabled && !!enterpriseId,
    staleTime: 1000 * 60 * 5, // 5 minutes
    refetchOnWindowFocus: false,
  })

  return {
    data: query.data || [],
    isLoading: query.isLoading,
    isFetching: query.isFetching,
    error: query.error ? "Erreur lors du chargement des données de messages" : null,
    enterpriseId,
    refetch: query.refetch,
    defaultRange,
  }
}
