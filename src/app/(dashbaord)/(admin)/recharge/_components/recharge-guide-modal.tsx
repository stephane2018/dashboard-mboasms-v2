"use client"

import { useState, useEffect, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ArrowRight2, ArrowLeft2, MoneyRecive, Global, Call, Whatsapp } from "iconsax-react"
import { CheckCircle2, Smartphone, X } from "lucide-react"
import { useT } from "@/core/hooks"

const STORAGE_KEY = "mboasms_recharge_guide_dismissed"

const SUPPORT_CONTACTS = [
  { name: "WhatsApp uniquement", number: "+237 697 193 064", href: "https://wa.me/237697193064", icon: Whatsapp, color: "text-emerald-500", bg: "bg-emerald-500/10" },
]

const steps = [
  {
    title: "Recharge locale (Cameroun)",
    description:
      "Rechargez votre compte SMS directement via Orange Money. Le processus est simple et instantane.",
    icon: Smartphone,
    iconBg: "bg-amber-500/10",
    iconColor: "text-amber-500",
    instructions: [
      "Cliquez sur \"Faire une recharge\" et renseignez le montant",
      "Entrez le numero Orange Money qui effectuera la transaction",
      "Validez la demande dans l'application",
      "Un message de validation Orange Money apparaitra sur votre mobile",
      "Confirmez le paiement sur votre telephone",
      "Actualisez la page pour voir votre solde mis a jour",
    ],
    note: "Si apres validation le solde n'est pas mis a jour, contactez l'admin sur WhatsApp.",
  },
  {
    title: "Recharge internationale",
    description:
      "Pour les SMS internationaux, la recharge se fait par depot Mobile Money a un numero dedie. Un administrateur creditera ensuite votre compte.",
    icon: Global,
    iconBg: "bg-primary/10",
    iconColor: "text-primary",
    instructions: [
      "Effectuez un depot Mobile Money (Orange ou MTN) au numero indique",
      "Notez le numero de transaction comme preuve de paiement",
      "Cliquez sur \"Faire une recharge\" et selectionnez International",
      "Renseignez le montant et le numero de transaction",
      "Un administrateur verifiera et creditera votre compte",
    ],
    note: "Numeros de depot : Orange Money / MTN Mobile Money — contactez le support pour les obtenir.",
  },
]

