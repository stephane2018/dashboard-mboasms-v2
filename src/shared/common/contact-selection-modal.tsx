"use client"

import { useState, useEffect, useMemo, useCallback } from "react"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/shared/ui/dialog"
import { Button } from "@/shared/ui/button"
import { Input } from "@/shared/ui/input"
import { Checkbox } from "@/shared/ui/checkbox"
import { ScrollArea } from "@/shared/ui/scroll-area"
import { Badge } from "@/shared/ui/badge"
import { Skeleton } from "@/shared/ui/skeleton"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/shared/ui/select"
import { SearchNormal1, People, TickCircle, Warning2, ArrowDown2, Edit2 } from "iconsax-react"
import { Loader2 } from "lucide-react"
import type { EnterpriseContactResponseType } from "@/core/models/contact-new"
import { getContactsByEnterprisePage } from "@/core/services/contact.service"
import { getPhoneValidationStatus } from "@/core/utils/phone-validation"
import { useSettingsStore } from "@/core/stores"
import { useAuthContext } from "@/core/providers"
import { ContactEditPopover } from "./contact-edit-popover"
import { cn } from "@/lib/utils"

const EMPTY_SELECTED_IDS: string[] = []

interface ContactSelectionModalProps {
    isOpen: boolean
    onClose: () => void
    onSelectContacts: (contacts: EnterpriseContactResponseType[]) => void
    selectedContactIds?: string[]
    enterpriseId?: string
}

const PAGE_SIZE_OPTIONS = [5, 15, 25, 50, 100, 200]

// Skeleton for contact row
const ContactSkeleton = () => (
    <div className="flex items-center gap-3 p-3 rounded-lg">
        <Skeleton className="h-4 w-4 rounded" />
        <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-3 w-24" />
        </div>
    </div>
)

