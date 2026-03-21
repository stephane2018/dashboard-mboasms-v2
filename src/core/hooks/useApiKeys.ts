"use client"

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { apiKeyService } from "@/core/services/api-key.service"
import type {
  ApiKey,
  CreateApiKeyInput,
  CreateApiKeyResponse,
} from "@/modules/api-key/types"

export const apiKeyKeys = {
  all: ["api-keys"] as const,
  list: () => ["api-keys", "list"] as const,
}

export function useApiKeys() {
  return useQuery<ApiKey[], Error>({
    queryKey: apiKeyKeys.list(),
    queryFn: () => apiKeyService.listApiKeys(),
  })
}

export function useCreateApiKey() {
  const queryClient = useQueryClient()

  return useMutation<CreateApiKeyResponse, any, CreateApiKeyInput>({
    mutationFn: (data: CreateApiKeyInput) => apiKeyService.createApiKey(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: apiKeyKeys.all })
    },
    onError: (error: any) => {
      const errorMessage =
        error?.data?.message || error?.message || "Erreur lors de la création de l'API Key"
      toast.error("Erreur", { description: errorMessage })
    },
  })
}

export function useDeleteApiKey() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => apiKeyService.deleteApiKey(id),
    onSuccess: () => {
      toast.success("API Key supprimée", {
        description: "La clé API a été supprimée avec succès",
      })
      queryClient.invalidateQueries({ queryKey: apiKeyKeys.all })
    },
    onError: (error: any) => {
      const errorMessage =
        error?.data?.message || error?.message || "Erreur lors de la suppression de l'API Key"
      toast.error("Erreur", { description: errorMessage })
    },
  })
}
