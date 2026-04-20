"use client"

import { useState, useRef } from "react"
import { useT } from "@/core/hooks"
import { fileService } from "@/core/services/file.service"
import { toast } from "sonner"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/shared/ui/dialog"
import { Button } from "@/shared/ui/button"
import { Progress } from "@/shared/ui/progress"
import { DocumentUpload, TickSquare } from "iconsax-react"
import { AlertCircle, CheckCircle2 } from "lucide-react"
import type { SenderId } from "../types"

interface ReuploadSenderIdFilesDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  senderId: SenderId
  onSave: (id: string, urls: { kycA2PUrl: string; senderIdAuthLetterUrl: string; status: "EN_ATTENTE" }) => Promise<void>
  isLoading?: boolean
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
      // Upload KYC file
      setUploadProgress(prev => ({ ...prev, kyc: 50 }))
      const kycA2PUrl = await fileService.uploadFile(kycFile)
      
      if (!kycA2PUrl) {
        throw new Error("KYC URL not returned")
      }
      setUploadProgress(prev => ({ ...prev, kyc: 100 }))

      // Upload Auth Letter file
      setUploadProgress(prev => ({ ...prev, authLetter: 50 }))
      const senderIdAuthLetterUrl = await fileService.uploadFile(authLetterFile)
      
      if (!senderIdAuthLetterUrl) {
        throw new Error("Auth Letter URL not returned")
      }
      setUploadProgress(prev => ({ ...prev, authLetter: 100 }))

      // Save the URLs and reset status to EN_ATTENTE
      await onSave(senderId.id, { 
        kycA2PUrl, 
        senderIdAuthLetterUrl,
        status: "EN_ATTENTE"
      })
      
      setUploadComplete(true)
      toast.success(t("senderIds.filesUpdatedSuccess"))
      
      // Reset and close after 2 seconds
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
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{t("senderIds.reuploadFilesTitle")}</DialogTitle>
          <DialogDescription>
            {t("senderIds.reuploadFilesDesc")}
          </DialogDescription>
        </DialogHeader>

        {uploadComplete ? (
          <div className="space-y-4 py-8 text-center">
            <div className="flex justify-center">
              <CheckCircle2 className="h-16 w-16 text-green-500" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-foreground">{t("senderIds.submissionSuccessful")}</h3>
              <p className="text-sm text-muted-foreground mt-2">
                {t("senderIds.submissionSuccessfulDesc")}
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-6 py-4">
            {/* Instructions */}
            <div className="rounded-lg bg-blue-50 dark:bg-blue-500/5 border border-blue-200 dark:border-blue-500/15 p-4 space-y-2">
              <div className="flex gap-3">
                <AlertCircle className="h-5 w-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-medium text-blue-900 dark:text-blue-400 text-sm">{t("senderIds.submissionInstructions")}</h4>
                  <ul className="text-xs text-blue-800 dark:text-blue-300 mt-2 space-y-1 list-disc list-inside">
                    <li>{t("senderIds.instruction1")}</li>
                    <li>{t("senderIds.instruction2")}</li>
                    <li>{t("senderIds.instruction3")}</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* KYC File Upload */}
            <div className="space-y-2">
              <label className="text-sm font-medium">{t("senderIds.kycDocument")}</label>
              <div
                onClick={() => !isUploading && kycInputRef.current?.click()}
                className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
                  isUploading 
                    ? "border-muted bg-muted/30 cursor-not-allowed" 
                    : "border-border hover:border-primary cursor-pointer"
                }`}
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
                    <TickSquare size={28} className="mx-auto text-green-500" />
                    <p className="text-sm font-medium text-green-700 dark:text-green-400">{kycFile.name}</p>
                    <p className="text-xs text-muted-foreground">{(kycFile.size / 1024 / 1024).toFixed(2)} MB</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <DocumentUpload size={28} className="mx-auto text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">{t("senderIds.clickToUpload")}</p>
                    <p className="text-xs text-muted-foreground">{t("senderIds.maxFileSize")}</p>
                  </div>
                )}
              </div>
              {uploadProgress.kyc > 0 && uploadProgress.kyc < 100 && (
                <div className="space-y-1">
                  <Progress value={uploadProgress.kyc} />
                  <p className="text-xs text-muted-foreground text-center">{uploadProgress.kyc}%</p>
                </div>
              )}
            </div>

            {/* Auth Letter File Upload */}
            <div className="space-y-2">
              <label className="text-sm font-medium">{t("senderIds.authLetterDocument")}</label>
              <div
                onClick={() => !isUploading && authLetterInputRef.current?.click()}
                className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
                  isUploading 
                    ? "border-muted bg-muted/30 cursor-not-allowed" 
                    : "border-border hover:border-primary cursor-pointer"
                }`}
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
                    <TickSquare size={28} className="mx-auto text-green-500" />
                    <p className="text-sm font-medium text-green-700 dark:text-green-400">{authLetterFile.name}</p>
                    <p className="text-xs text-muted-foreground">{(authLetterFile.size / 1024 / 1024).toFixed(2)} MB</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <DocumentUpload size={28} className="mx-auto text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">{t("senderIds.clickToUpload")}</p>
                    <p className="text-xs text-muted-foreground">{t("senderIds.maxFileSize")}</p>
                  </div>
                )}
              </div>
              {uploadProgress.authLetter > 0 && uploadProgress.authLetter < 100 && (
                <div className="space-y-1">
                  <Progress value={uploadProgress.authLetter} />
                  <p className="text-xs text-muted-foreground text-center">{uploadProgress.authLetter}%</p>
                </div>
              )}
            </div>
          </div>
        )}

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => {
              handleReset()
              onOpenChange(false)
            }}
            disabled={isUploading || uploadComplete}
          >
            {t("common.cancel")}
          </Button>
          {!uploadComplete && (
            <Button
              onClick={handleUpload}
              disabled={isUploading || !kycFile || !authLetterFile}
            >
              {isUploading ? t("senderIds.uploading") : t("senderIds.submitFiles")}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
