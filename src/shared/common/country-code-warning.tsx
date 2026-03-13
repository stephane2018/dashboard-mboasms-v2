"use client"

import { Warning2 } from "iconsax-react"

export function CountryCodeWarning() {
    return (
        <div className="flex items-start gap-2.5 p-3 rounded-xl bg-red-50 dark:bg-red-500/5 border border-red-300 dark:border-red-500/20">
            <Warning2 size={16} color="currentColor" variant="Bulk" className="text-red-500 shrink-0 mt-0.5" />
            <p className="text-xs text-red-700 dark:text-red-400">
                <span className="font-bold">Important :</span> Vous devez toujours renseigner l&apos;indicatif du pays avant chaque numéro (ex : <span className="font-bold">+237</span> pour le Cameroun). Sans indicatif, le SMS ne sera pas délivré et votre compte sera tout de même débité. <span className="font-bold">MboaSMS décline toute responsabilité en cas de non-respect de cette consigne.</span>
            </p>
        </div>
    )
}
