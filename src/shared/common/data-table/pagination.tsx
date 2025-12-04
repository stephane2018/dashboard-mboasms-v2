import { ChevronLeftIcon, ChevronRightIcon, ChevronsLeftIcon, ChevronsRightIcon } from "lucide-react";
import type { Table } from "@tanstack/react-table";
import { Button } from "@/shared/ui/button";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/shared/ui/select";
import { useRef, useEffect } from "react";

interface DataTablePaginationProps<T> {
  table: Table<T>;
  isLoading?: boolean;
}

export const DataTablePagination = <T,>({ table, isLoading = false }: DataTablePaginationProps<T>) => {
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
        {table.getFilteredSelectedRowModel().rows.length} sur {table.getFilteredRowModel().rows.length} ligne(s) sélectionnée(s).
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
          Page {table.getState().pagination.pageIndex + 1} sur {displayPageCount || 1}
        </div>

        <div className="ml-auto flex items-center gap-2 lg:ml-0">
          <Button
            variant="outline"
            className="hidden size-8 lg:flex"
            size="icon"
            onClick={() => { table.setPageIndex(0); }}
            disabled={isLoading || !displayCanPreviousPage}
          >
            <span className="sr-only">Aller à la première page</span>
            <ChevronsLeftIcon />
          </Button>
          <Button
            variant="outline"
            className="size-8"
            size="icon"
            onClick={() => { table.previousPage(); }}
            disabled={isLoading || !displayCanPreviousPage}
          >
            <span className="sr-only">Aller à la page précédente</span>
            <ChevronLeftIcon />
          </Button>
          <Button
            variant="outline"
            className="size-8"
            size="icon"
            onClick={() => { table.nextPage(); }}
            disabled={isLoading || !displayCanNextPage}
          >
            <span className="sr-only">Aller à la page suivante</span>
            <ChevronRightIcon />
          </Button>
          <Button
            variant="outline"
            className="hidden size-8 lg:flex"
            size="icon"
            onClick={() => { table.setPageIndex(displayPageCount - 1); }}
            disabled={isLoading || !displayCanNextPage}
          >
            <span className="sr-only">Aller à la dernière page</span>
            <ChevronsRightIcon />
          </Button>
        </div>
      </div>
    </div>
  );
};
