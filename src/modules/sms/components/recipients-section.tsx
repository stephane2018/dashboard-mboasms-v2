"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/shared/ui/card"
import { Button } from "@/shared/ui/button"
import { People, AddCircle } from "iconsax-react"
import { PhoneNumberInput } from "@/shared/common/phone-number-input"
import { ContactSelectionModal } from "@/shared/common/contact-selection-modal"
import { GroupSelectionModal } from "@/shared/common/group-selection-modal"
import type { RecipientsSectionProps } from "./types"

export function RecipientsSection({
    phoneEntries,
    onPhoneEntriesChange,
    onContactsSelected,
    onGroupsSelected,
    validRecipientsCount,
    invalidRecipientsCount,
    enterpriseId,
}: RecipientsSectionProps) {
    const [isContactModalOpen, setIsContactModalOpen] = useState(false)
    const [isGroupModalOpen, setIsGroupModalOpen] = useState(false)

    return (
        <>
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
                        <div className="flex items-center gap-2 shrink-0">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setIsGroupModalOpen(true)}
                            >
                                <People size={16} color="currentColor" variant="Bulk" className="mr-2" />
                                Sélectionner groupes
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setIsContactModalOpen(true)}
                            >
                                <AddCircle size={16} color="currentColor" variant="Bulk" className="mr-2" />
                                Sélectionner contacts
                            </Button>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <PhoneNumberInput
                        entries={phoneEntries}
                        onEntriesChange={onPhoneEntriesChange}
                        label=""
                        maxHeight="h-40"
                    />
                </CardContent>
            </Card>

            {/* Contact Selection Modal */}
            <ContactSelectionModal
                isOpen={isContactModalOpen}
                onClose={() => setIsContactModalOpen(false)}
                onSelectContacts={onContactsSelected}
                selectedContactIds={phoneEntries.filter(e => e.id.startsWith('contact_')).map(e => e.id.replace('contact_', ''))}
            />

            {/* Group Selection Modal */}
            <GroupSelectionModal
                isOpen={isGroupModalOpen}
                onClose={() => setIsGroupModalOpen(false)}
                onGroupsSelected={onGroupsSelected}
                enterpriseId={enterpriseId}
            />
        </>
    )
}
