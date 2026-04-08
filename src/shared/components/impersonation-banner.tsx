'use client'

import { useUserStore } from '@/core/stores/userStore'
import { useSwitchBack } from '@/core/hooks/useLogin'
import { Button } from '@/shared/ui/button'
import { Alert, AlertDescription } from '@/shared/ui/alert'
import { ArrowLeft } from 'iconsax-react'
import { cn } from '@/lib/utils'
import { useT } from '@/core/hooks'

export function ImpersonationBanner() {
  const { t } = useT()
  const { isImpersonating, originalUser, user } = useUserStore()
  const { switchBack } = useSwitchBack()

  if (!isImpersonating || !originalUser || !user) {
    return null
  }

  return (
    <Alert className="border-amber-200 bg-amber-50 dark:bg-amber-900/20 mb-4">
      <div className="flex items-center justify-between w-full">
        <div className="flex items-center space-x-2">
          <ArrowLeft className="h-4 w-4 text-amber-600" variant="Bulk" color="currentColor" />
          <AlertDescription className="text-sm text-amber-800 dark:text-amber-200">
            <span className="font-medium">{t('layout.impersonationTitle')}</span>{' '}
            {t('layout.connectedAs')}{' '}
            <span className="font-bold">{user.email}</span>
            <br />
            <span className="text-xs">{t('layout.impersonationOriginalUser')}: {originalUser.email}</span>
          </AlertDescription>
        </div>
        <Button
          onClick={switchBack}
          variant="outline"
          size="sm"
          className="ml-4 border-amber-300 text-amber-800 hover:bg-amber-100 dark:border-amber-600 dark:text-amber-200 dark:hover:bg-amber-800/20"
        >
          {t('layout.impersonationSwitchBack', { email: originalUser.email })}
        </Button>
      </div>
    </Alert>
  )
}
