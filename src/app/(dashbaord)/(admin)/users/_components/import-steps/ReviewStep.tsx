"use client"

import { useState } from "react"
import { Button } from "@/shared/ui/button"
import { Input } from "@/shared/ui/input"
import { ScrollArea } from "@/shared/ui/scroll-area"
import { Edit2, TickCircle, CloseCircle } from "iconsax-react"
import { isValidPhoneNumber } from "./utils"
import type { ContactData } from "./types"

interface ReviewStepProps {
  contacts: ContactData[]
  onContactsUpdate: (contacts: ContactData[]) => void
  onReviewComplete: () => void
}

export function ReviewStep({
  contacts,
  onContactsUpdate,
  onReviewComplete,
}: ReviewStepProps) {
  const [editingIndex, setEditingIndex] = useState<number | null>(null)
  const [editValue, setEditValue] = useState("")
  const [editedContacts, setEditedContacts] = useState<ContactData[]>(contacts)
  const [validationErrors, setValidationErrors] = useState<Record<number, string>>({})

  const handleEditStart = (index: number, phoneNumber: string) => {
    setEditingIndex(index)
    setEditValue(phoneNumber)
  }

  const handleEditCancel = () => {
    setEditingIndex(null)
    setEditValue("")
  }

  const handleEditSave = (index: number) => {
    const newPhone = editValue.trim()

    if (!newPhone) {
      setValidationErrors({
        ...validationErrors,
        [index]: "Le numéro ne peut pas être vide",
      })
      return
    }

    if (!isValidPhoneNumber(newPhone)) {
      setValidationErrors({
        ...validationErrors,
        [index]: "phone",
      })
      return
    }

    const updated = [...editedContacts]
    updated[index].phoneNumber = newPhone

    setEditedContacts(updated)
    setEditingIndex(null)
    setEditValue("")

    // Clear error for this field
    const newErrors = { ...validationErrors }
    delete newErrors[index]
    setValidationErrors(newErrors)
  }

  const handleReviewComplete = () => {
    onContactsUpdate(editedContacts)
    onReviewComplete()
  }

  const isValid = Object.keys(validationErrors).length === 0

  return (
    <div className="space-y-4">
      {/* Summary */}
      <div className="p-3 rounded-lg bg-blue-50 border border-blue-200">
        <p className="text-sm font-medium text-blue-900">
          {editedContacts.length} contact{editedContacts.length > 1 ? "s" : ""} à importer
        </p>
        <p className="text-xs text-blue-700 mt-1">
          Vous pouvez modifier les numéros de téléphone si nécessaire
        </p>
      </div>

      {/* Contacts List */}
      <div className="space-y-2">
        <p className="text-sm font-medium">Contacts:</p>
        <ScrollArea className="h-96 w-full rounded-lg border bg-muted/50 p-3">
          <div className="space-y-2">
            {editedContacts.map((contact, index) => {
              const error = validationErrors[index]
              const isEditing = editingIndex === index

              return (
                <div
                  key={index}
                  className={`p-3 rounded-lg border transition-colors ${
                    error
                      ? "bg-red-50 border-red-200"
                      : "bg-white border-border hover:bg-muted/50"
                  }`}
                >
                  <div className="space-y-2">
                    {/* Phone Number Row */}
                    <div className="flex items-center gap-2">
                      {isEditing ? (
                        <>
                          <Input
                            value={editValue}
                            onChange={(e) => setEditValue(e.target.value)}
                            placeholder="Numéro de téléphone"
                            className="flex-1 text-sm"
                            autoFocus
                          />
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleEditCancel()}
                            className="px-2"
                          >
                            Annuler
                          </Button>
                          <Button
                            size="sm"
                            onClick={() => handleEditSave(index)}
                            className="px-2 bg-green-600 hover:bg-green-700"
                          >
                            Valider
                          </Button>
                        </>
                      ) : (
                        <>
                          <div className="flex-1">
                            <p className="text-sm font-mono font-medium">
                              {contact.phoneNumber}
                            </p>
                            {error && (
                              <p className="text-xs text-red-600 mt-1">{error}</p>
                            )}
                          </div>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() =>
                              handleEditStart(index, contact.phoneNumber)
                            }
                            className="px-2"
                          >
                            <Edit2 size={14} variant="Bulk" />
                          </Button>
                        </>
                      )}
                    </div>

                    {/* Additional Info */}
                    {!isEditing && (contact.firstname || contact.lastname) && (
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <span>
                          {contact.firstname} {contact.lastname}
                        </span>
                      </div>
                    )}

                    {/* Validation Status */}
                    {!isEditing && (
                      <div className="flex items-center gap-1">
                        {error ? (
                          <CloseCircle size={14} className="text-red-600" variant="Bulk" />
                        ) : (
                          <TickCircle size={14} className="text-green-600" variant="Bulk" />
                        )}
                        <span className="text-xs text-muted-foreground">
                          {error ? "Invalide" : "Valide"}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </ScrollArea>
      </div>

      {/* Action Button */}
      <Button
        onClick={handleReviewComplete}
        disabled={!isValid}
        className="w-full bg-blue-600 hover:bg-blue-700"
      >
        Continuer vers la confirmation
      </Button>
    </div>
  )
}
