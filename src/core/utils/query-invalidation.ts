/**
 * Query invalidation utilities based on user roles
 * Centralizes query cache invalidation logic for different user roles
 */

import type { QueryClient } from "@tanstack/react-query"
import { Role } from "@/core/config/enum"
import { useUserStore } from "@/core/stores"

/**
 * Query keys for different entities
 */
export const queryKeys = {
  contacts: {
    all: ["contacts"] as const,
    lists: () => [...queryKeys.contacts.all, "list"] as const,
    list: (filters?: Record<string, any>) => [...queryKeys.contacts.lists(), filters] as const,
    details: () => [...queryKeys.contacts.all, "detail"] as const,
    detail: (id: string) => [...queryKeys.contacts.details(), id] as const,
  },
  users: {
    all: ["users"] as const,
    lists: () => [...queryKeys.users.all, "list"] as const,
    list: (filters?: Record<string, any>) => [...queryKeys.users.lists(), filters] as const,
    details: () => [...queryKeys.users.all, "detail"] as const,
    detail: (id: string) => [...queryKeys.users.details(), id] as const,
  },
  enterprises: {
    all: ["enterprises"] as const,
    lists: () => [...queryKeys.enterprises.all, "list"] as const,
    list: (filters?: Record<string, any>) => [...queryKeys.enterprises.lists(), filters] as const,
    details: () => [...queryKeys.enterprises.all, "detail"] as const,
    detail: (id: string) => [...queryKeys.enterprises.details(), id] as const,
  },
} as const

/**
 * Get current user role
 */
function getCurrentUserRole(): Role | null {
  if (typeof window === "undefined") return null
  const { user } = useUserStore.getState()
  return user?.role || null
}

/**
 * Invalidate queries based on user role
 * Different roles have different data access levels
 *
 * @param queryClient - TanStack Query client
 * @param entityType - Type of entity (contacts, users, enterprises)
 * @param options - Additional options for invalidation
 */
export async function invalidateQueriesByRole(
  queryClient: QueryClient,
  entityType: "contacts" | "users" | "enterprises",
  options?: {
    specificId?: string
    includeRelated?: boolean
  }
): Promise<void> {
  const userRole = getCurrentUserRole()

  if (!userRole) {
    console.warn("No user role found, skipping query invalidation")
    return
  }

  try {
    switch (userRole) {
      case Role.SUPER_ADMIN:
        // Super admin can see everything - invalidate all queries
        await queryClient.invalidateQueries({
          queryKey: queryKeys[entityType].all,
        })
        if (options?.includeRelated) {
          // Also invalidate related entities
          await queryClient.invalidateQueries({
            queryKey: queryKeys.enterprises.all,
          })
        }
        break

      case Role.ADMIN:
        // Admin can see enterprise data - invalidate enterprise-level queries
        await queryClient.invalidateQueries({
          queryKey: queryKeys[entityType].lists(),
        })
        if (options?.specificId) {
          await queryClient.invalidateQueries({
            queryKey: queryKeys[entityType].detail(options.specificId),
          })
        }
        break

      case Role.USER:
        // Regular user can only see their own data - invalidate specific queries
        if (options?.specificId) {
          await queryClient.invalidateQueries({
            queryKey: queryKeys[entityType].detail(options.specificId),
          })
        } else {
          // For list queries, only invalidate if it's their own data
          await queryClient.invalidateQueries({
            queryKey: queryKeys[entityType].lists(),
          })
        }
        break

      default:
        console.warn(`Unknown role: ${userRole}`)
    }
  } catch (error) {
    console.error("Error invalidating queries:", error)
    throw error
  }
}

/**
 * Invalidate contact queries based on user role
 * Shorthand for invalidating contact-related queries
 *
 * @param queryClient - TanStack Query client
 * @param contactId - Optional specific contact ID to invalidate
 */
export async function invalidateContactQueries(
  queryClient: QueryClient,
  contactId?: string
): Promise<void> {
  await invalidateQueriesByRole(queryClient, "contacts", {
    specificId: contactId,
    includeRelated: false,
  })
}

/**
 * Invalidate user queries based on user role
 * Shorthand for invalidating user-related queries
 *
 * @param queryClient - TanStack Query client
 * @param userId - Optional specific user ID to invalidate
 */
export async function invalidateUserQueries(
  queryClient: QueryClient,
  userId?: string
): Promise<void> {
  await invalidateQueriesByRole(queryClient, "users", {
    specificId: userId,
    includeRelated: true,
  })
}

/**
 * Invalidate enterprise queries based on user role
 * Shorthand for invalidating enterprise-related queries
 *
 * @param queryClient - TanStack Query client
 * @param enterpriseId - Optional specific enterprise ID to invalidate
 */
export async function invalidateEnterpriseQueries(
  queryClient: QueryClient,
  enterpriseId?: string
): Promise<void> {
  await invalidateQueriesByRole(queryClient, "enterprises", {
    specificId: enterpriseId,
    includeRelated: true,
  })
}

/**
 * Invalidate multiple query types at once
 * Useful for operations that affect multiple entities
 *
 * @param queryClient - TanStack Query client
 * @param entityTypes - Array of entity types to invalidate
 */
export async function invalidateMultipleQueries(
  queryClient: QueryClient,
  entityTypes: Array<"contacts" | "users" | "enterprises">
): Promise<void> {
  await Promise.all(
    entityTypes.map((entityType) =>
      invalidateQueriesByRole(queryClient, entityType, {
        includeRelated: true,
      })
    )
  )
}

/**
 * Check if user can perform action based on role
 *
 * @param action - Action to check (create, read, update, delete)
 * @param entityType - Type of entity
 * @returns true if user can perform action
 */
export function canPerformAction(
  action: "create" | "read" | "update" | "delete",
  entityType: "contacts" | "users" | "enterprises"
): boolean {
  const userRole = getCurrentUserRole()

  if (!userRole) return false

  const permissions: Record<Role, Record<string, boolean>> = {
    [Role.SUPER_ADMIN]: {
      create: true,
      read: true,
      update: true,
      delete: true,
    },
    [Role.ADMIN]: {
      create: true,
      read: true,
      update: true,
      delete: entityType !== "users", // Admins can't delete users
    },
    [Role.USER]: {
      create: entityType === "contacts", // Users can only create contacts
      read: true,
      update: entityType === "contacts", // Users can only update their own contacts
      delete: false,
    },
  }

  return permissions[userRole]?.[action] ?? false
}
