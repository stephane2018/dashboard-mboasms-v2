"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card"
import { Chart, Profile2User, ProfileTick, CloseCircle, MessageNotif, Wallet, Warning2 } from "iconsax-react"
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
        <>
            {/* Balance Card */}
            <Card className={hasInsufficientBalance ? "border-red-300 dark:border-red-800" : ""}>
                <CardHeader className="pb-3">
                    <CardTitle className="text-lg flex items-center gap-2">
                        <Wallet size={20} color="currentColor" variant="Bulk" className="text-primary" />
                        Solde SMS
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-center space-y-3">
                        <div className={`text-4xl font-bold ${hasInsufficientBalance ? 'text-red-500' : 'text-primary'}`}>
                            {userBalance.toLocaleString()}
                        </div>
                        <p className="text-sm text-muted-foreground">SMS disponibles</p>

                        {totalSmsToSend > 0 && (
                            <div className="pt-3 border-t space-y-2">
                                <div className="flex justify-between text-sm">
                                    <span className="text-muted-foreground">SMS à envoyer</span>
                                    <span className="font-medium">-{totalSmsToSend}</span>
                                </div>
                                <div className="flex justify-between text-sm font-medium">
                                    <span>Solde restant</span>
                                    <span className={remainingBalance < 0 ? 'text-red-500' : 'text-green-600'}>
                                        {remainingBalance}
                                    </span>
                                </div>
                            </div>
                        )}

                        {hasInsufficientBalance && (
                            <div className="flex items-center justify-center gap-2 pt-3 border-t">
                                <Warning2 size={16} color="currentColor" variant="Bulk" className="text-red-500" />
                                <span className="text-sm text-red-500">
                                    Solde faible, pensez à recharger
                                </span>
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>

            {/* Summary Card */}
            <Card>
                <CardHeader className="pb-3">
                    <CardTitle className="text-lg flex gap-3">
                        <Chart size={20} color="currentColor" variant="Bulk" className="text-primary" />
                        Résumé
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-3">
                        <div className="flex justify-between items-center py-2 border-b">
                            <span className="text-muted-foreground flex items-center gap-2">
                                <Profile2User size={16} color="currentColor" variant="Bulk" className="text-muted-foreground" />
                                Total destinataires
                            </span>
                            <span className="font-semibold text-lg">{phoneEntries.length}</span>
                        </div>
                        <div className="flex justify-between items-center py-2 border-b">
                            <span className="text-muted-foreground flex items-center gap-2">
                                <ProfileTick size={16} color="currentColor" variant="Bulk" className="text-green-600" />
                                Destinataires valides
                            </span>
                            <span className="font-semibold text-lg text-green-600">{validRecipientsCount}</span>
                        </div>
                        <div className="flex justify-between items-center py-2 border-b">
                            <span className="text-muted-foreground flex items-center gap-2">
                                <CloseCircle size={16} color="currentColor" variant="Bulk" className={invalidRecipientsCount > 0 ? 'text-red-500' : 'text-muted-foreground'} />
                                Numéros erronés
                            </span>
                            <span className={`font-semibold text-lg ${invalidRecipientsCount > 0 ? 'text-red-500' : 'text-muted-foreground'}`}>
                                {invalidRecipientsCount}
                            </span>
                        </div>
                        <div className="flex justify-between items-center py-2 border-b">
                            <span className="text-muted-foreground flex items-center gap-2">
                                <MessageNotif size={16} color="currentColor" variant="Bulk" className="text-muted-foreground" />
                                Nombre de SMS
                            </span>
                            <span className="font-semibold text-lg">{smsCount}</span>
                        </div>
                        {totalSmsToSend > 0 && (
                            <div className="flex justify-between items-center py-2">
                                <span className="text-muted-foreground font-medium">Total SMS</span>
                                <span className="font-bold text-lg text-primary">{totalSmsToSend}</span>
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>
        </>
    )
}
