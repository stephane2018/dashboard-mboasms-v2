"use client"

import * as React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
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
import { Button } from "@/shared/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/shared/ui/dropdown-menu"
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/shared/ui/avatar"
import { useUserStore } from "@/core/stores/userStore"
import {
  Home2,
  Logout,
  Setting2,
  WalletMoney,
  Information,
} from "iconsax-react"

interface MainLayoutProps {
  children: React.ReactNode
  breadcrumbs?: {
    label: string
    href?: string
  }[]
}

export function MainLayout({ children, breadcrumbs = [] }: MainLayoutProps) {
  const router = useRouter()
  const { user, clearUser } = useUserStore()

  const userDisplayName = user?.name || user?.email || "Utilisateur"
  const userInitials = userDisplayName
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase()

  const smsQuota = user?.smsQuota ?? 100000
  const smsBalance = typeof user?.smsBalance === "number" ? user.smsBalance : 0
  const smsUsagePercent = smsQuota
    ? Math.max(0, Math.min(100, 100 - Math.round((smsBalance / smsQuota) * 100)))
    : 0

  const handleLogout = () => {
    clearUser()
    router.push("/auth/login")
  }

  // Dynamic progress bar color based on SMS usage
  const getProgressBarColor = () => {
    if (smsUsagePercent >= 90) return "bg-red-600"
    if (smsUsagePercent >= 70) return "bg-orange-500"
    if (smsUsagePercent >= 50) return "bg-yellow-500"
    return "bg-primary"
  }

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center justify-between border-b px-4 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2">
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

 	<div className="flex items-center gap-4">
            <Button variant="outline" size="icon" className="rounded-full" asChild>
              <Link href="/">
                <Home2 size="18" variant="Bulk" color="currentColor" className="text-primary" />
                <span className="sr-only">Aller à l&apos;accueil</span>
              </Link>
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-3 rounded-full border border-border/70 bg-gradient-to-br from-primary/5 to-purple-500/5 px-3 py-2 shadow-sm hover:border-primary hover:shadow-primary/10 transition-all duration-200">
                  <div className="relative">
                    <Avatar className="h-9 w-9 ring-1 ring-border">
                      <AvatarImage src={user?.avatar || ""} alt={userDisplayName} />
                      <AvatarFallback>{userInitials}</AvatarFallback>
                    </Avatar>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-left">
                      <p className="text-sm font-semibold leading-tight">{userDisplayName}</p>
                      <p className="text-xs text-muted-foreground">Mon espace</p>
                    </div>
                    <Separator orientation="vertical" className="h-8" />
                    <div className="flex items-center gap-2">
                      <div className="relative h-9 w-9">
                        <svg className="h-9 w-9 -rotate-90" viewBox="0 0 36 36">
                          <path
                            className="text-muted/40"
                            stroke="currentColor"
                            strokeWidth="4"
                            strokeLinecap="round"
                            fill="none"
                            d="M18 2.0845
                              a 15.9155 15.9155 0 0 1 0 31.831
                              a 15.9155 15.9155 0 0 1 0 -31.831"
                          />
                          <path
                            className="text-primary"
                            stroke="currentColor"
                            strokeWidth="4"
                            strokeLinecap="round"
                            fill="none"
                            strokeDasharray={`${smsUsagePercent}, 100`}
                            d="M18 2.0845
                              a 15.9155 15.9155 0 0 1 0 31.831
                              a 15.9155 15.9155 0 0 1 0 -31.831"
                          />
                        </svg>
                        <span className="absolute inset-0 flex items-center justify-center text-[10px] font-semibold text-primary">
                          {100 - smsUsagePercent}%
                        </span>
                      </div>
                      <div className="text-left">
                        <p className="text-xs uppercase tracking-wide text-muted-foreground">Solde</p>
                        <p className="text-sm font-semibold">{smsBalance.toLocaleString()}</p>
                      </div>
                    </div>
                  </div>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-80 rounded-2xl p-3 space-y-3">
                <DropdownMenuLabel>
                  <div className="flex items-center gap-3">
                    <Avatar className="h-12 w-12 ring-2 ring-border">
                      <AvatarImage src={user?.avatar || ""} alt={userDisplayName} />
                      <AvatarFallback>{userInitials}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-semibold">{userDisplayName}</p>
                      <p className="text-xs text-muted-foreground">{user?.email}</p>
                    </div>
                  </div>
                </DropdownMenuLabel>

                <DropdownMenuSeparator />

                {/* SMS Balance Section */}
                <div className="rounded-lg border border-border/60 bg-gradient-to-br from-primary/5 to-purple-500/5 p-3">
                  <p className="text-xs font-semibold text-muted-foreground mb-2">Détails du forfait</p>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Forfait courant</span>
                      <span className="font-semibold">{user?.planName || "Plan Business"}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground text-xs">SMS restant</span>
                      <span className="font-semibold">{smsBalance.toLocaleString()} / {smsQuota.toLocaleString()}</span>
                    </div>
                    <div className="h-2 rounded-full bg-muted">
                      <div
                        className={`h-full rounded-full transition-all ${getProgressBarColor()}`}
                        style={{ width: `${100 - smsUsagePercent}%` }}
                      />
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {smsUsagePercent}% consommés
                    </p>
                  </div>
                </div>

                <Button asChild className="w-full rounded-full" size="sm">
                  <Link href="/recharge">
                    <WalletMoney size="16" className="mr-2" variant="Bulk" />
                    Recharger maintenant
                  </Link>
                </Button>

                <DropdownMenuSeparator />

                <DropdownMenuItem onClick={() => router.push("/profile")} className="flex items-center gap-2 cursor-pointer">
                  <Setting2 size="16" variant="Bulk" color="currentColor" className="text-primary" />
                  Paramètres
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => router.push("/dashboard")} className="flex items-center gap-2 cursor-pointer">
                  <Information size="16" variant="Bulk" color="currentColor" className="text-primary" />
                  Centre d&apos;activité
                </DropdownMenuItem>

                <DropdownMenuSeparator />

                <DropdownMenuItem
                  onClick={handleLogout}
                  className="flex items-center gap-2 text-red-500 focus:text-red-500 focus:bg-red-50 cursor-pointer"
                >
                  <Logout size="16"variant="Bulk" color="currentColor" className="text-primary" />
                  Déconnexion
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4">
          {children}
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}

