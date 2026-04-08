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
import { useT } from "@/core/hooks"
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
  const { t } = useT()

  const exportOptions = [
    {
      id: "excel",
      title: t('users.importFromExcel'),
      description: t('users.importFromExcelDesc'),
      icon: DocumentDownload,
      color: "bg-green-100 text-green-600",
    },
    {
      id: "csv",
      title: t('users.exportCsv'),
      description: t('users.exportCsvDesc'),
      icon: DocumentText,
      color: "bg-blue-100 text-blue-600",
    },
  ]

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{t('users.contactActions')}</DialogTitle>
          <DialogDescription>
            {t('users.contactActionsDesc')}
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
                    <IconComponent size={20} variant="Bulk" color="currentColor" className="text-primary" />
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
            {t('common.cancel')}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
