"use client"

import { useEffect, useState, useMemo } from "react"
import { useSearchParams } from "next/navigation"
import { toast } from "sonner"
import { Sms } from "iconsax-react"
import { SMSConfirmationModal } from "@/shared/common/sms-confirmation-modal"
import { checkPhoneValidation, getPhoneValidationStatus } from "@/core/utils/phone-validation"
import type { PhoneEntry } from "@/shared/common/phone-number-input"
import type { EnterpriseContactResponseType as ContactNewType } from "@/core/models/contact-new"
import type { EnterpriseContactResponseType as ContactType } from "@/core/models/contact"
import { useSettingsStore } from "@/core/stores"
import { useUserStore } from "@/core/stores/userStore"
import { useSMSStore } from "@/core/stores/smsStore"
import { updateUserSenderId } from "@/core/services/client.service"
// Import modular components
import {
    RecipientsSection,
    MessageSection,
    SenderIdSection,
    SummarySection,
    ActionsSection,
} from "@/modules/sms"
import { useSendMessage } from "@/modules/sms/hooks/useSendMessage"

// Default temporary sender ID
const DEFAULT_TEMP_SENDER_ID = "infos"

/**
 * Separates phone entries by operator (MTN vs others)
 * MTN numbers use "infos" sender ID, others use custom sender ID
 */
function separatePhoneNumbersByOperator(phoneEntries: PhoneEntry[]) {
    const mtnNumbers: string[] = []
    const otherNumbers: string[] = []

    phoneEntries
        .filter(entry => entry.isValid)
        .forEach(entry => {
            if (entry.operator === "MTN") {
                mtnNumbers.push(entry.phoneNumber)
            } else {
                otherNumbers.push(entry.phoneNumber)
            }
        })

    return { mtnNumbers, otherNumbers }
}

