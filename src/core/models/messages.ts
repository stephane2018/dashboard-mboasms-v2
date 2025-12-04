import { BaseEntity, PaginatedResponse } from './common';

// Send Message Request
export interface SendMessageRequestType {
    message: string;
    enterpriseId: string;
    contacts: string;
    senderId: string;
    msisdn: string;
    smsCount: number;
}

// Send Message Response
export interface SendMessageResponseType extends BaseEntity {
    statusCode: number;
    error: string;
    message: string;
    contact: string;
    enterprise: string;
    status: 'ACCEPTED' | string;
    sender: string;
    ticket: string;
    smscount: number;
    msisdn: string;
    code: string;
    codeGroupe: string;
    type: string;
    apiResponse?: string;
}

// Message Type
export interface MessageType extends BaseEntity {
    qteMessage?: number;
    messagePriceUnit?: number;
    enterprise: string;
    user?: string;
    paymentMethod?: 'CASH' | 'MOBILE_MONEY' | 'BANK' | string;
    debitPhoneNumber?: string;
    debitBankAccountNumber?: string;
    couponCode?: string;
    statusCode?: number;
    error?: string;
    message?: string;
}

// Paginated Message Response
export type GetMessageResponseType = PaginatedResponse<MessageType>;
