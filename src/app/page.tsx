"use client"

import Header from "@/shared/landing_components/components/layout/Header";
import Footer from "@/shared/landing_components/components/layout/Footer";
import ScheduleCallModal from "@/shared/landing_components/components/ScheduleCallModal";
import CollaboratorLogos from "@/shared/landing_components/components/sections/CollaboratorLogos";
import ServicePresentation from "@/shared/landing_components/components/sections/ServicePresentation";
import Testimonials from "@/shared/landing_components/components/sections/Testimonials";
import { Button } from "@/shared/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight2, Code1, MessageText1, Mobile, Global, SearchNormal1, Sms, Clock, ShieldTick, Chart2, Call, Whatsapp, DirectSend } from "iconsax-react";
import Image from "next/image";
import { usePricing } from "@/core/hooks/usePricing";
import type { PricingPlanType } from "@/core/models/pricing";
import { useState, useMemo } from "react";

// ─── i18n Content ────────────────────────────────────────────────────────────

const content = {
  fr: {
    hero: {
      badge: "SMS International",
      title1: "Vos messages,",
      title2: "sans frontieres.",
      subtitle: "Envoyez des SMS en masse dans plus de 50 pays. Une plateforme unique pour atteindre vos clients partout dans le monde, avec des tarifs locaux competitifs.",
      cta: "Commencer maintenant",
      ctaSecondary: "Voir les tarifs",
      stat1: "50+",
      stat1Label: "Pays couverts",
      stat2: "99.2%",
      stat2Label: "Taux de livraison",
      stat3: "10M+",
      stat3Label: "SMS envoyes / mois",
    },
    platforms: {
      badge: "Deux solutions, une mission",
      title: "Choisissez votre interface",
      subtitle: "API pour les developpeurs, Dashboard pour les equipes marketing",
      api: {
        title: "API SMS",
        desc: "Integrez l'envoi de SMS dans vos applications avec notre API RESTful. Documentation complete, SDKs disponibles.",
        features: ["Documentation multilingue", "Webhooks en temps reel", "SDKs Python, Node.js, PHP"],
        cta: "Explorer l'API",
      },
      bulk: {
        title: "Bulk SMS",
        desc: "Interface intuitive pour gerer vos campagnes SMS a grande echelle. Import de contacts, templates, planification.",
        features: ["Import CSV / Excel", "Templates personnalises", "Rapports detailles"],
        cta: "Creer un compte",
      },
    },
    mobileApp: {
      badge: "Disponible partout",
      title: "Gerez vos SMS depuis votre poche",
      subtitle: "L'application mobile MboaSMS vous donne le controle total sur vos campagnes, ou que vous soyez dans le monde.",
      downloads: "+5,000 telechargements",
      rating: "4.9/5",
      features: [
        "Envoi de SMS en masse depuis mobile",
        "Suivi en temps reel des campagnes",
        "Gestion des contacts et groupes",
        "Notifications de livraison instantanees",
      ],
    },
    pricing: {
      badge: "Tarifs transparents",
      title: "Prix par pays",
      subtitle: "Des tarifs competitifs adaptes a chaque marche. Pas de frais caches, pas d'engagement.",
      searchPlaceholder: "Rechercher un pays...",
      perSms: "/ SMS",
      planTitle: "Nos forfaits",
      planSubtitle: "Des volumes adaptes a vos besoins",
      choosePlan: "Choisir ce forfait",
      validDays: "jours",
      noPlan: "Aucun plan disponible pour le moment.",
      customSolution: "Besoin d'une solution sur mesure pour votre entreprise ?",
      contactSales: "Contacter l'equipe commerciale",
      regionAll: "Tous",
      regionAfrica: "Afrique",
      regionEurope: "Europe",
      regionAmerica: "Amerique",
    },
    stats: {
      title: "La confiance a l'echelle mondiale",
      subtitle: "Des entreprises de toutes tailles nous font confiance pour leur communication SMS",
      items: [
        { value: "50+", label: "Pays couverts" },
        { value: "2,500+", label: "Entreprises actives" },
        { value: "99.2%", label: "Taux de livraison" },
        { value: "< 3s", label: "Temps de livraison moyen" },
      ],
    },
    cta: {
      title: "Pret a communiquer sans frontieres ?",
      subtitle: "Rejoignez les milliers d'entreprises qui utilisent MboaSMS pour atteindre leurs clients dans le monde entier.",
      primary: "Inscrivez-vous gratuitement",
      secondary: "Contactez-Nous",
    },
    contact: {
      title: "Besoin d'une solution personnalisee ?",
      subtitle: "Notre equipe d'experts est prete a concevoir une solution SMS sur mesure adaptee aux besoins specifiques de votre entreprise.",
      schedule: "Planifier un appel",
      contactTeam: "Contacter l'equipe",
      email: "contact@mboasms.com",
      whatsapp: "+237 6XX XXX XXX",
      phone: "+237 6XX XXX XXX",
      emailLabel: "Email",
      whatsappLabel: "WhatsApp",
      phoneLabel: "Telephone",
    },
  },
  en: {
    hero: {
      badge: "International SMS",
      title1: "Your messages,",
      title2: "without borders.",
      subtitle: "Send bulk SMS to 50+ countries. A single platform to reach your customers anywhere in the world, with competitive local rates.",
      cta: "Get started",
      ctaSecondary: "View pricing",
      stat1: "50+",
      stat1Label: "Countries covered",
      stat2: "99.2%",
      stat2Label: "Delivery rate",
      stat3: "10M+",
      stat3Label: "SMS sent / month",
    },
    platforms: {
      badge: "Two solutions, one mission",
      title: "Choose your interface",
      subtitle: "API for developers, Dashboard for marketing teams",
      api: {
        title: "SMS API",
        desc: "Integrate SMS sending into your applications with our RESTful API. Complete documentation, SDKs available.",
        features: ["Multilingual docs", "Real-time webhooks", "Python, Node.js, PHP SDKs"],
        cta: "Explore the API",
      },
      bulk: {
        title: "Bulk SMS",
        desc: "Intuitive interface to manage your large-scale SMS campaigns. Contact import, templates, scheduling.",
        features: ["CSV / Excel import", "Custom templates", "Detailed reports"],
        cta: "Create an account",
      },
    },
    mobileApp: {
      badge: "Available everywhere",
      title: "Manage your SMS from your pocket",
      subtitle: "The MboaSMS mobile app gives you full control over your campaigns, wherever you are in the world.",
      downloads: "+5,000 downloads",
      rating: "4.9/5",
      features: [
        "Send bulk SMS from your phone",
        "Real-time campaign tracking",
        "Contact & group management",
        "Instant delivery notifications",
      ],
    },
    pricing: {
      badge: "Transparent pricing",
      title: "Price per country",
      subtitle: "Competitive rates tailored to each market. No hidden fees, no commitment.",
      searchPlaceholder: "Search for a country...",
      perSms: "/ SMS",
      planTitle: "Our plans",
      planSubtitle: "Volumes tailored to your needs",
      choosePlan: "Choose this plan",
      validDays: "days",
      noPlan: "No plans available at the moment.",
      customSolution: "Need a custom solution for your business?",
      contactSales: "Contact sales team",
      regionAll: "All",
      regionAfrica: "Africa",
      regionEurope: "Europe",
      regionAmerica: "America",
    },
    stats: {
      title: "Trust at a global scale",
      subtitle: "Businesses of all sizes trust us for their SMS communication",
      items: [
        { value: "50+", label: "Countries covered" },
        { value: "2,500+", label: "Active businesses" },
        { value: "99.2%", label: "Delivery rate" },
        { value: "< 3s", label: "Avg delivery time" },
      ],
    },
    cta: {
      title: "Ready to communicate without borders?",
      subtitle: "Join thousands of businesses using MboaSMS to reach their customers worldwide.",
      primary: "Sign up for free",
      secondary: "Contact Us",
    },
    contact: {
      title: "Need a custom solution?",
      subtitle: "Our team of experts is ready to design a tailor-made SMS solution adapted to your business needs.",
      schedule: "Schedule a call",
      contactTeam: "Contact our team",
      email: "contact@mboasms.com",
      whatsapp: "+237 6XX XXX XXX",
      phone: "+237 6XX XXX XXX",
      emailLabel: "Email",
      whatsappLabel: "WhatsApp",
      phoneLabel: "Phone",
    },
  },
};

