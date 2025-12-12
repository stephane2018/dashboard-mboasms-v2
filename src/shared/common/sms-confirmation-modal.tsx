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
import {
    Warning2,
    Send2,
    Profile2User,
    ProfileTick,
    CloseCircle,
    Messages1,
    UserTag,
    Wallet,
    MessageText1,
    InfoCircle,
} from "iconsax-react"
import { Loader2 } from "lucide-react"
import { Separator } from "@/shared/ui/separator"

interface SMSConfirmationModalProps {
    isOpen: boolean
    onClose: () => void
    onConfirm: () => void
    isLoading?: boolean
    // Campaign details
    message: string
    totalRecipients: number
    validRecipients: number
    invalidRecipients: number
    smsCount: number
    totalSmsToSend: number
    senderId: string
    isSenderIdVerified: boolean
    // Balance
    currentBalance: number
    remainingBalance: number
    hasInsufficientBalance: boolean
}

export function SMSConfirmationModal({
    isOpen,
    onClose,
    onConfirm,
    isLoading = false,
    message,
    totalRecipients,
    validRecipients,
    invalidRecipients,
    smsCount,
    totalSmsToSend,
    senderId,
    isSenderIdVerified,
    currentBalance,
    remainingBalance,
    hasInsufficientBalance,
}: SMSConfirmationModalProps) {
    const messagePreview = message.length > 150 ? `${message.slice(0, 150)}...` : message

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[600px] max-h-[95vh] flex flex-col p-0">
                <DialogHeader className="px-6 pt-6 pb-0 shrink-0">
                    <DialogTitle className="text-2xl flex items-center gap-2">
                        <Send2 size={24} variant="Bulk" color="currentColor" className="text-primary" />
                        Confirmation d'envoi
                    </DialogTitle>
                    <DialogDescription>
                        Vérifiez les détails de votre campagne SMS avant l'envoi
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4 py-4 px-6 overflow-y-auto flex-1">
                    {/* Sender ID Warning (if not verified) */}
                    {!isSenderIdVerified && (
                        <Alert className="border-amber-300 bg-amber-50 dark:bg-amber-900/20">
                            <Warning2 size={18} color="currentColor" variant="Bulk" className="text-amber-600" />
                            <AlertDescription className="text-amber-700 dark:text-amber-400">
                                <p className="font-semibold mb-1">
                                    Votre SID Mboasms a été pris en compte. Vous pouvez envoyer des SMS.
                                </p>
                                <p className="text-sm">
                                    Mais si plus tard ce SID est refusé par MTN, les SMS vers MTN ne passeront plus.
                                </p>
                            </AlertDescription>
                        </Alert>
                    )}

                    {/* Sender ID Info */}
                    <div className="bg-muted/50 rounded-lg p-4">
                        <div className="flex items-center gap-2 mb-2">
                            <UserTag size={18} color="currentColor" variant="Bulk" className="text-primary" />
                            <span className="font-semibold">Sender ID</span>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-2xl font-bold text-primary">{senderId}</span>
                            {isSenderIdVerified ? (
                                <span className="text-xs bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 px-2 py-1 rounded-full">
                                    ✓ Vérifié
                                </span>
                            ) : (
                                <span className="text-xs bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 px-2 py-1 rounded-full">
                                    ⏳ En attente
                                </span>
                            )}
                        </div>
                    </div>

                    {/* Message Preview */}
                    <div className="bg-muted/50 rounded-lg p-4">
                        <div className="flex items-center gap-2 mb-2">
                            <MessageText1 size={18} color="currentColor" variant="Bulk" className="text-primary" />
                            <span className="font-semibold">Message</span>
                        </div>
                        <div className="bg-background p-3 rounded-md border">
                            <p className="text-sm whitespace-pre-wrap break-words">{messagePreview}</p>
                            {message.length > 150 && (
                                <p className="text-xs text-muted-foreground mt-2 italic">
                                    (Message tronqué pour l'aperçu)
                                </p>
                            )}
                        </div>
                        <div className="mt-2 text-sm text-muted-foreground">
                            {message.length} caractère(s) • {smsCount} SMS par destinataire
                        </div>
                    </div>

                    <Separator />

                    {/* Campaign Statistics */}
                    <div className="space-y-3">
                        <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
                            Détails de la campagne
                        </h3>

                        <div className="grid grid-cols-2 gap-3">
                            {/* Total Recipients */}
                            <div className="bg-slate-50 dark:bg-slate-900/50 rounded-lg p-3">
                                <div className="flex items-center gap-2 mb-1">
                                    <Profile2User size={16} color="currentColor" variant="Bulk" className="text-muted-foreground" />
                                    <span className="text-xs text-muted-foreground">Total destinataires</span>
                                </div>
                                <p className="text-2xl font-bold">{totalRecipients}</p>
                            </div>

                            {/* Valid Recipients */}
                            <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-3">
                                <div className="flex items-center gap-2 mb-1">
                                    <ProfileTick size={16} color="currentColor" variant="Bulk" className="text-green-600" />
                                    <span className="text-xs text-muted-foreground">Valides</span>
                                </div>
                                <p className="text-2xl font-bold text-green-600">{validRecipients}</p>
                            </div>

                            {/* Invalid Recipients */}
                            {invalidRecipients > 0 && (
                                <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-3">
                                    <div className="flex items-center gap-2 mb-1">
                                        <CloseCircle size={16} color="currentColor" variant="Bulk" className="text-red-500" />
                                        <span className="text-xs text-muted-foreground">Invalides</span>
                                    </div>
                                    <p className="text-2xl font-bold text-red-500">{invalidRecipients}</p>
                                </div>
                            )}

                            {/* Total SMS */}
                            <div className="bg-primary/10 dark:bg-primary/20 rounded-lg p-3">
                                <div className="flex items-center gap-2 mb-1">
                                    <Messages1 size={16} color="currentColor" variant="Bulk" className="text-primary" />
                                    <span className="text-xs text-muted-foreground">Total SMS</span>
                                </div>
                                <p className="text-2xl font-bold text-primary">{totalSmsToSend}</p>
                            </div>
                        </div>

                        {invalidRecipients > 0 && (
                            <Alert className="border-red-300 bg-red-50 dark:bg-red-900/20">
                                <InfoCircle size={16} color="currentColor" variant="Bulk" className="text-red-600" />
                                <AlertDescription className="text-red-700 dark:text-red-400 text-sm">
                                    {invalidRecipients} numéro(s) invalide(s) seront ignoré(s)
                                </AlertDescription>
                            </Alert>
                        )}
                    </div>

                    <Separator />

                    {/* Balance Summary */}
                    <div className="space-y-3">
                        <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
                            Solde et coût
                        </h3>

                        <div className={`rounded-lg p-4 ${hasInsufficientBalance ? 'bg-red-50 dark:bg-red-900/20 border border-red-300' : 'bg-muted/50'}`}>
                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <Wallet size={16} color="currentColor" variant="Bulk" className="text-muted-foreground" />
                                        <span className="text-sm text-muted-foreground">Solde actuel</span>
                                    </div>
                                    <span className="font-semibold text-lg">{currentBalance.toLocaleString()}</span>
                                </div>

                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-muted-foreground">Coût de l'envoi</span>
                                    <span className="font-semibold text-lg text-amber-600">- {totalSmsToSend.toLocaleString()}</span>
                                </div>

                                <Separator />

                                <div className="flex items-center justify-between">
                                    <span className="text-sm font-semibold">Solde après envoi</span>
                                    <span className={`font-bold text-2xl ${remainingBalance < 0 ? 'text-red-500' : 'text-green-600'}`}>
                                        {remainingBalance.toLocaleString()}
                                    </span>
                                </div>
                            </div>

                            {hasInsufficientBalance && (
                                <Alert className="mt-3 border-red-400 bg-red-100 dark:bg-red-900/30">
                                    <Warning2 size={16} color="currentColor" variant="Bulk" className="text-red-600" />
                                    <AlertDescription className="text-red-700 dark:text-red-400 font-semibold">
                                        Solde insuffisant pour cet envoi !
                                    </AlertDescription>
                                </Alert>
                            )}
                        </div>
                    </div>

                    <Separator />

                    {/* Confirmation Question */}
                    <div className="bg-primary/5 border-2 border-primary/20 rounded-lg p-4 text-center">
                        <p className="text-lg font-semibold text-foreground">
                            Voulez-vous vraiment démarrer la campagne ?
                        </p>
                        <p className="text-sm text-muted-foreground mt-1">
                            Cette action enverra {totalSmsToSend} SMS à {validRecipients} destinataire(s)
                        </p>
                    </div>
                </div>

                <DialogFooter className="gap-2 px-6 py-4 border-t shrink-0 bg-background">
                    <Button
                        variant="outline"
                        onClick={onClose}
                        disabled={isLoading}
                        className="flex-1 sm:flex-none"
                    >
                        Annuler
                    </Button>
                    <Button
                        onClick={onConfirm}
                        disabled={isLoading || hasInsufficientBalance}
                        className="flex-1 sm:flex-none sm:min-w-[140px]"
                    >
                        {isLoading ? (
                            <>
                                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                                Envoi en cours...
                            </>
                        ) : (
                            <>
                                <Send2 size={18} variant="Bulk" color="currentcolor" className="mr-2" />
                                Confirmer l'envoi
                            </>
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
