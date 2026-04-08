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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/ui/select"
import { toast } from "sonner"
import type { AddUserToEnterpriseRequestType } from "@/core/models/company"
import { Role } from "@/core/config/enum"
import { useT } from "@/core/hooks"

interface AddUserModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (userData: AddUserToEnterpriseRequestType) => void
  isSubmitting: boolean
}

export function AddUserModal({ isOpen, onClose, onSubmit, isSubmitting }: AddUserModalProps) {
  const { t } = useT()
  const [formData, setFormData] = useState<AddUserToEnterpriseRequestType>({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    phoneNumber: "",
    country: "",
    city: "",
    address: "",
    role: Role.USER,
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.password || !formData.phoneNumber) {
      toast.error(t("companies.fillRequiredFields"))
      return
    }

    if (!formData.email.includes("@")) {
      toast.error(t("companies.invalidEmail"))
      return
    }

    onSubmit(formData)
  }

  const handleChange = (field: keyof AddUserToEnterpriseRequestType) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [field]: e.target.value
    }))
  }

  const handleRoleChange = (value: Role) => {
    setFormData(prev => ({
      ...prev,
      role: value
    }))
  }

  const resetForm = () => {
    setFormData({
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      phoneNumber: "",
      country: "",
      city: "",
      address: "",
      role: Role.USER,
    })
  }

  const handleClose = () => {
    resetForm()
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{t("companies.addUserTitle")}</DialogTitle>
          <DialogDescription>
            {t("companies.addUserDesc")}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="firstName" className="text-right">
                {t("companies.firstName")}
              </Label>
              <Input
                id="firstName"
                value={formData.firstName}
                onChange={handleChange("firstName")}
                className="col-span-3"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="lastName" className="text-right">
                {t("companies.lastName")}
              </Label>
              <Input
                id="lastName"
                value={formData.lastName}
                onChange={handleChange("lastName")}
                className="col-span-3"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="email" className="text-right">
                {t("companies.emailLabel")}
              </Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={handleChange("email")}
                className="col-span-3"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="password" className="text-right">
                {t("companies.passwordLabel")}
              </Label>
              <Input
                id="password"
                type="password"
                value={formData.password}
                onChange={handleChange("password")}
                className="col-span-3"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="phoneNumber" className="text-right">
                {t("companies.phoneLabel")}
              </Label>
              <Input
                id="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange("phoneNumber")}
                className="col-span-3"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="country" className="text-right">
                {t("companies.countryLabel")}
              </Label>
              <Input
                id="country"
                value={formData.country}
                onChange={handleChange("country")}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="city" className="text-right">
                {t("companies.cityLabel")}
              </Label>
              <Input
                id="city"
                value={formData.city}
                onChange={handleChange("city")}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="address" className="text-right">
                {t("companies.addressLabel")}
              </Label>
              <Input
                id="address"
                value={formData.address}
                onChange={handleChange("address")}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="role" className="text-right">
                {t("companies.roleLabel")}
              </Label>
              <Select value={formData.role} onValueChange={handleRoleChange}>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder={t("companies.selectRole")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={Role.USER}>{t("companies.roleUser")}</SelectItem>
                  <SelectItem value={Role.ADMIN}>{t("companies.roleAdmin")}</SelectItem>
                  <SelectItem value={Role.SUPER_ADMIN}>{t("companies.roleSuperAdmin")}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleClose}>
              {t("common.cancel")}
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? t("companies.adding") : t("companies.addUser")}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
