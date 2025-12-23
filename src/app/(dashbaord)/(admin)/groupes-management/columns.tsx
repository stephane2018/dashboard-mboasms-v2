"use client"

import type { ColumnDef } from "@tanstack/react-table"
import { Badge } from "@/shared/ui/badge"
import { Button } from "@/shared/ui/button"
import { DataTableColumnHeader } from "@/shared/common/data-table/data-table-column-header"
import type { Group } from "@/modules/groups/types"
import type { EnterpriseType } from "@/core/models/enterprise"
import { AddSquare, Trash } from "iconsax-react"

export const getColumns = (
  onAddContacts: (group: Group) => void,
  onDelete: (group: Group) => void
): ColumnDef<Group & { enterpriseFull?: EnterpriseType }>[] => [
  {
    accessorKey: "name",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Nom du groupe" label="Nom du groupe" />,
    cell: ({ row }) => <div className="font-medium">{row.getValue("name")}</div>,
  },
  {
    accessorKey: "enterpriseFull",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Entreprise" label="Entreprise" />,
    cell: ({ row }) => {
      const enterprise = row.getValue("enterpriseFull") as EnterpriseType | undefined
      if (!enterprise) return <Badge variant="outline">N/A</Badge>

      return (
        <div className="text-xs">
          <div className="font-medium text-black">{enterprise.socialRaison}</div>
          <div className="text-muted-foreground">{enterprise.emailEnterprise}</div>
          <div className="text-muted-foreground">{enterprise.telephoneEnterprise}</div>
        </div>
      )
    },
    filterFn: (row, id, value) => {
      const enterprise = row.original.enterpriseFull
      return enterprise ? enterprise.socialRaison.toLowerCase().includes(String(value).toLowerCase()) : false
    },
  },
  {
    accessorKey: "enterpriseContacts",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Contacts" label="Contacts" />,
    cell: ({ row }) => {
      const contacts = row.getValue("enterpriseContacts") as any[]
      return <span>{contacts?.length || 0}</span>
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const group = row.original
      return (
        <div className="flex items-center gap-2 justify-end">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onAddContacts(group)}
            className="h-8"
          >
            <AddSquare size="16" variant="Bulk" color="currentColor" />
            Ajouter des contacts
          </Button>
          <Button
            variant="default"
            size="sm"
            onClick={() => onDelete(group)}
            className="h-8 text-white bg-red-500 hover:bg-red-500"
          >
            <Trash size="16" variant="Bulk" color="currentColor" className="mr-2" />
            Supprimer
          </Button>
        </div>
      )
    },
  },
]
