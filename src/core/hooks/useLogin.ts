import { useMutation } from "@tanstack/react-query"
import { useRouter } from "next/navigation"
import { login, loginAsUser } from "@/core/services/auth.service"
import { toast } from "sonner"
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

  // Build name from firstName + lastName if name is not provided
  const name = userData.name ||
    [userData.firstName, userData.lastName].filter(Boolean).join(' ') ||
    'Utilisateur'

  return {
    id: userData.id || '',
    email: userData.email || '',
    name,
    role: userData.role as Role,
    avatar: userData.avatar,
    phone: userData.phone,
    companyId: userData.companyId || response.userEnterprise?.id,
    smsSenderId: userData.smsSenderId,
    isSenderIdVerified: userData.isSenderIdVerified,
    smsBalance: userData.smsBalance,
    smsQuota: userData.smsQuota,
    planName: userData.planName,
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

      // Save user data to store
      if (mappedUser.id && mappedUser.email) {
        setUser(mappedUser)
      }

      // Fetch and save enterprise data if user has a company
      if (mappedUser.companyId) {
        try {
          const enterpriseData = await getCompagnieConnectedDetails(mappedUser.companyId)
          setEnterprise(enterpriseData)
        } catch (error) {
        }
      }

      // Email storage removed for security (PII leak via localStorage)

      toast.success("Connexion réussie", {
        description: "Bienvenue sur MboaSMS",
      })

      // Redirect based on user role
      const dashboardUrl = getDefaultDashboardUrl()
      router.replace(dashboardUrl)
    },
    onError: (error: Error) => {
      toast.error("Erreur de connexion", {
        description: error.message || "Une erreur est survenue lors de la connexion",
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
        toast.error("Impossible de se connecter en tant qu'utilisateur - utilisateur actuel non trouvé")
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

      toast.success("Connexion réussie", {
        description: `Connecté en tant que ${data.email}`,
      })

      // Redirect to dashboard
      router.replace('/dashboard')
    },
    onError: (error: Error) => {
      toast.error("Erreur de connexion", {
        description: error.message || "Une erreur est survenue lors de la connexion",
      })
    },
  })
}

export function useSwitchBack() {
  const router = useRouter()
  const { setUser, setImpersonating, originalUser } = useUserStore()

  const switchBack = async () => {
    if (!originalUser) {
      toast.error("Impossible de revenir à l'utilisateur original")
      return
    }

    try {
      // Clear impersonation state -- admin must re-authenticate for security
      // (admin tokens are never stored in client storage)
      tokenManager.clearTokens()
      setUser(originalUser)
      setImpersonating(false)

      toast.success("Fin de l'impersonation", {
        description: `Veuillez vous reconnecter en tant que ${originalUser.email}`,
      })

      // Redirect to login for re-authentication
      router.replace('/auth/login')
    } catch (error) {
      toast.error("Erreur lors du retour à la connexion originale")
    }
  }

  return { switchBack }
}
