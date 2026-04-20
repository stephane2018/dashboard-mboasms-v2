"use client"

import { useState, useRef, type ReactNode } from "react"
import { useT } from "@/core/hooks"
import { fileService } from "@/core/services/file.service"
import { toast } from "sonner"
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/shared/ui/dialog"
import { Button } from "@/shared/ui/button"
import { Progress } from "@/shared/ui/progress"
import { DocumentUpload, InfoCircle, Trash } from "iconsax-react"
import { CheckCircle2 } from "lucide-react"
import type { SenderId } from "../types"
import { cn } from "@/lib/utils"

function truncateFileName(name: string, maxLength: number = 30): string {
  if (name.length <= maxLength) return name
  const ext = name.lastIndexOf(".")
  if (ext === -1) return name.slice(0, maxLength) + "..."
  const baseName = name.slice(0, ext)
  const extension = name.slice(ext)
  const remaining = maxLength - extension.length - 3
  return baseName.slice(0, Math.max(1, remaining)) + "..." + extension
}

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
}: ReuploadSenderIdFilesDialogProps) {
  const { t } = useT()
  const [kycFile, setKycFile] = useState<File | null>(null)
  const [authLetterFile, setAuthLetterFile] = useState<File | null>(null)
  const [uploadProgress, setUploadProgress] = useState<{ kyc: number; authLetter: number }>({ kyc: 0, authLetter: 0 })
  const [isUploading, setIsUploading] = useState(false)
  const [uploadComplete, setUploadComplete] = useState(false)
  const [isDragging, setIsDragging] = useState<{ kyc: boolean; authLetter: boolean }>({ kyc: false, authLetter: false })
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

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>, zone: "kyc" | "authLetter") => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(prev => ({ ...prev, [zone]: true }))
  }

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>, zone: "kyc" | "authLetter") => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(prev => ({ ...prev, [zone]: false }))
  }

  const handleDropKyc = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(prev => ({ ...prev, kyc: false }))
    const file = e.dataTransfer.files?.[0]
    if (file && file.type === "application/pdf") {
      setKycFile(file)
    } else if (file) {
      toast.error(t("senderIds.pdfOnly"))
    }
  }

  const handleDropAuthLetter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(prev => ({ ...prev, authLetter: false }))
    const file = e.dataTransfer.files?.[0]
    if (file && file.type === "application/pdf") {
      setAuthLetterFile(file)
    } else if (file) {
      toast.error(t("senderIds.pdfOnly"))
    }
  }

  const clearFile = (zone: "kyc" | "authLetter") => {
    if (zone === "kyc") {
      setKycFile(null)
      if (kycInputRef.current) kycInputRef.current.value = ""
    } else {
      setAuthLetterFile(null)
      if (authLetterInputRef.current) authLetterInputRef.current.value = ""
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
      <DialogContent className="max-w-md max-h-[90vh] flex flex-col p-0 rounded-lg">
        <DialogTitle className="sr-only">{t("senderIds.reuploadFilesTitle")}</DialogTitle>
        {/* Hero Header */}
        <div className="bg-linear-to-br from-purple-600 to-purple-800 px-6 py-6 text-white">
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
                <div className="mt-3 rounded-lg bg-purple-50 dark:bg-purple-500/5 border border-purple-200 dark:border-purple-500/15 p-4 space-y-2">
                  <ul className="text-xs text-purple-900 dark:text-purple-300 space-y-2 list-disc list-inside">
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
                  <label className="text-sm font-medium">{t("senderIds.kycDocument")}</label>
                  <div
                    onDragOver={(e) => handleDragOver(e, "kyc")}
                    onDragLeave={(e) => handleDragLeave(e, "kyc")}
                    onDrop={handleDropKyc}
                    onClick={() => !isUploading && !kycFile && kycInputRef.current?.click()}
                    className={cn(
                      "border-2 border-dashed rounded-lg transition-all cursor-pointer",
                      isUploading && "border-muted bg-muted/30 cursor-not-allowed",
                      !isUploading && !kycFile && "border-border hover:border-purple-400 hover:bg-purple-50/50 dark:hover:bg-purple-500/5",
                      isDragging.kyc && "border-purple-500 bg-purple-50/20 dark:bg-purple-500/10",
                      kycFile && !uploadProgress.kyc && "border-emerald-500 bg-emerald-50/50 dark:bg-emerald-500/10"
                    )}
                  >
                    <input
                      ref={kycInputRef}
                      type="file"
                      onChange={handleKycFileChange}
                      accept=".pdf"
                      className="hidden"
                      disabled={isUploading}
                    />
                    {kycFile ? (
                      <div className="p-4 space-y-3">
                        <div className="flex items-center gap-3">
                          <div className="shrink-0 w-10 h-10 rounded-md bg-red-100 dark:bg-red-500/20 flex items-center justify-center">
                            <DocumentUpload size={20} className="text-red-600 dark:text-red-400" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-foreground truncate">{truncateFileName(kycFile.name)}</p>
                            <p className="text-xs text-muted-foreground">{kycSizeKo} Ko</p>
                          </div>
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              clearFile("kyc")
                            }}
                            className="shrink-0 p-1.5 rounded-md hover:bg-red-100 dark:hover:bg-red-500/20 transition-colors"
                            disabled={isUploading}
                          >
                            <Trash size={16} className="text-red-600 dark:text-red-400" />
                          </button>
                        </div>
                        {uploadProgress.kyc > 0 && uploadProgress.kyc < 100 && (
                          <div className="space-y-1.5">
                            <Progress value={uploadProgress.kyc} className="h-1" />
                            <p className="text-xs text-muted-foreground text-center">{uploadProgress.kyc}%</p>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="p-8 space-y-3 text-center">
                        <DocumentUpload size={40} className="mx-auto text-muted-foreground" />
                        <div>
                          <p className="text-sm font-medium text-foreground">{t("senderIds.clickToUpload")}</p>
                          <p className="text-xs text-muted-foreground mt-1">{t("senderIds.maxFileSize")}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Auth Letter File Upload */}
                <div className="mt-6 space-y-3">
                  <label className="text-sm font-medium">{t("senderIds.authLetterDocument")}</label>
                  <div
                    onDragOver={(e) => handleDragOver(e, "authLetter")}
                    onDragLeave={(e) => handleDragLeave(e, "authLetter")}
                    onDrop={handleDropAuthLetter}
                    onClick={() => !isUploading && !authLetterFile && authLetterInputRef.current?.click()}
                    className={cn(
                      "border-2 border-dashed rounded-lg transition-all cursor-pointer",
                      isUploading && "border-muted bg-muted/30 cursor-not-allowed",
                      !isUploading && !authLetterFile && "border-border hover:border-purple-400 hover:bg-purple-50/50 dark:hover:bg-purple-500/5",
                      isDragging.authLetter && "border-purple-500 bg-purple-50/20 dark:bg-purple-500/10",
                      authLetterFile && !uploadProgress.authLetter && "border-emerald-500 bg-emerald-50/50 dark:bg-emerald-500/10"
                    )}
                  >
                    <input
                      ref={authLetterInputRef}
                      type="file"
                      onChange={handleAuthLetterFileChange}
                      accept=".pdf"
                      className="hidden"
                      disabled={isUploading}
                    />
                    {authLetterFile ? (
                      <div className="p-4 space-y-3">
                        <div className="flex items-center gap-3">
                          <div className="shrink-0 w-10 h-10 rounded-md bg-red-100 dark:bg-red-500/20 flex items-center justify-center">
                            <DocumentUpload size={20} className="text-red-600 dark:text-red-400" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-foreground truncate">{truncateFileName(authLetterFile.name)}</p>
                            <p className="text-xs text-muted-foreground">{authLetterSizeKo} Ko</p>
                          </div>
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              clearFile("authLetter")
                            }}
                            className="shrink-0 p-1.5 rounded-md hover:bg-red-100 dark:hover:bg-red-500/20 transition-colors"
                            disabled={isUploading}
                          >
                            <Trash size={16} className="text-red-600 dark:text-red-400" />
                          </button>
                        </div>
                        {uploadProgress.authLetter > 0 && uploadProgress.authLetter < 100 && (
                          <div className="space-y-1.5">
                            <Progress value={uploadProgress.authLetter} className="h-1" />
                            <p className="text-xs text-muted-foreground text-center">{uploadProgress.authLetter}%</p>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="p-8 space-y-3 text-center">
                        <DocumentUpload size={40} className="mx-auto text-muted-foreground" />
                        <div>
                          <p className="text-sm font-medium text-foreground">{t("senderIds.clickToUpload")}</p>
                          <p className="text-xs text-muted-foreground mt-1">{t("senderIds.maxFileSize")}</p>
                        </div>
                      </div>
                    )}
                  </div>
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
