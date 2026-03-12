"use client";

import { MessageText1 } from "iconsax-react";

interface GlobalSmsCardProps {
  label: string;
  value: string;
  trend: string;
}

export function GlobalSmsCard({ label, value, trend }: GlobalSmsCardProps) {
  return (
    <div className="rounded-2xl border border-border/50 bg-linear-to-br from-blue-50/60 to-indigo-50/40 dark:from-blue-950/15 dark:to-indigo-950/10 p-5 border-l-4 border-l-blue-500 transition-shadow hover:shadow-md">
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
          {label}
        </span>
        <span className="text-[10px] font-bold text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-500/15 px-2 py-0.5 rounded-full">
          GLOBAL
        </span>
      </div>
      <div className="flex items-center gap-2.5 mb-1">
        <div className="rounded-xl bg-blue-50 dark:bg-blue-500/10 p-2">
          <MessageText1 size="18" color="currentColor" variant="Bulk" className="text-blue-600 dark:text-blue-400" />
        </div>
        <p className="text-2xl font-bold text-foreground leading-tight">{value}</p>
      </div>
      <p className="text-xs text-muted-foreground mt-1">{trend}</p>
    </div>
  );
}
