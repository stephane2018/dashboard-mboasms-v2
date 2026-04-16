"use client"

import { useState, useEffect, useMemo, useCallback } from "react"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
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
import { SearchNormal1, People, TickCircle, Warning2, ArrowDown2, Edit2, ProfileAdd } from "iconsax-react"
import { Loader2 } from "lucide-react"
import type { EnterpriseContactResponseType, PaginatedEnterpriseContactsResponseType } from "@/core/models/contact-new"
import { contactService } from "@/core/services/contact.service"
import { getPhoneValidationStatus } from "@/core/utils/phone-validation"
import { useSettingsStore } from "@/core/stores"
import { useAuth } from "@/core/hooks/useAuth"
import { ContactEditPopover } from "./contact-edit-popover"
import { cn } from "@/lib/utils"
import { useT } from "@/core/hooks"

const EMPTY_SELECTED_IDS: string[] = []

interface ContactSelectionModalProps {
    isOpen: boolean
    onClose: () => void
    onSelectContacts: (contacts: EnterpriseContactResponseType[]) => void
    selectedContactIds?: string[]
    existingContactIds?: string[]
    enterpriseId?: string
}

const PAGE_SIZE_OPTIONS = [5, 15, 25, 50, 100, 200]

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
    existingContactIds = EMPTY_SELECTED_IDS,
    enterpriseId: propEnterpriseId,
}: ContactSelectionModalProps) {
    const { t } = useT()
    const { user } = useAuth()
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

    const enterpriseId = propEnterpriseId || user?.companyId || ""
    const alreadyInGroupIds = useMemo(() => new Set(existingContactIds), [existingContactIds])

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
            const response = await contactService.getContactsByEnterprise(
                enterpriseId,
                { page: reset ? 0 : pageToLoad, size: contactsPageSize }
            ) as unknown as PaginatedEnterpriseContactsResponseType

            if (response && 'content' in response && Array.isArray(response.content)) {
                const newContacts = response.content
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
                setContacts(response as EnterpriseContactResponseType[])
                setHasMore(false)
            } else {
                setContacts([])
            }
        } catch (error) {
            setContacts([])
        } finally {
            setIsLoading(false)
            setIsLoadingMore(false)
        }
    }, [enterpriseId, currentPage, contactsPageSize])

    const loadMore = useCallback(() => {
        if (hasMore && !isLoadingMore && !isLoading) {
            loadContacts(false)
        }
    }, [hasMore, isLoadingMore, isLoading, loadContacts])

    const handlePageSizeChange = (value: string) => {
        setContactsPageSize(parseInt(value))
    }

    const handleContactUpdate = (updatedContact: EnterpriseContactResponseType) => {
        setContacts(prev => prev.map(c => c.id === updatedContact.id ? updatedContact : c))
    }

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

    const invalidContactsCount = useMemo(() => {
        return filteredContacts.filter(c => getPhoneValidationStatus(c.phoneNumber || "") !== "CORRECT").length
    }, [filteredContacts])

    const toggleContact = (contactId: string, isValid: boolean, isAlreadyInGroup: boolean) => {
        if (!isValid || isAlreadyInGroup) return
        const newSelected = new Set(selectedIds)
        if (newSelected.has(contactId)) {
            newSelected.delete(contactId)
        } else {
            newSelected.add(contactId)
        }
        setSelectedIds(newSelected)
    }

    const selectAll = () => {
        const newSelected = new Set(selectedIds)
        filteredContacts.forEach(c => {
            const isValid = getPhoneValidationStatus(c.phoneNumber || "") === "CORRECT"
            const isAlreadyInGroup = alreadyInGroupIds.has(c.id)
            if (isValid && !isAlreadyInGroup) {
                newSelected.add(c.id)
            }
        })
        setSelectedIds(newSelected)
    }

    const deselectAll = () => setSelectedIds(new Set())

    const handleConfirm = () => {
        const selectedContacts = contacts.filter(c => selectedIds.has(c.id))
        onSelectContacts(selectedContacts)
        onClose()
    }

    const isContactValid = (contact: EnterpriseContactResponseType) =>
        getPhoneValidationStatus(contact.phoneNumber || "") === "CORRECT"

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-3xl p-0 gap-0 overflow-hidden flex flex-col max-h-[92vh]">
                {/* Hero header */}
                <div className="relative bg-gradient-to-br from-primary/10 via-primary/5 to-transparent border-b border-border/60 px-5 py-5">
                    <div className="absolute inset-0 opacity-40 [background-image:radial-gradient(circle_at_top_right,theme(colors.primary/15),transparent_60%)]" />
                    <DialogHeader className="relative">
                        <div className="flex items-start gap-3">
                            <div className="rounded-xl bg-primary/15 p-2.5 ring-1 ring-primary/20">
                                <ProfileAdd size={20} color="currentColor" variant="Bulk" className="text-primary" />
                            </div>
                            <div className="flex-1 text-left">
                                <DialogTitle className="text-base font-semibold text-foreground flex items-center gap-2 flex-wrap">
                                    {t("contactSelection.title")}
                                    {totalElements > 0 && (
                                        <Badge variant="secondary" className="text-[10px] font-normal">
                                            {totalElements} {t("contactSelection.total")}
                                        </Badge>
                                    )}
                                </DialogTitle>
                                <DialogDescription className="text-xs text-muted-foreground mt-0.5">
                                    {t("contactSelection.subtitle")}
                                </DialogDescription>
                            </div>
                        </div>
                    </DialogHeader>
                </div>

                {/* Toolbar */}
                <div className="px-5 pt-4 pb-3 space-y-3 border-b border-border/60">
                    <div className="flex gap-2">
                        <div className="relative flex-1">
                            <SearchNormal1
                                size={16}
                                color="currentColor"
                                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                            />
                            <Input
                                placeholder={t("contactSelection.searchPlaceholder")}
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-10 h-10 rounded-lg"
                            />
                        </div>
                        <Select value={contactsPageSize.toString()} onValueChange={handlePageSizeChange}>
                            <SelectTrigger className="w-24 h-10 rounded-lg">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                {PAGE_SIZE_OPTIONS.map(size => (
                                    <SelectItem key={size} value={size.toString()}>{size}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {!isLoading && invalidContactsCount > 0 && (
                        <div className="flex items-start gap-2 bg-amber-500/10 border border-amber-500/20 text-amber-700 dark:text-amber-400 text-xs p-2.5 rounded-lg">
                            <Warning2 size={14} color="currentColor" variant="Bulk" className="shrink-0 mt-0.5" />
                            <span>{t("contactSelection.invalidContacts", { count: invalidContactsCount })}</span>
                        </div>
                    )}

                    {/* Selection summary */}
                    <div className="flex items-center justify-between rounded-lg bg-muted/40 border border-border/60 px-3 py-2">
                        <div className="flex items-center gap-2 text-xs">
                            <span className="font-semibold text-foreground tabular-nums">
                                {selectedIds.size}
                            </span>
                            <span className="text-muted-foreground">{t("contactSelection.selectedSuffix")}</span>
                            <span className="text-muted-foreground/40">•</span>
                            <span className="text-muted-foreground">{contacts.length} {t("contactSelection.loadedSuffix")}</span>
                        </div>
                        <div className="flex gap-1">
                            <Button variant="ghost" size="sm" onClick={selectAll} disabled={isLoading} className="h-7 text-[11px] rounded-md">
                                {t("contactSelection.selectAll")}
                            </Button>
                            <Button variant="ghost" size="sm" onClick={deselectAll} disabled={isLoading} className="h-7 text-[11px] rounded-md">
                                {t("contactSelection.deselectAll")}
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Contact list */}
                <div className="flex-1 min-h-0">
                    <ScrollArea className="h-[420px]">
                        {isLoading ? (
                            <div className="p-3 space-y-1.5">
                                {Array.from({ length: 8 }).map((_, i) => (<ContactSkeleton key={i} />))}
                            </div>
                        ) : filteredContacts.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
                                <div className="w-14 h-14 rounded-2xl bg-muted/50 flex items-center justify-center mb-3">
                                    <People size={26} color="currentColor" variant="Bulk" className="text-muted-foreground" />
                                </div>
                                <p className="text-sm text-muted-foreground">
                                    {searchQuery ? t("contactSelection.noContactFound") : t("contactSelection.noContactAvailable")}
                                </p>
                            </div>
                        ) : (
                            <div className="p-3 space-y-1">
                                {filteredContacts.map((contact) => {
                                    const isSelected = selectedIds.has(contact.id)
                                    const isValid = isContactValid(contact)
                                    const isAlreadyInGroup = alreadyInGroupIds.has(contact.id)
                                    const isSelectable = isValid && !isAlreadyInGroup
                                    const initials = `${contact.firstname?.[0] ?? ''}${contact.lastname?.[0] ?? ''}`.toUpperCase() || '?'

                                    return (
                                        <div
                                            key={contact.id}
                                            onClick={() => toggleContact(contact.id, isValid, isAlreadyInGroup)}
                                            className={cn(
                                                "flex items-center gap-3 p-2.5 rounded-lg border transition-all",
                                                isSelectable ? "cursor-pointer" : "cursor-default",
                                                isSelected
                                                    ? "bg-primary/10 border-primary/30 shadow-sm"
                                                    : isSelectable
                                                        ? "border-transparent hover:bg-muted/50 hover:border-border/60"
                                                        : isAlreadyInGroup
                                                            ? "bg-blue-500/5 border-blue-500/15"
                                                            : "bg-red-500/5 border-red-500/15"
                                            )}
                                        >
                                            <Checkbox
                                                checked={isSelected}
                                                onCheckedChange={() => toggleContact(contact.id, isValid, isAlreadyInGroup)}
                                                disabled={!isSelectable}
                                            />
                                            <div className={cn(
                                                "h-9 w-9 rounded-lg flex items-center justify-center text-[11px] font-semibold shrink-0",
                                                isSelected
                                                    ? "bg-primary/15 text-primary"
                                                    : isAlreadyInGroup
                                                        ? "bg-blue-500/10 text-blue-600 dark:text-blue-400"
                                                        : !isValid
                                                            ? "bg-red-500/10 text-red-600 dark:text-red-400"
                                                            : "bg-muted text-muted-foreground"
                                            )}>
                                                {initials}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-1.5 flex-wrap">
                                                    <span className={cn("text-sm font-medium truncate", !isValid && "text-muted-foreground")}>
                                                        {contact.firstname} {contact.lastname}
                                                    </span>
                                                    {!isValid && (
                                                        <Badge variant="destructive" className="text-[9px] px-1.5 py-0 h-4">
                                                            {t("contactSelection.invalid")}
                                                        </Badge>
                                                    )}
                                                    {isAlreadyInGroup && (
                                                        <Badge variant="outline" className="text-[9px] px-1.5 py-0 h-4 text-blue-600 border-blue-500/40 bg-blue-500/5">
                                                            {t("contactSelection.alreadyInGroup")}
                                                        </Badge>
                                                    )}
                                                </div>
                                                <div className="flex items-center gap-2 text-[11px] text-muted-foreground mt-0.5">
                                                    <span className="font-mono">{contact.phoneNumber || t("contactSelection.noNumber")}</span>
                                                    {contact.email && (
                                                        <>
                                                            <span className="text-muted-foreground/40">•</span>
                                                            <span className="truncate">{contact.email}</span>
                                                        </>
                                                    )}
                                                </div>
                                            </div>

                                            {!isSelectable && !isAlreadyInGroup && (
                                                <ContactEditPopover
                                                    contact={contact}
                                                    enterpriseId={enterpriseId}
                                                    onUpdate={handleContactUpdate}
                                                >
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        className="h-8 px-2 shrink-0 rounded-md"
                                                        onClick={(e) => e.stopPropagation()}
                                                    >
                                                        <Edit2 size={13} variant="Bulk" color="currentColor" />
                                                    </Button>
                                                </ContactEditPopover>
                                            )}

                                            {isSelected && (
                                                <TickCircle size={18} variant="Bulk" color="currentColor" className="text-primary shrink-0" />
                                            )}
                                        </div>
                                    )
                                })}

                                {hasMore && !searchQuery && (
                                    <div className="pt-3 pb-1 px-1">
                                        <Button
                                            variant="outline"
                                            className="w-full h-9 rounded-lg gap-2"
                                            onClick={loadMore}
                                            disabled={isLoadingMore}
                                        >
                                            {isLoadingMore ? (
                                                <>
                                                    <Loader2 className="h-4 w-4 animate-spin" />
                                                    {t("common.loading")}
                                                </>
                                            ) : (
                                                <>
                                                    <ArrowDown2 size={14} color="currentColor" variant="Bulk" />
                                                    {t("contactSelection.loadMore")} <span className="text-muted-foreground tabular-nums">({contacts.length}/{totalElements})</span>
                                                </>
                                            )}
                                        </Button>
                                    </div>
                                )}
                            </div>
                        )}
                    </ScrollArea>
                </div>

                {/* Sticky footer */}
                <div className="flex items-center justify-end gap-2 px-5 py-3.5 border-t border-border/60 bg-background/80 backdrop-blur-md">
                    <Button variant="outline" onClick={onClose} className="rounded-lg">
                        {t("common.cancel")}
                    </Button>
                    <Button
                        onClick={handleConfirm}
                        disabled={selectedIds.size === 0}
                        className={cn(
                            "rounded-lg gap-2 bg-primary text-white font-semibold",
                            "shadow-md shadow-primary/25 hover:shadow-lg hover:shadow-primary/30",
                            "hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
                        )}
                    >
                        <TickCircle size={14} color="currentColor" variant="Bulk" />
                        {t("contactSelection.addContacts", { count: selectedIds.size })}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}
