"use client"

import { useState, useRef } from "react"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/shared/ui/dialog"
import { Button } from "@/shared/ui/button"
import { Textarea } from "@/shared/ui/textarea"
import { Alert, AlertDescription } from "@/shared/ui/alert"
import { Label } from "@/shared/ui/label"
import {
    DocumentUpload,
    DocumentText,
    TableDocument,
    Warning2,
    TickCircle,
    InfoCircle,
} from "iconsax-react"
import { Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"
import * as XLSX from "xlsx"
import { type PhoneEntry } from "./phone-number-input"

// Utility functions (copied from phone-number-input.tsx)
const cleanPhoneNumber = (phone: string): string => {
    return phone.replace(/[\s\-\(\)\.]/g, "").trim()
}

const looksLikePhoneNumber = (text: string): boolean => {
    const cleaned = cleanPhoneNumber(text)
    return /^\+?\d{8,15}$/.test(cleaned)
}

const PHONE_COLUMN_PATTERNS = [
    /^phone$/i,
    /^tel$/i,
    /^telephone$/i,
    /^téléphone$/i,
    /^mobile$/i,
    /^numero$/i,
    /^numéro$/i,
    /^num$/i,
    /^cell$/i,
    /^cellphone$/i,
    /^phone\s*number$/i,
    /^phone_number$/i,
    /^phonenumber$/i,
    /^tel[eé]phone$/i,
    /^n[°o]?\s*t[eé]l/i,
    /^contact$/i,
]

const isPhoneColumnName = (name: string): boolean => {
    const trimmed = name.trim().toLowerCase()
    return PHONE_COLUMN_PATTERNS.some(pattern => pattern.test(trimmed))
}

const extractPhoneNumbers = (text: string): string[] => {
    const phones: string[] = []
    const parts = text.split(/[\n\r,;|\t]+/)

    for (const part of parts) {
        const cleaned = cleanPhoneNumber(part)
        if (looksLikePhoneNumber(cleaned)) {
            phones.push(cleaned)
        }
    }

    return [...new Set(phones)]
}

type ImportType = "text" | "excel" | "csv"

interface PhoneImportModalProps {
    isOpen: boolean
    onClose: () => void
    onImport: (phones: string[]) => void
}

export function PhoneImportModal({
    isOpen,
    onClose,
    onImport,
}: PhoneImportModalProps) {
    const [selectedType, setSelectedType] = useState<ImportType>("text")
    const [textInput, setTextInput] = useState("")
    const [isProcessing, setIsProcessing] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [success, setSuccess] = useState<string | null>(null)
    const fileInputRef = useRef<HTMLInputElement>(null)

    const handleReset = () => {
        setTextInput("")
        setError(null)
        setSuccess(null)
        if (fileInputRef.current) {
            fileInputRef.current.value = ""
        }
    }

    const handleClose = () => {
        handleReset()
        onClose()
    }

    const handleTextImport = () => {
        setError(null)
        setSuccess(null)

        if (!textInput.trim()) {
            setError("Veuillez entrer au moins un numéro de téléphone")
            return
        }

        const phones = extractPhoneNumbers(textInput)

        if (phones.length === 0) {
            setError("Aucun numéro de téléphone valide trouvé dans le texte")
            return
        }

        setSuccess(`${phones.length} numéro(s) trouvé(s) avec succès`)
        onImport(phones)

        // Reset and close after a delay
        setTimeout(() => {
            handleClose()
        }, 1000)
    }

    const handleFileImport = async (file: File, type: ImportType) => {
        setError(null)
        setSuccess(null)
        setIsProcessing(true)

        try {
            let extractedPhones: string[] = []

            if (type === "excel") {
                // Read Excel file
                const data = await file.arrayBuffer()
                const workbook = XLSX.read(data, { type: 'array' })
                const firstSheetName = workbook.SheetNames[0]
                const worksheet = workbook.Sheets[firstSheetName]
                const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 }) as any[][]

                const phones: string[] = []

                if (jsonData.length > 0) {
                    const headerRow = jsonData[0]
                    let phoneColumnIndex = -1

                    // Find phone column by header
                    for (let i = 0; i < headerRow.length; i++) {
                        const header = String(headerRow[i]).toLowerCase()
                        if (isPhoneColumnName(header)) {
                            phoneColumnIndex = i
                            break
                        }
                    }

                    if (phoneColumnIndex >= 0) {
                        for (let i = 1; i < jsonData.length; i++) {
                            const row = jsonData[i]
                            if (row[phoneColumnIndex]) {
                                const cleaned = cleanPhoneNumber(String(row[phoneColumnIndex]))
                                if (looksLikePhoneNumber(cleaned)) {
                                    phones.push(cleaned)
                                }
                            }
                        }
                    } else {
                        // Score each column
                        const numColumns = Math.max(...jsonData.map(row => row.length))
                        const columnScores: number[] = Array(numColumns).fill(0)

                        for (let col = 0; col < numColumns; col++) {
                            for (const row of jsonData) {
                                if (row[col] && looksLikePhoneNumber(String(row[col]))) {
                                    columnScores[col]++
                                }
                            }
                        }

                        const bestColumn = columnScores.indexOf(Math.max(...columnScores))

                        if (columnScores[bestColumn] > 0) {
                            for (const row of jsonData) {
                                if (row[bestColumn]) {
                                    const cleaned = cleanPhoneNumber(String(row[bestColumn]))
                                    if (looksLikePhoneNumber(cleaned)) {
                                        phones.push(cleaned)
                                    }
                                }
                            }
                        }
                    }
                }

                extractedPhones = [...new Set(phones)]
            } else if (type === "csv") {
                // Read CSV file
                const text = await file.text()
                const lines = text.split(/[\n\r]+/).filter(line => line.trim())

                if (lines.length === 0) {
                    setError("Le fichier CSV est vide")
                    setIsProcessing(false)
                    return
                }

                const phones: string[] = []
                const headerRow = lines[0].split(/[,;\t]/).map(cell => cell.trim())
                let phoneColumnIndex = -1

                // Find phone column
                for (let i = 0; i < headerRow.length; i++) {
                    if (isPhoneColumnName(headerRow[i])) {
                        phoneColumnIndex = i
                        break
                    }
                }

                if (phoneColumnIndex >= 0) {
                    for (let i = 1; i < lines.length; i++) {
                        const cells = lines[i].split(/[,;\t]/).map(cell => cell.trim())
                        if (cells[phoneColumnIndex]) {
                            const cleaned = cleanPhoneNumber(cells[phoneColumnIndex])
                            if (looksLikePhoneNumber(cleaned)) {
                                phones.push(cleaned)
                            }
                        }
                    }
                } else {
                    // Try all cells
                    for (const line of lines) {
                        const cells = line.split(/[,;\t]/).map(cell => cell.trim())
                        for (const cell of cells) {
                            const cleaned = cleanPhoneNumber(cell)
                            if (looksLikePhoneNumber(cleaned)) {
                                phones.push(cleaned)
                            }
                        }
                    }
                }

                extractedPhones = [...new Set(phones)]
            }

            if (extractedPhones.length === 0) {
                setError("Aucun numéro de téléphone valide trouvé dans le fichier")
                setIsProcessing(false)
                return
            }

            setSuccess(`${extractedPhones.length} numéro(s) importé(s) avec succès`)
            onImport(extractedPhones)

            // Reset and close after a delay
            setTimeout(() => {
                handleClose()
            }, 1000)
        } catch (error) {
            console.error("Error reading file:", error)
            setError("Erreur lors de la lecture du fichier. Vérifiez le format du fichier.")
        }

        setIsProcessing(false)
    }

    const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        await handleFileImport(file, selectedType)
    }

    return (
        <Dialog open={isOpen} onOpenChange={handleClose}>
            <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="text-2xl flex items-center gap-2">
                        <DocumentUpload size={24} color="currentColor" variant="Bulk" className="text-primary" />
                        Importer des numéros
                    </DialogTitle>
                    <DialogDescription>
                        Choisissez le type d'importation et ajoutez vos numéros de téléphone
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-6 py-4">
                    {/* Import Type Selection */}
                    <div className="space-y-3">
                        <Label className="text-sm font-medium">Type d'importation</Label>
                        <div className="grid grid-cols-3 gap-3">
                            {/* Text Import */}
                            <button
                                onClick={() => {
                                    setSelectedType("text")
                                    handleReset()
                                }}
                                className={cn(
                                    "flex flex-col items-center gap-2 p-4 rounded-lg border-2 transition-all",
                                    selectedType === "text"
                                        ? "border-primary bg-primary/5"
                                        : "border-border hover:border-primary/50"
                                )}
                            >
                                <DocumentText
                                    size={32}
                                    color="currentColor"
                                    variant={selectedType === "text" ? "Bulk" : "Outline"}
                                    className={selectedType === "text" ? "text-primary" : "text-muted-foreground"}
                                />
                                <span className={cn(
                                    "text-sm font-medium",
                                    selectedType === "text" ? "text-primary" : "text-muted-foreground"
                                )}>
                                    Texte
                                </span>
                            </button>

                            {/* Excel Import */}
                            <button
                                onClick={() => {
                                    setSelectedType("excel")
                                    handleReset()
                                }}
                                className={cn(
                                    "flex flex-col items-center gap-2 p-4 rounded-lg border-2 transition-all",
                                    selectedType === "excel"
                                        ? "border-primary bg-primary/5"
                                        : "border-border hover:border-primary/50"
                                )}
                            >
                                <TableDocument
                                    size={32}
                                    color="currentColor"
                                    variant={selectedType === "excel" ? "Bulk" : "Outline"}
                                    className={selectedType === "excel" ? "text-primary" : "text-muted-foreground"}
                                />
                                <span className={cn(
                                    "text-sm font-medium",
                                    selectedType === "excel" ? "text-primary" : "text-muted-foreground"
                                )}>
                                    Excel
                                </span>
                            </button>

                            {/* CSV Import */}
                            <button
                                onClick={() => {
                                    setSelectedType("csv")
                                    handleReset()
                                }}
                                className={cn(
                                    "flex flex-col items-center gap-2 p-4 rounded-lg border-2 transition-all",
                                    selectedType === "csv"
                                        ? "border-primary bg-primary/5"
                                        : "border-border hover:border-primary/50"
                                )}
                            >
                                <DocumentText
                                    size={32}
                                    color="currentColor"
                                    variant={selectedType === "csv" ? "Bulk" : "Outline"}
                                    className={selectedType === "csv" ? "text-primary" : "text-muted-foreground"}
                                />
                                <span className={cn(
                                    "text-sm font-medium",
                                    selectedType === "csv" ? "text-primary" : "text-muted-foreground"
                                )}>
                                    CSV
                                </span>
                            </button>
                        </div>
                    </div>

                    {/* Error Alert */}
                    {error && (
                        <Alert className="border-red-300 bg-red-50 dark:bg-red-900/20">
                            <Warning2 size={18} color="currentColor" variant="Bulk" className="text-red-600" />
                            <AlertDescription className="text-red-700 dark:text-red-400">
                                {error}
                            </AlertDescription>
                        </Alert>
                    )}

                    {/* Success Alert */}
                    {success && (
                        <Alert className="border-green-300 bg-green-50 dark:bg-green-900/20">
                            <TickCircle size={18} color="currentColor" variant="Bulk" className="text-green-600" />
                            <AlertDescription className="text-green-700 dark:text-green-400">
                                {success}
                            </AlertDescription>
                        </Alert>
                    )}

                    {/* Import Content */}
                    {selectedType === "text" ? (
                        <div className="space-y-3">
                            <Label htmlFor="text-input">
                                Entrez les numéros (un par ligne ou séparés par des virgules)
                            </Label>
                            <Textarea
                                id="text-input"
                                value={textInput}
                                onChange={(e) => setTextInput(e.target.value)}
                                placeholder="Exemple:&#10;+237612345678&#10;+237699887766&#10;ou&#10;+237612345678, +237699887766"
                                className="min-h-[200px] resize-none font-mono text-sm"
                                disabled={isProcessing}
                            />
                            <Alert className="border-blue-300 bg-blue-50 dark:bg-blue-900/20">
                                <InfoCircle size={16} color="currentColor" variant="Bulk" className="text-blue-600" />
                                <AlertDescription className="text-blue-700 dark:text-blue-400 text-xs">
                                    Les numéros peuvent être séparés par des virgules, points-virgules, ou des retours à la ligne.
                                </AlertDescription>
                            </Alert>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            <Label>
                                {selectedType === "excel" ? "Sélectionnez un fichier Excel (.xlsx, .xls)" : "Sélectionnez un fichier CSV (.csv)"}
                            </Label>
                            <div className="flex flex-col items-center justify-center border-2 border-dashed border-border rounded-lg p-8 hover:border-primary/50 transition-colors">
                                <DocumentUpload size={48} variant="Bulk" className="text-muted-foreground mb-4" />
                                <p className="text-sm text-muted-foreground mb-4 text-center">
                                    Cliquez sur le bouton ci-dessous pour sélectionner un fichier
                                </p>
                                <Button
                                    onClick={() => fileInputRef.current?.click()}
                                    disabled={isProcessing}
                                    variant="outline"
                                >
                                    {isProcessing ? (
                                        <>
                                            <Loader2 className="h-4 w-4 animate-spin mr-2" />
                                            Traitement...
                                        </>
                                    ) : (
                                        <>
                                            <DocumentUpload size={16} variant="Bulk" color="currentcolor" className="mr-2" />
                                            Choisir un fichier
                                        </>
                                    )}
                                </Button>
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept={selectedType === "excel" ? ".xlsx,.xls" : ".csv"}
                                    onChange={handleFileSelect}
                                    className="hidden"
                                />
                            </div>
                            <Alert className="border-blue-300 bg-blue-50 dark:bg-blue-900/20">
                                <InfoCircle size={16} color="currentColor" variant="Bulk" className="text-blue-600" />
                                <AlertDescription className="text-blue-700 dark:text-blue-400 text-xs">
                                    {selectedType === "excel"
                                        ? "Le fichier Excel doit contenir une colonne avec les numéros de téléphone. Les en-têtes comme 'téléphone', 'phone', 'mobile' sont automatiquement détectés."
                                        : "Le fichier CSV doit contenir une colonne avec les numéros de téléphone. Les séparateurs virgule, point-virgule et tabulation sont supportés."}
                                </AlertDescription>
                            </Alert>
                        </div>
                    )}
                </div>

                {/* Footer Buttons */}
                {selectedType === "text" && (
                    <div className="flex gap-3 justify-end pt-4 border-t">
                        <Button
                            variant="outline"
                            onClick={handleClose}
                            disabled={isProcessing}
                        >
                            Annuler
                        </Button>
                        <Button
                            onClick={handleTextImport}
                            disabled={isProcessing || !textInput.trim()}
                        >
                            {isProcessing ? (
                                <>
                                    <Loader2  className="h-4 w-4 animate-spin mr-2" />
                                    Importation...
                                </>
                            ) : (
                                <>
                                    <TickCircle  size={16} color="currentColor" variant="Bulk" className="mr-2" />
                                    Importer
                                </>
                            )}
                        </Button>
                    </div>
                )}
            </DialogContent>
        </Dialog>
    )
}
