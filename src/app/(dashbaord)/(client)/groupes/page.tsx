"use client"

import Link from "next/link"
import { useMemo, useState } from "react"
import { Button } from "@/shared/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/ui/card"
import { Input } from "@/shared/ui/input"
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
import { toast } from "sonner"
import { useGroups } from "@/modules/groups/hooks"
import { groupsService } from "@/modules/groups/services"

export default function GroupesPage() {
  const { groups, isLoading, enterpriseId, loadGroups, setGroups } = useGroups()

  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [name, setName] = useState("")
  const [code, setCode] = useState("")
  const [isCreating, setIsCreating] = useState(false)

  const sortedGroups = useMemo(() => {
    return [...groups].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )
  }, [groups])

  const handleCreate = async () => {
    if (!enterpriseId) {
      toast.error("Entreprise introuvable")
      return
    }
    if (!name.trim()) {
      toast.error("Le nom est requis")
      return
    }

    setIsCreating(true)
    try {
      const created = await groupsService.createGroup({
        name: name.trim(),
        code: (code || name).toLowerCase().replace(/\s+/g, "_"),
        enterpriseId,
      })
      setGroups((prev) => [...prev, created])
      toast.success("Groupe créé")
      setIsCreateOpen(false)
      setName("")
      setCode("")
    } catch (e) {
      toast.error("Erreur lors de la création")
      console.error(e)
    } finally {
      setIsCreating(false)
    }
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Groupes</h1>
          <p className="text-muted-foreground mt-1">
            Créez des groupes et gérez les contacts associés
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={loadGroups} disabled={isLoading}>
            Actualiser
          </Button>
          <Button onClick={() => setIsCreateOpen(true)}>Nouveau groupe</Button>
        </div>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Liste des groupes</CardTitle>
          <CardDescription>
            Cliquez sur un groupe pour voir les détails et envoyer des SMS
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-sm text-muted-foreground">Chargement...</div>
          ) : sortedGroups.length === 0 ? (
            <div className="text-sm text-muted-foreground">Aucun groupe</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {sortedGroups.map((g) => (
                <Link
                  key={g.id}
                  href={`/groupes/${g.id}`}
                  className="border rounded-lg p-4 hover:bg-muted/40 transition-colors"
                >
                  <div className="font-semibold truncate">{g.name}</div>
                  <div className="text-xs text-muted-foreground truncate">{g.code}</div>
                  <div className="text-sm mt-2">
                    {g.enterpriseContacts?.length || 0} contact(s)
                  </div>
                </Link>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <AlertDialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Nouveau groupe</AlertDialogTitle>
            <AlertDialogDescription>
              Créez un groupe pour organiser vos contacts.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <div className="space-y-3">
            <div className="space-y-2">
              <div className="text-sm font-medium">Nom *</div>
              <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Ex: Clients VIP" />
            </div>
            <div className="space-y-2">
              <div className="text-sm font-medium">Code (optionnel)</div>
              <Input
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="Ex: clients_vip"
              />
            </div>
          </div>

          <AlertDialogFooter>
            <AlertDialogCancel disabled={isCreating}>Annuler</AlertDialogCancel>
            <AlertDialogAction onClick={handleCreate} disabled={isCreating}>
              Créer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
