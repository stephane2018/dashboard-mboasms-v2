"use client"

import { useState } from "react"
import { Button } from "@/shared/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/shared/ui/dialog"
import { Input } from "@/shared/ui/input"
import { Label } from "@/shared/ui/label"
import { toast } from "sonner"
import { Wallet, Sms, Add, CloseCircle } from "iconsax-react"

interface CreditModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (payload: { qteMessage: number }) => void
  isSubmitting: boolean
  currentCredit: number
}

export function CreditModal({ isOpen, onClose, onSubmit, isSubmitting, currentCredit }: CreditModalProps) {
  const [creditAmount, setCreditAmount] = useState<string>("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    const amount = Number(creditAmount)
    
    if (!creditAmount || isNaN(amount) || amount <= 0) {
      toast.error("Veuillez entrer un montant valide")
      return
    }

    onSubmit({ qteMessage: amount })
  }

  const handleClose = () => {
    setCreditAmount("")
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader className="text-center pb-6">
          <div className="flex   gap-3 mb-4">
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
              <Wallet className="h-6 w-6 text-primary" variant="Bulk" color="currentColor" />
            </div>
            <div className="text-left">
              <DialogTitle className="text-xl font-semibold">
                Crédit SMS
              </DialogTitle>
              <DialogDescription className="text-sm">
                Ajoutez des crédits SMS à l'entreprise
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Carte de crédit actuel */}
          <div className="bg-linear-to-r from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 rounded-xl p-6 border border-blue-100 dark:border-blue-800/30">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/50 rounded-lg flex items-center justify-center">
                  <Sms className="h-5 w-5 text-blue-600 dark:text-blue-400" variant="Bulk" color="currentColor" />
                </div>
                <div>
                  <p className="text-sm font-medium text-blue-900 dark:text-blue-100">Crédit actuel</p>
                  <p className="text-2xl font-bold text-blue-900 dark:text-blue-100">{currentCredit}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm text-blue-600 dark:text-blue-400">SMS disponibles</p>
              </div>
            </div>
          </div>

          {/* Section d'ajout de crédit */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 pb-2">
              <Add className="h-5 w-5 text-primary" variant="Bulk" color="currentColor" />
              <label className="text-sm font-semibold text-foreground">
                Montant à ajouter
              </label>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  const current = Number(creditAmount) || 0;
                  setCreditAmount(String(Math.max(1, current - 1)));
                }}
                className="w-12 h-12 rounded-lg border-2 border-input bg-background hover:bg-accent hover:text-accent-foreground flex items-center justify-center transition-colors"
                disabled={!creditAmount || Number(creditAmount) <= 1}
              >
                <span className="text-xl font-medium">−</span>
              </button>
              <div className="relative flex-1">
                <Input
                  id="creditAmount"
                  type="text"
                  value={creditAmount}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (value === '' || /^\d+$/.test(value)) {
                      setCreditAmount(value);
                    }
                  }}
                  className="h-12 text-lg text-center pr-16 pl-4 border-2 focus:border-primary transition-colors"
                  placeholder="0"
                  required
                />
                <div className="absolute right-4 top-1/2 transform -translate-y-1/2 flex items-center gap-1 text-muted-foreground">
                  <Sms className="h-4 w-4" variant="Bulk" color="currentColor" />
                  <span className="text-sm font-medium">SMS</span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  const current = Number(creditAmount) || 0;
                  setCreditAmount(String(current + 1));
                }}
                className="w-12 h-12 rounded-lg border-2 border-input bg-background hover:bg-accent hover:text-accent-foreground flex items-center justify-center transition-colors"
              >
                <span className="text-xl font-medium">+</span>
              </button>
            </div>
          </div>

          {/* Carte de nouveau total */}
          {creditAmount && !isNaN(Number(creditAmount)) && Number(creditAmount) > 0 && (
            <div className="bg-linear-to-r from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 rounded-xl p-6 border border-green-100 dark:border-green-800/30">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-100 dark:bg-green-900/50 rounded-lg flex items-center justify-center">
                    <Wallet className="h-5 w-5 text-green-600 dark:text-green-400" variant="Bulk" color="currentColor" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-green-900 dark:text-green-100">Nouveau total</p>
                    <p className="text-2xl font-bold text-green-900 dark:text-green-100">
                      {currentCredit + Number(creditAmount)}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-green-600 dark:text-green-400">
                    +{Number(creditAmount)} SMS
                  </p>
                </div>
              </div>
            </div>
          )}

          <DialogFooter className="flex gap-3 pt-4">
            <Button 
              type="button" 
              variant="outline" 
              onClick={handleClose} 
              className="flex-1 h-11 flex items-center justify-center gap-2"
            >
              <CloseCircle className="h-4 w-4" variant="Bulk" color="currentColor" />
              Annuler
            </Button>
            <Button 
              type="submit" 
              disabled={isSubmitting} 
              className="flex-1 h-11 flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                  Ajout en cours...
                </>
              ) : (
                <>
                  <Wallet className="h-4 w-4" variant="Bulk" color="currentColor" />
                  Ajouter le crédit
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
