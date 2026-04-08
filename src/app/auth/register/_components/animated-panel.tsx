"use client"

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { cn } from '@/shared/utils/cn';
import { useT } from '@/core/hooks';

export function AnimatedPanel() {
  const [index, setIndex] = useState(0);
  const { t } = useT();

  const texts = [
    {
      title: t('auth.slidePanelTitle1'),
      description: t('auth.slidePanelDesc1'),
    },
    {
      title: t('auth.slidePanelTitle2'),
      description: t('auth.slidePanelDesc2'),
    },
    {
      title: t('auth.slidePanelTitle3'),
      description: t('auth.slidePanelDesc3'),
    },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prevIndex) => (prevIndex + 1) % texts.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const prevSlide = () => setIndex((prev) => (prev - 1 + texts.length) % texts.length);
  const nextSlide = () => setIndex((prev) => (prev + 1) % texts.length);

  return (
    <div className="hidden lg:block h-screen sticky top-0">
      <div className="relative flex flex-col justify-between p-12 bg-linear-to-br from-primary via-primary/90 to-purple-600 text-white overflow-hidden h-full dark:from-[#1a0a2e] dark:via-[#1e1145] dark:to-[#0f172a]">
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.1) 1px, transparent 0)',
            backgroundSize: '20px 20px',
          }}
        />

        {/* Animated SVG Icons */}
        <div className="absolute inset-0 opacity-10">
          <svg className="absolute top-[15%] left-[10%] w-16 h-16 animate-float" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          </svg>
          <svg className="absolute top-[25%] right-[15%] w-20 h-20 animate-float-delayed-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
            <circle cx="9" cy="7" r="4" />
          </svg>
          <svg className="absolute bottom-[20%] left-[15%] w-14 h-14 animate-float-delayed-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <circle cx="12" cy="12" r="10" />
            <line x1="2" y1="12" x2="22" y2="12" />
            <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
          </svg>
        </div>

        <div className="relative z-10">
          <Image
            src="/icones/logo-white.svg"
            alt="MboaSMS Logo"
            width={192}
            height={48}
            className="w-48 mb-16"
          />
          <AnimatePresence mode="wait">
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="max-w-md"
            >
              <h1 className="text-4xl font-bold mb-6">{texts[index].title}</h1>
              <p className="text-white/80 text-lg leading-relaxed">
                {texts[index].description}
              </p>
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="relative z-10">
          <div className="flex items-center gap-8">
            <button
              onClick={prevSlide}
              className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center hover:bg-white/10 transition-colors"
              aria-label="Previous"
            >
              <span className="text-sm">←</span>
            </button>
            <div className="flex items-center gap-2">
              {texts.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setIndex(i)}
                  className={cn('h-2 rounded-full transition-all duration-300', i === index ? 'bg-white w-8' : 'bg-white/30 w-2')}
                  aria-label={`Slide ${i + 1}`}
                />
              ))}
            </div>
            <span className="text-sm text-white/60">{index + 1} / {texts.length}</span>
            <button
              onClick={nextSlide}
              className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center hover:bg-white/10 transition-colors"
              aria-label="Next"
            >
              <span className="text-sm">→</span>
            </button>
          </div>
          <p className="text-sm text-white/50 mt-8">© 2025 MboaSMS</p>
        </div>
      </div>
    </div>
  );
}
