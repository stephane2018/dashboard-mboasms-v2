"use client"

import { motion } from "framer-motion";
import Image from "next/image";
import { Check } from "../shared/Check";
import type { landingContent, Lang } from "../../i18n/landing-content";

export function MobileAppSection({ t, lang }: { t: typeof landingContent.fr; lang: Lang }) {
  return (
    <section className="py-24 md:py-32 px-6 relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 bg-linear-to-b from-muted/30 via-transparent to-muted/30"></div>

      {/* Floating orbs */}
      <motion.div
        animate={{ x: [0, 30, 0], y: [0, -20, 0], scale: [1, 1.1, 1] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-20 -left-20 w-[400px] h-[400px] bg-primary/5 rounded-full blur-3xl"
      />
      <motion.div
        animate={{ x: [0, -25, 0], y: [0, 25, 0], scale: [1, 1.15, 1] }}
        transition={{ duration: 15, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        className="absolute bottom-20 -right-20 w-[350px] h-[350px] bg-purple-500/5 rounded-full blur-3xl"
      />
      <motion.div
        animate={{ x: [0, 15, 0], y: [0, 15, 0] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 4 }}
        className="absolute top-1/2 left-1/3 w-[250px] h-[250px] bg-fuchsia-500/3 rounded-full blur-3xl"
      />

      {/* Animated SVG pattern */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-[0.035] dark:opacity-[0.05]" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="mobile-grid" x="0" y="0" width="60" height="60" patternUnits="userSpaceOnUse">
            <rect width="1" height="1" x="30" y="30" fill="currentColor" className="text-foreground" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#mobile-grid)" />
      </svg>

      {/* Animated floating shapes */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* SMS bubble */}
        <motion.svg
          animate={{ y: [0, -15, 0], rotate: [0, 5, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[15%] right-[10%] w-12 h-12 text-primary/8"
          viewBox="0 0 24 24" fill="currentColor"
        >
          <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H5.17L4 17.17V4h16v12z" />
          <path d="M7 9h2v2H7zm4 0h2v2h-2zm4 0h2v2h-2z" />
        </motion.svg>

        {/* Phone icon */}
        <motion.svg
          animate={{ y: [0, 12, 0], rotate: [0, -8, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          className="absolute bottom-[20%] left-[8%] w-10 h-10 text-purple-500/8"
          viewBox="0 0 24 24" fill="currentColor"
        >
          <path d="M16 1H8C6.34 1 5 2.34 5 4v16c0 1.66 1.34 3 3 3h8c1.66 0 3-1.34 3-3V4c0-1.66-1.34-3-3-3zm1 17H7V4h10v14zm-5 3c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1z" />
        </motion.svg>

        {/* Bell / notification */}
        <motion.svg
          animate={{ y: [0, -10, 0], x: [0, 8, 0] }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 3 }}
          className="absolute top-[40%] right-[5%] w-8 h-8 text-amber-500/8"
          viewBox="0 0 24 24" fill="currentColor"
        >
          <path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2zm6-6v-5c0-3.07-1.63-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.64 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z" />
        </motion.svg>

        {/* Signal / wifi */}
        <motion.svg
          animate={{ y: [0, 8, 0], rotate: [0, 10, 0] }}
          transition={{ duration: 9, repeat: Infinity, ease: "easeInOut", delay: 5 }}
          className="absolute bottom-[35%] right-[15%] w-9 h-9 text-primary/6"
          viewBox="0 0 24 24" fill="currentColor"
        >
          <path d="M12 18c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm-5.27-2.27l1.41 1.41C9.37 16.4 10.62 16 12 16s2.63.4 3.86 1.14l1.41-1.41C15.68 14.55 13.93 14 12 14s-3.68.55-5.27 1.73zm-2.83-2.83l1.41 1.41C7.21 12.68 9.46 12 12 12s4.79.68 6.69 1.81l1.41-1.41C17.87 10.89 15.07 10 12 10s-5.87.89-8.1 2.4z" />
        </motion.svg>

        {/* Check circle */}
        <motion.svg
          animate={{ y: [0, -12, 0], x: [0, -6, 0] }}
          transition={{ duration: 7.5, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          className="absolute top-[25%] left-[15%] w-8 h-8 text-emerald-500/8"
          viewBox="0 0 24 24" fill="currentColor"
        >
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
        </motion.svg>
      </div>

      <div className="container mx-auto max-w-6xl relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-20 items-center">

          {/* Phone mockup */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative h-[420px] md:h-[520px] order-2 lg:order-1"
          >
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="absolute w-64 h-64 bg-primary/5 rounded-full blur-2xl"></div>
              <Image src="/phone.png" alt="MboaSMS Mobile App" fill className="object-contain drop-shadow-2xl" />
            </div>
          </motion.div>

          {/* Content */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="order-1 lg:order-2"
          >
            {/* Badge */}
            <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/20 bg-amber-500/5 px-4 py-1.5 mb-6">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-amber-400 opacity-75"></span>
                <span className="relative inline-flex h-2 w-2 rounded-full bg-amber-400"></span>
              </span>
              <span className="text-xs font-semibold text-amber-600 dark:text-amber-400">{t.mobileApp.badge}</span>
            </div>

            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-5 leading-tight">
              {t.mobileApp.title}
            </h2>
            <p className="text-muted-foreground text-lg leading-relaxed mb-8 max-w-lg">
              {t.mobileApp.subtitle}
            </p>

            {/* Features */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
              {t.mobileApp.features.map((feature, i) => (
                <div key={i} className="flex items-start gap-3 rounded-xl border border-border/60 bg-card/50 p-3.5">
                  <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="text-primary w-3 h-3" />
                  </div>
                  <span className="text-sm text-foreground/80">{feature}</span>
                </div>
              ))}
            </div>

            {/* Store badges — coming soon */}
            <div className="flex flex-wrap gap-3">
              {[
                { name: "Google Play", icon: "M3.609 1.814L13.792 12 3.61 22.186a.996.996 0 01-.61-.92V2.734a1 1 0 01.609-.92zm10.89 10.893l2.302 2.302-10.937 6.333 8.635-8.635zm3.199-3.199l2.302 2.302a1 1 0 010 1.38l-2.302 2.302L15.396 13l2.302-2.492zM5.864 3.468L16.8 9.8l-2.302 2.302L5.864 3.468z" },
                { name: "App Store", icon: "M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" },
              ].map((store) => (
                <div
                  key={store.name}
                  className="flex items-center gap-3 rounded-xl border border-border bg-muted/30 px-4 py-2.5"
                >
                  <svg className="w-4 h-4 text-muted-foreground" viewBox="0 0 24 24" fill="currentColor">
                    <path d={store.icon} />
                  </svg>
                  <div>
                    <p className="text-[10px] text-muted-foreground leading-none">{store.name}</p>
                    <p className="text-xs font-semibold text-foreground">{lang === "fr" ? "Bientot disponible" : "Coming soon"}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
