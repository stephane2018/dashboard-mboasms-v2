"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useTheme } from 'next-themes';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight2, CloseCircle, User, Logout, Profile, Sms, Global, CloseSquare } from 'iconsax-react';
import ScheduleCallModal from '../ScheduleCallModal';
import { ThemeToggle } from '../ui/theme-toggle';
import { LanguageSwitcher } from '@/shared/common/language-switcher';
import { useUserStore } from '@/core/stores/userStore';
import { useEnterpriseStore } from '@/core/stores/enterpriseStore';
import { API_URL, API_URL_DASHBOARD } from '@/core/config/constante';
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@/shared/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/shared/ui/dropdown-menu';

const Header = () => {
  const pathname = usePathname();
  const { user, clearUser } = useUserStore();
  const { enterprise } = useEnterpriseStore();
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scheduleCallOpen, setScheduleCallOpen] = useState(false);
  const [bannerDismissed, setBannerDismissed] = useState(true);
  const [bannerReady, setBannerReady] = useState(false);

  useEffect(() => {
    setMounted(true);
    const dismissed = localStorage.getItem('mboasms_v2_banner_dismissed');
    if (!dismissed) {
      // Show banner a few seconds after page load (after welcome modal)
      const timer = setTimeout(() => {
        setBannerDismissed(false);
        setBannerReady(true);
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleDismissBanner = () => {
    setBannerDismissed(true);
    localStorage.setItem('mboasms_v2_banner_dismissed', 'true');
  };

  const logoSrc = mounted && resolvedTheme === 'dark' ? '/icones/logo-white.svg' : '/icones/logo.svg';

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
    window.location.href = "/auth/login";
  };

  const handleLogout = () => {
    clearUser();
    if (mobileMenuOpen) {
      setMobileMenuOpen(false);
    }
  };

  const userDisplayName = user?.name || user?.email || '';
  const userInitials = userDisplayName
    .split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
  const userSmsBalance =
    typeof user?.smsBalance === 'number' ? user.smsBalance : null;
  const enterpriseSmsCredit =
    typeof enterprise?.smsCredit === 'number' ? enterprise.smsCredit : null;

  const handleProfile = () => {
    window.open(`${API_URL}/profile`, '_blank', 'noopener,noreferrer');
  };

  const handleGoToAdmin = () => {
    window.open("/dashboard", '_self');
  };

  return (
    <>
      {/* Version announcement banner */}
      <AnimatePresence>
        {!bannerDismissed && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed top-0 left-0 right-0 z-[60] overflow-hidden"
          >
            <div className="bg-linear-to-r from-primary via-fuchsia-500 to-violet-600 text-white px-4 py-2 shadow-lg shadow-primary/20">
              <div className="container mx-auto flex items-center justify-center gap-2 text-center relative">
                <p className="text-xs md:text-sm font-medium">
                  Bienvenue sur la nouvelle version de MboaSMS !
                  <span className="hidden sm:inline"> Pour revenir à l&apos;ancienne version,</span>
                  <span className="sm:hidden"> Ancienne version ?</span>
                  {' '}
                  <a
                    href="https://old.mboasms.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline font-bold hover:text-white/80 transition-colors"
                  >
                    cliquez ici
                  </a>
                </p>
                <button
                  onClick={handleDismissBanner}
                  className="absolute right-0 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-white/20 transition-colors"
                  aria-label="Fermer la bannière"
                >
                  <CloseSquare size="18" variant="Bold" color="currentColor" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <header className={`py-4 px-6 md:px-12 lg:px-24 fixed left-0 right-0 z-50 transition-all duration-300 ${!bannerDismissed ? 'top-[36px]' : 'top-0'} ${mobileMenuOpen ? 'bg-background shadow-md' : scrolled ? 'bg-background/80 backdrop-blur-md shadow-md dark:bg-background/90' : 'bg-transparent'}`}>
        <div className="container mx-auto flex justify-between items-center">
          <Link href="/" className="flex items-center">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="flex items-center"
            >
              <Image
                src={logoSrc}
                alt="MboaSMS Logo"
                width={120}
                height={40}
                className="h-7 md:h-9 w-auto"
              />
            </motion.div>
          </Link>

          <motion.nav
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="hidden md:flex space-x-8"
          >
            <Link href="/" className={`${pathname === '/' ? 'text-primary' : 'text-foreground'} hover:text-primary transition-colors relative group`}>
              Home
              <span className={`absolute -bottom-1 left-0 h-0.5 bg-linear-to-r from-primary to-purple-500 transition-all duration-300 ${pathname === '/' ? 'w-full' : 'w-0 group-hover:w-full'}`}></span>
            </Link>
            <Link href="/conditions" className={`${pathname === '/conditions' ? 'text-primary' : 'text-foreground'} hover:text-primary transition-colors relative group`}>
              Conditions d&apos;utilisation
              <span className={`absolute -bottom-1 left-0 h-0.5 bg-linear-to-r from-primary to-purple-500 transition-all duration-300 ${pathname === '/conditions' ? 'w-full' : 'w-0 group-hover:w-full'}`}></span>
            </Link>
            <Link href="/api-docs" className={`${pathname === '/api-docs' ? 'text-primary' : 'text-foreground'} hover:text-primary transition-colors relative group`}>
              Documentation
              <span className={`absolute -bottom-1 left-0 h-0.5 bg-linear-to-r from-primary to-purple-500 transition-all duration-300 ${pathname === '/api-docs' ? 'w-full' : 'w-0 group-hover:w-full'}`}></span>
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
            {user ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="hidden md:flex items-center space-x-3"
              >
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="flex items-center gap-3 rounded-full border border-border/70 bg-background/80 px-2 py-1.5 shadow-sm hover:border-primary hover:shadow-primary/10 transition-all duration-200">
                      <div className="relative">
                        <Avatar className="h-8 w-8 ring-1 ring-border">
                          <AvatarImage src={user?.avatar || ''} alt={userDisplayName} />
                          <AvatarFallback>{userInitials || 'US'}</AvatarFallback>
                        </Avatar>
                      </div>
                      <div className="text-left">
                        <p className="text-sm font-semibold leading-tight">{userDisplayName}</p>
                        <p className="text-xs text-muted-foreground flex items-center gap-2">
                          Mon compte
                          {userSmsBalance !== null && (
                            <span className="inline-flex items-center rounded-full bg-gradient-to-r from-primary/20 to-purple-500/20 text-primary px-2 py-0.5 text-[10px] font-semibold shadow-sm border border-primary/10">
                              {userSmsBalance.toLocaleString()} SMS
                            </span>
                          )}
                        </p>
                      </div>
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-60 rounded-2xl p-2">
                    <DropdownMenuLabel>
                      <p className="text-sm font-semibold">{userDisplayName}</p>
                      <p className="text-xs text-muted-foreground">{user?.email}</p>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <div className="flex items-center justify-around rounded-lg px-3 py-2.5 my-1">
                          <div className="flex items-center gap-1.5">
                            <Sms size="14" variant="Bulk" color="currentColor" className="text-primary shrink-0" />
                            <div className="flex flex-col">
                              <span className="text-[9px] font-medium text-muted-foreground uppercase tracking-wider leading-none">National</span>
                              <span className="text-xs font-bold text-foreground tabular-nums leading-tight">
                                {(enterpriseSmsCredit ?? userSmsBalance ?? 0).toLocaleString()} SMS
                              </span>
                            </div>
                          </div>
                          <div className="w-px h-6 bg-border/60" />
                          <div className="flex items-center gap-1.5">
                            <Global size="14" variant="Bulk" color="currentColor" className="text-purple-500 shrink-0" />
                            <div className="flex flex-col">
                              <span className="text-[9px] font-medium text-muted-foreground uppercase tracking-wider leading-none">International</span>
                              <span className="text-xs font-bold text-foreground tabular-nums leading-tight">
                                {(enterpriseSmsCredit ?? userSmsBalance ?? 0).toLocaleString()} SMS
                              </span>
                            </div>
                          </div>
                        </div>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleProfile} className="flex items-center gap-2">
                      <Profile size="16" variant="Bulk" color="currentColor" className="text-primary" />
                      Voir mon profil
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={handleGoToAdmin} className="flex items-center gap-2">
                      <ArrowRight2 size="16" variant="Bulk" color="currentColor" className="text-primary" />
                      Aller à la partie admin
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={handleLogout}
                      className="flex items-center gap-2 text-red-500 focus:text-red-500 focus:bg-red-50"
                    >
                      <Logout size="16" variant="Bulk" color="currentColor" />
                      Déconnexion
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </motion.div>
            ) : (
              <>
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="hidden md:block"
                >
                  <Link
                    href="/auth/register"
                    className="relative bg-primary text-white px-5 py-2.5 rounded-xl group inline-flex items-center text-sm font-semibold shadow-md shadow-primary/25 hover:shadow-lg hover:shadow-primary/30 hover:scale-[1.03] active:scale-[0.98] transition-all duration-200"
                  >
                    Créer un compte
                    <ArrowRight2 size="16" variant="Bold" color="currentColor" className="ml-2 group-hover:translate-x-0.5 transition-transform duration-200" />
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
                    className="px-5 py-2.5 rounded-xl group inline-flex items-center text-sm font-semibold border border-border hover:border-primary/40 hover:bg-primary/5 active:scale-[0.98] transition-all duration-200"
                  >
                    <span className="text-foreground group-hover:text-primary transition-colors duration-200 flex items-center">
                      Se connecter
                      <ArrowRight2 size="16" variant="Bold" color="currentColor" className="ml-2 group-hover:translate-x-0.5 transition-transform duration-200" />
                    </span>
                  </button>
                </motion.div>
              </>
            )}
            <LanguageSwitcher variant="pill" />
            <ThemeToggle />
            <button
              className="md:hidden text-foreground p-1 rounded-full hover:bg-primary/10 transition-colors"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
            >
              {mobileMenuOpen ? (
                <CloseCircle size="24" variant="Bulk" color="currentColor"  className="text-primary"/>
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
              className="fixed inset-0 bg-background z-50 md:hidden"
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
                      src={logoSrc} 
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
                    <CloseCircle size="24" variant="Bulk" color="currentColor" className="text-primary" />
                  </motion.button>
                </div>
                
                <nav className="flex flex-col space-y-6 mt-8">
                  <Link
                    href="/"
                    className={`${pathname === '/' ? 'text-primary' : 'text-foreground'} hover:text-primary transition-colors text-xl font-medium`}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: 0.1 }}
                      className="flex items-center"
                    >
                      Home
                      {pathname === '/' && <span className="ml-2 w-1.5 h-1.5 rounded-full bg-primary"></span>}
                    </motion.div>
                  </Link>
                  <Link
                    href="/conditions"
                    className={`${pathname === '/conditions' ? 'text-primary' : 'text-foreground'} hover:text-primary transition-colors text-xl font-medium`}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: 0.2 }}
                      className="flex items-center"
                    >
                      Conditions d&apos;utilisation
                      {pathname === '/conditions' && <span className="ml-2 w-1.5 h-1.5 rounded-full bg-primary"></span>}
                    </motion.div>
                  </Link>
                  <Link
                    href="/api-docs"
                    className={`${pathname === '/api-docs' ? 'text-primary' : 'text-foreground'} hover:text-primary transition-colors text-xl font-medium`}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: 0.25 }}
                      className="flex items-center"
                    >
                      Documentation
                      {pathname === '/api-docs' && <span className="ml-2 w-1.5 h-1.5 rounded-full bg-primary"></span>}
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
                  <a
                    href="https://dashboard.mboasms.com/login"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-foreground hover:text-primary transition-colors text-xl font-medium flex items-center gap-2"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: 0.35 }}
                      className="flex items-center gap-2"
                    >
                      <span>Espace admin</span>
                      <ArrowRight2 size="18" variant="Bulk" color="currentColor" className="text-primary" />
                    </motion.div>
                  </a>
                </nav>
                
                <div className="mt-auto space-y-4">
                  {user ? (
                    <>
                      {/* Mobile SMS Balance */}
                      {(userSmsBalance !== null || enterpriseSmsCredit !== null) && (
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3, delay: 0.35 }}
                          className="w-full"
                        >
                          <div className="flex items-center justify-around rounded-xl border border-border/60 bg-muted/30 px-4 py-3">
                            <div className="flex items-center gap-2">
                              <Sms size="18" variant="Bulk" color="currentColor" className="text-primary" />
                              <div>
                                <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">National</p>
                                <p className="text-sm font-bold tabular-nums">{(enterpriseSmsCredit ?? userSmsBalance ?? 0).toLocaleString()} SMS</p>
                              </div>
                            </div>
                            <div className="w-px h-8 bg-border/60" />
                            <div className="flex items-center gap-2">
                              <Global size="18" variant="Bulk" color="currentColor" className="text-purple-500" />
                              <div>
                                <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">International</p>
                                <p className="text-sm font-bold tabular-nums">{(enterpriseSmsCredit ?? userSmsBalance ?? 0).toLocaleString()} SMS</p>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      )}
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: 0.4 }}
                        className="w-full"
                      >
                        <div className="flex items-center space-x-2 px-4 py-3 rounded-full bg-primary/10">
                          <User size="16" variant="Bulk" color="currentColor" className="text-primary" />
                          <span className="text-sm font-medium text-foreground">
                            {user.name || user.email}
                          </span>
                        </div>
                      </motion.div>
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: 0.5 }}
                        className="w-full"
                      >
                        <button
                          onClick={handleLogout}
                          className="relative overflow-hidden px-5 py-3 rounded-full group flex items-center justify-center text-base font-medium w-full"
                        >
                          <span className="absolute inset-0 border border-red-500 rounded-full group-hover:border-transparent group-hover:bg-red-500/10 transition-all duration-300"></span>
                          <span className="relative text-red-500 flex items-center justify-center">
                            <Logout size="16" variant="Bulk" color="currentColor" className="mr-2" />
                            Déconnexion
                          </span>
                        </button>
                      </motion.div>
                    </>
                  ) : (
                    <>
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: 0.4 }}
                        className="w-full"
                      >
                        <Link
                          href="/compte"
                          className="bg-primary text-white px-5 py-3.5 rounded-xl group flex items-center justify-center text-base font-semibold w-full shadow-md shadow-primary/25 active:scale-[0.98] transition-all duration-200"
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          Créer un compte
                          <ArrowRight2 size="18" variant="Bold" color="currentColor" className="ml-2" />
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
                          className="px-5 py-3.5 rounded-xl group flex items-center justify-center text-base font-semibold w-full border border-border hover:border-primary/40 hover:bg-primary/5 active:scale-[0.98] transition-all duration-200"
                        >
                          <span className="text-foreground group-hover:text-primary transition-colors duration-200 flex items-center">
                            Se connecter
                            <ArrowRight2 size="18" variant="Bold" color="currentColor" className="ml-2" />
                          </span>
                        </button>
                      </motion.div>
                    </>
                  )}
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
