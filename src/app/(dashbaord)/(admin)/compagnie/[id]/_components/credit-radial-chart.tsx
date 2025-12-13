"use client"

import * as React from "react"
import { Label, PolarGrid, PolarRadiusAxis, RadialBar, RadialBarChart } from "recharts"

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/shared/ui/card"
import { ChartContainer, type ChartConfig } from "@/shared/ui/chart"

const chartConfig = {
  credit: {
    label: "Crédit",
    color: "var(--chart-2)",
  },
} satisfies ChartConfig

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n))
}

export function CreditRadialChart({ credit }: { credit: number }) {
  const max = 1000
  const value = clamp(Number(credit) || 0, 0, max)

  const chartData = React.useMemo(
    () => [{ name: "credit", credit: value, fill: "var(--color-credit)" }],
    [value]
  )

  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle>Solde SMS</CardTitle>
        <CardDescription>Crédit restant</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer config={chartConfig} className="mx-auto aspect-square max-h-[250px]">
          <RadialBarChart data={chartData} startAngle={0} endAngle={250} innerRadius={80} outerRadius={110}>
            <PolarGrid
              gridType="circle"
              radialLines={false}
              stroke="none"
              className="first:fill-muted last:fill-background"
              polarRadius={[86, 74]}
            />
            <RadialBar dataKey="credit" background cornerRadius={10} />
            <PolarRadiusAxis tick={false} tickLine={false} axisLine={false}>
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <text x={viewBox.cx} y={viewBox.cy} textAnchor="middle" dominantBaseline="middle">
                        <tspan x={viewBox.cx} y={viewBox.cy} className="fill-foreground text-3xl font-bold">
                          {value.toLocaleString()}
                        </tspan>
                        <tspan x={viewBox.cx} y={(viewBox.cy || 0) + 22} className="fill-muted-foreground">
                          SMS
                        </tspan>
                      </text>
                    )
                  }
                }}
              />
            </PolarRadiusAxis>
          </RadialBarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-1 text-sm">
        <div className="text-muted-foreground leading-none">Affichage plafonné à {max.toLocaleString()} pour le cadran</div>
      </CardFooter>
    </Card>
  )
}
