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
                <Home2 size="18" />
                <span className="sr-only">Aller à l&apos;accueil</span>
              </Link>
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-3 rounded-full border border-border/70 bg-background/80 px-3 py-1.5 shadow-sm hover:border-primary hover:shadow-primary/10 transition-all duration-200">
                  <div className="relative">
                    <Avatar className="h-9 w-9 ring-1 ring-border">
                      <AvatarImage src={user?.avatar || ""} alt={userDisplayName} />
                      <AvatarFallback>{userInitials}</AvatarFallback>
                    </Avatar>
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-semibold leading-tight">{userDisplayName}</p>
                    <p className="text-xs text-muted-foreground">Mon espace</p>
                  </div>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 rounded-2xl p-2">
                <DropdownMenuLabel>
                  <p className="text-sm font-semibold">{userDisplayName}</p>
                  <p className="text-xs text-muted-foreground">{user?.email}</p>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => router.push("/profile")} className="flex items-center gap-2">
                  <Setting2 size="16" className="text-primary" />
                  Paramètres
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => router.push("/dashboard")} className="flex items-center gap-2">
                  <Information size="16" className="text-primary" />
                  Centre d&apos;activité
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={handleLogout}
                  className="flex items-center gap-2 text-red-500 focus:text-red-500 focus:bg-red-50"
                >
                  <Logout size="16" />
                  Déconnexion
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-3 rounded-xl border border-border/70 bg-gradient-to-br from-primary/5 to-purple-500/5 px-3 py-2 shadow-sm transition-all duration-200 hover:border-primary">
                  <div className="relative h-10 w-10">
                    <svg className="h-10 w-10 -rotate-90" viewBox="0 0 36 36">
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
                    <span className="absolute inset-0 flex items-center justify-center text-xs font-semibold text-primary">
                      {100 - smsUsagePercent}%
                    </span>
                  </div>
                  <div className="text-left">
                    <p className="text-xs uppercase tracking-wide text-muted-foreground">Solde restant</p>
                    <p className="text-sm font-semibold flex items-center gap-1">
                      {smsBalance.toLocaleString()} SMS
                      <WalletMoney size="16" className="text-primary" />
                    </p>
                  </div>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-64 rounded-2xl p-3 space-y-3">
                <DropdownMenuLabel className="text-sm font-semibold">Détails du forfait</DropdownMenuLabel>
                <div className="rounded-lg border border-border/60 p-3 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Forfait courant</span>
                    <span className="font-semibold">{user?.planName || "Plan Business"}</span>
                  </div>
                  <div className="mt-2 flex items-center justify-between">
                    <span className="text-muted-foreground text-xs">SMS restant</span>
                    <span className="font-semibold">{smsBalance.toLocaleString()} / {smsQuota.toLocaleString()}</span>
                  </div>
                  <div className="mt-2 h-2 rounded-full bg-muted">
                    <div
                      className="h-full rounded-full bg-primary transition-all"
                      style={{ width: `${100 - smsUsagePercent}%` }}
                    />
                  </div>
                  <p className="mt-2 text-xs text-muted-foreground">
                    {smsUsagePercent}% consommés - pensez à recharger pour éviter toute interruption.
                  </p>
                </div>
                <Button asChild className="w-full rounded-full">
                  <Link href="/recharge">Recharger maintenant</Link>
                </Button>
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

