"use client";

import React, { useRef, useState } from 'react';
import { Button } from '@/shared/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/ui/select';
import { Calendar } from '@/shared/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/shared/ui/popover';
import { cn } from '@/lib/utils';
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartLegend,
  ChartLegendContent,
} from '@/shared/ui/chart';
import { Calendar as CalendarIcon, RefreshCcw, X } from 'lucide-react';
import { CartesianGrid, ComposedChart, Line, XAxis, YAxis } from 'recharts';
import type { Period, RechargeStatus } from '@/modules/statistics/types';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { useRechargeTimeline } from '@/core/hooks';

const chartConfig = {
  count: {
    label: 'Recharges',
    color: 'var(--chart-3)',
  },
} satisfies ChartConfig;

const periods: { value: Period; label: string }[] = [
  { value: 'DAY', label: 'Jour' },
  { value: 'WEEK', label: 'Semaine' },
  { value: 'MONTH', label: 'Mois' },
  { value: 'YEAR', label: 'Année' },
];

const statuses: { value: RechargeStatus; label: string }[] = [
  { value: 'VALIDE', label: 'Validé' },
  { value: 'REFUSE', label: 'Refusé' },
  { value: 'ANNULE', label: 'Annulé' },
  { value: 'PENDING', label: 'En attente' },
  { value: 'DEMAND', label: 'Demandé' },
];

interface TooltipProps {
  active?: boolean;
  payload?: Array<{
    payload: {
      label: string;
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
          <div className="text-sm font-bold">{data.count} recharges</div>
        </div>
      </div>
    );
  }
  return null;
};

export function BalanceRechargeChart() {
  const [period, setPeriod] = useState<Period>('MONTH');
  const [status, setStatus] = useState<RechargeStatus | undefined>(undefined);
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);
  const chartEffectCount = useRef(0);

  const startDateISO = React.useMemo(() =>
    startDate ? startDate.toISOString() : '', [startDate]
  );
  const endDateISO = React.useMemo(() =>
    endDate ? endDate.toISOString() : '', [endDate]
  );

  const { data, isLoading, error, loadRechargeTimeline } = useRechargeTimeline({
    period,
    status,
    startDate: startDateISO,
    endDate: endDateISO,
    autoLoad: false,
  });

  React.useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      chartEffectCount.current++
      console.log(`[BalanceRechargeChart] useEffect fires #${chartEffectCount.current}`, { period, status, startDateISO, endDateISO })
      if (chartEffectCount.current > 15) console.error('[BalanceRechargeChart] POSSIBLE LOOP - useEffect fires too many times')
    }
    loadRechargeTimeline();
  }, [period, status, startDateISO, endDateISO, loadRechargeTimeline]);

  const totalRecharges = React.useMemo(() =>
    data.reduce((sum, item) => sum + item.count, 0), [data]
  );
  const maxCount = React.useMemo(() =>
    Math.max(...data.map((d) => d.count), 1), [data]
  );
  const minCount = React.useMemo(() =>
    Math.min(...data.map((d) => d.count), 0), [data]
  );

  const handleClearDates = () => {
    setStartDate(undefined);
    setEndDate(undefined);
  };

  return (
    <div className="space-y-4">
      {/* Toolbar */}
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

        {/* Status filter */}
        <Select value={status || 'all'} onValueChange={(value) => setStatus(value === 'all' ? undefined : value as RechargeStatus)}>
          <SelectTrigger className="w-[130px] h-8 text-xs rounded-lg border-border/60">
            <SelectValue placeholder="Statut" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous statuts</SelectItem>
            {statuses.map((s) => (
              <SelectItem key={s.value} value={s.value}>
                {s.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

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
                {startDate ? format(startDate, "dd MMM", { locale: fr }) : "Début"}
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
                {endDate ? format(endDate, "dd MMM", { locale: fr }) : "Fin"}
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

          {(startDate || endDate) && (
            <button
              onClick={handleClearDates}
              className="p-1 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
              title="Effacer les dates"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>

        <button
          onClick={() => loadRechargeTimeline()}
          disabled={isLoading}
          className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors ml-auto"
          title="Actualiser"
        >
          <RefreshCcw className={cn("h-3.5 w-3.5", isLoading && "animate-spin")} />
        </button>
      </div>

      {/* Mini stats row */}
      <div className="flex items-center gap-3 text-xs flex-wrap">
        <span className="font-semibold text-foreground text-lg tabular-nums">{totalRecharges.toLocaleString()}</span>
        <span className="text-muted-foreground">recharges</span>
        <div className="h-4 w-px bg-border/60" />
        <div className="flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-sky-500" />
          <span className="text-muted-foreground">Max</span>
          <span className="font-medium text-foreground tabular-nums">{maxCount}</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
          <span className="text-muted-foreground">Min</span>
          <span className="font-medium text-foreground tabular-nums">{minCount}</span>
        </div>
        {status && (
          <>
            <div className="h-4 w-px bg-border/60" />
            <span className="text-muted-foreground">
              Statut: <span className="font-medium text-foreground">{statuses.find(s => s.value === status)?.label}</span>
            </span>
          </>
        )}
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded-lg text-xs dark:bg-red-900/20 dark:border-red-800 dark:text-red-400">
          {error}
        </div>
      )}

      <ChartContainer
        config={chartConfig}
        className="h-[280px] w-full [&_.recharts-curve.recharts-tooltip-cursor]:stroke-initial"
      >
        <ComposedChart
          data={data}
          margin={{ top: 12, right: 12, left: -10, bottom: 12 }}
        >
          <defs>
            <linearGradient id="rechargeAreaGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={chartConfig.count.color} stopOpacity={0.08} />
              <stop offset="100%" stopColor={chartConfig.count.color} stopOpacity={0} />
            </linearGradient>
          </defs>

          <CartesianGrid
            strokeDasharray="3 6"
            stroke="var(--border)"
            strokeOpacity={0.4}
            horizontal={true}
            vertical={false}
          />

          <XAxis
            dataKey="label"
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }}
            tickMargin={12}
            interval="preserveStartEnd"
            tickCount={5}
          />

          <YAxis
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }}
            tickFormatter={(value) => value.toString()}
            tickMargin={8}
            width={40}
          />

          <ChartTooltip
            content={<CustomTooltip />}
            cursor={{ strokeDasharray: '3 3', stroke: 'var(--muted-foreground)', strokeOpacity: 0.3 }}
          />

          <Line
            type="monotone"
            dataKey="count"
            stroke={chartConfig.count.color}
            strokeWidth={2}
            dot={(props) => {
              const { cx, cy, payload } = props;
              if (payload.count > maxCount * 0.8 || payload.count < minCount * 1.2) {
                return (
                  <circle
                    key={`dot-${payload.label}`}
                    cx={cx}
                    cy={cy}
                    r={4}
                    fill={chartConfig.count.color}
                    stroke="var(--background)"
                    strokeWidth={2}
                  />
                );
              }
              return <g key={`dot-${payload.label}`} />;
            }}
            activeDot={{
              r: 5,
              fill: chartConfig.count.color,
              stroke: 'var(--background)',
              strokeWidth: 2,
            }}
          />

          <ChartLegend content={<ChartLegendContent />} />
        </ComposedChart>
      </ChartContainer>
    </div>
  );
}
