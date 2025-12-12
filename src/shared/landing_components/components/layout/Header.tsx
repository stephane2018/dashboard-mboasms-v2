"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight2, CloseCircle } from 'iconsax-react';
import ScheduleCallModal from '../ScheduleCallModal';
import { ThemeToggle } from '../ui/theme-toggle';

const Header = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scheduleCallOpen, setScheduleCallOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [scrolled]);

  // Close mobile menu when window is resized to desktop size
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768 && mobileMenuOpen) {
        setMobileMenuOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [mobileMenuOpen]);

  // Prevent scrolling when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }

    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [mobileMenuOpen]);

  const handleContactClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setScheduleCallOpen(true);
    if (mobileMenuOpen) {
      setMobileMenuOpen(false);
    }
  };

  const handleLoginClick = () => {
    // Redirect to dashboard login page
    window.location.href = 'https://dashboard.mboasms.com/login';
  };

  return (
    <>
      <header className={`py-4 px-6 md:px-12 lg:px-24 fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-background/80 backdrop-blur-md shadow-md dark:bg-background/90' : 'bg-transparent'}`}>
        <div className="container mx-auto flex justify-between items-center">
          <Link href="/" className="flex items-center">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="flex items-center"
            >
              <Image 
                src="/icones/logo.svg" 
                alt="MboaSMS Logo" 
                width={120} 
                height={40} 
                className="h-10 w-auto"
              />
            </motion.div>
          </Link>

          <motion.nav
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="hidden md:flex space-x-8"
          >
            <Link href="/" className="text-foreground hover:text-primary transition-colors relative group">
              Home
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-primary to-purple-500 group-hover:w-full transition-all duration-300"></span>
            </Link>
            <Link href="/conditions" className="text-foreground hover:text-primary transition-colors relative group">
              Conditions d&apos;utilisation
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-primary to-purple-500 group-hover:w-full transition-all duration-300"></span>
            </Link>
            <a 
              href="#" 
              onClick={handleContactClick}
              className="text-foreground hover:text-primary transition-colors relative group cursor-pointer"
            >
              Contactez-nous
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-primary to-purple-500 group-hover:w-full transition-all duration-300"></span>
            </a>
          </motion.nav>

          <div className="flex items-center space-x-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="hidden md:block"
            >
              <Link
                href="/compte"
                className="relative overflow-hidden bg-gradient-to-r from-primary to-purple-500 text-white px-5 py-2 rounded-full group inline-flex items-center text-sm font-medium"
              >
                <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-primary to-purple-500 group-hover:from-purple-500 group-hover:to-primary transition-all duration-500"></span>
                <span className="absolute -inset-px bg-gradient-to-r from-primary-light to-primary rounded-full animate-gradient-x opacity-50 group-hover:opacity-70 blur-sm transition-opacity duration-500"></span>
                <span className="relative flex items-center justify-center">
                  Créer un compte
                  <ArrowRight2 size="18" className="ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                </span>
              </Link>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="hidden md:block"
            >
              <button
                onClick={handleLoginClick}
                className="relative overflow-hidden px-5 py-2 rounded-full group inline-flex items-center text-sm font-medium"
              >
                <span className="absolute inset-0 border border-primary rounded-full group-hover:border-transparent group-hover:bg-primary/10 transition-all duration-300"></span>
                <span className="absolute inset-0 border-2 border-transparent bg-gradient-to-r from-primary-light via-primary to-purple-500 opacity-0 group-hover:opacity-100 rounded-full mask-border animate-gradient-x transition-opacity duration-300"></span>
                <span className="relative text-primary flex items-center justify-center">
                  Se connecter
                  <ArrowRight2 size="18" className="ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                </span>
              </button>
            </motion.div>
            <ThemeToggle />
            <button 
              className="md:hidden text-foreground p-1 rounded-full hover:bg-primary/10 transition-colors"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
            >
              {mobileMenuOpen ? (
                <CloseCircle size="24" variant="Bold" className="text-primary" />
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div 
              className="fixed inset-0 bg-background/95 backdrop-blur-lg z-40 md:hidden"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex flex-col h-full px-6 pb-6">
                {/* Mobile menu header with logo and close button */}
                <div className="flex items-center justify-between py-4 border-b border-gray-800/20">
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Image 
                      src="/icones/logo.svg" 
                      alt="MboaSMS Logo" 
                      width={80} 
                      height={28} 
                      className="h-6 w-auto"
                    />
                  </motion.div>
                  <motion.button
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3 }}
                    onClick={() => setMobileMenuOpen(false)}
                    className="p-2 rounded-full bg-primary/10 hover:bg-primary/20 transition-colors"
                    aria-label="Close menu"
                  >
                    <CloseCircle size="24" variant="Bold" className="text-primary" />
                  </motion.button>
                </div>
                
                <nav className="flex flex-col space-y-6 mt-8">
                  <Link 
                    href="/" 
                    className="text-foreground hover:text-primary transition-colors text-xl font-medium"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: 0.1 }}
                      className="flex items-center"
                    >
                      Home
                    </motion.div>
                  </Link>
                  <Link 
                    href="/conditions" 
                    className="text-foreground hover:text-primary transition-colors text-xl font-medium"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: 0.2 }}
                      className="flex items-center"
                    >
                      Conditions d&apos;utilisation
                    </motion.div>
                  </Link>
                  <a 
                    href="#" 
                    onClick={handleContactClick}
                    className="text-foreground hover:text-primary transition-colors text-xl font-medium cursor-pointer"
                  >
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: 0.3 }}
                      className="flex items-center"
                    >
                      Contactez-nous
                    </motion.div>
                  </a>
                </nav>
                
                <div className="mt-auto space-y-4">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.4 }}
                    className="w-full"
                  >
                    <Link
                      href="/compte"
                      className="relative overflow-hidden bg-gradient-to-r from-primary to-purple-500 text-white px-5 py-3 rounded-full group flex items-center justify-center text-base font-medium w-full"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-primary to-purple-500 group-hover:from-purple-500 group-hover:to-primary transition-all duration-500"></span>
                      <span className="absolute -inset-px bg-gradient-to-r from-primary-light to-primary rounded-full animate-gradient-x opacity-50 group-hover:opacity-70 blur-sm transition-opacity duration-500"></span>
                      <span className="relative flex items-center justify-center">
                        Créer un compte
                        <ArrowRight2 size="18" className="ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                      </span>
                    </Link>
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.5 }}
                    className="w-full"
                  >
                    <button
                      onClick={handleLoginClick}
                      className="relative overflow-hidden px-5 py-3 rounded-full group flex items-center justify-center text-base font-medium w-full"
                    >
                      <span className="absolute inset-0 border border-primary rounded-full group-hover:border-transparent group-hover:bg-primary/10 transition-all duration-300"></span>
                      <span className="absolute inset-0 border-2 border-transparent bg-gradient-to-r from-primary-light via-primary to-purple-500 opacity-0 group-hover:opacity-100 rounded-full mask-border animate-gradient-x transition-opacity duration-300"></span>
                      <span className="relative text-primary flex items-center justify-center">
                        Se connecter
                        <ArrowRight2 size="18" className="ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                      </span>
                    </button>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Schedule Call Modal */}
      <ScheduleCallModal isOpen={scheduleCallOpen} onClose={() => setScheduleCallOpen(false)} />
    </>
  );
};

export default Header;
