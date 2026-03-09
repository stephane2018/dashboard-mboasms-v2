"use client";

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

interface ApiDocsLayoutProps {
  children: React.ReactNode;
}

type NavSectionItem = {
  title: string;
  href: string;
  section: string;
  method?: string;
};

const navSections: { key: string; title: string; items: NavSectionItem[] }[] = [
  {
    key: "getting-started",
    title: "Getting Started",
    items: [
      { title: "Introduction", href: "#introduction", section: "getting-started" },
      { title: "Base URL", href: "#base-url", section: "getting-started" },
      { title: "Authentication", href: "#authentication", section: "getting-started" },
      { title: "Rate Limiting", href: "#rate-limiting", section: "getting-started" },
    ],
  },
  {
    key: "endpoints",
    title: "API Endpoints",
    items: [
      { title: "Send SMS", href: "#send-sms", section: "endpoints", method: "POST" },
      { title: "Send SMS (Basic Auth)", href: "#send-sms-auth", section: "endpoints", method: "POST" },
      { title: "Send Bulk SMS", href: "#send-bulk", section: "endpoints", method: "POST" },
    ],
  },
  {
    key: "reference",
    title: "Reference",
    items: [
      { title: "Response Format", href: "#response-format", section: "reference" },
      { title: "Error Codes", href: "#error-codes", section: "reference" },
      { title: "SDKs & Libraries", href: "#sdks", section: "reference" },
    ],
  },
];

const allNavItems = navSections.flatMap((s) => s.items);

export function ApiDocsLayout({ children }: ApiDocsLayoutProps) {
  const [activeItem, setActiveItem] = useState<string>("#introduction");
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);

  // Intersection observer for scroll spy
  useEffect(() => {
    const ids = allNavItems.map((item) => item.href.replace("#", ""));
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveItem(`#${entry.target.id}`);
          }
        }
      },
      { rootMargin: "-20% 0px -70% 0px", threshold: 0 }
    );

    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  // Close sidebar on resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024 && sidebarOpen) setSidebarOpen(false);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [sidebarOpen]);

  // Prevent scroll when mobile sidebar open
  useEffect(() => {
    document.body.style.overflow = sidebarOpen ? 'hidden' : 'auto';
    return () => { document.body.style.overflow = 'auto'; };
  }, [sidebarOpen]);

  // Smooth scroll
  useEffect(() => {
    document.documentElement.style.scrollBehavior = 'smooth';
    return () => { document.documentElement.style.scrollBehavior = ''; };
  }, []);

  const handleNavClick = useCallback((href: string) => {
    setActiveItem(href);
    setSidebarOpen(false);
  }, []);

  return (
    <div className="flex min-h-screen relative">
      {/* Mobile toggle */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="lg:hidden fixed bottom-6 right-6 z-50 w-12 h-12 rounded-full bg-primary text-white shadow-lg shadow-primary/30 flex items-center justify-center hover:scale-105 active:scale-95 transition-transform"
        aria-label={sidebarOpen ? "Close menu" : "Open menu"}
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          {sidebarOpen ? (
            <path d="M18 6L6 18M6 6l12 12" />
          ) : (
            <path d="M4 6h16M4 12h16M4 18h16" />
          )}
        </svg>
      </button>

      {/* Overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed top-20 left-0 z-30 h-[calc(100vh-5rem)] w-72 bg-card border-r border-border transition-transform duration-300 overflow-y-auto",
          "lg:sticky lg:top-20 lg:h-[calc(100vh-5rem)] lg:translate-x-0",
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Header */}
        <div className="sticky top-0 z-10 bg-card border-b border-border px-6 py-4">
          {/* <Link href="/" className="flex items-center gap-3 group">
            <Image src="/icones/logo.svg" alt="MboaSMS" width={100} height={32} className="h-7 w-auto" />
          </Link> */}
          <div className="flex items-center gap-2 mt-2">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
            <span className="text-xs text-muted-foreground font-medium">API Documentation</span>
            <span className="ml-auto text-[10px] px-1.5 py-0.5 rounded bg-primary/10 text-primary font-semibold">v1</span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-6">
          {navSections.map((section) => (
            <div key={section.key}>
              <h3 className="text-[10px] font-bold uppercase tracking-[0.15em] text-muted-foreground mb-2 px-3">
                {section.title}
              </h3>
              <ul className="space-y-0.5">
                {section.items.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      onClick={() => handleNavClick(item.href)}
                      className={cn(
                        "flex items-center gap-2.5 px-3 py-2 text-sm rounded-lg transition-all duration-200 relative group",
                        activeItem === item.href
                          ? "bg-primary/10 text-primary font-medium"
                          : "text-foreground/80 hover:bg-muted/50 hover:text-foreground"
                      )}
                    >
                      {activeItem === item.href && (
                        <motion.div
                          layoutId="sidebar-indicator"
                          className="absolute left-0 top-1 bottom-1 w-[3px] bg-primary rounded-full"
                          transition={{ type: "spring", stiffness: 500, damping: 30 }}
                        />
                      )}
                      {item.method && (
                        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 font-mono shrink-0">
                          {item.method}
                        </span>
                      )}
                      <span className={cn(
                        "transition-transform duration-150",
                        activeItem !== item.href && "group-hover:translate-x-0.5"
                      )}>
                        {item.title}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Quick links */}
          <div className="border-t border-border pt-4">
            <Link
              href="/compte"
              className="flex items-center gap-2 px-3 py-2 text-sm rounded-lg bg-primary/5 border border-primary/20 text-primary hover:bg-primary/10 transition-colors font-medium"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M15 3h4a2 2 0 012 2v14a2 2 0 01-2 2h-4M10 17l5-5-5-5M15 12H3" />
              </svg>
              Dashboard
            </Link>
          </div>
        </nav>
      </aside>

      {/* Main content */}
      <main className="flex-1 min-w-0">
        <div className="max-w-4xl mx-auto px-6 md:px-10 py-8 md:py-12">
          {children}
        </div>
      </main>

      {/* Right sidebar - Table of contents (desktop only) */}
      <aside className="hidden xl:block w-56 shrink-0 sticky top-20 h-[calc(100vh-5rem)] overflow-y-auto py-8 pr-6">
        <div className="text-[10px] font-bold uppercase tracking-[0.15em] text-muted-foreground mb-3">
          On this page
        </div>
        <ul className="space-y-1 border-l border-border pl-3">
          {allNavItems.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                onClick={() => handleNavClick(item.href)}
                className={cn(
                  "block text-xs py-1 transition-colors duration-150",
                  activeItem === item.href
                    ? "text-primary font-medium"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {item.title}
              </Link>
            </li>
          ))}
        </ul>
      </aside>
    </div>
  );
}
