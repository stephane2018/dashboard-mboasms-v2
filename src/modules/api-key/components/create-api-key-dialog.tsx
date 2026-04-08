"use client"

import { useState } from "react"
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
import type { CreateApiKeyInput } from "../types"

interface CreateApiKeyDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSave: (input: CreateApiKeyInput) => Promise<void>
  isLoading?: boolean
}

export function CreateApiKeyDialog({
  open,
  onOpenChange,
  onSave,
  isLoading = false,
}: CreateApiKeyDialogProps) {
  const { t } = useT()
  const [name, setName] = useState("")
  const [errors, setErrors] = useState<Record<string, string>>({})

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {}
    if (!name.trim()) newErrors.name = t('apiKeys.nameRequired')
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const resetForm = () => {
    setName("")
    setErrors({})
  }

  const handleSave = async () => {
    if (!validate()) return
    await onSave({ name: name.trim() })
    resetForm()
  }

  const handleCancel = () => {
    resetForm()
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[450px]">
        <DialogHeader>
          <DialogTitle>{t('apiKeys.createTitle')}</DialogTitle>
          <DialogDescription>
            {t('apiKeys.createDesc')}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="api-key-name">{t('apiKeys.nameLabel')}</Label>
            <Input
              id="api-key-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={t('apiKeys.namePlaceholder')}
              disabled={isLoading}
            />
            {errors.name && <p className="text-xs text-red-500">{errors.name}</p>}
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleCancel} disabled={isLoading}>
            {t('common.cancel')}
          </Button>
          <Button onClick={handleSave} disabled={isLoading || !name.trim()}>
            {isLoading ? t('apiKeys.creating') : t('apiKeys.generateKey')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
