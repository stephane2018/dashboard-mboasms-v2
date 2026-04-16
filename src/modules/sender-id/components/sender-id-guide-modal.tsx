"use client"

import { useState, useEffect } from "react"
import { useT } from "@/core/hooks"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/shared/ui/dialog"
import { Button } from "@/shared/ui/button"
import { X, ArrowRight, ArrowLeft, CheckCircle, Download, Edit3, Upload, Clock } from "lucide-react"
import { cn } from "@/lib/utils"

interface SenderIdGuideModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function SenderIdGuideModal({ open, onOpenChange }: SenderIdGuideModalProps) {
  const { t } = useT()
  const [currentStep, setCurrentStep] = useState(0)
  const [isDismissed, setIsDismissed] = useState(false)

  // Check if guide was previously dismissed
  useEffect(() => {
    if (typeof window !== "undefined") {
      const dismissed = localStorage.getItem("senderIdGuideShown")
      if (dismissed === "true") {
        setIsDismissed(true)
      }
    }
  }, [])

  const steps = [
    {
      id: 1,
      title: t("senderIdGuide.step1Title"),
      description: t("senderIdGuide.step1Description"),
      tips: [
        t("senderIdGuide.step1Tip1"),
        t("senderIdGuide.step1Tip2"),
      ],
      icon: <Edit3 className="w-12 h-12 text-primary" />,
      visual: (
        <div className="flex items-center justify-center w-20 h-20 rounded-full bg-primary/10">
          <span className="text-2xl font-bold text-primary">ID</span>
        </div>
      ),
    },
    {
      id: 2,
      title: t("senderIdGuide.step2Title"),
      description: t("senderIdGuide.step2Description"),
      tips: [
        t("senderIdGuide.step2Tip1"),
        t("senderIdGuide.step2Tip2"),
      ],
      icon: <Download className="w-12 h-12 text-primary" />,
      visual: (
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2 px-3 py-2 bg-muted rounded-lg text-sm">
            <Download className="w-4 h-4" />
            <span>KYC A2P</span>
          </div>
          <div className="flex items-center gap-2 px-3 py-2 bg-muted rounded-lg text-sm">
            <Download className="w-4 h-4" />
            <span>{t("senderIds.authLetterLabel")}</span>
          </div>
        </div>
      ),
    },
    {
      id: 3,
      title: t("senderIdGuide.step3Title"),
      description: t("senderIdGuide.step3Description"),
      tips: [
        t("senderIdGuide.step3Tip1"),
        t("senderIdGuide.step3Tip2"),
      ],
      icon: <Edit3 className="w-12 h-12 text-primary" />,
      visual: (
        <div className="flex flex-col gap-2">
          <div className="w-20 h-28 bg-white border-2 border-muted rounded-lg shadow-sm flex items-center justify-center">
            <Edit3 className="w-6 h-6 text-muted-foreground" />
          </div>
          <div className="w-20 h-28 bg-white border-2 border-muted rounded-lg shadow-sm flex items-center justify-center">
            <CheckCircle className="w-6 h-6 text-green-500" />
          </div>
        </div>
      ),
    },
    {
      id: 4,
      title: t("senderIdGuide.step4Title"),
      description: t("senderIdGuide.step4Description"),
      tips: [
        t("senderIdGuide.step4Tip1"),
        t("senderIdGuide.step4Tip2"),
      ],
      icon: <Upload className="w-12 h-12 text-primary" />,
      visual: (
        <div className="flex flex-col gap-2">
          <div className="w-20 h-28 border-2 border-dashed border-muted rounded-lg flex flex-col items-center justify-center">
            <Upload className="w-6 h-6 text-muted-foreground mb-1" />
            <span className="text-xs text-muted-foreground">PDF/JPG</span>
          </div>
          <div className="w-20 h-28 border-2 border-dashed border-muted rounded-lg flex flex-col items-center justify-center">
            <Upload className="w-6 h-6 text-muted-foreground mb-1" />
            <span className="text-xs text-muted-foreground">PDF/JPG</span>
          </div>
        </div>
      ),
    },
    {
      id: 5,
      title: t("senderIdGuide.step5Title"),
      description: t("senderIdGuide.step5Description"),
      tips: [
        t("senderIdGuide.step5Tip1"),
        t("senderIdGuide.step5Tip2"),
      ],
      icon: <Clock className="w-12 h-12 text-primary" />,
      visual: (
        <div className="flex flex-col items-center gap-2">
          <div className="relative">
            <div className="w-16 h-16 rounded-full border-4 border-primary/20" />
            <div className="absolute inset-0 w-16 h-16 rounded-full border-4 border-primary border-t-transparent animate-spin" />
          </div>
          <span className="text-sm text-muted-foreground">{t("senderIds.statusPending")}</span>
        </div>
      ),
    },
  ]

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      handleDismiss()
    }
  }

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleDismiss = () => {
    if (typeof window !== "undefined") {
      localStorage.setItem("senderIdGuideShown", "true")
    }
    setIsDismissed(true)
    onOpenChange(false)
  }

  const handleSkip = () => {
    handleDismiss()
  }

  const currentStepData = steps[currentStep]
  const isLastStep = currentStep === steps.length - 1
  const isFirstStep = currentStep === 0

  return (
    <Dialog open={open && !isDismissed} onOpenChange={onOpenChange}>
      <DialogContent className={cn(
        "max-w-lg gap-0 p-0 overflow-hidden",
        "sm:max-w-[500px] md:max-w-[600px]"
      )}>
        {/* Progress Bar */}
        <div className="flex items-center gap-1 p-4 bg-muted/30">
          {steps.map((_, index) => (
            <div
              key={index}
              className={cn(
                "h-1 flex-1 rounded-full transition-all duration-300",
                index <= currentStep ? "bg-primary" : "bg-muted"
              )}
            />
          ))}
        </div>

        {/* Header */}
        <DialogHeader className="px-6 pt-4 pb-2">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <DialogTitle className="text-xl font-semibold">
                {currentStepData.title}
              </DialogTitle>
              <DialogDescription className="text-sm text-muted-foreground">
                {currentStepData.description}
              </DialogDescription>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleSkip}
              className="shrink-0 rounded-full h-8 w-8"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>

        {/* Content */}
        <div className="px-6 py-4">
          <div className="flex flex-col items-center space-y-6">
            {/* Visual Element */}
            <div className="flex items-center justify-center w-32 h-32">
              {currentStepData.visual}
            </div>

            {/* Tips */}
            <div className="w-full space-y-3">
              {currentStepData.tips.map((tip, index) => (
                <div key={index} className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-primary mt-0.5 shrink-0" />
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {tip}
                  </p>
                </div>
              ))}
            </div>

            {/* Step Counter */}
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span>{currentStep + 1}</span>
              <span>/</span>
              <span>{steps.length}</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between gap-3 px-6 py-4 border-t bg-muted/30">
          <Button
            variant="ghost"
            onClick={handleSkip}
            className="text-sm"
          >
            {t("common.skip")}
          </Button>

          <div className="flex items-center gap-2">
            {!isFirstStep && (
              <Button
                variant="outline"
                onClick={handlePrevious}
                disabled={isFirstStep}
                className="gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                {t("common.previous")}
              </Button>
            )}
            <Button
              onClick={handleNext}
              className="gap-2"
            >
              {isLastStep ? t("common.gotIt") : t("common.next")}
              {!isLastStep && <ArrowRight className="w-4 h-4" />}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
