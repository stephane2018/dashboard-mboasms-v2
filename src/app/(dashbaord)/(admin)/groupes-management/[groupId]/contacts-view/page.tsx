"use client"

import { useState, useEffect, useMemo } from "react"
import { useRouter, useParams } from "next/navigation"
import { toast } from "sonner"
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card"
import { Button } from "@/shared/ui/button"
import { Input } from "@/shared/ui/input"
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
import { ArrowLeft, SearchNormal1, Profile2User, Sms, UserAdd, DocumentDownload, Call, People, Trash } from "iconsax-react"
import { contactService } from "@/core/services/contact.service"
import { useSendToGroup } from "@/core/hooks/useContactMessage"
import { useDeleteContactFromGroup } from "@/core/hooks/use-groups"
import { groupsService } from "@/core/services/groups.service"
import { useAuthContext } from "@/core/providers"
import { useT } from "@/core/hooks"
import { useSMSStore } from "@/core/stores/smsStore"
import { Skeleton } from "@/shared/ui/skeleton"
import type { EnterpriseContactResponseType } from "@/core/models/contact-new"
import { ContactsDataTable } from "./components/contacts-data-table"
import { SMSModal } from "@/app/(dashbaord)/(admin)/users/_components/sms-modal"
import { ContactSelectionModal } from "@/shared/common/contact-selection-modal"
import { checkPhoneValidation, getPhoneValidationStatus } from "@/core/utils/phone-validation"
import { exportToExcelSecure } from "@/shared/utils/excel-secure.utils"
import { i18next } from "@/core/lib/i18n"

