"use client";

import { cn } from "@/core/lib/utils";
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/shared/ui";
import type { Column } from "@tanstack/react-table";
import {
  ArrowDown,
  ArrowUp,
  Sort,
  EyeSlash,
  CloseCircle,
} from "iconsax-react";



interface DataTableColumnHeaderProps<TData, TValue>
  extends React.ComponentProps<typeof DropdownMenuTrigger> {
  column: Column<TData, TValue>;
  label: string;
}

export function DataTableColumnHeader<TData, TValue>({
  column,
  label,
  className,
  ...props
}: DataTableColumnHeaderProps<TData, TValue>) {
  if (!column.getCanSort() && !column.getCanHide()) {
    return <div className={cn("text-xs sm:text-sm font-medium", className)}>{label}</div>;
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className={cn(
          "-ml-1.5 flex group text-muted-foreground h-7 sm:h-8 items-center gap-1 sm:gap-1.5 rounded-md px-1.5 sm:px-2 py-1 sm:py-1.5 text-xs sm:text-sm hover:bg-accent focus:outline-none focus:ring-1 focus:ring-ring data-[state=open]:bg-accent data-[state=open]:text-white [&_svg]:size-3 sm:[&_svg]:size-4 [&_svg]:shrink-0 [&_svg]:text-muted-foreground",
          className,
        )}
        {...props}
      >
        <span className="truncate group-hover:text-white focus-within:text-white group-data-[state=open]:text-white">{label}</span>
        {column.getCanSort() &&
          (column.getIsSorted() === "desc" ? (
            <ArrowDown size={12} variant="Bulk" className="ml-auto sm:size-4 group-hover:text-white focus-within:text-white group-data-[state=open]:text-white" />
          ) : column.getIsSorted() === "asc" ? (
            <ArrowUp size={12} variant="Bulk" className="ml-auto sm:size-4 group-hover:text-white focus-within:text-white group-data-[state=open]:text-white" />
          ) : (
            <Sort size={12} variant="Bulk" className="ml-auto sm:size-4 group-hover:text-white focus-within:text-white group-data-[state=open]:text-white" />
          ))}
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-24  sm:w-28 text-xs sm:text-sm">
        {column.getCanSort() && (
          <>
            <DropdownMenuCheckboxItem
              className="relative pr-7 gap-2 sm:pr-8 pl-1.5 sm:pl-2 [&>span:first-child]:right-2 [&>span:first-child]:left-auto"
              checked={column.getIsSorted() === "asc"}
              onClick={() => column.toggleSorting(false)}
            >
              <ArrowUp size={12} variant="Bulk" />
              <span className="text-xs sm:text-sm">Croissant</span>
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem
              className="relative pr-7 gap-2 sm:pr-8 pl-1.5 sm:pl-2 [&>span:first-child]:right-2 [&>span:first-child]:left-auto"
              checked={column.getIsSorted() === "desc"}
              onClick={() => column.toggleSorting(true)}
            >
              <ArrowDown size={12} variant="Bulk" className="group-hover:text-white focus-within:text-white group-data-[state=open]:text-white" />
              <span className="text-xs sm:text-sm">Décroissant</span>
            </DropdownMenuCheckboxItem>
            {column.getIsSorted() && (
              <DropdownMenuItem
                className="pl-1.5 gap-2 sm:pl-2"
                onClick={() => column.clearSorting()}
              >
                <CloseCircle size={12} variant="Bulk" className="group-hover:text-white focus-within:text-white group-data-[state=open]:text-white" />
                <span className="text-xs sm:text-sm">Reset</span>
              </DropdownMenuItem>
            )}
          </>
        )}
        <DropdownMenuSeparator />
        {column.getCanHide() && (
          <DropdownMenuCheckboxItem
            className="relative pr-7 gap-2 sm:pr-8 pl-1.5 sm:pl-2 [&>span:first-child]:right-2 [&>span:first-child]:left-auto"
            checked={!column.getIsVisible()}
            onClick={() => column.toggleVisibility(false)}
          >
            <EyeSlash size={12} variant="Bulk" />
            <span className="text-xs sm:text-sm">Cacher</span>
          </DropdownMenuCheckboxItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}