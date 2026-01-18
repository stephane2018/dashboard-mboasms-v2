import { useMutation } from "@tanstack/react-query"
import { useRouter } from "next/navigation"
import { login } from "@/core/services/auth.service"
import { toast } from "sonner"
import { getDefaultDashboardUrl } from "@/core/utils/role.utils"
import { LoginCredentials } from "@/core/types/auth.types"
import { useUserStore } from "@/core/stores/userStore"
import { useEnterpriseStore } from "@/core/stores/enterpriseStore"
import { getCompagnieConnectedDetails } from "@/core/services/CompanyService"
import { Role } from "@/core/config/enum"

interface LoginResponse {
  user: {
    id: string
    email: string
    name: string
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
  token?: string
}

export function useLogin() {
  const router = useRouter()
  const { setUser } = useUserStore()
  const { setEnterprise } = useEnterpriseStore()

  return useMutation<LoginResponse, Error, LoginCredentials>({
    mutationFn: (credentials: LoginCredentials) => login(credentials) as Promise<LoginResponse>,
    onSuccess: async (response, variables) => {
      console.log(response)

      // Save user data to store
      if (response.user) {
        setUser(response.user)
      }

      // Fetch and save enterprise data if user has a company
      if (response.user?.companyId) {
        try {
          const enterpriseData = await getCompagnieConnectedDetails(response.user.companyId)
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
        description: "Bienvenue sur Caisse Post",
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
