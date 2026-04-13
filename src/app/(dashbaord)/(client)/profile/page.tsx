"use client"

import { useAuthContext } from "@/core/providers/auth-provider"
import { useUserStore } from "@/core/stores/userStore"
import { UseGetConnectedCompagnieData } from "@/core/hooks"
import { Badge } from "@/shared/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card"
import { Separator } from "@/shared/ui/separator"
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/ui/avatar"
import { Skeleton } from "@/shared/ui/skeleton"
import {
  User,
  Sms,
  Building,
  Global,
  Call,
  Verify,
  CloseCircle,
} from "iconsax-react"
import { Mail, MapPin, Globe, Briefcase } from "lucide-react"
import { Role } from "@/core/config/enum"

function ProfileSkeleton() {
  return (
    <div className="space-y-6 p-4 md:p-6 max-w-4xl mx-auto">
      <Skeleton className="h-8 w-48" />
      <div className="grid gap-6 md:grid-cols-3">
        <Skeleton className="h-48 rounded-2xl" />
        <Skeleton className="h-48 rounded-2xl md:col-span-2" />
      </div>
      <Skeleton className="h-40 rounded-2xl" />
    </div>
  )
}

function roleLabel(role: Role): { label: string; variant: "default" | "secondary" | "destructive" | "outline" } {
  switch (role) {
    case Role.SUPER_ADMIN: return { label: "Super Admin", variant: "destructive" }
    case Role.ADMIN: return { label: "Admin", variant: "default" }
    case Role.ADMIN_USER: return { label: "Admin User", variant: "secondary" }
    case Role.USER: return { label: "Utilisateur", variant: "outline" }
    default: return { label: role, variant: "outline" }
  }
}

function InfoRow({ icon, label, value }: { icon: React.ReactNode; label: string; value?: string | null }) {
  if (!value) return null
  return (
    <div className="flex items-start gap-3">
      <div className="mt-0.5 text-muted-foreground shrink-0">{icon}</div>
      <div className="min-w-0">
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="text-sm font-medium text-foreground break-all">{value}</p>
      </div>
    </div>
  )
}

