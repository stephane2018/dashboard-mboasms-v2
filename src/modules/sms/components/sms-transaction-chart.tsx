'use client';

import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { useSmsTransactions } from '../hooks/useSmsTransactions';
import { Skeleton } from '@/shared/ui/skeleton';
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from '@/shared/ui/chart';

const chartConfig = {
  sent: {
    label: 'SMS Envoyés',
    color: 'hsl(var(--chart-1))',
  },
  delivered: {
    label: 'SMS Délivrés',
    color: 'hsl(var(--chart-2))',
  },
} satisfies ChartConfig;

export function SmsTransactionChart() {
  const { data: chartData, isLoading, isError } = useSmsTransactions();

  if (isLoading) {
    return <Skeleton className="h-64 w-full" />;
  }

  if (isError || !chartData) {
    return (
      <div className="flex h-64 w-full items-center justify-center rounded-xl border border-dashed border-border/80 bg-muted/40">
        <p className="text-sm text-muted-foreground">Erreur de chargement des données du graphique.</p>
      </div>
    );
  }

  return (
    <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
      <ResponsiveContainer width="100%" height={250}>
        <LineChart data={chartData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border) / 0.5)" />
          <XAxis
            dataKey="date"
            tickLine={false}
            axisLine={false}
            tickMargin={8}
            tickFormatter={(value) => {
              const date = new Date(value);
              return date.toLocaleDateString('fr-FR', { month: 'short', day: 'numeric' });
            }}
            stroke="hsl(var(--muted-foreground))"
            fontSize={12}
          />
          <YAxis
            stroke="hsl(var(--muted-foreground))"
            fontSize={12}
            tickLine={false}
            axisLine={false}
            tickFormatter={(value) => `${value / 1000}k`}
          />
          <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="line" />} />
          <Legend />
          <Line
            dataKey="sent"
            type="monotone"
            stroke="var(--color-sent)"
            strokeWidth={2}
            dot={false}
          />
          <Line
            dataKey="delivered"
            type="monotone"
            stroke="var(--color-delivered)"
            strokeWidth={2}
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
}
