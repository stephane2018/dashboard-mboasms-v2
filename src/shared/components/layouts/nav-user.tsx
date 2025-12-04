"use client"

import {
  Bell,
  LogOut,
} from "lucide-react"

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
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
import { useLogout } from "@/core/hooks/useLogout"
import { currentBranding } from "@/config/branding"
import { useAuthContext } from "@/core/providers/auth-provider"

export function NavUser() {
  const { isMobile } = useSidebar()
  const { mutate: handleLogout, isPending } = useLogout()
  const { user } = useAuthContext()

  // If no user is logged in, don't render anything
  if (!user) {
    return null
  }

  const userEmail = user.email
  const userName = user.name
  const userAvatar = user.avatar

  const onLogout = () => {
    handleLogout()
  }

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <Avatar className="h-8 w-8  rounded-sm">
                <AvatarImage src={currentBranding.logo} alt={currentBranding.name} />
                <AvatarFallback className="rounded-sm">CN</AvatarFallback>
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
                  <AvatarImage src={currentBranding.logo} alt={currentBranding.name} />
                  <AvatarFallback className="rounded-lg">CN</AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">{userName}</span>
                  <span className="truncate text-xs">{userEmail}</span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <Bell />
              Notifications
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={onLogout}
              disabled={isPending}
              className="text-red-600 focus:text-red-600 focus:bg-red-50"
            >
              <LogOut />
              {isPending ? "Déconnexion..." : "Déconnexion"}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
