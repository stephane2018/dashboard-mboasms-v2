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
      // Clear client state immediately — don't wait for backend
      await deleteSessionCookie();
      clearUser();
      // Fire-and-forget backend logout (session already invalidated client-side)
      logout().catch(() => {});
    },
    onSuccess: () => {
      toast.success("Déconnexion réussie", {
        description: "À bientôt sur MboaSMS",
      })
      router.push("/auth/login")
    },
    onError: () => {
      router.push("/auth/login")
    },
  })
}
