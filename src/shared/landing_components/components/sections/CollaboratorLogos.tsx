"use client";

import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';

type Collaborator = {
  id: number;
  name: string;
  logo: string;
};

const collaborators: Collaborator[] = [
  {
    id: 1,
    name: 'Orange',
    logo: '/images/logos/orange.png',
  },
  {
    id: 2,
    name: 'MTN',
    logo: '/images/logos/mtn.png',
  },
  {
    id: 3,
    name: 'Camtel',
    logo: '/images/logos/camtel.png',
  }
  
];

export default function CollaboratorLogos() {
  return (
    <section className="py-16 bg-[#1E1B24]/50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          <motion.h2 
            className="text-2xl md:text-3xl font-bold text-foreground mb-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            Nos Partenaires
          </motion.h2>
          <motion.p 
            className="text-muted-foreground max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            Nous collaborons avec les meilleurs opérateurs télécom au Cameroun pour vous offrir un service de qualité.
          </motion.p>
        </div>
        
        <div className="flex flex-wrap justify-center items-center gap-8 md:gap-12">
          {collaborators.map((collaborator, index) => (
            <motion.div
              key={collaborator.id}
              className="w-24 h-24 md:w-32 md:h-32 bg-[#2D2A37] rounded-xl p-4 flex items-center justify-center grayscale hover:grayscale-0 transition-all duration-300"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 * index }}
              whileHover={{ scale: 1.05 }}
            >
              <Image
                src={collaborator.logo}
                alt={collaborator.name}
                width={100}
                height={100}
                className="object-contain w-full h-full"
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
