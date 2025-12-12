"use client"

import { Card, CardContent } from "@/shared/ui/card"
import { Wallet, Clock, TickCircle, CloseCircle, MoneyRecive } from "iconsax-react"

interface RechargeStatisticsProps {
  totalRecharges: number
  pendingRecharges: number
  validatedRecharges: number
  refusedRecharges: number
  totalAmount: number
}

export function RechargeStatistics({
  totalRecharges,
  pendingRecharges,
  validatedRecharges,
  refusedRecharges,
  totalAmount,
}: RechargeStatisticsProps) {
  const stats = [
    {
      title: "Total recharges",
      value: totalRecharges.toLocaleString(),
      icon: Wallet,
      iconColor: "text-blue-600",
      bgColor: "bg-blue-50 dark:bg-blue-900/20",
    },
    {
      title: "En attente",
      value: pendingRecharges.toLocaleString(),
      icon: Clock,
      iconColor: "text-amber-600",
      bgColor: "bg-amber-50 dark:bg-amber-900/20",
    },
    {
      title: "Validées",
      value: validatedRecharges.toLocaleString(),
      icon: TickCircle,
      iconColor: "text-green-600",
      bgColor: "bg-green-50 dark:bg-green-900/20",
    },
    {
      title: "Refusées",
      value: refusedRecharges.toLocaleString(),
      icon: CloseCircle,
      iconColor: "text-red-600",
      bgColor: "bg-red-50 dark:bg-red-900/20",
    },
    {
      title: "Montant total",
      value: `${totalAmount.toLocaleString()} FCFA`,
      icon: MoneyRecive,
      iconColor: "text-purple-600",
      bgColor: "bg-purple-50 dark:bg-purple-900/20",
    },
  ]

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {stats.map((stat) => (
        <Card key={stat.title} className="border-2">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground">
                  {stat.title}
                </p>
                <p className="text-2xl font-bold tracking-tight">
                  {stat.value}
                </p>
              </div>
              <div className={`${stat.bgColor} rounded-lg p-2.5`}>
                <stat.icon
                  size={24}
                  variant="Bulk"
                   color="currentColor"
                  className={stat.iconColor}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
