"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card"
import { People, UserAdd, Global, TickCircle } from "iconsax-react"
import { useT } from "@/core/hooks"

interface UsersStatisticsProps {
    totalUsers: number
    activeUsers: number
    newUsersThisMonth: number
    countriesCount: number
}

export function UsersStatistics({
    totalUsers,
    activeUsers,
    newUsersThisMonth,
    countriesCount,
}: UsersStatisticsProps) {
    const { t } = useT()

    const stats = [
        {
            title: t("users.statTotalContacts"),
            value: totalUsers,
            icon: People,
            description: t("users.statTotalDesc"),
            color: "text-blue-600",
            bgColor: "bg-blue-50",
        },
        {
            title: t("users.statActiveContacts"),
            value: activeUsers,
            icon: TickCircle,
            description: t("users.statActiveDesc"),
            color: "text-green-600",
            bgColor: "bg-green-50",
        },
        {
            title: t("users.statNewThisMonth"),
            value: newUsersThisMonth,
            icon: UserAdd,
            description: t("users.statNewDesc"),
            color: "text-purple-600",
            bgColor: "bg-purple-50",
        },
        {
            title: t("users.statCountries"),
            value: countriesCount,
            icon: Global,
            description: t("users.statCountriesDesc"),
            color: "text-orange-600",
            bgColor: "bg-orange-50",
        },
    ]

    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat) => {
                const Icon = stat.icon
                return (
                    <Card key={stat.title}>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                {stat.title}
                            </CardTitle>
                            {/* <div className={`${stat.bgColor} p-2 rounded-lg`}> */}
                            <Icon className={`h-4 w-4 ${stat.color}`} variant="Bulk" color="currentColor" />
                            {/* </div> */}
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stat.value.toLocaleString()}</div>
                            <p className="text-xs text-muted-foreground mt-1">
                                {stat.description}
                            </p>
                        </CardContent>
                    </Card>
                )
            })}
        </div>
    )
}
