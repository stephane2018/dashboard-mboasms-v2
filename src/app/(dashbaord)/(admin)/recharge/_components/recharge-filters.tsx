"use client"

import { useState } from "react"
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

const paymentMethods = [
  { value: "all", label: "Toutes les méthodes" },
  { value: PaymentMethod.CASH, label: "Espèces (CASH)" },
  { value: PaymentMethod.ORANGE_MONEY, label: "Orange Money" },
  { value: PaymentMethod.MTN_MONEY, label: "MTN Money" },
  { value: PaymentMethod.BANK_ACCOUNT, label: "Compte bancaire" },
  { value: PaymentMethod.PAYPAL, label: "PayPal" },
]

const statuses = [
  { value: "all", label: "Tous les statuts" },
  { value: RechargeStatus.PENDING, label: "En attente" },
  { value: RechargeStatus.VALIDATED, label: "Validée" },
  { value: RechargeStatus.REFUSED, label: "Refusée" },
]

export function RechargeFilters({
  filters,
  onFiltersChange,
  onReset,
}: RechargeFiltersProps) {
  const hasActiveFilters =
    filters.paymentMethod !== "all" ||
    filters.status !== "all" ||
    filters.startDate !== undefined ||
    filters.endDate !== undefined

  return (
    <div className="flex flex-wrap items-end gap-4 p-4 bg-muted/30 rounded-lg border">
      {/* Payment Method Filter */}
      <div className="space-y-2 flex-1 min-w-[200px]">
        <Label htmlFor="payment-method-filter" className="text-xs font-medium">
          Méthode de paiement
        </Label>
        <Select
          value={filters.paymentMethod}
          onValueChange={(value) =>
            onFiltersChange({ ...filters, paymentMethod: value })
          }
        >
          <SelectTrigger id="payment-method-filter" className="h-9">
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

      {/* Status Filter */}
      <div className="space-y-2 flex-1 min-w-[200px]">
        <Label htmlFor="status-filter" className="text-xs font-medium">
          Statut
        </Label>
        <Select
          value={filters.status}
          onValueChange={(value) =>
            onFiltersChange({ ...filters, status: value })
          }
        >
          <SelectTrigger id="status-filter" className="h-9">
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

      {/* Start Date Filter */}
      <div className="space-y-2 flex-1 min-w-[200px]">
        <Label className="text-xs font-medium">Date de début</Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "h-9 w-full justify-start text-left font-normal",
                !filters.startDate && "text-muted-foreground"
              )}
            >
              <CalendarIcon size={16} className="mr-2" />
              {filters.startDate ? (
                format(filters.startDate, "dd MMM yyyy", { locale: fr })
              ) : (
                <span>Sélectionner...</span>
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
              initialFocus
              locale={fr}
            />
          </PopoverContent>
        </Popover>
      </div>

      {/* End Date Filter */}
      <div className="space-y-2 flex-1 min-w-[200px]">
        <Label className="text-xs font-medium">Date de fin</Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "h-9 w-full justify-start text-left font-normal",
                !filters.endDate && "text-muted-foreground"
              )}
            >
              <CalendarIcon size={16} className="mr-2" />
              {filters.endDate ? (
                format(filters.endDate, "dd MMM yyyy", { locale: fr })
              ) : (
                <span>Sélectionner...</span>
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
              initialFocus
              locale={fr}
              disabled={(date) =>
                filters.startDate ? date < filters.startDate : false
              }
            />
          </PopoverContent>
        </Popover>
      </div>

      {/* Reset Button */}
      {hasActiveFilters && (
        <Button
          variant="ghost"
          size="sm"
          onClick={onReset}
          className="h-9 px-3"
        >
          <FilterRemove size={16} className="mr-2" />
          Réinitialiser
        </Button>
      )}
    </div>
  )
}
