import { httpClient } from "@/core/lib/http-client"
import { refractHttpError } from "@/core/utils/http-error"
import type {
  ApiKey,
  CreateApiKeyInput,
  CreateApiKeyResponse,
} from "@/modules/api-key/types"

export const apiKeyService = {
  async listApiKeys(): Promise<ApiKey[]> {
    try {
      return await httpClient.get<ApiKey[]>(
        "/api/v1/developer/sms/api-keys"
      )
    } catch (error) {
      return Promise.reject(refractHttpError(error))
    }
  },

  async createApiKey(input: CreateApiKeyInput): Promise<CreateApiKeyResponse> {
    try {
      return await httpClient.post<CreateApiKeyResponse>(
        "/api/v1/developer/sms/api-keys",
        input as any
      )
    } catch (error) {
      return Promise.reject(refractHttpError(error))
    }
  },

  async deleteApiKey(id: string): Promise<void> {
    try {
      return await httpClient.delete(`/api/v1/developer/sms/api-keys/${id}`)
    } catch (error) {
      return Promise.reject(refractHttpError(error))
    }
  },
}
