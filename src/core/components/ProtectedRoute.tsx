"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { type ReactNode } from "react"
import { useUserStore } from "@/core/stores"
import { Role } from "@/core/config/enum"
import { normalizeRole } from "@/core/utils/role.utils"

interface ProtectedRouteProps {
  children: ReactNode
  allowedRoles: Role[]
  redirectTo?: string
}

export const ProtectedRoute = ({
  children,
  allowedRoles,
  redirectTo = "/auth/login"
}: ProtectedRouteProps) => {

  const router = useRouter()
  const { user, isAuthenticated, isHydrated } = useUserStore()
  console.log("ProtectedRoute", user)

  useEffect(() => {
    // Wait for store to hydrate from localStorage
    if (!isHydrated) {
      return
    }

    // If not authenticated, redirect to login
    if (!isAuthenticated || !user) {
      router.push(redirectTo)
      return
    }

    // // Debug: Log the current user role and allowed roles
    // console.log('User role:', user.role)
    // console.log('Allowed roles:', allowedRoles)
    // console.log('User role type:', typeof user.role)
    // console.log('User object:', user)

    // Check if user.role exists
    if (!user.role) {
      // console.log('User role is undefined, redirecting to unauthorized')
      // router.push("/unauthorized")
      return
    }

    // console.log('User role: =========', user.role)

    // Normalize the user role to ensure consistent comparison
    const normalizedRole = normalizeRole(user.role)
    // console.log('Normalized role:', normalizedRole)

    // Convert Role enum to UserRole type for comparison
    const allowedUserRoles = allowedRoles.map(role => normalizeRole(role))
    // console.log('Allowed user roles:', allowedUserRoles)

    // If user doesn't have the required role, redirect based on their role
    if (!allowedUserRoles.includes(normalizedRole)) {
      // Redirect to appropriate dashboard based on role
      console.log('Allowed user roles:', allowedUserRoles)
      console.log('Normalized role:', normalizedRole)
      console.log('Allowed user roles:', allowedUserRoles)
      console.log('Normalized role:', normalizedRole)
      
      if (normalizedRole === 'ADMIN' || normalizedRole === 'ADMIN_USER' || normalizedRole === 'SUPER_ADMIN') {
        router.push("/dashboard")
      } else if (normalizedRole === 'USER') {
        router.push("/contacts")
      } else {
        console.log('Redirecting to unauthorized - role not matched')
        router.push("/unauthorized")
      }
      return
    }
  }, [isHydrated, isAuthenticated, user, allowedRoles, redirectTo, router])

  // Show loading state while store is hydrating
  if (!isHydrated) {
    return null
  }

  // Don't render children if user is not authenticated or doesn't have permission
  if (!isAuthenticated || !user) {
    return null
  }

  // Check if user.role exists
  if (!user.role) {
    return null
  }

  // Normalize the user role for the render check as well
  const normalizedRole = normalizeRole(user.role)
  const allowedUserRoles = allowedRoles.map(role => normalizeRole(role))

  
  if (!allowedUserRoles.includes(normalizedRole)) {
    return null
  }

  return <>{children}</>
}
