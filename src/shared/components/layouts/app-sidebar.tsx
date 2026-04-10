'use client'

import * as React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

import { NavMain } from '@/shared/components/layouts/nav-main'
import { NavUser } from '@/shared/components/layouts/nav-user'
import { PlanDetails } from '@/shared/components/layouts/plan-details'
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
import { Avatar, AvatarFallback, AvatarImage } from '@/shared/ui/avatar'
import {
  getDashboardConfig,
  getNameOfDashboard,
  navigationConfig,
  secondaryNavConfig,
  type RoleBasedNavItem,
} from './sidebar-config'
import Image from 'next/image'
import { useTheme } from 'next-themes'
import { useUserStore } from '@/core/stores/userStore'
import { Role } from '@/core/config/enum'
import { useT } from '@/core/hooks'

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname()
  const { user } = useUserStore()
  const userRole = user?.role || Role.USER
  const { state } = useSidebar()
  const { resolvedTheme } = useTheme()
  const { t } = useT()
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  const logoSrc = mounted && resolvedTheme === 'dark' ? '/icones/logo-white.svg' : '/icones/logo.svg'

  const dashboardConfig = React.useMemo(() => getDashboardConfig(userRole), [userRole])
  const isDashboardActive =
    pathname === dashboardConfig.url || pathname.startsWith(dashboardConfig.url + '/')

  const filteredSections = React.useMemo(() => {
    return navigationConfig
      .filter((section) => section.roles.includes(userRole))
      .map((section) => ({
        title: section.title,
        items: section.items.filter((item) => item.roles.includes(userRole)),
      }))
      .filter((section) => section.items.length > 0)
  }, [userRole])

  const filteredNavSecondary = React.useMemo(() => {
    return secondaryNavConfig
      .filter((item: RoleBasedNavItem) => item.roles.includes(userRole))
      .map(({ roles, ...item }) => item)
  }, [userRole])

  const canAccessDashboard = dashboardConfig.roles.includes(userRole)

  return (
    <Sidebar variant="inset" collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem className={`${state === 'collapsed' ? 'mx-auto' : ''}  p-2`}>
            <SidebarMenuButton size="lg" asChild className="bg-transparent!">
              <Link href="/" className={`flex ${state === 'collapsed' ? 'justify-center' : 'justify-start'} `}>
                <div className="relative h-8 w-28">
                  <Image src={logoSrc} alt="MboaSMS" fill className="rounded-sm object-contain" />
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        {/* Dashboard Item */}
        {canAccessDashboard && (
          <div className="px-3 pt-3">
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  size="default"
                  className="h-10 px-2"
                  isActive={isDashboardActive}
                >
                  <Link href={dashboardConfig.url} className="flex items-center gap-2">
                    <dashboardConfig.icon className="size-4" />
                    <span className="text-sm font-semibold">{t('nav.dashboard')}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </div>
        )}

        <NavMain sections={filteredSections} />
        {/* <NavSecondary items={filteredNavSecondary} className="mt-auto" /> */}
      </SidebarContent>

      <SidebarFooter>
        <PlanDetails />
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  )
}
