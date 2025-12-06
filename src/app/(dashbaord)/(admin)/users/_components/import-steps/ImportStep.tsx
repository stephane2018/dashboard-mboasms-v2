"use client"

import { useState, useRef } from "react"
import { Button } from "@/shared/ui/button"
import { validateAndExtractContacts } from "./utils"
import { CloudAdd, DocumentDownload, Trash } from "iconsax-react"
import type { ContactData } from "./types"

interface ImportStepProps {
  onFileLoad: (contacts: ContactData[], errors: string[]) => void
  isLoading?: boolean
}

export function ImportStep({ onFileLoad, isLoading = false }: ImportStepProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [error, setError] = useState<string>("")
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFile = async (file: File) => {
    setError("")
    setSelectedFile(file)
    setIsProcessing(true)

    try {
      const result = await validateAndExtractContacts(file)

      if (result.structureErrors.length > 0) {
        setError(result.structureErrors.join("\n"))
        setSelectedFile(null)
        setIsProcessing(false)
        return
      }

      const errorMessages = result.errors.map(
        (err) => `Ligne ${err.row}: ${err.phoneNumber} - ${err.error}`
      )

      onFileLoad(result.contacts, errorMessages)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur lors du traitement du fichier")
      setSelectedFile(null)
    } finally {
      setIsProcessing(false)
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)

    const files = e.dataTransfer.files
    if (files.length > 0) {
      handleFile(files[0])
    }
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.currentTarget.files
    if (files && files.length > 0) {
      handleFile(files[0])
    }
  }

  const handleClearFile = () => {
    setSelectedFile(null)
    setError("")
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  return (
    <div className="space-y-4">
      {/* Drag and Drop Area */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`relative border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${isDragging
            ? "border-blue-500 bg-blue-50"
            : "border-muted-foreground/25 hover:border-muted-foreground/50 hover:bg-muted/50"
          } ${isProcessing ? "opacity-50 cursor-not-allowed" : ""}`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".csv,.xlsx,.xls"
          onChange={handleFileSelect}
          disabled={isProcessing}
          className="hidden"
        />

        <div className="flex flex-col items-center gap-3">
          <div className="p-3 rounded-lg bg-blue-100">
            <CloudAdd size={24} className="text-blue-600" variant="Bulk" color="currentColor" />
          </div>
          <div>
            <p className="font-medium text-sm">Déposez votre fichier ici</p>
            <p className="text-xs text-muted-foreground mt-1">
              ou cliquez pour parcourir (CSV, Excel)
            </p>
          </div>
        </div>
      </div>

      {/* File Info */}
      {selectedFile && !error && (
        <div className="p-3 rounded-lg bg-green-50 border border-green-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <DocumentDownload size={16} className="text-green-600" variant="Bulk" color="currentColor" />
              <div>
                <p className="text-sm font-medium text-green-900">{selectedFile.name}</p>
                <p className="text-xs text-green-700">
                  {(selectedFile.size / 1024).toFixed(2)} KB
                </p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClearFile}
              disabled={isProcessing}
              className="h-8 w-8 p-0"
            >
              <Trash size={16} variant="Bulk" color="currentColor" />
            </Button>
          </div>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="p-3 rounded-lg bg-red-50 border border-red-200">
          <p className="text-sm font-medium text-red-900">Erreur de validation</p>
          <p className="text-xs text-red-700 mt-1 whitespace-pre-wrap">{error}</p>
          <Button
            variant="outline"
            size="sm"
            onClick={handleClearFile}
            className="mt-2"
          >
            Réessayer
          </Button>
        </div>
      )}

      {/* Processing State */}
      {isProcessing && (
        <div className="p-3 rounded-lg bg-blue-50 border border-blue-200">
          <p className="text-sm text-blue-900">Traitement du fichier en cours...</p>
        </div>
      )}

      {/* Instructions */}
      <div className="p-3 rounded-lg bg-muted/50">
        <p className="text-xs font-medium mb-2">Format attendu:</p>
        <ul className="text-xs text-muted-foreground space-y-1">
          <li>• La première colonne doit contenir les numéros de téléphone</li>
          <li>• Les colonnes optionnelles: Prénom, Nom, Email</li>
          <li>• Les numéros doivent être valides (7-15 chiffres)</li>
          <li>• Formats acceptés: CSV, Excel (.xlsx, .xls)</li>
        </ul>
      </div>
    </div>
  )
}
