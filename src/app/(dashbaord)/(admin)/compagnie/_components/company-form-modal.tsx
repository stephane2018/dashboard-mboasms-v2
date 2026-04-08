"use client"

import { useState } from "react"
import { Button } from "@/shared/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/shared/ui/dialog"
import { Input } from "@/shared/ui/input"
import { Label } from "@/shared/ui/label"
import { Textarea } from "@/shared/ui/textarea"
import { toast } from "sonner"
import { useCreateCompany } from "@/core/hooks/useCompany"
import type { EnterpriseType, CreateCompanyRequestType } from "@/core/models/company"
import { useT } from "@/core/hooks"

interface CompanyFormModalProps {
  isOpen: boolean
  onClose: () => void
  company?: EnterpriseType | null
  onSuccess: () => void
}

export function CompanyFormModal({ isOpen, onClose, company, onSuccess }: CompanyFormModalProps) {
  const [formData, setFormData] = useState<CreateCompanyRequestType>({
    socialRaison: company?.socialRaison || "",
    numeroCommerce: company?.numeroCommerce || "",
    urlImage: company?.urlImage || "",
    urlSiteweb: company?.urlSiteweb || "",
    telephoneEnterprise: company?.telephoneEnterprise || "",
    emailEnterprise: company?.emailEnterprise || "",
    villeEnterprise: company?.villeEnterprise || "",
    adresseEnterprise: company?.adresseEnterprise || "",
    smsESenderId: company?.smsESenderId || "",
    smsCredit: company?.smsCredit || 0,
    activityDomain: company?.activityDomain || "",
    contribuableNumber: company?.contribuableNumber || "",
    pays: company?.pays ? String(company.pays) : "",
  })

  const { t } = useT()
  const { mutate: createCompany, isPending } = useCreateCompany()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.socialRaison || !formData.emailEnterprise || !formData.telephoneEnterprise) {
      toast.error(t("companies.fillRequired"))
      return
    }

    createCompany(formData, {
      onSuccess: () => {
        onSuccess()
        setFormData({
          socialRaison: "",
          numeroCommerce: "",
          urlImage: "",
          urlSiteweb: "",
          telephoneEnterprise: "",
          emailEnterprise: "",
          villeEnterprise: "",
          adresseEnterprise: "",
          smsESenderId: "",
          smsCredit: 0,
          activityDomain: "",
          contribuableNumber: "",
          pays: "",
        })
      },
    })
  }

  const handleChange = (field: keyof CreateCompanyRequestType) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [field]: field === "smsCredit" ? Number(e.target.value) : e.target.value
    }))
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {company ? t("companies.editCompanyTitle") : t("companies.createCompanyTitle")}
          </DialogTitle>
          <DialogDescription>
            {company ? t("companies.editCompanyDesc") : t("companies.createCompanyDesc")}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="socialRaison" className="text-right">
                {t("companies.socialRaisonLabel")}
              </Label>
              <Input
                id="socialRaison"
                value={formData.socialRaison}
                onChange={handleChange("socialRaison")}
                className="col-span-3"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="emailEnterprise" className="text-right">
                {t("companies.emailLabel")}
              </Label>
              <Input
                id="emailEnterprise"
                type="email"
                value={formData.emailEnterprise}
                onChange={handleChange("emailEnterprise")}
                className="col-span-3"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="telephoneEnterprise" className="text-right">
                {t("companies.phoneRequired")}
              </Label>
              <Input
                id="telephoneEnterprise"
                value={formData.telephoneEnterprise}
                onChange={handleChange("telephoneEnterprise")}
                className="col-span-3"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="villeEnterprise" className="text-right">
                {t("companies.cityLabel")}
              </Label>
              <Input
                id="villeEnterprise"
                value={formData.villeEnterprise}
                onChange={handleChange("villeEnterprise")}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="adresseEnterprise" className="text-right">
                {t("companies.adresseLabel")}
              </Label>
              <Textarea
                id="adresseEnterprise"
                value={formData.adresseEnterprise}
                onChange={handleChange("adresseEnterprise")}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="smsCredit" className="text-right">
                {t("companies.smsCreditLabel")}
              </Label>
              <Input
                id="smsCredit"
                type="number"
                min="0"
                value={formData.smsCredit}
                onChange={handleChange("smsCredit")}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="activityDomain" className="text-right">
                {t("companies.activityDomain")}
              </Label>
              <Input
                id="activityDomain"
                value={formData.activityDomain}
                onChange={handleChange("activityDomain")}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="pays" className="text-right">
                {t("companies.paysLabel")}
              </Label>
              <Input
                id="pays"
                value={formData.pays}
                onChange={handleChange("pays")}
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              {t("common.cancel")}
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? t("companies.creating") : company ? t("common.edit") : t("companies.create")}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
