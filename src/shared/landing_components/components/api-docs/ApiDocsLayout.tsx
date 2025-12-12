"use client";

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Menu, X, Info, Key, Clock, MessageSquare, Layers, Send, FileText, AlertTriangle, BookOpen } from 'lucide-react';

interface ApiDocsLayoutProps {
  children: React.ReactNode;
}

interface NavItem {
  title: string;
  href: string;
  section: string;
  icon: React.ReactNode;
}

const navItems: NavItem[] = [
  { title: "Introduction", href: "#introduction", section: "overview", icon: <BookOpen size={16} /> },
  { title: "Authentication", href: "#authentication", section: "overview", icon: <Key size={16} /> },
  { title: "Rate Limiting", href: "#rate-limiting", section: "overview", icon: <Clock size={16} /> },
  { title: "SMS API", href: "#sms-api", section: "endpoints", icon: <MessageSquare size={16} /> },
  { title: "Bulk SMS", href: "#bulk-sms", section: "endpoints", icon: <Layers size={16} /> },
  { title: "Delivery Reports", href: "#delivery-reports", section: "endpoints", icon: <FileText size={16} /> },
  { title: "Webhooks", href: "#webhooks", section: "integration", icon: <Send size={16} /> },
  { title: "Error Codes", href: "#error-codes", section: "reference", icon: <AlertTriangle size={16} /> },
];

