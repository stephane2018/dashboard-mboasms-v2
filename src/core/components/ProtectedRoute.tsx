"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { type ReactNode } from "react"
import { useAuth } from "@/core/hooks/useAuth"
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
  const { user, token, isAuthenticated, isHydrated } = useAuth()

  const hasToken = Boolean(token)
  const isLoading = !isHydrated || (hasToken && !user)

  useEffect(() => {
    if (!isHydrated) return
    if (hasToken && !user) return

    const userValid =
      user &&
      typeof user.id === 'string' && user.id.length > 0 &&
      typeof user.email === 'string' && user.email.length > 0 &&
      typeof user.role === 'string' && user.role.length > 0

    if (!isAuthenticated || !userValid) {
      router.push(redirectTo)
      return
    }

    const normalizedRole = normalizeRole(user!.role)
    const allowedUserRoles = allowedRoles.map(role => normalizeRole(role))

    if (!allowedUserRoles.includes(normalizedRole)) {
      if (normalizedRole === 'ADMIN' || normalizedRole === 'ADMIN_USER' || normalizedRole === 'SUPER_ADMIN') {
        router.push("/dashboard")
      } else if (normalizedRole === 'USER') {
        router.push("/contacts")
      } else {
        router.push("/unauthorized")
      }
    }
  }, [isHydrated, isAuthenticated, hasToken, user, allowedRoles, redirectTo, router])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
      </div>
    )
  }

  const isUserValid =
    user &&
    typeof user.id === 'string' && user.id.length > 0 &&
    typeof user.email === 'string' && user.email.length > 0 &&
    typeof user.role === 'string' && user.role.length > 0

  if (!isAuthenticated || !isUserValid) {
    return null
  }

  const normalizedRole = normalizeRole(user!.role)
  const allowedUserRoles = allowedRoles.map(role => normalizeRole(role))

  if (!allowedUserRoles.includes(normalizedRole)) {
    return null
  }

  return <>{children}</>
}
