"use client"

import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Gender } from "@/core/config/enum"
import { useCreateContact, useUpdateContact } from "@/core/hooks/useContacts"
import type { EnterpriseContactResponseType } from "@/core/models/contact-new"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/shared/ui/dialog"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormMessage,
} from "@/shared/ui/form"
import { Input } from "@/shared/ui/input"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/shared/ui/select"
import { Button } from "@/shared/ui/button"
import { ProfileAdd, UserEdit, User, Sms, Call, Location } from "iconsax-react"
import { Loader2 } from "lucide-react"
import { CountryCodeWarning } from "@/shared/common/country-code-warning"

const contactSchema = z.object({
    firstName: z.string(),
    lastName: z.string(),
    email: z.string().refine((val) => val === "" || z.string().email().safeParse(val).success, {
        message: "Adresse email invalide",
    }),
    phoneNumber: z.string().min(1, "Le numéro de téléphone est requis"),
    country: z.string(),
    city: z.string(),
    gender: z.nativeEnum(Gender).optional(),
})

type ContactFormData = z.infer<typeof contactSchema>

interface ContactFormModalProps {
    isOpen: boolean
    onClose: () => void
    contact?: EnterpriseContactResponseType | null
    enterpriseId: string
    onSuccess?: () => void
}

export function ContactFormModal({
    isOpen,
    onClose,
    contact,
    enterpriseId,
    onSuccess,
}: ContactFormModalProps) {
    const isEditMode = !!contact
    const { mutate: createContact, isPending: isCreating } = useCreateContact()
    const { mutate: updateContact, isPending: isUpdating } = useUpdateContact()

    const form = useForm<ContactFormData>({
        resolver: zodResolver(contactSchema),
        defaultValues: {
            firstName: "",
            lastName: "",
            email: "",
            phoneNumber: "",
            country: "",
            city: "",
            gender: undefined,
        },
    })

    useEffect(() => {
        if (contact) {
            form.reset({
                firstName: contact.firstname,
                lastName: contact.lastname,
                email: contact.email,
                phoneNumber: contact.phoneNumber,
                country: contact.country,
                city: contact.city,
                gender: contact.gender,
            })
        } else {
            form.reset({
                firstName: "",
                lastName: "",
                email: "",
                phoneNumber: "",
                country: "",
                city: "",
                gender: undefined,
            })
        }
    }, [contact, form])

    const onSubmit = (data: ContactFormData) => {
        if (isEditMode && contact) {
            updateContact(
                {
                    id: contact.id,
                    data: {
                        id: contact.id,
                        createdAt: contact.createdAt,
                        firstname: data.firstName,
                        lastname: data.lastName,
                        email: data.email,
                        phoneNumber: data.phoneNumber,
                        country: data.country,
                        pays: contact.pays || data.country,
                        city: data.city,
                        villeEntreprise: (contact as any).villeEntreprise || data.city,
                        smsSenderId: contact.smsSenderId || "",
                        activityDomain: (contact as any).activityDomain || "",
                        user: contact.user,
                        enterpriseId,
                    },
                },
                {
                    onSuccess: () => {
                        onClose()
                        form.reset()
                        onSuccess?.()
                    },
                }
            )
        } else {
            createContact(
                {
                    firstName: data.firstName,
                    lastName: data.lastName,
                    email: data.email,
                    phoneNumber: data.phoneNumber,
                    country: data.country,
                    city: data.city,
                    gender: data.gender,
                    enterpriseId,
                },
                {
                    onSuccess: () => {
                        onClose()
                        form.reset()
                        onSuccess?.()
                    },
                }
            )
        }
    }

    const handleClose = () => {
        onClose()
        form.reset()
    }

    const isPending = isCreating || isUpdating
    const HeaderIcon = isEditMode ? UserEdit : ProfileAdd

    return (
        <Dialog open={isOpen} onOpenChange={handleClose}>
            <DialogContent className="sm:max-w-[500px] p-0 rounded-2xl overflow-hidden">
                <DialogHeader className="px-5 pt-5 pb-0">
                    <DialogTitle className="text-lg flex items-center gap-2">
                        <div className="rounded-lg bg-primary/10 p-1.5">
                            <HeaderIcon size={18} variant="Bulk" color="currentColor" className="text-primary" />
                        </div>
                        {isEditMode ? "Modifier le contact" : "Nouveau contact"}
                    </DialogTitle>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)}>
                        <div className="px-5 py-4 space-y-4">
                            <CountryCodeWarning />

                            {/* Name section */}
                            <div className="space-y-2.5">
                                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                                    <User size={13} color="currentColor" variant="Bulk" />
                                    Identité
                                </div>
                                <div className="grid grid-cols-2 gap-3">
                                    <FormField
                                        control={form.control}
                                        name="firstName"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormControl>
                                                    <Input placeholder="Prénom" className="h-9 rounded-xl text-sm" {...field} />
                                                </FormControl>
                                                <FormMessage className="text-[11px]" />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="lastName"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormControl>
                                                    <Input placeholder="Nom" className="h-9 rounded-xl text-sm" {...field} />
                                                </FormControl>
                                                <FormMessage className="text-[11px]" />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                            </div>

                            {/* Contact section */}
                            <div className="space-y-2.5">
                                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                                    <Call size={13} color="currentColor" variant="Bulk" />
                                    Coordonnées
                                </div>
                                <div className="space-y-3">
                                    <FormField
                                        control={form.control}
                                        name="email"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormControl>
                                                    <div className="relative">
                                                        <Sms size={14} color="currentColor" className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                                                        <Input
                                                            type="email"
                                                            placeholder="Email"
                                                            className="h-9 pl-9 rounded-xl text-sm"
                                                            {...field}
                                                        />
                                                    </div>
                                                </FormControl>
                                                <FormMessage className="text-[11px]" />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="phoneNumber"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormControl>
                                                    <div className="relative">
                                                        <Call size={14} color="currentColor" className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                                                        <Input
                                                            placeholder="Numéro de téléphone"
                                                            className="h-9 pl-9 rounded-xl text-sm"
                                                            {...field}
                                                        />
                                                    </div>
                                                </FormControl>
                                                <FormMessage className="text-[11px]" />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                            </div>

                            {/* Location section */}
                            <div className="space-y-2.5">
                                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                                    <Location size={13} color="currentColor" variant="Bulk" />
                                    Localisation
                                </div>
                                <div className="grid grid-cols-2 gap-3">
                                    <FormField
                                        control={form.control}
                                        name="country"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormControl>
                                                    <Input placeholder="Pays" className="h-9 rounded-xl text-sm" {...field} />
                                                </FormControl>
                                                <FormMessage className="text-[11px]" />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="city"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormControl>
                                                    <Input placeholder="Ville" className="h-9 rounded-xl text-sm" {...field} />
                                                </FormControl>
                                                <FormMessage className="text-[11px]" />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                            </div>

                            {/* Gender */}
                            <FormField
                                control={form.control}
                                name="gender"
                                render={({ field }) => (
                                    <FormItem>
                                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-1.5">
                                            <User size={13} color="currentColor" variant="Bulk" />
                                            Genre <span className="text-[11px] text-muted-foreground/60">(optionnel)</span>
                                        </div>
                                        <Select
                                            onValueChange={field.onChange}
                                            defaultValue={field.value}
                                        >
                                            <FormControl>
                                                <SelectTrigger className="h-9 rounded-xl text-sm">
                                                    <SelectValue placeholder="Sélectionner" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value={Gender.MALE}>Homme</SelectItem>
                                                <SelectItem value={Gender.FEMALE}>Femme</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <FormMessage className="text-[11px]" />
                                    </FormItem>
                                )}
                            />
                        </div>

                        {/* Footer */}
                        <div className="flex items-center gap-2 px-5 py-4 border-t border-border/50 bg-muted/20">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={handleClose}
                                disabled={isPending}
                                className="flex-1 sm:flex-none rounded-xl"
                            >
                                Annuler
                            </Button>
                            <Button
                                type="submit"
                                disabled={isPending}
                                className="flex-1 sm:flex-none sm:min-w-[160px] rounded-xl gap-2"
                            >
                                {isPending ? (
                                    <>
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                        {isEditMode ? "Modification..." : "Création..."}
                                    </>
                                ) : (
                                    <>
                                        <HeaderIcon size={16} color="currentColor" variant="Bulk" />
                                        {isEditMode ? "Modifier" : "Créer le contact"}
                                    </>
                                )}
                            </Button>
                        </div>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}
