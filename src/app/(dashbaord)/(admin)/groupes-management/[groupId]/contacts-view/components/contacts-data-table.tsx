"use client"

import { DataTable } from "@/shared/common/data-table/table"
import { getContactsColumns } from "./contacts-table"
import type { EnterpriseContactResponseType } from "@/core/models/contact-new"

interface ContactsDataTableProps {
  data: any[]
  isLoading?: boolean
  enterpriseId: string
  onUpdate: (contact: EnterpriseContactResponseType) => void
  onDelete: (contact: EnterpriseContactResponseType) => void
  onSendMessage: (contact: EnterpriseContactResponseType) => void
}

export function ContactsDataTable({
  data,
  isLoading = false,
  enterpriseId,
  onUpdate,
  onDelete,
  onSendMessage
}: ContactsDataTableProps) {
  if (isLoading) {
    return (
      <div className="space-y-3">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="border rounded-lg p-4 animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
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
