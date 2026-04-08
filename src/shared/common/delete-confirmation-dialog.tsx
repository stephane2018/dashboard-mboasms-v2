import { useState, useEffect } from "react"
import { useT } from "@/core/hooks"
import { Trash } from "iconsax-react"
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/shared/ui/alert-dialog"
import { Button } from "@/shared/ui/button"
import { Input } from "@/shared/ui/input"
import { Label } from "@/shared/ui/label"

interface DeleteConfirmationDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onConfirm: () => void
  title?: string
  description?: string
  itemName?: string
  isDeleting?: boolean
  requireConfirmation?: boolean
}

export function DeleteConfirmationDialog({
  open,
  onOpenChange,
  onConfirm,
  title,
  description,
  itemName,
  isDeleting = false,
  requireConfirmation = true,
}: DeleteConfirmationDialogProps) {
  const { t } = useT()
  const [confirmationText, setConfirmationText] = useState("")
  const resolvedTitle = title || t('common.confirmDeletion')

  // Reset confirmation text when dialog opens/closes
  useEffect(() => {
    if (!open) {
      setConfirmationText("")
    }
  }, [open])

  const defaultDescription = itemName
    ? t('common.deleteItemConfirm', { name: itemName })
    : t('common.deleteGenericConfirm')

  const isConfirmed = !requireConfirmation || (itemName && confirmationText === itemName)

  const handleConfirm = () => {
    if (isConfirmed) {
      onConfirm()
    }
  }

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-destructive/10">
              <Trash size={24} variant="Bulk" color="currentColor" className="text-destructive" />
            </div>
            <div>
              <AlertDialogTitle>{resolvedTitle}</AlertDialogTitle>
            </div>
          </div>
          <AlertDialogDescription className="pt-3">
            {description || defaultDescription}
          </AlertDialogDescription>
        </AlertDialogHeader>

        {requireConfirmation && itemName && (
          <div className="space-y-2">
            <Label htmlFor="confirmation-input" className="text-sm font-medium">
              {t('common.typeToConfirm')} <span className="font-mono font-semibold text-destructive">{itemName}</span>
            </Label>
            <Input
              id="confirmation-input"
              value={confirmationText}
              onChange={(e) => setConfirmationText(e.target.value)}
              placeholder={t('common.typeNameToConfirm', { name: itemName })}
              disabled={isDeleting}
              className="font-mono"
              autoComplete="off"
            />
          </div>
        )}

        <AlertDialogFooter>
          <AlertDialogCancel disabled={isDeleting}>{t('common.cancel')}</AlertDialogCancel>
          <Button
            variant="destructive"
            onClick={handleConfirm}
            disabled={isDeleting || !isConfirmed}
          >
            {isDeleting ? t('common.deleting') : t('common.delete')}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
