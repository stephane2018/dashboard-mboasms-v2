"use client"

import type { ColumnDef } from "@tanstack/react-table"
import { cn } from "@/lib/utils"
import {
  TickCircle,
  CloseCircle,
  Wallet,
  MoneyRecive,
  Mobile,
  Bank,
  Clock,
  Global,
} from "iconsax-react"
import type { RechargeListContentType } from "@/core/models/recharges"
import { PaymentMethod, RechargeStatus } from "@/core/models/recharges"
import { format } from "date-fns"
import { fr } from "date-fns/locale"

type TranslateFn = (key: string, options?: Record<string, unknown>) => string

type BadgeConfig = {
  label: string
  icon: React.ElementType
  bgColor: string
  textColor: string
  iconColor: string
  borderColor: string
  borderStyle: string
}

const getPaymentMethodConfig = (method: string, t: TranslateFn): BadgeConfig => {
  const configs: Record<string, BadgeConfig> = {
    [PaymentMethod.CASH]: {
      label: t('paymentMethods.cash'),
      icon: MoneyRecive,
      bgColor: "bg-green-50 dark:bg-green-900/20",
      textColor: "text-green-700 dark:text-green-400",
      iconColor: "text-green-600",
      borderColor: "border-green-300 dark:border-green-700",
      borderStyle: "border-solid",
    },
    [PaymentMethod.ORANGE_MONEY]: {
      label: t('paymentMethods.orangeMoney'),
      icon: Mobile,
      bgColor: "bg-orange-50 dark:bg-orange-900/20",
      textColor: "text-orange-700 dark:text-orange-400",
      iconColor: "text-orange-600",
      borderColor: "border-orange-300 dark:border-orange-700",
      borderStyle: "border-dashed",
    },
    [PaymentMethod.MTN_MONEY]: {
      label: t('paymentMethods.mtnMoney'),
      icon: Mobile,
      bgColor: "bg-yellow-50 dark:bg-yellow-900/20",
      textColor: "text-yellow-700 dark:text-yellow-400",
      iconColor: "text-yellow-600",
      borderColor: "border-yellow-300 dark:border-yellow-700",
      borderStyle: "border-dotted",
    },
    [PaymentMethod.BANK_ACCOUNT]: {
      label: t('paymentMethods.bankAccount'),
      icon: Bank,
      bgColor: "bg-blue-50 dark:bg-blue-900/20",
      textColor: "text-blue-700 dark:text-blue-400",
      iconColor: "text-blue-600",
      borderColor: "border-blue-300 dark:border-blue-700",
      borderStyle: "border-double",
    },
    [PaymentMethod.PAYPAL]: {
      label: t('paymentMethods.paypal'),
      icon: Wallet,
      bgColor: "bg-indigo-50 dark:bg-indigo-900/20",
      textColor: "text-indigo-700 dark:text-indigo-400",
      iconColor: "text-indigo-600",
      borderColor: "border-indigo-300 dark:border-indigo-700",
      borderStyle: "border-dashed",
    },
  }

  return configs[method] ?? {
    label: method,
    icon: Wallet,
    bgColor: "bg-gray-50 dark:bg-gray-900/20",
    textColor: "text-gray-700 dark:text-gray-400",
    iconColor: "text-gray-600",
    borderColor: "border-gray-300 dark:border-gray-700",
    borderStyle: "border-solid",
  }
}

