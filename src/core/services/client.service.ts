import { httpClient } from '@/core/lib/http-client';
import { refractHttpError } from '@/core/utils/http-error';
import {
    ClientResponseType,
    CreateClientRequestType,
    CreateClientUserRequest,
    UpdateClientRequestType,
} from '@/types/client';

export const createClient = async (data: CreateClientRequestType): Promise<ClientResponseType> => {
    try {
        const response = await httpClient.post<ClientResponseType>('/api/v1/auth/register', data);
        console.log(response);
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
        console.log(response);
        return response;
    } catch (error) {
        return Promise.reject(refractHttpError(error));
    }
};

export const updateClient = async (id: string, data: UpdateClientRequestType): Promise<ClientResponseType> => {
    try {
        const response = await httpClient.put<ClientResponseType>(`/api/v1/auth/update-user/${id}`, data);
        console.log(response);
        return response;
    } catch (error) {
        return Promise.reject(refractHttpError(error));
    }
};

export const getClientsEnterprise = async (enterpriseId: string): Promise<ClientResponseType[]> => {
    try {
        const response = await httpClient.get<ClientResponseType[]>(`/api/v1/auth/all/${enterpriseId}`);
        console.log(response);
        return response;
    } catch (error) {
        return Promise.reject(refractHttpError(error));
    }
};

export const getClients = async (): Promise<ClientResponseType[]> => {
    try {
        const response = await httpClient.get<ClientResponseType[]>(`/api/v1/auth/all/`);
        console.log(response);
        return response;
    } catch (error) {
        return Promise.reject(refractHttpError(error));
    }
};

export const getClient = async (id: string): Promise<ClientResponseType> => {
    try {
        const response = await httpClient.get<ClientResponseType>(`/api/v1/auth/users/${id}`);
        console.log(response);
        return response;
    } catch (error) {
        return Promise.reject(refractHttpError(error));
    }
};