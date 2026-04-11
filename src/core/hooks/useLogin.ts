import { useMutation } from "@tanstack/react-query"
import { useRouter } from "next/navigation"
import { login, loginAsUser } from "@/core/services/auth.service"
import { toast } from "sonner"
import { i18next } from "@/core/lib/i18n"
import { getDefaultDashboardUrl } from "@/core/utils/role.utils"
import { LoginCredentials } from "@/core/types/auth.types"
import { useUserStore } from "@/core/stores/userStore"
import { useEnterpriseStore } from "@/core/stores/enterpriseStore"
import { getCompagnieConnectedDetails } from "@/core/services/CompanyService"
import { Role } from "@/core/config/enum"
import { tokenManager } from "@/core/lib/token-manager/token-manager"

// API login response - may have firstName/lastName or nested user object
interface LoginApiResponse {
  token: string
  refreshToken: string
  id?: string
  email?: string
  firstName?: string
  lastName?: string
  name?: string
  role?: Role
  avatar?: string
  phone?: string
  companyId?: string
  userEnterprise?: {
    id: string
  }
  smsSenderId?: string
  isSenderIdVerified?: boolean
  smsBalance?: number
  smsQuota?: number
  planName?: string
  // Alternative: nested user object
  user?: {
    id: string
    email: string
    name?: string
    firstName?: string
    lastName?: string
    role: Role
    avatar?: string
    phone?: string
    companyId?: string
    smsSenderId?: string
    isSenderIdVerified?: boolean
    smsBalance?: number
    smsQuota?: number
    planName?: string
  }
}

// Map login response to User format
function mapLoginResponseToUser(response: LoginApiResponse) {
  // Check if user data is nested or at root level
  const userData = response.user || response

  // Ensure each field is a plain string — API may return objects or null in prod
  const rawName = typeof userData.name === 'string' ? userData.name : null;
  const rawFirst = typeof userData.firstName === 'string' ? userData.firstName : null;
  const rawLast = typeof userData.lastName === 'string' ? userData.lastName : null;
  const name = rawName || [rawFirst, rawLast].filter(Boolean).join(' ') || 'Utilisateur';

  if (!rawName && !rawFirst && !rawLast) {
    console.error('[useLogin] mapLoginResponseToUser: name fields missing or not strings. name:', typeof userData.name, '| firstName:', typeof userData.firstName, '| lastName:', typeof userData.lastName);
  }

  return {
    id: typeof userData.id === 'string' ? userData.id : '',
    email: typeof userData.email === 'string' ? userData.email : '',
    name,
    role: userData.role as Role,
    avatar: typeof userData.avatar === 'string' ? userData.avatar : undefined,
    phone: typeof userData.phone === 'string' ? userData.phone : undefined,
    companyId: userData.companyId || response.userEnterprise?.id,
    smsSenderId: typeof userData.smsSenderId === 'string' ? userData.smsSenderId : undefined,
    isSenderIdVerified: userData.isSenderIdVerified,
    smsBalance: userData.smsBalance,
    smsQuota: userData.smsQuota,
    planName: typeof userData.planName === 'string' ? userData.planName : undefined,
  }
}

export function useLogin() {
  const router = useRouter()
  const { setUser } = useUserStore()
  const { setEnterprise } = useEnterpriseStore()

  return useMutation<LoginApiResponse, Error, LoginCredentials>({
    mutationFn: (credentials: LoginCredentials) => login(credentials) as Promise<LoginApiResponse>,
    onSuccess: async (response) => {
      // Map API response to user format
      const mappedUser = mapLoginResponseToUser(response)
      console.log('[useLogin] login response mapped:', { id: mappedUser.id, email: mappedUser.email, role: mappedUser.role, companyId: mappedUser.companyId })

      // Save user data to store only if the three required fields are valid strings
      if (mappedUser.id && mappedUser.email && mappedUser.role) {
        setUser(mappedUser)
        // Mark data as fresh so AuthProvider skips the profile sync on next render
        sessionStorage.setItem('profile-fresh', '1')
        console.log('[useLogin] user stored in store')
      } else {
        console.error('[useLogin] user NOT stored - missing fields. id:', mappedUser.id, '| email:', mappedUser.email, '| role:', mappedUser.role)
      }

      // Fetch and save enterprise data if user has a company
      if (mappedUser.companyId) {
        try {
          const enterpriseData = await getCompagnieConnectedDetails(mappedUser.companyId)
          setEnterprise(enterpriseData)
          console.log('[useLogin] enterprise stored:', mappedUser.companyId)
        } catch (error) {
          console.error('[useLogin] enterprise fetch failed:', error)
        }
      }

      // Email storage removed for security (PII leak via localStorage)

      toast.success(i18next.t('auth.loginSuccess'), {
        description: i18next.t('auth.loginWelcome'),
      })

      // Redirect based on user role
      const dashboardUrl = getDefaultDashboardUrl()
      router.replace(dashboardUrl)
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
  firstName: string
  lastName: string
  role: Role
  token: string
  refreshToken: string
  userEnterprise?: {
    id: string
  }
}

export function useLoginAs() {
  const router = useRouter()
  const { user: currentUser, setUser, setImpersonating } = useUserStore()
  const { setEnterprise } = useEnterpriseStore()

  return useMutation<LoginAsResponse, Error, string>({
    mutationFn: (userEmail: string) => loginAsUser(userEmail) as Promise<LoginAsResponse>,
    onSuccess: async (data) => {
      // Ensure current user exists before impersonating
      if (!currentUser) {
        toast.error(i18next.t('toasts.impersonationError'))
        return
      }

      // Store original user data (WITHOUT tokens -- never store admin tokens in client storage)
      setImpersonating(true, { ...currentUser })

      // Set new tokens
      tokenManager.setTokens(data.token, data.refreshToken)

      // Set new user data
      const userData = {
        id: data.id,
        email: data.email,
        name: `${data.firstName} ${data.lastName}`,
        role: data.role as Role,
        companyId: data.userEnterprise?.id,
      }
      
      setUser(userData)

      // Fetch and save enterprise data if user has a company
      if (data.userEnterprise?.id) {
        try {
          const enterpriseData = await getCompagnieConnectedDetails(data.userEnterprise.id)
          setEnterprise(enterpriseData)
        } catch (error) {
        }
      }

      toast.success(i18next.t('auth.loginSuccess'), {
        description: `${i18next.t('toasts.impersonationStart')} ${data.email}`,
      })

      // Redirect to dashboard
      router.replace('/dashboard')
    },
    onError: (error: Error) => {
      toast.error(i18next.t('auth.loginError'), {
        description: error.message || i18next.t('auth.loginErrorDesc'),
      })
    },
  })
}

export function useSwitchBack() {
  const router = useRouter()
  const { setUser, setImpersonating, originalUser } = useUserStore()

  const switchBack = async () => {
    if (!originalUser) {
      toast.error(i18next.t('toasts.impersonationExitError'))
      return
    }

    try {
      // Clear impersonation state -- admin must re-authenticate for security
      // (admin tokens are never stored in client storage)
      tokenManager.clearTokens()
      setUser(originalUser)
      setImpersonating(false)

      toast.success(i18next.t('toasts.impersonationEnd'), {
        description: `${i18next.t('toasts.sessionExpired').split('.')[0]} - ${originalUser.email}`,
      })

      // Redirect to login for re-authentication
      router.replace('/auth/login')
    } catch (error) {
      toast.error(i18next.t('toasts.impersonationExitError'))
    }
  }

  return { switchBack }
}
