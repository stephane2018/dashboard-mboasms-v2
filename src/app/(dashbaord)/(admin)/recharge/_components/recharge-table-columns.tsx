"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Button } from "@/shared/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/shared/ui/dropdown-menu"
import {
  TickCircle,
  CloseCircle,
  Wallet,
  More,
  MoneyRecive,
  Mobile,
  Bank,
  Clock
} from "iconsax-react"
import { RechargeListContentType, PaymentMethod, RechargeStatus } from "@/core/models/recharges"
import { format } from "date-fns"
import { fr } from "date-fns/locale"

interface ColumnsProps {
  onValidate: (recharge: RechargeListContentType) => void
  onRefuse: (recharge: RechargeListContentType) => void
  onCredit: (recharge: RechargeListContentType) => void
  isSuperAdmin: boolean
}

const getPaymentMethodConfig = (method: string) => {
  const configs: Record<string, {
    label: string
    icon: any
    bgColor: string
    textColor: string
    iconColor: string
    borderColor: string
    borderStyle: string
  }> = {
    [PaymentMethod.CASH]: {
      label: "Espèces",
      icon: MoneyRecive,
      bgColor: "bg-green-50 dark:bg-green-900/20",
      textColor: "text-green-700 dark:text-green-400",
      iconColor: "text-green-600",
      borderColor: "border-green-300 dark:border-green-700",
      borderStyle: "border-solid",
    },
    [PaymentMethod.ORANGE_MONEY]: {
      label: "Orange Money",
      icon: Mobile,
      bgColor: "bg-orange-50 dark:bg-orange-900/20",
      textColor: "text-orange-700 dark:text-orange-400",
      iconColor: "text-orange-600",
      borderColor: "border-orange-300 dark:border-orange-700",
      borderStyle: "border-dashed",
    },
    [PaymentMethod.MTN_MONEY]: {
      label: "MTN Money",
      icon: Mobile,
      bgColor: "bg-yellow-50 dark:bg-yellow-900/20",
      textColor: "text-yellow-700 dark:text-yellow-400",
      iconColor: "text-yellow-600",
      borderColor: "border-yellow-300 dark:border-yellow-700",
      borderStyle: "border-dotted",
    },
    [PaymentMethod.BANK_ACCOUNT]: {
      label: "Compte bancaire",
      icon: Bank,
      bgColor: "bg-blue-50 dark:bg-blue-900/20",
      textColor: "text-blue-700 dark:text-blue-400",
      iconColor: "text-blue-600",
      borderColor: "border-blue-300 dark:border-blue-700",
      borderStyle: "border-double",
    },
    [PaymentMethod.PAYPAL]: {
      label: "PayPal",
      icon: Wallet,
      bgColor: "bg-indigo-50 dark:bg-indigo-900/20",
      textColor: "text-indigo-700 dark:text-indigo-400",
      iconColor: "text-indigo-600",
      borderColor: "border-indigo-300 dark:border-indigo-700",
      borderStyle: "border-dashed",
    },
  }

  return configs[method] || {
    label: method,
    icon: Wallet,
    bgColor: "bg-gray-50 dark:bg-gray-900/20",
    textColor: "text-gray-700 dark:text-gray-400",
    iconColor: "text-gray-600",
    borderColor: "border-gray-300 dark:border-gray-700",
    borderStyle: "border-solid",
  }
}

const getStatusConfig = (status: string) => {
  const configs: Record<string, {
    label: string
    icon: any
    bgColor: string
    textColor: string
    iconColor: string
    borderColor: string
    borderStyle: string
  }> = {
    [RechargeStatus.PENDING]: {
      label: "En attente",
      icon: Clock,
      bgColor: "bg-amber-50 dark:bg-amber-900/20",
      textColor: "text-amber-700 dark:text-amber-400",
      iconColor: "text-amber-600",
      borderColor: "border-amber-300 dark:border-amber-700",
      borderStyle: "border-dashed",
    },
    [RechargeStatus.VALIDATED]: {
      label: "Validée",
      icon: TickCircle,
      bgColor: "bg-green-50 dark:bg-green-900/20",
      textColor: "text-green-700 dark:text-green-400",
      iconColor: "text-green-600",
      borderColor: "border-green-300 dark:border-green-700",
      borderStyle: "border-solid",
    },
    [RechargeStatus.REFUSED]: {
      label: "Refusée",
      icon: CloseCircle,
      bgColor: "bg-red-50 dark:bg-red-900/20",
      textColor: "text-red-700 dark:text-red-400",
      iconColor: "text-red-600",
      borderColor: "border-red-300 dark:border-red-700",
      borderStyle: "border-solid",
    },
  }

  return configs[status] || {
    label: status,
    icon: Clock,
    bgColor: "bg-gray-50 dark:bg-gray-900/20",
    textColor: "text-gray-700 dark:text-gray-400",
    iconColor: "text-gray-600",
    borderColor: "border-gray-300 dark:border-gray-700",
    borderStyle: "border-solid",
  }
}

