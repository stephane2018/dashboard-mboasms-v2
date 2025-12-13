"use client"

import { useState, useMemo } from "react"
import { useRouter } from "next/navigation"
import type { PaginationState } from "@tanstack/react-table"
import { toast } from "sonner"
import { useGetContactsByEnterprise, useDeleteContact, useGetAllContactsByEnterprise } from "@/core/hooks/useContacts"
import type { EnterpriseContactResponseType } from "@/core/models/contact-new"
import { DataTable } from "@/shared/common/data-table/table"
import { ConfirmDialog } from "@/shared/common/confirm-dialog"
import { UsersStatistics } from "./_components/users-statistics"
import { StatisticsSkeleton } from "./_components/statistics-skeleton"
import { ContactFormModal } from "./_components/contact-form-modal"
import { getColumns } from "./_components/users-table-columns"
import { SelectionToolbar } from "./_components/selection-toolbar"
import { ExportModal } from "./_components/export-modal"
import { SMSModal } from "./_components/sms-modal"
import { ImportModal } from "./_components/import-modal"
import { useAuthContext } from "@/core/providers"
import { Button } from "@/shared/ui/button"
import { Input } from "@/shared/ui/input"
import { SearchNormal1, UserAdd, DocumentDownload, Sms } from "iconsax-react"
import { getPhoneValidationStatus } from "@/core/utils/phone-validation"
import { searchContacts } from "@/core/utils/search.utils"
import { useSMSStore } from "@/core/stores/smsStore"


