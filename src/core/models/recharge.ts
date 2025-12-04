import { BaseEntity, PaginatedResponse, ApiResponse } from './common';
import { PaymentMethod, RechargeStatus } from '@/core/config/enum';
import { PricingPlanType } from './pricing';

// Recharge interface
export interface RechargeType extends BaseEntity {
    statusCode?: number;
    error?: string;
    message?: string;
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
    pricingPlan?: PricingPlanType;
}

// Create Recharge Request
export interface CreateRechargeRequestType {
    qteMessage: number;
    enterpriseId: string;
    paymentMethod: PaymentMethod | string;
    debitPhoneNumber: string;
    debitBankAccountNumber?: string;
    couponCode?: string;
}

// Create Recharge Response
export interface CreateRechargeResponseType extends ApiResponse<RechargeType> {
    id: string;
    createdAt: string;
    updatedAt: string;
    version: number;
    qteMessage: number;
    messagePriceUnit: number;
    enterpriseId: string;
    paymentMethod: string;
    debitPhoneNumber: string;
    debitBankAccountNumber?: string;
    couponCode?: string;
    archived: boolean;
}

// Update Recharge Request
export interface UpdateRechargeRequestType {
    qteMessage: number;
    enterpriseId: string;
    paymentMethod: PaymentMethod | string;
    debitPhoneNumber: string;
    debitBankAccountNumber?: string;
    couponCode?: string;
}

// Credit Account Request
export interface CreditAccountRequestType {
    qteMessage: number;
}

// Credit Account Response
export interface CreditAccountResponseType extends ApiResponse {
    id: string;
    createdAt: string;
    updatedAt: string;
    version: number;
    qteMessage: number;
    archived: boolean;
}

// Paginated Recharge Response
export type PaginatedRechargeResponseType = PaginatedResponse<RechargeType>;
