"use client"

import { useState } from "react"
import type { ColumnDef } from "@tanstack/react-table"
import { format } from "date-fns"
import { Edit2, Trash, More, TickCircle, CloseCircle, Sms, Global } from "iconsax-react"
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
import { getPhoneValidationStatus, checkPhoneValidation, isCameroonNumber } from "@/core/utils/phone-validation"

interface GetColumnsProps {
    onEdit: (contact: EnterpriseContactResponseType) => void
    onDelete: (contact: EnterpriseContactResponseType) => void
    onSendSMS: (contact: EnterpriseContactResponseType) => void
}

export function getColumns({
    onEdit,
    onDelete,
    onSendSMS,
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
            id: "type",
            header: ({ column }) => (
                <DataTableColumnHeader column={column} label="Type" />
            ),
            cell: ({ row }) => {
                const phoneNumber = row.original.phoneNumber
                const isCM = isCameroonNumber(phoneNumber)

                return isCM ? (
                    <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100 dark:bg-emerald-500/15 dark:text-emerald-400">
                        National
                    </Badge>
                ) : (
                    <Badge className="bg-sky-100 text-sky-700 hover:bg-sky-100 dark:bg-sky-500/15 dark:text-sky-400">
                        <Global size={12} color="currentColor" variant="Bulk" className="mr-1" />
                        International
                    </Badge>
                )
            },
            meta: {
                label: "Type",
                className: "w-[130px]",
            },
        },
        {
            id: "operator",
            header: ({ column }) => (
                <DataTableColumnHeader column={column} label="Opérateur" />
            ),
            cell: ({ row }) => {
                const phoneNumber = row.original.phoneNumber
                const isCM = isCameroonNumber(phoneNumber)

                if (!isCM) {
                    return <span className="text-muted-foreground">--</span>
                }

                const operator = checkPhoneValidation(phoneNumber)

                const operatorColors: Record<string, string> = {
                    ORANGE: "bg-orange-100 text-orange-800 hover:bg-orange-100 dark:bg-orange-500/15 dark:text-orange-400",
                    MTN: "bg-yellow-100 text-yellow-800 hover:bg-yellow-100 dark:bg-yellow-500/15 dark:text-yellow-400",
                    CAMTEL: "bg-blue-100 text-blue-800 hover:bg-blue-100 dark:bg-blue-500/15 dark:text-blue-400",
                    NEXTTEL: "bg-red-100 text-red-800 hover:bg-red-100 dark:bg-red-500/15 dark:text-red-400",
                    UNKNOWN: "bg-gray-100 text-gray-800 hover:bg-gray-100 dark:bg-gray-500/15 dark:text-gray-400",
                }

                return (
                    <Badge className={operatorColors[operator] || operatorColors.UNKNOWN}>
                        {operator}
                    </Badge>
                )
            },
            meta: {
                label: "Opérateur",
                className: "w-[120px]",
            },
        },
        {
            id: "status",
            header: ({ column }) => (
                <DataTableColumnHeader column={column} label="Statut" />
            ),
            cell: ({ row }) => {
                const phoneNumber = row.original.phoneNumber
                const isCM = isCameroonNumber(phoneNumber)

                if (!isCM) {
                    return <span className="text-muted-foreground">--</span>
                }

                const status = getPhoneValidationStatus(phoneNumber)

                return (
                    <div className="flex items-center gap-2">
                        {status === "CORRECT" ? (
                            <>
                                <TickCircle
                                    size={16}
                                    variant="Bulk"
                                    color="currentColor"
                                    className="text-green-600"
                                />
                                <Badge variant="default" className="bg-green-100 text-green-800 hover:bg-green-100">
                                    Correct
                                </Badge>
                            </>
                        ) : (
                            <>
                                <CloseCircle
                                    size={16}
                                    variant="Bulk"
                                    color="currentColor"
                                    className="text-red-600"
                                />
                                <Badge variant="destructive" className="bg-red-100 text-red-800 hover:bg-red-100">
                                    Invalid
                                </Badge>
                            </>
                        )}
                    </div>
                )
            },
            meta: {
                label: "Statut",
                className: "w-[120px]",
            },
        },
        {
            accessorKey: "country",
            header: ({ column }) => (
                <DataTableColumnHeader column={column} label="Pays" />
            ),
            cell: ({ row }) => {
                const isCM = isCameroonNumber(row.original.phoneNumber)
                if (!isCM) return <span className="text-muted-foreground">--</span>
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
                <DataTableColumnHeader column={column} label="Ville" />
            ),
            cell: ({ row }) => {
                const isCM = isCameroonNumber(row.original.phoneNumber)
                if (!isCM) return <span className="text-muted-foreground">--</span>
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
                            <DropdownMenuItem onClick={() => onSendSMS(contact)}>
                                <Sms size={16} variant="Bulk" color="currentColor" className="mr-2" />
                                Envoyer SMS
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
