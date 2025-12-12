"use client"

import { useState } from "react"
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
import { Loader2, Upload, X } from "lucide-react"
import { Card, CardContent } from "@/shared/ui/card"
import type { CreatePricingPlanRequest } from "@/core/services/pricing.service"
import type { PricingPlanType } from "@/core/models/pricing"

const createPlanSchema = z.object({
  planNameFr: z.string().min(1, "Le nom français est requis"),
  planNameEn: z.string().min(1, "Le nom anglais est requis"),
  descriptionFr: z.string().min(1, "La description française est requise"),
  descriptionEn: z.string().min(1, "La description anglaise est requise"),
  minSMS: z.number().min(1, "Le minimum de SMS doit être supérieur à 0"),
  maxSMS: z.number().min(1, "Le maximum de SMS doit être supérieur à 0"),
  nbDaysToExpired: z.number().min(1, "Le nombre de jours doit être supérieur à 0"),
  smsUnitPrice: z.number().min(1, "Le prix unitaire doit être supérieur à 0"),
  planCode: z.string().min(1, "Le code du plan est requis"),
  illustrationImgUrl: z.string(),
  active: z.boolean(),
  version: z.number(),
  archived: z.boolean(),
  deleted: z.boolean(),
})

type CreatePlanFormData = z.infer<typeof createPlanSchema>

interface CreatePricingModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: CreatePricingPlanRequest) => Promise<PricingPlanType>
  isLoading: boolean
}

export function CreatePricingModal({
  isOpen,
  onClose,
  onSubmit,
  isLoading,
}: CreatePricingModalProps) {
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [imageFile, setImageFile] = useState<File | null>(null)

  const form = useForm<CreatePlanFormData>({
    resolver: zodResolver(createPlanSchema),
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
      version: 1,
      archived: false,
      deleted: false,
    },
  })

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
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
        // Handle error - file is not an image
        console.error('Le fichier doit être une image')
      }
    }
  }

  const removeImage = () => {
    setImagePreview(null)
    setImageFile(null)
    form.setValue('illustrationImgUrl', '')
  }

  const handleSubmit = async (data: CreatePlanFormData) => {
    try {
      // Convert form data to match API requirements
      const submitData: CreatePricingPlanRequest = {
        ...data,
        illustrationImgUrl: data.illustrationImgUrl || "", // Ensure it's never undefined
      }
      await onSubmit(submitData)
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
          <DialogTitle>Créer un nouveau plan tarifaire</DialogTitle>
          <DialogDescription>
            Remplissez les informations pour créer un nouveau plan tarifaire.
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
                    <FormLabel>Nom du plan (Français)</FormLabel>
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
                    <FormLabel>Nom du plan (Anglais)</FormLabel>
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
                    <FormLabel>Description (Français)</FormLabel>
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
                    <FormLabel>Description (Anglais)</FormLabel>
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
                  <FormLabel>Code du plan</FormLabel>
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
                    <FormLabel>Minimum de SMS</FormLabel>
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
                    <FormLabel>Maximum de SMS</FormLabel>
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
                    <FormLabel>Validité (jours)</FormLabel>
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
                    <FormLabel>Prix unitaire (FCFA)</FormLabel>
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
                  <FormLabel>Illustration du plan</FormLabel>
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
                            {imageFile?.name}
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
                                Cliquez pour télécharger une illustration
                              </p>
                              <p className="text-xs text-muted-foreground">
                                PNG, JPG, GIF jusqu'à 10MB
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
                    Création...
                  </>
                ) : (
                  "Créer le plan"
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
