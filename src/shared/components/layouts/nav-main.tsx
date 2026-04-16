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
import { useT } from "@/core/hooks"
import { cn } from "@/lib/utils"

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
  const { t } = useT()
  const isCollapsed = state === "collapsed"

  const isItemActive = (itemUrl: string) => {
    if (pathname === itemUrl) return true
    if (itemUrl === "/dashboard") return pathname === "/dashboard"
    return pathname.startsWith(itemUrl + "/")
  }

  return (
    <>
      {sections.map((section, sectionIndex) => (
        <SidebarGroup key={section.title} className={cn(sectionIndex === 0 && "pt-2")}>
          {!isCollapsed && (
            <SidebarGroupLabel className="px-2 mt-2 mb-1 text-[10px] font-semibold uppercase tracking-[0.08em] text-sidebar-foreground/50 flex items-center gap-1.5">
              <span className="h-1 w-1 rounded-full bg-primary/60" />
              {t(section.title)}
            </SidebarGroupLabel>
          )}
          {isCollapsed && sectionIndex > 0 && (
            <div className="my-2 mx-3 h-px bg-sidebar-border/40" />
          )}
          <SidebarMenu>
            {section.items.map((item) => {
              const ItemIcon = item.icon
              const isActive = isItemActive(item.url)
              return (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    tooltip={t(item.title)}
                    size="default"
                    className={cn(
                      "group/nav relative h-9 rounded-lg transition-all",
                      isCollapsed ? "px-0 justify-center" : "px-2",
                      isActive
                        ? "bg-primary/10 text-primary hover:bg-primary/15 hover:text-primary font-semibold"
                        : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                    )}
                    isActive={isActive}
                  >
                    <Link
                      href={item.url}
                      className={cn(
                        "flex items-center",
                        isCollapsed ? "justify-center" : "gap-2.5"
                      )}
                    >
                      {/* Left active indicator bar */}
                      {isActive && !isCollapsed && (
                        <span className="absolute left-0 top-1/2 -translate-y-1/2 h-5 w-1 rounded-full bg-primary" />
                      )}
                      <div
                        className={cn(
                          "flex items-center justify-center rounded-md transition-colors",
                          isActive ? "text-primary" : "text-primary/70 group-hover/nav:text-primary"
                        )}
                      >
                        <ItemIcon
                          size={16}
                          variant="Bulk"
                          color="currentColor"
                        />
                      </div>
                      {!isCollapsed && (
                        <span
                          className={cn(
                            "text-[13px]",
                            isActive ? "font-semibold" : "font-medium"
                          )}
                        >
                          {t(item.title)}
                        </span>
                      )}
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
