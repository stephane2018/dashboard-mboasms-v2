'use client'

import * as React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

import { NavMain } from '@/shared/components/layouts/nav-main'
import { NavUser } from '@/shared/components/layouts/nav-user'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/shared/ui/sidebar'
import {
  getDashboardConfig,
  navigationConfig,
  type RoleBasedNavItem,
} from './sidebar-config'
import Image from 'next/image'
import { useTheme } from 'next-themes'
import { useAuth } from '@/core/hooks/useAuth'
import { Role } from '@/core/config/enum'
import { useT } from '@/core/hooks'
import { cn } from '@/lib/utils'

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname()
  const { user } = useAuth()
  const userRole = user?.role || Role.USER
  const { state } = useSidebar()
  const { resolvedTheme } = useTheme()
  const { t } = useT()
  const [mounted, setMounted] = React.useState(false)
  const isCollapsed = state === 'collapsed'

  React.useEffect(() => {
    setMounted(true)
  }, [])

  const logoSrc =
    mounted && resolvedTheme === 'dark' ? '/icones/logo-white.svg' : '/icones/logo.svg'

  const dashboardConfig = React.useMemo(() => getDashboardConfig(userRole), [userRole])
  const isDashboardActive =
    pathname === dashboardConfig.url || pathname.startsWith(dashboardConfig.url + '/')

  const filteredSections = React.useMemo(() => {
    return navigationConfig
      .filter((section) => section.roles.includes(userRole))
      .map((section) => ({
        title: section.title,
        items: section.items
          .filter((item) => item.roles.includes(userRole))
          // Skip the dashboard entry inside sections — it's already pinned at the top
          .filter((item) => item.url !== dashboardConfig.url),
      }))
      .filter((section) => section.items.length > 0)
  }, [userRole, dashboardConfig.url])

  const canAccessDashboard = dashboardConfig.roles.includes(userRole)
  const DashboardIcon = dashboardConfig.icon

  return (
    <Sidebar variant="inset" collapsible="icon" {...props}>
      <SidebarHeader className="border-b border-sidebar-border/50">
        <SidebarMenu>
          <SidebarMenuItem className={cn('p-2', isCollapsed && 'mx-auto')}>
            <SidebarMenuButton size="lg" asChild className="bg-transparent! hover:bg-transparent!">
              <Link
                href="/"
                className={cn(
                  'flex',
                  isCollapsed ? 'justify-center' : 'justify-start'
                )}
              >
                <div className="relative h-8 w-28">
                  <Image
                    src={logoSrc}
                    alt="MboaSMS"
                    fill
                    className="rounded-sm object-contain"
                  />
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent className="px-2">
        {/* Pinned Dashboard item */}
        {canAccessDashboard && (
          <div className="px-1 pt-3">
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  size="default"
                  tooltip={t('nav.dashboard')}
                  className={cn(
                    'group/dash relative h-10 rounded-lg transition-all',
                    isCollapsed ? 'px-0 justify-center' : 'px-2.5',
                    isDashboardActive
                      ? 'bg-primary/10 text-primary hover:bg-primary/15 hover:text-primary font-semibold'
                      : 'text-sidebar-foreground hover:bg-sidebar-accent'
                  )}
                  isActive={isDashboardActive}
                >
                  <Link
                    href={dashboardConfig.url}
                    className={cn(
                      'flex items-center',
                      isCollapsed ? 'justify-center' : 'gap-2.5'
                    )}
                  >
                    {/* Active indicator bar */}
                    {isDashboardActive && !isCollapsed && (
                      <span className="absolute left-0 top-1/2 -translate-y-1/2 h-5 w-1 rounded-full bg-primary" />
                    )}
                    <div
                      className={cn(
                        'flex items-center justify-center rounded-md transition-colors',
                        isDashboardActive
                          ? 'bg-primary/15 text-primary'
                          : 'text-primary/80'
                      )}
                    >
                      <DashboardIcon className="size-4" />
                    </div>
                    {!isCollapsed && (
                      <span className="text-[13px] font-semibold">
                        {t('nav.dashboard')}
                      </span>
                    )}
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </div>
        )}

        <NavMain sections={filteredSections} />
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border/50">
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  )
}
