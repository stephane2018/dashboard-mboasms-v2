import { httpClient } from "@/core/lib/http-client"
import { refractHttpError } from "@/core/utils/http-error"
import type {
  SenderId,
  PaginatedSenderIds,
  CreateSenderIdInput,
  UpdateSenderIdInput,
  UpdateSenderIdStatusInput,
  SenderIdQueryParams,
} from "@/modules/sender-id/types"

/**
 * Sender ID Service
 *
 * REQUIRED BACKEND ENDPOINTS:
 *
 * 1. GET /api/v1/sender-ids?status={status}&page={page}&size={size}
 *    - Get all sender IDs (requires SUPER_ADMIN)
 *    - Query params: status (EN_ATTENTE|VALIDE|REJETE), page, size
 *    - Returns: PaginatedSenderIds
 *
 * 2. GET /api/v1/sender-ids/enterprise/{enterpriseId}?status={status}&page={page}&size={size}
 *    - Get sender IDs by enterprise (requires ADMIN)
 *    - Path param: enterpriseId
 *    - Query params: status, page, size
 *    - Returns: PaginatedSenderIds
 *
 * 3. GET /api/v1/sender-ids/{id}
 *    - Get single sender ID by ID
 *    - Path param: id
 *    - Returns: SenderId
 *
 * 4. POST /api/v1/sender-ids
 *    - Create new sender ID
 *    - Body: { name: string, description: string, enterpriseId: string }
 *    - Returns: SenderId
 *
 * 5. PUT /api/v1/sender-ids/{id}
 *    - Update sender ID
 *    - Path param: id
 *    - Body: { name: string, description: string }
 *    - Returns: SenderId
 *
 * 6. PUT /api/v1/sender-ids/{id}/status
 *    - Update sender ID status
 *    - Path param: id
 *    - Body: { status: "EN_ATTENTE"|"VALIDE"|"REJETE", rejectionReason?: string }
 *    - Returns: SenderId
 *
 * 7. DELETE /api/v1/sender-ids/{id}
 *    - Delete sender ID
 *    - Path param: id
 *    - Returns: void
 */

export const senderIdService = {
  async getAllSenderIds(params?: SenderIdQueryParams): Promise<PaginatedSenderIds> {
    try {
      const queryParams = new URLSearchParams()
      if (params?.status) queryParams.append("status", params.status)
      if (params?.page !== undefined) queryParams.append("page", params.page.toString())
      if (params?.size !== undefined) queryParams.append("size", params.size.toString())

      const queryString = queryParams.toString()
      const url = `/api/v1/sender-ids${queryString ? `?${queryString}` : ""}`
  
      const result = await httpClient.get<PaginatedSenderIds>(url)
      return result
    } catch (error) {
      return Promise.reject(refractHttpError(error))
    }
  },

  async getSenderIdById(id: string): Promise<SenderId[]> {
    try {
      return await httpClient.get<SenderId[]>(`/api/v1/sender-ids/enterprise/${id}`)
    } catch (error) {
      return Promise.reject(refractHttpError(error))
    }
  },

  async getSenderIdsByEnterprise(
    enterpriseId: string,
  ): Promise<SenderId[]> {
    try {
      const url = `/api/v1/sender-ids/enterprise/${enterpriseId}`
      const result = await httpClient.get<SenderId[]>(url)
      return result
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
