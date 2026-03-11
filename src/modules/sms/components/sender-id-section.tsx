"use client"

import { Button } from "@/shared/ui/button"
import { Input } from "@/shared/ui/input"
import { Switch } from "@/shared/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/ui/select"
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
    senderIds,
    isLoadingSenderIds,
    onToggleTempSenderId,
    onActivateTempSenderId,
    onSetTemporarySenderId,
    onSetUseTemporarySenderId,
    onSaveSenderId,
    onNewSenderIdInputChange,
    onShowSenderIdInputChange,
}: SenderIdSectionProps) {
    return (
        <div className={`rounded-2xl border bg-card ${!activeSenderId ? "border-amber-300 dark:border-amber-700" : "border-border/50"}`}>
            <div className="flex items-center justify-between p-4 pb-3">
                <div className="flex items-center gap-2">
                    <UserTag size={18} color="currentColor" variant="Bulk" className="text-primary" />
                    <h2 className="text-sm font-semibold text-foreground">Sender ID</h2>
                    {activeSenderId && (
                        <span className="text-xs text-muted-foreground ml-1">
                            — {activeSenderId}
                        </span>
                    )}
                </div>
                {/* Toggle principal/temporaire */}
                {hasPrimarySenderId && (
                    <div className="flex items-center gap-2">
                        <span className="text-[11px] text-muted-foreground">
                            {useTemporarySenderId ? "Temporaire" : "Principal"}
                        </span>
                        <Switch
                            checked={!useTemporarySenderId}
                            onCheckedChange={(checked) => onSetUseTemporarySenderId(!checked)}
                        />
                    </div>
                )}
                {!hasPrimarySenderId && (
                    <div className="flex items-center gap-2">
                        <span className="text-[11px] text-muted-foreground">
                            {temporarySenderId ? "Temporaire actif" : "Inactif"}
                        </span>
                        <Switch
                            checked={!!temporarySenderId}
                            onCheckedChange={(checked) => {
                                if (checked) onActivateTempSenderId()
                                else onSetTemporarySenderId("")
                            }}
                        />
                    </div>
                )}
            </div>

            <div className="px-4 pb-4 space-y-3">
                {/* Enterprise Sender IDs dropdown */}
                {senderIds.length > 0 && (
                    <div className="space-y-1.5">
                        <label className="text-xs font-medium text-muted-foreground">Sender ID entreprise</label>
                        <Select value={activeSenderId || undefined} onValueChange={onSetTemporarySenderId}>
                            <SelectTrigger className="h-9 rounded-lg text-sm">
                                <SelectValue placeholder="Sélectionner un Sender ID" />
                            </SelectTrigger>
                            <SelectContent>
                                {senderIds.map((senderId) => (
                                    <SelectItem key={senderId.id} value={senderId.name}>
                                        {senderId.name} {senderId.description && `(${senderId.description})`}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        {isLoadingSenderIds && (
                            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                                <Loader2 className="h-3 w-3 animate-spin" />
                                Chargement...
                            </div>
                        )}
                    </div>
                )}

                {hasPrimarySenderId && !useTemporarySenderId ? (
                    /* Primary active */
                    <div className="flex items-center gap-2.5 p-3 bg-emerald-50 dark:bg-emerald-500/5 rounded-xl border border-emerald-200/60 dark:border-emerald-500/15">
                        <TickCircle size={20} color="currentColor" variant="Bulk" className="text-emerald-600 shrink-0" />
                        <div className="min-w-0">
                            <p className="font-bold text-base text-emerald-700 dark:text-emerald-400 truncate">
                                {userSenderId}
                            </p>
                            <p className="text-[11px] text-emerald-600 dark:text-emerald-500">
                                {isSenderIdVerified ? "Sender ID vérifié et actif" : "En attente de validation"}
                            </p>
                        </div>
                    </div>
                ) : (
                    <>
                        {/* Temp mode info */}
                        {hasPrimarySenderId && (
                            <div className="flex items-center gap-2 p-2.5 bg-blue-50 dark:bg-blue-500/5 rounded-lg text-xs text-blue-700 dark:text-blue-400">
                                <InfoCircle size={14} color="currentColor" variant="Bulk" className="shrink-0" />
                                Mode temporaire. Principal ({userSenderId}) désactivé.
                            </div>
                        )}

                        {!hasPrimarySenderId && (
                            <>
                                <div className="flex items-start gap-2 p-2.5 bg-amber-50 dark:bg-amber-500/5 rounded-lg">
                                    <Warning2 size={14} color="currentColor" variant="Bulk" className="text-amber-500 shrink-0 mt-0.5" />
                                    <p className="text-xs text-amber-700 dark:text-amber-400">
                                        Aucun Sender ID permanent.{" "}
                                        {temporarySenderId
                                            ? `Utilisation de "${temporarySenderId}".`
                                            : "Configurez-en un ou activez le temporaire."}
                                    </p>
                                </div>

                                {!temporarySenderId && (
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="w-full h-8 text-xs rounded-lg gap-1.5"
                                        onClick={onActivateTempSenderId}
                                    >
                                        <TickCircle size={14} color="currentColor" variant="Bulk" />
                                        Activer "infos" (temporaire)
                                    </Button>
                                )}

                                {!showSenderIdInput ? (
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="w-full h-8 text-xs rounded-lg gap-1.5 text-muted-foreground"
                                        onClick={() => onShowSenderIdInputChange(true)}
                                    >
                                        <Edit size={14} color="currentColor" variant="Bulk" />
                                        Définir un Sender ID permanent
                                    </Button>
                                ) : (
                                    <div className="space-y-2 p-3 bg-muted/30 rounded-lg">
                                        <Input
                                            type="text"
                                            value={newSenderIdInput}
                                            onChange={(e) => onNewSenderIdInputChange(e.target.value.replace(/[^a-zA-Z0-9]/g, '').slice(0, 11))}
                                            placeholder="Ex: MONENTREPRISE"
                                            maxLength={11}
                                            className="h-9 rounded-lg text-sm"
                                        />
                                        <p className="text-[11px] text-muted-foreground">
                                            Max 11 caractères alphanumériques
                                        </p>
                                        <div className="flex gap-2">
                                            <Button
                                                size="sm"
                                                className="flex-1 h-8 text-xs rounded-lg"
                                                onClick={onSaveSenderId}
                                                disabled={isSavingSenderId || !newSenderIdInput.trim()}
                                            >
                                                {isSavingSenderId ? (
                                                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                                                ) : (
                                                    "Enregistrer"
                                                )}
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className="h-8 text-xs rounded-lg"
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

                        {/* Temp sender confirmation */}
                        {temporarySenderId && (
                            <div className="flex items-center justify-between p-2.5 bg-emerald-50 dark:bg-emerald-500/5 rounded-lg border border-emerald-200/60 dark:border-emerald-500/15">
                                <div className="flex items-center gap-1.5 text-xs text-emerald-700 dark:text-emerald-400">
                                    <TickCircle size={14} color="currentColor" variant="Bulk" />
                                    Envoi avec : <strong>{temporarySenderId}</strong>
                                </div>
                                <button
                                    onClick={() => onSetTemporarySenderId("")}
                                    className="p-1 rounded-md text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors"
                                >
                                    <CloseCircle size={14} color="currentColor" variant="Bulk" />
                                </button>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    )
}
