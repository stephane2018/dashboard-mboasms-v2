"use client"

import { useCallback, useEffect, useState } from "react"
import { useAuthContext } from "@/core/providers"
import { groupsService } from "../services"
import type { Group } from "../types"

export function useGroups(options: { enterpriseId?: string; autoLoad?: boolean } = {}) {
  const { user } = useAuthContext()
  const enterpriseId = options.enterpriseId || user?.companyId || ""
  const autoLoad = options.autoLoad ?? true

  const [groups, setGroups] = useState<Group[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const loadGroups = useCallback(async () => {
    if (!enterpriseId) return

    setIsLoading(true)
    setError(null)
    try {
      const data = await groupsService.getGroupsByEnterprise(enterpriseId)
      setGroups(Array.isArray(data) ? data : [])
    } catch (err) {
      console.error("Error loading groups:", err)
      setError("Erreur lors du chargement des groupes")
      setGroups([])
    } finally {
      setIsLoading(false)
    }
  }, [enterpriseId])

  useEffect(() => {
    if (autoLoad && enterpriseId) {
      loadGroups()
    }
  }, [autoLoad, enterpriseId, loadGroups])

  return {
    groups,
    isLoading,
    error,
    enterpriseId,
    loadGroups,
    setGroups,
  }
}
