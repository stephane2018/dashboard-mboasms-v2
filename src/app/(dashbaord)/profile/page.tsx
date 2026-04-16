"use client"

import { useState } from "react"
import { useAuth } from "@/core/hooks/useAuth"
import { Badge } from "@/shared/ui/badge"
import { Button } from "@/shared/ui/button"
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
  Edit2,
} from "iconsax-react"
import { Mail, MapPin, Globe, Briefcase, Hash } from "lucide-react"
import { Role } from "@/core/config/enum"
import { EditProfileDialog } from "./_components/edit-profile-dialog"

function ProfileSkeleton() {
  return (
    <div className="space-y-6 p-4 md:p-6 max-w-4xl mx-auto">
      <Skeleton className="h-8 w-48" />
      <div className="grid gap-6 md:grid-cols-3">
        <Skeleton className="h-56 rounded-2xl" />
        <Skeleton className="h-56 rounded-2xl md:col-span-2" />
      </div>
      <Skeleton className="h-40 rounded-2xl" />
      <Skeleton className="h-48 rounded-2xl" />
    </div>
  )
}

function roleLabel(role: Role): { label: string; variant: "default" | "secondary" | "destructive" | "outline" } {
  switch (role) {
    case Role.SUPER_ADMIN: return { label: "Super Admin", variant: "destructive" }
    case Role.ADMIN:       return { label: "Admin", variant: "default" }
    case Role.ADMIN_USER:  return { label: "Admin User", variant: "secondary" }
    case Role.USER:        return { label: "Utilisateur", variant: "outline" }
    default:               return { label: role, variant: "outline" }
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

function SmsStatCard({
  label, value, color, icon,
}: { label: string; value: number | null; color: string; icon: React.ReactNode }) {
  return (
    <div className={`rounded-xl p-4 space-y-1 ${color}`}>
      <p className="text-xs text-muted-foreground uppercase tracking-wide flex items-center gap-1.5">
        {icon}
        {label}
      </p>
      <p className="text-2xl font-bold tabular-nums">
        {value !== null ? value.toLocaleString() : "—"}
      </p>
      <p className="text-xs text-muted-foreground">SMS disponibles</p>
    </div>
  )
}

export default function ProfilePage() {
  const { user, enterprise, isLoadingProfile, isLoadingEnterprise } = useAuth()
  const [editOpen, setEditOpen] = useState(false)

  if (isLoadingProfile) return <ProfileSkeleton />
  if (!user) return null

  const userName = typeof user.name === "string" ? user.name : user.email
  const initials = userName.split(" ").map((p) => p[0]).join("").slice(0, 2).toUpperCase()
  const { label: roleLbl, variant: roleVariant } = roleLabel(user.role)

  const smsBalance =
    typeof enterprise?.smsCredit === "number"
      ? enterprise.smsCredit
      : null

  const intlBalance =
    typeof enterprise?.internationalCredit === "number"
      ? enterprise.internationalCredit : null

  // TODO migration: planName no longer on user — needs mapping from enterprise/plan source
  const planName: string | null = null

  return (
    <div className="space-y-6 p-4 md:p-6 max-w-4xl mx-auto">
      {/* Page header */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Mon profil</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Vos informations personnelles et paramètres de compte
          </p>
        </div>
        <Button onClick={() => setEditOpen(true)} className="gap-2">
          <Edit2 size={16} color="currentColor" variant="Bulk" />
          Modifier
        </Button>
      </div>

      {/* Avatar + Personal info */}
      <div className="grid gap-6 md:grid-cols-3">
        <Card className="rounded-2xl border-border/50">
          <CardContent className="flex flex-col items-center justify-center gap-4 pt-8 pb-6">
            <Avatar className="h-20 w-20 ring-2 ring-border">
              <AvatarImage src={enterprise?.urlImage || user.avatar} alt={userName} />
              <AvatarFallback className="text-xl font-bold">{initials}</AvatarFallback>
            </Avatar>
            <div className="text-center space-y-1">
              <p className="font-semibold text-foreground">{userName}</p>
              <p className="text-xs text-muted-foreground">{user.email}</p>
            </div>
            <Badge variant={roleVariant}>{roleLbl}</Badge>
            {planName && (
              <span className="text-[11px] font-medium bg-primary/10 text-primary rounded-full px-3 py-1">
                {planName}
              </span>
            )}
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-border/50 md:col-span-2">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <User size={16} color="currentColor" variant="Bulk" className="text-primary" />
              Informations personnelles
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <InfoRow icon={<Mail size={15} />} label="Email" value={user.email} />
            <InfoRow icon={<Call size={15} color="currentColor" />} label="Téléphone" value={enterprise?.telephoneEnterprise} />
            <InfoRow icon={<Hash size={15} />} label="Identifiant" value={user.id} />
            {/* TODO migration: smsSenderId / isSenderIdVerified no longer on user — need to load from senderIds query */}
            {false && (
              <>
                <Separator />
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 text-muted-foreground shrink-0">
                    <Sms size={15} color="currentColor" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Sender ID</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <p className="text-sm font-semibold font-mono text-foreground">{""}</p>
                      {false ? (
                        <span className="flex items-center gap-1 text-xs text-emerald-600 dark:text-emerald-400">
                          <Verify size={13} color="currentColor" variant="Bulk" className="text-emerald-500" />
                          Vérifié
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 text-xs text-amber-600 dark:text-amber-400">
                          <CloseCircle size={13} color="currentColor" variant="Bulk" className="text-amber-500" />
                          Non vérifié
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      {/* SMS balances */}
      <Card className="rounded-2xl border-border/50">
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Sms size={16} color="currentColor" variant="Bulk" className="text-primary" />
            Solde SMS
            {isLoadingEnterprise && <Skeleton className="h-4 w-16 ml-1" />}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2">
            <SmsStatCard
              label="National"
              value={smsBalance}
              color="bg-purple-50 dark:bg-purple-500/10 text-purple-700 dark:text-purple-300"
              icon={<Sms size={12} color="currentColor" />}
            />
            <SmsStatCard
              label="International"
              value={intlBalance}
              color="bg-sky-50 dark:bg-sky-500/10 text-sky-700 dark:text-sky-300"
              icon={<Global size={12} color="currentColor" />}
            />
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
          {isLoadingEnterprise && (
            <CardContent>
              <div className="grid gap-4 sm:grid-cols-2">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="space-y-1.5">
                    <Skeleton className="h-3 w-20" />
                    <Skeleton className="h-4 w-40" />
                  </div>
                ))}
              </div>
            </CardContent>
          )}
          {!isLoadingEnterprise && enterprise && (
            <CardContent>
              <div className="grid gap-4 sm:grid-cols-2">
                <InfoRow
                  icon={<Building size={15} color="currentColor" />}
                  label="Raison sociale"
                  value={typeof enterprise.socialRaison === "string" ? enterprise.socialRaison : null}
                />
                <InfoRow
                  icon={<Mail size={15} />}
                  label="Email entreprise"
                  value={typeof enterprise.emailEnterprise === "string" ? enterprise.emailEnterprise : null}
                />
                <InfoRow
                  icon={<Call size={15} color="currentColor" />}
                  label="Téléphone"
                  value={typeof enterprise.telephoneEnterprise === "string" ? enterprise.telephoneEnterprise : null}
                />
                <InfoRow
                  icon={<MapPin size={15} />}
                  label="Ville"
                  value={typeof enterprise.villeEnterprise === "string" ? enterprise.villeEnterprise : null}
                />
                <InfoRow
                  icon={<MapPin size={15} />}
                  label="Adresse"
                  value={typeof enterprise.adresseEnterprise === "string" ? enterprise.adresseEnterprise : null}
                />
                <InfoRow
                  icon={<Globe size={15} />}
                  label="Site web"
                  value={typeof enterprise.urlSiteweb === "string" ? enterprise.urlSiteweb : null}
                />
                <InfoRow
                  icon={<Briefcase size={15} />}
                  label="Secteur d'activité"
                  value={typeof enterprise.activityDomain === "string" ? enterprise.activityDomain : null}
                />
              </div>
            </CardContent>
          )}
          {!isLoadingEnterprise && !enterprise && (
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Aucune donnée entreprise disponible.
              </p>
            </CardContent>
          )}
        </Card>
      )}

      <EditProfileDialog
        open={editOpen}
        onOpenChange={setEditOpen}
        user={user}
        enterprise={enterprise}
      />
    </div>
  )
}
