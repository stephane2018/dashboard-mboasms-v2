"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card"
import { People, UserAdd, Global, TickCircle } from "iconsax-react"

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
    const stats = [
        {
            title: "Total Contacts",
            value: totalUsers,
            icon: People,
            description: "All contacts in the system",
            color: "text-blue-600",
            bgColor: "bg-blue-50",
        },
        {
            title: "Active Contacts",
            value: activeUsers,
            icon: TickCircle,
            description: "Currently active contacts",
            color: "text-green-600",
            bgColor: "bg-green-50",
        },
        {
            title: "New This Month",
            value: newUsersThisMonth,
            icon: UserAdd,
            description: "Added in the last 30 days",
            color: "text-purple-600",
            bgColor: "bg-purple-50",
        },
        {
            title: "Countries",
            value: countriesCount,
            icon: Global,
            description: "Unique countries represented",
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
