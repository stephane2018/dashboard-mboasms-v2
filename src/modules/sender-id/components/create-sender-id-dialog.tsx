"use client"

import { useState } from "react"
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
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")

  const handleSave = async () => {
    await onSave({ name, description, enterpriseId })
    // Reset form after successful save
    setName("")
    setDescription("")
    onOpenChange(false)
  }

  const handleCancel = () => {
    // Reset form on cancel
    setName("")
    setDescription("")
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Créer un nouveau Sender ID</DialogTitle>
          <DialogDescription>
            Créez un nouveau Sender ID pour votre entreprise.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nom</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Entrez le nom"
              disabled={isLoading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Entrez la description"
              disabled={isLoading}
              rows={4}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleCancel} disabled={isLoading}>
            Annuler
          </Button>
          <Button onClick={handleSave} disabled={isLoading || !name.trim()}>
            {isLoading ? "Création..." : "Créer"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
