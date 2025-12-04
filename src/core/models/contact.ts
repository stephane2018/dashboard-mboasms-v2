import { Gender, Role, RechargeStatus, PaymentMethod } from '@/core/config/enum';

// Authority interface
export type AuthorityType = {
    authority: string;
}

// Country interface
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

// Recharge interface
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

// Group interface
export type GroupType = {
    id: string;
    createdAt: string;
    updatedAt: string;
    version: number;
    name: string;
    code: string;
    enterprise: string;
    enterpriseContacts: EnterpriseContactType [];
    archived: boolean;
    deleted: boolean;
}

// Enterprise Contact interface (self-referential)
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

// Enterprise interface
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
    pays: PaysType;
    user: string[];
    enterpriseContacts: EnterpriseContactType [];
    groupes: GroupType [];
    recharges: RechargeType [];
    archived: boolean;
    deleted: boolean;
}

// User interface
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
    recharges: RechargeType [];
    accountNonExpired: boolean;
    credentialsNonExpired: boolean;
    accountNonLocked: boolean;
    username: string;
    authorities: AuthorityType [];
    enabled: boolean;
    archived: boolean;
    deleted: boolean;
}

// Main Enterprise Contact Response interface
export type EnterpriseContactResponseType = {
    statusCode?: number;
    error?: string;
    message?: string;
    id: string;
    createdAt: string;
    updatedAt?: string;
    version?: number;
    firstname: string;
    lastname: string;
    email: string;
    phoneNumber: string;
    country: string;
    city: string;
    gender?: Gender;
    user: UserType;
    enterprise: EnterpriseType;
    group?: GroupType;
    archived: boolean;
    smsSenderId: string;
    activityDomain: string;
    villeEntreprise: string;
    pays: string;
}

export type EnterpriseContactDTO = {
    firstname: string,
    lastname: string,
    email: string,
    phoneNumber: string,
    country: string,
    city: string,
    gender: string,
    enterpriseId: string,
    group: string
}

// Pagination Sort interface
export type SortType = {
    sorted: boolean;
    unsorted: boolean;
    empty: boolean;
}

// Pageable interface
export type PageableType = {
    pageNumber: number;
    pageSize: number;
    paged: boolean;
    unpaged: boolean;
    sort: SortType;
    offset: number;
}

// Main Paginated Response interface
export type PaginatedEnterpriseContactsResponseType = {
    totalPages: number;
    totalElements: number;
    pageable: PageableType;
    numberOfElements: number;
    first: boolean;
    last: boolean;
    sort: SortType;
    number: number;
    size: number;
    content: EnterpriseContactResponseType [];
    empty: boolean;
}

export type CreateContactRequestType = {
    firstName: string,
    lastName: string,
    email: string,
    phoneNumber: string,
    country: string,
    city: string,
    gender?: Gender,
    enterpriseId: string,
    group?: string
}

export type UpdateContactRequestType = {
    id: string,
    createdAt: string,
    socialRaison?: string, 
    smsSenderId: string, 
    activityDomain: string, 
    contribuableNumber?: string; 
    villeEntreprise: string;
    firstname: string,
    lastname: string,
    email: string,
    phoneNumber: string,
    country: string,
    pays: string,
    city: string,
    user: UserType, 
    enterpriseId?: string,
    group?: string
}

export type ImportContactsType = {
    file: string
}