// ─── Country Pricing Data ────────────────────────────────────────────────────

type Region = "all" | "africa" | "europe" | "america";

const countryPricing = [
  { code: "CM", flag: "🇨🇲", name: { fr: "Cameroun", en: "Cameroon" }, price: 23, currency: "FCFA", region: "africa" as Region, popular: true },
  { code: "SN", flag: "🇸🇳", name: { fr: "Senegal", en: "Senegal" }, price: 25, currency: "FCFA", region: "africa" as Region },
  { code: "CI", flag: "🇨🇮", name: { fr: "Cote d'Ivoire", en: "Ivory Coast" }, price: 25, currency: "FCFA", region: "africa" as Region },
  { code: "NG", flag: "🇳🇬", name: { fr: "Nigeria", en: "Nigeria" }, price: 4.5, currency: "NGN", region: "africa" as Region },
  { code: "GH", flag: "🇬🇭", name: { fr: "Ghana", en: "Ghana" }, price: 0.04, currency: "GHS", region: "africa" as Region },
  { code: "ZA", flag: "🇿🇦", name: { fr: "Afrique du Sud", en: "South Africa" }, price: 0.35, currency: "ZAR", region: "africa" as Region },
  { code: "MA", flag: "🇲🇦", name: { fr: "Maroc", en: "Morocco" }, price: 0.30, currency: "MAD", region: "africa" as Region },
  { code: "TN", flag: "🇹🇳", name: { fr: "Tunisie", en: "Tunisia" }, price: 0.15, currency: "TND", region: "africa" as Region },
  { code: "FR", flag: "🇫🇷", name: { fr: "France", en: "France" }, price: 0.065, currency: "EUR", region: "europe" as Region },
  { code: "GB", flag: "🇬🇧", name: { fr: "Royaume-Uni", en: "United Kingdom" }, price: 0.045, currency: "GBP", region: "europe" as Region },
  { code: "BE", flag: "🇧🇪", name: { fr: "Belgique", en: "Belgium" }, price: 0.07, currency: "EUR", region: "europe" as Region },
  { code: "US", flag: "🇺🇸", name: { fr: "Etats-Unis", en: "United States" }, price: 0.015, currency: "USD", region: "america" as Region, cheapest: true },
  { code: "CA", flag: "🇨🇦", name: { fr: "Canada", en: "Canada" }, price: 0.02, currency: "CAD", region: "america" as Region },
];

