"use client"

import { useState, useMemo } from "react"
import { toast } from "sonner"
import { useAuth } from "@/core/hooks/useAuth"
import type { RechargeListContentType } from "@/core/models/recharges"
import { DataTable } from "@/shared/common/data-table/table"
import { Button } from "@/shared/ui/button"
import { Input } from "@/shared/ui/input"
import { SearchNormal1, Add } from "iconsax-react"
import { RechargeStatistics } from "./_components/recharge-statistics"
import { StatisticsSkeleton } from "./_components/statistics-skeleton"
import { getColumns } from "./_components/recharge-table-columns"
import { RechargeFilters, type RechargeFilters as RechargeFiltersType } from "./_components/recharge-filters"
import { CreateRechargeModal, type RechargeFormData } from "@/shared/common/create-recharge-modal"
import { ValidateRechargeModal, RefuseRechargeModal, CreditAccountModal } from "./_components/recharge-action-modals"
import { useRecharge } from "@/core/hooks/useRecharge"
import { useT } from "@/core/hooks"
import { RechargeGuideModal, RechargeSupportBanner } from "./_components/recharge-guide-modal"
import type { PaginationState } from "@tanstack/react-table"

const DEFAULT_PAGE_SIZE = 10

export default function RechargePage() {
  const { user, isSuperAdmin } = useAuth()
  const { t } = useT()
  const _isSuperAdmin = user?.role === "SUPER_ADMIN"
  const _isAdminUser = user?.role === "ADMIN_USER"
  const _isAdmin = _isSuperAdmin || _isAdminUser

  // Pagination state
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: DEFAULT_PAGE_SIZE,
  })

  // Use recharge with pagination params
  const {
    rechargesQuery,
    createRechargeMutation,
    validateRechargeMutation,
    refuseRechargeMutation,
    creditAccountMutation,
  } = useRecharge({}, pagination.pageIndex, pagination.pageSize)

  const [searchTerm, setSearchTerm] = useState("")
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [isValidateModalOpen, setIsValidateModalOpen] = useState(false)
  const [isRefuseModalOpen, setIsRefuseModalOpen] = useState(false)
  const [isCreditModalOpen, setIsCreditModalOpen] = useState(false)
  const [selectedRecharge, setSelectedRecharge] = useState<RechargeListContentType | null>(null)
  const [filters, setFilters] = useState<RechargeFiltersType>({
    paymentMethod: "all",
    status: "all",
    startDate: undefined,
    endDate: undefined,
  })

  // Get data from current page
  const currentPageRecharges = rechargesQuery.data?.content || []
  const isLoadingRecharges = rechargesQuery.isLoading
  const totalElements = rechargesQuery.data?.totalElements || 0

  // Filter recharges based on search term and filters (client-side on current page)
  const filteredRecharges = useMemo(() => {
    let filtered = currentPageRecharges.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

    // Apply search term filter
    if (searchTerm) {
      const lowerSearch = searchTerm.toLowerCase()
      filtered = filtered.filter((recharge) => {
        const enterpriseName = recharge.enterprise?.socialRaison?.toLowerCase() || ""
        const phoneNumber = recharge.debitPhoneNumber?.toLowerCase() || ""
        const paymentMethod = recharge.paymentMethod?.toLowerCase() || ""
        const status = recharge.status?.toLowerCase() || ""

        return (
          enterpriseName.includes(lowerSearch) ||
          phoneNumber.includes(lowerSearch) ||
          paymentMethod.includes(lowerSearch) ||
          status.includes(lowerSearch)
        )
      })
    }

    // Apply payment method filter
    if (filters.paymentMethod !== "all") {
      filtered = filtered.filter((r) => r.paymentMethod === filters.paymentMethod)
    }

    // Apply status filter
    if (filters.status !== "all") {
      filtered = filtered.filter((r) => r.status === filters.status)
    }

    // Apply date range filter
    if (filters.startDate) {
      const startOfDay = new Date(filters.startDate)
      startOfDay.setHours(0, 0, 0, 0)
      filtered = filtered.filter((r) => new Date(r.createdAt) >= startOfDay)
    }

    if (filters.endDate) {
      const endOfDay = new Date(filters.endDate)
      endOfDay.setHours(23, 59, 59, 999)
      filtered = filtered.filter((r) => new Date(r.createdAt) <= endOfDay)
    }

    return filtered
  }, [currentPageRecharges, searchTerm, filters])

  const displayedElements = filteredRecharges.length

  // Calculate statistics from all data
  const statistics = useMemo(() => {
    if (!currentPageRecharges) {
      return {
        totalRecharges: 0,
        pendingRecharges: 0,
        validatedRecharges: 0,
        refusedRecharges: 0,
        totalAmount: 0,
      }
    }

    const pending = currentPageRecharges.filter((r) => r.status === "DEMANDE").length
    const validated = currentPageRecharges.filter((r) => r.status === "VALIDATED").length
    const refused = currentPageRecharges.filter((r) => r.status === "REFUSED").length
    const totalAmount = currentPageRecharges.reduce(
      (sum, r) => sum + (r.qteMessage * r.messagePriceUnit),
      0
    )

    return {
      totalRecharges: totalElements,
      pendingRecharges: pending,
      validatedRecharges: validated,
      refusedRecharges: refused,
      totalAmount,
    }
  }, [currentPageRecharges, totalElements])

  // Handlers
  const handleCreateRecharge = async (data: RechargeFormData) => {
    if (!user?.companyId) {
      toast.error(t('common.error'), {
        description: t('recharge.rechargeError'),
      })
      return
    }

    await createRechargeMutation.mutateAsync({
      ...(data.rechargeType === "international" && { amount: data.amount }),
      ...(data.rechargeType !== "international" && { qteMessage: data.qteMessage, couponCode: data.couponCode }),
      enterpriseId: user.companyId,
      paymentMethod: data.paymentMethod,
      debitPhoneNumber: data.debitPhoneNumber,
      debitBankAccountNumber: data.debitBankAccountNumber,
      rechargeType: data.rechargeType,
    })
  }

  const handleValidateRecharge = (recharge: RechargeListContentType) => {
    setSelectedRecharge(recharge)
    setIsValidateModalOpen(true)
  }

  const handleRefuseRecharge = (recharge: RechargeListContentType) => {
    setSelectedRecharge(recharge)
    setIsRefuseModalOpen(true)
  }

  const handleCreditAccount = (recharge: RechargeListContentType) => {
    setSelectedRecharge(recharge)
    setIsCreditModalOpen(true)
  }

  const confirmValidate = () => {
    if (selectedRecharge) {
      validateRechargeMutation.mutate(selectedRecharge.id, {
        onSuccess: () => {
          setIsValidateModalOpen(false)
          setSelectedRecharge(null)
        },
      })
    }
  }

  const confirmRefuse = () => {
    if (selectedRecharge) {
      refuseRechargeMutation.mutate(selectedRecharge.id, {
        onSuccess: () => {
          setIsRefuseModalOpen(false)
          setSelectedRecharge(null)
        },
      })
    }
  }

  const confirmCredit = () => {
    if (selectedRecharge && selectedRecharge.enterprise?.id) {
      creditAccountMutation.mutate(
        {
          enterpriseId: selectedRecharge.enterprise.id,
          qteMessage: selectedRecharge.qteMessage,
        },
        {
          onSuccess: () => {
            setIsCreditModalOpen(false)
            setSelectedRecharge(null)
          },
        }
      )
    }
  }

  const handleResetFilters = () => {
    setFilters({
      paymentMethod: "all",
      status: "all",
      startDate: undefined,
      endDate: undefined,
    })
  }

  const columns = useMemo(
    () =>
      getColumns({
        onValidate: handleValidateRecharge,
        onRefuse: handleRefuseRecharge,
        onCredit: handleCreditAccount,
        isSuperAdmin: isSuperAdmin,
        t,
      }),
    [isSuperAdmin, t]
  )

  // Redirect if not super admin or admin user
  if (!_isSuperAdmin && user?.role !== "ADMIN_USER") {
    return (
      <div className="flex flex-col items-center justify-center h-[calc(100vh-200px)] gap-4">
        <h1 className="text-2xl font-bold text-muted-foreground">{t('common.error')}</h1>
        <p className="text-muted-foreground">{t('common.error')}</p>
      </div>
    )
  }

  const isLoading = isLoadingRecharges 

  return (
    <div className="flex flex-col gap-6 p-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            {_isAdmin ? t('recharge.title') : t('recharge.titleUser')}
          </h1>
          <p className="text-muted-foreground">
            {_isAdmin
              ? t('recharge.subtitle')
              : t('recharge.subtitleUser')}
          </p>
        </div>
        <div className="flex items-center gap-3">
          {/* Create Recharge Button */}
          <Button onClick={() => setIsCreateModalOpen(true)} size="sm" className="h-9">
            <Add
              size={16}
              variant="Bulk"
              color="currentColor"
              className="mr-2"
            />
            {t('recharge.createRecharge')}
          </Button>
        </div>
      </div>

      {/* Support contacts */}
      <RechargeSupportBanner />

      {/* Statistics */}
      {isLoading ? (
        <StatisticsSkeleton />
      ) : (
        <RechargeStatistics
          totalRecharges={statistics.totalRecharges}
          pendingRecharges={statistics.pendingRecharges}
          validatedRecharges={statistics.validatedRecharges}
          refusedRecharges={statistics.refusedRecharges}
          totalAmount={statistics.totalAmount}
        />
      )}

      {/* Filters */}
      <RechargeFilters
        filters={filters}
        onFiltersChange={setFilters}
        onReset={handleResetFilters}
      />

      {/* Search */}
      <div className="flex items-center justify-between gap-3">
        <div className="relative flex items-center gap-2">
          <div className="relative flex-1">
            <SearchNormal1
              size={16}
              variant="Bulk"
              color="currentColor"
              className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
            />
            <Input
              placeholder={t('recharge.searchPlaceholder')}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="h-9 w-[200px] pl-9 sm:w-[350px]"
            />
          </div>
          {searchTerm && (
            <span className="text-xs text-muted-foreground whitespace-nowrap">
              {displayedElements} {t('common.results')}
            </span>
          )}
        </div>
      </div>

      {/* Data Table */}
      <DataTable
        data={filteredRecharges}
        rowCount={totalElements}
        columns={columns}
        isLoading={isLoading}
        enablePagination={true}
        enableColumnFilter={false}
        rowSelectable={false}
        onPaginationChange={setPagination}
        initialState={{ pagination }}
      />

      {/* Create Recharge Modal */}
      <CreateRechargeModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreateRecharge}
        isLoading={createRechargeMutation.isPending}
      />

      {/* Validate Recharge Modal */}
      <ValidateRechargeModal
        isOpen={isValidateModalOpen}
        onClose={() => {
          setIsValidateModalOpen(false)
          setSelectedRecharge(null)
        }}
        onConfirm={confirmValidate}
        recharge={selectedRecharge}
        isLoading={validateRechargeMutation.isPending}
      />

      {/* Refuse Recharge Modal */}
      <RefuseRechargeModal
        isOpen={isRefuseModalOpen}
        onClose={() => {
          setIsRefuseModalOpen(false)
          setSelectedRecharge(null)
        }}
        onConfirm={confirmRefuse}
        recharge={selectedRecharge}
        isLoading={refuseRechargeMutation.isPending}
      />

      {/* Recharge Guide Modal */}
      <RechargeGuideModal />

      {/* Credit Account Modal */}
      <CreditAccountModal
        isOpen={isCreditModalOpen}
        onClose={() => {
          setIsCreditModalOpen(false)
          setSelectedRecharge(null)
        }}
        onConfirm={confirmCredit}
        recharge={selectedRecharge}
        isLoading={creditAccountMutation.isPending}
      />
    </div>
  )
}
