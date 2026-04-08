import { BaseEntity, PaginatedResponse } from './common';
import { CountryType } from './country';
import { RechargeType } from './recharge';

// Forward declarations to avoid circular dependencies
export type EnterpriseContactType = Record<string, unknown>;
export type GroupType = Record<string, unknown>;

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
    internationalCredit?: number;
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
