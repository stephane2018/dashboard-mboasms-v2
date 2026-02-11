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
}

export const createColumns = ({ onEdit, onDelete }: ColumnsProps): ColumnDef<Coupon>[] => [
  {
    accessorKey: "name",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Nom" label="Nom" />,
    cell: ({ row }) => <div className="font-medium">{row.getValue("name")}</div>,
  },
  {
    accessorKey: "code",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Code" label="Code" />,
    cell: ({ row }) => (
      <code className="bg-muted px-2 py-1 rounded text-sm font-mono">
        {row.getValue("code")}
      </code>
    ),
  },
  {
    accessorKey: "percentage",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Pourcentage" label="Pourcentage" />,
    cell: ({ row }) => (
      <span className="font-semibold">{row.getValue("percentage")}%</span>
    ),
  },
  {
    accessorKey: "validFrom",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Valide du" label="Valide du" />,
    cell: ({ row }) => {
      const date = new Date(row.getValue("validFrom"))
      return format(date, "dd MMM yyyy", { locale: fr })
    },
  },
  {
    accessorKey: "validTo",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Valide au" label="Valide au" />,
    cell: ({ row }) => {
      const date = new Date(row.getValue("validTo"))
      return format(date, "dd MMM yyyy", { locale: fr })
    },
  },
  {
    id: "status",
    header: "Statut",
    cell: ({ row }) => {
      const validTo = new Date(row.original.validTo)
      const isExpired = validTo < new Date()
      return (
        <Badge variant={isExpired ? "destructive" : "secondary"}>
          {isExpired ? "Expiré" : "Actif"}
        </Badge>
      )
    },
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const coupon = row.original

      const actions = [
        {
          icon: Edit2,
          label: "Modifier",
          onClick: () => onEdit(coupon),
        },
        {
          icon: Trash2,
          label: "Supprimer",
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
