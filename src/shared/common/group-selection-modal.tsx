"use client"

import { useState, type ReactNode } from "react"
import { Button } from "@/shared/ui/button"
import { ScrollArea } from "@/shared/ui/scroll-area"
import { Badge } from "@/shared/ui/badge"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/shared/ui/dialog"
import {
    Drawer,
    DrawerContent,
    DrawerDescription,
    DrawerHeader,
    DrawerTitle,
} from "@/shared/ui/drawer"
import { People, User as UserIcon, TickCircle, SearchNormal1, Folder2 } from "iconsax-react"
import { Loader2, Plus } from "lucide-react"
import type { EnterpriseContactResponseType } from "@/core/models/contact-new"
import { useGroups } from "@/core/hooks/useGroups"
import { toast } from "sonner"
import { useMediaQuery } from "@/core/hooks/useMediaQuery"
import { useT } from "@/core/hooks"
import { cn } from "@/lib/utils"

interface GroupSelectionModalProps {
    isOpen: boolean
    onClose: () => void
    onGroupsSelected: (contacts: EnterpriseContactResponseType[]) => void
    enterpriseId: string
}

function HeroHeader({ title, description }: { title: ReactNode; description: ReactNode }) {
    return (
        <div className="relative bg-gradient-to-br from-primary/10 via-primary/5 to-transparent border-b border-border/60 px-5 py-5">
            <div className="absolute inset-0 opacity-40 [background-image:radial-gradient(circle_at_top_right,theme(colors.primary/15),transparent_60%)]" />
            <div className="relative flex items-start gap-3">
                <div className="rounded-xl bg-primary/15 p-2.5 ring-1 ring-primary/20">
                    <Folder2 size={20} color="currentColor" variant="Bulk" className="text-primary" />
                </div>
                <div className="flex-1 text-left">
                    {title}
                    {description}
                </div>
            </div>
        </div>
    )
}

