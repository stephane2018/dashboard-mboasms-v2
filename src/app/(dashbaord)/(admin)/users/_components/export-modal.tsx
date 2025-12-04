"use client"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/shared/ui/dialog"
import { Button } from "@/shared/ui/button"
import { DocumentDownload, DocumentText, TickCircle } from "iconsax-react"

interface ExportModalProps {
  isOpen: boolean
  onClose: () => void
  onExport: (format: "csv" | "excel" | "json") => void
  isLoading?: boolean
}

export function ExportModal({
  isOpen,
  onClose,
  onExport,
  isLoading = false,
}: ExportModalProps) {
  const exportOptions = [
    {
      id: "excel",
      title: "Importer depuis Excel",
      description: "Télécharger un fichier Excel (.xlsx) pour importer des contacts",
      icon: DocumentDownload,
      color: "bg-green-100 text-green-600",
    },
    {
      id: "csv",
      title: "Exporter en CSV",
      description: "Télécharger les contacts au format CSV",
      icon: DocumentText,
      color: "bg-blue-100 text-blue-600",
    },
   
  ]

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Actions sur les contacts</DialogTitle>
          <DialogDescription>
            Choisissez une action à effectuer sur vos contacts
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3">
          {exportOptions.map((option) => {
            const IconComponent = option.icon
            return (
              <button
                key={option.id}
                onClick={() => onExport(option.id as "csv" | "excel" | "json")}
                disabled={isLoading}
                className="w-full text-left p-4 rounded-lg border border-border hover:bg-muted transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <div className="flex items-start gap-3">
                  <div className={`p-2 rounded-lg ${option.color}`}>
                    <IconComponent size={20} variant="Bulk" color="currentColor" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium text-sm">{option.title}</h3>
                    <p className="text-xs text-muted-foreground">
                      {option.description}
                    </p>
                  </div>
                </div>
              </button>
            )
          })}
        </div>

        <div className="flex gap-2 pt-4">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={isLoading}
            className="flex-1"
          >
            Annuler
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
