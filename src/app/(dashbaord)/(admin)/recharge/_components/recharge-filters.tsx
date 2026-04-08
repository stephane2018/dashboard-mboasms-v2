"use client"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/ui/select"
import { Button } from "@/shared/ui/button"
import { Label } from "@/shared/ui/label"
import { Calendar } from "@/shared/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/shared/ui/popover"
import { Calendar as CalendarIcon, FilterRemove } from "iconsax-react"
import { format } from "date-fns"
import { fr } from "date-fns/locale"
import { cn } from "@/lib/utils"
import { PaymentMethod, RechargeStatus } from "@/core/models/recharges"
import { useT } from "@/core/hooks"

export interface RechargeFilters {
  paymentMethod: string
  status: string
  startDate: Date | undefined
  endDate: Date | undefined
}

interface RechargeFiltersProps {
  filters: RechargeFilters
  onFiltersChange: (filters: RechargeFilters) => void
  onReset: () => void
}

export function RechargeFilters({
  filters,
  onFiltersChange,
  onReset,
}: RechargeFiltersProps) {
  const { t } = useT()

  const paymentMethods = [
    { value: "all", label: t('recharge.allMethods') },
    { value: PaymentMethod.CASH, label: t('recharge.cash') },
    { value: PaymentMethod.ORANGE_MONEY, label: t('recharge.orangeMoney') },
    { value: PaymentMethod.MTN_MONEY, label: t('recharge.mtnMoney') },
    { value: PaymentMethod.BANK_ACCOUNT, label: t('recharge.bankAccountLabel') },
    { value: PaymentMethod.PAYPAL, label: t('recharge.paypal') },
  ]

  const statuses = [
    { value: "all", label: t('recharge.allStatuses') },
    { value: RechargeStatus.PENDING, label: t('recharge.pendingStatus') },
    { value: RechargeStatus.VALIDATED, label: t('recharge.validatedStatus') },
    { value: RechargeStatus.REFUSED, label: t('recharge.refusedStatus') },
  ]

  const hasActiveFilters =
    filters.paymentMethod !== "all" ||
    filters.status !== "all" ||
    filters.startDate !== undefined ||
    filters.endDate !== undefined

  const activeCount = [
    filters.paymentMethod !== "all",
    filters.status !== "all",
    filters.startDate !== undefined,
    filters.endDate !== undefined,
  ].filter(Boolean).length

  return (
    <div className="rounded-xl border bg-card/50 backdrop-blur-sm">
      <div className="flex items-center justify-between px-4 py-2.5 border-b bg-muted/30">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            {t('common.filter')}
          </span>
          {activeCount > 0 && (
            <span className="inline-flex items-center justify-center h-5 min-w-5 px-1.5 rounded-full bg-primary text-primary-foreground text-[10px] font-bold">
              {activeCount}
            </span>
          )}
        </div>
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onReset}
            className="h-7 px-2.5 text-xs text-muted-foreground hover:text-foreground"
          >
            <FilterRemove size={14} className="mr-1.5" />
            {t('common.reset')}
          </Button>
        )}
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 p-4">
        <div className="space-y-1.5">
          <Label htmlFor="payment-method-filter" className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider">
            {t('recharge.paymentMethod')}
          </Label>
          <Select
            value={filters.paymentMethod}
            onValueChange={(value) =>
              onFiltersChange({ ...filters, paymentMethod: value })
            }
          >
            <SelectTrigger id="payment-method-filter" className="h-9 bg-background/60">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {paymentMethods.map((method) => (
                <SelectItem key={method.value} value={method.value}>
                  {method.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="status-filter" className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider">
            {t('common.status')}
          </Label>
          <Select
            value={filters.status}
            onValueChange={(value) =>
              onFiltersChange({ ...filters, status: value })
            }
          >
            <SelectTrigger id="status-filter" className="h-9 bg-background/60">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {statuses.map((status) => (
                <SelectItem key={status.value} value={status.value}>
                  {status.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1.5">
          <Label className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider">
            {t('recharge.startDate')}
          </Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "h-9 w-full justify-start text-left font-normal bg-background/60",
                  !filters.startDate && "text-muted-foreground"
                )}
              >
                <CalendarIcon size={14} className="mr-2 shrink-0" />
                {filters.startDate ? (
                  format(filters.startDate, "dd MMM yyyy", { locale: fr })
                ) : (
                  <span>{t('recharge.selectDate')}</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={filters.startDate}
                onSelect={(date) =>
                  onFiltersChange({ ...filters, startDate: date })
                }
                locale={fr}
              />
            </PopoverContent>
          </Popover>
        </div>

        <div className="space-y-1.5">
          <Label className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider">
            {t('recharge.endDate')}
          </Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "h-9 w-full justify-start text-left font-normal bg-background/60",
                  !filters.endDate && "text-muted-foreground"
                )}
              >
                <CalendarIcon size={14} className="mr-2 shrink-0" />
                {filters.endDate ? (
                  format(filters.endDate, "dd MMM yyyy", { locale: fr })
                ) : (
                  <span>{t('recharge.selectDate')}</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={filters.endDate}
                onSelect={(date) =>
                  onFiltersChange({ ...filters, endDate: date })
                }
                locale={fr}
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>
    </div>
  )
}
