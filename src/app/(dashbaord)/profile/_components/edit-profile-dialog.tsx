"use client"

import { useEffect, useState, type ReactNode } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Loader2 } from "lucide-react"
import {
  User as UserIcon,
  Building,
  Sms,
  Call,
  Global,
  Eye,
  EyeSlash,
  Lock,
  Personalcard,
  Profile2User,
  Briefcase,
  Location,
  Shop,
  ShieldTick,
} from "iconsax-react"
import { Mail } from "lucide-react"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/shared/ui/dialog"
import { Button } from "@/shared/ui/button"
import { Input } from "@/shared/ui/input"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/shared/ui/form"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/shared/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/ui/avatar"
import { Separator } from "@/shared/ui/separator"
import { useUpdateUser } from "@/core/hooks/useUpdateUser"
import type { AuthUser } from "@/core/stores/authStore"
import type { EnterpriseType } from "@/core/models"
import type { UpdateUserPayload } from "@/core/services/auth.service"
import { cn } from "@/lib/utils"

const editSchema = z.object({
  firstName: z.string().trim().min(1, "Prénom requis").max(50),
  lastName: z.string().trim().min(1, "Nom requis").max(50),
  email: z.string().trim().email("Email invalide"),
  password: z.string().trim().min(8, "Min. 8 caractères").max(128).optional().or(z.literal("")),
  phoneNumber: z.string().trim().regex(/^\+?\d{0,15}$/, "Format invalide").optional().or(z.literal("")),
  country: z.string().trim().max(100).optional().or(z.literal("")),
  city: z.string().trim().max(100).optional().or(z.literal("")),
  address: z.string().trim().max(300).optional().or(z.literal("")),
  socialRaison: z.string().trim().max(200).optional().or(z.literal("")),
  smsSenderId: z.string().trim().max(11).optional().or(z.literal("")),
  activityDomain: z.string().trim().max(200).optional().or(z.literal("")),
  contribuableNumber: z.string().trim().max(50).optional().or(z.literal("")),
  villeEntreprise: z.string().trim().max(100).optional().or(z.literal("")),
  pays: z.string().trim().max(100).optional().or(z.literal("")),
})

type EditFormData = z.infer<typeof editSchema>

interface EditProfileDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  user: AuthUser
  enterprise: EnterpriseType | null
}

function IconInput({
  icon,
  trailing,
  children,
}: {
  icon: ReactNode
  trailing?: ReactNode
  children: ReactNode
}) {
  return (
    <div className="relative">
      <div className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
        {icon}
      </div>
      {children}
      {trailing && (
        <div className="absolute right-2 top-1/2 -translate-y-1/2">{trailing}</div>
      )}
    </div>
  )
}

function SectionLabel({ icon, children }: { icon: ReactNode; children: ReactNode }) {
  return (
    <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
      <span className="text-primary">{icon}</span>
      {children}
    </div>
  )
}

