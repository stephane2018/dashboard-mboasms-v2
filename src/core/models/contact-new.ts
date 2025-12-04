import { BaseEntity, PaginatedResponse, ApiResponse } from './common';
import { Gender } from '@/core/config/enum';
import { UserType } from './user';
import { EnterpriseType } from './enterprise';

// Group interface (simplified - full version in groups.ts)
export interface GroupType extends BaseEntity {
    name: string;
    code: string;
    enterprise: string;
    enterpriseContacts: EnterpriseContactType[];
}

// Enterprise Contact interface
export interface EnterpriseContactType extends BaseEntity {
    statusCode?: number;
    error?: string;
    message?: string;
    firstname: string;
    lastname: string;
    email: string;
    phoneNumber: string;
    country: string;
    city: string;
    gender: Gender;
    enterprise: string | EnterpriseType;
    group: string | GroupType;
    user?: UserType;
}

// Enterprise Contact Response Type (with full details)
export interface EnterpriseContactResponseType extends ApiResponse {
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
    smsSenderId?: string;
    activityDomain?: string;
    villeEntreprise?: string;
    pays?: string;
}

// Create Contact Request
export interface CreateContactRequestType {
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    country: string;
    city: string;
    gender?: Gender;
    enterpriseId: string;
    group?: string;
}

// Update Contact Request
export interface UpdateContactRequestType {
    id: string;
    createdAt: string;
    socialRaison?: string;
    smsSenderId: string;
    activityDomain: string;
    contribuableNumber?: string;
    villeEntreprise: string;
    firstname: string;
    lastname: string;
    email: string;
    phoneNumber: string;
    country: string;
    pays: string;
    city: string;
    user: UserType;
    enterpriseId?: string;
    group?: string;
}

// Enterprise Contact DTO
export interface EnterpriseContactDTO {
    firstname: string;
    lastname: string;
    email: string;
    phoneNumber: string;
    country: string;
    city: string;
    gender: string;
    enterpriseId: string;
    group: string;
}

// Import Contacts Type
export interface ImportContactsType {
    file: string;
}

// Paginated Enterprise Contacts Response
export type PaginatedEnterpriseContactsResponseType = PaginatedResponse<EnterpriseContactResponseType>;
