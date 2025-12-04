"use client"

import { useState } from "react"
import type { ColumnDef } from "@tanstack/react-table"
import { format } from "date-fns"
import { Edit2, Trash, More } from "iconsax-react"
import type { EnterpriseContactResponseType } from "@/core/models/contact-new"
import { Gender } from "@/core/config/enum"
import { DataTableColumnHeader } from "@/shared/common/data-table/data-table-column-header"
import { Button } from "@/shared/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/shared/ui/dropdown-menu"
import { Badge } from "@/shared/ui/badge"
import { Avatar, AvatarFallback } from "@/shared/ui/avatar"

interface GetColumnsProps {
    onEdit: (contact: EnterpriseContactResponseType) => void
    onDelete: (contact: EnterpriseContactResponseType) => void
}

export function getColumns({
    onEdit,
    onDelete,
}: GetColumnsProps): ColumnDef<EnterpriseContactResponseType>[] {
    return [
        {
            accessorKey: "firstname",
            header: ({ column }) => (
                <DataTableColumnHeader column={column} label="Name" />
            ),
            cell: ({ row }) => {
                const firstname = row.original.firstname
                const lastname = row.original.lastname
                const email = row.original.email
                const initials = `${firstname[0]}${lastname[0]}`.toUpperCase()

                return (
                    <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                            <AvatarFallback className="text-xs">{initials}</AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col">
                            <span className="font-medium">
                                {firstname} {lastname}
                            </span>
                            <span className="text-xs text-muted-foreground">{email}</span>
                        </div>
                    </div>
                )
            },
            meta: {
                label: "Name",
                variant: "text",
                placeholder: "Search by name...",
            },
        },
        {
            accessorKey: "phoneNumber",
            header: ({ column }) => (
                <DataTableColumnHeader column={column} label="Phone" />
            ),
            cell: ({ row }) => {
                return <span className="font-mono text-sm">{row.original.phoneNumber}</span>
            },
            meta: {
                label: "Phone",
                variant: "text",
                placeholder: "Search by phone...",
            },
        },
        {
            accessorKey: "country",
            header: ({ column }) => (
                <DataTableColumnHeader column={column} label="Country" />
            ),
            cell: ({ row }) => {
                return <span>{row.original.country}</span>
            },
            meta: {
                label: "Country",
                variant: "text",
                placeholder: "Filter by country...",
            },
        },
        {
            accessorKey: "city",
            header: ({ column }) => (
                <DataTableColumnHeader column={column} label="City" />
            ),
            cell: ({ row }) => {
                return <span>{row.original.city}</span>
            },
            meta: {
                label: "City",
                variant: "text",
                placeholder: "Filter by city...",
            },
        },
        {
            accessorKey: "gender",
            header: ({ column }) => (
                <DataTableColumnHeader column={column} label="Gender" />
            ),
            cell: ({ row }) => {
                const gender = row.original.gender
                if (!gender) return <span className="text-muted-foreground">-</span>

                return (
                    <Badge variant={gender === Gender.MALE ? "default" : "secondary"}>
                        {gender === Gender.MALE ? "Male" : "Female"}
                    </Badge>
                )
            },
            meta: {
                label: "Gender",
                variant: "select",
                options: [
                    { label: "Male", value: Gender.MALE },
                    { label: "Female", value: Gender.FEMALE },
                ],
            },
        },
        {
            accessorKey: "createdAt",
            header: ({ column }) => (
                <DataTableColumnHeader column={column} label="Created" />
            ),
            cell: ({ row }) => {
                const date = new Date(row.original.createdAt)
                return (
                    <span className="text-sm text-muted-foreground">
                        {format(date, "MMM dd, yyyy")}
                    </span>
                )
            },
            meta: {
                label: "Created Date",
                variant: "date",
            },
        },
        {
            id: "actions",
            cell: ({ row }) => {
                const contact = row.original

                return (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                                <span className="sr-only">Open menu</span>
                                <More size={16} variant="Bulk" color="currentColor" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem
                                onClick={() => navigator.clipboard.writeText(contact.email)}
                            >
                                Copy email
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                onClick={() => navigator.clipboard.writeText(contact.phoneNumber)}
                            >
                                Copy phone
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => onEdit(contact)}>
                                <Edit2 size={16} variant="Bulk" color="currentColor" className="mr-2" />
                                Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                onClick={() => onDelete(contact)}
                                className="text-red-600 focus:text-red-600"
                            >
                                <Trash size={16} variant="Bulk" color="currentColor" className="mr-2" />
                                Delete
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                )
            },
            meta: {
                className: "w-[50px]",
            },
        },
    ]
}
