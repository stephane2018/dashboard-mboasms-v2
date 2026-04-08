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
import { Label } from "@/shared/ui/label"
import { Textarea } from "@/shared/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/ui/select"
import type { SenderId, SenderIdStatus, UpdateSenderIdStatusInput } from "../types"

interface ChangeStatusDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  senderId: SenderId
  onSave: (id: string, input: UpdateSenderIdStatusInput) => Promise<void>
  isLoading?: boolean
}

export function ChangeStatusDialog({
  open,
  onOpenChange,
  senderId,
  onSave,
  isLoading = false,
}: ChangeStatusDialogProps) {
  const { t } = useT()
  const [status, setStatus] = useState<SenderIdStatus>(senderId.status)

  const statusLabels: Record<SenderIdStatus, string> = {
    EN_ATTENTE: t('senderIds.statusPending'),
    VALIDE: t('senderIds.statusValidated'),
    REJETE: t('senderIds.statusRejected'),
  }
  const [rejectionReason, setRejectionReason] = useState(senderId.rejectionReason || "")

  useEffect(() => {
    if (open) {
      setStatus(senderId.status)
      setRejectionReason(senderId.rejectionReason || "")
    }
  }, [open, senderId])

  const handleSave = async () => {
    const input: UpdateSenderIdStatusInput = {
      status,
    }

    if (status === "REJETE" && rejectionReason.trim()) {
      input.rejectionReason = rejectionReason.trim()
    }

    await onSave(senderId.id, input)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t('senderIds.changeStatusTitle')}</DialogTitle>
          <DialogDescription>
            {t('senderIds.changeStatusDesc', { name: senderId.name })}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="status">{t('common.status')}</Label>
            <Select value={status} onValueChange={(value) => setStatus(value as SenderIdStatus)} disabled={isLoading}>
              <SelectTrigger id="status">
                <SelectValue placeholder={t('senderIds.selectStatus')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="EN_ATTENTE">{statusLabels.EN_ATTENTE}</SelectItem>
                <SelectItem value="VALIDE">{statusLabels.VALIDE}</SelectItem>
                <SelectItem value="REJETE">{statusLabels.REJETE}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {status === "REJETE" && (
            <div className="space-y-2">
              <Label htmlFor="rejectionReason">{t('senderIds.rejectionReason')}</Label>
              <Textarea
                id="rejectionReason"
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                placeholder={t('senderIds.enterRejectionReason')}
                disabled={isLoading}
                rows={4}
              />
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isLoading}>
            {t('common.cancel')}
          </Button>
          <Button
            onClick={handleSave}
            disabled={isLoading || (status === "REJETE" && !rejectionReason.trim())}
          >
            {isLoading ? t('common.saving') : t('common.save')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
