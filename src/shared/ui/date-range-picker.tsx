import * as React from "react"
import { format, subDays, startOfWeek, endOfWeek, startOfMonth, endOfMonth, startOfYear, endOfYear } from "date-fns"
import { fr } from "date-fns/locale"
import { cn } from "@/lib/utils"
import { Calendar } from "iconsax-react"

interface DateRange {
  from: Date
  to: Date
}

interface DateRangePickerProps {
  value: DateRange
  onChange: (range: DateRange) => void
  className?: string
}

const presets = [
  {
    label: "Aujourd'hui",
    getValue: () => ({
      from: new Date(),
      to: new Date(),
    }),
  },
  {
    label: "7 derniers jours",
    getValue: () => ({
      from: subDays(new Date(), 6),
      to: new Date(),
    }),
  },
  {
    label: "30 derniers jours",
    getValue: () => ({
      from: subDays(new Date(), 29),
      to: new Date(),
    }),
  },
  {
    label: "Cette semaine",
    getValue: () => ({
      from: startOfWeek(new Date(), { locale: fr }),
      to: endOfWeek(new Date(), { locale: fr }),
    }),
  },
  {
    label: "Ce mois",
    getValue: () => ({
      from: startOfMonth(new Date()),
      to: endOfMonth(new Date()),
    }),
  },
  {
    label: "3 derniers mois",
    getValue: () => ({
      from: subDays(new Date(), 89),
      to: new Date(),
    }),
  },
  {
    label: "Cette année",
    getValue: () => ({
      from: startOfYear(new Date()),
      to: endOfYear(new Date()),
    }),
  },
]

export function DateRangePicker({ value, onChange, className }: DateRangePickerProps) {
  const [isOpen, setIsOpen] = React.useState(false)
  const [selectedPreset, setSelectedPreset] = React.useState<string | null>(null)

  const handlePresetClick = (preset: typeof presets[0]) => {
    const range = preset.getValue()
    onChange(range)
    setSelectedPreset(preset.label)
    setIsOpen(false)
  }

  const formatDateRange = () => {
    if (!value.from || !value.to) return "Sélectionner une période"

    if (format(value.from, "yyyy-MM-dd") === format(value.to, "yyyy-MM-dd")) {
      return format(value.from, "d MMMM yyyy", { locale: fr })
    }

    return `${format(value.from, "d MMM", { locale: fr })} - ${format(value.to, "d MMM yyyy", { locale: fr })}`
  }

  return (
    <div className={cn("relative", className)}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "flex items-center gap-2 px-3 py-2 text-sm rounded-lg border border-input bg-background hover:bg-accent hover:text-accent-foreground transition-colors",
          "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
        )}
      >
        <Calendar size={16} variant="Bulk" color="currentColor" />
        <span>{formatDateRange()}</span>
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 top-full mt-2 z-50 w-72 rounded-lg border bg-popover p-4 shadow-lg">
            <div className="space-y-2">
              <div className="text-sm font-semibold mb-3">Raccourcis</div>
              <div className="grid gap-1">
                {presets.map((preset) => (
                  <button
                    key={preset.label}
                    onClick={() => handlePresetClick(preset)}
                    className={cn(
                      "w-full text-left px-3 py-2 text-sm rounded-md transition-colors",
                      "hover:bg-accent hover:text-accent-foreground",
                      selectedPreset === preset.label && "bg-accent text-accent-foreground font-medium"
                    )}
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
