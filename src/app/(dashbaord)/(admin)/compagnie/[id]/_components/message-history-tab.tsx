"use client"

import { useMemo, useState } from "react"
import type { PaginationState, ColumnDef } from "@tanstack/react-table"
import { useMessageHistory } from "@/core/hooks/useMessage"
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card"
import { Skeleton } from "@/shared/ui/skeleton"
import { Sms } from "iconsax-react"
import { DataTable } from "@/shared/common/data-table/table"
import type { MessageHistoryType } from "@/core/models/history"
import { SmsStatusPill } from "./sms-status-pill"

interface MessageHistoryTabProps {
  enterpriseId: string
}

export function MessageHistoryTab({ enterpriseId }: MessageHistoryTabProps) {
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  })

  const { data: messageHistory, isLoading, error } = useMessageHistory(
    enterpriseId,
    pagination.pageIndex,
    pagination.pageSize
  )

  const columns = useMemo<ColumnDef<MessageHistoryType>[]>(
    () => [
      {
        accessorKey: "msisdn",
        header: "Destinataire",
        cell: ({ row }) => <div className="font-medium">{row.getValue("msisdn") || "—"}</div>,
      },
      {
        accessorKey: "message",
        header: "Message",
        cell: ({ row }) => (
          <div className="text-sm text-muted-foreground max-w-[420px] truncate">
            {row.getValue("message") || "—"}
          </div>
        ),
      },
      {
        accessorKey: "smsCount",
        header: "SMS",
        cell: ({ row }) => <div className="text-sm">{row.getValue("smsCount") ?? 0}</div>,
        meta: { className: "w-20" },
      },
      {
        accessorKey: "status",
        header: "Statut",
        cell: ({ row }) => <SmsStatusPill status={row.getValue("status") as string | undefined} />,
        meta: { className: "w-28" },
      },
      {
        accessorKey: "createdAt",
        header: "Date",
        cell: ({ row }) => {
          const raw = row.getValue("createdAt") as string | undefined
          if (!raw) return <div className="text-sm">—</div>
          const d = new Date(raw)
          return <div className="text-sm">{Number.isNaN(d.getTime()) ? "—" : d.toLocaleString("fr-FR")}</div>
        },
        meta: { className: "w-44" },
      },
    ],
    []
  )

  if (error) {
    return (
      <Card className="border-red-200 bg-red-50">
        <CardContent className="pt-6">
          <p className="text-sm text-red-600">Erreur lors du chargement de l'historique des messages</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="p-0">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sms className="h-5 w-5 text-primary" variant="Bulk" color="currentColor" />
          Historique des messages
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading && !messageHistory ? (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Skeleton className="h-5 w-44" />
              <Skeleton className="h-9 w-36" />
            </div>
            <div className="space-y-2">
              {Array.from({ length: 8 }).map((_, i) => (
                <Skeleton key={i} className="h-10 w-full" />
              ))}
            </div>
          </div>
        ) : (
          <DataTable<MessageHistoryType>
            data={messageHistory?.content || []}
            rowCount={messageHistory?.totalElements || 0}
            columns={columns}
            isLoading={isLoading}
            enablePagination={true}
            rowSelectable={false}
            onPaginationChange={setPagination}
            initialState={{ pagination }}
            emptyMessage="Aucun message trouvé"
          />
        )}
      </CardContent>
    </Card>
  )
}
