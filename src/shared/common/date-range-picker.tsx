"use client"

import * as React from "react"
import { format } from "date-fns"
import { fr } from "date-fns/locale"
import {
  Calendar as CalendarIcon,
  ArrowLeft2,
  ArrowRight2,
  Sun1,
  Calendar2,
  CalendarTick,
  Clock,
  CalendarCircle,
  CalendarRemove,
  CalendarSearch,
} from "iconsax-react"
import { DayPicker, type DateRange } from "react-day-picker"
import { cn } from "@/lib/utils"
import { Button } from "@/shared/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/shared/ui/popover"

export type { DateRange }

interface DateRangePickerProps {
  value?: DateRange
  onChange?: (range: DateRange | undefined) => void
  placeholder?: string
  className?: string
  disabled?: boolean
  align?: "start" | "center" | "end"
}

const defaultPresets: { label: string; icon: React.ReactNode; getDates: () => DateRange }[] = [
  {
    label: "Aujourd'hui",
    icon: <Sun1 size={14} color="currentColor" variant="Bulk" />,
    getDates: () => {
      const now = new Date()
      return { from: now, to: now }
    },
  },
  {
    label: "Cette semaine",
    icon: <Calendar2 size={14} color="currentColor" variant="Bulk" />,
    getDates: () => {
      const now = new Date()
      const day = now.getDay()
      const start = new Date(now)
      start.setDate(now.getDate() - (day === 0 ? 6 : day - 1))
      return { from: start, to: now }
    },
  },
  {
    label: "7 derniers jours",
    icon: <CalendarTick size={14} color="currentColor" variant="Bulk" />,
    getDates: () => {
      const end = new Date()
      const start = new Date()
      start.setDate(start.getDate() - 7)
      return { from: start, to: end }
    },
  },
  {
    label: "30 derniers jours",
    icon: <Clock size={14} color="currentColor" variant="Bulk" />,
    getDates: () => {
      const end = new Date()
      const start = new Date()
      start.setDate(start.getDate() - 30)
      return { from: start, to: end }
    },
  },
  {
    label: "90 derniers jours",
    icon: <CalendarCircle size={14} color="currentColor" variant="Bulk" />,
    getDates: () => {
      const end = new Date()
      const start = new Date()
      start.setDate(start.getDate() - 90)
      return { from: start, to: end }
    },
  },
  {
    label: "Ce mois",
    icon: <CalendarSearch size={14} color="currentColor" variant="Bulk" />,
    getDates: () => {
      const now = new Date()
      const start = new Date(now.getFullYear(), now.getMonth(), 1)
      return { from: start, to: now }
    },
  },
  {
    label: "Mois dernier",
    icon: <CalendarRemove size={14} color="currentColor" variant="Bulk" />,
    getDates: () => {
      const now = new Date()
      const start = new Date(now.getFullYear(), now.getMonth() - 1, 1)
      const end = new Date(now.getFullYear(), now.getMonth(), 0)
      return { from: start, to: end }
    },
  },
  {
    label: "L'année dernière",
    icon: <CalendarIcon size={14} color="currentColor" variant="Bulk" />,
    getDates: () => {
      const now = new Date()
      const start = new Date(now.getFullYear() - 1, 0, 1)
      const end = new Date(now.getFullYear() - 1, 11, 31)
      return { from: start, to: end }
    },
  },
]

