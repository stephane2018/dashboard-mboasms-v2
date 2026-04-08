"use client"

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { i18next } from "@/core/lib/i18n"
import { senderIdService } from "@/core/services/sender-id.service"
import type {
  SenderId,
  PaginatedSenderIds,
  CreateSenderIdInput,
  UpdateSenderIdInput,
  UpdateSenderIdStatusInput,
  SenderIdQueryParams,
} from "@/modules/sender-id/types"

// Query keys for cache management
export const senderIdKeys = {
  all: ["senderIds"] as const,
  lists: () => [...senderIdKeys.all, "list"] as const,
  list: (params?: SenderIdQueryParams) => [...senderIdKeys.lists(), params] as const,
  byEnterprise: (enterpriseId: string, params?: SenderIdQueryParams) =>
    [...senderIdKeys.all, "enterprise", enterpriseId, params] as const,
  detail: (id: string) => [...senderIdKeys.all, "detail", id] as const,
}

/**
 * Hook to get all sender IDs with pagination
 */
export function useGetAllSenderIds(params?: SenderIdQueryParams, enabled: boolean = true) {
  return useQuery<PaginatedSenderIds, Error>({
    queryKey: senderIdKeys.list(params),
    queryFn: () => senderIdService.getAllSenderIds(params),
    enabled: enabled,
  })
}

/**
 * Hook to get sender IDs by enterprise (returns plain array)
 */
export function useGetSenderIdsByEnterprise(
  enterpriseId: string,
  params?: SenderIdQueryParams,
  enabled: boolean = true
) {
  return useQuery<SenderId[], Error>({
    queryKey: senderIdKeys.byEnterprise(enterpriseId, params),
    queryFn: () => senderIdService.getSenderIdsByEnterprise(enterpriseId),
    enabled: enabled && !!enterpriseId,
  })
}

/**
 * Hook to get a single sender ID by ID
 */
export function useGetSenderIdById(id: string, enabled: boolean = true) {
  return useQuery<SenderId[], Error>({
    queryKey: senderIdKeys.detail(id),
    queryFn: () => senderIdService.getSenderIdById(id),
    enabled: enabled && !!id,
  })
}

/**
 * Hook to create a new sender ID
 */
export function useCreateSenderId() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CreateSenderIdInput) => senderIdService.createSenderId(data),
    onSuccess: (data) => {
      toast.success(i18next.t('senderIds.created'), {
        description: i18next.t('senderIds.createdDesc', { name: data.name }),
      })
      queryClient.invalidateQueries({ queryKey: senderIdKeys.all })
    },
    onError: (error: any) => {
      const errorMessage = error?.data?.message || error?.message || i18next.t('senderIds.createError')
      toast.error(i18next.t('common.error'), {
        description: errorMessage,
      })
    },
  })
}

/**
 * Hook to update a sender ID
 */
export function useUpdateSenderId() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateSenderIdInput }) =>
      senderIdService.updateSenderId(id, data),
    onSuccess: (data, variables) => {
      toast.success(i18next.t('senderIds.updated'), {
        description: i18next.t('senderIds.updatedDesc', { name: data.name }),
      })
      queryClient.invalidateQueries({ queryKey: senderIdKeys.all })
      queryClient.invalidateQueries({ queryKey: senderIdKeys.detail(variables.id) })
    },
    onError: (error: any) => {
      const errorMessage = error?.data?.message || error?.message || i18next.t('senderIds.updateError')
      toast.error(i18next.t('common.error'), {
        description: errorMessage,
      })
    },
  })
}

/**
 * Hook to update sender ID status
 */
export function useUpdateSenderIdStatus() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateSenderIdStatusInput }) =>
      senderIdService.updateSenderIdStatus(id, data),
    onSuccess: (data, variables) => {
      toast.success(i18next.t('senderIds.statusUpdated'), {
        description: i18next.t('senderIds.statusUpdatedDesc', { name: data.name }),
      })
      queryClient.invalidateQueries({ queryKey: senderIdKeys.all })
      queryClient.invalidateQueries({ queryKey: senderIdKeys.detail(variables.id) })
    },
    onError: (error: any) => {
      const errorMessage = error?.data?.message || error?.message || i18next.t('senderIds.statusUpdateError')
      toast.error(i18next.t('common.error'), {
        description: errorMessage,
      })
    },
  })
}

/**
 * Hook to delete a sender ID
 */
export function useDeleteSenderId() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => senderIdService.deleteSenderId(id),
    onSuccess: () => {
      toast.success(i18next.t('senderIds.deleted'), {
        description: i18next.t('senderIds.deletedDesc'),
      })
      queryClient.invalidateQueries({ queryKey: senderIdKeys.all })
    },
    onError: (error: any) => {
      const errorMessage = error?.data?.message || error?.message || i18next.t('senderIds.deleteError')
      toast.error(i18next.t('common.error'), {
        description: errorMessage,
      })
    },
  })
}
