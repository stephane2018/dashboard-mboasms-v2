'use client';

import * as React from 'react';
import { useState, useMemo } from 'react';
import { Area, AreaChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer } from 'recharts';
import { useMessageTimeline, useT } from '@/core/hooks';
import { Skeleton } from '@/shared/ui/skeleton';
import { Button } from '@/shared/ui/button';
import { Calendar } from '@/shared/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/shared/ui/popover';
import { cn } from '@/lib/utils';
import {
  ChartContainer,
  ChartTooltip,
  type ChartConfig,
} from '@/shared/ui/chart';
import { Calendar as CalendarIcon, RefreshCcw, X } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import type { Period } from '@/modules/statistics/types';

function SmsTransactionChartSkeleton() {
  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        {[1, 2, 3, 4].map((i) => (
          <Skeleton key={i} className="h-8 w-20 rounded-lg" />
        ))}
      </div>
      <Skeleton className="h-[240px] w-full rounded-xl" />
    </div>
  );
}

export function SmsTransactionChart() {
  const { t } = useT();

  const chartConfig = {
    count: {
      label: t('charts.smsChartLabel'),
      color: 'var(--chart-1)',
    },
  } satisfies ChartConfig;

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
        <div className="bg-popover border border-border/60 rounded-xl p-3 shadow-xl">
          <div className="text-xs text-muted-foreground mb-1">{data.label}</div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: chartConfig.count.color }} />
            <div className="text-sm font-bold">{data.count.toLocaleString()} SMS</div>
          </div>
        </div>
      );
    }
    return null;
  };

  const periods: { value: Period; label: string }[] = [
    { value: 'DAY', label: t('charts.periodDay') },
    { value: 'WEEK', label: t('charts.periodWeek') },
    { value: 'MONTH', label: t('charts.periodMonth') },
    { value: 'YEAR', label: t('charts.periodYear') },
  ];

  const now = useMemo(() => new Date(), []);
  const defaultStartDate = useMemo(() => new Date(now.getFullYear(), now.getMonth(), 1), [now]);
  const defaultEndDate = useMemo(() => new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999), [now]);

  const [period, setPeriod] = useState<Period>('DAY');
  const [startDate, setStartDate] = useState<Date | undefined>(defaultStartDate);
  const [endDate, setEndDate] = useState<Date | undefined>(defaultEndDate);

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

  const handleClearDates = () => {
    setStartDate(defaultStartDate);
    setEndDate(defaultEndDate);
  };

  if (isLoading) {
    return <SmsTransactionChartSkeleton />;
  }

  if (error && data.length === 0) {
    return (
      <div className="flex h-56 w-full items-center justify-center rounded-xl border border-dashed border-border/60 bg-muted/20">
        <div className="text-center">
          <p className="text-sm text-muted-foreground mb-2">{error}</p>
          <Button variant="outline" size="sm" onClick={() => refetch()}>
            {t('charts.retry')}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Toolbar: Period pills + Date range + Refresh */}
      <div className="flex flex-wrap items-center gap-3">
        {/* Period pills */}
        <div className="flex items-center gap-1 rounded-lg bg-muted/50 p-0.5">
          {periods.map((p) => (
            <button
              key={p.value}
              onClick={() => setPeriod(p.value)}
              className={cn(
                "px-3 py-1.5 text-xs font-medium rounded-md transition-all duration-200",
                period === p.value
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {p.label}
            </button>
          ))}
        </div>

        <div className="h-5 w-px bg-border/60 hidden sm:block" />

        {/* Compact date range */}
        <div className="flex items-center gap-1.5">
          <Popover>
            <PopoverTrigger asChild>
              <button
                className={cn(
                  "inline-flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-lg border border-border/60 bg-background hover:bg-muted/50 transition-colors",
                  !startDate && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="h-3 w-3" />
                {startDate ? format(startDate, "dd MMM", { locale: fr }) : t('charts.start')}
              </button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={startDate}
                onSelect={(date) => {
                  setStartDate(date);
                  if (date && endDate && date > endDate) setEndDate(date);
                }}
              />
            </PopoverContent>
          </Popover>

          <span className="text-xs text-muted-foreground">→</span>

          <Popover>
            <PopoverTrigger asChild>
              <button
                className={cn(
                  "inline-flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-lg border border-border/60 bg-background hover:bg-muted/50 transition-colors",
                  !endDate && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="h-3 w-3" />
                {endDate ? format(endDate, "dd MMM", { locale: fr }) : t('charts.end')}
              </button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={endDate}
                onSelect={(date) => {
                  setEndDate(date);
                  if (date && startDate && date < startDate) setStartDate(date);
                }}
              />
            </PopoverContent>
          </Popover>

          <button
            onClick={handleClearDates}
            className="p-1 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
            title={t('charts.reset')}
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>

        <button
          onClick={() => refetch()}
          disabled={isFetching}
          className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors ml-auto"
          title={t('charts.refresh')}
        >
          <RefreshCcw className={cn("h-3.5 w-3.5", isFetching && "animate-spin")} />
        </button>
      </div>

      {/* Mini stats row */}
      <div className="flex items-center gap-3 text-xs flex-wrap">
        <span className="font-semibold text-foreground text-lg tabular-nums">{totalSms.toLocaleString()}</span>
        <span className="text-muted-foreground">{t('charts.smsTotal')}</span>
        <div className="h-4 w-px bg-border/60" />
        <div className="flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
          <span className="text-muted-foreground">{t('charts.max')}</span>
          <span className="font-medium text-foreground tabular-nums">{maxCount.toLocaleString()}</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
          <span className="text-muted-foreground">{t('charts.min')}</span>
          <span className="font-medium text-foreground tabular-nums">{minCount.toLocaleString()}</span>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded-lg text-xs dark:bg-red-900/20 dark:border-red-800 dark:text-red-400">
          {error}
        </div>
      )}

      {data.length === 0 && !isLoading && !error ? (
        <div className="flex h-[240px] w-full items-center justify-center rounded-xl border border-dashed border-border/60 bg-muted/20">
          <p className="text-sm text-muted-foreground">{t('charts.noData')}</p>
        </div>
      ) : (
        <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
          <ResponsiveContainer width="100%" height={240}>
            <AreaChart data={data} margin={{ top: 8, right: 12, left: -10, bottom: 4 }}>
              <defs>
                <linearGradient id="fillSmsCount" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--chart-1)" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="var(--chart-1)" stopOpacity={0.02} />
                </linearGradient>
              </defs>
              <CartesianGrid vertical={false} strokeDasharray="3 6" stroke="var(--border)" strokeOpacity={0.4} />
              <XAxis
                dataKey="label"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                minTickGap={32}
                stroke="hsl(var(--muted-foreground))"
                fontSize={11}
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                stroke="hsl(var(--muted-foreground))"
                fontSize={11}
                tickFormatter={(value) => value.toLocaleString()}
                width={40}
              />
              <ChartTooltip
                cursor={{ strokeDasharray: '3 3', stroke: 'var(--muted-foreground)', strokeOpacity: 0.3 }}
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
