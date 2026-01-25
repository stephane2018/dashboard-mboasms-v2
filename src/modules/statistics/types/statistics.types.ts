export type MainStatistics = {
  smsSentCount: number
  smsCredit: number
  contactCount: number
  groupCount: number
  rechargeCount: number
}

export type RechargeTimelineData = {
  label: string
  count: number
}

export type Period = 'DAY' | 'WEEK' | 'MONTH' | 'YEAR'
export type RechargeStatus = 'VALIDE' | 'REFUSE' | 'ANNULE' | 'PENDING' | 'DEMAND'

export type StatisticsQueryParams = {
  enterpriseId: string
  startDate?: string
  endDate?: string
}

export type RechargeTimelineParams = {
  enterpriseId: string
  period: Period
  status?: RechargeStatus
  startDate?: string
  endDate?: string
}

export type MessageTimelineData = {
  label: string
  count: number
}

export type MessageTimelineParams = {
  enterpriseId: string
  period?: Period
  startDate?: string
  endDate?: string
}
