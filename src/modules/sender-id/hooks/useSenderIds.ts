"use client"

import { useCallback, useEffect, useState } from "react"
import { useAuthContext } from "@/core/providers"
import { senderIdService } from "../services"
import type { PaginatedSenderIds, SenderIdQueryParams } from "../types"

type UseSenderIdsOptions = {
  enterpriseId?: string
  autoLoad?: boolean
} & SenderIdQueryParams

export function useSenderIds(options: UseSenderIdsOptions = {}) {
  const { user } = useAuthContext()
  const enterpriseId = options.enterpriseId || user?.companyId || ""
  const autoLoad = options.autoLoad ?? true

  const [data, setData] = useState<PaginatedSenderIds | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const loadSenderIds = useCallback(async (params?: SenderIdQueryParams) => {
    if (!enterpriseId) return

    setIsLoading(true)
    setError(null)
    try {
      const result = await senderIdService.getSenderIdsByEnterprise(enterpriseId, {
        status: params?.status || options.status,
        page: params?.page ?? options.page,
        size: params?.size ?? options.size,
      })
      setData(result)
    } catch (err) {
      console.error("Error loading sender IDs:", err)
      setError("Erreur lors du chargement des Sender IDs")
      setData(null)
    } finally {
      setIsLoading(false)
    }
  }, [enterpriseId, options.status, options.page, options.size])

  useEffect(() => {
    if (autoLoad && enterpriseId) {
      loadSenderIds()
    }
  }, [autoLoad, enterpriseId, loadSenderIds])

  return {
    data,
    senderIds: data?.content || [],
    isLoading,
    error,
    enterpriseId,
    loadSenderIds,
    totalPages: data?.totalPages || 0,
    totalElements: data?.totalElements || 0,
  }
}
