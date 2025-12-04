"use client"

import { ProtectedRoute } from "@/core/components"
import { Role } from "@/core/config/enum"

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ProtectedRoute allowedRoles={[Role.USER]}>
      {children}
    </ProtectedRoute>
  )
}
