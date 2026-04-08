"use client"

import { useState, useEffect, useCallback } from "react"
import { useT } from "@/core/hooks"
import { motion, AnimatePresence } from "framer-motion"
import { ArrowRight2, ArrowLeft2, Sms, SecuritySafe, Chart, MessageText } from "iconsax-react"
import { Sparkles } from "lucide-react"

const STORAGE_KEY = "mboasms_welcome_dismissed"

const stepConfigs = [
  {
    icon: Sparkles,
    iconColor: "text-primary",
    iconBg: "bg-primary/10",
    titleKey: "welcome.title",
    descriptionKey: "welcome.description",
    featuresKeys: ["welcome.feature1", "welcome.feature2", "welcome.feature3"],
    illustration: (
      <div className="relative w-full h-full flex items-center justify-center">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-fuchsia-500/10 to-violet-600/20 rounded-3xl" />
        <motion.div
          animate={{ y: [0, -8, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          className="relative z-10"
        >
          <div className="w-48 h-48 md:w-56 md:h-56 rounded-3xl bg-gradient-to-br from-primary to-violet-600 shadow-2xl shadow-primary/30 flex items-center justify-center">
            <Sms size={80} variant="Bulk" color="white" />
          </div>
        </motion.div>
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-6 right-6 w-16 h-16 rounded-2xl bg-fuchsia-500/20 flex items-center justify-center"
        >
          <Sparkles className="w-8 h-8 text-fuchsia-500" />
        </motion.div>
        <motion.div
          animate={{ scale: [1, 1.15, 1], opacity: [0.4, 0.7, 0.4] }}
          transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
          className="absolute bottom-8 left-6 w-14 h-14 rounded-xl bg-violet-500/20 flex items-center justify-center"
        >
          <MessageText size={28} variant="Bulk" color="currentColor" className="text-violet-500" />
        </motion.div>
      </div>
    ),
  },
  {
    icon: Chart,
    iconColor: "text-emerald-500",
    iconBg: "bg-emerald-500/10",
    titleKey: "welcome.features",
    descriptionKey: "welcome.featuresDesc",
    featuresKeys: ["welcome.featureAnalytics", "welcome.featureContacts", "welcome.featureHistory"],
    illustration: (
      <div className="relative w-full h-full flex items-center justify-center">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/20 via-teal-500/10 to-cyan-500/20 rounded-3xl" />
        <motion.div
          animate={{ y: [0, -8, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          className="relative z-10"
        >
          <div className="w-48 h-48 md:w-56 md:h-56 rounded-3xl bg-gradient-to-br from-emerald-500 to-teal-600 shadow-2xl shadow-emerald-500/30 flex items-center justify-center">
            <Chart size={80} variant="Bulk" color="white" />
          </div>
        </motion.div>
        <motion.div
          animate={{ rotate: [0, 10, -10, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-10 left-6 w-14 h-14 rounded-xl bg-teal-500/20 flex items-center justify-center"
        >
          <Sms size={28} variant="Bulk" color="currentColor" className="text-teal-500" />
        </motion.div>
      </div>
    ),
  },
  {
    icon: SecuritySafe,
    iconColor: "text-amber-500",
    iconBg: "bg-amber-500/10",
    titleKey: "welcome.security",
    descriptionKey: "welcome.securityDesc",
    featuresKeys: ["welcome.featureEncrypted", "welcome.featureSupport", "welcome.featureEmail"],
    illustration: (
      <div className="relative w-full h-full flex items-center justify-center">
        <div className="absolute inset-0 bg-gradient-to-br from-amber-500/20 via-orange-500/10 to-rose-500/20 rounded-3xl" />
        <motion.div
          animate={{ y: [0, -8, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          className="relative z-10"
        >
          <div className="w-48 h-48 md:w-56 md:h-56 rounded-3xl bg-gradient-to-br from-amber-500 to-orange-600 shadow-2xl shadow-amber-500/30 flex items-center justify-center">
            <SecuritySafe size={80} variant="Bulk" color="white" />
          </div>
        </motion.div>
        <motion.div
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          className="absolute bottom-6 right-8 w-12 h-12 rounded-xl bg-rose-500/20 flex items-center justify-center"
        >
          <MessageText size={24} variant="Bulk" color="currentColor" className="text-rose-500" />
        </motion.div>
      </div>
    ),
  },
]

export function WelcomeModal() {
  const { t } = useT()
  const [isOpen, setIsOpen] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)
  const [direction, setDirection] = useState(1)

  const steps = stepConfigs.map((cfg) => ({
    ...cfg,
    title: t(cfg.titleKey),
    description: t(cfg.descriptionKey),
    features: cfg.featuresKeys.map((k) => t(k)),
  }))

  useEffect(() => {
    const dismissed = localStorage.getItem(STORAGE_KEY)
    if (!dismissed) {
      const timer = setTimeout(() => setIsOpen(true), 800)
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
    enter: (dir: number) => ({ x: dir > 0 ? 300 : -300, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (dir: number) => ({ x: dir > 0 ? -300 : 300, opacity: 0 }),
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
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={dismiss}
          />

          {/* Modal */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 40 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 40 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="relative z-10 w-full max-w-3xl bg-card rounded-3xl shadow-2xl border border-border/50 overflow-hidden"
          >
            <div className="flex flex-col md:flex-row min-h-[420px]">
              {/* Left - Illustration */}
              <div className="hidden md:flex md:w-[45%] p-6 items-center justify-center overflow-hidden">
                <AnimatePresence mode="wait" custom={direction}>
                  <motion.div
                    key={currentStep}
                    custom={direction}
                    variants={slideVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{ duration: 0.35, ease: "easeInOut" }}
                    className="w-full h-72"
                  >
                    {step.illustration}
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Right - Content */}
              <div className="flex-1 flex flex-col justify-between p-6 md:p-8">
                <div>
                  {/* Skip */}
                  <div className="flex justify-end mb-4">
                    <button
                      onClick={dismiss}
                      className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {t('welcome.skip')}
                    </button>
                  </div>

                  <AnimatePresence mode="wait" custom={direction}>
                    <motion.div
                      key={currentStep}
                      custom={direction}
                      variants={slideVariants}
                      initial="enter"
                      animate="center"
                      exit="exit"
                      transition={{ duration: 0.35, ease: "easeInOut" }}
                    >
                      {/* Icon */}
                      <div className={`w-12 h-12 rounded-2xl ${step.iconBg} flex items-center justify-center mb-4`}>
                        <step.icon size={24} className={step.iconColor} />
                      </div>

                      {/* Mobile illustration */}
                      <div className="md:hidden mb-4 h-40">
                        {step.illustration}
                      </div>

                      <h2 className="text-xl md:text-2xl font-bold text-foreground mb-3">
                        {step.title}
                      </h2>
                      <p className="text-sm text-muted-foreground leading-relaxed mb-5">
                        {step.description}
                      </p>

                      {/* Features */}
                      <div className="space-y-2">
                        {step.features.map((feature, i) => (
                          <motion.div
                            key={feature}
                            initial={{ opacity: 0, x: 10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.1 + i * 0.08 }}
                            className="flex items-center gap-2.5"
                          >
                            <div className="w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                            <span className="text-sm text-foreground">{feature}</span>
                          </motion.div>
                        ))}
                      </div>
                    </motion.div>
                  </AnimatePresence>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between mt-8">
                  {/* Dots */}
                  <div className="flex items-center gap-2">
                    {steps.map((_, i) => (
                      <motion.button
                        key={i}
                        onClick={() => {
                          setDirection(i > currentStep ? 1 : -1)
                          setCurrentStep(i)
                        }}
                        className="relative h-2 rounded-full transition-colors"
                        animate={{
                          width: i === currentStep ? 24 : 8,
                          backgroundColor: i === currentStep ? "var(--primary)" : "var(--border)",
                        }}
                        transition={{ duration: 0.3 }}
                      />
                    ))}
                  </div>

                  {/* Navigation */}
                  <div className="flex items-center gap-2">
                    {currentStep > 0 && (
                      <button
                        onClick={prev}
                        className="p-2.5 rounded-xl border border-border hover:border-primary/40 hover:bg-primary/5 transition-all"
                      >
                        <ArrowLeft2 size={18} color="currentColor" />
                      </button>
                    )}
                    <button
                      onClick={next}
                      className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-white text-sm font-semibold shadow-md shadow-primary/25 hover:shadow-lg hover:shadow-primary/30 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
                    >
                      {isLast ? t('welcome.understood') : t('common.next')}
                      <ArrowRight2 size={16} color="currentColor" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
