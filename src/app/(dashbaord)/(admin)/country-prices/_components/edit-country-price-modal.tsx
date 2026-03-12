"use client"

import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
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
import { Button } from "@/shared/ui/button"
import { Loader2 } from "lucide-react"
import type { CreateSmsCountryPriceRequest } from "@/core/services/sms-country-price.service"
import type { SmsCountryPriceType } from "@/core/models/sms-country-price"

const editSchema = z.object({
  countryCode: z
    .string()
    .min(2, "Le code pays doit contenir au moins 2 caractères")
    .max(3, "Le code pays doit contenir au maximum 3 caractères")
    .transform((v) => v.toUpperCase()),
  countryName: z.string().min(1, "Le nom du pays est requis"),
  pricePerSms: z.number().min(0, "Le prix doit être positif"),
})

type EditFormData = z.infer<typeof editSchema>

interface EditCountryPriceModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: Partial<CreateSmsCountryPriceRequest>) => Promise<void>
  price: SmsCountryPriceType | null
  isLoading: boolean
}

export function EditCountryPriceModal({
  isOpen,
  onClose,
  onSubmit,
  price,
  isLoading,
}: EditCountryPriceModalProps) {
  const form = useForm<EditFormData>({
    resolver: zodResolver(editSchema),
    defaultValues: {
      countryCode: "",
      countryName: "",
      pricePerSms: 0,
    },
  })

  useEffect(() => {
    if (price) {
      form.reset({
        countryCode: price.countryCode || "",
        countryName: price.countryName || "",
        pricePerSms: price.pricePerSms || 0,
      })
    }
  }, [price, form])

  const handleSubmit = async (data: EditFormData) => {
    try {
      await onSubmit(data)
      form.reset()
      onClose()
    } catch {
      // Error handled by parent
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[450px]">
        <DialogHeader>
          <DialogTitle>Modifier le prix</DialogTitle>
          <DialogDescription>
            Modifiez les informations de tarification pour ce pays.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="countryCode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Code pays (ISO)</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Ex: CM"
                        {...field}
                        onChange={(e) => field.onChange(e.target.value.toUpperCase())}
                        maxLength={3}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="countryName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nom du pays</FormLabel>
                    <FormControl>
                      <Input placeholder="Ex: Cameroun" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="pricePerSms"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Prix par SMS (FCFA)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      step="0.01"
                      placeholder="25"
                      {...field}
                      onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={isLoading}
              >
                Annuler
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Modification...
                  </>
                ) : (
                  "Modifier"
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
