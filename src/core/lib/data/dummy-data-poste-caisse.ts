import type { Caisse, CaisseStats, CaisseStatus } from "../../../modules/caisses/types"
import { agences } from "@/core/lib"
import { searchCities, cities } from "@/core/lib/data/regions-cities"
import type { Agence } from "@/core/lib"

const statuses: CaisseStatus[] = ["ON", "ON", "ON", "ON", "OFF", "FAULT", "OPEN", "CLOSE"]
const cashiers = [
  "Aminata Traoré", "Mamadou Diarra", "Fatoumata Coulibaly", "Seydou Keita", "Mariam Sanogo",
  "Boubacar Touré", "Aissata Koné", "Ibrahim Sidibé", "Kadiatou Diallo", "Moussa Dembélé",
  "Fatima Cissé", "Oumar Maïga", "Salimata Bah", "Adama Kéita", "Hawa Konaté"
]
const responsables = [
  "Jean Kouassi", "Marie Bamba", "Kofi Yao", "Aya Kouamé", "Yves Diabaté",
  "Nathalie Koné", "Eric Touré", "Sophie Diallo", "Laurent Camara", "Aïcha Sanogo"
]

const mapAgenceToVerifiedCity = (agence: Agence) => {
  const cityMatch = agence.libelleAgence.match(/^([A-Z\s]+?)(?:\s+\d+|\s+\(|$)/)
  const cityName = cityMatch ? cityMatch[1].trim() : agence.libelleAgence.split(' ')[0]
  
  let matchedCity = cities.find(c => c.name.toLowerCase() === cityName.toLowerCase())
  
  if (!matchedCity) {
    const results = searchCities(cityName)
    if (results.length > 0) {
      matchedCity = results[0]
    }
  }
  
  return matchedCity || cities[0]
}


export const generateCaisses = (count: number = 10): Caisse[] => {
  const caisses: Caisse[] = []
  
  const selectedAgences = agences
    .sort(() => Math.random() - 0.5)
    .slice(0, Math.min(count, agences.length))

  selectedAgences.forEach((agence, index) => {
    const verifiedCity = mapAgenceToVerifiedCity(agence)
    const status = statuses[Math.floor(Math.random() * statuses.length)]
    const cashier = cashiers[Math.floor(Math.random() * cashiers.length)]
    const responsable = responsables[Math.floor(Math.random() * responsables.length)]

    const dailyRevenue = (status === "ON" || status === "OPEN")
      ? Math.floor(Math.random() * 5000000) + 1000000
      : Math.floor(Math.random() * 500000)

    const transactionCount = (status === "ON" || status === "OPEN")
      ? Math.floor(Math.random() * 200) + 50
      : Math.floor(Math.random() * 50)

    const hours = Math.floor(Math.random() * 5)
    const minutes = Math.floor(Math.random() * 60)
    const lastActivity = new Date(Date.now() - hours * 60 * 60 * 1000 - minutes * 60 * 1000).toISOString()

    const paddedId = String(index + 1).padStart(4, "0")
    const paddedCode = String(index + 1).padStart(3, "0")

    caisses.push({
      id: `CAI-${paddedId}`,
      code: `LP-${verifiedCity.regionCode}-${paddedCode}`,
      postOffice: agence.libelleAgence,
      region: verifiedCity.region,
      address: agence.situationGeographique || "Adresse non disponible",
      city: verifiedCity.name,
      status,
      cashier,
      responsable,
      dailyRevenue,
      transactionCount,
      lastActivity,
      lastUpdate: lastActivity,
      openingTime: "08:00",
      closingTime: "18:00",
    })
  })

  return caisses
}

export const calculateStats = (caisses: Caisse[]): CaisseStats => {
  return {
    totalCaisses: caisses.length,
    activeCaisses: caisses.filter(c => c.status === "ON").length,
    inactiveCaisses: caisses.filter(c => c.status === "OFF").length,
    maintenanceCaisses: caisses.filter(c => c.status === "FAULT").length,
    totalRevenue: caisses.reduce((sum, c) => sum + c.dailyRevenue, 0),
    totalTransactions: caisses.reduce((sum, c) => sum + c.transactionCount, 0),
  }
}

// Export des 10 caisses générées à partir des agences réelles
export const dummyCaisses = generateCaisses(200)
export const dummyStats = calculateStats(dummyCaisses)

// Export as both names for compatibility
export const realCaisses = dummyCaisses
export const realCaissesStats = dummyStats
