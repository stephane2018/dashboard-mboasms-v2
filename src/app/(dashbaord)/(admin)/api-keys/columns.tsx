"use client"

import { useState } from "react"
import type { ColumnDef } from "@tanstack/react-table"
import { Badge } from "@/shared/ui/badge"
import { Button } from "@/shared/ui/button"
import { DataTableColumnHeader } from "@/shared/common/data-table/data-table-column-header"
import { ActionsDropdown } from "@/shared/common/data-table/actions-dropdown"
import { Copy, Check, Trash2 } from "lucide-react"
import type { ApiKey } from "@/modules/api-key/types"
import { format } from "date-fns"
import { fr } from "date-fns/locale"

function CopyKeyCell({ apiKey }: { apiKey: string }) {
  const [copied, setCopied] = useState(false)
  // Format: mboa_e52b...25e2
  const prefix = apiKey.slice(0, 9) // "mboa_e52b"
  const suffix = apiKey.slice(-4)   // "25e2"

  const handleCopy = async () => {
    await navigator.clipboard.writeText(apiKey)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="flex items-center gap-2">
      <code className="bg-muted px-2 py-1 rounded text-sm font-mono">
        {prefix}...{suffix}
      </code>
      <Button variant="ghost" size="icon" className="h-7 w-7" onClick={handleCopy}>
        {copied ? (
          <Check className="h-3.5 w-3.5 text-green-500" />
        ) : (
          <Copy className="h-3.5 w-3.5 text-muted-foreground" />
        )}
      </Button>
    </div>
  )
}

interface ColumnsProps {
  onDelete: (apiKey: ApiKey) => void
}

export const createColumns = ({ onDelete }: ColumnsProps): ColumnDef<ApiKey>[] => [
  {
    accessorKey: "name",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Nom" label="Nom" />,
    cell: ({ row }) => <div className="font-medium">{row.getValue("name")}</div>,
  },
  {
    accessorKey: "prefix",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Clé" label="Clé" />,
    cell: ({ row }) => {
       return <CopyKeyCell apiKey={row.original.apiKey || ""} />
    },
  },

  {
    accessorKey: "createdAt",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Créée le" label="Créée le" />,
    cell: ({ row }) => {
      const date = new Date(row.getValue("createdAt"))
      return format(date, "dd MMM yyyy HH:mm", { locale: fr })
    },
  },
  {
    accessorKey: "lastUsedAt",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Dernière utilisation" label="Dernière utilisation" />,
    cell: ({ row }) => {
      const lastUsedAt = row.getValue("lastUsedAt") as string | null
      if (!lastUsedAt) return <span className="text-muted-foreground">Jamais</span>
      return format(new Date(lastUsedAt), "dd MMM yyyy HH:mm", { locale: fr })
    },
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const apiKey = row.original

      const actions = [
        {
          icon: Trash2,
          label: "Supprimer",
          className: "text-destructive",
          onClick: () => onDelete(apiKey),
        },
      ]

      return <ActionsDropdown items={actions} />
    },
    meta: {
      className: "w-20",
    },
  },
]