const getStatusConfig = (status: string, t: TranslateFn): BadgeConfig => {
  const configs: Record<string, BadgeConfig> = {
    [RechargeStatus.PENDING]: {
      label: t('rechargeStatus.pending'),
      icon: Clock,
      bgColor: "bg-amber-50 dark:bg-amber-900/20",
      textColor: "text-amber-700 dark:text-amber-400",
      iconColor: "text-amber-600",
      borderColor: "border-amber-300 dark:border-amber-700",
      borderStyle: "border-dashed",
    },
    [RechargeStatus.VALIDATED]: {
      label: t('rechargeStatus.validated'),
      icon: TickCircle,
      bgColor: "bg-green-50 dark:bg-green-900/20",
      textColor: "text-green-700 dark:text-green-400",
      iconColor: "text-green-600",
      borderColor: "border-green-300 dark:border-green-700",
      borderStyle: "border-solid",
    },
    "VALIDE": {
      label: "Validé",
      icon: TickCircle,
      bgColor: "bg-green-50 dark:bg-green-900/20",
      textColor: "text-green-700 dark:text-green-400",
      iconColor: "text-green-600",
      borderColor: "border-green-300 dark:border-green-700",
      borderStyle: "border-solid",
    },
    [RechargeStatus.REFUSED]: {
      label: t('rechargeStatus.refused'),
      icon: CloseCircle,
      bgColor: "bg-red-50 dark:bg-red-900/20",
      textColor: "text-red-700 dark:text-red-400",
      iconColor: "text-red-600",
      borderColor: "border-red-300 dark:border-red-700",
      borderStyle: "border-solid",
    },
    [RechargeStatus.REFUSE]: {
      label: t('rechargeStatus.refused'),
      icon: CloseCircle,
      bgColor: "bg-red-50 dark:bg-red-900/20",
      textColor: "text-red-700 dark:text-red-400",
      iconColor: "text-red-600",
      borderColor: "border-red-300 dark:border-red-700",
      borderStyle: "border-solid",
    },
    "ECHEC_PAIMENT": {
      label: "Échec paiement",
      icon: CloseCircle,
      bgColor: "bg-red-50 dark:bg-red-900/20",
      textColor: "text-red-700 dark:text-red-400",
      iconColor: "text-red-600",
      borderColor: "border-red-300 dark:border-red-700",
      borderStyle: "border-dashed",
    },
  }

  return configs[status] ?? {
    label: status,
    icon: Clock,
    bgColor: "bg-gray-50 dark:bg-gray-900/20",
    textColor: "text-gray-700 dark:text-gray-400",
    iconColor: "text-gray-600",
    borderColor: "border-gray-300 dark:border-gray-700",
    borderStyle: "border-solid",
  }
}

const getRechargeTypeConfig = (type: string, t: TranslateFn): BadgeConfig => {
  const configs: Record<string, BadgeConfig> = {
    "local": {
      label: "Local",
      icon: Wallet,
      bgColor: "bg-blue-50 dark:bg-blue-900/20",
      textColor: "text-blue-700 dark:text-blue-400",
      iconColor: "text-blue-600",
      borderColor: "border-blue-300 dark:border-blue-700",
      borderStyle: "border-solid",
    },
    "LOCAL": {
      label: "Local",
      icon: Wallet,
      bgColor: "bg-blue-50 dark:bg-blue-900/20",
      textColor: "text-blue-700 dark:text-blue-400",
      iconColor: "text-blue-600",
      borderColor: "border-blue-300 dark:border-blue-700",
      borderStyle: "border-solid",
    },
    "international": {
      label: "International",
      icon: Global,
      bgColor: "bg-purple-50 dark:bg-purple-900/20",
      textColor: "text-purple-700 dark:text-purple-400",
      iconColor: "text-purple-600",
      borderColor: "border-purple-300 dark:border-purple-700",
      borderStyle: "border-dashed",
    },
    "INTERNATIONAL": {
      label: "International",
      icon: Global,
      bgColor: "bg-purple-50 dark:bg-purple-900/20",
      textColor: "text-purple-700 dark:text-purple-400",
      iconColor: "text-purple-600",
      borderColor: "border-purple-300 dark:border-purple-700",
      borderStyle: "border-dashed",
    },
  }

  return configs[type] ?? {
    label: type,
    icon: Wallet,
    bgColor: "bg-gray-50 dark:bg-gray-900/20",
    textColor: "text-gray-700 dark:text-gray-400",
    iconColor: "text-gray-600",
    borderColor: "border-gray-300 dark:border-gray-700",
    borderStyle: "border-solid",
  }
}

