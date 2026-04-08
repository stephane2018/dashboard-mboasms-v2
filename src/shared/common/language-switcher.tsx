"use client"

import { useLanguageStore, type Lang } from "@/core/stores/languageStore"
import { cn } from "@/core/lib/utils"

interface LanguageSwitcherProps {
  variant?: "pill" | "icon"
  className?: string
}

const flags: Record<Lang, string> = {
  fr: "🇫🇷",
  en: "🇬🇧",
}

export function LanguageSwitcher({ variant = "pill", className }: LanguageSwitcherProps) {
  const { lang, setLang } = useLanguageStore()

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

  return (
    <div className={cn(
      "flex items-center rounded-full bg-muted/80 border border-border/50 overflow-hidden",
      className
    )}>
      {(["fr", "en"] as const).map((l) => (
        <button
          key={l}
          onClick={() => setLang(l)}
          className={cn(
            "flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold transition-all duration-200",
            lang === l
              ? "bg-primary text-white shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          <span className="text-xs leading-none">{flags[l]}</span>
          {l.toUpperCase()}
        </button>
      ))}
    </div>
  )
}