export default function SMSPage() {
    const searchParams = useSearchParams()
    const [message, setMessage] = useState("")
    const [phoneEntries, setPhoneEntries] = useState<PhoneEntry[]>([])
    const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState(false)
    const [isSavingSenderId, setIsSavingSenderId] = useState(false)
    const [newSenderIdInput, setNewSenderIdInput] = useState("")
    const [showSenderIdInput, setShowSenderIdInput] = useState(false)

    // Get prefilled contacts from SMS store
    const { prefilledContacts, clearPrefilledContacts } = useSMSStore()

    // Get user from store
    const { user, updateUser } = useUserStore()

    // SMS sending hook
    const { sendMessage, isLoading: isSendingMessage } = useSendMessage()

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
        if (hasPrimarySenderId && isSenderIdVerified && !useTemporarySenderId) {
            return userSenderId
        }
        if (hasPrimarySenderId && !isSenderIdVerified) {
            return temporarySenderId || DEFAULT_TEMP_SENDER_ID
        }
        return temporarySenderId || DEFAULT_TEMP_SENDER_ID
    }, [hasPrimarySenderId, isSenderIdVerified, useTemporarySenderId, userSenderId, temporarySenderId])

    // TODO: Replace with actual user balance from API/context
    const [userBalance] = useState(1500)

    // Handle prefilled contacts from URL params
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

    // Handle prefilled contacts from SMS store
    useEffect(() => {
        if (prefilledContacts.length === 0) return

        const newEntries: PhoneEntry[] = prefilledContacts.map((contact) => {
            const phoneNumber = contact.phoneNumber || ""
            const operator = checkPhoneValidation(phoneNumber)
            const status = getPhoneValidationStatus(phoneNumber)

            return {
                id: `store_${contact.id}`,
                phoneNumber,
                name: contact.name,
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

        clearPrefilledContacts()
    }, [prefilledContacts, clearPrefilledContacts])

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

    // Convert contact from contact-new type to contact type for compatibility
    const convertContactToPhoneEntry = (contact: ContactNewType | ContactType): PhoneEntry => {
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

    // Convert contacts from groups (contact type) to phone entries
    const handleGroupsSelected = (contacts: ContactType[]) => {
        const newEntries = contacts.map(convertContactToPhoneEntry)

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

    // Handle contacts selected from modal (contact-new type)
    const handleContactsSelected = (contacts: ContactNewType[]) => {
        const newEntries = contacts.map(convertContactToPhoneEntry)

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

        setIsConfirmationModalOpen(true)
    }

    // Confirmed send action
    const handleConfirmSend = async () => {
        console.log("🚀 handleConfirmSend START")
        
        try {
            // Separate phone numbers by operator
            const { mtnNumbers, otherNumbers } = separatePhoneNumbersByOperator(phoneEntries)
            console.log("📊 Phone numbers separated:", { mtnNumbers, otherNumbers })
            
            const totalRecipients = mtnNumbers.length + otherNumbers.length
            console.log("📈 Total recipients:", totalRecipients)
            
            if (totalRecipients === 0) {
                console.log("❌ No valid recipients")
                toast.error("Aucun destinataire valide trouvé")
                return
            }

            let mtnSent = 0
            let othersSent = 0
            console.log("🔄 Starting SMS sending...")

            // Send to MTN numbers with "infos" sender ID
            if (mtnNumbers.length > 0) {
                console.log("📡 Sending MTN SMS...")
                const response = await sendMessage({
                    phoneNumber: mtnNumbers,
                    message,
                    senderId: "infos"
                })
                mtnSent = response.mtnSent || mtnNumbers.length
                console.log("✅ MTN Response:", response)
            }

            // Send to other numbers with user's sender ID
            if (otherNumbers.length > 0) {
                console.log("📱 Sending other operators SMS...")
                const response = await sendMessage({
                    phoneNumber: otherNumbers,
                    message,
                    senderId: activeSenderId
                })
                othersSent = response.othersSent || otherNumbers.length
                console.log("✅ Others Response:", response)
            }

            console.log("📝 Calculating success message...")
            console.log("📊 Data for message:", { mtnNumbers: mtnNumbers.length, otherNumbers: otherNumbers.length, mtnSent, othersSent, activeSenderId })
            
            const successMessage = mtnNumbers.length > 0 && otherNumbers.length > 0
                ? `SMS envoyés : ${mtnSent} MTN avec "infos" et ${othersSent} autres avec "${activeSenderId}"`
                : mtnNumbers.length > 0
                ? `${mtnSent} SMS MTN envoyés avec senderId "infos"`
                : `${othersSent} SMS envoyés avec senderId "${activeSenderId}"`

            console.log("💬 Success message calculated:", successMessage)
            console.log("🍞 Showing toast...")
            
            toast.success(successMessage)
            
            console.log("🧹 Cleaning up...")
            setMessage("")
            setPhoneEntries([])
            setIsConfirmationModalOpen(false)
            
            console.log("✅ handleConfirmSend COMPLETE")
        } catch (error) {
            console.error("❌ Send SMS error:", error)
            toast.error("Erreur lors de l'envoi du SMS")
        }
    }

    const handleClear = () => {
        setMessage("")
        setPhoneEntries([])
    }

    // Sender ID handlers
    const handleToggleTempSenderId = () => {
        setUseTemporarySenderId(!useTemporarySenderId)
        if (!useTemporarySenderId) {
            toast.info("Mode Sender ID temporaire activé")
        } else {
            toast.info(`Sender ID principal réactivé: ${userSenderId}`)
        }
    }

    const handleActivateTempSenderId = () => {
        setTemporarySenderId(DEFAULT_TEMP_SENDER_ID)
        toast.success(`Sender ID temporaire "${DEFAULT_TEMP_SENDER_ID}" activé`)
    }

    const handleSaveSenderId = async () => {
        if (!newSenderIdInput.trim() || !user?.id) {
            toast.error("Veuillez entrer un Sender ID valide")
            return
        }

        setIsSavingSenderId(true)
        try {
            await updateUserSenderId(user.id, newSenderIdInput)
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
                    <RecipientsSection
                        phoneEntries={phoneEntries}
                        onPhoneEntriesChange={setPhoneEntries}
                        onContactsSelected={handleContactsSelected}
                        onGroupsSelected={handleGroupsSelected}
                        validRecipientsCount={validRecipientsCount}
                        invalidRecipientsCount={invalidRecipientsCount}
                        enterpriseId={user?.companyId || ""}
                    />

                    <MessageSection
                        message={message}
                        onMessageChange={setMessage}
                        isSending={isSendingMessage}
                        smsCount={smsCount}
                        totalCharCount={totalCharCount}
                        specialCharCount={specialCharCount}
                        validRecipientsCount={validRecipientsCount}
                        totalSmsToSend={totalSmsToSend}
                        userBalance={userBalance}
                        remainingBalance={remainingBalance}
                    />

                    <SenderIdSection
                        activeSenderId={activeSenderId}
                        userSenderId={userSenderId}
                        isSenderIdVerified={isSenderIdVerified}
                        hasPrimarySenderId={hasPrimarySenderId}
                        useTemporarySenderId={useTemporarySenderId}
                        temporarySenderId={temporarySenderId}
                        isSavingSenderId={isSavingSenderId}
                        newSenderIdInput={newSenderIdInput}
                        showSenderIdInput={showSenderIdInput}
                        onToggleTempSenderId={handleToggleTempSenderId}
                        onActivateTempSenderId={handleActivateTempSenderId}
                        onSetTemporarySenderId={setTemporarySenderId}
                        onSetUseTemporarySenderId={setUseTemporarySenderId}
                        onSaveSenderId={handleSaveSenderId}
                        onNewSenderIdInputChange={setNewSenderIdInput}
                        onShowSenderIdInputChange={setShowSenderIdInput}
                    />
                </div>

                {/* Summary & Actions */}
                <div className="space-y-6">
                    <SummarySection
                        phoneEntries={phoneEntries}
                        validRecipientsCount={validRecipientsCount}
                        invalidRecipientsCount={invalidRecipientsCount}
                        smsCount={smsCount}
                        totalSmsToSend={totalSmsToSend}
                        userBalance={userBalance}
                        remainingBalance={remainingBalance}
                        hasInsufficientBalance={hasInsufficientBalance}
                    />

                    <ActionsSection
                        message={message}
                        phoneEntries={phoneEntries}
                        validRecipientsCount={validRecipientsCount}
                        isSending={isSendingMessage}
                        onSend={handleSend}
                        onClear={handleClear}
                        hasInsufficientBalance={hasInsufficientBalance}
                    />
                </div>
            </div>

            {/* SMS Confirmation Modal */}
            <SMSConfirmationModal
                isOpen={isConfirmationModalOpen}
                onClose={() => setIsConfirmationModalOpen(false)}
                onConfirm={handleConfirmSend}
                isLoading={isSendingMessage}
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
