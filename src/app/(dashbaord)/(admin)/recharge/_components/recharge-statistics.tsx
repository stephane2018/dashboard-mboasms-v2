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
      gradient: "from-blue-500/10 to-blue-600/5",
      iconBg: "bg-blue-500/10 dark:bg-blue-500/20",
      iconColor: "text-blue-600 dark:text-blue-400",
      borderAccent: "border-l-blue-500",
    },
    {
      title: "En attente",
      value: pendingRecharges.toLocaleString(),
      icon: Clock,
      gradient: "from-amber-500/10 to-amber-600/5",
      iconBg: "bg-amber-500/10 dark:bg-amber-500/20",
      iconColor: "text-amber-600 dark:text-amber-400",
      borderAccent: "border-l-amber-500",
    },
    {
      title: "Validées",
      value: validatedRecharges.toLocaleString(),
      icon: TickCircle,
      gradient: "from-emerald-500/10 to-emerald-600/5",
      iconBg: "bg-emerald-500/10 dark:bg-emerald-500/20",
      iconColor: "text-emerald-600 dark:text-emerald-400",
      borderAccent: "border-l-emerald-500",
    },
    {
      title: "Refusées",
      value: refusedRecharges.toLocaleString(),
      icon: CloseCircle,
      gradient: "from-rose-500/10 to-rose-600/5",
      iconBg: "bg-rose-500/10 dark:bg-rose-500/20",
      iconColor: "text-rose-600 dark:text-rose-400",
      borderAccent: "border-l-rose-500",
    },
    {
      title: "Montant total",
      value: `${totalAmount.toLocaleString()} FCFA`,
      icon: MoneyRecive,
      gradient: "from-violet-500/10 to-violet-600/5",
      iconBg: "bg-violet-500/10 dark:bg-violet-500/20",
      iconColor: "text-violet-600 dark:text-violet-400",
      borderAccent: "border-l-violet-500",
    },
  ]

  return (
    <div className="grid gap-3 grid-cols-2 lg:grid-cols-5">
      {stats.map((stat) => (
        <Card
          key={stat.title}
          className={`relative overflow-hidden border-l-[3px] ${stat.borderAccent} bg-gradient-to-br ${stat.gradient} backdrop-blur-sm transition-all duration-200 hover:shadow-md hover:-translate-y-0.5`}
        >
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className={`${stat.iconBg} rounded-xl p-2.5 shrink-0`}>
                <stat.icon
                  size={20}
                  variant="Bulk"
                  color="currentColor"
                  className={stat.iconColor}
                />
              </div>
              <div className="min-w-0">
                <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider truncate">
                  {stat.title}
                </p>
                <p className="text-lg font-bold tracking-tight truncate">
                  {stat.value}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
