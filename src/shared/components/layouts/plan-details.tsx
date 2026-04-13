'use client'

import Link from 'next/link'
import { Button } from '@/shared/ui/button'
import { Card, CardContent } from '@/shared/ui/card'
import { useSidebar } from '@/shared/ui/sidebar'
import { useUserStore } from '@/core/stores/userStore'
import { useEnterpriseStore } from '@/core/stores/enterpriseStore'
import { UseGetConnectedCompagnieData, useRecharge, useT } from '@/core/hooks'
import { useState } from 'react'
import { CreateRechargeModal, type RechargeFormData } from '@/shared/common/create-recharge-modal'
import { createRecharge } from '@/core/services/recharge.service'
import { toast } from 'sonner'
import { Global, ArrowRight2 } from 'iconsax-react'

export function PlanDetails() {
  const { t } = useT()
  const { state } = useSidebar()
  const { user } = useUserStore()
  const [isRechargeModalOpen, setIsRechargeModalOpen] = useState(false)

  const enterpriseFromStore = useEnterpriseStore((s) => s.enterprise)
  const { data: enterpriseFromApi, refetch: refetchEnterprise } = UseGetConnectedCompagnieData(user?.companyId || "", user?.id || "")
  const { rechargesQuery } = useRecharge()

  if (!user || state === 'collapsed') {
    return null
  }

  // Prefer API data (fresh) but fall back to store (set at login) for credit fields
  const enterprise = enterpriseFromApi ?? enterpriseFromStore

  const recharges = rechargesQuery?.data ?? []
  const mostRecentRecharge = recharges?.filter(r => r.status === 'VALIDE')
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())[0]

  const smsBalance = typeof enterprise?.smsCredit === 'number' ? enterprise.smsCredit : 0
  const smsQuota = typeof mostRecentRecharge?.qteMessage === 'number' ? mostRecentRecharge.qteMessage : 0
  const planName = typeof user.planName === 'string' ? user.planName : 'Plan Business'
  const usagePercent = smsQuota > 0 ? Math.max(0, Math.min(100, 100 - (smsBalance / smsQuota) * 100)) : 100

  const internationalBalance = typeof enterprise?.internationalCredit === 'number' ? enterprise.internationalCredit : 0

  const handleRecharge = async (data: RechargeFormData) => {
    if (!user?.companyId) {
      toast.error(t('recharge.createError'), {
        description: t('layout.planRechargeNoCompanyId')
      })
      return
    }

    try {
      await createRecharge({
        qteMessage: data.qteMessage,
        enterpriseId: user.companyId,
        paymentMethod: data.paymentMethod,
        debitPhoneNumber: data.debitPhoneNumber,
        debitBankAccountNumber: data.debitBankAccountNumber,
        couponCode: data.couponCode,
      })
      toast.success(t('recharge.rechargeCreatedDesc'))
      setIsRechargeModalOpen(false)
      refetchEnterprise()
    } catch (error) {
      toast.error(t('recharge.createError'))
    }
  }

  return (
    <div className="px-1 pb-1 border-t border-t-accent pt-2 space-y-2">
      {/* Forfait local */}
      <Card className="bg-gradient-to-br from-purple-600 to-purple-800 border-none text-white">
        <CardContent className="p-2 space-y-2">
          <div className="space-y-1">
            <p className="text-[10px] text-purple-200">{t('layout.planLabel')}</p>
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium">{planName}</span>
            </div>
          </div>

          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium">SMS</span>
              <span className="text-xs font-bold">
                {smsBalance.toLocaleString()} / {smsQuota.toLocaleString()}
              </span>
            </div>
            <div className="w-full bg-purple-900/50 rounded-full h-1">
              <div
                className="bg-white rounded-full h-1 transition-all duration-300"
                style={{
                  width: `${Math.min(100, smsQuota > 0 ? (smsBalance / smsQuota) * 100 : 0)}%`,
                }}
              />
            </div>
          </div>

          <div className="pt-1">
            <p className="text-[10px] text-purple-200 mb-1">{t('layout.planUsagePercent', { percent: Math.round(usagePercent) })}</p>
            <Button
              onClick={() => setIsRechargeModalOpen(true)}
              className="w-full bg-white text-purple-700 hover:bg-purple-50 font-semibold text-xs"
              size="sm"
            >
              {t('layout.planRecharge')}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Forfait international */}
      <Card className="bg-gradient-to-br from-sky-600 to-indigo-700 border-none text-white">
        <CardContent className="p-2 space-y-2">
          <div className="flex items-center gap-1.5">
            <Global size={14} color="currentColor" variant="Bulk" className="text-sky-200" />
            <p className="text-[10px] text-sky-200">{t('layout.planInternational')}</p>
          </div>

          {/* Circular Progress - Solde International */}
          <div className="flex items-center justify-center py-1">
            <div className="relative flex-shrink-0">
              <svg width="56" height="56" viewBox="0 0 56 56">
                <circle
                  cx="28" cy="28" r="23"
                  fill="none"
                  stroke="rgba(255,255,255,0.15)"
                  strokeWidth="4"
                />
                <circle
                  cx="28" cy="28" r="23"
                  fill="none"
                  stroke="white"
                  strokeWidth="4"
                  strokeLinecap="round"
                  strokeDasharray={`${2 * Math.PI * 23}`}
                  strokeDashoffset={`${2 * Math.PI * 23 * (1 - Math.min(1, internationalBalance > 0 ? 1 : 0))}`}
                  transform="rotate(-90 28 28)"
                  className="transition-all duration-500"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-xs font-bold leading-none">{internationalBalance.toLocaleString()}</span>
                <span className="text-[8px] text-sky-200 leading-none mt-0.5">SMS</span>
              </div>
            </div>
          </div>

          <Link href="/sms-pricing">
            <Button
              className="w-full bg-white/15 hover:bg-white/25 text-white font-semibold text-xs gap-1.5 border border-white/20"
              size="sm"
            >
              {t('layout.planViewPricing')}
              <ArrowRight2 size={14} color="currentColor" />
            </Button>
          </Link>
        </CardContent>
      </Card>

      <CreateRechargeModal
        isOpen={isRechargeModalOpen}
        onClose={() => setIsRechargeModalOpen(false)}
        onSubmit={handleRecharge}
        isLoading={false}
      />
    </div>
  )
}
