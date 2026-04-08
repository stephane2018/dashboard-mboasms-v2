"use client"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/shared/ui/dialog"
import { Button } from "@/shared/ui/button"
import { useT } from "@/core/hooks"

import type { ContactData } from "./import-steps/types"
import { ImportStep } from "./import-steps/ImportStep"
import { ValidationStep } from "./import-steps/ValidationStep"
import { ReviewStep } from "./import-steps/ReviewStep"
import { ConfirmStep } from "./import-steps/ConfirmStep"

interface ImportModalProps {
  isOpen: boolean
  onClose: () => void
  onImport: (contacts: ContactData[]) => Promise<void>
  isLoading?: boolean
}

export type ImportStepType = "upload" | "validation" | "review" | "confirm"

export function ImportModal({
  isOpen,
  onClose,
  onImport,
  isLoading = false,
}: ImportModalProps) {
  const { t } = useT()
  const [currentStep, setCurrentStep] = useState<ImportStepType>("upload")
  const [contacts, setContacts] = useState<ContactData[]>([])
  const [validationErrors, setValidationErrors] = useState<string[]>([])
  const [isProcessing, setIsProcessing] = useState(false)

  const handleFileLoad = (loadedContacts: ContactData[], errors: string[]) => {
    setContacts(loadedContacts)
    setValidationErrors(errors)
    setCurrentStep("validation")
  }

  const handleValidationComplete = () => {
    setCurrentStep("review")
  }

  const handleContactsUpdate = (updatedContacts: ContactData[]) => {
    setContacts(updatedContacts)
  }

  const handleReviewComplete = () => {
    setCurrentStep("confirm")
  }

  const handleImportConfirm = async () => {
    setIsProcessing(true)
    try {
      await onImport(contacts)
      handleClose()
    } catch (error) {
      // Error handled silently
    } finally {
      setIsProcessing(false)
    }
  }

  const handleClose = () => {
    setCurrentStep("upload")
    setContacts([])
    setValidationErrors([])
    onClose()
  }

  const handleBack = () => {
    if (currentStep === "validation") {
      setCurrentStep("upload")
      setValidationErrors([])
    } else if (currentStep === "review") {
      setCurrentStep("validation")
    } else if (currentStep === "confirm") {
      setCurrentStep("review")
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>{t('users.importContacts')}</DialogTitle>
          <DialogDescription>
            {currentStep === "upload" && t('users.uploadDesc')}
            {currentStep === "validation" && t('users.validationDesc')}
            {currentStep === "review" && t('users.reviewDesc')}
            {currentStep === "confirm" && t('users.confirmDesc')}
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          {currentStep === "upload" && (
            <ImportStep onFileLoad={handleFileLoad} isLoading={isLoading} />
          )}
          {currentStep === "validation" && (
            <ValidationStep
              contacts={contacts}
              errors={validationErrors}
              onValidationComplete={handleValidationComplete}
            />
          )}
          {currentStep === "review" && (
            <ReviewStep
              contacts={contacts}
              onContactsUpdate={handleContactsUpdate}
              onReviewComplete={handleReviewComplete}
            />
          )}
          {currentStep === "confirm" && (
            <ConfirmStep
              contacts={contacts}
              onImportConfirm={handleImportConfirm}
              isProcessing={isProcessing}
            />
          )}
        </div>

        <div className="flex gap-2 pt-4 border-t">
          <Button
            variant="outline"
            onClick={handleBack}
            disabled={currentStep === "upload" || isProcessing}
            className="flex-1"
          >
            {t('common.back')}
          </Button>
          <Button
            variant="outline"
            onClick={handleClose}
            disabled={isProcessing}
            className="flex-1"
          >
            {t('common.cancel')}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
