import { EnterpriseContactResponseType } from './contact';

// Enums for fixed values
enum Gender {
  MALE = "MALE",
  FEMALE = "FEMALE"
}

enum Role {
  SUPER_ADMIN = "SUPER_ADMIN",
  ADMIN = "ADMIN",
  USER = "USER"
}

enum RechargeStatus {
  DEMANDE = "DEMANDE",
  APPROVED = "APPROVED",
  REJECTED = "REJECTED"
}

enum PaymentMethod {
  CASH = "CASH",
  MOBILE_MONEY = "MOBILE_MONEY",
  BANK_TRANSFER = "BANK_TRANSFER",
  CREDIT_CARD = "CREDIT_CARD"
}

// Type for Authority
export type AuthorityType = {
  authority: string;
}

// Type for User
export type UserType = {
  id: string;
  createdAt: string;
  updatedAt: string;
  version: number;
  email: string;
  phoneNumber: string;
  password: string;
  country: string;
  city: string;
  address: string;
  role: Role;
  userEnterprise: EnterpriseType;
  recharges: RechargeType[];
  accountNonExpired: boolean;
  credentialsNonExpired: boolean;
  accountNonLocked: boolean;
  username: string;
  authorities: AuthorityType[];
  enabled: boolean;
  archived: boolean;
  deleted: boolean;
}

// Type for Pays (Country)
export type PaysType = {
  id: string;
  createdAt: string;
  updatedAt: string;
  version: number;
  code: string;
  nom: string;
  continent: string;
  imageUrl: string;
  enterprises: string[];
  archived: boolean;
  deleted: boolean;
}

// Type for EnterpriseContact
export type EnterpriseContactType = {
  id: string;
  createdAt: string;
  updatedAt: string;
  version: number;
  firstname: string;
  lastname: string;
  email: string;
  phoneNumber: string;
  country: string;
  city: string;
  gender: Gender;
  enterprise: string | EnterpriseType;
  group: string | GroupType;
  archived: boolean;
  deleted: boolean;
}

// Type for Group
export type GroupType = {
  id: string;
  createdAt: string;
  updatedAt: string;
  version: number;
  name: string;
  code: string;
  enterprise: string;
  enterpriseContacts: EnterpriseContactResponseType[];
  archived: boolean;
  deleted: boolean;
}

export type EnterpriseGroupType = {
  id: string;
  createdAt: string;
  updatedAt: string;
  version: number;
  groupId: string | null;
  name: string;
  code: string;
  enterpriseContacts: EnterpriseType[]; // You might want to define a proper type for contacts
  archived: boolean;
  statusCode?: number;
  error?: string | null;
  message?: string | null;
};

export type AddContactsToGroupType = {
  listContactid: string[]
}

// Type for Recharge
export type RechargeType = {
  id: string;
  createdAt: string;
  updatedAt: string;
  version: number;
  qteMessage: number;
  messagePriceUnit: number;
  status: RechargeStatus;
  enterprise: string;
  user: string;
  userManagedRecharge: string;
  paymentMethod: PaymentMethod;
  debitPhoneNumber: string;
  debitBankAccountNumber: string;
  couponCode: string;
  archived: boolean;
  deleted: boolean;
}

// Type for Enterprise
export type EnterpriseType = {
  id: string;
  createdAt: string;
  updatedAt: string;
  version: number;
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
  pays: String;
  user: string[];
  enterpriseContacts: EnterpriseContactResponseType[];
  groupes: GroupType[];
  recharges: RechargeType[];
  archived: boolean;
  deleted: boolean;
}

// Type for Pageable Sort
export type PageableSortType = {
  sorted: boolean;
  unsorted: boolean;
  empty: boolean;
}

// Type for Pageable
export type PageableType = {
  pageNumber: number;
  pageSize: number;
  paged: boolean;
  unpaged: boolean;
  sort: PageableSortType;
  offset: number;
}

// Type for Content Item
export type ContentItemType = {
  statusCode: number;
  error: string;
  message: string;
  id: string;
  createdAt: string;
  updatedAt: string;
  version: number;
  groupId: string;
  name: string;
  code: string;
  enterpriseContacts: EnterpriseContactResponseType[];
  archived: boolean;
}

// Main Response Interface
export type PaginatedResponseType = {
  totalPages: number;
  totalElements: number;
  pageable: PageableType;
  numberOfElements: number;
  first: boolean;
  last: boolean;
  sort: PageableSortType;
  number: number;
  size: number;
  content: ContentItemType[];
  empty: boolean;
}


export type ResponseType400 = {
  statusCode: number,
  error: string,
  message: string,
  id: string,
  createdAt: string,
  updatedAt: string,
  version: number,
  otherMessage: {
    additionalProp1: string,
    additionalProp2: string,
    additionalProp3: string
  },
  archived: boolean
}

export type ResponseType401 = {
  statusCode: number,
  error: string,
  message: string,
  id: string,
  createdAt: string,
  updatedAt: string,
  version: number,
  archived: true
}

export type ResponseType404 = {
  statusCode: number,
  error: string,
  message: string,
  id: string,
  createdAt: string,
  updatedAt: string,
  version: number,
  archived: true
}

export type CreateGroupType = {
  name: string,
  code: string,
  enterpriseId: string
}