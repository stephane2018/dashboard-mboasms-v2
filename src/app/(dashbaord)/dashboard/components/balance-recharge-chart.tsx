"use client";

import React, { useState } from 'react';
import { Card, CardContent } from '@/shared/ui/card';
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
import { TrendingUp, Calendar as CalendarIcon, Filter } from 'lucide-react';
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
  { value: 'DAY', label: 'Journalier' },
  { value: 'WEEK', label: 'Hebdomadaire' },
  { value: 'MONTH', label: 'Mensuel' },
  { value: 'YEAR', label: 'Annuel' },
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
      <div className="bg-popover border border-border rounded-lg p-3 shadow-lg">
        <div className="text-sm text-muted-foreground mb-1">{data.label}</div>
        <div className="flex items-center gap-2">
          <div className="text-base font-bold">{data.count} recharges</div>
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
  
  // Convert dates to ISO format for API (memoized to prevent unnecessary re-renders)
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
    autoLoad: false, // Disable auto-load, we'll trigger it manually
  });

  // Load data when filters change
  React.useEffect(() => {
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

  const handleRefresh = () => {
    loadRechargeTimeline();
  };

  const handleClearDates = () => {
    setStartDate(undefined);
    setEndDate(undefined);
  };

  return (
    <Card className="w-full">
      <CardContent className="flex flex-col items-stretch gap-5 pt-6">
        <div className="flex w-full items-baseline gap-2 sm:gap-3">
          <div className="flex flex-col">
            <span className="text-sm text-muted-foreground">Total Recharges</span>
            <span className="text-3xl font-bold">{totalRecharges.toLocaleString()}</span>
          </div>
          <div className="flex w-full items-center gap-1 text-emerald-600">
            <TrendingUp className="w-4 h-4" />
            <span className="font-medium">{data.length} périodes</span>
            <span className="text-muted-foreground font-normal">Dernière période</span>
          </div>
        </div>

        <div className="flex items-center gap-4 text-sm text-muted-foreground flex-wrap">
          <span>
            Max: <span className="text-sky-600 font-medium">{maxCount}</span>
          </span>
          <span>
            Min: <span className="text-amber-600 font-medium">{minCount}</span>
          </span>
          <span>
            Période: <span className="text-purple-600 font-medium">{periods.find(p => p.value === period)?.label}</span>
          </span>
          {status && (
            <span>
              Statut: <span className="text-orange-600 font-medium">{statuses.find(s => s.value === status)?.label}</span>
            </span>
          )}
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 items-center">
          <div className="flex items-center gap-2 col-span-2 sm:col-span-3 md:col-span-4 lg:col-span-6">
            <Filter className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">Filtres:</span>
          </div>

          <Select value={period} onValueChange={(value: Period) => setPeriod(value)}>
            <SelectTrigger>
              <Calendar className="w-4 h-4 mr-2" />
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

          <Select value={status || 'all'} onValueChange={(value) => setStatus(value === 'all' ? undefined : value as RechargeStatus)}>
            <SelectTrigger>
              <SelectValue placeholder="Statut" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous les statuts</SelectItem>
              {statuses.map((s) => (
                <SelectItem key={s.value} value={s.value}>
                  {s.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !startDate && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {startDate ? format(startDate, "dd/MM/yy", { locale: fr }) : "Début"}
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
                autoFocus
              />
            </PopoverContent>
          </Popover>

          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !endDate && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {endDate ? format(endDate, "dd/MM/yy", { locale: fr }) : "Fin"}
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
                autoFocus
              />
            </PopoverContent>
          </Popover>

          {(startDate || endDate) && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClearDates}
              className="text-muted-foreground hover:text-foreground"
            >
              Effacer
            </Button>
          )}

          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            disabled={isLoading}
          >
            {isLoading ? 'Chargement...' : 'Actualiser'}
          </Button>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded-md text-sm">
            {error}
          </div>
        )}

        <ChartContainer
          config={chartConfig}
          className="h-[320px] w-full [&_.recharts-curve.recharts-tooltip-cursor]:stroke-initial"
        >
          <ComposedChart
            data={data}
            margin={{
              top: 20,
              right: 10,
              left: 5,
              bottom: 20,
            }}
          >
            <defs>
              <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={chartConfig.count.color} stopOpacity={0.1} />
                <stop offset="100%" stopColor={chartConfig.count.color} stopOpacity={0} />
              </linearGradient>
              <pattern id="dotGrid" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
                <circle cx="10" cy="10" r="1" fill="var(--input)" fillOpacity={0.3} />
              </pattern>
              <filter id="dotShadow" x="-50%" y="-50%" width="200%" height="200%">
                <feDropShadow dx="2" dy="3" stdDeviation="3" floodColor="rgba(0,0,0,0.8)" />
              </filter>
              <filter id="lineShadow" x="-100%" y="-100%" width="300%" height="300%">
                <feDropShadow dx="4" dy="6" stdDeviation="25" floodColor="rgba(59, 130, 246, 0.9)" />
              </filter>
            </defs>

            <rect x="0" y="0" width="100%" height="100%" fill="url(#dotGrid)" style={{ pointerEvents: 'none' }} />

            <CartesianGrid
              strokeDasharray="4 8"
              stroke="var(--input)"
              strokeOpacity={1}
              horizontal={true}
              vertical={false}
            />

            <XAxis
              dataKey="label"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: chartConfig.count.color }}
              tickMargin={15}
              interval="preserveStartEnd"
              tickCount={5}
            />

            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: chartConfig.count.color }}
              tickFormatter={(value) => value.toString()}
              tickMargin={15}
            />

            <ChartTooltip
              content={<CustomTooltip />}
              cursor={{ strokeDasharray: '3 3', stroke: 'var(--muted-foreground)', strokeOpacity: 0.5 }}
            />

            <Line
              type="monotone"
              dataKey="count"
              stroke={chartConfig.count.color}
              strokeWidth={2}
              filter="url(#lineShadow)"
              dot={(props) => {
                const { cx, cy, payload } = props;
                if (payload.count > maxCount * 0.8 || payload.count < minCount * 1.2) {
                  return (
                    <circle
                      key={`dot-${payload.label}`}
                      cx={cx}
                      cy={cy}
                      r={6}
                      fill={chartConfig.count.color}
                      stroke="white"
                      strokeWidth={2}
                      filter="url(#dotShadow)"
                    />
                  );
                }

                return <g key={`dot-${payload.label}`} />;
              }}
              activeDot={{
                r: 6,
                fill: chartConfig.count.color,
                stroke: 'white',
                strokeWidth: 2,
                filter: 'url(#dotShadow)',
              }}
            />

            <ChartLegend content={<ChartLegendContent />} />
          </ComposedChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
