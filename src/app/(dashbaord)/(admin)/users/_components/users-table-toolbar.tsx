"use client"

import type { Table } from "@tanstack/react-table"
import { UserAdd } from "iconsax-react"
import type { EnterpriseContactResponseType } from "@/core/models/contact-new"
import { DataTableToolbar } from "@/shared/common/data-table/data-table-toolabr"
import { Button } from "@/shared/ui/button"

interface UsersTableToolbarProps {
    table: Table<EnterpriseContactResponseType>
    onAddContact: () => void
}

export function UsersTableToolbar({
    table,
    onAddContact,
}: UsersTableToolbarProps) {
    return (
        <DataTableToolbar table={table}>
            <Button onClick={onAddContact} size="sm">
                <UserAdd size={16} variant="Bulk" color="currentColor" className="mr-2" />
                Add Contact
            </Button>
        </DataTableToolbar>
    )
}
