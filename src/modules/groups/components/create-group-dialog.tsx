"use client"

import { useState } from "react"
import { Button } from "@/shared/ui/button"
import {
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription, 
  DialogFooter
} from "@/shared/ui/dialog"
import { Input } from "@/shared/ui/input"
import { useT } from "@/core/hooks"
import { toast } from "sonner"
import { groupsService } from "@/core/services/groups.service"
import { useGroups } from "@/core/hooks"
import { Users } from 'lucide-react';

interface CreateGroupDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onGroupCreated: () => void;
}

export function CreateGroupDialog({ open, onOpenChange, onGroupCreated }: CreateGroupDialogProps) {
  const { t } = useT()
  const { enterpriseId } = useGroups()
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [isCreating, setIsCreating] = useState(false)

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
      await groupsService.createGroup({
        name: name.trim(),
        code: description.trim(),
        enterpriseId,
      })
      toast.success(t("groups.created"))
      onGroupCreated()
      onOpenChange(false)
      setName("")
      setDescription("")
    } catch {
      toast.error(t("groups.createError"))
    } finally {
      setIsCreating(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Users className="w-5 h-5 text-primary" />
            </div>
            <div>
                <DialogTitle>{t("groups.newGroup")}</DialogTitle>
                <DialogDescription>{t("groups.newGroupDesc")}</DialogDescription>
            </div>
          </div>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <label htmlFor="name" className="text-right text-sm font-medium">
              {t("groups.nameLabel")}
            </label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={t("groups.namePlaceholder")}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <label htmlFor="description" className="text-right text-sm font-medium">
              {t("groups.codeLabel")}
            </label>
            <Input
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder={t("groups.codePlaceholder")}
              className="col-span-3"
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isCreating}>{t("common.cancel")}</Button>
          <Button onClick={handleCreate} disabled={isCreating}>
            {isCreating ? t("common.saving") : t("groups.create")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
