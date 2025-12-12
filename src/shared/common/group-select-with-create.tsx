"use client"

import { useState, useEffect } from "react"
import { Button } from "@/shared/ui/button"
import { Input } from "@/shared/ui/input"
import { Label } from "@/shared/ui/label"
import { Skeleton } from "@/shared/ui/skeleton"
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
import { Add, TickCircle, Refresh2, People, ArrowRight2 } from "iconsax-react"
import { Loader2 } from "lucide-react"
import type { GroupType } from "@/core/models/groups"
import { useGroups } from "@/core/hooks/useGroups"
import { toast } from "sonner"
import { cn } from "@/lib/utils"
import { useMediaQuery } from "@/core/hooks/useMediaQuery"

interface GroupSelectWithCreateProps {
    enterpriseId: string
    value: string
    onChange: (groupId: string) => void
    disabled?: boolean
}

export function GroupSelectWithCreate({
    enterpriseId,
    value,
    onChange,
    disabled = false,
}: GroupSelectWithCreateProps) {
    const [isOpen, setIsOpen] = useState(false)
    const [isCreateMode, setIsCreateMode] = useState(false)
    const [newGroupName, setNewGroupName] = useState("")
    const [newGroupCode, setNewGroupCode] = useState("")

    const isDesktop = useMediaQuery("(min-width: 768px)")

    const {
        groups,
        isLoading,
        isCreating,
        createGroup,
        loadGroups,
    } = useGroups({ enterpriseId, autoLoad: false })

    // Load groups when component opens
    useEffect(() => {
        if (isOpen) {
            loadGroups()
        }
    }, [isOpen, loadGroups])

    // Get selected group name
    const selectedGroup = groups.find(g => g.id === value)

    const handleRefresh = () => {
        loadGroups()
        toast.success("Liste des groupes actualisée")
    }

    const handleCreateGroup = async () => {
        if (!newGroupName.trim()) {
            toast.error("Le nom du groupe est requis")
            return
        }

        try {
            const newGroup = await createGroup({
                name: newGroupName,
                code: newGroupCode || newGroupName.toLowerCase().replace(/\s+/g, '_'),
            })
            onChange(newGroup.id)
            setIsCreateMode(false)
            setNewGroupName("")
            setNewGroupCode("")
            setIsOpen(false)
            toast.success("Groupe créé avec succès")
        } catch (error) {
            toast.error("Erreur lors de la création du groupe")
        }
    }

    const handleSelectGroup = (groupId: string) => {
        onChange(groupId)
        setIsOpen(false)
    }

    // Group list content - shared between Dialog and Drawer
    const GroupListContent = () => (
        <ScrollArea className="max-h-[300px] md:max-h-[400px]">
            <div className="space-y-1 p-1">
                {/* None option */}
                <button
                    onClick={() => handleSelectGroup("")}
                    className={cn(
                        "w-full flex items-center gap-3 p-3 rounded-lg text-left transition-colors",
                        value === "" ? "bg-primary/10 border border-primary" : "hover:bg-muted"
                    )}
                >
                    <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                        <People size={16} color="currentColor" className="text-muted-foreground" />
                    </div>
                    <div className="flex-1">
                        <p className="font-medium text-sm">Aucun groupe</p>
                        <p className="text-xs text-muted-foreground">Ne pas associer à un groupe</p>
                    </div>
                    {value === "" && (
                        <TickCircle size={18} color="currentColor" variant="Bulk" className="text-primary" />
                    )}
                </button>

                {/* Loading state */}
                {isLoading && (
                    <>
                        {[1, 2, 3].map(i => (
                            <div key={i} className="flex items-center gap-3 p-3">
                                <Skeleton className="w-8 h-8 rounded-full" />
                                <div className="flex-1 space-y-1">
                                    <Skeleton className="h-4 w-24" />
                                    <Skeleton className="h-3 w-16" />
                                </div>
                            </div>
                        ))}
                    </>
                )}

                {/* Group list */}
                {!isLoading && [...groups]
                    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                    .map(group => (
                        <button
                            key={group.id}
                            onClick={() => handleSelectGroup(group.id)}
                            className={cn(
                                "w-full flex items-center gap-3 p-3 rounded-lg text-left transition-colors",
                                value === group.id ? "bg-primary/10 border border-primary" : "hover:bg-muted"
                            )}
                        >
                            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                                <People size={16} color="currentColor" variant="Bulk" className="text-primary" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="font-medium text-sm truncate">{group.name}</p>
                                <p className="text-xs text-muted-foreground truncate">{group.code || 'Pas de code'}</p>
                            </div>
                            {value === group.id && (
                                <TickCircle size={18} color="currentColor" variant="Bulk" className="text-primary shrink-0" />
                            )}
                        </button>
                    ))}

                {/* Empty state */}
                {!isLoading && groups.length === 0 && (
                    <div className="text-center py-8 text-muted-foreground">
                        <People size={32} color="currentColor" className="mx-auto mb-2 opacity-50" />
                        <p className="text-sm">Aucun groupe trouvé</p>
                        <p className="text-xs">Créez votre premier groupe</p>
                    </div>
                )}
            </div>
        </ScrollArea>
    )

    // Create group form - shared between Dialog and Drawer
    const CreateGroupForm = () => (
        <div className="space-y-4 p-4">
            <div className="space-y-2">
                <Label>Nom du groupe *</Label>
                <Input
                    value={newGroupName}
                    onChange={(e) => setNewGroupName(e.target.value)}
                    placeholder="Ex: Clients VIP"
                    autoFocus
                />
            </div>
            <div className="space-y-2">
                <Label>Code (optionnel)</Label>
                <Input
                    value={newGroupCode}
                    onChange={(e) => setNewGroupCode(e.target.value.toLowerCase().replace(/\s+/g, '_'))}
                    placeholder="Ex: clients_vip"
                />
                <p className="text-xs text-muted-foreground">
                    Identifiant unique pour le groupe
                </p>
            </div>
            <div className="flex gap-2 pt-2">
                <Button
                    onClick={handleCreateGroup}
                    disabled={isCreating || !newGroupName.trim()}
                    className="flex-1"
                >
                    {isCreating ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                        <>
                            <TickCircle size={16} color="currentColor" variant="Bulk" className="mr-2" />
                            Créer le groupe
                        </>
                    )}
                </Button>
                <Button
                    variant="outline"
                    onClick={() => {
                        setIsCreateMode(false)
                        setNewGroupName("")
                        setNewGroupCode("")
                    }}
                >
                    Annuler
                </Button>
            </div>
        </div>
    )

    // Header actions
    const HeaderActions = () => (
        <div className="flex items-center gap-2">
            <Button
                variant="ghost"
                size="sm"
                onClick={handleRefresh}
                disabled={isLoading}
            >
                <Refresh2 size={14} color="currentColor" className={cn(isLoading && "animate-spin")} />
            </Button>
            {!isCreateMode && (
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsCreateMode(true)}
                >
                    <Add size={14} color="currentColor" className="mr-1" />
                    Nouveau
                </Button>
            )}
        </div>
    )

    // Trigger button
    const TriggerButton = () => (
        <button
            type="button"
            onClick={() => !disabled && setIsOpen(true)}
            disabled={disabled}
            className={cn(
                "w-full flex items-center gap-2 h-10 px-3 rounded-md border bg-background text-sm",
                "hover:bg-muted transition-colors",
                disabled && "opacity-50 cursor-not-allowed"
            )}
        >
            <People size={16} color="currentColor" variant="Bulk" className="text-primary shrink-0" />
            <span className="flex-1 text-left truncate">
                {selectedGroup ? selectedGroup.name : "Sélectionner un groupe"}
            </span>
            <ArrowRight2 size={14} color="currentColor" className="text-muted-foreground" />
        </button>
    )

    // Desktop: Dialog
    if (isDesktop) {
        return (
            <>
                <TriggerButton />
                <Dialog open={isOpen} onOpenChange={setIsOpen}>
                    <DialogContent className="sm:max-w-md">
                        <DialogHeader>
                            <div className="flex items-center justify-between">
                                <div>
                                    <DialogTitle>
                                        {isCreateMode ? "Nouveau groupe" : "Sélectionner un groupe"}
                                    </DialogTitle>
                                    <DialogDescription>
                                        {isCreateMode
                                            ? "Créez un nouveau groupe pour organiser vos contacts"
                                            : "Choisissez un groupe à associer au contact"}
                                    </DialogDescription>
                                </div>
                                <HeaderActions />
                            </div>
                        </DialogHeader>
                        {isCreateMode ? <CreateGroupForm /> : <GroupListContent />}
                    </DialogContent>
                </Dialog>
            </>
        )
    }

    // Mobile: Drawer
    return (
        <>
            <TriggerButton />
            <Drawer open={isOpen} onOpenChange={setIsOpen}>
                <DrawerContent>
                    <DrawerHeader className="text-left">
                        <div className="flex items-center justify-between">
                            <div>
                                <DrawerTitle>
                                    {isCreateMode ? "Nouveau groupe" : "Sélectionner un groupe"}
                                </DrawerTitle>
                                <DrawerDescription>
                                    {isCreateMode
                                        ? "Créez un nouveau groupe"
                                        : "Choisissez un groupe"}
                                </DrawerDescription>
                            </div>
                            <HeaderActions />
                        </div>
                    </DrawerHeader>
                    <div className="px-4 pb-4">
                        {isCreateMode ? <CreateGroupForm /> : <GroupListContent />}
                    </div>
                    <DrawerFooter>
                        <Button variant="outline" onClick={() => setIsOpen(false)}>
                            Fermer
                        </Button>
                    </DrawerFooter>
                </DrawerContent>
            </Drawer>
        </>
    )
}
