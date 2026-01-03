"use client"

import { useState } from "react"
import { Button } from "@/shared/ui/button"
import { ScrollArea } from "@/shared/ui/scroll-area"
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
import { People, User, Add, CloseCircle } from "iconsax-react"
import { Loader2 } from "lucide-react"
import type { GroupType } from "@/core/models/groups"
import type { EnterpriseContactResponseType } from "@/core/models/contact"
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

    const isDesktop = useMediaQuery("(min-width: 768px)")
    const { groups, isLoading, error } = useGroups({ 
        enterpriseId: enterpriseId || "",
        autoLoad: true 
    })

    const toggleGroupSelection = (groupId: string) => {
        setSelectedGroupIds(prev => 
            prev.includes(groupId) 
                ? prev.filter(id => id !== groupId)
                : [...prev, groupId]
        )
    }

    const handleConfirm = async () => {
        if (selectedGroupIds.length === 0) {
            toast.error("Veuillez sélectionner au moins un groupe")
            return
        }

        setIsSubmitting(true)
        try {
            // Récupérer tous les contacts des groupes sélectionnés
            const selectedGroups = groups.filter(group => selectedGroupIds.includes(group.id))
            const allContacts: EnterpriseContactResponseType[] = []
            
            selectedGroups.forEach(group => {
                if (group.enterpriseContacts && group.enterpriseContacts.length > 0) {
                    allContacts.push(...group.enterpriseContacts)
                }
            })

            // Supprimer les doublons basés sur l'ID du contact
            const uniqueContacts = allContacts.filter((contact, index, self) => 
                index === self.findIndex(c => c.id === contact.id)
            )

            if (uniqueContacts.length === 0) {
                toast.error("Aucun contact trouvé dans les groupes sélectionnés")
                return
            }

            onGroupsSelected(uniqueContacts)
            toast.success(`${uniqueContacts.length} contact(s) trouvé(s) dans ${selectedGroupIds.length} groupe(s)`)
            onClose()
            setSelectedGroupIds([])
        } catch (error) {
            toast.error("Erreur lors de la récupération des contacts")
            console.error("Group selection error:", error)
        } finally {
            setIsSubmitting(false)
        }
    }

    const content = (
        <div className="space-y-6">
            <div>
                <p className="text-sm text-muted-foreground mb-4">
                    Sélectionnez un ou plusieurs groupes pour ajouter tous leurs contacts
                </p>
                
                {isLoading ? (
                    <div className="space-y-3">
                        <div className="h-16 bg-muted animate-pulse rounded-lg" />
                        <div className="h-16 bg-muted animate-pulse rounded-lg" />
                        <div className="h-16 bg-muted animate-pulse rounded-lg" />
                    </div>
                ) : groups.length === 0 ? (
                    <div className="text-center py-8">
                        <People className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                        {error ? (
                            <>
                                <p className="text-sm text-muted-foreground mb-2">
                                    Service de groupes indisponible
                                </p>
                                <p className="text-xs text-muted-foreground">
                                    Veuillez contacter l'administrateur pour activer cette fonctionnalité
                                </p>
                            </>
                        ) : (
                            <p className="text-sm text-muted-foreground">
                                Aucun groupe disponible
                            </p>
                        )}
                    </div>
                ) : (
                    <ScrollArea className="h-64 w-full border rounded-md">
                        <div className="p-2 space-y-2">
                            {groups.map(group => (
                                <div
                                    key={group.id}
                                    className={`p-3 rounded-lg cursor-pointer transition-all border ${
                                        selectedGroupIds.includes(group.id)
                                            ? "bg-primary text-primary-foreground border-primary shadow-sm"
                                            : "bg-background hover:bg-muted/50 border-border hover:border-primary/30"
                                    }`}
                                    onClick={() => toggleGroupSelection(group.id)}
                                >
                                    <div className="flex items-start gap-3">
                                        <div className={`rounded-full w-8 h-8 flex items-center justify-center shrink-0 ${
                                            selectedGroupIds.includes(group.id)
                                                ? "bg-primary-foreground/20 text-primary-foreground"
                                                : "bg-primary/10 text-primary"
                                        }`}>
                                            <People className="h-4 w-4" variant="Bulk" color="currentColor"  />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="font-medium text-sm truncate">
                                                {group.name}
                                            </div>
                                            {group.code && (
                                                <div className={`text-xs mt-1 ${
                                                    selectedGroupIds.includes(group.id)
                                                        ? "text-primary-foreground/80"
                                                        : "text-muted-foreground"
                                                }`}>
                                                    Code: {group.code}
                                                </div>
                                            )}
                                            <div className={`text-xs mt-1 flex items-center gap-1 ${
                                                selectedGroupIds.includes(group.id)
                                                    ? "text-primary-foreground/70"
                                                    : "text-muted-foreground"
                                            }`}>
                                                <User className="h-3 w-3" variant="Bulk" color="currentColor" />
                                                {group.enterpriseContacts?.length || 0} contact{group.enterpriseContacts?.length !== 1 ? 's' : ''}
                                            </div>
                                        </div>
                                        {selectedGroupIds.includes(group.id) && (
                                            <div className="bg-primary-foreground/20 rounded-full p-1">
                                                <CloseCircle className="h-4 w-4" variant="Bulk" color="currentColor"  />
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </ScrollArea>
                )}
            </div>

            {selectedGroupIds.length > 0 && (
                <div className="bg-muted/30 rounded-lg p-3 border">
                    <div className="flex items-center gap-2 mb-2">
                        <People className="h-4 w-4 text-primary" variant="Bulk" color="currentColor"  />
                        <span className="text-sm font-medium">
                            {selectedGroupIds.length} groupe{selectedGroupIds.length > 1 ? 's' : ''} sélectionné{selectedGroupIds.length > 1 ? 's' : ''}
                        </span>
                    </div>
                    <div className="text-xs text-muted-foreground">
                        Total des contacts: {groups
                            .filter(g => selectedGroupIds.includes(g.id))
                            .reduce((sum, g) => sum + (g.enterpriseContacts?.length || 0), 0)} 
                    </div>
                </div>
            )}

            <div className="flex justify-end gap-2 pt-4">
                <Button variant="outline" onClick={onClose} disabled={isSubmitting}>
                    Annuler
                </Button>
                <Button 
                    onClick={handleConfirm} 
                    disabled={isSubmitting || selectedGroupIds.length === 0}
                >
                    {isSubmitting ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" color="currentColor" />
                            Traitement...
                        </>
                    ) : (
                        <>
                            <Add className="mr-2 h-4 w-4" color="currentColor"  />
                            Ajouter les contacts
                        </>
                    )}
                </Button>
            </div>
        </div>
    )

    if (isDesktop) {
        return (
            <Dialog open={isOpen} onOpenChange={onClose}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>Sélectionner des groupes</DialogTitle>
                        <DialogDescription>
                            Choisissez les groupes dont vous voulez ajouter les contacts
                        </DialogDescription>
                    </DialogHeader>
                    {content}
                </DialogContent>
            </Dialog>
        )
    }

    return (
        <Drawer open={isOpen} onOpenChange={onClose}>
            <DrawerContent>
                <DrawerHeader className="text-left">
                    <DrawerTitle>Sélectionner des groupes</DrawerTitle>
                    <DrawerDescription>
                        Choisissez les groupes dont vous voulez ajouter les contacts
                    </DrawerDescription>
                </DrawerHeader>
                <div className="px-4 pb-4">
                    {content}
                </div>
            </DrawerContent>
        </Drawer>
    )
}
