"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { type ReactNode } from "react"
import { useUserStore } from "@/core/stores"
import { Role } from "@/core/config/enum"
import { normalizeRole } from "@/core/utils/role.utils"
import { tokenManager } from "@/core/lib/token-manager/token-manager"

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
  const [isReady, setIsReady] = useState(false)

  useEffect(() => {
    // Wait for store to hydrate from localStorage
    if (!isHydrated) {
      return
    }

    const hasToken = tokenManager.hasToken()

    // If we have a token but user is not yet in store, wait for auth provider to fetch profile
    if (hasToken && !user) {
      // Don't redirect yet - the auth provider will fetch the profile
      return
    }

    // If not authenticated and no valid token, redirect to login
    if (!isAuthenticated || !user) {
      router.push(redirectTo)
      return
    }

    // Check if user.role exists
    if (!user.role) {
      return
    }

    // Normalize the user role to ensure consistent comparison
    const normalizedRole = normalizeRole(user.role)

    // Convert Role enum to UserRole type for comparison
    const allowedUserRoles = allowedRoles.map(role => normalizeRole(role))

    // If user doesn't have the required role, redirect based on their role
    if (!allowedUserRoles.includes(normalizedRole)) {
      // Redirect to appropriate dashboard based on role
      if (normalizedRole === 'ADMIN' || normalizedRole === 'ADMIN_USER' || normalizedRole === 'SUPER_ADMIN') {
        router.push("/dashboard")
      } else if (normalizedRole === 'USER') {
        router.push("/contacts")
      } else {
        router.push("/unauthorized")
      }
      return
    }

    // All checks passed
    setIsReady(true)
  }, [isHydrated, isAuthenticated, user, allowedRoles, redirectTo, router])

  // Show loading state while store is hydrating
  if (!isHydrated) {
    return null
  }

  // If we have a valid token but user is not yet loaded, show nothing (auth provider will load it)
  const hasToken = tokenManager.hasToken()
  if (hasToken && !user) {
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
