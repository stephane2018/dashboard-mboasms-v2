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
import { useGroups } from "@/core/hooks"
import { useT } from "@/core/hooks"
import { groupsService } from "@/core/services/groups.service"

export default function GroupesPage() {
  const { groups, isLoading, enterpriseId, loadGroups, setGroups } = useGroups()
  const { t } = useT()

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
      toast.error(t("groups.enterpriseNotFound"))
      return
    }
    if (!name.trim()) {
      toast.error(t("groups.nameRequired"))
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
      toast.success(t("groups.created"))
      setIsCreateOpen(false)
      setName("")
      setCode("")
    } catch {
      toast.error(t("groups.createError"))
    } finally {
      setIsCreating(false)
    }
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{t("groups.title")}</h1>
          <p className="text-muted-foreground mt-1">{t("groups.groupListDesc")}</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={loadGroups} disabled={isLoading}>
            {t("groups.refreshBtn")}
          </Button>
          <Button onClick={() => setIsCreateOpen(true)}>{t("groups.newGroupBtn")}</Button>
        </div>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">{t("groups.groupsListTitle")}</CardTitle>
          <CardDescription>{t("groups.groupListDesc")}</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-sm text-muted-foreground">{t("groups.loading")}</div>
          ) : sortedGroups.length === 0 ? (
            <div className="text-sm text-muted-foreground">{t("groups.noContact")}</div>
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
                    {t("groups.contactsCount", { count: g.enterpriseContacts?.length || 0 })}
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
            <AlertDialogTitle>{t("groups.newGroup")}</AlertDialogTitle>
            <AlertDialogDescription>{t("groups.newGroupDesc")}</AlertDialogDescription>
          </AlertDialogHeader>

          <div className="space-y-3">
            <div className="space-y-2">
              <div className="text-sm font-medium">{t("groups.nameLabel")}</div>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={t("groups.namePlaceholder")}
              />
            </div>
            <div className="space-y-2">
              <div className="text-sm font-medium">{t("groups.codeLabel")}</div>
              <Input
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder={t("groups.codePlaceholder")}
              />
            </div>
          </div>

          <AlertDialogFooter>
            <AlertDialogCancel disabled={isCreating}>{t("common.cancel")}</AlertDialogCancel>
            <AlertDialogAction onClick={handleCreate} disabled={isCreating}>
              {t("groups.create")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
