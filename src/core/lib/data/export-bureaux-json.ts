import { bureauxComplets500, bureauxStats, type BureauComplete } from './bureaux-complets-500'

/**
 * Export data structure for JSON file
 */
export interface BureauxExportData {
  metadata: {
    totalElements: number
    generatedAt: string
    version: string
    stats: {
      totalBureaux: number
      totalCaisses: number
      totalTransactions: number
      totalRevenue: number
      activeBureaux: number
      inactiveBureaux: number
      maintenanceBureaux: number
      centralBureaux: number
      relaisBureaux: number
      averageRevenuePerBureau: number
      averageTransactionsPerBureau: number
    }
  }
  data: BureauComplete[]
}

/**
 * Generate complete export data with 500 bureaux
 */
export const generateBureauxExportData = (): BureauxExportData => {
  return {
    metadata: {
      totalElements: bureauxComplets500.length,
      generatedAt: new Date().toISOString(),
      version: "1.0.0",
      stats: bureauxStats
    },
    data: bureauxComplets500
  }
}

/**
 * Export as JSON string
 */
export const exportBureauxAsJSON = (): string => {
  const data = generateBureauxExportData()
  return JSON.stringify(data, null, 2)
}

/**
 * Export specific bureau by ID
 */
export const exportBureauById = (bureauId: string): BureauComplete | undefined => {
  return bureauxComplets500.find(b => b.id === bureauId)
}

/**
 * Export bureaux by region
 */
export const exportBureauxByRegion = (region: string): BureauComplete[] => {
  return bureauxComplets500.filter(b => b.region === region)
}

/**
 * Export bureaux by type
 */
export const exportBureauxByType = (type: "central" | "relais"): BureauComplete[] => {
  return bureauxComplets500.filter(b => b.type === type)
}

/**
 * Export bureaux by status
 */
export const exportBureauxByStatus = (status: "active" | "inactive" | "maintenance"): BureauComplete[] => {
  return bureauxComplets500.filter(b => b.status === status)
}

/**
 * Export active bureaux only
 */
export const exportActiveBureaux = (): BureauComplete[] => {
  return exportBureauxByStatus("active")
}

/**
 * Export summary statistics
 */
export const exportSummaryStats = () => {
  return {
    metadata: {
      totalElements: bureauxComplets500.length,
      generatedAt: new Date().toISOString(),
      version: "1.0.0"
    },
    stats: bureauxStats
  }
}

// Direct export of the complete data
export const bureauxExportData = generateBureauxExportData()
