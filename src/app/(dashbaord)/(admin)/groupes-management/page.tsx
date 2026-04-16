"use client"

import { useEffect, useState, useMemo } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/shared/ui/button"
import { Card, CardContent } from "@/shared/ui/card"
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/shared/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/ui/select"
import { Separator } from "@/shared/ui/separator"
import { Label } from "@/shared/ui/label"
import { toast } from "sonner"
import type { EnterpriseContactResponseType } from "@/core/models/contact-new"
import { ContactSelectionModal } from "@/shared/common/contact-selection-modal"
import { GroupTableView } from "./group-table-view"
import { useGroups } from "@/core/hooks/useGroups"
import { useT } from "@/core/hooks"
import type { GroupWithEnterprise } from "@/core/hooks/useGroups"
import { ChevronLeft, ChevronRight, LayoutGrid, List, RefreshCw } from "lucide-react"
import { People, Building, AddSquare, Trash, Add, SearchNormal1, FolderOpen, Refresh2, FolderAdd, Hashtag, Warning2, UserMinus } from "iconsax-react"
import { Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { i18next } from "@/core/lib/i18n"

const GROUP_CARD_PLACEHOLDER_COUNT = 6

function GroupCardsSkeleton() {
  return (
    <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
      {Array.from({ length: GROUP_CARD_PLACEHOLDER_COUNT }).map((_, index) => (
        <div key={`group-card-skeleton-${index}`} className="rounded-2xl border border-border/50 p-4">
          <div className="flex items-start gap-2.5 mb-3">
            <Skeleton className="h-9 w-9 rounded-xl shrink-0" />
            <div className="space-y-1.5 flex-1">
              <Skeleton className="h-4 w-2/3" />
              <Skeleton className="h-3 w-1/2" />
            </div>
            <Skeleton className="h-5 w-8 rounded-full" />
          </div>
          <div className="flex gap-4 mb-3 px-1">
            <Skeleton className="h-3 w-20" />
            <Skeleton className="h-3 w-24" />
          </div>
          <div className="flex gap-2 pt-3 border-t border-border/40">
            <Skeleton className="h-8 flex-1 rounded-xl" />
            <Skeleton className="h-8 w-10 rounded-xl" />
          </div>
        </div>
      ))}
    </div>
  )
}

export default function AdminGroupesPage() {
  const router = useRouter()
  const { t } = useT()

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
      toast.error(i18next.t("adminGroups.nameRequired"))
      return
    }

    const enterpriseId = newGroupEnterpriseId || undefined

    try {
      await createGroup({
        name: newGroupName.trim(),
        code: (newGroupCode || newGroupName).toLowerCase().replace(/\s+/g, "_"),
        enterpriseId,
      })
      toast.success(i18next.t("groups.created"))
      setIsCreateOpen(false)
      setNewGroupName("")
      setNewGroupCode("")
      setNewGroupEnterpriseId("")
    } catch {
      toast.error(i18next.t("adminGroups.createError"))
    }
  }

  const handleDeleteGroup = async () => {
    if (!groupToDelete?.id) return

    try {
      await deleteGroup(groupToDelete.id)
      toast.success(i18next.t("groups.deleted"))
      setIsDeleteOpen(false)
      setGroupToDelete(null)
    } catch {
      toast.error(i18next.t("adminGroups.deleteError"))
    }
  }

  const handleAddContactsToGroup = async (selected: EnterpriseContactResponseType[]) => {
    if (!selectedGroupForContacts?.id) return
    if (selected.length === 0) {
      toast.info(i18next.t("adminGroups.selectContactsToAdd"))
      return
    }

    const ids = selected.map((c) => c.id)
    const groupId = selectedGroupForContacts.id
    const toastId = toast.loading(i18next.t("adminGroups.updatingGroup"))

    try {
      await addContactsToGroup(groupId, ids, selected)
      toast.success(i18next.t("adminGroups.contactsAdded", { count: ids.length }), { id: toastId })
      setIsContactModalOpen(false)
      setSelectedGroupForContacts(null)
    } catch {
      toast.error(i18next.t("adminGroups.addContactsError"), { id: toastId })
    }
  }

  const handleRemoveContact = async () => {
    if (!contactToRemove) return

    try {
      await removeContactFromGroup(contactToRemove.groupId, contactToRemove.contact.id)
      toast.success(i18next.t("adminGroups.contactRemovedFromGroup"))
      setIsRemoveContactOpen(false)
      setContactToRemove(null)
    } catch {
      toast.error(i18next.t("adminGroups.removeContactError"))
    }
  }

  const handleContactUpdated = async () => {
    try {
      await loadGroups()
      toast.success(i18next.t("groupContacts.contactUpdated"))
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
      toast.error(i18next.t("adminGroups.selectContactsWithValidNumber"))
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
    <div className="space-y-6 p-4 md:p-6">
      {/* Hero header */}
      <section className="relative overflow-hidden rounded-3xl border border-border/60 bg-gradient-to-br from-primary/10 via-primary/5 to-transparent p-5 sm:p-6">
        <div className="absolute inset-0 opacity-60 [background-image:radial-gradient(circle_at_top_right,theme(colors.primary/15),transparent_60%),radial-gradient(circle_at_bottom_left,theme(colors.violet.500/10),transparent_55%)]" />
        <div className="relative flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4 min-w-0">
            <div className="rounded-xl bg-primary/15 p-3 ring-1 ring-primary/20 shrink-0">
              <People size={24} variant="Bulk" color="currentColor" className="text-primary" />
            </div>
            <div className="min-w-0">
              <h1 className="text-xl sm:text-2xl font-bold text-foreground truncate">
                {_isSuperAdmin ? t("adminGroups.titlePlatform") : t("adminGroups.titleMy")}
              </h1>
              <p className="text-xs text-muted-foreground mt-0.5">
                {_isSuperAdmin ? t("adminGroups.subtitlePlatform") : t("adminGroups.subtitleMy")}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <Button
              variant="outline"
              size="sm"
              onClick={loadGroups}
              disabled={isLoading}
              className="rounded-xl gap-2 bg-background/60 backdrop-blur"
            >
              <Refresh2 size={14} variant="Bulk" className={cn(isLoading && "animate-spin")} />
              {t("common.refresh")}
            </Button>
            <Button
              size="sm"
              onClick={() => setIsCreateOpen(true)}
              className={cn(
                "rounded-xl gap-2 bg-primary text-white font-semibold",
                "shadow-md shadow-primary/25 hover:shadow-lg hover:shadow-primary/30",
                "hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
              )}
            >
              <Add size={14} variant="Bulk" color="currentColor" />
              {t("adminGroups.newGroup")}
            </Button>
          </div>
        </div>
      </section>

      {/* KPI cards */}
      <section className="grid gap-3 grid-cols-2 lg:grid-cols-3">
        {[
          {
            label: t("adminGroups.totalGroups"),
            value: totalGroups,
            Icon: FolderOpen,
            color: "text-blue-600 dark:text-blue-400",
            bg: "bg-blue-50 dark:bg-blue-500/10",
            ring: "ring-blue-200/50 dark:ring-blue-500/20",
            accent: "from-blue-500/15",
          },
          {
            label: t("adminGroups.totalContacts"),
            value: totalContacts,
            Icon: People,
            color: "text-emerald-600 dark:text-emerald-400",
            bg: "bg-emerald-50 dark:bg-emerald-500/10",
            ring: "ring-emerald-200/50 dark:ring-emerald-500/20",
            accent: "from-emerald-500/15",
          },
          {
            label: t("adminGroups.emptyGroups"),
            value: emptyGroups,
            Icon: FolderOpen,
            color: "text-amber-600 dark:text-amber-400",
            bg: "bg-amber-50 dark:bg-amber-500/10",
            ring: "ring-amber-200/50 dark:ring-amber-500/20",
            accent: "from-amber-500/15",
          },
        ].map((kpi) => (
          <div
            key={kpi.label}
            className={cn(
              "group relative overflow-hidden rounded-2xl border border-border/60 bg-card p-5",
              "transition-all duration-300 hover:shadow-md hover:-translate-y-0.5"
            )}
          >
            <div className={cn(
              "absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300",
              "[background-image:radial-gradient(circle_at_top_right,var(--tw-gradient-from)_0%,transparent_70%)]",
              kpi.accent
            )} />
            <div className="relative flex items-start justify-between">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">{kpi.label}</p>
                <p className="text-3xl font-bold text-foreground leading-none mt-2 tabular-nums">{kpi.value}</p>
              </div>
              <div className={cn("rounded-xl p-2.5 ring-1", kpi.bg, kpi.ring)}>
                <kpi.Icon size={18} variant="Bulk" color="currentColor" className={kpi.color} />
              </div>
            </div>
          </div>
        ))}
      </section>

      {/* Filters + toolbar */}
      <section className="rounded-2xl border border-border/60 bg-card overflow-hidden">
        <div className="px-5 pt-4 pb-3 border-b border-border/60 bg-gradient-to-r from-primary/5 to-transparent">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-sm font-semibold text-foreground flex items-center gap-2">
              <SearchNormal1 size={14} variant="Bulk" color="currentColor" className="text-primary" />
              {t("adminGroups.groupList")}
              <span className="text-[11px] font-medium text-muted-foreground tabular-nums ml-1">
                ({filteredGroups.length})
              </span>
            </h2>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1 rounded-lg border border-border/60 bg-muted/40 p-0.5">
                <Button
                  variant={viewMode === "grid" ? "secondary" : "ghost"}
                  size="icon"
                  onClick={() => setViewMode("grid")}
                  className="h-7 w-7 rounded-md"
                >
                  <LayoutGrid className="h-3.5 w-3.5" />
                </Button>
                <Button
                  variant={viewMode === "list" ? "secondary" : "ghost"}
                  size="icon"
                  onClick={() => setViewMode("list")}
                  className="h-7 w-7 rounded-md"
                >
                  <List className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Inline filters */}
        <div className="grid gap-3 sm:grid-cols-2 px-5 py-3 bg-muted/20 border-b border-border/60">
          <div className="space-y-1">
            <Label className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
              {t("adminGroups.enterprise")}
            </Label>
            <Select value={selectedEnterpriseId} onValueChange={setSelectedEnterpriseId} disabled={!_isSuperAdmin}>
              <SelectTrigger className="h-9 rounded-lg bg-background">
                <SelectValue placeholder={t("adminGroups.allEnterprises")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t("adminGroups.allEnterprises")}</SelectItem>
                {enterprises.map((e) => (
                  <SelectItem key={e.id} value={e.id}>{e.socialRaison}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1">
            <Label className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
              {t("adminGroups.minContacts")}
            </Label>
            <Input
              type="number"
              placeholder={t("adminGroups.minContactsPlaceholder")}
              value={contactCountFilter}
              onChange={(e) => setContactCountFilter(e.target.value)}
              className="h-9 rounded-lg bg-background"
            />
          </div>
        </div>

        {/* Content */}
        <div className="p-5">
          {isLoading && viewMode === "grid" ? (
            <GroupCardsSkeleton />
          ) : filteredGroups.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 gap-4">
              <div className="w-16 h-16 rounded-2xl bg-muted/50 flex items-center justify-center">
                <FolderOpen size={32} variant="Bulk" className="text-muted-foreground/40" />
              </div>
              <div className="text-center space-y-1">
                <p className="text-sm font-medium text-muted-foreground">{t("adminGroups.noGroup")}</p>
                <p className="text-xs text-muted-foreground/60">{t("adminGroups.createGroupToStart")}</p>
              </div>
            </div>
          ) : viewMode === "grid" ? (
            <>
              <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                {paginatedGroups.map((g) => {
                  const contacts = g.enterpriseContacts || []
                  const isSelected = selectedGroupId === g.id

                  return (
                    <div
                      key={g.id}
                      className={cn(
                        "group/card relative overflow-hidden rounded-2xl border bg-card p-4 cursor-pointer",
                        "transition-all duration-300 hover:shadow-md hover:-translate-y-0.5",
                        isSelected
                          ? "border-primary/40 ring-2 ring-primary/15 bg-primary/[0.02]"
                          : "border-border/60 hover:border-border"
                      )}
                      onClick={() => handleGroupClick(g.id)}
                    >
                      {/* Hover glow */}
                      <div className="absolute inset-0 opacity-0 group-hover/card:opacity-100 transition-opacity duration-300 [background-image:radial-gradient(circle_at_top_right,theme(colors.primary/10),transparent_60%)]" />

                      <div className="relative">
                        {/* Header */}
                        <div className="flex items-start justify-between gap-3 mb-3">
                          <div className="flex items-center gap-2.5 min-w-0">
                            <div className={cn(
                              "rounded-xl p-2.5 shrink-0 ring-1 transition-colors",
                              isSelected
                                ? "bg-primary/15 ring-primary/20"
                                : "bg-primary/10 ring-primary/10 group-hover/card:bg-primary/15"
                            )}>
                              <People size={16} variant="Bulk" color="currentColor" className="text-primary" />
                            </div>
                            <div className="min-w-0">
                              <h3 className="text-sm font-semibold truncate group-hover/card:text-primary transition-colors">
                                {g.name}
                              </h3>
                              <p className="text-[11px] text-muted-foreground truncate">
                                {g.code || "\u2014"} · {g.enterpriseFull?.socialRaison}
                              </p>
                            </div>
                          </div>
                          <span className={cn(
                            "text-[10px] font-bold px-2.5 py-1 rounded-full tabular-nums shrink-0",
                            contacts.length > 0
                              ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-400"
                              : "bg-muted text-muted-foreground"
                          )}>
                            {contacts.length}
                          </span>
                        </div>

                        {/* Stats */}
                        <div className="flex items-center gap-4 mb-4 px-1">
                          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                            <People size={12} variant="Bulk" color="currentColor" />
                            <span className="tabular-nums font-medium text-foreground">{contacts.length}</span>
                            <span>contact{contacts.length !== 1 ? "s" : ""}</span>
                          </div>
                          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                            <Building size={12} variant="Bulk" color="currentColor" />
                            <span className="truncate max-w-[120px]">{g.enterpriseFull?.socialRaison}</span>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-2 pt-3 border-t border-border/40">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={(e) => { e.stopPropagation(); handleOpenAddContacts(g) }}
                            disabled={isMutating}
                            className="flex-1 h-8 text-xs rounded-lg gap-1.5 hover:border-primary/40 hover:bg-primary/5"
                          >
                            <AddSquare size={13} color="currentColor" variant="Bulk" className="text-primary" />
                            {t("common.add")}
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation()
                              setGroupToDelete(g)
                              setIsDeleteOpen(true)
                            }}
                            disabled={isMutating}
                            className="h-8 w-8 p-0 rounded-lg text-muted-foreground hover:text-red-500 hover:bg-red-500/10"
                          >
                            <Trash size={13} color="currentColor" variant="Bulk" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="mt-5 flex items-center justify-between rounded-xl border border-border/60 bg-muted/20 px-4 py-2.5">
                  <span className="text-xs text-muted-foreground tabular-nums">
                    {totalGroups === 0
                      ? t("adminGroups.zeroGroups")
                      : `${page * pageSize + 1}-${Math.min((page + 1) * pageSize, totalGroups)} ${t("adminGroups.of")} ${totalGroups}`}
                  </span>
                  <div className="flex items-center gap-1">
                    <Button variant="ghost" size="icon" className="h-7 w-7 rounded-md" onClick={handlePrevPage} disabled={page === 0}>
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <span className="text-xs tabular-nums px-2 font-medium">{page + 1} / {totalPages}</span>
                    <Button variant="ghost" size="icon" className="h-7 w-7 rounded-md" onClick={handleNextPage} disabled={page >= totalPages - 1}>
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
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
      </section>

      {/* Create Group Dialog */}
      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent className="sm:max-w-[480px] p-0 gap-0 overflow-hidden">
          {/* Hero header */}
          <div className="relative bg-gradient-to-br from-primary/10 via-primary/5 to-transparent border-b border-border/60 px-5 py-5">
            <div className="absolute inset-0 opacity-40 [background-image:radial-gradient(circle_at_top_right,theme(colors.primary/15),transparent_60%)]" />
            <DialogHeader className="relative">
              <div className="flex items-start gap-3">
                <div className="rounded-xl bg-primary/15 p-2.5 ring-1 ring-primary/20">
                  <FolderAdd size={20} color="currentColor" variant="Bulk" className="text-primary" />
                </div>
                <div className="flex-1 text-left">
                  <DialogTitle className="text-base font-semibold text-foreground">
                    {t('adminGroups.newGroup')}
                  </DialogTitle>
                  <DialogDescription className="text-xs text-muted-foreground mt-0.5">
                    {t('adminGroups.createGroupDesc')}
                  </DialogDescription>
                </div>
              </div>
            </DialogHeader>
          </div>

          {/* Body */}
          <div className="px-5 py-5 space-y-5">
            {_isSuperAdmin && (
              <>
                <section className="space-y-2.5">
                  <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                    <Building size={12} color="currentColor" variant="Bulk" className="text-primary" />
                    {t('adminGroups.enterprise')} <span className="text-red-500 normal-case">*</span>
                  </div>
                  <Select value={newGroupEnterpriseId} onValueChange={setNewGroupEnterpriseId}>
                    <SelectTrigger className="h-10 rounded-lg">
                      <SelectValue placeholder={t('adminGroups.selectEnterprise')} />
                    </SelectTrigger>
                    <SelectContent>
                      {enterprises.map((e) => (
                        <SelectItem key={e.id} value={e.id}>
                          {e.socialRaison}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </section>
                <Separator />
              </>
            )}

            <section className="space-y-2.5">
              <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                <FolderOpen size={12} color="currentColor" variant="Bulk" className="text-primary" />
                {t('adminGroups.nameLabel')} <span className="text-red-500 normal-case">*</span>
              </div>
              <div className="relative">
                <FolderOpen size={16} color="currentColor" className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <Input
                  value={newGroupName}
                  onChange={(e) => setNewGroupName(e.target.value)}
                  placeholder={t('adminGroups.namePlaceholder')}
                  className="pl-10 h-10 rounded-lg"
                />
              </div>
            </section>

            <section className="space-y-2.5">
              <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                <Hashtag size={12} color="currentColor" variant="Bulk" className="text-primary" />
                {t('adminGroups.codeLabel')}
                <span className="text-muted-foreground/60 normal-case font-normal tracking-normal">({t('contacts.optional')})</span>
              </div>
              <div className="relative">
                <Hashtag size={16} color="currentColor" className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <Input
                  value={newGroupCode}
                  onChange={(e) => setNewGroupCode(e.target.value)}
                  placeholder={t('adminGroups.codePlaceholder')}
                  className="pl-10 h-10 rounded-lg font-mono text-sm uppercase"
                />
              </div>
            </section>
          </div>

          {/* Sticky footer */}
          <div className="sticky bottom-0 z-10 flex items-center justify-end gap-2 px-5 py-3.5 border-t border-border/60 bg-background/80 backdrop-blur-md">
            <Button
              variant="outline"
              onClick={() => setIsCreateOpen(false)}
              disabled={isMutating}
              className="rounded-lg"
            >
              {t('common.cancel')}
            </Button>
            <Button
              onClick={handleCreateGroup}
              disabled={isMutating}
              className={cn(
                "rounded-lg gap-2 bg-primary text-white font-semibold",
                "shadow-md shadow-primary/25 hover:shadow-lg hover:shadow-primary/30",
                "hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
              )}
            >
              {isMutating ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  {t('adminGroups.create')}...
                </>
              ) : (
                <>
                  <FolderAdd size={14} color="currentColor" variant="Bulk" />
                  {t('adminGroups.create')}
                </>
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Group Dialog */}
      <AlertDialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <AlertDialogContent className="sm:max-w-[440px] p-0 gap-0 overflow-hidden">
          <div className="relative bg-gradient-to-br from-red-500/10 via-red-500/5 to-transparent border-b border-border/60 px-5 py-5">
            <AlertDialogHeader>
              <div className="flex items-start gap-3 text-left">
                <div className="rounded-xl bg-red-500/15 p-2.5 ring-1 ring-red-500/20">
                  <Warning2 size={20} color="currentColor" variant="Bulk" className="text-red-500" />
                </div>
                <div className="flex-1">
                  <AlertDialogTitle className="text-base font-semibold text-foreground">
                    {t('adminGroups.deleteGroupConfirmTitle')}
                  </AlertDialogTitle>
                  <AlertDialogDescription className="text-xs text-muted-foreground mt-0.5">
                    {t('adminGroups.deleteGroupConfirmDesc')}
                  </AlertDialogDescription>
                </div>
              </div>
            </AlertDialogHeader>
          </div>
          <AlertDialogFooter className="px-5 py-3.5 border-t border-border/60 bg-background/80 backdrop-blur-md">
            <AlertDialogCancel disabled={isMutating} className="rounded-lg mt-0">
              {t('common.cancel')}
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteGroup}
              disabled={isMutating}
              className={cn(
                "rounded-lg gap-2 bg-red-600 text-white font-semibold hover:bg-red-700",
                "shadow-md shadow-red-600/25 hover:shadow-lg hover:shadow-red-600/30",
                "transition-all duration-200"
              )}
            >
              {isMutating ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Trash size={14} color="currentColor" variant="Bulk" />
              )}
              {t('common.delete')}
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
        <AlertDialogContent className="sm:max-w-[440px] p-0 gap-0 overflow-hidden">
          <div className="relative bg-gradient-to-br from-amber-500/10 via-amber-500/5 to-transparent border-b border-border/60 px-5 py-5">
            <AlertDialogHeader>
              <div className="flex items-start gap-3 text-left">
                <div className="rounded-xl bg-amber-500/15 p-2.5 ring-1 ring-amber-500/20">
                  <UserMinus size={20} color="currentColor" variant="Bulk" className="text-amber-500" />
                </div>
                <div className="flex-1">
                  <AlertDialogTitle className="text-base font-semibold text-foreground">
                    {t('adminGroups.removeContactTitle')}
                  </AlertDialogTitle>
                  <AlertDialogDescription className="text-xs text-muted-foreground mt-0.5">
                    {t('adminGroups.removeContactDesc')}
                  </AlertDialogDescription>
                </div>
              </div>
            </AlertDialogHeader>
          </div>
          <AlertDialogFooter className="px-5 py-3.5 border-t border-border/60 bg-background/80 backdrop-blur-md">
            <AlertDialogCancel disabled={isMutating} className="rounded-lg mt-0">
              {t('common.cancel')}
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleRemoveContact}
              disabled={isMutating}
              className={cn(
                "rounded-lg gap-2 bg-amber-600 text-white font-semibold hover:bg-amber-700",
                "shadow-md shadow-amber-600/25 hover:shadow-lg hover:shadow-amber-600/30",
                "transition-all duration-200"
              )}
            >
              {isMutating ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <UserMinus size={14} color="currentColor" variant="Bulk" />
              )}
              {t('groupContacts.remove')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
