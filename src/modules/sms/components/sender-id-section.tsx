"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/shared/ui/button"
import { Input } from "@/shared/ui/input"
import { Switch } from "@/shared/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/ui/select"
import { UserTag, TickCircle, InfoCircle, Warning2, Edit, CloseCircle, Information, MessageText } from "iconsax-react"
import { Loader2, CheckCircle2, HelpCircle, X } from "lucide-react"
import type { SenderIdSectionProps } from "./types"

const HELP_STORAGE_KEY = "mboasms_senderid_help_dismissed"

function SenderIdHelpModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [dontShowAgain, setDontShowAgain] = useState(false)

  const handleClose = () => {
    if (dontShowAgain) {
      localStorage.setItem(HELP_STORAGE_KEY, "true")
    }
    onClose()
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center p-4"
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={handleClose}
          />
          <motion.div
            initial={{ scale: 0.92, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.92, opacity: 0, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="relative z-10 w-full max-w-md bg-card rounded-2xl shadow-2xl border border-border/50 overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-5 pb-0">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-amber-500/10 flex items-center justify-center">
                  <Information size={18} variant="Bulk" color="currentColor" className="text-amber-500" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-foreground">Qu&apos;est-ce qu&apos;un Sender ID ?</h3>
                  <p className="text-[10px] text-muted-foreground">Tout comprendre en 2 minutes</p>
                </div>
              </div>
              <button onClick={handleClose} className="p-1.5 rounded-lg hover:bg-muted transition-colors">
                <X className="w-4 h-4 text-muted-foreground" />
              </button>
            </div>

            {/* Content */}
            <div className="p-5 space-y-4">
              <p className="text-sm text-muted-foreground leading-relaxed">
                Le <strong className="text-foreground">Sender ID</strong> est le nom qui apparait comme expediteur
                lorsque votre destinataire recoit votre SMS.
              </p>

              {/* infos card */}
              <div className="p-3.5 rounded-xl bg-amber-500/5 border border-amber-500/15 space-y-2">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-amber-500/10 flex items-center justify-center text-[10px] font-bold text-amber-600">
                    ID
                  </div>
                  <div>
                    <p className="text-xs font-bold text-amber-600 dark:text-amber-400">&quot;infos&quot;</p>
                    <p className="text-[10px] text-muted-foreground">Sender ID par defaut</p>
                  </div>
                  <span className="ml-auto text-[9px] px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-600 font-semibold">
                    ACTIF
                  </span>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Par defaut, tous les SMS sont envoyes avec le Sender ID <strong className="text-foreground">&quot;infos&quot;</strong>.
                  Vos destinataires verront &quot;infos&quot; comme nom d&apos;expediteur.
                </p>
              </div>

              {/* Custom sender ID */}
              <div className="p-3.5 rounded-xl bg-primary/5 border border-primary/15 space-y-2">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center">
                    <MessageText size={14} variant="Bulk" color="currentColor" className="text-primary" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-primary">Sender ID personnalise</p>
                    <p className="text-[10px] text-muted-foreground">Ex: MONENTREPRISE</p>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Vous pouvez demander un Sender ID a votre nom d&apos;entreprise. La validation prend
                  generalement <strong className="text-foreground">24 a 48h</strong>.
                </p>
              </div>

              {/* Rules */}
              <div className="space-y-1.5">
                <p className="text-[11px] font-semibold text-foreground uppercase tracking-wider">Regles</p>
                {[
                  "Maximum 11 caracteres alphanumeriques",
                  "Pas d'espaces ni de caracteres speciaux",
                  "La validation est effectuee par l'operateur",
                ].map((rule) => (
                  <div key={rule} className="flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-primary mt-0.5 shrink-0" />
                    <span className="text-xs text-muted-foreground">{rule}</span>
                  </div>
                ))}
              </div>

              {/* Contact */}
              <div className="p-3 rounded-xl bg-muted/50 border border-border/50">
                <p className="text-xs text-muted-foreground">
                  Une question ? Contactez-nous a{" "}
                  <a href="mailto:contact@mboasms.com" className="text-primary font-medium hover:underline">
                    contact@mboasms.com
                  </a>
                </p>
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between px-5 pb-5">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={dontShowAgain}
                  onChange={(e) => setDontShowAgain(e.target.checked)}
                  className="w-3.5 h-3.5 rounded border-border accent-primary"
                />
                <span className="text-[11px] text-muted-foreground">Ne plus afficher</span>
              </label>
              <button
                onClick={handleClose}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary text-white text-sm font-semibold shadow-md shadow-primary/25 hover:shadow-lg hover:shadow-primary/30 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
              >
                J&apos;ai compris
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

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
    const [helpOpen, setHelpOpen] = useState(false)
    const [helpHidden, setHelpHidden] = useState(true)

    useEffect(() => {
        setHelpHidden(!!localStorage.getItem(HELP_STORAGE_KEY))
    }, [])

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
                    <button
                        onClick={() => setHelpOpen(true)}
                        className="p-1 rounded-md hover:bg-muted transition-colors"
                        title="Qu'est-ce qu'un Sender ID ?"
                    >
                        <HelpCircle className="w-3.5 h-3.5 text-muted-foreground" />
                    </button>
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

            {/* Auto-show help banner for first-time users */}
            {!helpHidden && (
                <div className="mx-4 mb-4 flex items-center gap-2 p-2.5 rounded-lg bg-primary/5 border border-primary/10 cursor-pointer hover:bg-primary/10 transition-colors" onClick={() => setHelpOpen(true)}>
                    <HelpCircle className="w-3.5 h-3.5 text-primary shrink-0" />
                    <p className="text-xs text-primary flex-1">
                        <strong>Nouveau ?</strong> Decouvrez comment fonctionne le Sender ID cliquez sur ici pour plus de details 
                    </p>
                    <button
                        onClick={(e) => {
                            e.stopPropagation()
                            setHelpHidden(true)
                            localStorage.setItem(HELP_STORAGE_KEY, "true")
                        }}
                        className="p-0.5 rounded hover:bg-primary/10 transition-colors"
                    >
                        <X className="w-3 h-3 text-primary" />
                    </button>
                </div>
            )}

            <SenderIdHelpModal open={helpOpen} onClose={() => setHelpOpen(false)} />
        </div>
    )
}
