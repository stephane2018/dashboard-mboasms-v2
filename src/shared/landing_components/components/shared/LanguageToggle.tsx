"use client"

import type { Lang } from "../../i18n/landing-content";

export function LanguageToggle({ lang, setLang }: { lang: Lang; setLang: (l: Lang) => void }) {
  return (
    <div className="fixed top-24 right-6 z-40 flex items-center rounded-full bg-card/80 backdrop-blur-md border border-border shadow-lg overflow-hidden animate-fade-in-up">
      <button
        onClick={() => setLang("fr")}
        className={`px-3 py-1.5 text-xs font-semibold transition-all duration-300 ${
          lang === "fr" ? "bg-primary text-white" : "text-muted-foreground hover:text-foreground"
        }`}
      >
        FR
      </button>
      <button
        onClick={() => setLang("en")}
        className={`px-3 py-1.5 text-xs font-semibold transition-all duration-300 ${
          lang === "en" ? "bg-primary text-white" : "text-muted-foreground hover:text-foreground"
        }`}
      >
        EN
      </button>
    </div>
  );
}