export function ApiDocsLayout({ children }: ApiDocsLayoutProps) {
  const [activeSection, setActiveSection] = useState<string>("overview");
  const [activeItem, setActiveItem] = useState<string>("#introduction");
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);
  const sidebarRef = useRef<HTMLDivElement>(null);
  
  // Check for hash changes to update active item
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash;
      if (hash) {
        const matchingItem = navItems.find(item => item.href === hash);
        if (matchingItem) {
          setActiveItem(hash);
          setActiveSection(matchingItem.section);
        }
      }
    };
    
    // Initial check
    handleHashChange();
    
    // Listen for hash changes
    window.addEventListener('hashchange', handleHashChange);
    return () => {
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, []);
  
  // Close sidebar when screen size changes to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024 && sidebarOpen) {
        setSidebarOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [sidebarOpen]);

  // Prevent scrolling when mobile sidebar is open
  useEffect(() => {
    if (sidebarOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }

    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [sidebarOpen]);

  // Add smooth scrolling behavior to the document
  useEffect(() => {
    document.documentElement.style.scrollBehavior = 'smooth';
    
    return () => {
      document.documentElement.style.scrollBehavior = '';
    };
  }, []);

  const handleNavClick = (href: string, section: string) => {
    setActiveItem(href);
    setActiveSection(section);
    if (sidebarOpen) {
      setSidebarOpen(false);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row min-h-screen relative">
      {/* Mobile sidebar toggle */}
      <div className="lg:hidden fixed bottom-6 right-6 z-50">
        <button 
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-3 rounded-full bg-primary text-white shadow-lg hover:bg-primary/90 transition-all hover:scale-105 active:scale-95"
          aria-label={sidebarOpen ? "Close sidebar" : "Open sidebar"}
        >
          {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Sidebar overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      
      {/* Sidebar - Floating and sticky to middle left */}
      <aside 
        ref={sidebarRef}
        className={cn(
          "w-[280px] lg:w-72 fixed top-1/2 -translate-y-1/2 left-4 z-50 bg-background/95 dark:bg-background/95 backdrop-blur-md border border-primary/20 rounded-xl p-4 lg:p-6 max-h-[80vh] overflow-y-auto transition-all duration-300 shadow-xl",
          sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
        style={{
          scrollbarWidth: 'thin',
          scrollbarColor: 'var(--primary) transparent',
          boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
          backgroundImage: 'linear-gradient(to bottom, rgba(255, 255, 255, 0.05), rgba(123, 24, 204, 0.03))'
        }}
      >
        <div className="mb-8 flex items-center justify-between">
          <div>
            <Link href="/" className="flex items-center group">
              <h1 className="text-xl font-bold text-primary group-hover:text-primary/80 transition-colors">MboaSMS</h1>
            </Link>
            <div className="flex items-center mt-1">
              <div className="w-2 h-2 rounded-full bg-green-500 mr-2 animate-pulse"></div>
              <p className="text-sm text-muted-foreground">API Documentation</p>
            </div>
          </div>
          <button 
            onClick={() => setSidebarOpen(false)}
            className="p-2 rounded-md hover:bg-muted/50 lg:hidden"
            aria-label="Close sidebar"
          >
            <X size={18} />
          </button>
        </div>
        
        <nav className="space-y-6 relative">
          <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary/5 via-primary/20 to-primary/5"></div>
          <div>
            <div className="flex items-center gap-2 mb-3 pl-3 bg-gradient-to-r from-primary/10 to-transparent py-1 rounded-l-md">
              <Info size={16} className="text-primary" />
              <h2 className="text-sm font-medium text-primary">Overview</h2>
            </div>
            <ul className="space-y-1.5">
              {navItems
                .filter(item => item.section === "overview")
                .map((item) => (
                  <li key={item.href}>
                    <Link 
                      href={item.href}
                      className={cn(
                        "flex items-center gap-3 px-4 py-2 text-sm rounded-md transition-all relative group",
                        activeItem === item.href 
                          ? "bg-primary/10 text-primary font-medium" 
                          : "text-foreground hover:bg-primary/5"
                      )}
                      onClick={() => handleNavClick(item.href, item.section)}
                    >
                      <span className={cn(
                        "flex-shrink-0 transition-colors",
                        activeItem === item.href 
                          ? "text-primary" 
                          : "text-muted-foreground group-hover:text-primary/70"
                      )}>
                        {item.icon}
                      </span>
                      <span className={cn(
                        "transition-transform",
                        activeItem !== item.href && "group-hover:translate-x-1"
                      )}>
                        {item.title}
                      </span>
                      {activeItem === item.href && (
                        <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary rounded-r-md"></div>
                      )}
                    </Link>
                  </li>
                ))}
            </ul>
          </div>
          
          <div>
            <div className="flex items-center gap-2 mb-3 pl-3 bg-gradient-to-r from-primary/10 to-transparent py-1 rounded-l-md">
              <MessageSquare size={16} className="text-primary" />
              <h2 className="text-sm font-medium text-primary">Endpoints</h2>
            </div>
            <ul className="space-y-1.5">
              {navItems
                .filter(item => item.section === "endpoints")
                .map((item) => (
                  <li key={item.href}>
                    <Link 
                      href={item.href}
                      className={cn(
                        "flex items-center gap-3 px-4 py-2 text-sm rounded-md transition-all relative group",
                        activeItem === item.href 
                          ? "bg-primary/10 text-primary font-medium" 
                          : "text-foreground hover:bg-primary/5"
                      )}
                      onClick={() => handleNavClick(item.href, item.section)}
                    >
                      <span className={cn(
                        "flex-shrink-0 transition-colors",
                        activeItem === item.href 
                          ? "text-primary" 
                          : "text-muted-foreground group-hover:text-primary/70"
                      )}>
                        {item.icon}
                      </span>
                      <span className={cn(
                        "transition-transform",
                        activeItem !== item.href && "group-hover:translate-x-1"
                      )}>
                        {item.title}
                      </span>
                      {activeItem === item.href && (
                        <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary rounded-r-md"></div>
                      )}
                    </Link>
                  </li>
                ))}
            </ul>
          </div>
          
          <div>
            <div className="flex items-center gap-2 mb-3 pl-3 bg-gradient-to-r from-primary/10 to-transparent py-1 rounded-l-md">
              <Send size={16} className="text-primary" />
              <h2 className="text-sm font-medium text-primary">Integration</h2>
            </div>
            <ul className="space-y-1.5">
              {navItems
                .filter(item => item.section === "integration")
                .map((item) => (
                  <li key={item.href}>
                    <Link 
                      href={item.href}
                      className={cn(
                        "flex items-center gap-3 px-4 py-2 text-sm rounded-md transition-all relative group",
                        activeItem === item.href 
                          ? "bg-primary/10 text-primary font-medium" 
                          : "text-foreground hover:bg-primary/5"
                      )}
                      onClick={() => handleNavClick(item.href, item.section)}
                    >
                      <span className={cn(
                        "flex-shrink-0 transition-colors",
                        activeItem === item.href 
                          ? "text-primary" 
                          : "text-muted-foreground group-hover:text-primary/70"
                      )}>
                        {item.icon}
                      </span>
                      <span className={cn(
                        "transition-transform",
                        activeItem !== item.href && "group-hover:translate-x-1"
                      )}>
                        {item.title}
                      </span>
                      {activeItem === item.href && (
                        <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary rounded-r-md"></div>
                      )}
                    </Link>
                  </li>
                ))}
            </ul>
          </div>
          
          <div>
            <div className="flex items-center gap-2 mb-3 pl-3 bg-gradient-to-r from-primary/10 to-transparent py-1 rounded-l-md">
              <FileText size={16} className="text-primary" />
              <h2 className="text-sm font-medium text-primary">Reference</h2>
            </div>
            <ul className="space-y-1.5">
              {navItems
                .filter(item => item.section === "reference")
                .map((item) => (
                  <li key={item.href}>
                    <Link 
                      href={item.href}
                      className={cn(
                        "flex items-center gap-3 px-4 py-2 text-sm rounded-md transition-all relative group",
                        activeItem === item.href 
                          ? "bg-primary/10 text-primary font-medium" 
                          : "text-foreground hover:bg-primary/5"
                      )}
                      onClick={() => handleNavClick(item.href, item.section)}
                    >
                      <span className={cn(
                        "flex-shrink-0 transition-colors",
                        activeItem === item.href 
                          ? "text-primary" 
                          : "text-muted-foreground group-hover:text-primary/70"
                      )}>
                        {item.icon}
                      </span>
                      <span className={cn(
                        "transition-transform",
                        activeItem !== item.href && "group-hover:translate-x-1"
                      )}>
                        {item.title}
                      </span>
                      {activeItem === item.href && (
                        <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary rounded-r-md"></div>
                      )}
                    </Link>
                  </li>
                ))}
            </ul>
          </div>
        </nav>
      </aside>
      
      {/* Main content */}
      <main className="flex-1 p-4 md:p-6 lg:p-8">
        {children}
      </main>
    </div>
  );
}
