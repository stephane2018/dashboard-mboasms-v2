"use client"

import type { ColumnDef } from "@tanstack/react-table"
import { Badge } from "@/shared/ui/badge"
import { DataTableColumnHeader } from "@/shared/common/data-table/data-table-column-header"
import { Edit2, Trash2, RefreshCcw, ExternalLink, FileUp } from "lucide-react"
import { ActionsDropdown } from "@/shared/common/data-table/actions-dropdown"
import type { SenderId, SenderIdStatus } from "@/modules/sender-id/types"
import { format } from "date-fns"
import { fr } from "date-fns/locale"
import { Role } from "@/core/config/enum"

const statusColors: Record<SenderIdStatus, "default" | "secondary" | "destructive"> = {
  EN_ATTENTE: "default",
  VALIDE: "secondary",
  REJETE: "destructive",
}

interface ColumnsProps {
  onReupload: (senderId: SenderId) => void
  onEdit: (senderId: SenderId) => void
  onDelete: (senderId: SenderId) => void
  onChangeStatus: (senderId: SenderId) => void
  userRole?: Role
  t: (key: string, options?: Record<string, unknown>) => string
}

export const createColumns = ({ onEdit, onDelete, onChangeStatus, userRole, t, onReupload }: ColumnsProps): ColumnDef<SenderId>[] => {
  const statusLabels: Record<SenderIdStatus, string> = {
    EN_ATTENTE: t('senderIds.statusPending'),
    VALIDE: t('senderIds.statusValidated'),
    REJETE: t('senderIds.statusRejected'),
  }

  return [
  {
    accessorKey: "name",
    header: ({ column }) => <DataTableColumnHeader column={column} title={t('common.name')} label={t('common.name')} />,
    cell: ({ row }) => <div className="font-medium">{row.getValue("name")}</div>,
  },
  {
    accessorKey: "description",
    header: ({ column }) => <DataTableColumnHeader column={column} title={t('common.description')} label={t('common.description')} />,
    cell: ({ row }) => (
      <div className="max-w-[300px] truncate" title={row.getValue("description")}>
        {row.getValue("description")}
      </div>
    ),
  },
  {
    accessorKey: "status",
    header: ({ column }) => <DataTableColumnHeader column={column} title={t('common.status')} label={t('common.status')} />,
    cell: ({ row }) => {
      const status = row.getValue("status") as SenderIdStatus
      return (
        <Badge variant={statusColors[status]}>
          {statusLabels[status]}
        </Badge>
      )
    },
    filterFn: (row, id, value) => value.includes(row.getValue(id)),
    meta: {
      label: t('common.status'),
      variant: "select" as const,
      options: [
        { label: t('senderIds.statusPending'), value: "EN_ATTENTE" },
        { label: t('senderIds.statusValidated'), value: "VALIDE" },
        { label: t('senderIds.statusRejected'), value: "REJETE" },
      ],
    },
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => <DataTableColumnHeader column={column} title={t('common.createdAt')} label={t('common.createdAt')} />,
    cell: ({ row }) => {
      const date = new Date(row.getValue("createdAt"))
      return format(date, "dd MMM yyyy", { locale: fr })
    },
  },
  {
    accessorKey: "kycA2PUrl",
    header: t('senderIds.kycA2PLabel', { defaultValue: "KYC A2P" }),
    cell: ({ row }) => {
      const url = row.getValue("kycA2PUrl") as string | null
      if (!url) return <span className="text-muted-foreground">-</span>
      return (
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-xs text-primary hover:underline"
        >
          <ExternalLink className="h-3 w-3" />
          {t('senderIds.viewDocument', { defaultValue: "Voir" })}
        </a>
      )
    },
  },
  {
    accessorKey: "senderIdAuthLetterUrl",
    header: t('senderIds.authLetterLabel', { defaultValue: "Lettre auth." }),
    cell: ({ row }) => {
      const url = row.getValue("senderIdAuthLetterUrl") as string | null
      if (!url) return <span className="text-muted-foreground">-</span>
      return (
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-xs text-primary hover:underline"
        >
          <ExternalLink className="h-3 w-3" />
          {t('senderIds.viewDocument', { defaultValue: "Voir" })}
        </a>
      )
    },
  },
  {
    accessorKey: "rejectionReason",
    header: t('senderIds.rejectionReason'),
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
    header: t('common.actions'),
    cell: ({ row }) => {
      const senderId = row.original

      const actions = [
        {
          icon: Edit2,
          label: t('senderIds.edit'),
          onClick: () => onEdit(senderId),
        },
        // Reupload for rejected sender IDs
        ...(senderId.status === "REJETE" ? [{
          icon: FileUp,
          label: t('senderIds.reuploadFiles'),
          onClick: () => onReupload(senderId),
        }] : []),
        // Only SUPER_ADMIN can change status
        ...(userRole === Role.SUPER_ADMIN ? [{
          icon: RefreshCcw,
          label: t('senderIds.changeStatus'),
          onClick: () => onChangeStatus(senderId),
        }] : []),
        // Only SUPER_ADMIN can delete
        ...(userRole === Role.SUPER_ADMIN ? [{
          icon: Trash2,
          label: t('senderIds.delete'),
          className: "text-destructive",
          onClick: () => onDelete(senderId),
        }] : []),
      ]

      return <ActionsDropdown items={actions} />
    },
    meta: {
      className: "w-20",
    },
  },
]
}
