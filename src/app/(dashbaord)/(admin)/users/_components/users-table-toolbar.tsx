"use client"

import type { Table } from "@tanstack/react-table"
import { UserAdd } from "iconsax-react"
import type { EnterpriseContactResponseType } from "@/core/models/contact-new"
import { DataTableToolbar } from "@/shared/common/data-table/data-table-toolabr"
import { Button } from "@/shared/ui/button"
import { useT } from "@/core/hooks"

interface UsersTableToolbarProps {
    table: Table<EnterpriseContactResponseType>
    onAddContact: () => void
}

export function UsersTableToolbar({
    table,
    onAddContact,
}: UsersTableToolbarProps) {
    const { t } = useT()

    return (
        <DataTableToolbar table={table}>
            <Button onClick={onAddContact} size="sm">
                <UserAdd size={16} variant="Bulk" color="currentColor" className="mr-2" />
                {t("users.addContact")}
            </Button>
        </DataTableToolbar>
    )
}
