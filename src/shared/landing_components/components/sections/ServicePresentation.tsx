"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight2, MessageText1, Code1, Mobile, UserEdit, People, Global, ShieldTick, Chart2, Sms, Timer1, Wallet2, Send2, ProfileCircle, CalendarTick } from 'iconsax-react';
import { Button } from '@/shared/ui';

// ─── Illustration Components ────────────────────────────────────────────────

function GlobeIllustration() {
  const dots = [
    { x: 30, y: 25, flag: "🇫🇷", delay: 0 },
    { x: 70, y: 20, flag: "🇬🇧", delay: 0.2 },
    { x: 20, y: 50, flag: "🇺🇸", delay: 0.4 },
    { x: 55, y: 55, flag: "🇨🇲", delay: 0.1 },
    { x: 45, y: 40, flag: "🇳🇬", delay: 0.3 },
    { x: 75, y: 60, flag: "🇿🇦", delay: 0.5 },
    { x: 35, y: 70, flag: "🇸🇳", delay: 0.6 },
    { x: 80, y: 35, flag: "🇧🇪", delay: 0.7 },
  ];

  return (
    <div className="relative w-full h-full flex items-center justify-center">
      {/* Globe circle */}
      <div className="relative w-52 h-52 md:w-64 md:h-64">
        <div className="absolute inset-0 rounded-full border-2 border-white/20"></div>
        <div className="absolute inset-3 rounded-full border border-white/10"></div>
        <div className="absolute inset-6 rounded-full border border-white/5"></div>
        {/* Grid lines */}
        <div className="absolute top-1/3 left-2 right-2 border-t border-dashed border-white/10"></div>
        <div className="absolute top-2/3 left-2 right-2 border-t border-dashed border-white/10"></div>
        <div className="absolute left-1/3 top-2 bottom-2 border-l border-dashed border-white/10"></div>
        <div className="absolute left-2/3 top-2 bottom-2 border-l border-dashed border-white/10"></div>

        {/* SVG connections */}
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100">
          <motion.line x1="55" y1="55" x2="30" y2="25" stroke="rgba(168,85,247,0.4)" strokeWidth="0.5"
            initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1.5, delay: 0.5, repeat: Infinity, repeatType: "reverse", repeatDelay: 2 }} />
          <motion.line x1="55" y1="55" x2="20" y2="50" stroke="rgba(168,85,247,0.3)" strokeWidth="0.5"
            initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1.5, delay: 0.8, repeat: Infinity, repeatType: "reverse", repeatDelay: 2 }} />
          <motion.line x1="55" y1="55" x2="75" y2="60" stroke="rgba(168,85,247,0.3)" strokeWidth="0.5"
            initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1.5, delay: 1.1, repeat: Infinity, repeatType: "reverse", repeatDelay: 2 }} />
        </svg>

        {/* Country dots with flags */}
        {dots.map((dot, i) => (
          <motion.div
            key={i}
            className="absolute group"
            style={{ left: `${dot.x}%`, top: `${dot.y}%`, transform: 'translate(-50%, -50%)' }}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.3 + dot.delay, type: "spring", stiffness: 200 }}
          >
            <div className="relative">
              <div className="w-3 h-3 rounded-full bg-purple-400 shadow-lg shadow-purple-400/50"></div>
              <div className="absolute inset-0 w-3 h-3 rounded-full bg-purple-400/40 animate-ping"></div>
              <motion.span
                className="absolute -top-7 left-1/2 -translate-x-1/2 text-lg drop-shadow-lg"
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 + dot.delay }}
              >
                {dot.flag}
              </motion.span>
            </div>
          </motion.div>
        ))}

        {/* Center pulse */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
          <div className="w-4 h-4 rounded-full bg-white/30 animate-pulse"></div>
        </div>
      </div>

      {/* Floating SMS badge */}
      <motion.div
        className="absolute top-4 right-4 bg-white/15 backdrop-blur-sm rounded-lg px-3 py-2 border border-white/10"
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 1.2 }}
      >
        <div className="flex items-center gap-2">
          <Sms size="16" color="currentColor" className="text-purple-300" variant="Bold" />
          <div>
            <div className="text-[10px] text-white/60">Envois</div>
            <div className="text-sm font-bold text-white">10M+</div>
          </div>
        </div>
      </motion.div>

      {/* Delivery rate badge */}
      <motion.div
        className="absolute bottom-4 left-4 bg-white/15 backdrop-blur-sm rounded-lg px-3 py-2 border border-white/10"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 1.4 }}
      >
        <div className="flex items-center gap-2">
          <ShieldTick size="16" color="currentColor" className="text-green-400" variant="Bold" />
          <div>
            <div className="text-[10px] text-white/60">Delivrabilite</div>
            <div className="text-sm font-bold text-white">98%</div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

