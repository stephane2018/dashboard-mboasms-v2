import { useMutation } from "@tanstack/react-query"
import { useRouter } from "next/navigation"
import { login } from "@/core/services/auth.service"
import { toast } from "sonner"
import { getDefaultDashboardUrl } from "@/core/utils/role.utils"
import { LoginCredentials } from "../types/auth.types"

export function useLogin() {
  const router = useRouter()

  return useMutation({
    mutationFn: (credentials: LoginCredentials) => login(credentials),
    onSuccess: (response, variables) => {
      console.log(response)

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
