"use client";

import { ChevronLeftIcon, ChevronRightIcon, ChevronsLeftIcon, ChevronsRightIcon } from "lucide-react";
import type { Table } from "@tanstack/react-table";
import { Button } from "@/shared/ui/button";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/shared/ui/select";
import { useRef, useEffect } from "react";
import { useT } from "@/core/hooks";

interface DataTablePaginationProps<T> {
  table: Table<T>;
  isLoading?: boolean;
}

export const DataTablePagination = <T,>({ table, isLoading = false }: DataTablePaginationProps<T>) => {
  const { t } = useT();
  const pageCount = table.getPageCount();
  const canNextPage = table.getCanNextPage();
  const canPreviousPage = table.getCanPreviousPage();

  const stablePageCountRef = useRef(pageCount);
  const stableCanNextPageRef = useRef(canNextPage);
  const stableCanPreviousPageRef = useRef(canPreviousPage);

  useEffect(() => {
    if (!isLoading) {
      stablePageCountRef.current = pageCount;
      stableCanNextPageRef.current = canNextPage;
      stableCanPreviousPageRef.current = canPreviousPage;
    }
  }, [isLoading, pageCount, canNextPage, canPreviousPage]);

  const displayPageCount = isLoading ? stablePageCountRef.current : pageCount;
  const displayCanNextPage = isLoading ? stableCanNextPageRef.current : canNextPage;
  const displayCanPreviousPage = isLoading ? stableCanPreviousPageRef.current : canPreviousPage;

  return (
    <div className="flex items-center justify-between">
      <div className="hidden flex-1 text-sm text-muted-foreground lg:flex">
        {t('dataTable.selectedRows', {
        selected: table.getFilteredSelectedRowModel().rows.length,
        total: table.getFilteredRowModel().rows.length,
      })}
      </div>

      <div className="flex w-full items-center gap-8 lg:w-fit">
        <div className="hidden items-center gap-2 lg:flex">
          <Select
            value={`${table.getState().pagination.pageSize}`}
            onValueChange={(value) => {
              const newPerPage = Number(value);
              table.setPageSize(newPerPage);
            }}
          >
            <SelectTrigger className="w-20" id="rows-per-page">
              <SelectValue placeholder={table.getState().pagination.pageSize} />
            </SelectTrigger>
            <SelectContent side="top">
              {[10, 25, 50, 100].map((pageSize) => (
                <SelectItem key={pageSize} value={`${pageSize}`}>
                  {pageSize}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex w-fit items-center justify-center text-sm font-medium">
          {t('dataTable.page', { current: table.getState().pagination.pageIndex + 1, total: displayPageCount || 1 })}
        </div>

        <div className="ml-auto flex items-center gap-2 lg:ml-0">
          <Button
            variant="outline"
            className="hidden size-8 lg:flex"
            size="icon"
            onClick={() => { table.setPageIndex(0); }}
            disabled={isLoading || !displayCanPreviousPage}
          >
            <span className="sr-only">{t('dataTable.goToFirstPage')}</span>
            <ChevronsLeftIcon />
          </Button>
          <Button
            variant="outline"
            className="size-8"
            size="icon"
            onClick={() => { table.previousPage(); }}
            disabled={isLoading || !displayCanPreviousPage}
          >
            <span className="sr-only">{t('dataTable.goToPreviousPage')}</span>
            <ChevronLeftIcon />
          </Button>
          <Button
            variant="outline"
            className="size-8"
            size="icon"
            onClick={() => { table.nextPage(); }}
            disabled={isLoading || !displayCanNextPage}
          >
            <span className="sr-only">{t('dataTable.goToNextPage')}</span>
            <ChevronRightIcon />
          </Button>
          <Button
            variant="outline"
            className="hidden size-8 lg:flex"
            size="icon"
            onClick={() => { table.setPageIndex(displayPageCount - 1); }}
            disabled={isLoading || !displayCanNextPage}
          >
            <span className="sr-only">{t('dataTable.goToLastPage')}</span>
            <ChevronsRightIcon />
          </Button>
        </div>
      </div>
    </div>
  );
};
