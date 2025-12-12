"use client"

import { useState, useCallback, useRef, useEffect } from "react"
import { Badge } from "@/shared/ui/badge"
import { Button } from "@/shared/ui/button"
import { Input } from "@/shared/ui/input"
import { ScrollArea } from "@/shared/ui/scroll-area"
import { Switch } from "@/shared/ui/switch"
import { Label } from "@/shared/ui/label"
import {
    Add,
    CloseCircle,
    Edit2,
    TickCircle,
    CloseSquare,
    DocumentUpload
} from "iconsax-react"
import { Loader2 } from "lucide-react"
import {
    checkPhoneValidation,
    getPhoneValidationStatus,
    type PhoneOperator,
    type PhoneValidationStatus
} from "@/core/utils/phone-validation"
import { cn } from "@/lib/utils"
import { PhoneImportModal } from "./phone-import-modal"

// Types
export interface PhoneEntry {
    id: string
    phoneNumber: string
    name?: string
    isValid: boolean
    operator: PhoneOperator
}

interface PhoneNumberInputProps {
    entries: PhoneEntry[]
    onEntriesChange: (entries: PhoneEntry[]) => void
    label?: string
    placeholder?: string
    className?: string
    maxHeight?: string
}

// Utility: Generate unique ID
const generateId = () => `phone_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

// Utility: Clean phone number (remove spaces, dashes, etc.)
const cleanPhoneNumber = (phone: string): string => {
    return phone.replace(/[\s\-\(\)\.]/g, "").trim()
}

// Utility: Detect if text looks like a phone number
const looksLikePhoneNumber = (text: string): boolean => {
    const cleaned = cleanPhoneNumber(text)
    // At least 8 digits, may have + prefix
    return /^\+?\d{8,15}$/.test(cleaned)
}

// Utility: Extract phone numbers from text
const extractPhoneNumbers = (text: string): string[] => {
    const phones: string[] = []

    // Split by common delimiters
    const parts = text.split(/[\n\r,;|\t]+/)

    for (const part of parts) {
        const cleaned = cleanPhoneNumber(part)
        if (looksLikePhoneNumber(cleaned)) {
            phones.push(cleaned)
        }
    }

    return [...new Set(phones)] // Remove duplicates
}

// Phone column name patterns (case-insensitive)
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

// Check if a column name looks like a phone column
const isPhoneColumnName = (name: string): boolean => {
    const trimmed = name.trim().toLowerCase()
    return PHONE_COLUMN_PATTERNS.some(pattern => pattern.test(trimmed))
}

// Utility: Parse Excel/CSV paste data and detect phone column
const parseExcelPaste = (text: string): string[] => {
    const lines = text.split(/[\n\r]+/).filter(line => line.trim())
    if (lines.length === 0) return []

    // Check if it's tabular data (tab or comma separated)
    const firstLine = lines[0]
    const isTabSeparated = firstLine.includes('\t')
    const isCommaSeparated = firstLine.includes(',') && !isTabSeparated
    const delimiter = isTabSeparated ? '\t' : isCommaSeparated ? ',' : null

    if (!delimiter) {
        // Not tabular, just extract phones from the text
        return extractPhoneNumbers(text)
    }

    // Parse as tabular data
    const rows = lines.map(line => line.split(delimiter).map(cell => cell.trim()))
    const numColumns = Math.max(...rows.map(r => r.length))

    if (numColumns === 0) return []

    // First row might be headers
    const headerRow = rows[0]
    const dataRows = rows.slice(1)

    // Check if first row contains headers by looking for phone column names
    let phoneColumnIndex = -1
    for (let col = 0; col < headerRow.length; col++) {
        if (isPhoneColumnName(headerRow[col])) {
            phoneColumnIndex = col
            break
        }
    }

    // If we found a phone column by name, use it
    if (phoneColumnIndex >= 0 && dataRows.length > 0) {
        const phones: string[] = []
        for (const row of dataRows) {
            if (row[phoneColumnIndex]) {
                const cleaned = cleanPhoneNumber(row[phoneColumnIndex])
                if (looksLikePhoneNumber(cleaned)) {
                    phones.push(cleaned)
                }
            }
        }
        if (phones.length > 0) {
            return [...new Set(phones)]
        }
    }

    // Fallback: Score each column by how many phone-like values it has
    const columnScores: number[] = Array(numColumns).fill(0)

    for (let col = 0; col < numColumns; col++) {
        for (const row of rows) {
            if (row[col] && looksLikePhoneNumber(row[col])) {
                columnScores[col]++
            }
        }
    }

    // Find the column with the highest score
    const bestColumn = columnScores.indexOf(Math.max(...columnScores))

    if (columnScores[bestColumn] === 0) {
        // No phone column found, try to extract from all text
        return extractPhoneNumbers(text)
    }

    // Extract phones from the best column
    const phones: string[] = []
    for (const row of rows) {
        if (row[bestColumn]) {
            const cleaned = cleanPhoneNumber(row[bestColumn])
            if (looksLikePhoneNumber(cleaned)) {
                phones.push(cleaned)
            }
        }
    }

    return [...new Set(phones)]
}

// Utility: Create PhoneEntry from phone number
const createPhoneEntry = (phoneNumber: string, name?: string): PhoneEntry => {
    const operator = checkPhoneValidation(phoneNumber)
    const status = getPhoneValidationStatus(phoneNumber)

    return {
        id: generateId(),
        phoneNumber,
        name,
        isValid: status === "CORRECT",
        operator
    }
}

// Operator badge colors
const getOperatorColor = (operator: PhoneOperator): string => {
    switch (operator) {
        case "ORANGE":
            return "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400"
        case "MTN":
            return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400"
        case "NEXTTEL":
            return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400"
        case "CAMTEL":
            return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
        default:
            return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
    }
}

export function PhoneNumberInput({
    entries,
    onEntriesChange,
    label = "Destinataires",
    placeholder = "Numéros séparés par des virgules",
    className,
    maxHeight = "h-32"
}: PhoneNumberInputProps) {
    const [inputValue, setInputValue] = useState("")
    const [showPhoneNumber, setShowPhoneNumber] = useState(false)
    const [editingId, setEditingId] = useState<string | null>(null)
    const [editValue, setEditValue] = useState("")
    const [isProcessing, setIsProcessing] = useState(false)
    const [validationError, setValidationError] = useState<string | null>(null)
    const [isImportModalOpen, setIsImportModalOpen] = useState(false)

    const inputRef = useRef<HTMLInputElement>(null)

    // Add phone numbers (supports comma-separated input)
    const handleAddPhone = useCallback(() => {
        if (!inputValue.trim()) {
            return // Don't show error, just return silently
        }

        // Split by comma, semicolon, or space
        const parts = inputValue.split(/[,;\s]+/).filter(p => p.trim())
        const existingNumbers = new Set(entries.map(e => e.phoneNumber))
        const newEntries: PhoneEntry[] = []
        const invalidNumbers: string[] = []
        const duplicates: string[] = []

        for (const part of parts) {
            const cleaned = cleanPhoneNumber(part)
            if (!cleaned) continue

            if (!looksLikePhoneNumber(cleaned)) {
                invalidNumbers.push(part.trim())
                continue
            }

            if (existingNumbers.has(cleaned)) {
                duplicates.push(cleaned)
                continue // Skip duplicates
            }

            existingNumbers.add(cleaned)
            newEntries.push(createPhoneEntry(cleaned))
        }

        if (newEntries.length > 0) {
            onEntriesChange([...entries, ...newEntries])
        }

        if (duplicates.length > 0) {
            setValidationError(`Numéro(s) déjà existant(s): ${duplicates.join(", ")}`)
        } else if (invalidNumbers.length > 0 && newEntries.length === 0) {
            setValidationError(`Format invalide: ${invalidNumbers.join(", ")}`)
        } else {
            setValidationError(null)
        }

        setInputValue("")
    }, [inputValue, entries, onEntriesChange])

    // Delete a phone entry
    const handleDelete = useCallback((id: string) => {
        onEntriesChange(entries.filter(e => e.id !== id))
    }, [entries, onEntriesChange])

    // Start editing
    const handleStartEdit = useCallback((entry: PhoneEntry) => {
        setEditingId(entry.id)
        setEditValue(entry.phoneNumber)
    }, [])

    // Save edit
    const handleSaveEdit = useCallback(() => {
        if (!editingId) return

        const cleaned = cleanPhoneNumber(editValue)

        if (!cleaned || !looksLikePhoneNumber(cleaned)) {
            return
        }

        // Check for duplicates (excluding current entry)
        if (entries.some(e => e.id !== editingId && e.phoneNumber === cleaned)) {
            return
        }

        const updatedEntry = createPhoneEntry(cleaned, entries.find(e => e.id === editingId)?.name)
        updatedEntry.id = editingId // Keep original ID

        onEntriesChange(entries.map(e => e.id === editingId ? updatedEntry : e))
        setEditingId(null)
        setEditValue("")
    }, [editingId, editValue, entries, onEntriesChange])

    // Cancel edit
    const handleCancelEdit = useCallback(() => {
        setEditingId(null)
        setEditValue("")
    }, [])

    // Handle paste from clipboard
    const handlePaste = useCallback(async (e: React.ClipboardEvent) => {
        const text = e.clipboardData.getData("text")
        if (!text) return

        // Check if multiple numbers might be pasted
        const hasDelimiters = /[\n\r,;|\t]/.test(text)

        if (hasDelimiters) {
            e.preventDefault()
            setIsProcessing(true)

            // Small delay to show loading state
            await new Promise(resolve => setTimeout(resolve, 100))

            const phones = parseExcelPaste(text)

            if (phones.length > 0) {
                const existingNumbers = new Set(entries.map(e => e.phoneNumber))
                const newEntries = phones
                    .filter(p => !existingNumbers.has(p))
                    .map(p => createPhoneEntry(p))

                if (newEntries.length > 0) {
                    onEntriesChange([...entries, ...newEntries])
                }
            }

            setIsProcessing(false)
            setInputValue("")
        }
    }, [entries, onEntriesChange])

    // Handle import from modal
    const handleImportPhones = useCallback((phones: string[]) => {
        const existingNumbers = new Set(entries.map(e => e.phoneNumber))
        const newEntries = phones
            .filter(p => !existingNumbers.has(p))
            .map(p => createPhoneEntry(p))

        if (newEntries.length > 0) {
            onEntriesChange([...entries, ...newEntries])
        }
    }, [entries, onEntriesChange])

    // Handle key press in input
    const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
        // Add phone number on Enter
        if (e.key === "Enter") {
            e.preventDefault()
            handleAddPhone()
            return
        }

        // Add phone number on comma and continue typing
        if (e.key === ",") {
            e.preventDefault()
            if (inputValue.trim()) {
                handleAddPhone()
            }
            return
        }

        // Delete last entry with Backspace when input is empty
        if (e.key === "Backspace" && inputValue === "" && entries.length > 0) {
            e.preventDefault()
            const lastEntry = entries[entries.length - 1]
            onEntriesChange(entries.filter(entry => entry.id !== lastEntry.id))
            return
        }
    }, [handleAddPhone, inputValue, entries, onEntriesChange])

    // Clear validation error when input changes
    useEffect(() => {
        if (validationError) {
            setValidationError(null)
        }
    }, [inputValue])

    // Auto-remove duplicates when entries change
    useEffect(() => {
        const seen = new Set<string>()
        const uniqueEntries = entries.filter(entry => {
            if (seen.has(entry.phoneNumber)) {
                return false
            }
            seen.add(entry.phoneNumber)
            return true
        })

        // Only update if duplicates were found
        if (uniqueEntries.length < entries.length) {
            onEntriesChange(uniqueEntries)
        }
    }, [entries, onEntriesChange])

    return (
        <div className={cn("space-y-3", className)}>
            {/* Header with label and toggle */}
            <div className="flex items-center justify-between">
                <Label className="text-sm font-medium">
                    {label} ({entries.length})
                </Label>
                <div className="flex items-center gap-2">
                    <Label htmlFor="show-phone" className="text-xs text-muted-foreground">
                        Afficher numéros
                    </Label>
                    <Switch
                        id="show-phone"
                        checked={showPhoneNumber}
                        onCheckedChange={setShowPhoneNumber}
                    />
                </div>
            </div>

            {/* Input row */}
            <div className="flex gap-2">
                <div className="flex-1 relative">
                    <Input
                        ref={inputRef}
                        type="tel"
                        placeholder={placeholder}
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onKeyDown={handleKeyDown}
                        onPaste={handlePaste}
                        disabled={isProcessing}
                        className={cn(
                            validationError && "border-red-500 focus-visible:border-red-500"
                        )}
                    />
                    {validationError && (
                        <p className="text-xs text-red-500 mt-1">{validationError}</p>
                    )}
                </div>
                <Button
                    type="button"
                    onClick={handleAddPhone}
                    disabled={isProcessing || !inputValue.trim()}
                    size="icon"
                    className="h-12 w-12 shrink-0"
                >
                    {isProcessing ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                        <Add size={20}  variant="Bulk" color="currentColor" />
                    )}
                </Button>
                <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    className="h-12 w-12 shrink-0"
                    onClick={() => setIsImportModalOpen(true)}
                    disabled={isProcessing}
                    title="Importer depuis un fichier"
                >
                    <DocumentUpload size={20} variant="Bulk" color="currentColor" />
                </Button>
            </div>

            {/* Entries display */}
            <ScrollArea className={cn("w-full rounded-lg border bg-muted/50 p-3", maxHeight)}>
                {isProcessing ? (
                    <div className="flex items-center justify-center py-4">
                        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                        <span className="ml-2 text-sm text-muted-foreground">Traitement en cours...</span>
                    </div>
                ) : entries.length === 0 ? (
                    <div className="flex items-center justify-center py-4 text-sm text-muted-foreground">
                        Aucun destinataire. Ajoutez des numéros ou collez depuis Excel.
                    </div>
                ) : (
                    <div className="flex flex-wrap gap-2">
                        {entries.map((entry) => (
                            <Badge
                                key={entry.id}
                                variant="secondary"
                                className={cn(
                                    "flex items-center gap-1.5 px-2 py-1.5 pr-1",
                                    !entry.isValid && "border border-red-300 bg-red-50 dark:bg-red-900/20"
                                )}
                            >
                                {editingId === entry.id ? (
                                    // Edit mode
                                    <div className="flex items-center gap-1">
                                        <input
                                            type="tel"
                                            value={editValue}
                                            onChange={(e) => setEditValue(e.target.value)}
                                            className="w-28 px-1 py-0.5 text-xs rounded bg-background border"
                                            autoFocus
                                            onKeyDown={(e) => {
                                                if (e.key === "Enter") handleSaveEdit()
                                                if (e.key === "Escape") handleCancelEdit()
                                            }}
                                        />
                                        <button
                                            onClick={handleSaveEdit}
                                            className="p-0.5 hover:bg-green-100 rounded dark:hover:bg-green-900/30"
                                        >
                                            <TickCircle size={14} variant="Bulk" color="currentcolor" className="text-green-600" />
                                        </button>
                                        <button
                                            onClick={handleCancelEdit}
                                            className="p-0.5 hover:bg-red-100 rounded dark:hover:bg-red-900/30"
                                        >
                                            <CloseSquare size={14} variant="Bulk" color="currentColor" className="text-primary" />
                                        </button>
                                    </div>
                                ) : (
                                    // Display mode
                                    <>
                                        {/* Operator indicator */}
                                        <span className={cn(
                                            "text-[10px] font-medium px-1 py-0.5 rounded",
                                            getOperatorColor(entry.operator)
                                        )}>
                                            {entry.operator === "UNKNOWN" ? "?" : entry.operator.slice(0, 3)}
                                        </span>

                                        {/* Name or Phone */}
                                        <span className="text-xs max-w-[120px] truncate">
                                            {showPhoneNumber || !entry.name
                                                ? entry.phoneNumber
                                                : entry.name}
                                        </span>

                                        {/* Edit button */}
                                        <button
                                            onClick={() => handleStartEdit(entry)}
                                            className="p-0.5 hover:bg-muted rounded opacity-60 hover:opacity-100"
                                        >
                                            <Edit2 size={12} variant="Bulk" color="currentColor" />
                                        </button>

                                        {/* Delete button */}
                                        <button
                                            onClick={() => handleDelete(entry.id)}
                                            className="p-0.5 hover:bg-red-100 rounded dark:hover:bg-red-900/30"
                                        >
                                            <CloseCircle size={14} variant="Bulk" className="text-red-500" />
                                        </button>
                                    </>
                                )}
                            </Badge>
                        ))}
                    </div>
                )}
            </ScrollArea>

            {/* Summary */}
            {entries.length > 0 && (
                <div className="flex items-center justify-between text-xs text-muted-foreground px-1">
                    <span>
                        {entries.filter(e => e.isValid).length} valide(s), {entries.filter(e => !e.isValid).length} invalide(s)
                    </span>
                    {entries.filter(e => !e.isValid).length > 0 && (
                        <span className="text-amber-600">
                            Les numéros invalides ne recevront pas de SMS
                        </span>
                    )}
                </div>
            )}

            {/* Import Modal */}
            <PhoneImportModal
                isOpen={isImportModalOpen}
                onClose={() => setIsImportModalOpen(false)}
                onImport={handleImportPhones}
            />
        </div>
    )
}
