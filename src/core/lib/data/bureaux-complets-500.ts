import type { Agence } from "@/core/lib"
import { agences } from "@/core/lib"
import { searchCities, cities } from "@/core/lib/data/regions-cities"

// ============================================
// TYPES
// ============================================

export interface Transaction {
  id: string
  transactionId: string
  clientName: string
  productName: string
  productCode: string
  amount: number
  status: "completed" | "pending" | "failed"
  paymentMethod: "cash" | "card" | "transfer" | "check"
  timestamp: string
  cashierName: string
}

export interface Product {
  id: string
  productCode: string
  productName: string
  category: string
  price: number
  quantitySold: number
  revenue: number
  stock: number
  lastSale: string
}

export interface CaisseComplete {
  id: string
  code: string
  name: string
  status: "active" | "inactive" | "pause" | "maintenance"
  cashier: string
  openedAt: string
  lastTransaction: string
  dailyRevenue: number
  transactionCount: number
  averageTicket: number
  products: Product[]
  transactions: Transaction[]
}

export interface BureauComplete {
  id: string
  code: string
  name: string
  type: "central" | "relais"
  region: string
  regionCode: string
  city: string
  address: string
  manager: string
  phone: string
  status: "active" | "inactive" | "maintenance"
  openingHours: string
  totalRevenue: number
  totalTransactions: number
  efficiency: number
  customerSatisfaction: number
  caisses: CaisseComplete[]
  topProduct: string
  comparisonVsYesterday: {
    revenue: number
    transactions: number
  }
}

// ============================================
// DONNÉES DE BASE
// ============================================

const clientNames = [
  "Kofi Mensah", "Ama Osei", "Kwame Asante", "Abena Boateng", "Yaw Owusu",
  "Akosua Agyeman", "Kwesi Amoako", "Esi Owusu", "Nana Boateng", "Adwoa Mensah",
  "Kojo Owusu", "Afia Asante", "Kwaku Mensah", "Ama Boateng", "Yaa Osei",
  "Kofi Asante", "Abena Mensah", "Kwame Boateng", "Akosua Owusu", "Nana Asante",
  "Seydou Keita", "Aminata Traoré", "Mamadou Diarra", "Fatoumata Coulibaly",
  "Ibrahim Sidibé", "Mariam Sanogo", "Boubacar Touré", "Aissata Koné",
  "Kadiatou Diallo", "Moussa Dembélé", "Fatima Cissé", "Oumar Maïga",
  "Salimata Bah", "Adama Kéita", "Hawa Konaté", "Jean Dupont", "Marie Martin",
  "Pierre Bernard", "Sophie Lefevre", "Michel Durand", "Catherine Moreau",
  "Philippe Girard", "Isabelle Fontaine", "Laurent Mercier", "Anne Dubois"
]

const productNames = [
  "Timbre Marianne 1€",
  "Enveloppe C4",
  "Colis Express",
  "Mandat Cash",
  "Lettre recommandée",
  "Enveloppe bulle",
  "Timbre collection",
  "Chronopost",
  "Colissimo",
  "Assurance colis",
  "Timbre 2€",
  "Boîte postale",
  "Service de courrier",
  "Retrait de fonds",
  "Versement de fonds",
  "Paiement de factures",
  "Timbrage fiscal",
  "Certification de documents",
  "Envoi international",
  "Colis fragile"
]

const productCategories = ["Timbres", "Enveloppes", "Colis", "Mandats", "Services", "Retraits", "Versements"]

const managers = [
  "Aminata Traoré", "Mamadou Diarra", "Fatoumata Coulibaly", "Seydou Keita", "Mariam Sanogo",
  "Boubacar Touré", "Aissata Koné", "Ibrahim Sidibé", "Kadiatou Diallo", "Moussa Dembélé",
  "Fatima Cissé", "Oumar Maïga", "Salimata Bah", "Adama Kéita", "Hawa Konaté"
]

const cashiers = [
  "Aminata Traoré", "Mamadou Diarra", "Fatoumata Coulibaly", "Seydou Keita", "Mariam Sanogo",
  "Boubacar Touré", "Aissata Koné", "Ibrahim Sidibé", "Kadiatou Diallo", "Moussa Dembélé",
]

