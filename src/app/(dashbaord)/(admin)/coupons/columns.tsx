"use client"

import type { ColumnDef } from "@tanstack/react-table"
import { Badge } from "@/shared/ui/badge"
import { DataTableColumnHeader } from "@/shared/common/data-table/data-table-column-header"
import { Edit2, Trash2 } from "lucide-react"
import { ActionsDropdown } from "@/shared/common/data-table/actions-dropdown"
import type { Coupon } from "@/modules/coupon/types"
import { format } from "date-fns"
import { fr } from "date-fns/locale"

interface ColumnsProps {
  onEdit: (coupon: Coupon) => void
  onDelete: (coupon: Coupon) => void
  t: (key: string) => string
}

export const createColumns = ({ onEdit, onDelete, t }: ColumnsProps): ColumnDef<Coupon>[] => [
  {
    accessorKey: "name",
    header: ({ column }) => <DataTableColumnHeader column={column} title={t('common.name')} label={t('common.name')} />,
    cell: ({ row }) => <div className="font-medium">{row.getValue("name")}</div>,
  },
  {
    accessorKey: "code",
    header: ({ column }) => <DataTableColumnHeader column={column} title={t('coupons.code')} label={t('coupons.code')} />,
    cell: ({ row }) => (
      <code className="bg-muted px-2 py-1 rounded text-sm font-mono">
        {row.getValue("code")}
      </code>
    ),
  },
  {
    accessorKey: "percentage",
    header: ({ column }) => <DataTableColumnHeader column={column} title={t('coupons.percentage')} label={t('coupons.percentage')} />,
    cell: ({ row }) => (
      <span className="font-semibold">{row.getValue("percentage")}%</span>
    ),
  },
  {
    accessorKey: "validFrom",
    header: ({ column }) => <DataTableColumnHeader column={column} title={t('coupons.validFrom')} label={t('coupons.validFrom')} />,
    cell: ({ row }) => {
      const date = new Date(row.getValue("validFrom"))
      return format(date, "dd MMM yyyy", { locale: fr })
    },
  },
  {
    accessorKey: "validTo",
    header: ({ column }) => <DataTableColumnHeader column={column} title={t('coupons.validToShort')} label={t('coupons.validToShort')} />,
    cell: ({ row }) => {
      const date = new Date(row.getValue("validTo"))
      return format(date, "dd MMM yyyy", { locale: fr })
    },
  },
  {
    id: "status",
    header: t('coupons.status'),
    cell: ({ row }) => {
      const validTo = new Date(row.original.validTo)
      const isExpired = validTo < new Date()
      return (
        <Badge variant={isExpired ? "destructive" : "secondary"}>
          {isExpired ? t('coupons.expired') : t('coupons.active')}
        </Badge>
      )
    },
  },
  {
    id: "actions",
    header: t('common.actions'),
    cell: ({ row }) => {
      const coupon = row.original

      const actions = [
        {
          icon: Edit2,
          label: t('common.edit'),
          onClick: () => onEdit(coupon),
        },
        {
          icon: Trash2,
          label: t('common.delete'),
          className: "text-destructive",
          onClick: () => onDelete(coupon),
        },
      ]

      return <ActionsDropdown items={actions} />
    },
    meta: {
      className: "w-20",
    },
  },
]
