"use client"

import { motion } from "framer-motion";
import { Button } from "@/shared/ui/button";
import { ArrowRight2, Chart2, Sms, Global, ShieldTick, Clock } from "iconsax-react";
import type { landingContent, Lang } from "../../i18n/landing-content";

export function CtaSection({ t, lang, onContactClick }: { t: typeof landingContent.fr; lang: Lang; onContactClick: () => void }) {
  return (
    <section className="py-24 md:py-32 relative overflow-hidden">
      {/* Background layers */}
      <div className="absolute inset-0 bg-linear-to-br from-[#1a0a2e] via-primary/90 to-[#3A1659]"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_80%,rgba(139,92,246,0.3),transparent_50%)]"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(236,72,153,0.2),transparent_50%)]"></div>
      {/* Grid pattern */}
      <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.5) 1px, transparent 1px)', backgroundSize: '60px 60px' }}></div>
      {/* Glow orbs */}
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl"></div>
      <div className="absolute -bottom-24 -left-24 w-80 h-80 bg-fuchsia-500/15 rounded-full blur-3xl"></div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">

          {/* Left side — Stats */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="space-y-6"
          >
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 backdrop-blur-sm px-4 py-1.5">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400"></span>
              </span>
              <span className="text-xs font-medium text-white/70 uppercase tracking-wider">
                {lang === "fr" ? "Plateforme active" : "Platform live"}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                { value: "2,500+", label: lang === "fr" ? "Entreprises" : "Businesses", icon: <Chart2 size="20" variant="Bulk" color="currentColor" /> },
                { value: "10M+", label: lang === "fr" ? "SMS / mois" : "SMS / month", icon: <Sms size="20" variant="Bulk" color="currentColor" /> },
                { value: "50+", label: lang === "fr" ? "Pays" : "Countries", icon: <Global size="20" variant="Bulk" color="currentColor" /> },
              ].map((stat, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  className="group relative rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm p-5 hover:border-white/20 hover:bg-white/10 transition-all duration-300"
                >
                  <div className="absolute inset-0 rounded-2xl bg-linear-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="relative">
                    <div className="text-white/40 mb-3">{stat.icon}</div>
                    <div className="text-3xl md:text-4xl font-bold text-white tracking-tight">{stat.value}</div>
                    <div className="text-xs text-white/50 uppercase tracking-wider mt-1 font-medium">{stat.label}</div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Trust bar */}
            <div className="flex items-center gap-3 pt-2">
              <div className="flex -space-x-2">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="w-8 h-8 rounded-full border-2 border-[#1a0a2e] bg-linear-to-br from-purple-400 to-fuchsia-500 flex items-center justify-center text-[10px] font-bold text-white">
                    {String.fromCharCode(65 + i)}
                  </div>
                ))}
              </div>
              <div className="text-sm text-white/50">
                <span className="text-white/80 font-semibold">+2,500</span>{' '}
                {lang === "fr" ? "entreprises nous font confiance" : "businesses trust us"}
              </div>
            </div>
          </motion.div>

          {/* Right side — CTA */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-center lg:text-left"
          >
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 text-white leading-tight">
              {t.cta.title}
            </h2>
            <p className="text-lg text-white/70 mb-10 max-w-lg mx-auto lg:mx-0 leading-relaxed">
              {t.cta.subtitle}
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Button size="lg" className="relative rounded-xl bg-white hover:bg-white/95 text-primary font-semibold px-8 h-13 shadow-lg shadow-black/20 hover:shadow-xl hover:scale-[1.03] active:scale-[0.98] transition-all duration-200 overflow-hidden group" asChild>
                <a href="/compte" className="flex items-center justify-center">
                  <span className="absolute inset-0 bg-linear-to-r from-transparent via-white/40 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></span>
                  <span className="relative flex items-center">
                    {t.cta.primary}
                    <ArrowRight2 size="18" color="currentColor" className="ml-2 group-hover:translate-x-1 transition-transform duration-200" />
                  </span>
                </a>
              </Button>
              <Button onClick={onContactClick} variant="outline" size="lg" className="rounded-xl border-white/20 text-white hover:bg-white/10 hover:border-white/40 font-semibold px-8 h-13 backdrop-blur-sm active:scale-[0.98] transition-all duration-200">
                <span className="flex items-center">
                  {t.cta.secondary}
                  <ArrowRight2 size="18" color="currentColor" className="ml-2" />
                </span>
              </Button>
            </div>

            {/* Micro features */}
            <div className="flex flex-wrap gap-x-6 gap-y-2 mt-8 justify-center lg:justify-start">
              {[
                { icon: <ShieldTick size="14" variant="Bulk" color="currentColor" />, text: lang === "fr" ? "Aucune carte requise" : "No card required" },
                { icon: <Clock size="14" variant="Bulk" color="currentColor" />, text: lang === "fr" ? "Activation en 2 min" : "2 min setup" },
                { icon: <Global size="14" variant="Bulk" color="currentColor" />, text: lang === "fr" ? "Couverture mondiale" : "Global coverage" },
              ].map((feat, i) => (
                <div key={i} className="flex items-center gap-1.5 text-white/50 text-sm">
                  <span className="text-emerald-400">{feat.icon}</span>
                  {feat.text}
                </div>
              ))}
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
