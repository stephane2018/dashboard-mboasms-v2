"use client"

import { Warning2 } from "iconsax-react"
import { useT } from "@/core/hooks"

export function CountryCodeWarning() {
    const { t } = useT()

    return (
        <div className="flex items-start gap-2.5 p-3 rounded-xl bg-red-50 dark:bg-red-500/5 border border-red-300 dark:border-red-500/20">
            <Warning2 size={16} color="currentColor" variant="Bulk" className="text-red-500 shrink-0 mt-0.5" />
            <p className="text-xs text-red-700 dark:text-red-400">
                <span className="font-bold">{t('countryCodeWarning.important')}</span>{" "}
                {t('countryCodeWarning.message')}{" "}
                <span className="font-bold">{t('countryCodeWarning.disclaimer')}</span>
            </p>
        </div>
    )
}
