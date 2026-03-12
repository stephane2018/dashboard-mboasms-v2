"use client"

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import {
  getSmsCountryPrices,
  createSmsCountryPrice,
  updateSmsCountryPrice,
  deleteSmsCountryPrice,
  type CreateSmsCountryPriceRequest,
} from "@/core/services/sms-country-price.service"

export function useSmsCountryPrices(params?: { page?: number; size?: number }) {
  const queryClient = useQueryClient()

  const queryKey = ["sms-country-prices", params?.page, params?.size]

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: ["sms-country-prices"] })
  }

  const pricesQuery = useQuery({
    queryKey,
    queryFn: () => getSmsCountryPrices(params),
  })

  const createMutation = useMutation({
    mutationFn: (data: CreateSmsCountryPriceRequest) => createSmsCountryPrice(data),
    onSuccess: () => {
      invalidate()
      toast.success("Prix ajouté", {
        description: "Le prix du pays a été ajouté avec succès",
      })
    },
    onError: (error: any) => {
      toast.error("Erreur lors de la création", {
        description: error?.message || "Une erreur s'est produite",
      })
    },
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<CreateSmsCountryPriceRequest> }) =>
      updateSmsCountryPrice(id, data),
    onSuccess: () => {
      invalidate()
      toast.success("Prix mis à jour", {
        description: "Le prix du pays a été mis à jour avec succès",
      })
    },
    onError: (error: any) => {
      toast.error("Erreur lors de la mise à jour", {
        description: error?.message || "Une erreur s'est produite",
      })
    },
  })

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteSmsCountryPrice(id),
    onSuccess: () => {
      invalidate()
      toast.success("Prix supprimé", {
        description: "Le prix du pays a été supprimé avec succès",
      })
    },
    onError: (error: any) => {
      toast.error("Erreur lors de la suppression", {
        description: error?.message || "Une erreur s'est produite",
      })
    },
  })

  return {
    pricesQuery,
    createMutation,
    updateMutation,
    deleteMutation,
  }
}
