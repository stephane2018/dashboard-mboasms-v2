"use client"

import { useT } from "@/core/hooks"

export default function HistoriquePage() {
  const { t } = useT()
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">{t('history.title')}</h1>
      <p>{t('history.subtitle')}</p>
    </div>
  );
}
