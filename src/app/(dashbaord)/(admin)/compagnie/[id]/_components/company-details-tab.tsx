"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/ui/card"
import { Skeleton } from "@/shared/ui/skeleton"
import { Buildings2, Call, Code, DocumentText, Link2, Location, Sms } from "iconsax-react"
import type { EnterpriseType } from "@/core/models/company"

interface CompanyDetailsTabProps {
  enterprise?: EnterpriseType
  isLoading: boolean
}

export function CompanyDetailsTab({ enterprise, isLoading }: CompanyDetailsTabProps) {
  return (
    <>
      {isLoading ? (
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-32" />
          </CardHeader>
          <CardContent className="space-y-4">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Buildings2 className="h-5 w-5 text-primary" variant="Bulk" color="currentColor" />
              Informations de l'entreprise
            </CardTitle>
            <CardDescription>Identité, coordonnées, activité et informations système.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="rounded-lg border border-dashed p-4 space-y-3">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <Buildings2 className="h-4 w-4 text-primary" variant="Bulk" color="currentColor" />
                    <p className="font-semibold">Identité</p>
                  </div>
                  <p className="text-sm text-muted-foreground">Informations générales sur l'entreprise.</p>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                    <Buildings2 className="h-4 w-4" variant="Bulk" color="currentColor" />
                    Raison sociale
                  </label>
                  <p className="mt-2 text-base font-medium">{enterprise?.socialRaison}</p>
                </div>

                <div>
                  <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                    <Code className="h-4 w-4" variant="Bulk" color="currentColor" />
                    Numéro de commerce
                  </label>
                  <p className="mt-2 text-base font-medium">{enterprise?.numeroCommerce}</p>
                </div>

                <div>
                  <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                    <DocumentText className="h-4 w-4" variant="Bulk" color="currentColor" />
                    Domaine d'activité
                  </label>
                  <p className="mt-2 text-base font-medium">{enterprise?.activityDomain || "—"}</p>
                </div>
              </div>
            </div>

            <div className="rounded-lg border border-dashed p-4 space-y-3">
              <div>
                <div className="flex items-center gap-2">
                  <Call className="h-4 w-4 text-primary" variant="Bulk" color="currentColor" />
                  <p className="font-semibold">Coordonnées</p>
                </div>
                <p className="text-sm text-muted-foreground">Contacts et localisation.</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                    <Sms className="h-4 w-4" variant="Bulk" color="currentColor" />
                    Email
                  </label>
                  <p className="mt-2 text-base font-medium">{enterprise?.emailEnterprise || "—"}</p>
                </div>

                <div>
                  <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                    <Call className="h-4 w-4" variant="Bulk" color="currentColor" />
                    Téléphone
                  </label>
                  <p className="mt-2 text-base font-medium">{enterprise?.telephoneEnterprise || "—"}</p>
                </div>

                <div>
                  <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                    <Location className="h-4 w-4" variant="Bulk" color="currentColor" />
                    Ville
                  </label>
                  <p className="mt-2 text-base font-medium">{enterprise?.villeEnterprise || "—"}</p>
                </div>

                <div>
                  <label className="text-sm font-medium text-muted-foreground">Adresse</label>
                  <p className="mt-2 text-base font-medium">{enterprise?.adresseEnterprise || "—"}</p>
                </div>
              </div>
            </div>

            <div className="rounded-lg border border-dashed p-4 space-y-3">
              <div>
                <div className="flex items-center gap-2">
                  <Link2 className="h-4 w-4 text-primary" variant="Bulk" color="currentColor" />
                  <p className="font-semibold">Présence & SMS</p>
                </div>
                <p className="text-sm text-muted-foreground">Site web et identifiants SMS.</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                    <Link2 className="h-4 w-4" variant="Bulk" color="currentColor" />
                    Site web
                  </label>
                  <p className="mt-2 text-base font-medium">{enterprise?.urlSiteweb || "—"}</p>
                </div>

                <div>
                  <label className="text-sm font-medium text-muted-foreground">Sender ID</label>
                  <p className="mt-2 text-base font-medium">{(enterprise as any)?.smsESenderId || "—"}</p>
                </div>

                <div>
                  <label className="text-sm font-medium text-muted-foreground">Numéro contribuable</label>
                  <p className="mt-2 text-base font-medium">{enterprise?.contribuableNumber || "—"}</p>
                </div>
              </div>
            </div>

            <div className="rounded-lg border border-dashed p-4 space-y-3">
              <div>
                <div className="flex items-center gap-2">
                  <Code className="h-4 w-4 text-primary" variant="Bulk" color="currentColor" />
                  <p className="font-semibold">Système</p>
                </div>
                <p className="text-sm text-muted-foreground">Métadonnées techniques et suivi.</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Créé le</label>
                  <p className="mt-2 text-base font-medium">
                    {(enterprise as any)?.createdAt
                      ? new Date((enterprise as any).createdAt).toLocaleString("fr-FR")
                      : "—"}
                  </p>
                </div>

                <div>
                  <label className="text-sm font-medium text-muted-foreground">Mis à jour le</label>
                  <p className="mt-2 text-base font-medium">
                    {(enterprise as any)?.updatedAt
                      ? new Date((enterprise as any).updatedAt).toLocaleString("fr-FR")
                      : "—"}
                  </p>
                </div>

                <div>
                  <label className="text-sm font-medium text-muted-foreground">Archivé</label>
                  <p className="mt-2 text-base font-medium">
                    {typeof (enterprise as any)?.archived === "boolean"
                      ? (enterprise as any).archived
                        ? "Oui"
                        : "Non"
                      : "—"}
                  </p>
                </div>

                <div>
                  <label className="text-sm font-medium text-muted-foreground">Version</label>
                  <p className="mt-2 text-base font-medium">{(enterprise as any)?.version ?? "—"}</p>
                </div>

                <div>
                  <label className="text-sm font-medium text-muted-foreground">Status Code</label>
                  <p className="mt-2 text-base font-medium">{(enterprise as any)?.statusCode ?? "—"}</p>
                </div>

                <div>
                  <label className="text-sm font-medium text-muted-foreground">URL Image</label>
                  <p className="mt-2 text-base font-medium break-all">{(enterprise as any)?.urlImage || "—"}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </>
  )
}
