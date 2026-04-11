"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { i18next } from "@/core/lib/i18n"
import { useAuthContext } from "@/core/providers"
import { groupsService } from "@/core/services/groups.service"
import type { Group } from "@/modules/groups/types"

export function useGroups(options: { enterpriseId?: string; autoLoad?: boolean } = {}) {
  const { user } = useAuthContext()
  const enterpriseId = options.enterpriseId || user?.companyId || ""
  const autoLoad = options.autoLoad ?? true

  const [groups, setGroups] = useState<Group[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const effectCount = useRef(0)

  const loadGroups = useCallback(async () => {
    if (!enterpriseId) return

    setIsLoading(true)
    setError(null)
    try {
      const data = await groupsService.getGroupsByEnterprise(enterpriseId)
      setGroups(Array.isArray(data) ? data : [])
    } catch (err) {
      setError(i18next.t('groups.loadError'))
      setGroups([])
    } finally {
      setIsLoading(false)
    }
  }, [enterpriseId])

  useEffect(() => {
    effectCount.current++
    console.log(`[useGroups] useEffect fires #${effectCount.current}`, { autoLoad, enterpriseId })
    if (effectCount.current > 15) console.error('[useGroups] POSSIBLE LOOP - useEffect fires too many times')
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

export function useDeleteContactFromGroup() {
  const [isDeleting, setIsDeleting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const deleteContactFromGroup = useCallback(async (groupId: string, contactId: string) => {
    setIsDeleting(true)
    setError(null)
    try {
      await groupsService.deleteContactFromGroup(groupId, contactId)
      return true
    } catch (err: any) {
      const errorMessage = err?.message || i18next.t('groups.deleteContactError')
      setError(errorMessage)
      throw err
    } finally {
      setIsDeleting(false)
    }
  }, [])

  return {
    deleteContactFromGroup,
    isDeleting,
    error,
    clearError: () => setError(null),
  }
}