export default function ProfilePage() {
  const { isLoadingProfile } = useAuthContext()
  const user = useUserStore((s) => s.user)
  const { data: enterprise, isLoading: isLoadingEnterprise } = UseGetConnectedCompagnieData(user?.companyId || "", user?.id || "")

  if (isLoadingProfile) return <ProfileSkeleton />
  if (!user) return null

  const userName = typeof user.name === "string" ? user.name : user.email
  const initials = userName.split(" ").map((p) => p[0]).join("").slice(0, 2).toUpperCase()
  const { label: roleLbl, variant: roleVariant } = roleLabel(user.role)

  const smsBalance = typeof enterprise?.smsCredit === "number"
    ? enterprise.smsCredit
    : typeof user.smsBalance === "number" ? user.smsBalance : null

  const intlBalance = typeof enterprise?.internationalCredit === "number"
    ? enterprise.internationalCredit : null

  const planName = typeof user.planName === "string" ? user.planName : null

  const enterpriseName = typeof enterprise?.socialRaison === "string" ? enterprise.socialRaison : null
  const enterpriseEmail = typeof enterprise?.emailEnterprise === "string" ? enterprise.emailEnterprise : null
  const enterprisePhone = typeof enterprise?.telephoneEnterprise === "string" ? enterprise.telephoneEnterprise : null
  const enterpriseCity = typeof enterprise?.villeEnterprise === "string" ? enterprise.villeEnterprise : null
  const enterpriseAddress = typeof enterprise?.adresseEnterprise === "string" ? enterprise.adresseEnterprise : null
  const enterpriseWebsite = typeof enterprise?.urlSiteweb === "string" ? enterprise.urlSiteweb : null
  const enterpriseActivity = typeof enterprise?.activityDomain === "string" ? enterprise.activityDomain : null

  return (
    <div className="space-y-6 p-4 md:p-6 max-w-4xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">Mon profil</h1>
        <p className="text-sm text-muted-foreground mt-0.5">Vos informations personnelles et paramètres de compte</p>
      </div>

      {/* Top section: Avatar card + Personal info */}
      <div className="grid gap-6 md:grid-cols-3">
        {/* Avatar card */}
        <Card className="rounded-2xl border-border/50">
          <CardContent className="flex flex-col items-center justify-center gap-4 pt-8 pb-6">
            <Avatar className="h-20 w-20 ring-2 ring-border">
              <AvatarImage src={user.avatar} alt={userName} />
              <AvatarFallback className="text-xl font-bold">{initials}</AvatarFallback>
            </Avatar>
            <div className="text-center space-y-1">
              <p className="font-semibold text-foreground">{userName}</p>
              <p className="text-xs text-muted-foreground">{user.email}</p>
            </div>
            <Badge variant={roleVariant}>{roleLbl}</Badge>
          </CardContent>
        </Card>

        {/* Personal info */}
        <Card className="rounded-2xl border-border/50 md:col-span-2">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <User size={16} color="currentColor" variant="Bulk" className="text-primary" />
              Informations personnelles
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <InfoRow
              icon={<Mail size={15} />}
              label="Email"
              value={user.email}
            />
            <InfoRow
              icon={<Call size={15} color="currentColor" />}
              label="Téléphone"
              value={user.phone}
            />
            <InfoRow
              icon={<User size={15} color="currentColor" />}
              label="Identifiant"
              value={user.id}
            />
            {planName && (
              <>
                <Separator />
                <InfoRow
                  icon={<Briefcase size={15} />}
                  label="Plan"
                  value={planName}
                />
              </>
            )}
          </CardContent>
        </Card>
      </div>

      {/* SMS section */}
      <Card className="rounded-2xl border-border/50">
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Sms size={16} color="currentColor" variant="Bulk" className="text-primary" />
            Informations SMS
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-3">
            {/* National balance */}
            <div className="rounded-xl bg-purple-50 dark:bg-purple-500/10 p-4 space-y-1">
              <p className="text-xs text-muted-foreground uppercase tracking-wide">Solde national</p>
              <p className="text-2xl font-bold text-purple-600 dark:text-purple-400 tabular-nums">
                {smsBalance !== null ? smsBalance.toLocaleString() : "—"}
              </p>
              <p className="text-xs text-muted-foreground">SMS disponibles</p>
            </div>

            {/* International balance */}
            <div className="rounded-xl bg-sky-50 dark:bg-sky-500/10 p-4 space-y-1">
              <p className="text-xs text-muted-foreground uppercase tracking-wide flex items-center gap-1">
                <Global size={12} color="currentColor" /> International
              </p>
              <p className="text-2xl font-bold text-sky-600 dark:text-sky-400 tabular-nums">
                {intlBalance !== null ? intlBalance.toLocaleString() : "—"}
              </p>
              <p className="text-xs text-muted-foreground">SMS disponibles</p>
            </div>

            {/* Sender ID */}
            <div className="rounded-xl bg-muted/40 p-4 space-y-2">
              <p className="text-xs text-muted-foreground uppercase tracking-wide">Sender ID</p>
              {user.smsSenderId ? (
                <>
                  <p className="text-lg font-bold text-foreground font-mono">{user.smsSenderId}</p>
                  <div className="flex items-center gap-1.5">
                    {user.isSenderIdVerified ? (
                      <>
                        <Verify size={14} color="currentColor" className="text-emerald-500" variant="Bulk" />
                        <span className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">Vérifié</span>
                      </>
                    ) : (
                      <>
                        <CloseCircle size={14} color="currentColor" className="text-amber-500" variant="Bulk" />
                        <span className="text-xs text-amber-600 dark:text-amber-400 font-medium">Non vérifié</span>
                      </>
                    )}
                  </div>
                </>
              ) : (
                <p className="text-sm text-muted-foreground">Aucun sender ID configuré</p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Enterprise section */}
      {user.companyId && (
        <Card className="rounded-2xl border-border/50">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Building size={16} color="currentColor" variant="Bulk" className="text-primary" />
              Entreprise
              {isLoadingEnterprise && <Skeleton className="h-4 w-24 ml-2" />}
            </CardTitle>
          </CardHeader>
          {!isLoadingEnterprise && enterprise && (
            <CardContent>
              <div className="grid gap-4 sm:grid-cols-2">
                <InfoRow icon={<Building size={15} color="currentColor" />} label="Raison sociale" value={enterpriseName} />
                <InfoRow icon={<Mail size={15} />} label="Email entreprise" value={enterpriseEmail} />
                <InfoRow icon={<Call size={15} color="currentColor" />} label="Téléphone entreprise" value={enterprisePhone} />
                <InfoRow icon={<MapPin size={15} />} label="Ville" value={enterpriseCity} />
                <InfoRow icon={<MapPin size={15} />} label="Adresse" value={enterpriseAddress} />
                <InfoRow icon={<Globe size={15} />} label="Site web" value={enterpriseWebsite} />
                <InfoRow icon={<Briefcase size={15} />} label="Secteur d'activité" value={enterpriseActivity} />
              </div>
            </CardContent>
          )}
        </Card>
      )}
    </div>
  )
}
