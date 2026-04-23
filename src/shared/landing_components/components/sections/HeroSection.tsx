"use client"

import { motion } from "framer-motion";
import { Button } from "@/shared/ui/button";
import { ArrowRight2, Global, Sms } from "iconsax-react";
import type { landingContent } from "../../i18n/landing-content";

// ─── Globe Data ──────────────────────────────────────────────────────────────

const globeDots = [
  // Africa
  { x: 52, y: 48, label: "CM", active: true },
  { x: 48, y: 42, label: "NG", active: true },
  { x: 44, y: 45, label: "CI", active: true },
  { x: 43, y: 42, label: "SN", active: true },
  { x: 46, y: 43, label: "GH", active: true },
  { x: 55, y: 65, label: "ZA", active: true },
  { x: 48, y: 35, label: "MA", active: true },
  { x: 50, y: 36, label: "TN", active: true },
  { x: 57, y: 50, active: false },
  { x: 53, y: 55, active: false },
  { x: 50, y: 52, active: false },
  // Europe
  { x: 48, y: 25, label: "FR", active: true },
  { x: 47, y: 24, label: "BE", active: true },
  { x: 46, y: 22, label: "GB", active: true },
  { x: 50, y: 24, active: false },
  { x: 52, y: 22, active: false },
  { x: 44, y: 26, active: false },
  // North America
  { x: 22, y: 30, label: "US", active: true },
  { x: 20, y: 22, label: "CA", active: true },
  { x: 25, y: 28, active: false },
  { x: 18, y: 35, active: false },
  { x: 28, y: 32, active: false },
  // South America
  { x: 32, y: 60, active: false },
  { x: 30, y: 55, active: false },
  { x: 35, y: 65, active: false },
  // Asia
  { x: 70, y: 30, active: false },
  { x: 75, y: 35, active: false },
  { x: 65, y: 28, active: false },
  { x: 78, y: 40, active: false },
  { x: 72, y: 25, active: false },
  // Oceania
  { x: 82, y: 65, active: false },
  { x: 85, y: 62, active: false },
];

const connections = [
  { from: { x: 52, y: 48 }, to: { x: 48, y: 25 } },
  { from: { x: 52, y: 48 }, to: { x: 22, y: 30 } },
  { from: { x: 52, y: 48 }, to: { x: 48, y: 42 } },
  { from: { x: 48, y: 25 }, to: { x: 46, y: 22 } },
  { from: { x: 48, y: 25 }, to: { x: 47, y: 24 } },
  { from: { x: 22, y: 30 }, to: { x: 20, y: 22 } },
  { from: { x: 44, y: 45 }, to: { x: 43, y: 42 } },
];

// ─── Animation Variants ──────────────────────────────────────────────────────

const stagger = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
};
const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const } },
};