export function ContactSelectionModal({
    isOpen,
    onClose,
    onSelectContacts,
    selectedContactIds = EMPTY_SELECTED_IDS,
    enterpriseId: propEnterpriseId,
}: ContactSelectionModalProps) {
    const { user } = useAuthContext()
    const { contactsPageSize, setContactsPageSize } = useSettingsStore()

    const [contacts, setContacts] = useState<EnterpriseContactResponseType[]>([])
    const [isLoading, setIsLoading] = useState(false)
    const [isLoadingMore, setIsLoadingMore] = useState(false)
    const [searchQuery, setSearchQuery] = useState("")
    const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set(selectedContactIds))
    const [currentPage, setCurrentPage] = useState(0)
    const [totalPages, setTotalPages] = useState(0)
    const [totalElements, setTotalElements] = useState(0)
    const [hasMore, setHasMore] = useState(false)

    // Get enterprise ID from props or user context
    const enterpriseId = propEnterpriseId || user?.companyId || ""

    // Load contacts when modal opens or page size changes
    useEffect(() => {
        if (isOpen && enterpriseId) {
            loadContacts(true)
            setSelectedIds(new Set(selectedContactIds))
        }
    }, [isOpen, selectedContactIds, enterpriseId, contactsPageSize])

    const loadContacts = useCallback(async (reset: boolean = false) => {
        if (!enterpriseId) return

        const pageToLoad = reset ? 0 : currentPage + 1

        if (reset) {
            setIsLoading(true)
            setContacts([])
            setCurrentPage(0)
        } else {
            setIsLoadingMore(true)
        }

        try {
            const response = await getContactsByEnterprisePage(
                enterpriseId,
                reset ? 0 : pageToLoad,
                contactsPageSize
            )

            // Handle paginated response
            if (response && 'content' in response && Array.isArray(response.content)) {
                const newContacts = response.content as EnterpriseContactResponseType[]

                if (reset) {
                    setContacts(newContacts)
                    setCurrentPage(0)
                } else {
                    setContacts(prev => [...prev, ...newContacts])
                    setCurrentPage(pageToLoad)
                }

                setTotalPages(response.totalPages || 0)
                setTotalElements(response.totalElements || 0)
                setHasMore(!response.last)
            } else if (Array.isArray(response)) {
                setContacts(response)
                setHasMore(false)
            } else {
                console.error("Unexpected response format:", response)
                setContacts([])
            }
        } catch (error) {
            console.error("Error loading contacts:", error)
            setContacts([])
        } finally {
            setIsLoading(false)
            setIsLoadingMore(false)
        }
    }, [enterpriseId, currentPage, contactsPageSize])

    // Load more contacts
    const loadMore = useCallback(() => {
        if (hasMore && !isLoadingMore && !isLoading) {
            loadContacts(false)
        }
    }, [hasMore, isLoadingMore, isLoading, loadContacts])

    // Handle page size change
    const handlePageSizeChange = (value: string) => {
        setContactsPageSize(parseInt(value))
    }

    // Handle contact update from popover
    const handleContactUpdate = (updatedContact: EnterpriseContactResponseType) => {
        setContacts(prev => prev.map(c =>
            c.id === updatedContact.id ? updatedContact : c
        ))
    }

    // Filter contacts based on search (client-side for already loaded contacts)
    const filteredContacts = useMemo(() => {
        if (!searchQuery.trim()) return contacts

        const query = searchQuery.toLowerCase()
        return contacts.filter(contact => {
            const fullName = `${contact.firstname || ""} ${contact.lastname || ""}`.toLowerCase()
            const phone = contact.phoneNumber?.toLowerCase() || ""
            const email = contact.email?.toLowerCase() || ""
            return fullName.includes(query) || phone.includes(query) || email.includes(query)
        })
    }, [contacts, searchQuery])

    // Count invalid contacts
    const invalidContactsCount = useMemo(() => {
        return filteredContacts.filter(c => getPhoneValidationStatus(c.phoneNumber || "") !== "CORRECT").length
    }, [filteredContacts])

    // Toggle contact selection (only for valid contacts)
    const toggleContact = (contactId: string, isValid: boolean) => {
        if (!isValid) return

        const newSelected = new Set(selectedIds)
        if (newSelected.has(contactId)) {
            newSelected.delete(contactId)
        } else {
            newSelected.add(contactId)
        }
        setSelectedIds(newSelected)
    }

    // Select all visible VALID contacts
    const selectAll = () => {
        const newSelected = new Set(selectedIds)
        filteredContacts.forEach(c => {
            const isValid = getPhoneValidationStatus(c.phoneNumber || "") === "CORRECT"
            if (isValid) {
                newSelected.add(c.id)
            }
        })
        setSelectedIds(newSelected)
    }

    // Deselect all
    const deselectAll = () => {
        setSelectedIds(new Set())
    }

    // Confirm selection
    const handleConfirm = () => {
        const selectedContacts = contacts.filter(c => selectedIds.has(c.id))
        onSelectContacts(selectedContacts)
        onClose()
    }

    // Get validation status for a contact
    const isContactValid = (contact: EnterpriseContactResponseType) => {
        return getPhoneValidationStatus(contact.phoneNumber || "") === "CORRECT"
    }

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-2xl max-h-[85vh] flex flex-col">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <People size={20} variant="Bulk" color="currentColor" className="text-primary" />
                        Sélectionner des contacts
                        {totalElements > 0 && (
                            <span className="text-sm font-normal text-muted-foreground">
                                ({totalElements} au total)
                            </span>
                        )}
                    </DialogTitle>
                </DialogHeader>

                {/* Search and page size */}
                <div className="flex gap-2">
                    <div className="relative flex-1">
                        <SearchNormal1
                            size={18}
                            color="currentColor"
                            className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                        />
                        <Input
                            placeholder="Rechercher par nom, téléphone ou email..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-10"
                        />
                    </div>
                    <Select value={contactsPageSize.toString()} onValueChange={handlePageSizeChange}>
                        <SelectTrigger className="w-24">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            {PAGE_SIZE_OPTIONS.map(size => (
                                <SelectItem key={size} value={size.toString()}>
                                    {size}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                {/* Alert for invalid contacts */}
                {!isLoading && invalidContactsCount > 0 && (
                    <div className="flex items-center gap-2 bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400 text-sm p-3 rounded-lg">
                        <Warning2 size={16} color="currentColor" variant="Bulk" />
                        <span>
                            {invalidContactsCount} contact(s) invalide(s) - Cliquez sur <Edit2 size={12} className="inline" /> pour modifier
                        </span>
                    </div>
                )}

                {/* Selection controls */}
                <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">
                        {selectedIds.size} sélectionné(s) • {contacts.length} chargé(s)
                    </span>
                    <div className="flex gap-2">
                        <Button variant="ghost" size="sm" onClick={selectAll} disabled={isLoading}>
                            Tout sélectionner
                        </Button>
                        <Button variant="ghost" size="sm" onClick={deselectAll} disabled={isLoading}>
                            Tout désélectionner
                        </Button>
                    </div>
                </div>

                {/* Contact list with scrollable area */}
                <div className="flex-1 min-h-0 border rounded-lg overflow-hidden">
                    <ScrollArea className="h-[350px]">
                        {isLoading ? (
                            <div className="p-2 space-y-2">
                                {Array.from({ length: 8 }).map((_, i) => (
                                    <ContactSkeleton key={i} />
                                ))}
                            </div>
                        ) : filteredContacts.length === 0 ? (
                            <div className="flex items-center justify-center py-8 text-muted-foreground">
                                {searchQuery ? "Aucun contact trouvé" : "Aucun contact disponible"}
                            </div>
                        ) : (
                            <div className="p-2 space-y-1">
                                {filteredContacts.map((contact) => {
                                    const isSelected = selectedIds.has(contact.id)
                                    const isValid = isContactValid(contact)

                                    return (
                                        <div
                                            key={contact.id}
                                            onClick={() => toggleContact(contact.id, isValid)}
                                            className={cn(
                                                "flex items-center gap-3 p-3 rounded-lg transition-colors",
                                                isValid
                                                    ? "cursor-pointer"
                                                    : "cursor-default",
                                                isSelected
                                                    ? "bg-primary/10 border border-primary/30"
                                                    : isValid
                                                        ? "hover:bg-muted/50"
                                                        : "bg-red-50/50 dark:bg-red-900/10"
                                            )}
                                        >
                                            <Checkbox
                                                checked={isSelected}
                                                onCheckedChange={() => toggleContact(contact.id, isValid)}
                                                disabled={!isValid}
                                            />
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-2">
                                                    <span className={cn("font-medium truncate", !isValid && "text-muted-foreground")}>
                                                        {contact.firstname} {contact.lastname}
                                                    </span>
                                                    {!isValid && (
                                                        <Badge variant="destructive" className="text-[10px] px-1.5 py-0">
                                                            Invalide
                                                        </Badge>
                                                    )}
                                                </div>
                                                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                                                    <span>{contact.phoneNumber || "Pas de numéro"}</span>
                                                    {contact.email && (
                                                        <span className="truncate">{contact.email}</span>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Edit button with popover for invalid contacts */}
                                            {!isValid && (
                                                <ContactEditPopover
                                                    contact={contact}
                                                    enterpriseId={enterpriseId}
                                                    onUpdate={handleContactUpdate}
                                                >
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        className="h-8 px-2 shrink-0"
                                                        onClick={(e) => e.stopPropagation()}
                                                    >
                                                        <Edit2 size={14} variant="Bulk" color="currentColor" />
                                                    </Button>
                                                </ContactEditPopover>
                                            )}

                                            {isSelected && (
                                                <TickCircle size={20} variant="Bulk" color="currentColor" className="text-primary shrink-0" />
                                            )}
                                        </div>
                                    )
                                })}

                                {/* Load more button */}
                                {hasMore && !searchQuery && (
                                    <div className="pt-4 pb-2 px-2">
                                        <Button
                                            variant="outline"
                                            className="w-full"
                                            onClick={loadMore}
                                            disabled={isLoadingMore}
                                        >
                                            {isLoadingMore ? (
                                                <>
                                                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                                                    Chargement...
                                                </>
                                            ) : (
                                                <>
                                                    <ArrowDown2 size={16} color="currentColor" variant="Bulk" className="mr-2" />
                                                    Charger plus ({contacts.length} / {totalElements})
                                                </>
                                            )}
                                        </Button>
                                    </div>
                                )}
                            </div>
                        )}
                    </ScrollArea>
                </div>

                <DialogFooter className="flex gap-2">
                    <Button variant="outline" onClick={onClose}>
                        Annuler
                    </Button>
                    <Button onClick={handleConfirm} disabled={selectedIds.size === 0}>
                        <TickCircle size={16} color="currentColor" variant="Bulk" className="mr-2" />
                        Ajouter {selectedIds.size} contact(s)
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
