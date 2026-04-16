"use client"

import { useEffect, type ReactNode } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Gender } from "@/core/config/enum"
import { useT } from "@/core/hooks"
import { useCreateContact, useUpdateContact } from "@/core/hooks/useContacts"
import type { EnterpriseContactResponseType } from "@/core/models/contact-new"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/shared/ui/dialog"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
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
import { Separator } from "@/shared/ui/separator"
import {
    ProfileAdd,
    UserEdit,
    User as UserIcon,
    Sms as SmsIcon,
    Call,
    Location,
    Personalcard,
    Global,
} from "iconsax-react"
import { Loader2 } from "lucide-react"
import { CountryCodeWarning } from "@/shared/common/country-code-warning"
import { cn } from "@/lib/utils"

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

function SectionLabel({ icon, children }: { icon: ReactNode; children: ReactNode }) {
    return (
        <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
            <span className="text-primary">{icon}</span>
            {children}
        </div>
    )
}

function IconInput({ icon, children }: { icon: ReactNode; children: ReactNode }) {
    return (
        <div className="relative">
            <div className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                {icon}
            </div>
            {children}
        </div>
    )
}

export function ContactFormModal({
    isOpen,
    onClose,
    contact,
    enterpriseId,
    onSuccess,
}: ContactFormModalProps) {
    const { t } = useT()
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
            <DialogContent className="sm:max-w-[560px] p-0 gap-0 overflow-hidden">
                {/* Hero header */}
                <div className="relative bg-gradient-to-br from-primary/10 via-primary/5 to-transparent border-b border-border/60 px-5 py-5">
                    <div className="absolute inset-0 opacity-40 [background-image:radial-gradient(circle_at_top_right,theme(colors.primary/15),transparent_60%)]" />
                    <DialogHeader className="relative">
                        <div className="flex items-start gap-3">
                            <div className="rounded-xl bg-primary/15 p-2.5 ring-1 ring-primary/20">
                                <HeaderIcon size={20} color="currentColor" variant="Bulk" className="text-primary" />
                            </div>
                            <div className="flex-1 text-left">
                                <DialogTitle className="text-base font-semibold text-foreground">
                                    {isEditMode ? t('contacts.editContactTitle') : t('contacts.newContact')}
                                </DialogTitle>
                                <DialogDescription className="text-xs text-muted-foreground mt-0.5">
                                    {isEditMode
                                        ? t('contacts.editContactSubtitle')
                                        : t('contacts.newContactSubtitle')}
                                </DialogDescription>
                            </div>
                        </div>
                    </DialogHeader>
                </div>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)}>
                        {/* Scrollable body */}
                        <div className="max-h-[60vh] overflow-y-auto px-5 py-5 space-y-5">
                            <CountryCodeWarning />

                            {/* Identité */}
                            <section className="space-y-3">
                                <SectionLabel icon={<Personalcard size={12} color="currentColor" variant="Bulk" />}>
                                    {t('contacts.identity')}
                                </SectionLabel>
                                <div className="grid gap-3 sm:grid-cols-2">
                                    <FormField
                                        control={form.control}
                                        name="firstName"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="text-xs font-medium">{t('contacts.firstnamePlaceholder')}</FormLabel>
                                                <FormControl>
                                                    <IconInput icon={<UserIcon size={16} color="currentColor" />}>
                                                        <Input className="pl-10 h-10 rounded-lg" {...field} />
                                                    </IconInput>
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
                                                <FormLabel className="text-xs font-medium">{t('contacts.lastnamePlaceholder')}</FormLabel>
                                                <FormControl>
                                                    <IconInput icon={<UserIcon size={16} color="currentColor" />}>
                                                        <Input className="pl-10 h-10 rounded-lg" {...field} />
                                                    </IconInput>
                                                </FormControl>
                                                <FormMessage className="text-[11px]" />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                            </section>

                            <Separator />

                            {/* Coordonnées */}
                            <section className="space-y-3">
                                <SectionLabel icon={<Call size={12} color="currentColor" variant="Bulk" />}>
                                    {t('contacts.contactInfo')}
                                </SectionLabel>
                                <div className="grid gap-3 sm:grid-cols-2">
                                    <FormField
                                        control={form.control}
                                        name="email"
                                        render={({ field }) => (
                                            <FormItem className="sm:col-span-2">
                                                <FormLabel className="text-xs font-medium">{t('common.email')}</FormLabel>
                                                <FormControl>
                                                    <IconInput icon={<SmsIcon size={16} color="currentColor" />}>
                                                        <Input
                                                            type="email"
                                                            placeholder="exemple@domaine.com"
                                                            className="pl-10 h-10 rounded-lg"
                                                            {...field}
                                                        />
                                                    </IconInput>
                                                </FormControl>
                                                <FormMessage className="text-[11px]" />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="phoneNumber"
                                        render={({ field }) => (
                                            <FormItem className="sm:col-span-2">
                                                <FormLabel className="text-xs font-medium">
                                                    {t('contacts.phonePlaceholder')}
                                                    <span className="ml-1 text-red-500">*</span>
                                                </FormLabel>
                                                <FormControl>
                                                    <IconInput icon={<Call size={16} color="currentColor" />}>
                                                        <Input
                                                            placeholder="+237 6XX XX XX XX"
                                                            className="pl-10 h-10 rounded-lg font-mono"
                                                            {...field}
                                                        />
                                                    </IconInput>
                                                </FormControl>
                                                <FormMessage className="text-[11px]" />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                            </section>

                            <Separator />

                            {/* Localisation */}
                            <section className="space-y-3">
                                <SectionLabel icon={<Location size={12} color="currentColor" variant="Bulk" />}>
                                    {t('contacts.location')}
                                </SectionLabel>
                                <div className="grid gap-3 sm:grid-cols-2">
                                    <FormField
                                        control={form.control}
                                        name="country"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="text-xs font-medium">{t('contacts.countryPlaceholder')}</FormLabel>
                                                <FormControl>
                                                    <IconInput icon={<Global size={16} color="currentColor" />}>
                                                        <Input className="pl-10 h-10 rounded-lg" {...field} />
                                                    </IconInput>
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
                                                <FormLabel className="text-xs font-medium">{t('contacts.cityPlaceholder')}</FormLabel>
                                                <FormControl>
                                                    <IconInput icon={<Location size={16} color="currentColor" />}>
                                                        <Input className="pl-10 h-10 rounded-lg" {...field} />
                                                    </IconInput>
                                                </FormControl>
                                                <FormMessage className="text-[11px]" />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                            </section>

                            <Separator />

                            {/* Optionnel */}
                            <section className="space-y-3">
                                <SectionLabel icon={<UserIcon size={12} color="currentColor" variant="Bulk" />}>
                                    {t('contacts.gender')}{' '}
                                    <span className="text-muted-foreground/60 normal-case font-normal tracking-normal">
                                        ({t('contacts.optional')})
                                    </span>
                                </SectionLabel>
                                <FormField
                                    control={form.control}
                                    name="gender"
                                    render={({ field }) => (
                                        <FormItem>
                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                <FormControl>
                                                    <SelectTrigger className="h-10 rounded-lg">
                                                        <SelectValue placeholder={t('contacts.select')} />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    <SelectItem value={Gender.MALE}>{t('contacts.male')}</SelectItem>
                                                    <SelectItem value={Gender.FEMALE}>{t('contacts.female')}</SelectItem>
                                                </SelectContent>
                                            </Select>
                                            <FormMessage className="text-[11px]" />
                                        </FormItem>
                                    )}
                                />
                            </section>
                        </div>

                        {/* Sticky footer */}
                        <div className={cn(
                            "sticky bottom-0 z-10 flex items-center justify-end gap-2 px-5 py-3.5",
                            "border-t border-border/60 bg-background/80 backdrop-blur-md"
                        )}>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={handleClose}
                                disabled={isPending}
                                className="rounded-lg"
                            >
                                {t('common.cancel')}
                            </Button>
                            <Button
                                type="submit"
                                disabled={isPending}
                                className={cn(
                                    "rounded-lg gap-2 bg-primary text-white font-semibold",
                                    "shadow-md shadow-primary/25 hover:shadow-lg hover:shadow-primary/30",
                                    "hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
                                )}
                            >
                                {isPending ? (
                                    <>
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                        {isEditMode ? t('contacts.modifying') : t('contacts.creating')}
                                    </>
                                ) : (
                                    <>
                                        <HeaderIcon size={14} color="currentColor" variant="Bulk" />
                                        {isEditMode ? t('contacts.modify') : t('contacts.createContact')}
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