function ApiIllustration() {
  return (
    <div className="relative w-full h-full flex items-center justify-center p-4">
      {/* Terminal window */}
      <motion.div
        className="w-full max-w-xs bg-gray-900/80 rounded-xl border border-white/10 overflow-hidden shadow-2xl"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        {/* Terminal header */}
        <div className="flex items-center gap-1.5 px-3 py-2.5 bg-gray-800/80 border-b border-white/5">
          <div className="w-2.5 h-2.5 rounded-full bg-red-400/80"></div>
          <div className="w-2.5 h-2.5 rounded-full bg-yellow-400/80"></div>
          <div className="w-2.5 h-2.5 rounded-full bg-green-400/80"></div>
          <span className="text-[10px] text-white/40 ml-2 font-mono">api.mboasms.com</span>
        </div>
        {/* Code content */}
        <div className="p-3 font-mono text-[11px] leading-relaxed space-y-1.5">
          <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5 }}>
            <span className="text-emerald-400">POST</span>{" "}
            <span className="text-white/80">/v1/sms/send</span>
          </motion.div>
          <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.7 }}>
            <span className="text-white/30">{"{"}</span>
          </motion.div>
          <motion.div className="pl-3" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.8 }}>
            <span className="text-sky-400">&quot;to&quot;</span><span className="text-white/40">: </span>
            <span className="text-amber-300">&quot;+237...&quot;</span><span className="text-white/30">,</span>
          </motion.div>
          <motion.div className="pl-3" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.9 }}>
            <span className="text-sky-400">&quot;message&quot;</span><span className="text-white/40">: </span>
            <span className="text-amber-300">&quot;Bonjour!&quot;</span><span className="text-white/30">,</span>
          </motion.div>
          <motion.div className="pl-3" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 1.0 }}>
            <span className="text-sky-400">&quot;sender&quot;</span><span className="text-white/40">: </span>
            <span className="text-amber-300">&quot;MboaSMS&quot;</span>
          </motion.div>
          <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 1.1 }}>
            <span className="text-white/30">{"}"}</span>
          </motion.div>
          <motion.div
            className="mt-3 pt-2 border-t border-white/5"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.4 }}
          >
            <span className="text-green-400">✓ 200 OK</span>{" "}
            <span className="text-white/30">- 45ms</span>
          </motion.div>
        </div>
      </motion.div>

      {/* SDK badges floating */}
      <motion.div
        className="absolute top-3 right-3 flex flex-col gap-1.5"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.6 }}
      >
        {["Python", "Node.js", "PHP"].map((sdk, i) => (
          <motion.div
            key={sdk}
            className="bg-white/10 backdrop-blur-sm rounded-md px-2 py-1 text-[9px] font-mono text-white/70 border border-white/10"
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1.7 + i * 0.15 }}
          >
            {sdk}
          </motion.div>
        ))}
      </motion.div>

      {/* Webhook indicator */}
      <motion.div
        className="absolute bottom-3 left-3 bg-white/10 backdrop-blur-sm rounded-lg px-3 py-2 border border-white/10"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.8 }}
      >
        <div className="flex items-center gap-2">
          <Send2 size="14" color="currentColor" className="text-emerald-400" variant="Bold" />
          <span className="text-[10px] text-white/70">Webhook actif</span>
        </div>
      </motion.div>
    </div>
  );
}

