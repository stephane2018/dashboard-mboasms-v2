"use client"

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import {
  sendMessage,
  sendMessageToContact,
  sendMessageToGroup,
  getMessageHistory,
  type SendMessageToGroupPayload,
} from "@/core/services/message.service"
import type { SendMessageRequestType, SendMessageResponseType } from "@/core/models"
import type { MessageHistoryType } from "@/core/models/history"
import type { PaginatedResponse } from "@/core/models/common"

export const messageKeys = {
  all: ["messages"] as const,
  lists: () => [...messageKeys.all, "list"] as const,
  list: (enterpriseId: string) => [...messageKeys.lists(), { enterpriseId }] as const,
  history: (enterpriseId: string, page: number, size: number) => [...messageKeys.all, "history", enterpriseId, page, size] as const,
}

export function useMessageHistory(enterpriseId: string, page: number = 0, size: number = 10, enabled: boolean = true) {
  return useQuery<PaginatedResponse<MessageHistoryType>, Error>({
    queryKey: messageKeys.history(enterpriseId, page, size),
    queryFn: () => getMessageHistory(enterpriseId, page, size),
    enabled,
  })
}

export function useSendMessage() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: SendMessageRequestType) => sendMessage(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: messageKeys.all })
      toast.success("Message envoyé", {
        description: "Le message a été envoyé avec succès",
      })
    },
    onError: (error: any) => {
      toast.error("Erreur lors de l'envoi", {
        description: error?.message || "Une erreur s'est produite",
      })
    },
  })
}

export function useSendMessageToContact() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ contactId, data }: { contactId: string; data: SendMessageRequestType }) =>
      sendMessageToContact(contactId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: messageKeys.all })
      toast.success("Message envoyé", {
        description: "Le message a été envoyé avec succès au contact",
      })
    },
    onError: (error: any) => {
      toast.error("Erreur lors de l'envoi", {
        description: error?.message || "Une erreur s'est produite",
      })
    },
  })
}

export function useSendMessageToGroup() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: SendMessageToGroupPayload) => sendMessageToGroup(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: messageKeys.all })
      toast.success("Message envoyé", {
        description: "Le message a été envoyé au groupe avec succès",
      })
    },
    onError: (error: any) => {
      toast.error("Erreur lors de l'envoi", {
        description: error?.message || "Une erreur s'est produite",
      })
    },
  })
}
