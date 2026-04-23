"use client"

import { Flash } from "iconsax-react";
import type { Lang } from "../../i18n/landing-content";

const labels = {
  fr: {
    tag: "Campagne en cours",
    desc: "Lancement API SMS — credits offerts pour les nouveaux comptes",
  },
  en: {
    tag: "Campaign live",
    desc: "SMS API launch — free credits for new accounts",
  },
};

export function CampaignBanner({ lang }: { lang: Lang }) {
  const t = labels[lang];
  return (
    <div className="relative z-30 bg-linear-to-r from-primary/10 via-purple-500/10 to-amber-500/10 border-b border-primary/20 backdrop-blur-sm">
      <div className="container mx-auto px-6 py-2.5 flex items-center justify-center gap-3 text-sm">
        <span className="relative flex h-2 w-2 shrink-0">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75"></span>
          <span className="relative inline-flex h-2 w-2 rounded-full bg-primary"></span>
        </span>
        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-primary/20 text-primary text-[10px] font-bold uppercase tracking-wider shrink-0">
          <Flash size="11" color="currentColor" variant="Bold" />
          {t.tag}
        </span>
        <span className="text-foreground/80 hidden sm:inline truncate">{t.desc}</span>
      </div>
    </div>
  );
}
