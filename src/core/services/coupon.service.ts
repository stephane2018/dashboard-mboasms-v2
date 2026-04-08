import { httpClient } from "@/core/lib/http-client"
import { refractHttpError } from "@/core/utils/http-error"
import type {
  Coupon,
  PaginatedCoupons,
  CreateCouponInput,
  UpdateCouponInput,
} from "@/modules/coupon/types"

export const couponService = {
  async getActiveCoupons(page: number, size: number): Promise<PaginatedCoupons> {
    try {
      const queryParams = new URLSearchParams()
      queryParams.append("page", page.toString())
      queryParams.append("size", size.toString())

      return await httpClient.get<PaginatedCoupons>(
        `/api/v1/coupons/active?${queryParams.toString()}`
      )
    } catch (error) {
      return Promise.reject(refractHttpError(error))
    }
  },

  async createCoupon(input: CreateCouponInput): Promise<Coupon> {
    try {
      return await httpClient.post<Coupon>("/api/v1/coupons", input)
    } catch (error) {
      return Promise.reject(refractHttpError(error))
    }
  },

  async updateCoupon(id: string, input: UpdateCouponInput): Promise<Coupon> {
    try {
      return await httpClient.put<Coupon>(`/api/v1/coupons/${id}`, input)
    } catch (error) {
      return Promise.reject(refractHttpError(error))
    }
  },

  async deleteCoupon(id: string): Promise<void> {
    try {
      return await httpClient.delete(`/api/v1/coupons/${id}`)
    } catch (error) {
      return Promise.reject(refractHttpError(error))
    }
  },

  async verifyCouponByCode(code: string): Promise<Coupon> {
    try {
      return await httpClient.get<Coupon>(`/api/v1/coupons/code/${code}`)
    } catch (error) {
      return Promise.reject(refractHttpError(error))
    }
  },
}
