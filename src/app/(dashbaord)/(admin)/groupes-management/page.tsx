"use client"

import { useEffect, useState, useMemo } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/shared/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/ui/card"
import { Input } from "@/shared/ui/input"
import { Skeleton } from "@/shared/ui/skeleton"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/shared/ui/alert-dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/ui/select"
import { Badge } from "@/shared/ui/badge"
import { Label } from "@/shared/ui/label"
import { toast } from "sonner"
import type { EnterpriseContactResponseType } from "@/core/models/contact-new"
import { ContactSelectionModal } from "@/shared/common/contact-selection-modal"
import { GroupTableView } from "./group-table-view"
import { useGroups } from "@/core/hooks/useGroups"
import type { GroupWithEnterprise } from "@/core/hooks/useGroups"
import { ChevronLeft, ChevronRight, LayoutGrid, List, RefreshCw } from "lucide-react"
import { People, Building, AddSquare, Trash, Add, SearchNormal1, FolderOpen, Refresh2 } from "iconsax-react"
import { cn } from "@/lib/utils"

const GROUP_CARD_PLACEHOLDER_COUNT = 6

function GroupCardsSkeleton() {
  return (
    <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
      {Array.from({ length: GROUP_CARD_PLACEHOLDER_COUNT }).map((_, index) => (
        <Card key={`group-card-skeleton-${index}`} className="border border-border/40">
          <CardHeader className="space-y-1.5 pb-2">
            <Skeleton className="h-3 w-1/4" />
            <Skeleton className="h-5 w-1/2" />
            <Skeleton className="h-3 w-1/3" />
          </CardHeader>
          <CardContent className="space-y-2.5">
            <Skeleton className="h-2.5 w-full" />
            <Skeleton className="h-2.5 w-2/3" />
            <div className="flex gap-1.5">
              <Skeleton className="h-8 w-full" />
              <Skeleton className="h-8 w-20" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

export default function AdminGroupesPage() {
  const router = useRouter()

  const {
    groups,
    enterprises,
    isLoading,
    isMutating,
    _isSuperAdmin,
    loadGroups,
    createGroup,
    deleteGroup,
    addContactsToGroup,
    removeContactFromGroup,
    setGroups,
  } = useGroups({ withEnterprises: true })

  const [selectedEnterpriseId, setSelectedEnterpriseId] = useState<string>("all")
  const [selectedGroupId, setSelectedGroupId] = useState<string | null>(null)
  const [page, setPage] = useState(0)
  const [pageSize, setPageSize] = useState(10)
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")

  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)
  const [isContactModalOpen, setIsContactModalOpen] = useState(false)
  const [isRemoveContactOpen, setIsRemoveContactOpen] = useState(false)

  const [groupToDelete, setGroupToDelete] = useState<GroupWithEnterprise | null>(null)
  const [selectedGroupForContacts, setSelectedGroupForContacts] = useState<GroupWithEnterprise | null>(null)
  const [contactToRemove, setContactToRemove] = useState<{ groupId: string; contact: EnterpriseContactResponseType } | null>(null)
  const [newGroupName, setNewGroupName] = useState("")
  const [newGroupCode, setNewGroupCode] = useState("")
  const [newGroupEnterpriseId, setNewGroupEnterpriseId] = useState("")
  const [contactCountFilter, setContactCountFilter] = useState<string>("")
  const [selectedContactIds, setSelectedContactIds] = useState<Set<string>>(new Set())

  // Set initial enterprise filter based on role (only once after user is known)
  useEffect(() => {
    if (!_isSuperAdmin) {
      setSelectedEnterpriseId("all")
    }
  }, [_isSuperAdmin])

  const filteredGroups = useMemo(() => {
    let filtered = groups

    if (selectedEnterpriseId !== "all") {
      filtered = filtered.filter((g) => g.enterprise === selectedEnterpriseId)
    }

    if (contactCountFilter) {
      const minContacts = parseInt(contactCountFilter, 10)
      if (!isNaN(minContacts)) {
        filtered = filtered.filter((g) => (g.enterpriseContacts?.length || 0) >= minContacts)
      }
    }

    return filtered
  }, [groups, selectedEnterpriseId, contactCountFilter])

  const totalGroups = filteredGroups.length
  const totalPages = viewMode === 'grid' ? Math.max(1, Math.ceil(totalGroups / pageSize)) : 1
  const paginatedGroups = useMemo(() => {
    const start = page * pageSize
    return filteredGroups.slice(start, start + pageSize)
  }, [filteredGroups, page, pageSize])

  const selectedGroup = useMemo(
    () => groups.find((group) => group.id === selectedGroupId) || null,
    [groups, selectedGroupId]
  )

  useEffect(() => {
    setPage(0)
  }, [selectedEnterpriseId])

  useEffect(() => {
    if (!filteredGroups.length) {
      setSelectedGroupId(null)
      return
    }
    if (!selectedGroupId || !filteredGroups.some((g) => g.id === selectedGroupId)) {
      setSelectedGroupId(filteredGroups[0].id)
    }
  }, [filteredGroups, selectedGroupId])

  useEffect(() => {
    setSelectedContactIds(new Set())
  }, [selectedGroupId])

  const handlePrevPage = () => setPage((prev) => Math.max(0, prev - 1))
  const handleNextPage = () => setPage((prev) => Math.min(totalPages - 1, prev + 1))

  const handleGroupClick = (groupId: string) => {
    router.push(`/groupes-management/${groupId}/contacts-view`)
  }

  const handleCreateGroup = async () => {
    if (!newGroupName.trim()) {
      toast.error("Le nom est requis")
      return
    }

    const enterpriseId = newGroupEnterpriseId || undefined

    try {
      await createGroup({
        name: newGroupName.trim(),
        code: (newGroupCode || newGroupName).toLowerCase().replace(/\s+/g, "_"),
        enterpriseId,
      })
      toast.success("Groupe créé")
      setIsCreateOpen(false)
      setNewGroupName("")
      setNewGroupCode("")
      setNewGroupEnterpriseId("")
    } catch {
      toast.error("Erreur lors de la création du groupe")
    }
  }

  const handleDeleteGroup = async () => {
    if (!groupToDelete?.id) return

    try {
      await deleteGroup(groupToDelete.id)
      toast.success("Groupe supprimé")
      setIsDeleteOpen(false)
      setGroupToDelete(null)
    } catch {
      toast.error("Erreur lors de la suppression du groupe")
    }
  }

  const handleAddContactsToGroup = async (selected: EnterpriseContactResponseType[]) => {
    if (!selectedGroupForContacts?.id) return
    if (selected.length === 0) {
      toast.info("Sélectionnez des contacts à ajouter")
      return
    }

    const ids = selected.map((c) => c.id)
    const groupId = selectedGroupForContacts.id
    const toastId = toast.loading("Mise à jour du groupe…")

    try {
      await addContactsToGroup(groupId, ids, selected)
      toast.success(`${ids.length} contact(s) ajouté(s)`, { id: toastId })
      setIsContactModalOpen(false)
      setSelectedGroupForContacts(null)
    } catch {
      toast.error("Erreur lors de l'ajout des contacts", { id: toastId })
    }
  }

  const handleRemoveContact = async () => {
    if (!contactToRemove) return

    try {
      await removeContactFromGroup(contactToRemove.groupId, contactToRemove.contact.id)
      toast.success("Contact supprimé du groupe")
      setIsRemoveContactOpen(false)
      setContactToRemove(null)
    } catch {
      toast.error("Erreur lors de la suppression du contact")
    }
  }

  const handleContactUpdated = async () => {
    try {
      await loadGroups()
      toast.success("Contact mis à jour")
    } catch {
    }
  }

  const handleToggleContact = (contactId: string) => {
    setSelectedContactIds((prev) => {
      const next = new Set(prev)
      if (next.has(contactId)) next.delete(contactId)
      else next.add(contactId)
      return next
    })
  }

  const handleSendSms = () => {
    if (!selectedGroup) return
    const contacts = selectedGroup.enterpriseContacts || []
    const phones = contacts
      .filter((c) => selectedContactIds.has(c.id))
      .map((c) => c.phoneNumber)
      .filter(Boolean)

    if (phones.length === 0) {
      toast.error("Sélectionnez des contacts avec un numéro valide")
      return
    }

    const query = new URLSearchParams()
    query.set("phones", phones.join(","))
    window.location.assign(`/sms?${query.toString()}`)
  }

  const handleOpenAddContacts = (group: GroupWithEnterprise) => {
    setSelectedGroupForContacts(group)
    setIsContactModalOpen(true)
  }

  // Statistics
  const totalContacts = useMemo(
    () => filteredGroups.reduce((sum, g) => sum + (g.enterpriseContacts?.length || 0), 0),
    [filteredGroups]
  )
  const emptyGroups = useMemo(
    () => filteredGroups.filter((g) => !g.enterpriseContacts?.length).length,
    [filteredGroups]
  )

  return (
    <div className="flex flex-col gap-5 p-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-primary/10 p-2.5">
              <People size={22} variant="Bulk" color="currentColor" className="text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight">
                {_isSuperAdmin ? "Groupes (Plateforme)" : "Mes groupes"}
              </h1>
              <p className="text-sm text-muted-foreground">
                {_isSuperAdmin
                  ? "Gérez les groupes de contacts de toutes les entreprises"
                  : "Gérez vos groupes de contacts"}
              </p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={loadGroups} disabled={isLoading} className="h-9">
            <Refresh2 size={16} variant="Bulk" color="currentColor" className="mr-2" />
            Actualiser
          </Button>
          <Button size="sm" onClick={() => setIsCreateOpen(true)} className="h-9 shadow-sm">
            <Add size={16} variant="Bulk" color="currentColor" className="mr-2" />
            Nouveau groupe
          </Button>
        </div>
      </div>

      {/* Statistics cards */}
      <div className="grid gap-3 grid-cols-3">
        <Card className="relative overflow-hidden border-l-[3px] border-l-blue-500 bg-gradient-to-br from-blue-500/10 to-blue-600/5 backdrop-blur-sm">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="bg-blue-500/10 dark:bg-blue-500/20 rounded-xl p-2.5 shrink-0">
                <FolderOpen size={20} variant="Bulk" color="currentColor" className="text-blue-600 dark:text-blue-400" />
              </div>
              <div className="min-w-0">
                <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider">Total groupes</p>
                <p className="text-lg font-bold tracking-tight">{totalGroups}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="relative overflow-hidden border-l-[3px] border-l-emerald-500 bg-gradient-to-br from-emerald-500/10 to-emerald-600/5 backdrop-blur-sm">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="bg-emerald-500/10 dark:bg-emerald-500/20 rounded-xl p-2.5 shrink-0">
                <People size={20} variant="Bulk" color="currentColor" className="text-emerald-600 dark:text-emerald-400" />
              </div>
              <div className="min-w-0">
                <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider">Total contacts</p>
                <p className="text-lg font-bold tracking-tight">{totalContacts}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="relative overflow-hidden border-l-[3px] border-l-amber-500 bg-gradient-to-br from-amber-500/10 to-amber-600/5 backdrop-blur-sm">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="bg-amber-500/10 dark:bg-amber-500/20 rounded-xl p-2.5 shrink-0">
                <FolderOpen size={20} variant="Bulk" color="currentColor" className="text-amber-600 dark:text-amber-400" />
              </div>
              <div className="min-w-0">
                <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider">Groupes vides</p>
                <p className="text-lg font-bold tracking-tight">{emptyGroups}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="rounded-xl border bg-card/50 backdrop-blur-sm">
        <div className="flex items-center px-4 py-2.5 border-b bg-muted/30">
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Filtres
          </span>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 p-4">
          <div className="space-y-1.5">
            <Label className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider">
              Entreprise
            </Label>
            <Select value={selectedEnterpriseId} onValueChange={setSelectedEnterpriseId} disabled={!_isSuperAdmin}>
              <SelectTrigger className="h-9 bg-background/60">
                <SelectValue placeholder="Toutes les entreprises" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Toutes les entreprises</SelectItem>
                {enterprises.map((e) => (
                  <SelectItem key={e.id} value={e.id}>
                    {e.socialRaison}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider">
              Contacts minimum
            </Label>
            <Input
              type="number"
              placeholder="Ex: 10"
              value={contactCountFilter}
              onChange={(e) => setContactCountFilter(e.target.value)}
              className="h-9 bg-background/60"
            />
          </div>
        </div>
      </div>

      {/* Groups section */}
      <Card className="overflow-hidden border bg-card/50 backdrop-blur-sm">
        {/* Toolbar */}
        <div className="flex items-center justify-between gap-3 px-4 py-3 border-b bg-muted/20">
          <div className="flex items-center gap-3">
            <span className="text-sm font-semibold">Liste des groupes</span>
            <span className="text-[11px] font-medium text-muted-foreground tabular-nums">
              {filteredGroups.length} groupe{filteredGroups.length !== 1 ? "s" : ""}
            </span>
          </div>
          <div className="flex items-center gap-1 rounded-lg border bg-muted/40 p-0.5">
            <Button
              variant={viewMode === "grid" ? "secondary" : "ghost"}
              size="icon"
              onClick={() => setViewMode("grid")}
              className="h-7 w-7"
            >
              <LayoutGrid className="h-3.5 w-3.5" />
            </Button>
            <Button
              variant={viewMode === "list" ? "secondary" : "ghost"}
              size="icon"
              onClick={() => setViewMode("list")}
              className="h-7 w-7"
            >
              <List className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="p-4">
          {isLoading && viewMode === 'grid' ? (
            <GroupCardsSkeleton />
          ) : filteredGroups.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 gap-4">
              <div className="rounded-full bg-muted/50 p-5">
                <FolderOpen size={36} variant="Bulk" className="text-muted-foreground/40" />
              </div>
              <div className="text-center space-y-1">
                <p className="text-sm font-medium text-muted-foreground">Aucun groupe</p>
                <p className="text-xs text-muted-foreground/70">Créez un nouveau groupe pour commencer</p>
              </div>
            </div>
          ) : viewMode === 'grid' ? (
            <>
              <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                {paginatedGroups.map((g) => {
                  const contacts = g.enterpriseContacts || []
                  const isSelected = selectedGroupId === g.id

                  return (
                    <Card
                      key={g.id}
                      className={cn(
                        "cursor-pointer border transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 group",
                        isSelected && "border-primary ring-2 ring-primary/20"
                      )}
                      onClick={() => handleGroupClick(g.id)}
                    >
                      <CardHeader className="space-y-0.5 pb-2">
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
                            {g.code || "—"}
                          </span>
                          <Badge variant="outline" className="text-[10px] px-2 py-0 bg-muted/30">
                            {g.enterpriseFull?.socialRaison}
                          </Badge>
                        </div>
                        <CardTitle className="text-base leading-tight group-hover:text-primary transition-colors">
                          {g.name}
                        </CardTitle>
                        <CardDescription className="text-xs">
                          {contacts.length} contact{contacts.length !== 1 ? "s" : ""} • ID: {g.id.slice(0, 6)}…
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="grid grid-cols-2 gap-2 text-xs">
                          <div className="rounded-lg bg-muted/30 p-2 flex items-center gap-2 border border-border/40">
                            <div className="rounded-full bg-background p-1 shadow-sm">
                              <Building size="14" variant="Bulk" color="currentColor" className="text-primary" />
                            </div>
                            <div className="min-w-0">
                              <p className="text-[10px] text-muted-foreground">Entreprise</p>
                              <p className="font-semibold truncate">{g.enterpriseFull?.socialRaison}</p>
                            </div>
                          </div>
                          <div className="rounded-lg bg-muted/30 p-2 flex items-center gap-2 border border-border/40">
                            <div className="rounded-full bg-background p-1 shadow-sm">
                              <People size="14" variant="Bulk" color="currentColor" className="text-primary" />
                            </div>
                            <div>
                              <p className="text-[10px] text-muted-foreground">Contacts</p>
                              <p className="font-semibold">{contacts.length}</p>
                            </div>
                          </div>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation()
                              handleOpenAddContacts(g)
                            }}
                            disabled={isMutating}
                            className="flex-1 h-8 text-xs"
                          >
                            <AddSquare size="16" color="currentColor" variant="Bulk" className="mr-1" />
                            Ajouter
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation()
                              setGroupToDelete(g)
                              setIsDeleteOpen(true)
                            }}
                            disabled={isMutating}
                            className="h-8 px-4 text-xs"
                          >
                            <Trash size="16" color="currentColor" variant="Bulk" className="mr-1" />
                            Supprimer
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>

              {/* Pagination */}
              <div className="mt-4 flex items-center justify-between rounded-lg border bg-muted/20 px-4 py-2.5 text-sm text-muted-foreground">
                <span className="text-xs tabular-nums">
                  {totalGroups === 0
                    ? "0 groupes"
                    : `${page * pageSize + 1}-${Math.min((page + 1) * pageSize, totalGroups)} sur ${totalGroups}`}
                </span>
                <div className="flex items-center gap-1">
                  <Button variant="ghost" size="icon" className="h-7 w-7" onClick={handlePrevPage} disabled={page === 0}>
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <span className="text-xs tabular-nums px-2">
                    {page + 1} / {totalPages}
                  </span>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7"
                    onClick={handleNextPage}
                    disabled={page >= totalPages - 1}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </>
          ) : (
            <GroupTableView
              data={filteredGroups}
              isLoading={isLoading}
              onAddContacts={handleOpenAddContacts}
              onDelete={(group) => {
                setGroupToDelete(group)
                setIsDeleteOpen(true)
              }}
            />
          )}
        </div>
      </Card>

      {/* Create Group Dialog */}
      <AlertDialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Nouveau groupe</AlertDialogTitle>
            <AlertDialogDescription>
              Créez un groupe pour organiser les contacts d'une entreprise.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <div className="space-y-3">
            {_isSuperAdmin && (
              <div className="space-y-2">
                <div className="text-sm font-medium">Entreprise *</div>
                <Select value={newGroupEnterpriseId} onValueChange={setNewGroupEnterpriseId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner une entreprise" />
                  </SelectTrigger>
                  <SelectContent>
                    {enterprises.map((e) => (
                      <SelectItem key={e.id} value={e.id}>
                        {e.socialRaison}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
            <div className="space-y-2">
              <div className="text-sm font-medium">Nom *</div>
              <Input
                value={newGroupName}
                onChange={(e) => setNewGroupName(e.target.value)}
                placeholder="Ex: Clients VIP"
              />
            </div>
            <div className="space-y-2">
              <div className="text-sm font-medium">Code (optionnel)</div>
              <Input
                value={newGroupCode}
                onChange={(e) => setNewGroupCode(e.target.value)}
                placeholder="Ex: clients_vip"
              />
            </div>
          </div>

          <AlertDialogFooter>
            <AlertDialogCancel disabled={isMutating}>Annuler</AlertDialogCancel>
            <AlertDialogAction onClick={handleCreateGroup} disabled={isMutating}>
              Créer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Delete Group Dialog */}
      <AlertDialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Supprimer ce groupe ?</AlertDialogTitle>
            <AlertDialogDescription>
              Cette action est irréversible. Le groupe sera supprimé.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isMutating}>Annuler</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteGroup} disabled={isMutating}>
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Contact Selection Modal */}
      <ContactSelectionModal
        isOpen={isContactModalOpen}
        onClose={() => {
          setIsContactModalOpen(false)
          setSelectedGroupForContacts(null)
        }}
        onSelectContacts={handleAddContactsToGroup}
        enterpriseId={selectedGroupForContacts?.enterprise}
        existingContactIds={selectedGroupForContacts?.enterpriseContacts?.map((c) => c.id)}
      />

      {/* Remove Contact Dialog */}
      <AlertDialog open={isRemoveContactOpen} onOpenChange={setIsRemoveContactOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Retirer le contact du groupe ?</AlertDialogTitle>
            <AlertDialogDescription>
              Le contact sera retiré du groupe.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isMutating}>Annuler</AlertDialogCancel>
            <AlertDialogAction onClick={handleRemoveContact} disabled={isMutating}>
              Retirer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
