"use client"

import { useEffect, useMemo, useState } from "react"
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
import { toast } from "sonner"
import { httpClient } from "@/core/lib/http-client"
import type { Group } from "@/modules/groups/types"
import type { EnterpriseContactResponseType } from "@/core/models/contact-new"
import type { EnterpriseType } from "@/core/models/enterprise"
import { ContactSelectionModal } from "@/shared/common/contact-selection-modal"
import { ContactEditPopover } from "@/shared/common/contact-edit-popover"
import { GroupTableView } from "./group-table-view"
import { groupsService } from "@/modules/groups/services"
import { ChevronLeft, ChevronRight, LayoutGrid, List } from "lucide-react"
import { People, Building, AddSquare, Trash } from "iconsax-react"
import { cn } from "@/lib/utils"


const GROUP_CARD_PLACEHOLDER_COUNT = 6

function GroupCardsSkeleton() {
  return (
    <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
      {Array.from({ length: GROUP_CARD_PLACEHOLDER_COUNT }).map((_, index) => (
        <Card key={`group-card-skeleton-${index}`} className="border border-border/60">
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
  const [groups, setGroups] = useState<(Group & { enterpriseFull?: EnterpriseType })[]>([])
  const [enterprises, setEnterprises] = useState<EnterpriseType[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [selectedEnterpriseId, setSelectedEnterpriseId] = useState<string>("all")
  const [selectedGroupId, setSelectedGroupId] = useState<string | null>(null)
  const [page, setPage] = useState(0)
  const [pageSize, setPageSize] = useState(10)
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")

  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)
  const [isContactModalOpen, setIsContactModalOpen] = useState(false)
  const [isRemoveContactOpen, setIsRemoveContactOpen] = useState(false)

  const [groupToDelete, setGroupToDelete] = useState<Group | null>(null)
  const [selectedGroupForContacts, setSelectedGroupForContacts] = useState<Group | null>(null)
  const [contactToRemove, setContactToRemove] = useState<{ groupId: string; contact: EnterpriseContactResponseType } | null>(null)
  const [isCreating, setIsCreating] = useState(false)
  const [newGroupName, setNewGroupName] = useState("")
  const [newGroupCode, setNewGroupCode] = useState("")
  const [newGroupEnterpriseId, setNewGroupEnterpriseId] = useState("")
  const [contactCountFilter, setContactCountFilter] = useState<string>("")
  const [selectedContactIds, setSelectedContactIds] = useState<Set<string>>(new Set())

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

  const loadEnterprises = async () => {
    try {
      const data = await httpClient.get<EnterpriseType[]>("/api/v1/enterprise/all")
      setEnterprises(Array.isArray(data) ? data : [])
    } catch (error) {
      console.error("Error loading enterprises:", error)
      toast.error("Erreur lors du chargement des entreprises")
    }
  }

  const normalizeGroupsResponse = (payload: unknown): Group[] => {
    if (!payload) return []
    if (Array.isArray(payload)) return payload as Group[]

    if (typeof payload === "object") {
      const objectPayload = payload as Record<string, unknown>

      if (Array.isArray(objectPayload.groupes)) {
        return objectPayload.groupes as Group[]
      }

      if (Array.isArray(objectPayload.data)) {
        return normalizeGroupsResponse(objectPayload.data)
      }

      if (Array.isArray(objectPayload.content)) {
        return objectPayload.content as Group[]
      }
    }

    return []
  }

  const loadGroups = async () => {
    setIsLoading(true)
    try {
      const data = await httpClient.get<Group[] | Record<string, unknown>>("/api/v1/group/all")
      const parsedGroups = normalizeGroupsResponse(data)
      const groupsWithFullEnterprise = parsedGroups.map((g) => ({
        ...g,
        enterpriseFull: enterprises.find((e) => e.id === g.enterprise),
      }))
      setGroups(groupsWithFullEnterprise)
    } catch (error) {
      console.error("Error loading groups:", error)
      toast.error("Erreur lors du chargement des groupes")
      setGroups([])
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadEnterprises()
  }, [])

  useEffect(() => {
    if (enterprises.length > 0) {
      loadGroups()
    }
  }, [enterprises])

  const handleCreateGroup = async () => {
    if (!newGroupName.trim()) {
      toast.error("Le nom est requis")
      return
    }
    if (!newGroupEnterpriseId) {
      toast.error("L'entreprise est requise")
      return
    }

    setIsCreating(true)
    try {
      const created = await httpClient.post<Group>("/api/v1/group/save", {
        name: newGroupName.trim(),
        code: (newGroupCode || newGroupName).toLowerCase().replace(/\s+/g, "_"),
        enterpriseId: newGroupEnterpriseId,
      })

      const enterpriseFull = enterprises.find((e) => e.id === newGroupEnterpriseId)
      setGroups((prev) => [
        ...prev,
        { ...created, enterpriseFull },
      ])
      toast.success("Groupe créé")
      setIsCreateOpen(false)
      setNewGroupName("")
      setNewGroupCode("")
      setNewGroupEnterpriseId("")
    } catch (error) {
      console.error("Error creating group:", error)
      toast.error("Erreur lors de la création du groupe")
    } finally {
      setIsCreating(false)
    }
  }

  const handleDeleteGroup = async () => {
    if (!groupToDelete?.id) return

    setIsCreating(true)
    try {
      await httpClient.delete(`/api/v1/group/${groupToDelete.id}`)
      setGroups((prev) => prev.filter((g) => g.id !== groupToDelete.id))
      toast.success("Groupe supprimé")
      setIsDeleteOpen(false)
      setGroupToDelete(null)
    } catch (error) {
      console.error("Error deleting group:", error)
      toast.error("Erreur lors de la suppression du groupe")
    } finally {
      setIsCreating(false)
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
    const previousGroups = groups

    const toastId = toast.loading("Mise à jour du groupe…")
    setIsCreating(true)
    setGroups((prev) =>
      prev.map((group) => {
        if (group.id !== groupId) return group
        const existingContacts = group.enterpriseContacts || []
        const mergedContacts = [
          ...existingContacts,
          ...selected.filter((contact) => !existingContacts.some((existing) => existing.id === contact.id)),
        ]
        return {
          ...group,
          enterpriseContacts: mergedContacts,
        }
      })
    )

    try {
      await groupsService.addContactsToGroup(groupId, ids)
      toast.success(`${ids.length} contact(s) ajouté(s)`, { id: toastId })
      setIsContactModalOpen(false)
      setSelectedGroupForContacts(null)
    } catch (e) {
      setGroups(previousGroups)
      toast.error("Erreur lors de l'ajout des contacts", { id: toastId })
      console.error(e)
    } finally {
      setIsCreating(false)
    }
  }

  const handleRemoveContact = async () => {
    if (!contactToRemove) return

    setIsCreating(true)
    try {
      await groupsService.removeContactFromGroup(contactToRemove.groupId, contactToRemove.contact.id)
      toast.success("Contact supprimé du groupe")
      await loadGroups()
      setIsRemoveContactOpen(false)
      setContactToRemove(null)
    } catch (e) {
      toast.error("Erreur lors de la suppression du contact")
      console.error(e)
    } finally {
      setIsCreating(false)
    }
  }

  const handleContactUpdated = async () => {
    try {
      await loadGroups()
      toast.success("Contact mis à jour")
    } catch (e) {
      console.error(e)
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

  const handleOpenAddContacts = (group: Group) => {
    setSelectedGroupForContacts(group)
    setIsContactModalOpen(true)
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Groupes</h1>
          <p className="text-muted-foreground mt-1">
            Gérez les groupes de contacts de toutes les entreprises
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={loadGroups} disabled={isLoading}>
            Actualiser
          </Button>
          <Button onClick={() => setIsCreateOpen(true)}>Nouveau groupe</Button>
        </div>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-3">
          <CardTitle className="text-lg">Filtres</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <div>
            <p className="text-sm font-medium mb-2">Filtrer par entreprise</p>
            <Select value={selectedEnterpriseId} onValueChange={setSelectedEnterpriseId}>
              <SelectTrigger className="w-full">
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
          <div>
            <p className="text-sm font-medium mb-2">Nombre de contacts minimum</p>
            <Input
              type="number"
              placeholder="Ex: 10"
              value={contactCountFilter}
              onChange={(e) => setContactCountFilter(e.target.value)}
            />
          </div>
        </div>
          </CardContent>
      </Card>

      <div>
        <div className="pb-3 flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="text-lg font-semibold">Liste des groupes</div>
            <div className="flex items-center gap-1">
              <Button
                variant={viewMode === "grid" ? "secondary" : "ghost"}
                size="icon"
                onClick={() => setViewMode("grid")}
                className="h-9 w-9"
              >
                <LayoutGrid className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === "list" ? "secondary" : "ghost"}
                size="icon"
                onClick={() => setViewMode("list")}
                className="h-9 w-9"
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
            <div className="text-sm text-muted-foreground">
              {filteredGroups.length} groupe(s) trouvé(s)
            </div>
          </div>
                  </div>

        {isLoading && viewMode === 'grid' ? (
          <GroupCardsSkeleton />
        ) : filteredGroups.length === 0 ? (
          <div className="text-sm text-muted-foreground border border-dashed rounded-lg p-6 text-center">
            Aucun groupe
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
                      "cursor-pointer border transition-all duration-200 hover:shadow-sm",
                      isSelected && "border-primary ring-2 ring-primary/20"
                    )}
                    onClick={() => setSelectedGroupId(g.id)}
                  >
                    <CardHeader className="space-y-0.5 pb-2">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
                          {g.code || "—"}
                        </span>
                        <Badge variant="outline" className="text-[10px] px-2 py-0">
                          {g.enterpriseFull?.socialRaison}
                        </Badge>
                      </div>
                      <CardTitle className="text-lg leading-tight">{g.name}</CardTitle>
                      <CardDescription>
                        {contacts.length} contact(s) • ID: {g.id.slice(0, 6)}…
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div className="rounded-md bg-muted/40 p-2 flex items-center gap-2">
                          <div className="rounded-full bg-background p-1">
                            <Building size="14" variant="Bulk" color="currentColor" className="text-primary" />
                          </div>
                          <div className="min-w-0">
                            <p className="text-[10px] text-muted-foreground">Entreprise</p>
                            <p className="font-semibold truncate">{g.enterpriseFull?.socialRaison}</p>
                          </div>
                        </div>
                        <div className="rounded-md bg-muted/40 p-2 flex items-center gap-2">
                          <div className="rounded-full bg-background p-1">
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
                          disabled={isCreating}
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
                          disabled={isCreating}
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

            <div className="mt-4 flex flex-col gap-3 rounded-lg border bg-muted/30 px-4 py-3 text-sm text-muted-foreground lg:flex-row lg:items-center lg:justify-between">
              <div>
                Affichage{" "}
                {totalGroups === 0
                  ? "0"
                  : `${page * pageSize + 1}-${Math.min((page + 1) * pageSize, totalGroups)}`}{" "}
                sur {totalGroups} groupes
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <div className="flex items-center gap-1">
                  <Button variant="ghost" size="sm" onClick={handlePrevPage} disabled={page === 0}>
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <span className="text-xs">
                    Page {page + 1} / {totalPages}
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleNextPage}
                    disabled={page >= totalPages - 1}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
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

      <AlertDialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Nouveau groupe</AlertDialogTitle>
            <AlertDialogDescription>
              Créez un groupe pour organiser les contacts d'une entreprise.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <div className="space-y-3">
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
            <AlertDialogCancel disabled={isCreating}>Annuler</AlertDialogCancel>
            <AlertDialogAction onClick={handleCreateGroup} disabled={isCreating}>
              Créer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Supprimer ce groupe ?</AlertDialogTitle>
            <AlertDialogDescription>
              Cette action est irréversible. Le groupe sera supprimé.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isCreating}>Annuler</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteGroup} disabled={isCreating}>
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

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

      <AlertDialog open={isRemoveContactOpen} onOpenChange={setIsRemoveContactOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Retirer le contact du groupe ?</AlertDialogTitle>
            <AlertDialogDescription>
              Le contact sera retiré du groupe.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isCreating}>Annuler</AlertDialogCancel>
            <AlertDialogAction onClick={handleRemoveContact} disabled={isCreating}>
              Retirer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
