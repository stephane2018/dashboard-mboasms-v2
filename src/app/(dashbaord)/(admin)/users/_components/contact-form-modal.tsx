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
    DialogDescription,
    DialogFooter,
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

const contactSchema = z.object({
    firstName: z.string().min(1, "First name is required"),
    lastName: z.string().min(1, "Last name is required"),
    email: z.string().email("Invalid email address"),
    phoneNumber: z.string().min(1, "Phone number is required"),
    country: z.string().min(1, "Country is required"),
    city: z.string().min(1, "City is required"),
    gender: z.nativeEnum(Gender).optional(),
})

type ContactFormData = z.infer<typeof contactSchema>

interface ContactFormModalProps {
    isOpen: boolean
    onClose: () => void
    contact?: EnterpriseContactResponseType | null
    enterpriseId: string
}

export function ContactFormModal({
    isOpen,
    onClose,
    contact,
    enterpriseId,
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
                        ...data,
                        enterpriseId,
                    },
                },
                {
                    onSuccess: () => {
                        onClose()
                        form.reset()
                    },
                }
            )
        } else {
            createContact(
                {
                    ...data,
                    enterpriseId,
                },
                {
                    onSuccess: () => {
                        onClose()
                        form.reset()
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

    return (
        <Dialog open={isOpen} onOpenChange={handleClose}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>
                        {isEditMode ? "Edit Contact" : "Add New Contact"}
                    </DialogTitle>
                    <DialogDescription>
                        {isEditMode
                            ? "Update the contact information below."
                            : "Fill in the details to create a new contact."}
                    </DialogDescription>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="firstName"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>First Name</FormLabel>
                                        <FormControl>
                                            <Input placeholder="John" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="lastName"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Last Name</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Doe" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Email</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="email"
                                            placeholder="john.doe@example.com"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="phoneNumber"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Phone Number</FormLabel>
                                    <FormControl>
                                        <Input placeholder="+1234567890" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className="grid grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="country"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Country</FormLabel>
                                        <FormControl>
                                            <Input placeholder="USA" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="city"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>City</FormLabel>
                                        <FormControl>
                                            <Input placeholder="New York" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <FormField
                            control={form.control}
                            name="gender"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Gender (Optional)</FormLabel>
                                    <Select
                                        onValueChange={field.onChange}
                                        defaultValue={field.value}
                                    >
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select gender" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value={Gender.MALE}>Male</SelectItem>
                                            <SelectItem value={Gender.FEMALE}>Female</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <DialogFooter>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={handleClose}
                                disabled={isPending}
                            >
                                Cancel
                            </Button>
                            <Button type="submit" disabled={isPending} isLoading={isPending}>
                                {isEditMode ? "Update Contact" : "Create Contact"}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}
