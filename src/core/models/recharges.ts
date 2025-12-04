// Keep only the essential types and make them consistent
export enum PaymentMethod {
    CASH = "CASH",
    ORANGE_MONEY = "OM",
    MTN_MONEY = "MOMO",
    BANK_ACCOUNT = "BANK",
    PAYPAL = "PAYPAL"
}

export enum RechargeStatus {
    PENDING = "DEMANDE",
    VALIDATED = "VALIDATED",
    REFUSED = "REFUSED"
}
export type CreateRechargeResponseType = {
    statusCode: number;
    error: string | null;
    message: string | null;
    id: string;
    createdAt: string;
    updatedAt: string;
    version: number;
    qteMessage: number;
    messagePriceUnit: number;
    enterpriseId: string;
    // paymentMethod: PaymentMethod;
    paymentMethod: string;
    debitPhoneNumber: string;
    debitBankAccountNumber?: string;
    couponCode?: string;
    archived: boolean;
};

export type UpdateRechargeRequestType = {
    qteMessage: number;
    enterpriseId: string;
    paymentMethod: string;
    // paymentMethod: PaymentMethod;
    debitPhoneNumber: string;
    debitBankAccountNumber?: string;
    couponCode?: string;
};

export type CreditAccountRequestType = {
    qteMessage: number;
};

export type CreditAccountResponseType = {
    statusCode: number;
    error: string | null;
    message: string | null;
    id: string;
    createdAt: string;
    updatedAt: string;
    version: number;
    qteMessage: number;
    archived: boolean;
};

export type ReachargePageableType = {
    pageNumber: number;
    pageSize: number;
    paged: boolean;
    unpaged: boolean;
    sort: RechargeSortType;
    offset: number;
};

export type RechargeSortType = {
    sorted: boolean;
    unsorted: boolean;
    empty: boolean;
};

export type RechargePageType = {
    totalPages: number;
    totalElements: number;
    pageable: ReachargePageableType;
    first: boolean;
    last: boolean;
    numberOfElements: number;
    sort: RechargeSortType;
    number: number;
    size: number;
    content: RechargeListContentType[];
    empty: boolean;
};

export type RechargeListContentType = {
    statusCode: number;
    status: string;
    error: string;
    message: string;
    id: string;
    createdAt: string;
    updatedAt: string;
    version: number;
    qteMessage: number;
    messagePriceUnit: number;
    enterprise: EnterpriseType;
    paymentMethod: string;
    debitPhoneNumber: string;
    debitBankAccountNumber: string;
    couponCode: string;
    archived: boolean;
};

export type EnterpriseType = {
    statusCode: number;
    error: string;
    message: string;
    id: string;
    createdAt: string;
    updatedAt: string;
    version: number;
    idEnterprise: string;
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
    user: UserBasicType[];
    enterpriseContacts: EnterpriseContactType[];
    groupes: GroupeType[];
    recharges: string[];
    archived: boolean;
};

export type PaysType = {
    statusCode: number;
    error: string;
    message: string;
    id: string;
    createdAt: string;
    updatedAt: string;
    version: number;
    code: string;
    nom: string;
    continent: string;
    imageUrl: string;
    archived: boolean;
};

export type UserBasicType = {
    email: string;
    name: string;
    imageUrl: string;
};

export type EnterpriseContactType = {
    statusCode: number;
    error: string;
    message: string;
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
    gender: "MALE" | string;
    user: UserType;
    enterprise: EnterpriseBasicType;
    group: GroupeBasicType;
    archived: boolean;
};

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
    role: "SUPER_ADMIN" | string;
    firstName: string;
    lastName: string;
    userEnterprise: EnterpriseBasicType;
    recharges: RechargeBasicType[];
    accountNonExpired: boolean;
    credentialsNonExpired: boolean;
    accountNonLocked: boolean;
    username: string;
    authorities: { authority: string }[];
    enabled: boolean;
    archived: boolean;
    deleted: boolean;
};

