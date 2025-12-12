"use client"

import { useMutation, useQuery, useQueryClient, type QueryKey } from "@tanstack/react-query"
import { toast } from "sonner"
import {
  getAllPlans,
  createPlan,
  updatePlan,
  deletePlan,
  enablePlan,
  disablePlan,
  type CreatePricingPlanRequest,
} from "@/core/services/pricing.service"
import type { PricingPlanType, PricingPlanResponseType } from "@/core/models/pricing"
import type { UseQueryOptions } from "@tanstack/react-query"

interface UsePricingOptions {
  queryKey?: QueryKey
  queryOptions?: Omit<
    UseQueryOptions<PricingPlanResponseType, unknown, PricingPlanResponseType, QueryKey>,
    "queryKey" | "queryFn"
  >
}

export function usePricing(options: UsePricingOptions = {}) {
  const queryClient = useQueryClient()
  const queryKey = options.queryKey ?? ["pricing-plans"]

  const invalidate = () => {
    if (!queryKey) return
    queryClient.invalidateQueries({ queryKey })
  }

  const plansQuery = useQuery({
    queryKey,
    queryFn: getAllPlans,
    ...(options.queryOptions ?? {}),
  })

  const createPlanMutation = useMutation({
    mutationFn: (payload: CreatePricingPlanRequest) => createPlan(payload),
    onSuccess: () => {
      invalidate()
      toast.success("Plan créé", {
        description: "Le plan tarifaire a été créé avec succès",
      })
    },
    onError: (error: any) => {
      toast.error("Erreur lors de la création", {
        description: error?.message || "Une erreur s'est produite",
      })
    },
  })

  const updatePlanMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<CreatePricingPlanRequest> }) =>
      updatePlan(id, data),
    onSuccess: () => {
      invalidate()
      toast.success("Plan mis à jour", {
        description: "Le plan tarifaire a été mis à jour avec succès",
      })
    },
    onError: (error: any) => {
      toast.error("Erreur lors de la mise à jour", {
        description: error?.message || "Une erreur s'est produite",
      })
    },
  })

  const deletePlanMutation = useMutation({
    mutationFn: (id: string) => deletePlan(id),
    onSuccess: () => {
      invalidate()
      toast.success("Plan supprimé", {
        description: "Le plan tarifaire a été supprimé avec succès",
      })
    },
    onError: (error: any) => {
      toast.error("Erreur lors de la suppression", {
        description: error?.message || "Une erreur s'est produite",
      })
    },
  })

  const enablePlanMutation = useMutation({
    mutationFn: (id: string) => enablePlan(id),
    onSuccess: () => {
      invalidate()
      toast.success("Plan activé", {
        description: "Le plan tarifaire a été activé avec succès",
      })
    },
    onError: (error: any) => {
      toast.error("Erreur lors de l'activation", {
        description: error?.message || "Une erreur s'est produite",
      })
    },
  })

  const disablePlanMutation = useMutation({
    mutationFn: (id: string) => disablePlan(id),
    onSuccess: () => {
      invalidate()
      toast.success("Plan désactivé", {
        description: "Le plan tarifaire a été désactivé avec succès",
      })
    },
    onError: (error: any) => {
      toast.error("Erreur lors de la désactivation", {
        description: error?.message || "Une erreur s'est produite",
      })
    },
  })

  return {
    plansQuery,
    createPlanMutation,
    updatePlanMutation,
    deletePlanMutation,
    enablePlanMutation,
    disablePlanMutation,
  }
}
