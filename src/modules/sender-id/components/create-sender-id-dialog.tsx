"use client"

import { useState } from "react"
import { useT } from "@/core/hooks"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/shared/ui/dialog"
import { Button } from "@/shared/ui/button"
import { Input } from "@/shared/ui/input"
import { Textarea } from "@/shared/ui/textarea"
import { UserTag, InfoCircle } from "iconsax-react"
import { Loader2 } from "lucide-react"
import type { CreateSenderIdInput } from "../types"

interface CreateSenderIdDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSave: (input: CreateSenderIdInput) => Promise<void>
  isLoading?: boolean
  enterpriseId: string
}

export function CreateSenderIdDialog({
  open,
  onOpenChange,
  onSave,
  isLoading = false,
  enterpriseId,
}: CreateSenderIdDialogProps) {
  const { t } = useT()
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")

  const nameLength = name.length
  const isNameValid = name.trim().length > 0 && nameLength <= 11
  const isAlphanumeric = /^[a-zA-Z0-9]*$/.test(name)

  const handleSave = async () => {
    await onSave({ name, description, enterpriseId })
    setName("")
    setDescription("")
    onOpenChange(false)
  }

  const handleCancel = () => {
    setName("")
    setDescription("")
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[440px] p-0 rounded-2xl overflow-hidden">
        <DialogHeader className="px-5 pt-5 pb-0">
          <DialogTitle className="text-base flex items-center gap-2">
            <div className="rounded-lg bg-primary/10 p-1.5">
              <UserTag size={16} color="currentColor" variant="Bulk" className="text-primary" />
            </div>
            {t('senderIds.newTitle')}
          </DialogTitle>
          <p className="text-xs text-muted-foreground mt-1">
            {t('senderIds.createSubtitle')}
          </p>
        </DialogHeader>

        <div className="px-5 pb-5 pt-3 space-y-4">
          {/* Name field */}
          <div className="space-y-1.5">
            <label htmlFor="sender-name" className="text-xs font-medium text-foreground">
              {t('senderIds.senderIdName')}
            </label>
            <div className="relative">
              <Input
                id="sender-name"
                value={name}
                onChange={(e) => setName(e.target.value.replace(/[^a-zA-Z0-9]/g, '').slice(0, 11))}
                placeholder="Ex: MONENTREPRISE"
                disabled={isLoading}
                className="h-10 rounded-xl pr-14"
                maxLength={11}
              />
              <span className={`absolute right-3 top-1/2 -translate-y-1/2 text-[11px] tabular-nums ${
                nameLength > 9 ? 'text-amber-500' : 'text-muted-foreground'
              }`}>
                {nameLength}/11
              </span>
            </div>
            {name && !isAlphanumeric && (
              <p className="text-[11px] text-red-500">{t('senderIds.alphanumericOnly')}</p>
            )}
          </div>

          {/* Description field */}
          <div className="space-y-1.5">
            <label htmlFor="sender-desc" className="text-xs font-medium text-foreground">
              {t('senderIds.descriptionOptional')}
            </label>
            <Textarea
              id="sender-desc"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder={t('senderIds.usagePlaceholder')}
              disabled={isLoading}
              rows={3}
              className="rounded-xl resize-none text-sm"
            />
          </div>

          {/* Info note */}
          <div className="flex items-start gap-2 p-3 rounded-xl bg-muted/40 border border-border/50">
            <InfoCircle size={14} color="currentColor" variant="Bulk" className="text-muted-foreground shrink-0 mt-0.5" />
            <p className="text-[11px] text-muted-foreground leading-relaxed">
              {t('senderIds.infoNote')}
            </p>
          </div>

          {/* Actions */}
          <div className="flex gap-2 pt-1">
            <Button
              variant="ghost"
              onClick={handleCancel}
              disabled={isLoading}
              className="flex-1 rounded-xl"
            >
              {t('common.cancel')}
            </Button>
            <Button
              onClick={handleSave}
              disabled={isLoading || !isNameValid}
              className="flex-1 rounded-xl gap-1.5"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  {t('senderIds.creating')}
                </>
              ) : (
                t('senderIds.createSenderId')
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
