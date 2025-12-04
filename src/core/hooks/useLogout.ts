import { useMutation } from "@tanstack/react-query"
import { useRouter } from "next/navigation"
import { logout } from "@/core/services/auth.service"
import { useAuthContext } from "@/core/providers"
import { toast } from "sonner"

export function useLogout() {
  const router = useRouter()
  const { clearUser } = useAuthContext()

  return useMutation({
    mutationFn: () => logout(),
    onSuccess: () => {
      clearUser()
      toast.success("Déconnexion réussie", {
        description: "À bientôt sur MboaSMS",
      })
      router.push("/auth/login")
    },
    onError: () => {
      // Even if the API call fails, we should clear local auth state
      clearUser()
      toast.error("Erreur de déconnexion", {
        description: "Une erreur est survenue mais vous avez été déconnecté",
      })
      router.push("/auth/login")
    },
  })
}
