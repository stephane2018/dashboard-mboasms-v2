"use client"

import { useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { useEnterpriseDetails } from "@/core/hooks/useCompany"
import { useMessageHistory } from "@/core/hooks/useMessage"
import { useGroups } from "@/core/hooks/useGroups"
import { useCreditEnterprise } from "@/core/hooks/useCompany"
import { useT } from "@/core/hooks"
import { Button } from "@/shared/ui/button"
import { Badge } from "@/shared/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/ui/card"
import { Skeleton } from "@/shared/ui/skeleton"
import { ArrowLeft2, Login, Sms, Call, Location, Buildings2, Code, Link2, DocumentText, People, User, Wallet } from "iconsax-react"
import { MessageHistoryTab } from "./_components/message-history-tab"
import { GroupsTab } from "./_components/groups-tab"
import { UsersTab } from "./_components/users-tab"
import { CreditModal } from "../_components/credit-modal"
import { MessagesAreaChart } from "./_components/messages-area-chart"
import { CreditRadialChart } from "./_components/credit-radial-chart"
import { CompanyDetailsTab } from "./_components/company-details-tab"


export default function CompanyDetailsPage() {
  const params = useParams()
  const router = useRouter()
  const { t } = useT()
  const enterpriseId = params.id as string
  const [activeTab, setActiveTab] = useState("details")
  const [isCreditModalOpen, setIsCreditModalOpen] = useState(false)

  const { data: enterprise, isLoading, error } = useEnterpriseDetails(enterpriseId)
  const { data: historyPage, isLoading: isHistoryLoading } = useMessageHistory(enterpriseId, 0, 200, !!enterpriseId)
  const { groups, isLoading: isGroupsLoading } = useGroups({ enterpriseId })
  const { mutate: creditEnterprise, isPending: isCrediting } = useCreditEnterprise()

  const now = new Date()
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1)
  const nextMonthStart = new Date(now.getFullYear(), now.getMonth() + 1, 1)

  const messagesThisMonth = historyPage?.content
    ? historyPage.content.filter((m: any) => {
        const createdAt = m?.createdAt ? new Date(m.createdAt) : null
        if (!createdAt || Number.isNaN(createdAt.getTime())) return false
        return createdAt >= monthStart && createdAt < nextMonthStart
      }).length
    : 0

  const groupsCount = groups?.length ?? 0
  const usersCount = enterprise?.user?.length ?? 0

  const handleCreditSubmit = (payload: { qteMessage: number }) => {
    if (!enterpriseId) return
    creditEnterprise(
      { enterpriseId, payload },
      {
        onSuccess: () => {
          setIsCreditModalOpen(false)
        },
      }
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-red-600">{t('common.error')}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              {t('companyDetails.loadError')}
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6 pb-10">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-start gap-3">
          <Button
            type="button"
            variant="ghost"
            className="h-9 px-2 gap-2"
            onClick={() => router.back()}
            aria-label={t('common.back')}
          >
            <ArrowLeft2 className="h-5 w-5" variant="Bulk" color="currentColor" />
            <span className="text-sm font-medium">
              {t('common.back')}
              {enterprise?.socialRaison ? ` • ${enterprise.socialRaison}` : ""}
            </span>
          </Button>

          <div>
          <h1 className="text-3xl font-bold tracking-tight">
            {isLoading ? <Skeleton className="h-8 w-48" /> : enterprise?.socialRaison}
          </h1>
          <div className="text-muted-foreground mt-1">
            {isLoading ? <Skeleton className="h-4 w-64" /> : `ID: ${enterprise?.id}`}
          </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            className="flex items-center gap-2"
            size="lg"
            onClick={() => setIsCreditModalOpen(true)}
            disabled={isLoading}
          >
            <Wallet className="h-4 w-4" variant="Bulk" color="currentColor" />
            {t('companyDetails.rechargeCredit')}
          </Button>
          <Button className="flex items-center gap-2" size="lg">
            <Login className="h-4 w-4" variant="Bulk" color="currentColor" />
            {t('companyDetails.loginAs')}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2">
          <MessagesAreaChart history={historyPage?.content || []} />
        </div>
        <div>
          <CreditRadialChart credit={enterprise?.smsCredit ?? 0} />
        </div>
      </div>

      {/* Monthly stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Sms className="h-4 w-4 text-primary" variant="Bulk" color="currentColor" />
                {t('companyDetails.messagesThisMonth')}
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isHistoryLoading ? (
              <Skeleton className="h-7 w-16" />
            ) : (
              <p className="text-2xl font-bold">{messagesThisMonth}</p>
            )}
            <p className="text-xs text-muted-foreground mt-1">{t('companyDetails.basedOnHistory')}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <People className="h-4 w-4 text-primary" variant="Bulk" color="currentColor" />
              {t('groups.title')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isGroupsLoading ? (
              <Skeleton className="h-7 w-16" />
            ) : (
              <p className="text-2xl font-bold">{groupsCount}</p>
            )}
            <p className="text-xs text-muted-foreground mt-1">{t('companyDetails.totalGroups')}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <User className="h-4 w-4 text-primary" variant="Bulk" color="currentColor" />
              {t('companyDetails.users')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-7 w-16" />
            ) : (
              <p className="text-2xl font-bold">{usersCount}</p>
            )}
            <p className="text-xs text-muted-foreground mt-1">{t('companyDetails.totalUsers')}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Wallet className="h-4 w-4 text-primary" variant="Bulk" color="currentColor" />
              {t('companyDetails.smsCredit')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-7 w-20" />
            ) : (
              <p className="text-2xl font-bold">{enterprise?.smsCredit ?? 0}</p>
            )}
            <p className="text-xs text-muted-foreground mt-1">{t('companyDetails.remainingSms')}</p>
          </CardContent>
        </Card>
      </div>


      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-fit grid-cols-4">
          <TabsTrigger value="details" className="gap-2">
            <Buildings2 className="h-4 w-4" variant="Bulk" color="currentColor" />
            {t('companyDetails.tabDetails')}
          </TabsTrigger>
          <TabsTrigger value="historiques" className="gap-2">
            <Sms className="h-4 w-4" variant="Bulk" color="currentColor" />
            {t('companyDetails.tabHistory')}
          </TabsTrigger>
          <TabsTrigger value="groupes" className="gap-2">
            <People className="h-4 w-4" variant="Bulk" color="currentColor" />
            {t('groups.title')}
          </TabsTrigger>
          <TabsTrigger value="utilisateurs" className="gap-2">
            <User className="h-4 w-4" variant="Bulk" color="currentColor" />
            {t('companyDetails.users')}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="details" className="space-y-4">
          <CompanyDetailsTab enterprise={enterprise} isLoading={isLoading} />
        </TabsContent>

        <TabsContent value="historiques">
          <MessageHistoryTab enterpriseId={enterpriseId} />
        </TabsContent>

        <TabsContent value="groupes">
          <GroupsTab enterpriseId={enterpriseId} />
        </TabsContent>

        <TabsContent value="utilisateurs">
          <UsersTab enterprise={enterprise} isLoading={isLoading} />
        </TabsContent>
      </Tabs>

      <CreditModal
        isOpen={isCreditModalOpen}
        onClose={() => setIsCreditModalOpen(false)}
        onSubmit={handleCreditSubmit}
        isSubmitting={isCrediting}
        currentCredit={enterprise?.smsCredit ?? 0}
      />
    </div>
  )
}
