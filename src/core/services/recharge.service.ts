import { httpClient } from '@/core/lib/http-client';
import { refractHttpError } from '@/core/utils/http-error';
import {
    CreateRechargeRequestType,
    CreateRechargeTypeResponse,
    CreditAccountRequestType,
    CreditAccountResponseType,
    RechargeListContentType,
    RechargePageType,
    UpdateRechargeRequestType,
} from '@/types/recharges';

export const createRecharge = async (data: CreateRechargeRequestType): Promise<CreateRechargeTypeResponse> => {
    try {
        const response = await httpClient.post<CreateRechargeTypeResponse>('/api/v1/recharge/create-request', data);
        console.log(response);
        return response;
    } catch (error) {
        return Promise.reject(refractHttpError(error));
    }
};

export const getRecharges = async (enterpriseId: string): Promise<RechargePageType> => {
    try {
        const response = await httpClient.get<RechargePageType>(`/api/v1/recharge/${enterpriseId}/all`);
        console.log(response);
        return response;
    } catch (error) {
        return Promise.reject(refractHttpError(error));
    }
};

export const getAllRecharges = async (): Promise<RechargePageType> => {
    try {
        const response = await httpClient.get<RechargePageType>(`/api/v1/recharge/all`);
        console.log(response);
        return response;
    } catch (error) {
        return Promise.reject(refractHttpError(error));
    }
};

export const getRecharge = async (id: string): Promise<RechargeListContentType> => {
    try {
        const response = await httpClient.get<RechargeListContentType>(`/api/v1/recharge/${id}`);
        console.log(response);
        return response;
    } catch (error) {
        return Promise.reject(refractHttpError(error));
    }
};

export const updateRecharge = async (rechargeId: string, data: UpdateRechargeRequestType): Promise<RechargeListContentType> => {
    try {
        const response = await httpClient.put<RechargeListContentType>(`/api/v1/recharge/${rechargeId}/update`, data);
        console.log(response);
        return response;
    } catch (error) {
        return Promise.reject(refractHttpError(error));
    }
};

export const validateRecharge = async (rechargeId: string): Promise<RechargeListContentType> => {
    try {
        const response = await httpClient.put<RechargeListContentType>(`/api/v1/recharge/${rechargeId}/validate`, {});
        console.log(response);
        return response;
    } catch (error) {
        return Promise.reject(refractHttpError(error));
    }
};

export const refuseRecharge = async (rechargeId: string): Promise<RechargeListContentType> => {
    try {
        const response = await httpClient.put<RechargeListContentType>(`/api/v1/recharge/${rechargeId}/refused`, {});
        console.log(response);
        return response;
    } catch (error) {
        return Promise.reject(refractHttpError(error));
    }
};

export const creditAccount = async (enterpriseId: string, data: CreditAccountRequestType): Promise<CreditAccountResponseType> => {
    try {
        const response = await httpClient.put<CreditAccountResponseType>(
            `/api/v1/recharge/${enterpriseId}/creditercompte`,
            data
        );
        console.log(response);
        return response;
    } catch (error) {
        return Promise.reject(refractHttpError(error));
    }
};