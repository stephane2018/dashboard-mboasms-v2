"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { useAuthContext } from "@/core/providers"
import { statisticsService } from "@/core/services/statistics.service"
import type { RechargeTimelineData, RechargeTimelineParams, Period, RechargeStatus } from "@/modules/statistics/types"

type UseRechargeTimelineOptions = {
  enterpriseId?: string
  period: Period
  status?: RechargeStatus
  startDate?: string
  endDate?: string
  autoLoad?: boolean
}

export function useRechargeTimeline(options: UseRechargeTimelineOptions) {
  const { user } = useAuthContext()
  const enterpriseId = options.enterpriseId || user?.companyId || ""
  const autoLoad = options.autoLoad ?? true

  const [data, setData] = useState<RechargeTimelineData[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const effectCount = useRef(0)
  const callbackCount = useRef(0)

  const loadRechargeTimeline = useCallback(async () => {
    if (process.env.NODE_ENV === 'development') {
      callbackCount.current++
      console.log(`[useRechargeTimeline] loadRechargeTimeline called #${callbackCount.current}`, { enterpriseId, period: options.period, status: options.status, startDate: options.startDate, endDate: options.endDate })
      if (callbackCount.current > 15) console.error('[useRechargeTimeline] POSSIBLE LOOP - loadRechargeTimeline called too many times')
    }
    if (!enterpriseId) return

    setIsLoading(true)
    setError(null)
    try {
      const result = await statisticsService.getRechargeTimeline({
        enterpriseId,
        period: options.period,
        status: options.status,
        startDate: options.startDate,
        endDate: options.endDate,
      })
      setData(result)
    } catch (err) {
      setError("Erreur lors du chargement des données de recharge")
      setData([])
    } finally {
      setIsLoading(false)
    }
  }, [enterpriseId, options.period, options.status, options.startDate, options.endDate])

  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      effectCount.current++
      console.log(`[useRechargeTimeline] autoLoad useEffect fires #${effectCount.current}`, { autoLoad, enterpriseId, loadRechargeTimelineRef: loadRechargeTimeline.toString().slice(0, 60) })
      if (effectCount.current > 15) console.error('[useRechargeTimeline] POSSIBLE LOOP - autoLoad useEffect fires too many times')
    }
    if (autoLoad && enterpriseId) {
      loadRechargeTimeline()
    }
  }, [autoLoad, enterpriseId, loadRechargeTimeline])

  return {
    data,
    isLoading,
    error,
    enterpriseId,
    loadRechargeTimeline,
  }
}
