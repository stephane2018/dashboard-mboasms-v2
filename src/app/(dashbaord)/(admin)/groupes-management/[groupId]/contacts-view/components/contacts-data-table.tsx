"use client"

import { DataTable } from "@/shared/common/data-table/table"
import { getContactsColumns } from "./contacts-table"
import type { EnterpriseContactResponseType } from "@/core/models/contact-new"
import { Skeleton } from "@/shared/ui/skeleton"

interface ContactsDataTableProps {
  data: any[]
  isLoading?: boolean
  enterpriseId: string
  onUpdate: (contact: EnterpriseContactResponseType) => void
  onDelete: (contact: EnterpriseContactResponseType) => void
  onSendMessage: (contact: EnterpriseContactResponseType) => void
}

export function ContactsDataTable({ data, isLoading = false, enterpriseId, onUpdate, onDelete, onSendMessage }: ContactsDataTableProps) {
  if (isLoading) {
    return (
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
    )
  }

  const columns = getContactsColumns({ enterpriseId, onUpdate, onDelete, onSendMessage })

  return (
    <DataTable
      columns={columns}
      data={data}
    />
  )
}
