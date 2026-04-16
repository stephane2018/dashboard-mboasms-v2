import { ColumnDef } from "@tanstack/react-table"
import { Button } from "@/shared/ui/button"
import { Badge } from "@/shared/ui/badge"
import { More, UserAdd, Wallet, Trash, Eye, Login, Lock, Unlock } from "iconsax-react"
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
import { useAuth } from "@/core/hooks/useAuth"
import { useLoginAs } from "@/core/hooks/useLogin"
import { useT } from "@/core/hooks"

function ActionsCell({ company, onAddUser, onCredit, onDelete, onBlock, onUnblock }: {
  company: EnterpriseType
  onAddUser: (company: EnterpriseType) => void
  onCredit: (company: EnterpriseType) => void
  onDelete: (company: EnterpriseType) => void
  onBlock: (company: EnterpriseType) => void
  onUnblock: (company: EnterpriseType) => void
}) {
  const router = useRouter()
  const { t } = useT()
  const { user } = useAuth()
  const loginAsMutation = useLoginAs()

  const handleImpersonate = () => {
    if (company.emailEnterprise) {
      loginAsMutation.mutate(company.emailEnterprise)
    }
  }

  const isSameUser = user?.email === company.emailEnterprise
  const isBlocked = !!(company as any).archived

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <span className="sr-only">{t('companies.openMenu')}</span>
          <More className="h-4 w-4" variant="Bulk" color="currentColor" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>{t('common.actions')}</DropdownMenuLabel>
        <DropdownMenuItem onClick={() => router.push(`/compagnie/${company.id}`)}>
          <Eye className="mr-2 h-4 w-4 text-primary" variant="Bulk" color="currentColor" />
          {t('companies.viewDetail')}
        </DropdownMenuItem>
        {!isSameUser && company.emailEnterprise && (
          <DropdownMenuItem
            onClick={handleImpersonate}
            disabled={loginAsMutation.isPending}
          >
            <Login className="mr-2 h-4 w-4 text-primary" variant="Bulk" color="currentColor" />
            {t('companies.loginAs')}
          </DropdownMenuItem>
        )}
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => onAddUser(company)}>
          <UserAdd className="mr-2 h-4 w-4 text-primary" variant="Bulk" color="currentColor" />
          {t('companies.addUser')}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onCredit(company)}>
          <Wallet className="mr-2 h-4 w-4 text-primary" variant="Bulk" color="currentColor" />
          {t('companies.addCredit')}
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        {!isSameUser && (
          isBlocked ? (
            <DropdownMenuItem onClick={() => onUnblock(company)} className="text-emerald-600">
              <Unlock className="mr-2 h-4 w-4" variant="Bulk" color="currentColor" />
              {t('companies.unblock')}
            </DropdownMenuItem>
          ) : (
            <DropdownMenuItem onClick={() => onBlock(company)} className="text-amber-600">
              <Lock className="mr-2 h-4 w-4" variant="Bulk" color="currentColor" />
              {t('companies.block')}
            </DropdownMenuItem>
          )
        )}
        <DropdownMenuItem onClick={() => onDelete(company)} className="text-red-600">
          <Trash className="mr-2 h-4 w-4 text-red-600" variant="Bulk" color="currentColor" />
          {t('common.delete')}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

interface CompaniesTableColumnsProps {
  onAddUser: (company: EnterpriseType) => void
  onCredit: (company: EnterpriseType) => void
  onDelete: (company: EnterpriseType) => void
  onBlock: (company: EnterpriseType) => void
  onUnblock: (company: EnterpriseType) => void
}

export function getColumns(
  { onAddUser, onCredit, onDelete, onBlock, onUnblock }: CompaniesTableColumnsProps,
  t: (key: string) => string
): ColumnDef<EnterpriseType>[] {
  return [
    {
      accessorKey: "socialRaison",
      header: t('companies.socialReason'),
      cell: ({ row }) => {
        const isBlocked = !!(row.original as any).archived
        return (
          <div className="flex items-center gap-2">
            <span className="font-medium">{row.getValue("socialRaison") || "—"}</span>
            {isBlocked && (
              <Badge variant="destructive" className="text-[9px] px-1.5 py-0 h-4">
                {t('companies.blocked')}
              </Badge>
            )}
          </div>
        )
      },
    },
    {
      accessorKey: "emailEnterprise",
      header: t('companies.email'),
      cell: ({ row }) => (
        <div className="text-sm text-muted-foreground">{row.getValue("emailEnterprise") || "—"}</div>
      ),
    },
    {
      accessorKey: "telephoneEnterprise",
      header: t('companies.phone'),
      cell: ({ row }) => (
        <div className="text-sm">{row.getValue("telephoneEnterprise") || "—"}</div>
      ),
    },
    {
      accessorKey: "villeEnterprise",
      header: t('companies.city'),
      cell: ({ row }) => (
        <div className="text-sm">{row.getValue("villeEnterprise") || "—"}</div>
      ),
    },
    {
      accessorKey: "smsCredit",
      header: t('companies.smsCredit'),
      cell: ({ row }) => {
        const credit = row.getValue("smsCredit") as number
        if (credit > 0) {
          return <Badge variant="default">{credit} SMS</Badge>
        }
        return (
          <div className="inline-flex items-center rounded-md border border-dashed border-primary/30 bg-transparent px-2.5 py-0.5 text-xs font-semibold text-foreground">
            {credit ?? 0} SMS
          </div>
        )
      },
    },
    {
      accessorKey: "user",
      header: t('companies.users'),
      cell: ({ row }) => {
        const users = row.getValue("user") as string[] | undefined
        return <div className="text-sm">{users?.length ?? 0}</div>
      },
    },
    {
      header: t('common.actions'),
      id: "actions",
      enableHiding: false,
      cell: ({ row }) => {
        const company = row.original
        return (
          <ActionsCell
            company={company}
            onAddUser={onAddUser}
            onCredit={onCredit}
            onDelete={onDelete}
            onBlock={onBlock}
            onUnblock={onUnblock}
          />
        )
      },
    },
  ]
}
