"use client"

import { format } from "date-fns"
import { fr } from "date-fns/locale"
import type { ColumnDef } from "@tanstack/react-table"
import { Badge } from "@/shared/ui/badge"
import { Button } from "@/shared/ui/button"
import { Eye } from "lucide-react"
import type { BulkSmsJob } from "@/core/hooks/useBulkSms"

interface JobsTableProps {
  onJobClick: (job: BulkSmsJob) => void
  t: (key: string) => string
}

const statusColors: Record<BulkSmsJob["status"], string> = {
  PENDING: "bg-yellow-100 text-yellow-800",
  PROCESSING: "bg-blue-100 text-blue-800",
  COMPLETED: "bg-green-100 text-green-800",
  PARTIAL: "bg-orange-100 text-orange-800",
  FAILED: "bg-red-100 text-red-800",
}

const statusLabels: Record<BulkSmsJob["status"], string> = {
  PENDING: "En attente",
  PROCESSING: "En cours",
  COMPLETED: "Complété",
  PARTIAL: "Partiellement complété",
  FAILED: "Échoué",
}

export const getJobsColumns = ({
  onJobClick,
  t,
}: JobsTableProps): ColumnDef<BulkSmsJob>[] => [
  {
    header: "Job ID",
    accessorKey: "jobId",
    cell: (row: any) => {
      const job = row?.row?.original as BulkSmsJob | undefined
      return (
        <div className="font-mono text-xs">
          {job?.jobId?.substring(0, 8)}...
        </div>
      )
    },
  },
  {
    header: "Statut",
    accessorKey: "status",
    cell: (row: any) => {
      const job = row?.row?.original as BulkSmsJob | undefined
      const status = job?.status as BulkSmsJob["status"]
      return (
        <Badge className={statusColors[status]}>
          {statusLabels[status]}
        </Badge>
      )
    },
  },
  {
    header: "Total",
    accessorKey: "totalRecipients",
    cell: (row: any) => {
      const job = row?.row?.original as BulkSmsJob | undefined
      return (
        <div className="text-right font-medium">
          {job?.totalRecipients}
        </div>
      )
    },
  },
  {
    header: "Succès",
    accessorKey: "successCount",
    cell: (row: any) => {
      const job = row?.row?.original as BulkSmsJob | undefined
      return (
        <div className="text-right text-green-600 font-medium">
          {job?.successCount}
        </div>
      )
    },
  },
  {
    header: "Erreurs",
    accessorKey: "failedCount",
    cell: (row: any) => {
      const job = row?.row?.original as BulkSmsJob | undefined
      return (
        <div className="text-right text-red-600 font-medium">
          {job?.failedCount}
        </div>
      )
    },
  },
  {
    header: "Sender ID",
    accessorKey: "senderId",
    cell: (row: any) => {
      const job = row?.row?.original as BulkSmsJob | undefined
      return <div className="text-sm">{job?.senderId || "-"}</div>
    },
  },
  {
    header: "Créé",
    accessorKey: "createdAt",
    cell: (row: any) => {
      const job = row?.row?.original as BulkSmsJob | undefined
      return (
        <div className="text-sm text-muted-foreground">
          {job?.createdAt
            ? format(new Date(job.createdAt), "dd MMM HH:mm", { locale: fr })
            : "-"}
        </div>
      )
    },
  },
  {
    header: "Actions",
    id: "actions",
    cell: (row: any) => {
      const job = row?.row?.original as BulkSmsJob | undefined
      return (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => job && onJobClick(job)}
          className="h-8 w-8 p-0"
        >
          <Eye className="h-4 w-4" />
        </Button>
      )
    },
  },
]
