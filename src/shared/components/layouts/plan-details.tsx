'use client'

import { Button } from '@/shared/ui/button'
import { Card, CardContent } from '@/shared/ui/card'
import { useSidebar } from '@/shared/ui/sidebar'
import { useUserStore } from '@/core/stores/userStore'
import Link from 'next/link'

export function PlanDetails() {
  const { state } = useSidebar()
  const { user } = useUserStore()

  if (!user || state === 'collapsed') {
    return null
  }

  const smsBalance = typeof user.smsBalance === 'number' ? user.smsBalance : 0
  const smsQuota = user.smsQuota ?? 100000
  const planName = user.planName ?? 'Plan Business'
  const usagePercent = smsQuota > 0 ? Math.max(0, Math.min(100, 100 - (smsBalance / smsQuota) * 100)) : 100

  return (
    <div className="px-2 pb-2">
      <Card className="bg-gradient-to-br from-purple-600 to-purple-800 border-none text-white">
        <CardContent className="p-4 space-y-3">
          <div className="space-y-1">
            <p className="text-xs text-purple-200">Détails du forfait</p>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Forfait courant</span>
              <span className="text-sm font-bold">{planName}</span>
            </div>
          </div>

          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">SMS restant</span>
              <span className="text-sm font-bold">
                {smsBalance.toLocaleString()} / {smsQuota.toLocaleString()}
              </span>
            </div>
            <div className="w-full bg-purple-900/50 rounded-full h-2">
              <div
                className="bg-white rounded-full h-2 transition-all duration-300"
                style={{
                  width: `${Math.min(100, (smsBalance / smsQuota) * 100)}%`,
                }}
              />
            </div>
          </div>

          <div className="pt-1">
            <p className="text-xs text-purple-200 mb-2">{Math.round(usagePercent)}% consommés</p>
            <Button
              asChild
              className="w-full bg-white text-purple-700 hover:bg-purple-50 font-semibold"
              size="sm"
            >
              <Link href="/recharge">Recharger maintenant</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
