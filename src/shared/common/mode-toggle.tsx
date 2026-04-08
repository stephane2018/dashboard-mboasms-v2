"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useId } from "react";
import { useT } from "@/core/hooks";

export function ModeToggle() {
  const { theme, setTheme } = useTheme();
  const { t } = useT();
  const id = useId();

  return (
    <label
      className="group hover:bg-accent cursor-pointer text-foreground relative inline-flex size-9 items-center justify-center rounded-md shadow-none transition-[color,box-shadow] outline-none"
      htmlFor={id}
      role="button"
      aria-label={theme === "dark" ? t('layout.switchThemeToLight') : t('layout.switchThemeToDark')}
      onClick={() => {
        setTheme((prev: string) => (prev === "dark" ? "light" : "dark"));
      }}
    >
      <Moon
        size={20}
        className="shrink-0 scale-0 opacity-0 transition-all group-peer-checked:scale-100 group-peer-checked:opacity-100"
        aria-hidden="true"
      />
      <Sun
        size={20}
        className="absolute shrink-0 scale-100 opacity-100 transition-all group-peer-checked:scale-0 group-peer-checked:opacity-0"
        aria-hidden="true"
      />
    </label>
  );
}
