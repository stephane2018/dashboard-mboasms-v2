"use client"

import { useEffect, useState } from "react"
import { format } from "date-fns"
import { fr } from "date-fns/locale"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/shared/ui/dialog"
import { Badge } from "@/shared/ui/badge"
import { useBulkSmsJobStatus } from "@/core/hooks/useBulkSms"
import { Loader2 } from "lucide-react"
import type { BulkSmsJob } from "@/core/hooks/useBulkSms"

interface JobDetailsModalProps {
  job: BulkSmsJob
  isOpen: boolean
  onClose: () => void
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

export function JobDetailsModal({
  job: initialJob,
  isOpen,
  onClose,
}: JobDetailsModalProps) {
  const [job, setJob] = useState(initialJob)
  const { data: updatedJob, isLoading } = useBulkSmsJobStatus(initialJob.jobId)

  useEffect(() => {
    if (updatedJob) {
      setJob(updatedJob)
    }
  }, [updatedJob])

  const successRate =
    job.totalRecipients > 0
      ? ((job.successCount / job.totalRecipients) * 100).toFixed(1)
      : 0

  const failureRate =
    job.totalRecipients > 0
      ? ((job.failedCount / job.totalRecipients) * 100).toFixed(1)
      : 0

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Détails du Job SMS</DialogTitle>
          <DialogDescription>
            Informations complètes sur l'envoi en masse
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Status and ID */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-muted-foreground mb-1">Status</p>
              <Badge className={statusColors[job.status]}>
                {statusLabels[job.status]}
              </Badge>
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-1">Job ID</p>
              <p className="text-sm font-mono">{job.jobId}</p>
            </div>
          </div>

          {/* Sender ID */}
          <div>
            <p className="text-xs text-muted-foreground mb-1">Sender ID</p>
            <p className="text-sm">{job.senderId || "-"}</p>
          </div>

          {/* Timestamps */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-muted-foreground mb-1">Créé</p>
              <p className="text-sm">
                {format(new Date(job.createdAt), "dd MMM yyyy HH:mm:ss", {
                  locale: fr,
                })}
              </p>
            </div>
            {job.completedAt && (
              <div>
                <p className="text-xs text-muted-foreground mb-1">Complété</p>
                <p className="text-sm">
                  {format(new Date(job.completedAt), "dd MMM yyyy HH:mm:ss", {
                    locale: fr,
                  })}
                </p>
              </div>
            )}
          </div>

          {/* Statistics */}
          <div className="rounded-lg border p-4 space-y-3">
            <h4 className="font-semibold text-sm">Statistiques</h4>
            <div className="grid grid-cols-3 gap-3">
              <div>
                <p className="text-xs text-muted-foreground">Total</p>
                <p className="text-lg font-bold">{job.totalRecipients}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Succès</p>
                <p className="text-lg font-bold text-green-600">
                  {job.successCount} ({successRate}%)
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Erreurs</p>
                <p className="text-lg font-bold text-red-600">
                  {job.failedCount} ({failureRate}%)
                </p>
              </div>
            </div>

            {/* Progress bar */}
            <div className="space-y-1">
              <div className="flex gap-1 h-2 rounded-full overflow-hidden bg-gray-200">
                {job.successCount > 0 && (
                  <div
                    className="bg-green-600"
                    style={{ width: `${successRate}%` }}
                  />
                )}
                {job.failedCount > 0 && (
                  <div
                    className="bg-red-600"
                    style={{ width: `${failureRate}%` }}
                  />
                )}
              </div>
            </div>
          </div>

          {/* Error Message */}
          {job.errorMessage && (
            <div className="rounded-lg border border-red-200 bg-red-50 p-3">
              <p className="text-xs font-semibold text-red-800 mb-1">
                Message d'erreur
              </p>
              <p className="text-xs text-red-700">{job.errorMessage}</p>
            </div>
          )}

          {/* Status URL */}
          {job.statusUrl && (
            <div>
              <p className="text-xs text-muted-foreground mb-1">URL de suivi</p>
              <p className="text-xs font-mono break-all text-gray-600">
                {job.statusUrl}
              </p>
            </div>
          )}

          {/* Auto-refresh indicator */}
          {isLoading && (
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Loader2 className="h-3 w-3 animate-spin" />
              Actualisation en cours...
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
