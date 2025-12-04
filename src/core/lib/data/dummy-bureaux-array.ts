import type { BureauExportData, CaisseDetails, CaisseProduct, BureauPerformance } from "../../../modules/bureau-export/types"

const productCategories = ["Timbres", "Enveloppes", "Colis", "Mandats", "Services"]

const generateProducts = (count: number): CaisseProduct[] => {
  const products: CaisseProduct[] = []
  
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
  ]

  for (let i = 0; i < count; i++) {
    const name = productNames[i % productNames.length]
    const category = productCategories[Math.floor(Math.random() * productCategories.length)]
    const quantitySold = Math.floor(Math.random() * 50) + 5
    const price = Math.floor(Math.random() * 5000) + 500
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
      quantitySold,
      revenue,
      stock,
      lastSale,
    })
  }

  return products
}

const generateCaisse = (index: number, bureauCode: string): CaisseDetails => {
  const statuses: Array<"active" | "inactive" | "pause"> = ["active", "active", "pause"]
  const status = statuses[Math.floor(Math.random() * statuses.length)]
  
  const cashiers = [
    "Aminata Traoré",
    "Mamadou Diarra",
    "Fatoumata Coulibaly",
    "Seydou Keita",
  ]

  const cashier = cashiers[index % cashiers.length]
  const products = generateProducts(8)
  
  const dailyRevenue = products.reduce((sum, p) => sum + p.revenue, 0)
  const transactionCount = Math.floor(Math.random() * 100) + 30
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
  }
}

const generateBureauData = (index: number): BureauExportData => {
  const bureauCode = `LP-BUR-${String(index + 1).padStart(3, "0")}`
  const bureauNames = [
    "Bureau de Poste Abidjan Centre",
    "Bureau de Poste Yamoussoukro",
    "Bureau de Poste Bouaké",
    "Bureau de Poste Korhogo",
    "Bureau de Poste Daloa",
    "Bureau de Poste Gagnoa",
    "Bureau de Poste San-Pédro",
    "Bureau de Poste Man",
    "Bureau de Poste Divo",
    "Bureau de Poste Ferkessédougou",
  ]
  const bureauName = bureauNames[index % bureauNames.length]

  // Générer 2 caisses
  const caisses = [
    generateCaisse(0, bureauCode),
    generateCaisse(1, bureauCode),
  ]

  const totalRevenue = caisses.reduce((sum, c) => sum + c.dailyRevenue, 0)
  const totalTransactions = caisses.reduce((sum, c) => sum + c.transactionCount, 0)
  const averageTicket = totalRevenue / totalTransactions

  // Trouver le produit le plus vendu
  const allProducts = caisses.flatMap(c => c.products)
  const productSales = allProducts.reduce((acc, p) => {
    acc[p.productName] = (acc[p.productName] || 0) + p.quantitySold
    return acc
  }, {} as Record<string, number>)
  
  const topProduct = Object.entries(productSales).sort((a, b) => b[1] - a[1])[0][0]

  const bureau: BureauPerformance = {
    bureauName,
    bureauCode,
    totalRevenue,
    totalTransactions,
    averageTicket,
    topProduct,
    efficiency: Math.floor(Math.random() * 20) + 75, // 75-95%
    customerSatisfaction: Math.floor(Math.random() * 15) + 80, // 80-95%
    comparisonVsYesterday: {
      revenue: Math.floor(Math.random() * 30) - 10, // -10% à +20%
      transactions: Math.floor(Math.random() * 25) - 5, // -5% à +20%
    },
  }

  return {
    bureau,
    caisses,
  }
}

/**
 * Generate 200 dummy bureau data items as an array
 */
export const generateDummyBureauxArray = (): BureauExportData[] => {
  const bureaux: BureauExportData[] = []
  
  for (let i = 0; i < 200; i++) {
    bureaux.push(generateBureauData(i))
  }
  
  return bureaux
}

// Export the array of 200 dummy bureau data
export const dummyBureauxArray = generateDummyBureauxArray()
