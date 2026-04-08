import type { Icon } from 'iconsax-react'
import {
    Category,
    People,
    Building,
    MessageText,
    WalletMoney,
    DocumentText,
    MoneyRecive,
    Element3,
    Clock,
    ProfileCircle,
    Setting2,
    Lifebuoy,
    Sms,
    TicketDiscount,
    Global,
    Key,
} from 'iconsax-react'
import { Role } from '@/core/config/enum'

// Types
export type UserRole = Role

export interface NavItem {
    title: string
    url: string
    icon: Icon
}

export interface NavSection {
    title: string
    items: NavItem[]
}

// Mock user data - replace with actual API call
export const mockUserData = {
    name: 'Admin User',
    email: 'admin@mboasms.com',
    avatar: '/logo.png',
}

// Role-based navigation configuration
export interface RoleBasedNavItem extends NavItem {
    roles: UserRole[]
}

export interface RoleBasedNavSection extends NavSection {
    roles: UserRole[]
    items: RoleBasedNavItem[]
}

export const navigationConfig: RoleBasedNavSection[] = [
    {
        title: 'Admin',
        roles: [Role.ADMIN_USER, Role.SUPER_ADMIN],
        items: [
            {
                title: 'Tableau de bord',
                url: '/dashboard',
                icon: Category,
                roles: [Role.ADMIN_USER, Role.SUPER_ADMIN],
            },
            {
                title: 'Mes contacts',
                url: '/users',
                icon: People,
                roles: [Role.ADMIN_USER, Role.SUPER_ADMIN],
            },
            {
                title: 'Contacts Globale ',
                url: '/contacts-management',
                icon: People,
                roles: [Role.SUPER_ADMIN],
            },
            {
                title: 'Companies',
                url: '/compagnie',
                icon: Building,
                roles: [Role.SUPER_ADMIN],
            },
            {
                title: 'SMS',
                url: '/sms',
                icon: Sms,
                roles: [Role.ADMIN_USER, Role.SUPER_ADMIN],
            },
            {
                title: 'Sender IDs',
                url: '/sender-ids',
                icon: MessageText,
                roles: [Role.ADMIN_USER, Role.SUPER_ADMIN],
            },
             {
                title: 'Groupes',
                url: '/groupes-management',
                icon: Element3,
                roles: [Role.ADMIN_USER, Role.SUPER_ADMIN],
            },
            {
                title: 'Recharge',
                url: '/recharge',
                icon: WalletMoney,
                roles: [Role.ADMIN_USER, Role.SUPER_ADMIN],
            },
            {
                title: 'Terms & Conditions',
                url: '/termes-and-condition',
                icon: DocumentText,
                roles: [Role.SUPER_ADMIN],
            },
            {
                title: 'Pricing',
                url: '/pricing',
                icon: MoneyRecive,
                roles: [Role.SUPER_ADMIN],
            },
            {
                title: 'Prix internationaux',
                url: '/country-prices',
                icon: Global,
                roles: [Role.SUPER_ADMIN],
            },
            {
                title: 'Codes promo',
                url: '/coupons',
                icon: TicketDiscount,
                roles: [Role.SUPER_ADMIN],
            },
            {
                title: 'Historique',
                url: '/historique-plateforme',
                icon: Clock,
                roles: [Role.ADMIN_USER, Role.SUPER_ADMIN],
            },
             {
                title: 'API Keys',
                url: '/api-keys',
                icon: Key,
                roles: [Role.ADMIN_USER, Role.SUPER_ADMIN],
            },
        ],
    },
   
    {
        title: 'Menu',
        roles: [Role.USER],
        items: [
            {
                title: 'Contacts',
                url: '/contacts',
                icon: People,
                roles: [Role.USER],
            },
            {
                title: 'Envoyer SMS',
                url: '/sms-client',
                icon: Sms,
                roles: [Role.USER],
            },
            {
                title: 'Groups',
                url: '/groupes',
                icon: Element3,
                roles: [Role.USER],
            },
            {
                title: 'History',
                url: '/historique',
                icon: Clock,
                roles: [Role.USER],
            },
            {
                title: 'Recharges',
                url: '/recharges',
                icon: WalletMoney,
                roles: [Role.USER],
            },
            {
                title: 'API Keys',
                url: '/api-keys',
                icon: Key,
                roles: [Role.USER],
            },
            {
                title: 'Profile',
                url: '/profile',
                icon: ProfileCircle,
                roles: [Role.USER],
            },
        ],
    },
]

export const secondaryNavConfig: RoleBasedNavItem[] = [
    {
        title: 'Settings',
        url: '/settings',
        icon: Setting2,
        roles: [Role.ADMIN, Role.SUPER_ADMIN, Role.USER, Role.ADMIN_USER],
    },
    {
        title: 'Support',
        url: '/support',
        icon: Lifebuoy,
        roles: [Role.ADMIN, Role.SUPER_ADMIN, Role.USER, Role.ADMIN_USER],
    },
]

// Utility functions
export const getUserRole = (): UserRole => {
    // Read from sessionStorage (user-storage key used by Zustand)
    try {
        const stored = sessionStorage.getItem('user-storage')
        if (stored) {
            const parsed = JSON.parse(stored)
            const role = parsed?.state?.user?.role
            if (role && Object.values(Role).includes(role as Role)) {
                return role as Role
            }
        }
    } catch {
        // Ignore parse errors
    }
    return Role.USER
}

export const getDashboardConfig = (userRole: UserRole) => {
    return {
        title: 'Dashboard',
        url: '/dashboard',
        icon: Category,
        roles: [Role.ADMIN, Role.SUPER_ADMIN, Role.ADMIN_USER, Role.USER] as UserRole[],
    }
}

export const getNameOfDashboard = (role: UserRole): string => {
    const roleNames: Record<UserRole, string> = {
        [Role.ADMIN]: 'Administration',
        [Role.ADMIN_USER]: 'Administration',
        [Role.USER]: 'Client Dashboard',
        [Role.SUPER_ADMIN]: 'Super Admin',
    }
    return roleNames[role] || 'Dashboard'
}