export function EditProfileDialog({ open, onOpenChange, user, enterprise }: EditProfileDialogProps) {
  const updateMutation = useUpdateUser()
  const [showPassword, setShowPassword] = useState(false)
  const [tab, setTab] = useState<"perso" | "entreprise">("perso")

  const form = useForm<EditFormData>({
    resolver: zodResolver(editSchema),
    mode: "onChange",
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      phoneNumber: "",
      country: "",
      city: "",
      address: "",
      socialRaison: "",
      smsSenderId: "",
      activityDomain: "",
      contribuableNumber: "",
      villeEntreprise: "",
      pays: "",
    },
  })

  useEffect(() => {
    if (open) {
      const [fn, ln] = (user.name || "").split(" ")
      form.reset({
        firstName: fn || "",
        lastName: ln || "",
        email: user.email,
        password: "",
        phoneNumber: typeof enterprise?.telephoneEnterprise === "string" ? enterprise.telephoneEnterprise : "",
        country: "",
        city: "",
        address: typeof enterprise?.adresseEnterprise === "string" ? enterprise.adresseEnterprise : "",
        socialRaison: typeof enterprise?.socialRaison === "string" ? enterprise.socialRaison : "",
        smsSenderId: typeof enterprise?.smsESenderId === "string" ? enterprise.smsESenderId : "",
        activityDomain: typeof enterprise?.activityDomain === "string" ? enterprise.activityDomain : "",
        contribuableNumber: typeof enterprise?.contribuableNumber === "string" ? enterprise.contribuableNumber : "",
        villeEntreprise: typeof enterprise?.villeEnterprise === "string" ? enterprise.villeEnterprise : "",
        pays:
          enterprise?.pays && typeof enterprise.pays === "object" && "id" in enterprise.pays
            ? (enterprise.pays as { id: string }).id
            : typeof enterprise?.pays === "string"
            ? enterprise.pays
            : "",
      })
      setTab("perso")
      setShowPassword(false)
    }
  }, [open, user, enterprise, form])

  const onSubmit = async (values: EditFormData) => {
    const payload: UpdateUserPayload = {
      firstName: values.firstName,
      lastName: values.lastName,
      email: values.email,
      phoneNumber: values.phoneNumber || undefined,
      country: values.country || undefined,
      city: values.city || undefined,
      address: values.address || undefined,
      socialRaison: values.socialRaison || undefined,
      smsSenderId: values.smsSenderId || undefined,
      activityDomain: values.activityDomain || undefined,
      contribuableNumber: values.contribuableNumber || undefined,
      villeEntreprise: values.villeEntreprise || undefined,
      pays: values.pays || undefined,
      user: user.id,
    }
    if (values.password && values.password.trim().length > 0) {
      payload.password = values.password.trim()
    }

    try {
      await updateMutation.mutateAsync({ id: user.id, payload })
      onOpenChange(false)
    } catch {
      // toast handled inside mutation
    }
  }

  const userName = (user.name || user.email).trim()
  const initials = userName.split(" ").map((p) => p[0]).join("").slice(0, 2).toUpperCase()
  const avatarUrl = enterprise?.urlImage || user.avatar

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-3xl p-0 gap-0 overflow-hidden">
        {/* Hero header */}
        <div className="relative bg-gradient-to-br from-primary/10 via-primary/5 to-transparent border-b border-border/60 p-6">
          <div className="absolute inset-0 opacity-50 [background-image:radial-gradient(circle_at_top_right,theme(colors.primary/15),transparent_60%)]" />
          <DialogHeader className="relative space-y-3">
            <div className="flex items-center gap-4">
              <Avatar className="h-14 w-14 ring-2 ring-background shadow-md">
                <AvatarImage src={avatarUrl} alt={userName} />
                <AvatarFallback className="text-base font-bold bg-primary/10 text-primary">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <div className="min-w-0 flex-1 text-left">
                <DialogTitle className="text-lg font-semibold text-foreground">
                  Modifier mon profil
                </DialogTitle>
                <DialogDescription className="text-xs text-muted-foreground mt-0.5 truncate">
                  {userName} • {user.email}
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col">
            <Tabs value={tab} onValueChange={(v) => setTab(v as "perso" | "entreprise")} className="flex-1">
              <div className="px-6 pt-5">
                <TabsList className="grid w-full grid-cols-2 h-11 p-1 bg-muted/50">
                  <TabsTrigger value="perso" className="gap-2 data-[state=active]:bg-background data-[state=active]:shadow-sm">
                    <UserIcon size={16} color="currentColor" variant="Bulk" />
                    Personnel
                  </TabsTrigger>
                  <TabsTrigger value="entreprise" className="gap-2 data-[state=active]:bg-background data-[state=active]:shadow-sm">
                    <Building size={16} color="currentColor" variant="Bulk" />
                    Entreprise
                  </TabsTrigger>
                </TabsList>
              </div>

              {/* Scrollable content */}
              <div className="max-h-[55vh] overflow-y-auto px-6 py-5">
                {/* PERSONNEL TAB */}
                <TabsContent value="perso" className="mt-0 space-y-6 focus-visible:outline-none">
                  {/* Identité */}
                  <section className="space-y-3">
                    <SectionLabel icon={<Personalcard size={14} color="currentColor" variant="Bulk" />}>
                      Identité
                    </SectionLabel>
                    <div className="grid gap-3 sm:grid-cols-2">
                      <FormField
                        control={form.control}
                        name="firstName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-xs font-medium">Prénom</FormLabel>
                            <FormControl>
                              <IconInput icon={<UserIcon size={16} color="currentColor" />}>
                                <Input className="pl-10 h-10 rounded-lg" {...field} />
                              </IconInput>
                            </FormControl>
                            <FormMessage className="text-xs" />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="lastName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-xs font-medium">Nom</FormLabel>
                            <FormControl>
                              <IconInput icon={<UserIcon size={16} color="currentColor" />}>
                                <Input className="pl-10 h-10 rounded-lg" {...field} />
                              </IconInput>
                            </FormControl>
                            <FormMessage className="text-xs" />
                          </FormItem>
                        )}
                      />
                    </div>
                  </section>

                  <Separator />

                  {/* Coordonnées */}
                  <section className="space-y-3">
                    <SectionLabel icon={<Call size={14} color="currentColor" variant="Bulk" />}>
                      Coordonnées
                    </SectionLabel>
                    <div className="grid gap-3 sm:grid-cols-2">
                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem className="sm:col-span-2">
                            <FormLabel className="text-xs font-medium">Email</FormLabel>
                            <FormControl>
                              <IconInput icon={<Mail size={16} />}>
                                <Input type="email" className="pl-10 h-10 rounded-lg" {...field} />
                              </IconInput>
                            </FormControl>
                            <FormMessage className="text-xs" />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="phoneNumber"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-xs font-medium">Téléphone</FormLabel>
                            <FormControl>
                              <IconInput icon={<Call size={16} color="currentColor" />}>
                                <Input placeholder="+237..." className="pl-10 h-10 rounded-lg" {...field} />
                              </IconInput>
                            </FormControl>
                            <FormMessage className="text-xs" />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="country"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-xs font-medium">Pays</FormLabel>
                            <FormControl>
                              <IconInput icon={<Global size={16} color="currentColor" />}>
                                <Input className="pl-10 h-10 rounded-lg" {...field} />
                              </IconInput>
                            </FormControl>
                            <FormMessage className="text-xs" />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="city"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-xs font-medium">Ville</FormLabel>
                            <FormControl>
                              <IconInput icon={<Location size={16} color="currentColor" />}>
                                <Input className="pl-10 h-10 rounded-lg" {...field} />
                              </IconInput>
                            </FormControl>
                            <FormMessage className="text-xs" />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="address"
                        render={({ field }) => (
                          <FormItem className="sm:col-span-2">
                            <FormLabel className="text-xs font-medium">Adresse</FormLabel>
                            <FormControl>
                              <IconInput icon={<Location size={16} color="currentColor" />}>
                                <Input className="pl-10 h-10 rounded-lg" {...field} />
                              </IconInput>
                            </FormControl>
                            <FormMessage className="text-xs" />
                          </FormItem>
                        )}
                      />
                    </div>
                  </section>

                  <Separator />

                  {/* Sécurité */}
                  <section className="space-y-3">
                    <SectionLabel icon={<ShieldTick size={14} color="currentColor" variant="Bulk" />}>
                      Sécurité
                    </SectionLabel>
                    <FormField
                      control={form.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs font-medium">Nouveau mot de passe</FormLabel>
                          <FormControl>
                            <IconInput
                              icon={<Lock size={16} color="currentColor" />}
                              trailing={
                                <button
                                  type="button"
                                  onClick={() => setShowPassword((v) => !v)}
                                  className="p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
                                  aria-label={showPassword ? "Masquer" : "Afficher"}
                                >
                                  {showPassword ? (
                                    <EyeSlash size={16} color="currentColor" />
                                  ) : (
                                    <Eye size={16} color="currentColor" />
                                  )}
                                </button>
                              }
                            >
                              <Input
                                type={showPassword ? "text" : "password"}
                                placeholder="••••••••"
                                className="pl-10 pr-12 h-10 rounded-lg"
                                {...field}
                              />
                            </IconInput>
                          </FormControl>
                          <p className="text-[11px] text-muted-foreground">
                            Laissez vide pour conserver le mot de passe actuel.
                          </p>
                          <FormMessage className="text-xs" />
                        </FormItem>
                      )}
                    />
                  </section>
                </TabsContent>

                {/* ENTREPRISE TAB */}
                <TabsContent value="entreprise" className="mt-0 space-y-6 focus-visible:outline-none">
                  {/* Identité entreprise */}
                  <section className="space-y-3">
                    <SectionLabel icon={<Shop size={14} color="currentColor" variant="Bulk" />}>
                      Identité entreprise
                    </SectionLabel>
                    <div className="grid gap-3 sm:grid-cols-2">
                      <FormField
                        control={form.control}
                        name="socialRaison"
                        render={({ field }) => (
                          <FormItem className="sm:col-span-2">
                            <FormLabel className="text-xs font-medium">Raison sociale</FormLabel>
                            <FormControl>
                              <IconInput icon={<Building size={16} color="currentColor" />}>
                                <Input className="pl-10 h-10 rounded-lg" {...field} />
                              </IconInput>
                            </FormControl>
                            <FormMessage className="text-xs" />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="activityDomain"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-xs font-medium">Domaine d'activité</FormLabel>
                            <FormControl>
                              <IconInput icon={<Briefcase size={16} color="currentColor" />}>
                                <Input className="pl-10 h-10 rounded-lg" {...field} />
                              </IconInput>
                            </FormControl>
                            <FormMessage className="text-xs" />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="contribuableNumber"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-xs font-medium">N° contribuable</FormLabel>
                            <FormControl>
                              <IconInput icon={<Personalcard size={16} color="currentColor" />}>
                                <Input className="pl-10 h-10 rounded-lg" {...field} />
                              </IconInput>
                            </FormControl>
                            <FormMessage className="text-xs" />
                          </FormItem>
                        )}
                      />
                    </div>
                  </section>

                  <Separator />

                  {/* SMS */}
                  <section className="space-y-3">
                    <SectionLabel icon={<Sms size={14} color="currentColor" variant="Bulk" />}>
                      Configuration SMS
                    </SectionLabel>
                    <FormField
                      control={form.control}
                      name="smsSenderId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs font-medium">
                            Sender ID
                            <span className="ml-1.5 text-[10px] font-normal text-muted-foreground">
                              (max 11 caractères)
                            </span>
                          </FormLabel>
                          <FormControl>
                            <IconInput icon={<Sms size={16} color="currentColor" />}>
                              <Input
                                maxLength={11}
                                placeholder="MBOASMS"
                                className="pl-10 h-10 rounded-lg font-mono uppercase"
                                {...field}
                              />
                            </IconInput>
                          </FormControl>
                          <FormMessage className="text-xs" />
                        </FormItem>
                      )}
                    />
                  </section>

                  <Separator />

                  {/* Localisation */}
                  <section className="space-y-3">
                    <SectionLabel icon={<Location size={14} color="currentColor" variant="Bulk" />}>
                      Localisation
                    </SectionLabel>
                    <div className="grid gap-3 sm:grid-cols-2">
                      <FormField
                        control={form.control}
                        name="villeEntreprise"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-xs font-medium">Ville</FormLabel>
                            <FormControl>
                              <IconInput icon={<Location size={16} color="currentColor" />}>
                                <Input className="pl-10 h-10 rounded-lg" {...field} />
                              </IconInput>
                            </FormControl>
                            <FormMessage className="text-xs" />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="pays"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-xs font-medium">
                              Pays
                              <span className="ml-1.5 text-[10px] font-normal text-muted-foreground">(ID)</span>
                            </FormLabel>
                            <FormControl>
                              <IconInput icon={<Global size={16} color="currentColor" />}>
                                <Input className="pl-10 h-10 rounded-lg font-mono text-xs" {...field} />
                              </IconInput>
                            </FormControl>
                            <FormMessage className="text-xs" />
                          </FormItem>
                        )}
                      />
                    </div>
                  </section>
                </TabsContent>
              </div>
            </Tabs>

            {/* Sticky footer */}
            <div className={cn(
              "sticky bottom-0 z-10 flex items-center justify-between gap-3 px-6 py-4",
              "border-t border-border/60 bg-background/80 backdrop-blur-md"
            )}>
              <p className="text-[11px] text-muted-foreground hidden sm:block">
                {tab === "perso" ? "Onglet Personnel" : "Onglet Entreprise"} • Modifications enregistrées sur Enregistrer
              </p>
              <div className="flex gap-2 ml-auto">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => onOpenChange(false)}
                  disabled={updateMutation.isPending}
                  className="rounded-lg"
                >
                  Annuler
                </Button>
                <Button
                  type="submit"
                  disabled={updateMutation.isPending}
                  className="rounded-lg bg-primary text-white font-semibold shadow-md shadow-primary/25 hover:shadow-lg hover:shadow-primary/30 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
                >
                  {updateMutation.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Enregistrement...
                    </>
                  ) : (
                    <>
                      <Profile2User size={16} color="currentColor" variant="Bulk" className="mr-2" />
                      Enregistrer
                    </>
                  )}
                </Button>
              </div>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
