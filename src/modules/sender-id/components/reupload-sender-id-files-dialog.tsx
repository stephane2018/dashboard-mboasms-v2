"use client"

import { useState, useRef, type ReactNode } from "react"
import { useT } from "@/core/hooks"
import { fileService } from "@/core/services/file.service"
import { toast } from "sonner"
import {
  Dialog,
  DialogContent,
} from "@/shared/ui/dialog"
import { Button } from "@/shared/ui/button"
import { Progress } from "@/shared/ui/progress"
import { DocumentUpload, TickSquare, InfoCircle, CloseCircle } from "iconsax-react"
import { CheckCircle2 } from "lucide-react"
import type { SenderId } from "../types"
import { cn } from "@/lib/utils"

interface ReuploadSenderIdFilesDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  senderId: SenderId
  onSave: (id: string, urls: { kycA2PUrl: string; senderIdAuthLetterUrl: string; status: "EN_ATTENTE" }) => Promise<void>
  isLoading?: boolean
}

function SectionLabel({ icon, children }: { icon: ReactNode; children: ReactNode }) {
  return (
    <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
      <span className="text-primary">{icon}</span>
      {children}
    </div>
  )
}

export function ReuploadSenderIdFilesDialog({
  open,
  onOpenChange,
  senderId,
  onSave,
  isLoading = false,
}: ReuploadSenderIdFilesDialogProps) {
  const { t } = useT()
  const [kycFile, setKycFile] = useState<File | null>(null)
  const [authLetterFile, setAuthLetterFile] = useState<File | null>(null)
  const [uploadProgress, setUploadProgress] = useState<{ kyc: number; authLetter: number }>({ kyc: 0, authLetter: 0 })
  const [isUploading, setIsUploading] = useState(false)
  const [uploadComplete, setUploadComplete] = useState(false)
  const kycInputRef = useRef<HTMLInputElement>(null)
  const authLetterInputRef = useRef<HTMLInputElement>(null)

  const kycSizeKo = kycFile ? (kycFile.size / 1024).toFixed(0) : 0
  const authLetterSizeKo = authLetterFile ? (authLetterFile.size / 1024).toFixed(0) : 0

  const handleKycFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setKycFile(file)
    }
  }

  const handleAuthLetterFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setAuthLetterFile(file)
    }
  }

  const handleUpload = async () => {
    if (!kycFile || !authLetterFile) {
      toast.error(t("senderIds.bothFilesRequired"))
      return
    }

    setIsUploading(true)
    setUploadProgress({ kyc: 0, authLetter: 0 })
    setUploadComplete(false)

    try {
      setUploadProgress(prev => ({ ...prev, kyc: 50 }))
      const kycA2PUrl = await fileService.uploadFile(kycFile)

      if (!kycA2PUrl) {
        throw new Error("KYC URL not returned")
      }
      setUploadProgress(prev => ({ ...prev, kyc: 100 }))

      setUploadProgress(prev => ({ ...prev, authLetter: 50 }))
      const senderIdAuthLetterUrl = await fileService.uploadFile(authLetterFile)

      if (!senderIdAuthLetterUrl) {
        throw new Error("Auth Letter URL not returned")
      }
      setUploadProgress(prev => ({ ...prev, authLetter: 100 }))

      await onSave(senderId.id, {
        kycA2PUrl,
        senderIdAuthLetterUrl,
        status: "EN_ATTENTE"
      })

      setUploadComplete(true)
      toast.success(t("senderIds.filesUpdatedSuccess"))

      setTimeout(() => {
        setKycFile(null)
        setAuthLetterFile(null)
        setUploadProgress({ kyc: 0, authLetter: 0 })
        setUploadComplete(false)
        onOpenChange(false)
      }, 2000)
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : t("senderIds.uploadError")
      toast.error(errorMsg)
      setIsUploading(false)
    }
  }

  const handleReset = () => {
    setKycFile(null)
    setAuthLetterFile(null)
    setUploadProgress({ kyc: 0, authLetter: 0 })
    setUploadComplete(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] flex flex-col p-0">
        {/* Hero Header */}
        <div className="bg-linear-to-br from-amber-600 to-amber-700 px-6 py-6 text-white">
          <div className="flex items-start gap-3">
            <div className="bg-white/20 rounded-xl p-2.5">
              <DocumentUpload size={24} color="currentColor" />
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-bold">{t("senderIds.reuploadFilesTitle")}</h2>
              <p className="text-sm text-amber-100 mt-1">{t("senderIds.reuploadFilesDesc")}</p>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className={cn(
          "flex-1 overflow-y-auto px-6 py-6",
          uploadComplete && "flex flex-col items-center justify-center"
        )}>
          {uploadComplete ? (
            <div className="space-y-4 text-center">
              <div className="flex justify-center">
                <CheckCircle2 className="h-16 w-16 text-emerald-500" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-foreground">{t("senderIds.submissionSuccessful")}</h3>
                <p className="text-sm text-muted-foreground mt-2">
                  {t("senderIds.submissionSuccessfulDesc")}
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Instructions Section */}
              <div>
                <SectionLabel icon={<InfoCircle size={14} />}>
                  {t("senderIds.submissionInstructions")}
                </SectionLabel>
                <div className="mt-3 rounded-lg bg-amber-50 dark:bg-amber-500/5 border border-amber-200 dark:border-amber-500/15 p-4 space-y-2">
                  <ul className="text-xs text-amber-900 dark:text-amber-300 space-y-2 list-disc list-inside">
                    <li>{t("senderIds.instruction1")}</li>
                    <li>{t("senderIds.instruction2")}</li>
                    <li>{t("senderIds.instruction3")}</li>
                  </ul>
                </div>
              </div>

              {/* Documents Section */}
              <div>
                <SectionLabel icon={<DocumentUpload size={14} />}>
                  {t("senderIds.documents")}
                </SectionLabel>

                {/* KYC File Upload */}
                <div className="mt-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium">{t("senderIds.kycDocument")}</label>
                    {kycFile && (
                      <span className="text-xs text-muted-foreground">{kycSizeKo} Ko</span>
                    )}
                  </div>
                  <div
                    onClick={() => !isUploading && kycInputRef.current?.click()}
                    className={cn(
                      "border-2 border-dashed rounded-lg p-6 text-center transition-colors cursor-pointer",
                      isUploading && "border-muted bg-muted/30 cursor-not-allowed",
                      !isUploading && "border-border hover:border-primary hover:bg-primary/5",
                      kycFile && "border-emerald-500 bg-emerald-50 dark:bg-emerald-500/5"
                    )}
                  >
                    <input
                      ref={kycInputRef}
                      type="file"
                      onChange={handleKycFileChange}
                      accept=".pdf,.jpg,.jpeg,.png"
                      className="hidden"
                      disabled={isUploading}
                    />
                    {kycFile ? (
                      <div className="space-y-2">
                        <TickSquare size={32} className="mx-auto text-emerald-500" />
                        <p className="text-sm font-medium text-emerald-700 dark:text-emerald-400">{kycFile.name}</p>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <DocumentUpload size={32} className="mx-auto text-muted-foreground" />
                        <p className="text-sm text-foreground font-medium">{t("senderIds.clickToUpload")}</p>
                        <p className="text-xs text-muted-foreground">{t("senderIds.maxFileSize")}</p>
                      </div>
                    )}
                  </div>
                  {uploadProgress.kyc > 0 && uploadProgress.kyc < 100 && (
                    <div className="space-y-2">
                      <Progress value={uploadProgress.kyc} className="h-1.5" />
                      <p className="text-xs text-muted-foreground text-center">{uploadProgress.kyc}%</p>
                    </div>
                  )}
                </div>

                {/* Auth Letter File Upload */}
                <div className="mt-6 space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium">{t("senderIds.authLetterDocument")}</label>
                    {authLetterFile && (
                      <span className="text-xs text-muted-foreground">{authLetterSizeKo} Ko</span>
                    )}
                  </div>
                  <div
                    onClick={() => !isUploading && authLetterInputRef.current?.click()}
                    className={cn(
                      "border-2 border-dashed rounded-lg p-6 text-center transition-colors cursor-pointer",
                      isUploading && "border-muted bg-muted/30 cursor-not-allowed",
                      !isUploading && "border-border hover:border-primary hover:bg-primary/5",
                      authLetterFile && "border-emerald-500 bg-emerald-50 dark:bg-emerald-500/5"
                    )}
                  >
                    <input
                      ref={authLetterInputRef}
                      type="file"
                      onChange={handleAuthLetterFileChange}
                      accept=".pdf,.jpg,.jpeg,.png"
                      className="hidden"
                      disabled={isUploading}
                    />
                    {authLetterFile ? (
                      <div className="space-y-2">
                        <TickSquare size={32} className="mx-auto text-emerald-500" />
                        <p className="text-sm font-medium text-emerald-700 dark:text-emerald-400">{authLetterFile.name}</p>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <DocumentUpload size={32} className="mx-auto text-muted-foreground" />
                        <p className="text-sm text-foreground font-medium">{t("senderIds.clickToUpload")}</p>
                        <p className="text-xs text-muted-foreground">{t("senderIds.maxFileSize")}</p>
                      </div>
                    )}
                  </div>
                  {uploadProgress.authLetter > 0 && uploadProgress.authLetter < 100 && (
                    <div className="space-y-2">
                      <Progress value={uploadProgress.authLetter} className="h-1.5" />
                      <p className="text-xs text-muted-foreground text-center">{uploadProgress.authLetter}%</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Sticky Footer */}
        {!uploadComplete && (
          <div className="border-t bg-card px-6 py-4 flex gap-3 justify-end">
            <Button
              variant="outline"
              onClick={() => {
                handleReset()
                onOpenChange(false)
              }}
              disabled={isUploading}
            >
              {t("common.cancel")}
            </Button>
            <Button
              onClick={handleUpload}
              disabled={isUploading || !kycFile || !authLetterFile}
            >
              {isUploading ? t("senderIds.uploading") : t("senderIds.submitFiles")}
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
