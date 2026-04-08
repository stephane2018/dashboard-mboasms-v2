import { httpClient } from '@/core/lib/http-client';
import type { EnterpriseType } from '@/core/models/enterprise';
import { refractHttpError } from '@/core/utils/http-error';
import { extractContent } from '@/core/utils/extract-content';

export const getEnterprises = async (): Promise<EnterpriseType[]> => {
    try {
        const response = await httpClient.get('/api/v1/enterprise/all');
        return extractContent<EnterpriseType>(response);
    } catch (error) {
        return Promise.reject(refractHttpError(error));
    }
};
