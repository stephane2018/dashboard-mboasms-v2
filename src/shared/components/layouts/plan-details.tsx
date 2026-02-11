'use client'

import { Button } from '@/shared/ui/button'
import { Card, CardContent } from '@/shared/ui/card'
import { useSidebar } from '@/shared/ui/sidebar'
import { useUserStore } from '@/core/stores/userStore'
import { UseGetConnectedCompagnieData, useRecharge } from '@/core/hooks'
import { useState } from 'react'
import { CreateRechargeModal, type RechargeFormData } from '@/shared/common/create-recharge-modal'
import { createRecharge } from '@/core/services/recharge.service'
import { toast } from 'sonner'

export function PlanDetails() {
  const { state } = useSidebar()
  const { user } = useUserStore()
  const [isRechargeModalOpen, setIsRechargeModalOpen] = useState(false)

  // Get enterprise data to fetch smsCredit - hooks must be called before any conditional returns
  const { data: enterprise, refetch: refetchEnterprise } = UseGetConnectedCompagnieData(user?.id || "")
  const { rechargesQuery } = useRecharge()

  if (!user || state === 'collapsed') {
    return null
  }
  
  // Get enterprise recharges to find the most recent one
  const recharges = rechargesQuery?.data ?? []
  
  // Find the most recent validated recharge
  const mostRecentRecharge = recharges?.filter(r => r.status === 'VALIDE')
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())[0]

  // Use enterprise smsCredit instead of user smsBalance
  const smsBalance = enterprise?.smsCredit ?? 0
  const smsQuota = mostRecentRecharge?.qteMessage ?? 0
  const planName = user.planName ?? 'Plan Business'
  const usagePercent = smsQuota > 0 ? Math.max(0, Math.min(100, 100 - (smsBalance / smsQuota) * 100)) : 100
  
  // Determine low balance warning level
  const getLowBalanceWarning = () => {
    if (smsBalance <= 5) {
      return {
        level: 'critical',
        message: 'Solde critique ! Il ne vous reste que quelques SMS.',
        color: 'text-red-700 dark:text-red-400'
      }
    } else if (smsBalance <= 10) {
      return {
        level: 'warning',
        message: 'Solde très faible. Pensez à recharger votre compte.',
        color: 'text-amber-700 dark:text-amber-400'
      }
    } else if (smsBalance <= 20) {
      return {
        level: 'info',
        message: 'Solde faible. Une recharge est recommandée.',
        color: 'text-blue-700 dark:text-blue-400'
      }
    }
    return null
  }
  
  const lowBalanceWarning = getLowBalanceWarning()
  
  // Handle recharge submission
  const handleRecharge = async (data: RechargeFormData) => {
    if (!user?.companyId) {
      toast.error('Erreur', {
        description: 'Impossible de créer la recharge. ID entreprise manquant.'
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
      toast.success('Demande de recharge créée avec succès')
      setIsRechargeModalOpen(false)
      // Refetch enterprise data to update balance
      refetchEnterprise()
    } catch (error) {
      toast.error('Erreur lors de la création de la recharge')
    }
  }

  return (
    <div className="px-1 pb-1 border-t border-t-accent pt-2">
      <Card className="bg-gradient-to-br from-purple-600 to-purple-800 border-none text-white">
        <CardContent className="p-2 space-y-2">
          <div className="space-y-1">
            <p className="text-[10px] text-purple-200">Forfait</p>
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
                  width: `${Math.min(100, (smsBalance / smsQuota) * 100)}%`,
                }}
              />
            </div>
          </div>

          <div className="pt-1">
            <p className="text-[10px] text-purple-200 mb-1">{Math.round(usagePercent)}% utilisé</p>
            <Button
              onClick={() => setIsRechargeModalOpen(true)}
              className="w-full bg-white text-purple-700 hover:bg-purple-50 font-semibold text-xs"
              size="sm"
            >
              Recharger
            </Button>
          </div>
        </CardContent>
      </Card>
      
      {/* Recharge Modal */}
      <CreateRechargeModal
        isOpen={isRechargeModalOpen}
        onClose={() => setIsRechargeModalOpen(false)}
        onSubmit={handleRecharge}
        isLoading={false}
      />
    </div>
  )
}