export function HeroSection({ t, campaign = false }: { t: typeof landingContent.fr; campaign?: boolean }) {
  const hero = campaign ? t.heroCampaign : t.hero;
  const titleSizeClass = campaign
    ? "text-4xl md:text-5xl lg:text-6xl"
    : "text-5xl md:text-6xl lg:text-7xl";
  const secondaryHref = campaign ? "/api-docs" : "#pricing";

  return (
    <section className="relative py-20 md:py-32 px-6 md:px-12 lg:px-24 overflow-hidden">
      <div className="absolute inset-0 z-0 overflow-hidden">
        <div className="absolute top-0 right-1/4 w-[600px] h-[600px] bg-gradient-to-br from-primary/20 to-purple-600/10 rounded-full filter blur-[100px] dark:from-primary/15 dark:to-purple-600/8"></div>
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-gradient-to-tr from-amber-500/10 to-primary/10 rounded-full filter blur-[80px] dark:from-amber-500/5 dark:to-primary/8"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-r from-primary/5 to-transparent rounded-full filter blur-[120px]"></div>
      </div>

      <div className="container mx-auto relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left: Text content */}
          <motion.div variants={stagger} initial="hidden" animate="visible">
            <motion.div variants={fadeUp}>
              <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-8">
                <Global size="16" color="currentColor" variant="Bold" />
                {hero.badge}
              </span>
            </motion.div>

            <motion.h1 variants={fadeUp} className={`${titleSizeClass} font-bold tracking-tight mb-6 leading-[1.1]`}>
              <span className="text-foreground">{hero.title1}</span>
              <br />
              <span className="bg-gradient-to-r from-primary via-purple-500 to-amber-500 bg-clip-text text-transparent bg-300% animate-gradient-x">
                {hero.title2}
              </span>
            </motion.h1>

            <motion.p variants={fadeUp} className="text-lg md:text-xl text-muted-foreground max-w-lg mb-10 leading-relaxed">
              {hero.subtitle}
            </motion.p>

            <motion.div variants={fadeUp} className="flex flex-col sm:flex-row gap-4 mb-12">
              <Button size="lg" className="bg-primary text-white rounded-xl group text-base px-8 h-12 font-semibold shadow-md shadow-primary/25 hover:shadow-lg hover:shadow-primary/30 hover:scale-[1.03] active:scale-[0.98] transition-all duration-200" asChild>
                <a href="/compte" className="flex items-center">
                  {hero.cta}
                  <ArrowRight2 size="18" color="currentColor" className="ml-2 group-hover:translate-x-0.5 transition-transform duration-200" />
                </a>
              </Button>
              <Button variant="outline" size="lg" className="rounded-xl border-border hover:border-primary/40 hover:bg-primary/5 text-foreground h-12 px-8 text-base font-semibold active:scale-[0.98] transition-all duration-200" asChild>
                <a href={secondaryHref}>{hero.ctaSecondary}</a>
              </Button>
            </motion.div>

            <motion.div variants={fadeUp} className="flex gap-8 md:gap-12">
              {[
                { value: hero.stat1, label: hero.stat1Label },
                { value: hero.stat2, label: hero.stat2Label },
                { value: hero.stat3, label: hero.stat3Label },
              ].map((stat, i) => (
                <div key={i} className="text-center sm:text-left">
                  <div className="text-2xl md:text-3xl font-bold text-foreground">{stat.value}</div>
                  <div className="text-xs md:text-sm text-muted-foreground mt-0.5">{stat.label}</div>
                </div>
              ))}
            </motion.div>
          </motion.div>

          {/* Right: Globe — CSS-only dots, only motion for the container fade-in */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="relative h-[450px] md:h-[550px] hidden lg:block"
          >
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="relative w-[420px] h-[420px]">
                <div className="absolute inset-0 rounded-full border border-border/50 dark:border-border/30"></div>
                <div className="absolute inset-4 rounded-full border border-border/30 dark:border-border/20"></div>
                <div className="absolute inset-8 rounded-full border border-border/20 dark:border-border/10"></div>
                <div className="absolute top-1/4 left-0 right-0 border-t border-border/15 dark:border-border/10"></div>
                <div className="absolute top-1/2 left-0 right-0 border-t border-border/20 dark:border-border/10"></div>
                <div className="absolute top-3/4 left-0 right-0 border-t border-border/15 dark:border-border/10"></div>
                <div className="absolute left-1/4 top-0 bottom-0 border-l border-border/15 dark:border-border/10"></div>
                <div className="absolute left-1/2 top-0 bottom-0 border-l border-border/20 dark:border-border/10"></div>
                <div className="absolute left-3/4 top-0 bottom-0 border-l border-border/15 dark:border-border/10"></div>

                {/* SVG connection lines — CSS animation instead of motion */}
                <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100">
                  {connections.map((conn, i) => (
                    <line
                      key={i}
                      x1={conn.from.x}
                      y1={conn.from.y}
                      x2={conn.to.x}
                      y2={conn.to.y}
                      stroke="currentColor"
                      className="text-primary/30"
                      strokeWidth="0.3"
                      style={{ animation: `svg-line-pulse 3s ${i * 0.5}s ease-in-out infinite` }}
                    />
                  ))}
                </svg>

                {/* Globe dots — pure CSS animations instead of 33 motion.div */}
                {globeDots.map((dot, i) => (
                  <div
                    key={i}
                    className="absolute"
                    style={{
                      left: `${dot.x}%`,
                      top: `${dot.y}%`,
                      animation: `dot-appear 0.4s ${0.5 + i * 0.05}s ease-out both`,
                      transform: "translate(-50%, -50%)",
                    }}
                  >
                    {dot.active ? (
                      <div className="relative group cursor-pointer">
                        <div className="absolute inset-0 w-3 h-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/30 animate-pulse-ring"></div>
                        <div className="w-2.5 h-2.5 rounded-full bg-primary shadow-lg shadow-primary/40 -translate-x-1/2 -translate-y-1/2 group-hover:scale-150 transition-transform duration-200"></div>
                        {dot.label && (
                          <div className="absolute -top-6 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-card text-foreground text-[9px] font-bold px-1.5 py-0.5 rounded shadow-md whitespace-nowrap border border-border">
                            {dot.label}
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="w-1.5 h-1.5 rounded-full bg-muted-foreground/30 -translate-x-1/2 -translate-y-1/2"></div>
                    )}
                  </div>
                ))}

                {/* SMS bubbles — CSS animation instead of 4 motion.div with infinite loops */}
                {[
                  { x: 48, y: 35, delay: 0 },
                  { x: 22, y: 28, delay: 1.5 },
                  { x: 55, y: 60, delay: 3 },
                  { x: 70, y: 30, delay: 4.5 },
                ].map((bubble, i) => (
                  <div
                    key={i}
                    className="absolute pointer-events-none animate-sms-float"
                    style={{ left: `${bubble.x}%`, top: `${bubble.y}%`, animationDelay: `${bubble.delay}s` }}
                  >
                    <div className="bg-primary/90 backdrop-blur-sm text-white text-[10px] px-2.5 py-1.5 rounded-xl rounded-bl-sm shadow-lg shadow-primary/20 whitespace-nowrap">
                      <Sms size="10" color="currentColor" className="inline mr-1" />
                      SMS
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
