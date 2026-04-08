import { httpClient } from '@/core/lib/http-client';
import { refractHttpError } from '@/core/utils/http-error';
import { extractContent } from '@/core/utils/extract-content';
import {
    ClientResponseType,
    CreateClientRequestType,
    CreateClientUserRequest,
    UpdateClientRequestType,
} from '@/core/models/client';

export const createClient = async (data: CreateClientRequestType): Promise<ClientResponseType> => {
    try {
        const response = await httpClient.post<ClientResponseType>('/api/v1/auth/register', data);
        return response;
    } catch (error) {
        return Promise.reject(refractHttpError(error));
    }
};

export const createClientUser = async (enterpriseId: string, data: CreateClientUserRequest): Promise<ClientResponseType> => {
    try {
        const response = await httpClient.post<ClientResponseType>(
            `/api/v1/enterprise/adduser-enterprise/${enterpriseId}`,
            data
        );
        return response;
    } catch (error) {
        return Promise.reject(refractHttpError(error));
    }
};

export const updateClient = async (id: string, data: UpdateClientRequestType): Promise<ClientResponseType> => {
    try {
        const response = await httpClient.put<ClientResponseType>(`/api/v1/auth/update-user/${id}`, data);
        return response;
    } catch (error) {
        return Promise.reject(refractHttpError(error));
    }
};

export const getClientsEnterprise = async (enterpriseId: string): Promise<ClientResponseType[]> => {
    try {
        const response = await httpClient.get(`/api/v1/auth/all/${enterpriseId}`);
        return extractContent<ClientResponseType>(response);
    } catch (error) {
        return Promise.reject(refractHttpError(error));
    }
};

export const getClients = async (): Promise<ClientResponseType[]> => {
    try {
        const response = await httpClient.get(`/api/v1/auth/all/`);
        return extractContent<ClientResponseType>(response);
    } catch (error) {
        return Promise.reject(refractHttpError(error));
    }
};

export const getClient = async (id: string): Promise<ClientResponseType> => {
    try {
        const response = await httpClient.get<ClientResponseType>(`/api/v1/auth/users/${id}`);
        return response;
    } catch (error) {
        return Promise.reject(refractHttpError(error));
    }
};

export const getClientsByEnterprisePaginated = async (
    enterpriseId: string, page = 0, size = 10
): Promise<ClientResponseType[]> => {
    try {
        const response = await httpClient.get(
            `/api/v1/auth/all/paginate/${enterpriseId}`, { params: { page, size } }
        );
        return extractContent<ClientResponseType>(response);
    } catch (error) {
        return Promise.reject(refractHttpError(error));
    }
};

/**
 * Update user's SMS Sender ID only
 * PUT /api/v1/auth/update-user/{id}
 */
export const updateUserSenderId = async (
    userId: string,
    smsSenderId: string
): Promise<ClientResponseType> => {
    try {
        const response = await httpClient.put<ClientResponseType>(
            `/api/v1/auth/update-user/${userId}`,
            { smsSenderId }
        );
        return response;
    } catch (error) {
        return Promise.reject(refractHttpError(error));
    }
};