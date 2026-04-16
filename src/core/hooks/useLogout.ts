import { useMutation, useQueryClient } from "@tanstack/react-query"
import { logout } from "@/core/services/auth.service"
import { useAuthStore } from "@/core/stores/authStore"
import { toast } from "sonner"

export function useLogout() {
  const queryClient = useQueryClient()
  const clearAuth = useAuthStore((s) => s.clearAuth)

  return useMutation({
    mutationFn: async () => {
      await logout().catch(() => {})
      clearAuth()
      queryClient.clear()
    },
    onSuccess: () => {
      toast.success("Déconnexion réussie", {
        description: "À bientôt sur MboaSMS",
      })
      setTimeout(() => {
        window.location.href = "/auth/login"
      }, 100)
    },
    onError: () => {
      clearAuth()
      queryClient.clear()
      setTimeout(() => {
        window.location.href = "/auth/login"
      }, 100)
    },
  })
}
