import { httpClient } from '@/core/lib/http-client';
import { refractHttpError } from '@/core/utils/http-error';
import {
    PricingPlanResponseType,
    PricingPlanType,
} from '@/core/models/pricing';

export type CreatePricingPlanRequest = Omit<PricingPlanType, 'id' | 'createdAt' | 'updatedAt' | 'statusCode' | 'error' | 'message'>;

export const getAllPlans = async (): Promise<PricingPlanResponseType> => {
    try {
        const response = await httpClient.get<PricingPlanResponseType>('/api/v1/PricingPlan');
        console.log(response);
        return response;
    } catch (error) {
        return Promise.reject(refractHttpError(error));
    }
};

export const getActivePlans = async (): Promise<PricingPlanResponseType> => {
    try {
        const response = await httpClient.get<PricingPlanResponseType>('/api/v1/PricingPlan/actives');
        console.log(response);
        return response;
    } catch (error) {
        return Promise.reject(refractHttpError(error));
    }
};

export const getPlanById = async (id: string): Promise<PricingPlanType> => {
    try {
        const response = await httpClient.get<PricingPlanType>(`/api/v1/PricingPlan/${id}`);
        console.log(response);
        return response;
    } catch (error) {
        return Promise.reject(refractHttpError(error));
    }
};

export const createPlan = async (data: CreatePricingPlanRequest): Promise<PricingPlanType> => {
    try {
        const response = await httpClient.post<PricingPlanType>('/api/v1/PricingPlan', data);
        console.log(response);
        return response;
    } catch (error) {
        return Promise.reject(refractHttpError(error));
    }
};

export const updatePlan = async (id: string, data: Partial<CreatePricingPlanRequest>): Promise<PricingPlanType> => {
    try {
        const response = await httpClient.put<PricingPlanType>(`/api/v1/PricingPlan/${id}`, data);
        console.log(response);
        return response;
    } catch (error) {
        return Promise.reject(refractHttpError(error));
    }
};

export const deletePlan = async (id: string): Promise<void> => {
    try {
        await httpClient.delete(`/api/v1/PricingPlan/${id}`);
    } catch (error) {
        return Promise.reject(refractHttpError(error));
    }
};

export const enablePlan = async (id: string): Promise<PricingPlanType> => {
    try {
        const response = await httpClient.put<PricingPlanType>(`/api/v1/PricingPlan/${id}/enable`);
        console.log(response);
        return response;
    } catch (error) {
        return Promise.reject(refractHttpError(error));
    }
};

export const disablePlan = async (id: string): Promise<PricingPlanType> => {
    try {
        const response = await httpClient.put<PricingPlanType>(`/api/v1/PricingPlan/${id}/disable`);
        console.log(response);
        return response;
    } catch (error) {
        return Promise.reject(refractHttpError(error));
    }
};