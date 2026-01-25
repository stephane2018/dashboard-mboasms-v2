"use client"

import { MainLayout } from "@/shared/components/layouts"
import { ProtectedRoute } from "@/core/components"
import { Role } from "@/core/config/enum"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ProtectedRoute allowedRoles={[Role.ADMIN, Role.ADMIN_USER, Role.SUPER_ADMIN, Role.USER]}>
      <MainLayout>{children}</MainLayout>
    </ProtectedRoute>
  )
}
