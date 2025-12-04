"use client"

import { useState } from "react"
import type { Table } from "@tanstack/react-table"
import { format } from "date-fns"
import { fr } from "date-fns/locale"
import {
    UserAdd,
    SearchNormal1,
    Call,
    Global,
    Location,
    Calendar as CalendarIcon,
    CloseCircle
} from "iconsax-react"
import type { EnterpriseContactResponseType } from "@/core/models/contact-new"
import { Button } from "@/shared/ui/button"
import { Input } from "@/shared/ui/input"
import { Popover, PopoverContent, PopoverTrigger } from "@/shared/ui/popover"
import { cn } from "@/lib/utils"

interface UsersCustomFilterProps {
    table: Table<EnterpriseContactResponseType>
    onAddContact: () => void
}

export function UsersCustomFilter({
    table,
    onAddContact,
}: UsersCustomFilterProps) {
    const [date, setDate] = useState<Date | undefined>()

    // Get column filter values
    const nameColumn = table.getColumn("firstname")
    const phoneColumn = table.getColumn("phoneNumber")
    const countryColumn = table.getColumn("country")
    const cityColumn = table.getColumn("city")
    const createdAtColumn = table.getColumn("createdAt")

    const handleDateSelect = (selectedDate: Date | undefined) => {
        setDate(selectedDate)
        if (selectedDate) {
            createdAtColumn?.setFilterValue(selectedDate.getTime())
        } else {
            createdAtColumn?.setFilterValue(undefined)
        }
    }

    const clearFilters = () => {
        table.resetColumnFilters()
        setDate(undefined)
    }

    const hasFilters = table.getState().columnFilters.length > 0

    return (
        <div className="flex flex-col gap-4">
            {/* Filter Row */}
            <div className="flex flex-wrap items-center gap-3">



                {/* Add Contact Button */}
                <Button onClick={onAddContact} size="sm" className="h-9">
                    <UserAdd
                        size={16}
                        variant="Bulk"
                        color="currentColor"
                        className="mr-2"
                    />
                    Ajouter un contact
                </Button>
            </div>
        </div>
    )
}
