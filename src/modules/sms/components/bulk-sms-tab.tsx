"use client"

import { useState, useMemo } from "react"
import { toast } from "sonner"
import { Upload, AlertCircle, CheckCircle2, Info } from "lucide-react"
import { Button } from "@/shared/ui/button"
import { Input } from "@/shared/ui/input"
import { Label } from "@/shared/ui/label"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/shared/ui/alert-dialog"
import { useBulkSmsSend } from "@/core/hooks/useBulkSms"
import { useAuth } from "@/core/hooks/useAuth"
import { useT } from "@/core/hooks"
import Link from "next/link"

interface FileContact {
  phoneNumber: string
  message?: string
  isValid: boolean
}

export function BulkSmsTab() {
  const { t } = useT()
  const { user } = useAuth()
  const [file, setFile] = useState<File | null>(null)
  const [defaultMessage, setDefaultMessage] = useState("")
  const [senderId, setSenderId] = useState("")
  const [contacts, setContacts] = useState<FileContact[]>([])
  const [isConfirming, setIsConfirming] = useState(false)

  const { mutate: sendBulkSms, isPending } = useBulkSmsSend()

  const validContactCount = useMemo(() => {
    return contacts.filter(c => c.isValid).length
  }, [contacts])

  const parseExcelFile = async (file: File) => {
    try {
      const text = await file.text()
      const lines = text.split("\n").filter(line => line.trim())

      const parsed: FileContact[] = lines.map(line => {
        const columns = line.split(/[,;\t]/).map(col => col.trim())
        const phoneNumber = columns[0] || ""
        const message = columns[1] || undefined

        return {
          phoneNumber,
          message,
          isValid: /^(\+|00)?\d{9,15}$/.test(phoneNumber.replace(/\s/g, "")),
        }
      })

      return parsed.filter(c => c.phoneNumber)
    } catch (error) {
      toast.error("Erreur lors de la lecture du fichier")
      return []
    }
  }

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (!selectedFile) return

    const validTypes = [
      "text/csv",
      "application/vnd.ms-excel",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    ]

    if (!validTypes.includes(selectedFile.type) && !selectedFile.name.match(/\.(csv|xlsx|xls)$/)) {
      toast.error("Format de fichier non supporté. Utilisez CSV ou Excel.")
      return
    }

    setFile(selectedFile)
    const parsed = await parseExcelFile(selectedFile)
    setContacts(parsed)
    toast.success(`${parsed.length} contacts détectés`)
  }

  const handleSend = () => {
    if (!file) {
      toast.error("Veuillez sélectionner un fichier")
      return
    }

    if (validContactCount === 0) {
      toast.error("Aucun numéro valide dans le fichier")
      return
    }

    if (!defaultMessage.trim()) {
      toast.error("Veuillez entrer un message par défaut")
      return
    }

    setIsConfirming(true)
  }

  const handleConfirm = () => {
    if (!file) return

    sendBulkSms(
      { file, message: defaultMessage, senderId: senderId || undefined },
      {
        onSuccess: (data) => {
          toast.success(`SMS en masse soumis! Job ID: ${data.jobId}`)
          setFile(null)
          setDefaultMessage("")
          setSenderId("")
          setContacts([])
          setIsConfirming(false)
        },
        onError: (error) => {
          toast.error(error.message || "Erreur lors de l'envoi")
        },
      }
    )
  }

  return (
    <div className="space-y-6 p-4 md:p-6">
      {/* Info Alert */}
      <div className="rounded-lg border border-blue-200 bg-blue-50 p-4 flex gap-3">
        <Info className="h-5 w-5 text-blue-600 shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-medium text-blue-900">
            Envoi en masse pour campagnes 500+ messages
          </p>
          <p className="text-xs text-blue-800 mt-1">
            Chargez un fichier Excel/CSV avec les numéros de téléphone. Le traitement s'effectue en arrière-plan.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Form */}
        <div className="lg:col-span-2 space-y-4">
          {/* File Upload */}
          <div className="space-y-2">
            <Label>Fichier Excel/CSV</Label>
            <div className="relative">
              <input
                type="file"
                accept=".csv,.xlsx,.xls"
                onChange={handleFileChange}
                className="hidden"
                id="file-upload"
              />
              <label
                htmlFor="file-upload"
                className="flex items-center justify-center w-full p-6 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-primary hover:bg-primary/5 transition-colors"
              >
                <div className="flex flex-col items-center">
                  <Upload className="h-6 w-6 text-gray-400 mb-2" />
                  <span className="text-sm font-medium text-gray-600">
                    {file ? file.name : "Cliquez pour sélectionner"}
                  </span>
                  <span className="text-xs text-gray-500 mt-1">
                    Format: CSV, Excel (.xlsx, .xls)
                  </span>
                </div>
              </label>
            </div>
          </div>

          {/* Default Message */}
          <div className="space-y-2">
            <Label htmlFor="default-msg">Message par défaut</Label>
            <textarea
              id="default-msg"
              value={defaultMessage}
              onChange={(e) => setDefaultMessage(e.target.value)}
              placeholder="Message à envoyer aux numéros qui n'ont pas de message personnalisé..."
              className="w-full h-24 p-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
            />
            <p className="text-xs text-gray-500">
              Caractères: {defaultMessage.length}
            </p>
          </div>

          {/* Sender ID */}
          <div className="space-y-2">
            <Label htmlFor="sender-id">Sender ID (optionnel)</Label>
            <Input
              id="sender-id"
              value={senderId}
              onChange={(e) => setSenderId(e.target.value)}
              placeholder="ex: COMPANY"
              className="h-10"
            />
          </div>

          {/* Contacts Preview */}
          {contacts.length > 0 && (
            <div className="space-y-2">
              <Label>Aperçu des contacts</Label>
              <div className="border rounded-lg overflow-hidden max-h-64 overflow-y-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 border-b">
                    <tr>
                      <th className="px-4 py-2 text-left font-medium">Numéro</th>
                      <th className="px-4 py-2 text-left font-medium">Status</th>
                      <th className="px-4 py-2 text-left font-medium">Message</th>
                    </tr>
                  </thead>
                  <tbody>
                    {contacts.slice(0, 10).map((contact, idx) => (
                      <tr key={idx} className="border-b hover:bg-gray-50">
                        <td className="px-4 py-2">{contact.phoneNumber}</td>
                        <td className="px-4 py-2">
                          {contact.isValid ? (
                            <CheckCircle2 className="h-4 w-4 text-green-600" />
                          ) : (
                            <AlertCircle className="h-4 w-4 text-red-600" />
                          )}
                        </td>
                        <td className="px-4 py-2 text-xs truncate">
                          {contact.message || "(message par défaut)"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {contacts.length > 10 && (
                  <div className="px-4 py-2 text-xs text-gray-500 bg-gray-50 border-t">
                    +{contacts.length - 10} autres contacts...
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Summary */}
          {contacts.length > 0 && (
            <div className="rounded-lg border bg-card p-4 space-y-3">
              <h3 className="font-semibold text-sm">Résumé</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Total contacts</span>
                  <span className="font-medium">{contacts.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Valides</span>
                  <span className="font-medium text-green-600">{validContactCount}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Invalides</span>
                  <span className="font-medium text-red-600">
                    {contacts.length - validContactCount}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Jobs Link */}
          <div className="rounded-lg border bg-card p-4">
            <p className="text-xs text-gray-600 mb-3">
              Suivi des envois en masse
            </p>
            <Link href="/dashboard/sms/jobs">
              <Button variant="outline" className="w-full">
                Voir les Jobs SMS
              </Button>
            </Link>
          </div>

          {/* Send Button */}
          <Button
            onClick={handleSend}
            disabled={isPending || validContactCount === 0 || !defaultMessage.trim()}
            className="w-full h-10"
            size="sm"
          >
            {isPending ? "Envoi en cours..." : "Soumettre l'envoi"}
          </Button>
        </div>
      </div>

      {/* Confirmation Dialog */}
      <AlertDialog open={isConfirming} onOpenChange={setIsConfirming}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmer l'envoi en masse</AlertDialogTitle>
            <AlertDialogDescription>
              {validContactCount} SMS seront envoyés. Ce traitement s'effectuera en arrière-plan.
              Vous pourrez suivre la progression dans la page Jobs SMS.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="space-y-2 py-4 text-sm">
            <div className="flex justify-between">
              <span>Numéros valides:</span>
              <span className="font-medium">{validContactCount}</span>
            </div>
            <div className="flex justify-between">
              <span>Message:</span>
              <span className="font-medium truncate ml-2">
                {defaultMessage.substring(0, 30)}...
              </span>
            </div>
          </div>
          <div className="flex gap-3">
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirm} disabled={isPending}>
              {isPending ? "En cours..." : "Confirmer"}
            </AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
