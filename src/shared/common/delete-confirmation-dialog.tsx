import { useState, useEffect } from "react"
import { Trash } from "iconsax-reactjs"
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
  title = "Confirmer la suppression",
  description,
  itemName,
  isDeleting = false,
  requireConfirmation = true,
}: DeleteConfirmationDialogProps) {
  const [confirmationText, setConfirmationText] = useState("")

  // Reset confirmation text when dialog opens/closes
  useEffect(() => {
    if (!open) {
      setConfirmationText("")
    }
  }, [open])

  const defaultDescription = itemName
    ? `Êtes-vous sûr de vouloir supprimer "${itemName}" ? Cette action est irréversible.`
    : "Êtes-vous sûr de vouloir supprimer cet élément ? Cette action est irréversible."

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
              <AlertDialogTitle>{title}</AlertDialogTitle>
            </div>
          </div>
          <AlertDialogDescription className="pt-3">
            {description || defaultDescription}
          </AlertDialogDescription>
        </AlertDialogHeader>

        {requireConfirmation && itemName && (
          <div className="space-y-2">
            <Label htmlFor="confirmation-input" className="text-sm font-medium">
              Pour confirmer, tapez <span className="font-mono font-semibold text-destructive">{itemName}</span>
            </Label>
            <Input
              id="confirmation-input"
              value={confirmationText}
              onChange={(e) => setConfirmationText(e.target.value)}
              placeholder={`Tapez "${itemName}" pour confirmer`}
              disabled={isDeleting}
              className="font-mono"
              autoComplete="off"
            />
          </div>
        )}

        <AlertDialogFooter>
          <AlertDialogCancel disabled={isDeleting}>Annuler</AlertDialogCancel>
          <Button
            variant="destructive"
            onClick={handleConfirm}
            disabled={isDeleting || !isConfirmed}
          >
            {isDeleting ? "Suppression..." : "Supprimer"}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
