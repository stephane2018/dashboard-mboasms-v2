"use client"

import { useState, useMemo } from "react"
import { toast } from "sonner"
import { useUserStore } from "@/core/stores/userStore"
import { usePricing } from "@/core/hooks/usePricing"
import type { PricingPlanType } from "@/core/models/pricing"
import { DataTable } from "@/shared/common/data-table/table"
import { Button } from "@/shared/ui/button"
import { Input } from "@/shared/ui/input"
import { Badge } from "@/shared/ui/badge"
import { SearchNormal1, Add, Edit, Trash, ToggleOn, ToggleOff } from "iconsax-react"
import { getColumns } from "./_components/pricing-table-columns"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/shared/ui/alert-dialog"
import { CreatePricingModal } from "./_components/create-pricing-modal"
import { EditPricingModal } from "./_components/edit-pricing-modal"

export default function PricingPage() {
  const { user, isSuperAdmin } = useUserStore()
  const {
    plansQuery,
    createPlanMutation,
    updatePlanMutation,
    deletePlanMutation,
    enablePlanMutation,
    disablePlanMutation,
  } = usePricing({
    queryOptions: {
      enabled: isSuperAdmin(),
    },
  })

  const [searchTerm, setSearchTerm] = useState("")
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [selectedPlan, setSelectedPlan] = useState<PricingPlanType | null>(null)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [planToDelete, setPlanToDelete] = useState<PricingPlanType | null>(null)

  const allPlans = plansQuery.data ?? []
  const isLoadingPlans = plansQuery.isLoading

  // Filter plans based on search term
  const filteredPlans = useMemo(() => {
    if (!searchTerm) return allPlans

    const lowerSearch = searchTerm.toLowerCase()
    return allPlans.filter((plan) => {
      const nameFr = plan.planNameFr?.toLowerCase() || ""
      const nameEn = plan.planNameEn?.toLowerCase() || ""
      const descriptionFr = plan.descriptionFr?.toLowerCase() || ""
      const descriptionEn = plan.descriptionEn?.toLowerCase() || ""
      const code = plan.planCode?.toLowerCase() || ""

      return (
        nameFr.includes(lowerSearch) ||
        nameEn.includes(lowerSearch) ||
        descriptionFr.includes(lowerSearch) ||
        descriptionEn.includes(lowerSearch) ||
        code.includes(lowerSearch)
      )
    })
  }, [allPlans, searchTerm])

  const displayedElements = filteredPlans.length

  // Handlers
  const handleCreatePlan = () => {
    setIsCreateModalOpen(true)
  }

  const handleEditPlan = (plan: PricingPlanType) => {
    setSelectedPlan(plan)
    setIsEditModalOpen(true)
  }

  const handleDeletePlan = (plan: PricingPlanType) => {
    setPlanToDelete(plan)
    setDeleteDialogOpen(true)
  }

  const confirmDelete = () => {
    if (planToDelete) {
      deletePlanMutation.mutate(planToDelete.id, {
        onSuccess: () => {
          setDeleteDialogOpen(false)
          setPlanToDelete(null)
        },
      })
    }
  }

  const handleTogglePlanStatus = (plan: PricingPlanType) => {
    updatePlanMutation.mutate({ 
      id: plan.id, 
      data: { active: !plan.active } 
    })
  }

  const columns = useMemo(
    () =>
      getColumns({
        onEdit: handleEditPlan,
        onDelete: handleDeletePlan,
        onToggleStatus: handleTogglePlanStatus,
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

  return (
    <div className="flex flex-col gap-6 p-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Gestion des plans tarifaires</h1>
          <p className="text-muted-foreground">
            Gérer les plans tarifaires et leurs configurations
          </p>
        </div>
        <div className="flex items-center gap-3">
          {/* Create Plan Button */}
          <Button onClick={handleCreatePlan} size="sm" className="h-9">
            <Add
              size={16}
              variant="Bulk"
              color="currentColor"
              className="mr-2"
            />
            Créer un plan
          </Button>
        </div>
      </div>

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
              placeholder="Rechercher par nom, description, code..."
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
        data={filteredPlans}
        rowCount={allPlans.length}
        columns={columns}
        isLoading={isLoadingPlans}
        enablePagination={true}
        enableColumnFilter={false}
        rowSelectable={false}
      />

      {/* Create Plan Modal */}
      <CreatePricingModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={createPlanMutation.mutateAsync}
        isLoading={createPlanMutation.isPending}
      />

      {/* Edit Plan Modal */}
      <EditPricingModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false)
          setSelectedPlan(null)
        }}
        onSubmit={async (data: any) => {
          await updatePlanMutation.mutateAsync({ id: selectedPlan!.id, data })
        }}
        plan={selectedPlan}
        isLoading={updatePlanMutation.isPending}
      />

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmer la suppression</AlertDialogTitle>
            <AlertDialogDescription>
              Êtes-vous sûr de vouloir supprimer le plan tarifaire "
              {planToDelete?.planNameFr}" ? Cette action est irréversible.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
