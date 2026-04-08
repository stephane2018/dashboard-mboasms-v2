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
import { useT } from "@/core/hooks"

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
  const { t } = useT()

  if (!recharge) return null

  const totalAmount = recharge.qteMessage * recharge.messagePriceUnit

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-2xl flex items-center gap-2">
            <TickCircle size={24} variant="Bulk" color="currentColor" className="text-green-600" />
            {t('recharge.validateRequest')}
          </DialogTitle>
          <DialogDescription>
            {t('recharge.validateRequestDesc')}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <Alert className="border-blue-300 bg-blue-50 dark:bg-blue-900/20">
            <InfoCircle size={18} color="currentColor" variant="Bulk" className="text-blue-600" />
            <AlertDescription className="text-blue-700 dark:text-blue-400 text-sm">
              {t('recharge.validateInfo')}
            </AlertDescription>
          </Alert>

          <div className="bg-muted/50 rounded-lg p-4 space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">{t('recharge.enterprise')}</span>
              <span className="font-medium">{recharge.enterprise?.socialRaison}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">{t('recharge.smsQuantityCol')}</span>
              <span className="font-mono font-semibold">{recharge.qteMessage.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">{t('recharge.unitPrice')}</span>
              <span className="font-mono">{recharge.messagePriceUnit} FCFA</span>
            </div>
            <div className="flex justify-between text-sm pt-2 border-t">
              <span className="font-semibold">{t('recharge.totalAmount')}</span>
              <span className="font-bold text-lg text-primary">{totalAmount.toLocaleString()} FCFA</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">{t('recharge.paymentMethod')}</span>
              <span className="font-medium">{recharge.paymentMethod}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">{t('recharge.requestDate')}</span>
              <span className="font-medium">
                {format(new Date(recharge.createdAt), "dd MMMM yyyy 'à' HH:mm", { locale: fr })}
              </span>
            </div>
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={onClose} disabled={isLoading}>
            {t('common.cancel')}
          </Button>
          <Button onClick={onConfirm} disabled={isLoading} className="bg-green-600 hover:bg-green-700">
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin mr-2" color="currentColor" />
                {t('recharge.validating')}
              </>
            ) : (
              <>
                <TickCircle size={18} color="currentColor" className="mr-2" />
                {t('recharge.validateBtn')}
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
  const { t } = useT()

  if (!recharge) return null

  const totalAmount = recharge.qteMessage * recharge.messagePriceUnit

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-2xl flex items-center gap-2">
            <CloseCircle size={24} variant="Bulk" className="text-red-600" />
            {t('recharge.refuseRequest')}
          </DialogTitle>
          <DialogDescription>
            {t('recharge.refuseRequestDesc')}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <Alert className="border-red-300 bg-red-50 dark:bg-red-900/20">
            <Warning2 size={18} color="currentColor" variant="Bulk" className="text-red-600" />
            <AlertDescription className="text-red-700 dark:text-red-400 text-sm">
              {t('recharge.refuseWarning')}
            </AlertDescription>
          </Alert>

          <div className="bg-muted/50 rounded-lg p-4 space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">{t('recharge.enterprise')}</span>
              <span className="font-medium">{recharge.enterprise?.socialRaison}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">{t('recharge.smsQuantityCol')}</span>
              <span className="font-mono font-semibold">{recharge.qteMessage.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-sm pt-2 border-t">
              <span className="font-semibold">{t('recharge.totalAmount')}</span>
              <span className="font-bold text-lg">{totalAmount.toLocaleString()} FCFA</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">{t('recharge.requestDate')}</span>
              <span className="font-medium">
                {format(new Date(recharge.createdAt), "dd MMMM yyyy 'à' HH:mm", { locale: fr })}
              </span>
            </div>
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={onClose} disabled={isLoading}>
            {t('common.cancel')}
          </Button>
          <Button
            onClick={onConfirm}
            disabled={isLoading}
            variant="destructive"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                {t('recharge.refusing')}
              </>
            ) : (
              <>
                <CloseCircle size={18} variant="Bulk" className="mr-2" />
                {t('recharge.refuseBtn')}
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
  const { t } = useT()

  if (!recharge) return null

  const currentCredit = recharge.enterprise?.smsCredit || 0
  const newCredit = currentCredit + recharge.qteMessage

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-2xl flex items-center gap-2">
            <Wallet size={24} variant="Bulk" className="text-blue-600" />
            {t('recharge.creditAccount')}
          </DialogTitle>
          <DialogDescription>
            {t('recharge.creditAccountDesc')}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <Alert className="border-blue-300 bg-blue-50 dark:bg-blue-900/20">
            <InfoCircle size={18} color="currentColor" variant="Bulk" className="text-blue-600" />
            <AlertDescription className="text-blue-700 dark:text-blue-400 text-sm">
              {t('recharge.creditInfo')}
            </AlertDescription>
          </Alert>

          <div className="bg-muted/50 rounded-lg p-4 space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">{t('recharge.enterprise')}</span>
              <span className="font-medium">{recharge.enterprise?.socialRaison}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">{t('recharge.currentBalance')}</span>
              <span className="font-mono font-semibold">{currentCredit.toLocaleString()} SMS</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">{t('recharge.smsToAdd')}</span>
              <span className="font-mono font-semibold text-green-600">
                +{recharge.qteMessage.toLocaleString()} SMS
              </span>
            </div>
            <div className="flex justify-between text-sm pt-2 border-t">
              <span className="font-semibold">{t('recharge.newBalance')}</span>
              <span className="font-bold text-lg text-primary">{newCredit.toLocaleString()} SMS</span>
            </div>
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={onClose} disabled={isLoading}>
            {t('common.cancel')}
          </Button>
          <Button onClick={onConfirm} disabled={isLoading} className="bg-blue-600 hover:bg-blue-700">
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                {t('recharge.crediting')}
              </>
            ) : (
              <>
                <Wallet size={18} variant="Bulk" className="mr-2" />
                {t('recharge.creditBtn')}
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
