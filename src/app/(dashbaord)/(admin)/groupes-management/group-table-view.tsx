"use client"

import { DataTable } from "@/shared/common/data-table"
import type { Group } from "@/modules/groups/types"
import type { EnterpriseType } from "@/core/models/enterprise"
import { getColumns } from "./columns"

interface GroupTableViewProps {
  data: (Group & { enterpriseFull?: EnterpriseType })[]
  isLoading: boolean
  onAddContacts: (group: Group) => void
  onDelete: (group: Group) => void
}

export function GroupTableView({ data, isLoading, onAddContacts, onDelete }: GroupTableViewProps) {
  const columns = getColumns(onAddContacts, onDelete)

  return (
    <DataTable
      columns={columns}
      data={data}
      isLoading={isLoading}
      initialState={{
        pagination: {
          pageSize: 10,
          pageIndex: 0,
        },
      }}
      autoPagination
      rowSelectable={false}
      emptyMessage="Aucun groupe trouvé."
    />
  )
}
