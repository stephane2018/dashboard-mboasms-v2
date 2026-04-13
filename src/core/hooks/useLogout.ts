import { useMutation, useQueryClient } from "@tanstack/react-query"
import { logout } from "@/core/services/auth.service"
import { toast } from "sonner"

function clearAllClientData() {
  try { window.sessionStorage.clear() } catch {}
  try { window.localStorage.clear() } catch {}
  try {
    document.cookie.split(';').forEach((cookie) => {
      const name = cookie.split('=')[0].trim()
      document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`
    })
  } catch {}
}

async function deleteSessionCookie() {
  try {
    await fetch('/api/auth/session', { method: 'DELETE', credentials: 'same-origin' });
  } catch {
    // Silent fail — cookie may still expire naturally
  }
}

export function useLogout() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async () => {
      logout().catch(() => {});
      await deleteSessionCookie();
      clearAllClientData();
      // Vider le cache React Query pour éviter que les données de l'ancien compte
      // s'affichent lors de la prochaine connexion
      queryClient.clear()
    },
    onSuccess: () => {
      toast.success("Déconnexion réussie", {
        description: "À bientôt sur MboaSMS",
      })
      window.location.href = "/auth/login"
    },
    onError: () => {
      clearAllClientData();
      queryClient.clear()
      window.location.href = "/auth/login"
    },
  })
}