function DashboardIllustration() {
  return (
    <div className="relative w-full h-full flex items-center justify-center p-3">
      <motion.div
        className="w-full max-w-xs bg-gray-900/60 rounded-xl border border-white/10 overflow-hidden shadow-2xl"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        {/* Dashboard header */}
        <div className="px-3 py-2 bg-gray-800/60 border-b border-white/5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded bg-amber-500/30 flex items-center justify-center">
              <Chart2 size="12" color="currentColor" className="text-amber-400" variant="Bold" />
            </div>
            <span className="text-[10px] text-white/60 font-medium">Dashboard</span>
          </div>
          <div className="flex gap-1">
            <div className="w-1.5 h-1.5 rounded-full bg-green-400"></div>
            <span className="text-[9px] text-white/40">En ligne</span>
          </div>
        </div>

        {/* Stats row */}
        <motion.div
          className="grid grid-cols-3 gap-2 p-3"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          {[
            { label: "Envoyes", value: "12,847", color: "text-amber-400" },
            { label: "Delivres", value: "12,605", color: "text-green-400" },
            { label: "Taux", value: "98.1%", color: "text-sky-400" },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              className="bg-white/5 rounded-lg p-2 text-center"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 + i * 0.1 }}
            >
              <div className={`text-sm font-bold ${stat.color}`}>{stat.value}</div>
              <div className="text-[8px] text-white/40 mt-0.5">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>

        {/* Chart mockup */}
        <motion.div
          className="px-3 pb-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9 }}
        >
          <div className="bg-white/5 rounded-lg p-2">
            <div className="flex items-end justify-between gap-1 h-16">
              {[40, 65, 45, 80, 55, 90, 70, 85, 60, 95, 75, 88].map((h, i) => (
                <motion.div
                  key={i}
                  className="flex-1 rounded-t-sm bg-gradient-to-t from-amber-500/60 to-amber-400/30"
                  initial={{ height: 0 }}
                  animate={{ height: `${h}%` }}
                  transition={{ delay: 1.0 + i * 0.05, duration: 0.4, ease: "easeOut" }}
                />
              ))}
            </div>
            <div className="flex justify-between mt-1.5">
              <span className="text-[7px] text-white/30">Jan</span>
              <span className="text-[7px] text-white/30">Jun</span>
              <span className="text-[7px] text-white/30">Dec</span>
            </div>
          </div>
        </motion.div>

        {/* Recent campaigns */}
        <motion.div
          className="px-3 pb-3"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.3 }}
        >
          <div className="text-[9px] text-white/40 mb-1.5">Campagnes recentes</div>
          {[
            { name: "Promo Noel", status: "Delivre", statusColor: "bg-green-400" },
            { name: "Bienvenue", status: "En cours", statusColor: "bg-amber-400" },
          ].map((item, i) => (
            <div key={i} className="flex items-center justify-between py-1 border-t border-white/5">
              <span className="text-[10px] text-white/70">{item.name}</span>
              <div className="flex items-center gap-1">
                <div className={`w-1.5 h-1.5 rounded-full ${item.statusColor}`}></div>
                <span className="text-[9px] text-white/50">{item.status}</span>
              </div>
            </div>
          ))}
        </motion.div>
      </motion.div>
    </div>
  );
}

function PersonalizationIllustration() {
  return (
    <div className="relative w-full h-full flex items-center justify-center p-4">
      {/* SMS conversation mockup */}
      <div className="w-full max-w-[220px] space-y-3">
        {/* Phone frame */}
        <motion.div
          className="bg-gray-900/50 rounded-2xl border border-white/10 p-3 shadow-2xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          {/* Phone top bar */}
          <div className="flex items-center justify-between mb-3 px-1">
            <span className="text-[9px] text-white/40">MboaSMS</span>
            <div className="flex items-center gap-1">
              <ProfileCircle size="12" color="currentColor" className="text-white/30" variant="Bold" />
              <span className="text-[9px] text-white/40">Jean D.</span>
            </div>
          </div>

          {/* Messages */}
          <div className="space-y-2.5">
            <motion.div
              className="bg-rose-500/20 border border-rose-400/20 rounded-xl rounded-tl-sm p-2.5 max-w-[85%]"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 }}
            >
              <div className="text-[11px] text-white/90 leading-relaxed">
                Bonjour <span className="bg-rose-400/30 px-1 rounded text-rose-200 font-medium">{"{{prenom}}"}</span> !
              </div>
              <div className="text-[9px] text-white/40 mt-1">Template</div>
            </motion.div>

            <motion.div
              className="text-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.9 }}
            >
              <ArrowRight2 size="14" color="currentColor" className="text-rose-400/50 rotate-90 mx-auto" />
            </motion.div>

            <motion.div
              className="bg-white/10 border border-white/10 rounded-xl rounded-tl-sm p-2.5 max-w-[85%]"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1.1 }}
            >
              <div className="text-[11px] text-white/90 leading-relaxed">
                Bonjour <span className="text-rose-300 font-medium">Jean</span> !
              </div>
              <div className="text-[9px] text-white/40 mt-1">Personnalise</div>
            </motion.div>

            <motion.div
              className="bg-white/10 border border-white/10 rounded-xl rounded-tr-sm p-2.5 max-w-[85%] ml-auto"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1.4 }}
            >
              <div className="text-[11px] text-white/90 leading-relaxed">
                Profitez de <span className="text-amber-300 font-medium">-20%</span> sur votre prochaine commande !
              </div>
              <div className="flex items-center justify-end gap-1 mt-1">
                <ShieldTick size="10" color="currentColor" className="text-green-400" variant="Bold" />
                <span className="text-[9px] text-green-400">Delivre</span>
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* Segment badge */}
        <motion.div
          className="flex items-center justify-center gap-2"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.6 }}
        >
          <div className="bg-white/10 backdrop-blur-sm rounded-full px-3 py-1.5 border border-white/10 flex items-center gap-1.5">
            <People size="12" color="currentColor" className="text-rose-400" variant="Bold" />
            <span className="text-[10px] text-white/70">Segment: VIP</span>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-full px-3 py-1.5 border border-white/10 flex items-center gap-1.5">
            <CalendarTick size="12" color="currentColor" className="text-rose-400" variant="Bold" />
            <span className="text-[10px] text-white/70">10h00</span>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

