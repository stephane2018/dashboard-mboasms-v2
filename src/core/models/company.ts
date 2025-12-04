import { PaginatedResponse } from './common';
import { Role } from '@/core/config/enum';
import { EnterpriseType } from './enterprise';

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

// Paginated response type for companies
export type PaginatedCompaniesResponseType = PaginatedResponse<EnterpriseType>;

// Export types from enterprise for backward compatibility
export type { EnterpriseType } from './enterprise';
