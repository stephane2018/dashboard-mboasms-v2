"use client"

import { useState, useMemo } from "react"
import type { PaginationState } from "@tanstack/react-table"
import { DataTable } from "@/shared/common/data-table/table"
import { ConfirmDialog } from "@/shared/common/confirm-dialog"
import { Button } from "@/shared/ui/button"
import { Input } from "@/shared/ui/input"
import { Skeleton } from "@/shared/ui/skeleton"
import { toast } from "sonner"
import { SearchNormal1, Building, UserAdd, Trash, Wallet } from "iconsax-react"
import {
  useCompaniesPaginated,
  useDeleteCompany,
  useAddUserToEnterprise,
  useDeleteUserFromEnterprise,
  useCreditEnterprise,
  useBlockUser,
  useUnblockUser,
} from "@/core/hooks/useCompany"
import { useT } from "@/core/hooks"
import type { EnterpriseType } from "@/core/models/company"

import { getColumns } from "./_components/companies-table-columns"

import { CompanyFormModal } from "./_components/company-form-modal"
import { AddUserModal } from "./_components/add-user-modal"
import { CreditModal } from "./_components/credit-modal"

export default function CompagniePage() {
  const { t } = useT()
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  })

  const [searchTerm, setSearchTerm] = useState("")
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false)
  const [isCreditModalOpen, setIsCreditModalOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [companyToDelete, setCompanyToDelete] = useState<EnterpriseType | null>(null)
  const [selectedCompany, setSelectedCompany] = useState<EnterpriseType | null>(null)
  const [isBlockDialogOpen, setIsBlockDialogOpen] = useState(false)
  const [isUnblockDialogOpen, setIsUnblockDialogOpen] = useState(false)
  const [companyToToggle, setCompanyToToggle] = useState<EnterpriseType | null>(null)

  const { data, isLoading, refetch } = useCompaniesPaginated(pagination.pageIndex, pagination.pageSize)
  const { mutate: deleteCompany, isPending: isDeleting } = useDeleteCompany()
  const { mutate: addUser, isPending: isAddingUser } = useAddUserToEnterprise()
  const { mutate: deleteUser, isPending: isRemovingUser } = useDeleteUserFromEnterprise()
  const { mutate: creditEnterprise, isPending: isCrediting } = useCreditEnterprise()
  const { mutate: blockUser, isPending: isBlocking } = useBlockUser()
  const { mutate: unblockUser, isPending: isUnblocking } = useUnblockUser()

  const companies = data || []
  const totalElements = data?.length || 0

  const filteredCompanies = useMemo(() => {
    if (!searchTerm.trim()) return companies
    const lower = searchTerm.toLowerCase()
    return companies.filter(
      (c) =>
        c.socialRaison?.toLowerCase().includes(lower) ||
        c.emailEnterprise?.toLowerCase().includes(lower) ||
        c.telephoneEnterprise?.toLowerCase().includes(lower) ||
        c.villeEnterprise?.toLowerCase().includes(lower)
    )
  }, [companies, searchTerm])

  const handleCreateCompany = () => {
    setSelectedCompany(null)
    setIsCreateModalOpen(true)
  }

  const handleAddUser = (company: EnterpriseType) => {
    setSelectedCompany(company)
    setIsAddUserModalOpen(true)
  }

  const handleCredit = (company: EnterpriseType) => {
    setSelectedCompany(company)
    setIsCreditModalOpen(true)
  }

  const handleDeleteCompany = (company: EnterpriseType) => {
    setCompanyToDelete(company)
    setIsDeleteDialogOpen(true)
  }

  const confirmDelete = () => {
    if (!companyToDelete) return
    deleteCompany(companyToDelete.id, {
      onSuccess: () => {
        setIsDeleteDialogOpen(false)
        setCompanyToDelete(null)
      },
    })
  }

  const handleBlock = (company: EnterpriseType) => {
    setCompanyToToggle(company)
    setIsBlockDialogOpen(true)
  }

  const handleUnblock = (company: EnterpriseType) => {
    setCompanyToToggle(company)
    setIsUnblockDialogOpen(true)
  }

  const confirmBlock = () => {
    if (!companyToToggle) return
    const firstUser = companyToToggle.user?.[0]
    const userId = typeof firstUser === 'string' ? firstUser : (firstUser as any)?.id
    if (!userId) {
      toast.error(t('companies.blockError'))
      return
    }
    blockUser(userId, {
      onSuccess: () => {
        toast.success(t('companies.blockSuccess'))
        setIsBlockDialogOpen(false)
        setCompanyToToggle(null)
        refetch()
      },
      onError: () => {
        toast.error(t('companies.blockError'))
      },
    })
  }

  const confirmUnblock = () => {
    if (!companyToToggle) return
    const firstUser = companyToToggle.user?.[0]
    const userId = typeof firstUser === 'string' ? firstUser : (firstUser as any)?.id
    if (!userId) {
      toast.error(t('companies.unblockError'))
      return
    }
    unblockUser(userId, {
      onSuccess: () => {
        toast.success(t('companies.unblockSuccess'))
        setIsUnblockDialogOpen(false)
        setCompanyToToggle(null)
        refetch()
      },
      onError: () => {
        toast.error(t('companies.unblockError'))
      },
    })
  }

  const handleAddUserSubmit = (userData: any) => {
    if (!selectedCompany) return
    addUser(
      { enterpriseId: selectedCompany.id, user: userData },
      {
        onSuccess: () => {
          setIsAddUserModalOpen(false)
          setSelectedCompany(null)
        },
      }
    )
  }

  const handleCreditSubmit = (payload: { qteMessage: number }) => {
    if (!selectedCompany) return
    creditEnterprise(
      { enterpriseId: selectedCompany.id, payload },
      {
        onSuccess: () => {
          setIsCreditModalOpen(false)
          setSelectedCompany(null)
        },
      }
    )
  }

  const columns = useMemo(
    () =>
      getColumns(
        { onAddUser: handleAddUser, onCredit: handleCredit, onDelete: handleDeleteCompany, onBlock: handleBlock, onUnblock: handleUnblock },
        t
      ),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  )

  if (isLoading && !companies.length) {
    return (
      <div className="space-y-4 p-6">
        <div className="flex items-center justify-between">
          <div>
            <Skeleton className="h-8 w-48 mb-2" />
            <Skeleton className="h-4 w-64" />
          </div>
          <Skeleton className="h-9 w-32" />
        </div>
        <div className="space-y-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-12 w-full" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6 p-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{t('companies.title')}</h1>
          <p className="text-muted-foreground">{t('companies.subtitle')}</p>
        </div>
        <Button onClick={handleCreateCompany} size="sm" className="h-9">
          <Building size={16} variant="Bulk" color="currentColor" className="mr-2" />
          {t('companies.newCompany')}
        </Button>
      </div>

      {/* Search */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-sm">
          <SearchNormal1
            size={16}
            variant="Bulk"
            color="currentColor"
            className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
          />
          <Input
            placeholder={t('companies.searchPlaceholder')}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9"
          />
        </div>
        {searchTerm && (
          <span className="text-xs text-muted-foreground">
            {filteredCompanies.length} {t('common.results')}
          </span>
        )}
      </div>

      {/* Data Table */}
      <DataTable
        data={filteredCompanies}
        rowCount={totalElements}
        columns={columns}
        isLoading={isLoading}
        enablePagination={true}
        onPaginationChange={setPagination}
        initialState={{ pagination }}
      />

      {/* Create/Edit Modal */}
      <CompanyFormModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        company={selectedCompany}
        onSuccess={() => {
          setIsCreateModalOpen(false)
          setSelectedCompany(null)
          refetch()
        }}
      />

      {/* Add User Modal */}
      <AddUserModal
        isOpen={isAddUserModalOpen}
        onClose={() => setIsAddUserModalOpen(false)}
        onSubmit={handleAddUserSubmit}
        isSubmitting={isAddingUser}
      />

      {/* Credit Modal */}
      <CreditModal
        isOpen={isCreditModalOpen}
        onClose={() => setIsCreditModalOpen(false)}
        onSubmit={handleCreditSubmit}
        isSubmitting={isCrediting}
        currentCredit={selectedCompany?.smsCredit || 0}
      />

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={isDeleteDialogOpen}
        isLoading={isDeleting}
        onDismiss={() => setIsDeleteDialogOpen(false)}
        onAction={confirmDelete}
        messages={{
          title: t('companies.deleteCompany'),
          description: <>{t('companies.deleteConfirm', { name: companyToDelete?.socialRaison })}</>,
          buttons: {
            cancel: t('common.cancel'),
            action: t('common.delete'),
          },
        }}
      />

      {/* Block Confirmation */}
      <ConfirmDialog
        isOpen={isBlockDialogOpen}
        isLoading={isBlocking}
        onDismiss={() => { setIsBlockDialogOpen(false); setCompanyToToggle(null) }}
        onAction={confirmBlock}
        messages={{
          title: t('companies.blockTitle'),
          description: <>{t('companies.blockConfirm', { name: companyToToggle?.socialRaison })}</>,
          buttons: {
            cancel: t('common.cancel'),
            action: t('companies.block'),
          },
        }}
      />

      {/* Unblock Confirmation */}
      <ConfirmDialog
        isOpen={isUnblockDialogOpen}
        isLoading={isUnblocking}
        onDismiss={() => { setIsUnblockDialogOpen(false); setCompanyToToggle(null) }}
        onAction={confirmUnblock}
        messages={{
          title: t('companies.unblockTitle'),
          description: <>{t('companies.unblockConfirm', { name: companyToToggle?.socialRaison })}</>,
          buttons: {
            cancel: t('common.cancel'),
            action: t('companies.unblock'),
          },
        }}
      />
    </div>
  )
}
