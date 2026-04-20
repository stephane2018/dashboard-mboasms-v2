"use client"

import { useState, useCallback, useEffect } from "react"
import { DataTable } from "@/shared/common/data-table/table"
import { DataTableToolbar } from "@/shared/common/data-table/data-table-toolabr"

import { useAuthContext } from "@/core/providers"
import { Role } from "@/core/config/enum"
import { MessageText, Add } from "iconsax-react"
import { createColumns } from "./columns"
import type { PaginationState } from "@tanstack/react-table"
import type { SenderId, CreateSenderIdInput, UpdateSenderIdInput } from "@/modules/sender-id/types"
import { DeleteConfirmationDialog } from "@/shared/common/delete-confirmation-dialog"
import { EditSenderIdDialog, CreateSenderIdDialog, ReuploadSenderIdFilesDialog } from "@/modules/sender-id/components"
import { ChangeStatusDialog } from "@/modules/sender-id/components"
import { SenderIdGuideModal } from "@/modules/sender-id/components/sender-id-guide-modal"
import { Button } from "@/shared/ui/button"
import { toast } from "sonner"
import { useCreateSenderId, useDeleteSenderId, useGetAllSenderIds, useGetSenderIdsByEnterprise, useUpdateSenderId, useUpdateSenderIdStatus, useT } from "@/core/hooks"

