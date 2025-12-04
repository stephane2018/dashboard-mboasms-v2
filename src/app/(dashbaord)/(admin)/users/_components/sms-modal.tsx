"use client"

import { useState, useMemo } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/shared/ui/dialog"
import { Button } from "@/shared/ui/button"
import { Input } from "@/shared/ui/input"
import { Textarea } from "@/shared/ui/textarea"
import { Badge } from "@/shared/ui/badge"
import { ScrollArea } from "@/shared/ui/scroll-area"
import { Maximize2, CloseCircle, Sms, Lock, TickCircle, MessageText } from "iconsax-react"
import type { EnterpriseContactResponseType } from "@/core/models/contact-new"

interface SMSModalProps {
  isOpen: boolean
  onClose: () => void
  selectedContacts: EnterpriseContactResponseType[]
  onSend: (message: string, password: string) => void
  isLoading?: boolean
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
  const [showPassword, setShowPassword] = useState(false)

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
    if (!message.trim() || !password.trim()) {
      return
    }
    onSend(message, password)
    setMessage("")
    setPassword("")
  }

  // Get initials for contact avatar
  const getInitials = (contact: EnterpriseContactResponseType) => {
    return `${contact.firstname?.[0] || ""}${contact.lastname?.[0] || ""}`.toUpperCase()
  }

  // Get avatar color based on initials
  const getAvatarColor = (initials: string) => {
    const colors = [
      "bg-red-500",
      "bg-blue-500",
      "bg-green-500",
      "bg-yellow-500",
      "bg-purple-500",
      "bg-pink-500",
      "bg-indigo-500",
      "bg-cyan-500",
    ]
    const charCode = initials.charCodeAt(0) || 0
    return colors[charCode % colors.length]
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        className={`${
          isMaximized
            ? "w-screen h-screen max-w-none rounded-none"
            : "sm:max-w-2xl"
        } transition-all duration-300 flex flex-col`}
      >
        {/* Header */}
        <DialogHeader className="flex flex-row items-center justify-between space-y-0 pb-4 border-b">
          <div>
            <DialogTitle>Nouveau Message à {selectedContacts.length} contact{selectedContacts.length > 1 ? "s" : ""}</DialogTitle>
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
          {/* Selected Contacts */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Destinataires ({selectedContacts.length})</label>
            <ScrollArea className="h-24 w-full rounded-lg border bg-muted/50 p-3">
              <div className="flex flex-wrap gap-2">
                {selectedContacts.map((contact) => {
                  const initials = getInitials(contact)
                  const avatarColor = getAvatarColor(initials)
                  return (
                    <Badge
                      key={contact.id}
                      variant="secondary"
                      className="flex items-center gap-2 px-2 py-1"
                    >
                      <div
                        className={`${avatarColor} text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold`}
                      >
                        {initials}
                      </div>
                      <span className="text-xs">
                        {contact.firstname} {contact.lastname}
                      </span>
                    </Badge>
                  )
                })}
              </div>
            </ScrollArea>
          </div>

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
            disabled={isLoading || !message.trim() || !password.trim()}
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
