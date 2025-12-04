import * as XLSX from 'xlsx'
import { saveAs } from 'file-saver'
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'

/**
 * Options pour l'export Excel
 */
export interface ExcelExportOptions {
  fileName?: string
  sheetName?: string
  data: Record<string, any>[]
  columns?: string[]
  title?: string
}

/**
 * Options pour l'export PDF
 */
export interface PDFExportOptions {
  fileName?: string
  title: string
  subtitle?: string
  data: Record<string, any>[]
  columns: {
    key: string
    header: string
    width?: number
  }[]
  orientation?: 'portrait' | 'landscape'
  footer?: string
}

/**
 * Exporte des données vers un fichier Excel (.xlsx)
 * 
 * @example
 * ```ts
 * exportToExcel({
 *   fileName: 'transactions',
 *   sheetName: 'Ventes',
 *   title: 'Historique des ventes',
 *   data: transactions.map(t => ({
 *     'ID': t.id,
 *     'Client': t.clientName,
 *     'Montant': t.amount
 *   }))
 * })
 * ```
 */
export const exportToExcel = (options: ExcelExportOptions): void => {
  try {
    const {
      fileName = `export_${format(new Date(), 'yyyy-MM-dd_HHmmss')}`,
      sheetName = 'Données',
      data,
      columns,
      title
    } = options

    if (!data || data.length === 0) {
      throw new Error('Aucune donnée à exporter')
    }

    // Filtrer les colonnes si spécifié
    let exportData = data
    if (columns && columns.length > 0) {
      exportData = data.map(row => {
        const filteredRow: Record<string, any> = {}
        columns.forEach(col => {
          if (col in row) {
            filteredRow[col] = row[col]
          }
        })
        return filteredRow
      })
    }

    // Créer le workbook
    const wb = XLSX.utils.book_new()

    // Créer la feuille de calcul avec les en-têtes
    let ws: XLSX.WorkSheet

    if (title) {
      // Créer une feuille vide
      ws = XLSX.utils.aoa_to_sheet([])

      // Ajouter le titre
      XLSX.utils.sheet_add_aoa(ws, [[title]], { origin: 'A1' })

      // Ajouter les données avec les en-têtes à partir de la ligne 3
      XLSX.utils.sheet_add_json(ws, exportData, {
        origin: 'A3',
        skipHeader: false // Assure que les en-têtes sont inclus
      })

      // Merger les cellules du titre
      const range = XLSX.utils.decode_range(ws['!ref'] || 'A1')
      ws['!merges'] = [{ s: { r: 0, c: 0 }, e: { r: 0, c: range.e.c } }]

      // Style pour le titre (en gras si possible)
      if (ws['A1']) {
        ws['A1'].s = {
          font: { bold: true, sz: 14 },
          alignment: { horizontal: 'center', vertical: 'center' }
        }
      }
    } else {
      // Sans titre, créer directement la feuille avec les données
      ws = XLSX.utils.json_to_sheet(exportData, {
        skipHeader: false // Assure que les en-têtes sont inclus
      })
    }

    // Ajouter la feuille au workbook
    XLSX.utils.book_append_sheet(wb, ws, sheetName)

    // Générer le fichier Excel
    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' })
    const blob = new Blob([excelBuffer], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    })

    // Télécharger le fichier
    saveAs(blob, `${fileName}.xlsx`)
  } catch (error) {
    console.error('Erreur lors de l\'export Excel:', error)
    throw error
  }
}

/**
 * Exporte des données vers un fichier PDF avec tableau
 * 
 * @example
 * ```ts
 * exportToPDF({
 *   fileName: 'transactions',
 *   title: 'Historique des ventes',
 *   subtitle: 'Période: Janvier 2024',
 *   data: transactions,
 *   columns: [
 *     { key: 'id', header: 'ID' },
 *     { key: 'clientName', header: 'Client' },
 *     { key: 'amount', header: 'Montant' }
 *   ],
 *   orientation: 'landscape'
 * })
 * ```
 */
