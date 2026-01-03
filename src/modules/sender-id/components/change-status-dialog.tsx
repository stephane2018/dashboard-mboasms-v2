"use client"

import { useState, useEffect } from "react"
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

const statusLabels: Record<SenderIdStatus, string> = {
  EN_ATTENTE: "En attente",
  VALIDE: "Validé",
  REJETE: "Rejeté",
}

export function ChangeStatusDialog({
  open,
  onOpenChange,
  senderId,
  onSave,
  isLoading = false,
}: ChangeStatusDialogProps) {
  const [status, setStatus] = useState<SenderIdStatus>(senderId.status)
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
          <DialogTitle>Changer le statut</DialogTitle>
          <DialogDescription>
            Modifiez le statut du Sender ID "{senderId.name}".
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="status">Statut</Label>
            <Select value={status} onValueChange={(value) => setStatus(value as SenderIdStatus)} disabled={isLoading}>
              <SelectTrigger id="status">
                <SelectValue placeholder="Sélectionner un statut" />
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
              <Label htmlFor="rejectionReason">Raison du rejet</Label>
              <Textarea
                id="rejectionReason"
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                placeholder="Entrez la raison du rejet"
                disabled={isLoading}
                rows={4}
              />
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isLoading}>
            Annuler
          </Button>
          <Button
            onClick={handleSave}
            disabled={isLoading || (status === "REJETE" && !rejectionReason.trim())}
          >
            {isLoading ? "Enregistrement..." : "Enregistrer"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
