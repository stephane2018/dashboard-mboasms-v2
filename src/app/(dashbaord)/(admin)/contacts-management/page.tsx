"use client"

import { useEffect, useMemo, useState } from "react"
import { DataTable } from "@/shared/common/data-table"
import { useContacts, useContactsByEnterprise } from "@/core/hooks/useContact";
import { useAuth } from "@/core/hooks/useAuth";
import { useT } from "@/core/hooks";
import { People, Refresh2 } from 'iconsax-react';
import { Button } from "@/shared/ui/button";
import { ContactStats } from "./contact-stats"
import { ImportContacts } from "./import-contacts";
import { ExportContacts } from './export-contacts';
import { createContactColumns } from "./columns"
import { toast } from "sonner"
import type { PaginationState } from "@tanstack/react-table"

export default function ContactsPage() {
  const { user } = useAuth()
  const { t } = useT()
  const _isSuperAdmin = user?.role === "SUPER_ADMIN"
  const [pagination, setPagination] = useState<PaginationState>({ pageIndex: 0, pageSize: 10 })
  const columns = useMemo(() => createContactColumns(t), [t])

  // Use different hooks based on user role
  const { data: allContactsData, isLoading: isLoadingAll, isError: isErrorAll, refetch: refetchAll } = useContacts(pagination.pageIndex, pagination.pageSize)
  const { data: enterpriseContactsData, isLoading: isLoadingEnterprise, isError: isErrorEnterprise, refetch: refetchEnterprise } = useContactsByEnterprise(
    user?.companyId || "",
    pagination.pageIndex,
    pagination.pageSize
  )

  // Determine which data to use based on role
  const contactsData = _isSuperAdmin ? allContactsData : enterpriseContactsData
  const isLoading = _isSuperAdmin ? isLoadingAll : isLoadingEnterprise
  const isError = _isSuperAdmin ? isErrorAll : isErrorEnterprise
  const refetch = _isSuperAdmin ? refetchAll : refetchEnterprise

  const data = contactsData?.content || []
  const rowCount = contactsData?.totalElements || 0

  useEffect(() => {
    if (isError) {
      toast.error(t("contacts.loadError"))
    }
  }, [isError, t])

  return (
      <div className="container mx-auto py-6 space-y-6">
      <ContactStats />

      <div className="flex items-start justify-between gap-4 mt-10">
        <div>
          <div className="flex items-center gap-2">
            <People size="32" variant="Bulk" color="currentColor" className="text-primary" />
            <h1 className="text-3xl font-bold tracking-tight">
              {_isSuperAdmin ? t("contacts.titlePlatform") : t("contacts.title")}
            </h1>
          </div>
          <p className="text-muted-foreground mt-1">
            {_isSuperAdmin
              ? t("contacts.subtitlePlatform")
              : t("contacts.subtitleEnterprise")}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            className="gap-2"
            onClick={() => refetch()}
            disabled={isLoading}
          >
            <Refresh2 size="16" variant="Bulk" className={isLoading ? 'animate-spin' : ''} />
            {t('common.refresh')}
          </Button>
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
