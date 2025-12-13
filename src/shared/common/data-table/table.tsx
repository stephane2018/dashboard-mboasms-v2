import * as React from "react";
import type {
  ColumnDef,
  ColumnFiltersState,
  ColumnPinningState,
  InitialTableState,
  PaginationState,
  RowSelectionState,
  SortingState,
  Table as TableType,
  Updater,
  VisibilityState,
} from "@tanstack/react-table";
import {
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/shared/ui/table";
import { cn } from "@/core/lib/utils";
import { DataTablePagination } from "./pagination";
import { Checkbox } from "@/shared/ui/checkbox";
import { Skeleton } from "@/shared/ui/skeleton";

// Extend TanStack Table's ColumnMeta to include custom properties
declare module "@tanstack/react-table" {
  interface ColumnMeta<TData, TValue> {
    className?: string;
    styles?: React.CSSProperties;
    label?: string;
    placeholder?: string;
    // Generic metadata support - allows any additional properties
    [key: string]: unknown;
  }
}

interface DataTableProps<T> {
  data: T[];
  rowCount?: number;
  columns: ColumnDef<T>[];
  isLoading?: boolean;
  emptyMessage?: string;
  classNames?: {
    table?: string;
    tableHeader?: string;
    tableHead?: string;
    tableBody?: string;
    tableRow?: {
      header?: string;
      body?: string;
    };
    tableCell?: string;
  };
  autoPagination?: boolean;
  enablePagination?: boolean;
  enableColumnFilter?: boolean;
  enableSorting?: boolean;
  rowSelectable?: boolean;
  getRowCanBeSelected?: (row: T) => boolean;
  onRowSelectionChange?: (rows: T[]) => void;
  onPaginationChange?: (pagination: PaginationState) => void;
  toolbar?: (table: TableType<T>) => React.ReactNode;
  initialState?: InitialTableState;
}

export function DataTable<T>({
  data,
  rowCount = 0,
  columns: initialColumns,
  isLoading = false,
  emptyMessage,
  classNames,
  autoPagination = false,
  rowSelectable = true,
  getRowCanBeSelected,
  enablePagination = false,
  enableColumnFilter = false,
  enableSorting = true,
  onRowSelectionChange,
  onPaginationChange,
  toolbar,
  initialState,
}: DataTableProps<T>) {
  const [rowSelection, setRowSelection] = React.useState({});
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [sorting, setSorting] = React.useState<SortingState>(initialState?.sorting || []);
  const [columnPinning, setColumnPinning] = React.useState<ColumnPinningState>(
    initialState?.columnPinning || { left: [], right: [] }
  );
  const [pagination, setPagination] = React.useState<PaginationState>(() => {
    const defaultPagination = { pageIndex: 0, pageSize: 10 };
    if (!initialState?.pagination) return defaultPagination;

    return {
      pageIndex: initialState.pagination.pageIndex ?? defaultPagination.pageIndex,
      pageSize: initialState.pagination.pageSize ?? defaultPagination.pageSize,
    };
  });

  React.useEffect(() => {
    const paginationFromInit = initialState?.pagination;
    if (paginationFromInit) {
      setPagination((prev) => {
        const newPageIndex = paginationFromInit.pageIndex ?? prev.pageIndex;
        const newPageSize = paginationFromInit.pageSize ?? prev.pageSize;

        if (prev.pageIndex !== newPageIndex || prev.pageSize !== newPageSize) {
          return {
            pageIndex: newPageIndex,
            pageSize: newPageSize,
          };
        }
        return prev;
      });
    }
  }, [initialState?.pagination?.pageIndex, initialState?.pagination?.pageSize]);

  const columns: ColumnDef<T>[] = React.useMemo(() => {
    return [
      ...(rowSelectable
        ? ([
            {
              id: "select",
              header: ({ table }) => {
                const checked = (() => {
                  if (!getRowCanBeSelected) {
                    return table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && "indeterminate")
                  }

                  const pageRows = table.getRowModel().rows
                  const selectableRows = pageRows.filter((row) => getRowCanBeSelected(row.original))

                  if (selectableRows.length === 0) return false

                  const allSelected = selectableRows.every((row) => row.getIsSelected())
                  const someSelected = selectableRows.some((row) => row.getIsSelected())

                  return allSelected || (someSelected && "indeterminate")
                })()

                return (
                  <div className="flex items-center">
                    <Checkbox
                      checked={checked}
                      onCheckedChange={(value) => {
                      if (!getRowCanBeSelected) {
                        table.toggleAllPageRowsSelected(!!value);
                        return
                      }

                      const shouldSelect = !!value

                      table.getRowModel().rows.forEach((row) => {
                        const canSelect = getRowCanBeSelected(row.original)

                        if (canSelect) {
                          row.toggleSelected(shouldSelect)
                        } else {
                          row.toggleSelected(false)
                        }
                      })
                      }}
                      aria-label="Sélectionner tout"
                      disabled={
                        getRowCanBeSelected
                          ? !table.getRowModel().rows.some((row) => getRowCanBeSelected(row.original))
                          : false
                      }
                    />
                  </div>
                )
              },
              cell: ({ row }) => {
                const canSelect = !getRowCanBeSelected || getRowCanBeSelected(row.original);
                return (
                  <div className="flex items-center">
                    <Checkbox
                      checked={row.getIsSelected()}
                      onCheckedChange={(value) => {
                        if (canSelect) {
                          row.toggleSelected(!!value);
                        }
                      }}
                      aria-label="Sélectionner la ligne"
                      disabled={!canSelect}
                    />
                  </div>
                );
              },
              meta: {
                className: "w-8",
              },
              enableSorting: false,
              enableHiding: false,
            },
          ] as ColumnDef<T>[])
        : []),
      ...initialColumns,
    ];
  }, [initialColumns, rowSelectable, getRowCanBeSelected]);

  const handleUpdatePagination = (updaterOrValue: Updater<PaginationState>) => {
    let paginationUpdate: PaginationState;

    if (typeof updaterOrValue === "function") {
      paginationUpdate = updaterOrValue(pagination);
    } else {
      paginationUpdate = updaterOrValue;
    }

    onPaginationChange?.(paginationUpdate);
    setPagination(paginationUpdate);
  };

  const handleRowSelection = (updaterOrValue: Updater<RowSelectionState>) => {
    let rowSelectionUpdate: RowSelectionState;

    if (typeof updaterOrValue === "function") {
      rowSelectionUpdate = updaterOrValue(rowSelection);
    } else {
      rowSelectionUpdate = updaterOrValue;
    }

    setRowSelection(rowSelectionUpdate);
    
    // Calculate selected rows based on the updated selection state
    const selectedRowIds = Object.keys(rowSelectionUpdate).filter(
      (key) => rowSelectionUpdate[key] === true
    );
    const selectedRows = table.getRowModel().rows.filter((row) =>
      selectedRowIds.includes(row.id)
    );
    onRowSelectionChange?.(selectedRows.map((row) => row.original));
  };

  const table = useReactTable({
    data,
    columns,

    rowCount,

    manualPagination: !autoPagination,
    manualFiltering: !enableColumnFilter,
    manualSorting: !enableSorting,
    enableRowSelection: rowSelectable,
    enableColumnFilters: enableColumnFilter,

    state: {
      sorting,
      columnVisibility,
      rowSelection,
      columnFilters,
      pagination,
      columnPinning,
    },

    initialState,

    onRowSelectionChange: rowSelectable ? handleRowSelection : undefined,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onColumnPinningChange: setColumnPinning,
    onPaginationChange: enablePagination ? handleUpdatePagination : undefined,
    ...(getRowCanBeSelected ? { getRowCanBeSelected } : {}),

    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),

    ...(autoPagination ? { getPaginationRowModel: getPaginationRowModel() } : {}),
  });

  return (
    <div className="space-y-3">
      {toolbar && (
        <div className="w-full">
          {toolbar(table)}
        </div>
      )}
      <div className="overflow-hidden rounded-lg border bg-card">
        <Table className={classNames?.table}>
          <TableHeader className={cn("bg-muted", classNames?.tableHeader)}>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow className={cn("hover:bg-transparent", classNames?.tableRow?.header)} key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  const className = header.column.columnDef.meta?.className;
                  const style = header.column.columnDef.meta?.styles;

                  return (
                    <TableHead key={header.id} colSpan={header.colSpan} className={cn(classNames?.tableHead, className)} style={style}>
                      {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>

          <TableBody className={cn("**:data-[slot=table-cell]:first:w-8", classNames?.tableBody)}>
            {isLoading ? (
              Array.from({ length: pagination.pageSize }).map((_, index) => (
                <TableRow key={`skeleton-row-${index}`}>
                  {columns.map((column, cellIndex) => {
                    const className = column.meta?.className;
                    const style = column.meta?.styles;

                    return (
                      <TableCell key={`skeleton-cell-${index}-${cellIndex}`} className={className} style={style}>
                        <Skeleton className="h-8 w-full" />
                      </TableCell>
                    );
                  })}
                </TableRow>
              ))
            ) : table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow className={cn("hover:bg-primary/10 transition-colors", classNames?.tableRow?.body)} key={row.id} data-state={row.getIsSelected() && "selected"}>
                  {row.getVisibleCells().map((cell) => {
                    const className = cell.column.columnDef.meta?.className;
                    const style = cell.column.columnDef.meta?.styles;

                    return (
                      <TableCell key={cell.id} className={cn(classNames?.tableCell, className)} style={style}>
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </TableCell>
                    );
                  })}
                </TableRow>
              ))
            ) : (
              <TableRow className="hover:bg-transparent">
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  {emptyMessage || "Aucun résultat."}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {enablePagination && <DataTablePagination table={table} isLoading={isLoading} />}
    </div>
  );
}
