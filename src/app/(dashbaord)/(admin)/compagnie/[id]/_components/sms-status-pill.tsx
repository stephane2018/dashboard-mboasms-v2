"use client"

import type { MessageStatus } from "@/core/models/history"
import { CloseCircle, Sms, TickCircle, Timer1 } from "iconsax-react"

interface SmsStatusPillProps {
  status?: MessageStatus | string | null
  className?: string
}

const baseClassName =
  "inline-flex items-center gap-1 rounded-lg px-2 py-0.5 text-xs font-medium border border-dashed"

function getStatusMeta(statusRaw?: string | null) {
  const status = (statusRaw || "").toUpperCase()

  if (!status) {
    return {
      label: "—",
      className: "border-muted bg-muted/30 text-muted-foreground",
      icon: null,
    }
  }

  if (status === "DELIVERED") {
    return {
      label: "Livré",
      className: "border-emerald-500 bg-emerald-50 text-emerald-700",
      icon: TickCircle,
    }
  }

  if (status === "SENT" || status === "ACCEPTED") {
    return {
      label: "Envoyé",
      className: "border-blue-500 bg-blue-500 text-blue-50",
      icon: Sms,
    }
  }

  if (status === "PENDING") {
    return {
      label: "En attente",
      className: "border-amber-500 bg-amber-50 text-amber-800",
      icon: Timer1,
    }
  }

  if (status === "FAILED") {
    return {
      label: "Échec",
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
  const meta = getStatusMeta(status == null ? "" : String(status))
  const Icon = meta.icon

  return (
    <div className={[baseClassName, meta.className, className].filter(Boolean).join(" ")}>
      {Icon ? <Icon className="h-3.5 w-3.5" variant="Bulk" color="currentColor" /> : null}
      {meta.label}
    </div>
  )
}
