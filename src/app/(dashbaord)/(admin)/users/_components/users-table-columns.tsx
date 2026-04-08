"use client"

import { useState } from "react"
import type { ColumnDef } from "@tanstack/react-table"
import { format } from "date-fns"
import { Edit2, Trash, More, TickCircle, CloseCircle, Sms, Global, Warning2 } from "iconsax-react"
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
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/shared/ui/tooltip"
import { Avatar, AvatarFallback } from "@/shared/ui/avatar"
import { getPhoneValidationStatus, checkPhoneValidation, isCameroonNumber } from "@/core/utils/phone-validation"
interface GetColumnsProps {
    onEdit: (contact: EnterpriseContactResponseType) => void
    onDelete: (contact: EnterpriseContactResponseType) => void
    onSendSMS: (contact: EnterpriseContactResponseType) => void
    t: (key: string, options?: Record<string, unknown>) => string
}

export function getColumns({
    onEdit,
    onDelete,
    onSendSMS,
    t,
}: GetColumnsProps): ColumnDef<EnterpriseContactResponseType>[] {
    return [
        {
            accessorKey: "firstname",
            header: ({ column }) => (
                <DataTableColumnHeader column={column} label={t("users.colName")} />
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
                label: t("users.colName"),
                variant: "text",
                placeholder: t("users.searchByName"),
            },
        },
        {
            accessorKey: "phoneNumber",
            header: ({ column }) => (
                <DataTableColumnHeader column={column} label={t("users.colPhone")} />
            ),
            cell: ({ row }) => {
                const phone = row.original.phoneNumber
                const hasCountryCode = /^\+/.test(phone?.trim() || "")

                if (!hasCountryCode && phone) {
                    return (
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <div className="flex items-center gap-1.5">
                                        <Warning2 size={14} color="currentColor" variant="Bulk" className="text-red-500 shrink-0" />
                                        <span className="font-mono text-sm text-red-600 dark:text-red-400 font-bold">{phone}</span>
                                    </div>
                                </TooltipTrigger>
                                <TooltipContent side="top" className="max-w-[250px] text-xs">
                                    <p className="font-bold">{t("users.missingCountryCode")}</p>
                                    <p>{t("users.missingCountryCodeDesc")}</p>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    )
                }

                return <span className="font-mono text-sm">{phone}</span>
            },
            meta: {
                label: t("users.colPhone"),
                variant: "text",
                placeholder: t("users.searchByPhone"),
            },
        },
        {
            id: "type",
            header: ({ column }) => (
                <DataTableColumnHeader column={column} label={t("users.colType")} />
            ),
            cell: ({ row }) => {
                const phoneNumber = row.original.phoneNumber
                const isCM = isCameroonNumber(phoneNumber)

                return isCM ? (
                    <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100 dark:bg-emerald-500/15 dark:text-emerald-400">
                        {t("users.typeNational")}
                    </Badge>
                ) : (
                    <Badge className="bg-sky-100 text-sky-700 hover:bg-sky-100 dark:bg-sky-500/15 dark:text-sky-400">
                        <Global size={12} color="currentColor" variant="Bulk" className="mr-1" />
                        {t("users.typeInternational")}
                    </Badge>
                )
            },
            meta: {
                label: t("users.colType"),
                className: "w-[130px]",
            },
        },
        {
            id: "operator",
            header: ({ column }) => (
                <DataTableColumnHeader column={column} label={t("users.colOperator")} />
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
                label: t("users.colOperator"),
                className: "w-[120px]",
            },
        },
        {
            id: "status",
            header: ({ column }) => (
                <DataTableColumnHeader column={column} label={t("users.colStatus")} />
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
                                    {t("users.statusCorrect")}
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
                                    {t("users.statusInvalid")}
                                </Badge>
                            </>
                        )}
                    </div>
                )
            },
            meta: {
                label: t("users.colStatus"),
                className: "w-[120px]",
            },
        },
        {
            accessorKey: "country",
            header: ({ column }) => (
                <DataTableColumnHeader column={column} label={t("users.colCountry")} />
            ),
            cell: ({ row }) => {
                const isCM = isCameroonNumber(row.original.phoneNumber)
                if (!isCM) return <span className="text-muted-foreground">--</span>
                return <span>{row.original.country}</span>
            },
            meta: {
                label: t("users.colCountry"),
                variant: "text",
                placeholder: t("users.searchByCountry"),
            },
        },
        {
            accessorKey: "city",
            header: ({ column }) => (
                <DataTableColumnHeader column={column} label={t("users.colCity")} />
            ),
            cell: ({ row }) => {
                const isCM = isCameroonNumber(row.original.phoneNumber)
                if (!isCM) return <span className="text-muted-foreground">--</span>
                return <span>{row.original.city}</span>
            },
            meta: {
                label: t("users.colCity"),
                variant: "text",
                placeholder: t("users.searchByCity"),
            },
        },
        {
            accessorKey: "gender",
            header: ({ column }) => (
                <DataTableColumnHeader column={column} label={t("users.colGender")} />
            ),
            cell: ({ row }) => {
                const gender = row.original.gender
                if (!gender) return <span className="text-muted-foreground">-</span>

                return (
                    <Badge variant={gender === Gender.MALE ? "default" : "secondary"}>
                        {gender === Gender.MALE ? t("users.genderMale") : t("users.genderFemale")}
                    </Badge>
                )
            },
            meta: {
                label: t("users.colGender"),
                variant: "select",
                options: [
                    { label: t("users.genderMale"), value: Gender.MALE },
                    { label: t("users.genderFemale"), value: Gender.FEMALE },
                ],
            },
        },
        {
            accessorKey: "createdAt",
            header: ({ column }) => (
                <DataTableColumnHeader column={column} label={t("users.colCreated")} />
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
                label: t("users.colCreatedDate"),
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
                                <span className="sr-only">{t("users.openMenu")}</span>
                                <More size={16} variant="Bulk" color="currentColor" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuLabel>{t("users.actionsLabel")}</DropdownMenuLabel>
                            <DropdownMenuItem onClick={() => onSendSMS(contact)}>
                                <Sms size={16} variant="Bulk" color="currentColor" className="mr-2" />
                                {t("users.actionSendSms")}
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => onEdit(contact)}>
                                <Edit2 size={16} variant="Bulk" color="currentColor" className="mr-2" />
                                {t("users.actionEdit")}
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                onClick={() => onDelete(contact)}
                                className="text-red-600 focus:text-red-600"
                            >
                                <Trash size={16} variant="Bulk" color="currentColor" className="mr-2" />
                                {t("users.actionDelete")}
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
