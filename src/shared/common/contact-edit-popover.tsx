"use client"

import { useState, useEffect } from "react"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/shared/ui/popover"
import { Button } from "@/shared/ui/button"
import { Input } from "@/shared/ui/input"
import { Label } from "@/shared/ui/label"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/shared/ui/select"
import { ScrollArea } from "@/shared/ui/scroll-area"
import { Edit2, TickCircle, CloseCircle, Warning2 } from "iconsax-react"
import { Loader2 } from "lucide-react"
import type { EnterpriseContactResponseType } from "@/core/models/contact-new"
import { updateContact } from "@/core/services/contact.service"
import { getPhoneValidationStatus, checkPhoneValidation } from "@/core/utils/phone-validation"
import { GroupSelectWithCreate } from "@/shared/common/group-select-with-create"
import { toast } from "sonner"
import { cn } from "@/lib/utils"

interface ContactEditPopoverProps {
    contact: EnterpriseContactResponseType
    enterpriseId: string
    onUpdate: (updatedContact: EnterpriseContactResponseType) => void
    children: React.ReactNode
}

type Gender = "MALE" | "FEMALE"

interface FormData {
    firstName: string
    lastName: string
    email: string
    phoneNumber: string
    country: string
    city: string
    gender: Gender
    groupId: string
}

