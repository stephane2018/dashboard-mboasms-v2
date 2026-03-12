"use client"

import { useState } from "react"
import { Button } from "@/shared/ui/button"
import { ScrollArea } from "@/shared/ui/scroll-area"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/shared/ui/dialog"
import {
    Drawer,
    DrawerContent,
    DrawerHeader,
    DrawerTitle,
} from "@/shared/ui/drawer"
import { People, User, TickCircle, SearchNormal1 } from "iconsax-react"
import { Loader2, Plus } from "lucide-react"
import type { EnterpriseContactResponseType } from "@/core/models/contact-new"
import { useGroups } from "@/core/hooks/useGroups"
import { toast } from "sonner"
import { useMediaQuery } from "@/core/hooks/useMediaQuery"

interface GroupSelectionModalProps {
    isOpen: boolean
    onClose: () => void
    onGroupsSelected: (contacts: EnterpriseContactResponseType[]) => void
    enterpriseId: string
}

export function GroupSelectionModal({
    isOpen,
    onClose,
    onGroupsSelected,
    enterpriseId,
}: GroupSelectionModalProps) {
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
            toast.error("Veuillez sélectionner au moins un groupe")
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
                toast.error("Aucun contact trouvé dans les groupes sélectionnés")
                return
            }

            onGroupsSelected(uniqueContacts)
            toast.success(`${uniqueContacts.length} contact(s) ajouté(s) depuis ${selectedGroupIds.length} groupe(s)`)
            onClose()
            setSelectedGroupIds([])
            setSearch("")
        } catch (error) {
            toast.error("Erreur lors de la récupération des contacts")
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleClose = () => {
        onClose()
        setSearch("")
    }

    const content = (
        <div className="space-y-4">
            {/* Search */}
            {groups.length > 5 && (
                <div className="relative">
                    <SearchNormal1 size={16} color="currentColor" className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Rechercher un groupe..."
                        className="w-full pl-9 pr-3 py-2 text-sm rounded-xl bg-muted/40 border border-border/50 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40 transition-all"
                    />
                </div>
            )}

            {/* Group list */}
            {isLoading ? (
                <div className="space-y-2">
                    {[1, 2, 3].map(i => (
                        <div key={i} className="h-14 bg-muted/40 animate-pulse rounded-xl" />
                    ))}
                </div>
            ) : filteredGroups.length === 0 ? (
                <div className="text-center py-10">
                    <div className="w-12 h-12 rounded-full bg-muted/50 flex items-center justify-center mx-auto mb-3">
                        <People size={22} color="currentColor" variant="Bulk" className="text-muted-foreground" />
                    </div>
                    {error ? (
                        <>
                            <p className="text-sm font-medium text-foreground mb-1">Service indisponible</p>
                            <p className="text-xs text-muted-foreground">Contactez l&apos;administrateur</p>
                        </>
                    ) : search ? (
                        <p className="text-sm text-muted-foreground">Aucun groupe trouvé pour &quot;{search}&quot;</p>
                    ) : (
                        <p className="text-sm text-muted-foreground">Aucun groupe disponible</p>
                    )}
                </div>
            ) : (
                <ScrollArea className="h-[280px] -mx-1 px-1">
                    <div className="space-y-1.5">
                        {filteredGroups.map(group => {
                            const isSelected = selectedGroupIds.includes(group.id)
                            const contactCount = group.enterpriseContacts?.length || 0
                            return (
                                <button
                                    key={group.id}
                                    type="button"
                                    className={`w-full border border-border flex items-center gap-3 p-3 rounded-xl text-left transition-all duration-150 ${
                                        isSelected
                                            ? "bg-primary/8 border-primary/25 shadow-sm"
                                            : "bg-card hover:bg-muted/40"
                                    }`}
                                    onClick={() => toggleGroupSelection(group.id)}
                                >
                                    {/* Checkbox */}
                                    <div className={`w-5 h-5 rounded-md shrink-0 flex items-center justify-center transition-all ${
                                        isSelected
                                            ? "bg-primary text-white"
                                            : "border-2 border-border"
                                    }`}>
                                        {isSelected && <TickCircle size={14} color="currentColor" variant="Bold" />}
                                    </div>

                                    {/* Icon */}
                                    <div className={`w-8 h-8 rounded-lg shrink-0 flex items-center justify-center ${
                                        isSelected
                                            ? "bg-primary/10 text-primary"
                                            : "bg-muted/50 text-muted-foreground"
                                    }`}>
                                        <People size={16} color="currentColor" variant="Bulk" />
                                    </div>

                                    {/* Info */}
                                    <div className="flex-1 min-w-0">
                                        <p className={`text-sm font-medium truncate ${isSelected ? 'text-primary' : 'text-foreground'}`}>
                                            {group.name}
                                        </p>
                                        <div className="flex items-center gap-2 mt-0.5">
                                            <span className="text-[11px] text-muted-foreground flex items-center gap-1">
                                                <User size={10} color="currentColor" variant="Bulk" />
                                                {contactCount} contact{contactCount !== 1 ? 's' : ''}
                                            </span>
                                            {group.code && (
                                                <span className="text-[11px] text-muted-foreground">
                                                    &middot; {group.code}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </button>
                            )
                        })}
                    </div>
                </ScrollArea>
            )}

            {/* Footer with selection summary + actions */}
            <div className="border-t border-border/50 pt-3 space-y-3">
                {selectedGroupIds.length > 0 && (
                    <div className="flex items-center justify-between text-xs px-1">
                        <span className="text-muted-foreground">
                            {selectedGroupIds.length} groupe{selectedGroupIds.length > 1 ? 's' : ''}
                        </span>
                        <span className="font-medium text-foreground">
                            {totalContacts} contact{totalContacts !== 1 ? 's' : ''}
                        </span>
                    </div>
                )}

                <div className="flex gap-2">
                    <Button
                        variant="ghost"
                        onClick={handleClose}
                        disabled={isSubmitting}
                        className="flex-1 rounded-xl"
                    >
                        Annuler
                    </Button>
                    <Button
                        onClick={handleConfirm}
                        disabled={isSubmitting || selectedGroupIds.length === 0}
                        className="flex-1 rounded-xl gap-1.5"
                    >
                        {isSubmitting ? (
                            <>
                                <Loader2 className="h-4 w-4 animate-spin" />
                                Ajout...
                            </>
                        ) : (
                            <>
                                <Plus className="h-4 w-4" />
                                Ajouter ({totalContacts})
                            </>
                        )}
                    </Button>
                </div>
            </div>
        </div>
    )

    if (isDesktop) {
        return (
            <Dialog open={isOpen} onOpenChange={handleClose}>
                <DialogContent className="sm:max-w-[440px] p-0 rounded-2xl overflow-hidden">
                    <DialogHeader className="px-5 pt-5 pb-0">
                        <DialogTitle className="text-base flex items-center gap-2">
                            <div className="rounded-lg bg-primary/10 p-1.5">
                                <People size={16} color="currentColor" variant="Bulk" className="text-primary" />
                            </div>
                            Sélectionner des groupes
                        </DialogTitle>
                        <p className="text-xs text-muted-foreground mt-1">
                            Ajoutez tous les contacts des groupes sélectionnés
                        </p>
                    </DialogHeader>
                    <div className="px-5 pb-5 pt-3">
                        {content}
                    </div>
                </DialogContent>
            </Dialog>
        )
    }

    return (
        <Drawer open={isOpen} onOpenChange={handleClose}>
            <DrawerContent>
                <DrawerHeader className="text-left pb-2">
                    <DrawerTitle className="text-base flex items-center gap-2">
                        <div className="rounded-lg bg-primary/10 p-1.5">
                            <People size={16} color="currentColor" variant="Bulk" className="text-primary" />
                        </div>
                        Sélectionner des groupes
                    </DrawerTitle>
                    <p className="text-xs text-muted-foreground mt-1">
                        Ajoutez tous les contacts des groupes sélectionnés
                    </p>
                </DrawerHeader>
                <div className="px-4 pb-4">
                    {content}
                </div>
            </DrawerContent>
        </Drawer>
    )
}
