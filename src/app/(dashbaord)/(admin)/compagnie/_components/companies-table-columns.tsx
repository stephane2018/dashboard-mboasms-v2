"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Button } from "@/shared/ui/button"
import { Badge } from "@/shared/ui/badge"
import { More, UserAdd, Wallet, Trash, Eye } from "iconsax-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/shared/ui/dropdown-menu"
import type { EnterpriseType } from "@/core/models/company"
import { useRouter } from "next/navigation"

interface CompaniesTableColumnsProps {
  onAddUser: (company: EnterpriseType) => void
  onCredit: (company: EnterpriseType) => void
  onDelete: (company: EnterpriseType) => void
}

export function getColumnsWithRouter(
  { onAddUser, onCredit, onDelete }: CompaniesTableColumnsProps,
  router: ReturnType<typeof useRouter>
): ColumnDef<EnterpriseType>[] {
  return [
    {
      accessorKey: "socialRaison",
      header: "Raison sociale",
      cell: ({ row }) => (
        <div className="font-medium">{row.getValue("socialRaison") || "—"}</div>
      ),
    },
    {
      accessorKey: "emailEnterprise",
      header: "Email",
      cell: ({ row }) => (
        <div className="text-sm text-muted-foreground">{row.getValue("emailEnterprise") || "—"}</div>
      ),
    },
    {
      accessorKey: "telephoneEnterprise",
      header: "Téléphone",
      cell: ({ row }) => (
        <div className="text-sm">{row.getValue("telephoneEnterprise") || "—"}</div>
      ),
    },
    {
      accessorKey: "villeEnterprise",
      header: "Ville",
      cell: ({ row }) => (
        <div className="text-sm">{row.getValue("villeEnterprise") || "—"}</div>
      ),
    },
    {
      accessorKey: "smsCredit",
      header: "Crédit SMS",
      cell: ({ row }) => {
        const credit = row.getValue("smsCredit") as number
        return (
          <Badge variant={credit > 0 ? "default" : "destructive"}>
            {credit ?? 0} SMS
          </Badge>
        )
      },
    },
    {
      accessorKey: "user",
      header: "Utilisateurs",
      cell: ({ row }) => {
        const users = row.getValue("user") as string[] | undefined
        return <div className="text-sm">{users?.length ?? 0}</div>
      },
    },
    {
      header: "Actions",
      id: "actions",
      enableHiding: false,
      cell: ({ row }) => {
        const company = row.original

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Ouvrir le menu</span>
                <More className="h-4 w-4 " variant="Bulk" color="currentColor" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem onClick={() => router.push(`/compagnie/${company.id}`)}>
                <Eye className="mr-2 h-4 w-4 text-primary" variant="Bulk" color="currentColor" />
                Voir détails
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => onAddUser(company)}>
                <UserAdd className="mr-2 h-4 w-4 text-primary" variant="Bulk" color="currentColor" />
                Ajouter un utilisateur
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onCredit(company)}>
                <Wallet className="mr-2 h-4 w-4 text-primary" variant="Bulk" color="currentColor" />
                Ajouter du crédit
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => onDelete(company)} className="text-red-600">
                <Trash className="mr-2 h-4 w-4 text-red-600" variant="Bulk" color="currentColor" />
                Supprimer
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )
      },
    },
  ]
}

export function getColumns(props: CompaniesTableColumnsProps): ColumnDef<EnterpriseType>[] {
  const router = useRouter()
  return getColumnsWithRouter(props, router)
}
