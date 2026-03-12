"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { QuoteUp, ArrowLeft2, ArrowRight2, Star1, Global } from 'iconsax-react';

type Testimonial = {
  id: number;
  name: string;
  role: string;
  company: string;
  initials: string;
  country: string;
  flag: string;
  quote: string;
  rating: number;
  color: string;
};

const testimonials: Testimonial[] = [
  {
    id: 1,
    name: 'Jean-Pierre Mbarga',
    role: 'Directeur Marketing',
    company: 'TechCorp Cameroun',
    initials: 'JM',
    country: 'Cameroun',
    flag: '🇨🇲',
    quote: 'MboaSMS a transforme notre communication client. Nos campagnes SMS atteignent un taux d\'ouverture de 98% et nos ventes ont augmente de 35% depuis qu\'on utilise leur plateforme.',
    rating: 5,
    color: 'from-purple-500 to-violet-600',
  },
  {
    id: 2,
    name: 'Aminata Diallo',
    role: 'CEO',
    company: 'DigiPay Senegal',
    initials: 'AD',
    country: 'Senegal',
    flag: '🇸🇳',
    quote: 'L\'API est remarquablement bien documentee. Notre equipe technique a integre l\'envoi de SMS transactionnels en moins de 2 heures. La fiabilite est au rendez-vous, meme en periode de forte charge.',
    rating: 5,
    color: 'from-emerald-500 to-teal-600',
  },
  {
    id: 3,
    name: 'Kwame Asante',
    role: 'Head of Growth',
    company: 'FinTech Hub Accra',
    initials: 'KA',
    country: 'Ghana',
    flag: '🇬🇭',
    quote: 'We switched from a US-based provider to MboaSMS and our delivery rates in West Africa went from 85% to 99%. The pricing is unbeatable for the African market.',
    rating: 5,
    color: 'from-amber-500 to-orange-600',
  },
  {
    id: 4,
    name: 'Sophie Laurent',
    role: 'Responsable CRM',
    company: 'E-Commerce Paris',
    initials: 'SL',
    country: 'France',
    flag: '🇫🇷',
    quote: 'Nous gerons nos campagnes SMS pour la France et l\'Afrique depuis un seul dashboard. La possibilite d\'avoir des tarifs par pays et un reporting unifie est un vrai gain de temps.',
    rating: 4,
    color: 'from-sky-500 to-blue-600',
  },
  {
    id: 5,
    name: 'Chidi Okonkwo',
    role: 'Product Manager',
    company: 'LogiTrack Nigeria',
    initials: 'CO',
    country: 'Nigeria',
    flag: '🇳🇬',
    quote: 'Our delivery notifications reach customers in under 3 seconds. MboaSMS handles over 50,000 SMS daily for us without a single hiccup. Their support team is also incredibly responsive.',
    rating: 5,
    color: 'from-rose-500 to-pink-600',
  },
];