export function GroupSelectionModal({
    isOpen,
    onClose,
    onGroupsSelected,
    enterpriseId,
}: GroupSelectionModalProps) {
    const { t } = useT()
    const [selectedGroupIds, setSelectedGroupIds] = useState<string[]>([])
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [search, setSearch] = useState("")

    const isDesktop = useMediaQuery("(min-width: 768px)")
    const { groups, isLoading, error } = useGroups({
        enterpriseId: enterpriseId || "",
        autoLoad: true
    })

    const filteredGroups = search
        ? groups.filter(g => g.name.toLowerCase().includes(search.toLowerCase()))
        : groups

    const toggleGroupSelection = (groupId: string) => {
        setSelectedGroupIds(prev =>
            prev.includes(groupId)
                ? prev.filter(id => id !== groupId)
                : [...prev, groupId]
        )
    }

    const totalContacts = groups
        .filter(g => selectedGroupIds.includes(g.id))
        .reduce((sum, g) => sum + (g.enterpriseContacts?.length || 0), 0)

    const handleConfirm = async () => {
        if (selectedGroupIds.length === 0) {
            toast.error(t("groupSelection.selectAtLeastOne"))
            return
        }

        setIsSubmitting(true)
        try {
            const selectedGroups = groups.filter(group => selectedGroupIds.includes(group.id))
            const allContacts: EnterpriseContactResponseType[] = []
            selectedGroups.forEach(group => {
                if (group.enterpriseContacts && group.enterpriseContacts.length > 0) {
                    allContacts.push(...group.enterpriseContacts)
                }
            })

            const uniqueContacts = allContacts.filter((contact, index, self) =>
                index === self.findIndex(c => c.id === contact.id)
            )

            if (uniqueContacts.length === 0) {
                toast.error(t("groupSelection.noContactsInGroups"))
                return
            }

            onGroupsSelected(uniqueContacts)
            toast.success(t("groupSelection.contactsAdded", { contacts: uniqueContacts.length, groups: selectedGroupIds.length }))
            onClose()
            setSelectedGroupIds([])
            setSearch("")
        } catch (error) {
            toast.error(t("groupSelection.fetchError"))
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleClose = () => {
        onClose()
        setSearch("")
    }

    const titleNode = (
        <div className="flex items-center gap-2 flex-wrap">
            <span className="text-base font-semibold text-foreground">{t("groupSelection.title")}</span>
            {selectedGroupIds.length > 0 && (
                <Badge variant="secondary" className="text-[10px] font-normal">
                    {selectedGroupIds.length} {t("groupSelection.groupSuffix")}
                </Badge>
            )}
        </div>
    )
    const descriptionText = t("groupSelection.subtitle")

    const body = (
        <div className="px-5 py-5 space-y-4">
            {/* Search */}
            {groups.length > 5 && (
                <div className="relative">
                    <SearchNormal1 size={16} color="currentColor" className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder={t("groupSelection.searchPlaceholder")}
                        className="w-full pl-10 pr-3 h-10 text-sm rounded-lg bg-background border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40 transition-all"
                    />
                </div>
            )}

            {/* Group list */}
            {isLoading ? (
                <div className="space-y-2">
                    {[1, 2, 3].map(i => (
                        <div key={i} className="h-16 bg-muted/40 animate-pulse rounded-xl" />
                    ))}
                </div>
            ) : filteredGroups.length === 0 ? (
                <div className="text-center py-12">
                    <div className="w-14 h-14 rounded-2xl bg-muted/50 flex items-center justify-center mx-auto mb-3">
                        <People size={24} color="currentColor" variant="Bulk" className="text-muted-foreground" />
                    </div>
                    {error ? (
                        <>
                            <p className="text-sm font-medium text-foreground mb-1">{t("groupSelection.serviceUnavailable")}</p>
                            <p className="text-xs text-muted-foreground">{t("groupSelection.contactAdmin")}</p>
                        </>
                    ) : search ? (
                        <p className="text-sm text-muted-foreground">{t("groupSelection.noGroupFoundFor", { search })}</p>
                    ) : (
                        <p className="text-sm text-muted-foreground">{t("groupSelection.noGroupAvailable")}</p>
                    )}
                </div>
            ) : (
                <ScrollArea className="h-[300px] -mx-1 px-1">
                    <div className="space-y-1.5">
                        {filteredGroups.map(group => {
                            const isSelected = selectedGroupIds.includes(group.id)
                            const contactCount = group.enterpriseContacts?.length || 0
                            return (
                                <button
                                    key={group.id}
                                    type="button"
                                    onClick={() => toggleGroupSelection(group.id)}
                                    className={cn(
                                        "w-full flex items-center gap-3 p-3 rounded-xl text-left border transition-all duration-150",
                                        isSelected
                                            ? "bg-primary/8 border-primary/30 shadow-sm"
                                            : "bg-card border-border hover:bg-muted/40 hover:border-border"
                                    )}
                                >
                                    {/* Checkbox */}
                                    <div className={cn(
                                        "w-5 h-5 rounded-md shrink-0 flex items-center justify-center transition-all",
                                        isSelected
                                            ? "bg-primary text-white"
                                            : "border-2 border-border"
                                    )}>
                                        {isSelected && <TickCircle size={14} color="currentColor" variant="Bold" />}
                                    </div>

                                    {/* Icon */}
                                    <div className={cn(
                                        "w-9 h-9 rounded-lg shrink-0 flex items-center justify-center",
                                        isSelected
                                            ? "bg-primary/15 text-primary"
                                            : "bg-muted/60 text-muted-foreground"
                                    )}>
                                        <Folder2 size={16} color="currentColor" variant="Bulk" />
                                    </div>

                                    {/* Info */}
                                    <div className="flex-1 min-w-0">
                                        <p className={cn(
                                            "text-sm font-medium truncate",
                                            isSelected ? 'text-primary' : 'text-foreground'
                                        )}>
                                            {group.name}
                                        </p>
                                        <div className="flex items-center gap-2 mt-0.5">
                                            <span className="text-[11px] text-muted-foreground flex items-center gap-1">
                                                <UserIcon size={10} color="currentColor" variant="Bulk" />
                                                {contactCount} {t("groupSelection.contactSuffix")}
                                            </span>
                                            {group.code && (
                                                <>
                                                    <span className="text-muted-foreground/40 text-[11px]">•</span>
                                                    <span className="text-[11px] text-muted-foreground font-mono">{group.code}</span>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                </button>
                            )
                        })}
                    </div>
                </ScrollArea>
            )}
        </div>
    )

    const footer = (
        <div className="sticky bottom-0 z-10 flex items-center justify-between gap-3 px-5 py-3.5 border-t border-border/60 bg-background/80 backdrop-blur-md">
            {selectedGroupIds.length > 0 ? (
                <p className="text-xs text-muted-foreground hidden sm:block">
                    <span className="font-semibold text-foreground tabular-nums">{totalContacts}</span> {t("groupSelection.contactsToAdd")}
                </p>
            ) : <span />}
            <div className="flex gap-2 ml-auto">
                <Button
                    variant="outline"
                    onClick={handleClose}
                    disabled={isSubmitting}
                    className="rounded-lg"
                >
                    {t("common.cancel")}
                </Button>
                <Button
                    onClick={handleConfirm}
                    disabled={isSubmitting || selectedGroupIds.length === 0}
                    className={cn(
                        "rounded-lg gap-2 bg-primary text-white font-semibold",
                        "shadow-md shadow-primary/25 hover:shadow-lg hover:shadow-primary/30",
                        "hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
                    )}
                >
                    {isSubmitting ? (
                        <>
                            <Loader2 className="h-4 w-4 animate-spin" />
                            {t("groupSelection.adding")}
                        </>
                    ) : (
                        <>
                            <Plus className="h-4 w-4" />
                            {t("common.add")} {totalContacts > 0 && `(${totalContacts})`}
                        </>
                    )}
                </Button>
            </div>
        </div>
    )

    if (isDesktop) {
        return (
            <Dialog open={isOpen} onOpenChange={handleClose}>
                <DialogContent className="sm:max-w-[520px] p-0 gap-0 overflow-hidden">
                    <HeroHeader
                        title={<DialogTitle asChild>{titleNode}</DialogTitle>}
                        description={
                            <DialogDescription className="text-xs text-muted-foreground mt-0.5">
                                {descriptionText}
                            </DialogDescription>
                        }
                    />
                    {body}
                    {footer}
                </DialogContent>
            </Dialog>
        )
    }

    return (
        <Drawer open={isOpen} onOpenChange={handleClose}>
            <DrawerContent>
                <DrawerHeader className="p-0">
                    <HeroHeader
                        title={<DrawerTitle asChild>{titleNode}</DrawerTitle>}
                        description={
                            <DrawerDescription className="text-xs text-muted-foreground mt-0.5">
                                {descriptionText}
                            </DrawerDescription>
                        }
                    />
                </DrawerHeader>
                {body}
                {footer}
            </DrawerContent>
        </Drawer>
    )
}
