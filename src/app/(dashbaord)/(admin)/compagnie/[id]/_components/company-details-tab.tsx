"use client"

import { useT } from "@/core/hooks"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/ui/card"
import { Skeleton } from "@/shared/ui/skeleton"
import { Buildings2, Call, Code, DocumentText, Link2, Location, Sms } from "iconsax-react"
import type { EnterpriseType } from "@/core/models/company"

interface CompanyDetailsTabProps {
  enterprise?: EnterpriseType
  isLoading: boolean
}

export function CompanyDetailsTab({ enterprise, isLoading }: CompanyDetailsTabProps) {
  const { t } = useT()

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
              {t("companies.companyInfoTitle")}
            </CardTitle>
            <CardDescription>{t("companies.companyInfoDesc")}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="rounded-lg border border-dashed p-4 space-y-3">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <Buildings2 className="h-4 w-4 text-primary" variant="Bulk" color="currentColor" />
                    <p className="font-semibold">{t("companies.identitySection")}</p>
                  </div>
                  <p className="text-sm text-muted-foreground">{t("companies.identitySectionDesc")}</p>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                    <Buildings2 className="h-4 w-4" variant="Bulk" color="currentColor" />
                    {t("companies.socialReason")}
                  </label>
                  <p className="mt-2 text-base font-medium">{enterprise?.socialRaison}</p>
                </div>

                <div>
                  <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                    <Code className="h-4 w-4" variant="Bulk" color="currentColor" />
                    {t("companies.commerceNumber")}
                  </label>
                  <p className="mt-2 text-base font-medium">{enterprise?.numeroCommerce}</p>
                </div>

                <div>
                  <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                    <DocumentText className="h-4 w-4" variant="Bulk" color="currentColor" />
                    {t("companies.activityDomain")}
                  </label>
                  <p className="mt-2 text-base font-medium">{enterprise?.activityDomain || "—"}</p>
                </div>
              </div>
            </div>

            <div className="rounded-lg border border-dashed p-4 space-y-3">
              <div>
                <div className="flex items-center gap-2">
                  <Call className="h-4 w-4 text-primary" variant="Bulk" color="currentColor" />
                  <p className="font-semibold">{t("companies.contactsSection")}</p>
                </div>
                <p className="text-sm text-muted-foreground">{t("companies.contactsSectionDesc")}</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                    <Sms className="h-4 w-4" variant="Bulk" color="currentColor" />
                    {t("companies.email")}
                  </label>
                  <p className="mt-2 text-base font-medium">{enterprise?.emailEnterprise || "—"}</p>
                </div>

                <div>
                  <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                    <Call className="h-4 w-4" variant="Bulk" color="currentColor" />
                    {t("companies.phone")}
                  </label>
                  <p className="mt-2 text-base font-medium">{enterprise?.telephoneEnterprise || "—"}</p>
                </div>

                <div>
                  <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                    <Location className="h-4 w-4" variant="Bulk" color="currentColor" />
                    {t("companies.city")}
                  </label>
                  <p className="mt-2 text-base font-medium">{enterprise?.villeEnterprise || "—"}</p>
                </div>

                <div>
                  <label className="text-sm font-medium text-muted-foreground">{t("common.address")}</label>
                  <p className="mt-2 text-base font-medium">{enterprise?.adresseEnterprise || "—"}</p>
                </div>
              </div>
            </div>

            <div className="rounded-lg border border-dashed p-4 space-y-3">
              <div>
                <div className="flex items-center gap-2">
                  <Link2 className="h-4 w-4 text-primary" variant="Bulk" color="currentColor" />
                  <p className="font-semibold">{t("companies.presenceSection")}</p>
                </div>
                <p className="text-sm text-muted-foreground">{t("companies.presenceSectionDesc")}</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                    <Link2 className="h-4 w-4" variant="Bulk" color="currentColor" />
                    {t("companies.website")}
                  </label>
                  <p className="mt-2 text-base font-medium">{enterprise?.urlSiteweb || "—"}</p>
                </div>

                <div>
                  <label className="text-sm font-medium text-muted-foreground">{t("companies.senderId")}</label>
                  <p className="mt-2 text-base font-medium">{(enterprise as any)?.smsESenderId || "—"}</p>
                </div>

                <div>
                  <label className="text-sm font-medium text-muted-foreground">{t("companies.taxpayerNumber")}</label>
                  <p className="mt-2 text-base font-medium">{enterprise?.contribuableNumber || "—"}</p>
                </div>
              </div>
            </div>

            <div className="rounded-lg border border-dashed p-4 space-y-3">
              <div>
                <div className="flex items-center gap-2">
                  <Code className="h-4 w-4 text-primary" variant="Bulk" color="currentColor" />
                  <p className="font-semibold">{t("companies.systemSection")}</p>
                </div>
                <p className="text-sm text-muted-foreground">{t("companies.systemSectionDesc")}</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">{t("companies.createdAtLabel")}</label>
                  <p className="mt-2 text-base font-medium">
                    {(enterprise as any)?.createdAt
                      ? new Date((enterprise as any).createdAt).toLocaleString("fr-FR")
                      : "—"}
                  </p>
                </div>

                <div>
                  <label className="text-sm font-medium text-muted-foreground">{t("companies.updatedAtLabel")}</label>
                  <p className="mt-2 text-base font-medium">
                    {(enterprise as any)?.updatedAt
                      ? new Date((enterprise as any).updatedAt).toLocaleString("fr-FR")
                      : "—"}
                  </p>
                </div>

                <div>
                  <label className="text-sm font-medium text-muted-foreground">{t("companies.archivedLabel")}</label>
                  <p className="mt-2 text-base font-medium">
                    {typeof (enterprise as any)?.archived === "boolean"
                      ? (enterprise as any).archived
                        ? t("common.yes")
                        : t("common.no")
                      : "—"}
                  </p>
                </div>

                <div>
                  <label className="text-sm font-medium text-muted-foreground">{t("companies.versionLabel")}</label>
                  <p className="mt-2 text-base font-medium">{(enterprise as any)?.version ?? "—"}</p>
                </div>

                <div>
                  <label className="text-sm font-medium text-muted-foreground">{t("companies.statusCodeLabel")}</label>
                  <p className="mt-2 text-base font-medium">{(enterprise as any)?.statusCode ?? "—"}</p>
                </div>

                <div>
                  <label className="text-sm font-medium text-muted-foreground">{t("companies.imageUrlLabel")}</label>
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
