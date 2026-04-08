"use client"

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { i18next } from "@/core/lib/i18n"
import { couponService } from "@/core/services/coupon.service"
import type {
  Coupon,
  PaginatedCoupons,
  CreateCouponInput,
  UpdateCouponInput,
} from "@/modules/coupon/types"

export const couponKeys = {
  all: ["coupons"] as const,
  active: (page: number, size: number) => ["coupons", "active", page, size] as const,
  byCode: (code: string) => ["coupons", "code", code] as const,
}

export function useActiveCoupons(page: number, size: number) {
  return useQuery<PaginatedCoupons, Error>({
    queryKey: couponKeys.active(page, size),
    queryFn: () => couponService.getActiveCoupons(page, size),
  })
}

export function useCreateCoupon() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CreateCouponInput) => couponService.createCoupon(data),
    onSuccess: (data) => {
      toast.success(i18next.t('coupons.created'), {
        description: i18next.t('coupons.createdDesc', { name: data.name }),
      })
      queryClient.invalidateQueries({ queryKey: couponKeys.all })
    },
    onError: (error: any) => {
      const errorMessage =
        error?.data?.message || error?.message || i18next.t('coupons.createError')
      toast.error(i18next.t('common.error'), { description: errorMessage })
    },
  })
}

export function useUpdateCoupon() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateCouponInput }) =>
      couponService.updateCoupon(id, data),
    onSuccess: (data) => {
      toast.success(i18next.t('coupons.updated'), {
        description: i18next.t('coupons.updatedDesc', { name: data.name }),
      })
      queryClient.invalidateQueries({ queryKey: couponKeys.all })
    },
    onError: (error: any) => {
      const errorMessage =
        error?.data?.message || error?.message || i18next.t('coupons.updateError')
      toast.error(i18next.t('common.error'), { description: errorMessage })
    },
  })
}

export function useDeleteCoupon() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => couponService.deleteCoupon(id),
    onSuccess: () => {
      toast.success(i18next.t('coupons.deleted'), {
        description: i18next.t('coupons.deletedDesc'),
      })
      queryClient.invalidateQueries({ queryKey: couponKeys.all })
    },
    onError: (error: any) => {
      const errorMessage =
        error?.data?.message || error?.message || i18next.t('coupons.deleteError')
      toast.error(i18next.t('common.error'), { description: errorMessage })
    },
  })
}

export function useVerifyCoupon(code: string) {
  return useQuery<Coupon, Error>({
    queryKey: couponKeys.byCode(code),
    queryFn: () => couponService.verifyCouponByCode(code),
    enabled: !!code && code.length >= 3,
  })
}
