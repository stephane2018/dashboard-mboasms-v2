"use client"

import { useEffect, useState, useMemo } from "react"
import { useSearchParams } from "next/navigation"
import { Button } from "@/shared/ui/button"
import { Textarea } from "@/shared/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/shared/ui/card"
import { Input } from "@/shared/ui/input"
import { Alert, AlertDescription } from "@/shared/ui/alert"
import { Switch } from "@/shared/ui/switch"
import { Sms, Send2, MessageText1, People, AddCircle, ProfileTick, Profile2User, CloseCircle, MessageNotif, Messages1, Chart, Wallet, Warning2, UserTag, TickCircle, InfoCircle, ArrowSwapHorizontal, Edit } from "iconsax-react"
import { Loader2 } from "lucide-react"
import { PhoneNumberInput, type PhoneEntry } from "@/shared/common/phone-number-input"
import { ContactSelectionModal } from "@/shared/common/contact-selection-modal"
import { SMSConfirmationModal } from "@/shared/common/sms-confirmation-modal"
import { checkPhoneValidation, getPhoneValidationStatus } from "@/core/utils/phone-validation"
import type { EnterpriseContactResponseType } from "@/core/models/contact-new"
import { useSettingsStore } from "@/core/stores"
import { useUserStore } from "@/core/stores/userStore"
import { updateUserSenderId } from "@/core/services/client.service"
import { toast } from "sonner"

// Default temporary sender ID
const DEFAULT_TEMP_SENDER_ID = "infos"

