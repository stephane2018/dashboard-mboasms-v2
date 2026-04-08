"use client"

import { Button } from "@/shared/ui/button"
import { Send2, Trash } from "iconsax-react"
import { Loader2 } from "lucide-react"
import type { ActionsSectionProps } from "./types"

export function ActionsSection({
    message,
    validRecipientsCount,
    isSending,
    onSend,
    onClear,
    hasInsufficientBalance,
}: ActionsSectionProps) {
    return (
        <div className="space-y-2">
            <Button
                onClick={onSend}
                disabled={isSending || hasInsufficientBalance || validRecipientsCount === 0 || !message.trim()}
                className="w-full h-11 rounded-xl gap-2 shadow-sm"
                size="lg"
            >
                {isSending ? (
                    <>
                        <Loader2 className="h-4 w-4 animate-spin" color="currentColor" />
                        Envoi en cours...
                    </>
                ) : (
                    <>
                        <Send2 size={18} variant="Bulk" color="currentColor"  />
                        Envoyer
                    </>
                )}
            </Button>
            <Button
                type="button"
                variant="outline"
                onClick={onClear}
                disabled={isSending}
                className="w-full h-9 rounded-xl text-xs text-muted-foreground gap-2"
            >
                <Trash size={14} variant="Bulk" color="currentColor" />
                Effacer tout
            </Button>
        </div>
    )
}
