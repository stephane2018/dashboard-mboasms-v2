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
import { useApiKeys, useCreateApiKey, useDeleteApiKey } from "@/core/hooks"

export default function ApiKeysPage() {
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
        "Erreur lors du chargement des API Keys"
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
      toast.success("API Key créée", {
        description: `La clé "${input.name}" a été générée avec succès`,
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

  const columns = createColumns({ onDelete: handleDelete })
  const apiKeys = data || []

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Key size="32" variant="Bulk" color="currentColor" className="text-primary" />
            <h1 className="text-3xl font-bold tracking-tight">API Keys</h1>
          </div>
          <p className="text-muted-foreground mt-1">
            Gérez vos clés API pour l&apos;envoi de SMS via l&apos;API Developer.
          </p>
        </div>
        <Button className="gap-2" onClick={handleCreate}>
          <Add size="20" variant="Bulk" color="currentColor" />
          Nouvelle API Key
        </Button>
      </div>

      <DataTable
        columns={columns}
        data={apiKeys}
        rowCount={apiKeys.length}
        isLoading={isLoading}
        emptyMessage="Aucune API Key trouvée."
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
          title="Supprimer l'API Key"
          description={`Êtes-vous sûr de vouloir supprimer la clé "${selectedApiKey.name}" ? Cette action est irréversible et les appels utilisant cette clé ne fonctionneront plus.`}
          itemName={selectedApiKey.name}
          isDeleting={deleteApiKeyMutation.isPending}
        />
      )}
    </div>
  )
}
