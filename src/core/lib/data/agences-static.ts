import type { CaisseRelais, CaisseRelaisStatus } from "../../../modules/caisses-relais/types"
import agencesJson from "./agences.json"

interface AgenceData {
  "LIBELLE AGENCE": string
  "SITUATION GEOGRAPHIQUE": string
  "TELEPHONE": string | null
}

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

// Fonction pour extraire la région/ville depuis le nom de l'agence
const extractLocationFromAgence = (libelle: string): { region: string; city: string } => {
  const cityMatch = libelle.match(/^([A-Z\s]+?)(?:\s+\d+|\s+\(|$)/)
  const city = cityMatch ? cityMatch[1].trim() : libelle.split(' ')[0]
  
  const regionMap: Record<string, string> = {
    'ABIDJAN': 'Abidjan',
    'ABOBO': 'Abidjan',
    'ADJAME': 'Abidjan',
    'COCODY': 'Abidjan',
    'ATTECOUBE': 'Abidjan',
    'YOPOUGON': 'Abidjan',
    'PORT-BOUET': 'Abidjan',
    'KOUMASSI': 'Abidjan',
    'TREICHVILLE': 'Abidjan',
    'MARCORY': 'Abidjan',
    'PLATEAU': 'Abidjan',
    'BOUAKE': 'Vallée du Bandama',
    'DALOA': 'Sassandra-Marahoué',
    'YAMOUSSOUKRO': 'Yamoussoukro',
    'KORHOGO': 'Savanes',
    'SAN-PEDRO': 'Bas-Sassandra',
    'ABENGOUROU': 'Comoé',
    'BONDOUKOU': 'Zanzan',
    'GAGNOA': 'Gôh',
    'MAN': 'Montagnes',
  }
  
  for (const [key, region] of Object.entries(regionMap)) {
    if (libelle.toUpperCase().includes(key)) {
      return { region, city }
    }
  }
  
  return { region: city, city }
}

// Générer les caisses relais à partir des données JSON statiques
export const generateStaticCaissesRelais = (): CaisseRelais[] => {
  const agencesData = agencesJson as AgenceData[]
  const caisses: CaisseRelais[] = []

  agencesData.forEach((agence, index) => {
    const { region, city } = extractLocationFromAgence(agence["LIBELLE AGENCE"])
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
    const regionCode = region.substring(0, 3).toUpperCase()

    const isPointRelais = agence["LIBELLE AGENCE"].includes("Point Relais")

    caisses.push({
      id: `CR-${paddedId}`,
      code: `LP-REL-${regionCode}-${paddedCode}`,
      relayPointName: agence["LIBELLE AGENCE"],
      relayPointCode: `PR-${regionCode}-${paddedCode}`,
      region,
      city,
      address: agence["SITUATION GEOGRAPHIQUE"],
      manager,
      phone: agence["TELEPHONE"] || "N/A",
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

// Export des données statiques
export const staticCaissesRelais = generateStaticCaissesRelais()
