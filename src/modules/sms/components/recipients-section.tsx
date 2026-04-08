"use client"

import { useState } from "react"
import { Button } from "@/shared/ui/button"
import { People, AddCircle, ProfileTick, CloseCircle } from "iconsax-react"
import { PhoneNumberInput } from "@/shared/common/phone-number-input"
import { ContactSelectionModal } from "@/shared/common/contact-selection-modal"
import { GroupSelectionModal } from "@/shared/common/group-selection-modal"
import type { RecipientsSectionProps } from "./types"
import { CountryCodeWarning } from "@/shared/common/country-code-warning"
import { useT } from "@/core/hooks"

export function RecipientsSection({
    phoneEntries,
    onPhoneEntriesChange,
    onContactsSelected,
    onGroupsSelected,
    validRecipientsCount,
    invalidRecipientsCount,
    enterpriseId,
}: RecipientsSectionProps) {
    const { t } = useT()
    const [isContactModalOpen, setIsContactModalOpen] = useState(false)
    const [isGroupModalOpen, setIsGroupModalOpen] = useState(false)

    return (
        <>
            <div className="rounded-2xl border border-border/50 bg-card">
                <div className="flex items-center justify-between p-4 pb-3">
                    <div className="flex items-center gap-2">
                        <People size={18} color="currentColor" variant="Bulk" className="text-primary" />
                        <h2 className="text-sm font-semibold text-foreground">{t('sms.recipients')}</h2>
                        {phoneEntries.length > 0 && (
                            <div className="flex items-center gap-1.5 ml-2">
                                {validRecipientsCount > 0 && (
                                    <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-600 bg-emerald-50 dark:bg-emerald-500/10 px-2 py-0.5 rounded-full">
                                        <ProfileTick size={12} color="currentColor" variant="Bulk" />
                                        {validRecipientsCount}
                                    </span>
                                )}
                                {invalidRecipientsCount > 0 && (
                                    <span className="inline-flex items-center gap-1 text-[11px] font-medium text-red-500 bg-red-50 dark:bg-red-500/10 px-2 py-0.5 rounded-full">
                                        <CloseCircle size={12} color="currentColor" variant="Bulk" />
                                        {invalidRecipientsCount}
                                    </span>
                                )}
                            </div>
                        )}
                    </div>
                    <div className="flex items-center gap-1.5">
                        <Button
                            variant="default"
                            size="sm"
                            className="h-8 text-xs gap-1.5 rounded-lg"
                            onClick={() => setIsGroupModalOpen(true)}
                        >
                            <People size={14} color="currentColor" variant="Bulk" />
                            {t('groups.title')}
                        </Button>
                        <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            className="h-8 text-xs gap-1.5 rounded-lg"
                            onClick={() => setIsContactModalOpen(true)}
                        >
                            <AddCircle size={14} color="currentColor" variant="Bulk" />
                            {t('nav.contacts')}
                        </Button>
                    </div>
                </div>
                <div className="px-4 pb-4 space-y-3">
                    <CountryCodeWarning />
                    <PhoneNumberInput
                        entries={phoneEntries}
                        onEntriesChange={onPhoneEntriesChange}
                        label=""
                        maxHeight="h-40"
                    />
                </div>
            </div>

            <ContactSelectionModal
                isOpen={isContactModalOpen}
                onClose={() => setIsContactModalOpen(false)}
                onSelectContacts={onContactsSelected}
                selectedContactIds={phoneEntries.filter(e => e.id.startsWith('contact_')).map(e => e.id.replace('contact_', ''))}
            />

            <GroupSelectionModal
                isOpen={isGroupModalOpen}
                onClose={() => setIsGroupModalOpen(false)}
                onGroupsSelected={onGroupsSelected}
                enterpriseId={enterpriseId}
            />
        </>
    )
}
