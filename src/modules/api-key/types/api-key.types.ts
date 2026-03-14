export interface ApiKey {
  id: string
  apiKey: string
  name: string
  description: string | null
  enterpriseId: string
  createdAt: string
}

export type CreateApiKeyInput = {
  name: string
}

export interface CreateApiKeyResponse {
  id: string
  apiKey: string
  name: string
  description: string | null
  enterpriseId: string
  createdAt: string
}