export default function SMSPage() {
    const searchParams = useSearchParams()
    const [message, setMessage] = useState("")
    const [phoneEntries, setPhoneEntries] = useState<PhoneEntry[]>([])
    const [isSending, setIsSending] = useState(false)
    const [isContactModalOpen, setIsContactModalOpen] = useState(false)
    const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState(false)
    const [isSavingSenderId, setIsSavingSenderId] = useState(false)
    const [newSenderIdInput, setNewSenderIdInput] = useState("")
    const [showSenderIdInput, setShowSenderIdInput] = useState(false)

    useEffect(() => {
        const raw = searchParams.get("phones")
        if (!raw) return

        const phones = raw
            .split(",")
            .map((p) => decodeURIComponent(p).trim())
            .filter(Boolean)

        if (phones.length === 0) return

        const newEntries: PhoneEntry[] = phones.map((phoneNumber, index) => {
            const operator = checkPhoneValidation(phoneNumber)
            const status = getPhoneValidationStatus(phoneNumber)

            return {
                id: `prefill_${index}_${phoneNumber}`,
                phoneNumber,
                name: "",
                isValid: status === "CORRECT",
                operator,
            }
        })

        setPhoneEntries((prev) => {
            const existingIds = new Set(prev.map((e) => e.id))
            const existingPhones = new Set(prev.map((e) => e.phoneNumber))
            const unique = newEntries.filter(
                (e) => !existingIds.has(e.id) && !existingPhones.has(e.phoneNumber)
            )
            return unique.length > 0 ? [...prev, ...unique] : prev
        })
    }, [searchParams])

    // TODO: Replace with actual user balance from API/context
    const [userBalance] = useState(1500) // Mock SMS credit balance

    // Get user from store
    const { user, updateUser } = useUserStore()

    // User's sender ID (from store)
    const userSenderId = user?.smsSenderId || ""
    const isSenderIdVerified = user?.isSenderIdVerified ?? false
    const hasPrimarySenderId = !!userSenderId

    // Sender ID preferences from settings store
    const {
        useTemporarySenderId,
        setUseTemporarySenderId,
        temporarySenderId,
        setTemporarySenderId
    } = useSettingsStore()

    // Determine the active sender ID to use
    const activeSenderId = useMemo(() => {
        // If has primary sender ID and it's verified and user wants to use it
        if (hasPrimarySenderId && isSenderIdVerified && !useTemporarySenderId) {
            return userSenderId
        }
        // If has primary but not verified, use temporary
        if (hasPrimarySenderId && !isSenderIdVerified) {
            return temporarySenderId || DEFAULT_TEMP_SENDER_ID
        }
        // No primary sender ID, use temporary
        return temporarySenderId || DEFAULT_TEMP_SENDER_ID
    }, [hasPrimarySenderId, isSenderIdVerified, useTemporarySenderId, userSenderId, temporarySenderId])

    // Toggle to temporary sender ID
    const handleToggleTempSenderId = () => {
        setUseTemporarySenderId(!useTemporarySenderId)
        if (!useTemporarySenderId) {
            toast.info("Mode Sender ID temporaire activé")
        } else {
            toast.info(`Sender ID principal réactivé: ${userSenderId}`)
        }
    }

    // Activate temporary sender ID
    const handleActivateTempSenderId = () => {
        setTemporarySenderId(DEFAULT_TEMP_SENDER_ID)
        toast.success(`Sender ID temporaire "${DEFAULT_TEMP_SENDER_ID}" activé`)
    }

    // Save new sender ID to user profile
    const handleSaveSenderId = async () => {
        if (!newSenderIdInput.trim() || !user?.id) {
            toast.error("Veuillez entrer un Sender ID valide")
            return
        }

        setIsSavingSenderId(true)
        try {
            await updateUserSenderId(user.id, newSenderIdInput)
            // Update user in store
            updateUser({ smsSenderId: newSenderIdInput, isSenderIdVerified: false })
            setShowSenderIdInput(false)
            setNewSenderIdInput("")
            toast.success("Sender ID enregistré. En attente de validation.")
        } catch (error) {
            console.error("Error saving sender ID:", error)
            toast.error("Erreur lors de l'enregistrement du Sender ID")
        } finally {
            setIsSavingSenderId(false)
        }
    }

    // Count special characters
    const specialCharCount = useMemo(() => {
        const specialChars = message.match(/[^a-zA-Z0-9\s]/g) || []
        return specialChars.length
    }, [message])

    // Calculate character count (special chars count as 2)
    const totalCharCount = useMemo(() => {
        const regularChars = message.length - specialCharCount
        return regularChars + specialCharCount * 2
    }, [message, specialCharCount])

    // Calculate SMS count (160 chars per SMS, 153 for multipart)
    const smsCount = useMemo(() => {
        if (totalCharCount === 0) return 0
        if (totalCharCount <= 160) return 1
        return Math.ceil(totalCharCount / 153)
    }, [totalCharCount])

    // Valid recipients count
    const validRecipientsCount = useMemo(() => {
        return phoneEntries.filter(e => e.isValid).length
    }, [phoneEntries])

    // Invalid recipients count
    const invalidRecipientsCount = useMemo(() => {
        return phoneEntries.filter(e => !e.isValid).length
    }, [phoneEntries])

    // Total SMS to be sent
    const totalSmsToSend = useMemo(() => {
        return validRecipientsCount * smsCount
    }, [validRecipientsCount, smsCount])

    // Remaining balance after sending
    const remainingBalance = useMemo(() => {
        return userBalance - totalSmsToSend
    }, [userBalance, totalSmsToSend])

    // Check if balance is sufficient
    const hasInsufficientBalance = remainingBalance < 0

    // Convert contact to phone entry
    const contactToPhoneEntry = (contact: EnterpriseContactResponseType): PhoneEntry => {
        const phoneNumber = contact.phoneNumber || ""
        const operator = checkPhoneValidation(phoneNumber)
        const status = getPhoneValidationStatus(phoneNumber)

        return {
            id: `contact_${contact.id}`,
            phoneNumber,
            name: `${contact.firstname || ""} ${contact.lastname || ""}`.trim(),
            isValid: status === "CORRECT",
            operator
        }
    }

    // Handle contacts selected from modal
    const handleContactsSelected = (contacts: EnterpriseContactResponseType[]) => {
        const newEntries = contacts.map(contactToPhoneEntry)

        // Merge with existing entries, avoiding duplicates
        const existingIds = new Set(phoneEntries.map(e => e.id))
        const existingPhones = new Set(phoneEntries.map(e => e.phoneNumber))

        const uniqueNewEntries = newEntries.filter(
            e => !existingIds.has(e.id) && !existingPhones.has(e.phoneNumber)
        )

        if (uniqueNewEntries.length > 0) {
            setPhoneEntries([...phoneEntries, ...uniqueNewEntries])
            toast.success(`${uniqueNewEntries.length} contact(s) ajouté(s)`)
        }
    }

    // Open confirmation modal
    const handleSend = () => {
        if (!message.trim()) {
            toast.error("Veuillez entrer un message")
            return
        }

        const validPhoneNumbers = phoneEntries
            .filter(e => e.isValid)
            .map(e => e.phoneNumber)

        if (validPhoneNumbers.length === 0) {
            toast.error("Veuillez ajouter au moins un destinataire valide")
            return
        }

        // Open confirmation modal
        setIsConfirmationModalOpen(true)
    }

    // Confirmed send action
    const handleConfirmSend = async () => {
        const validPhoneNumbers = phoneEntries
            .filter(e => e.isValid)
            .map(e => e.phoneNumber)

        setIsSending(true)

        try {
            // TODO: Replace with actual API call
            // await messageService.sendSMS({ message, recipients: validPhoneNumbers })

            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1500))

            toast.success(`SMS envoyé à ${validPhoneNumbers.length} destinataire(s)`)
            setMessage("")
            setPhoneEntries([])
            setIsConfirmationModalOpen(false)
        } catch (error) {
            toast.error("Erreur lors de l'envoi du SMS")
            console.error("Send SMS error:", error)
        } finally {
            setIsSending(false)
        }
    }

    const handleClear = () => {
        setMessage("")
        setPhoneEntries([])
    }

    return (
        <div className="container mx-auto py-6 space-y-6">
            {/* Page Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
                        <Sms size={32} variant="Bulk" color="currentColor" className="text-primary" />
                        Envoyer un SMS
                    </h1>
                    <p className="text-muted-foreground mt-1">
                        Envoyez des SMS à vos contacts ou à des numéros personnalisés
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Form */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Recipients Card */}
                    <Card>
                        <CardHeader className="pb-3">
                            <div className="flex items-center justify-between">
                                <div>
                                    <CardTitle className="text-lg flex items-center gap-2">
                                        <People size={20} color="currentColor" variant="Bulk" className="text-primary" />
                                        Destinataires
                                    </CardTitle>
                                    <CardDescription>
                                        Ajoutez des numéros ou sélectionnez vos contacts
                                    </CardDescription>
                                </div>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setIsContactModalOpen(true)}
                                    className="shrink-0"
                                >
                                    <AddCircle size={16} color="currentColor" variant="Bulk" className="mr-2" />
                                    Sélectionner contacts
                                </Button>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <PhoneNumberInput
                                entries={phoneEntries}
                                onEntriesChange={setPhoneEntries}
                                label=""
                                maxHeight="h-40"
                            />
                        </CardContent>
                    </Card>

                    {/* Message Card */}
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
                                onChange={(e) => setMessage(e.target.value)}
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
                                            {hasInsufficientBalance && (
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

                    {/* Sender ID Card */}
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
                                                    handleActivateTempSenderId()
                                                } else {
                                                    setTemporarySenderId("")
                                                    toast.info("Sender ID temporaire désactivé")
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
                                                setUseTemporarySenderId(!checked)
                                                if (checked) {
                                                    toast.info(`Sender ID principal réactivé: ${userSenderId}`)
                                                } else {
                                                    toast.info("Mode Sender ID temporaire activé")
                                                }
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
                                                    onClick={handleActivateTempSenderId}
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
                                                    onClick={() => setShowSenderIdInput(true)}
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
                                                        onChange={(e) => setNewSenderIdInput(e.target.value.replace(/[^a-zA-Z0-9]/g, '').slice(0, 11))}
                                                        placeholder="Ex: MONENTREPRISE"
                                                        maxLength={11}
                                                    />
                                                    <p className="text-xs text-muted-foreground">
                                                        Max 11 caractères alphanumériques. Sera soumis pour validation.
                                                    </p>
                                                    <div className="flex gap-2">
                                                        <Button
                                                            className="flex-1"
                                                            onClick={handleSaveSenderId}
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
                                                                setShowSenderIdInput(false)
                                                                setNewSenderIdInput("")
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
                                                    setTemporarySenderId("")
                                                    toast.info("Sender ID temporaire désactivé")
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
                </div>

                {/* Summary & Actions */}
                <div className="space-y-6">
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
                                            <span className="text-muted-foreground">Coût de l'envoi</span>
                                            <span className="font-medium text-amber-600">-{totalSmsToSend}</span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-muted-foreground">Solde après envoi</span>
                                            <span className={`font-semibold ${remainingBalance < 0 ? 'text-red-500' : 'text-green-600'}`}>
                                                {remainingBalance.toLocaleString()}
                                            </span>
                                        </div>
                                    </div>
                                )}

                                {hasInsufficientBalance && (
                                    <div className="flex items-center gap-2 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 text-sm p-3 rounded-lg">
                                        <Warning2 size={16} color="currentColor" variant="Bulk" />
                                        Solde insuffisant
                                    </div>
                                )}

                                {userBalance < 100 && !hasInsufficientBalance && (
                                    <div className="flex items-center gap-2 bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400 text-sm p-3 rounded-lg">
                                        <Warning2 size={16} color="currentColor" variant="Bulk" />
                                        Solde faible, pensez à recharger
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
                                <div className="flex justify-between items-center py-2 border-b">
                                    <span className="text-muted-foreground flex items-center gap-2">
                                        <Messages1 size={16} color="currentColor" variant="Bulk" className="text-primary" />
                                        Total SMS envoyés
                                    </span>
                                    <span className="font-semibold text-lg text-primary">
                                        {validRecipientsCount * smsCount}
                                    </span>
                                </div>
                            </div>

                            {invalidRecipientsCount > 0 && (
                                <div className="bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 text-sm p-3 rounded-lg">
                                    ⚠️ {invalidRecipientsCount} numéro(s) erroné(s) ne recevront pas de SMS
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Action Buttons */}
                    <Card>
                        <CardContent className="pt-6 space-y-3">
                            <Button
                                onClick={handleSend}
                                disabled={isSending || !message.trim() || validRecipientsCount === 0}
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
                                onClick={handleClear}
                                disabled={isSending}
                                className="w-full"
                            >
                                Effacer tout
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </div>

            {/* Contact Selection Modal */}
            <ContactSelectionModal
                isOpen={isContactModalOpen}
                onClose={() => setIsContactModalOpen(false)}
                onSelectContacts={handleContactsSelected}
                selectedContactIds={phoneEntries.filter(e => e.id.startsWith('contact_')).map(e => e.id.replace('contact_', ''))}
            />

            {/* SMS Confirmation Modal */}
            <SMSConfirmationModal
                isOpen={isConfirmationModalOpen}
                onClose={() => setIsConfirmationModalOpen(false)}
                onConfirm={handleConfirmSend}
                isLoading={isSending}
                message={message}
                totalRecipients={phoneEntries.length}
                validRecipients={validRecipientsCount}
                invalidRecipients={invalidRecipientsCount}
                smsCount={smsCount}
                totalSmsToSend={totalSmsToSend}
                senderId={activeSenderId}
                isSenderIdVerified={isSenderIdVerified}
                currentBalance={userBalance}
                remainingBalance={remainingBalance}
                hasInsufficientBalance={hasInsufficientBalance}
            />
        </div>
    )
}