// ─── Globe Dots (simplified world map positions) ─────────────────────────────

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

// ─── Connection lines between dots ──────────────────────────────────────────

const connections = [
  { from: { x: 52, y: 48 }, to: { x: 48, y: 25 } },  // CM -> FR
  { from: { x: 52, y: 48 }, to: { x: 22, y: 30 } },  // CM -> US
  { from: { x: 52, y: 48 }, to: { x: 48, y: 42 } },  // CM -> NG
  { from: { x: 48, y: 25 }, to: { x: 46, y: 22 } },  // FR -> GB
  { from: { x: 48, y: 25 }, to: { x: 47, y: 24 } },  // FR -> BE
  { from: { x: 22, y: 30 }, to: { x: 20, y: 22 } },  // US -> CA
  { from: { x: 44, y: 45 }, to: { x: 43, y: 42 } },  // CI -> SN
];

// ─── Animated SMS Bubble Component ──────────────────────────────────────────

function SmsBubble({ delay, x, y }: { delay: number; x: number; y: number }) {
  return (
    <motion.div
      className="absolute pointer-events-none"
      style={{ left: `${x}%`, top: `${y}%` }}
      initial={{ opacity: 0, scale: 0, y: 0 }}
      animate={{
        opacity: [0, 1, 1, 0],
        scale: [0.5, 1, 1, 0.7],
        y: [0, -30, -80, -120],
        x: [0, 10, 20, 30],
      }}
      transition={{
        duration: 4,
        delay,
        repeat: Infinity,
        repeatDelay: 2,
        ease: "easeOut",
      }}
    >
      <div className="bg-primary/90 backdrop-blur-sm text-white text-[10px] px-2.5 py-1.5 rounded-xl rounded-bl-sm shadow-lg shadow-primary/20 whitespace-nowrap">
        <Sms size="10" color="currentColor" className="inline mr-1" />
        SMS
      </div>
    </motion.div>
  );
}

// ─── Language Toggle Component ──────────────────────────────────────────────

function LanguageToggle({ lang, setLang }: { lang: "fr" | "en"; setLang: (l: "fr" | "en") => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
      className="fixed top-24 right-6 z-40 flex items-center rounded-full bg-card/80 backdrop-blur-md border border-border shadow-lg overflow-hidden"
    >
      <button
        onClick={() => setLang("fr")}
        className={`px-3 py-1.5 text-xs font-semibold transition-all duration-300 ${
          lang === "fr"
            ? "bg-primary text-white"
            : "text-muted-foreground hover:text-foreground"
        }`}
      >
        FR
      </button>
      <button
        onClick={() => setLang("en")}
        className={`px-3 py-1.5 text-xs font-semibold transition-all duration-300 ${
          lang === "en"
            ? "bg-primary text-white"
            : "text-muted-foreground hover:text-foreground"
        }`}
      >
        EN
      </button>
    </motion.div>
  );
}

// ─── Main Page Component ────────────────────────────────────────────────────

