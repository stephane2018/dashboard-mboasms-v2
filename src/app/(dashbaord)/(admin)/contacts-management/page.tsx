"use client"

import { useEffect, useState } from "react"
import { DataTable } from "@/shared/common/data-table"
import { useContacts, useContactsByEnterprise } from "@/core/hooks/useContact";
import { useUserStore } from "@/core/stores/userStore";
import { People } from 'iconsax-react';
import { ContactStats } from "./contact-stats"
import { ImportContacts } from "./import-contacts";
import { ExportContacts } from './export-contacts';
import { columns } from "./columns"
import { toast } from "sonner"
import type { PaginationState } from "@tanstack/react-table"

export default function ContactsPage() {
  const { user } = useUserStore()
  const isAdminUser = user?.role === "ADMIN_USER"
  const [pagination, setPagination] = useState<PaginationState>({ pageIndex: 0, pageSize: 10 })

  // Use different hooks based on user role
  const { data: allContactsData, isLoading: isLoadingAll, isError: isErrorAll } = useContacts(pagination.pageIndex, pagination.pageSize)
  const { data: enterpriseContactsData, isLoading: isLoadingEnterprise, isError: isErrorEnterprise } = useContactsByEnterprise(
    user?.companyId || "",
    pagination.pageIndex,
    pagination.pageSize
  )

  // Determine which data to use based on role
  const contactsData = isAdminUser ? enterpriseContactsData : allContactsData
  const isLoading = isAdminUser ? isLoadingEnterprise : isLoadingAll
  const isError = isAdminUser ? isErrorEnterprise : isErrorAll

  const data = contactsData?.content || []
  const rowCount = contactsData?.totalElements || 0

  useEffect(() => {
    if (isError) {
      toast.error("Erreur lors du chargement des contacts.")
    }
  }, [isError])

  return (
      <div className="container mx-auto py-6 space-y-6">
      <ContactStats />
      
      <div className="flex items-start justify-between gap-4 mt-10">
        <div>
          <div className="flex items-center gap-2">
            <People size="32" variant="Bulk" color="currentColor" className="text-primary" />
            <h1 className="text-3xl font-bold tracking-tight">Contacts</h1>
          </div>
          <p className="text-muted-foreground mt-1">
            Gérez tous les contacts de la plateforme.
          </p>
        </div>
                <div className="flex items-center gap-2">
          <ExportContacts />
          <ImportContacts />
        </div>
      </div>
      
      <DataTable
        columns={columns}
        data={data}
        rowCount={rowCount}
        isLoading={isLoading}
        enablePagination
        onPaginationChange={setPagination}
        initialState={{
          pagination,
        }}
      />
          </div>
  )
}
