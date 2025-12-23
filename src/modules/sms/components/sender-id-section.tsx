"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/shared/ui/card"
import { Button } from "@/shared/ui/button"
import { Input } from "@/shared/ui/input"
import { Switch } from "@/shared/ui/switch"
import { UserTag, TickCircle, InfoCircle, Warning2, Edit, CloseCircle } from "iconsax-react"
import { Loader2 } from "lucide-react"
import type { SenderIdSectionProps } from "./types"

export function SenderIdSection({
    activeSenderId,
    userSenderId,
    isSenderIdVerified,
    hasPrimarySenderId,
    useTemporarySenderId,
    temporarySenderId,
    isSavingSenderId,
    newSenderIdInput,
    showSenderIdInput,
    onToggleTempSenderId,
    onActivateTempSenderId,
    onSetTemporarySenderId,
    onSetUseTemporarySenderId,
    onSaveSenderId,
    onNewSenderIdInputChange,
    onShowSenderIdInputChange,
}: SenderIdSectionProps) {
    return (
        <Card className={!activeSenderId ? "border-amber-300 dark:border-amber-700" : ""}>
            <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                    <div>
                        <CardTitle className="text-lg flex items-center gap-2">
                            <UserTag size={20} color="currentColor" variant="Bulk" className="text-primary" />
                            Sender ID
                        </CardTitle>
                        <CardDescription>
                            {activeSenderId
                                ? `Vos SMS seront envoyés avec : ${activeSenderId}`
                                : "Aucun Sender ID - Veuillez en configurer un"}
                        </CardDescription>
                    </div>
                    {!hasPrimarySenderId && (
                        <div className="flex items-center gap-2">
                            <span className="text-xs text-muted-foreground">
                                {temporarySenderId ? "Activer le senderId temporaire" : "Désactiver le senderId temporaire"}
                            </span>
                            <Switch
                                checked={!!temporarySenderId}
                                onCheckedChange={(checked) => {
                                    if (checked) {
                                        onActivateTempSenderId()
                                    } else {
                                        onSetTemporarySenderId("")
                                    }
                                }}
                            />
                        </div>
                    )}
                    {hasPrimarySenderId && (
                        <div className="flex items-center gap-2">
                            <span className="text-xs text-muted-foreground">
                                {useTemporarySenderId ? "Temporaire" : "Principal"}
                            </span>
                            <Switch
                                checked={!useTemporarySenderId}
                                onCheckedChange={(checked) => {
                                    onSetUseTemporarySenderId(!checked)
                                }}
                            />
                        </div>
                    )}
                </div>
            </CardHeader>
            <CardContent className="space-y-4">
                {hasPrimarySenderId && !useTemporarySenderId ? (
                    /* Primary Sender ID display */
                    <div className="flex items-center gap-3 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                        <TickCircle size={24} color="currentColor" variant="Bulk" className="text-green-600" />
                        <div className="flex-1">
                            <p className="font-bold text-xl text-green-700 dark:text-green-400">
                                {userSenderId}
                            </p>
                            <p className="text-sm text-green-600 dark:text-green-500">
                                {isSenderIdVerified ? "Sender ID principal actif" : "En attente de validation"}
                            </p>
                        </div>
                    </div>
                ) : (
                    /* Temporary Sender ID input */
                    <>
                        {hasPrimarySenderId && (
                            <div className="flex items-center gap-2 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                                <InfoCircle size={16} color="currentColor" variant="Bulk" className="text-blue-600" />
                                <span className="text-sm text-blue-700 dark:text-blue-400">
                                    Mode temporaire activé. Votre Sender ID principal ({userSenderId}) est désactivé.
                                </span>
                            </div>
                        )}

                        {!hasPrimarySenderId && (
                            <>
                                <div className="flex items-start gap-3 p-3 bg-amber-50 dark:bg-amber-900/20 rounded-lg">
                                    <Warning2 size={20} color="currentColor" variant="Bulk" className="text-amber-600 shrink-0 mt-0.5" />
                                    <div className="flex-1">
                                        <p className="text-sm font-medium text-amber-700 dark:text-amber-400">
                                            Aucun Sender ID permanent configuré
                                        </p>
                                        <p className="text-xs text-amber-600 dark:text-amber-500 mt-1">
                                            Utilisez le Sender ID temporaire "infos" ou définissez votre propre Sender ID.
                                        </p>
                                    </div>
                                </div>

                                {/* Quick activate button */}
                                {!temporarySenderId && (
                                    <Button
                                        variant="outline"
                                        className="w-full"
                                        onClick={onActivateTempSenderId}
                                    >
                                        <TickCircle size={16} color="currentColor" variant="Bulk" className="mr-2" />
                                        Activer le Sender ID temporaire "infos"
                                    </Button>
                                )}

                                {/* Save own sender ID section */}
                                {!showSenderIdInput ? (
                                    <Button
                                        variant="secondary"
                                        className="w-full"
                                        onClick={() => onShowSenderIdInputChange(true)}
                                    >
                                        <Edit size={16} color="currentColor" variant="Bulk" className="mr-2" />
                                        Définir mon Sender ID permanent
                                    </Button>
                                ) : (
                                    <div className="space-y-2 p-3 bg-muted/50 rounded-lg">
                                        <label className="text-sm font-medium">Nouveau Sender ID</label>
                                        <Input
                                            type="text"
                                            value={newSenderIdInput}
                                            onChange={(e) => onNewSenderIdInputChange(e.target.value.replace(/[^a-zA-Z0-9]/g, '').slice(0, 11))}
                                            placeholder="Ex: MONENTREPRISE"
                                            maxLength={11}
                                        />
                                        <p className="text-xs text-muted-foreground">
                                            Max 11 caractères alphanumériques. Sera soumis pour validation.
                                        </p>
                                        <div className="flex gap-2">
                                            <Button
                                                className="flex-1"
                                                onClick={onSaveSenderId}
                                                disabled={isSavingSenderId || !newSenderIdInput.trim()}
                                            >
                                                {isSavingSenderId ? (
                                                    <Loader2 className="h-4 w-4 animate-spin" />
                                                ) : (
                                                    "Enregistrer"
                                                )}
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                onClick={() => {
                                                    onShowSenderIdInputChange(false)
                                                    onNewSenderIdInputChange("")
                                                }}
                                            >
                                                Annuler
                                            </Button>
                                        </div>
                                    </div>
                                )}
                            </>
                        )}

                        {/* Confirmation when temporary sender ID is activated */}
                        {temporarySenderId && (
                            <div className="flex items-center justify-between gap-2 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                                <div className="flex items-center gap-2">
                                    <TickCircle size={16} color="currentColor" variant="Bulk" className="text-green-600" />
                                    <span className="text-sm text-green-700 dark:text-green-400">
                                        Vos SMS seront envoyés avec : <strong>{temporarySenderId}</strong>
                                    </span>
                                </div>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-7 text-red-600 hover:text-red-700 hover:bg-red-50"
                                    onClick={() => {
                                        onSetTemporarySenderId("")
                                    }}
                                >
                                    <CloseCircle size={14} color="currentColor" variant="Bulk" className="mr-1" />
                                    Désactiver
                                </Button>
                            </div>
                        )}
                    </>
                )}
            </CardContent>
        </Card>
    )
}
