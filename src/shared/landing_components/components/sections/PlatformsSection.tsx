"use client"

import { Button } from "@/shared/ui/button";
import { ArrowRight2, Code1, MessageText1, Chart2 } from "iconsax-react";
import { Check } from "../shared/Check";
import type { landingContent, Lang } from "../../i18n/landing-content";

export function PlatformsSection({ t, lang }: { t: typeof landingContent.fr; lang: Lang }) {
  return (
    <section className="py-20 md:py-28 bg-background relative overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-gradient-to-b from-primary/8 to-transparent rounded-full filter blur-[100px]"></div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center mb-16 animate-fade-in-up">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-6">
            {t.platforms.badge}
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">{t.platforms.title}</h2>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto">{t.platforms.subtitle}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 max-w-5xl mx-auto">
          {/* API Card */}
          <div className="group relative rounded-2xl overflow-hidden bg-card border border-border hover:border-primary/30 transition-all duration-500 hover:shadow-xl hover:shadow-primary/5 animate-fade-in-up">
            <div className="h-1 bg-gradient-to-r from-primary via-purple-500 to-primary-light"></div>
            <div className="p-8 md:p-10">
              <div className="flex items-center justify-between mb-6">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-purple-500 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <Code1 size="28" color="#FFFFFF" variant="Bold" />
                </div>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-500 text-xs font-medium">
                  <Code1 size="12" color="currentColor" />
                  {lang === "fr" ? "Developpeurs" : "Developers"}
                </span>
              </div>
              <h3 className="text-2xl font-bold text-foreground mb-3">{t.platforms.api.title}</h3>
              <p className="text-muted-foreground mb-6 leading-relaxed">{t.platforms.api.desc}</p>
              <div className="mb-6 rounded-lg bg-background/80 border border-border/50 p-3 font-mono text-xs overflow-hidden">
                <div className="flex items-center gap-1.5 mb-2">
                  <div className="w-2 h-2 rounded-full bg-red-400"></div>
                  <div className="w-2 h-2 rounded-full bg-amber-400"></div>
                  <div className="w-2 h-2 rounded-full bg-emerald-400"></div>
                </div>
                <div className="text-muted-foreground">
                  <span className="text-purple-400">POST</span>{" "}
                  <span className="text-foreground/70">/api/v1/sms/send</span>
                </div>
              </div>
              <ul className="space-y-3 mb-8">
                {t.platforms.api.features.map((feature, i) => (
                  <li key={i} className="flex items-center text-sm">
                    <Check />
                    <span className="text-foreground">{feature}</span>
                  </li>
                ))}
              </ul>
              <Button variant="outline" className="rounded-xl border-border hover:border-primary/40 hover:bg-primary/5 text-foreground hover:text-primary font-semibold active:scale-[0.98] transition-all duration-200" asChild>
                <a href="/api-docs" className="flex items-center">
                  {t.platforms.api.cta}
                  <ArrowRight2 size="16" color="currentColor" className="ml-2 group-hover:translate-x-0.5 transition-transform duration-200" />
                </a>
              </Button>
            </div>
          </div>

          {/* Bulk SMS Card */}
          <div className="group relative rounded-2xl overflow-hidden bg-card border border-border hover:border-primary/30 transition-all duration-500 hover:shadow-xl hover:shadow-primary/5 animate-fade-in-up" style={{ animationDelay: "100ms" }}>
            <div className="h-1 bg-gradient-to-r from-amber-500 via-primary to-purple-500"></div>
            <div className="p-8 md:p-10">
              <div className="flex items-center justify-between mb-6">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-500 to-amber-500 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <MessageText1 size="28" color="#FFFFFF" variant="Bold" />
                </div>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400 text-xs font-medium">
                  <Chart2 size="12" color="currentColor" />
                  Marketing
                </span>
              </div>
              <h3 className="text-2xl font-bold text-foreground mb-3">{t.platforms.bulk.title}</h3>
              <p className="text-muted-foreground mb-6 leading-relaxed">{t.platforms.bulk.desc}</p>
              <div className="mb-6 rounded-lg bg-background/80 border border-border/50 p-3">
                <div className="flex items-center justify-between mb-2">
                  <div className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">Dashboard</div>
                  <div className="flex gap-1">
                    <div className="w-4 h-2 rounded-sm bg-primary/40"></div>
                    <div className="w-4 h-3 rounded-sm bg-primary/60"></div>
                    <div className="w-4 h-4 rounded-sm bg-primary"></div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <div className="flex-1 h-2 rounded-full bg-primary/20"><div className="h-full w-3/4 rounded-full bg-primary/60"></div></div>
                  <span className="text-[10px] text-primary font-medium">75%</span>
                </div>
              </div>
              <ul className="space-y-3 mb-8">
                {t.platforms.bulk.features.map((feature, i) => (
                  <li key={i} className="flex items-center text-sm">
                    <Check />
                    <span className="text-foreground">{feature}</span>
                  </li>
                ))}
              </ul>
              <Button className="rounded-xl bg-primary text-white font-semibold shadow-md shadow-primary/25 hover:shadow-lg hover:shadow-primary/30 hover:scale-[1.03] active:scale-[0.98] transition-all duration-200" asChild>
                <a href="/compte" className="flex items-center">
                  {t.platforms.bulk.cta}
                  <ArrowRight2 size="16" color="currentColor" className="ml-2 group-hover:translate-x-0.5 transition-transform duration-200" />
                </a>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
