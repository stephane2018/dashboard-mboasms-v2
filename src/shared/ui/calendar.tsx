"use client"

import * as React from "react"
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react"
import { cn } from "@/lib/utils"

interface CalendarProps {
  mode?: "single" | "range"
  selected?: Date | { from?: Date; to?: Date }
  onSelect?: (date: any) => void
  numberOfMonths?: number
  locale?: any
  className?: string
}

const DAYS = ["Lu", "Ma", "Me", "Je", "Ve", "Sa", "Di"]

export function Calendar({
  mode = "single",
  selected,
  onSelect,
  numberOfMonths = 1,
  locale,
  className,
}: CalendarProps) {
  const [currentMonth, setCurrentMonth] = React.useState(new Date())

  const months = React.useMemo(() => {
    const result = []
    for (let i = 0; i < numberOfMonths; i++) {
      const date = new Date(currentMonth)
      date.setMonth(date.getMonth() + i)
      result.push(date)
    }
    return result
  }, [currentMonth, numberOfMonths])

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear()
    const month = date.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const daysInMonth = lastDay.getDate()
    const startingDayOfWeek = (firstDay.getDay() + 6) % 7 // Adjust so Monday = 0

    const days = []

    // Previous month days
    const prevMonthLastDay = new Date(year, month, 0).getDate()
    for (let i = startingDayOfWeek - 1; i >= 0; i--) {
      days.push({
        date: new Date(year, month - 1, prevMonthLastDay - i),
        isCurrentMonth: false,
      })
    }

    // Current month days
    for (let day = 1; day <= daysInMonth; day++) {
      days.push({
        date: new Date(year, month, day),
        isCurrentMonth: true,
      })
    }

    // Next month days to fill the grid
    const remainingDays = 42 - days.length // 6 rows * 7 days
    for (let day = 1; day <= remainingDays; day++) {
      days.push({
        date: new Date(year, month + 1, day),
        isCurrentMonth: false,
      })
    }

    return days
  }

  const isDateInRange = (date: Date) => {
    if (mode !== "range" || !selected || typeof selected === "object") {
      const range = selected as { from?: Date; to?: Date }
      if (!range?.from || !range?.to) return false
      return date >= range.from && date <= range.to
    }
    return false
  }

  const isRangeStart = (date: Date) => {
    if (mode !== "range" || !selected) return false
    const range = selected as { from?: Date; to?: Date }
    return range?.from && isSameDay(date, range.from)
  }

  const isRangeEnd = (date: Date) => {
    if (mode !== "range" || !selected) return false
    const range = selected as { from?: Date; to?: Date }
    return range?.to && isSameDay(date, range.to)
  }

  const isSelected = (date: Date) => {
    if (mode === "single" && selected instanceof Date) {
      return isSameDay(date, selected)
    }
    if (mode === "range") {
      return isRangeStart(date) || isRangeEnd(date)
    }
    return false
  }

  const isToday = (date: Date) => {
    return isSameDay(date, new Date())
  }

  const isSameDay = (date1: Date, date2: Date) => {
    return (
      date1.getDate() === date2.getDate() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getFullYear() === date2.getFullYear()
    )
  }

  const handleDayClick = (date: Date) => {
    if (mode === "single") {
      onSelect?.(date)
    } else if (mode === "range") {
      const range = selected as { from?: Date; to?: Date } | undefined
      if (!range?.from || (range.from && range.to)) {
        onSelect?.({ from: date, to: undefined })
      } else {
        if (date < range.from) {
          onSelect?.({ from: date, to: range.from })
        } else {
          onSelect?.({ from: range.from, to: date })
        }
      }
    }
  }

  const goToPreviousMonth = () => {
    setCurrentMonth((prev) => {
      const newDate = new Date(prev)
      newDate.setMonth(newDate.getMonth() - 1)
      return newDate
    })
  }

  const goToNextMonth = () => {
    setCurrentMonth((prev) => {
      const newDate = new Date(prev)
      newDate.setMonth(newDate.getMonth() + 1)
      return newDate
    })
  }

  const formatMonthYear = (date: Date) => {
    const monthNames = [
      "janvier", "février", "mars", "avril", "mai", "juin",
      "juillet", "août", "septembre", "octobre", "novembre", "décembre"
    ]
    return `${monthNames[date.getMonth()]} ${date.getFullYear()}`
  }

  return (
    <div className={cn("p-4", className)}>
      <div className="flex gap-6">
        {months.map((month, monthIndex) => (
          <div key={monthIndex} className="flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between mb-4 h-10">
              {monthIndex === 0 && (
                <button
                  type="button"
                  onClick={goToPreviousMonth}
                  className="h-10 w-10 flex items-center justify-center rounded-md hover:bg-accent transition-colors"
                >
                  <ChevronLeftIcon className="h-5 w-5" />
                </button>
              )}
              {monthIndex > 0 && <div className="w-10" />}

              <div className="flex-1 text-center">
                <span className="text-sm font-semibold capitalize">
                  {formatMonthYear(month)}
                </span>
              </div>

              {monthIndex === numberOfMonths - 1 && (
                <button
                  type="button"
                  onClick={goToNextMonth}
                  className="h-10 w-10 flex items-center justify-center rounded-md hover:bg-accent transition-colors"
                >
                  <ChevronRightIcon className="h-5 w-5" />
                </button>
              )}
              {monthIndex < numberOfMonths - 1 && <div className="w-10" />}
            </div>

            {/* Days header */}
            <div className="grid grid-cols-7 gap-1 mb-2">
              {DAYS.map((day) => (
                <div
                  key={day}
                  className="h-9 flex items-center justify-center text-xs font-medium text-muted-foreground"
                >
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar grid */}
            <div className="grid grid-cols-7 gap-1">
              {getDaysInMonth(month).map((day, dayIndex) => {
                const inRange = isDateInRange(day.date)
                const rangeStart = isRangeStart(day.date)
                const rangeEnd = isRangeEnd(day.date)
                const selectedDay = isSelected(day.date)
                const today = isToday(day.date)

                return (
                  <div
                    key={dayIndex}
                    className={cn(
                      "h-9 flex items-center justify-center relative",
                      inRange && !selectedDay && "bg-accent",
                      rangeStart && "rounded-l-md",
                      rangeEnd && "rounded-r-md"
                    )}
                  >
                    <button
                      type="button"
                      onClick={() => handleDayClick(day.date)}
                      disabled={!day.isCurrentMonth}
                      className={cn(
                        "h-9 w-9 flex items-center justify-center text-sm rounded-md transition-colors",
                        "hover:bg-accent hover:text-accent-foreground",
                        !day.isCurrentMonth && "text-muted-foreground/30 cursor-default hover:bg-transparent",
                        day.isCurrentMonth && "text-foreground",
                        selectedDay && "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground",
                        today && !selectedDay && "bg-accent font-semibold",
                        inRange && !selectedDay && "hover:bg-accent/80"
                      )}
                    >
                      {day.date.getDate()}
                    </button>
                  </div>
                )
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