export const exportToPDF = (options: PDFExportOptions): void => {
  try {
    const {
      fileName = `export_${format(new Date(), 'yyyy-MM-dd_HHmmss')}`,
      title,
      subtitle,
      data,
      columns,
      orientation = 'portrait',
      footer
    } = options

    if (!data || data.length === 0) {
      throw new Error('Aucune donnée à exporter')
    }

    // Créer le document PDF
    const doc = new jsPDF({
      orientation,
      unit: 'mm',
      format: 'a4'
    })

    // Configuration des marges
    const pageWidth = doc.internal.pageSize.getWidth()
    const pageHeight = doc.internal.pageSize.getHeight()
    const margin = 15

    // En-tête du document
    let yPosition = margin

    // Logo ou titre principal
    doc.setFontSize(20)
    doc.setFont('helvetica', 'bold')
    doc.text('LA POSTE', margin, yPosition)
    yPosition += 8

    // Titre du document
    doc.setFontSize(16)
    doc.setFont('helvetica', 'bold')
    doc.text(title, margin, yPosition)
    yPosition += 7

    // Sous-titre
    if (subtitle) {
      doc.setFontSize(10)
      doc.setFont('helvetica', 'normal')
      doc.setTextColor(100, 100, 100)
      doc.text(subtitle, margin, yPosition)
      yPosition += 5
    }

    // Date de génération
    doc.setFontSize(9)
    doc.setTextColor(150, 150, 150)
    const dateText = `Généré le ${format(new Date(), "dd MMMM yyyy 'à' HH:mm", { locale: fr })}`
    doc.text(dateText, margin, yPosition)
    yPosition += 10

    // Préparer les données du tableau
    const tableHeaders = columns.map(col => col.header)
    const tableData = data.map(row =>
      columns.map(col => {
        const value = row[col.key]
        // Formater les valeurs si nécessaire
        if (value === null || value === undefined) return '-'
        if (typeof value === 'number') return value.toLocaleString('fr-FR')
        return String(value)
      })
    )

    // Générer le tableau avec autoTable
    autoTable(doc, {
      head: [tableHeaders],
      body: tableData,
      startY: yPosition,
      margin: { left: margin, right: margin },
      styles: {
        fontSize: 9,
        cellPadding: 3,
        overflow: 'linebreak',
        halign: 'left'
      },
      headStyles: {
        fillColor: [241, 196, 15], // Couleur jaune La Poste
        textColor: [255, 255, 255],
        fontStyle: 'bold',
        halign: 'center'
      },
      alternateRowStyles: {
        fillColor: [245, 245, 245]
      },
      columnStyles: columns.reduce((acc, col, index) => {
        if (col.width) {
          acc[index] = { cellWidth: col.width }
        }
        return acc
      }, {} as any),
      didDrawPage: () => {
        // Pied de page
        const pageCount = (doc as any).internal.getNumberOfPages()
        const currentPage = (doc as any).internal.getCurrentPageInfo().pageNumber

        // Numéro de page
        doc.setFontSize(8)
        doc.setTextColor(150, 150, 150)
        doc.text(
          `Page ${currentPage} / ${pageCount}`,
          pageWidth - margin - 20,
          pageHeight - 10
        )

        // Footer personnalisé
        if (footer) {
          doc.text(footer, margin, pageHeight - 10)
        }
      }
    })

    // Informations supplémentaires en bas
    const finalY = (doc as any).lastAutoTable.finalY || yPosition + 20
    if (finalY < pageHeight - 30) {
      doc.setFontSize(8)
      doc.setTextColor(100, 100, 100)
      doc.text(`Total: ${data.length} enregistrement(s)`, margin, finalY + 10)
    }

    // Sauvegarder le PDF
    doc.save(`${fileName}.pdf`)
  } catch (error) {
    console.error('Erreur lors de l\'export PDF:', error)
    throw error
  }
}

/**
 * Utilitaire pour formater les données avant export
 */
export const formatDataForExport = <T extends Record<string, any>>(
  data: T[],
  columnMapping: Record<keyof T, string>
): Record<string, any>[] => {
  return data.map(item => {
    const formatted: Record<string, any> = {}
    Object.entries(columnMapping).forEach(([key, label]) => {
      formatted[label] = item[key]
    })
    return formatted
  })
}
