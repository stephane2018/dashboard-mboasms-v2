"use client"

import { Textarea } from "@/shared/ui/textarea"
import { MessageText1, Warning2 } from "iconsax-react"
import type { MessageSectionProps } from "./types"
import { useT } from "@/core/hooks"

export function MessageSection({
    message,
    onMessageChange,
    isSending,
    smsCount,
    totalCharCount,
    specialCharCount,
    validRecipientsCount,
    totalSmsToSend,
    userBalance,
    remainingBalance,
}: MessageSectionProps) {
    const { t } = useT()
    const maxChars = totalCharCount <= 160 ? 160 : Math.ceil(totalCharCount / 153) * 153
    const charPercent = Math.min((totalCharCount / maxChars) * 100, 100)

    return (
        <div className="rounded-2xl border border-border/50 bg-card">
            <div className="flex items-center gap-2 p-4 pb-3">
                <MessageText1 size={18} color="currentColor" variant="Bulk" className="text-primary" />
                <h2 className="text-sm font-semibold text-foreground">{t('sms.message')}</h2>
            </div>

            <div className="px-4 pb-4 space-y-3">
                <div className="relative">
                    <Textarea
                        placeholder={t('sms.messagePlaceholder')}
                        value={message}
                        onChange={(e) => onMessageChange(e.target.value)}
                        disabled={isSending}
                        className="min-h-36 resize-none rounded-xl border-border/60 focus:border-primary/40 pr-4 pb-10"
                    />
                    {/* Inline char counter */}
                    <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
                        <div className="flex items-center gap-3 text-[11px] text-muted-foreground">
                            <span className="tabular-nums">{totalCharCount} / {maxChars}</span>
                            <span className="text-primary font-medium">{smsCount} SMS</span>
                        </div>
                        {/* Mini progress bar */}
                        <div className="w-16 h-1 rounded-full bg-muted overflow-hidden">
                            <div
                                className="h-full rounded-full bg-primary/60 transition-all duration-300"
                                style={{ width: `${charPercent}%` }}
                            />
                        </div>
                    </div>
                </div>

                {/* Special char warning — compact */}
                {specialCharCount > 0 && (
                    <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-amber-50 dark:bg-amber-500/5 border border-amber-200/60 dark:border-amber-500/15">
                        <Warning2 size={14} color="currentColor" variant="Bulk" className="text-amber-500 shrink-0" />
                        <p className="text-xs text-amber-700 dark:text-amber-400">
                            {t('sms.specialCharsWarning', { count: specialCharCount })}
                        </p>
                    </div>
                )}

                {/* Balance simulation — compact inline */}
                {validRecipientsCount > 0 && smsCount > 0 && (
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 px-3 py-2.5 rounded-lg bg-muted/40 text-xs">
                        <span className="text-muted-foreground">
                            {validRecipientsCount} {t('sms.recipientsShort')} x {smsCount} SMS = <span className="font-semibold text-foreground">{totalSmsToSend}</span>
                        </span>
                        <span className="text-muted-foreground">
                            {t('sms.balanceLabel')} : {userBalance} - {totalSmsToSend} = {" "}
                            <span className={`font-semibold ${remainingBalance < 0 ? 'text-red-500' : 'text-emerald-600'}`}>
                                {remainingBalance}
                            </span>
                        </span>
                        {remainingBalance < 0 && (
                            <span className="text-red-500 font-medium">{t('sms.insufficientBalance')}</span>
                        )}
                    </div>
                )}
            </div>
        </div>
    )
}
