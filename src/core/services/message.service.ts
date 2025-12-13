import { httpClient } from '@/core/lib/http-client';
import { refractHttpError } from '@/core/utils/http-error';
import { SendMessageRequestType, SendMessageResponseType, GetMessageResponseType } from '../models';
import type { MessageHistoryType } from '../models/history';
import type { PaginatedResponse } from '../models/common';

export interface SendMessageToGroupPayload {
  groupId: string;
  message: string;
  enterpriseId: string;
  contacts: string;
  senderId: string;
}

export const sendMessage = async (data: SendMessageRequestType): Promise<SendMessageResponseType> => {
    try {
        const response = await httpClient.post<SendMessageResponseType>(
            '/api/v1/message/sendMessage',
            data as Record<string, any>
        );
        console.log(response);
        return response;
    } catch (error) {
        return Promise.reject(refractHttpError(error));
    }
};

export const sendMessageToContact = async (contactId: string, data: SendMessageRequestType): Promise<SendMessageResponseType> => {
    try {
        const response = await httpClient.post<SendMessageResponseType>(
            `/api/v1/message/${contactId}/sendMessageToContact`,
            data as Record<string, any>
        );
        console.log(response);
        return response;
    } catch (error) {
        return Promise.reject(refractHttpError(error));
    }
};

export const sendMessageToGroup = async (payload: SendMessageToGroupPayload): Promise<SendMessageResponseType> => {
    try {
        const response = await httpClient.post<SendMessageResponseType>(
            '/api/v1/message/sendMessageToGroup',
            payload as Record<string, any>
        );
        console.log(response);
        return response;
    } catch (error) {
        return Promise.reject(refractHttpError(error));
    }
};

export const getMessageHistory = async (enterpriseId: string, page: number = 0, size: number = 10): Promise<PaginatedResponse<MessageHistoryType>> => {
    try {
        const response = await httpClient.get<PaginatedResponse<MessageHistoryType>>(
            `/api/v1/message/${enterpriseId}/paginate`,
            { params: { page, size } }
        );
        console.log(response);
        return response;
    } catch (error) {
        return Promise.reject(refractHttpError(error));
    }
};

export const getMessages = async (enterpriseId: string, page: number, size: number): Promise<GetMessageResponseType> => {
    try {
        const response = await httpClient.get<GetMessageResponseType>(
            `/api/v1/message/${enterpriseId}/all`,
            { params: { page, size } }
        );
        console.log(response);
        return response;
    } catch (error) {
        return Promise.reject(refractHttpError(error));
    }
};

export const getAllMessages = async (enterpriseId: string, page: number, size: number): Promise<GetMessageResponseType> => {
    try {
        const response = await httpClient.get<GetMessageResponseType>(
            `/api/v1/message/${enterpriseId}/all`,
            { params: { page, size } }
        );
        console.log(response);
        return response;
    } catch (error) {
        return Promise.reject(refractHttpError(error));
    }
};