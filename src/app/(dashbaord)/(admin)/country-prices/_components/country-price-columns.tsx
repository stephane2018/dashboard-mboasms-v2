"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Button } from "@/shared/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/shared/ui/dropdown-menu"
import { Edit, Trash, More } from "iconsax-react"
import type { SmsCountryPriceType } from "@/core/models/sms-country-price"
import { format } from "date-fns"
import { fr } from "date-fns/locale"

function countryCodeToFlag(code: string): string {
  const codePoints = code
    .toUpperCase()
    .split("")
    .map((c) => 0x1f1e6 + c.charCodeAt(0) - 65)
  return String.fromCodePoint(...codePoints)
}

interface ColumnsProps {
  onEdit: (price: SmsCountryPriceType) => void
  onDelete: (price: SmsCountryPriceType) => void
  isSuperAdmin: boolean
}

export const getColumns = ({
  onEdit,
  onDelete,
  isSuperAdmin,
}: ColumnsProps): ColumnDef<SmsCountryPriceType>[] => {
  const columns: ColumnDef<SmsCountryPriceType>[] = [
    {
      accessorKey: "countryName",
      header: "Pays",
      cell: ({ row }) => {
        const price = row.original
        return (
          <div className="flex items-center gap-3">
            <span className="text-2xl">{countryCodeToFlag(price.countryCode)}</span>
            <div className="flex flex-col">
              <span className="font-medium">{price.countryName}</span>
              <span className="text-xs text-muted-foreground">{price.countryCode}</span>
            </div>
          </div>
        )
      },
    },
    {
      accessorKey: "countryCode",
      header: "Code pays",
      cell: ({ row }) => (
        <div className="inline-flex items-center px-2.5 py-1 rounded-md border border-dashed border-blue-300 dark:border-blue-700 bg-blue-50 dark:bg-blue-900/20">
          <span className="font-mono text-xs font-medium text-blue-700 dark:text-blue-400">
            {row.original.countryCode}
          </span>
        </div>
      ),
    },
    {
      accessorKey: "pricePerSms",
      header: "Prix par SMS",
      cell: ({ row }) => (
        <span className="font-mono font-semibold text-primary">
          {row.original.pricePerSms} FCFA
        </span>
      ),
    },
    {
      accessorKey: "createdAt",
      header: "Créé le",
      cell: ({ row }) => {
        const date = new Date(row.original.createdAt)
        return (
          <div className="text-sm">
            <span>{format(date, "dd MMM yyyy", { locale: fr })}</span>
            <span className="text-xs text-muted-foreground ml-2">
              {format(date, "HH:mm", { locale: fr })}
            </span>
          </div>
        )
      },
    },
    {
      accessorKey: "updatedAt",
      header: "Modifié le",
      cell: ({ row }) => {
        const date = new Date(row.original.updatedAt)
        return (
          <div className="text-sm">
            <span>{format(date, "dd MMM yyyy", { locale: fr })}</span>
            <span className="text-xs text-muted-foreground ml-2">
              {format(date, "HH:mm", { locale: fr })}
            </span>
          </div>
        )
      },
    },
  ]

  if (isSuperAdmin) {
    columns.push({
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const price = row.original
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <More color="currentColor" variant="Bulk" size={16} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem
                onClick={() => onEdit(price)}
                className="cursor-pointer"
              >
                <Edit color="currentColor" size={16} className="mr-2 text-blue-600" />
                Modifier
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => onDelete(price)}
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
