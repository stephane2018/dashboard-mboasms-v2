export type MainStatistics = {
  smsSentCount: number
  smsCredit: number
  contactCount: number
  groupCount: number
  rechargeCount: number
}

export type StatisticsQueryParams = {
  enterpriseId: string
  startDate?: string
  endDate?: string
}