export default function Testimonials() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(1);

  const handlePrev = useCallback(() => {
    setDirection(-1);
    setCurrentIndex((prev) => (prev === 0 ? testimonials.length - 1 : prev - 1));
  }, []);

  const handleNext = useCallback(() => {
    setDirection(1);
    setCurrentIndex((prev) => (prev === testimonials.length - 1 ? 0 : prev + 1));
  }, []);

  // Auto-advance every 6 seconds
  useEffect(() => {
    const timer = setInterval(handleNext, 6000);
    return () => clearInterval(timer);
  }, [handleNext]);

  const current = testimonials[currentIndex];

  const slideVariants = {
    enter: (dir: number) => ({ x: dir > 0 ? 80 : -80, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (dir: number) => ({ x: dir > 0 ? -80 : 80, opacity: 0 }),
  };

  return (
    <section className="py-20 md:py-28 bg-gradient-to-b from-card via-card/80 to-background relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-gradient-to-br from-primary/5 to-transparent rounded-full filter blur-[100px]"></div>
        <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-gradient-to-tl from-purple-500/5 to-transparent rounded-full filter blur-[80px]"></div>
      </div>

      <div className="container mx-auto px-4 md:px-6 relative z-10">
        {/* Section header */}
        <div className="text-center mb-14">
          <motion.div
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-6"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <QuoteUp variant="Bold" size="16" color="currentColor" />
            Temoignages clients
          </motion.div>

          <motion.h2
            className="text-3xl md:text-4xl font-bold text-foreground mb-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            Ils nous font confiance a travers le monde
          </motion.h2>

          <motion.p
            className="text-muted-foreground max-w-2xl mx-auto text-lg"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Des entreprises de tous secteurs et de tous pays partagent leur experience
          </motion.p>
        </div>

        {/* Testimonial card */}
        <div className="max-w-4xl mx-auto">
          <div className="relative min-h-[320px] md:min-h-[280px]">
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={currentIndex}
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                className="absolute inset-0"
              >
                <div className="relative bg-card rounded-2xl border border-border p-8 md:p-10 shadow-lg hover:shadow-xl transition-shadow duration-300">
                  {/* Gradient top line */}
                  <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${current.color} rounded-t-2xl`}></div>

                  {/* Quote icon */}
                  <div className={`absolute -top-5 right-8 w-10 h-10 rounded-xl bg-gradient-to-br ${current.color} flex items-center justify-center shadow-lg`}>
                    <QuoteUp size="18" color="white" variant="Bold" />
                  </div>

                  <div className="flex flex-col md:flex-row gap-6 md:gap-8">
                    {/* Avatar + info */}
                    <div className="flex md:flex-col items-center md:items-start gap-4 md:gap-3 md:min-w-[160px]">
                      {/* Avatar with initials */}
                      <div className={`w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-gradient-to-br ${current.color} flex items-center justify-center shadow-lg shrink-0`}>
                        <span className="text-white font-bold text-xl md:text-2xl">{current.initials}</span>
                      </div>

                      <div>
                        <h4 className="font-bold text-foreground">{current.name}</h4>
                        <p className="text-sm text-muted-foreground">{current.role}</p>
                        <p className="text-sm text-primary font-medium">{current.company}</p>
                        <div className="flex items-center gap-1.5 mt-1.5">
                          <span className="text-sm">{current.flag}</span>
                          <span className="text-xs text-muted-foreground">{current.country}</span>
                        </div>
                      </div>
                    </div>

                    {/* Quote content */}
                    <div className="flex-1">
                      {/* Stars */}
                      <div className="flex items-center gap-0.5 mb-4">
                        {[...Array(5)].map((_, i) => (
                          <Star1
                            key={i}
                            size="18"
                            color="currentColor"
                            variant={i < current.rating ? "Bold" : "Linear"}
                            className={i < current.rating ? "text-amber-400" : "text-border"}
                          />
                        ))}
                      </div>

                      {/* Quote text */}
                      <blockquote className="text-foreground text-lg md:text-xl leading-relaxed italic relative">
                        <span className="text-3xl text-primary/20 absolute -left-1 -top-2 leading-none">&ldquo;</span>
                        <span className="relative z-10 pl-4">{current.quote}</span>
                        <span className="text-3xl text-primary/20 leading-none">&rdquo;</span>
                      </blockquote>
                    </div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Controls */}
          <div className="flex justify-between items-center mt-8">
            <button
              onClick={handlePrev}
              className="w-12 h-12 rounded-xl bg-card border border-border hover:border-primary/40 hover:bg-primary/5 flex items-center justify-center transition-all duration-200 group"
              aria-label="Temoignage precedent"
            >
              <ArrowLeft2 size="18" color="currentColor" className="text-muted-foreground group-hover:text-primary transition-colors" />
            </button>

            {/* Dots + counter */}
            <div className="flex items-center gap-4">
              <div className="flex gap-2">
                {testimonials.map((t, index) => (
                  <button
                    key={t.id}
                    onClick={() => {
                      setDirection(index > currentIndex ? 1 : -1);
                      setCurrentIndex(index);
                    }}
                    className={`h-2 rounded-full transition-all duration-300 ${
                      index === currentIndex
                        ? 'w-8 bg-primary'
                        : 'w-2 bg-border hover:bg-muted-foreground/50'
                    }`}
                    aria-label={`Temoignage ${index + 1}`}
                  />
                ))}
              </div>
              <span className="text-xs text-muted-foreground tabular-nums">
                {String(currentIndex + 1).padStart(2, '0')} / {String(testimonials.length).padStart(2, '0')}
              </span>
            </div>

            <button
              onClick={handleNext}
              className="w-12 h-12 rounded-xl bg-card border border-border hover:border-primary/40 hover:bg-primary/5 flex items-center justify-center transition-all duration-200 group"
              aria-label="Temoignage suivant"
            >
              <ArrowRight2 size="18" color="currentColor" className="text-muted-foreground group-hover:text-primary transition-colors" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
