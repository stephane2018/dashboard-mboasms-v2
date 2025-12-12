"use client"

import { useState, useMemo } from "react"
import { toast } from "sonner"
import { useUserStore } from "@/core/stores/userStore"
import { getAllRecharges } from "@/core/services/recharge.service"
import { getActivePlans } from "@/core/services/pricing.service"
import type { RechargeListContentType, RechargePageType } from "@/core/models/recharges"
import type { PricingPlanType } from "@/core/models/pricing"
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
import { useQuery } from "@tanstack/react-query"
import { useRecharge } from "@/core/hooks/useRecharge"

export default function RechargePage() {
  const { user, isSuperAdmin } = useUserStore()
  const { createRechargeMutation, validateRechargeMutation, refuseRechargeMutation, creditAccountMutation } =
    useRecharge()

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

  // Fetch recharges
  const { data: rechargesData, isLoading: isLoadingRecharges } = useQuery<RechargePageType>({
    queryKey: ["recharges"],
    queryFn: getAllRecharges,
    enabled: isSuperAdmin(),
  })
  console.log(rechargesData);

  // Fetch active pricing plans
  const { data: activePlansData, isLoading: isLoadingPlans } = useQuery<PricingPlanType[]>({
    queryKey: ["pricing-plans", "active"],
    queryFn: async () => {
      const response = await getActivePlans()
      return response
    },
  })

  const allRecharges = rechargesData?.content || []
  const totalElements = rechargesData?.totalElements || 0

  // Filter recharges based on search term and filters
  const filteredRecharges = useMemo(() => {
    let filtered = allRecharges

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
  }, [allRecharges, searchTerm, filters])

  const displayedElements = filteredRecharges.length

  // Calculate statistics
  const statistics = useMemo(() => {
    if (!allRecharges) {
      return {
        totalRecharges: 0,
        pendingRecharges: 0,
        validatedRecharges: 0,
        refusedRecharges: 0,
        totalAmount: 0,
      }
    }

    const pending = allRecharges.filter((r) => r.status === "DEMANDE").length
    const validated = allRecharges.filter((r) => r.status === "VALIDATED").length
    const refused = allRecharges.filter((r) => r.status === "REFUSED").length
    const totalAmount = allRecharges.reduce(
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
  }, [allRecharges, totalElements])

  // Handlers
  const handleCreateRecharge = async (data: RechargeFormData) => {
    if (!user?.companyId) {
      toast.error("Erreur", {
        description: "Impossible de créer la recharge. ID entreprise manquant.",
      })
      return
    }

    await createRechargeMutation.mutateAsync({
      qteMessage: data.qteMessage,
      enterpriseId: user.companyId,
      paymentMethod: data.paymentMethod,
      debitPhoneNumber: data.debitPhoneNumber,
      debitBankAccountNumber: data.debitBankAccountNumber,
      couponCode: data.couponCode,
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
        isSuperAdmin: isSuperAdmin(),
      }),
    [isSuperAdmin]
  )

  // Redirect if not super admin
  if (!isSuperAdmin()) {
    return (
      <div className="flex flex-col items-center justify-center h-[calc(100vh-200px)] gap-4">
        <h1 className="text-2xl font-bold text-muted-foreground">Accès refusé</h1>
        <p className="text-muted-foreground">Cette page est réservée aux super administrateurs.</p>
      </div>
    )
  }

  const isLoading = isLoadingRecharges || isLoadingPlans

  return (
    <div className="flex flex-col gap-6 p-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Gestion des recharges</h1>
          <p className="text-muted-foreground">
            Gérer les demandes de recharge et créditer les comptes
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
            Faire une recharge
          </Button>
        </div>
      </div>

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
              placeholder="Rechercher par entreprise, téléphone, méthode..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="h-9 w-[200px] pl-9 sm:w-[350px]"
            />
          </div>
          {searchTerm && (
            <span className="text-xs text-muted-foreground whitespace-nowrap">
              {displayedElements} résultat{displayedElements !== 1 ? "s" : ""}
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
      />

      {/* Create Recharge Modal */}
      <CreateRechargeModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreateRecharge}
        activePlans={activePlansData || []}
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
