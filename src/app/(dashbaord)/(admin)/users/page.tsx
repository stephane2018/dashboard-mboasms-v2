"use client"

import { useState, useMemo } from "react"
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
import { useAuthContext } from "@/core/providers"
import { Button } from "@/shared/ui/button"
import { Input } from "@/shared/ui/input"
import { SearchNormal1, UserAdd } from "iconsax-react"

// TODO: Get this from auth context
const ENTERPRISE_ID = "your-enterprise-id"

export default function UsersListPage() {
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  })
  const { user } = useAuthContext()
  console.log(user)

  const [selectedContact, setSelectedContact] = useState<EnterpriseContactResponseType | null>(null)
  const [isFormModalOpen, setIsFormModalOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [contactToDelete, setContactToDelete] = useState<EnterpriseContactResponseType | null>(null)
  const [searchTerm, setSearchTerm] = useState("")

  // Fetch contacts with pagination
  const { data, isLoading } = useGetAllContactsByEnterprise(user?.companyId!)
  console.log(data)
  const { mutate: deleteContact, isPending: isDeleting } = useDeleteContact()

  const contacts = data || []
  const totalElements = data?.length || 0

  // Calculate statistics
  const statistics = useMemo(() => {
    if (!data) {
      return {
        totalUsers: 0,
        activeUsers: 0,
        newUsersThisMonth: 0,
        countriesCount: 0,
      }
    }

    const uniqueCountries = new Set(contacts.map((c) => c.country))
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

    const newUsers = contacts.filter(
      (c) => new Date(c.createdAt) >= thirtyDaysAgo
    ).length

    return {
      totalUsers: totalElements,
      activeUsers: contacts.filter((c) => !c.archived).length,
      newUsersThisMonth: newUsers,
      countriesCount: uniqueCountries.size,
    }
  }, [data, contacts, totalElements])

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
    toast.info("Send SMS", {
      description: `Sending SMS to ${contacts.length} contact(s)`,
    })
    // TODO: Implement SMS sending modal
  }

  const handleCreateGroup = (contacts: EnterpriseContactResponseType[]) => {
    toast.info("Create Group", {
      description: `Creating group with ${contacts.length} contact(s)`,
    })
    // TODO: Implement group creation modal
  }

  const handleDeleteSelected = (contacts: EnterpriseContactResponseType[]) => {
    toast.info("Delete Selected", {
      description: `Deleting ${contacts.length} contact(s)`,
    })
    // TODO: Implement bulk delete with confirmation
  }

  const handleExport = (contacts: EnterpriseContactResponseType[]) => {
    // Simple CSV export
    const headers = ["First Name", "Last Name", "Email", "Phone", "Country", "City"]
    const rows = contacts.map((c) => [
      c.firstname,
      c.lastname,
      c.email,
      c.phoneNumber,
      c.country,
      c.city,
    ])

    const csvContent = [
      headers.join(","),
      ...rows.map((row) => row.join(",")),
    ].join("\n")

    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `contacts-${new Date().toISOString().split("T")[0]}.csv`
    a.click()
    window.URL.revokeObjectURL(url)

    toast.success("Export Complete", {
      description: `Exported ${contacts.length} contact(s) to CSV`,
    })
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


      {/* Search Input */}
      <div className="relative">
        <SearchNormal1
          size={16}
          variant="Bulk"
          color="currentColor"
          className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
        />
        <Input
          placeholder="Rechercher..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="h-9 w-[200px] pl-9 sm:w-[250px]"
        />
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
        onPaginationChange={setPagination}
        initialState={{
          pagination,
        }}

      />

      {/* Contact Form Modal */}
      <ContactFormModal
        isOpen={isFormModalOpen}
        onClose={() => setIsFormModalOpen(false)}
        contact={selectedContact}
        enterpriseId={ENTERPRISE_ID}
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
    </div>
  )
}
