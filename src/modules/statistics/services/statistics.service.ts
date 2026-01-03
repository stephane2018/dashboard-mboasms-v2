import { httpClient } from "@/core/lib/http-client"
import { refractHttpError } from "@/core/utils/http-error"
import type { MainStatistics, StatisticsQueryParams } from "../types"

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
}
