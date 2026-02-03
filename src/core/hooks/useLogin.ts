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
import { tokenManager } from "@/core/lib/token-manager./token-manager"

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
    onSuccess: async (response, variables) => {
      console.log("[useLogin] API response:", response)

      // Map API response to user format
      const mappedUser = mapLoginResponseToUser(response)
      console.log("[useLogin] Mapped user:", mappedUser)

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
          console.error("Failed to fetch enterprise data:", error)
        }
      }

      // Sauvegarder l'email du formulaire dans le localStorage
      if (variables.email) {
        localStorage.setItem("caisse-post-user-email", variables.email)
      }

      toast.success("Connexion réussie", {
        description: "Bienvenue sur MboaSMS",
      })

      // Redirect based on user role
      const dashboardUrl = getDefaultDashboardUrl()
      router.replace(dashboardUrl)
    },
    onError: (error: any) => {
      console.log(error);
      const errorMessage = error?.message || "Une erreur est survenue lors de la connexion"
      toast.error("Erreur de connexion", {
        description: errorMessage,
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
    onSuccess: async (data, userEmail) => {
      console.log('Login-as API response:', data)
      console.log('Login-as role:', data.role)

      // Ensure current user exists before impersonating
      if (!currentUser) {
        toast.error("Impossible de se connecter en tant qu'utilisateur - utilisateur actuel non trouvé")
        return
      }

      // Store current user info and tokens before switching
      const currentTokens = {
        token: tokenManager.getToken(),
        refreshToken: tokenManager.getRefreshToken()
      }

      // Store original user with tokens (cast to any to include originalTokens)
      const originalUserWithTokens = {
        ...currentUser,
        originalTokens: currentTokens
      } as any

      console.log('Storing original user with tokens:', originalUserWithTokens)

      // Set impersonating flag and store original user with tokens
      setImpersonating(true, originalUserWithTokens)

      // Set new tokens
      tokenManager.setTokens(data.token, data.refreshToken)
      console.log(data);

      // Set new user data
      const userData = {
        id: data.id,
        email: data.email,
        name: `${data.firstName} ${data.lastName}`,
        role: data.role as Role,
        companyId: data.userEnterprise?.id,
      }
      
      console.log('Setting user data:', userData)
      setUser(userData)

      // Fetch and save enterprise data if user has a company
      if (data.userEnterprise?.id) {
        try {
          const enterpriseData = await getCompagnieConnectedDetails(data.userEnterprise.id)
          setEnterprise(enterpriseData)
        } catch (error) {
          console.error("Failed to fetch enterprise data:", error)
        }
      }

      toast.success("Connexion réussie", {
        description: `Connecté en tant que ${data.email}`,
      })

      // Redirect to dashboard
      router.replace('/dashboard')
    },
    onError: (error: any) => {
      console.log(error);
      const errorMessage = error?.message || "Une erreur est survenue lors de la connexion"
      toast.error("Erreur de connexion", {
        description: errorMessage,
      })
    },
  })
}

export function useSwitchBack() {
  const router = useRouter()
  const { setUser, setImpersonating, originalUser } = useUserStore()
  const { setEnterprise } = useEnterpriseStore()

  const switchBack = async () => {
    if (!originalUser) {
      toast.error("Impossible de revenir à l'utilisateur original")
      return
    }

    try {
      // Extract original user data without tokens
      const { originalTokens, ...originalUserData } = originalUser as any

      // Restore original tokens if available
      if (originalTokens?.token && originalTokens?.refreshToken) {
        tokenManager.setTokens(originalTokens.token, originalTokens.refreshToken)
        
        // Restore original user data
        setUser(originalUserData)
        setImpersonating(false)

        // Fetch and save enterprise data for original user
        if (originalUserData.companyId) {
          try {
            const enterpriseData = await getCompagnieConnectedDetails(originalUserData.companyId)
            setEnterprise(enterpriseData)
          } catch (error) {
            console.error("Failed to fetch enterprise data:", error)
          }
        }

        toast.success("Retour à la connexion originale", {
          description: `Reconnecté en tant que ${originalUserData.email}`,
        })

        // Redirect to dashboard
        router.replace('/dashboard')
      } else {
        // No original tokens available, need to re-authenticate
        setUser(originalUserData)
        setImpersonating(false)
        
        toast.success("Retour à la connexion originale", {
          description: `Veuillez vous reconnecter en tant que ${originalUserData.email}`,
          action: {
            label: "Se reconnecter",
            onClick: () => {
              router.push('/auth/login')
            }
          }
        })

        // Redirect to login page for re-authentication
        setTimeout(() => {
          router.push('/auth/login')
        }, 2000)
      }

    } catch (error) {
      console.error("Error switching back:", error)
      toast.error("Erreur lors du retour à la connexion originale")
    }
  }

  return { switchBack }
}
