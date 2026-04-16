"use client"

import {
  Bell,
  LogOut,
  User,
} from "lucide-react"
import Image from "next/image"

import {
  Avatar,
  AvatarFallback,
} from "@/shared/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/shared/ui/dropdown-menu"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/shared/ui/sidebar"
import { CaretSortIcon } from "@radix-ui/react-icons"
import { useState } from "react"
import { useLogout } from "@/core/hooks/useLogout"
import { useAuth } from "@/core/hooks/useAuth"
import { useT } from "@/core/hooks"
import { useRouter } from "next/navigation"
import { LogoutConfirmDialog } from "@/shared/common/logout-confirm-dialog"

export function NavUser() {
  const { isMobile } = useSidebar()
  const { mutate: handleLogout, isPending } = useLogout()
  const { user, enterprise } = useAuth()
  const { t } = useT()
  const router = useRouter()
  const [logoutOpen, setLogoutOpen] = useState(false)

  if (!user) {
    return null
  }

  const userEmail = typeof user.email === 'string' ? user.email : ''
  const userName = typeof user.name === 'string' ? user.name : userEmail || 'Utilisateur'
  const userAvatar = enterprise?.urlImage

  const requestLogout = () => setLogoutOpen(true)
  const confirmLogout = () => handleLogout()

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <Avatar className="h-8 w-8 rounded-sm">
                {userAvatar ? (
                  <Image src={userAvatar} alt={userName} width={32} height={32} className="aspect-square h-full w-full rounded-sm object-cover" />
                ) : (
                  <AvatarFallback className="rounded-sm">{userName?.slice(0, 2).toUpperCase()}</AvatarFallback>
                )}
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">{userName}</span>
                <span className="truncate text-xs">{userEmail}</span>
              </div>
              <CaretSortIcon className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar className="h-8 w-8 rounded-lg">
                  {userAvatar ? (
                    <img src={userAvatar} alt={userName} className="aspect-square h-full w-full rounded-lg object-cover" />
                  ) : (
                    <AvatarFallback className="rounded-lg">{userName?.slice(0, 2).toUpperCase()}</AvatarFallback>
                  )}
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">{userName}</span>
                  <span className="truncate text-xs">{userEmail}</span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => router.push("/profile")}>
              <User />
              {t('layout.myProfile')}
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Bell />
              {t('layout.notifications')}
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={requestLogout}
              disabled={isPending}
              className="text-red-600 focus:text-red-600 focus:bg-red-50"
            >
              <LogOut />
              {isPending ? t('layout.loggingOut') : t('layout.logout')}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>

      <LogoutConfirmDialog
        open={logoutOpen}
        onOpenChange={setLogoutOpen}
        onConfirm={confirmLogout}
        isPending={isPending}
      />
    </SidebarMenu>
  )
}
