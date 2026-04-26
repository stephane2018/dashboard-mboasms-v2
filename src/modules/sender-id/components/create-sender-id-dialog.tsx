"use client"

import { useState, useRef, useEffect, type ReactNode } from "react"
import { useT } from "@/core/hooks"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/shared/ui/dialog"
import { Button } from "@/shared/ui/button"
import { Input } from "@/shared/ui/input"
import { Textarea } from "@/shared/ui/textarea"
import {
  UserTag,
  InfoCircle,
  DocumentDownload,
  DocumentUpload,
  CloseCircle,
  TickCircle,
  Document,
  Building,
} from "iconsax-react"
import { Loader2, Search } from "lucide-react"
import { toast } from "sonner"
import type { CreateSenderIdInput } from "../types"
import { fileService } from "@/core/services/file.service"
import { senderIdService } from "@/core/services/sender-id.service"
import { isSenderIdBlacklisted } from "../constants/blacklist"
import { cn } from "@/lib/utils"
import { httpClient } from "@/core/lib/http-client"
import type { EnterpriseType } from "@/core/models/enterprise"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/shared/ui/tabs"

interface CreateSenderIdDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSave: (input: CreateSenderIdInput) => Promise<void>
  isLoading?: boolean
  enterpriseId: string
}

function SectionLabel({ icon, children }: { icon: ReactNode; children: ReactNode }) {
  return (
    <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
      <span className="text-primary">{icon}</span>
      {children}
    </div>
  )
}

