'use client';

import * as React from 'react';
import { Area, AreaChart, CartesianGrid, XAxis, ResponsiveContainer } from 'recharts';
import { useSmsTransactions } from '../hooks/useSmsTransactions';
import { Skeleton } from '@/shared/ui/skeleton';
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from '@/shared/ui/chart';

const chartConfig = {
  sent: {
    label: 'SMS envoyés',
    color: 'var(--chart-1)',
  },
  delivered: {
    label: 'SMS délivrés',
    color: 'var(--chart-2)',
  },
} satisfies ChartConfig;

export function SmsTransactionChart() {
  const { data, isLoading, isError } = useSmsTransactions();

  if (isLoading) {
    return <Skeleton className="h-64 w-full" />;
  }

  if (isError || !data) {
    return (
      <div className="flex h-64 w-full items-center justify-center rounded-xl border border-dashed border-border/80 bg-muted/40">
        <p className="text-sm text-muted-foreground">Erreur de chargement des données du graphique.</p>
      </div>
    );
  }

  const filteredData = data;

  return (
    <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
      <ResponsiveContainer width="100%" height={260}>
        <AreaChart data={filteredData} margin={{ top: 10, right: 20, left: 0, bottom: 10 }}>
          <defs>
            <linearGradient id="fillSent" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="var(--chart-1)" stopOpacity={0.8} />
              <stop offset="95%" stopColor="var(--chart-1)" stopOpacity={0.1} />
            </linearGradient>
            <linearGradient id="fillDelivered" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="var(--chart-2)" stopOpacity={0.8} />
              <stop offset="95%" stopColor="var(--chart-2)" stopOpacity={0.1} />
            </linearGradient>
          </defs>
          <CartesianGrid vertical={false} stroke="hsl(var(--border) / 0.5)" />
          <XAxis
            dataKey="date"
            tickLine={false}
            axisLine={false}
            tickMargin={8}
            minTickGap={24}
            tickFormatter={(value) => {
              const date = new Date(value);
              return date.toLocaleDateString('fr-FR', {
                month: 'short',
                day: 'numeric',
              });
            }}
            stroke="hsl(var(--muted-foreground))"
          />
          <ChartTooltip
            cursor={false}
            content={
              <ChartTooltipContent
                indicator="dot"
                labelFormatter={(value) =>
                  new Date(value).toLocaleDateString('fr-FR', { month: 'short', day: 'numeric' })
                }
              />
            }
          />
          <Area
            dataKey="sent"
            type="monotone"
            fill="url(#fillSent)"
            stroke="var(--chart-1)"
            strokeWidth={2}
          />
          <Area
            dataKey="delivered"
            type="monotone"
            fill="url(#fillDelivered)"
            stroke="var(--chart-2)"
            strokeWidth={2}
          />
          <ChartLegend content={<ChartLegendContent />} />
        </AreaChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
}
