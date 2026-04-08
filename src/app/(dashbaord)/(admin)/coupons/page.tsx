"use client"

import { useState, useCallback, useEffect } from "react"
import { DataTable } from "@/shared/common/data-table/table"
import { useAuthContext } from "@/core/providers"
import { TicketDiscount, Add } from "iconsax-react"
import { createColumns } from "./columns"
import type { PaginationState } from "@tanstack/react-table"
import type { Coupon, CreateCouponInput, UpdateCouponInput } from "@/modules/coupon/types"
import { CreateCouponDialog, EditCouponDialog } from "@/modules/coupon/components"
import { DeleteConfirmationDialog } from "@/shared/common/delete-confirmation-dialog"
import { Button } from "@/shared/ui/button"
import { toast } from "sonner"
import { useActiveCoupons, useCreateCoupon, useUpdateCoupon, useDeleteCoupon, useT } from "@/core/hooks"

export default function CouponsPage() {
  const { t } = useT()
  const { user } = useAuthContext()
  const _isSuperAdmin = user?.role === "SUPER_ADMIN"
  const [pagination, setPagination] = useState<PaginationState>({ pageIndex: 0, pageSize: 10 })
  const [selectedCoupon, setSelectedCoupon] = useState<Coupon | null>(null)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)

  const { data, isLoading, error } = useActiveCoupons(pagination.pageIndex, pagination.pageSize)

  const createCouponMutation = useCreateCoupon()
  const updateCouponMutation = useUpdateCoupon()
  const deleteCouponMutation = useDeleteCoupon()

  useEffect(() => {
    if (error) {
      const errorMessage =
        (error as any)?.response?.data?.message ||
        (error as any)?.message ||
        t('coupons.loadError')
      toast.error(errorMessage)
    }
  }, [error])

  const handleEdit = useCallback((coupon: Coupon) => {
    setSelectedCoupon(coupon)
    setIsEditDialogOpen(true)
  }, [])

  const handleDelete = useCallback((coupon: Coupon) => {
    setSelectedCoupon(coupon)
    setIsDeleteDialogOpen(true)
  }, [])

  const handleConfirmDelete = useCallback(async () => {
    if (!selectedCoupon) return
    await deleteCouponMutation.mutateAsync(selectedCoupon.id)
    setIsDeleteDialogOpen(false)
    setSelectedCoupon(null)
  }, [selectedCoupon, deleteCouponMutation])

  const handleCreate = useCallback(() => {
    setIsCreateDialogOpen(true)
  }, [])

  const handleSaveCreate = useCallback(
    async (input: CreateCouponInput) => {
      await createCouponMutation.mutateAsync(input)
      setIsCreateDialogOpen(false)
    },
    [createCouponMutation]
  )

  const handleSaveEdit = useCallback(
    async (id: string, input: UpdateCouponInput) => {
      await updateCouponMutation.mutateAsync({ id, data: input })
      setIsEditDialogOpen(false)
    },
    [updateCouponMutation]
  )

  const columns = createColumns({
    onEdit: handleEdit,
    onDelete: handleDelete,
    t,
  })

  const coupons = data?.content || []
  const rowCount = data?.totalElements || 0

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <TicketDiscount size="32" variant="Bulk" color="currentColor" className="text-primary" />
            <h1 className="text-3xl font-bold tracking-tight">
              {_isSuperAdmin ? t('coupons.titlePlatform') : t('coupons.title')}
            </h1>
          </div>
          <p className="text-muted-foreground mt-1">
            {t('coupons.subtitleManagement')}
          </p>
        </div>
        <Button className="gap-2" onClick={handleCreate}>
          <Add size="20" variant="Bulk" color="currentColor" />
          {t('coupons.newCoupon')}
        </Button>
      </div>

      <DataTable
        columns={columns}
        data={coupons}
        rowCount={rowCount}
        isLoading={isLoading}
        enablePagination
        onPaginationChange={setPagination}
        initialState={{
          pagination,
        }}
        emptyMessage={t('coupons.noResults')}
      />

      <CreateCouponDialog
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
        onSave={handleSaveCreate}
        isLoading={createCouponMutation.isPending}
        userId={user?.id || ""}
      />

      {selectedCoupon && (
        <>
          <EditCouponDialog
            open={isEditDialogOpen}
            onOpenChange={setIsEditDialogOpen}
            coupon={selectedCoupon}
            onSave={handleSaveEdit}
            isLoading={updateCouponMutation.isPending}
          />

          <DeleteConfirmationDialog
            open={isDeleteDialogOpen}
            onOpenChange={setIsDeleteDialogOpen}
            onConfirm={handleConfirmDelete}
            title={t('coupons.deleteTitle')}
            description={t('coupons.deleteConfirm', { name: selectedCoupon.name })}
            itemName={selectedCoupon.name}
            isDeleting={deleteCouponMutation.isPending}
          />
        </>
      )}
    </div>
  )
}
