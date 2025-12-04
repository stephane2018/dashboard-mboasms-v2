interface RoleBadgeProps {
  role: string
  variant?: 'role' | 'profile' | 'status'
}

// Fonction pour gérer les couleurs des rôles
const getRoleColor = (role: string, variant: 'role' | 'profile' | 'status' = 'role'): string => {
  const roleUpper = role.toUpperCase()

  if (variant === 'role') {
    const roleColorMap: Record<string, string> = {
      'ADMIN': 'bg-red-500/10  border-red-600 border border-dashed dark:border-red-600 text-red-600',
      'SUPER_ADMIN': 'bg-orange-600/10  border-orange-700 border border-dashed dark:border-orange-700 text-orange-700',
      'MANAGER': 'bg-cyan-500/10  border-cyan-600 border border-dashed dark:border-cyan-600 text-cyan-600',
      'SELLER': 'bg-green-600/10  border-green-700 border border-dashed dark:border-green-700 text-green-700',
    }
    return roleColorMap[roleUpper] || 'bg-primary text-primary-foreground'
  }

  if (variant === 'profile') {
    const profileColorMap: Record<string, string> = {
      'GESTIONNAIRE': 'bg-indigo-500 text-white',
      'SUPERVISEUR': 'bg-cyan-500 text-white',
      'OPERATEUR': 'bg-teal-500 text-white',
      'ADMIN': 'bg-red-500 text-white',
    }
    return profileColorMap[roleUpper] || 'bg-slate-500 text-white'
  }

  if (variant === 'status') {
    const statusColorMap: Record<string, string> = {
      'ACTIF': 'bg-green-500 text-white',
      'INACTIF': 'bg-gray-500 text-white',
      'SUSPENDU': 'bg-yellow-500 text-white',
      'BLOQUE': 'bg-red-500 text-white',
    }
    return statusColorMap[roleUpper] || 'bg-gray-400 text-white'
  }

  return 'bg-primary text-primary-foreground'
}

export function RoleBadge({ role, variant = 'role' }: RoleBadgeProps) {
  if (!role) return null

  return (
    <span
      className={`px-2 py-1 text-xs font-medium rounded-full ${getRoleColor(role, variant)}`}
    >
      {role}
    </span>
  )
}
