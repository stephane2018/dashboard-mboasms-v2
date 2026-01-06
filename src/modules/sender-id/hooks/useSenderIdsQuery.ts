"use client"

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { senderIdService } from "../services"
import type {
  SenderId,
  PaginatedSenderIds,
  CreateSenderIdInput,
  UpdateSenderIdInput,
  UpdateSenderIdStatusInput,
  SenderIdQueryParams,
} from "../types"

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
export function useGetAllSenderIds(params?: SenderIdQueryParams) {
  return useQuery<PaginatedSenderIds, Error>({
    queryKey: senderIdKeys.list(params),
    queryFn: () => senderIdService.getAllSenderIds(params),
  })
}

/**
 * Hook to get sender IDs by enterprise with pagination
 */
export function useGetSenderIdsByEnterprise(
  enterpriseId: string,
  params?: SenderIdQueryParams,
  enabled: boolean = true
) {
  return useQuery<PaginatedSenderIds, Error>({
    queryKey: senderIdKeys.byEnterprise(enterpriseId, params),
    queryFn: () => senderIdService.getSenderIdsByEnterprise(enterpriseId, params),
    enabled: enabled && !!enterpriseId,
  })
}

/**
 * Hook to get a single sender ID by ID
 */
export function useGetSenderIdById(id: string, enabled: boolean = true) {
  return useQuery<SenderId, Error>({
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
      toast.success("Sender ID créé", {
        description: `${data.name} a été créé avec succès`,
      })
      queryClient.invalidateQueries({ queryKey: senderIdKeys.all })
    },
    onError: (error: any) => {
      const errorMessage = error?.data?.message || error?.message || "Erreur lors de la création du Sender ID"
      toast.error("Erreur", {
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
      toast.success("Sender ID modifié", {
        description: `${data.name} a été modifié avec succès`,
      })
      queryClient.invalidateQueries({ queryKey: senderIdKeys.all })
      queryClient.invalidateQueries({ queryKey: senderIdKeys.detail(variables.id) })
    },
    onError: (error: any) => {
      const errorMessage = error?.data?.message || error?.message || "Erreur lors de la modification du Sender ID"
      toast.error("Erreur", {
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
      toast.success("Statut mis à jour", {
        description: `Le statut de ${data.name} a été mis à jour avec succès`,
      })
      queryClient.invalidateQueries({ queryKey: senderIdKeys.all })
      queryClient.invalidateQueries({ queryKey: senderIdKeys.detail(variables.id) })
    },
    onError: (error: any) => {
      const errorMessage = error?.data?.message || error?.message || "Erreur lors de la mise à jour du statut"
      toast.error("Erreur", {
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
      toast.success("Sender ID supprimé", {
        description: "Le Sender ID a été supprimé avec succès",
      })
      queryClient.invalidateQueries({ queryKey: senderIdKeys.all })
    },
    onError: (error: any) => {
      const errorMessage = error?.data?.message || error?.message || "Erreur lors de la suppression du Sender ID"
      toast.error("Erreur", {
        description: errorMessage,
      })
    },
  })
}