export default function Home() {
  const [scheduleCallOpen, setScheduleCallOpen] = useState(false);
  const [lang, setLang] = useState<"fr" | "en">("fr");
  const [countrySearch, setCountrySearch] = useState("");
  const [regionFilter, setRegionFilter] = useState<Region>("all");
  const { activePlansQuery } = usePricing();

  const activePlans = activePlansQuery.data || [];
  const isLoadingPlans = activePlansQuery.isLoading;
  const t = content[lang];

  const filteredCountries = useMemo(() => {
    let results = countryPricing;
    if (regionFilter !== "all") {
      results = results.filter((c) => c.region === regionFilter);
    }
    if (countrySearch) {
      const search = countrySearch.toLowerCase();
      results = results.filter(
        (c) =>
          c.name[lang].toLowerCase().includes(search) ||
          c.code.toLowerCase().includes(search)
      );
    }
    return results;
  }, [countrySearch, lang, regionFilter]);

  const stagger = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.08 },
    },
  };

  const fadeUp = {
    hidden: { opacity: 0, y: 24 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const } },
  };

  return (
    <div className="min-h-screen bg-background pt-20 noise-overlay relative">
      <Header />
      <LanguageToggle lang={lang} setLang={setLang} />

      {/* ─── Hero Section ─────────────────────────────────────────────── */}
      <section className="relative py-20 md:py-32 px-6 md:px-12 lg:px-24 overflow-hidden">
        {/* Background gradient orbs */}
        <div className="absolute inset-0 z-0 overflow-hidden">
          <div className="absolute top-0 right-1/4 w-[600px] h-[600px] bg-gradient-to-br from-primary/20 to-purple-600/10 rounded-full filter blur-[100px] dark:from-primary/15 dark:to-purple-600/8"></div>
          <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-gradient-to-tr from-amber-500/10 to-primary/10 rounded-full filter blur-[80px] dark:from-amber-500/5 dark:to-primary/8"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-r from-primary/5 to-transparent rounded-full filter blur-[120px]"></div>
        </div>

        <div className="container mx-auto relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Left: Text content */}
            <motion.div
              variants={stagger}
              initial="hidden"
              animate="visible"
            >
              <motion.div variants={fadeUp}>
                <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-8">
                  <Global size="16" color="currentColor" variant="Bold" />
                  {t.hero.badge}
                </span>
              </motion.div>

              <motion.h1
                variants={fadeUp}
                className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6 leading-[1.1]"
              >
                <span className="text-foreground">{t.hero.title1}</span>
                <br />
                <span className="bg-gradient-to-r from-primary via-purple-500 to-amber-500 bg-clip-text text-transparent bg-300% animate-gradient-x">
                  {t.hero.title2}
                </span>
              </motion.h1>

              <motion.p
                variants={fadeUp}
                className="text-lg md:text-xl text-muted-foreground max-w-lg mb-10 leading-relaxed"
              >
                {t.hero.subtitle}
              </motion.p>

              <motion.div variants={fadeUp} className="flex flex-col sm:flex-row gap-4 mb-12">
                <Button
                  size="lg"
                  className="relative overflow-hidden rounded-full group text-base px-8 h-12"
                  asChild
                >
                  <a href="/compte">
                    <span className="absolute inset-0 bg-gradient-to-r from-primary to-purple-500 group-hover:from-purple-500 group-hover:to-primary transition-all duration-500"></span>
                    <span className="relative flex items-center justify-center text-white font-medium">
                      {t.hero.cta}
                      <ArrowRight2 size="18" color="currentColor" className="ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                    </span>
                  </a>
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="rounded-full border-border hover:border-primary/50 hover:bg-primary/5 text-foreground h-12 px-8 text-base"
                  asChild
                >
                  <a href="#pricing">
                    {t.hero.ctaSecondary}
                  </a>
                </Button>
              </motion.div>

              {/* Stats row */}
              <motion.div variants={fadeUp} className="flex gap-8 md:gap-12">
                {[
                  { value: t.hero.stat1, label: t.hero.stat1Label },
                  { value: t.hero.stat2, label: t.hero.stat2Label },
                  { value: t.hero.stat3, label: t.hero.stat3Label },
                ].map((stat, i) => (
                  <div key={i} className="text-center sm:text-left">
                    <div className="text-2xl md:text-3xl font-bold text-foreground">{stat.value}</div>
                    <div className="text-xs md:text-sm text-muted-foreground mt-0.5">{stat.label}</div>
                  </div>
                ))}
              </motion.div>
            </motion.div>

            {/* Right: Globe visualization */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="relative h-[450px] md:h-[550px] hidden lg:block"
            >
              {/* Globe container */}
              <div className="absolute inset-0 flex items-center justify-center">
                {/* Globe circle */}
                <div className="relative w-[420px] h-[420px]">
                  {/* Globe outline */}
                  <div className="absolute inset-0 rounded-full border border-border/50 dark:border-border/30"></div>
                  <div className="absolute inset-4 rounded-full border border-border/30 dark:border-border/20"></div>
                  <div className="absolute inset-8 rounded-full border border-border/20 dark:border-border/10"></div>

                  {/* Horizontal grid lines */}
                  <div className="absolute top-1/4 left-0 right-0 border-t border-border/15 dark:border-border/10"></div>
                  <div className="absolute top-1/2 left-0 right-0 border-t border-border/20 dark:border-border/10"></div>
                  <div className="absolute top-3/4 left-0 right-0 border-t border-border/15 dark:border-border/10"></div>

                  {/* Vertical grid lines */}
                  <div className="absolute left-1/4 top-0 bottom-0 border-l border-border/15 dark:border-border/10"></div>
                  <div className="absolute left-1/2 top-0 bottom-0 border-l border-border/20 dark:border-border/10"></div>
                  <div className="absolute left-3/4 top-0 bottom-0 border-l border-border/15 dark:border-border/10"></div>

                  {/* SVG connection lines */}
                  <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100">
                    {connections.map((conn, i) => (
                      <motion.line
                        key={i}
                        x1={conn.from.x}
                        y1={conn.from.y}
                        x2={conn.to.x}
                        y2={conn.to.y}
                        stroke="currentColor"
                        className="text-primary/30"
                        strokeWidth="0.3"
                        initial={{ pathLength: 0, opacity: 0 }}
                        animate={{ pathLength: 1, opacity: [0, 0.6, 0] }}
                        transition={{
                          duration: 3,
                          delay: i * 0.5,
                          repeat: Infinity,
                          repeatDelay: 1,
                          ease: "easeInOut",
                        }}
                      />
                    ))}
                  </svg>

                  {/* Globe dots */}
                  {globeDots.map((dot, i) => (
                    <motion.div
                      key={i}
                      className="absolute"
                      style={{
                        left: `${dot.x}%`,
                        top: `${dot.y}%`,
                        transform: "translate(-50%, -50%)",
                      }}
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: 0.5 + i * 0.05, duration: 0.4 }}
                    >
                      {dot.active ? (
                        <div className="relative group cursor-pointer">
                          {/* Pulse ring */}
                          <div className="absolute inset-0 w-3 h-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/30 animate-pulse-ring"></div>
                          {/* Dot */}
                          <div className="w-2.5 h-2.5 rounded-full bg-primary shadow-lg shadow-primary/40 -translate-x-1/2 -translate-y-1/2 group-hover:scale-150 transition-transform duration-200"></div>
                          {/* Label on hover */}
                          {dot.label && (
                            <div className="absolute -top-6 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-card text-foreground text-[9px] font-bold px-1.5 py-0.5 rounded shadow-md whitespace-nowrap border border-border">
                              {dot.label}
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="w-1.5 h-1.5 rounded-full bg-muted-foreground/30 -translate-x-1/2 -translate-y-1/2"></div>
                      )}
                    </motion.div>
                  ))}

                  {/* Floating SMS bubbles */}
                  <SmsBubble delay={0} x={48} y={35} />
                  <SmsBubble delay={1.5} x={22} y={28} />
                  <SmsBubble delay={3} x={55} y={60} />
                  <SmsBubble delay={4.5} x={70} y={30} />
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ─── Stats Bar ────────────────────────────────────────────────── */}
      <section className="py-12 border-y border-border/50 bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-6">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={stagger}
            className="text-center mb-8"
          >
            <motion.h2 variants={fadeUp} className="text-2xl md:text-3xl font-bold text-foreground mb-2">
              {t.stats.title}
            </motion.h2>
            <motion.p variants={fadeUp} className="text-muted-foreground">
              {t.stats.subtitle}
            </motion.p>
          </motion.div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
            {t.stats.items.map((stat, i) => {
              const icons = [
                <Global key="g" size="22" color="currentColor" variant="Bold" />,
                <Chart2 key="c" size="22" color="currentColor" variant="Bold" />,
                <ShieldTick key="s" size="22" color="currentColor" variant="Bold" />,
                <Clock key="t" size="22" color="currentColor" variant="Bold" />,
              ];
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1, duration: 0.5 }}
                  whileHover={{ y: -4, scale: 1.02 }}
                  className="text-center p-6 rounded-2xl bg-background/80 border border-border/50 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300 group cursor-default"
                >
                  <div className="w-10 h-10 rounded-xl bg-primary/10 group-hover:bg-primary/20 flex items-center justify-center mx-auto mb-3 text-primary transition-colors duration-300">
                    {icons[i]}
                  </div>
                  <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-primary to-purple-500 bg-clip-text text-transparent mb-1">
                    {stat.value}
                  </div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ─── Service Presentation ─────────────────────────────────────── */}
      <ServicePresentation />

      {/* ─── Testimonials ─────────────────────────────────────────────── */}
      <Testimonials />

      {/* ─── Collaborator Logos ───────────────────────────────────────── */}
      <CollaboratorLogos />

      {/* ─── Platforms Section ────────────────────────────────────────── */}
      <section className="py-20 md:py-28 bg-background relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-gradient-to-b from-primary/8 to-transparent rounded-full filter blur-[100px]"></div>

        <div className="container mx-auto px-6 relative z-10">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={stagger}
            className="text-center mb-16"
          >
            <motion.span variants={fadeUp} className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-6">
              {t.platforms.badge}
            </motion.span>
            <motion.h2 variants={fadeUp} className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              {t.platforms.title}
            </motion.h2>
            <motion.p variants={fadeUp} className="text-muted-foreground text-lg max-w-xl mx-auto">
              {t.platforms.subtitle}
            </motion.p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 max-w-5xl mx-auto">
            {/* API Card */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="group relative rounded-2xl overflow-hidden bg-card border border-border hover:border-primary/30 transition-all duration-500 hover:shadow-xl hover:shadow-primary/5"
            >
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

                {/* Mini code preview */}
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
                      <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center mr-3 shrink-0">
                        <svg className="w-3 h-3 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <span className="text-foreground">{feature}</span>
                    </li>
                  ))}
                </ul>
                <Button variant="outline" className="rounded-full border-primary/30 text-primary hover:bg-primary/10 group-hover:border-primary transition-colors" asChild>
                  <a href="/api-docs" className="flex items-center">
                    {t.platforms.api.cta}
                    <ArrowRight2 size="16" color="currentColor" className="ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                  </a>
                </Button>
              </div>
            </motion.div>

            {/* Bulk SMS Card */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.15 }}
              className="group relative rounded-2xl overflow-hidden bg-card border border-border hover:border-primary/30 transition-all duration-500 hover:shadow-xl hover:shadow-primary/5"
            >
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

                {/* Mini dashboard preview */}
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
                      <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center mr-3 shrink-0">
                        <svg className="w-3 h-3 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <span className="text-foreground">{feature}</span>
                    </li>
                  ))}
                </ul>
                <Button className="rounded-full bg-gradient-to-r from-primary to-purple-500 hover:from-purple-500 hover:to-primary text-white transition-all duration-500" asChild>
                  <a href="/compte" className="flex items-center">
                    {t.platforms.bulk.cta}
                    <ArrowRight2 size="16" color="currentColor" className="ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                  </a>
                </Button>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ─── Mobile App Section ───────────────────────────────────────── */}
      <section className="py-20 bg-gradient-to-br from-[#2D1250] via-[#3A1659] to-[#1E0A3C] relative overflow-hidden">
        {/* Decorative */}
        <div className="absolute inset-0 overflow-hidden opacity-10 pointer-events-none">
          <div className="absolute top-10 left-10 transform rotate-12">
            <Mobile size="64" color="currentColor" variant="Bold" className="text-white" />
          </div>
          <div className="absolute bottom-20 right-10 transform -rotate-12">
            <Mobile size="72" color="currentColor" variant="Bold" className="text-white" />
          </div>
        </div>

        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="relative h-[400px] md:h-[500px] order-2 md:order-1"
            >
              <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#2D1250] md:hidden z-10"></div>
              <Image
                src="/phone.png"
                alt="MboaSMS Mobile App"
                fill
                className="object-contain z-0"
              />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="order-1 md:order-2"
            >
              <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/10 text-white/90 text-sm font-medium mb-6">
                <Mobile size="16" color="currentColor" variant="Bold" />
                {t.mobileApp.badge}
              </span>
              <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white leading-tight">
                {t.mobileApp.title}
              </h2>
              <p className="text-white/70 mb-6 text-lg leading-relaxed">
                {t.mobileApp.subtitle}
              </p>

              {/* Features list */}
              <ul className="space-y-3 mb-8">
                {t.mobileApp.features.map((feature, i) => (
                  <motion.li
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.3 + i * 0.1 }}
                    className="flex items-center text-sm text-white/80"
                  >
                    <div className="w-5 h-5 rounded-full bg-white/10 flex items-center justify-center mr-3 shrink-0">
                      <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    {feature}
                  </motion.li>
                ))}
              </ul>

              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <Button variant="default" size="lg" className="rounded-full bg-white hover:bg-white/90 text-[#3A1659] px-6 h-auto py-3 font-medium" asChild>
                  <a href="#" className="flex items-center">
                    {/* Google Play icon */}
                    <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M3.609 1.814L13.792 12 3.61 22.186a.996.996 0 01-.61-.92V2.734a1 1 0 01.609-.92zm10.89 10.893l2.302 2.302-10.937 6.333 8.635-8.635zm3.199-3.199l2.302 2.302a1 1 0 010 1.38l-2.302 2.302L15.396 13l2.302-2.492zM5.864 3.468L16.8 9.8l-2.302 2.302L5.864 3.468z" />
                    </svg>
                    Google Play
                  </a>
                </Button>
                <Button variant="default" size="lg" className="rounded-full bg-gradient-to-r from-purple-500 to-primary hover:from-primary hover:to-purple-500 text-white px-6 h-auto py-3 border-0 font-medium" asChild>
                  <a href="#" className="flex items-center">
                    {/* Apple icon */}
                    <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
                    </svg>
                    App Store
                  </a>
                </Button>
              </div>

              <div className="flex items-center bg-white/10 rounded-xl p-4 backdrop-blur-sm border border-white/5">
                <div className="flex -space-x-2 mr-4">
                  <div className="w-8 h-8 rounded-full border-2 border-[#3A1659] bg-primary"></div>
                  <div className="w-8 h-8 rounded-full border-2 border-[#3A1659] bg-purple-500"></div>
                  <div className="w-8 h-8 rounded-full border-2 border-[#3A1659] bg-amber-500"></div>
                </div>
                <div>
                  <p className="text-white text-sm font-medium">{t.mobileApp.downloads}</p>
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <svg key={i} className="w-3.5 h-3.5 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292z" />
                      </svg>
                    ))}
                    <span className="ml-1.5 text-white text-sm">{t.mobileApp.rating}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ─── Country Pricing Section ──────────────────────────────────── */}
      <section id="pricing" className="py-20 md:py-28 px-6 md:px-12 lg:px-24 relative overflow-hidden bg-background">
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-gradient-to-bl from-primary/10 to-transparent rounded-full filter blur-[80px]"></div>
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-gradient-to-tr from-amber-500/5 to-transparent rounded-full filter blur-[80px]"></div>

        <div className="container mx-auto relative z-10">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={stagger}
            className="text-center mb-12"
          >
            <motion.span variants={fadeUp} className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-6">
              <Global size="16" color="currentColor" variant="Bold" />
              {t.pricing.badge}
            </motion.span>
            <motion.h2 variants={fadeUp} className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              {t.pricing.title}
            </motion.h2>
            <motion.p variants={fadeUp} className="text-muted-foreground text-lg max-w-xl mx-auto">
              {t.pricing.subtitle}
            </motion.p>
          </motion.div>

          {/* Region filters */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex flex-wrap justify-center gap-2 mb-6"
          >
            {(["all", "africa", "europe", "america"] as Region[]).map((region) => {
              const labels = {
                all: t.pricing.regionAll,
                africa: t.pricing.regionAfrica,
                europe: t.pricing.regionEurope,
                america: t.pricing.regionAmerica,
              };
              const regionIcons: Record<Region, string> = { all: "🌍", africa: "🌍", europe: "🇪🇺", america: "🌎" };
              return (
                <button
                  key={region}
                  onClick={() => setRegionFilter(region)}
                  className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                    regionFilter === region
                      ? "bg-primary text-white shadow-md shadow-primary/20"
                      : "bg-card border border-border text-muted-foreground hover:border-primary/30 hover:text-foreground"
                  }`}
                >
                  <span className="text-xs">{regionIcons[region]}</span>
                  {labels[region]}
                </button>
              );
            })}
          </motion.div>

          {/* Country search */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-md mx-auto mb-10"
          >
            <div className="relative">
              <SearchNormal1 size="18" color="currentColor" className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                value={countrySearch}
                onChange={(e) => setCountrySearch(e.target.value)}
                placeholder={t.pricing.searchPlaceholder}
                className="w-full pl-11 pr-4 py-3 rounded-xl bg-card border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all duration-200"
              />
            </div>
          </motion.div>

          {/* Country grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 mb-16">
            <AnimatePresence mode="popLayout">
              {filteredCountries.map((country, i) => (
                <motion.div
                  key={country.code}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3, delay: i * 0.03 }}
                  className={`group relative flex items-center justify-between p-4 rounded-xl bg-card border hover:shadow-md hover:shadow-primary/5 transition-all duration-300 cursor-default ${
                    (country as typeof countryPricing[0] & { popular?: boolean }).popular
                      ? "border-primary/40 ring-1 ring-primary/10"
                      : "border-border hover:border-primary/30"
                  }`}
                >
                  {/* Popular / Cheapest badge */}
                  {(country as typeof countryPricing[0] & { popular?: boolean }).popular && (
                    <span className="absolute -top-2.5 left-3 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider bg-primary text-white rounded-full">
                      {lang === "fr" ? "Populaire" : "Popular"}
                    </span>
                  )}
                  {(country as typeof countryPricing[0] & { cheapest?: boolean }).cheapest && (
                    <span className="absolute -top-2.5 left-3 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider bg-emerald-500 text-white rounded-full">
                      {lang === "fr" ? "Meilleur prix" : "Best price"}
                    </span>
                  )}
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{country.flag}</span>
                    <div>
                      <div className="font-medium text-foreground text-sm">{country.name[lang]}</div>
                      <div className="text-xs text-muted-foreground">{country.code}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-primary text-lg">{country.price}</div>
                    <div className="text-xs text-muted-foreground">{country.currency} {t.pricing.perSms}</div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Plans Section */}
          <div className="mt-8">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={stagger}
              className="text-center mb-10"
            >
              <motion.h3 variants={fadeUp} className="text-2xl md:text-3xl font-bold text-foreground mb-2">
                {t.pricing.planTitle}
              </motion.h3>
              <motion.p variants={fadeUp} className="text-muted-foreground">
                {t.pricing.planSubtitle}
              </motion.p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
              {isLoadingPlans ? (
                Array.from({ length: 3 }).map((_, index) => (
                  <div key={index} className="animate-pulse">
                    <div className="bg-card border border-border rounded-2xl h-80"></div>
                  </div>
                ))
              ) : activePlans.length > 0 ? (
                activePlans.map((plan: PricingPlanType, index: number) => (
                  <motion.div
                    key={plan.id}
                    className="relative rounded-2xl overflow-hidden bg-card border border-border hover:border-primary/30 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5 group"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    <div className="h-1 bg-gradient-to-r from-primary via-purple-500 to-amber-500"></div>
                    <div className="flex flex-col h-full p-6 md:p-8">
                      <div className="mb-6 flex items-center">
                        <div className="w-11 h-11 rounded-xl flex items-center justify-center bg-primary/10 mr-3">
                          <MessageText1 size="22" color="currentColor" variant="Bulk" className="text-primary" />
                        </div>
                        <h3 className="text-lg font-bold text-foreground">
                          {lang === "fr" ? plan.planNameFr : plan.planNameEn}
                        </h3>
                      </div>

                      <div className="mb-6">
                        <div className="flex items-baseline">
                          <span className="text-4xl font-bold text-primary">{plan.smsUnitPrice}</span>
                          <span className="ml-2 text-muted-foreground text-sm">FCFA {t.pricing.perSms}</span>
                        </div>
                      </div>

                      <ul className="space-y-3 mb-8 flex-grow">
                        <li className="flex items-center text-sm">
                          <Chart2 size="16" color="currentColor" variant="Bulk" className="text-primary mr-2.5 shrink-0" />
                          <span className="text-foreground">{plan.minSMS} - {plan.maxSMS} SMS</span>
                        </li>
                        <li className="flex items-center text-sm">
                          <Clock size="16" color="currentColor" variant="Bulk" className="text-primary mr-2.5 shrink-0" />
                          <span className="text-foreground">{plan.nbDaysToExpired} {t.pricing.validDays}</span>
                        </li>
                        <li className="flex items-center text-sm">
                          <ShieldTick size="16" color="currentColor" variant="Bulk" className="text-primary mr-2.5 shrink-0" />
                          <span className="text-foreground">
                            {lang === "fr" ? plan.descriptionFr : plan.descriptionEn}
                          </span>
                        </li>
                      </ul>

                      <Button className="w-full rounded-xl bg-gradient-to-r from-primary to-purple-500 hover:from-purple-500 hover:to-primary text-white transition-all duration-500">
                        <span className="flex items-center justify-center">
                          {t.pricing.choosePlan}
                          <ArrowRight2 size="16" color="currentColor" className="ml-2" />
                        </span>
                      </Button>
                    </div>
                  </motion.div>
                ))
              ) : (
                <div className="col-span-full text-center py-12">
                  <p className="text-muted-foreground">{t.pricing.noPlan}</p>
                </div>
              )}
            </div>

            {/* Custom solution CTA */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mt-12 text-center"
            >
              <p className="text-muted-foreground mb-4">{t.pricing.customSolution}</p>
              <Button
                variant="outline"
                className="rounded-full border-border hover:border-primary/50 hover:bg-primary/5"
                onClick={() => setScheduleCallOpen(true)}
              >
                <span className="flex items-center">
                  {t.pricing.contactSales}
                  <ArrowRight2 size="16" color="currentColor" className="ml-2" />
                </span>
              </Button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ─── CTA Section ──────────────────────────────────────────────── */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary via-purple-600 to-[#3A1659]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(255,255,255,0.1),transparent_60%)]"></div>

        <div className="container mx-auto px-6 relative z-10 text-center">
          {/* Trust stats bar */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="flex flex-wrap justify-center gap-6 md:gap-10 mb-10"
          >
            {[
              { v: "2,500+", l: lang === "fr" ? "Entreprises" : "Businesses" },
              { v: "10M+", l: lang === "fr" ? "SMS / mois" : "SMS / month" },
              { v: "50+", l: lang === "fr" ? "Pays" : "Countries" },
            ].map((s, i) => (
              <div key={i} className="text-center">
                <div className="text-2xl md:text-3xl font-bold text-white">{s.v}</div>
                <div className="text-xs text-white/60 uppercase tracking-wider">{s.l}</div>
              </div>
            ))}
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 text-white max-w-3xl mx-auto leading-tight"
          >
            {t.cta.title}
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-lg text-white/80 mb-10 max-w-2xl mx-auto"
          >
            {t.cta.subtitle}
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Button
              size="lg"
              className="rounded-full bg-white hover:bg-white/90 text-primary font-medium px-8 h-12"
              asChild
            >
              <a href="/compte" className="flex items-center justify-center">
                {t.cta.primary}
                <ArrowRight2 size="18" color="currentColor" className="ml-2" />
              </a>
            </Button>
            <Button
              onClick={() => setScheduleCallOpen(true)}
              variant="outline"
              size="lg"
              className="rounded-full border-white/30 text-white hover:bg-white/10 font-medium px-8 h-12"
            >
              <span className="flex items-center">
                {t.cta.secondary}
                <ArrowRight2 size="18" color="currentColor" className="ml-2" />
              </span>
            </Button>
          </motion.div>
        </div>
      </section>

      {/* ─── Contact Section ──────────────────────────────────────────── */}
      <section className="py-20 px-6 md:px-12 lg:px-24">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="relative max-w-4xl mx-auto"
          >
            <div className="absolute -top-4 -right-4 w-24 h-24 bg-gradient-to-br from-primary/20 to-purple-500/10 rounded-full filter blur-xl"></div>
            <div className="absolute -bottom-4 -left-4 w-24 h-24 bg-gradient-to-tr from-amber-500/10 to-primary/20 rounded-full filter blur-xl"></div>

            <div className="relative bg-card border border-border rounded-2xl p-8 md:p-12">
              <div className="h-1 absolute top-0 left-0 right-0 bg-gradient-to-r from-primary via-purple-500 to-amber-500 rounded-t-2xl"></div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                {/* Left: Text + CTA */}
                <div className="text-center md:text-left">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mx-auto md:mx-0 mb-6">
                    <Sms size="24" color="currentColor" variant="Bulk" className="text-primary" />
                  </div>

                  <h3 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
                    {t.contact.title}
                  </h3>
                  <p className="text-muted-foreground mb-8 max-w-lg">
                    {t.contact.subtitle}
                  </p>

                  <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                    <Button
                      onClick={() => setScheduleCallOpen(true)}
                      className="rounded-full bg-gradient-to-r from-primary to-purple-500 hover:from-purple-500 hover:to-primary text-white px-6 transition-all duration-500"
                    >
                      <span className="flex items-center">
                        {t.contact.schedule}
                        <svg className="w-4 h-4 ml-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                          <line x1="16" y1="2" x2="16" y2="6" />
                          <line x1="8" y1="2" x2="8" y2="6" />
                          <line x1="3" y1="10" x2="21" y2="10" />
                        </svg>
                      </span>
                    </Button>
                  </div>
                </div>

                {/* Right: Direct contact info */}
                <div className="flex flex-col gap-4">
                  <a
                    href={`mailto:${t.contact.email}`}
                    className="flex items-center gap-4 p-4 rounded-xl bg-background/80 border border-border hover:border-primary/30 transition-all duration-300 group"
                  >
                    <div className="w-11 h-11 rounded-xl bg-primary/10 group-hover:bg-primary/20 flex items-center justify-center shrink-0 transition-colors">
                      <DirectSend size="20" color="currentColor" variant="Bold" className="text-primary" />
                    </div>
                    <div>
                      <div className="text-xs text-muted-foreground font-medium uppercase tracking-wider">{t.contact.emailLabel}</div>
                      <div className="text-foreground font-medium">{t.contact.email}</div>
                    </div>
                  </a>

                  <a
                    href={`https://wa.me/${t.contact.whatsapp.replace(/\s/g, "").replace("+", "")}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-4 p-4 rounded-xl bg-background/80 border border-border hover:border-emerald-500/30 transition-all duration-300 group"
                  >
                    <div className="w-11 h-11 rounded-xl bg-emerald-500/10 group-hover:bg-emerald-500/20 flex items-center justify-center shrink-0 transition-colors">
                      <Whatsapp size="20" color="currentColor" variant="Bold" className="text-emerald-500" />
                    </div>
                    <div>
                      <div className="text-xs text-muted-foreground font-medium uppercase tracking-wider">{t.contact.whatsappLabel}</div>
                      <div className="text-foreground font-medium">{t.contact.whatsapp}</div>
                    </div>
                  </a>

                  <a
                    href={`tel:${t.contact.phone.replace(/\s/g, "")}`}
                    className="flex items-center gap-4 p-4 rounded-xl bg-background/80 border border-border hover:border-primary/30 transition-all duration-300 group"
                  >
                    <div className="w-11 h-11 rounded-xl bg-primary/10 group-hover:bg-primary/20 flex items-center justify-center shrink-0 transition-colors">
                      <Call size="20" color="currentColor" variant="Bold" className="text-primary" />
                    </div>
                    <div>
                      <div className="text-xs text-muted-foreground font-medium uppercase tracking-wider">{t.contact.phoneLabel}</div>
                      <div className="text-foreground font-medium">{t.contact.phone}</div>
                    </div>
                  </a>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />

      <ScheduleCallModal
        isOpen={scheduleCallOpen}
        onClose={() => setScheduleCallOpen(false)}
      />
    </div>
  );
}
