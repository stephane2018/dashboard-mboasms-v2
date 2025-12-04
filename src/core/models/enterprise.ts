import { BaseEntity, PaginatedResponse } from './common';
import { CountryType } from './country';
import { RechargeType } from './recharge';

// Forward declarations to avoid circular dependencies
export type EnterpriseContactType = any; // Will be defined in contact.ts
export type GroupType = any; // Will be defined in groups.ts

// Enterprise interface
export interface EnterpriseType extends BaseEntity {
    statusCode?: number;
    error?: string;
    message?: string;
    socialRaison: string;
    numeroCommerce: string;
    urlImage: string;
    urlSiteweb: string;
    telephoneEnterprise: string;
    emailEnterprise: string;
    villeEnterprise: string;
    adresseEnterprise: string;
    smsESenderId: string;
    smsCredit: number;
    activityDomain: string;
    contribuableNumber: string;
    pays: CountryType | string;
    user: string[];
    enterpriseContacts: EnterpriseContactType[];
    groupes: GroupType[];
    recharges: RechargeType[];
}

// Paginated Enterprise Response
export type PaginatedEnterpriseResponseType = PaginatedResponse<EnterpriseType>;
