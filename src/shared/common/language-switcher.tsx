"use client"

import { useState } from "react"
import { useLanguageStore, type Lang } from "@/core/stores/languageStore"
import { cn } from "@/core/lib/utils"
import { LanguageSquare } from "iconsax-react"

interface LanguageSwitcherProps {
  variant?: "pill" | "icon" | "dropdown"
  className?: string
}

const flags: Record<Lang, string> = {
  fr: "🇫🇷",
  en: "🇬🇧",
}

const labels: Record<Lang, string> = {
  fr: "Francais",
  en: "English",
}

export function LanguageSwitcher({ variant = "pill", className }: LanguageSwitcherProps) {
  const { lang, setLang } = useLanguageStore()
  const [open, setOpen] = useState(false)

  if (variant === "icon") {
    return (
      <button
        onClick={() => setLang(lang === "fr" ? "en" : "fr")}
        className={cn(
          "flex items-center justify-center w-9 h-9 rounded-full border border-border hover:border-primary/40 hover:bg-primary/5 transition-all duration-200",
          className
        )}
        title={lang === "fr" ? "Switch to English" : "Passer en Francais"}
      >
        <span className="text-sm leading-none">{flags[lang === "fr" ? "en" : "fr"]}</span>
      </button>
    )
  }

  if (variant === "dropdown") {
    return (
      <div className={cn("relative", className)}>
        <button
          onClick={() => setOpen(!open)}
          className="flex items-center gap-1.5 px-2.5 py-2 rounded-full border border-border/70 hover:border-primary/40 hover:bg-primary/5 transition-all duration-200"
        >
          <LanguageSquare size={18} variant="Bulk" color="currentColor" className="text-primary" />
          <span className="text-xs font-semibold text-foreground">{lang.toUpperCase()}</span>
        </button>
        {open && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
            <div className="absolute right-0 top-full mt-2 z-50 w-40 rounded-xl bg-card border border-border/60 shadow-xl overflow-hidden">
              {(["fr", "en"] as const).map((l) => (
                <button
                  key={l}
                  onClick={() => { setLang(l); setOpen(false) }}
                  className={cn(
                    "flex items-center gap-2.5 w-full px-3.5 py-2.5 text-sm transition-colors",
                    lang === l ? "bg-primary/5 text-primary font-semibold" : "text-foreground hover:bg-muted/50"
                  )}
                >
                  <span className="text-base leading-none">{flags[l]}</span>
                  <span>{labels[l]}</span>
                  {lang === l && <span className="ml-auto w-1.5 h-1.5 rounded-full bg-primary" />}
                </button>
              ))}
            </div>
          </>
        )}
      </div>
    )
  }

  return (
    <div className={cn("flex items-center rounded-full bg-muted/80 border border-border/50 overflow-hidden", className)}>
      {(["fr", "en"] as const).map((l) => (
        <button
          key={l}
          onClick={() => setLang(l)}
          className={cn(
            "flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold transition-all duration-200",
            lang === l ? "bg-primary text-white shadow-sm" : "text-muted-foreground hover:text-foreground"
          )}
        >
          <span className="text-xs leading-none">{flags[l]}</span>
          {l.toUpperCase()}
        </button>
      ))}
    </div>
  )
}
