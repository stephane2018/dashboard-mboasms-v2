"use client"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/shared/ui/dialog"
import { Button } from "@/shared/ui/button"
import { Copy, Check } from "lucide-react"
import type { CreateApiKeyResponse } from "../types"

interface ApiKeyCreatedDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  apiKeyData: CreateApiKeyResponse | null
}

export function ApiKeyCreatedDialog({
  open,
  onOpenChange,
  apiKeyData,
}: ApiKeyCreatedDialogProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    if (!apiKeyData?.apiKey) return
    await navigator.clipboard.writeText(apiKeyData.apiKey)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>API Key créée avec succès</DialogTitle>
          <DialogDescription>
            Copiez votre clé API maintenant. Elle ne sera plus affichée après la fermeture de cette fenêtre.
          </DialogDescription>
        </DialogHeader>

        {apiKeyData && (
          <div className="space-y-4">
            <div className="space-y-2">
              <p className="text-sm font-medium">Nom</p>
              <p className="text-sm text-muted-foreground">{apiKeyData.name}</p>
            </div>

            <div className="space-y-2">
              <p className="text-sm font-medium">Clé API</p>
              <div className="flex items-center gap-2">
                <code className="flex-1 bg-muted px-3 py-2 rounded text-sm font-mono break-all">
                  {apiKeyData.apiKey}
                </code>
                <Button variant="outline" size="icon" onClick={handleCopy}>
                  {copied ? (
                    <Check className="h-4 w-4 text-green-500" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>

            <div className="rounded-md border border-amber-200 bg-amber-50 p-3 dark:border-amber-900 dark:bg-amber-950">
              <p className="text-sm text-amber-800 dark:text-amber-200">
                Conservez cette clé en lieu sûr. Utilisez-la dans le header{" "}
                <code className="font-mono text-xs bg-amber-100 dark:bg-amber-900 px-1 py-0.5 rounded">
                  X-API-Key
                </code>{" "}
                pour authentifier vos appels API sans JWT.
              </p>
            </div>
          </div>
        )}

        <DialogFooter>
          <Button onClick={() => onOpenChange(false)}>
            {copied ? "Fermer" : "J'ai copié ma clé, fermer"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
