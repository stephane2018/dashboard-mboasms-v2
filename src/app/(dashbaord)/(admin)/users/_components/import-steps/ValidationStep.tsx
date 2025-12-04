"use client"

import { Button } from "@/shared/ui/button"
import { ScrollArea } from "@/shared/ui/scroll-area"
import { TickCircle, CloseCircle, Warning2 } from "iconsax-react"
import type { ContactData } from "./types"

interface ValidationStepProps {
  contacts: ContactData[]
  errors: string[]
  onValidationComplete: () => void
}

export function ValidationStep({
  contacts,
  errors,
  onValidationComplete,
}: ValidationStepProps) {
  const hasErrors = errors.length > 0
  const totalRows = contacts.length + errors.length

  return (
    <div className="space-y-4">
      {/* Summary */}
      <div className="grid grid-cols-3 gap-3">
        <div className="p-3 rounded-lg bg-blue-50 border border-blue-200">
          <p className="text-xs text-blue-600 font-medium">Total</p>
          <p className="text-2xl font-bold text-blue-900">{totalRows}</p>
        </div>
        <div className="p-3 rounded-lg bg-green-50 border border-green-200">
          <p className="text-xs text-green-600 font-medium">Valides</p>
          <p className="text-2xl font-bold text-green-900">{contacts.length}</p>
        </div>
        <div className={`p-3 rounded-lg ${hasErrors ? "bg-red-50 border border-red-200" : "bg-gray-50 border border-gray-200"}`}>
          <p className={`text-xs font-medium ${hasErrors ? "text-red-600" : "text-gray-600"}`}>
            Erreurs
          </p>
          <p className={`text-2xl font-bold ${hasErrors ? "text-red-900" : "text-gray-900"}`}>
            {errors.length}
          </p>
        </div>
      </div>

      {/* Validation Status */}
      <div className={`p-4 rounded-lg border ${hasErrors ? "bg-red-50 border-red-200" : "bg-green-50 border-green-200"}`}>
        <div className="flex items-start gap-3">
          {hasErrors ? (
            <Warning2 size={20} className="text-red-600 shrink-0 mt-0.5" variant="Bulk" />
          ) : (
            <TickCircle size={20} className="text-green-600 shrink-0 mt-0.5" variant="Bulk" />
          )}
          <div>
            <p className={`font-medium text-sm ${hasErrors ? "text-red-900" : "text-green-900"}`}>
              {hasErrors
                ? `${errors.length} ligne(s) avec erreur(s)`
                : "Tous les contacts sont valides"}
            </p>
            {hasErrors && (
              <p className="text-xs text-red-700 mt-1">
                Les contacts avec erreurs seront ignorés lors de l'importation
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Errors List */}
      {hasErrors && (
        <div className="space-y-2">
          <p className="text-sm font-medium">Détails des erreurs:</p>
          <ScrollArea className="h-48 w-full rounded-lg border bg-muted/50 p-3">
            <div className="space-y-2">
              {errors.map((error, index) => (
                <div
                  key={index}
                  className="p-2 rounded bg-red-50 border border-red-200 text-xs text-red-700"
                >
                  <div className="flex items-start gap-2">
                    <CloseCircle size={14} className="shrink-0 mt-0.5" variant="Bulk" />
                    <span>{error}</span>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>
      )}

      {/* Valid Contacts Preview */}
      {contacts.length > 0 && (
        <div className="space-y-2">
          <p className="text-sm font-medium">Aperçu des contacts valides:</p>
          <ScrollArea className="h-40 w-full rounded-lg border bg-muted/50 p-3">
            <div className="space-y-2">
              {contacts.slice(0, 5).map((contact, index) => (
                <div
                  key={index}
                  className="p-2 rounded bg-green-50 border border-green-200 text-xs text-green-700"
                >
                  <div className="flex items-center gap-2">
                    <TickCircle size={14} className="shrink-0" variant="Bulk" />
                    <span className="font-mono">{contact.phoneNumber}</span>
                    {contact.firstname && (
                      <span className="text-green-600">
                        ({contact.firstname} {contact.lastname || ""})
                      </span>
                    )}
                  </div>
                </div>
              ))}
              {contacts.length > 5 && (
                <p className="text-xs text-muted-foreground p-2">
                  ... et {contacts.length - 5} autres
                </p>
              )}
            </div>
          </ScrollArea>
        </div>
      )}

      {/* Action Button */}
      <Button
        onClick={onValidationComplete}
        disabled={contacts.length === 0}
        className="w-full bg-blue-600 hover:bg-blue-700"
      >
        Continuer vers la révision ({contacts.length} contact{contacts.length > 1 ? "s" : ""})
      </Button>
    </div>
  )
}
