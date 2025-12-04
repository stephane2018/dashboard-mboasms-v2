/**
 * EXEMPLE D'UTILISATION - Bureaux Complets 500 Éléments
 * 
 * Ce fichier montre comment utiliser les données générées
 */

import {
  bureauxComplets500,
  bureauxStats,
  generateBureauxExportData,
  exportBureauxAsJSON,
  exportActiveBureaux,
  exportBureauxByRegion,
  exportBureauxByType,
  exportSummaryStats
} from '@/core/lib/data'

// ============================================
// EXEMPLE 1: Accéder aux 500 bureaux
// ============================================
export const example1_getAllBureaux = () => {
  console.log(`Total bureaux: ${bureauxComplets500.length}`)
  console.log(`Premier bureau:`, bureauxComplets500[0])
  
  return bureauxComplets500
}

// ============================================
// EXEMPLE 2: Accéder aux statistiques
// ============================================
export const example2_getStats = () => {
  console.log('Statistiques globales:', bureauxStats)
  
  return {
    totalBureaux: bureauxStats.totalBureaux,
    totalCaisses: bureauxStats.totalCaisses,
    totalTransactions: bureauxStats.totalTransactions,
    totalRevenue: bureauxStats.totalRevenue,
    activeBureaux: bureauxStats.activeBureaux,
    centralBureaux: bureauxStats.centralBureaux,
    relaisBureaux: bureauxStats.relaisBureaux,
  }
}

// ============================================
// EXEMPLE 3: Exporter en JSON
// ============================================
export const example3_exportAsJSON = () => {
  const jsonData = generateBureauxExportData()
  const jsonString = exportBureauxAsJSON()
  
  console.log('JSON généré avec métadonnées')
  console.log('Taille:', jsonString.length, 'caractères')
  
  return jsonData
}

// ============================================
// EXEMPLE 4: Filtrer par région
// ============================================
export const example4_filterByRegion = (region: string) => {
  const bureaux = exportBureauxByRegion(region)
  
  console.log(`Bureaux dans ${region}: ${bureaux.length}`)
  console.log('Premiers bureaux:', bureaux.slice(0, 3))
  
  return bureaux
}

// ============================================
// EXEMPLE 5: Filtrer par type
// ============================================
export const example5_filterByType = () => {
  const centraux = exportBureauxByType('central')
  const relais = exportBureauxByType('relais')
  
  console.log(`Bureaux centraux: ${centraux.length}`)
  console.log(`Bureaux relais: ${relais.length}`)
  
  return { centraux, relais }
}

// ============================================
// EXEMPLE 6: Bureaux actifs uniquement
// ============================================
export const example6_getActiveBureaux = () => {
  const active = exportActiveBureaux()
  
  console.log(`Bureaux actifs: ${active.length}`)
  console.log('Revenu total des actifs:', active.reduce((sum, b) => sum + b.totalRevenue, 0))
  
  return active
}

// ============================================
// EXEMPLE 7: Accéder à un bureau spécifique
// ============================================
export const example7_getBureauDetails = (bureauId: string) => {
  const bureau = bureauxComplets500.find(b => b.id === bureauId)
  
  if (!bureau) {
    console.log(`Bureau ${bureauId} non trouvé`)
    return null
  }
  
  console.log(`Bureau: ${bureau.name}`)
  console.log(`Type: ${bureau.type}`)
  console.log(`Caisses: ${bureau.caisses.length}`)
  console.log(`Revenu: ${bureau.totalRevenue}`)
  console.log(`Transactions: ${bureau.totalTransactions}`)
  
  return bureau
}

// ============================================
// EXEMPLE 8: Accéder aux caisses d'un bureau
// ============================================
export const example8_getCaissesOfBureau = (bureauId: string) => {
  const bureau = bureauxComplets500.find(b => b.id === bureauId)
  
  if (!bureau) return null
  
  console.log(`Caisses du bureau ${bureau.name}:`)
  bureau.caisses.forEach(caisse => {
    console.log(`- ${caisse.name}: ${caisse.transactionCount} transactions, ${caisse.dailyRevenue} FCFA`)
  })
  
  return bureau.caisses
}

