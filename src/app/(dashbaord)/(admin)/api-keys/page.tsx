"use client"

import { useState, useCallback, useEffect } from "react"
import { DataTable } from "@/shared/common/data-table/table"
import { Key, Add } from "iconsax-react"
import { createColumns } from "./columns"
import type { ApiKey, CreateApiKeyInput, CreateApiKeyResponse } from "@/modules/api-key/types"
import { CreateApiKeyDialog, ApiKeyCreatedDialog } from "@/modules/api-key/components"
import { DeleteConfirmationDialog } from "@/shared/common/delete-confirmation-dialog"
import { Button } from "@/shared/ui/button"
import { toast } from "sonner"
import { useApiKeys, useCreateApiKey, useDeleteApiKey, useT } from "@/core/hooks"

export default function ApiKeysPage() {
  const { t } = useT()
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isCreatedDialogOpen, setIsCreatedDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [createdApiKey, setCreatedApiKey] = useState<CreateApiKeyResponse | null>(null)
  const [selectedApiKey, setSelectedApiKey] = useState<ApiKey | null>(null)

  const { data, isLoading, error } = useApiKeys()
  const createApiKeyMutation = useCreateApiKey()
  const deleteApiKeyMutation = useDeleteApiKey()

  useEffect(() => {
    if (error) {
      const errorMessage =
        (error as any)?.response?.data?.message ||
        (error as any)?.message ||
        t('apiKeys.loadError')
      toast.error(errorMessage)
    }
  }, [error])

  const handleCreate = useCallback(() => {
    setIsCreateDialogOpen(true)
  }, [])

  const handleSaveCreate = useCallback(
    async (input: CreateApiKeyInput) => {
      const result = await createApiKeyMutation.mutateAsync(input)
      setIsCreateDialogOpen(false)
      setCreatedApiKey(result)
      setIsCreatedDialogOpen(true)
      toast.success(t('apiKeys.createdSuccess'), {
        description: t('apiKeys.createdSuccessDesc', { name: input.name }),
      })
    },
    [createApiKeyMutation]
  )

  const handleDelete = useCallback((apiKey: ApiKey) => {
    setSelectedApiKey(apiKey)
    setIsDeleteDialogOpen(true)
  }, [])

  const handleConfirmDelete = useCallback(async () => {
    if (!selectedApiKey) return
    await deleteApiKeyMutation.mutateAsync(selectedApiKey.id)
    setIsDeleteDialogOpen(false)
    setSelectedApiKey(null)
  }, [selectedApiKey, deleteApiKeyMutation])

  const columns = createColumns({ onDelete: handleDelete, t })
  const apiKeys = data || []

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Key size="32" variant="Bulk" color="currentColor" className="text-primary" />
            <h1 className="text-3xl font-bold tracking-tight">{t('apiKeys.title')}</h1>
          </div>
          <p className="text-muted-foreground mt-1">
            {t('apiKeys.subtitleDeveloper')}
          </p>
        </div>
        <Button className="gap-2" onClick={handleCreate}>
          <Add size="20" variant="Bulk" color="currentColor" />
          {t('apiKeys.newApiKey')}
        </Button>
      </div>

      <DataTable
        columns={columns}
        data={apiKeys}
        rowCount={apiKeys.length}
        isLoading={isLoading}
        emptyMessage={t('apiKeys.noResults')}
      />

      <CreateApiKeyDialog
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
        onSave={handleSaveCreate}
        isLoading={createApiKeyMutation.isPending}
      />

      <ApiKeyCreatedDialog
        open={isCreatedDialogOpen}
        onOpenChange={setIsCreatedDialogOpen}
        apiKeyData={createdApiKey}
      />

      {selectedApiKey && (
        <DeleteConfirmationDialog
          open={isDeleteDialogOpen}
          onOpenChange={setIsDeleteDialogOpen}
          onConfirm={handleConfirmDelete}
          title={t('apiKeys.deleteTitle')}
          description={t('apiKeys.deleteDescription', { name: selectedApiKey.name })}
          itemName={selectedApiKey.name}
          isDeleting={deleteApiKeyMutation.isPending}
        />
      )}
    </div>
  )
}
