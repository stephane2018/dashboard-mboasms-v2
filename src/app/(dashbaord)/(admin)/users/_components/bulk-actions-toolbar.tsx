"use client"

import type { Table } from "@tanstack/react-table"
import { MessageText, Element3, Trash, DocumentDownload } from "iconsax-react"
import type { EnterpriseContactResponseType } from "@/core/models/contact-new"
import { Button } from "@/shared/ui/button"
import { Separator } from "@/shared/ui/separator"
import { X } from "lucide-react"

interface BulkActionsToolbarProps {
    table: Table<EnterpriseContactResponseType>
    onSendSMS: (contacts: EnterpriseContactResponseType[]) => void
    onCreateGroup: (contacts: EnterpriseContactResponseType[]) => void
    onDeleteSelected: (contacts: EnterpriseContactResponseType[]) => void
    onExport: (contacts: EnterpriseContactResponseType[]) => void
}

export function BulkActionsToolbar({
    table,
    onSendSMS,
    onCreateGroup,
    onDeleteSelected,
    onExport,
}: BulkActionsToolbarProps) {
    const selectedRows = table.getFilteredSelectedRowModel().rows
    const selectedCount = selectedRows.length
    const selectedContacts = selectedRows.map((row) => row.original)

    if (selectedCount === 0) return null

    return (
        <div className="flex items-center gap-2 bg-muted/50 px-4 py-2 rounded-lg border">
            <div className="flex items-center gap-2 flex-1">
                <span className="text-sm font-medium">
                    {selectedCount} contact{selectedCount > 1 ? "s" : ""} selected
                </span>
                <Separator orientation="vertical" className="h-4" />
                <div className="flex items-center gap-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onSendSMS(selectedContacts)}
                        className="h-8"
                    >
                        <MessageText size={16} variant="Bulk" className="mr-2" />
                        Send SMS
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onCreateGroup(selectedContacts)}
                        className="h-8"
                    >
                        <Element3 size={16} variant="Bulk" className="mr-2" />
                        Create Group
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onExport(selectedContacts)}
                        className="h-8"
                    >
                        <DocumentDownload size={16} variant="Bulk" className="mr-2" />
                        Export
                    </Button>
                    <Separator orientation="vertical" className="h-4" />
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onDeleteSelected(selectedContacts)}
                        className="h-8 text-red-600 hover:text-red-600 hover:bg-red-50"
                    >
                        <Trash size={16} variant="Bulk" className="mr-2" />
                        Delete
                    </Button>
                </div>
            </div>
            <Button
                variant="ghost"
                size="sm"
                onClick={() => table.resetRowSelection()}
                className="h-8 px-2"
            >
                <X className="h-4 w-4" />
            </Button>
        </div>
    )
}