// ============================================
// FONCTIONS UTILITAIRES
// ============================================

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

const generateProducts = (count: number): Product[] => {
  const products: Product[] = []
  
  for (let i = 0; i < count; i++) {
    const name = productNames[i % productNames.length]
    const category = productCategories[Math.floor(Math.random() * productCategories.length)]
    const quantitySold = Math.floor(Math.random() * 50) + 5
    const price = Math.floor(Math.random() * 50000) + 1000
    const revenue = quantitySold * price
    const stock = Math.floor(Math.random() * 200) + 20

    const hoursAgo = Math.floor(Math.random() * 8)
    const minutesAgo = Math.floor(Math.random() * 60)
    const lastSale = new Date(Date.now() - hoursAgo * 60 * 60 * 1000 - minutesAgo * 60 * 1000).toISOString()

    products.push({
      id: `PRD-${String(i + 1).padStart(3, "0")}`,
      productCode: `LP-${category.substring(0, 3).toUpperCase()}-${String(i + 1).padStart(3, "0")}`,
      productName: name,
      category,
      price,
      quantitySold,
      revenue,
      stock,
      lastSale,
    })
  }

  return products
}

const generateTransactions = (count: number, products: Product[], cashierName: string): Transaction[] => {
  const transactions: Transaction[] = []
  const paymentMethods: Array<"cash" | "card" | "transfer" | "check"> = ["cash", "card", "transfer", "check"]
  const statuses: Array<"completed" | "pending" | "failed"> = ["completed", "completed", "completed", "pending", "failed"]

  for (let i = 0; i < count; i++) {
    const product = products[Math.floor(Math.random() * products.length)]
    const status = statuses[Math.floor(Math.random() * statuses.length)]
    const paymentMethod = paymentMethods[Math.floor(Math.random() * paymentMethods.length)]
    const clientName = clientNames[Math.floor(Math.random() * clientNames.length)]
    
    const minutesAgo = Math.floor(Math.random() * 480) // 8 heures
    const timestamp = new Date(Date.now() - minutesAgo * 60 * 1000).toISOString()

    transactions.push({
      id: `TXN-${String(i + 1).padStart(5, "0")}`,
      transactionId: `TX-${Date.now()}-${i}`,
      clientName,
      productName: product.productName,
      productCode: product.productCode,
      amount: product.price,
      status,
      paymentMethod,
      timestamp,
      cashierName,
    })
  }

  return transactions
}

const generateCaisse = (index: number, bureauCode: string): CaisseComplete => {
  const statuses: Array<"active" | "inactive" | "pause" | "maintenance"> = ["active", "active", "pause"]
  const status = statuses[Math.floor(Math.random() * statuses.length)]
  
  const cashier = cashiers[index % cashiers.length]
  const products = generateProducts(8)
  
  const transactionCount = Math.floor(Math.random() * 100) + 50 // 50-150 transactions
  const transactions = generateTransactions(transactionCount, products, cashier)
  
  const dailyRevenue = products.reduce((sum, p) => sum + p.revenue, 0)
  const averageTicket = dailyRevenue / transactionCount

  const hoursAgo = Math.floor(Math.random() * 2)
  const openedAt = new Date(Date.now() - (8 + hoursAgo) * 60 * 60 * 1000).toISOString()
  
  const minutesAgo = Math.floor(Math.random() * 30)
  const lastTransaction = new Date(Date.now() - minutesAgo * 60 * 1000).toISOString()

  return {
    id: `CAISSE-${index + 1}`,
    code: `${bureauCode}-C${index + 1}`,
    name: `Caisse ${index + 1}`,
    status,
    cashier,
    openedAt,
    lastTransaction,
    dailyRevenue,
    transactionCount,
    averageTicket,
    products,
    transactions,
  }
}

// ============================================
// GÉNÉRATION DES BUREAUX
// ============================================

