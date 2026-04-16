"use client";

import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/ui/avatar";
import { Button } from "@/shared/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/shared/ui/dropdown-menu";
import { LogOut, User } from "lucide-react";
import { generateAbbreviation } from "@/shared/utils/common";
import { useAuth } from "@/core/hooks/useAuth";
import { useLogout } from "@/core/hooks/useLogout";
import { useRouter } from "next/navigation";
import { useT } from "@/core/hooks";
import { LogoutConfirmDialog } from "@/shared/common/logout-confirm-dialog";

export default function UserDropdown() {
  const { t } = useT();
  const { user, enterprise } = useAuth();
  const { mutate: logout, isPending } = useLogout();
  const router = useRouter();
  const [logoutOpen, setLogoutOpen] = useState(false);

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-auto p-0 data-[state=open]:bg-accent data-[state=open]:text-accent-foreground">
            <div className="flex items-center gap-2 px-1.5 py-1">
              <Avatar className="size-8">
                <AvatarImage src={enterprise?.urlImage || ""} />
                <AvatarFallback>{generateAbbreviation(user?.name || user?.email || "")}</AvatarFallback>
              </Avatar>
            </div>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="min-w-64" align="end">
          <DropdownMenuLabel className="flex min-w-0 flex-col">
            <span className="truncate text-sm font-medium text-foreground">{user?.name}</span>
            <span className="truncate text-xs font-normal text-muted-foreground">{user?.email}</span>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem onClick={() => router.push("/profile")}>
              <User aria-hidden="true" />
              <span>{t('layout.myProfile')}</span>
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() => setLogoutOpen(true)}
            disabled={isPending}
            className="text-red-600 focus:text-red-600 focus:bg-red-50"
          >
            <LogOut aria-hidden="true" />
            <span>{isPending ? t('layout.loggingOut') : t('layout.logout')}</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <LogoutConfirmDialog
        open={logoutOpen}
        onOpenChange={setLogoutOpen}
        onConfirm={() => logout()}
        isPending={isPending}
      />
    </>
  );
}
