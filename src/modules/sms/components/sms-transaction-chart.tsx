'use client';

import * as React from 'react';
import { useState, useMemo } from 'react';
import { Area, AreaChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer } from 'recharts';
import { useMessageTimeline } from '@/core/hooks';
import { Skeleton } from '@/shared/ui/skeleton';
import { Button } from '@/shared/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/ui/select';
import { Calendar } from '@/shared/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/shared/ui/popover';
import { cn } from '@/lib/utils';
import {
  ChartContainer,
  ChartTooltip,
  type ChartConfig,
} from '@/shared/ui/chart';
import { Calendar as CalendarIcon, Filter, RefreshCcw } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import type { Period } from '@/modules/statistics/types';

const chartConfig = {
  count: {
    label: 'SMS envoyés',
    color: 'var(--chart-1)',
  },
} satisfies ChartConfig;

const periods: { value: Period; label: string }[] = [
  { value: 'DAY', label: 'Journalier' },
  { value: 'WEEK', label: 'Hebdomadaire' },
  { value: 'MONTH', label: 'Mensuel' },
  { value: 'YEAR', label: 'Annuel' },
];

interface TooltipProps {
  active?: boolean;
  payload?: Array<{
    payload: {
      label: string;
      originalLabel?: string;
      count: number;
    };
  }>;
}

const CustomTooltip = ({ active, payload }: TooltipProps) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-popover border border-border rounded-lg p-3 shadow-lg">
        <div className="text-sm text-muted-foreground mb-1">{data.label}</div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: chartConfig.count.color }} />
          <div className="text-base font-bold">{data.count.toLocaleString()} SMS</div>
        </div>
      </div>
    );
  }
  return null;
};

function SmsTransactionChartSkeleton() {
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-3 items-center">
        <Skeleton className="h-4 w-16" />
        <Skeleton className="h-9 w-[140px]" />
        <Skeleton className="h-9 w-[160px]" />
        <Skeleton className="h-9 w-[160px]" />
        <Skeleton className="h-9 w-20" />
      </div>
      <div className="flex gap-4">
        <Skeleton className="h-8 w-32" />
        <Skeleton className="h-6 w-20" />
        <Skeleton className="h-6 w-20" />
        <Skeleton className="h-6 w-24" />
      </div>
      <Skeleton className="h-[260px] w-full rounded-lg" />
    </div>
  );
}

