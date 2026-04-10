import { useMutation } from "@tanstack/react-query"
import { useRouter } from "next/navigation"
import { logout } from "@/core/services/auth.service"
import { useAuthContext } from "@/core/providers"
import { toast } from "sonner"

async function deleteSessionCookie() {
  try {
    await fetch('/api/auth/session', { method: 'DELETE', credentials: 'same-origin' });
  } catch {
    // Silent fail — cookie may still expire naturally
  }
}

export function useLogout() {
  const router = useRouter()
  const { clearUser } = useAuthContext()

  return useMutation({
    mutationFn: async () => {
      await logout();
      // Must await cookie deletion before redirecting — otherwise the middleware
      // still sees the valid httpOnly cookie and redirects back to /dashboard
      await deleteSessionCookie();
    },
    onSuccess: () => {
      clearUser()
      toast.success("Déconnexion réussie", {
        description: "À bientôt sur MboaSMS",
      })
      router.push("/auth/login")
    },
    onError: async () => {
      // Even if the backend call fails, force-delete the cookie and clear local state
      await deleteSessionCookie();
      clearUser()
      toast.error("Erreur de déconnexion", {
        description: "Une erreur est survenue mais vous avez été déconnecté",
      })
      router.push("/auth/login")
    },
  })
}
