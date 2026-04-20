import { httpClient } from '@/core/lib/http-client';
import { refractHttpError } from '@/core/utils/http-error';
import { extractContent } from '@/core/utils/extract-content';
import {
    CreateRechargeRequestType,
    CreateRechargeTypeResponse,
    CreditAccountRequestType,
    CreditAccountResponseType,
    RechargeListContentType,
    UpdateRechargeRequestType,
    PaginatedRechargeResponse,
} from '@/core/models/recharges';

export const createRecharge = async (data: CreateRechargeRequestType): Promise<CreateRechargeTypeResponse> => {
    try {
        const response = await httpClient.post<CreateRechargeTypeResponse>('/api/v1/recharge/create-request', data);
        return response;
    } catch (error) {
        return Promise.reject(refractHttpError(error));
    }
};

export const getRechargesByEnterprise = async (enterpriseId: string, page: number, size: number): Promise<PaginatedRechargeResponse> => {
    try {
        const queryParams = new URLSearchParams()
        queryParams.append("enterpriseId", enterpriseId)
        queryParams.append("page", page.toString())
        queryParams.append("size", size.toString())

        const response = await httpClient.get(`/api/v1/recharge/enterprise?${queryParams.toString()}`);

        if (Array.isArray(response)) {
            return {
                content: response,
                totalElements: response.length,
                totalPages: 1,
                currentPage: page,
                pageSize: size,
            };
        }

        if (response && typeof response === "object" && "content" in response) {
            const paginated = response as any;
            return {
                content: Array.isArray(paginated.content) ? paginated.content : [],
                totalElements: paginated.totalElements || 0,
                totalPages: paginated.totalPages || 1,
                currentPage: page,
                pageSize: size,
            };
        }

        return {
            content: [],
            totalElements: 0,
            totalPages: 0,
            currentPage: page,
            pageSize: size,
        };
    } catch (error) {
        return Promise.reject(refractHttpError(error));
    }
};

export const getAllRecharges = async (page = 0, size = 500): Promise<PaginatedRechargeResponse> => {
    try {
        const queryParams = new URLSearchParams()
        queryParams.append("page", page.toString())
        queryParams.append("size", size.toString())

        const response = await httpClient.get(`/api/v1/recharge/all/paginate?${queryParams.toString()}`);

        if (Array.isArray(response)) {
            return {
                content: response,
                totalElements: response.length,
                totalPages: 1,
                currentPage: page,
                pageSize: size,
            };
        }

        if (response && typeof response === "object" && "content" in response) {
            const paginated = response as any;
            return {
                content: Array.isArray(paginated.content) ? paginated.content : [],
                totalElements: paginated.totalElements || 0,
                totalPages: paginated.totalPages || 1,
                currentPage: page,
                pageSize: size,
            };
        }

        return {
            content: [],
            totalElements: 0,
            totalPages: 0,
            currentPage: page,
            pageSize: size,
        };
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