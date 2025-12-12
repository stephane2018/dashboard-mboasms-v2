"use client"

import { useState, useMemo, useEffect } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/shared/ui/dialog"
import { Button } from "@/shared/ui/button"
import { Textarea } from "@/shared/ui/textarea"
import { Maximize2, CloseCircle, Sms } from "iconsax-react"
import type { EnterpriseContactResponseType } from "@/core/models/contact-new"
import { PhoneNumberInput, type PhoneEntry } from "@/shared/common/phone-number-input"
import { checkPhoneValidation, getPhoneValidationStatus } from "@/core/utils/phone-validation"

interface SMSModalProps {
  isOpen: boolean
  onClose: () => void
  selectedContacts: EnterpriseContactResponseType[]
  onSend: (message: string, password: string, phoneNumbers: string[]) => void
  isLoading?: boolean
}

// Convert contact to PhoneEntry
const contactToPhoneEntry = (contact: EnterpriseContactResponseType): PhoneEntry => {
  const phoneNumber = contact.phoneNumber || ""
  const operator = checkPhoneValidation(phoneNumber)
  const status = getPhoneValidationStatus(phoneNumber)

  return {
    id: `contact_${contact.id}`,
    phoneNumber,
    name: `${contact.firstname || ""} ${contact.lastname || ""}`.trim(),
    isValid: status === "CORRECT",
    operator
  }
}

export function SMSModal({
  isOpen,
  onClose,
  selectedContacts,
  onSend,
  isLoading = false,
}: SMSModalProps) {
  const [message, setMessage] = useState("")
  const [password, setPassword] = useState("")
  const [isMaximized, setIsMaximized] = useState(false)
  const [phoneEntries, setPhoneEntries] = useState<PhoneEntry[]>([])

  // Initialize phone entries from selected contacts when modal opens
  useEffect(() => {
    if (isOpen && selectedContacts.length > 0) {
      const entries = selectedContacts.map(contactToPhoneEntry)
      setPhoneEntries(entries)
    }
  }, [isOpen, selectedContacts])

  // Reset state when modal closes
  useEffect(() => {
    if (!isOpen) {
      setMessage("")
      setPassword("")
      setPhoneEntries([])
    }
  }, [isOpen])

  // Count special characters
  const specialCharCount = useMemo(() => {
    const specialChars = message.match(/[^a-zA-Z0-9\s]/g) || []
    return specialChars.length
  }, [message])

  // Calculate character count (special chars count as 2)
  const totalCharCount = useMemo(() => {
    const regularChars = message.length - specialCharCount
    return regularChars + specialCharCount * 2
  }, [message, specialCharCount])

  const handleSend = () => {
    if (!message.trim()) {
      return
    }

    // Get valid phone numbers
    const validPhoneNumbers = phoneEntries
      .filter(e => e.isValid)
      .map(e => e.phoneNumber)

    if (validPhoneNumbers.length === 0) {
      return
    }

    onSend(message, password, validPhoneNumbers)
    setMessage("")
    setPassword("")
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        className={`${isMaximized
          ? "w-screen h-screen max-w-none rounded-none"
          : "sm:max-w-2xl"
          } transition-all duration-300 flex flex-col`}
      >
        {/* Header */}
        <DialogHeader className="flex flex-row items-center justify-between space-y-0 pb-4 border-b">
          <div>
            <DialogTitle>Nouveau Message</DialogTitle>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMaximized(!isMaximized)}
              className="h-8 w-8 p-0"
            >
              {isMaximized ? (
                <Maximize2 size={16} variant="Bulk" color="currentColor" />
              ) : (
                <Maximize2 size={16} variant="Bulk" color="currentColor" />
              )}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="h-8 w-8 p-0"
            >
              <CloseCircle size={16} variant="Bulk" color="currentColor" />
            </Button>
          </div>
        </DialogHeader>

        {/* Content */}
        <div className={`flex-1 overflow-hidden flex flex-col ${isMaximized ? "gap-4 p-6" : "gap-4"}`}>
          {/* Phone Number Input Component */}
          <PhoneNumberInput
            entries={phoneEntries}
            onEntriesChange={setPhoneEntries}
            maxHeight={isMaximized ? "h-40" : "h-28"}
          />


          {/* Password Field */}

          {/* Message Field */}
          <div className="space-y-2 flex-1 flex flex-col">
            <label className="text-sm font-medium">Message</label>
            <Textarea
              placeholder="Entrer le message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              disabled={isLoading}
              className={`flex-1 resize-none ${isMaximized ? "min-h-96" : "min-h-32"}`}
            />
          </div>

          {/* Character Counter */}
          <div className="flex items-center justify-between text-xs text-muted-foreground bg-muted/50 rounded-lg p-3">
            <div className="flex items-center gap-2">
              <span>Nombre de caractères: {totalCharCount}</span>
              {specialCharCount > 0 && (
                <span className="text-amber-600">
                  (Caractères spéciaux: {specialCharCount})
                </span>
              )}
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="specialChars"
                checked={specialCharCount > 0}
                readOnly
                className="w-4 h-4 rounded"
              />
              <label htmlFor="specialChars" className="text-xs">
                Caractères spéciaux détectés
              </label>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex gap-2 pt-4 border-t">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={isLoading}
            className="flex-1"
          >
            Annuler
          </Button>
          <Button
            onClick={handleSend}
            disabled={isLoading || !message.trim() || phoneEntries.filter(e => e.isValid).length === 0}
            className="flex-1 bg-pink-600 hover:bg-pink-700"
          >
            <Sms size={16} variant="Bulk" color="currentColor" className="mr-2" />
            Envoyer
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
