"use client"

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
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
      toast.success("Coupon créé", {
        description: `${data.name} a été créé avec succès`,
      })
      queryClient.invalidateQueries({ queryKey: couponKeys.all })
    },
    onError: (error: any) => {
      const errorMessage =
        error?.data?.message || error?.message || "Erreur lors de la création du coupon"
      toast.error("Erreur", { description: errorMessage })
    },
  })
}

export function useUpdateCoupon() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateCouponInput }) =>
      couponService.updateCoupon(id, data),
    onSuccess: (data) => {
      toast.success("Coupon modifié", {
        description: `${data.name} a été modifié avec succès`,
      })
      queryClient.invalidateQueries({ queryKey: couponKeys.all })
    },
    onError: (error: any) => {
      const errorMessage =
        error?.data?.message || error?.message || "Erreur lors de la modification du coupon"
      toast.error("Erreur", { description: errorMessage })
    },
  })
}

export function useDeleteCoupon() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => couponService.deleteCoupon(id),
    onSuccess: () => {
      toast.success("Coupon supprimé", {
        description: "Le coupon a été supprimé avec succès",
      })
      queryClient.invalidateQueries({ queryKey: couponKeys.all })
    },
    onError: (error: any) => {
      const errorMessage =
        error?.data?.message || error?.message || "Erreur lors de la suppression du coupon"
      toast.error("Erreur", { description: errorMessage })
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