export function createClientRechargeColumns(t: TranslateFn): ColumnDef<RechargeListContentType>[] {
  return [
    {
      accessorKey: "qteMessage",
      header: t('rechargeColumns.smsQuantity'),
      cell: ({ row }) => (
        <span className="font-mono font-semibold">
          {row.original.qteMessage.toLocaleString()}
        </span>
      ),
    },
    {
      id: "paymentDetails",
      header: t('rechargeColumns.paymentDetails'),
      cell: ({ row }) => {
        const rechargeType = row.original.rechargeType || "local"
        const amount = row.original.paymentAmount
        const baseTotal = row.original.qteMessage * row.original.messagePriceUnit
        const hasCoupon = row.original.coupon && amount < baseTotal
        const method = row.original.paymentMethod
        const methodConfig = getPaymentMethodConfig(method, t)
        const MethodIcon = methodConfig.icon

        return (
          <div className="space-y-0.5 text-xs">
            <div className="flex items-center gap-1">
              <span className="text-muted-foreground min-w-fit">PU:</span>
              <span className="font-mono font-semibold">
                {row.original.messagePriceUnit}
              </span>
            </div>
            <div className="flex items-center gap-1">
              <span className="text-muted-foreground min-w-fit">Total:</span>
              <div className="flex flex-col">
                <span className="font-mono font-semibold text-primary">
                  {amount.toLocaleString()}
                </span>
                {hasCoupon && (
                  <span className="font-mono text-xs text-muted-foreground line-through">
                    {baseTotal.toLocaleString()}
                  </span>
                )}
              </div>
            </div>
            <div className={cn(
              "inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-xs border",
              methodConfig.borderStyle,
              methodConfig.borderColor,
              methodConfig.bgColor
            )}>
              <MethodIcon size={10} variant="Bulk" color="currentColor" className={methodConfig.iconColor} />
              <span className={cn("font-medium truncate max-w-24", methodConfig.textColor)}>
                {methodConfig.label}
              </span>
            </div>
          </div>
        )
      },
    },
    {
      id: "coupon",
      header: t('rechargeColumns.coupon'),
      cell: ({ row }) => {
        const coupon = row.original.coupon
        if (!coupon) return <span className="text-muted-foreground text-xs">-</span>

        return (
          <div className="flex flex-col">
            <code className="text-xs font-mono bg-muted px-1.5 py-0.5 rounded">
              {coupon.code}
            </code>
            <span className="text-xs text-green-600">-{coupon.percentage}%</span>
          </div>
        )
      },
    },
    {
      accessorKey: "debitPhoneNumber",
      header: t('rechargeColumns.phone'),
      cell: ({ row }) => (
        <span className="font-mono text-sm">
          {row.original.debitPhoneNumber || "N/A"}
        </span>
      ),
    },
    {
      id: "rechargeType",
      header: t('rechargeColumns.type'),
      cell: ({ row }) => {
        const type = row.original.rechargeType || "local"
        const config = getRechargeTypeConfig(type, t)
        const Icon = config.icon

        return (
          <div className={cn(
            "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md border",
            config.borderStyle,
            config.borderColor,
            config.bgColor
          )}>
            <Icon size={14} variant="Bulk" color="currentColor" className={config.iconColor} />
            <span className={cn("text-xs font-medium", config.textColor)}>
              {config.label}
            </span>
          </div>
        )
      },
    },
    {
      accessorKey: "status",
      header: t('rechargeColumns.status'),
      cell: ({ row }) => {
        const status = row.original.status
        const config = getStatusConfig(status, t)
        const Icon = config.icon

        return (
          <div className={cn(
            "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md border",
            config.borderStyle,
            config.borderColor,
            config.bgColor
          )}>
            <Icon size={14} variant="Bulk" color="currentColor" className={config.iconColor} />
            <span className={cn("text-xs font-medium", config.textColor)}>
              {config.label}
            </span>
          </div>
        )
      },
    },
    {
      accessorKey: "createdAt",
      header: t('rechargeColumns.date'),
      cell: ({ row }) => {
        const date = new Date(row.original.createdAt)
        return (
          <div className="flex flex-col">
            <span className="text-sm">
              {format(date, "dd MMM yyyy", { locale: fr })}
            </span>
            <span className="text-xs text-muted-foreground">
              {format(date, "HH:mm", { locale: fr })}
            </span>
          </div>
        )
      },
    },
  ]
}