export const generateBureauComplet = (
  index: number,
  agence: Agence,
  type: "central" | "relais"
): BureauComplete => {
  const verifiedCity = mapAgenceToVerifiedCity(agence)
  const paddedId = String(index + 1).padStart(4, "0")
  const paddedCode = String(index + 1).padStart(3, "0")
  
  const bureauCode = `LP-${type === "central" ? "CTR" : "REL"}-${verifiedCity.regionCode}-${paddedCode}`
  
  // Générer 2-3 caisses par bureau
  const caisseCount = Math.floor(Math.random() * 2) + 2
  const caisses = Array.from({ length: caisseCount }, (_, i) => generateCaisse(i, bureauCode))

  const totalRevenue = caisses.reduce((sum, c) => sum + c.dailyRevenue, 0)
  const totalTransactions = caisses.reduce((sum, c) => sum + c.transactionCount, 0)

  // Trouver le produit le plus vendu
  const allProducts = caisses.flatMap(c => c.products)
  const productSales = allProducts.reduce((acc, p) => {
    acc[p.productName] = (acc[p.productName] || 0) + p.quantitySold
    return acc
  }, {} as Record<string, number>)
  
  const topProduct = Object.entries(productSales).sort((a, b) => b[1] - a[1])[0]?.[0] || "N/A"

  const statuses: Array<"active" | "inactive" | "maintenance"> = ["active", "active", "active", "inactive", "maintenance"]
  const status = statuses[Math.floor(Math.random() * statuses.length)]

  return {
    id: `BUR-${paddedId}`,
    code: bureauCode,
    name: agence.libelleAgence,
    type,
    region: verifiedCity.region,
    regionCode: verifiedCity.regionCode,
    city: verifiedCity.name,
    address: agence.situationGeographique || "Adresse non disponible",
    manager: managers[Math.floor(Math.random() * managers.length)],
    phone: agence.telephone || "N/A",
    status,
    openingHours: "Lun-Sam: 08h-18h",
    totalRevenue,
    totalTransactions,
    efficiency: Math.floor(Math.random() * 20) + 75,
    customerSatisfaction: Math.floor(Math.random() * 15) + 80,
    caisses,
    topProduct,
    comparisonVsYesterday: {
      revenue: Math.floor(Math.random() * 30) - 10,
      transactions: Math.floor(Math.random() * 25) - 5,
    },
  }
}

export const generateBureauxComplets = (count: number = 500): BureauComplete[] => {
  const bureaux: BureauComplete[] = []
  
  // Mélanger les agences
  const shuffledAgences = agences.sort(() => Math.random() - 0.5)
  
  // Prendre jusqu'à count agences
  const selectedAgences = shuffledAgences.slice(0, Math.min(count, agences.length))

  selectedAgences.forEach((agence, index) => {
    // Alterner entre central et relais
    const type = index % 2 === 0 ? "central" : "relais"
    const bureau = generateBureauComplet(index, agence, type)
    bureaux.push(bureau)
  })

  return bureaux
}

// ============================================
// EXPORTS
// ============================================

export const bureauxComplets500 = generateBureauxComplets(500)

export interface BureauxStats {
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

export const calculateBureauxStats = (bureaux: BureauComplete[]): BureauxStats => {
  const totalCaisses = bureaux.reduce((sum, b) => sum + b.caisses.length, 0)
  const totalTransactions = bureaux.reduce((sum, b) => sum + b.totalTransactions, 0)
  const totalRevenue = bureaux.reduce((sum, b) => sum + b.totalRevenue, 0)

  return {
    totalBureaux: bureaux.length,
    totalCaisses,
    totalTransactions,
    totalRevenue,
    activeBureaux: bureaux.filter(b => b.status === "active").length,
    inactiveBureaux: bureaux.filter(b => b.status === "inactive").length,
    maintenanceBureaux: bureaux.filter(b => b.status === "maintenance").length,
    centralBureaux: bureaux.filter(b => b.type === "central").length,
    relaisBureaux: bureaux.filter(b => b.type === "relais").length,
    averageRevenuePerBureau: totalRevenue / bureaux.length,
    averageTransactionsPerBureau: totalTransactions / bureaux.length,
  }
}

export const bureauxStats = calculateBureauxStats(bureauxComplets500)
