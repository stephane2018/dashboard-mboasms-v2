"use client"

import { useT } from "@/core/hooks"

export default function ProfilePage() {
  const { t } = useT()
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">{t('profile.title')}</h1>
      <p>{t('profile.subtitle')}</p>
    </div>
  );
}
