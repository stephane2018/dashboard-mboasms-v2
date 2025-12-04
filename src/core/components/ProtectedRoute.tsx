"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { type ReactNode } from "react"
import { useUserStore } from "@/core/stores"
import { Role } from "@/core/config/enum"

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

    // If user doesn't have the required role, redirect based on their role
    if (!allowedRoles.includes(user.role)) {
      // Redirect to appropriate dashboard based on role
      if (user.role === Role.ADMIN || user.role === Role.SUPER_ADMIN) {
        router.push("/dashboard")
      } else if (user.role === Role.USER) {
        router.push("/contacts")
      } else {
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
  if (!isAuthenticated || !user || !allowedRoles.includes(user.role)) {
    return null
  }

  return <>{children}</>
}
