import { useMutation, useQueryClient } from "@tanstack/react-query"
import { login, loginAsUser, type LoginApiResponse } from "@/core/services/auth.service"
import { toast } from "sonner"
import { i18next } from "@/core/lib/i18n"
import { getDefaultDashboardUrl } from "@/core/utils/role.utils"
import type { LoginCredentials } from "@/core/types/auth.types"
import { useAuthStore, type AuthUser } from "@/core/stores/authStore"
import { Role } from "@/core/config/enum"

function mapResponseToAuthUser(response: LoginApiResponse): AuthUser {
  const rawName = typeof response.name === 'string' ? response.name : null;
  const rawFirst = typeof response.firstName === 'string' ? response.firstName : null;
  const rawLast = typeof response.lastName === 'string' ? response.lastName : null;
  const name = rawName || [rawFirst, rawLast].filter(Boolean).join(' ') || undefined;

  return {
    id: response.id,
    email: response.email,
    role: response.role as Role,
    name,
    avatar: typeof response.avatar === 'string' ? response.avatar : undefined,
    enterpriseId: response.userEnterprise?.id,
  }
}

export function useLogin() {
  const setAuth = useAuthStore((s) => s.setAuth)

  return useMutation<LoginApiResponse, Error, LoginCredentials>({
    mutationFn: (credentials: LoginCredentials) => login(credentials),
    onSuccess: (response) => {
      if (!response.token || !response.refreshToken) {
        toast.error(i18next.t('auth.loginError'), {
          description: 'Tokens manquants dans la réponse',
        })
        return
      }

      setAuth({
        token: response.token,
        refreshToken: response.refreshToken,
        user: mapResponseToAuthUser(response),
      })

      toast.success(i18next.t('auth.loginSuccess'), {
        description: i18next.t('auth.loginWelcome'),
      })

      window.location.href = getDefaultDashboardUrl()
    },
    onError: (error: Error) => {
      toast.error(i18next.t('auth.loginError'), {
        description: error.message || i18next.t('auth.loginErrorDesc'),
      })
    },
  })
}

interface LoginAsResponse {
  id: string
  email: string
  firstName?: string
  lastName?: string
  name?: string
  role: Role
  token: string
  refreshToken: string
  userEnterprise?: { id: string }
}

export function useLoginAs() {
  const startImpersonation = useAuthStore((s) => s.startImpersonation)
  const queryClient = useQueryClient()

  return useMutation<LoginAsResponse, Error, string>({
    mutationFn: (userEmail: string) => loginAsUser(userEmail) as Promise<LoginAsResponse>,
    onSuccess: (data) => {
      if (!data.token || !data.refreshToken) {
        toast.error(i18next.t('auth.loginError'))
        return
      }

      const name = data.name || [data.firstName, data.lastName].filter(Boolean).join(' ') || undefined

      startImpersonation({
        token: data.token,
        refreshToken: data.refreshToken,
        user: {
          id: data.id,
          email: data.email,
          role: data.role as Role,
          name,
          enterpriseId: data.userEnterprise?.id,
        },
      })

      queryClient.clear()

      toast.success(i18next.t('auth.loginSuccess'), {
        description: `${i18next.t('toasts.impersonationStart')} ${data.email}`,
      })

      window.location.href = '/dashboard'
    },
    onError: (error: Error) => {
      toast.error(i18next.t('auth.loginError'), {
        description: error.message || i18next.t('auth.loginErrorDesc'),
      })
    },
  })
}

export function useSwitchBack() {
  const stopImpersonation = useAuthStore((s) => s.stopImpersonation)
  const originalAuth = useAuthStore((s) => s.originalAuth)
  const queryClient = useQueryClient()

  const switchBack = () => {
    if (!originalAuth) {
      toast.error(i18next.t('toasts.impersonationExitError'))
      return
    }

    stopImpersonation()
    queryClient.clear()

    toast.success(i18next.t('toasts.impersonationEnd'), {
      description: originalAuth.user.email,
    })

    window.location.href = '/dashboard'
  }

  return { switchBack }
}
