"use client"

import { useState, useEffect, useCallback } from "react"
import { groupsService } from "@/core/services/groups.service"
import { getEnterprises } from "@/core/services/enterprise.service"
import type { Group } from "@/modules/groups/types"
import type { EnterpriseType } from "@/core/models/enterprise"
import { useAuthContext } from "@/core/providers"
import { Role } from "@/core/config/enum"

interface UseGroupsOptions {
    enterpriseId?: string
    autoLoad?: boolean
    withEnterprises?: boolean
}

export type GroupWithEnterprise = Group & { enterpriseFull?: EnterpriseType }

export function useGroups(options: UseGroupsOptions = {}) {
    const { user } = useAuthContext()
    const _isSuperAdmin = user?.role === Role.SUPER_ADMIN
    const enterpriseId = options.enterpriseId || user?.companyId || ""
    const autoLoad = options.autoLoad ?? true
    const withEnterprises = options.withEnterprises ?? false

    const [groups, setGroups] = useState<GroupWithEnterprise[]>([])
    const [enterprises, setEnterprises] = useState<EnterpriseType[]>([])
    const [isLoading, setIsLoading] = useState(false)
    const [isMutating, setIsMutating] = useState(false)
    const [error, setError] = useState<string | null>(null)

    // Keep a ref-like value for enterprise enrichment
    const enrichWithEnterprises = useCallback(
        (rawGroups: Group[], enterpriseList: EnterpriseType[]): GroupWithEnterprise[] => {
            if (!enterpriseList.length) return rawGroups
            return rawGroups.map((g) => ({
                ...g,
                enterpriseFull: enterpriseList.find((e) => e.id === g.enterprise),
            }))
        },
        []
    )

    // Load enterprises (SUPER_ADMIN only)
    const loadEnterprises = useCallback(async (): Promise<EnterpriseType[]> => {
        try {
            const data = await getEnterprises()
            setEnterprises(data)
            return data
        } catch {
            setEnterprises([])
            return []
        }
    }, [])

    // Load groups — role-aware
    const loadGroups = useCallback(async (enterpriseList?: EnterpriseType[]) => {
        setIsLoading(true)
        setError(null)
        try {
            let rawGroups: Group[]

            if (_isSuperAdmin) {
                rawGroups = await groupsService.getAllGroups()
            } else if (enterpriseId) {
                rawGroups = await groupsService.getGroupsByEnterprise(enterpriseId)
            } else {
                setGroups([])
                return
            }

            const list = enterpriseList ?? enterprises
            setGroups(enrichWithEnterprises(rawGroups, list))
        } catch (err: any) {
            const errorMessage =
                err?.data?.message || err?.message || err?.error || "Erreur lors du chargement des groupes"
            const errorStatus = err?.status || err?.response?.status

            if (errorStatus === 404 || errorMessage.includes("404")) {
                setGroups([])
            } else {
                setError(errorMessage)
                setGroups([])
            }
        } finally {
            setIsLoading(false)
        }
    }, [_isSuperAdmin, enterpriseId, enterprises, enrichWithEnterprises])

    // Auto load on mount
    useEffect(() => {
        if (!autoLoad) return

        if (_isSuperAdmin && withEnterprises) {
            // Load enterprises first, then groups (so we can enrich)
            loadEnterprises().then((entList) => loadGroups(entList))
        } else if (_isSuperAdmin || enterpriseId) {
            loadGroups()
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [autoLoad, _isSuperAdmin, enterpriseId, withEnterprises])

    // Create a new group
    const handleCreateGroup = useCallback(
        async (data: { name: string; code: string; enterpriseId?: string }) => {
            const targetEnterpriseId = data.enterpriseId || (!_isSuperAdmin ? enterpriseId : "")
            if (!targetEnterpriseId) throw new Error("Enterprise ID is required")

            setIsMutating(true)
            setError(null)
            try {
                const created = await groupsService.createGroup({
                    name: data.name,
                    code: data.code,
                    enterpriseId: targetEnterpriseId,
                })
                const enriched: GroupWithEnterprise = {
                    ...created,
                    enterpriseFull: enterprises.find((e) => e.id === targetEnterpriseId),
                }
                setGroups((prev) => [...prev, enriched])
                return enriched
            } catch (err) {
                setError("Erreur lors de la création du groupe")
                throw err
            } finally {
                setIsMutating(false)
            }
        },
        [_isSuperAdmin, enterpriseId, enterprises]
    )

    // Delete a group
    const handleDeleteGroup = useCallback(async (groupId: string) => {
        setIsMutating(true)
        setError(null)
        try {
            await groupsService.deleteGroup(groupId)
            setGroups((prev) => prev.filter((g) => g.id !== groupId))
        } catch (err) {
            setError("Erreur lors de la suppression du groupe")
            throw err
        } finally {
            setIsMutating(false)
        }
    }, [])

    // Add contacts to a group (optimistic update)
    const handleAddContactsToGroup = useCallback(
        async (groupId: string, contactIds: string[], contacts?: any[]) => {
            const previousGroups = groups
            setIsMutating(true)
            setError(null)

            // Optimistic update if full contact objects are provided
            if (contacts?.length) {
                setGroups((prev) =>
                    prev.map((group) => {
                        if (group.id !== groupId) return group
                        const existing = group.enterpriseContacts || []
                        const merged = [
                            ...existing,
                            ...contacts.filter((c) => !existing.some((e) => e.id === c.id)),
                        ]
                        return { ...group, enterpriseContacts: merged }
                    })
                )
            }

            try {
                await groupsService.addContactsToGroup(groupId, contactIds)
            } catch (err) {
                setGroups(previousGroups)
                setError("Erreur lors de l'ajout des contacts au groupe")
                throw err
            } finally {
                setIsMutating(false)
            }
        },
        [groups]
    )

    // Remove a contact from a group
    const handleRemoveContactFromGroup = useCallback(
        async (groupId: string, contactId: string) => {
            setIsMutating(true)
            setError(null)
            try {
                await groupsService.removeContactFromGroup(groupId, contactId)
                // Reload to get fresh data
                await loadGroups()
            } catch (err) {
                setError("Erreur lors de la suppression du contact")
                throw err
            } finally {
                setIsMutating(false)
            }
        },
        [loadGroups]
    )

    return {
        groups,
        enterprises,
        isLoading,
        isMutating,
        error,
        _isSuperAdmin,
        loadGroups: () => loadGroups(),
        loadEnterprises,
        createGroup: handleCreateGroup,
        deleteGroup: handleDeleteGroup,
        addContactsToGroup: handleAddContactsToGroup,
        removeContactFromGroup: handleRemoveContactFromGroup,
        setGroups,
    }
}
