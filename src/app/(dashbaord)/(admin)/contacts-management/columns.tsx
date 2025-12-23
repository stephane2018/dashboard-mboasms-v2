"use client"

import type { ColumnDef } from "@tanstack/react-table"
import { Badge } from "@/shared/ui/badge"
import { DataTableColumnHeader } from "@/shared/common/data-table/data-table-column-header"
import { Sms, Call, Building, Location } from 'iconsax-react'
import type { EnterpriseContactResponseType } from "@/core/models/contact-new"

export const columns: ColumnDef<EnterpriseContactResponseType>[] = [
  {
    accessorKey: "firstname",
    header: ({ column }) => <DataTableColumnHeader column={column} title="First Name" label="First Name" />,
  },
  {
    accessorKey: "lastname",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Last Name" label="Last Name" />,
  },
  {
    accessorKey: "email",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Email" label="Email" />,
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <Sms size="16" />
        {row.getValue("email")}
      </div>
    ),
  },
  {
    accessorKey: "phoneNumber",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Phone Number" label="Phone Number" />,
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <Call size="16" />
        {row.getValue("phoneNumber")}
      </div>
    ),
  },
  {
    accessorKey: "enterprise",
    header: "Enterprise",
    cell: ({ row }) => {
      const enterprise = row.original.enterprise
      return (
        <div className="flex items-center gap-2">
          <Building size="16" />
          {enterprise?.socialRaison || "N/A"}
        </div>
      )
    },
  },
  {
    accessorKey: "country",
    header: "Country",
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <Location size="16" />
        {row.getValue("country")}
      </div>
    ),
  },
  {
    accessorKey: "archived",
    header: "Archived",
    cell: ({ row }) => {
      const archived = row.getValue("archived") as boolean
      return <Badge variant={archived ? "secondary" : "outline"}>{archived ? "Yes" : "No"}</Badge>
    },
  },
]
