"use client"

import { useState, useMemo } from "react"
import { Check, ChevronsUpDown } from "lucide-react"
import { Global } from "iconsax-react"
import { cn } from "@/core/lib/utils"
import { Button } from "@/shared/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/shared/ui/popover"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/shared/ui/command"
import { useCountries } from "@/core/hooks"

const DISPLAY_LIMIT = 20

function countryCodeToFlag(code: string): string {
  return code
    .toUpperCase()
    .split("")
    .map((c) => String.fromCodePoint(0x1f1e6 + c.charCodeAt(0) - 65))
    .join("")
}

interface CountrySelectProps {
  value?: string
  onSelect: (country: { id: string; nom: string }) => void
  disabled?: boolean
  placeholder?: string
}

export function CountrySelect({
  value,
  onSelect,
  disabled = false,
  placeholder = "Sélectionner un pays",
}: CountrySelectProps) {
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState("")
  const { data: countries = [], isLoading } = useCountries()

  const selectedCode = useMemo(
    () => countries.find((c) => c.nom === value)?.code,
    [countries, value]
  )

  const filtered = useMemo(() => {
    if (!search.trim()) return countries.slice(0, DISPLAY_LIMIT)
    const q = search.toLowerCase()
    return countries
      .filter((c) => c.nom.toLowerCase().includes(q))
      .slice(0, DISPLAY_LIMIT)
  }, [countries, search])

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          disabled={disabled || isLoading}
          className="w-full justify-between h-11 rounded-xl bg-background border-border font-normal"
        >
          <div className="flex items-center gap-2 truncate">
            {value && selectedCode ? (
              <span className="text-base leading-none shrink-0">{countryCodeToFlag(selectedCode)}</span>
            ) : (
              <Global size={20} variant="Bulk" color="currentColor" className="text-muted-foreground shrink-0" />
            )}
            <span className={cn(!value && "text-muted-foreground")}>
              {isLoading ? "Chargement..." : value || placeholder}
            </span>
          </div>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[--radix-popover-trigger-width] p-0" align="start">
        <Command shouldFilter={false}>
          <CommandInput
            placeholder="Rechercher un pays..."
            value={search}
            onValueChange={setSearch}
          />
          <CommandList>
            <CommandEmpty>Aucun pays trouvé.</CommandEmpty>
            <CommandGroup>
              {filtered.map((country) => (
                <CommandItem
                  key={country.id}
                  value={country.nom}
                  onSelect={() => {
                    onSelect({ id: country.id, nom: country.nom })
                    setSearch("")
                    setOpen(false)
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === country.nom ? "opacity-100" : "opacity-0"
                    )}
                  />
                  <span className="text-base leading-none">{countryCodeToFlag(country.code)}</span>
                  {country.nom}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
