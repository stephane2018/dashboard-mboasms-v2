'use client'

import { Sms, Global, ArrowRight2 } from 'iconsax-react'
import { Button } from '@/shared/ui/button'
import { Popover, PopoverContent, PopoverTrigger } from '@/shared/ui/popover'
import { useUserStore } from '@/core/stores/userStore'
import { UseGetConnectedCompagnieData, useRecharge, useT } from '@/core/hooks'
import Link from 'next/link'

function formatCompact(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`
  if (n >= 1_000) return `${(n / 1_000).toFixed(0)}k`
  return String(n)
}

export function SmsBalancePopover() {
  const { t } = useT()
  const user = useUserStore((s) => s.user)
  const { data: enterprise } = UseGetConnectedCompagnieData(user?.companyId || '', user?.id || '')
  const { rechargesQuery } = useRecharge()

  if (!user) return null

  const smsBalance = typeof enterprise?.smsCredit === 'number' ? enterprise.smsCredit : 0
  const intlBalance = typeof enterprise?.internationalCredit === 'number' ? enterprise.internationalCredit : 0
  const planName = typeof user.planName === 'string' ? user.planName : null

  const recharges = rechargesQuery?.data ?? []
  const mostRecentRecharge = recharges
    .filter((r) => r.status === 'VALIDE')
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())[0]
  const smsQuota = typeof mostRecentRecharge?.qteMessage === 'number' ? mostRecentRecharge.qteMessage : 0
  const usagePercent = smsQuota > 0 ? Math.max(0, Math.min(100, (smsBalance / smsQuota) * 100)) : 0

  const getBarColor = () => {
    if (usagePercent < 20) return 'bg-red-500'
    if (usagePercent < 50) return 'bg-amber-500'
    return 'bg-emerald-500'
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="rounded-full relative"
          aria-label="Solde SMS"
        >
          <Sms size="18" variant="Bulk" color="currentColor" className="text-primary" />
          <span className="absolute -top-1.5 -right-1.5 min-w-[18px] h-[18px] rounded-full bg-primary text-[9px] font-bold text-white flex items-center justify-center px-1 leading-none shadow-sm">
            {formatCompact(smsBalance)}
          </span>
        </Button>
      </PopoverTrigger>

      <PopoverContent align="end" className="w-72 rounded-2xl p-0 overflow-hidden shadow-xl">
        {/* Header gradient */}
        <div className="bg-gradient-to-br from-purple-600 to-purple-800 p-4 text-white">
          <div className="flex items-center justify-between mb-1">
            <p className="text-[10px] text-purple-200 uppercase tracking-wide">{t('layout.planLabel')}</p>
            {planName && (
              <span className="text-[10px] font-semibold bg-white/20 rounded-full px-2 py-0.5">
                {planName}
              </span>
            )}
          </div>

          {/* Local SMS */}
          <div className="space-y-1.5 mt-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium flex items-center gap-1.5">
                <Sms size={12} color="currentColor" />
                {t('layout.national')}
              </span>
              <span className="text-sm font-bold tabular-nums">
                {smsBalance.toLocaleString()}
                {smsQuota > 0 && (
                  <span className="text-purple-300 font-normal text-xs"> / {smsQuota.toLocaleString()}</span>
                )}
              </span>
            </div>
            {smsQuota > 0 && (
              <div className="w-full bg-purple-900/50 rounded-full h-1.5">
                <div
                  className={`${getBarColor()} rounded-full h-1.5 transition-all duration-300`}
                  style={{ width: `${usagePercent}%` }}
                />
              </div>
            )}
            {smsQuota > 0 && (
              <p className="text-[10px] text-purple-300">
                {t('layout.planUsagePercent', { percent: Math.round(usagePercent) })}
              </p>
            )}
          </div>
        </div>

        {/* International SMS */}
        <div className="bg-gradient-to-br from-sky-600 to-indigo-700 px-4 py-3 text-white">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium flex items-center gap-1.5">
              <Global size={12} color="currentColor" />
              {t('layout.international')}
            </span>
            <span className="text-sm font-bold tabular-nums">{intlBalance.toLocaleString()} SMS</span>
          </div>
        </div>

        {/* Actions */}
        <div className="p-3 space-y-2 bg-card">
          <Button
            size="sm"
            className="w-full rounded-xl text-xs font-semibold"
            asChild
          >
            <Link href="/recharge">
              {t('layout.planRecharge')}
            </Link>
          </Button>
          <Link href="/sms-pricing">
            <Button
              variant="ghost"
              size="sm"
              className="w-full rounded-xl text-xs text-muted-foreground gap-1.5"
            >
              {t('layout.planViewPricing')}
              <ArrowRight2 size={12} color="currentColor" />
            </Button>
          </Link>
        </div>
      </PopoverContent>
    </Popover>
  )
}
