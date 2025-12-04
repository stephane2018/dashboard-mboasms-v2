import { BaseEntity } from './common';
import { Gender, Role } from '@/core/config/enum';
import { EnterpriseType } from './enterprise';

// Simplified User for nested arrays
export interface BasicUserType {
    email: string;
    name: string;
    imageUrl: string;
}

// Login Response
export interface LoginResponse extends BaseEntity {
    statusCode: number;
    error: string;
    message: string;
    token: string;
    refreshToken: string;
    expirationTime: string;
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    country: string;
    city: string;
    gender: Gender;
    role: Role;
    userEnterprise: EnterpriseType;
}

// Export enums for backward compatibility
export { Gender, Role } from '@/core/config/enum';
