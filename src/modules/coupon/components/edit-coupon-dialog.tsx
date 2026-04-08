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
import { Input } from "@/shared/ui/input"
import { Label } from "@/shared/ui/label"
import { Textarea } from "@/shared/ui/textarea"
import { DatePicker } from "@/shared/ui/date-picker"
import type { Coupon, UpdateCouponInput } from "../types"
import { useT } from "@/core/hooks"

interface EditCouponDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  coupon: Coupon
  onSave: (id: string, input: UpdateCouponInput) => Promise<void>
  isLoading?: boolean
}

export function EditCouponDialog({
  open,
  onOpenChange,
  coupon,
  onSave,
  isLoading = false,
}: EditCouponDialogProps) {
  const { t } = useT()
  const [name, setName] = useState(coupon.name)
  const [description, setDescription] = useState(coupon.description)
  const [code, setCode] = useState(coupon.code)
  const [percentage, setPercentage] = useState(String(coupon.percentage))
  const [validFrom, setValidFrom] = useState<Date | undefined>(new Date(coupon.validFrom))
  const [validTo, setValidTo] = useState<Date | undefined>(new Date(coupon.validTo))
  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    if (open) {
      setName(coupon.name)
      setDescription(coupon.description)
      setCode(coupon.code)
      setPercentage(String(coupon.percentage))
      setValidFrom(new Date(coupon.validFrom))
      setValidTo(new Date(coupon.validTo))
      setErrors({})
    }
  }, [open, coupon])

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

  const handleSave = async () => {
    if (!validate()) return

    await onSave(coupon.id, {
      name: name.trim(),
      description: description.trim(),
      code: code.trim().toUpperCase(),
      percentage: Number(percentage),
      validFrom: validFrom!.toISOString(),
      validTo: validTo!.toISOString(),
      userId: coupon.userId,
    })
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{t('couponForm.editTitle')}</DialogTitle>
          <DialogDescription>
            {t('couponForm.editDescription')}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="edit-coupon-name">{t('couponForm.nameLabel')}</Label>
            <Input
              id="edit-coupon-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={t('couponForm.namePlaceholder')}
              disabled={isLoading}
            />
            {errors.name && <p className="text-xs text-red-500">{errors.name}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-coupon-description">{t('common.description')}</Label>
            <Textarea
              id="edit-coupon-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder={t('couponForm.descriptionPlaceholder')}
              disabled={isLoading}
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="edit-coupon-code">{t('couponForm.codeLabel')}</Label>
              <Input
                id="edit-coupon-code"
                value={code}
                onChange={(e) => setCode(e.target.value.toUpperCase())}
                placeholder="PROMO2024"
                disabled={isLoading}
              />
              {errors.code && <p className="text-xs text-red-500">{errors.code}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-coupon-percentage">{t('couponForm.percentageLabel')}</Label>
              <Input
                id="edit-coupon-percentage"
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
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isLoading}>
            {t('common.cancel')}
          </Button>
          <Button onClick={handleSave} disabled={isLoading || !name.trim() || !code.trim()}>
            {isLoading ? t('common.saving') : t('common.save')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
