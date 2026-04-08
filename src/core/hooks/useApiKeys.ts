"use client"

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { i18next } from "@/core/lib/i18n"
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
        error?.data?.message || error?.message || i18next.t('apiKeys.error')
      toast.error(i18next.t('common.error'), { description: errorMessage })
    },
  })
}

export function useDeleteApiKey() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => apiKeyService.deleteApiKey(id),
    onSuccess: () => {
      toast.success(i18next.t('apiKeys.deleted'), {
        description: i18next.t('apiKeys.deleted'),
      })
      queryClient.invalidateQueries({ queryKey: apiKeyKeys.all })
    },
    onError: (error: any) => {
      const errorMessage =
        error?.data?.message || error?.message || i18next.t('apiKeys.error')
      toast.error(i18next.t('common.error'), { description: errorMessage })
    },
  })
}
