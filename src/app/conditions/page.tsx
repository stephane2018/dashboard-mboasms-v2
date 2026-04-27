"use client"

import { useState } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { ArrowLeft, DocumentText, ShieldTick, Lock, Profile2User, Sms, Judge, Warning2, MessageQuestion } from "iconsax-react"
import Header from "@/shared/landing_components/components/layout/Header"
import Footer from "@/shared/landing_components/components/layout/Footer"

const sections = [
  { id: "objet", title: "Objet", icon: DocumentText },
  { id: "inscription", title: "Inscription et compte", icon: Profile2User },
  { id: "services", title: "Description des services", icon: Sms },
  { id: "utilisation", title: "Conditions d'utilisation", icon: ShieldTick },
  { id: "tarifs", title: "Tarifs et paiement", icon: Judge },
  { id: "donnees", title: "Protection des donnees", icon: Lock },
  { id: "responsabilite", title: "Responsabilite", icon: Warning2 },
  { id: "resiliation", title: "Resiliation", icon: Warning2 },
  { id: "contact", title: "Contact", icon: MessageQuestion },
]

export default function ConditionsPage() {
  const [activeSection, setActiveSection] = useState("objet")

  return (
    <div className="min-h-screen bg-background pt-20">
      <Header />

      {/* Hero */}
      <section className="relative py-16 md:py-24 px-6 overflow-hidden">
        <div className="absolute inset-0 bg-linear-to-br from-primary/5 via-transparent to-purple-500/5"></div>
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl"></div>

        <div className="container mx-auto max-w-4xl relative z-10">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors mb-8"
          >
            <ArrowLeft size="16" color="currentColor" />
            Retour a l&apos;accueil
          </Link>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 mb-6">
              <ShieldTick size="14" variant="Bulk" color="currentColor" className="text-primary" />
              <span className="text-xs font-medium text-primary">Derniere mise a jour : Mars 2026</span>
            </div>
            <h1 className="text-3xl md:text-5xl font-bold text-foreground mb-4 leading-tight">
              Conditions generales<br />d&apos;utilisation
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl">
              Veuillez lire attentivement ces conditions avant d&apos;utiliser la plateforme MboaSMS.
              En utilisant nos services, vous acceptez les presentes conditions.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Content */}
      <section className="py-12 px-6 md:px-12 lg:px-24">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-10">

            {/* Sidebar nav */}
            <motion.aside
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="hidden lg:block"
            >
              <div className="sticky top-28">
                <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mb-4">Sommaire</p>
                <nav className="space-y-1">
                  {sections.map((section) => {
                    const Icon = section.icon
                    return (
                      <a
                        key={section.id}
                        href={`#${section.id}`}
                        onClick={() => setActiveSection(section.id)}
                        className={`
                          flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200
                          ${activeSection === section.id
                            ? 'bg-primary/10 text-primary border border-primary/20'
                            : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                          }
                        `}
                      >
                        <Icon size="16" variant="Bulk" color="currentColor" className="shrink-0" />
                        {section.title}
                      </a>
                    )
                  })}
                </nav>
              </div>
            </motion.aside>

            {/* Mobile nav */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className="lg:hidden overflow-x-auto pb-2 -mx-6 px-6"
            >
              <div className="flex gap-2 min-w-max">
                {sections.map((section) => (
                  <a
                    key={section.id}
                    href={`#${section.id}`}
                    onClick={() => setActiveSection(section.id)}
                    className={`
                      px-3 py-2 rounded-full text-xs font-medium whitespace-nowrap transition-all duration-200 border
                      ${activeSection === section.id
                        ? 'bg-primary text-white border-primary'
                        : 'bg-background text-muted-foreground border-border hover:border-primary/40'
                      }
                    `}
                  >
                    {section.title}
                  </a>
                ))}
              </div>
            </motion.div>

            {/* Main content */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="prose prose-neutral dark:prose-invert max-w-none"
            >
              {/* Section 1 */}
              <div id="objet" className="scroll-mt-28 mb-12">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                    <DocumentText size="20" variant="Bulk" color="currentColor" className="text-primary" />
                  </div>
                  <h2 className="text-xl font-bold text-foreground m-0">1. Objet</h2>
                </div>
                <div className="rounded-xl border border-border bg-card p-6 space-y-4">
                  <p className="text-muted-foreground leading-relaxed m-0">
                    Les presentes Conditions Generales d&apos;Utilisation (ci-apres &quot;CGU&quot;) ont pour objet de definir
                    les modalites et conditions dans lesquelles la societe <strong className="text-foreground">MboaSMS</strong> met a disposition
                    de ses utilisateurs sa plateforme d&apos;envoi de SMS professionnels.
                  </p>
                  <p className="text-muted-foreground leading-relaxed m-0">
                    Toute inscription ou utilisation de la plateforme implique l&apos;acceptation sans reserve
                    des presentes CGU par l&apos;utilisateur.
                  </p>
                </div>
              </div>

              {/* Section 2 */}
              <div id="inscription" className="scroll-mt-28 mb-12">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                    <Profile2User size="20" variant="Bulk" color="currentColor" className="text-primary" />
                  </div>
                  <h2 className="text-xl font-bold text-foreground m-0">2. Inscription et compte</h2>
                </div>
                <div className="rounded-xl border border-border bg-card p-6 space-y-4">
                  <p className="text-muted-foreground leading-relaxed m-0">
                    Pour acceder aux services de MboaSMS, l&apos;utilisateur doit creer un compte en fournissant
                    des informations exactes et a jour. L&apos;utilisateur s&apos;engage a :
                  </p>
                  <ul className="space-y-2 text-muted-foreground list-none pl-0 m-0">
                    {[
                      "Fournir des informations d'identite veridiques et completes",
                      "Maintenir la confidentialite de ses identifiants de connexion",
                      "Notifier immediatement MboaSMS en cas d'utilisation non autorisee de son compte",
                      "Ne pas creer de comptes multiples pour contourner les limitations",
                    ].map((item, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <ShieldTick size="16" variant="Bulk" color="currentColor" className="text-primary shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="rounded-lg bg-amber-500/5 border border-amber-500/20 p-4 flex gap-3">
                    <Warning2 size="18" variant="Bulk" color="currentColor" className="text-amber-500 shrink-0 mt-0.5" />
                    <p className="text-sm text-muted-foreground m-0">
                      MboaSMS se reserve le droit de suspendre ou supprimer tout compte en cas de violation
                      des presentes conditions ou d&apos;activite suspecte.
                    </p>
                  </div>
                </div>
              </div>

              {/* Section 3 */}
              <div id="services" className="scroll-mt-28 mb-12">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                    <Sms size="20" variant="Bulk" color="currentColor" className="text-primary" />
                  </div>
                  <h2 className="text-xl font-bold text-foreground m-0">3. Description des services</h2>
                </div>
                <div className="rounded-xl border border-border bg-card p-6 space-y-4">
                  <p className="text-muted-foreground leading-relaxed m-0">
                    MboaSMS propose les services suivants :
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {[
                      { title: "SMS Nationaux", desc: "Envoi de SMS vers les operateurs locaux au Cameroun" },
                      { title: "SMS Internationaux", desc: "Envoi de SMS vers plus de 50 pays dans le monde" },
                      { title: "SMS en masse (Bulk)", desc: "Campagnes SMS a grande echelle avec import de contacts" },
                      { title: "API SMS", desc: "Integration via API REST pour l'envoi programmatique de SMS" },
                    ].map((service, i) => (
                      <div key={i} className="rounded-lg border border-border/60 bg-muted/20 p-4">
                        <p className="text-sm font-semibold text-foreground m-0 mb-1">{service.title}</p>
                        <p className="text-xs text-muted-foreground m-0">{service.desc}</p>
                      </div>
                    ))}
                  </div>
                  <p className="text-muted-foreground leading-relaxed m-0">
                    MboaSMS se reserve le droit de modifier, suspendre ou interrompre tout ou partie
                    de ses services, avec un preavis raisonnable lorsque cela est possible.
                  </p>
                </div>
              </div>

              {/* Section 4 */}
              <div id="utilisation" className="scroll-mt-28 mb-12">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                    <ShieldTick size="20" variant="Bulk" color="currentColor" className="text-primary" />
                  </div>
                  <h2 className="text-xl font-bold text-foreground m-0">4. Conditions d&apos;utilisation</h2>
                </div>
                <div className="rounded-xl border border-border bg-card p-6 space-y-4">
                  <p className="text-muted-foreground leading-relaxed m-0">
                    L&apos;utilisateur s&apos;engage a utiliser les services MboaSMS de maniere conforme
                    a la legislation en vigueur. Il est strictement interdit de :
                  </p>
                  <ul className="space-y-2 text-muted-foreground list-none pl-0 m-0">
                    {[
                      "Envoyer des messages a caractere frauduleux, mensonger ou trompeur",
                      "Envoyer des messages non sollicites (spam) a des destinataires n'ayant pas donne leur consentement",
                      "Utiliser le service pour du phishing, des arnaques ou toute activite illicite",
                      "Envoyer des contenus a caractere haineux, violent, discriminatoire ou pornographique",
                      "Usurper l'identite d'un tiers ou d'une organisation",
                      "Tenter de contourner les mesures de securite de la plateforme",
                    ].map((item, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <span className="w-5 h-5 rounded-full bg-red-500/10 flex items-center justify-center shrink-0 mt-0.5">
                          <span className="text-red-500 text-xs font-bold">&times;</span>
                        </span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="rounded-lg bg-red-500/5 border border-red-500/20 p-4 flex gap-3">
                    <Warning2 size="18" variant="Bulk" color="currentColor" className="text-red-500 shrink-0 mt-0.5" />
                    <p className="text-sm text-muted-foreground m-0">
                      Tout manquement a ces regles pourra entrainer la suspension immediate du compte,
                      sans remboursement des credits restants, et d&apos;eventuelles poursuites judiciaires.
                    </p>
                  </div>
                </div>
              </div>

              {/* Section 5 */}
              <div id="tarifs" className="scroll-mt-28 mb-12">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                    <Judge size="20" variant="Bulk" color="currentColor" className="text-primary" />
                  </div>
                  <h2 className="text-xl font-bold text-foreground m-0">5. Tarifs et paiement</h2>
                </div>
                <div className="rounded-xl border border-border bg-card p-6 space-y-4">
                  <p className="text-muted-foreground leading-relaxed m-0">
                    Les tarifs des services MboaSMS sont affiches sur la plateforme et peuvent etre
                    modifies a tout moment. Les principales conditions tarifaires sont :
                  </p>
                  <ul className="space-y-2 text-muted-foreground list-none pl-0 m-0">
                    {[
                      "Les credits SMS sont prepayees et non remboursables une fois achetes",
                      "Les prix varient selon le pays de destination et le volume achete",
                      "Les paiements sont acceptes via Mobile Money, carte bancaire et virement",
                      "Une facture est generee automatiquement pour chaque transaction",
                      "Les credits SMS n'ont pas de date d'expiration",
                    ].map((item, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <ShieldTick size="16" variant="Bulk" color="currentColor" className="text-primary shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Section 6 */}
              <div id="donnees" className="scroll-mt-28 mb-12">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                    <Lock size="20" variant="Bulk" color="currentColor" className="text-primary" />
                  </div>
                  <h2 className="text-xl font-bold text-foreground m-0">6. Protection des donnees personnelles</h2>
                </div>
                <div className="rounded-xl border border-border bg-card p-6 space-y-4">
                  <p className="text-muted-foreground leading-relaxed m-0">
                    MboaSMS s&apos;engage a proteger les donnees personnelles de ses utilisateurs
                    conformement a la legislation en vigueur au Cameroun et aux standards internationaux.
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {[
                      { title: "Collecte minimale", desc: "Nous ne collectons que les donnees strictement necessaires au fonctionnement du service" },
                      { title: "Stockage securise", desc: "Les donnees sont chiffrees et stockees sur des serveurs securises" },
                      { title: "Pas de revente", desc: "Vos donnees ne sont jamais vendues ni partagees a des tiers sans consentement" },
                      { title: "Droit d'acces", desc: "Vous pouvez demander l'acces, la modification ou la suppression de vos donnees" },
                    ].map((item, i) => (
                      <div key={i} className="rounded-lg border border-border/60 bg-muted/20 p-4">
                        <div className="flex items-center gap-2 mb-1">
                          <Lock size="14" variant="Bulk" color="currentColor" className="text-primary" />
                          <p className="text-sm font-semibold text-foreground m-0">{item.title}</p>
                        </div>
                        <p className="text-xs text-muted-foreground m-0">{item.desc}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Section 7 */}
              <div id="responsabilite" className="scroll-mt-28 mb-12">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                    <Warning2 size="20" variant="Bulk" color="currentColor" className="text-primary" />
                  </div>
                  <h2 className="text-xl font-bold text-foreground m-0">7. Limitation de responsabilite</h2>
                </div>
                <div className="rounded-xl border border-border bg-card p-6 space-y-4">
                  <p className="text-muted-foreground leading-relaxed m-0">
                    MboaSMS met tout en oeuvre pour assurer la qualite et la disponibilite de ses services.
                    Cependant, MboaSMS ne saurait etre tenu responsable :
                  </p>
                  <ul className="space-y-2 text-muted-foreground list-none pl-0 m-0">
                    {[
                      "Des interruptions temporaires liees a la maintenance ou a des mises a jour",
                      "Des retards ou echecs de livraison de SMS dus aux operateurs tiers",
                      "Des dommages resultant d'une utilisation non conforme aux presentes CGU",
                      "De tout contenu envoye par l'utilisateur via la plateforme",
                      "De la perte de donnees liee a un cas de force majeure",
                    ].map((item, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground shrink-0 mt-2"></span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Section 8 */}
              <div id="resiliation" className="scroll-mt-28 mb-12">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                    <Warning2 size="20" variant="Bulk" color="currentColor" className="text-primary" />
                  </div>
                  <h2 className="text-xl font-bold text-foreground m-0">8. Resiliation</h2>
                </div>
                <div className="rounded-xl border border-border bg-card p-6 space-y-4">
                  <p className="text-muted-foreground leading-relaxed m-0">
                    L&apos;utilisateur peut a tout moment demander la suppression de son compte
                    en contactant le support MboaSMS. La resiliation entraine :
                  </p>
                  <ul className="space-y-2 text-muted-foreground list-none pl-0 m-0">
                    {[
                      "La desactivation immediate de l'acces aux services",
                      "La perte des credits SMS restants non utilises",
                      "La conservation des donnees de facturation conformement aux obligations legales",
                      "La suppression des donnees personnelles dans un delai de 30 jours",
                    ].map((item, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground shrink-0 mt-2"></span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Section 9 */}
              <div id="contact" className="scroll-mt-28 mb-12">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                    <MessageQuestion size="20" variant="Bulk" color="currentColor" className="text-primary" />
                  </div>
                  <h2 className="text-xl font-bold text-foreground m-0">9. Contact</h2>
                </div>
                <div className="rounded-xl border border-border bg-card p-6 space-y-4">
                  <p className="text-muted-foreground leading-relaxed m-0">
                    Pour toute question relative aux presentes CGU ou aux services MboaSMS,
                    vous pouvez nous contacter :
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="rounded-lg border border-border/60 bg-muted/20 p-4">
                      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider m-0 mb-1">Email</p>
                      <a href="mailto:support@mboasms.com" className="text-sm font-semibold text-primary hover:underline no-underline">
                        support@mboasms.com
                      </a>
                    </div>
                    <div className="rounded-lg border border-border/60 bg-muted/20 p-4">
                      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider m-0 mb-1">WhatsApp</p>
                      <a href="https://wa.me/237697193064" target="_blank" rel="noopener noreferrer" className="text-sm font-semibold text-primary hover:underline no-underline">
                        +237 697 193 064 (WhatsApp uniquement)
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              {/* Legal footer */}
              <div className="rounded-xl border border-border bg-muted/30 p-6 text-center">
                <p className="text-xs text-muted-foreground m-0">
                  Les presentes conditions generales d&apos;utilisation sont regies par le droit camerounais.
                  Tout litige relatif a l&apos;interpretation ou a l&apos;execution des presentes sera soumis
                  aux tribunaux competents de Douala, Cameroun.
                </p>
                <p className="text-xs text-muted-foreground mt-3 m-0">
                  &copy; {new Date().getFullYear()} MboaSMS. Tous droits reserves.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
