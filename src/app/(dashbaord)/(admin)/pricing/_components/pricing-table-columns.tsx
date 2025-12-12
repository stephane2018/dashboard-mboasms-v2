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
import {
  Edit,
  Trash,
  ToggleOn,
  ToggleOff,
  More,
  TickCircle,
  CloseCircle,
} from "iconsax-react"
import type { PricingPlanType } from "@/core/models/pricing"
import { format } from "date-fns"
import { fr } from "date-fns/locale"

interface ColumnsProps {
  onEdit: (plan: PricingPlanType) => void
  onDelete: (plan: PricingPlanType) => void
  onToggleStatus: (plan: PricingPlanType) => void
  isSuperAdmin: boolean
}

const getPlanCodeColor = (planCode: string) => {
  // Generate a consistent color based on plan code
  const colors = [
    {
      bg: "bg-blue-50 dark:bg-blue-900/20",
      text: "text-blue-700 dark:text-blue-400",
      border: "border-blue-300 dark:border-blue-700",
    },
    {
      bg: "bg-purple-50 dark:bg-purple-900/20",
      text: "text-purple-700 dark:text-purple-400",
      border: "border-purple-300 dark:border-purple-700",
    },
    {
      bg: "bg-pink-50 dark:bg-pink-900/20",
      text: "text-pink-700 dark:text-pink-400",
      border: "border-pink-300 dark:border-pink-700",
    },
    {
      bg: "bg-orange-50 dark:bg-orange-900/20",
      text: "text-orange-700 dark:text-orange-400",
      border: "border-orange-300 dark:border-orange-700",
    },
    {
      bg: "bg-teal-50 dark:bg-teal-900/20",
      text: "text-teal-700 dark:text-teal-400",
      border: "border-teal-300 dark:border-teal-700",
    },
    {
      bg: "bg-indigo-50 dark:bg-indigo-900/20",
      text: "text-indigo-700 dark:text-indigo-400",
      border: "border-indigo-300 dark:border-indigo-700",
    },
    {
      bg: "bg-cyan-50 dark:bg-cyan-900/20",
      text: "text-cyan-700 dark:text-cyan-400",
      border: "border-cyan-300 dark:border-cyan-700",
    },
    {
      bg: "bg-emerald-50 dark:bg-emerald-900/20",
      text: "text-emerald-700 dark:text-emerald-400",
      border: "border-emerald-300 dark:border-emerald-700",
    },
  ]

  // Use the plan code to consistently pick a color
  const hash = planCode.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)
  const colorIndex = hash % colors.length

  return colors[colorIndex]
}

export const getColumns = ({
  onEdit,
  onDelete,
  onToggleStatus,
  isSuperAdmin,
}: ColumnsProps): ColumnDef<PricingPlanType>[] => {
  const columns: ColumnDef<PricingPlanType>[] = [
    {
      accessorKey: "planNameFr",
      header: "Nom du plan",
      cell: ({ row }) => {
        const plan = row.original
        return (
          <div className="flex flex-col">
            <span className="font-medium">{plan.planNameFr}</span>
            <span className="text-xs text-muted-foreground">
              {plan.planNameEn}
            </span>
          </div>
        )
      },
    },
    {
      accessorKey: "descriptionFr",
      header: "Description",
      cell: ({ row }) => {
        const plan = row.original
        return (
          <div className="flex flex-col max-w-xs">
            <span className="text-sm truncate">{plan.descriptionFr}</span>
            <span className="text-xs text-muted-foreground truncate">
              {plan.descriptionEn}
            </span>
          </div>
        )
      },
    },
    {
      accessorKey: "planCode",
      header: "Code",
      cell: ({ row }) => {
        const planCode = row.original.planCode
        const colors = getPlanCodeColor(planCode)

        return (
          <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md border border-dashed ${colors.border} ${colors.bg}`}>
            <span className={`font-mono text-xs font-medium ${colors.text}`}>
              {planCode}
            </span>
          </div>
        )
      },
    },
    {
      accessorKey: "smsRange",
      header: "Plage SMS",
      cell: ({ row }) => {
        const plan = row.original
        return (
          <div className="text-sm">
            <span className="font-mono">{plan.minSMS.toLocaleString()}</span>
            <span className="mx-1 text-muted-foreground">-</span>
            <span className="font-mono">{plan.maxSMS.toLocaleString()}</span>
          </div>
        )
      },
    },
    {
      accessorKey: "smsUnitPrice",
      header: "Prix unitaire",
      cell: ({ row }) => (
        <span className="font-mono font-semibold">
          {row.original.smsUnitPrice} FCFA
        </span>
      ),
    },
    {
      accessorKey: "nbDaysToExpired",
      header: "Validité",
      cell: ({ row }) => (
        <span className="text-sm">
          {row.original.nbDaysToExpired} jours
        </span>
      ),
    },
    {
      accessorKey: "active",
      header: "Statut",
      cell: ({ row }) => {
        const isActive = row.original.active
        return (
          <Badge
            variant={isActive ? "default" : "secondary"}
            className={
              isActive
                ? "bg-green-100 text-green-800 border-green-200"
                : "bg-gray-100 text-gray-800 border-gray-200"
            }
          >
            {isActive ? (
              <span className="flex items-center gap-1">
                <TickCircle color="currentColor" variant="Bulk" size={12} />
                Actif
              </span>
            ) : (
              <span className="flex items-center gap-1">
                <CloseCircle color="currentColor" variant="Bulk" size={12} />
                Inactif
              </span>
            )}
          </Badge>
        )
      },
    },
    {
      accessorKey: "createdAt",
      header: "Créé le",
      cell: ({ row }) => {
        const date = new Date(row.original.createdAt)
        return (
          <div className="text-sm">
            <span className="text-sm">
              {format(date, "dd MMM yyyy", { locale: fr })}
            </span>
            <span className="text-xs text-muted-foreground ml-2">
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
        const plan = row.original
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <More color="currentColor" variant="Bulk" size={16} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem
                onClick={() => onEdit(plan)}
                className="cursor-pointer"
              >
                <Edit color="currentColor" size={16} className="mr-2 text-blue-600" />
                Modifier
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => onToggleStatus(plan)}
                className="cursor-pointer"
              >
                {plan.active ? (
                  <>
                    <ToggleOff color="currentColor" size={16} className="mr-2 text-orange-600" />
                    Désactiver
                  </>
                ) : (
                  <>
                    <ToggleOn color="currentColor" size={16} className="mr-2 text-green-600" />
                    Activer
                  </>
                )}
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => onDelete(plan)}
                className="cursor-pointer text-destructive focus:text-destructive"
              >
                <Trash color="currentColor" size={16} className="mr-2" />
                Supprimer
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )
      },
    })
  }

  return columns
}
