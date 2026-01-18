import { BaseEntity, PaginatedResponse } from './common';
import { Role } from '@/core/config/enum';
import { CountryType } from './country';
import { RechargeType } from './recharge';
import { GroupType } from './groups';

// Request type for creating a company
export interface CreateCompanyRequestType {
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
  pays: string; // Country ID
}

// Request type for adding a user to an enterprise
export interface AddUserToEnterpriseRequestType {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phoneNumber: string;
  country: string;
  city: string;
  address: string;
  role: Role;
}

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
    enterpriseContacts: [];
    groupes: GroupType[];
    recharges: RechargeType[];
}


// Paginated response type for companies
export type PaginatedCompaniesResponseType = PaginatedResponse<EnterpriseType>;