export function RechargeGuideModal() {
  const { t } = useT()
  const [isOpen, setIsOpen] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)
  const [direction, setDirection] = useState(1)

  useEffect(() => {
    const dismissed = localStorage.getItem(STORAGE_KEY)
    if (!dismissed) {
      const timer = setTimeout(() => setIsOpen(true), 500)
      return () => clearTimeout(timer)
    }
  }, [])

  const dismiss = useCallback(() => {
    setIsOpen(false)
    localStorage.setItem(STORAGE_KEY, "true")
  }, [])

  const next = useCallback(() => {
    if (currentStep < steps.length - 1) {
      setDirection(1)
      setCurrentStep((s) => s + 1)
    } else {
      dismiss()
    }
  }, [currentStep, dismiss])

  const prev = useCallback(() => {
    if (currentStep > 0) {
      setDirection(-1)
      setCurrentStep((s) => s - 1)
    }
  }, [currentStep])

  const step = steps[currentStep]
  const isLast = currentStep === steps.length - 1

  const slideVariants = {
    enter: (dir: number) => ({ x: dir > 0 ? 250 : -250, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (dir: number) => ({ x: dir > 0 ? -250 : 250, opacity: 0 }),
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center p-4"
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={dismiss}
          />

          <motion.div
            initial={{ scale: 0.92, opacity: 0, y: 30 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.92, opacity: 0, y: 30 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="relative z-10 w-full max-w-lg bg-card rounded-2xl shadow-2xl border border-border/50 overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 pt-5 pb-0">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center">
                  <MoneyRecive size={14} variant="Bulk" color="currentColor" className="text-primary" />
                </div>
                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  {t('recharge.guideTitle')}
                </span>
              </div>
              <button
                onClick={dismiss}
                className="p-1.5 rounded-lg hover:bg-muted transition-colors"
              >
                <X className="w-4 h-4 text-muted-foreground" />
              </button>
            </div>

            {/* Content */}
            <div className="px-6 py-5 min-h-[380px] flex flex-col">
              <AnimatePresence mode="wait" custom={direction}>
                <motion.div
                  key={currentStep}
                  custom={direction}
                  variants={slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                  className="flex-1"
                >
                  {/* Icon + Title */}
                  <div className={`w-11 h-11 rounded-xl ${step.iconBg} flex items-center justify-center mb-4`}>
                    <step.icon size={22} className={step.iconColor} />
                  </div>

                  <h2 className="text-lg font-bold text-foreground mb-2">{step.title}</h2>
                  <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                    {step.description}
                  </p>

                  {/* Steps */}
                  <div className="space-y-2 mb-4">
                    {step.instructions.map((instruction, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, x: 8 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.05 + i * 0.05 }}
                        className="flex items-start gap-2.5"
                      >
                        <span className="flex items-center justify-center w-5 h-5 rounded-full bg-primary/10 text-primary text-[10px] font-bold shrink-0 mt-0.5">
                          {i + 1}
                        </span>
                        <span className="text-xs text-foreground/80 leading-relaxed">{instruction}</span>
                      </motion.div>
                    ))}
                  </div>

                  {/* Note */}
                  <div className="p-3 rounded-xl bg-amber-500/5 border border-amber-500/15">
                    <p className="text-xs text-amber-700 dark:text-amber-400 leading-relaxed">
                      <strong>Note :</strong> {step.note}
                    </p>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between px-6 pb-5">
              {/* Dots */}
              <div className="flex items-center gap-1.5">
                {steps.map((_, i) => (
                  <motion.div
                    key={i}
                    className="h-1.5 rounded-full"
                    animate={{
                      width: i === currentStep ? 20 : 6,
                      backgroundColor: i === currentStep ? "var(--primary)" : "var(--border)",
                    }}
                    transition={{ duration: 0.25 }}
                  />
                ))}
              </div>

              {/* Buttons */}
              <div className="flex items-center gap-2">
                {currentStep > 0 && (
                  <button
                    onClick={prev}
                    className="p-2 rounded-xl border border-border hover:border-primary/40 hover:bg-primary/5 transition-all"
                  >
                    <ArrowLeft2 size={16} color="currentColor" />
                  </button>
                )}
                <button
                  onClick={next}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary text-white text-sm font-semibold shadow-md shadow-primary/25 hover:shadow-lg hover:shadow-primary/30 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
                >
                  {isLast ? t('recharge.understood') : t('common.next')}
                  {!isLast && <ArrowRight2 size={14} color="currentColor" />}
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

/** Inline support contact banner for the recharge page */
export function RechargeSupportBanner() {
  const { t } = useT()

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 p-4 rounded-xl bg-card border border-border/50">
      <div className="flex items-center gap-2.5 min-w-0">
        <div className="w-9 h-9 rounded-xl bg-amber-500/10 flex items-center justify-center shrink-0">
          <Call size={18} variant="Bulk" color="currentColor" className="text-amber-500" />
        </div>
        <div className="min-w-0">
          <p className="text-sm font-semibold text-foreground">{t('recharge.needHelp')}</p>
          <p className="text-xs text-muted-foreground">{t('recharge.needHelpDesc')}</p>
        </div>
      </div>
      <div className="flex items-center gap-2 sm:ml-auto shrink-0">
        {SUPPORT_CONTACTS.map((contact) => (
          <a
            key={contact.name}
            href={contact.href}
            target="_blank"
            rel="noopener noreferrer"
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl ${contact.bg} border border-transparent hover:border-current/10 transition-all hover:scale-[1.02] active:scale-[0.98]`}
          >
            <contact.icon size={16} variant="Bulk" color="currentColor" className={contact.color} />
            <span className={`text-xs font-semibold ${contact.color}`}>{contact.number}</span>
          </a>
        ))}
      </div>
    </div>
  )
}
