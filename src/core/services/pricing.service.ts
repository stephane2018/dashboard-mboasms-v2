import { httpClient } from '@/core/lib/http-client';
import { refractHttpError } from '@/core/utils/http-error';
import {
    PricingPlanResponseType,
    PricingPlanType,
} from '@/types/pricing';

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