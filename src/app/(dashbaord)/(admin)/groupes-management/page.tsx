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
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/shared/ui/table"
import { toast } from "sonner"
import { httpClient } from "@/core/lib/http-client"
import type { Group } from "@/modules/groups/types"
import type { EnterpriseContactResponseType } from "@/core/models/contact-new"
import { ContactSelectionModal } from "@/shared/common/contact-selection-modal"
import { ContactEditPopover } from "@/shared/common/contact-edit-popover"
import { groupsService } from "@/modules/groups/services"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"

interface Enterprise {
  id: string
  socialRaison: string
}

const GROUP_TABLE_COLUMNS = ["Nom", "Code", "Entreprise", "Contacts", "Actions"]

function GroupTableSkeleton() {
  return (
    <div className="border rounded-lg overflow-hidden">
      <div className="border-b bg-muted/40 px-4 py-3">
        <div className="h-5 w-40">
          <Skeleton className="h-5 w-32" />
        </div>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-10"></TableHead>
            {GROUP_TABLE_COLUMNS.map((column) => (
              <TableHead key={column}>{column}</TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {Array.from({ length: 5 }).map((_, index) => (
            <TableRow key={`group-skeleton-${index}`}>
              <TableCell>
                <Skeleton className="h-6 w-8" />
              </TableCell>
              {GROUP_TABLE_COLUMNS.map((column) => (
                <TableCell key={`${column}-${index}`}>
                  <Skeleton className="h-6 w-full" />
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

export default function AdminGroupesPage() {
  const [groups, setGroups] = useState<(Group & { enterpriseName?: string })[]>([])
  const [enterprises, setEnterprises] = useState<Enterprise[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [selectedEnterpriseId, setSelectedEnterpriseId] = useState<string>("all")
  const [selectedGroupId, setSelectedGroupId] = useState<string | null>(null)
  const [page, setPage] = useState(0)
  const [pageSize, setPageSize] = useState(10)
  const PAGE_SIZE_OPTIONS = [5, 10, 20, 50]

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
  const [selectedContactIds, setSelectedContactIds] = useState<Set<string>>(new Set())

  const filteredGroups = useMemo(() => {
    if (selectedEnterpriseId === "all") return groups
    return groups.filter((g) => g.enterprise === selectedEnterpriseId)
  }, [groups, selectedEnterpriseId])

  const totalGroups = filteredGroups.length
  const totalPages = Math.max(1, Math.ceil(totalGroups / pageSize))
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

  const handlePageSizeChange = (value: string) => {
    setPageSize(Number(value))
    setPage(0)
  }

  const handlePrevPage = () => setPage((prev) => Math.max(0, prev - 1))
  const handleNextPage = () => setPage((prev) => Math.min(totalPages - 1, prev + 1))

  const loadEnterprises = async () => {
    try {
      const data = await httpClient.get<Enterprise[]>("/api/v1/enterprise/all")
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
      const groupsWithNames = parsedGroups.map((g) => ({
        ...g,
        enterpriseName: enterprises.find((e) => e.id === g.enterprise)?.socialRaison || g.enterprise,
      }))
      setGroups(groupsWithNames)
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

      const enterpriseName = enterprises.find((e) => e.id === newGroupEnterpriseId)?.socialRaison
      setGroups((prev) => [
        ...prev,
        { ...created, enterpriseName },
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
    const ids = selected.map((c) => c.id)

    setIsCreating(true)
    try {
      await groupsService.addContactsToGroup(selectedGroupForContacts.id, ids)
      toast.success(`${ids.length} contact(s) ajouté(s)`)
      await loadGroups()
      setIsContactModalOpen(false)
    } catch (e) {
      toast.error("Erreur lors de l'ajout des contacts")
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
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Filtrer par entreprise</CardTitle>
        </CardHeader>
        <CardContent>
          <Select value={selectedEnterpriseId} onValueChange={setSelectedEnterpriseId}>
            <SelectTrigger className="w-full md:w-96">
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
        </CardContent>
      </Card>

      <div>
        <div className="pb-3">
          <div className="text-lg font-semibold">Liste des groupes</div>
          <div className="text-sm text-muted-foreground">
            {filteredGroups.length} groupe(s) trouvé(s)
          </div>
        </div>
        <div>
          {isLoading ? (
            <GroupTableSkeleton />
          ) : filteredGroups.length === 0 ? (
            <div className="text-sm text-muted-foreground">Aucun groupe</div>
          ) : (
            <div className="border rounded-lg overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-10"></TableHead>
                    <TableHead>Nom</TableHead>
                    <TableHead>Code</TableHead>
                    <TableHead>Entreprise</TableHead>
                    <TableHead>Contacts</TableHead>
                    <TableHead className="w-40">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedGroups.map((g) => {
                    const contacts = g.enterpriseContacts || []

                    return (
                      <TableRow
                        key={g.id}
                        className={cn(
                          "cursor-pointer hover:bg-muted/50 transition-colors",
                          selectedGroupId === g.id && "bg-primary/5"
                        )}
                        onClick={() => setSelectedGroupId(g.id)}
                      >
                        <TableCell>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            {g.code || "—"}
                          </div>
                        </TableCell>
                        <TableCell className="font-medium">{g.name}</TableCell>
                        <TableCell>{g.code}</TableCell>
                        <TableCell>{g.enterpriseName}</TableCell>
                        <TableCell>{contacts.length}</TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation()
                                setSelectedGroupForContacts(g)
                                setIsContactModalOpen(true)
                              }}
                              disabled={isCreating}
                            >
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
                            >
                              Supprimer
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
              <div className="flex flex-col gap-3 border-t bg-muted/30 px-3 py-2 text-sm text-muted-foreground md:flex-row md:items-center md:justify-between">
                <div>
                  Affichage{" "}
                  {totalGroups === 0
                    ? "0"
                    : `${page * pageSize + 1}-${Math.min((page + 1) * pageSize, totalGroups)}`}{" "}
                  sur {totalGroups} groupes
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <Select value={pageSize.toString()} onValueChange={handlePageSizeChange}>
                    <SelectTrigger className="h-8 w-28 text-xs">
                      <SelectValue placeholder="Taille" />
                    </SelectTrigger>
                    <SelectContent>
                      {PAGE_SIZE_OPTIONS.map((size) => (
                        <SelectItem key={size} value={size.toString()}>
                          {size} / page
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
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
            </div>
          )}
        </div>
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
