"use client"

import { useState, useMemo } from "react"
import { Button } from "@/shared/ui/button"
import { Input } from "@/shared/ui/input"
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
import { Add, People, User, TickCircle, SearchNormal1 } from "iconsax-react"
import { Loader2 } from "lucide-react"
import type { EnterpriseContactResponseType } from "@/core/models/contact-new"
import { useGroups } from "@/core/hooks/useGroups"
import { toast } from "sonner"
import { useMediaQuery } from "@/core/hooks/useMediaQuery"
import { cn } from "@/lib/utils"

interface AddToGroupModalProps {
    isOpen: boolean
    onClose: () => void
    contacts: EnterpriseContactResponseType[]
    enterpriseId: string
}

export function AddToGroupModal({
    isOpen,
    onClose,
    contacts,
    enterpriseId,
}: AddToGroupModalProps) {
    const [selectedGroupId, setSelectedGroupId] = useState("")
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [newGroupName, setNewGroupName] = useState("")
    const [newGroupCode, setNewGroupCode] = useState("")
    const [activeTab, setActiveTab] = useState<"existing" | "new">("existing")
    const [searchQuery, setSearchQuery] = useState("")

    const isDesktop = useMediaQuery("(min-width: 768px)")
    const { groups, isLoading, createGroup, addContactsToGroup } = useGroups({
        enterpriseId: enterpriseId || "",
        autoLoad: true
    })

    const filteredGroups = useMemo(() => {
        if (!searchQuery.trim()) return groups
        const q = searchQuery.toLowerCase()
        return groups.filter(g =>
            g.name.toLowerCase().includes(q) ||
            g.code?.toLowerCase().includes(q)
        )
    }, [groups, searchQuery])

    const handleAddToExistingGroup = async () => {
        if (!selectedGroupId) {
            toast.error("Veuillez sélectionner un groupe")
            return
        }

        setIsSubmitting(true)
        try {
            await addContactsToGroup(selectedGroupId, contacts.map(c => c.id))
            toast.success("Contacts ajoutés au groupe", {
                description: `${contacts.length} contact(s) ajouté(s) avec succès`,
            })
            onClose()
        } catch (error) {
            toast.error("Erreur lors de l'ajout au groupe")
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleCreateAndAdd = async () => {
        if (!newGroupName.trim()) {
            toast.error("Veuillez entrer un nom de groupe")
            return
        }

        setIsSubmitting(true)
        try {
            const newGroup = await createGroup({
                name: newGroupName.trim(),
                code: newGroupCode.trim() || "",
                enterpriseId: enterpriseId,
            })

            await addContactsToGroup(newGroup.id, contacts.map(c => c.id))

            toast.success("Groupe créé et contacts ajoutés", {
                description: `Le groupe "${newGroupName}" a été créé avec ${contacts.length} contact(s)`,
            })
            onClose()
        } catch (error) {
            toast.error("Erreur lors de la création du groupe")
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleSubmit = () => {
        if (activeTab === "existing") {
            handleAddToExistingGroup()
        } else {
            handleCreateAndAdd()
        }
    }

    const content = (
        <div className="flex flex-col">
            {/* Selected contacts summary */}
            <div className="px-5 py-3 bg-muted/30 border-b border-border/40">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <People size={14} color="currentColor" variant="Bulk" />
                        Contacts sélectionnés
                    </div>
                    <span className="text-xs font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full tabular-nums">
                        {contacts.length}
                    </span>
                </div>
                {contacts.length <= 4 ? (
                    <div className="flex flex-wrap gap-1.5 mt-2">
                        {contacts.map(contact => (
                            <span key={contact.id} className="inline-flex items-center gap-1 text-[11px] bg-background border border-border/50 rounded-lg px-2 py-1">
                                <User size={12} color="currentColor" variant="Bulk" className="text-muted-foreground" />
                                <span className="truncate max-w-[120px]">{contact.firstname} {contact.lastname}</span>
                            </span>
                        ))}
                    </div>
                ) : (
                    <div className="flex flex-wrap gap-1.5 mt-2">
                        {contacts.slice(0, 3).map(contact => (
                            <span key={contact.id} className="inline-flex items-center gap-1 text-[11px] bg-background border border-border/50 rounded-lg px-2 py-1">
                                <User size={12} color="currentColor" variant="Bulk" className="text-muted-foreground" />
                                <span className="truncate max-w-[100px]">{contact.firstname} {contact.lastname}</span>
                            </span>
                        ))}
                        <span className="inline-flex items-center text-[11px] text-muted-foreground bg-muted/50 rounded-lg px-2 py-1 tabular-nums">
                            +{contacts.length - 3} autre{contacts.length - 3 > 1 ? "s" : ""}
                        </span>
                    </div>
                )}
            </div>

            {/* Tab switcher */}
            <div className="px-5 pt-4 pb-3">
                <div className="flex gap-1 p-1 bg-muted/40 rounded-xl">
                    <button
                        type="button"
                        onClick={() => setActiveTab("existing")}
                        className={cn(
                            "flex-1 flex items-center justify-center gap-1.5 text-xs font-medium py-2 rounded-lg transition-all",
                            activeTab === "existing"
                                ? "bg-background shadow-sm text-foreground"
                                : "text-muted-foreground hover:text-foreground"
                        )}
                    >
                        <People size={14} color="currentColor" variant="Bulk" />
                        Groupe existant
                    </button>
                    <button
                        type="button"
                        onClick={() => setActiveTab("new")}
                        className={cn(
                            "flex-1 flex items-center justify-center gap-1.5 text-xs font-medium py-2 rounded-lg transition-all",
                            activeTab === "new"
                                ? "bg-background shadow-sm text-foreground"
                                : "text-muted-foreground hover:text-foreground"
                        )}
                    >
                        <Add size={14} color="currentColor" variant="Bulk" />
                        Nouveau groupe
                    </button>
                </div>
            </div>

            {/* Tab content */}
            <div className="px-5 pb-4">
                {activeTab === "existing" ? (
                    <div className="space-y-2.5">
                        {/* Search */}
                        {groups.length > 4 && (
                            <div className="relative">
                                <SearchNormal1 size={14} color="currentColor" className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                                <Input
                                    placeholder="Rechercher un groupe..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="h-8 pl-8 text-xs rounded-lg"
                                />
                            </div>
                        )}

                        {/* Groups list */}
                        <div className="max-h-[200px] overflow-y-auto space-y-1 pr-1">
                            {isLoading ? (
                                Array.from({ length: 3 }).map((_, i) => (
                                    <div key={i} className="h-12 bg-muted/40 animate-pulse rounded-xl" />
                                ))
                            ) : filteredGroups.length === 0 ? (
                                <div className="text-center py-6">
                                    <People size={24} color="currentColor" variant="Bulk" className="text-muted-foreground/40 mx-auto mb-2" />
                                    <p className="text-xs text-muted-foreground">
                                        {searchQuery ? "Aucun groupe trouvé" : "Aucun groupe disponible"}
                                    </p>
                                </div>
                            ) : (
                                filteredGroups.map(group => {
                                    const isSelected = selectedGroupId === group.id
                                    const contactCount = group.enterpriseContacts?.length || 0
                                    return (
                                        <button
                                            type="button"
                                            key={group.id}
                                            className={cn(
                                                "w-full flex items-center gap-3 p-2.5 rounded-xl text-left transition-all",
                                                isSelected
                                                    ? "bg-primary/8 border border-primary/30"
                                                    : "hover:bg-muted/40 border border-transparent"
                                            )}
                                            onClick={() => setSelectedGroupId(group.id)}
                                        >
                                            <div className={cn(
                                                "w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-colors",
                                                isSelected ? "bg-primary text-primary-foreground" : "bg-muted/50"
                                            )}>
                                                {isSelected ? (
                                                    <TickCircle size={16} color="currentColor" variant="Bulk" />
                                                ) : (
                                                    <People size={16} color="currentColor" variant="Bulk" className="text-muted-foreground" />
                                                )}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className={cn("text-sm font-medium truncate", isSelected && "text-primary")}>
                                                    {group.name}
                                                </p>
                                                <p className="text-[11px] text-muted-foreground">
                                                    {group.code && `${group.code} · `}{contactCount} contact{contactCount !== 1 ? "s" : ""}
                                                </p>
                                            </div>
                                        </button>
                                    )
                                })
                            )}
                        </div>
                    </div>
                ) : (
                    <div className="space-y-3 bg-muted/10 p-3 rounded-lg">
                        <div className="space-y-1.5">
                            <label className="text-xs font-medium text-muted-foreground">
                                Nom du groupe <span className="text-red-500">*</span>
                            </label>
                            <Input
                                placeholder="Ex: Clients VIP"
                                value={newGroupName}
                                onChange={(e) => setNewGroupName(e.target.value)}
                                className="h-9 rounded-xl text-sm"
                            />
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-xs font-medium text-muted-foreground">
                                Code <span className="text-[11px] text-muted-foreground/60">(optionnel)</span>
                            </label>
                            <Input
                                placeholder="Ex: GRP-VIP"
                                value={newGroupCode}
                                onChange={(e) => setNewGroupCode(e.target.value)}
                                className="h-9 rounded-xl text-sm"
                            />
                        </div>
                    </div>
                )}
            </div>

            {/* Footer */}
            <div className="flex items-center gap-2 px-5 py-4 border-t border-border/50 bg-muted/20">
                <Button
                    variant="outline"
                    onClick={onClose}
                    disabled={isSubmitting}
                    className="flex-1 sm:flex-none rounded-xl"
                >
                    Annuler
                </Button>
                <Button
                    onClick={handleSubmit}
                    disabled={isSubmitting || (activeTab === "existing" && !selectedGroupId) || (activeTab === "new" && !newGroupName.trim())}
                    className="flex-1 sm:flex-none sm:min-w-[160px] rounded-xl gap-2"
                >
                    {isSubmitting ? (
                        <>
                            <Loader2 className="h-4 w-4 animate-spin" />
                            Traitement...
                        </>
                    ) : activeTab === "existing" ? (
                        <>
                            <People size={16} color="currentColor" variant="Bulk" />
                            Ajouter au groupe
                        </>
                    ) : (
                        <>
                            <Add size={16} color="currentColor" variant="Bulk" />
                            Créer et ajouter
                        </>
                    )}
                </Button>
            </div>
        </div>
    )

    if (isDesktop) {
        return (
            <Dialog open={isOpen} onOpenChange={onClose}>
                <DialogContent className="sm:max-w-[480px] p-0 rounded-2xl overflow-hidden">
                    <DialogHeader className="px-5 pt-5 pb-0">
                        <DialogTitle className="text-lg flex items-center gap-2">
                            <div className="rounded-lg bg-primary/10 p-1.5">
                                <People size={18} variant="Bulk" color="currentColor" className="text-primary" />
                            </div>
                            Ajouter à un groupe
                        </DialogTitle>
                    </DialogHeader>
                    {content}
                </DialogContent>
            </Dialog>
        )
    }

    return (
        <Drawer open={isOpen} onOpenChange={onClose}>
            <DrawerContent>
                <DrawerHeader className="text-left px-5 pb-0">
                    <DrawerTitle className="text-lg flex items-center gap-2">
                        <div className="rounded-lg bg-primary/10 p-1.5">
                            <People size={18} variant="Bulk" color="currentColor" className="text-primary" />
                        </div>
                        Ajouter à un groupe
                    </DrawerTitle>
                </DrawerHeader>
                {content}
            </DrawerContent>
        </Drawer>
    )
}
