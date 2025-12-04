import type { CaisseRelais, CaisseRelaisStats, CaisseRelaisStatus } from "../../../modules/caisses-relais/types"
import { agences } from "@/core/lib"
import { searchCities, cities } from "@/core/lib/data/regions-cities"
import type { Agence } from "@/core/lib"

const statuses: CaisseRelaisStatus[] = ["active", "active", "active", "active", "inactive", "maintenance", "suspended"]
const managers = [
  "Aminata Traoré", "Mamadou Diarra", "Fatoumata Coulibaly", "Seydou Keita", "Mariam Sanogo",
  "Boubacar Touré", "Aissata Koné", "Ibrahim Sidibé", "Kadiatou Diallo", "Moussa Dembélé",
  "Fatima Cissé", "Oumar Maïga", "Salimata Bah", "Adama Kéita", "Hawa Konaté"
]

const serviceTypes = [
  ["Courrier", "Colis", "Mandats"],
  ["Courrier", "Retraits", "Paiements"],
  ["Colis", "Mandats", "Timbres"],
  ["Courrier", "Colis", "Mandats", "Retraits"],
  ["Courrier", "Paiements", "Timbres"],
  ["Colis", "Mandats", "Retraits", "Paiements"],
]

/**
 * Map agence to a verified city from the regions-cities data
 * Ensures only cities are returned (never regions)
 */
const mapAgenceToVerifiedCity = (agence: Agence) => {
  // Extract city name from agence libelle
  const cityMatch = agence.libelleAgence.match(/^([A-Z\s]+?)(?:\s+\d+|\s+\(|$)/)
  const cityName = cityMatch ? cityMatch[1].trim() : agence.libelleAgence.split(' ')[0]
  
  // Try exact match first (case-insensitive) - ONLY from cities array
  let matchedCity = cities.find(c => c.name.toLowerCase() === cityName.toLowerCase())
  
  // If no exact match, try partial match with search
  if (!matchedCity) {
    const results = searchCities(cityName)
    if (results.length > 0) {
      matchedCity = results[0]
    }
  }
  
  // Fallback to first city (Abidjan)
  return matchedCity || cities[0]
}

/**
 * Generate 10 caisses relais using real agences, regions and cities data
 */
export const generateCaissesRelais = (count: number = 10): CaisseRelais[] => {
  const caisses: CaisseRelais[] = []
  
  // Select random agences from the list
  const selectedAgences = agences
    .sort(() => Math.random() - 0.5)
    .slice(0, Math.min(count, agences.length))

  selectedAgences.forEach((agence, index) => {
    const verifiedCity = mapAgenceToVerifiedCity(agence)
    const status = statuses[Math.floor(Math.random() * statuses.length)]
    const manager = managers[Math.floor(Math.random() * managers.length)]
    const services = serviceTypes[Math.floor(Math.random() * serviceTypes.length)]

    const dailyRevenue = status === "active"
      ? Math.floor(Math.random() * 1500000) + 300000
      : Math.floor(Math.random() * 300000)

    const weeklyRevenue = dailyRevenue * (status === "active" ? 6 : 3)

    const transactionCount = status === "active"
      ? Math.floor(Math.random() * 120) + 20
      : Math.floor(Math.random() * 30)

    const cashBalance = Math.floor(Math.random() * 5000000) + 500000

    const hoursAgo = Math.floor(Math.random() * 12)
    const minutesAgo = Math.floor(Math.random() * 60)
    const lastActivity = new Date(Date.now() - hoursAgo * 60 * 60 * 1000 - minutesAgo * 60 * 1000).toISOString()

    const paddedId = String(index + 1).padStart(4, "0")
    const paddedCode = String(index + 1).padStart(3, "0")

    const isPointRelais = agence.libelleAgence.includes("Point Relais")

    caisses.push({
      id: `CR-${paddedId}`,
      code: `LP-REL-${verifiedCity.regionCode}-${paddedCode}`,
      relayPointName: agence.libelleAgence,
      relayPointCode: `PR-${verifiedCity.regionCode}-${paddedCode}`,
      region: verifiedCity.region,
      city: verifiedCity.name,
      address: agence.situationGeographique || "Adresse non disponible",
      manager,
      phone: agence.telephone || "N/A",
      status,
      openingHours: "Lun-Sam: 08h-18h",
      dailyRevenue,
      weeklyRevenue,
      transactionCount,
      lastActivity,
      cashBalance,
      serviceTypes: isPointRelais 
        ? ["Courrier", "Colis", "Retraits"] 
        : services,
    })
  })

  return caisses
}


export const calculateStats = (caisses: CaisseRelais[]): CaisseRelaisStats => {
  const totalRevenue = caisses.reduce((sum, c) => sum + c.dailyRevenue, 0)
  
  return {
    totalCaisses: caisses.length,
    activeCaisses: caisses.filter(c => c.status === "active").length,
    inactiveCaisses: caisses.filter(c => c.status === "inactive").length,
    maintenanceCaisses: caisses.filter(c => c.status === "maintenance").length,
    suspendedCaisses: caisses.filter(c => c.status === "suspended").length,
    totalRevenue,
    totalTransactions: caisses.reduce((sum, c) => sum + c.transactionCount, 0),
    averageRevenue: totalRevenue / caisses.length,
  }
}

// Export as both names for compatibility
export const generateCaissesRelaisFromAgences = generateCaissesRelais

export const dummyCaissesRelais = generateCaissesRelais(10)
export const dummyCaissesRelaisStats = calculateStats(dummyCaissesRelais)
