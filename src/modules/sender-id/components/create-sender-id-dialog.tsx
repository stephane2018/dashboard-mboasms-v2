"use client"

import { useState, useRef, type ReactNode } from "react"
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
} from "iconsax-react"
import { Loader2 } from "lucide-react"
import type { CreateSenderIdInput } from "../types"
import { cn } from "@/lib/utils"

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
  const [documents, setDocuments] = useState<File[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)

  const nameLength = name.length
  const isAlphanumeric = /^[a-zA-Z0-9]*$/.test(name)
  const isNameValid = name.trim().length > 0 && nameLength <= 11 && isAlphanumeric

  const handleSave = async () => {
    await onSave({ name, description, enterpriseId })
    setName("")
    setDescription("")
    setDocuments([])
    onOpenChange(false)
  }

  const handleCancel = () => {
    setName("")
    setDescription("")
    setDocuments([])
    onOpenChange(false)
  }

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || [])
    setDocuments((prev) => [...prev, ...files])
  }

  const removeDocument = (index: number) => {
    setDocuments((prev) => prev.filter((_, i) => i !== index))
  }

  const downloadDocument = (docType: "template1" | "template2") => {
    const urls = {
      template1: "/documents/sender-id-template-1.pdf",
      template2: "/documents/sender-id-template-2.pdf",
    }
    window.open(urls[docType], "_blank")
  }

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

        {/* Scrollable body */}
        <div className="max-h-[60vh] overflow-y-auto px-5 py-5 space-y-5">
          {/* Identité */}
          <section className="space-y-3">
            <SectionLabel icon={<UserTag size={12} color="currentColor" variant="Bulk" />}>
              {t("senderIds.senderIdName")}
            </SectionLabel>

            <div className="space-y-1.5">
              <div className="relative">
                <Input
                  id="sender-name"
                  value={name}
                  onChange={(e) =>
                    setName(e.target.value.replace(/[^a-zA-Z0-9]/g, "").slice(0, 11))
                  }
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
              {name && !isAlphanumeric && (
                <div className="flex items-center gap-1.5 text-[11px] text-red-500">
                  <CloseCircle size={12} color="currentColor" variant="Bulk" />
                  {t("senderIds.alphanumericOnly")}
                </div>
              )}
              {name && isNameValid && (
                <div className="flex items-center gap-1.5 text-[11px] text-emerald-500">
                  <TickCircle size={12} color="currentColor" variant="Bulk" />
                  Disponible
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

            {/* Templates */}
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

            {/* Upload zone */}
            <div className="space-y-2">
              <p className="text-[11px] text-muted-foreground">{t("senderIds.uploadDocuments")}</p>
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept=".pdf,.doc,.docx"
                onChange={handleFileSelect}
                className="hidden"
              />
              <Button
                type="button"
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
                disabled={isLoading}
                className={cn(
                  "w-full gap-2 h-12 rounded-lg text-xs border-dashed",
                  "hover:border-primary/40 hover:bg-primary/5 transition-colors"
                )}
              >
                <DocumentUpload size={16} color="currentColor" variant="Bulk" className="text-primary" />
                {t("senderIds.selectFiles")}
              </Button>

              {documents.length > 0 && (
                <div className="space-y-1.5 pt-1">
                  {documents.map((doc, index) => (
                    <div
                      key={index}
                      className="group flex items-center justify-between gap-2 px-3 py-2 rounded-lg bg-muted/40 border border-border/50 text-[12px]"
                    >
                      <div className="flex items-center gap-2 min-w-0 flex-1">
                        <Document size={14} color="currentColor" variant="Bulk" className="text-primary shrink-0" />
                        <span className="truncate font-medium text-foreground">{doc.name}</span>
                        <span className="text-[10px] text-muted-foreground tabular-nums shrink-0">
                          {(doc.size / 1024).toFixed(0)} Ko
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeDocument(index)}
                        className="rounded-md p-1 text-muted-foreground hover:text-red-500 hover:bg-red-500/10 transition-colors"
                        aria-label="Retirer"
                      >
                        <CloseCircle size={14} color="currentColor" variant="Bulk" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </section>

          {/* Info note */}
          <div className="flex items-start gap-2.5 p-3 rounded-xl bg-primary/5 border border-primary/15">
            <InfoCircle
              size={16}
              color="currentColor"
              variant="Bulk"
              className="text-primary shrink-0 mt-0.5"
            />
            <p className="text-[11px] text-muted-foreground leading-relaxed">
              {t("senderIds.infoNote")}
            </p>
          </div>
        </div>

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
            disabled={isLoading}
            className="rounded-lg"
          >
            {t("common.cancel")}
          </Button>
          <Button
            onClick={handleSave}
            disabled={isLoading || !isNameValid}
            className={cn(
              "rounded-lg gap-2 bg-primary text-white font-semibold",
              "shadow-md shadow-primary/25 hover:shadow-lg hover:shadow-primary/30",
              "hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
            )}
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                {t("senderIds.creating")}
              </>
            ) : (
              <>
                <UserTag size={14} color="currentColor" variant="Bulk" />
                {t("senderIds.createSenderId")}
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
