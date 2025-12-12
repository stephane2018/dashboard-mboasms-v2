"use client"

import { useMutation, useQuery, useQueryClient, type QueryKey } from "@tanstack/react-query"
import { toast } from "sonner"
import {
  createRecharge,
  validateRecharge,
  refuseRecharge,
  creditAccount,
  getAllRecharges,
} from "@/core/services/recharge.service"
import type { CreateRechargeRequestType, RechargeListContentType } from "@/core/models/recharges"
import type { UseQueryOptions } from "@tanstack/react-query"

type CreditAccountPayload = { enterpriseId: string; qteMessage: number }

interface UseRechargeOptions {
  queryKey?: QueryKey
  queryOptions?: Omit<
    UseQueryOptions<RechargeListContentType[], unknown, RechargeListContentType[], QueryKey>,
    "queryKey" | "queryFn"
  >
}

export function useRecharge(options: UseRechargeOptions = {}) {
  const queryClient = useQueryClient()
  const queryKey = options.queryKey ?? ["recharges"]

  const invalidate = () => {
    if (!queryKey) return
    queryClient.invalidateQueries({ queryKey })
  }

  const rechargesQuery = useQuery({
    queryKey,
    queryFn: getAllRecharges,
    ...(options.queryOptions ?? {}),
  })

  const createRechargeMutation = useMutation({
    mutationFn: (payload: CreateRechargeRequestType) => createRecharge(payload),
    onSuccess: () => {
      invalidate()
      toast.success("Demande de recharge créée", {
        description: "La demande de recharge a été créée avec succès",
      })
    },
    onError: (error: any) => {
      toast.error("Erreur lors de la création", {
        description: error?.message || "Une erreur s'est produite",
      })
    },
  })

  const validateRechargeMutation = useMutation({
    mutationFn: (rechargeId: string) => validateRecharge(rechargeId),
    onSuccess: () => {
      invalidate()
      toast.success("Demande validée", {
        description: "La demande de recharge a été validée avec succès",
      })
    },
    onError: (error: any) => {
      toast.error("Erreur lors de la validation", {
        description: error?.message || "Une erreur s'est produite",
      })
    },
  })

  const refuseRechargeMutation = useMutation({
    mutationFn: (rechargeId: string) => refuseRecharge(rechargeId),
    onSuccess: () => {
      invalidate()
      toast.success("Demande refusée", {
        description: "La demande de recharge a été refusée",
      })
    },
    onError: (error: any) => {
      toast.error("Erreur lors du refus", {
        description: error?.message || "Une erreur s'est produite",
      })
    },
  })

  const creditAccountMutation = useMutation({
    mutationFn: (payload: CreditAccountPayload) =>
      creditAccount(payload.enterpriseId, { qteMessage: payload.qteMessage }),
    onSuccess: () => {
      invalidate()
      toast.success("Compte crédité", {
        description: "Le compte de l'entreprise a été crédité avec succès",
      })
    },
    onError: (error: any) => {
      toast.error("Erreur lors du crédit", {
        description: error?.message || "Une erreur s'est produite",
      })
    },
  })

  return {
    rechargesQuery,
    createRechargeMutation,
    validateRechargeMutation,
    refuseRechargeMutation,
    creditAccountMutation,
  }
}
