"use client"

import { useState, useEffect, useCallback } from "react"
import { getGroupByEnterprise, createGroup, updateGroup, deleteGroup, addContactsToGroup, getGroups } from "@/core/services/group.service"
import type { CreateGroupType, GroupType } from "@/core/models/groups"
import { useAuthContext } from "@/core/providers"

type UseGroupsMode = "enterprise" | "all"

interface UseGroupsOptions {
    enterpriseId?: string
    autoLoad?: boolean
    mode?: UseGroupsMode
    fetchAll?: boolean
}

export function useGroups(options: UseGroupsOptions = {}) {
    const { user } = useAuthContext()
    const enterpriseId = options.enterpriseId || user?.companyId || ""
    const autoLoad = options.autoLoad ?? true
    const mode: UseGroupsMode = options.mode ?? "enterprise"
    const fetchAll = options.fetchAll ?? false

    const [groups, setGroups] = useState<GroupType[]>([])
    const [isLoading, setIsLoading] = useState(false)
    const [isCreating, setIsCreating] = useState(false)
    const [isUpdating, setIsUpdating] = useState(false)
    const [isDeleting, setIsDeleting] = useState(false)
    const [isAddingContacts, setIsAddingContacts] = useState(false)
    const [error, setError] = useState<string | null>(null)

    // Load groups
    const loadGroups = useCallback(async () => {
        if (!fetchAll && mode === "enterprise" && !enterpriseId) return
        setIsLoading(true)
        setError(null)
        try {
            const data = fetchAll || mode === "all"
                ? await getGroups()
                : await getGroupByEnterprise(enterpriseId)
            setGroups(Array.isArray(data) ? data : [])
        } catch (err) {
            console.error("Error loading groups:", err)
            setError("Erreur lors du chargement des groupes")
            setGroups([])
        } finally {
            setIsLoading(false)
        }
    }, [enterpriseId, fetchAll, mode])

    // Auto load on mount
    useEffect(() => {
        if (!autoLoad) return

        if (fetchAll || mode === "all") {
            loadGroups()
            return
        }

        if (enterpriseId) {
            loadGroups()
        }
    }, [autoLoad, enterpriseId, loadGroups, mode, fetchAll])

    // Create a new group
    const handleCreateGroup = useCallback(async (data: { name: string; code: string; enterpriseId?: string }) => {
        const targetEnterpriseId = data.enterpriseId ?? enterpriseId
        if (!targetEnterpriseId) throw new Error("Enterprise ID is required")

        setIsCreating(true)
        setError(null)
        try {
            const { enterpriseId: overrideEnterpriseId, ...rest } = data
            const payload: CreateGroupType = {
                ...rest,
                enterpriseId: targetEnterpriseId,
            }
            const newGroup = await createGroup(payload)
            setGroups(prev => [...prev, newGroup])
            return newGroup
        } catch (err) {
            console.error("Error creating group:", err)
            setError("Erreur lors de la création du groupe")
            throw err
        } finally {
            setIsCreating(false)
        }
    }, [enterpriseId])

    // Update a group
    const handleUpdateGroup = useCallback(async (groupId: string, data: { name?: string; code?: string; enterpriseId?: string }) => {
        const targetEnterpriseId = data.enterpriseId ?? enterpriseId
        if (!targetEnterpriseId) throw new Error("Enterprise ID is required")

        setIsUpdating(true)
               setError(null)
        try {
            const { enterpriseId: overrideEnterpriseId, ...rest } = data
            const updatedGroup = await updateGroup(groupId, {
                ...rest,
                enterpriseId: targetEnterpriseId,
            })
            setGroups(prev => prev.map(g => g.id === groupId ? updatedGroup : g))
            return updatedGroup
        } catch (err) {
            console.error("Error updating group:", err)
            setError("Erreur lors de la mise à jour du groupe")
            throw err
        } finally {
            setIsUpdating(false)
        }
    }, [enterpriseId])

    // Delete a group
    const handleDeleteGroup = useCallback(async (groupId: string) => {
        setIsDeleting(true)
        setError(null)
        try {
            await deleteGroup(groupId)
            setGroups(prev => prev.filter(g => g.id !== groupId))
        } catch (err) {
            console.error("Error deleting group:", err)
            setError("Erreur lors de la suppression du groupe")
            throw err
        } finally {
            setIsDeleting(false)
        }
    }, [])

    // Add contacts to a group
    const handleAddContactsToGroup = useCallback(async (groupId: string, contactIds: string[]) => {
        setIsAddingContacts(true)
        setError(null)
        try {
            await addContactsToGroup(groupId, contactIds)
        } catch (err) {
            console.error("Error adding contacts to group:", err)
            setError("Erreur lors de l'ajout des contacts au groupe")
            throw err
        } finally {
            setIsAddingContacts(false)
        }
    }, [])

    return {
        groups,
        isLoading,
        isCreating,
        isUpdating,
        isDeleting,
        isAddingContacts,
        error,
        loadGroups,
        createGroup: handleCreateGroup,
        updateGroup: handleUpdateGroup,
        deleteGroup: handleDeleteGroup,
        addContactsToGroup: handleAddContactsToGroup,
    }
}
