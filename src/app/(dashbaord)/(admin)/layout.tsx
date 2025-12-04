"use client"

import { ProtectedRoute } from "@/core/components"
import { Role } from "@/core/config/enum"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ProtectedRoute allowedRoles={[Role.ADMIN, Role.SUPER_ADMIN]}>
      {children}
    </ProtectedRoute>
  )
}