export function ContactEditPopover({
    contact,
    enterpriseId,
    onUpdate,
    children,
}: ContactEditPopoverProps) {
    const [isOpen, setIsOpen] = useState(false)
    const [isUpdating, setIsUpdating] = useState(false)

    const [formData, setFormData] = useState<FormData>({
        firstName: contact.firstname || "",
        lastName: contact.lastname || "",
        email: contact.email || "",
        phoneNumber: contact.phoneNumber || "",
        country: contact.country || "",
        city: contact.city || "",
        gender: (contact.gender as Gender) || "MALE",
        groupId: typeof contact.group === 'object' ? contact.group?.id || "" : contact.group || "",
    })

    // Phone validation
    const phoneStatus = getPhoneValidationStatus(formData.phoneNumber)
    const isPhoneValid = phoneStatus === "CORRECT"
    const phoneOperator = checkPhoneValidation(formData.phoneNumber)

    // Reset form when contact changes
    useEffect(() => {
        setFormData({
            firstName: contact.firstname || "",
            lastName: contact.lastname || "",
            email: contact.email || "",
            phoneNumber: contact.phoneNumber || "",
            country: contact.country || "",
            city: contact.city || "",
            gender: (contact.gender as Gender) || "MALE",
            groupId: typeof contact.group === 'object' ? contact.group?.id || "" : contact.group || "",
        })
    }, [contact])

    const handleInputChange = (field: keyof FormData, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }))
    }

    const handleSave = async () => {
        if (!isPhoneValid) {
            toast.error("Veuillez entrer un numéro de téléphone valide")
            return
        }

        setIsUpdating(true)
        try {
            const updatedData = {
                firstName: formData.firstName,
                lastName: formData.lastName,
                email: formData.email,
                phoneNumber: formData.phoneNumber,
                country: formData.country,
                city: formData.city,
                gender: formData.gender,
                enterpriseId,
                groupId: formData.groupId || undefined,
            }

            await updateContact(contact.id, updatedData)

            // Update local contact
            const updatedContact: EnterpriseContactResponseType = {
                ...contact,
                firstname: formData.firstName,
                lastname: formData.lastName,
                email: formData.email,
                phoneNumber: formData.phoneNumber,
                country: formData.country,
                city: formData.city,
                gender: formData.gender as any,
            }

            onUpdate(updatedContact)
            toast.success("Contact mis à jour avec succès")
            setIsOpen(false)
        } catch (error) {
            console.error("Error updating contact:", error)
            toast.error("Erreur lors de la mise à jour du contact")
        } finally {
            setIsUpdating(false)
        }
    }

    return (
        <Popover open={isOpen} onOpenChange={setIsOpen}>
            <PopoverTrigger asChild>
                {children}
            </PopoverTrigger>
            <PopoverContent
                className="w-80 p-4"
                align="end"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <h4 className="font-medium text-sm">Modifier le contact</h4>
                        <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 w-6 p-0"
                            onClick={() => setIsOpen(false)}
                        >
                            <CloseCircle size={16} variant="Bulk" color="currentColor" />
                        </Button>
                    </div>

                    {/* Phone validation alert */}
                    {!isPhoneValid && formData.phoneNumber && (
                        <div className="flex items-center gap-2 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 text-xs p-2 rounded">
                            <Warning2 size={14} color="currentColor" variant="Bulk" />
                            Numéro invalide
                        </div>
                    )}

                    {isPhoneValid && phoneOperator && (
                        <div className="flex items-center gap-2 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 text-xs p-2 rounded">
                            <TickCircle size={14} color="currentColor" variant="Bulk" />
                            {phoneOperator}
                        </div>
                    )}

                    {/* Form fields */}
                    <div className="grid grid-cols-2 gap-2">
                        <div className="space-y-1">
                            <Label className="text-xs">Prénom</Label>
                            <Input
                                value={formData.firstName}
                                onChange={(e) => handleInputChange("firstName", e.target.value)}
                                className="h-8 text-sm"
                            />
                        </div>
                        <div className="space-y-1">
                            <Label className="text-xs">Nom</Label>
                            <Input
                                value={formData.lastName}
                                onChange={(e) => handleInputChange("lastName", e.target.value)}
                                className="h-8 text-sm"
                            />
                        </div>
                    </div>

                    <div className="space-y-1">
                        <Label className="text-xs">Téléphone *</Label>
                        <Input
                            type="tel"
                            value={formData.phoneNumber}
                            onChange={(e) => handleInputChange("phoneNumber", e.target.value)}
                            className={cn(
                                "h-8 text-sm",
                                !isPhoneValid && formData.phoneNumber && "border-red-500 focus-visible:ring-red-500"
                            )}
                        />
                    </div>

                    <div className="space-y-1">
                        <Label className="text-xs">Email</Label>
                        <Input
                            type="email"
                            value={formData.email}
                            onChange={(e) => handleInputChange("email", e.target.value)}
                            className="h-8 text-sm"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                        <div className="space-y-1">
                            <Label className="text-xs">Pays</Label>
                            <Input
                                value={formData.country}
                                onChange={(e) => handleInputChange("country", e.target.value)}
                                className="h-8 text-sm"
                            />
                        </div>
                        <div className="space-y-1">
                            <Label className="text-xs">Ville</Label>
                            <Input
                                value={formData.city}
                                onChange={(e) => handleInputChange("city", e.target.value)}
                                className="h-8 text-sm"
                            />
                        </div>
                    </div>

                    <div className="space-y-1">
                        <Label className="text-xs">Genre</Label>
                        <Select value={formData.gender} onValueChange={(v) => handleInputChange("gender", v)}>
                            <SelectTrigger className="h-8 text-sm">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="MALE">Homme</SelectItem>
                                <SelectItem value="FEMALE">Femme</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Group selector */}
                    <div className="space-y-1">
                        <Label className="text-xs">Groupe</Label>
                        <GroupSelectWithCreate
                            enterpriseId={enterpriseId}
                            value={formData.groupId}
                            onChange={(groupId) => handleInputChange("groupId", groupId)}
                        />
                    </div>

                    {/* Action buttons */}
                    <div className="flex gap-2 pt-2">
                        <Button
                            className="flex-1 h-8"
                            onClick={handleSave}
                            disabled={isUpdating || !isPhoneValid}
                        >
                            {isUpdating ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                                <>
                                    <TickCircle size={14} variant="Bulk" color="currentColor" className="mr-1" />
                                    Enregistrer
                                </>
                            )}
                        </Button>
                        <Button
                            variant="outline"
                            className="h-8"
                            onClick={() => setIsOpen(false)}
                        >
                            Annuler
                        </Button>
                    </div>
                </div>
            </PopoverContent>
        </Popover>
    )
}
