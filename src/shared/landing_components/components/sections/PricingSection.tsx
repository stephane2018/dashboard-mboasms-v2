"use client"

import { useState, useMemo, useCallback } from "react";
import { Button } from "@/shared/ui/button";
import Link from "next/link";
import { ArrowRight2, Global, MessageText1, Chart2, Clock, ShieldTick, Wallet } from "iconsax-react";
import { usePricing } from "@/core/hooks/usePricing";
import { useSmsCountryPrices } from "@/core/hooks/useSmsCountryPrices";
import { useAuthContext } from "@/core/providers/auth-provider";
import { useUserStore } from "@/core/stores/userStore";
import { createRecharge, createInternationalRecharge } from "@/core/services/recharge.service";
import { LoginModal } from "@/shared/common/login-modal";
import { CreateRechargeModal, type RechargeFormData } from "@/shared/common/create-recharge-modal";
import { InternationalRechargeModal, type InternationalRechargeFormData } from "@/shared/common/international-recharge-modal";
import { toast } from "sonner";
import type { PricingPlanType } from "@/core/models/pricing";
import type { SmsCountryPriceType } from "@/core/models/sms-country-price";
import type { landingContent, Lang } from "../../i18n/landing-content";

function countryCodeToFlag(code: string): string {
  const codePoints = code
    .toUpperCase()
    .split("")
    .map((c) => 0x1f1e6 + c.charCodeAt(0) - 65);
  return String.fromCodePoint(...codePoints);
}

// Popular country codes — Cameroon first, then francophone Africa, then international francophone + others
const POPULAR_AFRICA = ["CM", "SN", "CI", "GA", "CD", "ML", "BF", "TG", "BJ", "GN"];
const POPULAR_INTERNATIONAL = ["FR", "BE", "CH", "CA", "US", "GB", "LU", "MC", "DE", "MA"];

