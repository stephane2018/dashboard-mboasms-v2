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
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
} from "@/shared/ui/drawer"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/ui/tabs"
import { Add, People, ArrowRight2 } from "iconsax-react"
import { Loader2 } from "lucide-react"
import type { GroupType } from "@/core/models/groups"
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
    const { groups, isLoading, createGroup, addContactsToGroup } = useGroups(enterpriseId)

    const handleAddToExistingGroup = async () => {
        if (!selectedGroupId) {
            toast.error("Veuillez sélectionner un groupe")
            return
        }

        setIsSubmitting(true)
        try {
            await addContactsToGroup({
                groupId: selectedGroupId,
                contactIds: contacts.map(c => c.id),
            })
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
                code: newGroupCode.trim() || undefined,
            })
            
            // Add contacts to the newly created group
            await addContactsToGroup({
                groupId: newGroup.id,
                contactIds: contacts.map(c => c.id),
            })
            
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
            <div>
                <p className="text-sm text-muted-foreground mb-4">
                    {contacts.length} contact(s) sélectionné(s)
                </p>
                <div className="space-y-2 max-h-32 overflow-y-auto">
                    {contacts.slice(0, 5).map(contact => (
                        <div key={contact.id} className="text-sm">
                            {contact.firstname} {contact.lastname} {contact.email && `(${contact.email})`}
                        </div>
                    ))}
                    {contacts.length > 5 && (
                        <div className="text-sm text-muted-foreground">
                            ... et {contacts.length - 5} autres
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
                        <Label>Sélectionner un groupe</Label>
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
                                            className={`p-2 rounded cursor-pointer transition-colors ${
                                                selectedGroupId === group.id
                                                    ? "bg-primary text-primary-foreground"
                                                    : "hover:bg-muted"
                                            }`}
                                            onClick={() => setSelectedGroupId(group.id)}
                                        >
                                            <div className="font-medium">{group.name}</div>
                                            {group.code && (
                                                <div className="text-xs opacity-70">Code: {group.code}</div>
                                            )}
                                            <div className="text-xs opacity-70">
                                                {group.contactCount || 0} contact(s)
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
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Traitement...
                        </>
                    ) : activeTab === "existing" ? (
                        <>
                            <People className="mr-2 h-4 w-4" />
                            Ajouter au groupe
                        </>
                    ) : (
                        <>
                            <Add className="mr-2 h-4 w-4" />
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
