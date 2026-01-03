import { httpClient } from "@/core/lib/http-client"
import { refractHttpError } from "@/core/utils/http-error"
import type {
  SenderId,
  PaginatedSenderIds,
  CreateSenderIdInput,
  UpdateSenderIdInput,
  UpdateSenderIdStatusInput,
  SenderIdQueryParams,
} from "../types"

export const senderIdService = {
  async getSenderIdById(id: string): Promise<SenderId> {
    try {
      return await httpClient.get<SenderId>(`/api/v1/sender-ids/${id}`)
    } catch (error) {
      return Promise.reject(refractHttpError(error))
    }
  },

  async getSenderIdsByEnterprise(
    enterpriseId: string,
    params?: SenderIdQueryParams
  ): Promise<PaginatedSenderIds> {
    try {
      const queryParams = new URLSearchParams()
      if (params?.status) queryParams.append("status", params.status)
      if (params?.page !== undefined) queryParams.append("page", params.page.toString())
      if (params?.size !== undefined) queryParams.append("size", params.size.toString())

      const queryString = queryParams.toString()
      const url = `/api/v1/sender-ids/enterprise/${enterpriseId}${queryString ? `?${queryString}` : ""}`

      return await httpClient.get<PaginatedSenderIds>(url)
    } catch (error) {
      return Promise.reject(refractHttpError(error))
    }
  },

  async createSenderId(input: CreateSenderIdInput): Promise<SenderId> {
    try {
      return await httpClient.post<SenderId>("/api/v1/sender-ids", input as any)
    } catch (error) {
      return Promise.reject(refractHttpError(error))
    }
  },

  async updateSenderId(id: string, input: UpdateSenderIdInput): Promise<SenderId> {
    try {
      return await httpClient.put<SenderId>(`/api/v1/sender-ids/${id}`, input as any)
    } catch (error) {
      return Promise.reject(refractHttpError(error))
    }
  },

  async updateSenderIdStatus(id: string, input: UpdateSenderIdStatusInput): Promise<SenderId> {
    try {
      return await httpClient.put<SenderId>(`/api/v1/sender-ids/${id}/status`, input as any)
    } catch (error) {
      return Promise.reject(refractHttpError(error))
    }
  },

  async deleteSenderId(id: string): Promise<void> {
    try {
      return await httpClient.delete(`/api/v1/sender-ids/${id}`)
    } catch (error) {
      return Promise.reject(refractHttpError(error))
    }
  },
}
