"use client"

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
import { useT } from "@/core/hooks"

const createSchema = z.object({
  countryCode: z
    .string()
    .min(2, "Le code pays doit contenir au moins 2 caractères")
    .max(3, "Le code pays doit contenir au maximum 3 caractères")
    .transform((v) => v.toUpperCase()),
  countryName: z.string().min(1, "Le nom du pays est requis"),
  pricePerSms: z.number().min(0, "Le prix doit être positif"),
})

type CreateFormData = z.infer<typeof createSchema>

interface CreateCountryPriceModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: CreateSmsCountryPriceRequest) => Promise<SmsCountryPriceType>
  isLoading: boolean
}

export function CreateCountryPriceModal({
  isOpen,
  onClose,
  onSubmit,
  isLoading,
}: CreateCountryPriceModalProps) {
  const { t } = useT()
  const form = useForm<CreateFormData>({
    resolver: zodResolver(createSchema),
    defaultValues: {
      countryCode: "",
      countryName: "",
      pricePerSms: 0,
    },
  })

  const handleSubmit = async (data: CreateFormData) => {
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
          <DialogTitle>{t('countryPrices.addTitle')}</DialogTitle>
          <DialogDescription>
            {t('countryPrices.addDesc')}
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
                    <FormLabel>{t('countryPrices.countryCodeIso')}</FormLabel>
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
                    <FormLabel>{t('countryPrices.countryName')}</FormLabel>
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
                  <FormLabel>{t('countryPrices.pricePerSmsFcfa')}</FormLabel>
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
                {t('common.cancel')}
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {t('countryPrices.creating')}
                  </>
                ) : (
                  t('countryPrices.addBtn')
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
