"use client"

import type { ColumnDef } from "@tanstack/react-table"
import { Badge } from "@/shared/ui/badge"
import { DataTableColumnHeader } from "@/shared/common/data-table/data-table-column-header"
import { Edit2, Trash2, RefreshCcw } from "lucide-react"
import { ActionsDropdown } from "@/shared/common/data-table/actions-dropdown"
import type { SenderId, SenderIdStatus } from "@/modules/sender-id/types"
import { format } from "date-fns"
import { fr } from "date-fns/locale"

const statusColors: Record<SenderIdStatus, "default" | "secondary" | "destructive"> = {
  EN_ATTENTE: "default",
  VALIDE: "secondary",
  REJETE: "destructive",
}

const statusLabels: Record<SenderIdStatus, string> = {
  EN_ATTENTE: "En attente",
  VALIDE: "Validé",
  REJETE: "Rejeté",
}

interface ColumnsProps {
  onEdit: (senderId: SenderId) => void
  onDelete: (senderId: SenderId) => void
  onChangeStatus: (senderId: SenderId) => void
}

export const createColumns = ({ onEdit, onDelete, onChangeStatus }: ColumnsProps): ColumnDef<SenderId>[] => [
  {
    accessorKey: "name",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Nom" label="Nom" />,
    cell: ({ row }) => <div className="font-medium">{row.getValue("name")}</div>,
  },
  {
    accessorKey: "description",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Description" label="Description" />,
    cell: ({ row }) => (
      <div className="max-w-[300px] truncate" title={row.getValue("description")}>
        {row.getValue("description")}
      </div>
    ),
  },
  {
    accessorKey: "status",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Statut" label="Statut" />,
    cell: ({ row }) => {
      const status = row.getValue("status") as SenderIdStatus
      return (
        <Badge variant={statusColors[status]}>
          {statusLabels[status]}
        </Badge>
      )
    },
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Date de création" label="Date de création" />,
    cell: ({ row }) => {
      const date = new Date(row.getValue("createdAt"))
      return format(date, "dd MMM yyyy", { locale: fr })
    },
  },
  {
    accessorKey: "rejectionReason",
    header: "Raison du rejet",
    cell: ({ row }) => {
      const reason = row.getValue("rejectionReason") as string | null
      if (!reason) return <span className="text-muted-foreground">-</span>
      return (
        <div className="max-w-[200px] truncate" title={reason}>
          {reason}
        </div>
      )
    },
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const senderId = row.original

      return (
        <ActionsDropdown
          items={[
            {
              icon: Edit2,
              label: "Modifier",
              onClick: () => onEdit(senderId),
            },
            {
              icon: RefreshCcw,
              label: "Changer le statut",
              onClick: () => onChangeStatus(senderId),
            },
            {
              icon: Trash2,
              label: "Supprimer",
              className: "text-destructive",
              onClick: () => onDelete(senderId),
            },
          ]}
        />
      )
    },
    meta: {
      className: "w-20",
    },
  },
]
