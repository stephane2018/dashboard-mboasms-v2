"use client";

import Link from 'next/link';
import Image from 'next/image';
import { Global, Sms, Code1 } from 'iconsax-react';
import { useT } from "@/core/hooks";

const Footer = () => {
  const { t } = useT();

  return (
    <footer className="bg-card border-t border-border py-16 px-6 md:px-12 lg:px-24">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div>
            <div className="mb-4">
              <Image
                src="/icones/logo.svg"
                alt="MboaSMS Logo"
                width={120}
                height={40}
                className="h-10 w-auto"
              />
            </div>
            <p className="text-muted-foreground mb-4 leading-relaxed">
              {t('landing.footer.tagline')}
            </p>
            <div className="flex items-center gap-2 mb-4">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-medium">
                <Global size="12" color="currentColor" variant="Bold" />
                {t('landing.footer.countriesCount')}
              </div>
            </div>
            <div className="flex space-x-4">
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                </svg>
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                </svg>
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                </svg>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-semibold text-foreground mb-4 uppercase tracking-wider">{t('landing.footer.navTitle')}</h3>
            <ul className="space-y-2.5">
              <li>
                <Link href="/" className="text-muted-foreground hover:text-primary transition-colors text-sm">
                  {t('landing.footer.navHome')}
                </Link>
              </li>
              <li>
                <Link href="/#pricing" className="text-muted-foreground hover:text-primary transition-colors text-sm">
                  {t('landing.footer.navPricing')}
                </Link>
              </li>
              <li>
                <Link href="/api-docs" className="text-muted-foreground hover:text-primary transition-colors text-sm">
                  {t('landing.footer.navApiDocs')}
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-muted-foreground hover:text-primary transition-colors text-sm">
                  {t('landing.footer.navContact')}
                </Link>
              </li>
              <li>
                <Link href="#" className="text-muted-foreground hover:text-primary transition-colors text-sm">
                  {t('landing.footer.navTerms')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-sm font-semibold text-foreground mb-4 uppercase tracking-wider">{t('landing.footer.servicesTitle')}</h3>
            <ul className="space-y-2.5">
              <li>
                <Link href="/compte" className="text-muted-foreground hover:text-primary transition-colors text-sm inline-flex items-center gap-1.5">
                  <Sms size="14" color="currentColor" />
                  {t('landing.footer.serviceSmsMarketing')}
                </Link>
              </li>
              <li>
                <Link href="/api-docs" className="text-muted-foreground hover:text-primary transition-colors text-sm inline-flex items-center gap-1.5">
                  <Code1 size="14" color="currentColor" />
                  {t('landing.footer.serviceApiSms')}
                </Link>
              </li>
              <li>
                <Link href="/compte" className="text-muted-foreground hover:text-primary transition-colors text-sm">
                  {t('landing.footer.serviceCampaigns')}
                </Link>
              </li>
              <li>
                <Link href="/#pricing" className="text-muted-foreground hover:text-primary transition-colors text-sm">
                  {t('landing.footer.servicePackages')}
                </Link>
              </li>
            </ul>

            {/* Covered regions */}
            <div className="mt-6">
              <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">{t('landing.footer.coverageTitle')}</h4>
              <div className="flex flex-wrap gap-1">
                {["🇨🇲", "🇸🇳", "🇨🇮", "🇳🇬", "🇬🇭", "🇿🇦", "🇫🇷", "🇺🇸", "🇬🇧", "🇧🇪", "🇨🇦", "🇲🇦"].map((flag, i) => (
                  <span key={i} className="text-sm" title="Pays couvert">{flag}</span>
                ))}
                <span className="text-xs text-muted-foreground ml-1">+40</span>
              </div>
            </div>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-sm font-semibold text-foreground mb-4 uppercase tracking-wider">{t('landing.footer.contactTitle')}</h3>
            <ul className="space-y-3">
              <li className="flex items-start">
                <svg className="w-4 h-4 text-primary mr-2.5 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span className="text-muted-foreground text-sm">{t('landing.footer.contactLocation')}</span>
              </li>
              <li className="flex items-start">
                <svg className="w-4 h-4 text-primary mr-2.5 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <a href="mailto:support@mboasms.com" className="text-muted-foreground hover:text-primary transition-colors text-sm">
                  support@mboasms.com
                </a>
              </li>
              <li className="flex items-start">
                <svg className="w-4 h-4 text-green-500 mr-2.5 mt-0.5 shrink-0" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
                  <path d="M12 0C5.373 0 0 5.373 0 12c0 2.127.558 4.126 1.535 5.859L.057 23.25a.75.75 0 00.916.916l5.403-1.476A11.953 11.953 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.9 0-3.68-.523-5.207-1.435l-.371-.223-3.853 1.053 1.028-3.76-.242-.386A9.96 9.96 0 012 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"/>
                </svg>
                <a href="https://wa.me/237697193064" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors text-sm">
                  +237 697 193 064 <span className="text-xs text-green-500">(WhatsApp)</span>
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border mt-12 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} MboaSMS. {t('landing.footer.copyright')}
          </p>
          <div className="flex items-center gap-6 text-sm text-muted-foreground">
            <Link href="#" className="hover:text-primary transition-colors">{t('landing.footer.privacyPolicy')}</Link>
            <Link href="#" className="hover:text-primary transition-colors">{t('landing.footer.cgu')}</Link>
            <Link href="#" className="hover:text-primary transition-colors">{t('landing.footer.legalNotice')}</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
