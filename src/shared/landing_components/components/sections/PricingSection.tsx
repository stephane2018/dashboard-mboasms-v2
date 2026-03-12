"use client"

import { useState, useMemo } from "react";
import { Button } from "@/shared/ui/button";
import Link from "next/link";
import { ArrowRight2, Global, SearchNormal1, MessageText1, Chart2, Clock, ShieldTick } from "iconsax-react";
import { usePricing } from "@/core/hooks/usePricing";
import { useSmsCountryPrices } from "@/core/hooks/useSmsCountryPrices";
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

export function PricingSection({ t, lang, onContactSales }: { t: typeof landingContent.fr; lang: Lang; onContactSales: () => void }) {
  const [countrySearch, setCountrySearch] = useState("");
  const { activePlansQuery } = usePricing();
  const { pricesQuery: countryPricesQuery } = useSmsCountryPrices();

  const activePlans = activePlansQuery.data || [];
  const isLoadingPlans = activePlansQuery.isLoading;
  const rawPrices = countryPricesQuery.data as any;
  const allCountryPrices: SmsCountryPriceType[] = Array.isArray(rawPrices) ? rawPrices : rawPrices?.content ?? [];
  const isLoadingCountries = countryPricesQuery.isLoading;
  const totalCountries = rawPrices?.totalElements ?? allCountryPrices.length;

  const filteredCountries: SmsCountryPriceType[] = useMemo(() => {
    if (!countrySearch) return allCountryPrices.slice(0, 12);
    const search = countrySearch.toLowerCase();
    return allCountryPrices.filter(
      (c: SmsCountryPriceType) =>
        c.countryName.toLowerCase().includes(search) ||
        c.countryCode.toLowerCase().includes(search)
    );
  }, [countrySearch, allCountryPrices]);

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

        {/* Country search */}
        <div className="max-w-md mx-auto mb-10">
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
        </div>

        {/* Country grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 mb-8">
          {isLoadingCountries ? (
            Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-card border border-border rounded-xl h-20"></div>
              </div>
            ))
          ) : filteredCountries.length > 0 ? (
            filteredCountries.map((country) => (
              <div
                key={country.id}
                className="group flex items-center justify-between p-4 rounded-xl bg-card border border-border hover:border-primary/30 hover:shadow-md hover:shadow-primary/5 transition-all duration-300 cursor-default"
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{countryCodeToFlag(country.countryCode)}</span>
                  <div>
                    <div className="font-medium text-foreground text-sm">{country.countryName}</div>
                    <div className="text-xs text-muted-foreground">{country.countryCode}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-primary text-lg">{country.pricePerSms}</div>
                  <div className="text-xs text-muted-foreground">{t.pricing.perSms}</div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-8">
              <p className="text-muted-foreground">{lang === "fr" ? "Aucun pays trouv\u00e9" : "No country found"}</p>
            </div>
          )}
        </div>

        {/* See all countries button */}
        {totalCountries > 12 && (
          <div className="text-center mb-16">
            <Button variant="outline" className="rounded-xl border-border hover:border-primary/40 hover:bg-primary/5 font-semibold active:scale-[0.98] transition-all duration-200" asChild>
              <Link href="/sms-pricing" className="flex items-center">
                {lang === "fr" ? `Voir tous les pays (${totalCountries})` : `View all countries (${totalCountries})`}
                <ArrowRight2 size="16" color="currentColor" className="ml-2" />
              </Link>
            </Button>
          </div>
        )}

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
              activePlans.map((plan: PricingPlanType, index: number) => (
                <div
                  key={plan.id}
                  className="relative rounded-2xl overflow-hidden bg-card border border-border hover:border-primary/30 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5 group animate-fade-in-up"
                  style={{ animationDelay: `${index * 100}ms` }}
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
                        <span className="text-foreground">{lang === "fr" ? plan.descriptionFr : plan.descriptionEn}</span>
                      </li>
                    </ul>
                    <Button className="w-full rounded-xl bg-primary text-white font-semibold shadow-md shadow-primary/25 hover:shadow-lg hover:shadow-primary/30 hover:scale-[1.03] active:scale-[0.98] transition-all duration-200">
                      <span className="flex items-center justify-center">
                        {t.pricing.choosePlan}
                        <ArrowRight2 size="16" color="currentColor" className="ml-2" />
                      </span>
                    </Button>
                  </div>
                </div>
              ))
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
    </section>
  );
}
