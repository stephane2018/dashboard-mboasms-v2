import { httpClient } from '@/core/lib/http-client';
import { refractHttpError } from '@/core/utils/http-error';
import {
    GetMessageResponseType,
    SendMessageRequestType,
    SendMessageResponseType,
} from '@/types/messages';

export const sendMessage = async (data: SendMessageRequestType): Promise<SendMessageResponseType> => {
    try {
        const response = await httpClient.post<SendMessageResponseType>(
            '/api/v1/message/sendMessage',
            data
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