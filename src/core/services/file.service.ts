import { httpClient } from "@/core/lib/http-client"
import { refractHttpError } from "@/core/utils/http-error"

export interface FileUploadResponse {
  url: string
}

export const fileService = {
  async uploadFile(file: File): Promise<string> {
    try {
      const formData = new FormData()
      formData.append("file", file)
      const response = await httpClient.post<FileUploadResponse>(
        "/api/v1/file",
        formData
      )
      return response.url
    } catch (error) {
      return Promise.reject(refractHttpError(error))
    }
  },
}
