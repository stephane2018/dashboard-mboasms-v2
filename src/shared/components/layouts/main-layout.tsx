"use client"

import * as React from "react"
import { AppSidebar } from "@/shared/components/layouts/app-sidebar"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/shared/ui/breadcrumb"
import { Separator } from "@/shared/ui/separator"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/shared/ui/sidebar"

interface MainLayoutProps {
  children: React.ReactNode
  breadcrumbs?: {
    label: string
    href?: string
  }[]
}

export function MainLayout({ children, breadcrumbs = [] }: MainLayoutProps) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="/">
                    Dashboard
                  </BreadcrumbLink>
                </BreadcrumbItem>
                {breadcrumbs && breadcrumbs.length > 0 && (
                  <>
                    <BreadcrumbSeparator className="hidden md:block" />
                    {breadcrumbs.map((crumb, index) => (
                      <React.Fragment key={index}>
                        <BreadcrumbItem>
                          {crumb.href ? (
                            <BreadcrumbLink href={crumb.href}>
                              {crumb.label}
                            </BreadcrumbLink>
                          ) : (
                            <BreadcrumbPage>{crumb.label}</BreadcrumbPage>
                          )}
                        </BreadcrumbItem>
                        {index < breadcrumbs.length - 1 && <BreadcrumbSeparator className="hidden md:block" />}
                      </React.Fragment>
                    ))}
                  </>
                )}
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4">
          {children}
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
