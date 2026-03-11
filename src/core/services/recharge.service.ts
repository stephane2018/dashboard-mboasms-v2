import { httpClient } from '@/core/lib/http-client';
import { refractHttpError } from '@/core/utils/http-error';
import {
    CreateRechargeRequestType,
    CreateRechargeTypeResponse,
    CreditAccountRequestType,
    CreditAccountResponseType,
    RechargeListContentType,
    UpdateRechargeRequestType,
} from '@/core/models/recharges';

export const createRecharge = async (data: CreateRechargeRequestType): Promise<CreateRechargeTypeResponse> => {
    try {
        const response = await httpClient.post<CreateRechargeTypeResponse>('/api/v1/recharge/create-request', data);
        return response;
    } catch (error) {
        return Promise.reject(refractHttpError(error));
    }
};

export const getRechargesByEnterprise = async (enterpriseId: string, page: number, size: number): Promise<RechargeListContentType[]> => {
    try {
        const queryParams = new URLSearchParams()
        queryParams.append("enterpriseId", enterpriseId)
        queryParams.append("page", page.toString())
        queryParams.append("size", size.toString())

        const response = await httpClient.get<RechargeListContentType[]>(`/api/v1/recharge/enterprise?${queryParams.toString()}`);
        console.log(response)
        return response;
    } catch (error) {
        return Promise.reject(refractHttpError(error));
    }
};

export const getRecharges = async (enterpriseId: string): Promise<RechargeListContentType[]> => {
    try {
        const response = await httpClient.get<RechargeListContentType[]>(`/api/v1/recharge/${enterpriseId}/all`);
        return response;
    } catch (error) {
        return Promise.reject(refractHttpError(error));
    }
};

export const getAllRecharges = async (): Promise<RechargeListContentType[]> => {
    try {
        const response = await httpClient.get<RechargeListContentType[]>(`/api/v1/recharge/all`);
        return response;
    } catch (error) {
        return Promise.reject(refractHttpError(error));
    }
};

export const getRecharge = async (id: string): Promise<RechargeListContentType> => {
    try {
        const response = await httpClient.get<RechargeListContentType>(`/api/v1/recharge/${id}`);
        return response;
    } catch (error) {
        return Promise.reject(refractHttpError(error));
    }
};

export const updateRecharge = async (rechargeId: string, data: UpdateRechargeRequestType): Promise<RechargeListContentType> => {
    try {
        const response = await httpClient.put<RechargeListContentType>(`/api/v1/recharge/${rechargeId}/update`, data);
        return response;
    } catch (error) {
        return Promise.reject(refractHttpError(error));
    }
};

export const validateRecharge = async (rechargeId: string): Promise<RechargeListContentType> => {
    try {
        const response = await httpClient.put<RechargeListContentType>(`/api/v1/recharge/${rechargeId}/validate`, {});
        return response;
    } catch (error) {
        return Promise.reject(refractHttpError(error));
    }
};

export const refuseRecharge = async (rechargeId: string): Promise<RechargeListContentType> => {
    try {
        const response = await httpClient.put<RechargeListContentType>(`/api/v1/recharge/${rechargeId}/refused`, {});
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
        return response;
    } catch (error) {
        return Promise.reject(refractHttpError(error));
    }
};