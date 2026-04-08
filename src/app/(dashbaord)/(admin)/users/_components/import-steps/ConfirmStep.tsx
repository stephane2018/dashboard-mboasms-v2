"use client"

import { Button } from "@/shared/ui/button"
import { ScrollArea } from "@/shared/ui/scroll-area"
import { TickCircle, Sms } from "iconsax-react"
import { useT } from "@/core/hooks"
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
  const { t } = useT()

  return (
    <div className="space-y-4">
      {/* Summary */}
      <div className="p-4 rounded-lg bg-primary/10   border border-dashed border-primary text-white ">
        <div className="flex items-start gap-3 ">
          <TickCircle size={20} className="text-white shrink-0 mt-0.5" variant="Bulk" color="currentColor"  />
          <div>
            <p className="font-medium text-sm text-white">
              {t('users.readyToImport', { count: contacts.length })}
            </p>
            <p className="text-xs text-white mt-1">
              {t('users.clickToImport')}
            </p>
          </div>
        </div>
      </div>

      {/* Contacts Preview */}
      <div className="space-y-2">
        <p className="text-sm font-medium">{t('users.contactsPreview')}</p>
        <ScrollArea className="h-48 w-full rounded-lg border bg-muted/50 p-3">
          <div className="space-y-2">
            {contacts.map((contact, index) => (
              <div
                key={index}
                className="p-2 rounded bg-primary border border-border text-xs"
              >
                <div className="flex items-center gap-2">
                  <TickCircle size={14} className="text-green-600 shrink-0" variant="Bulk" color="currentColor" />
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
          <span className="font-medium">Note:</span> {t('users.duplicatesNote')}
        </p>
      </div>

      {/* Action Button */}
      <Button
        onClick={onImportConfirm}
        disabled={isProcessing}
        className="w-full bg-primary/10 text-primary hover:bg-primary/20"
      >
        <Sms size={16} variant="Bulk" className="mr-2"  color="currentColor"  />
        {isProcessing ? t('users.importing') : t('users.importBtn')}
      </Button>
    </div>
  )
}