export function CreateSenderIdDialog({
  open,
  onOpenChange,
  onSave,
  isLoading = false,
  enterpriseId,
}: CreateSenderIdDialogProps) {
  const { t } = useT()
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")

  // Enterprise section
  const ENTERPRISE_FIELD_LABELS: Record<string, string> = {
    socialRaison: "Raison sociale",
    numeroCommerce: "Numéro de commerce",
    urlImage: "Logo (URL)",
    urlSiteweb: "Site web",
    telephoneEnterprise: "Téléphone",
    emailEnterprise: "Email",
    villeEnterprise: "Ville",
    adresseEnterprise: "Adresse",
    activityDomain: "Domaine d'activité",
    contribuableNumber: "Numéro contribuable",
    pays: "Pays",
  }

  const ALL_ENTERPRISE_KEYS = Object.keys(ENTERPRISE_FIELD_LABELS)

  // Initialise avec tous les champs vides — le fetch retire ceux déjà remplis
  const [enterpriseFields, setEnterpriseFields] = useState<Record<string, string>>(
    () => Object.fromEntries(ALL_ENTERPRISE_KEYS.map((k) => [k, ""]))
  )
  const [isUpdatingEnterprise, setIsUpdatingEnterprise] = useState(false)

  useEffect(() => {
    if (!open || !enterpriseId) return
    // Remet tous les champs vides à l'ouverture
    setEnterpriseFields(Object.fromEntries(ALL_ENTERPRISE_KEYS.map((k) => [k, ""])))
    httpClient.get(`/api/v1/enterprise/${enterpriseId}`)
      .then((res: any) => {
        const data: Partial<EnterpriseType> = res?.data?.content ?? res?.data ?? res
        setEnterpriseFields((prev) => {
          const next = { ...prev }
          ALL_ENTERPRISE_KEYS.forEach((key) => {
            const val = (data as any)[key]
            if (val && typeof val === "string" && val.trim() !== "") {
              delete next[key] // champ déjà rempli → on le retire
            }
          })
          return next
        })
      })
      .catch(() => {}) // fetch échoue → on garde tous les champs affichés
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, enterpriseId])

  const emptyEnterpriseKeys = Object.keys(enterpriseFields)

  const handleEnterpriseUpdate = async () => {
    const payload: Record<string, string> = {}
    emptyEnterpriseKeys.forEach((key) => {
      if (enterpriseFields[key]?.trim()) payload[key] = enterpriseFields[key].trim()
    })
    if (Object.keys(payload).length === 0) return
    setIsUpdatingEnterprise(true)
    try {
      await httpClient.put(`/api/v1/enterprise/${enterpriseId}`, payload)
      toast.success("Informations entreprise mises à jour")
      setEnterpriseFields((prev) => {
        const next = { ...prev }
        Object.keys(payload).forEach((k) => delete next[k])
        return next
      })
    } catch {
      toast.error("Erreur lors de la mise à jour")
    } finally {
      setIsUpdatingEnterprise(false)
    }
  }

  const [kycFile, setKycFile] = useState<File | null>(null)
  const [authLetterFile, setAuthLetterFile] = useState<File | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [isChecking, setIsChecking] = useState(false)
  const [availabilityStatus, setAvailabilityStatus] = useState<"idle" | "available" | "taken">("idle")
  const [uploadProgress, setUploadProgress] = useState<{ kyc: number; authLetter: number }>({ kyc: 0, authLetter: 0 })
  const [uploadSpeed, setUploadSpeed] = useState<{ kyc: string; authLetter: string }>({ kyc: "", authLetter: "" })
  const [uploadStartTime, setUploadStartTime] = useState<{ kyc: number; authLetter: number }>({ kyc: 0, authLetter: 0 })
  const [kycUrl, setKycUrl] = useState<string>("")
  const [authLetterUrl, setAuthLetterUrl] = useState<string>("")
  const kycInputRef = useRef<HTMLInputElement>(null)
  const authLetterInputRef = useRef<HTMLInputElement>(null)

  const nameLength = name.length
  const isAlphanumeric = /^[a-zA-Z0-9]*$/.test(name)
  const isBlacklisted = name.trim().length > 0 && isSenderIdBlacklisted(name)
  const isNameValid = name.trim().length > 0 && nameLength <= 11 && isAlphanumeric && !isBlacklisted

  const handleCheckAvailability = async () => {
    if (!isNameValid) return
    setIsChecking(true)
    try {
      const result = await senderIdService.checkSenderIdAvailability(name)
      setAvailabilityStatus(result.available ? "available" : "taken")
    } catch {
      toast.error(t("senderIds.checkError", { defaultValue: "Erreur lors de la vérification" }))
      setAvailabilityStatus("idle")
    } finally {
      setIsChecking(false)
    }
  }

  const calculateUploadSpeed = (startTime: number, fileSize: number, progress: number) => {
    if (progress === 0 || startTime === 0) return ""
    const elapsed = (Date.now() - startTime) / 1000 // en secondes
    const uploadedBytes = (fileSize * progress) / 100
    const speed = uploadedBytes / elapsed // bytes par seconde
    
    if (speed < 1024) return `${speed.toFixed(1)} B/s`
    if (speed < 1024 * 1024) return `${(speed / 1024).toFixed(1)} KB/s`
    return `${(speed / (1024 * 1024)).toFixed(1)} MB/s`
  }

  const handleSave = async () => {
    if (!kycFile || !authLetterFile) {
      toast.error(t("senderIds.bothFilesRequired"))
      return
    }

    setIsUploading(true)
    setUploadProgress({ kyc: 0, authLetter: 0 })
    setUploadSpeed({ kyc: "", authLetter: "" })

    try {
      // Step 1: Upload KYC file with progress
      const kycStartTime = Date.now()
      setUploadStartTime(prev => ({ ...prev, kyc: kycStartTime }))
      
      // Simuler la progression (normalement fileService aurait un callback de progrès)
      let kycProgress = 10
      const kycInterval = setInterval(() => {
        if (kycProgress < 95) {
          kycProgress += Math.random() * 30
          if (kycProgress > 95) kycProgress = 95
          setUploadProgress(prev => ({ ...prev, kyc: kycProgress }))
          setUploadSpeed(prev => ({
            ...prev,
            kyc: calculateUploadSpeed(kycStartTime, kycFile.size, kycProgress)
          }))
        }
      }, 300)
      
      const kycA2PUrl = await fileService.uploadFile(kycFile)
      clearInterval(kycInterval)

      console.log("KYC response received:", { kycA2PUrl, type: typeof kycA2PUrl })
      if (!kycA2PUrl || typeof kycA2PUrl !== "string" || kycA2PUrl.trim().length === 0) {
        console.error("KYC URL validation failed:", { kycA2PUrl, type: typeof kycA2PUrl })
        throw new Error(`Invalid KYC URL response: ${JSON.stringify(kycA2PUrl)}`)
      }
      setKycUrl(kycA2PUrl)
      setUploadProgress(prev => ({ ...prev, kyc: 100 }))
      setUploadSpeed(prev => ({ ...prev, kyc: calculateUploadSpeed(kycStartTime, kycFile.size, 100) }))

      // Step 2: Upload Auth Letter file with progress
      const authStartTime = Date.now()
      setUploadStartTime(prev => ({ ...prev, authLetter: authStartTime }))
      
      let authProgress = 10
      const authInterval = setInterval(() => {
        if (authProgress < 95) {
          authProgress += Math.random() * 30
          if (authProgress > 95) authProgress = 95
          setUploadProgress(prev => ({ ...prev, authLetter: authProgress }))
          setUploadSpeed(prev => ({
            ...prev,
            authLetter: calculateUploadSpeed(authStartTime, authLetterFile.size, authProgress)
          }))
        }
      }, 300)
      
      const senderIdAuthLetterUrl = await fileService.uploadFile(authLetterFile)
      clearInterval(authInterval)

      if (!senderIdAuthLetterUrl || typeof senderIdAuthLetterUrl !== "string" || senderIdAuthLetterUrl.trim().length === 0) {
        console.error("Auth Letter URL validation failed:", { senderIdAuthLetterUrl })
        throw new Error("Invalid Auth Letter URL response")
      }
      setAuthLetterUrl(senderIdAuthLetterUrl)
      setUploadProgress(prev => ({ ...prev, authLetter: 100 }))
      setUploadSpeed(prev => ({ ...prev, authLetter: calculateUploadSpeed(authStartTime, authLetterFile.size, 100) }))

      // Step 3: Create sender ID with the collected URLs
      await onSave({ name, description, enterpriseId, kycA2PUrl, senderIdAuthLetterUrl })
      resetForm()
      onOpenChange(false)
      toast.success(t("senderIds.createSuccess", { defaultValue: "Sender ID créé avec succès" }))
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : t("senderIds.uploadError")
      toast.error(errorMsg)
    } finally {
      setIsUploading(false)
      setUploadProgress({ kyc: 0, authLetter: 0 })
      setUploadSpeed({ kyc: "", authLetter: "" })
    }
  }

  const resetForm = () => {
    setName("")
    setDescription("")
    setKycFile(null)
    setAuthLetterFile(null)
    setAvailabilityStatus("idle")
  }

  const handleCancel = () => {
    resetForm()
    onOpenChange(false)
  }

  const handleFileChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    setter: (file: File | null) => void
  ) => {
    const file = event.target.files?.[0] ?? null
    setter(file)
    event.target.value = ""
  }

  const downloadDocument = (docType: "template1" | "template2") => {
    const urls = {
      template1: "https://firebasestorage.googleapis.com/v0/b/package-tracking-system-445f6.appspot.com/o/MBOASMS%2FKYC_A2P_2025.docx?alt=media&token=507be5cf-33e5-4483-a4d3-1a3a88a0385a",
      template2: "https://firebasestorage.googleapis.com/v0/b/package-tracking-system-445f6.appspot.com/o/MBOASMS%2FSender%20ID%20autorization%20letter.docx?alt=media&token=5de005a2-255f-4fdf-9842-4c2491e5d186",
    }
    window.open(urls[docType], "_blank")
  }

  const isBusy = isLoading || isUploading
  const canSubmit = isNameValid && !!kycFile && !!authLetterFile

  const counterColor =
    nameLength === 0
      ? "text-muted-foreground"
      : nameLength > 9
      ? "text-amber-500"
      : "text-emerald-500"

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[480px] p-0 gap-0 overflow-hidden">
        {/* Hero header */}
        <div className="relative bg-gradient-to-br from-primary/10 via-primary/5 to-transparent border-b border-border/60 px-5 py-5">
          <div className="absolute inset-0 opacity-40 [background-image:radial-gradient(circle_at_top_right,theme(colors.primary/15),transparent_60%)]" />
          <DialogHeader className="relative">
            <div className="flex items-start gap-3">
              <div className="rounded-xl bg-primary/15 p-2.5 ring-1 ring-primary/20">
                <UserTag size={20} color="currentColor" variant="Bulk" className="text-primary" />
              </div>
              <div className="flex-1 text-left">
                <DialogTitle className="text-base font-semibold text-foreground">
                  {t("senderIds.newTitle")}
                </DialogTitle>
                <DialogDescription className="text-xs text-muted-foreground mt-0.5">
                  {t("senderIds.createSubtitle")}
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="sender-id" className="flex flex-col">
          <div className="px-5 pt-3 pb-0 border-b border-border/60">
            <TabsList className="w-full h-9 rounded-lg">
              <TabsTrigger value="sender-id" className="flex-1 text-xs gap-1.5">
                <UserTag size={12} color="currentColor" variant="Bulk" />
                Sender ID
              </TabsTrigger>
              <TabsTrigger value="enterprise" className="flex-1 text-xs gap-1.5">
                <Building size={12} color="currentColor" variant="Bulk" />
                Entreprise
                {emptyEnterpriseKeys.length > 0 && (
                  <span className="ml-1 flex h-4 w-4 items-center justify-center rounded-full bg-amber-500 text-[9px] font-bold text-white">
                    {emptyEnterpriseKeys.length}
                  </span>
                )}
              </TabsTrigger>
            </TabsList>
          </div>

          {/* Scrollable body */}
          <div className="max-h-[60vh] overflow-y-auto px-5 py-5">
          <TabsContent value="sender-id" className="space-y-5 mt-0">
          {/* Identité */}
          <section className="space-y-3">
            <SectionLabel icon={<UserTag size={12} color="currentColor" variant="Bulk" />}>
              {t("senderIds.senderIdName")}
            </SectionLabel>

            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <div className="relative flex-1">
                  <Input
                    id="sender-name"
                    value={name}
                    onChange={(e) => {
                      setName(e.target.value.replace(/[^a-zA-Z0-9]/g, "").slice(0, 11))
                      setAvailabilityStatus("idle")
                    }}
                    placeholder="MONENTREPRISE"
                    disabled={isLoading}
                    className="h-11 rounded-lg pr-16 font-mono uppercase tracking-wide"
                    maxLength={11}
                  />
                  <span
                    className={cn(
                      "absolute right-3 top-1/2 -translate-y-1/2 text-[11px] tabular-nums font-medium",
                      counterColor
                    )}
                  >
                    {nameLength}/11
                  </span>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleCheckAvailability}
                  disabled={!isNameValid || isChecking || isBusy}
                  className="h-11 px-3 rounded-lg shrink-0 gap-1.5 text-[11px] hover:border-primary/40 hover:bg-primary/5"
                >
                  {isChecking ? (
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  ) : (
                    <Search className="h-3.5 w-3.5" />
                  )}
                  {t("senderIds.checkAvailability", { defaultValue: "Vérifier" })}
                </Button>
              </div>
              {name && !isAlphanumeric && (
                <div className="flex items-center gap-1.5 text-[11px] text-red-500">
                  <CloseCircle size={12} color="currentColor" variant="Bulk" />
                  {t("senderIds.alphanumericOnly")}
                </div>
              )}
              {name && isAlphanumeric && isBlacklisted && (
                <div className="flex items-center gap-1.5 text-[11px] text-red-500">
                  <CloseCircle size={12} color="currentColor" variant="Bulk" />
                  {t("senderIds.blacklisted")}
                </div>
              )}
              {availabilityStatus === "available" && (
                <div className="flex items-center gap-1.5 text-[11px] text-emerald-500">
                  <TickCircle size={12} color="currentColor" variant="Bulk" />
                  {t("senderIds.senderIdAvailable", { defaultValue: "Ce Sender ID est disponible" })}
                </div>
              )}
              {availabilityStatus === "taken" && (
                <div className="flex items-center gap-1.5 text-[11px] text-red-500">
                  <CloseCircle size={12} color="currentColor" variant="Bulk" />
                  {t("senderIds.senderIdTaken", { defaultValue: "Ce Sender ID est déjà utilisé" })}
                </div>
              )}
            </div>
          </section>

          {/* Description */}
          <section className="space-y-3">
            <SectionLabel icon={<Document size={12} color="currentColor" variant="Bulk" />}>
              {t("senderIds.descriptionOptional")}
            </SectionLabel>
            <Textarea
              id="sender-desc"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder={t("senderIds.usagePlaceholder")}
              disabled={isLoading}
              rows={3}
              className="rounded-lg resize-none text-sm"
            />
          </section>

          



          {/* Documents */}
          <section className="space-y-3">
            <SectionLabel icon={<DocumentDownload size={12} color="currentColor" variant="Bulk" />}>
              {t("senderIds.documentsSection")}
            </SectionLabel>

            {/* Warning */}
            <div className="flex items-start gap-2.5 p-3 rounded-xl bg-amber-500/10 border border-amber-500/20">
              <InfoCircle size={16} color="currentColor" variant="Bulk" className="text-amber-500 shrink-0 mt-0.5" />
              <p className="text-[11px] text-amber-700 dark:text-amber-400 leading-relaxed">
                {t("senderIds.documentsWarning")}
              </p>
            </div>

            {/* Templates download */}
            <div className="rounded-xl border border-border/60 bg-muted/30 p-3 space-y-2.5">
              <p className="text-[11px] text-muted-foreground flex items-center gap-1.5">
                <DocumentDownload size={12} color="currentColor" />
                {t("senderIds.downloadTemplates")}
              </p>
              <div className="grid grid-cols-2 gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => downloadDocument("template1")}
                  className="gap-1.5 h-9 rounded-lg text-[11px] bg-background hover:border-primary/40 hover:bg-primary/5"
                >
                  <DocumentDownload size={13} color="currentColor" />
                  {t("senderIds.template1")}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => downloadDocument("template2")}
                  className="gap-1.5 h-9 rounded-lg text-[11px] bg-background hover:border-primary/40 hover:bg-primary/5"
                >
                  <DocumentDownload size={13} color="currentColor" />
                  {t("senderIds.template2")}
                </Button>
              </div>
            </div>

            {/* KYC A2P Upload */}
            <div className="space-y-2">
              <p className="text-[11px] font-medium text-foreground">
                {t("senderIds.kycA2PLabel")} <span className="text-red-500">*</span>
              </p>
              <p className="text-[11px] text-muted-foreground">{t("senderIds.kycA2PDesc")}</p>
              <input
                ref={kycInputRef}
                type="file"
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={(e) => handleFileChange(e, setKycFile)}
                className="hidden"
              />
              {kycFile ? (
                <div className="space-y-2">
                  <div className="group flex items-center justify-between gap-2 px-3 py-2 rounded-lg bg-muted/40 border border-border/50 text-[12px]">
                    <div className="flex items-center gap-2 min-w-0 flex-1">
                      <Document size={14} color="currentColor" variant="Bulk" className="text-primary shrink-0" />
                      <span className="truncate font-medium text-foreground">{kycFile.name}</span>
                      <span className="text-[10px] text-muted-foreground tabular-nums shrink-0">
                        {(kycFile.size / 1024).toFixed(0)} Ko
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setKycFile(null)}
                      disabled={isUploading}
                      className="rounded-md p-1 text-muted-foreground hover:text-red-500 hover:bg-red-500/10 transition-colors disabled:opacity-50"
                    >
                      <CloseCircle size={14} color="currentColor" variant="Bulk" />
                    </button>
                  </div>
                  {isUploading && uploadProgress.kyc > 0 && (
                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-[10px]">
                        <span className="text-muted-foreground">Upload KYC</span>
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-primary">{uploadProgress.kyc}%</span>
                          {uploadSpeed.kyc && <span className="text-gray-500">• {uploadSpeed.kyc}</span>}
                        </div>
                      </div>
                      <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
                        <div
                          className="h-full bg-primary transition-all duration-300"
                          style={{ width: `${uploadProgress.kyc}%` }}
                        />
                      </div>
                    </div>
                  )}
                  {kycUrl && (
                    <div className="space-y-1">
                      <div className="flex items-center gap-1.5 text-[10px] text-emerald-500">
                        <TickCircle size={12} color="currentColor" variant="Bulk" />
                        Fichier uploadé avec succès
                      </div>
                      <a
                        href={kycUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 p-2 rounded-lg bg-primary/5 border border-primary/20 hover:bg-primary/10 transition-colors group"
                      >
                        <span className="text-primary text-[10px] group-hover:underline break-all flex-1">
                          {kycUrl}
                        </span>
                        <span className="text-primary text-xs shrink-0">↗</span>
                      </a>
                    </div>
                  )}
                </div>
              ) : (
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => kycInputRef.current?.click()}
                  disabled={isBusy}
                  className={cn(
                    "w-full gap-2 h-12 rounded-lg text-xs border-dashed",
                    "hover:border-primary/40 hover:bg-primary/5 transition-colors"
                  )}
                >
                  <DocumentUpload size={16} color="currentColor" variant="Bulk" className="text-primary" />
                  {t("senderIds.selectFile")}
                </Button>
              )}
            </div>

            {/* Sender ID Auth Letter Upload */}
            <div className="space-y-2">
              <p className="text-[11px] font-medium text-foreground">
                {t("senderIds.authLetterLabel")} <span className="text-red-500">*</span>
              </p>
              <p className="text-[11px] text-muted-foreground">{t("senderIds.authLetterDesc")}</p>
              <input
                ref={authLetterInputRef}
                type="file"
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={(e) => handleFileChange(e, setAuthLetterFile)}
                className="hidden"
              />
              {authLetterFile ? (
                <div className="space-y-2">
                  <div className="group flex items-center justify-between gap-2 px-3 py-2 rounded-lg bg-muted/40 border border-border/50 text-[12px]">
                    <div className="flex items-center gap-2 min-w-0 flex-1">
                      <Document size={14} color="currentColor" variant="Bulk" className="text-primary shrink-0" />
                      <span className="truncate font-medium text-foreground">{authLetterFile.name}</span>
                      <span className="text-[10px] text-muted-foreground tabular-nums shrink-0">
                        {(authLetterFile.size / 1024).toFixed(0)} Ko
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setAuthLetterFile(null)}
                      disabled={isUploading}
                      className="rounded-md p-1 text-muted-foreground hover:text-red-500 hover:bg-red-500/10 transition-colors disabled:opacity-50"
                    >
                      <CloseCircle size={14} color="currentColor" variant="Bulk" />
                    </button>
                  </div>
                  {isUploading && uploadProgress.authLetter > 0 && (
                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-[10px]">
                        <span className="text-muted-foreground">Upload Auth Letter</span>
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-primary">{uploadProgress.authLetter}%</span>
                          {uploadSpeed.authLetter && <span className="text-gray-500">• {uploadSpeed.authLetter}</span>}
                        </div>
                      </div>
                      <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
                        <div
                          className="h-full bg-primary transition-all duration-300"
                          style={{ width: `${uploadProgress.authLetter}%` }}
                        />
                      </div>
                    </div>
                  )}
                  {authLetterUrl && (
                    <div className="space-y-1">
                      <div className="flex items-center gap-1.5 text-[10px] text-emerald-500">
                        <TickCircle size={12} color="currentColor" variant="Bulk" />
                        Fichier uploadé avec succès
                      </div>
                      <a
                        href={authLetterUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 p-2 rounded-lg bg-primary/5 border border-primary/20 hover:bg-primary/10 transition-colors group"
                      >
                        <span className="text-primary text-[10px] group-hover:underline break-all flex-1">
                          {authLetterUrl}
                        </span>
                        <span className="text-primary text-xs shrink-0">↗</span>
                      </a>
                    </div>
                  )}
                </div>
              ) : (
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => authLetterInputRef.current?.click()}
                  disabled={isBusy}
                  className={cn(
                    "w-full gap-2 h-12 rounded-lg text-xs border-dashed",
                    "hover:border-primary/40 hover:bg-primary/5 transition-colors"
                  )}
                >
                  <DocumentUpload size={16} color="currentColor" variant="Bulk" className="text-primary" />
                  {t("senderIds.selectFile")}
                </Button>
              )}
            </div>
          </section>

          {/* Info note */}
          <div className="flex items-start gap-2.5 p-3 rounded-xl bg-primary/5 border border-primary/15">
            <InfoCircle size={16} color="currentColor" variant="Bulk" className="text-primary shrink-0 mt-0.5" />
            <p className="text-[11px] text-muted-foreground leading-relaxed">
              {t("senderIds.infoNote")}
            </p>
          </div>

          <Button
            onClick={handleSave}
            disabled={isBusy || !canSubmit}
            className={cn(
              "w-full rounded-lg gap-2 bg-primary text-white font-semibold",
              "shadow-md shadow-primary/25 hover:shadow-lg hover:shadow-primary/30",
              "hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
            )}
          >
            {isBusy ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                {isUploading ? t("senderIds.uploading") : t("senderIds.creating")}
              </>
            ) : (
              <>
                <UserTag size={14} color="currentColor" variant="Bulk" />
                {t("senderIds.createSenderId")}
              </>
            )}
          </Button>
          </TabsContent>

          <TabsContent value="enterprise" className="mt-0">
            <fieldset className="rounded-xl border border-border/10 px-4 pb-4 pt-1 space-y-3">
              <legend className="-ml-1 px-1 flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                <span className="text-primary"><Building size={12} color="currentColor" variant="Bulk" /></span>
                Informations entreprise
              </legend>

              {emptyEnterpriseKeys.length === 0 ? (
                <div className="flex flex-col items-center gap-2 py-6 text-center">
                  <TickCircle size={28} color="currentColor" variant="Bulk" className="text-emerald-500" />
                  <p className="text-sm font-medium text-foreground">Profil complet</p>
                  <p className="text-[11px] text-muted-foreground">Toutes les informations entreprise sont renseignées.</p>
                </div>
              ) : (
                <>
                  <div className="flex items-start gap-2.5 rounded-xl border border-primary/15 bg-primary/5 px-3 py-2.5">
                    <InfoCircle size={14} color="currentColor" variant="Bulk" className="text-primary shrink-0 mt-0.5" />
                    <p className="text-[11px] text-muted-foreground leading-relaxed">
                      Ces informations sont importantes pour l'approbation de votre Sender ID.
                      Veuillez compléter les champs manquants ci-dessous avant de soumettre votre demande.
                    </p>
                  </div>
                  <div className="space-y-3">
                    {emptyEnterpriseKeys.map((key) => (
                      <div key={key} className="space-y-1">
                        <label className="text-[11px] font-medium text-foreground">
                          {ENTERPRISE_FIELD_LABELS[key]}
                          <span className="ml-1 text-muted-foreground font-normal">(optionnel)</span>
                        </label>
                        <Input
                          value={enterpriseFields[key]}
                          onChange={(e) =>
                            setEnterpriseFields((prev) => ({ ...prev, [key]: e.target.value }))
                          }
                          placeholder={ENTERPRISE_FIELD_LABELS[key]}
                          className="h-9 rounded-lg text-sm"
                          disabled={isUpdatingEnterprise}
                        />
                      </div>
                    ))}
                  </div>

                  <Button
                    type="button"
                    size="sm"
                    onClick={handleEnterpriseUpdate}
                    disabled={
                      isUpdatingEnterprise ||
                      emptyEnterpriseKeys.every((k) => !enterpriseFields[k]?.trim())
                    }
                    className="w-full h-9 rounded-lg gap-2 bg-primary/10 text-primary hover:bg-primary/20 border border-primary/20 font-semibold text-xs transition-all duration-200"
                    variant="outline"
                  >
                    {isUpdatingEnterprise ? (
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    ) : (
                      <TickCircle size={13} color="currentColor" variant="Bulk" />
                    )}
                    Mise à jour
                  </Button>
                </>
              )}
            </fieldset>
          </TabsContent>
          </div>
        </Tabs>


        {/* Sticky footer */}
        <div
          className={cn(
            "sticky bottom-0 z-10 flex items-center justify-end gap-2 px-5 py-3.5",
            "border-t border-border/60 bg-background/80 backdrop-blur-md"
          )}
        >
          <Button
            variant="outline"
            onClick={handleCancel}
            disabled={isBusy}
            className="rounded-lg"
          >
            {t("common.cancel")}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
