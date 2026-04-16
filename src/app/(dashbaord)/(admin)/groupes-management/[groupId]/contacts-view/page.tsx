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
import { ArrowLeft, SearchNormal1, Profile2User, Sms, UserAdd, DocumentDownload, Call, People } from "iconsax-react"
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

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={() => router.back()}>
            <ArrowLeft size={20} variant="Bulk" color="currentColor" className="text-primary" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <Profile2User size={24}  variant="Bulk" color="currentColor" className="text-primary"  />
              {groupInfo?.name || `${t('groups.title')} ${groupId}`}
            </h1>
            <p className="text-muted-foreground">
              {filteredContacts.length} contact{filteredContacts.length > 1 ? "s" : ""}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={() => setIsAddContactModalOpen(true)}
            disabled={isAddingContacts}
          >
            <UserAdd size={16} className="mr-2" variant="Bulk" color="currentColor" />
            {t('groups.addContacts')}
          </Button>
          <Button
            variant="outline"
            onClick={handleExportContacts}
            disabled={filteredContacts.length === 0 || isExporting}
          >
            <DocumentDownload size={16} className="mr-2" variant="Bulk" color="currentColor" />
            {isExporting ? t('groupContacts.exporting') : t('common.export')}
          </Button>
          <Button
            onClick={handleSendMessageFromGroup}
            disabled={filteredContacts.length === 0}
            className="bg-pink-600 hover:bg-pink-700"
          >
            <Sms size={16} color="currentColor" className="mr-2" variant="Bulk" />
            {t('groupContacts.sendMessage')}
          </Button>
        </div>
      </div>

      {/* Statistics */}
      {!isLoading && filteredContacts.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {/* Total */}
          <Card className="border-0 shadow-md hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">{t('groupContacts.totalContacts')}</p>
                  <p className="text-3xl font-bold mt-2">{contactStats.total}</p>
                </div>
                <div className="h-12 w-12 rounded-full bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center">
                  <People size={24} variant="Bulk" color="currentColor" className="text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* MTN */}
          <Card className="border-0 shadow-md hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">MTN</p>
                  <p className="text-3xl font-bold mt-2 text-yellow-600">{contactStats.operators.MTN}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {contactStats.valid > 0 ? Math.round((contactStats.operators.MTN / contactStats.valid) * 100) : 0}% {t('groupContacts.ofValid')}
                  </p>
                </div>
                <div className="h-12 w-12 rounded-full bg-yellow-100 dark:bg-yellow-900/20 flex items-center justify-center">
                  <Call size={24} variant="Bulk" color="currentColor" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Orange */}
          <Card className="border-0 shadow-md hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Orange</p>
                  <p className="text-3xl font-bold mt-2 text-orange-600">{contactStats.operators.ORANGE}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {contactStats.valid > 0 ? Math.round((contactStats.operators.ORANGE / contactStats.valid) * 100) : 0}% {t('groupContacts.ofValid')}
                  </p>
                </div>
                <div className="h-12 w-12 rounded-full bg-orange-100 dark:bg-orange-900/20 flex items-center justify-center">
                  <Call size={24} variant="Bulk" color="currentColor" className="text-orange-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Others (Nexttel + Camtel) */}
          <Card className="border-0 shadow-md hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">{t('groupContacts.others')}</p>
                  <p className="text-3xl font-bold mt-2 text-purple-600">
                    {contactStats.operators.NEXTTEL + contactStats.operators.CAMTEL}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Nexttel & Camtel
                  </p>
                </div>
                <div className="h-12 w-12 rounded-full bg-purple-100 dark:bg-purple-900/20 flex items-center justify-center">
                  <Call size={24} variant="Bulk" color="currentColor" className="text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Contacts Table */}
      <Card>
        <CardHeader className="pb-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <CardTitle className="text-xl">{t('groupContacts.contactList')}</CardTitle>
            <div className="relative w-full md:w-96">
              <SearchNormal1  variant="Bulk" color="currentColor" className="text-primary absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4" />
              <Input
                placeholder={t('groupContacts.searchPlaceholder')}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <ContactsDataTable
            data={filteredContacts}
            isLoading={isLoading}
            enterpriseId={user?.companyId || ""}
            onUpdate={handleUpdate}
            onDelete={handleDelete}
            onSendMessage={handleSendMessageToContact}
          />
        </CardContent>
      </Card>

      {/* Message Modal */}
      {isMessageModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="w-full max-w-md mx-4">
            <CardHeader>
              <CardTitle>{t('groupContacts.sendMessageToGroup')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <textarea
                placeholder={t('groupContacts.typeMessage')}
                className="w-full min-h-[100px] p-3 border rounded-md resize-none"
                id="group-message"
              />
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => setIsMessageModalOpen(false)}
                  className="flex-1"
                >
                  {t('common.cancel')}
                </Button>
                <Button
                  onClick={() => {
                    const message = (document.getElementById("group-message") as HTMLTextAreaElement)?.value
                    if (message?.trim()) {
                      handleSendMessageToGroup(message.trim())
                    }
                  }}
                  disabled={isSending}
                  className="flex-1 bg-pink-600 hover:bg-pink-700"
                >
                  {isSending ? t('sms.sending') : t('sms.send')}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t('groupContacts.removeFromGroup')}</AlertDialogTitle>
            <AlertDialogDescription>
              {t('groupContacts.removeConfirm', {
                name: `${contactToDelete?.firstname} ${contactToDelete?.lastname}`
              })}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>{t('common.cancel')}</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDelete}
              disabled={isDeleting}
              className="bg-red-600 hover:bg-red-700"
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