function PricingIllustration() {
  const countries = [
    { flag: "🇨🇲", name: "Cameroun", price: "23 FCFA" },
    { flag: "🇫🇷", name: "France", price: "0.065 EUR" },
    { flag: "🇺🇸", name: "USA", price: "0.015 USD" },
    { flag: "🇳🇬", name: "Nigeria", price: "4.5 NGN" },
    { flag: "🇬🇧", name: "UK", price: "0.045 GBP" },
  ];

  return (
    <div className="relative w-full h-full flex items-center justify-center p-3">
      <div className="w-full max-w-[230px] space-y-2">
        {/* Header */}
        <motion.div
          className="text-center mb-3"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="inline-flex items-center gap-1.5 bg-white/10 backdrop-blur-sm rounded-full px-3 py-1 border border-white/10">
            <Wallet2 size="14" color="currentColor" className="text-sky-400" variant="Bold" />
            <span className="text-[10px] text-white/70 font-medium">Tarifs par pays</span>
          </div>
        </motion.div>

        {/* Country pricing list */}
        {countries.map((country, i) => (
          <motion.div
            key={country.name}
            className="flex items-center justify-between bg-white/8 backdrop-blur-sm rounded-xl px-3 py-2.5 border border-white/8 hover:border-white/20 transition-colors"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 + i * 0.12 }}
          >
            <div className="flex items-center gap-2.5">
              <span className="text-lg">{country.flag}</span>
              <span className="text-[11px] text-white/80 font-medium">{country.name}</span>
            </div>
            <div className="bg-sky-500/20 rounded-md px-2 py-0.5">
              <span className="text-[11px] text-sky-300 font-bold">{country.price}</span>
            </div>
          </motion.div>
        ))}

        {/* Bottom badge */}
        <motion.div
          className="flex items-center justify-center gap-3 pt-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.3 }}
        >
          <div className="flex items-center gap-1">
            <ShieldTick size="12" color="currentColor" className="text-green-400" variant="Bold" />
            <span className="text-[9px] text-white/50">Sans engagement</span>
          </div>
          <div className="w-px h-3 bg-white/10"></div>
          <div className="flex items-center gap-1">
            <Timer1 size="12" color="currentColor" className="text-amber-400" variant="Bold" />
            <span className="text-[9px] text-white/50">Degressif</span>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

// ─── Service Data ───────────────────────────────────────────────────────────

type ServiceItem = {
  id: string;
  title: string;
  description: string;
  buttonText: string;
  icon: React.ReactNode;
  activeIcon: React.ReactNode;
  category: string;
  illustration: React.ReactNode;
  color: {
    bg: string;
    bgExpanded: string;
    accent: string;
    accentLight: string;
    tabBg: string;
    gradient: string;
    shadow: string;
    iconBg: string;
  };
  highlights: string[];
};

