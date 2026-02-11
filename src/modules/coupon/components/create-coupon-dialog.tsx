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
import { DatePicker } from "@/shared/ui/date-picker"
import type { CreateCouponInput } from "../types"

interface CreateCouponDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSave: (input: CreateCouponInput) => Promise<void>
  isLoading?: boolean
  userId: string
}

export function CreateCouponDialog({
  open,
  onOpenChange,
  onSave,
  isLoading = false,
  userId,
}: CreateCouponDialogProps) {
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [code, setCode] = useState("")
  const [percentage, setPercentage] = useState("")
  const [validFrom, setValidFrom] = useState<Date | undefined>(undefined)
  const [validTo, setValidTo] = useState<Date | undefined>(undefined)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (!name.trim()) newErrors.name = "Le nom est requis"
    if (!code.trim()) newErrors.code = "Le code est requis"
    if (!percentage || Number(percentage) < 0 || Number(percentage) > 100) {
      newErrors.percentage = "Le pourcentage doit être entre 0 et 100"
    }
    if (!validFrom) newErrors.validFrom = "La date de début est requise"
    if (!validTo) newErrors.validTo = "La date de fin est requise"
    if (validFrom && validTo && validTo <= validFrom) {
      newErrors.validTo = "La date de fin doit être après la date de début"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const resetForm = () => {
    setName("")
    setDescription("")
    setCode("")
    setPercentage("")
    setValidFrom(undefined)
    setValidTo(undefined)
    setErrors({})
  }

  const handleSave = async () => {
    if (!validate()) return

    await onSave({
      name: name.trim(),
      description: description.trim(),
      code: code.trim().toUpperCase(),
      percentage: Number(percentage),
      validFrom: validFrom!.toISOString(),
      validTo: validTo!.toISOString(),
      userId,
    })
    resetForm()
  }

  const handleCancel = () => {
    resetForm()
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Créer un nouveau coupon</DialogTitle>
          <DialogDescription>
            Créez un code promo avec un pourcentage de réduction.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="coupon-name">Nom *</Label>
            <Input
              id="coupon-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ex: Promo Noël"
              disabled={isLoading}
            />
            {errors.name && <p className="text-xs text-red-500">{errors.name}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="coupon-description">Description</Label>
            <Textarea
              id="coupon-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Description du coupon"
              disabled={isLoading}
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="coupon-code">Code *</Label>
              <Input
                id="coupon-code"
                value={code}
                onChange={(e) => setCode(e.target.value.toUpperCase())}
                placeholder="PROMO2024"
                disabled={isLoading}
              />
              {errors.code && <p className="text-xs text-red-500">{errors.code}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="coupon-percentage">Pourcentage (%) *</Label>
              <Input
                id="coupon-percentage"
                type="number"
                min={0}
                max={100}
                value={percentage}
                onChange={(e) => setPercentage(e.target.value)}
                placeholder="10"
                disabled={isLoading}
              />
              {errors.percentage && <p className="text-xs text-red-500">{errors.percentage}</p>}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Valide du *</Label>
              <DatePicker
                value={validFrom}
                onChange={setValidFrom}
                placeholder="Date de début"
                disabled={isLoading}
              />
              {errors.validFrom && <p className="text-xs text-red-500">{errors.validFrom}</p>}
            </div>

            <div className="space-y-2">
              <Label>Valide au *</Label>
              <DatePicker
                value={validTo}
                onChange={setValidTo}
                placeholder="Date de fin"
                disabled={isLoading}
              />
              {errors.validTo && <p className="text-xs text-red-500">{errors.validTo}</p>}
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleCancel} disabled={isLoading}>
            Annuler
          </Button>
          <Button onClick={handleSave} disabled={isLoading || !name.trim() || !code.trim()}>
            {isLoading ? "Création..." : "Créer"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
