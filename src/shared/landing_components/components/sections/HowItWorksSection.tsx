"use client"

import { motion } from "framer-motion";
import { UserAdd, Sms, Code1, Wallet3, ArrowRight2, TickCircle, Gift, Star1 } from "iconsax-react";
import { Button } from "@/shared/ui/button";
import type { landingContent } from "../../i18n/landing-content";

const stepIcons = [
  <UserAdd key="u" size="28" color="currentColor" variant="Bold" />,
  <Sms key="s" size="28" color="currentColor" variant="Bold" />,
  <Code1 key="c" size="28" color="currentColor" variant="Bold" />,
  <Wallet3 key="w" size="28" color="currentColor" variant="Bold" />,
];

export function HowItWorksSection({ t }: { t: typeof landingContent.fr }) {
  return (
    <section id="how-it-works" className="py-20 md:py-28 bg-card/30 relative overflow-hidden">
      <div className="absolute top-1/2 left-0 -translate-y-1/2 w-[400px] h-[400px] bg-gradient-to-r from-primary/8 to-transparent rounded-full filter blur-[100px]"></div>
      <div className="absolute top-1/2 right-0 -translate-y-1/2 w-[400px] h-[400px] bg-gradient-to-l from-amber-500/8 to-transparent rounded-full filter blur-[100px]"></div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center mb-16 animate-fade-in-up">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-6">
            {t.howItWorks.badge}
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">{t.howItWorks.title}</h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">{t.howItWorks.subtitle}</p>
        </div>

        {/* Campaign offer card */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="relative max-w-4xl mx-auto mb-16"
        >
          {/* Outer glow */}
          <div className="absolute -inset-1 bg-linear-to-r from-primary via-purple-500 to-amber-500 rounded-3xl blur-xl opacity-30 animate-gradient-x bg-300%"></div>

          <div className="relative rounded-2xl md:rounded-3xl bg-linear-to-br from-[#1a0a2e] via-primary to-[#3A1659] p-[1.5px] overflow-hidden">
            {/* Inner content */}
            <div className="relative rounded-2xl md:rounded-3xl bg-card overflow-hidden">
              {/* Decorative shapes */}
              <div className="absolute -top-16 -right-16 w-64 h-64 bg-primary/15 rounded-full blur-3xl"></div>
              <div className="absolute -bottom-16 -left-16 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl"></div>
              <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)', backgroundSize: '24px 24px' }}></div>

              {/* Floating stars */}
              <Star1 size="14" color="currentColor" variant="Bold" className="absolute top-6 right-8 text-amber-400 animate-pulse" />
              <Star1 size="10" color="currentColor" variant="Bold" className="absolute top-12 right-20 text-amber-400/70 animate-pulse" style={{ animationDelay: "0.7s" }} />
              <Star1 size="12" color="currentColor" variant="Bold" className="absolute bottom-8 left-10 text-primary animate-pulse" style={{ animationDelay: "1.2s" }} />

              <div className="relative grid grid-cols-1 md:grid-cols-[auto_1fr_auto] items-center gap-6 md:gap-8 p-6 md:p-8">
                {/* Gift icon */}
                <div className="relative shrink-0 mx-auto md:mx-0">
                  <div className="absolute inset-0 bg-linear-to-br from-primary to-amber-500 rounded-2xl blur-md opacity-50"></div>
                  <div className="relative w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-linear-to-br from-primary via-purple-500 to-amber-500 flex items-center justify-center shadow-xl shadow-primary/30">
                    <Gift size="36" color="#FFFFFF" variant="Bold" />
                  </div>
                </div>

                {/* Text content */}
                <div className="text-center md:text-left">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-600 dark:text-amber-400 text-[11px] font-bold uppercase tracking-wider mb-3">
                    <span className="relative flex h-1.5 w-1.5">
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-amber-500 opacity-75"></span>
                      <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-amber-500"></span>
                    </span>
                    {t.howItWorks.offerBadge}
                  </span>
                  <h3 className="text-xl md:text-2xl font-bold text-foreground mb-2 leading-tight">
                    {t.howItWorks.offerTitle}
                  </h3>
                  <p className="text-sm md:text-base text-muted-foreground leading-relaxed max-w-2xl">
                    {t.howItWorks.offerDesc}
                  </p>
                </div>

                {/* CTA */}
                <div className="shrink-0 mx-auto md:mx-0">
                  <Button
                    size="lg"
                    className="rounded-xl bg-linear-to-r from-primary to-purple-500 hover:from-primary hover:to-purple-600 text-white font-semibold px-6 h-12 shadow-lg shadow-primary/30 hover:shadow-xl hover:shadow-primary/40 hover:scale-[1.03] active:scale-[0.98] transition-all duration-200 group"
                    asChild
                  >
                    <a href="/compte" className="flex items-center">
                      {t.howItWorks.offerCta}
                      <ArrowRight2 size="18" color="currentColor" className="ml-2 group-hover:translate-x-0.5 transition-transform duration-200" />
                    </a>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        <div className="relative max-w-6xl mx-auto">
          {/* Decorative connection line — desktop only */}
          <div className="hidden lg:block absolute top-12 left-[12.5%] right-[12.5%] h-0.5 bg-linear-to-r from-primary/0 via-primary/40 to-primary/0 z-0"></div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-4 relative z-10">
            {t.howItWorks.steps.map((step, i) => {
              const isLast = i === t.howItWorks.steps.length - 1;
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.5, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
                  className="relative group"
                >
                  <div className="relative h-full rounded-2xl border border-border bg-background p-6 md:p-7 hover:border-primary/30 hover:shadow-xl hover:shadow-primary/5 hover:-translate-y-1 transition-all duration-300">
                    {/* Step number badge */}
                    <div className="absolute -top-3 -right-3 w-9 h-9 rounded-full bg-linear-to-br from-primary to-purple-500 text-white text-sm font-bold flex items-center justify-center shadow-lg shadow-primary/30 ring-4 ring-background">
                      {i + 1}
                    </div>

                    {/* Icon */}
                    <div className="w-14 h-14 rounded-2xl bg-primary/10 group-hover:bg-primary/20 flex items-center justify-center text-primary mb-5 transition-colors duration-300">
                      {stepIcons[i]}
                    </div>

                    <h3 className="text-lg md:text-xl font-bold text-foreground mb-2">{step.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{step.desc}</p>
                  </div>

                  {/* Arrow between cards — desktop horizontal */}
                  {!isLast && (
                    <div className="hidden lg:flex absolute top-12 -right-2 z-20 w-4 h-4 items-center justify-center">
                      <div className="w-6 h-6 rounded-full bg-background border border-primary/30 flex items-center justify-center text-primary shadow-sm">
                        <ArrowRight2 size="12" color="currentColor" variant="Bold" />
                      </div>
                    </div>
                  )}

                  {/* Arrow between cards — mobile vertical */}
                  {!isLast && (
                    <div className="flex sm:hidden justify-center pt-3 -mb-3 text-primary/40">
                      <ArrowRight2 size="20" color="currentColor" variant="Bold" className="rotate-90" />
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>

          {/* Micro-trust strip */}
          <motion.ul
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-12 md:mt-16 flex flex-col sm:flex-row sm:flex-wrap items-center justify-center gap-x-8 gap-y-3 text-sm"
          >
            {t.heroCampaign.microTrust.map((item, i) => (
              <li key={i} className="flex items-center gap-2 text-muted-foreground">
                <TickCircle size="18" color="currentColor" variant="Bold" className="text-emerald-500 shrink-0" />
                <span className="font-medium text-foreground/80">{item}</span>
              </li>
            ))}
          </motion.ul>
        </div>
      </div>
    </section>
  );
}
