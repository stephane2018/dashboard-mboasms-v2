"use client"

import { useState } from "react"
import { toast } from "sonner"
import { DataTable } from "@/shared/common/data-table/table"
import { Button } from "@/shared/ui/button"
import { WalletMoney, Add } from "iconsax-react"
import { useAuthContext } from "@/core/providers"
import { useEnterpriseRecharges } from "@/core/hooks/useRecharge"
import { useT } from "@/core/hooks"
import { CreateRechargeModal, type RechargeFormData } from "@/shared/common/create-recharge-modal"
import { createClientRechargeColumns } from "./_components/client-recharge-columns"

export default function RechargesPage() {
  const { user } = useAuthContext()
  const { t } = useT()
  const enterpriseId = user?.companyId || ""

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [currentPage, setCurrentPage] = useState(0)
  const [pageSize, setPageSize] = useState(10)

  const { query, createRechargeMutation } = useEnterpriseRecharges(
    enterpriseId,
    currentPage,
    pageSize,
  )

  const handleCreateRecharge = async (data: RechargeFormData) => {
    if (!enterpriseId) {
      toast.error(t('rechargesPage.errorTitle'), {
        description: t('rechargesPage.errorNoCompanyId'),
      })
      return
    }

    await createRechargeMutation.mutateAsync({
      ...(data.rechargeType === "international" && { amount: data.amount }),
      ...(data.rechargeType !== "international" && { qteMessage: data.qteMessage, couponCode: data.couponCode }),
      enterpriseId,
      paymentMethod: data.paymentMethod,
      debitPhoneNumber: data.debitPhoneNumber,
      debitBankAccountNumber: data.debitBankAccountNumber,
      rechargeType: data.rechargeType,
    })
  }

  const paginationData = query.data || { content: [], totalElements: 0, totalPages: 0, currentPage: 0, pageSize }

  const recharges = (paginationData.content || [])
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

  const columns = createClientRechargeColumns(t)

  const handlePageSizeChange = (newSize: number) => {
    setPageSize(newSize)
    setCurrentPage(0)
  }

  const handlePreviousPage = () => {
    setCurrentPage(prev => Math.max(0, prev - 1))
  }

  const handleNextPage = () => {
    if (currentPage < paginationData.totalPages - 1) {
      setCurrentPage(prev => prev + 1)
    }
  }

  const canGoNext = currentPage < paginationData.totalPages - 1

  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <WalletMoney size="32" variant="Bulk" color="currentColor" className="text-primary" />
            <h1 className="text-3xl font-bold tracking-tight">{t('rechargesPage.title')}</h1>
          </div>
          <p className="text-muted-foreground mt-1">
            {t('rechargesPage.subtitle')}
          </p>
        </div>
        <Button onClick={() => setIsCreateModalOpen(true)} size="sm" className="h-9">
          <Add size={16} variant="Bulk" color="currentColor" className="mr-2" />
          {t('rechargesPage.makeRecharge')}
        </Button>
      </div>

      <DataTable
        data={recharges}
        columns={columns}
        rowCount={recharges.length}
        isLoading={query.isLoading}
        enablePagination={false}
        autoPagination={false}
        emptyMessage={t('rechargesPage.noRechargesFound')}
      />

      <div className="flex items-center justify-between border-t pt-4">
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">
            {t('dataTable.rowsPerPage')}
          </span>
          <select
            value={pageSize}
            onChange={(e) => handlePageSizeChange(Number(e.target.value))}
            className="h-9 px-3 rounded-md border border-input bg-background text-sm"
            disabled={query.isLoading}
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
            <option value={100}>100</option>
          </select>
        </div>

        <div className="flex items-center gap-4">
          <span className="text-sm text-muted-foreground">
            {t('dataTable.page')} {currentPage + 1} {t('dataTable.of')} {Math.max(1, paginationData.totalPages)}
          </span>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handlePreviousPage}
              disabled={currentPage === 0 || query.isLoading}
            >
              {t('dataTable.previous')}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleNextPage}
              disabled={!canGoNext || query.isLoading}
            >
              {t('dataTable.next')}
            </Button>
          </div>
        </div>
      </div>

      <CreateRechargeModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreateRecharge}
        isLoading={createRechargeMutation.isPending}
      />
    </div>
  )
}
