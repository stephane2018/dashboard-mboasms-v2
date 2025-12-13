"use client"

import * as React from "react"
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/ui/card"
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/shared/ui/chart"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/ui/select"

type HistoryItem = {
  createdAt?: string
}

const chartConfig = {
  sms_sent: {
    label: "SMS envoyés",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig

function groupHistoryByDay(history: HistoryItem[]) {
  const byDay = new Map<string, number>()

  for (const item of history) {
    if (!item?.createdAt) continue
    const d = new Date(item.createdAt)
    if (Number.isNaN(d.getTime())) continue
    const key = d.toISOString().slice(0, 10) // YYYY-MM-DD
    byDay.set(key, (byDay.get(key) ?? 0) + 1)
  }

  return Array.from(byDay.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([date, sms_sent]) => ({ date, sms_sent }))
}

export function MessagesAreaChart({ history }: { history: HistoryItem[] }) {
  const [timeRange, setTimeRange] = React.useState("30d")

  const aggregated = React.useMemo(() => groupHistoryByDay(history), [history])

  const filteredData = React.useMemo(() => {
    const referenceDate = new Date()
    let daysToSubtract = 30
    if (timeRange === "90d") daysToSubtract = 90
    if (timeRange === "7d") daysToSubtract = 7

    const startDate = new Date(referenceDate)
    startDate.setDate(startDate.getDate() - daysToSubtract)

    return aggregated.filter((item) => {
      const date = new Date(item.date)
      return date >= startDate
    })
  }, [aggregated, timeRange])

  return (
    <Card className="pt-0">
      <CardHeader className="flex items-center gap-2 space-y-0 border-b py-5 sm:flex-row">
        <div className="grid flex-1 gap-1">
          <CardTitle>Envois SMS</CardTitle>
          <CardDescription>Volume d'envoi sur la période sélectionnée</CardDescription>
        </div>
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger className="hidden w-[160px] rounded-lg sm:ml-auto sm:flex" aria-label="Select a value">
            <SelectValue placeholder="Derniers 30 jours" />
          </SelectTrigger>
          <SelectContent className="rounded-xl">
            <SelectItem value="90d" className="rounded-lg">
              Derniers 3 mois
            </SelectItem>
            <SelectItem value="30d" className="rounded-lg">
              Derniers 30 jours
            </SelectItem>
            <SelectItem value="7d" className="rounded-lg">
              Derniers 7 jours
            </SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer config={chartConfig} className="aspect-auto h-[250px] w-full">
          <AreaChart data={filteredData}>
            <defs>
              <linearGradient id="fillSms" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--color-sms_sent)" stopOpacity={0.8} />
                <stop offset="95%" stopColor="var(--color-sms_sent)" stopOpacity={0.1} />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) => {
                const date = new Date(value)
                return date.toLocaleDateString("fr-FR", { month: "short", day: "numeric" })
              }}
            />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  labelFormatter={(value) => {
                    return new Date(value as string).toLocaleDateString("fr-FR", {
                      month: "short",
                      day: "numeric",
                    })
                  }}
                  indicator="dot"
                />
              }
            />
            <Area
              dataKey="sms_sent"
              type="natural"
              fill="url(#fillSms)"
              stroke="var(--color-sms_sent)"
              stackId="a"
            />
            <ChartLegend content={<ChartLegendContent />} />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
