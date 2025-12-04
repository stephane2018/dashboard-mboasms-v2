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
import { LogOut, Settings } from "lucide-react";
import { generateAbbreviation } from "@/shared/utils/common";
import { useAuthContext } from "@/core/providers/auth-provider";
import { useNavigate } from "react-router";

export default function UserDropdown() {
  const { user, clearUser } = useAuthContext();
  const navigation = useNavigate();

  const handleLogout = async () => {
    clearUser();
    navigation("/login");
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-auto p-0 data-[state=open]:bg-accent data-[state=open]:text-accent-foreground">
          <div className="flex items-center gap-2 px-1.5 py-1">
            <Avatar className="size-8">
              <AvatarImage src="" />
              <AvatarFallback>{generateAbbreviation(user?.full_name || "")}</AvatarFallback>
            </Avatar>
          </div>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="min-w-64" align="end">
        <DropdownMenuLabel className="flex min-w-0 flex-col">
          <span className="truncate text-sm font-medium text-foreground">{user?.full_name}</span>
          <span className="truncate text-xs font-normal text-muted-foreground">{user?.email}</span>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem
            onClick={() => {
            
              navigation("profile");
            }}
          >
            <Settings aria-hidden="true" />
            <span>Mise a jour du profile</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleLogout}>
          <LogOut aria-hidden="true" />
          <span>Deconnexion</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
