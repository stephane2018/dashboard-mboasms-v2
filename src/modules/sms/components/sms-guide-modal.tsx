"use client"

import { useState, useEffect, useCallback, useMemo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ArrowRight2, ArrowLeft2, Sms, MessageText, UserTick, Information } from "iconsax-react"
import { CheckCircle2 } from "lucide-react"
import { useT } from "@/core/hooks"

const STORAGE_KEY = "mboasms_sms_guide_dismissed"

export function SmsGuideModal() {
  const { t } = useT()
  const [isOpen, setIsOpen] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)
  const [direction, setDirection] = useState(1)

  const steps = useMemo(() => [
    {
      title: t('smsGuide.step1Title'),
      description: t('smsGuide.step1Description'),
      tips: [
        t('smsGuide.step1Tip1'),
        t('smsGuide.step1Tip2'),
        t('smsGuide.step1Tip3'),
      ],
      icon: Sms,
      iconBg: "bg-primary/10",
      iconColor: "text-primary",
      visual: (
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2 p-3 rounded-xl bg-primary/5 border border-primary/10">
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
              <UserTick size={16} variant="Bulk" color="currentColor" className="text-primary" />
            </div>
            <div className="flex-1">
              <div className="h-2 w-24 rounded bg-primary/20" />
              <div className="h-1.5 w-16 rounded bg-muted mt-1.5" />
            </div>
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="flex items-center gap-2 p-3 rounded-xl bg-muted/50 border border-border/50">
            <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center">
              <UserTick size={16} variant="Bulk" color="currentColor" className="text-muted-foreground" />
            </div>
            <div className="flex-1">
              <div className="h-2 w-20 rounded bg-muted" />
              <div className="h-1.5 w-14 rounded bg-muted/60 mt-1.5" />
            </div>
          </div>
        </div>
      ),
    },
    {
      title: t('smsGuide.step2Title'),
      description: t('smsGuide.step2Description'),
      tips: [
        t('smsGuide.step2Tip1'),
        t('smsGuide.step2Tip2'),
        t('smsGuide.step2Tip3'),
      ],
      icon: MessageText,
      iconBg: "bg-emerald-500/10",
      iconColor: "text-emerald-500",
      visual: (
        <div className="p-3 rounded-xl bg-emerald-500/5 border border-emerald-500/10">
          <div className="space-y-2">
            <div className="h-2 w-full rounded bg-emerald-500/15" />
            <div className="h-2 w-3/4 rounded bg-emerald-500/15" />
            <div className="h-2 w-1/2 rounded bg-emerald-500/10" />
          </div>
          <div className="flex items-center justify-between mt-3 pt-2 border-t border-emerald-500/10">
            <span className="text-[10px] text-emerald-600 font-mono">45 / 160</span>
            <span className="text-[10px] text-emerald-600 font-medium">1 SMS</span>
          </div>
        </div>
      ),
    },
    {
      title: t('smsGuide.step3Title'),
      description: t('smsGuide.step3Description'),
      tips: [
        t('smsGuide.step3Tip1'),
        t('smsGuide.step3Tip2'),
        t('smsGuide.step3Tip3'),
      ],
      icon: Information,
      iconBg: "bg-amber-500/10",
      iconColor: "text-amber-500",
      visual: (
        <div className="space-y-2">
          <div className="flex items-center gap-2 p-3 rounded-xl bg-amber-500/5 border border-amber-500/10">
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center text-xs font-bold text-amber-600">
              ID
            </div>
            <div className="flex-1">
              <div className="text-xs font-semibold text-amber-600">infos</div>
              <div className="text-[10px] text-muted-foreground">{t('smsGuide.defaultSenderId')}</div>
            </div>
            <span className="text-[9px] px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-600 font-semibold">
              {t('smsGuide.active')}
            </span>
          </div>
          <div className="flex items-center gap-2 p-3 rounded-xl bg-muted/30 border border-border/50 opacity-60">
            <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center text-xs font-bold text-muted-foreground">
              ID
            </div>
            <div className="flex-1">
              <div className="text-xs font-medium text-muted-foreground">{t('smsGuide.myCompany')}</div>
              <div className="text-[10px] text-muted-foreground">{t('smsGuide.pendingValidation')}</div>
            </div>
            <span className="text-[9px] px-2 py-0.5 rounded-full bg-muted text-muted-foreground font-medium">
              {t('smsGuide.pending')}
            </span>
          </div>
        </div>
      ),
    },
  ], [t])

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
  }, [currentStep, dismiss, steps.length])

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
                  <Sms size={14} variant="Bulk" color="currentColor" className="text-primary" />
                </div>
                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  {t('smsGuide.title')}
                </span>
              </div>
              <button
                onClick={dismiss}
                className="text-xs text-muted-foreground hover:text-foreground transition-colors"
              >
                {t('welcome.skip')}
              </button>
            </div>

            {/* Content */}
            <div className="px-6 py-5 min-h-[340px] flex flex-col">
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
                  {/* Step icon + title */}
                  <div className={`w-11 h-11 rounded-xl ${step.iconBg} flex items-center justify-center mb-4`}>
                    <step.icon size={22} variant="Bulk" color="currentColor" className={step.iconColor} />
                  </div>

                  <h2 className="text-lg font-bold text-foreground mb-2">{step.title}</h2>
                  <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                    {step.description}
                  </p>

                  {/* Visual */}
                  <div className="mb-4">{step.visual}</div>

                  {/* Tips */}
                  <div className="space-y-1.5">
                    {step.tips.map((tip, i) => (
                      <motion.div
                        key={tip}
                        initial={{ opacity: 0, x: 8 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.08 + i * 0.06 }}
                        className="flex items-start gap-2"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5 text-primary mt-0.5 shrink-0" />
                        <span className="text-xs text-foreground/80">{tip}</span>
                      </motion.div>
                    ))}
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
                  {isLast ? t('welcome.understood') : t('common.next')}
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
