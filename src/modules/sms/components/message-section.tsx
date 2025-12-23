"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/shared/ui/card"
import { Textarea } from "@/shared/ui/textarea"
import { Alert, AlertDescription } from "@/shared/ui/alert"
import { MessageText1, Warning2 } from "iconsax-react"
import type { MessageSectionProps } from "./types"

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
    return (
        <Card>
            <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                    <MessageText1 size={20} color="currentColor" variant="Bulk" className="text-primary" />
                    Message
                </CardTitle>
                <CardDescription>
                    Rédigez votre message SMS
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <Textarea
                    placeholder="Entrez votre message ici..."
                    value={message}
                    onChange={(e) => onMessageChange(e.target.value)}
                    disabled={isSending}
                    className="min-h-40 resize-none"
                />

                {/* Special Character Alert */}
                {specialCharCount > 0 && (
                    <Alert className="border-amber-300 bg-amber-50 dark:bg-amber-900/20">
                        <Warning2 size={16} color="currentColor" variant="Bulk" className="text-amber-600" />
                        <AlertDescription className="text-amber-700 dark:text-amber-400 text-sm">
                            <strong>Attention :</strong> Votre message contient <strong>{specialCharCount}</strong> caractère(s) spéciaux
                            qui comptent pour 2 caractères chacun. Cela peut augmenter le nombre de SMS envoyés.
                        </AlertDescription>
                    </Alert>
                )}

                {/* SMS Simulation Counter */}
                <div className="bg-muted/50 rounded-lg p-4 space-y-3">
                    <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Caractères</span>
                        <span className="font-medium">{totalCharCount} <span className="text-xs text-muted-foreground">/ {totalCharCount <= 160 ? 160 : Math.ceil(totalCharCount / 153) * 153}</span></span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Nombre de SMS par destinataire</span>
                        <span className="font-semibold text-primary">{smsCount}</span>
                    </div>

                    {validRecipientsCount > 0 && smsCount > 0 && (
                        <>
                            <div className="border-t pt-3 space-y-2">
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-muted-foreground">Destinataires valides</span>
                                    <span className="font-medium text-green-600">{validRecipientsCount}</span>
                                </div>
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-muted-foreground">Total SMS à envoyer</span>
                                    <span className="font-semibold">{totalSmsToSend}</span>
                                </div>
                            </div>
                            <div className="border-t pt-3">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm font-medium">Simulation du débit</span>
                                    <div className="text-right">
                                        <div className="flex items-center gap-2">
                                            <span className="text-muted-foreground">{userBalance}</span>
                                            <span className="text-amber-600">- {totalSmsToSend}</span>
                                            <span className="text-muted-foreground">=</span>
                                            <span className={`font-bold ${remainingBalance < 0 ? 'text-red-500' : 'text-green-600'}`}>
                                                {remainingBalance}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                {remainingBalance < 0 && (
                                    <p className="text-xs text-red-500 mt-1">
                                        ⚠️ Solde insuffisant pour cet envoi
                                    </p>
                                )}
                            </div>
                        </>
                    )}
                </div>
            </CardContent>
        </Card>
    )
}