export type EnterpriseBasicType = {
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
    pays: PaysBasicType;
    user: string[];
    enterpriseContacts: EnterpriseContactBasicType[];
    groupes: GroupeBasicType[];
    recharges: RechargeBasicType[];
    archived: boolean;
    deleted: boolean;
};

export type PaysBasicType = {
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
};

export type EnterpriseContactBasicType = {
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
    gender: "MALE" | string;
    enterprise: string;
    group: string;
    archived: boolean;
    deleted: boolean;
};

export type GroupeBasicType = {
    id: string;
    createdAt: string;
    updatedAt: string;
    version: number;
    name: string;
    code: string;
    enterprise: string;
    enterpriseContacts: EnterpriseContactBasicType[];
    archived: boolean;
    deleted: boolean;
};

export type RechargeBasicType = {
    id: string;
    createdAt: string;
    updatedAt: string;
    version: number;
    qteMessage: number;
    messagePriceUnit: number;
    status: "DEMANDE" | string;
    enterprise: string;
    user: string;
    userManagedRecharge: string;
    paymentMethod: "CASH" | string;
    debitPhoneNumber: string;
    debitBankAccountNumber: string;
    couponCode: string;
    archived: boolean;
    deleted: boolean;
};

export type GroupeType = {
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
    enterpriseContacts: EnterpriseContactType[];
    archived: boolean;
};

export type CreateRechargeRequestType = {
    qteMessage: number;
    enterpriseId: string;
    // paymentMethod: PaymentMethod;
    paymentMethod: string;
    debitPhoneNumber: string;
    debitBankAccountNumber?: string;
    couponCode?: string;
}

export type CreateRechargeTypeResponse = {
    statusCode: number;
    error: string | null;
    message: string | null;
    id: string;
    createdAt: string;
    updatedAt: string;
    version: number;
    qteMessage: number;
    messagePriceUnit: number;
    enterpriseId: string;
    paymentMethod: PaymentMethod;
    debitPhoneNumber: string;
    debitBankAccountNumber?: string;
    couponCode?: string;
    archived: boolean;
}













// // Enum for PaymentMethod
// enum PaymentMethod {
//     CASH = "CASH",
//     MOBILE_MONEY = "MOBILE_MONEY",
//     BANK_TRANSFER = "BANK_TRANSFER",
//     CREDIT_CARD = "CREDIT_CARD"
// }

// // Type for Sort properties
// export type RechargeSortType = {
//     sorted: boolean;
//     unsorted: boolean;
//     empty: boolean;
// }

// // Type for Pageable
// export type ReachargePageableType = {
//     pageNumber: number;
//     pageSize: number;
//     paged: boolean;
//     unpaged: boolean;
//     sort: RechargeSortType;
//     offset: number;
// }

// // Type for a Recharge item
// export type RechargeType = {
//     statusCode: number;
//     error: string;
//     message: string;
//     id: string;
//     createdAt: string; // ISO date string
//     updatedAt: string; // ISO date string
//     version: number;
//     qteMessage: number; // Quantity of messages
//     messagePriceUnit: number; // Price per message unit
//     enterprise: string; // Could be expanded to Enterprise interface if needed
//     user: string; // Could be expanded to User interface if needed
//     paymentMethod: PaymentMethod;
//     debitPhoneNumber: string;
//     debitBankAccountNumber: string;
//     couponCode: string;
//     archived: boolean;
// }

// // Main Paginated Response Interface
// export type PaginatedRechargeResponseType = {
//     totalPages: number;
//     totalElements: number;
//     pageable: ReachargePageableType;
//     numberOfElements: number;
//     first: boolean;
//     last: boolean;
//     sort: RechargeSortType;
//     number: number; // current page number
//     size: number;   // page size
//     content: RechargeType [];
//     empty: boolean;
// }