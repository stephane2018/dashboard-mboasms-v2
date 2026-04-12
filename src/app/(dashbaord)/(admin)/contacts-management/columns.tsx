"use client"

import type { ColumnDef } from "@tanstack/react-table"
import { Badge } from "@/shared/ui/badge"
import { DataTableColumnHeader } from "@/shared/common/data-table/data-table-column-header"
import { Sms, Call, Building, Location } from 'iconsax-react'
import type { EnterpriseContactResponseType } from "@/core/models/contact-new"
import type { useT } from "@/core/hooks"

type TranslateFn = ReturnType<typeof useT>["t"]

export function createContactColumns(t: TranslateFn): ColumnDef<EnterpriseContactResponseType>[] {
  return [
    {
      accessorKey: "firstname",
      header: ({ column }) => <DataTableColumnHeader column={column} title={t("contactColumns.firstName")} label={t("contactColumns.firstName")} />,
    },
    {
      accessorKey: "lastname",
      header: ({ column }) => <DataTableColumnHeader column={column} title={t("contactColumns.lastName")} label={t("contactColumns.lastName")} />,
    },
    {
      accessorKey: "email",
      header: ({ column }) => <DataTableColumnHeader column={column} title={t("common.email")} label={t("common.email")} />,
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <Sms size="16" />
          {row.getValue("email")}
        </div>
      ),
    },
    {
      accessorKey: "phoneNumber",
      header: ({ column }) => <DataTableColumnHeader column={column} title={t("contactColumns.phoneNumber")} label={t("contactColumns.phoneNumber")} />,
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <Call size="16" />
          {row.getValue("phoneNumber")}
        </div>
      ),
    },
    {
      accessorKey: "enterprise",
      header: t("contactColumns.enterprise"),
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
      header: t("common.country"),
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <Location size="16" />
          {row.getValue("country")}
        </div>
      ),
    },
    {
      accessorKey: "archived",
      header: t("contactColumns.archived"),
      cell: ({ row }) => {
        const archived = row.getValue("archived") as boolean
        return <Badge variant={archived ? "secondary" : "outline"}>{archived ? t("common.yes") : t("common.no")}</Badge>
      },
    },
  ]
}
