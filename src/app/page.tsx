"use client"

import Header from "@/shared/landing_components/components/layout/Header";
import Footer from "@/shared/landing_components/components/layout/Footer";
import ScheduleCallModal from "@/shared/landing_components/components/ScheduleCallModal";
import CollaboratorLogos from "@/shared/landing_components/components/sections/CollaboratorLogos";
import ServicePresentation from "@/shared/landing_components/components/sections/ServicePresentation";
import Testimonials from "@/shared/landing_components/components/sections/Testimonials";
import { Button } from "@/shared/ui/button";
import { motion } from "framer-motion";
import { ArrowRight2, Code1, MessageText1, Mobile, People, UserEdit } from "iconsax-react";
import Image from "next/image";
import { usePricing } from "@/core/hooks/usePricing";
import type { PricingPlanType } from "@/core/models/pricing";

import { useState } from "react";

export default function Home() {
  const [scheduleCallOpen, setScheduleCallOpen] = useState(false);
  const { activePlansQuery } = usePricing();
  
  const activePlans = activePlansQuery.data || [];
  const isLoadingPlans = activePlansQuery.isLoading;

  return (
    <div className="min-h-screen bg-background pt-20">
      <Header />

      {/* Hero Section */}
      <section className="py-16 md:py-24 px-6 md:px-12 lg:px-24 relative overflow-hidden">
        {/* Background elements for light/dark modes */}
        <div className="absolute inset-0 z-0 overflow-hidden">
          {/* Light mode background elements */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-linear-to-br from-primary/15 to-purple-500/20 rounded-full filter blur-3xl opacity-80 dark:opacity-0 transition-opacity duration-1000"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-purple-500/20 to-primary/15 rounded-full filter blur-3xl opacity-80 dark:opacity-0 transition-opacity duration-1000"></div>
          <div className="absolute top-1/3 left-1/4 w-64 h-64 bg-gradient-to-r from-primary-light/20 to-primary/10 rounded-full filter blur-2xl opacity-70 dark:opacity-0 transition-opacity duration-1000"></div>
          
          {/* Dark mode background elements */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-linear-to-br from-primary/30 to-purple-500/20 rounded-full filter blur-3xl opacity-0 dark:opacity-50 transition-opacity duration-1000"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-purple-500/20 to-primary/30 rounded-full filter blur-3xl opacity-0 dark:opacity-50 transition-opacity duration-1000"></div>
          <div className="absolute top-1/3 left-1/4 w-64 h-64 bg-gradient-to-r from-primary-light/30 to-primary/20 rounded-full filter blur-2xl opacity-0 dark:opacity-40 transition-opacity duration-1000"></div>
          
          {/* Animated dots/particles for both modes */}
          <div className="absolute inset-0 opacity-50 dark:opacity-30">
            {/* Larger, more visible points */}
            <div className="absolute top-1/4 left-1/4 w-3 h-3 rounded-full bg-primary animate-pulse"></div>
            <div className="absolute top-3/4 left-1/3 w-4 h-4 rounded-full bg-purple-500 animate-pulse delay-300"></div>
            <div className="absolute top-1/3 right-1/4 w-3 h-3 rounded-full bg-primary-light animate-pulse delay-700"></div>
            <div className="absolute bottom-1/4 right-1/3 w-4 h-4 rounded-full bg-primary animate-pulse delay-500"></div>
            <div className="absolute top-1/2 left-1/2 w-3 h-3 rounded-full bg-purple-500 animate-pulse delay-1000"></div>
            
            {/* Additional points for more density */}
            <div className="absolute top-2/3 left-1/5 w-2 h-2 rounded-full bg-primary-light animate-pulse delay-200"></div>
            <div className="absolute top-1/5 right-1/3 w-3 h-3 rounded-full bg-primary animate-pulse delay-800"></div>
            <div className="absolute bottom-1/3 left-2/3 w-2 h-2 rounded-full bg-purple-500 animate-pulse delay-600"></div>
            <div className="absolute top-2/5 right-1/5 w-3 h-3 rounded-full bg-primary-light animate-pulse delay-400"></div>
            <div className="absolute bottom-2/5 left-1/3 w-2 h-2 rounded-full bg-primary animate-pulse delay-900"></div>
            
            {/* Glowing effect for some points */}
            <div className="absolute top-1/6 right-1/6 w-3 h-3 rounded-full bg-primary shadow-lg shadow-primary/50 animate-pulse delay-350"></div>
            <div className="absolute bottom-1/6 left-1/6 w-3 h-3 rounded-full bg-purple-500 shadow-lg shadow-purple-500/50 animate-pulse delay-750"></div>
          </div>
        </div>
        
        <div className="container mx-auto relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <motion.h1 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="text-4xl md:text-5xl font-bold mb-6 relative"
              >
                <span className="bg-gradient-to-r from-primary via-purple-500 to-primary-light bg-clip-text text-transparent animate-gradient-x bg-300%">
                  Simplifier votre communication
                </span>
                <br />
                <span className="relative">
                  par SMS avec nous
                  <div className="absolute -bottom-2 left-0 w-20 h-1 bg-gradient-to-r from-primary to-purple-500 rounded-full animate-gradient-x"></div>
                </span>
              </motion.h1>
              <motion.p 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="text-muted-foreground mb-8"
              >
                Découvrez le service SMS le plus fiable du Cameroun, avec une couverture nationale et des tarifs compétitifs. Idéal pour les entreprises qui souhaitent communiquer efficacement.
              </motion.p>
              <motion.div 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="flex flex-col sm:flex-row gap-4"
              >
                <Button 
                  onClick={() => setScheduleCallOpen(true)}
                  size="lg" 
                  className="relative overflow-hidden rounded-full group"
                >
                  <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-primary to-purple-500 group-hover:from-purple-500 group-hover:to-primary transition-all duration-500"></span>
                  <span className="absolute -inset-px bg-gradient-to-r from-primary-light to-primary rounded-full animate-gradient-x opacity-50 group-hover:opacity-70 blur-sm transition-opacity duration-500"></span>
                  <span className="relative flex items-center justify-center">
                    Contactez-nous
                    <ArrowRight2 size="18" className="ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                  </span>
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="rounded-full border-primary text-primary hover:bg-primary/10"
                  asChild
                >
                  <a
                    href="https://dashboard.mboasms.com/login"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center"
                  >
                    Accéder à l'espace admin
                    <ArrowRight2 size="18" className="ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                  </a>
                </Button>
              </motion.div>
            </div>
            <motion.div 
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="relative h-[400px] hidden md:block"
            >
              <div className="absolute right-0 top-0 w-full h-full">
                <Image 
                  src="/icones/cameroun.svg" 
                  alt="Carte du Cameroun" 
                  fill
                  className="object-contain"
                />
                <div className="absolute top-[20%] right-[15%] bg-primary text-white p-2 rounded-lg">
                  <p className="text-sm font-bold">Mbao Promo</p>
                  <p className="text-xs">Disponible</p>
                </div>
                <div className="absolute bottom-[30%] left-[20%] bg-primary text-white p-2 rounded-lg">
                  <p className="text-sm font-bold">071266</p>
                  <p className="text-xs">Court code</p>
                </div>
                <div className="absolute bottom-[15%] right-[25%] bg-primary text-white p-2 rounded-lg">
                  <p className="text-sm font-bold">Livraison Efficace</p>
                  <p className="text-xs">Garanti</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Service Presentation Section */}
      <ServicePresentation />
      
      {/* Testimonials Section */}
      <Testimonials />
      
      {/* Collaborator Logos Section */}
      <CollaboratorLogos />

      {/* Platforms Section */}
      <section className="py-16 bg-background relative overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Nos deux plateformes</h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              Choisissez la solution qui correspond le mieux à vos besoins de communication par SMS
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* API SMS Platform */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="bg-linear-to-br from-card to-card rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 group"
            >
              <div className="h-3 bg-gradient-to-r from-primary via-purple-500 to-primary-light animate-gradient-x"></div>
              <div className="p-8 relative overflow-hidden">
                <div className="absolute -right-20 -top-20 w-40 h-40 rounded-full bg-linear-to-br from-primary/10 to-purple-500/5 group-hover:scale-150 transition-transform duration-500"></div>
                <div className="absolute -left-20 -bottom-20 w-40 h-40 rounded-full bg-gradient-to-tr from-primary/10 to-purple-500/5 group-hover:scale-150 transition-transform duration-500"></div>
                
                <div className="flex items-center justify-center mb-6 relative">
                  <div className="w-20 h-20 rounded-full bg-linear-to-br from-primary to-purple-500 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <Code1 size="32" color="#FFFFFF" variant="Bold"/>
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-center mb-4 relative">API SMS</h3>
                <p className="text-muted-foreground text-center mb-6 relative">
                  Accédez à notre API REST pour intégrer les fonctionnalités SMS directement dans vos applications
                </p>
                <ul className="space-y-3 mb-8 relative">
                  <li className="flex items-center">
                    <svg className="w-5 h-5 text-primary mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    <span>Documentation complète</span>
                  </li>
                  <li className="flex items-center">
                    <svg className="w-5 h-5 text-primary mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    <span>Intégration facile</span>
                  </li>
                  <li className="flex items-center">
                    <svg className="w-5 h-5 text-primary mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    <span>Support technique dédié</span>
                  </li>
                </ul>
                <div className="text-center relative">
                  <Button 
                    variant="default" 
                    className="rounded-full bg-gradient-to-r from-primary to-purple-500 hover:from-purple-500 hover:to-primary transition-all duration-500 group-hover:scale-105"
                  >
                    <span className="relative flex items-center justify-center">
                      Accéder à l&apos;API
                      <ArrowRight2 size="18" className="ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                    </span>
                  </Button>
                </div>
              </div>
            </motion.div>
            
            {/* Bulk SMS Platform */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="bg-linear-to-br h-full from-card to-card rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 group"
            >
              <div className="h-3 bg-gradient-to-r from-primary-light via-primary to-primary-light animate-gradient-x"></div>
              <div className="p-8 relative overflow-hidden">
                <div className="absolute -right-20 -top-20 w-40 h-40 rounded-full bg-linear-to-br from-primary/10 to-purple-500/5 group-hover:scale-150 transition-transform duration-500"></div>
                <div className="absolute -left-20 -bottom-20 w-40 h-40 rounded-full bg-gradient-to-tr from-primary/10 to-purple-500/5 group-hover:scale-150 transition-transform duration-500"></div>
                
                <div className="flex items-center justify-center mb-6 relative">
                  <div className="w-20 h-20 rounded-full bg-linear-to-br from-purple-500 to-primary flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <MessageText1 size="32" color="#FFFFFF" variant="Bold"/>
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-center mb-4 relative">Bulk SMS</h3>
                <p className="text-muted-foreground text-center mb-6 relative">
                  Pour gérer vos envois de masse via une interface graphique intuitive
                </p>
                <ul className="space-y-3 mb-8 relative">
                  <li className="flex items-center">
                    <svg className="w-5 h-5 text-primary mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    <span>Interface utilisateur conviviale</span>
                  </li>
                  <li className="flex items-center">
                    <svg className="w-5 h-5 text-primary mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    <span>Gestion des contacts</span>
                  </li>
                  <li className="flex items-center">
                    <svg className="w-5 h-5 text-primary mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    <span>Rapports détaillés</span>
                  </li>
                </ul>
                <div className="text-center relative">
                  <Button 
                    variant="default" 
                    className="rounded-full bg-gradient-to-r from-purple-500 to-primary hover:from-purple-500 hover:to-primary transition-all duration-500 group-hover:scale-105"
                  >
                    <span className="relative flex items-center justify-center">
                      Créer un compte
                      <ArrowRight2 size="18" className="ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                    </span>
                  </Button>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

     
      {/* Mobile App Section */}
      <section className="py-16 bg-[#3A1659] relative overflow-hidden">
        {/* Background decoration elements */}
        <div className="absolute inset-0 overflow-hidden opacity-10 pointer-events-none">
          <div className="absolute top-10 left-10 transform rotate-12">
            <Mobile size="64" variant="Bold" className="text-white" />
          </div>
          <div className="absolute bottom-20 right-10 transform -rotate-12">
            <Mobile size="72" variant="Bold" className="text-white" />
          </div>
          <div className="absolute top-1/3 right-1/4 transform rotate-45">
            <Mobile size="48" variant="Bold" className="text-white" />
          </div>
        </div>
        
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="relative h-[400px] md:h-[500px] order-2 md:order-1"
            >
              <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#3A1659] md:hidden z-10"></div>
              <Image 
                src="/phone.png" 
                alt="MboaSMS Mobile App" 
                fill
                className="object-contain z-0"
              />
            </motion.div>
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="order-1 md:order-2"
            >
              <div className="inline-block bg-primary/20 text-white px-4 py-2 rounded-full mb-4">
                <span className="text-sm font-medium">Le service disponible partout avec vous</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white">
                Découvrez votre service SMS Camerounais, désormais disponible sur votre application mobile!
              </h2>
              <p className="text-white/80 mb-8">
                Accédez à toutes les fonctionnalités de MboaSMS directement depuis votre smartphone. Envoyez des SMS, suivez vos campagnes et gérez vos contacts en déplacement.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <Button variant="default" size="lg" className="relative overflow-hidden rounded-full group bg-white hover:bg-white/90 px-6 py-3 h-auto">
                  <span className="relative flex items-center justify-center text-[#3A1659]">
                    <svg className="w-6 h-6 mr-3" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M3.93 20.42c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11"/>
                    </svg>
                    Télécharger sur<br/>
                    <span className="font-bold">Google Play</span>
                  </span>
                </Button>
                
                <Button variant="default" size="lg" className="relative overflow-hidden rounded-full group bg-gradient-to-r from-purple-500 to-primary hover:from-primary hover:to-purple-500 px-6 py-3 h-auto border-0">
                  <span className="relative flex items-center justify-center text-white">
                    <svg className="w-6 h-6 mr-3" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M3.93 20.42c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11"/>
                    </svg>
                    Télécharger sur<br/>
                    <span className="font-bold">App Store</span>
                  </span>
                </Button>
              </div>
              
              <div className="mt-6 flex items-center bg-white/10 rounded-xl p-4 backdrop-blur-sm">
                <div className="flex -space-x-2 mr-4">
                  <div className="w-8 h-8 rounded-full border-2 border-[#3A1659] bg-primary"></div>
                  <div className="w-8 h-8 rounded-full border-2 border-[#3A1659] bg-purple-500"></div>
                  <div className="w-8 h-8 rounded-full border-2 border-[#3A1659] bg-blue-500"></div>
                </div>
                <div>
                  <p className="text-white text-sm">+1000 téléchargements</p>
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <svg key={i} className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292z"></path>
                      </svg>
                    ))}
                    <span className="ml-1 text-white text-sm">4.9/5</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Pricing Section with Background */}
      <section className="py-16 md:py-24 px-6 md:px-12 lg:px-24 relative bg-white overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 z-0 opacity-10 mix-blend-soft-light">
          <Image 
            src="/trait.png" 
            alt="Background Pattern" 
            fill
            className="object-cover"
          />
        </div>
        
        {/* Gradient corner circles */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-linear-to-br from-primary/30 to-purple-500/20 rounded-full filter blur-xl opacity-70"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-tr from-purple-500/20 to-primary/30 rounded-full filter blur-xl opacity-70"></div>
        
        <div className="container mx-auto relative z-10">
          <div className="text-center mb-12">
            <motion.div
              className="inline-flex items-center bg-primary/10 text-primary rounded-full px-4 py-1.5 mb-6"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <span className="flex items-center text-sm font-medium">
                <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M21 9V3H15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M3 15V21H9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M21 3L13.5 10.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M10.5 13.5L3 21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Tarifs transparents et sans surprises
              </span>
            </motion.div>
            
            <motion.h2 
              className="text-3xl md:text-4xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-primary-light via-primary to-purple-500"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              Choisissez le forfait qui vous convient
            </motion.h2>
            
            <motion.p
              className="text-gray-700 max-w-2xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              Des tarifs adaptés à tous les besoins, de l&apos;entrepreneur individuel à la grande entreprise.
              <span className="block mt-2 text-primary">Pas d&apos;engagement, pas de frais cachés.</span>
            </motion.p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-6 lg:gap-8">
            {isLoadingPlans ? (
              // Loading skeleton
              Array.from({ length: 3 }).map((_, index) => (
                <div key={index} className="animate-pulse">
                  <div className="bg-gray-200 rounded-2xl h-96"></div>
                </div>
              ))
            ) : activePlans.length > 0 ? (
              activePlans.map((plan: PricingPlanType, index: number) => (
                <motion.div
                  key={plan.id}
                  className="relative rounded-2xl overflow-hidden h-full bg-white border border-gray-200 shadow-lg text-gray-800"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.1 + index * 0.1 }}
                >
                  <div className="flex flex-col h-full p-6 md:p-8">
                    <div className="mb-6 flex items-center">
                      <div className="w-12 h-12 rounded-full flex items-center justify-center bg-primary/10 mr-4">
                        <MessageText1 size="24" variant="Bulk" color="currentColor" className="text-primary" />
                      </div>
                      <h3 className="text-xl font-bold text-gray-800">{plan.planNameFr}</h3>
                    </div>
                    
                    <div className="mb-6">
                      <div className="flex items-baseline">
                        <span className="text-4xl font-bold text-primary">{plan.smsUnitPrice}</span>
                        <span className="ml-2 text-gray-600">FCFA / SMS</span>
                      </div>
                    </div>
                    
                    <ul className="space-y-4 mb-8 flex-grow">
                      <li className="flex items-center">
                        <svg className="w-5 h-5 mr-3 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                        <span className="text-gray-700">{plan.minSMS} - {plan.maxSMS} SMS</span>
                      </li>
                      <li className="flex items-center">
                        <svg className="w-5 h-5 mr-3 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                        <span className="text-gray-700">Valide {plan.nbDaysToExpired} jours</span>
                      </li>
                      <li className="flex items-center">
                        <svg className="w-5 h-5 mr-3 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                        <span className="text-gray-700">{plan.descriptionFr}</span>
                      </li>
                    </ul>
                    
                    <div className="text-center">
                      <Button 
                        variant="default" 
                        className="w-full rounded-lg bg-gradient-to-r from-primary to-purple-500 hover:from-purple-500 hover:to-primary text-white"
                      >
                        <span className="flex items-center justify-center">
                          Choisir ce forfait
                          <ArrowRight2 size="18"  variant="Bulk" color="currentColor" className="text-primary ml-2" />
                        </span>
                      </Button>
                    </div>
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <p className="text-gray-500">Aucun plan disponible pour le moment.</p>
              </div>
            )}
          </div>
          
          <div className="mt-16 text-center">
            <p className="text-gray-700 mb-6">Besoin d&apos;une solution personnalisée pour votre entreprise?</p>
            <Button variant="outline" className="relative overflow-hidden rounded-full group border-gray-200 text-gray-800 hover:bg-gray-100">
              <span className="absolute inset-0 bg-gradient-to-r from-primary/20 to-purple-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
              <span className="relative flex items-center justify-center">
                Contactez notre équipe commerciale
                <ArrowRight2 size="18"  variant="Bulk" color="currentColor" className="text-primary ml-2 group-hover:translate-x-1 transition-transform duration-300" />
              </span>
            </Button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-primary text-white px-6 md:px-12 lg:px-24">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Prêt à commencer l&apos;envoie de vos SMS avec MboaSMS?
          </h2>
          <p className="text-lg mb-8 max-w-2xl mx-auto">
            Inscrivez-vous gratuitement et commencez sans engagement pour une meilleure communication.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="secondary" size="lg" className="relative overflow-hidden rounded-full group bg-white">
              <span className="absolute inset-0 w-full h-full bg-white group-hover:bg-gray-100 transition-all duration-300 rounded-full"></span>
              <span className="absolute -inset-px rounded-full border-2 border-transparent bg-gradient-to-r from-primary-light via-primary to-purple-500 opacity-70 group-hover:opacity-100 mask-border animate-gradient-x"></span>
              <span className="relative flex items-center justify-center text-primary">
                Inscrivez-vous gratuitement
                <ArrowRight2 variant="Bulk" color="currentColor" size="18" className="text-primary ml-2 group-hover:translate-x-1 transition-transform duration-300" />
              </span>
            </Button>
            <Button 
              onClick={() => setScheduleCallOpen(true)}
              variant="outline" 
              className="relative overflow-hidden rounded-full group border-white"
            >
              <span className="absolute inset-0 border border-white rounded-full group-hover:border-transparent group-hover:bg-white/10 transition-all duration-300"></span>
              <span className="absolute inset-0 border-2 border-transparent bg-gradient-to-r from-white via-primary-light to-white opacity-0 group-hover:opacity-30 rounded-full mask-border animate-gradient-x transition-opacity duration-300"></span>
              <span className="relative text-white flex items-center justify-center">
                Contactez-Nous
                <ArrowRight2 size="18"  variant="Bulk" color="currentColor" className="ml-2 group-hover:translate-x-1 transition-transform duration-300" />
              </span>
            </Button>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <div className="mt-24 relative">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-purple-500/5 rounded-2xl"></div>
        <div className="absolute -top-6 -right-6 w-32 h-32 bg-linear-to-br from-primary/20 to-purple-500/10 rounded-full filter blur-xl"></div>
        <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-gradient-to-tr from-purple-500/10 to-primary/20 rounded-full filter blur-xl"></div>
        
        <div className="relative bg-white border border-gray-100 shadow-lg rounded-2xl p-8 md:p-10 text-center">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-purple-500 to-primary-light"></div>
          
          <div className="mb-8 inline-flex items-center justify-center p-2 bg-primary/5 rounded-full">
            <svg className="w-6 h-6 text-primary" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M21.97 18.33C21.97 18.69 21.89 19.06 21.72 19.42C21.55 19.78 21.33 20.12 21.04 20.44C20.55 20.98 20.01 21.37 19.4 21.62C18.8 21.87 18.15 22 17.45 22C16.43 22 15.34 21.76 14.19 21.27C13.04 20.78 11.89 20.12 10.75 19.29C9.6 18.45 8.51 17.52 7.47 16.49C6.44 15.45 5.51 14.36 4.68 13.22C3.86 12.08 3.2 10.94 2.72 9.81C2.24 8.67 2 7.58 2 6.54C2 5.86 2.12 5.21 2.36 4.61C2.6 4 2.98 3.44 3.51 2.94C4.15 2.31 4.85 2 5.59 2C5.87 2 6.15 2.06 6.4 2.18C6.66 2.3 6.89 2.48 7.07 2.74L9.39 6.01C9.57 6.26 9.7 6.49 9.79 6.71C9.88 6.92 9.93 7.13 9.93 7.32C9.93 7.56 9.86 7.8 9.72 8.03C9.59 8.26 9.4 8.5 9.16 8.74L8.4 9.53C8.29 9.64 8.24 9.77 8.24 9.93C8.24 10.01 8.25 10.08 8.27 10.16C8.3 10.24 8.33 10.3 8.35 10.36C8.53 10.69 8.84 11.12 9.28 11.64C9.73 12.16 10.21 12.69 10.73 13.22C11.27 13.75 11.79 14.24 12.32 14.69C12.84 15.13 13.27 15.43 13.61 15.61C13.66 15.63 13.72 15.66 13.79 15.69C13.87 15.72 13.95 15.73 14.04 15.73C14.21 15.73 14.34 15.67 14.45 15.56L15.21 14.81C15.46 14.56 15.7 14.37 15.93 14.25C16.16 14.11 16.39 14.04 16.64 14.04C16.83 14.04 17.03 14.08 17.25 14.17C17.47 14.26 17.7 14.39 17.95 14.56L21.26 16.91C21.52 17.09 21.7 17.31 21.81 17.55C21.91 17.8 21.97 18.05 21.97 18.33Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          
          <h3 className="text-2xl md:text-3xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-primary via-purple-600 to-primary-light">Besoin d&apos;une solution personnalisée?</h3>
          
          <p className="text-gray-700 mb-8 max-w-xl mx-auto">Notre équipe d&apos;experts est prête à concevoir une solution SMS sur mesure adaptée aux besoins spécifiques de votre entreprise.</p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              onClick={() => setScheduleCallOpen(true)}
              variant="default" 
              className="relative overflow-hidden rounded-full group bg-gradient-to-r from-primary to-purple-500 hover:from-purple-500 hover:to-primary text-white px-6 py-3"
            >
              <span className="relative flex items-center justify-center font-medium">
                Planifier un appel
                <svg className="w-5 h-5 ml-2" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M8 2V5M16 2V5M3.5 9.09H20.5M21 8.5V17C21 20 19.5 22 16 22H8C4.5 22 3 20 3 17V8.5C3 5.5 4.5 3.5 8 3.5H16C19.5 3.5 21 5.5 21 8.5Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M15.6947 13.7H15.7037M15.6947 16.7H15.7037M11.9955 13.7H12.0045M11.9955 16.7H12.0045M8.29431 13.7H8.30329M8.29431 16.7H8.30329" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </span>
            </Button>
            
            <Button 
              variant="outline" 
              className="relative overflow-hidden rounded-full group border-gray-300 text-gray-800 hover:bg-gray-50"
            >
              <span className="absolute inset-0 bg-gradient-to-r from-primary/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
              <span className="relative flex items-center justify-center font-medium">
                Contactez notre équipe
                <ArrowRight2 size="20" className="ml-2 group-hover:translate-x-1 transition-transform duration-300" />
              </span>
            </Button>
          </div>
        </div>
      </div>

      <Footer />
      
      {/* Schedule Call Modal */}
      <ScheduleCallModal 
        isOpen={scheduleCallOpen} 
        onClose={() => setScheduleCallOpen(false)} 
      />
    </div>
  );
}
