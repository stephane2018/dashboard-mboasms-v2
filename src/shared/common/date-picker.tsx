"use client"

import * as React from "react"
import { format } from "date-fns"
import { fr } from "date-fns/locale"
import { Calendar as CalendarIcon } from "iconsax-react"
import { cn } from "@/lib/utils"
import { Calendar } from "@/shared/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/shared/ui/popover"

interface DatePickerProps {
  value?: Date
  onChange?: (date: Date | undefined) => void
  placeholder?: string
  className?: string
  disabled?: boolean
}

export function DatePicker({
  value,
  onChange,
  placeholder = "Choisir une date",
  className,
  disabled,
}: DatePickerProps) {
  const [open, setOpen] = React.useState(false)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild disabled={disabled}>
        <div
          className={cn(
            "inline-flex items-center gap-2 h-9 px-3 rounded-lg border border-border bg-background text-sm cursor-pointer select-none hover:border-primary/40 hover:bg-accent/50 transition-all duration-200",
            disabled && "opacity-50 cursor-not-allowed pointer-events-none",
            !value && "text-muted-foreground",
            value && "text-foreground",
            className
          )}
        >
          <CalendarIcon size={15} color="currentColor" variant="Bulk" className="shrink-0 text-primary" />
          <span className="truncate">
            {value ? format(value, "dd MMM yyyy", { locale: fr }) : placeholder}
          </span>
        </div>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={value}
          onSelect={(date) => {
            onChange?.(date)
            setOpen(false)
          }}
          locale={fr}
        />
      </PopoverContent>
    </Popover>
  )
}
