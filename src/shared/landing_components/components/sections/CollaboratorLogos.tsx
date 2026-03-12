"use client";

import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Global } from 'iconsax-react';

type Partner = {
  id: number;
  name: string;
  logo: string | null;
  country: string;
  flag: string;
  type: 'telecom' | 'tech' | 'payment';
};

const partners: Partner[] = [
  {
    id: 1,
    name: 'Orange',
    logo: '/images/logos/orange.png',
    country: 'Multi-pays',
    flag: '🌍',
    type: 'telecom',
  },
  {
    id: 2,
    name: 'MTN',
    logo: '/images/logos/mtn.png',
    country: 'Multi-pays',
    flag: '🌍',
    type: 'telecom',
  },
  {
    id: 3,
    name: 'Camtel',
    logo: '/images/logos/camtel.png',
    country: 'Cameroun',
    flag: '🇨🇲',
    type: 'telecom',
  },
];

// Additional network partners displayed as text badges
const networkPartners = [
  { name: 'Airtel', flag: '🌍', countries: 'Nigeria, Ghana, Kenya' },
  { name: 'Vodafone', flag: '🌍', countries: 'Ghana, Afrique du Sud, UK' },
  { name: 'Moov Africa', flag: '🌍', countries: 'Cote d\'Ivoire, Senegal, Togo' },
  { name: 'Free', flag: '🇫🇷', countries: 'France, Senegal' },
  { name: 'Maroc Telecom', flag: '🇲🇦', countries: 'Maroc' },
  { name: 'Ooredoo', flag: '🇹🇳', countries: 'Tunisie' },
];

export default function CollaboratorLogos() {
  return (
    <section className="py-20 md:py-24 bg-card/50 border-y border-border/50 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-primary/3 to-purple-500/3 rounded-full filter blur-[100px]"></div>
      </div>

      <div className="container mx-auto px-4 md:px-6 relative z-10">
        {/* Header */}
        <div className="text-center mb-14">
          <motion.div
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-6"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <Global variant="Bold" size="16" color="currentColor" />
            Reseau mondial
          </motion.div>

          <motion.h2
            className="text-3xl md:text-4xl font-bold text-foreground mb-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            Nos partenaires operateurs
          </motion.h2>

          <motion.p
            className="text-muted-foreground max-w-2xl mx-auto text-lg"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Connectes aux plus grands operateurs telecoms pour une couverture optimale dans chaque pays
          </motion.p>
        </div>

        {/* Main partners with logos */}
        <div className="flex flex-wrap justify-center items-stretch gap-4 md:gap-6 mb-12">
          {partners.map((partner, index) => (
            <motion.div
              key={partner.id}
              className="group relative w-40 md:w-48 bg-background rounded-2xl border border-border hover:border-primary/30 p-6 flex flex-col items-center justify-center gap-3 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 * index }}
              whileHover={{ y: -4 }}
            >
              {/* Logo */}
              <div className="w-20 h-20 md:w-24 md:h-24 rounded-xl bg-card flex items-center justify-center p-3 group-hover:scale-105 transition-transform duration-300">
                {partner.logo ? (
                  <Image
                    src={partner.logo}
                    alt={partner.name}
                    width={80}
                    height={80}
                    className="object-contain w-full h-full grayscale group-hover:grayscale-0 transition-all duration-300"
                  />
                ) : (
                  <span className="text-2xl font-bold text-primary">{partner.name[0]}</span>
                )}
              </div>

              {/* Name + country */}
              <div className="text-center">
                <div className="font-semibold text-foreground text-sm">{partner.name}</div>
                <div className="flex items-center justify-center gap-1 mt-0.5">
                  <span className="text-xs">{partner.flag}</span>
                  <span className="text-xs text-muted-foreground">{partner.country}</span>
                </div>
              </div>

              {/* Type badge */}
              <span className="text-[10px] uppercase tracking-wider text-primary/70 font-medium bg-primary/5 px-2 py-0.5 rounded-full">
                {partner.type === 'telecom' ? 'Telecom' : partner.type === 'tech' ? 'Tech' : 'Payment'}
              </span>
            </motion.div>
          ))}
        </div>

        {/* Extended network */}
        <motion.div
          className="max-w-3xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <div className="text-center mb-6">
            <span className="text-sm text-muted-foreground font-medium">
              Egalement connectes a
            </span>
          </div>

          <div className="flex flex-wrap justify-center gap-2 md:gap-3">
            {networkPartners.map((np, i) => (
              <motion.div
                key={np.name}
                className="group inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-background border border-border hover:border-primary/30 transition-all duration-300 cursor-default"
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: 0.4 + i * 0.06 }}
                whileHover={{ scale: 1.03 }}
              >
                <span className="text-sm">{np.flag}</span>
                <div>
                  <span className="text-sm font-medium text-foreground">{np.name}</span>
                  <span className="hidden sm:inline text-xs text-muted-foreground ml-1.5">· {np.countries}</span>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Bottom stat */}
          <motion.div
            className="mt-10 text-center"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.7 }}
          >
            <div className="inline-flex items-center gap-6 px-6 py-3 rounded-full bg-background border border-border">
              <div className="text-center">
                <div className="text-lg font-bold text-primary">9+</div>
                <div className="text-[10px] text-muted-foreground uppercase tracking-wider">Operateurs</div>
              </div>
              <div className="w-px h-8 bg-border"></div>
              <div className="text-center">
                <div className="text-lg font-bold text-primary">50+</div>
                <div className="text-[10px] text-muted-foreground uppercase tracking-wider">Pays</div>
              </div>
              <div className="w-px h-8 bg-border"></div>
              <div className="text-center">
                <div className="text-lg font-bold text-primary">100%</div>
                <div className="text-[10px] text-muted-foreground uppercase tracking-wider">Couverture</div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
