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
import { useT } from "@/core/hooks"

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
  const { t } = useT()
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [code, setCode] = useState("")
  const [percentage, setPercentage] = useState("")
  const [validFrom, setValidFrom] = useState<Date | undefined>(undefined)
  const [validTo, setValidTo] = useState<Date | undefined>(undefined)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (!name.trim()) newErrors.name = t('couponForm.nameRequired')
    if (!code.trim()) newErrors.code = t('couponForm.codeRequired')
    if (!percentage || Number(percentage) < 0 || Number(percentage) > 100) {
      newErrors.percentage = t('couponForm.percentageInvalid')
    }
    if (!validFrom) newErrors.validFrom = t('couponForm.validFromRequired')
    if (!validTo) newErrors.validTo = t('couponForm.validToRequired')
    if (validFrom && validTo && validTo <= validFrom) {
      newErrors.validTo = t('couponForm.validToAfterFrom')
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
          <DialogTitle>{t('couponForm.createTitle')}</DialogTitle>
          <DialogDescription>
            {t('couponForm.createDescription')}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="coupon-name">{t('couponForm.nameLabel')}</Label>
            <Input
              id="coupon-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={t('couponForm.namePlaceholder')}
              disabled={isLoading}
            />
            {errors.name && <p className="text-xs text-red-500">{errors.name}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="coupon-description">{t('common.description')}</Label>
            <Textarea
              id="coupon-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder={t('couponForm.descriptionPlaceholder')}
              disabled={isLoading}
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="coupon-code">{t('couponForm.codeLabel')}</Label>
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
              <Label htmlFor="coupon-percentage">{t('couponForm.percentageLabel')}</Label>
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
              <Label>{t('couponForm.validFromLabel')}</Label>
              <DatePicker
                value={validFrom}
                onChange={setValidFrom}
                placeholder={t('couponForm.startDatePlaceholder')}
                disabled={isLoading}
              />
              {errors.validFrom && <p className="text-xs text-red-500">{errors.validFrom}</p>}
            </div>

            <div className="space-y-2">
              <Label>{t('couponForm.validToLabel')}</Label>
              <DatePicker
                value={validTo}
                onChange={setValidTo}
                placeholder={t('couponForm.endDatePlaceholder')}
                disabled={isLoading}
              />
              {errors.validTo && <p className="text-xs text-red-500">{errors.validTo}</p>}
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleCancel} disabled={isLoading}>
            {t('common.cancel')}
          </Button>
          <Button onClick={handleSave} disabled={isLoading || !name.trim() || !code.trim()}>
            {isLoading ? t('couponForm.creating') : t('couponForm.create')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
