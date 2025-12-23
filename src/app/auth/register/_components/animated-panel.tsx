"use client"

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Brand } from '@/shared/common/brand';
import { ArrowLeft, ArrowRight } from 'iconsax-react';
import { cn } from '@/shared/utils/cn';

const texts = [
  {
    title: "Join Our Network",
    description: "Create your account and become part of a qualified ecosystem of professionals and experts. Start building meaningful connections and grow your business with our powerful SMS management platform.",
  },
  {
    title: "Powerful SMS Tools",
    description: "Access a full suite of tools to manage your SMS campaigns, track analytics, and engage with your audience effectively.",
  },
  {
    title: "Secure & Reliable",
    description: "Our platform is built with security in mind, ensuring your data is safe and your messages are delivered reliably every time.",
  },
];

export function AnimatedPanel() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prevIndex) => (prevIndex + 1) % texts.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
        <div className="hidden lg:flex flex-col justify-between p-12 bg-[#111827] text-white relative overflow-hidden">
      <div 
        className="absolute inset-0"
        style={{
          backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.1) 1px, transparent 0)',
          backgroundSize: '20px 20px',
        }}
      ></div>
      <div className="relative z-10">
        <Brand imgClassNames="w-48" className="w-fit mb-16" />
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
            <p className="text-gray-300 text-lg leading-relaxed">
              {texts[index].description}
            </p>
          </motion.div>
        </AnimatePresence>
      </div>
            <div className="relative z-10">
        <div className="flex items-center gap-8">
          <button className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center hover:bg-white/10 transition-colors">
            <ArrowLeft size={16} />
          </button>
          <div className="flex items-center gap-2">
            {texts.map((_, i) => (
              <div key={i} className={cn('w-2 h-2 rounded-full', i === index ? 'bg-white' : 'bg-white/30')} />
            ))}
          </div>
          <span className="text-sm text-gray-400">{index + 1} / {texts.length}</span>
          <button className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center hover:bg-white/10 transition-colors">
            <ArrowRight size={16} />
          </button>
        </div>
        <p className="text-sm text-gray-400 mt-8">© 2025 MboaSMS</p>
      </div>
    </div>
  );
}