const services: ServiceItem[] = [
  {
    id: '01',
    title: 'Envoi de SMS dans le monde entier',
    description: 'Atteignez vos clients dans plus de 50 pays avec des taux de livraison parmi les meilleurs du marche. Notre infrastructure robuste garantit que chaque message arrive a destination, que ce soit en Afrique, en Europe ou en Amerique.',
    buttonText: 'Decouvrir',
    icon: <Global size="28" color="currentColor" variant="Bold" className="text-purple-600" />,
    activeIcon: <Global size="32" color="currentColor" variant="Bold" className="text-white" />,
    illustration: <GlobeIllustration />,
    category: 'Couverture internationale',
    color: {
      bg: 'from-purple-600 to-violet-800',
      bgExpanded: 'bg-gradient-to-br from-purple-700 via-purple-800 to-violet-900',
      accent: 'text-purple-400',
      accentLight: 'text-purple-300',
      tabBg: 'bg-purple-100 dark:bg-purple-950/40',
      gradient: 'from-purple-500 to-violet-600',
      shadow: 'shadow-purple-500/20',
      iconBg: 'bg-purple-500/20',
    },
    highlights: ['50+ pays couverts', '98% delivrabilite', 'Livraison < 5 min'],
  },
  {
    id: '02',
    title: 'API REST puissante et flexible',
    description: 'Integrez les SMS directement dans vos applications grace a notre API RESTful complete. Documentation detaillee, SDKs en Python, Node.js et PHP, webhooks temps reel pour le suivi de livraison.',
    buttonText: 'Explorer',
    icon: <Code1 size="28" color="currentColor" variant="Bold" className="text-emerald-600" />,
    activeIcon: <Code1 size="32" color="currentColor" variant="Bold" className="text-white" />,
    illustration: <ApiIllustration />,
    category: 'API SMS pour developpeurs',
    color: {
      bg: 'from-emerald-600 to-teal-800',
      bgExpanded: 'bg-gradient-to-br from-emerald-700 via-emerald-800 to-teal-900',
      accent: 'text-emerald-400',
      accentLight: 'text-emerald-300',
      tabBg: 'bg-emerald-100 dark:bg-emerald-950/40',
      gradient: 'from-emerald-500 to-teal-600',
      shadow: 'shadow-emerald-500/20',
      iconBg: 'bg-emerald-500/20',
    },
    highlights: ['Documentation complete', 'Webhooks temps reel', 'SDKs multi-langages'],
  },
  {
    id: '03',
    title: 'Dashboard intuitif et complet',
    description: 'Gerez toutes vos campagnes SMS depuis une interface moderne et intuitive. Importez vos contacts par CSV, creez des templates reutilisables, planifiez vos envois et suivez les performances en temps reel.',
    buttonText: 'Voir plus',
    icon: <Chart2 size="28" color="currentColor" variant="Bold" className="text-amber-600" />,
    activeIcon: <Chart2 size="32" color="currentColor" variant="Bold" className="text-white" />,
    illustration: <DashboardIllustration />,
    category: 'Interface de gestion',
    color: {
      bg: 'from-amber-500 to-orange-700',
      bgExpanded: 'bg-gradient-to-br from-amber-600 via-amber-700 to-orange-800',
      accent: 'text-amber-400',
      accentLight: 'text-amber-300',
      tabBg: 'bg-amber-100 dark:bg-amber-950/40',
      gradient: 'from-amber-500 to-orange-600',
      shadow: 'shadow-amber-500/20',
      iconBg: 'bg-amber-500/20',
    },
    highlights: ['Import CSV / Excel', 'Templates reutil.', 'Rapports detailles'],
  },
  {
    id: '04',
    title: 'Campagnes personnalisees a 100%',
    description: 'Personnalisez vos messages avec des variables dynamiques, segmentez vos audiences, et programmez vos envois au moment optimal pour maximiser votre impact commercial.',
    buttonText: 'Decouvrir',
    icon: <UserEdit size="28" color="currentColor" variant="Bold" className="text-rose-600" />,
    activeIcon: <UserEdit size="32" color="currentColor" variant="Bold" className="text-white" />,
    illustration: <PersonalizationIllustration />,
    category: 'Personnalisation totale',
    color: {
      bg: 'from-rose-600 to-pink-800',
      bgExpanded: 'bg-gradient-to-br from-rose-700 via-rose-800 to-pink-900',
      accent: 'text-rose-400',
      accentLight: 'text-rose-300',
      tabBg: 'bg-rose-100 dark:bg-rose-950/40',
      gradient: 'from-rose-500 to-pink-600',
      shadow: 'shadow-rose-500/20',
      iconBg: 'bg-rose-500/20',
    },
    highlights: ['Variables dynamiques', 'Segmentation avancee', 'Planification intelligente'],
  },
  {
    id: '05',
    title: 'Des tarifs adaptes a chaque marche',
    description: 'Beneficiez de prix competitifs adaptes a chaque pays. Pas de frais caches, pas d\'abonnement obligatoire. Vous payez uniquement pour les SMS envoyes. Plus vous envoyez, plus vous economisez.',
    buttonText: 'Voir les prix',
    icon: <People size="28" color="currentColor" variant="Bold" className="text-sky-600" />,
    activeIcon: <People size="32" color="currentColor" variant="Bold" className="text-white" />,
    illustration: <PricingIllustration />,
    category: 'Tarification flexible',
    color: {
      bg: 'from-sky-600 to-blue-800',
      bgExpanded: 'bg-gradient-to-br from-sky-700 via-sky-800 to-blue-900',
      accent: 'text-sky-400',
      accentLight: 'text-sky-300',
      tabBg: 'bg-sky-100 dark:bg-sky-950/40',
      gradient: 'from-sky-500 to-blue-600',
      shadow: 'shadow-sky-500/20',
      iconBg: 'bg-sky-500/20',
    },
    highlights: ['Sans abonnement', 'Forfaits degressifs', 'Facturation transparente'],
  },
];

