"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { QuoteUp, ArrowLeft2, ArrowRight2, Star1 } from 'iconsax-react';

type Testimonial = {
  id: number;
  name: string;
  role: string;
  company: string;
  avatar: string;
  quote: string;
  rating: number;
};

const testimonials: Testimonial[] = [
  {
    id: 1,
    name: 'Jean Mbarga',
    role: 'Directeur Marketing',
    company: 'TechCorp Cameroun',
    avatar: '/images/testimonials/avatar1.png',
    quote: 'Le service SMS de MboaSMS a considérablement amélioré notre communication avec nos clients. Les taux de livraison sont excellents et l\'interface est très intuitive.',
    rating: 5,
  },
  {
    id: 2,
    name: 'Marie Atangana',
    role: 'Responsable Communication',
    company: 'Boutique en ligne Douala',
    avatar: '/images/testimonials/avatar2.png',
    quote: 'Nous utilisons l\'API SMS pour nos notifications de commande et c\'est un vrai plus pour notre service client. Simple à intégrer et fiable.',
    rating: 4,
  },
  {
    id: 3,
    name: 'Paul Biya',
    role: 'Gérant',
    company: 'Restaurant Le Mboa',
    avatar: '/images/testimonials/avatar3.png',
    quote: 'Excellent rapport qualité-prix. Nous envoyons des promotions hebdomadaires à nos clients et avons constaté une augmentation significative de la fréquentation.',
    rating: 5,
  },
];

export default function Testimonials() {
  const [currentIndex, setCurrentIndex] = useState(0);
  
  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? testimonials.length - 1 : prev - 1));
  };
  
  const handleNext = () => {
    setCurrentIndex((prev) => (prev === testimonials.length - 1 ? 0 : prev + 1));
  };

  return (
    <section className="py-16 bg-gradient-to-b from-[#1E1B24] to-[#3A1659]/80">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <motion.div
            className="inline-block mb-4 bg-primary/20 p-2 rounded-full"
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <QuoteUp size="32" variant="Bold" className="text-primary" />
          </motion.div>
          
          <motion.h2 
            className="text-2xl md:text-3xl font-bold text-white mb-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            Ce que nos clients disent
          </motion.h2>
          
          <motion.p 
            className="text-white/80 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Découvrez les expériences de nos clients avec notre service SMS
          </motion.p>
        </div>
        
        <div className="max-w-4xl mx-auto relative">
          <AnimatePresence mode="wait">
            <motion.div 
              key={currentIndex}
              className="bg-gradient-to-br from-[#2D2A37] to-[#3A1659] rounded-xl p-6 md:p-8 relative border border-primary/20 shadow-lg shadow-primary/5"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.5 }}
            >
              {/* Decorative elements */}
              <div className="absolute top-0 right-0 transform translate-x-4 -translate-y-4 bg-gradient-to-r from-primary to-purple-500 rounded-full p-4 text-white shadow-lg">
                <QuoteUp size="24" variant="Bold" />
              </div>
              
              <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-primary/5 rounded-full blur-3xl"></div>
              <div className="absolute -top-5 -right-5 w-20 h-20 bg-purple-500/5 rounded-full blur-xl"></div>
              
              <div className="flex flex-col md:flex-row items-center md:items-start gap-6 relative z-10">
                <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-gradient-to-r from-primary to-purple-500 flex-shrink-0 shadow-lg shadow-primary/20">
                  <div className="absolute inset-0 rounded-full bg-gradient-to-r from-primary/20 to-purple-500/20 blur-md"></div>
                  <Image 
                    src={testimonials[currentIndex].avatar} 
                    alt={testimonials[currentIndex].name}
                    width={96}
                    height={96}
                    className="object-cover w-full h-full relative z-10"
                  />
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star1 
                        key={i} 
                        size="18" 
                        variant={i < testimonials[currentIndex].rating ? "Bold" : "Linear"} 
                        className={i < testimonials[currentIndex].rating ? "text-yellow-400 drop-shadow-md" : "text-gray-400"} 
                      />
                    ))}
                  </div>
                  
                  <blockquote className="text-lg md:text-xl text-white bg-gradient-to-r from-white to-white/80 bg-clip-text italic mb-6 relative">
                    <span className="absolute -left-2 -top-2 text-white/20 text-4xl">“</span>
                    <span className="relative text-white z-10">{testimonials[currentIndex].quote}</span>
                    <span className="absolute -right-2 bottom-0 text-white/20 text-4xl">”</span>
                  </blockquote>
                  
                  <div className="relative">
                    <h4 className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary-light to-primary">{testimonials[currentIndex].name}</h4>
                    <p className="text-white/70 text-sm">{testimonials[currentIndex].role}, <span className="text-primary/90">{testimonials[currentIndex].company}</span></p>
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
          
          <div className="flex justify-between items-center mt-12">
            <button 
              onClick={handlePrev}
              className="bg-gradient-to-r from-[#2D2A37] to-[#3A1659] hover:from-primary hover:to-purple-500 text-white p-4 rounded-full transition-all duration-300 shadow-lg shadow-primary/10 group"
              aria-label="Previous testimonial"
            >
              <ArrowLeft2 size="20" className="group-hover:scale-110 transition-transform duration-300" />
            </button>
            
            <div className="flex space-x-3">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${index === currentIndex ? 'bg-gradient-to-r from-primary to-purple-500 scale-125 shadow-md shadow-primary/20' : 'bg-white/20 hover:bg-white/40'}`}
                  aria-label={`Go to testimonial ${index + 1}`}
                />
              ))}
            </div>
            
            <button 
              onClick={handleNext}
              className="bg-gradient-to-r from-[#2D2A37] to-[#3A1659] hover:from-primary hover:to-purple-500 text-white p-4 rounded-full transition-all duration-300 shadow-lg shadow-primary/10 group"
              aria-label="Next testimonial"
            >
              <ArrowRight2 size="20" className="group-hover:scale-110 transition-transform duration-300" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
