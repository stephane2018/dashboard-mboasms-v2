"use client"

import { useCallback, useEffect, useState } from "react"
import { useAuthContext } from "@/core/providers"
import { senderIdService } from "@/core/services/sender-id.service"
import type { SenderId, PaginatedSenderIds, SenderIdQueryParams } from "@/modules/sender-id/types"
import { Role } from "@/core/config/enum"

type UseSenderIdsOptions = {
  enterpriseId?: string
  autoLoad?: boolean
  loadAll?: boolean
} & SenderIdQueryParams

export function useSenderIds(options: UseSenderIdsOptions = {}) {
  const { user } = useAuthContext()
  const _isSuperAdmin = user?.role === Role.SUPER_ADMIN
  const enterpriseId = options.enterpriseId || user?.companyId || ""
  const autoLoad = options.autoLoad ?? true
  const loadAll = options.loadAll ?? _isSuperAdmin

  const [paginatedData, setPaginatedData] = useState<PaginatedSenderIds | null>(null)
  const [arrayData, setArrayData] = useState<SenderId[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const loadSenderIds = useCallback(async (params?: SenderIdQueryParams) => {
    setIsLoading(true)
    setError(null)
    try {
      if (loadAll) {
        const result = await senderIdService.getAllSenderIds({
          status: params?.status || options.status,
          page: params?.page ?? options.page,
          size: params?.size ?? options.size,
        })
        setPaginatedData(result)
        setArrayData(result.content || [])
      } else {
        if (!enterpriseId) {
          setError("Enterprise ID non disponible")
          setIsLoading(false)
          return
        }
        const result = await senderIdService.getSenderIdsByEnterprise(enterpriseId)
        setPaginatedData(null)
        setArrayData(result || [])
      }
    } catch (err: any) {
      const errorMessage = err?.message || err?.error || "Erreur lors du chargement des Sender IDs"
      setError(errorMessage)
      setPaginatedData(null)
      setArrayData([])
    } finally {
      setIsLoading(false)
    }
  }, [enterpriseId, loadAll, options.status, options.page, options.size])

  useEffect(() => {
    if (autoLoad && (enterpriseId || loadAll)) {
      loadSenderIds()
    }
  }, [autoLoad, enterpriseId, loadAll, loadSenderIds])

  return {
    data: paginatedData,
    senderIds: arrayData,
    isLoading,
    error,
    enterpriseId,
    loadSenderIds,
    totalPages: paginatedData?.totalPages || 0,
    totalElements: loadAll ? (paginatedData?.totalElements || 0) : arrayData.length,
  }
}
