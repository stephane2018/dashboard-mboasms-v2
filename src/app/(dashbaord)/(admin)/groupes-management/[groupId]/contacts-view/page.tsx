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
import { contactService } from "@/modules/contacts/services/contact.service"
import { useSendToGroup } from "@/modules/sms/hooks/useContactMessage"
import { useDeleteContactFromGroup } from "@/modules/groups/hooks/use-groups"
import { groupsService } from "@/modules/groups/services"
import { useAuthContext } from "@/core/providers"
import { Skeleton } from "@/shared/ui/skeleton"
import type { EnterpriseContactResponseType } from "@/core/models/contact-new"
import { ContactsDataTable } from "./components/contacts-data-table"
import { SMSModal } from "@/app/(dashbaord)/(admin)/users/_components/sms-modal"
import { ContactSelectionModal } from "@/shared/common/contact-selection-modal"
import { checkPhoneValidation, getPhoneValidationStatus } from "@/core/utils/phone-validation"
import * as XLSX from 'xlsx'

export default function GroupContactsViewPage() {
  const router = useRouter()
  const params = useParams()
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

  const [contacts, setContacts] = useState<EnterpriseContactResponseType[]>([])
  const [groupInfo, setGroupInfo] = useState<any>(null)

  const loadContacts = async () => {
    if (!user?.companyId || !groupId) return

    setIsLoading(true)
    setError(null)

    try {
      const result = await contactService.getContactsByGroup(groupId, user.companyId) as any
      console.log(result);
      setContacts(result.contacts || [])
      setGroupInfo(result.groupInfo || { name: `Groupe ${groupId}` })
    } catch (err) {
      console.error("Error loading group contacts:", err)
      setError("Erreur lors du chargement des contacts")
      toast.error("Erreur lors du chargement des contacts")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadContacts()
  }, [groupId, user?.companyId])

  const handleSendMessageToGroup = async (message: string) => {
    if (!user?.companyId) {
      toast.error("Erreur: Informations utilisateur manquantes")
      return
    }

    try {
      // Construct payload for sending to group
      const contactIds = contacts.map(c => c.id).join(',')
      await sendToGroup({
        groupId,
        message,
        enterpriseId: user.companyId,
        contacts: contactIds,
        senderId: '', // TODO: Add sender selection
      })
      toast.success(`Message envoyé au groupe "${groupInfo?.name}"`)
      setIsMessageModalOpen(false)
    } catch (error) {
      // Error is already handled by the hook
    }
  }

  const handleUpdate = (updatedContact: EnterpriseContactResponseType) => {
    // Update local state
    setContacts(prev => prev.map(c => c.id === updatedContact.id ? updatedContact : c))
    toast.success("Contact mis à jour")
    // Refresh to get latest data from server
    loadContacts()
  }

  const handleDelete = (contact: EnterpriseContactResponseType) => {
    setContactToDelete(contact)
    setDeleteDialogOpen(true)
  }

  const handleConfirmDelete = async () => {
    if (!contactToDelete || !user?.companyId) return

    try {
      // Delete contact from group (not from the system)
      await deleteContactFromGroup(groupId, contactToDelete.id)
      toast.success(`Contact "${contactToDelete.firstname} ${contactToDelete.lastname}" retiré du groupe`)

      setDeleteDialogOpen(false)
      setContactToDelete(null)

      // Refresh contacts list
      await loadContacts()
    } catch (error) {
      console.error("Error deleting contact from group:", error)
      toast.error("Erreur lors de la suppression du contact du groupe")
    }
  }

  const handleSendMessageToContact = (contact: EnterpriseContactResponseType) => {
    setSelectedContactForMessage(contact)
    setIsSMSModalOpen(true)
  }

  const handleAddContacts = async (selectedContacts: EnterpriseContactResponseType[]) => {
    if (selectedContacts.length === 0) return

    setIsAddingContacts(true)
    try {
      const contactIds = selectedContacts.map(c => c.id)
      await groupsService.addContactsToGroup(groupId, contactIds)

      toast.success(`${selectedContacts.length} contact(s) ajouté(s) au groupe`)
      setIsAddContactModalOpen(false)

      // Refresh contacts list
      await loadContacts()
    } catch (error) {
      console.error("Error adding contacts to group:", error)
      toast.error("Erreur lors de l'ajout des contacts au groupe")
    } finally {
      setIsAddingContacts(false)
    }
  }

  const handleExportContacts = () => {
    if (filteredContacts.length === 0) {
      toast.error("Aucun contact à exporter")
      return
    }

    setIsExporting(true)
    try {
      // Prepare data for export
      const exportData = filteredContacts.map(contact => ({
        Prénom: contact.firstname || '',
        Nom: contact.lastname || '',
        Téléphone: contact.phoneNumber || '',
        Email: contact.email || '',
        Pays: contact.country || '',
        Ville: contact.city || '',
        Genre: contact.gender || '',
        Archivé: contact.archived ? 'Oui' : 'Non',
        Statut: (contact as any)?.enabled ? 'Actif' : 'Inactif',
      }))

      // Create worksheet
      const worksheet = XLSX.utils.json_to_sheet(exportData)

      // Create workbook
      const workbook = XLSX.utils.book_new()
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Contacts')

      // Generate filename with group name and date
      const date = new Date().toISOString().split('T')[0]
      const filename = `contacts_${groupInfo?.name || groupId}_${date}.xlsx`

      // Download file
      XLSX.writeFile(workbook, filename)

      toast.success(`${filteredContacts.length} contact(s) exporté(s)`)
    } catch (error) {
      console.error("Error exporting contacts:", error)
      toast.error("Erreur lors de l'export des contacts")
    } finally {
      setIsExporting(false)
    }
  }

  // Filter contacts based on search term
  const filteredContacts = contacts.filter(contact => {
    console.log(contact)
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
        <div className="flex items-center gap-4">
          <Skeleton className="h-10 w-10" />
          <Skeleton className="h-8 w-64" />
        </div>
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-48" />
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex items-center space-x-4">
                  <Skeleton className="h-10 w-10 rounded-full" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-4 w-24" />
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
          <h1 className="text-2xl font-bold">Contacts du groupe</h1>
        </div>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center text-red-600">
              Une erreur est survenue lors du chargement des contacts
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
              {groupInfo?.name || `Groupe ${groupId}`}
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
            Ajouter des contacts
          </Button>
          <Button
            variant="outline"
            onClick={handleExportContacts}
            disabled={filteredContacts.length === 0 || isExporting}
          >
            <DocumentDownload size={16} className="mr-2" variant="Bulk" color="currentColor" />
            {isExporting ? "Export..." : "Exporter"}
          </Button>
          <Button
            onClick={() => setIsMessageModalOpen(true)}
            disabled={filteredContacts.length === 0}
            className="bg-pink-600 hover:bg-pink-700"
          >
            <Sms size={16} color="currentColor" className="mr-2" variant="Bulk" />
            Envoyer un message
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
                  <p className="text-sm font-medium text-muted-foreground">Total Contacts</p>
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
                    {contactStats.valid > 0 ? Math.round((contactStats.operators.MTN / contactStats.valid) * 100) : 0}% des valides
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
                    {contactStats.valid > 0 ? Math.round((contactStats.operators.ORANGE / contactStats.valid) * 100) : 0}% des valides
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
                  <p className="text-sm font-medium text-muted-foreground">Autres</p>
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
            <CardTitle className="text-xl">Liste des contacts</CardTitle>
            <div className="relative w-full md:w-96">
              <SearchNormal1  variant="Bulk" color="currentColor" className="text-primary absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4" />
              <Input
                placeholder="Rechercher un contact..."
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
              <CardTitle>Envoyer un message au groupe</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <textarea
                placeholder="Tapez votre message ici..."
                className="w-full min-h-[100px] p-3 border rounded-md resize-none"
                id="group-message"
              />
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => setIsMessageModalOpen(false)}
                  className="flex-1"
                >
                  Annuler
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
                  {isSending ? "Envoi en cours..." : "Envoyer"}
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
            <AlertDialogTitle>Retirer du groupe</AlertDialogTitle>
            <AlertDialogDescription>
              Êtes-vous sûr de vouloir retirer le contact{" "}
              <strong>
                {contactToDelete?.firstname} {contactToDelete?.lastname}
              </strong>{" "}
              de ce groupe ? Le contact ne sera pas supprimé de votre liste de contacts.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Annuler</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDelete}
              disabled={isDeleting}
              className="bg-red-600 hover:bg-red-700"
            >
              {isDeleting ? "Suppression..." : "Retirer"}
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
          // Message sending is handled inside SMSModal
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
