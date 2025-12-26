"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/shared/ui/card";
import { MessageText1 } from "iconsax-react";

interface GlobalSmsCardVariantProps {
  label: string;
  value: string;
  trend: string;
}

export function GlobalSmsCardVariant({ label, value, trend }: GlobalSmsCardVariantProps) {
  return (
    <Card className="border border-border/60 shadow-sm bg-linear-to-br from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20">
      <CardHeader className="flex flex-row items-center justify-between pb-3">
        <div className="flex items-center gap-2">
          <div className="rounded-full bg-blue-100 p-2">
            <MessageText1 size="18" color="currentColor" variant="Bulk" className="text-blue-600" />
          </div>
          <CardTitle className="text-sm font-medium text-blue-900 dark:text-blue-100">
            {label}
          </CardTitle>
        </div>
        <div className="rounded-full bg-blue-100 px-2 py-1">
          <span className="text-xs font-semibold text-blue-700">GLOBAL</span>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="space-y-2">
          <p className="text-3xl font-bold text-blue-900 dark:text-blue-100">{value}</p>
          <div className="flex items-center gap-2">
            <div className="h-1 w-12 bg-blue-200 rounded-full"></div>
            <p className="text-xs text-blue-700 dark:text-blue-300 font-medium">{trend}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
