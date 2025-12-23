"use client"

import { Card, CardContent } from "@/shared/ui/card"
import { Button } from "@/shared/ui/button"
import { Send2 } from "iconsax-react"
import { Loader2 } from "lucide-react"
import type { ActionsSectionProps } from "./types"

export function ActionsSection({
    message,
    phoneEntries,
    validRecipientsCount,
    isSending,
    onSend,
    onClear,
    hasInsufficientBalance,
}: ActionsSectionProps) {
    return (
        <Card>
            <CardContent className="pt-6">
                <div className="space-y-3">
                    <Button
                        onClick={onSend}
                        disabled={isSending || !message.trim() || phoneEntries.length === 0 || validRecipientsCount === 0 || hasInsufficientBalance}
                        className="w-full h-12 bg-primary hover:bg-primary/90"
                        size="lg"
                    >
                        {isSending ? (
                            <>
                                <Loader2 className="h-5 w-5 animate-spin mr-2" />
                                Envoi en cours...
                            </>
                        ) : (
                            <>
                                <Send2 size={20} variant="Bulk" className="mr-2" />
                                Envoyer le SMS
                            </>
                        )}
                    </Button>
                    <Button
                        variant="outline"
                        onClick={onClear}
                        disabled={isSending}
                        className="w-full"
                    >
                        Effacer tout
                    </Button>
                </div>
            </CardContent>
        </Card>
    )
}
