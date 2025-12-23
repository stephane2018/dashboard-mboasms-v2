import { PhoneEntry } from "@/shared/common/phone-number-input"
import type { EnterpriseContactResponseType as ContactNewType } from "@/core/models/contact-new"
import type { EnterpriseContactResponseType as ContactType } from "@/core/models/contact"

export interface RecipientsSectionProps {
    phoneEntries: PhoneEntry[]
    onPhoneEntriesChange: (entries: PhoneEntry[]) => void
    onContactsSelected: (contacts: ContactNewType[]) => void
    onGroupsSelected: (contacts: ContactType[]) => void
    validRecipientsCount: number
    invalidRecipientsCount: number
    enterpriseId: string
}

export interface MessageSectionProps {
    message: string
    onMessageChange: (message: string) => void
    isSending: boolean
    smsCount: number
    totalCharCount: number
    specialCharCount: number
    validRecipientsCount: number
    totalSmsToSend: number
    userBalance: number
    remainingBalance: number
}

export interface SenderIdSectionProps {
    activeSenderId: string
    userSenderId: string
    isSenderIdVerified: boolean
    hasPrimarySenderId: boolean
    useTemporarySenderId: boolean
    temporarySenderId: string
    isSavingSenderId: boolean
    newSenderIdInput: string
    showSenderIdInput: boolean
    onToggleTempSenderId: () => void
    onActivateTempSenderId: () => void
    onSetTemporarySenderId: (senderId: string) => void
    onSetUseTemporarySenderId: (use: boolean) => void
    onSaveSenderId: () => void
    onNewSenderIdInputChange: (value: string) => void
    onShowSenderIdInputChange: (show: boolean) => void
}

export interface SummarySectionProps {
    phoneEntries: PhoneEntry[]
    validRecipientsCount: number
    invalidRecipientsCount: number
    smsCount: number
    totalSmsToSend: number
    userBalance: number
    remainingBalance: number
    hasInsufficientBalance: boolean
}

export interface ActionsSectionProps {
    message: string
    phoneEntries: PhoneEntry[]
    validRecipientsCount: number
    isSending: boolean
    onSend: () => void
    onClear: () => void
    hasInsufficientBalance: boolean
}
