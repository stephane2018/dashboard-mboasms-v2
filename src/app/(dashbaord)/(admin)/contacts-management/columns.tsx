"use client"

import type { ColumnDef } from "@tanstack/react-table"
import { Badge } from "@/shared/ui/badge"
import { DataTableColumnHeader } from "@/shared/common/data-table/data-table-column-header"
import { Sms, Call, Building, Location } from 'iconsax-react'
import type { EnterpriseContactResponseType } from "@/core/models/contact-new"
import { i18next } from "@/core/lib/i18n"

export const columns: ColumnDef<EnterpriseContactResponseType>[] = [
  {
    accessorKey: "firstname",
    header: ({ column }) => <DataTableColumnHeader column={column} title={i18next.t("contactColumns.firstName")} label={i18next.t("contactColumns.firstName")} />,
  },
  {
    accessorKey: "lastname",
    header: ({ column }) => <DataTableColumnHeader column={column} title={i18next.t("contactColumns.lastName")} label={i18next.t("contactColumns.lastName")} />,
  },
  {
    accessorKey: "email",
    header: ({ column }) => <DataTableColumnHeader column={column} title={i18next.t("common.email")} label={i18next.t("common.email")} />,
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <Sms size="16" />
        {row.getValue("email")}
      </div>
    ),
  },
  {
    accessorKey: "phoneNumber",
    header: ({ column }) => <DataTableColumnHeader column={column} title={i18next.t("contactColumns.phoneNumber")} label={i18next.t("contactColumns.phoneNumber")} />,
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <Call size="16" />
        {row.getValue("phoneNumber")}
      </div>
    ),
  },
  {
    accessorKey: "enterprise",
    header: i18next.t("contactColumns.enterprise"),
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
    header: i18next.t("common.country"),
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <Location size="16" />
        {row.getValue("country")}
      </div>
    ),
  },
  {
    accessorKey: "archived",
    header: i18next.t("contactColumns.archived"),
    cell: ({ row }) => {
      const archived = row.getValue("archived") as boolean
      return <Badge variant={archived ? "secondary" : "outline"}>{archived ? i18next.t("common.yes") : i18next.t("common.no")}</Badge>
    },
  },
]
