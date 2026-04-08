"use client"

import { useT } from "@/core/hooks"
import type { MessageStatus } from "@/core/models/history"
import { CloseCircle, Sms, TickCircle, Timer1 } from "iconsax-react"

interface SmsStatusPillProps {
  status?: MessageStatus | string | null
  className?: string
}

const baseClassName =
  "inline-flex items-center gap-1 rounded-lg px-2 py-0.5 text-xs font-medium border border-dashed"

function getStatusMeta(status: string, labels: { delivered: string; sent: string; pending: string; failed: string }) {
  if (!status) {
    return {
      label: "—",
      className: "border-muted bg-muted/30 text-muted-foreground",
      icon: null,
    }
  }

  if (status === "DELIVERED") {
    return {
      label: labels.delivered,
      className: "border-emerald-500 bg-emerald-50 text-emerald-700",
      icon: TickCircle,
    }
  }

  if (status === "SENT" || status === "ACCEPTED") {
    return {
      label: labels.sent,
      className: "border-blue-500 bg-blue-500 text-blue-50",
      icon: Sms,
    }
  }

  if (status === "PENDING") {
    return {
      label: labels.pending,
      className: "border-amber-500 bg-amber-50 text-amber-800",
      icon: Timer1,
    }
  }

  if (status === "FAILED") {
    return {
      label: labels.failed,
      className: "border-red-500 bg-red-50 text-red-700",
      icon: CloseCircle,
    }
  }

  return {
    label: status,
    className: "border-muted bg-muted/30 text-muted-foreground",
    icon: null,
  }
}

export function SmsStatusPill({ status, className }: SmsStatusPillProps) {
  const { t } = useT()

  const labels = {
    delivered: t("companies.statusDelivered"),
    sent: t("companies.statusSent"),
    pending: t("companies.statusPending"),
    failed: t("companies.statusFailed"),
  }

  const normalised = (status == null ? "" : String(status)).toUpperCase()
  const meta = getStatusMeta(normalised, labels)
  const Icon = meta.icon

  return (
    <div className={[baseClassName, meta.className, className].filter(Boolean).join(" ")}>
      {Icon ? <Icon className="h-3.5 w-3.5" variant="Bulk" color="currentColor" /> : null}
      {meta.label}
    </div>
  )
}