export function DateRangePicker({
  value,
  onChange,
  placeholder = "Sélectionner une période",
  className,
  disabled,
  align = "start",
}: DateRangePickerProps) {
  const [open, setOpen] = React.useState(false)
  const [activePresetLabel, setActivePresetLabel] = React.useState<string | null>(null)

  const handlePreset = (label: string, getDates: () => DateRange) => {
    setActivePresetLabel(label)
    onChange?.(getDates())
  }

  const handleCalendarSelect = (range: DateRange | undefined) => {
    setActivePresetLabel(null)
    onChange?.(range)
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          disabled={disabled}
          className={cn(
            "h-9 justify-start text-left font-normal text-sm",
            !value?.from && "text-muted-foreground",
            className
          )}
        >
          <CalendarIcon size={14} color="currentColor" variant="Bulk" className="mr-2 shrink-0" />
          {value?.from ? (
            value.to ? (
              <>
                {format(value.from, "dd MMM", { locale: fr })} – {format(value.to, "dd MMM yyyy", { locale: fr })}
              </>
            ) : (
              format(value.from, "dd MMM yyyy", { locale: fr })
            )
          ) : (
            placeholder
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align={align}>
        <div className="flex">
          {/* Presets */}
          <div className="border-r border-border py-3 px-2 space-y-0.5 min-w-[170px]">
            <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mb-2 px-2">Raccourcis</p>
            {defaultPresets.map((preset) => {
              const isActive = activePresetLabel === preset.label
              return (
                <div
                  key={preset.label}
                  role="button"
                  tabIndex={0}
                  onClick={() => handlePreset(preset.label, preset.getDates)}
                  onKeyDown={(e) => e.key === "Enter" && handlePreset(preset.label, preset.getDates)}
                  className={cn(
                    "flex items-center gap-2.5 w-full text-left text-xs px-2.5 py-2 rounded-lg cursor-pointer transition-all duration-150",
                    isActive
                      ? "bg-primary text-primary-foreground font-medium shadow-sm"
                      : "text-foreground hover:bg-primary/10 hover:text-primary"
                  )}
                >
                  <span className={cn(
                    "shrink-0",
                    isActive ? "text-primary-foreground" : "text-primary"
                  )}>
                    {preset.icon}
                  </span>
                  {preset.label}
                </div>
              )
            })}
          </div>
          {/* Calendar */}
          <div className="p-3">
            <DayPicker
              key={activePresetLabel ?? "manual"}
              mode="range"
              selected={value}
              onSelect={handleCalendarSelect}
              numberOfMonths={2}
              locale={fr}
              defaultMonth={value?.from}
              showOutsideDays
              components={{
                Chevron: ({ orientation }) => {
                  if (orientation === "left") {
                    return (
                      <ArrowLeft2 size={18} color="currentColor" variant="Bold" />
                    )
                  }
                  return (
                    <ArrowRight2 size={18} color="currentColor" variant="Bold" />
                  )
                },
              }}
              classNames={{
                root: "relative",
                months: "relative flex gap-6",
                month: "flex flex-col gap-2",
                month_caption: "flex justify-center items-center h-9",
                caption_label: "text-sm font-semibold text-foreground",
                nav: "absolute inset-x-0 top-0 flex items-center justify-between z-10",
                button_previous: "size-9 flex items-center justify-center rounded-xl bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground transition-all duration-200",
                button_next: "size-9 flex items-center justify-center rounded-xl bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground transition-all duration-200",
                weekdays: "grid grid-cols-7 gap-0",
                weekday: "text-muted-foreground text-[11px] font-semibold uppercase h-8 flex items-center justify-center",
                week: "grid grid-cols-7 gap-0",
                day: "relative h-9 w-9 flex items-center justify-center text-sm p-0",
                day_button: "h-9 w-9 rounded-lg hover:bg-primary/10 hover:text-primary transition-colors cursor-pointer font-medium",
                selected: "bg-primary text-primary-foreground hover:bg-primary rounded-lg font-semibold",
                range_start: "bg-primary text-primary-foreground rounded-l-lg rounded-r-none font-semibold",
                range_end: "bg-primary text-primary-foreground rounded-r-lg rounded-l-none font-semibold",
                range_middle: "bg-primary/10 text-primary rounded-none",
                today: "ring-2 ring-primary/30 rounded-lg font-bold text-primary",
                outside: "text-muted-foreground/30",
                disabled: "text-muted-foreground/20 cursor-not-allowed",
              }}
            />
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}
