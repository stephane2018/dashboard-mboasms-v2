"use client"

import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/shared/ui/dialog"
import { Button } from "@/shared/ui/button"
import {
    Warning2,
    Send2,
    ProfileTick,
    CloseCircle,
    UserTag,
    Wallet,
    MessageText1,
    InfoCircle,
} from "iconsax-react"
import { Loader2 } from "lucide-react"

interface SMSConfirmationModalProps {
    isOpen: boolean
    onClose: () => void
    onConfirm: () => void
    isLoading?: boolean
    message: string
    totalRecipients: number
    validRecipients: number
    invalidRecipients: number
    smsCount: number
    totalSmsToSend: number
    senderId: string
    isSenderIdVerified: boolean
    currentBalance: number
    remainingBalance: number
    hasInsufficientBalance: boolean
    mtnCount?: number
    otherOperatorsCount?: number
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
    mtnCount = 0,
    otherOperatorsCount = 0,
}: SMSConfirmationModalProps) {
    const messagePreview = message.length > 150 ? `${message.slice(0, 150)}...` : message

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[520px] max-h-[90vh] flex flex-col p-0 rounded-2xl">
                <DialogHeader className="px-5 pt-5 pb-0 shrink-0">
                    <DialogTitle className="text-lg flex items-center gap-2">
                        <div className="rounded-lg bg-primary/10 p-1.5">
                            <Send2 size={18} variant="Bulk" color="currentColor" className="text-primary" />
                        </div>
                        Confirmation d&apos;envoi
                    </DialogTitle>
                </DialogHeader>

                <div className="space-y-3 py-4 px-5 overflow-y-auto flex-1">
                    {/* SID warning */}
                    {!isSenderIdVerified && (
                        <div className="flex items-start gap-2 p-3 rounded-xl bg-amber-50 dark:bg-amber-500/5 border border-amber-200/60 dark:border-amber-500/15 text-xs">
                            <Warning2 size={14} color="currentColor" variant="Bulk" className="text-amber-500 shrink-0 mt-0.5" />
                            <div className="text-amber-700 dark:text-amber-400">
                                <p className="font-medium">SID &quot;{senderId}&quot; pris en compte.</p>
                                <p className="mt-0.5 text-amber-600 dark:text-amber-500">Si refusé par MTN, les SMS MTN ne passeront plus.</p>
                            </div>
                        </div>
                    )}

                    {/* Sender ID + Message preview */}
                    <div className="rounded-xl bg-muted/30 p-3.5 space-y-3">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                                <UserTag size={14} color="currentColor" variant="Bulk" />
                                Sender ID
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="text-sm font-bold text-primary">{senderId}</span>
                                <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded-full ${isSenderIdVerified ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-400' : 'bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-400'}`}>
                                    {isSenderIdVerified ? "Vérifié" : "En attente"}
                                </span>
                            </div>
                        </div>

                        <div className="border-t border-border/40 pt-3">
                            <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-2">
                                <MessageText1 size={14} color="currentColor" variant="Bulk" />
                                Message
                            </div>
                            <div className="bg-background p-3 rounded-lg border border-border/50 text-sm whitespace-pre-wrap break-words">
                                {messagePreview}
                            </div>
                            <p className="text-[11px] text-muted-foreground mt-1.5">
                                {message.length} car. &middot; {smsCount} SMS/dest.
                            </p>
                        </div>
                    </div>

                    {/* Stats grid */}
                    <div className="grid grid-cols-3 gap-2">
                        <div className="rounded-xl bg-muted/30 p-3 text-center">
                          <div className="flex items-center justify-center gap-1.5">
                            <ProfileTick size={18} color="currentColor" variant="Bulk" className="text-muted-foreground" />
                            <p className="text-[11px] text-muted-foreground">Destinataires</p>
                          </div>
                            <p className="text-xl font-bold tabular-nums">{validRecipients}</p>
                        </div>
                        <div className="rounded-xl bg-primary/5 p-3 text-center">
                           <div className="flex items-center justify-center gap-1.5">
                            <MessageText1 size={18} color="currentColor" variant="Bulk" className="text-primary" />
                            <p className="text-[11px] text-muted-foreground">Total SMS</p>
                           </div>
                            <p className="text-xl font-bold text-primary tabular-nums">{totalSmsToSend}</p>
                        </div>
                        <div className={`rounded-xl p-3 text-center ${hasInsufficientBalance ? 'bg-red-50 dark:bg-red-500/5' : 'bg-emerald-50 dark:bg-emerald-500/5'}`}>
                            <div className="flex items-center justify-center gap-1.5">
                                <Wallet size={16} color="currentColor" variant="Bulk" className={`shrink-0 ${remainingBalance < 0 ? 'text-red-500' : 'text-emerald-600'}`} />
                                <p className="text-[11px] text-muted-foreground">Solde après</p>
                            </div>
                            <p className={`text-xl font-bold tabular-nums ${remainingBalance < 0 ? 'text-red-500' : 'text-emerald-600'}`}>
                                {remainingBalance.toLocaleString()}
                            </p>
                        </div>
                    </div>

                    {/* Invalid warning */}
                    {invalidRecipients > 0 && (
                        <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-red-50 dark:bg-red-500/5 border border-red-200/60 dark:border-red-500/15 text-xs text-red-600 dark:text-red-400">
                            <CloseCircle size={14} color="currentColor" variant="Bulk" className="shrink-0" />
                            {invalidRecipients} numéro(s) invalide(s) ignoré(s)
                        </div>
                    )}

                    {/* Operator breakdown */}
                    {(mtnCount > 0 || otherOperatorsCount > 0) && (
                        <div className="rounded-xl bg-muted/30 p-3 space-y-1.5">
                            <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-1">
                                <InfoCircle size={14} color="currentColor" variant="Bulk" />
                                Répartition opérateurs
                            </div>
                            {mtnCount > 0 && (
                                <div className="flex items-center justify-between text-xs">
                                    <span className="text-muted-foreground">MTN (SID: "infos")</span>
                                    <span className="font-medium tabular-nums">{mtnCount} × {smsCount} = {mtnCount * smsCount}</span>
                                </div>
                            )}
                            {otherOperatorsCount > 0 && (
                                <div className="flex items-center justify-between text-xs">
                                    <span className="text-muted-foreground">Autres (SID: "{senderId}")</span>
                                    <span className="font-medium tabular-nums">{otherOperatorsCount} × {smsCount} = {otherOperatorsCount * smsCount}</span>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Insufficient balance warning */}
                    {hasInsufficientBalance && (
                        <div className="flex items-center gap-2 px-3 py-2.5 rounded-lg bg-red-50 dark:bg-red-500/5 border border-red-300 dark:border-red-500/20 text-xs text-red-600 dark:text-red-400 font-medium">
                            <Warning2 size={14} color="currentColor" variant="Bulk" className="shrink-0" />
                            Solde insuffisant pour cet envoi
                        </div>
                    )}
                </div>

                <DialogFooter className="gap-2 px-5 py-4 border-t border-border/50 shrink-0 bg-muted/20">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={onClose}
                        disabled={isLoading}
                        className="flex-1 sm:flex-none rounded-xl"
                    >
                        Annuler
                    </Button>
                    <Button
                        onClick={onConfirm}
                        className="flex-1 sm:flex-none sm:min-w-[140px] rounded-xl gap-2"
                    >
                        {isLoading ? (
                            <>
                                <Loader2 className="h-4 w-4 animate-spin" />
                                Envoi...
                            </>
                        ) : (
                            <>
                                <Send2 size={16} variant="Bulk" />
                                Confirmer l&apos;envoi
                            </>
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
