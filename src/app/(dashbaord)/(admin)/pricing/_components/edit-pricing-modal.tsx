"use client"

import { useEffect, useState } from "react"
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
import { Textarea } from "@/shared/ui/textarea"
import { Button } from "@/shared/ui/button"
import { Switch } from "@/shared/ui/switch"
import { Loader2, Upload, X } from "lucide-react"
import { Card, CardContent } from "@/shared/ui/card"
import type { PricingPlanType } from "@/core/models/pricing"
import type { CreatePricingPlanRequest } from "@/core/services/pricing.service"
import { useT } from "@/core/hooks"

const editPlanSchema = z.object({
  planNameFr: z.string().min(1, "Le nom français est requis"),
  planNameEn: z.string().min(1, "Le nom anglais est requis"),
  descriptionFr: z.string().min(1, "La description française est requise"),
  descriptionEn: z.string().min(1, "La description anglaise est requise"),
  minSMS: z.number().min(1, "Le minimum de SMS doit être supérieur à 0"),
  maxSMS: z.number().min(1, "Le maximum de SMS doit être supérieur à 0"),
  nbDaysToExpired: z.number().min(1, "Le nombre de jours doit être supérieur à 0"),
  smsUnitPrice: z.number().min(1, "Le prix unitaire doit être supérieur à 0"),
  planCode: z.string().min(1, "Le code du plan est requis"),
  illustrationImgUrl: z.string().optional(),
  active: z.boolean(),
})

type EditPlanFormData = z.infer<typeof editPlanSchema>

interface EditPricingModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: Partial<CreatePricingPlanRequest>) => Promise<void>
  plan: PricingPlanType | null
  isLoading: boolean
}

export function EditPricingModal({
  isOpen,
  onClose,
  onSubmit,
  plan,
  isLoading,
}: EditPricingModalProps) {
  const { t } = useT()
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [imageFile, setImageFile] = useState<File | null>(null)

  const form = useForm<EditPlanFormData>({
    resolver: zodResolver(editPlanSchema),
    defaultValues: {
      planNameFr: "",
      planNameEn: "",
      descriptionFr: "",
      descriptionEn: "",
      minSMS: 0,
      maxSMS: 0,
      nbDaysToExpired: 30,
      smsUnitPrice: 0,
      planCode: "",
      illustrationImgUrl: "",
      active: true,
    },
  })

  // Reset form when plan changes
  useEffect(() => {
    if (plan) {
      form.reset({
        planNameFr: plan.planNameFr || "",
        planNameEn: plan.planNameEn || "",
        descriptionFr: plan.descriptionFr || "",
        descriptionEn: plan.descriptionEn || "",
        minSMS: plan.minSMS || 0,
        maxSMS: plan.maxSMS || 0,
        nbDaysToExpired: plan.nbDaysToExpired || 30,
        smsUnitPrice: plan.smsUnitPrice || 0,
        planCode: plan.planCode || "",
        illustrationImgUrl: plan.illustrationImgUrl || "",
        active: plan.active ?? true,
      })
      
      // Set image preview if existing image
      if (plan.illustrationImgUrl) {
        setImagePreview(plan.illustrationImgUrl)
      } else {
        setImagePreview(null)
      }
      setImageFile(null)
    }
  }, [plan, form])

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      // Limit file size to 2MB
      const MAX_IMAGE_SIZE = 2 * 1024 * 1024
      if (file.size > MAX_IMAGE_SIZE) {
        form.setError('illustrationImgUrl', { message: "L'image ne doit pas dépasser 2 Mo" })
        return
      }
      if (file.type.startsWith('image/')) {
        setImageFile(file)

        // Create preview
        const reader = new FileReader()
        reader.onloadend = () => {
          setImagePreview(reader.result as string)
          form.setValue('illustrationImgUrl', reader.result as string)
        }
        reader.readAsDataURL(file)
      } else {
        form.setError('illustrationImgUrl', { message: "Le fichier doit être une image" })
      }
    }
  }

  const removeImage = () => {
    setImagePreview(null)
    setImageFile(null)
    form.setValue('illustrationImgUrl', '')
  }

  const handleSubmit = async (data: EditPlanFormData) => {
    try {
      await onSubmit(data)
      form.reset()
      setImagePreview(null)
      setImageFile(null)
      onClose()
    } catch (error) {
      // Error is handled by the parent component
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{t('pricing.editPlanTitle')}</DialogTitle>
          <DialogDescription>
            {t('pricing.editPlanDesc')}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="planNameFr"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('pricing.planNameFr')}</FormLabel>
                    <FormControl>
                      <Input placeholder="Ex: Pack Premium" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="planNameEn"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('pricing.planNameEn')}</FormLabel>
                    <FormControl>
                      <Input placeholder="Ex: Premium Pack" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="descriptionFr"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('pricing.descriptionFr')}</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Description du plan en français"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="descriptionEn"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('pricing.descriptionEn')}</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Description du plan en anglais"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="planCode"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('pricing.planCode')}</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: PREMIUM_2024" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="minSMS"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('pricing.minSms')}</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="100"
                        {...field}
                        onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="maxSMS"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('pricing.maxSms')}</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="1000"
                        {...field}
                        onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="nbDaysToExpired"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('pricing.validityDaysLabel')}</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="30"
                        {...field}
                        onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="smsUnitPrice"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('pricing.unitPriceFcfa')}</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="50"
                        {...field}
                        onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Image Upload Section */}
            <FormField
              control={form.control}
              name="illustrationImgUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('pricing.illustrationLabel')}</FormLabel>
                  <div className="space-y-3">
                    {imagePreview ? (
                      <Card className="relative">
                        <CardContent className="p-4">
                          <div className="relative">
                            <img
                              src={imagePreview}
                              alt="Aperçu de l'illustration"
                              className="w-full h-48 object-cover rounded-md"
                            />
                            <Button
                              type="button"
                              variant="destructive"
                              size="sm"
                              className="absolute top-2 right-2"
                              onClick={removeImage}
                            >
                              <X size={16} />
                            </Button>
                          </div>
                          <p className="text-sm text-muted-foreground mt-2">
                            {imageFile?.name || t('pricing.existingImage')}
                          </p>
                        </CardContent>
                      </Card>
                    ) : (
                      <Card>
                        <CardContent className="p-8">
                          <div className="flex flex-col items-center justify-center space-y-2">
                            <Upload className="h-8 w-8 text-muted-foreground" />
                            <div className="text-center">
                              <p className="text-sm font-medium">
                                {t('pricing.uploadClick')}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {t('pricing.uploadHint')}
                              </p>
                            </div>
                            <Input
                              type="file"
                              accept="image/*"
                              onChange={handleImageUpload}
                              className="cursor-pointer max-w-xs"
                            />
                          </div>
                        </CardContent>
                      </Card>
                    )}
                    <FormControl>
                      <Input
                        type="hidden"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </div>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="active"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">{t('pricing.planStatusLabel')}</FormLabel>
                    <div className="text-sm text-muted-foreground">
                      {field.value ? t('pricing.planActive') : t('pricing.planInactive')}
                    </div>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
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
                    {t('pricing.modifying')}
                  </>
                ) : (
                  t('pricing.editPlanBtn')
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
