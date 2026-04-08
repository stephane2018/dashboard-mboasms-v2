"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/shared/ui/dropdown-menu";
import { Button } from "@/shared/ui/button";
import { MoreVerticalIcon, type LucideIcon } from "lucide-react";
import { cn } from "@/core/lib/utils";
import { useT } from "@/core/hooks";

interface ActionDropdownItem {
  icon?: LucideIcon;
  label: string;
  className?: string;
  onClick: () => void;
}

interface ActionsDropdownProps {
  items: ActionDropdownItem[];
  contentClassName?: string;
}

export function ActionsDropdown({ items, contentClassName }: ActionsDropdownProps) {
  const { t } = useT();

  return (
    <div className="w-full flex justify-center">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            className="flex size-7 text-muted-foreground data-[state=open]:bg-muted"
            size="icon"
          >
            <MoreVerticalIcon />
            <span className="sr-only">{t('dataTable.openMenu')}</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="end"
          className={cn("min-w-(--radix-dropdown-menu-trigger-width)", contentClassName)}
        >
          {items.map((item) => (
            <DropdownMenuItem key={item.label} onClick={item.onClick} className={item.className}>
              {item.icon && <item.icon className="shrink-0" />}
              <span>{item.label}</span>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
