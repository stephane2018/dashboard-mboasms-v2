"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { ArrowRight2, MessageText1, Code1, Mobile, UserEdit, People } from 'iconsax-react';
import { Button } from '@/shared/ui';

type ServiceItem = {
  id: string;
  title: string;
  description: string;
  image: string;
  buttonText: string;
  icon: React.ReactNode;
  category: string;
};

const services: ServiceItem[] = [
  {
    id: '01',
    title: 'Un service SMS complet',
    description: 'Notre service de SMS couvre de nombreux cas d&apos;utilisation, assurant des taux de livraison optimaux. Il intègre également des systèmes avancés de protection contre la fraude, des options de personnalisation, et bien d&apos;autres fonctionnalités.',
    image: '/images/woman-phone.png',
    buttonText: 'Suivant',
    icon: <MessageText1 size="32" variant="Bold" className="text-primary" />,
    category: 'SMS Marketing',
  },
  {
    id: '02',
    title: 'Une API fonctionnelle',
    description: 'Découvrez notre API SMS, conçue pour s&apos;intégrer facilement à vos méthodes de travail et de logique. Avec des clés de travail sécuritisées et des ressources complètes, vous pouvez facilement intégrer nos services dans vos options de personnalisation pour réussir à tous les niveaux.',
    image: '/images/woman-phone.png',
    buttonText: 'Suivant',
    icon: <Code1 size="32" variant="Bold" className="text-primary" />,
    category: 'Une API SMS Fonctionnelle',
  },
  {
    id: '03',
    title: 'Une interface Complète',
    description: 'Notre interface conviviale de SMS est conçue pour être simple et intuitive, accessible à tous. Elle garantit des taux de livraison optimaux tout en intégrant des mesures de sécurité avancées pour une communication fiable et sécurisée.',
    image: '/images/woman-phone.png',
    buttonText: 'Suivant',
    icon: <Mobile size="32" variant="Bold" className="text-primary" />,
    category: 'Gestion professionnelle des SMS',
  },
  {
    id: '04',
    title: 'Votre Campagne, c&apos;est vous',
    description: 'Notre service de SMS vous permet de personnaliser chaque message selon vos besoins spécifiques. Que vous soyez une petite entreprise ou une grande organisation, nous offrons des solutions adaptées à toutes les tailles et exigences. Profitez de fonctionnalités avancées qui garantissent des taux de livraison optimaux tout en intégrant des mesures de sécurité robustes contre la fraude.',
    image: '/images/woman-phone.png',
    buttonText: 'Suivant',
    icon: <UserEdit size="32" variant="Bold" className="text-primary" />,
    category: 'Contrôle total par le client',
  },
  {
    id: '05',
    title: 'Un Service Accessible à tous',
    description: 'Découvrez notre service de SMS au Cameroun, utilisable dans de nombreuses situations. Avec des tarifs compétitifs et une interface facile à utiliser, notre service de SMS est accessible à tous. Que vous soyez une petite entreprise ou une grande organisation, nous avons des solutions adaptées à vos besoins.',
    image: '/images/woman-phone.png',
    buttonText: 'Présentation',
    icon: <People size="32" variant="Bold" className="text-primary" />,
    category: 'Des Prix compétitifs',
  },
];