export default function SenderIdsPage() {
  const { user } = useAuthContext()
  const { t } = useT()
  const _isSuperAdmin = user?.role === "SUPER_ADMIN"
  const [pagination, setPagination] = useState<PaginationState>({ pageIndex: 0, pageSize: 10 })
  const [selectedSenderId, setSelectedSenderId] = useState<SenderId | null>(null)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isStatusDialogOpen, setIsStatusDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [isReuploadDialogOpen, setIsReuploadDialogOpen] = useState(false)
  const [isGuideModalOpen, setIsGuideModalOpen] = useState(false)

  // Check if guide should be shown on first visit
  useEffect(() => {
    if (typeof window !== "undefined") {
      const guideShown = localStorage.getItem("senderIdGuideShown")
      if (!guideShown) {
        setIsGuideModalOpen(true)
      }
    }
  }, [])

  // SUPER_ADMIN: paginated response with content/totalElements
  const { data: allData, isLoading: isLoadingAll, error: errorAll } = useGetAllSenderIds(
    {
      page: pagination.pageIndex,
      size: pagination.pageSize,
    },
    _isSuperAdmin
  )

  // ADMIN_USER: returns plain SenderId[] array (no pagination)
  const { data: enterpriseData, isLoading: isLoadingEnterprise, error: errorEnterprise } = useGetSenderIdsByEnterprise(
    user?.companyId || "",
    undefined,
    !_isSuperAdmin
  )

  const isLoading = _isSuperAdmin ? isLoadingAll : isLoadingEnterprise
  const error = _isSuperAdmin ? errorAll : errorEnterprise

  // Normalize data: allData is paginated, enterpriseData is a plain array
  const senderIds = _isSuperAdmin
    ? (allData?.content || [])
    : (enterpriseData || [])

  const rowCount = _isSuperAdmin
    ? (allData?.totalElements || 0)
    : senderIds.length

  const createSenderIdMutation = useCreateSenderId()
  const updateSenderIdMutation = useUpdateSenderId()
  const updateStatusMutation = useUpdateSenderIdStatus()
  const deleteSenderIdMutation = useDeleteSenderId()

  useEffect(() => {
    if (error) {
      const errorMessage = (error as any)?.response?.data?.message ||
                          (error as any)?.message ||
                          t('toasts.loadingError')
      toast.error(errorMessage)
    }
  }, [error])

  const handleEdit = useCallback((senderId: SenderId) => {
    setSelectedSenderId(senderId)
    setIsEditDialogOpen(true)
  }, [])

  const handleChangeStatus = useCallback((senderId: SenderId) => {
    setSelectedSenderId(senderId)
    setIsStatusDialogOpen(true)
  }, [])

  const handleDelete = useCallback((senderId: SenderId) => {
    setSelectedSenderId(senderId)
    setIsDeleteDialogOpen(true)
  }, [])

  const handleCreate = useCallback(() => {
    setIsCreateDialogOpen(true)
  }, [])

  const handleSaveCreate = useCallback(
    async (input: CreateSenderIdInput) => {
      await createSenderIdMutation.mutateAsync(input)
      setIsCreateDialogOpen(false)
    },
    [createSenderIdMutation]
  )

  const handleReupload = useCallback(
    async (id: string, urls: { kycA2PUrl: string; senderIdAuthLetterUrl: string }) => {
      await updateSenderIdMutation.mutateAsync({ id, data: urls })
      setIsReuploadDialogOpen(false)
    },
    [updateSenderIdMutation]
  )

    const handleSaveEdit = useCallback(
    async (id: string, input: UpdateSenderIdInput) => {
      await updateSenderIdMutation.mutateAsync({ id, data: input })
      setIsEditDialogOpen(false)
    },
    [updateSenderIdMutation]
  )

  const handleSaveStatus = useCallback(
    async (id: string, input: { status: string; rejectionReason?: string }) => {
      await updateStatusMutation.mutateAsync({ id, data: input as any })
      setIsStatusDialogOpen(false)
    },
    [updateStatusMutation]
  )

  const handleConfirmDelete = useCallback(async () => {
    if (!selectedSenderId) return
    await deleteSenderIdMutation.mutateAsync(selectedSenderId.id)
    setIsDeleteDialogOpen(false)
    setSelectedSenderId(null)
  }, [selectedSenderId, deleteSenderIdMutation])

  const columns = createColumns({
    onEdit: handleEdit,
    onDelete: handleDelete,
    onChangeStatus: handleChangeStatus,
    onReupload: (senderId) => {
      setSelectedSenderId(senderId)
      setIsReuploadDialogOpen(true)
    },
    userRole: user?.role as Role | undefined,
    t,
  })

  return (
    <div className="p-4 md:p-6 space-y-5 ">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="rounded-xl bg-primary/10 p-2.5">
            <MessageText size={22} variant="Bulk" color="currentColor" className="text-primary" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-foreground">
              {_isSuperAdmin ? t('senderIds.titlePlatform') : t('senderIds.title')}
            </h1>
            <p className="text-xs text-muted-foreground">
              {_isSuperAdmin
                ? t('senderIds.subtitlePlatform')
                : t('senderIds.subtitle')}
            </p>
          </div>
        </div>
        <Button size="sm" className="gap-1.5 rounded-xl" onClick={handleCreate}>
          <Add size={18} variant="Bulk" color="currentColor" />
          {t('senderIds.new')}
        </Button>
      </div>

      <DataTable
        columns={columns}
        data={senderIds}
        rowCount={rowCount}
        isLoading={isLoading}
        enableColumnFilter
        enablePagination={_isSuperAdmin}
        onPaginationChange={_isSuperAdmin ? setPagination : undefined}
        toolbar={(table) => <DataTableToolbar table={table} />}
        initialState={{
          pagination,
        }}
        emptyMessage={t('senderIds.noResults')}
      />

      <CreateSenderIdDialog
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
        onSave={handleSaveCreate}
        isLoading={createSenderIdMutation.isPending}
        enterpriseId={user?.companyId || ""}
      />

      {selectedSenderId && (
        <>
          <EditSenderIdDialog
            open={isEditDialogOpen}
            onOpenChange={setIsEditDialogOpen}
            senderId={selectedSenderId}
            onSave={handleSaveEdit}
            isLoading={updateSenderIdMutation.isPending}
          />

          <ChangeStatusDialog
            open={isStatusDialogOpen}
            onOpenChange={setIsStatusDialogOpen}
            senderId={selectedSenderId}
            onSave={handleSaveStatus}
            isLoading={updateStatusMutation.isPending}
          />

          <DeleteConfirmationDialog
            open={isDeleteDialogOpen}
            onOpenChange={setIsDeleteDialogOpen}
            onConfirm={handleConfirmDelete}
            title={t('senderIds.delete')}
            description={t('senderIds.deleteConfirm', { name: selectedSenderId.name })}
            itemName={selectedSenderId.name}
            isDeleting={deleteSenderIdMutation.isPending}
          />

          <ReuploadSenderIdFilesDialog
            open={isReuploadDialogOpen}
            onOpenChange={setIsReuploadDialogOpen}
            senderId={selectedSenderId}
            onSave={handleReupload}
            isLoading={updateSenderIdMutation.isPending}
          />
        </>
      )}
    </div>
  )
}
