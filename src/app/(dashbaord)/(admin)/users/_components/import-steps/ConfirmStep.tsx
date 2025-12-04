"use client"

import { Button } from "@/shared/ui/button"
import { ScrollArea } from "@/shared/ui/scroll-area"
import { TickCircle, Sms } from "iconsax-react"
import type { ContactData } from "./types"

interface ConfirmStepProps {
  contacts: ContactData[]
  onImportConfirm: () => Promise<void>
  isProcessing?: boolean
}

export function ConfirmStep({
  contacts,
  onImportConfirm,
  isProcessing = false,
}: ConfirmStepProps) {
  return (
    <div className="space-y-4">
      {/* Summary */}
      <div className="p-4 rounded-lg bg-green-50 border border-green-200">
        <div className="flex items-start gap-3">
          <TickCircle size={20} className="text-green-600 shrink-0 mt-0.5" variant="Bulk" />
          <div>
            <p className="font-medium text-sm text-green-900">
              Prêt à importer {contacts.length} contact{contacts.length > 1 ? "s" : ""}
            </p>
            <p className="text-xs text-green-700 mt-1">
              Cliquez sur "Importer" pour finaliser l'importation
            </p>
          </div>
        </div>
      </div>

      {/* Contacts Preview */}
      <div className="space-y-2">
        <p className="text-sm font-medium">Aperçu des contacts à importer:</p>
        <ScrollArea className="h-48 w-full rounded-lg border bg-muted/50 p-3">
          <div className="space-y-2">
            {contacts.map((contact, index) => (
              <div
                key={index}
                className="p-2 rounded bg-white border border-border text-xs"
              >
                <div className="flex items-center gap-2">
                  <TickCircle size={14} className="text-green-600 shrink-0" variant="Bulk" />
                  <span className="font-mono font-medium">{contact.phoneNumber}</span>
                  {contact.firstname && (
                    <span className="text-muted-foreground">
                      ({contact.firstname} {contact.lastname || ""})
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </div>

      {/* Info */}
      <div className="p-3 rounded-lg bg-blue-50 border border-blue-200">
        <p className="text-xs text-blue-900">
          <span className="font-medium">Note:</span> Les contacts dupliqués seront ignorés lors de l'importation
        </p>
      </div>

      {/* Action Button */}
      <Button
        onClick={onImportConfirm}
        disabled={isProcessing}
        className="w-full bg-green-600 hover:bg-green-700"
      >
        <Sms size={16} variant="Bulk" className="mr-2" />
        {isProcessing ? "Importation en cours..." : "Importer les contacts"}
      </Button>
    </div>
  )
}