export function PricingSection({ t, lang, onContactSales }: { t: typeof landingContent.fr; lang: Lang; onContactSales: () => void }) {
  const { isConnected } = useAuthContext();
  const user = useUserStore((state) => state.user);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isRechargeOpen, setIsRechargeOpen] = useState(false);
  const [isIntlRechargeOpen, setIsIntlRechargeOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isIntlSubmitting, setIsIntlSubmitting] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState<{ countryName: string; countryCode: string; pricePerSms: number } | null>(null);
  const [pendingAction, setPendingAction] = useState<(() => void) | null>(null);
  const { activePlansQuery } = usePricing();
  const { pricesQuery: countryPricesQuery } = useSmsCountryPrices({ size: 300 });

  const activePlans = activePlansQuery.data || [];
  const isLoadingPlans = activePlansQuery.isLoading;
  const rawPrices = countryPricesQuery.data as any;
  const allCountryPrices: SmsCountryPriceType[] = Array.isArray(rawPrices) ? rawPrices : rawPrices?.content ?? [];
  const isLoadingCountries = countryPricesQuery.isLoading;
  const totalCountries = rawPrices?.totalElements ?? allCountryPrices.length;

  // Popular countries picked from API data
  const { popularAfrica, popularInternational } = useMemo(() => {
    const findByCode = (code: string) => allCountryPrices.find((c) => c.countryCode === code);
    return {
      popularAfrica: (POPULAR_AFRICA.map(findByCode).filter(Boolean) as SmsCountryPriceType[]).slice(0, 5),
      popularInternational: (POPULAR_INTERNATIONAL.map(findByCode).filter(Boolean) as SmsCountryPriceType[]).slice(0, 5),
    };
  }, [allCountryPrices]);

  const requireAuth = useCallback((action: () => void) => {
    if (!isConnected) {
      setPendingAction(() => action);
      setIsLoginOpen(true);
      return;
    }
    action();
  }, [isConnected]);

  const handleLoginSuccess = useCallback(() => {
    if (pendingAction) {
      pendingAction();
      setPendingAction(null);
    }
  }, [pendingAction]);

  const handleCountryRecharge = (country: SmsCountryPriceType) => {
    requireAuth(() => {
      setSelectedCountry({
        countryName: country.countryName,
        countryCode: country.countryCode,
        pricePerSms: country.pricePerSms,
      });
      setIsIntlRechargeOpen(true);
    });
  };

  const handleIntlRechargeSubmit = async (data: InternationalRechargeFormData) => {
    if (!user?.companyId) {
      toast.error("Erreur", { description: "ID entreprise manquant." });
      return;
    }

    setIsIntlSubmitting(true);
    try {
      await createInternationalRecharge({
        qteMessage: data.qteMessage,
        amount: data.amount,
        enterpriseId: user.companyId,
        paymentMethod: data.paymentMethod,
        debitPhoneNumber: data.debitPhoneNumber,
        debitBankAccountNumber: data.debitBankAccountNumber,
        couponCode: data.couponCode,
      });
      toast.success("Recharge internationale créée", {
        description: "Votre demande de recharge a été créée avec succès.",
      });
    } catch (error: any) {
      toast.error("Erreur", {
        description: error?.message || "Une erreur s'est produite.",
      });
      throw error;
    } finally {
      setIsIntlSubmitting(false);
    }
  };

  const handleChoosePlan = () => {
    requireAuth(() => {
      setIsRechargeOpen(true);
    });
  };

  const handleRechargeSubmit = async (data: RechargeFormData) => {
    if (!user?.companyId) {
      toast.error("Erreur", { description: "ID entreprise manquant." });
      return;
    }

    setIsSubmitting(true);
    try {
      await createRecharge({
        qteMessage: data.qteMessage,
        enterpriseId: user.companyId,
        paymentMethod: data.paymentMethod,
        debitPhoneNumber: data.debitPhoneNumber,
        debitBankAccountNumber: data.debitBankAccountNumber,
        couponCode: data.couponCode,
      });
      toast.success("Recharge créée", {
        description: "Votre demande de recharge a été créée avec succès.",
      });
    } catch (error: any) {
      toast.error("Erreur", {
        description: error?.message || "Une erreur s'est produite.",
      });
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="pricing" className="py-20 md:py-28 px-6 md:px-12 lg:px-24 relative overflow-hidden bg-background">
      <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-gradient-to-bl from-primary/10 to-transparent rounded-full filter blur-[80px]"></div>
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-gradient-to-tr from-amber-500/5 to-transparent rounded-full filter blur-[80px]"></div>

      <div className="container mx-auto relative z-10">
        <div className="text-center mb-12 animate-fade-in-up">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-6">
            <Global size="16" color="currentColor" variant="Bold" />
            {t.pricing.badge}
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">{t.pricing.title}</h2>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto">{t.pricing.subtitle}</p>
        </div>

        {/* Popular countries */}
        {isLoadingCountries ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mb-12">
            {Array.from({ length: 10 }).map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-card border border-border rounded-xl h-28"></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-10 mb-12">
            {/* Africa */}
            {popularAfrica.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center justify-center gap-2">
                  🌍 {lang === "fr" ? "Afrique" : "Africa"}
                </h3>
                <div className="flex flex-wrap justify-center gap-3">
                  {popularAfrica.map((country) => (
                    <div
                      key={country.id}
                      className="group relative flex flex-col items-center gap-2 p-4 rounded-xl bg-card border border-border hover:border-primary/30 hover:shadow-md hover:shadow-primary/5 transition-all duration-300 w-[calc(50%-6px)] sm:w-[calc(33.333%-8px)] lg:w-[calc(20%-10px)]"
                    >
                      {country.countryCode === "CM" && (
                        <span className="absolute -top-2 -right-2 text-[10px] font-bold bg-primary text-white px-2 py-0.5 rounded-full shadow-sm">
                          {lang === "fr" ? "Populaire" : "Popular"}
                        </span>
                      )}
                      <span className="text-3xl">{countryCodeToFlag(country.countryCode)}</span>
                      <div className="text-center">
                        <div className="font-medium text-foreground text-sm">{country.countryName}</div>
                        <div className="font-bold text-primary text-lg leading-tight">{country.pricePerSms} <span className="text-xs font-normal text-muted-foreground">FCFA</span></div>
                      </div>
                      <button
                        onClick={() => handleCountryRecharge(country)}
                        className="mt-1 w-full flex items-center justify-center gap-1.5 text-xs font-medium py-1.5 px-3 rounded-lg bg-primary/10 text-primary hover:bg-primary hover:text-white transition-all duration-200"
                      >
                        <Wallet size="12" color="currentColor" />
                        {lang === "fr" ? "Recharger" : "Top up"}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* International */}
            {popularInternational.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center justify-center gap-2">
                  ✈️ {lang === "fr" ? "International" : "International"}
                </h3>
                <div className="flex flex-wrap justify-center gap-3">
                  {popularInternational.map((country) => (
                    <div
                      key={country.id}
                      className="relative group flex flex-col items-center gap-2 p-4 rounded-xl bg-card border border-border hover:border-primary/30 hover:shadow-md hover:shadow-primary/5 transition-all duration-300 w-[calc(50%-6px)] sm:w-[calc(33.333%-8px)] lg:w-[calc(20%-10px)]"
                    >
                      {country.countryCode === "FR" && (
                        <span className="absolute -top-2 -right-2 text-[10px] font-bold bg-primary text-white px-2 py-0.5 rounded-full shadow-sm">
                          {lang === "fr" ? "Populaire" : "Popular"}
                        </span>
                      )}
                      <span className="text-3xl">{countryCodeToFlag(country.countryCode)}</span>
                      <div className="text-center">
                        <div className="font-medium text-foreground text-sm">{country.countryName}</div>
                        <div className="font-bold text-primary text-lg leading-tight">{country.pricePerSms} <span className="text-xs font-normal text-muted-foreground">FCFA</span></div>
                      </div>
                      <button
                        onClick={() => handleCountryRecharge(country)}
                        className="mt-1 w-full flex items-center justify-center gap-1.5 text-xs font-medium py-1.5 px-3 rounded-lg bg-primary/10 text-primary hover:bg-primary hover:text-white transition-all duration-200"
                      >
                        <Wallet size="12" color="currentColor" />
                        {lang === "fr" ? "Recharger" : "Top up"}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* See all countries button */}
        <div className="text-center mb-16">
          <Button className="rounded-xl bg-primary text-white font-semibold shadow-md shadow-primary/25 hover:shadow-lg hover:shadow-primary/30 hover:scale-[1.03] active:scale-[0.98] transition-all duration-200 px-8 py-3 text-base" asChild>
            <Link href="/sms-pricing" className="flex items-center gap-2">
              <Global size="18" color="currentColor" />
              {lang === "fr" ? `Voir tous les ${totalCountries} pays` : `View all ${totalCountries} countries`}
              <ArrowRight2 size="16" color="currentColor" />
            </Link>
          </Button>
        </div>

        {/* Plans Section */}
        <div className="mt-8">
          <div className="text-center mb-10 animate-fade-in-up">
            <h3 className="text-2xl md:text-3xl font-bold text-foreground mb-2">{t.pricing.planTitle}</h3>
            <p className="text-muted-foreground">{t.pricing.planSubtitle}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {isLoadingPlans ? (
              Array.from({ length: 3 }).map((_, index) => (
                <div key={index} className="animate-pulse">
                  <div className="bg-card border border-border rounded-2xl h-80"></div>
                </div>
              ))
            ) : activePlans.length > 0 ? (
              activePlans.map((plan: PricingPlanType, index: number) => {
                const isPremium = plan.planNameFr?.toLowerCase().includes("premium") || plan.planNameEn?.toLowerCase().includes("premium") || plan.planCode?.toLowerCase().includes("premium");
                return (
                <div
                  key={plan.id}
                  className={`relative rounded-2xl overflow-hidden bg-card border transition-all duration-300 hover:shadow-lg hover:shadow-primary/5 group animate-fade-in-up ${isPremium ? "border-primary/50 shadow-lg shadow-primary/10 scale-[1.02]" : "border-border hover:border-primary/30"}`}
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  {isPremium && (
                    <div className="absolute top-4 right-4 z-10">
                      <span className="text-[11px] font-bold bg-primary text-white px-3 py-1 rounded-full shadow-md">
                        {lang === "fr" ? "Le plus populaire" : "Most popular"}
                      </span>
                    </div>
                  )}
                  <div className={`h-1 bg-gradient-to-r ${isPremium ? "from-primary via-purple-500 to-amber-500 h-1.5" : "from-primary via-purple-500 to-amber-500"}`}></div>
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
                        <span className="text-foreground">{lang === "fr" ? plan.descriptionFr : plan.descriptionEn}</span>
                      </li>
                    </ul>
                    <Button onClick={handleChoosePlan} className="w-full rounded-xl bg-primary text-white font-semibold shadow-md shadow-primary/25 hover:shadow-lg hover:shadow-primary/30 hover:scale-[1.03] active:scale-[0.98] transition-all duration-200">
                      <span className="flex items-center justify-center">
                        {t.pricing.choosePlan}
                        <ArrowRight2 size="16" color="currentColor" className="ml-2" />
                      </span>
                    </Button>
                  </div>
                </div>
                )})
            ) : (
              <div className="col-span-full text-center py-12">
                <p className="text-muted-foreground">{t.pricing.noPlan}</p>
              </div>
            )}
          </div>

          <div className="mt-12 text-center animate-fade-in-up">
            <p className="text-muted-foreground mb-4">{t.pricing.customSolution}</p>
            <Button variant="outline" className="rounded-xl border-border hover:border-primary/40 hover:bg-primary/5 font-semibold active:scale-[0.98] transition-all duration-200" onClick={onContactSales}>
              <span className="flex items-center">
                {t.pricing.contactSales}
                <ArrowRight2 size="16" color="currentColor" className="ml-2" />
              </span>
            </Button>
          </div>
        </div>
      </div>

      {/* Login Modal */}
      <LoginModal
        isOpen={isLoginOpen}
        onClose={() => {
          setIsLoginOpen(false);
          setPendingAction(null);
        }}
        onSuccess={handleLoginSuccess}
      />

      {/* Recharge Modal */}
      <CreateRechargeModal
        isOpen={isRechargeOpen}
        onClose={() => setIsRechargeOpen(false)}
        onSubmit={handleRechargeSubmit}
        isLoading={isSubmitting}
      />

      {/* International Recharge Modal */}
      <InternationalRechargeModal
        isOpen={isIntlRechargeOpen}
        onClose={() => {
          setIsIntlRechargeOpen(false);
          setSelectedCountry(null);
        }}
        onSubmit={handleIntlRechargeSubmit}
        isLoading={isIntlSubmitting}
        selectedCountry={selectedCountry}
      />
    </section>
  );
}
