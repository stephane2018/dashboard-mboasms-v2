"use client"

import { useState, useCallback } from "react"
import { DataTable } from "@/shared/common/data-table/table"
import { useSenderIds, useSenderIdActions } from "@/modules/sender-id/hooks"
import { MessageText, Add } from "iconsax-react"
import { createColumns } from "./columns"
import type { PaginationState } from "@tanstack/react-table"
import type { SenderId } from "@/modules/sender-id/types"
import { DeleteConfirmationDialog } from "@/shared/common/delete-confirmation-dialog"
import { EditSenderIdDialog } from "@/modules/sender-id/components"
import { ChangeStatusDialog } from "@/modules/sender-id/components"
import { Button } from "@/shared/ui/button"

export default function SenderIdsPage() {
  const [pagination, setPagination] = useState<PaginationState>({ pageIndex: 0, pageSize: 10 })
  const [selectedSenderId, setSelectedSenderId] = useState<SenderId | null>(null)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isStatusDialogOpen, setIsStatusDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)

  const { data, isLoading, loadSenderIds } = useSenderIds({
    page: pagination.pageIndex,
    size: pagination.pageSize,
  })

  const { updateSenderId, updateSenderIdStatus, deleteSenderId, isUpdating, isUpdatingStatus, isDeleting } =
    useSenderIdActions()

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

  const handleSaveEdit = useCallback(
    async (id: string, input: { name: string; description: string }) => {
      await updateSenderId(id, input)
      loadSenderIds({ page: pagination.pageIndex, size: pagination.pageSize })
    },
    [updateSenderId, loadSenderIds, pagination]
  )

  const handleSaveStatus = useCallback(
    async (id: string, input: { status: string; rejectionReason?: string }) => {
      await updateSenderIdStatus(id, input as any)
      loadSenderIds({ page: pagination.pageIndex, size: pagination.pageSize })
    },
    [updateSenderIdStatus, loadSenderIds, pagination]
  )

  const handleConfirmDelete = useCallback(async () => {
    if (!selectedSenderId) return
    await deleteSenderId(selectedSenderId.id)
    loadSenderIds({ page: pagination.pageIndex, size: pagination.pageSize })
    setIsDeleteDialogOpen(false)
    setSelectedSenderId(null)
  }, [selectedSenderId, deleteSenderId, loadSenderIds, pagination])

  const columns = createColumns({
    onEdit: handleEdit,
    onDelete: handleDelete,
    onChangeStatus: handleChangeStatus,
  })

  const senderIds = data?.content || []
  const rowCount = data?.totalElements || 0

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <MessageText size="32" variant="Bulk" color="currentColor" className="text-primary" />
            <h1 className="text-3xl font-bold tracking-tight">Sender IDs</h1>
          </div>
          <p className="text-muted-foreground mt-1">
            Gérez tous les Sender IDs de votre entreprise.
          </p>
        </div>
        <Button className="gap-2">
          <Add size="20" />
          Nouveau Sender ID
        </Button>
      </div>

      <DataTable
        columns={columns}
        data={senderIds}
        rowCount={rowCount}
        isLoading={isLoading}
        enablePagination
        onPaginationChange={setPagination}
        initialState={{
          pagination,
        }}
      />

      {selectedSenderId && (
        <>
          <EditSenderIdDialog
            open={isEditDialogOpen}
            onOpenChange={setIsEditDialogOpen}
            senderId={selectedSenderId}
            onSave={handleSaveEdit}
            isLoading={isUpdating}
          />

          <ChangeStatusDialog
            open={isStatusDialogOpen}
            onOpenChange={setIsStatusDialogOpen}
            senderId={selectedSenderId}
            onSave={handleSaveStatus}
            isLoading={isUpdatingStatus}
          />

          <DeleteConfirmationDialog
            open={isDeleteDialogOpen}
            onOpenChange={setIsDeleteDialogOpen}
            onConfirm={handleConfirmDelete}
            title="Supprimer le Sender ID"
            description={`Êtes-vous sûr de vouloir supprimer le Sender ID "${selectedSenderId.name}" ? Cette action est irréversible.`}
            itemName={selectedSenderId.name}
            isDeleting={isDeleting}
          />
        </>
      )}
    </div>
  )
}