export default function UsersListPage() {
  const router = useRouter()
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  })
  const { user } = useAuthContext()
  const { setPrefilledContacts } = useSMSStore()
  console.log(user)

  const [selectedContact, setSelectedContact] = useState<EnterpriseContactResponseType | null>(null)
  const [isFormModalOpen, setIsFormModalOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [contactToDelete, setContactToDelete] = useState<EnterpriseContactResponseType | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedContacts, setSelectedContacts] = useState<EnterpriseContactResponseType[]>([])
  const [isExportModalOpen, setIsExportModalOpen] = useState(false)
  const [isSMSModalOpen, setIsSMSModalOpen] = useState(false)
  const [isImportModalOpen, setIsImportModalOpen] = useState(false)

  // Fetch contacts with pagination
  const { data, isLoading } = useGetAllContactsByEnterprise(user?.companyId!)
  console.log(data)
  const { mutate: deleteContact, isPending: isDeleting } = useDeleteContact()

  const allContacts = data || []
  const totalElements = data?.length || 0

  // Filter contacts based on search term across multiple columns
  const filteredContacts = useMemo(() => {
    return searchContacts(allContacts, searchTerm)
  }, [allContacts, searchTerm])

  const contacts = filteredContacts
  const displayedElements = filteredContacts.length

  // Calculate statistics
  const statistics = useMemo(() => {
    if (!allContacts) {
      return {
        totalUsers: 0,
        activeUsers: 0,
        newUsersThisMonth: 0,
        countriesCount: 0,
      }
    }

    const uniqueCountries = new Set(allContacts.map((c) => c.country))
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

    const newUsers = allContacts.filter(
      (c) => new Date(c.createdAt) >= thirtyDaysAgo
    ).length

    return {
      totalUsers: totalElements,
      activeUsers: allContacts.filter((c) => !c.archived).length,
      newUsersThisMonth: newUsers,
      countriesCount: uniqueCountries.size,
    }
  }, [allContacts, totalElements])

  // Handlers
  const handleAddContact = () => {
    setSelectedContact(null)
    setIsFormModalOpen(true)
  }

  const handleEditContact = (contact: EnterpriseContactResponseType) => {
    setSelectedContact(contact)
    setIsFormModalOpen(true)
  }

  const handleDeleteContact = (contact: EnterpriseContactResponseType) => {
    setContactToDelete(contact)
    setIsDeleteDialogOpen(true)
  }

  const confirmDelete = () => {
    if (!contactToDelete) return

    deleteContact(contactToDelete.id, {
      onSuccess: () => {
        setIsDeleteDialogOpen(false)
        setContactToDelete(null)
      },
    })
  }

  const handleSendSMS = (contacts: EnterpriseContactResponseType[]) => {
    // Filter contacts with valid phone numbers
    const validContacts = contacts.filter(contact => 
      contact.phoneNumber && getPhoneValidationStatus(contact.phoneNumber) === "CORRECT"
    )
    
    if (validContacts.length === 0) {
      toast.error("Aucun contact valide", {
        description: "Les contacts sélectionnés n'ont pas de numéro de téléphone valide",
      })
      return
    }
    
    // Transform contacts to the format expected by the store
    const contactsForSMS = validContacts.map(contact => ({
      id: contact.id,
      name: `${contact.firstname || ""} ${contact.lastname || ""}`.trim() || contact.email || "Inconnu",
      phoneNumber: contact.phoneNumber!,
      email: contact.email,
    }))
    
    // Store contacts in SMS store and navigate to SMS page
    setPrefilledContacts(contactsForSMS)
    router.push("/sms")
  }

  const handleSMSSend = (message: string, password: string) => {
    toast.success("SMS envoyé", {
      description: `Message envoyé à ${selectedContacts.length} contact(s)`,
    })
    setIsSMSModalOpen(false)
    // TODO: Implement actual SMS sending
  }

  const handleCreateGroup = (contacts: EnterpriseContactResponseType[]) => {
    toast.info("Create Group", {
      description: `Creating group with ${contacts.length} contact(s)`,
    })
    // TODO: Implement group creation modal
  }

  const handleAddToGroup = (contacts: EnterpriseContactResponseType[]) => {
    toast.info("Add to Group", {
      description: `Adding ${contacts.length} contact(s) to group`,
    })
    // TODO: Implement add to group modal
  }

  const handleDeleteSelected = (contacts: EnterpriseContactResponseType[]) => {
    toast.info("Delete Selected", {
      description: `Deleting ${contacts.length} contact(s)`,
    })
    // TODO: Implement bulk delete with confirmation
  }

  const handleExport = (format: "csv" | "excel" | "json") => {
    if (format === "excel") {
      // Open Excel import flow instead of export
      setIsExportModalOpen(false)
      setIsImportModalOpen(true)
      return
    }

    toast.info("Export", {
      description: `Exporting ${contacts.length} contact(s) as ${format.toUpperCase()}`,
    })
    // TODO: Implement actual export functionality
    setIsExportModalOpen(false)
  }

  const columns = useMemo(
    () =>
      getColumns({
        onEdit: handleEditContact,
        onDelete: handleDeleteContact,
      }),
    []
  )

  return (
    <div className="flex flex-col gap-6 p-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Contacts</h1>
          <p className="text-muted-foreground">
            Manage and organize all your contacts
          </p>
        </div>
        <div className="flex items-center gap-3">
          {/* Add Contact Button */}
          <Button onClick={handleAddContact} size="sm" className="h-9">
            <UserAdd
              size={16}
              variant="Bulk"
              color="currentColor"
              className="mr-2"
            />
            Ajouter
          </Button>

          {/* Export Button */}
          <Button
            onClick={() => setIsExportModalOpen(true)}
            variant="outline"
            size="sm"
            className="h-9"
          >
            <DocumentDownload
              size={16}
              variant="Bulk"
              color="currentColor"
              className="mr-2"
            />
            Exporter
          </Button>

          {/* Send SMS Button */}
          <Button
            onClick={() => {
              if (selectedContacts.length === 0) {
                toast.warning("Sélectionnez au moins un contact", {
                  description: "Veuillez sélectionner des contacts pour envoyer un SMS",
                })
                return
              }
              handleSendSMS(selectedContacts)
            }}
            variant="outline"
            size="sm"
            className="h-9 bg-pink-50 hover:bg-pink-100 text-pink-600 border-pink-200"
          >
            <Sms
              size={16}
              variant="Bulk"
              color="currentColor"
              className="mr-2"
            />
            SMS
          </Button>
        </div>
      </div>

      {/* Statistics */}
      {isLoading ? (
        <StatisticsSkeleton />
      ) : (
        <UsersStatistics
          totalUsers={statistics.totalUsers}
          activeUsers={statistics.activeUsers}
          newUsersThisMonth={statistics.newUsersThisMonth}
          countriesCount={statistics.countriesCount}

        />
      )}


      {/* Search and Export */}
      <div className="flex items-center justify-between gap-3">
        <div className="relative flex items-center gap-2">
          <div className="relative flex-1">
            <SearchNormal1
              size={16}
              variant="Bulk"
              color="currentColor"
              className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
            />
            <Input
              placeholder="Rechercher par nom, téléphone, email, ville..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="h-9 w-[200px] pl-9 sm:w-[300px]"
            />
          </div>
          {searchTerm && (
            <span className="text-xs text-muted-foreground whitespace-nowrap">
              {displayedElements} résultat{displayedElements !== 1 ? "s" : ""}
            </span>
          )}
        </div>
        {/* Export Excel Button */}
        <Button
          variant="outline"
          size="sm"
          className="h-9"
          onClick={() => setIsExportModalOpen(true)}
        >
          <DocumentDownload
            size={16}
            variant="Bulk"
            color="currentColor"
            className="mr-2"
          />
          Exporter Excel
        </Button>
      </div>
      {/* Bulk Actions Toolbar */}
      <DataTable
        data={contacts}
        rowCount={totalElements}
        columns={columns}
        isLoading={isLoading}
        enablePagination={true}
        enableColumnFilter={true}
        rowSelectable={true}
        getRowCanBeSelected={(contact) => getPhoneValidationStatus(contact.phoneNumber) === "CORRECT"}
        onPaginationChange={setPagination}
        onRowSelectionChange={setSelectedContacts}
        initialState={{
          pagination,
        }}
        toolbar={(table) => (
          <SelectionToolbar
            table={table}
            onAddToGroup={handleAddToGroup}
            onCreateGroup={handleCreateGroup}
            onDeleteSelected={handleDeleteSelected}
          />
        )}
      />

      {/* Contact Form Modal */}
      <ContactFormModal
        isOpen={isFormModalOpen}
        onClose={() => setIsFormModalOpen(false)}
        contact={selectedContact}
        enterpriseId={user?.companyId!}
      />

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={isDeleteDialogOpen}
        isLoading={isDeleting}
        onDismiss={() => setIsDeleteDialogOpen(false)}
        onAction={confirmDelete}
        messages={{
          title: "Delete Contact",
          description: `Are you sure you want to delete <strong>${contactToDelete?.firstname} ${contactToDelete?.lastname}</strong>? This action cannot be undone.`,
          buttons: {
            cancel: "Cancel",
            action: "Delete",
          },
        }}
      />

      {/* Export Modal */}
      <ExportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        onExport={handleExport}
      />

      {/* SMS Modal */}
      <SMSModal
        isOpen={isSMSModalOpen}
        onClose={() => setIsSMSModalOpen(false)}
        selectedContacts={selectedContacts}
        onSend={handleSMSSend}
      />

      {/* Import Modal */}
      <ImportModal
        isOpen={isImportModalOpen}
        onClose={() => setIsImportModalOpen(false)}
        onImport={async (contacts) => {
          console.log("Imported contacts:", contacts)
          // TODO: Handle imported contacts
        }}
      />
    </div>
  )
}
