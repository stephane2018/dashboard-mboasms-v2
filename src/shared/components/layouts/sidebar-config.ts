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
import { Activity } from 'iconsax-react'

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

export interface RoleBasedNavItem extends NavItem {
    roles: UserRole[]
}

export interface RoleBasedNavSection extends NavSection {
    roles: UserRole[]
    items: RoleBasedNavItem[]
}

// ── Admin sections (ADMIN_USER + SUPER_ADMIN) ──────────────────────

export const navigationConfig: RoleBasedNavSection[] = [
    // ── Messagerie ──
    {
        title: 'nav.messaging',
        roles: [Role.ADMIN_USER, Role.SUPER_ADMIN],
        items: [
            {
                title: 'nav.sms',
                url: '/sms',
                icon: Sms,
                roles: [Role.ADMIN_USER, Role.SUPER_ADMIN],
            },
            {
                title: 'nav.smsJobs',
                url: '/sms/jobs',
                icon: Activity,
                roles: [Role.ADMIN_USER, Role.SUPER_ADMIN],
            },
            {
                title: 'nav.senderIds',
                url: '/sender-ids',
                icon: MessageText,
                roles: [Role.ADMIN_USER, Role.SUPER_ADMIN],
            },
        ],
    },

    // ── Contacts & Groupes ──
    {
        title: 'nav.contactsAndGroups',
        roles: [Role.ADMIN_USER, Role.SUPER_ADMIN],
        items: [
            {
                title: 'nav.contacts',
                url: '/users',
                icon: People,
                roles: [Role.ADMIN_USER, Role.SUPER_ADMIN],
            },
            {
                title: 'nav.globalContacts',
                url: '/contacts-management',
                icon: People,
                roles: [Role.SUPER_ADMIN],
            },
            {
                title: 'nav.groups',
                url: '/groupes-management',
                icon: Element3,
                roles: [Role.ADMIN_USER, Role.SUPER_ADMIN],
            },
        ],
    },

    // ── Finance ──
    {
        title: 'nav.finance',
        roles: [Role.ADMIN_USER, Role.SUPER_ADMIN],
        items: [
            {
                title: 'nav.recharge',
                url: '/recharge',
                icon: WalletMoney,
                roles: [Role.ADMIN_USER, Role.SUPER_ADMIN],
            },
            {
                title: 'nav.pricing',
                url: '/pricing',
                icon: MoneyRecive,
                roles: [Role.SUPER_ADMIN],
            },
            {
                title: 'nav.internationalPrices',
                url: '/country-prices',
                icon: Global,
                roles: [Role.SUPER_ADMIN],
            },
            {
                title: 'nav.promoCodes',
                url: '/coupons',
                icon: TicketDiscount,
                roles: [Role.SUPER_ADMIN],
            },
        ],
    },

    // ── Administration ──
    {
        title: 'nav.administration',
        roles: [Role.ADMIN_USER, Role.SUPER_ADMIN],
        items: [
            {
                title: 'nav.companies',
                url: '/compagnie',
                icon: Building,
                roles: [Role.SUPER_ADMIN],
            },
            {
                title: 'nav.history',
                url: '/historique-plateforme',
                icon: Clock,
                roles: [Role.ADMIN_USER, Role.SUPER_ADMIN],
            },
            {
                title: 'nav.termsConditions',
                url: '/termes-and-condition',
                icon: DocumentText,
                roles: [Role.SUPER_ADMIN],
            },
            {
                title: 'nav.apiKeys',
                url: '/api-keys',
                icon: Key,
                roles: [Role.ADMIN_USER, Role.SUPER_ADMIN],
            },
        ],
    },

    // ── Client sections (USER) ──────────────────────────────────────

    // ── Messagerie (client) ──
    {
        title: 'nav.messaging',
        roles: [Role.USER],
        items: [
            {
                title: 'nav.sendSms',
                url: '/sms-client',
                icon: Sms,
                roles: [Role.USER],
            },
        ],
    },

    // ── Contacts & Groupes (client) ──
    {
        title: 'nav.contactsAndGroups',
        roles: [Role.USER],
        items: [
            {
                title: 'nav.contacts',
                url: '/contacts',
                icon: People,
                roles: [Role.USER],
            },
            {
                title: 'nav.groups',
                url: '/groupes',
                icon: Element3,
                roles: [Role.USER],
            },
        ],
    },

    // ── Finance (client) ──
    {
        title: 'nav.finance',
        roles: [Role.USER],
        items: [
            {
                title: 'nav.recharges',
                url: '/recharges',
                icon: WalletMoney,
                roles: [Role.USER],
            },
        ],
    },

    // ── Mon compte (client) ──
    {
        title: 'nav.myAccount',
        roles: [Role.USER],
        items: [
            {
                title: 'nav.history',
                url: '/historique',
                icon: Clock,
                roles: [Role.USER],
            },
            {
                title: 'nav.apiKeys',
                url: '/api-keys',
                icon: Key,
                roles: [Role.USER],
            },
            {
                title: 'nav.profile',
                url: '/profile',
                icon: ProfileCircle,
                roles: [Role.USER],
            },
        ],
    },
]

export const secondaryNavConfig: RoleBasedNavItem[] = [
    {
        title: 'nav.settings',
        url: '/settings',
        icon: Setting2,
        roles: [Role.ADMIN, Role.SUPER_ADMIN, Role.USER, Role.ADMIN_USER],
    },
    {
        title: 'nav.support',
        url: '/support',
        icon: Lifebuoy,
        roles: [Role.ADMIN, Role.SUPER_ADMIN, Role.USER, Role.ADMIN_USER],
    },
]

// Utility functions
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
        [Role.ADMIN]: 'layout.dashboardNameAdmin',
        [Role.ADMIN_USER]: 'layout.dashboardNameAdmin',
        [Role.USER]: 'layout.dashboardNameUser',
        [Role.SUPER_ADMIN]: 'layout.dashboardNameSuperAdmin',
    }
    return roleNames[role] || 'layout.dashboardNameDefault'
}