export default function ServicePresentation() {
  const [activeService, setActiveService] = useState(0);
  const [expandedView, setExpandedView] = useState(true);

  const handleTabClick = (index: number) => {
    if (index === activeService && expandedView) {
      setExpandedView(false);
    } else {
      setActiveService(index);
      setExpandedView(true);
    }
  };

  return (
    <section className="py-16 relative overflow-hidden">
      {/* Background decoration icons */}
      <div className="absolute inset-0 overflow-hidden opacity-5 pointer-events-none">
        <div className="absolute top-10 left-10 transform -rotate-12">
          <MessageText1 size="64" variant="Bold" className="text-primary" />
        </div>
        <div className="absolute bottom-20 right-10 transform rotate-12">
          <Code1 size="72" variant="Bold" className="text-primary" />
        </div>
        <div className="absolute top-1/3 right-1/4 transform rotate-45">
          <Mobile size="48" variant="Bold" className="text-primary" />
        </div>
        <div className="absolute bottom-1/3 left-1/4 transform -rotate-12">
          <UserEdit size="56" variant="Bold" className="text-primary" />
        </div>
      </div>
      
      <div className="container mx-auto px-4">
        <div className="mb-12">
          <div className="border-l-4 border-primary pl-4 mb-4">
            <motion.h2 
              className="text-sm md:text-base font-medium text-primary"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              Qui sommes nous ?
            </motion.h2>
          </div>
          <motion.h3 
            className="text-2xl md:text-3xl font-bold text-foreground mb-2"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            Le service SMS Camerounais le plus complet sur le marché,
          </motion.h3>
          <motion.p 
            className="text-xl md:text-2xl font-bold text-foreground"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            le partenaire idéale pour votre communication
          </motion.p>
        </div>

        <div className="relative">
          {/* Main Card with Horizontal Tabs */}
          <div className="flex flex-col md:flex-row gap-6">
            
            
            {/* Vertical Tabs */}
            <div className="flex flex-col md:flex-row justify-between gap-2 w-full">
              {services.map((service, index) => (
                <motion.div
                  key={service.id}
                  className={` rounded-xl cursor-pointer transition-all duration-500 ${index === activeService ? 'border-2 border-primary/30 shadow-lg shadow-primary/20 flex-grow max-w-[936px] h-[371px]' : 'bg-[#E5D1F5]/50 border-2 border-transparent w-24'}`}
                  onClick={() => handleTabClick(index)}
                  whileTap={{ scale: 0.98 }}
                  initial={index === activeService ? { width: '100%', opacity: 1 } : { width: '6rem', opacity: 0.7 }}
                  animate={index === activeService ? 
                    { width: '100%', opacity: 1, transition: { duration: 0.5, ease: 'easeInOut' } } : 
                    { width: '6rem', opacity: 0.7, transition: { duration: 0.5, ease: 'easeInOut' } }
                  }
                  style={{ borderRadius: '12px' }}
                >
                  {index === activeService ? (
                    // Collapsed view of active card
                    <motion.div 
                      className="grid grid-cols-1 md:grid-cols-[2fr_1fr] h-full w-full bg-[#3A1659] rounded-lg overflow-hidden"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.3, delay: 0.2 }}
                    >
                      <div className="p-6 relative overflow-hidden">
                        <div className="absolute mx-auto top-0 left-0 h-full w-10 flex flex-col items-center justify-center py-4 hidden md:flex">
                          <div className="md:transform -rotate-90 whitespace-nowrap text-xs text-muted-foreground uppercase tracking-wider text-white">
                            {service.category}
                          </div>
                        </div>
                        
                        {/* Icon background at corner */}
                        <div className="absolute top-0 right-0 w-32 h-32 opacity-10 transform translate-x-8 -translate-y-8 hidden md:block">
                          <div className="w-full h-full text-primary">
                            {service.icon}
                          </div>
                        </div>
                        
                        {/* Mobile category display */}
                        <div className="md:hidden mb-4">
                          <div className="text-xs uppercase tracking-wider text-white/70 mb-1">
                            {service.category}
                          </div>
                        </div>
                        
                        <div className="ml-0 md:ml-12 border-l-0 md:border-l border-primary/80 h-full px-0 md:px-2 overflow-hidden flex flex-col justify-between">
                          <div>
                            <motion.div 
                              className="flex items-start mb-4"
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ duration: 0.3, delay: 0.3 }}
                            >
                              <div className="text-primary mr-3">{service.id}</div>
                              <h3 className="text-xl md:text-2xl font-bold text-white">{service.title}</h3>
                            </motion.div>
                            
                            <motion.p 
                              className="text-muted-foreground mb-6 text-white text-sm md:text-base"
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              transition={{ duration: 0.3, delay: 0.4 }}
                            >
                              {service.description}
                            </motion.p>
                          </div>
                          
                          <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3, delay: 0.5 }}
                            className="mb-4"
                          >
                            <Button 
                              onClick={() => setExpandedView(true)}
                              variant="default" 
                              className="relative overflow-hidden rounded-lg group bg-primary hover:bg-primary/90 transition-all duration-300 w-full md:w-auto"
                            >
                              <span className="relative flex items-center justify-center">
                                {service.buttonText}
                                <ArrowRight2 size="18" className="ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                              </span>
                            </Button>
                          </motion.div>
                        </div>
                      </div>
                      
                      <motion.div 
                        className="relative h-48 md:h-full min-h-[200px] md:min-h-0 p-4"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: 0.3 }}
                      >
                        {/* Icon illustration overlay */}
                        <div className="absolute inset-0 flex items-center justify-center z-10 opacity-20 pointer-events-none">
                          <div className="transform scale-150 text-white">
                            {service.icon}
                          </div>
                        </div>
                        
                        <Image 
                          src={service.image} 
                          alt={service.title}
                          width={400}
                          height={500}
                          className="object-cover object-center h-full w-full rounded-lg relative z-0"
                        />
                      </motion.div>
                    </motion.div>
                  ) : (
                    // Regular tab view
                    <motion.div 
                      className="p-2 md:p-4 flex flex-col items-center h-full bg-[#E5D1F5]/50 rounded-lg relative overflow-hidden"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="flex flex-col items-center justify-center h-full w-full">
                          <div className="absolute top-2 left-0 right-0 text-center">
                            <div className="text-sm font-medium text-primary">{service.id}</div>
                          </div>
                          <div className="transform -rotate-90 whitespace-nowrap text-xs text-[#3A1659] uppercase tracking-wider font-medium hidden md:block">
                            {service.category}
                          </div>
                          {/* Small icon for visual interest */}
                          <div className="md:hidden opacity-50">
                            {service.icon}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
