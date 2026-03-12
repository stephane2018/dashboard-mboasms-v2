"use client"

import { useState, useCallback, useEffect } from "react"
import { DataTable } from "@/shared/common/data-table/table"

import { useAuthContext } from "@/core/providers"
import { MessageText, Add } from "iconsax-react"
import { createColumns } from "./columns"
import type { PaginationState } from "@tanstack/react-table"
import type { SenderId } from "@/modules/sender-id/types"
import { DeleteConfirmationDialog } from "@/shared/common/delete-confirmation-dialog"
import { EditSenderIdDialog, CreateSenderIdDialog } from "@/modules/sender-id/components"
import { ChangeStatusDialog } from "@/modules/sender-id/components"
import { Button } from "@/shared/ui/button"
import { toast } from "sonner"
import { useCreateSenderId, useDeleteSenderId, useGetAllSenderIds, useGetSenderIdsByEnterprise, useUpdateSenderId, useUpdateSenderIdStatus } from "@/core/hooks"

export default function SenderIdsPage() {
  const { user } = useAuthContext()
  const _isSuperAdmin = user?.role === "SUPER_ADMIN"
  const [pagination, setPagination] = useState<PaginationState>({ pageIndex: 0, pageSize: 10 })
  const [selectedSenderId, setSelectedSenderId] = useState<SenderId | null>(null)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isStatusDialogOpen, setIsStatusDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)

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
                          "Erreur lors du chargement des Sender IDs"
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
    async (input: { name: string; description: string; enterpriseId: string }) => {
      await createSenderIdMutation.mutateAsync(input)
      setIsCreateDialogOpen(false)
    },
    [createSenderIdMutation]
  )

  const handleSaveEdit = useCallback(
    async (id: string, input: { name: string; description: string }) => {
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
              {_isSuperAdmin ? "Sender IDs (Plateforme)" : "Mes Sender IDs"}
            </h1>
            <p className="text-xs text-muted-foreground">
              {_isSuperAdmin
                ? "Gérez tous les Sender IDs de la plateforme."
                : "Gérez les Sender IDs de votre entreprise."}
            </p>
          </div>
        </div>
        <Button size="sm" className="gap-1.5 rounded-xl" onClick={handleCreate}>
          <Add size={18} variant="Bulk" color="currentColor" />
          Nouveau
        </Button>
      </div>

      <DataTable
        columns={columns}
        data={senderIds}
        rowCount={rowCount}
        isLoading={isLoading}
        enablePagination={_isSuperAdmin}
        onPaginationChange={_isSuperAdmin ? setPagination : undefined}
        initialState={{
          pagination,
        }}
        emptyMessage="Aucun Sender ID trouvé."
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
            title="Supprimer le Sender ID"
            description={`Êtes-vous sûr de vouloir supprimer le Sender ID "${selectedSenderId.name}" ? Cette action est irréversible.`}
            itemName={selectedSenderId.name}
            isDeleting={deleteSenderIdMutation.isPending}
          />
        </>
      )}
    </div>
  )
}
