import { httpClient } from "@/core/lib/http-client"
import { refractHttpError } from "@/core/utils/http-error"
import type { MainStatistics, StatisticsQueryParams, RechargeTimelineParams, RechargeTimelineData, MessageTimelineParams, MessageTimelineData } from "@/modules/statistics/types"

export const statisticsService = {
  async getMainStatistics(params: StatisticsQueryParams): Promise<MainStatistics> {
    try {
      const queryParams = new URLSearchParams()
      if (params.startDate) queryParams.append("startDate", params.startDate)
      if (params.endDate) queryParams.append("endDate", params.endDate)

      const queryString = queryParams.toString()
      const url = `/api/v1/statistics/main-stat/${params.enterpriseId}${queryString ? `?${queryString}` : ""}`

      return await httpClient.get<MainStatistics>(url)
    } catch (error) {
      return Promise.reject(refractHttpError(error))
    }
  },

  async getRechargeTimeline(params: RechargeTimelineParams): Promise<RechargeTimelineData[]> {
    try {
      const queryParams = new URLSearchParams()
      queryParams.append("period", params.period)
      if (params.status) queryParams.append("status", params.status)
      if (params.startDate) queryParams.append("startDate", params.startDate)
      if (params.endDate) queryParams.append("endDate", params.endDate)

      const queryString = queryParams.toString()
      const url = `/api/v1/statistics/recharge-timeline/${params.enterpriseId}${queryString ? `?${queryString}` : ""}`

      return await httpClient.get<RechargeTimelineData[]>(url)
    } catch (error) {
      return Promise.reject(refractHttpError(error))
    }
  },

  async getMessageTimeline(params: MessageTimelineParams): Promise<MessageTimelineData[]> {
    try {
      const queryParams = new URLSearchParams()
      if (params.period) queryParams.append("period", params.period)
      if (params.startDate) queryParams.append("startDate", params.startDate)
      if (params.endDate) queryParams.append("endDate", params.endDate)

      const queryString = queryParams.toString()
      const url = `/api/v1/statistics/message-timeline/${params.enterpriseId}${queryString ? `?${queryString}` : ""}`

      return await httpClient.get<MessageTimelineData[]>(url)
    } catch (error) {
      return Promise.reject(refractHttpError(error))
    }
  },
}
