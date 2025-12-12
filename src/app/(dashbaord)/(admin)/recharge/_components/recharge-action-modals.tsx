"use client"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/shared/ui/dialog"
import { Button } from "@/shared/ui/button"
import { Alert, AlertDescription } from "@/shared/ui/alert"
import { TickCircle, CloseCircle, Wallet, InfoCircle, Warning2 } from "iconsax-react"
import { Loader2 } from "lucide-react"
import type { RechargeListContentType } from "@/core/models/recharges"
import { format } from "date-fns"
import { fr } from "date-fns/locale"

interface ValidateRechargeModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  recharge: RechargeListContentType | null
  isLoading?: boolean
}

export function ValidateRechargeModal({
  isOpen,
  onClose,
  onConfirm,
  recharge,
  isLoading = false,
}: ValidateRechargeModalProps) {
  if (!recharge) return null

  const totalAmount = recharge.qteMessage * recharge.messagePriceUnit

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-2xl flex items-center gap-2">
            <TickCircle size={24} variant="Bulk" className="text-green-600" />
            Valider la demande de recharge
          </DialogTitle>
          <DialogDescription>
            Confirmez la validation de cette demande de recharge
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <Alert className="border-blue-300 bg-blue-50 dark:bg-blue-900/20">
            <InfoCircle size={18} color="currentColor" variant="Bulk" className="text-blue-600" />
            <AlertDescription className="text-blue-700 dark:text-blue-400 text-sm">
              La validation de cette demande permettra ensuite de créditer le compte de l'entreprise.
            </AlertDescription>
          </Alert>

          <div className="bg-muted/50 rounded-lg p-4 space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Entreprise</span>
              <span className="font-medium">{recharge.enterprise?.socialRaison}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Quantité de SMS</span>
              <span className="font-mono font-semibold">{recharge.qteMessage.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Prix unitaire</span>
              <span className="font-mono">{recharge.messagePriceUnit} FCFA</span>
            </div>
            <div className="flex justify-between text-sm pt-2 border-t">
              <span className="font-semibold">Montant total</span>
              <span className="font-bold text-lg text-primary">{totalAmount.toLocaleString()} FCFA</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Méthode de paiement</span>
              <span className="font-medium">{recharge.paymentMethod}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Date de demande</span>
              <span className="font-medium">
                {format(new Date(recharge.createdAt), "dd MMMM yyyy 'à' HH:mm", { locale: fr })}
              </span>
            </div>
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={onClose} disabled={isLoading}>
            Annuler
          </Button>
          <Button onClick={onConfirm} disabled={isLoading} className="bg-green-600 hover:bg-green-700">
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                Validation...
              </>
            ) : (
              <>
                <TickCircle size={18} variant="Bulk" className="mr-2" />
                Valider la demande
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

interface RefuseRechargeModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  recharge: RechargeListContentType | null
  isLoading?: boolean
}

export function RefuseRechargeModal({
  isOpen,
  onClose,
  onConfirm,
  recharge,
  isLoading = false,
}: RefuseRechargeModalProps) {
  if (!recharge) return null

  const totalAmount = recharge.qteMessage * recharge.messagePriceUnit

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-2xl flex items-center gap-2">
            <CloseCircle size={24} variant="Bulk" className="text-red-600" />
            Refuser la demande de recharge
          </DialogTitle>
          <DialogDescription>
            Confirmez le refus de cette demande de recharge
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <Alert className="border-red-300 bg-red-50 dark:bg-red-900/20">
            <Warning2 size={18} color="currentColor" variant="Bulk" className="text-red-600" />
            <AlertDescription className="text-red-700 dark:text-red-400 text-sm">
              Le refus de cette demande est définitif. L'entreprise devra créer une nouvelle demande.
            </AlertDescription>
          </Alert>

          <div className="bg-muted/50 rounded-lg p-4 space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Entreprise</span>
              <span className="font-medium">{recharge.enterprise?.socialRaison}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Quantité de SMS</span>
              <span className="font-mono font-semibold">{recharge.qteMessage.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-sm pt-2 border-t">
              <span className="font-semibold">Montant total</span>
              <span className="font-bold text-lg">{totalAmount.toLocaleString()} FCFA</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Date de demande</span>
              <span className="font-medium">
                {format(new Date(recharge.createdAt), "dd MMMM yyyy 'à' HH:mm", { locale: fr })}
              </span>
            </div>
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={onClose} disabled={isLoading}>
            Annuler
          </Button>
          <Button
            onClick={onConfirm}
            disabled={isLoading}
            variant="destructive"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                Refus...
              </>
            ) : (
              <>
                <CloseCircle size={18} variant="Bulk" className="mr-2" />
                Refuser la demande
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

interface CreditAccountModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  recharge: RechargeListContentType | null
  isLoading?: boolean
}

export function CreditAccountModal({
  isOpen,
  onClose,
  onConfirm,
  recharge,
  isLoading = false,
}: CreditAccountModalProps) {
  if (!recharge) return null

  const currentCredit = recharge.enterprise?.smsCredit || 0
  const newCredit = currentCredit + recharge.qteMessage

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-2xl flex items-center gap-2">
            <Wallet size={24} variant="Bulk" className="text-blue-600" />
            Créditer le compte
          </DialogTitle>
          <DialogDescription>
            Confirmez le crédit du compte de l'entreprise
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <Alert className="border-blue-300 bg-blue-50 dark:bg-blue-900/20">
            <InfoCircle size={18} color="currentColor" variant="Bulk" className="text-blue-600" />
            <AlertDescription className="text-blue-700 dark:text-blue-400 text-sm">
              Cette action ajoutera les SMS au solde actuel de l'entreprise.
            </AlertDescription>
          </Alert>

          <div className="bg-muted/50 rounded-lg p-4 space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Entreprise</span>
              <span className="font-medium">{recharge.enterprise?.socialRaison}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Solde actuel</span>
              <span className="font-mono font-semibold">{currentCredit.toLocaleString()} SMS</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">SMS à ajouter</span>
              <span className="font-mono font-semibold text-green-600">
                +{recharge.qteMessage.toLocaleString()} SMS
              </span>
            </div>
            <div className="flex justify-between text-sm pt-2 border-t">
              <span className="font-semibold">Nouveau solde</span>
              <span className="font-bold text-lg text-primary">{newCredit.toLocaleString()} SMS</span>
            </div>
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={onClose} disabled={isLoading}>
            Annuler
          </Button>
          <Button onClick={onConfirm} disabled={isLoading} className="bg-blue-600 hover:bg-blue-700">
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                Crédit en cours...
              </>
            ) : (
              <>
                <Wallet size={18} variant="Bulk" className="mr-2" />
                Créditer le compte
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
