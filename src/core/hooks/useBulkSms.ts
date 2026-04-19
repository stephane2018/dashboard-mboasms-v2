import { useMutation, useQuery } from "@tanstack/react-query"
import { httpClient } from "@/core/lib/http-client"
import { refractHttpError } from "@/core/utils/http-error"

export interface BulkSmsJob {
  jobId: string
  status: "PENDING" | "PROCESSING" | "COMPLETED" | "PARTIAL" | "FAILED"
  totalRecipients: number
  successCount: number
  failedCount: number
  senderId: string
  createdAt: string
  completedAt?: string
  errorMessage?: string
  statusUrl: string
}

export interface BulkSmsJobsResponse {
  content: BulkSmsJob[]
  totalElements: number
  totalPages: number
  currentPage: number
  size: number
}

export function useBulkSmsSend() {
  return useMutation<BulkSmsJob, Error, { file: File; message: string; senderId?: string }>({
    mutationFn: async ({ file, message, senderId }) => {
      try {
        const formData = new FormData()
        formData.append("file", file)

        const params = new URLSearchParams()
        params.append("message", message)
        if (senderId) {
          params.append("senderId", senderId)
        }

        const response = await httpClient.post<BulkSmsJob>(
          `/api/v1/developer/sms/send-bulk?${params.toString()}`,
          formData
        )
        return response
      } catch (error: any) {
        throw refractHttpError(error) || new Error("Erreur lors de l'envoi en masse")
      }
    },
  })
}

export function useBulkSmsJobs(page: number = 0, size: number = 20) {
  return useQuery<BulkSmsJobsResponse, Error>({
    queryKey: ["bulk-sms-jobs", page, size],
    queryFn: async () => {
      const response = await httpClient.get<BulkSmsJobsResponse>(
        `/api/v1/developer/sms/jobs?page=${page}&size=${size}`
      )
      return response
    },
    staleTime: 10000,
  })
}

export function useBulkSmsJobStatus(jobId: string) {
  return useQuery<BulkSmsJob, Error>({
    queryKey: ["bulk-sms-job", jobId],
    queryFn: async () => {
      const response = await httpClient.get<BulkSmsJob>(
        `/api/v1/developer/sms/jobs/${jobId}`
      )
      return response
    },
    staleTime: 5000,
  })
}