export function SmsTransactionChart() {
  // Default to current month
  const now = useMemo(() => new Date(), []);
  const defaultStartDate = useMemo(() => new Date(now.getFullYear(), now.getMonth(), 1), [now]);
  const defaultEndDate = useMemo(() => new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999), [now]);

  const [period, setPeriod] = useState<Period>('DAY');
  const [startDate, setStartDate] = useState<Date | undefined>(defaultStartDate);
  const [endDate, setEndDate] = useState<Date | undefined>(defaultEndDate);

  // Convert dates to ISO format for API
  const startDateISO = useMemo(() =>
    startDate ? startDate.toISOString() : '', [startDate]
  );
  const endDateISO = useMemo(() =>
    endDate ? endDate.toISOString() : '', [endDate]
  );

  const { data, isLoading, isFetching, error, refetch } = useMessageTimeline({
    period,
    startDate: startDateISO,
    endDate: endDateISO,
    enabled: !!startDateISO && !!endDateISO,
  });

  const totalSms = useMemo(() =>
    data.reduce((sum, item) => sum + item.count, 0), [data]
  );
  const maxCount = useMemo(() =>
    data.length > 0 ? Math.max(...data.map((d) => d.count)) : 0, [data]
  );
  const minCount = useMemo(() =>
    data.length > 0 ? Math.min(...data.map((d) => d.count)) : 0, [data]
  );

  const handleRefresh = () => {
    refetch();
  };

  const handleClearDates = () => {
    setStartDate(defaultStartDate);
    setEndDate(defaultEndDate);
  };

  if (isLoading) {
    return <SmsTransactionChartSkeleton />;
  }

  if (error && data.length === 0) {
    return (
      <div className="flex h-64 w-full items-center justify-center rounded-xl border border-dashed border-border/80 bg-muted/40">
        <div className="text-center">
          <p className="text-sm text-muted-foreground mb-2">{error}</p>
          <Button variant="outline" size="sm" onClick={handleRefresh}>
            Réessayer
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-3 items-center">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">Filtres:</span>
        </div>

        <Select value={period} onValueChange={(value: Period) => setPeriod(value)}>
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="Période" />
          </SelectTrigger>
          <SelectContent>
            {periods.map((p) => (
              <SelectItem key={p.value} value={p.value}>
                {p.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <div className="flex items-center gap-2">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-[160px] justify-start text-left font-normal",
                  !startDate && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {startDate ? format(startDate, "dd MMM yyyy", { locale: fr }) : "Date début"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={startDate}
                onSelect={(date) => {
                  setStartDate(date);
                  if (date && endDate && date > endDate) {
                    setEndDate(date);
                  }
                }}
              />
            </PopoverContent>
          </Popover>

          <span className="text-muted-foreground">-</span>

          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-[160px] justify-start text-left font-normal",
                  !endDate && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {endDate ? format(endDate, "dd MMM yyyy", { locale: fr }) : "Date fin"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={endDate}
                onSelect={(date) => {
                  setEndDate(date);
                  if (date && startDate && date < startDate) {
                    setStartDate(date);
                  }
                }}
                disabled={(date) => startDate ? date < startDate : false}
              />
            </PopoverContent>
          </Popover>
        </div>

        <Button
          variant="ghost"
          size="sm"
          onClick={handleClearDates}
          className="text-muted-foreground hover:text-foreground"
        >
          Réinitialiser
        </Button>

        <Button
          variant="outline"
          size="sm"
          onClick={handleRefresh}
          disabled={isFetching}
          className="gap-2"
        >
          <RefreshCcw className={cn("h-4 w-4", isFetching && "animate-spin")} />
          {isFetching ? 'Chargement...' : 'Actualiser'}
        </Button>
      </div>

      <div className="flex items-center gap-4 text-sm flex-wrap">
        <div className="flex items-center gap-2">
          <span className="text-muted-foreground">Total:</span>
          <span className="text-2xl font-bold">{totalSms.toLocaleString()} SMS</span>
        </div>
        <span className="text-muted-foreground hidden sm:inline">|</span>
        <span>
          Max: <span className="text-emerald-600 font-medium">{maxCount.toLocaleString()}</span>
        </span>
        <span>
          Min: <span className="text-amber-600 font-medium">{minCount.toLocaleString()}</span>
        </span>
        <span>
          Périodes: <span className="text-purple-600 font-medium">{data.length}</span>
        </span>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded-md text-sm dark:bg-red-900/20 dark:border-red-800 dark:text-red-400">
          {error}
        </div>
      )}

      {data.length === 0 && !isLoading && !error ? (
        <div className="flex h-[260px] w-full items-center justify-center rounded-xl border border-dashed border-border/80 bg-muted/40">
          <p className="text-sm text-muted-foreground">Aucune donnée disponible pour cette période</p>
        </div>
      ) : (
        <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={data} margin={{ top: 10, right: 20, left: 0, bottom: 10 }}>
              <defs>
                <linearGradient id="fillSmsCount" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--chart-1)" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="var(--chart-1)" stopOpacity={0.1} />
                </linearGradient>
              </defs>
              <CartesianGrid vertical={false} stroke="hsl(var(--border) / 0.5)" />
              <XAxis
                dataKey="label"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                minTickGap={32}
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
                tickFormatter={(value) => value.toLocaleString()}
              />
              <ChartTooltip
                cursor={{ strokeDasharray: '3 3', stroke: 'var(--muted-foreground)', strokeOpacity: 0.5 }}
                content={<CustomTooltip />}
              />
              <Area
                dataKey="count"
                type="monotone"
                fill="url(#fillSmsCount)"
                stroke="var(--chart-1)"
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </ChartContainer>
      )}
    </div>
  );
}
