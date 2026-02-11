import type { PaginatedResponse } from "@/core/models/common"

export interface Coupon {
  id: string
  name: string
  description: string
  validFrom: string
  validTo: string
  code: string
  percentage: number
  userId: string
  createdAt: string
  updatedAt: string
}

export type CreateCouponInput = {
  name: string
  description: string
  validFrom: string
  validTo: string
  code: string
  percentage: number
  userId: string
}

export type UpdateCouponInput = {
  name: string
  description: string
  validFrom: string
  validTo: string
  code: string
  percentage: number
  userId: string
}

export type PaginatedCoupons = PaginatedResponse<Coupon>
