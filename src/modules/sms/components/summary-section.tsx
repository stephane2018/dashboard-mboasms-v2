"use client"

import { ProfileTick, CloseCircle, MessageNotif, Wallet, Warning2 } from "iconsax-react"
import type { SummarySectionProps } from "./types"

export function SummarySection({
    phoneEntries,
    validRecipientsCount,
    invalidRecipientsCount,
    smsCount,
    totalSmsToSend,
    userBalance,
    remainingBalance,
    hasInsufficientBalance,
}: SummarySectionProps) {
    return (
        <div className="rounded-2xl border border-border/50 bg-card overflow-hidden">
            {/* Balance header */}
            <div className={`p-4 ${hasInsufficientBalance ? 'bg-red-50 dark:bg-red-500/5' : 'bg-primary/5'}`}>
                <div className="flex items-center gap-2 mb-2">
                    <Wallet size={16} color="currentColor" variant="Bulk" className={hasInsufficientBalance ? 'text-red-500' : 'text-primary'} />
                    <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Solde SMS</span>
                </div>
                <p className={`text-3xl font-bold tabular-nums ${hasInsufficientBalance ? 'text-red-500' : 'text-foreground'}`}>
                    {userBalance.toLocaleString()}
                </p>
                {totalSmsToSend > 0 && (
                    <div className="mt-2 flex items-center gap-2 text-xs">
                        <span className="text-muted-foreground">Après envoi :</span>
                        <span className={`font-semibold tabular-nums ${remainingBalance < 0 ? 'text-red-500' : 'text-emerald-600'}`}>
                            {remainingBalance.toLocaleString()}
                        </span>
                    </div>
                )}
                {hasInsufficientBalance && (
                    <div className="flex items-center gap-1.5 mt-2 text-xs text-red-500 font-medium">
                        <Warning2 size={12} color="currentColor" variant="Bulk" />
                        Solde insuffisant
                    </div>
                )}
            </div>

            {/* Stats */}
            <div className="p-4 space-y-2.5">
                <div className="flex items-center justify-between text-sm">
                    <span className="flex items-center gap-2 text-muted-foreground">
                        <ProfileTick size={14} color="currentColor" variant="Bulk" className="text-emerald-500" />
                        Valides
                    </span>
                    <span className="font-semibold text-emerald-600 tabular-nums">{validRecipientsCount}</span>
                </div>

                {invalidRecipientsCount > 0 && (
                    <div className="flex items-center justify-between text-sm">
                        <span className="flex items-center gap-2 text-muted-foreground">
                            <CloseCircle size={14} color="currentColor" variant="Bulk" className="text-red-400" />
                            Invalides
                        </span>
                        <span className="font-semibold text-red-500 tabular-nums">{invalidRecipientsCount}</span>
                    </div>
                )}

                <div className="flex items-center justify-between text-sm">
                    <span className="flex items-center gap-2 text-muted-foreground">
                        <MessageNotif size={14} color="currentColor" variant="Bulk" className="text-primary" />
                        SMS / dest.
                    </span>
                    <span className="font-semibold tabular-nums">{smsCount}</span>
                </div>

                {totalSmsToSend > 0 && (
                    <>
                        <div className="border-t border-border/50 my-1" />
                        <div className="flex items-center justify-between text-sm">
                            <span className="font-medium text-foreground">Total SMS</span>
                            <span className="font-bold text-primary text-lg tabular-nums">{totalSmsToSend}</span>
                        </div>
                    </>
                )}
            </div>
        </div>
    )
}
