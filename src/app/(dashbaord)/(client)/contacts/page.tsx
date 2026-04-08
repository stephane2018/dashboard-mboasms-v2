"use client"

import { CountryCodeWarning } from "@/shared/common/country-code-warning"
import { useT } from "@/core/hooks"

export default function ContactsPage() {
  const { t } = useT()
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">{t('contacts.title')}</h1>
      <CountryCodeWarning />
      <p className="mt-4">{t('contacts.subtitle')}</p>
    </div>
  );
}
