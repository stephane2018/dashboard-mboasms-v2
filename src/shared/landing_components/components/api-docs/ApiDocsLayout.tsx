"use client";

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Book1, Code1, DocumentCode2, ArrowRight2, HambergerMenu, CloseCircle } from 'iconsax-react';
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

const navSections: { key: string; title: string; icon: React.ElementType; items: NavSectionItem[] }[] = [
  {
    key: "getting-started",
    title: "Pour commencer",
    icon: Book1,
    items: [
      { title: "Introduction", href: "#introduction", section: "getting-started" },
      { title: "Base URL", href: "#base-url", section: "getting-started" },
      { title: "Authentication", href: "#authentication", section: "getting-started" },
      { title: "Login", href: "#login", section: "getting-started", method: "POST" },
      { title: "Rate Limiting", href: "#rate-limiting", section: "getting-started" },
    ],
  },
  {
    key: "endpoints",
    title: "Endpoints",
    icon: Code1,
    items: [
      { title: "Send SMS", href: "#send-sms", section: "endpoints", method: "POST" },
      { title: "Send Bulk SMS", href: "#send-bulk", section: "endpoints", method: "POST" },
      { title: "List API Keys", href: "#list-api-keys", section: "endpoints", method: "GET" },
      { title: "Create API Key", href: "#create-api-key", section: "endpoints", method: "POST" },
    ],
  },
  {
    key: "reference",
    title: "Reference",
    icon: DocumentCode2,
    items: [
      { title: "Response Format", href: "#response-format", section: "reference" },
      { title: "Error Codes", href: "#error-codes", section: "reference" },
      { title: "SDKs & Libraries", href: "#sdks", section: "reference" },
    ],
  },
];

const allNavItems = navSections.flatMap((s) => s.items);

const methodColors: Record<string, string> = {
  POST: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
  GET: "bg-sky-500/10 text-sky-600 dark:text-sky-400",
  PUT: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
  DELETE: "bg-red-500/10 text-red-600 dark:text-red-400",
};

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

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024 && sidebarOpen) setSidebarOpen(false);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [sidebarOpen]);

  useEffect(() => {
    document.body.style.overflow = sidebarOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [sidebarOpen]);

  useEffect(() => {
    document.documentElement.style.scrollBehavior = 'smooth';
    return () => { document.documentElement.style.scrollBehavior = ''; };
  }, []);

  const handleNavClick = useCallback((href: string) => {
    setActiveItem(href);
    setSidebarOpen(false);
  }, []);

  const SidebarContent = () => (
    <>
      {/* Header */}
      <div className="px-5 py-4 border-b border-border/60 mt-10">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center">
            <Code1 size="14" variant="Bulk" color="currentColor" className="text-primary" />
          </div>
          <div>
            <p className="text-sm font-semibold text-foreground leading-tight">API Docs</p>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-400"></span>
              </span>
              <span className="text-[10px] text-muted-foreground">v1.0</span>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="p-3 space-y-5 flex-1 overflow-y-auto">
        {navSections.map((section) => {
          const SectionIcon = section.icon;
          return (
            <div key={section.key}>
              <div className="flex items-center gap-2 px-3 mb-2">
                <SectionIcon size="12" variant="Bulk" color="currentColor" className="text-muted-foreground" />
                <h3 className="text-[10px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
                  {section.title}
                </h3>
              </div>
              <ul className="space-y-0.5">
                {section.items.map((item) => {
                  const isActive = activeItem === item.href;
                  return (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        onClick={() => handleNavClick(item.href)}
                        className={cn(
                          "flex items-center gap-2 px-3 py-2 text-[13px] rounded-xl transition-all duration-200 relative",
                          isActive
                            ? "bg-primary/8 text-primary font-medium"
                            : "text-muted-foreground hover:bg-muted/40 hover:text-foreground"
                        )}
                      >
                        {isActive && (
                          <motion.div
                            layoutId="sidebar-active"
                            className="absolute left-0 top-1.5 bottom-1.5 w-[2.5px] bg-primary rounded-full"
                            transition={{ type: "spring", stiffness: 400, damping: 30 }}
                          />
                        )}
                        {item.method && (
                          <span className={cn(
                            "text-[9px] font-bold px-1.5 py-0.5 rounded-md font-mono shrink-0",
                            methodColors[item.method] || methodColors.POST
                          )}>
                            {item.method}
                          </span>
                        )}
                        <span>{item.title}</span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          );
        })}
      </nav>
    </>
  );

  return (
    <div className="flex min-h-screen relative max-w-7xl mx-auto">
      {/* Mobile toggle */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="lg:hidden fixed bottom-6 right-6 z-50 w-12 h-12 rounded-full bg-primary text-white shadow-lg shadow-primary/25 flex items-center justify-center hover:scale-105 active:scale-95 transition-all duration-200"
        aria-label={sidebarOpen ? "Fermer le menu" : "Ouvrir le menu"}
      >
        {sidebarOpen ? (
          <CloseCircle size="22" variant="Bold" color="currentColor" />
        ) : (
          <HambergerMenu size="22" variant="Bold" color="currentColor" />
        )}
      </button>

      {/* Mobile overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar — Desktop */}
      <aside className="hidden lg:flex lg:flex-col lg:sticky lg:top-20 lg:h-[calc(100vh-5rem)] w-64 bg-background border-r border-border/50 shrink-0">
        <SidebarContent />
      </aside>

      {/* Sidebar — Mobile */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.aside
            initial={{ x: -280 }}
            animate={{ x: 0 }}
            exit={{ x: -280 }}
            transition={{ type: "spring", damping: 28, stiffness: 300 }}
            className="fixed top-0 left-0 z-50 h-full w-72 bg-background border-r border-border/50 flex flex-col shadow-2xl lg:hidden"
          >
            {/* Mobile close */}
            <div className="flex items-center justify-between px-5 py-3 border-b border-border/60">
              <span className="text-sm font-semibold text-foreground">Navigation</span>
              <button
                onClick={() => setSidebarOpen(false)}
                className="p-1.5 rounded-lg hover:bg-muted transition-colors"
              >
                <CloseCircle size="18" variant="Bulk" color="currentColor" className="text-muted-foreground" />
              </button>
            </div>
            <div className="flex flex-col flex-1 overflow-hidden">
              <SidebarContent />
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Main content */}
      <main className="flex-1 min-w-0">
        <div className="max-w-4xl mx-auto px-5 sm:px-8 md:px-10 py-8 md:py-12">
          {children}
        </div>
      </main>

      {/* Right sidebar — Table of contents (xl only) */}
      <aside className="hidden xl:block w-52 shrink-0 sticky top-20 h-[calc(100vh-5rem)] overflow-y-auto py-8 pr-6">
        <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-muted-foreground mb-3 pl-3">
          Sur cette page
        </p>
        <ul className="space-y-0.5 border-l border-border/50 pl-0">
          {allNavItems.map((item) => {
            const isActive = activeItem === item.href;
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={() => handleNavClick(item.href)}
                  className={cn(
                    "block text-xs py-1.5 pl-3 border-l-2 -ml-px transition-all duration-200",
                    isActive
                      ? "border-primary text-primary font-medium"
                      : "border-transparent text-muted-foreground hover:text-foreground hover:border-border"
                  )}
                >
                  {item.title}
                </Link>
              </li>
            );
          })}
        </ul>
      </aside>
    </div>
  );
}