export default function GroupContactsViewPage() {
  const router = useRouter()
  const params = useParams()
  const { t } = useT()
  const groupId = params.groupId as string

  const [searchTerm, setSearchTerm] = useState("")
  const [isMessageModalOpen, setIsMessageModalOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [contactToDelete, setContactToDelete] = useState<EnterpriseContactResponseType | null>(null)
  const [selectedContactForMessage, setSelectedContactForMessage] = useState<EnterpriseContactResponseType | null>(null)
  const [isSMSModalOpen, setIsSMSModalOpen] = useState(false)
  const [isAddContactModalOpen, setIsAddContactModalOpen] = useState(false)
  const [isAddingContacts, setIsAddingContacts] = useState(false)
  const [isExporting, setIsExporting] = useState(false)

  const { sendToGroup, isLoading: isSending } = useSendToGroup()
  const { deleteContactFromGroup, isDeleting } = useDeleteContactFromGroup()
  const { user } = useAuthContext()
  const setPrefilledContacts = useSMSStore((s) => s.setPrefilledContacts)
  const setPrefilledGroup = useSMSStore((s) => s.setPrefilledGroup)

  const [contacts, setContacts] = useState<EnterpriseContactResponseType[]>([])
  const [groupInfo, setGroupInfo] = useState<any>(null)

  const loadContacts = async () => {
    if (!user?.companyId || !groupId) return

    setIsLoading(true)
    setError(null)

    try {
      const result = await contactService.getContactsByGroup(groupId, user.companyId) as any
      setContacts(result.contacts || [])
      setGroupInfo(result.groupInfo || { name: `${i18next.t('groups.title')} ${groupId}` })
    } catch (err) {
      setError(i18next.t("groupContacts.loadError"))
      toast.error(i18next.t("groupContacts.loadError"))
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadContacts()
  }, [groupId, user?.companyId])

  const handleSendMessageToGroup = async (message: string) => {
    if (!user?.companyId) {
      toast.error(i18next.t("groupContacts.userInfoMissing"))
      return
    }

    try {
      const contactIds = contacts.map(c => c.id).join(',')
      await sendToGroup({
        groupId,
        message,
        enterpriseId: user.companyId,
        contacts: contactIds,
        senderId: '',
      })
      toast.success(i18next.t("groupContacts.messageSentToGroup", { name: groupInfo?.name }))
      setIsMessageModalOpen(false)
    } catch (error) {
      // Error is already handled by the hook
    }
  }

  const handleUpdate = (updatedContact: EnterpriseContactResponseType) => {
    setContacts(prev => prev.map(c => c.id === updatedContact.id ? updatedContact : c))
    toast.success(i18next.t("groupContacts.contactUpdated"))
    loadContacts()
  }

  const handleDelete = (contact: EnterpriseContactResponseType) => {
    setContactToDelete(contact)
    setDeleteDialogOpen(true)
  }

  const handleConfirmDelete = async () => {
    if (!contactToDelete || !user?.companyId) return

    const contactToRemove = contactToDelete
    setContacts(prev => prev.filter(c => c.id !== contactToRemove.id))
    setDeleteDialogOpen(false)
    setContactToDelete(null)

    try {
      await deleteContactFromGroup(groupId, contactToRemove.id)
      toast.success(i18next.t("groupContacts.contactRemovedFromGroup", { name: `${contactToRemove.firstname} ${contactToRemove.lastname}` }))
      loadContacts()
    } catch (error) {
      toast.error(i18next.t("groups.deleteContactError"))
      setContacts(prev => [...prev, contactToRemove])
    }
  }

  const handleSendMessageToContact = (contact: EnterpriseContactResponseType) => {
    setSelectedContactForMessage(contact)
    setIsSMSModalOpen(true)
  }

  const handleSendMessageFromGroup = () => {
    const validContacts = contacts.filter(
      (c) => c.phoneNumber && getPhoneValidationStatus(c.phoneNumber) === "CORRECT"
    )

    if (validContacts.length === 0) {
      toast.error(i18next.t("groupContacts.noValidContactsToSend") || "Aucun contact valide à envoyer")
      return
    }

    setPrefilledContacts(
      validContacts.map((c) => ({
        id: c.id,
        name: `${c.firstname || ""} ${c.lastname || ""}`.trim(),
        phoneNumber: c.phoneNumber || "",
        email: c.email || undefined,
      }))
    )

    setPrefilledGroup({
      id: groupId,
      name: groupInfo?.name || `${i18next.t("groups.title")} ${groupId}`,
      contactCount: validContacts.length,
      sourceUrl: `/groupes-management/${groupId}/contacts-view`,
    })

    router.push("/sms")
  }

  const handleAddContacts = async (selectedContacts: EnterpriseContactResponseType[]) => {
    if (selectedContacts.length === 0) return

    setIsAddingContacts(true)

    setContacts(prev => [...prev, ...selectedContacts])
    setIsAddContactModalOpen(false)
    toast.success(i18next.t("groupContacts.contactsAddedToGroup", { count: selectedContacts.length }))

    try {
      const contactIds = selectedContacts.map(c => c.id)
      await groupsService.addContactsToGroup(groupId, contactIds)
      loadContacts()
    } catch (error) {
      toast.error(i18next.t("groupContacts.addContactsError"))
      const addedIds = new Set(selectedContacts.map(c => c.id))
      setContacts(prev => prev.filter(c => !addedIds.has(c.id)))
    } finally {
      setIsAddingContacts(false)
    }
  }

  const handleExportContacts = async () => {
    if (filteredContacts.length === 0) {
      toast.error(i18next.t("groupContacts.noContactsToExport"))
      return
    }

    setIsExporting(true)
    try {
      const exportData = filteredContacts.map(contact => ({
        [i18next.t("contactColumns.firstName")]: contact.firstname || '',
        [i18next.t("contactColumns.lastName")]: contact.lastname || '',
        [i18next.t("common.phone")]: contact.phoneNumber || '',
        [i18next.t("common.email")]: contact.email || '',
        [i18next.t("common.country")]: contact.country || '',
        [i18next.t("common.city")]: contact.city || '',
        [i18next.t("contactColumns.gender")]: contact.gender || '',
        [i18next.t("contactColumns.archived")]: contact.archived ? i18next.t("common.yes") : i18next.t("common.no"),
        [i18next.t("common.status")]: (contact as { enabled?: boolean })?.enabled ? i18next.t("contactColumns.active") : i18next.t("contactColumns.inactive"),
      }))

      const date = new Date().toISOString().split('T')[0]
      const filename = `contacts_${groupInfo?.name || groupId}_${date}`

      await exportToExcelSecure({
        fileName: filename,
        sheetName: 'Contacts',
        data: exportData,
      })

      toast.success(i18next.t("groupContacts.contactsExported", { count: filteredContacts.length }))
    } catch (error) {
      toast.error(i18next.t("groupContacts.exportError"))
    } finally {
      setIsExporting(false)
    }
  }

  // Filter contacts based on search term
  const filteredContacts = contacts.filter(contact => {
    if (!contact) return false
    const fullName = `${contact.firstname || ''} ${contact.lastname || ''}`.toLowerCase()
    const phone = contact.phoneNumber || ''
    const email = (contact.email || '').toLowerCase()
    const searchLower = searchTerm.toLowerCase()

    return fullName.includes(searchLower) || phone.includes(searchTerm) || email.includes(searchLower)
  })

  // Calculate statistics
  const contactStats = useMemo(() => {
    const stats = {
      total: filteredContacts.length,
      valid: 0,
      invalid: 0,
      operators: {
        MTN: 0,
        ORANGE: 0,
        NEXTTEL: 0,
        CAMTEL: 0,
        UNKNOWN: 0,
      }
    }

    filteredContacts.forEach(contact => {
      const phoneNumber = contact.phoneNumber || ''
      const validationStatus = getPhoneValidationStatus(phoneNumber)
      const operator = checkPhoneValidation(phoneNumber)

      if (validationStatus === 'CORRECT') {
        stats.valid++
      } else {
        stats.invalid++
      }

      stats.operators[operator]++
    })

    return stats
  }, [filteredContacts])

  if (isLoading) {
    return (
      <div className="space-y-6 p-6">
        {/* Header Skeleton */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Skeleton className="h-10 w-10 rounded-lg" />
            <div className="space-y-2">
              <Skeleton className="h-8 w-64" />
              <Skeleton className="h-4 w-32" />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Skeleton className="h-10 w-40" />
            <Skeleton className="h-10 w-32" />
            <Skeleton className="h-10 w-36" />
          </div>
        </div>

        {/* Search Skeleton */}
        <div className="flex items-center gap-2 max-w-md">
          <Skeleton className="h-10 w-full" />
        </div>

        {/* Statistics Cards Skeleton */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="border-0 shadow-md">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-8 w-12" />
                    <Skeleton className="h-3 w-20" />
                  </div>
                  <Skeleton className="h-12 w-12 rounded-full" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Table Skeleton */}
        <Card>
          <CardHeader className="pb-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <Skeleton className="h-6 w-32" />
              <Skeleton className="h-10 w-96" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {/* Table Header Skeleton */}
              <div className="flex items-center gap-4 pb-3 border-b">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-4 w-28" />
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-4 w-28" />
                <Skeleton className="h-4 w-16" />
              </div>
              {/* Table Rows Skeleton */}
              {[...Array(8)].map((_, i) => (
                <div key={i} className="flex items-center gap-4 py-3 border-b last:border-b-0">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-4 w-28" />
                  <Skeleton className="h-6 w-16 rounded-full" />
                  <Skeleton className="h-6 w-16 rounded-full" />
                  <Skeleton className="h-6 w-16 rounded-full" />
                  <Skeleton className="h-6 w-16 rounded-full" />
                  <div className="flex items-center gap-2">
                    <Skeleton className="h-8 w-8 rounded" />
                    <Skeleton className="h-8 w-8 rounded" />
                    <Skeleton className="h-8 w-8 rounded" />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (error) {
    return (
      <div className="space-y-6 p-6">
        <div className="flex items-center gap-4">
          <Button variant="outline" onClick={() => router.back()}>
            <ArrowLeft size={20} />
          </Button>
          <h1 className="text-2xl font-bold">{t('groupContacts.title')}</h1>
        </div>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center text-red-600">
              {t('groupContacts.loadErrorMessage')}
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  const kpiCards = [
    { label: t('groupContacts.totalContacts'), value: contactStats.total, Icon: People, color: "text-blue-600 dark:text-blue-400", bg: "bg-blue-50 dark:bg-blue-500/10", ring: "ring-blue-200/50 dark:ring-blue-500/20", accent: "from-blue-500/15" },
    { label: "MTN", value: contactStats.operators.MTN, sub: `${contactStats.valid > 0 ? Math.round((contactStats.operators.MTN / contactStats.valid) * 100) : 0}% ${t('groupContacts.ofValid')}`, Icon: Call, color: "text-yellow-600 dark:text-yellow-400", bg: "bg-yellow-50 dark:bg-yellow-500/10", ring: "ring-yellow-200/50 dark:ring-yellow-500/20", accent: "from-yellow-500/15" },
    { label: "Orange", value: contactStats.operators.ORANGE, sub: `${contactStats.valid > 0 ? Math.round((contactStats.operators.ORANGE / contactStats.valid) * 100) : 0}% ${t('groupContacts.ofValid')}`, Icon: Call, color: "text-orange-600 dark:text-orange-400", bg: "bg-orange-50 dark:bg-orange-500/10", ring: "ring-orange-200/50 dark:ring-orange-500/20", accent: "from-orange-500/15" },
    { label: t('groupContacts.others'), value: contactStats.operators.NEXTTEL + contactStats.operators.CAMTEL, sub: "Nexttel & Camtel", Icon: Call, color: "text-purple-600 dark:text-purple-400", bg: "bg-purple-50 dark:bg-purple-500/10", ring: "ring-purple-200/50 dark:ring-purple-500/20", accent: "from-purple-500/15" },
  ]

  return (
    <div className="space-y-6 p-4 md:p-6">
      {/* Hero header */}
      <section className="relative overflow-hidden rounded-3xl border border-border/60 bg-gradient-to-br from-primary/10 via-primary/5 to-transparent p-5 sm:p-6">
        <div className="absolute inset-0 opacity-60 [background-image:radial-gradient(circle_at_top_right,theme(colors.primary/15),transparent_60%)]" />
        <div className="relative flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3 min-w-0">
            <Button
              variant="outline"
              size="icon"
              onClick={() => router.back()}
              className="shrink-0 h-10 w-10 rounded-xl bg-background/60 backdrop-blur"
            >
              <ArrowLeft size={18} variant="Bulk" color="currentColor" className="text-primary" />
            </Button>
            <div className="rounded-xl bg-primary/15 p-2.5 ring-1 ring-primary/20 shrink-0">
              <Profile2User size={22} variant="Bulk" color="currentColor" className="text-primary" />
            </div>
            <div className="min-w-0">
              <h1 className="text-xl sm:text-2xl font-bold text-foreground truncate">
                {groupInfo?.name || `${t('groups.title')} ${groupId}`}
              </h1>
              <p className="text-xs text-muted-foreground mt-0.5">
                {filteredContacts.length} contact{filteredContacts.length > 1 ? "s" : ""} · {contactStats.valid} {t('groupContacts.ofValid').toLowerCase()}
              </p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsAddContactModalOpen(true)}
              disabled={isAddingContacts}
              className="rounded-xl gap-2 bg-background/60 backdrop-blur"
            >
              <UserAdd size={14} variant="Bulk" color="currentColor" />
              {t('groups.addContacts')}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleExportContacts}
              disabled={filteredContacts.length === 0 || isExporting}
              className="rounded-xl gap-2 bg-background/60 backdrop-blur"
            >
              <DocumentDownload size={14} variant="Bulk" color="currentColor" />
              {isExporting ? t('groupContacts.exporting') : t('common.export')}
            </Button>
            <Button
              size="sm"
              onClick={handleSendMessageFromGroup}
              disabled={filteredContacts.length === 0}
              className="rounded-xl gap-2 bg-primary text-white font-semibold shadow-md shadow-primary/25 hover:shadow-lg hover:shadow-primary/30 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
            >
              <Sms size={14} variant="Bulk" color="currentColor" />
              {t('groupContacts.sendMessage')}
            </Button>
          </div>
        </div>
      </section>

      {/* KPI cards */}
      {!isLoading && filteredContacts.length > 0 && (
        <section className="grid gap-3 grid-cols-2 lg:grid-cols-4">
          {kpiCards.map((kpi) => (
            <div
              key={kpi.label}
              className="group relative overflow-hidden rounded-2xl border border-border/60 bg-card p-5 transition-all duration-300 hover:shadow-md hover:-translate-y-0.5"
            >
              <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 [background-image:radial-gradient(circle_at_top_right,var(--tw-gradient-from)_0%,transparent_70%)] ${kpi.accent}`} />
              <div className="relative flex items-start justify-between">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">{kpi.label}</p>
                  <p className="text-3xl font-bold text-foreground leading-none mt-2 tabular-nums">{kpi.value}</p>
                  {(kpi as any).sub && (
                    <p className="text-[11px] text-muted-foreground mt-1.5">{(kpi as any).sub}</p>
                  )}
                </div>
                <div className={`rounded-xl p-2.5 ring-1 ${kpi.bg} ${kpi.ring}`}>
                  <kpi.Icon size={18} variant="Bulk" color="currentColor" className={kpi.color} />
                </div>
              </div>
            </div>
          ))}
        </section>
      )}

      {/* Contacts Table */}
      <section className="rounded-2xl border border-border/60 bg-card overflow-hidden">
        <div className="px-5 pt-4 pb-3 border-b border-border/60 bg-gradient-to-r from-primary/5 to-transparent">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
            <h2 className="text-sm font-semibold text-foreground flex items-center gap-2">
              <People size={14} variant="Bulk" color="currentColor" className="text-primary" />
              {t('groupContacts.contactList')}
              <span className="text-[11px] font-medium text-muted-foreground tabular-nums ml-1">
                ({filteredContacts.length})
              </span>
            </h2>
            <div className="relative w-full md:w-80">
              <SearchNormal1 size={14} variant="Bulk" color="currentColor" className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder={t('groupContacts.searchPlaceholder')}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 h-9 rounded-lg"
              />
            </div>
          </div>
        </div>
        <div className="p-5">
          <ContactsDataTable
            data={filteredContacts}
            isLoading={isLoading}
            enterpriseId={user?.companyId || ""}
            onUpdate={handleUpdate}
            onDelete={handleDelete}
            onSendMessage={handleSendMessageToContact}
          />
        </div>
      </section>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent className="sm:max-w-[440px] p-0 gap-0 overflow-hidden">
          <div className="relative bg-gradient-to-br from-red-500/10 via-red-500/5 to-transparent border-b border-border/60 px-5 py-5">
            <AlertDialogHeader>
              <div className="flex items-start gap-3 text-left">
                <div className="rounded-xl bg-red-500/15 p-2.5 ring-1 ring-red-500/20">
                  <Trash size={20} color="currentColor" variant="Bulk" className="text-red-500" />
                </div>
                <div className="flex-1">
                  <AlertDialogTitle className="text-base font-semibold">{t('groupContacts.removeFromGroup')}</AlertDialogTitle>
                  <AlertDialogDescription className="text-xs text-muted-foreground mt-0.5">
                    {t('groupContacts.removeConfirm', {
                      name: `${contactToDelete?.firstname} ${contactToDelete?.lastname}`
                    })}
                  </AlertDialogDescription>
                </div>
              </div>
            </AlertDialogHeader>
          </div>
          <AlertDialogFooter className="px-5 py-3.5 border-t border-border/60 bg-background/80 backdrop-blur-md">
            <AlertDialogCancel disabled={isDeleting} className="rounded-lg mt-0">{t('common.cancel')}</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDelete}
              disabled={isDeleting}
              className="rounded-lg gap-2 bg-red-600 text-white font-semibold hover:bg-red-700 shadow-md shadow-red-600/25 transition-all duration-200"
            >
              {isDeleting ? t('groupContacts.removing') : t('groupContacts.remove')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* SMS Modal for Individual Contact */}
      <SMSModal
        isOpen={isSMSModalOpen}
        onClose={() => {
          setIsSMSModalOpen(false)
          setSelectedContactForMessage(null)
        }}
        selectedContacts={selectedContactForMessage ? [selectedContactForMessage] : []}
        onSend={async () => {
          setIsSMSModalOpen(false)
          setSelectedContactForMessage(null)
        }}
      />

      {/* Add Contacts Modal */}
      <ContactSelectionModal
        isOpen={isAddContactModalOpen}
        onClose={() => setIsAddContactModalOpen(false)}
        onSelectContacts={handleAddContacts}
        existingContactIds={contacts.map(c => c.id)}
        enterpriseId={user?.companyId}
      />
    </div>
  )
}
