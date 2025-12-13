"use client"

import type { Icon } from "iconsax-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/shared/ui/sidebar"

export function NavMain({
  sections,
}: {
  sections: {
    title: string
    items: {
      title: string
      url: string
      icon: Icon
    }[]
  }[]
}) {
  const pathname = usePathname()
  const { state } = useSidebar()

  // Enhanced active check: exact match OR starts with the URL path
  const isItemActive = (itemUrl: string) => {
    // Exact match
    if (pathname === itemUrl) return true

    // For sub-routes: check if pathname starts with itemUrl
    // But exclude dashboard from matching all routes
    if (itemUrl === '/dashboard') return pathname === '/dashboard'

    // Check if current path starts with the item URL (for sub-routes)
    return pathname.startsWith(itemUrl + '/')
  }

  return (
    <>
      {sections.map((section) => (
        <SidebarGroup key={section.title}>
          {state !== 'collapsed' && (
            <SidebarGroupLabel className="text-[10px] font-semibold uppercase tracking-wider text-sidebar-foreground/60">
              {section.title}
            </SidebarGroupLabel>
          )}
          <SidebarMenu>
            {section.items.map((item) => {
              const ItemIcon = item.icon
              const isActive = isItemActive(item.url)
              return (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    tooltip={item.title}
                    size="default"
                    className={`sidebar-item-hover h-9 ${state === 'collapsed' ? 'px-0 justify-center' : 'px-2'}`}
                    isActive={isActive}
                  >
                    <Link href={item.url} className={`flex items-center ${state === 'collapsed' ? 'justify-center' : 'gap-2'}`}>
                      <ItemIcon size={18} variant="Bulk" color="currentcolor" className="text-primary" />
                      {state !== 'collapsed' && <span className="text-[13px]">{item.title}</span>}
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              )
            })}
          </SidebarMenu>
        </SidebarGroup>
      ))}
    </>
  )
}
