"use client"

import { useState, useEffect } from "react"
import { useT } from "@/core/hooks"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/shared/ui/dialog"
import { Button } from "@/shared/ui/button"
import { Input } from "@/shared/ui/input"
import { Label } from "@/shared/ui/label"
import { Textarea } from "@/shared/ui/textarea"
import type { SenderId, UpdateSenderIdInput } from "../types"

interface EditSenderIdDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  senderId: SenderId
  onSave: (id: string, input: UpdateSenderIdInput) => Promise<void>
  isLoading?: boolean
}

export function EditSenderIdDialog({
  open,
  onOpenChange,
  senderId,
  onSave,
  isLoading = false,
}: EditSenderIdDialogProps) {
  const { t } = useT()
  const [name, setName] = useState(senderId.name || "")
  const [description, setDescription] = useState(senderId.description || "")

  useEffect(() => {
    if (open) {
      setName(senderId.name || "")
      setDescription(senderId.description || "")
    }
  }, [open, senderId])

  const handleSave = async () => {
    const input: UpdateSenderIdInput = {
      name: name.trim() ? name : undefined,
      description: description.trim() ? description : undefined,
    }
    
    if (input.name === undefined && input.description === undefined) {
      return
    }
    
    await onSave(senderId.id, input)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t('senderIds.editTitle')}</DialogTitle>
          <DialogDescription>
            {t('senderIds.editDesc')}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">{t('common.name')}</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={t('senderIds.enterName')}
              disabled={isLoading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">{t('common.description')}</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder={t('senderIds.enterDescription')}
              disabled={isLoading}
              rows={4}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isLoading}>
            {t('common.cancel')}
          </Button>
          <Button onClick={handleSave} disabled={isLoading || (!name.trim() && !description.trim())}>
            {isLoading ? t('common.saving') : t('common.save')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
