"use client"

import { useState, useEffect, lazy, Suspense } from "react";
import dynamic from 'next/dynamic';

const Header = dynamic(() => import("@/shared/landing_components/components/layout/Header"), {
  ssr: false,
  loading: () => <div className="h-20 bg-background animate-pulse" />
});
const Footer = dynamic(() => import("@/shared/landing_components/components/layout/Footer"), {
  ssr: false,
  loading: () => <div className="h-96 bg-background animate-pulse" />
});
import { landingContent } from "@/shared/landing_components/i18n/landing-content";
import { useLanguageStore } from "@/core/stores/languageStore";
import { HeroSection } from "@/shared/landing_components/components/sections/HeroSection";
import { StatsBar } from "@/shared/landing_components/components/sections/StatsBar";
import { PlatformsSection } from "@/shared/landing_components/components/sections/PlatformsSection";
import { MobileAppSection } from "@/shared/landing_components/components/sections/MobileAppSection";
import { PricingSection } from "@/shared/landing_components/components/sections/PricingSection";
import { CtaSection } from "@/shared/landing_components/components/sections/CtaSection";
import { ContactSection } from "@/shared/landing_components/components/sections/ContactSection";
import { WelcomeModal } from "@/shared/common/welcome-modal";
import { CookieConsent } from "@/shared/common/cookie-consent";

const ServicePresentation = lazy(() => import("@/shared/landing_components/components/sections/ServicePresentation"));
const Testimonials = lazy(() => import("@/shared/landing_components/components/sections/Testimonials"));
const CollaboratorLogos = lazy(() => import("@/shared/landing_components/components/sections/CollaboratorLogos"));
const ScheduleCallModal = lazy(() => import("@/shared/landing_components/components/ScheduleCallModal"));

function SectionFallback() {
  return <div className="py-20 flex items-center justify-center"><div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin"></div></div>;
}

export default function Home() {
  const [scheduleCallOpen, setScheduleCallOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { lang } = useLanguageStore();

  // Use 'fr' on the first client render to match SSR output, then switch to stored lang
  const t = landingContent[mounted ? lang : 'fr'];

  // Mark as mounted after hydration so the real language takes effect
  useEffect(() => { setMounted(true); }, []);

  return (
    <div className="min-h-screen bg-background pt-20 noise-overlay relative">
      <Header />

      <HeroSection t={t} />

      <StatsBar t={t} />

      <Suspense fallback={<SectionFallback />}>
        <ServicePresentation />
      </Suspense>

      <Suspense fallback={<SectionFallback />}>
        <Testimonials />
      </Suspense>

      <Suspense fallback={<SectionFallback />}>
        <CollaboratorLogos />
      </Suspense>

      <PlatformsSection t={t} lang={lang} />

      <MobileAppSection t={t} lang={lang} />

      <PricingSection t={t} lang={lang} onContactSales={() => setScheduleCallOpen(true)} />

      <CtaSection t={t} lang={lang} onContactClick={() => setScheduleCallOpen(true)} />

      <ContactSection t={t} onScheduleCall={() => setScheduleCallOpen(true)} />

      <Footer />

      <WelcomeModal />
      <CookieConsent />

      {scheduleCallOpen && (
        <Suspense fallback={null}>
          <ScheduleCallModal isOpen={scheduleCallOpen} onClose={() => setScheduleCallOpen(false)} />
        </Suspense>
      )}
    </div>
  );
}
