"use client"

import { MainLayout } from "@/shared/components/layouts"
import { ProtectedRoute } from "@/core/components"
import { NetworkStatusProvider } from "@/core/providers/network-status-provider"
import { Role } from "@/core/config/enum"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ProtectedRoute allowedRoles={[Role.ADMIN, Role.ADMIN_USER, Role.SUPER_ADMIN, Role.USER]}>
      <NetworkStatusProvider>
        <MainLayout>{children}</MainLayout>
      </NetworkStatusProvider>
    </ProtectedRoute>
  )
}
