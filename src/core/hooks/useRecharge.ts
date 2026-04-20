"use client"

import { useMutation, useQuery, useQueryClient, type QueryKey } from "@tanstack/react-query"
import { toast } from "sonner"
import { i18next } from "@/core/lib/i18n"
import {
  createRecharge,
  validateRecharge,
  refuseRecharge,
  creditAccount,
  getAllRecharges,
  getRechargesByEnterprise,
} from "@/core/services/recharge.service"
import type { CreateRechargeRequestType, RechargeListContentType, PaginatedRechargeResponse } from "@/core/models/recharges"
import type { UseQueryOptions } from "@tanstack/react-query"
import { useAuth } from "@/core/hooks/useAuth"
import { Role } from "@/core/config/enum"

type CreditAccountPayload = { enterpriseId: string; qteMessage: number }

const rechargeKeys = {
  all: ["recharges"] as const,
  allPaginated: (page: number, size: number) =>
    ["recharges", "all", page, size] as const,
  enterprise: (enterpriseId: string, page: number, size: number) =>
    ["recharges", "enterprise", enterpriseId, page, size] as const,
}

export function useEnterpriseRecharges(enterpriseId: string, page: number, size: number) {
  const queryClient = useQueryClient()

  const query = useQuery<PaginatedRechargeResponse, Error>({
    queryKey: rechargeKeys.enterprise(enterpriseId, page, size),
    queryFn: () => getRechargesByEnterprise(enterpriseId, page, size),
    enabled: !!enterpriseId,
  })

  const createRechargeMutation = useMutation({
    mutationFn: (payload: CreateRechargeRequestType) => createRecharge(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: rechargeKeys.all })
      toast.success(i18next.t('recharge.rechargeCreated'), {
        description: i18next.t('recharge.rechargeCreatedDesc'),
      })
    },
    onError: (error: any) => {
      toast.error(i18next.t('recharge.createError'), {
        description: error?.message || i18next.t('toasts.genericError'),
      })
    },
  })

  return { query, createRechargeMutation }
}

interface UseRechargeOptions {
  queryKey?: QueryKey
  queryOptions?: Omit<
    UseQueryOptions<PaginatedRechargeResponse, unknown, PaginatedRechargeResponse, QueryKey>,
    "queryKey" | "queryFn"
  >
}

export function useRecharge(options: UseRechargeOptions = {}, page = 0, size = 10) {
  const queryClient = useQueryClient()
  const { user } = useAuth()
  const _isSuperAdmin = user?.role === Role.SUPER_ADMIN
  const _isAdminUser = user?.role === Role.ADMIN_USER
  const _isAdmin = _isSuperAdmin || _isAdminUser
  const enterpriseId = user?.companyId

  const queryKey = options.queryKey ?? 
    (_isSuperAdmin 
      ? rechargeKeys.allPaginated(page, size)
      : rechargeKeys.enterprise(enterpriseId || "", page, size)
    )

  const invalidate = () => {
    if (!queryKey) return
    queryClient.invalidateQueries({ queryKey: rechargeKeys.all })
  }

  const rechargesQuery = useQuery({
    queryKey,
    queryFn: async (): Promise<PaginatedRechargeResponse> => {
      if (_isSuperAdmin) {
        return (await getAllRecharges(page, size)) ?? {
          content: [],
          totalElements: 0,
          totalPages: 0,
          currentPage: page,
          pageSize: size,
        }
      }
      return (await getRechargesByEnterprise(enterpriseId!, page, size)) ?? {
        content: [],
        totalElements: 0,
        totalPages: 0,
        currentPage: page,
        pageSize: size,
      }
    },
    enabled: !!user && (_isSuperAdmin || !!enterpriseId),
    ...(options.queryOptions ?? {}),
  })

  const createRechargeMutation = useMutation({
    mutationFn: (payload: CreateRechargeRequestType) => createRecharge(payload),
    onSuccess: () => {
      invalidate()
      toast.success(i18next.t('recharge.rechargeCreated'), {
        description: i18next.t('recharge.rechargeCreatedDesc'),
      })
    },
    onError: (error: any) => {
      toast.error(i18next.t('recharge.createError'), {
        description: error?.message || i18next.t('toasts.genericError'),
      })
    },
  })

  const validateRechargeMutation = useMutation({
    mutationFn: (rechargeId: string) => validateRecharge(rechargeId),
    onSuccess: () => {
      invalidate()
      toast.success(i18next.t('recharge.rechargeValidated'), {
        description: i18next.t('recharge.rechargeValidatedDesc'),
      })
    },
    onError: (error: any) => {
      toast.error(i18next.t('recharge.validationError'), {
        description: error?.message || i18next.t('toasts.genericError'),
      })
    },
  })

  const refuseRechargeMutation = useMutation({
    mutationFn: (rechargeId: string) => refuseRecharge(rechargeId),
    onSuccess: () => {
      invalidate()
      toast.success(i18next.t('recharge.rechargeRefused'), {
        description: i18next.t('recharge.rechargeRefusedDesc'),
      })
    },
    onError: (error: any) => {
      toast.error(i18next.t('recharge.refuseError'), {
        description: error?.message || i18next.t('toasts.genericError'),
      })
    },
  })

  const creditAccountMutation = useMutation({
    mutationFn: (payload: CreditAccountPayload) =>
      creditAccount(payload.enterpriseId, { qteMessage: payload.qteMessage }),
    onSuccess: () => {
      invalidate()
      toast.success(i18next.t('recharge.accountCredited'), {
        description: i18next.t('recharge.accountCreditedDesc'),
      })
    },
    onError: (error: any) => {
      toast.error(i18next.t('recharge.creditError'), {
        description: error?.message || i18next.t('toasts.genericError'),
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
