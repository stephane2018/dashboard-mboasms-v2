"use client"

import { Button } from "@/shared/ui/button";
import { Sms, DirectSend, Whatsapp, Call } from "iconsax-react";
import type { landingContent } from "../../i18n/landing-content";

export function ContactSection({ t, onScheduleCall }: { t: typeof landingContent.fr; onScheduleCall: () => void }) {
  return (
    <section className="py-20 px-6 md:px-12 lg:px-24">
      <div className="container mx-auto">
        <div className="relative max-w-4xl mx-auto animate-fade-in-up">
          <div className="absolute -top-4 -right-4 w-24 h-24 bg-gradient-to-br from-primary/20 to-purple-500/10 rounded-full filter blur-xl"></div>
          <div className="absolute -bottom-4 -left-4 w-24 h-24 bg-gradient-to-tr from-amber-500/10 to-primary/20 rounded-full filter blur-xl"></div>

          <div className="relative bg-card border border-border rounded-2xl p-8 md:p-12">
            <div className="h-1 absolute top-0 left-0 right-0 bg-gradient-to-r from-primary via-purple-500 to-amber-500 rounded-t-2xl"></div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <div className="text-center md:text-left">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mx-auto md:mx-0 mb-6">
                  <Sms size="24" color="currentColor" variant="Bulk" className="text-primary" />
                </div>
                <h3 className="text-2xl md:text-3xl font-bold text-foreground mb-4">{t.contact.title}</h3>
                <p className="text-muted-foreground mb-8 max-w-lg">{t.contact.subtitle}</p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                  <Button onClick={onScheduleCall} className="rounded-xl bg-primary text-white font-semibold px-6 shadow-md shadow-primary/25 hover:shadow-lg hover:shadow-primary/30 hover:scale-[1.03] active:scale-[0.98] transition-all duration-200">
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

              <div className="flex flex-col gap-4">
                <a href={`mailto:${t.contact.email}`} className="flex items-center gap-4 p-4 rounded-xl bg-background/80 border border-border hover:border-primary/30 transition-all duration-300 group">
                  <div className="w-11 h-11 rounded-xl bg-primary/10 group-hover:bg-primary/20 flex items-center justify-center shrink-0 transition-colors">
                    <DirectSend size="20" color="currentColor" variant="Bold" className="text-primary" />
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground font-medium uppercase tracking-wider">{t.contact.emailLabel}</div>
                    <div className="text-foreground font-medium">{t.contact.email}</div>
                  </div>
                </a>
                <a href={`https://wa.me/${t.contact.whatsapp.replace(/\s/g, "").replace("+", "")}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 p-4 rounded-xl bg-background/80 border border-border hover:border-emerald-500/30 transition-all duration-300 group">
                  <div className="w-11 h-11 rounded-xl bg-emerald-500/10 group-hover:bg-emerald-500/20 flex items-center justify-center shrink-0 transition-colors">
                    <Whatsapp size="20" color="currentColor" variant="Bold" className="text-emerald-500" />
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground font-medium uppercase tracking-wider">{t.contact.whatsappLabel}</div>
                    <div className="text-foreground font-medium">{t.contact.whatsapp}</div>
                  </div>
                </a>
                <a href={`tel:${t.contact.phone.replace(/\s/g, "")}`} className="flex items-center gap-4 p-4 rounded-xl bg-background/80 border border-border hover:border-primary/30 transition-all duration-300 group">
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
        </div>
      </div>
    </section>
  );
}
