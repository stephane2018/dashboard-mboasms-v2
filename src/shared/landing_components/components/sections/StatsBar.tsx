"use client"

import { Global, Chart2, ShieldTick, Clock } from "iconsax-react";
import type { landingContent } from "../../i18n/landing-content";

export function StatsBar({ t }: { t: typeof landingContent.fr }) {
  return (
    <section className="py-12 border-y border-border/50 bg-card/50 backdrop-blur-sm">
      <div className="container mx-auto px-6">
        <div className="text-center mb-8 animate-fade-in-up">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-2">{t.stats.title}</h2>
          <p className="text-muted-foreground">{t.stats.subtitle}</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 stagger-children">
          {t.stats.items.map((stat, i) => {
            const icons = [
              <Global key="g" size="22" color="currentColor" variant="Bold" />,
              <Chart2 key="c" size="22" color="currentColor" variant="Bold" />,
              <ShieldTick key="s" size="22" color="currentColor" variant="Bold" />,
              <Clock key="t" size="22" color="currentColor" variant="Bold" />,
            ];
            return (
              <div
                key={i}
                className="text-center p-6 rounded-2xl bg-background/80 border border-border/50 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5 hover:-translate-y-1 transition-all duration-300 group cursor-default"
              >
                <div className="w-10 h-10 rounded-xl bg-primary/10 group-hover:bg-primary/20 flex items-center justify-center mx-auto mb-3 text-primary transition-colors duration-300">
                  {icons[i]}
                </div>
                <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-primary to-purple-500 bg-clip-text text-transparent mb-1">
                  {stat.value}
                </div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
