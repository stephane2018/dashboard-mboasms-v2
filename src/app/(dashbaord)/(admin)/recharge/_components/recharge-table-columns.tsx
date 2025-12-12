"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Button } from "@/shared/ui/button"
import { Badge } from "@/shared/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/shared/ui/dropdown-menu"
import { TickCircle, CloseCircle, Wallet, More } from "iconsax-react"
import { RechargeListContentType, PaymentMethod, RechargeStatus } from "@/core/models/recharges"
import { format } from "date-fns"
import { fr } from "date-fns/locale"

interface ColumnsProps {
  onValidate: (recharge: RechargeListContentType) => void
  onRefuse: (recharge: RechargeListContentType) => void
  onCredit: (recharge: RechargeListContentType) => void
  isSuperAdmin: boolean
}

const getPaymentMethodLabel = (method: string) => {
  const labels: Record<string, string> = {
    [PaymentMethod.CASH]: "Espèces",
    [PaymentMethod.ORANGE_MONEY]: "Orange Money",
    [PaymentMethod.MTN_MONEY]: "MTN Money",
    [PaymentMethod.BANK_ACCOUNT]: "Compte bancaire",
    [PaymentMethod.PAYPAL]: "PayPal",
  }
  return labels[method] || method
}

const getPaymentMethodVariant = (method: string): "default" | "secondary" | "outline" | "destructive" => {
  const variants: Record<string, "default" | "secondary" | "outline" | "destructive"> = {
    [PaymentMethod.CASH]: "default",
    [PaymentMethod.ORANGE_MONEY]: "secondary",
    [PaymentMethod.MTN_MONEY]: "outline",
    [PaymentMethod.BANK_ACCOUNT]: "default",
    [PaymentMethod.PAYPAL]: "secondary",
  }
  return variants[method] || "default"
}

const getStatusBadge = (status: string) => {
  const statusConfig: Record<string, { label: string; variant: "default" | "secondary" | "outline" | "destructive" }> = {
    [RechargeStatus.PENDING]: { label: "En attente", variant: "secondary" },
    [RechargeStatus.VALIDATED]: { label: "Validée", variant: "default" },
    [RechargeStatus.REFUSED]: { label: "Refusée", variant: "destructive" },
  }

  const config = statusConfig[status] || { label: status, variant: "outline" as const }

  return (
    <Badge variant={config.variant} className="font-medium">
      {config.label}
    </Badge>
  )
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
        return (
          <Badge variant={getPaymentMethodVariant(method)}>
            {getPaymentMethodLabel(method)}
          </Badge>
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
      cell: ({ row }) => getStatusBadge(row.original.status),
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

  // Add actions column only for super admin
  if (isSuperAdmin) {
    columns.push({
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const recharge = row.original
        const isPending = recharge.status === RechargeStatus.PENDING

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <More size={16} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              {isPending && (
                <>
                  <DropdownMenuItem
                    onClick={() => onValidate(recharge)}
                    className="cursor-pointer"
                  >
                    <TickCircle size={16} className="mr-2 text-green-600" />
                    Valider
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => onRefuse(recharge)}
                    className="cursor-pointer"
                  >
                    <CloseCircle size={16} className="mr-2 text-red-600" />
                    Refuser
                  </DropdownMenuItem>
                </>
              )}
              {recharge.status === RechargeStatus.VALIDATED && (
                <DropdownMenuItem
                  onClick={() => onCredit(recharge)}
                  className="cursor-pointer"
                >
                  <Wallet size={16} className="mr-2 text-blue-600" />
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
