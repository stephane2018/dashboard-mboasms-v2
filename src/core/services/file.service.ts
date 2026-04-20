import { httpClient } from "@/core/lib/http-client"
import { refractHttpError } from "@/core/utils/http-error"

export type FileType =
  | "USER_PROFILE"
  | "ARTICLE"
  | "PROVIDER"
  | "CHANTIER"
  | "COUNTRY"
  | "PROJECT"
  | "OTHER_IMAGE"

export interface FileUploadResponse {
  url: string
}

export const fileService = {
  async uploadFile(file: File, fileType: FileType = "OTHER_IMAGE"): Promise<string> {
    try {
      const formData = new FormData()
      formData.append("file", file)
      formData.append("fileType", fileType)
      const response = await httpClient.post<FileUploadResponse | string>(
        "/api/v1/file",
        formData
      )

      // Handle direct string URL response
      if (typeof response === "string") {
        return response
      }

      // Handle object with url property
      if (response && typeof response === "object" && "url" in response) {
        return response.url
      }

      throw new Error(`Unexpected response format: ${JSON.stringify(response)}`)
    } catch (error) {
      return Promise.reject(refractHttpError(error))
    }
  },
}
