import { Gender, Role } from '@/core/config/enum';

// Create Client Request
export interface CreateClientRequestType {
    firstName: string;
    lastName: string;
    socialRaison: string;
    email: string;
    password: string;
    phoneNumber: string;
    country: string;
    city: string;
    activityDomain: string;
    address: string;
    contribuableNumber: string;
    villeEntreprise: string;
    numeroCommerce: string;
    urlImage?: string;
    urlSiteweb?: string;
    telephoneEntreprise: string;
    smsESenderId: string;
    adresseEnterprise: string;
    emailEnterprise: string;
    enterpriseCountryId: string;
    user: string;
}

// Create Client User Request
export interface CreateClientUserRequest {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    phoneNumber: string;
    country: string;
    city: string;
    address: string;
    role?: Role;
}

// Update Client Request
export interface UpdateClientRequestType {
    socialRaison: string;
    email: string;
    password?: string;
    phoneNumber: string;
    country: string;
    city: string;
    smsSenderId: string;
    activityDomain: string;
    address: string;
    contribuableNumber: string;
    villeEntreprise: string;
    firstName: string;
    lastName: string;
    pays: string;
    user: string;
}

// Client Response
export interface ClientResponseType {
    statusCode: number;
    error: string | null;
    message: string | null;
    id: string;
    createdAt: string;
    updatedAt: string;
    version: number;
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    country: string;
    city: string;
    gender: Gender;
    role: Role;
    enterpriseId: string;
    archived: boolean;
    isSelected?: boolean;
}

// Transformed Client Type
export type TransformedClientType = Omit<ClientResponseType, 'statusCode' | 'error' | 'message' | 'updatedAt' | 'version'> & {
    status?: string;
};
