"use client"

import type { ColumnDef } from "@tanstack/react-table"
import { Badge } from "@/shared/ui/badge"
import { DataTableColumnHeader } from "@/shared/common/data-table/data-table-column-header"
import type { MessageHistoryType } from "@/core/models/history"
import { MessageStatus } from "@/core/models/history"

const getStatusClasses = (status: MessageStatus | string) => {
  const baseClasses = "inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2";
  switch (status) {
    case MessageStatus.ACCEPTED:
      return `${baseClasses} bg-blue-500/10 border-blue-500 text-blue-500 border-dashed`;
    case MessageStatus.SENT:
    case MessageStatus.DELIVERED:
      return `${baseClasses} bg-green-500/10 border-green-500 text-green-500 border-dashed`;
    case MessageStatus.FAILED:
      return `${baseClasses} bg-red-500/10 border-red-500 text-red-500 border-dashed`;
    case MessageStatus.PENDING:
      return `${baseClasses} bg-yellow-100/10 border-yellow-500 text-yellow-500 border-dashed`;
    default:
      return `${baseClasses} bg-gray-100/10 border-gray-500 text-gray-500 border-dashed`;
  }
};

const statusLabels: Record<string, string> = {
  [MessageStatus.ACCEPTED]: "Accepté",
  [MessageStatus.SENT]: "Envoyé",
  [MessageStatus.DELIVERED]: "Livré",
  [MessageStatus.FAILED]: "Échoué",
  [MessageStatus.PENDING]: "En attente",
}

export const columns: ColumnDef<MessageHistoryType>[] = [
  {
    accessorKey: "sender",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Expéditeur" label="Expéditeur" />,
    cell: ({ row }) => <div className="font-medium">{row.getValue("sender")}</div>,
  },
  {
    accessorKey: "msisdn",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Destinataire" label="Destinataire" />,
    cell: ({ row }) => <div>{row.getValue("msisdn")}</div>,
  },
  {
    accessorKey: "message",
    header: "Message",
    cell: ({ row }) => <div className="max-w-xs truncate" title={row.getValue("message")}>{row.getValue("message")}</div>,
  },
  {
    accessorKey: "enterprise",
    header: "Entreprise",
    cell: ({ row }) => {
      const enterprise = row.getValue("enterprise") as MessageHistoryType['enterprise']
      return <div>{enterprise?.smsESenderId || "—"}</div>
    },
  },
  {
    accessorKey: "status",
    header: "Statut",
    cell: ({ row }) => {
      const status = row.getValue("status") as MessageStatus;
      return <div className={getStatusClasses(status)}>{statusLabels[status] || status}</div>;
    },
  },
  {
    accessorKey: "smsCount",
    header: "Nb SMS",
    cell: ({ row }) => <div className="text-center">{row.getValue("smsCount")}</div>,
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Date" label="Date" />,
    cell: ({ row }) => {
      const date = row.getValue("createdAt") as string
      if (!date) return <div>—</div>
      return <div className="whitespace-nowrap">{new Date(date).toLocaleString("fr-FR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })}</div>
    },
  },
]
