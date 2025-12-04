import { Role } from "@/core/config/enum"
import { useUserStore } from "@/core/stores"

export type UserRole = "ADMIN" | "MANAGER" | "SELLER" | "SUPER_ADMIN" | "USER"

export const normalizeRole = (backendRole: string): UserRole => {
  const roleLower = backendRole.toLowerCase().trim()

  const roleMap: Record<string, UserRole> = {
    'admin': 'ADMIN',
    'administrateur': 'ADMIN',
    'administrator': 'ADMIN',
    'manager': 'MANAGER',
    'gestionnaire': 'MANAGER',
    'seller': 'SELLER',
    'caissier': 'SELLER',
    'cashier': 'SELLER',
    'e-commercant': 'SELLER',
    'ecommercant': 'SELLER',
    'merchant': 'SELLER',
    'super_admin': 'SUPER_ADMIN',
    'superadmin': 'SUPER_ADMIN',
    'user': 'USER',
    'client': 'USER',
  }

  return roleMap[roleLower] || 'USER'
}

// Legacy function for backward compatibility
export const getRoleFromLocalStorage = (): UserRole | null => {
  try {
    const role = localStorage.getItem("caisse-post-role")
    if (!role) return null
    return normalizeRole(role)
  } catch (error) {
    console.error("Error getting role from localStorage:", error)
    return null
  }
}

// New function using Zustand store
export const getUserRole = (): Role | null => {
  if (typeof window === 'undefined') return null
  const { user } = useUserStore.getState()
  return user?.role || null
}

export const hasRole = (allowedRoles: UserRole[]): boolean => {
  const userRole = getUserRole()
  if (!userRole) return false
  return allowedRoles.includes(userRole as UserRole)
}

export const isAdmin = (): boolean => {
  const role = getUserRole()
  return role === Role.ADMIN || role === Role.SUPER_ADMIN
}

export const isSuperAdmin = (): boolean => {
  return getUserRole() === Role.SUPER_ADMIN
}

export const isUser = (): boolean => {
  return getUserRole() === Role.USER
}

export const getDefaultDashboardUrl = (): string => {
  const role = getUserRole()

  switch (role) {
    case Role.ADMIN:
    case Role.SUPER_ADMIN:
      return "/dashboard"
    case Role.USER:
      return "/contacts"
    default:
      return "/contacts"
  }
}
