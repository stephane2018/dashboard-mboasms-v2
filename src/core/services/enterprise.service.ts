import { httpClient } from '@/core/lib/http-client';
import type { EnterpriseType } from '@/core/models/enterprise';
import { refractHttpError } from '@/core/utils/http-error';

export const getEnterprises = async (): Promise<EnterpriseType[]> => {
    try {
        const response = await httpClient.get<EnterpriseType[]>('/api/v1/enterprise/all');
        return Array.isArray(response) ? response : [];
    } catch (error) {
        return Promise.reject(refractHttpError(error));
    }
};