// ─── Main Component ─────────────────────────────────────────────────────────

export default function ServicePresentation() {
  const [activeService, setActiveService] = useState(0);

  const handleTabClick = (index: number) => {
    setActiveService(index);
  };

  return (
    <section className="py-20 md:py-28 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden opacity-[0.03] pointer-events-none dark:opacity-[0.06]">
        <div className="absolute top-10 left-10 transform -rotate-12">
          <MessageText1 size="120" color="currentColor" variant="Bold" className="text-foreground" />
        </div>
        <div className="absolute bottom-20 right-10 transform rotate-12">
          <Code1 size="140" color="currentColor" variant="Bold" className="text-foreground" />
        </div>
        <div className="absolute top-1/2 right-1/4 transform rotate-45">
          <Global size="100" color="currentColor" variant="Bold" className="text-foreground" />
        </div>
      </div>

      <div className="container mx-auto px-4 md:px-6">
        {/* Section header */}
        <div className="mb-14">
          <motion.div
            className="flex items-center gap-3 mb-5"
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <div className="w-1 h-8 rounded-full bg-gradient-to-b from-primary to-purple-500"></div>
            <span className="text-sm md:text-base font-semibold text-primary uppercase tracking-wider">
              Qui sommes-nous ?
            </span>
          </motion.div>
          <motion.h2
            className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-3 leading-tight"
            initial={{ opacity: 0, y: -10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            La plateforme SMS internationale
          </motion.h2>
          <motion.p
            className="text-xl md:text-2xl font-medium text-muted-foreground"
            initial={{ opacity: 0, y: -10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            qui propulse votre communication
          </motion.p>
        </div>

        {/* Cards layout */}
        <div className="flex flex-col md:flex-row gap-2 md:gap-2.5 w-full min-h-[460px]">
          {services.map((service, index) => {
            const isActive = index === activeService;

            return (
              <motion.div
                key={service.id}
                className={`rounded-2xl cursor-pointer transition-all duration-500 overflow-hidden ${
                  isActive
                    ? `flex-grow shadow-xl ${service.color.shadow}`
                    : 'md:w-20 w-full'
                }`}
                onClick={() => handleTabClick(index)}
                whileTap={{ scale: 0.99 }}
                layout
                transition={{ duration: 0.5, ease: [0.32, 0.72, 0, 1] }}
              >
                {isActive ? (
                  /* ─── Active / Expanded Card ─── */
                  <motion.div
                    className={`h-full w-full ${service.color.bgExpanded} rounded-2xl overflow-hidden`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3, delay: 0.15 }}
                  >
                    <div className="grid grid-cols-1 md:grid-cols-[1.4fr_1fr] h-full">
                      {/* Left content */}
                      <div className="p-6 md:p-8 lg:p-10 relative overflow-hidden flex flex-col justify-between">
                        {/* Background icon watermark */}
                        <div className="absolute -top-8 -right-8 opacity-[0.07] pointer-events-none">
                          <div className="transform scale-[3]">
                            {service.activeIcon}
                          </div>
                        </div>

                        {/* Vertical category label (desktop) */}
                        <div className="hidden md:flex absolute left-0 top-0 h-full w-10 items-center justify-center">
                          <div className="transform -rotate-90 whitespace-nowrap text-[10px] text-white/40 uppercase tracking-[0.2em] font-medium">
                            {service.category}
                          </div>
                        </div>

                        {/* Mobile category */}
                        <div className="md:hidden mb-3">
                          <span className="text-[10px] uppercase tracking-[0.15em] text-white/50 font-medium">
                            {service.category}
                          </span>
                        </div>

                        <div className="md:ml-10">
                          {/* Number + Title */}
                          <motion.div
                            className="flex items-start gap-3 mb-4"
                            initial={{ opacity: 0, y: 16 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.35, delay: 0.25 }}
                          >
                            <span className={`text-sm font-bold ${service.color.accentLight} mt-1.5`}>{service.id}</span>
                            <h3 className="text-xl md:text-2xl lg:text-3xl font-bold text-white leading-tight">
                              {service.title}
                            </h3>
                          </motion.div>

                          {/* Description */}
                          <motion.p
                            className="text-white/75 text-sm md:text-base leading-relaxed mb-6 max-w-lg"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.35, delay: 0.35 }}
                          >
                            {service.description}
                          </motion.p>

                          {/* Highlight pills */}
                          <motion.div
                            className="flex flex-wrap gap-2 mb-6"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.35, delay: 0.45 }}
                          >
                            {service.highlights.map((highlight, i) => (
                              <span
                                key={i}
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-sm text-white/90 text-xs font-medium border border-white/10"
                              >
                                <ShieldTick size="12" color="currentColor" variant="Bold" className={service.color.accentLight} />
                                {highlight}
                              </span>
                            ))}
                          </motion.div>
                        </div>

                        {/* CTA button */}
                        <motion.div
                          initial={{ opacity: 0, y: 16 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.35, delay: 0.5 }}
                          className="md:ml-10"
                        >
                          <Button
                            variant="default"
                            className="rounded-xl bg-white/15 hover:bg-white/25 backdrop-blur-sm text-white border border-white/20 transition-all duration-300 group"
                          >
                            <span className="flex items-center">
                              {service.buttonText}
                              <ArrowRight2 size="16" color="currentColor" className="ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                            </span>
                          </Button>
                        </motion.div>
                      </div>

                      {/* Right visual — Illustration */}
                      <motion.div
                        className="relative h-64 md:h-full min-h-[260px] md:min-h-0"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                      >
                        {service.illustration}
                      </motion.div>
                    </div>
                  </motion.div>
                ) : (
                  /* ─── Inactive / Collapsed Tab ─── */
                  <motion.div
                    className={`h-full ${service.color.tabBg} rounded-2xl relative overflow-hidden border border-transparent hover:border-border/50 transition-colors duration-300 group`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    {/* Color accent strip */}
                    <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${service.color.gradient} opacity-60 group-hover:opacity-100 transition-opacity duration-300`}></div>

                    <div className="flex md:flex-col items-center justify-center h-full w-full py-4 md:py-0 px-4 md:px-0 gap-3 md:gap-0">
                      {/* Number */}
                      <div className="text-sm font-bold text-muted-foreground md:absolute md:top-4 md:left-0 md:right-0 md:text-center">
                        {service.id}
                      </div>

                      {/* Icon */}
                      <div className={`w-10 h-10 rounded-xl ${service.color.iconBg} flex items-center justify-center md:mb-0`}>
                        {service.icon}
                      </div>

                      {/* Vertical category text (desktop) */}
                      <div className="hidden md:block">
                        <div className="transform -rotate-90 whitespace-nowrap text-[10px] text-muted-foreground uppercase tracking-[0.15em] font-medium mt-6">
                          {service.category}
                        </div>
                      </div>

                      {/* Horizontal label (mobile) */}
                      <span className="md:hidden text-sm font-medium text-foreground truncate">
                        {service.title}
                      </span>

                      {/* Arrow indicator (mobile) */}
                      <ArrowRight2 size="14" color="currentColor" className="md:hidden text-muted-foreground ml-auto shrink-0" />
                    </div>
                  </motion.div>
                )}
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
