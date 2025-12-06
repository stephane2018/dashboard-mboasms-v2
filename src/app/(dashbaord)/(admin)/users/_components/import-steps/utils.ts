import type { ContactData, ValidationError, FileValidationResult } from "./types"

// Validate phone number format (basic international format)
export function isValidPhoneNumber(phoneNumber: string): boolean {
  if (!phoneNumber || typeof phoneNumber !== "string") return false
  
  // Remove spaces, dashes, parentheses
  const cleaned = phoneNumber.replace(/[\s\-()]/g, "")
  
  // Check if it starts with + or a digit
  // Allow 7-15 digits (E.164 standard)
  const phoneRegex = /^(\+)?[1-9]\d{6,14}$/
  
  return phoneRegex.test(cleaned)
}

// Parse CSV content
export function parseCSV(content: string): string[][] {
  const lines = content.split("\n").filter((line) => line.trim())
  return lines.map((line) => {
    // Handle quoted fields
    const fields: string[] = []
    let current = ""
    let inQuotes = false

    for (let i = 0; i < line.length; i++) {
      const char = line[i]
      const nextChar = line[i + 1]

      if (char === '"') {
        if (inQuotes && nextChar === '"') {
          current += '"'
          i++
        } else {
          inQuotes = !inQuotes
        }
      } else if (char === "," && !inQuotes) {
        fields.push(current.trim())
        current = ""
      } else {
        current += char
      }
    }

    fields.push(current.trim())
    return fields
  })
}

// Parse Excel file (requires xlsx library)
export async function parseExcel(file: File): Promise<string[][]> {
  try {
    const { read, utils } = await import("xlsx")
    const arrayBuffer = await file.arrayBuffer()
    const workbook = read(arrayBuffer)
    const worksheet = workbook.Sheets[workbook.SheetNames[0]]
    const data = utils.sheet_to_json(worksheet, { header: 1 }) as string[][]
    return data
  } catch (error) {
    console.error("Error parsing Excel file:", error)
    throw new Error("Impossible de lire le fichier Excel")
  }
}

// Validate file structure and extract contacts
export async function validateAndExtractContacts(
  file: File
): Promise<FileValidationResult> {
  const structureErrors: string[] = []
  const validationErrors: ValidationError[] = []
  const contacts: ContactData[] = []

  try {
    let rows: string[][] = []

    if (file.name.endsWith(".csv")) {
      const content = await file.text()
      rows = parseCSV(content)
    } else if (file.name.endsWith(".xlsx") || file.name.endsWith(".xls")) {
      rows = await parseExcel(file)
    } else {
      return {
        isValid: false,
        contacts: [],
        errors: [],
        structureErrors: ["Format de fichier non supporté. Utilisez CSV ou Excel."],
      }
    }

    if (rows.length === 0) {
      return {
        isValid: false,
        contacts: [],
        errors: [],
        structureErrors: ["Le fichier est vide"],
      }
    }

    // Get headers from first row
    const headers = rows[0].map((h) => String(h || "").toLowerCase().trim())

    // Check if phone number column exists (must be first column)
    const phoneColumnIndex = headers.findIndex(
      (h) =>
        h.includes("phone") ||
        h.includes("téléphone") ||
        h.includes("tel") ||
        h.includes("mobile") ||
        h.includes("numéro")
    )

    if (phoneColumnIndex !== 0) {
      structureErrors.push(
        "La colonne 'Numéro de téléphone' doit être la première colonne du fichier"
      )
    }

    if (phoneColumnIndex === -1) {
      structureErrors.push(
        "Aucune colonne 'Numéro de téléphone' trouvée. Les colonnes doivent inclure: Téléphone, Tel, Mobile ou Numéro"
      )
    }

    // If structure errors, return early
    if (structureErrors.length > 0) {
      return {
        isValid: false,
        contacts: [],
        errors: [],
        structureErrors,
      }
    }

    // Process data rows (skip header)
    for (let i = 1; i < rows.length; i++) {
      const row = rows[i]

      // Convert all cell values to strings
      const stringRow = row.map((cell) => String(cell || ""))

      if (!row || row.length === 0 || !stringRow[0]?.trim()) {
        continue // Skip empty rows
      }

      const phoneNumber = stringRow[0]?.trim() || ""

      // Validate phone number
      if (!isValidPhoneNumber(phoneNumber)) {
        validationErrors.push({
          row: i + 1,
          phoneNumber,
          error: "Numéro de téléphone invalide",
        })
        continue
      }

      // Extract other fields
      const contact: ContactData = {
        phoneNumber,
        firstname: stringRow[1]?.trim() || undefined,
        lastname: stringRow[2]?.trim() || undefined,
        email: stringRow[3]?.trim() || undefined,
      }

      // Add any additional columns
      for (let j = 4; j < stringRow.length; j++) {
        const headerName = headers[j] || `column_${j}`
        contact[headerName] = stringRow[j]?.trim() || undefined
      }

      contacts.push(contact)
    }

    return {
      isValid: validationErrors.length === 0 && contacts.length > 0,
      contacts,
      errors: validationErrors,
      structureErrors: [],
    }
  } catch (error) {
    return {
      isValid: false,
      contacts: [],
      errors: [],
      structureErrors: [
        error instanceof Error ? error.message : "Erreur lors de la lecture du fichier",
      ],
    }
  }
}

// Normalize phone number for display
export function normalizePhoneNumber(phoneNumber: string): string {
  const cleaned = phoneNumber.replace(/[\s\-()]/g, "")
  
  // Format as +XXX XXX XXX XXX if it's a valid number
  if (cleaned.startsWith("+")) {
    return cleaned.slice(0, 3) + " " + cleaned.slice(3)
  }
  
  return cleaned
}