export const getColumns = ({
  onValidate,
  onRefuse,
  onCredit,
  isSuperAdmin,
}: ColumnsProps): ColumnDef<RechargeListContentType>[] => {
  const columns: ColumnDef<RechargeListContentType>[] = [
    {
      accessorKey: "enterprise.socialRaison",
      header: "Entreprise",
      cell: ({ row }) => {
        const name = row.original.enterprise?.socialRaison || "N/A"
        return (
          <div className="flex flex-col">
            <span className="font-medium">{name}</span>
            <span className="text-xs text-muted-foreground">
              {row.original.enterprise?.emailEnterprise || ""}
            </span>
          </div>
        )
      },
    },
    {
      accessorKey: "qteMessage",
      header: "Quantité SMS",
      cell: ({ row }) => (
        <span className="font-mono font-semibold">
          {row.original.qteMessage.toLocaleString()}
        </span>
      ),
    },
    {
      accessorKey: "messagePriceUnit",
      header: "Prix unitaire",
      cell: ({ row }) => (
        <span className="font-mono text-sm">
          {row.original.messagePriceUnit} FCFA
        </span>
      ),
    },
    {
      id: "totalAmount",
      header: "Montant total",
      cell: ({ row }) => {
        const total = row.original.qteMessage * row.original.messagePriceUnit
        return (
          <span className="font-mono font-semibold text-primary">
            {total.toLocaleString()} FCFA
          </span>
        )
      },
    },
    {
      accessorKey: "paymentMethod",
      header: "Méthode de paiement",
      cell: ({ row }) => {
        const method = row.original.paymentMethod
        const config = getPaymentMethodConfig(method)
        const Icon = config.icon

        return (
          <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md border ${config.borderStyle} ${config.borderColor} ${config.bgColor}`}>
            <Icon size={14} variant="Bulk" color="currentColor" className={config.iconColor} />
            <span className={`text-xs font-medium ${config.textColor}`}>
              {config.label}
            </span>
          </div>
        )
      },
    },
    {
      accessorKey: "debitPhoneNumber",
      header: "Téléphone",
      cell: ({ row }) => (
        <span className="font-mono text-sm">
          {row.original.debitPhoneNumber || "N/A"}
        </span>
      ),
    },
    {
      accessorKey: "status",
      header: "Statut",
      cell: ({ row }) => {
        const status = row.original.status
        const config = getStatusConfig(status)
        const Icon = config.icon

        return (
          <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md border ${config.borderStyle} ${config.borderColor} ${config.bgColor}`}>
            <Icon size={14} variant="Bulk" color="currentColor" className={config.iconColor} />
            <span className={`text-xs font-medium ${config.textColor}`}>
              {config.label}
            </span>
          </div>
        )
      },
    },
    {
      accessorKey: "createdAt",
      header: "Date de création",
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

  console.log(isSuperAdmin)

  // Add actions column only for super admin
  if (isSuperAdmin) {
    columns.push({
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const recharge = row.original
        const isPending = recharge.status === RechargeStatus.PENDING 
        console.log(isPending)
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <More color="currentColor" variant="Bulk" size={16} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              {isPending && (
                <>
                  <DropdownMenuItem
                    onClick={() => onValidate(recharge)}
                    className="cursor-pointer"
                  >
                    <TickCircle    color="currentColor" size={16} className="mr-2 text-green-600" />
                    Valider
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => onRefuse(recharge)}
                    className="cursor-pointer"
                  >
                    <CloseCircle color="currentColor" size={16} className="mr-2 text-red-600" />
                    Refuser
                  </DropdownMenuItem>
                </>
              )}
              {recharge.status === RechargeStatus.VALIDATED && (
                <DropdownMenuItem
                  onClick={() => onCredit(recharge)}
                  className="cursor-pointer"
                >
                  <Wallet color="currentColor" size={16} className="mr-2 text-blue-600" />
                  Créditer le compte
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        )
      },
    })
  }

  return columns
}
