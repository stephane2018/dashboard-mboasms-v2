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
import type { SenderId } from "../types"

interface ReuploadSenderIdFilesDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  senderId: SenderId
  onSave: (id: string, urls: { kycA2PUrl: string; senderIdAuthLetterUrl: string }) => Promise<void>
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

      // Save the URLs
      await onSave(senderId.id, { kycA2PUrl, senderIdAuthLetterUrl })
      
      // Reset and close
      setKycFile(null)
      setAuthLetterFile(null)
      setUploadProgress({ kyc: 0, authLetter: 0 })
      onOpenChange(false)
      toast.success(t("senderIds.filesUpdatedSuccess"))
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : t("senderIds.uploadError")
      toast.error(errorMsg)
    } finally {
      setIsUploading(false)
    }
  }

  const handleReset = () => {
    setKycFile(null)
    setAuthLetterFile(null)
    setUploadProgress({ kyc: 0, authLetter: 0 })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{t("senderIds.reuploadFilesTitle")}</DialogTitle>
          <DialogDescription>
            {t("senderIds.reuploadFilesDesc")}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* KYC File Upload */}
          <div className="space-y-2">
            <label className="text-sm font-medium">{t("senderIds.kycDocument")}</label>
            <div
              onClick={() => kycInputRef.current?.click()}
              className="border-2 border-dashed rounded-lg p-4 text-center cursor-pointer hover:border-primary transition-colors"
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
                  <TickSquare size={24} className="mx-auto text-green-500" />
                  <p className="text-sm font-medium text-green-700">{kycFile.name}</p>
                </div>
              ) : (
                <div className="space-y-2">
                  <DocumentUpload size={24} className="mx-auto text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">{t("senderIds.clickToUpload")}</p>
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
              onClick={() => authLetterInputRef.current?.click()}
              className="border-2 border-dashed rounded-lg p-4 text-center cursor-pointer hover:border-primary transition-colors"
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
                  <TickSquare size={24} className="mx-auto text-green-500" />
                  <p className="text-sm font-medium text-green-700">{authLetterFile.name}</p>
                </div>
              ) : (
                <div className="space-y-2">
                  <DocumentUpload size={24} className="mx-auto text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">{t("senderIds.clickToUpload")}</p>
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

        <DialogFooter>
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
            {isUploading ? t("senderIds.uploading") : t("senderIds.updateFiles")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
