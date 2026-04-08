"use client"

import { useMemo, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/shared/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/shared/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/shared/ui/table"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/shared/ui/alert-dialog"
import { ContactSelectionModal } from "@/shared/common/contact-selection-modal"
import { toast } from "sonner"
import type { EnterpriseContactResponseType } from "@/core/models/contact-new"
import { useGroups } from "@/core/hooks"
import { useT } from "@/core/hooks"
import { groupsService } from "@/core/services/groups.service"
import { ContactEditPopover } from "@/shared/common/contact-edit-popover"
import { AddCircle } from "iconsax-react"

export default function GroupeDetailsPage() {
  const params = useParams<{ groupId: string }>()
  const router = useRouter()
  const { t } = useT()

  const { groups, isLoading, loadGroups } = useGroups()

  const groupId = params?.groupId || ""
  const group = useMemo(() => groups.find((g) => g.id === groupId), [groups, groupId])

  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [isRemoveDialogOpen, setIsRemoveDialogOpen] = useState(false)
  const [contactToRemove, setContactToRemove] = useState<EnterpriseContactResponseType | null>(null)
  const [isContactModalOpen, setIsContactModalOpen] = useState(false)
  const [selectedContactIds, setSelectedContactIds] = useState<string[]>([])
  const [isMutating, setIsMutating] = useState(false)

  const contacts = group?.enterpriseContacts || []

  const selectedContacts = useMemo(() => {
    const selected = new Set(selectedContactIds)
    return contacts.filter((c) => selected.has(c.id))
  }, [contacts, selectedContactIds])

  const toggleSelect = (contactId: string) => {
    setSelectedContactIds((prev) => {
      const set = new Set(prev)
      if (set.has(contactId)) set.delete(contactId)
      else set.add(contactId)
      return Array.from(set)
    })
  }

  const handleSendSms = (contactsToSend: EnterpriseContactResponseType[]) => {
    const phones = contactsToSend.map((c) => c.phoneNumber).filter(Boolean)
    if (phones.length === 0) {
      toast.error(t("groups.noValidPhone"))
      return
    }

    const query = new URLSearchParams()
    query.set("phones", phones.join(","))
    router.push(`/sms-client?${query.toString()}`)
  }

  const handleDeleteGroup = async () => {
    if (!groupId) return
    setIsMutating(true)
    try {
      await groupsService.deleteGroup(groupId)
      toast.success(t("groups.deleted"))
      router.push("/groupes")
    } catch {
      toast.error(t("groups.deleteGroupError"))
    } finally {
      setIsMutating(false)
      setIsDeleteDialogOpen(false)
    }
  }

  const handleContactUpdated = async () => {
    try {
      await loadGroups()
      toast.success(t("groups.contactUpdated"))
    } catch {
      // silently ignore
    }
  }

  const handleRemoveContact = async () => {
    if (!groupId || !contactToRemove?.id) return
    setIsMutating(true)
    try {
      await groupsService.removeContactFromGroup(groupId, contactToRemove.id)
      toast.success(t("groups.deleteContactError"))
      await loadGroups()
    } catch {
      toast.error(t("groups.deleteContactError"))
    } finally {
      setIsMutating(false)
      setIsRemoveDialogOpen(false)
      setContactToRemove(null)
    }
  }

  const handleAddContacts = async (selected: EnterpriseContactResponseType[]) => {
    if (!groupId) return
    const ids = selected.map((c) => c.id)

    setIsMutating(true)
    try {
      await groupsService.addContactsToGroup(groupId, ids)
      toast.success(t("groups.contactsAdded", { count: ids.length }))
      await loadGroups()
    } catch {
      toast.error(t("groups.addContactsError"))
    } finally {
      setIsMutating(false)
    }
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{group?.name || t("groups.title")}</h1>
          <p className="text-muted-foreground mt-1">{group?.code || ""}</p>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={() => router.push("/groupes")}>
            {t("groups.back")}
          </Button>
          <Button
            variant="destructive"
            onClick={() => setIsDeleteDialogOpen(true)}
            disabled={!groupId || isMutating}
          >
            {t("common.delete")}
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between gap-4">
            <div>
              <CardTitle className="text-lg">
                {t("groups.addContactsBtn")} ({contacts.length})
              </CardTitle>
              <CardDescription>{t("groups.selectContacts")}</CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                onClick={() => setIsContactModalOpen(true)}
                disabled={isLoading || isMutating}
              >
                <AddCircle variant="Bulk" color="currentColor" className="mr-2 h-4 w-4" />
                {t("groups.addContactsBtn")}
              </Button>
              <Button
                onClick={() => handleSendSms(selectedContacts)}
                disabled={selectedContacts.length === 0}
              >
                {t("groups.addContactsBtn")} SMS ({selectedContacts.length})
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-sm text-muted-foreground">{t("groups.loading")}</div>
          ) : contacts.length === 0 ? (
            <div className="text-sm text-muted-foreground">{t("groups.noContactInGroup")}</div>
          ) : (
            <div className="border rounded-lg overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-10"></TableHead>
                    <TableHead>{t("contactColumns.name")}</TableHead>
                    <TableHead>{t("contactColumns.phone")}</TableHead>
                    <TableHead className="w-40">{t("contactColumns.actions")}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {contacts.map((c) => {
                    const isSelected = selectedContactIds.includes(c.id)
                    return (
                      <TableRow key={c.id}>
                        <TableCell>
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => toggleSelect(c.id)}
                          />
                        </TableCell>
                        <TableCell>{`${c.firstname || ""} ${c.lastname || ""}`.trim()}</TableCell>
                        <TableCell>{c.phoneNumber || ""}</TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <ContactEditPopover
                              contact={c}
                              enterpriseId={group?.enterprise || ""}
                              onUpdate={handleContactUpdated as any}
                            >
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={(e) => e.stopPropagation()}
                              >
                                {t("groups.editBtn")}
                              </Button>
                            </ContactEditPopover>
                            <Button variant="outline" size="sm" onClick={() => handleSendSms([c])}>
                              SMS
                            </Button>
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => {
                                setContactToRemove(c)
                                setIsRemoveDialogOpen(true)
                              }}
                              disabled={isMutating}
                            >
                              {t("groups.remove")}
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      <ContactSelectionModal
        isOpen={isContactModalOpen}
        onClose={() => setIsContactModalOpen(false)}
        onSelectContacts={handleAddContacts}
      />

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t("groups.deleteGroupConfirmTitle")}</AlertDialogTitle>
            <AlertDialogDescription>{t("groups.deleteGroupConfirmDesc")}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isMutating}>{t("common.cancel")}</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteGroup} disabled={isMutating}>
              {t("common.delete")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={isRemoveDialogOpen} onOpenChange={setIsRemoveDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t("groups.removeContactTitle")}</AlertDialogTitle>
            <AlertDialogDescription>{t("groups.removeContactDesc")}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isMutating}>{t("common.cancel")}</AlertDialogCancel>
            <AlertDialogAction onClick={handleRemoveContact} disabled={isMutating}>
              {t("groups.remove")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
