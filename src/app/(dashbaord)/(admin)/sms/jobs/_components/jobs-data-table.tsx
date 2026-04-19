"use client"

import { format } from "date-fns"
import { fr } from "date-fns/locale"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/ui/table"
import { Button } from "@/shared/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/ui/select"
import { Badge } from "@/shared/ui/badge"
import { ChevronLeft, ChevronRight, Eye, Loader2 } from "lucide-react"
import type { BulkSmsJob } from "@/core/hooks/useBulkSms"

interface JobsDataTableProps {
  jobs: BulkSmsJob[]
  isLoading: boolean
  page: number
  pageSize: number
  totalPages: number
  onPageChange: (page: number) => void
  onPageSizeChange: (size: number) => void
  onJobClick: (job: BulkSmsJob) => void
}

const statusColors = {
  PENDING: "bg-yellow-100 text-yellow-800",
  PROCESSING: "bg-blue-100 text-blue-800",
  COMPLETED: "bg-green-100 text-green-800",
  PARTIAL: "bg-orange-100 text-orange-800",
  FAILED: "bg-red-100 text-red-800",
}

const statusLabels = {
  PENDING: "En attente",
  PROCESSING: "En cours",
  COMPLETED: "Complété",
  PARTIAL: "Partiellement complété",
  FAILED: "Échoué",
}

export function JobsDataTable({
  jobs,
  isLoading,
  page,
  pageSize,
  totalPages,
  onPageChange,
  onPageSizeChange,
  onJobClick,
}: JobsDataTableProps) {
  return (
    <div className="space-y-4">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="border-b">
              <TableHead>Job ID</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Total</TableHead>
              <TableHead className="text-right">Succès</TableHead>
              <TableHead className="text-right">Erreurs</TableHead>
              <TableHead>Sender ID</TableHead>
              <TableHead>Créé</TableHead>
              <TableHead className="text-center">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={8} className="h-32 text-center">
                  <div className="flex items-center justify-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Chargement...</span>
                  </div>
                </TableCell>
              </TableRow>
            ) : jobs.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="h-32 text-center text-muted-foreground">
                  Aucun job d'envoi SMS en masse
                </TableCell>
              </TableRow>
            ) : (
              jobs.map((job) => (
                <TableRow key={job.jobId} className="border-b hover:bg-muted/50">
                  <TableCell className="font-mono text-xs">
                    {job.jobId.substring(0, 8)}...
                  </TableCell>
                  <TableCell>
                    <Badge className={statusColors[job.status]}>
                      {statusLabels[job.status]}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right font-medium">
                    {job.totalRecipients}
                  </TableCell>
                  <TableCell className="text-right text-green-600 font-medium">
                    {job.successCount}
                  </TableCell>
                  <TableCell className="text-right text-red-600 font-medium">
                    {job.failedCount}
                  </TableCell>
                  <TableCell className="text-sm">
                    {job.senderId || "-"}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {format(new Date(job.createdAt), "dd MMM HH:mm", {
                      locale: fr,
                    })}
                  </TableCell>
                  <TableCell className="text-center">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onJobClick(job)}
                      className="h-8 w-8 p-0"
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between px-4 py-3 border-t">
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">
            Résultats par page:
          </span>
          <Select value={pageSize.toString()} onValueChange={(v) => onPageSizeChange(Number(v))}>
            <SelectTrigger className="w-20">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="10">10</SelectItem>
              <SelectItem value="20">20</SelectItem>
              <SelectItem value="50">50</SelectItem>
              <SelectItem value="100">100</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">
            Page {page + 1} sur {totalPages || 1}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(Math.max(0, page - 1))}
            disabled={page === 0}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(page + 1)}
            disabled={page >= (totalPages || 1) - 1}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