// ============================================
// EXEMPLE 9: Accéder aux transactions d'une caisse
// ============================================
export const example9_getTransactionsOfCaisse = (bureauId: string, caisseIndex: number = 0) => {
  const bureau = bureauxComplets500.find(b => b.id === bureauId)
  
  if (!bureau || !bureau.caisses[caisseIndex]) return null
  
  const caisse = bureau.caisses[caisseIndex]
  
  console.log(`Transactions de ${caisse.name}:`)
  console.log(`Total: ${caisse.transactions.length}`)
  console.log('Exemples:')
  caisse.transactions.slice(0, 5).forEach(tx => {
    console.log(`- ${tx.clientName}: ${tx.productName} (${tx.status})`)
  })
  
  return caisse.transactions
}

// ============================================
// EXEMPLE 10: Accéder aux produits d'une caisse
// ============================================
export const example10_getProductsOfCaisse = (bureauId: string, caisseIndex: number = 0) => {
  const bureau = bureauxComplets500.find(b => b.id === bureauId)
  
  if (!bureau || !bureau.caisses[caisseIndex]) return null
  
  const caisse = bureau.caisses[caisseIndex]
  
  console.log(`Produits de ${caisse.name}:`)
  caisse.products.forEach(product => {
    console.log(`- ${product.productName}: ${product.quantitySold} vendus, ${product.revenue} FCFA`)
  })
  
  return caisse.products
}

// ============================================
// EXEMPLE 11: Résumé complet
// ============================================
export const example11_completeSummary = () => {
  const summary = exportSummaryStats()
  
  console.log('=== RÉSUMÉ COMPLET ===')
  console.log(`Généré le: ${summary.metadata.generatedAt}`)
  console.log(`Version: ${summary.metadata.version}`)
  console.log(`Total d'éléments: ${summary.metadata.totalElements}`)
  console.log('')
  console.log('Statistiques:')
  console.log(`- Bureaux: ${summary.stats.totalBureaux}`)
  console.log(`- Caisses: ${summary.stats.totalCaisses}`)
  console.log(`- Transactions: ${summary.stats.totalTransactions}`)
  console.log(`- Revenu total: ${summary.stats.totalRevenue.toLocaleString('fr-FR')} FCFA`)
  console.log(`- Bureaux actifs: ${summary.stats.activeBureaux}`)
  console.log(`- Bureaux centraux: ${summary.stats.centralBureaux}`)
  console.log(`- Bureaux relais: ${summary.stats.relaisBureaux}`)
  console.log(`- Revenu moyen par bureau: ${summary.stats.averageRevenuePerBureau.toLocaleString('fr-FR')} FCFA`)
  console.log(`- Transactions moyennes par bureau: ${summary.stats.averageTransactionsPerBureau.toFixed(2)}`)
  
  return summary
}

// ============================================
// EXEMPLE 12: Recherche avancée
// ============================================
export const example12_advancedSearch = () => {
  // Bureaux actifs dans une région spécifique
  const abidjanActive = bureauxComplets500.filter(
    b => b.region === 'Abidjan' && b.status === 'active'
  )
  
  console.log(`Bureaux actifs à Abidjan: ${abidjanActive.length}`)
  
  // Bureaux centraux avec revenu > 10M
  const highRevenuesCentral = bureauxComplets500.filter(
    b => b.type === 'central' && b.totalRevenue > 10000000
  )
  
  console.log(`Bureaux centraux avec revenu > 10M: ${highRevenuesCentral.length}`)
  
  // Caisses avec plus de 100 transactions
  const busyCaisses = bureauxComplets500
    .flatMap(b => b.caisses.map(c => ({ bureau: b, caisse: c })))
    .filter(({ caisse }) => caisse.transactionCount > 100)
  
  console.log(`Caisses avec > 100 transactions: ${busyCaisses.length}`)
  
  return {
    abidjanActive,
    highRevenuesCentral,
    busyCaisses
  }
}

// ============================================
// EXPORT POUR UTILISATION
// ============================================

export const listesdata = bureauxComplets500.map((bureau, index) => ({
  index: index + 1,
  id: bureau.id,
  code: bureau.code,
  name: bureau.name,
  type: bureau.type,
  region: bureau.region,
  city: bureau.city,
  status: bureau.status,
  totalRevenue: bureau.totalRevenue,
  totalTransactions: bureau.totalTransactions,
  caisses: bureau.caisses.map(c => ({
    id: c.id,
    name: c.name,
    status: c.status,
    transactionCount: c.transactionCount,
    dailyRevenue: c.dailyRevenue,
    transactions: c.transactions.length,
    products: c.products.length
  }))
}))
