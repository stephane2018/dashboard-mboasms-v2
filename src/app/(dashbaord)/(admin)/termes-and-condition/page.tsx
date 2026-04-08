"use client"

import { useT } from "@/core/hooks"

export default function TermsAndConditionPage() {
  const { t } = useT()
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">{t('terms.title')}</h1>
      <p>{t('terms.subtitle')}</p>
    </div>
  );
}
