"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { toast } from "sonner"
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card"
import { Button } from "@/shared/ui/button"
import { Input } from "@/shared/ui/input"
import { Badge } from "@/shared/ui/badge"
import { DataTable } from "@/shared/common/data-table/table"
import { ArrowLeft, SearchNormal1, Profile2User, Sms } from "iconsax-react"
import { contactService } from "@/modules/contacts/services/contact.service"
import { useSendToGroup } from "@/modules/sms/hooks/useContactMessage"
import { useAuthContext } from "@/core/providers"
import { Skeleton } from "@/shared/ui/skeleton"
import type { EnterpriseContactResponseType } from "@/core/models/contact-new"

export default function GroupContactsViewPage() {
  const router = useRouter()
  const params = useParams()
  const groupId = params.groupId as string

  const [searchTerm, setSearchTerm] = useState("")
  const [isMessageModalOpen, setIsMessageModalOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const { sendToGroup, isLoading: isSending } = useSendToGroup()
  const { user } = useAuthContext()

  const [contacts, setContacts] = useState<EnterpriseContactResponseType[]>([])
  const [groupInfo, setGroupInfo] = useState<any>(null)

  // Load group contacts
  useEffect(() => {
    const loadContacts = async () => {
      if (!user?.companyId || !groupId) return

      setIsLoading(true)
      setError(null)

      try {
        const result = await contactService.getContactsByGroup(groupId, user.companyId) as any
        console.log(result);
        setContacts(result.contacts || [])
        setGroupInfo(result.groupInfo || { name: `Groupe ${groupId}` })
      } catch (err) {
        console.error("Error loading group contacts:", err)
        setError("Erreur lors du chargement des contacts")
        toast.error("Erreur lors du chargement des contacts")
      } finally {
        setIsLoading(false)
      }
    }

    loadContacts()
  }, [groupId, user?.companyId])

  // Filter contacts based on search term
  const filteredContacts = contacts.filter(contact => {
    if (!contact) return false
    const fullName = `${contact.firstname || ''} ${contact.lastname || ''}`.toLowerCase()
    const phone = contact.phoneNumber || ''
    const email = (contact.email || '').toLowerCase()
    const searchLower = searchTerm.toLowerCase()

    return fullName.includes(searchLower) || phone.includes(searchTerm) || email.includes(searchLower)
  })

  // Handle sending message to group
  const handleSendMessageToGroup = async (message: string) => {
    try {
      await sendToGroup({
        groupId,
        message,
        enterpriseId: user?.companyId || "",
        contacts: contacts.map(c => c.id).join(","),
        senderId: "default",
      })
      
      toast.success(`Message envoyé au groupe "${groupInfo?.name}"`)
      setIsMessageModalOpen(false)
    } catch (error) {
      // Error is already handled by the hook
    }
  }

  // Table columns
  const columns = [
    {
      header: "Nom",
      accessorKey: "firstname",
      cell: (row: any) => {
        const contact = row?.original as EnterpriseContactResponseType | undefined
        if (!contact) return <div className="font-medium">-</div>
        return (
          <div>
            <div className="font-medium">
              {contact.firstname || ''} {contact.lastname || ''}
            </div>
            <div className="text-xs text-muted-foreground mt-1">
              {contact.email || '-'}
            </div>
          </div>
        )
      },
    },
    {
      header: "Téléphone",
      accessorKey: "phoneNumber",
      cell: (row: any) => {
        const contact = row?.original as EnterpriseContactResponseType | undefined
        return (
          <div className="font-medium">
            {contact?.phoneNumber || "-"}
          </div>
        )
      },
    },
    {
      header: "Pays/Ville",
      accessorKey: "country",
      cell: (row: any) => {
        const contact = row?.original as EnterpriseContactResponseType | undefined
        return (
          <div className="text-sm text-muted-foreground">
            {contact?.country ? `${contact.country.toUpperCase()}${contact?.city ? ` / ${contact.city}` : ''}` : "-"}
          </div>
        )
      },
    },
    {
      header: "Archivé",
      accessorKey: "archived",
      cell: (row: any) => {
        const contact = row?.original as EnterpriseContactResponseType | undefined
        const isArchived = contact?.archived ?? false
        return (
          <Badge variant={isArchived ? "destructive" : "outline"}>
            {isArchived ? "Oui" : "Non"}
          </Badge>
        )
      },
    },
    {
      header: "Statut",
      accessorKey: "enabled",
      cell: (row: any) => {
        const contact = row?.original as EnterpriseContactResponseType | undefined
        const isEnabled = (contact as any)?.enabled ?? false
        return (
          <Badge variant={isEnabled ? "default" : "secondary"}>
            {isEnabled ? "Actif" : "Inactif"}
          </Badge>
        )
      },
    },
  ]

  if (isLoading) {
    return (
      <div className="space-y-6 p-6">
        <div className="flex items-center gap-4">
          <Skeleton className="h-10 w-10" />
          <Skeleton className="h-8 w-64" />
        </div>
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-48" />
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex items-center space-x-4">
                  <Skeleton className="h-10 w-10 rounded-full" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-4 w-24" />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (error) {
    return (
      <div className="space-y-6 p-6">
        <div className="flex items-center gap-4">
          <Button variant="outline" onClick={() => router.back()}>
            <ArrowLeft size={20} />
          </Button>
          <h1 className="text-2xl font-bold">Contacts du groupe</h1>
        </div>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center text-red-600">
              Une erreur est survenue lors du chargement des contacts
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={() => router.back()}>
            <ArrowLeft size={20} variant="Bulk" color="currentColor" className="text-primary" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <Profile2User size={24}  variant="Bulk" color="currentColor" className="text-primary"  />
              {groupInfo?.name || `Groupe ${groupId}`}
            </h1>
            <p className="text-muted-foreground">
              {filteredContacts.length} contact{filteredContacts.length > 1 ? "s" : ""}
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            onClick={() => setIsMessageModalOpen(true)}
            disabled={filteredContacts.length === 0}
            className="bg-pink-600 hover:bg-pink-700"
          >
            <Sms size={16} className="mr-2" variant="Bulk" color="currentColor" />
            Envoyer un message
          </Button>
        </div>
      </div>

      {/* Search */}
      <div className="flex items-center gap-2 max-w-md">
        <div className="relative flex-1">
          <SearchNormal1  variant="Bulk" color="currentColor" className="text-primary absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4" />
          <Input
            placeholder="Rechercher un contact..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Contacts Table */}
      <Card>
        <CardHeader>
          <CardTitle>Liste des contacts</CardTitle>
        </CardHeader>
        <CardContent>
          {filteredContacts.length > 0 ? (
            <DataTable
              columns={columns}
              data={filteredContacts}
            />
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              {searchTerm
                ? "Aucun contact trouvé pour cette recherche"
                : "Aucun contact dans ce groupe"}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Message Modal */}
      {isMessageModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="w-full max-w-md mx-4">
            <CardHeader>
              <CardTitle>Envoyer un message au groupe</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <textarea
                placeholder="Tapez votre message ici..."
                className="w-full min-h-[100px] p-3 border rounded-md resize-none"
                id="group-message"
              />
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => setIsMessageModalOpen(false)}
                  className="flex-1"
                >
                  Annuler
                </Button>
                <Button
                  onClick={() => {
                    const message = (document.getElementById("group-message") as HTMLTextAreaElement)?.value
                    if (message?.trim()) {
                      handleSendMessageToGroup(message.trim())
                    }
                  }}
                  disabled={isSending}
                  className="flex-1 bg-pink-600 hover:bg-pink-700"
                >
                  {isSending ? "Envoi en cours..." : "Envoyer"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
