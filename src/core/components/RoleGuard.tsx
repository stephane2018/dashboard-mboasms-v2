import { type ReactNode } from "react"
import { hasRole, type UserRole } from "@/core/utils/role.utils"

interface RoleGuardProps {
  children: ReactNode
  allowedRoles: UserRole[]
  fallback?: ReactNode
}

/**
 * RoleGuard component to conditionally render content based on user role
 * Unlike ProtectedRoute, this doesn't redirect - it just shows/hides content
 *
 * @example
 * // Show content only for ADMIN users
 * <RoleGuard allowedRoles={["ADMIN"]}>
 *   <button>Delete User</button>
 * </RoleGuard>
 *
 * @example
 * // Show content for ADMIN and MANAGER with fallback
 * <RoleGuard allowedRoles={["ADMIN", "MANAGER"]} fallback={<p>Access denied</p>}>
 *   <AdminPanel />
 * </RoleGuard>
 */
export const RoleGuard = ({
  children,
  allowedRoles,
  fallback = null
}: RoleGuardProps) => {
  const hasAccess = hasRole(allowedRoles)

  if (!hasAccess) {
    return <>{fallback}</>
  }

  return <>{children}</>
}
