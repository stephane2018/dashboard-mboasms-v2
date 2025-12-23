"use client"

import { useState } from "react"
import { Button } from "@/shared/ui/button"
import { Input } from "@/shared/ui/input"
import { Label } from "@/shared/ui/label"
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/ui/tabs"
import { Add, People, User } from "iconsax-react"
import { Loader2 } from "lucide-react"
import type { EnterpriseContactResponseType } from "@/core/models/contact-new"
import { useGroups } from "@/core/hooks/useGroups"
import { toast } from "sonner"
import { useMediaQuery } from "@/core/hooks/useMediaQuery"

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
    const [activeTab, setActiveTab] = useState("existing")

    const isDesktop = useMediaQuery("(min-width: 768px)")
    const { groups, isLoading, createGroup, addContactsToGroup } = useGroups({ 
        enterpriseId: enterpriseId || "",
        autoLoad: true 
    })

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
            console.error("Add to group error:", error)
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
            
            // Add contacts to the newly created group
            await addContactsToGroup(newGroup.id, contacts.map(c => c.id))
            
            toast.success("Groupe créé et contacts ajoutés", {
                description: `Le groupe "${newGroupName}" a été créé avec ${contacts.length} contact(s)`,
            })
            onClose()
        } catch (error) {
            toast.error("Erreur lors de la création du groupe")
            console.error("Create group error:", error)
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
        <div className="space-y-6">
            <div className="bg-muted/30 rounded-lg p-4 border">
                <div className="flex items-center gap-2 mb-3">
                    <People className="h-5 w-5 text-primary" color="currentColor" variant="Bulk" />
                    <h3 className="font-medium text-sm">Contacts sélectionnés</h3>
                </div>
                <div className="flex items-center gap-2 mb-3">
                    <div className="bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center text-xs font-medium">
                        {contacts.length}
                    </div>
                    <span className="text-sm text-muted-foreground">
                        {contacts.length === 1 ? 'contact sélectionné' : 'contacts sélectionnés'}
                    </span>
                </div>
                <div className="space-y-2 max-h-40 overflow-y-auto pr-2">
                    {contacts.slice(0, 5).map(contact => (
                        <div key={contact.id} className="flex items-center gap-3 p-2 bg-background rounded-md border hover:border-primary/50 transition-colors">
                            <div className="bg-primary/10 text-primary rounded-full w-8 h-8 flex items-center justify-center shrink-0">
                                <User className="h-4 w-4" color="currentColor" variant="Bulk" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="font-medium text-sm truncate">
                                    {contact.firstname} {contact.lastname}
                                </div>
                                {contact.email && (
                                    <div className="text-xs text-muted-foreground truncate">
                                        {contact.email}
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                    {contacts.length > 5 && (
                        <div className="flex items-center gap-2 p-2 text-sm text-muted-foreground bg-muted/50 rounded-md">
                            <div className="bg-muted-foreground/20 rounded-full w-6 h-6 flex items-center justify-center">
                                +{contacts.length - 5}
                            </div>
                            <span>et {contacts.length - 5} autre{contacts.length - 5 > 1 ? 's' : ''}</span>
                        </div>
                    )}
                </div>
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="existing">Groupe existant</TabsTrigger>
                    <TabsTrigger value="new">Nouveau groupe</TabsTrigger>
                </TabsList>
                
                <TabsContent value="existing" className="space-y-4">
                    <div className="space-y-2">
                        <div className="flex items-center gap-2">
                            <People className="h-4 w-4 text-muted-foreground" color="currentColor" variant="Bulk" />
                            <Label>Sélectionner un groupe</Label>
                        </div>
                        {isLoading ? (
                            <div className="space-y-2">
                                <div className="h-10 bg-muted animate-pulse rounded" />
                                <div className="h-10 bg-muted animate-pulse rounded" />
                            </div>
                        ) : groups.length === 0 ? (
                            <p className="text-sm text-muted-foreground">
                                Aucun groupe disponible. Créez un nouveau groupe.
                            </p>
                        ) : (
                            <ScrollArea className="h-40 w-full border rounded-md">
                                <div className="p-2 space-y-1">
                                    {groups.map(group => (
                                        <div
                                            key={group.id}
                                            className={`p-3 rounded-lg cursor-pointer transition-all border ${
                                                selectedGroupId === group.id
                                                    ? "bg-primary text-primary-foreground border-primary shadow-sm"
                                                    : "bg-background hover:bg-muted/50 border-border hover:border-primary/30"
                                            }`}
                                            onClick={() => setSelectedGroupId(group.id)}
                                        >
                                            <div className="flex items-start gap-3">
                                                <div className={`rounded-full w-8 h-8 flex items-center justify-center shrink-0 ${
                                                    selectedGroupId === group.id
                                                        ? "bg-primary-foreground/20 text-primary-foreground"
                                                        : "bg-primary/10 text-primary"
                                                }`}>
                                                    <People className="h-4 w-4" />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <div className="font-medium text-sm truncate">
                                                        {group.name}
                                                    </div>
                                                    {group.code && (
                                                        <div className={`text-xs mt-1 ${
                                                            selectedGroupId === group.id
                                                                ? "text-primary-foreground/80"
                                                                : "text-muted-foreground"
                                                        }`}>
                                                            Code: {group.code}
                                                        </div>
                                                    )}
                                                    <div className={`text-xs mt-1 flex items-center gap-1 ${
                                                        selectedGroupId === group.id
                                                            ? "text-primary-foreground/70"
                                                            : "text-muted-foreground"
                                                    }`}>
                                                        <People className="h-3 w-3" color="currentColor" variant="Bulk" />
                                                        {group.enterpriseContacts?.length || 0} contact{group.enterpriseContacts?.length !== 1 ? 's' : ''}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </ScrollArea>
                        )}
                    </div>
                </TabsContent>
                
                <TabsContent value="new" className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="groupName">Nom du groupe *</Label>
                        <Input
                            id="groupName"
                            placeholder="Entrez le nom du groupe"
                            value={newGroupName}
                            onChange={(e) => setNewGroupName(e.target.value)}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="groupCode">Code du groupe (optionnel)</Label>
                        <Input
                            id="groupCode"
                            placeholder="Entrez le code du groupe"
                            value={newGroupCode}
                            onChange={(e) => setNewGroupCode(e.target.value)}
                        />
                    </div>
                </TabsContent>
            </Tabs>

            <div className="flex justify-end gap-2 pt-4">
                <Button variant="outline" onClick={onClose} disabled={isSubmitting}>
                    Annuler
                </Button>
                <Button 
                    onClick={handleSubmit} 
                    disabled={isSubmitting || (activeTab === "existing" && !selectedGroupId)}
                >
                    {isSubmitting ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" color="currentColor" />
                            Traitement...
                        </>
                    ) : activeTab === "existing" ? (
                        <>
                            <People className="mr-2 h-4 w-4" color="currentColor" variant="Bulk" />
                            Ajouter au groupe
                        </>
                    ) : (
                        <>
                            <Add className="mr-2 h-4 w-4" color="currentColor" variant="Bulk" />
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
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>Ajouter des contacts à un groupe</DialogTitle>
                        <DialogDescription>
                            Choisissez un groupe existant ou créez-en un nouveau
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
                    <DrawerTitle>Ajouter des contacts à un groupe</DrawerTitle>
                    <DrawerDescription>
                        Choisissez un groupe existant ou créez-en un nouveau
                    </DrawerDescription>
                </DrawerHeader>
                <div className="px-4 pb-4">
                    {content}
                </div>
            </DrawerContent>
        </Drawer>
    )
}
