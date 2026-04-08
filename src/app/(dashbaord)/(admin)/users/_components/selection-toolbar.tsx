"use client"

import { useMemo } from "react"
import type { Table } from "@tanstack/react-table"
import { People, Trash, AddCircle, CloseCircle } from "iconsax-react"
import type { EnterpriseContactResponseType } from "@/core/models/contact-new"
import { Button } from "@/shared/ui/button"
import { cn } from "@/lib/utils"
import { useT } from "@/core/hooks"

interface SelectionToolbarProps {
    table: Table<EnterpriseContactResponseType>
    onAddToGroup: (contacts: EnterpriseContactResponseType[]) => void
    onCreateGroup: (contacts: EnterpriseContactResponseType[]) => void
    onDeleteSelected: (contacts: EnterpriseContactResponseType[]) => void
}

export function SelectionToolbar({
    table,
    onAddToGroup,
    onCreateGroup,
    onDeleteSelected,
}: SelectionToolbarProps) {
    const { t } = useT()

    // Use useMemo to ensure we recalculate when row selection changes
    const { selectedRows, selectedCount, selectedContacts } = useMemo(() => {
        const rows = table.getSelectedRowModel().rows
        return {
            selectedRows: rows,
            selectedCount: rows.length,
            selectedContacts: rows.map((row) => row.original)
        }
    }, [table.getState().rowSelection])

    const handleClearSelection = () => {
        table.resetRowSelection()
    }

    return (
        <div className={cn(
            "flex items-center justify-between gap-4 rounded-lg border bg-muted/50 p-3 transition-all duration-200",
            selectedCount > 0 ? "opacity-100 animate-in slide-in-from-top-2" : "opacity-0 pointer-events-none h-0 p-0"
        )}>
            {selectedCount > 0 && (
                <>
                    <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">
                            {selectedCount > 1
                                ? t("users.selectedCountPlural", { count: selectedCount })
                                : t("users.selectedCount", { count: selectedCount })}
                        </span>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={handleClearSelection}
                            className="h-7 px-2 text-muted-foreground hover:text-foreground"
                        >
                            <CloseCircle size={14} variant="Bulk" color="currentColor" className="mr-1" />
                            {t("users.deselect")}
                        </Button>
                    </div>

                    <div className="flex items-center gap-2">
                        {/* Add to Existing Group */}
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => onAddToGroup(selectedContacts)}
                            className="h-8"
                        >
                            <AddCircle size={16} variant="Bulk" color="currentColor" className="mr-2" />
                            {t("users.addToGroup")}
                        </Button>

                        {/* Create New Group */}
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => onCreateGroup(selectedContacts)}
                            className="h-8"
                        >
                            <People size={16} variant="Bulk" color="currentColor" className="mr-2" />
                            {t("users.createGroup")}
                        </Button>

                        {/* Delete Selected */}
                        <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => onDeleteSelected(selectedContacts)}
                            className="h-8"
                        >
                            <Trash size={16} variant="Bulk" color="currentColor" className="mr-2" />
                            {t("users.delete")}
                        </Button>
                    </div>
                </>
            )}
        </div>
    )
}
